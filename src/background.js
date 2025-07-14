// Background script for Call Tracker extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Call Tracker extension installed');
});

// Listen for messages from content script if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveCall') {
    // Handle call saving if needed
    console.log('Call data received:', request.data);
  }
});

// Optional: Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This won't fire if popup is set, but kept for future use
  console.log('Extension icon clicked');
});