//Listen to any updates to tab system, find the most recent tab or one that we are on, and check if Youtube is open
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      
      //send message to content script
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });
  