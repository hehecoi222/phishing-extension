let currentURL = "";
async function getPredict(url) {
    const response = await fetch("http://35.208.189.92:8000/predict?url=" + url);
    const jsonData = await response.json();
    return jsonData;
}

function getDomainNoHttp(url) {
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');

    return url;
}
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
                    getPredict(getDomainNoHttp(currentURL)).then((data) => {
                        if (data.message == "Phishing") {
                            alert("This website may be a phishing website! Be careful!");
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                } else if (!currentURL) {
                    currentURL = tab;
                    getPredict(getDomainNoHttp(currentURL)).then((data) => {
                        if (data.message == "Phishing") {
                            alert("This website may be a phishing website! Be careful!");
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        }, 3000); // 3000 = delay in milliseconds (3 seconds)
    }
})