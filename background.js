console.log("YouTube Focuser says hello!");
// To sign: web-ext sign --api-key USERNAME --api-secret APIKEY
// https://addons.mozilla.org/en-US/developers/addon/api/key/
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // read changeInfo data and do something with it
      // like send the new url to contentscripts.js
      if (changeInfo.url) {
        chrome.tabs.sendMessage( tabId, {
          message: 'resetUrl',
          url: changeInfo.url
        })
      }
    }
  );