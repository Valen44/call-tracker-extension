// src/content/themeDetector.ts
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
chrome.runtime.sendMessage({ scheme: isDark ? 'dark' : 'light' })

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  chrome.runtime.sendMessage({ scheme: e.matches ? 'dark' : 'light' })
})