chrome.runtime.onMessage.addListener((message) => {
  const scheme = message.scheme
  const iconPrefix = scheme === 'dark' ? 'dark-icon' : 'light-icon'

  chrome.action.setIcon({
    path: {
      "16": `icons/${iconPrefix}16.png`,
      "32": `icons/${iconPrefix}32.png`,
      "48": `icons/${iconPrefix}24.png`,
      "128": `icons/${iconPrefix}128.png`
    }
  })
})
