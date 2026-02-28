// ICON THEME HANDLING
chrome.runtime.onMessage.addListener((message) => {
  if (message.scheme) {
    const scheme = message.scheme;
    const iconPrefix = scheme === "dark" ? "dark-icon" : "light-icon";

    chrome.action.setIcon({
      path: {
        "16": `icons/${iconPrefix}16.png`,
        "32": `icons/${iconPrefix}32.png`,
        "48": `icons/${iconPrefix}48.png`,
        "128": `icons/${iconPrefix}128.png`,
      },
    });
  }
});

// BADGE HANDLING
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SET_BADGE") {
    chrome.action.setBadgeBackgroundColor({ color: msg.color });
    chrome.action.setBadgeText({ text: msg.text });
  }
});

// INITIALIZE DEFAULT PORTALS

async function initializePortals() {
  const result = await chrome.storage.local.get("portalsConfig");

  // If already initialized, do nothing
  if (result) {
    return;
  }

  try {
    const res = await fetch(chrome.runtime.getURL("config/portals.json"));
    const json = await res.json();

    await chrome.storage.local.set({ portalsConfig: json });

    console.log("Portals initialized:", json);
  } catch (err) {
    console.error("Failed to initialize portals", err);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  initializePortals();
});

chrome.runtime.onStartup.addListener(() => {
  initializePortals();
});

// DYNAMIC CONTENT SCRIPT INJECTION
// Prevent multiple injections per tab
const injectedTabs = new Set<number>();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    injectedTabs.delete(tabId);
    return;
  }

  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  if (
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  const portalConfig = await chrome.storage.local.get("portalsConfig");

  const portals = portalConfig.portalsConfig?.map(
    (portal: any) => portal.portalConfig.portalLink
  );

  if (!Array.isArray(portals) || portals.length === 0) return;

  const shouldInject = portals.some((portal: string) =>
    tab.url?.startsWith(portal)
  );

  if (!shouldInject) return;

  if (injectedTabs.has(tabId)) return;

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["./assets/content.js"],
  });

  injectedTabs.add(tabId);
});


// Cleanup when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
