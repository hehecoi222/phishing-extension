let currentURL = "";
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && tab.active) {
        setTimeout(() => {
            chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
                function (tabs) {
                    getCurrentURL(tabs[0].url);
                });

            function getCurrentURL(tab) {
                function getRootUrl(url) {
                    return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
                }
                if ((currentURL) && getRootUrl(currentURL) != getRootUrl(tab)) {
                    currentURL = tab;
                    
                } else if (!currentURL) {
                    currentURL = tab;
                   
                }
            }
        }, 3000); // 3000 = delay in milliseconds (3 seconds)
    }
})