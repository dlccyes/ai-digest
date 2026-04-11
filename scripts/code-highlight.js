import { bundledLanguages, createHighlighter } from 'https://esm.sh/shiki@4.0.2'

const BLOCK_SELECTOR = 'pre.code-block-source'
const LIGHT_THEME = 'light-plus'
const DARK_THEME = 'monokai'

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
      if (!code) {
        return null
      }

      const lang = normalizeLang(pre.dataset.lang || code.dataset.lang || '')
      if (!lang) {
        return null
      }

      return {
        pre,
        code,
        lang,
        source: code.textContent || '',
      }
    })
    .filter(Boolean)
}

async function highlightBlocks() {
  const blocks = readBlocks()
  if (!blocks.length) {
    return
  }

  const langs = [...new Set(blocks.map((block) => block.lang))]
  const highlighter = await createHighlighter({
    themes: [LIGHT_THEME, DARK_THEME],
    langs,
  })

  try {
    for (const block of blocks) {
      const html = highlighter.codeToHtml(block.source, {
        lang: block.lang,
        themes: {
          light: LIGHT_THEME,
          dark: DARK_THEME,
        },
        defaultColor: false,
      })

      const doc = new DOMParser().parseFromString(html, 'text/html')
      const shikiPre = doc.body.firstElementChild
      if (!shikiPre) {
        continue
      }

      shikiPre.setAttribute('tabindex', block.pre.getAttribute('tabindex') || '0')
      shikiPre.dataset.lang = block.lang

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
  } finally {
    highlighter.dispose()
  }
}

highlightBlocks().catch((error) => {
  console.error('Shiki highlighting failed', error)
})
