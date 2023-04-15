var currentURL;

chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
        getCurrentURL(tabs[0].url);
    });

function getCurrentURL(tab) {
    currentURL = tab;
    document.getElementById('result').innerHTML = 'Checking...';
    document.getElementById('description').innerHTML = 'Checking ' + currentURL + '...';
}
