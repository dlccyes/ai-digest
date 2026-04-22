import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'

const BLOCK_SELECTOR = '.mermaid-block'
const SOURCE_SELECTOR = '.mermaid-source'
const RENDER_SELECTOR = '.mermaid-render'
const THEME_MEDIA = window.matchMedia('(prefers-color-scheme: dark)')

let currentRenderToken = 0
let rerenderTimer = null

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

function getMermaidTheme() {
  return getResolvedTheme() === 'dark' ? 'dark' : 'default'
}

function readBlocks() {
  return [...document.querySelectorAll(BLOCK_SELECTOR)]
    .map((block) => {
      const sourceElement = block.querySelector(SOURCE_SELECTOR)
      const renderElement = block.querySelector(RENDER_SELECTOR)
      const source = sourceElement?.textContent?.replace(/\s+$/, '')

      if (!sourceElement || !renderElement || !source) {
        return null
      }

      return {
        block,
        renderElement,
        source,
        sourceElement,
      }
    })
    .filter(Boolean)
}

function resetBlock(block) {
  block.block.classList.remove('is-error', 'is-rendered')
  block.renderElement.innerHTML = ''
  block.renderElement.hidden = true
  block.sourceElement.hidden = false
}

async function renderBlocks() {
  const blocks = readBlocks()
  if (!blocks.length) {
    return
  }

  const renderToken = ++currentRenderToken

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: getMermaidTheme(),
  })

  for (const [index, block] of blocks.entries()) {
    resetBlock(block)

    try {
      const { svg, bindFunctions } = await mermaid.render(`mermaid-diagram-${renderToken}-${index}`, block.source)
      if (renderToken !== currentRenderToken) {
        return
      }

      block.renderElement.innerHTML = svg
      bindFunctions?.(block.renderElement)
      block.renderElement.hidden = false
      block.sourceElement.hidden = true
      block.block.classList.add('is-rendered')
    } catch (error) {
      console.error('Mermaid rendering failed', error)
      block.block.classList.add('is-error')
    }
  }
}

function scheduleRender() {
  window.clearTimeout(rerenderTimer)
  rerenderTimer = window.setTimeout(() => {
    renderBlocks().catch((error) => {
      console.error('Mermaid rendering failed', error)
    })
  }, 0)
}

new MutationObserver((mutations) => {
  if (mutations.some((mutation) => mutation.attributeName === 'data-theme')) {
    scheduleRender()
  }
}).observe(document.body, {
  attributes: true,
  attributeFilter: ['data-theme'],
})

THEME_MEDIA.addEventListener('change', () => {
  if (document.body.getAttribute('data-theme') === 'auto') {
    scheduleRender()
  }
})

if (document.readyState === 'complete') {
  scheduleRender()
} else {
  window.addEventListener('load', scheduleRender, { once: true })
}
