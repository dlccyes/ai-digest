import { bundledLanguages, createHighlighter } from 'https://esm.sh/shiki@4.0.2'

const BLOCK_SELECTOR = 'pre.code-block-source, pre.shiki[data-code-source]'
const COPY_BUTTON_SELECTOR = '.code-block-copy'
const LIGHT_THEME = 'light-plus'
const DARK_THEME = 'monokai'
const THEME_MEDIA = window.matchMedia('(prefers-color-scheme: dark)')
const PYTHON_LANGS = new Set(['python', 'py'])
const COPY_RESET_DELAY = 2000
const copyResetTimers = new WeakMap()

const PYTHON_PALETTES = {
  dark: {
    background: '#272822',
    plain: '#F8F8F2',
    decorator: '#A6E22E',
    keywordDef: '#66D9EF',
    keywordControl: '#F92672',
    functionName: '#A6E22E',
    parameter: '#FD971F',
    builtinFunction: '#66D9EF',
    builtinType: '#66D9EF',
    typeName: '#A6E22E',
    number: '#AE81FF',
    comment: '#75715E',
    operator: '#F92672',
  },
  light: {
    background: '#F6F8FA',
    plain: '#24292F',
    decorator: '#6F42C1',
    keywordDef: '#0550AE',
    keywordControl: '#AF00DB',
    functionName: '#8250DF',
    parameter: '#953800',
    builtinFunction: '#0550AE',
    builtinType: '#267F99',
    typeName: '#0A7D39',
    number: '#0550AE',
    comment: '#57606A',
    operator: '#CF222E',
  },
}

const PYTHON_KEYWORDS_DEF = new Set(['def', 'class'])
const PYTHON_KEYWORDS_CONTROL = new Set([
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'continue',
  'del',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield',
])
const PYTHON_BUILTIN_FUNCTIONS = new Set([
  'abs',
  'all',
  'any',
  'enumerate',
  'len',
  'max',
  'min',
  'print',
  'range',
  'reversed',
  'sorted',
  'sum',
  'zip',
])
const PYTHON_BUILTIN_TYPES = new Set([
  'bool',
  'bytes',
  'dict',
  'float',
  'frozenset',
  'int',
  'list',
  'set',
  'str',
  'tuple',
])
const PYTHON_TYPING_NAMES = new Set([
  'Any',
  'Callable',
  'DefaultDict',
  'Deque',
  'Dict',
  'FrozenSet',
  'Generator',
  'Iterable',
  'Iterator',
  'List',
  'Literal',
  'Mapping',
  'MutableMapping',
  'Optional',
  'Sequence',
  'Set',
  'Tuple',
  'Type',
  'TypeVar',
  'Union',
])
const PYTHON_COMPARISON_OPERATORS = ['<=', '>=', '==', '!=', '->', '//', '**', '<', '>', '=']

let highlighterPromise = null
let currentRenderToken = 0

function normalizeLang(rawLang) {
  const lang = (rawLang || '').trim().toLowerCase().replace(/^language-/, '')
  if (!lang) {
    return null
  }
  return bundledLanguages[lang] ? lang : null
}

function readBlocks() {
  return [...document.querySelectorAll(BLOCK_SELECTOR)]
    .map((pre) => {
      const code = pre.querySelector('code')
      const source = pre.dataset.codeSource || code?.textContent || ''
      const lang = normalizeLang(pre.dataset.codeLang || pre.dataset.lang || code?.dataset.lang || '')
      if (!source || !lang) {
        return null
      }

      return {
        pre,
        lang,
        source,
      }
    })
    .filter(Boolean)
}

function getResolvedTheme() {
  const domTheme = document.body.getAttribute('data-theme')
  if (domTheme === 'dark') {
    return 'dark'
  }
  if (domTheme === 'light') {
    return 'light'
  }
  return THEME_MEDIA.matches ? 'dark' : 'light'
}

function getCopyButtonLabel(button, attribute, fallback) {
  return button.getAttribute(attribute) || fallback
}

function resetCopyButton(button) {
  button.textContent = getCopyButtonLabel(button, 'data-copy-label', 'Copy')
  button.classList.remove('is-copied', 'is-copy-error')
}

function showCopyButtonState(button, label, className) {
  button.textContent = label
  button.classList.remove('is-copied', 'is-copy-error')
  if (className) {
    button.classList.add(className)
  }

  const existingTimer = copyResetTimers.get(button)
  if (existingTimer) {
    window.clearTimeout(existingTimer)
  }

  const resetTimer = window.setTimeout(() => {
    resetCopyButton(button)
    copyResetTimers.delete(button)
  }, COPY_RESET_DELAY)

  copyResetTimers.set(button, resetTimer)
}

function readCodeBlockSource(button) {
  const container = button.closest('.code-block')
  const pre = container?.querySelector('pre')
  const code = pre?.querySelector('code')
  return pre?.dataset.codeSource || code?.textContent || pre?.textContent || ''
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.setAttribute('aria-hidden', 'true')
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.opacity = '0'

  document.body.append(textArea)
  textArea.select()
  textArea.setSelectionRange(0, text.length)

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch (error) {
    console.error('Code copy fallback failed', error)
  }

  textArea.remove()
  return copied
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Clipboard API copy failed', error)
    }
  }

  return fallbackCopyText(text)
}

document.addEventListener('click', (event) => {
  const button = event.target.closest(COPY_BUTTON_SELECTOR)
  if (!button) {
    return
  }

  const source = readCodeBlockSource(button)
  if (!source) {
    return
  }

  void copyText(source).then((copied) => {
    if (copied) {
      showCopyButtonState(button, getCopyButtonLabel(button, 'data-copied-label', 'Copied'), 'is-copied')
      return
    }

    showCopyButtonState(button, 'Copy failed', 'is-copy-error')
  })
})

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function wrapToken(text, color, extraStyles = '') {
  const styles = [`color:${color}`]
  if (extraStyles) {
    styles.push(extraStyles)
  }
  return `<span style="${styles.join(';')}">${escapeHtml(text)}</span>`
}

function collectPythonParameters(source) {
  const parameterNames = new Set()
  const lines = source.split('\n')
  let collecting = false
  let signature = ''
  let balance = 0

  for (const line of lines) {
    const trimmed = line.trim()

    if (!collecting && trimmed.startsWith('def ')) {
      collecting = true
      signature = line
      balance = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length
    } else if (collecting) {
      signature += `\n${line}`
      balance += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length
    } else {
      continue
    }

    if (collecting && balance <= 0 && trimmed.endsWith(':')) {
      const signatureBody = signature
        .replace(/^[\s\S]*?\(/, '')
        .replace(/\)\s*(->[\s\S]*)?:\s*$/, '')

      for (const match of signatureBody.matchAll(/\b([A-Za-z_]\w*)\b(?=\s*(?::|,|=|$))/g)) {
        const name = match[1]
        if (name !== 'self' && name !== 'cls') {
          parameterNames.add(name)
        }
      }

      collecting = false
      signature = ''
      balance = 0
    }
  }

  return parameterNames
}

function renderPythonLine(line, palette, parameterNames) {
  let output = ''
  let index = 0
  let previousWord = ''

  while (index < line.length) {
    const rest = line.slice(index)

    if (rest.startsWith('#')) {
      output += wrapToken(rest, palette.comment)
      break
    }

    const whitespaceMatch = rest.match(/^\s+/)
    if (whitespaceMatch) {
      output += escapeHtml(whitespaceMatch[0])
      index += whitespaceMatch[0].length
      continue
    }

    const decoratorMatch = rest.match(/^@([A-Za-z_]\w*)/)
    if (decoratorMatch) {
      output += wrapToken(decoratorMatch[0], palette.decorator)
      index += decoratorMatch[0].length
      previousWord = decoratorMatch[1]
      continue
    }

    const stringMatch = rest.match(/^(?:[rubfRUBF]{0,2})(?:"([^"\\]|\\.)*"|'([^'\\]|\\.)*')/)
    if (stringMatch) {
      output += wrapToken(stringMatch[0], palette.typeName)
      index += stringMatch[0].length
      continue
    }

    const numberMatch = rest.match(/^\d+(?:\.\d+)?/)
    if (numberMatch) {
      output += wrapToken(numberMatch[0], palette.number)
      index += numberMatch[0].length
      continue
    }

    const comparisonOperator = PYTHON_COMPARISON_OPERATORS.find((operator) => rest.startsWith(operator))
    if (comparisonOperator) {
      const color = comparisonOperator === '->' ? palette.plain : palette.operator
      output += wrapToken(comparisonOperator, color)
      index += comparisonOperator.length
      continue
    }

    if ('()[]{}:,.'.includes(rest[0])) {
      output += wrapToken(rest[0], palette.plain)
      index += 1
      continue
    }

    const wordMatch = rest.match(/^[A-Za-z_]\w*/)
    if (wordMatch) {
      const word = wordMatch[0]
      let color = palette.plain
      let extraStyles = ''

      if (previousWord === 'def') {
        color = palette.functionName
      } else if (PYTHON_KEYWORDS_DEF.has(word)) {
        color = palette.keywordDef
        extraStyles = 'font-style:italic'
      } else if (PYTHON_KEYWORDS_CONTROL.has(word)) {
        color = palette.keywordControl
      } else if (PYTHON_BUILTIN_FUNCTIONS.has(word)) {
        color = palette.builtinFunction
      } else if (PYTHON_BUILTIN_TYPES.has(word)) {
        color = palette.builtinType
        extraStyles = 'font-style:italic'
      } else if (PYTHON_TYPING_NAMES.has(word)) {
        color = palette.typeName
      } else if (parameterNames.has(word)) {
        color = palette.parameter
      }

      output += wrapToken(word, color, extraStyles)
      index += word.length
      previousWord = word
      continue
    }

    output += wrapToken(rest[0], palette.plain)
    index += 1
  }

  return output
}

function renderPythonBlock(source, theme) {
  const palette = PYTHON_PALETTES[theme]
  const parameterNames = collectPythonParameters(source)
  const lines = source.split('\n')
  const renderedLines = lines.map((line) => `<span class="line">${renderPythonLine(line, palette, parameterNames)}</span>`)
  return `<pre class="shiki custom-python" style="background-color:${palette.background};color:${palette.plain}" tabindex="0"><code>${renderedLines.join('')}</code></pre>`
}

async function getHighlighter(langs) {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
      langs,
    })
  }
  return highlighterPromise
}

async function highlightBlocks() {
  const blocks = readBlocks()
  if (!blocks.length) {
    return
  }

  const renderToken = ++currentRenderToken
  const langs = [...new Set(blocks.map((block) => block.lang))]
  const highlighter = await getHighlighter(langs)
  if (renderToken !== currentRenderToken) {
    return
  }

  const theme = getResolvedTheme() === 'dark' ? DARK_THEME : LIGHT_THEME
  const themeMode = getResolvedTheme()

  for (const block of blocks) {
    const html = PYTHON_LANGS.has(block.lang)
      ? renderPythonBlock(block.source, themeMode)
      : highlighter.codeToHtml(block.source, {
          lang: block.lang,
          theme,
        })

    const doc = new DOMParser().parseFromString(html, 'text/html')
    const shikiPre = doc.body.firstElementChild
    if (!shikiPre) {
      continue
    }

    shikiPre.setAttribute('tabindex', block.pre.getAttribute('tabindex') || '0')
    shikiPre.dataset.lang = block.lang
    shikiPre.dataset.codeLang = block.lang
    shikiPre.dataset.codeSource = block.source

    for (const className of block.pre.classList) {
      if (className !== 'code-block-source') {
        shikiPre.classList.add(className)
      }
    }

    if (block.pre.id) {
      shikiPre.id = block.pre.id
    }

    block.pre.replaceWith(shikiPre)
  }
}

let rerenderTimer = null

function scheduleHighlight() {
  window.clearTimeout(rerenderTimer)
  rerenderTimer = window.setTimeout(() => {
    highlightBlocks().catch((error) => {
      console.error('Shiki highlighting failed', error)
    })
  }, 0)
}

new MutationObserver((mutations) => {
  if (mutations.some((mutation) => mutation.attributeName === 'data-theme')) {
    scheduleHighlight()
  }
}).observe(document.body, {
  attributes: true,
  attributeFilter: ['data-theme'],
})

THEME_MEDIA.addEventListener('change', () => {
  if (document.body.getAttribute('data-theme') === 'auto') {
    scheduleHighlight()
  }
})

scheduleHighlight()
