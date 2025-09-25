const googleSearchMatch =
  /^https:\/\/www\.google\.com\.?[a-z]{0,6}\/search\?q=.+/i;

chrome.history.onVisited.addListener(historyItem => {
  if (historyItem.url && googleSearchMatch.test(historyItem.url)) {
    console.log(`❌delete: ${historyItem.url}`);
    setTimeout(() => {
      chrome.history.deleteUrl({ url: historyItem.url });
    }, 1000);
  }
});

chrome.runtime.onStartup.addListener(() => {
  deleteGoogleHistory();
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("info.html") });
  deleteGoogleHistory();
});

async function deleteGoogleHistory() {
  const historyItems = await chrome.history.search({
    text: "https://www.google.com",
    maxResults: 500,
  });
  if (typeof historyItems?.forEach === "function") {
    historyItems.forEach(item => {
      if (item.url && googleSearchMatch.test(item.url)) {
        chrome.history.deleteUrl({ url: item.url });
      }
    });
  }
}

console.log("Service worker started");
