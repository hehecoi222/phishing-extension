// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const ort = require('onnxruntime-web');

var currentURL;

chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
        getCurrentURL(tabs[0].url);
    });

async function getPredict(url) {
    const response = await fetch("http://192.168.249.80:8000/predict?url=" + url);
    const jsonData = await response.json();
    return jsonData;
}

function getDomainNoHttp(url) {
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');

    return url;
}

function getCurrentURL(tab) {
    currentURL = getDomainNoHttp(tab);
    document.getElementById('result').innerHTML = 'Checking...';
    document.getElementById('description').innerHTML = 'Checking ' + currentURL + '...';
    main(currentURL).then((data) => {
        if (data) {
            document.getElementById('result').innerHTML = data;
            document.getElementById('description').innerHTML = 'The result is ' + data + '!';
        } else {
            message = getPredict(currentURL).then((data) => {
                if (data) {
                    document.getElementById('result').innerHTML = data.message;
                    if (data.message == "Phishing") {
                        document.getElementById('description').innerHTML = 'The result ' + currentURL + ' is ' + data.message + '! Be careful on this website!';
                    } else {
                        document.getElementById('description').innerHTML = 'The result is ' + data.message + '!';
                    }
                } else {
                    document.getElementById('result').innerHTML = 'Not Found';
                    document.getElementById('description').innerHTML = 'The result is Not Found! Try again later';
                }
            }).catch((error) => {
                document.getElementById('result').innerHTML = 'Not Found';
                document.getElementById('description').innerHTML = 'The result is Not Found!, Try again later';
                console.log(error);
            });
        }
    }
    );
}


// use an async context to call onnxruntime functions.
async function main(url) {
    try {
        throw Skip;
        // create a new session and load the specific model.
        //
        // the model in this example contains a single MatMul node
        // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
        // it has 1 output: 'c'(float32, 3x3)
        const dataA = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const session = await ort.InferenceSession.create('./model.onnx');

        const tensorA = new ort.Tensor('string', [url, url, url, url, url, url, url, url, url, url, url, url], [3, 4]);
        const tensorB = new ort.Tensor('string', ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'], [4, 3]);

        // prepare feeds. use model input names as keys.
        const feeds = { a: tensorA, b: tensorB };

        // feed inputs and run
        const results = await session.run(feeds);

        // read from results
        const dataC = results.c.data;
        return dataC;

    } catch (e) {
        console.log(e);
    }
}