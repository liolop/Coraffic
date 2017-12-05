(function() {
    if (window.ksRunnerInit) return;

    // This line gets patched up by the cloud
    var pxtConfig = {
    "relprefix": "/MPS-Project-Q2/",
    "workerjs": "/MPS-Project-Q2/worker.js",
    "tdworkerjs": "/MPS-Project-Q2/tdworker.js",
    "monacoworkerjs": "/MPS-Project-Q2/monacoworker.js",
    "pxtVersion": "2.3.29",
    "pxtRelId": "",
    "pxtCdnUrl": "/MPS-Project-Q2/",
    "commitCdnUrl": "/MPS-Project-Q2/",
    "blobCdnUrl": "/MPS-Project-Q2/",
    "cdnUrl": "/MPS-Project-Q2/",
    "targetVersion": "0.0.0",
    "targetRelId": "",
    "targetUrl": "",
    "targetId": "Beat The Traffic",
    "simUrl": "/MPS-Project-Q2/simulator.html",
    "partsUrl": "/MPS-Project-Q2/siminstructions.html",
    "runUrl": "/MPS-Project-Q2/run.html",
    "docsUrl": "/MPS-Project-Q2/docs.html",
    "isStatic": true
};

    var scripts = [
        "/MPS-Project-Q2/highlight.js/highlight.pack.js",
        "/MPS-Project-Q2/bluebird.min.js",
        "/MPS-Project-Q2/typescript.js",
        "/MPS-Project-Q2/semantic.js",
        "/MPS-Project-Q2/marked/marked.min.js",
        "/MPS-Project-Q2/lzma/lzma_worker-min.js",
        "/MPS-Project-Q2/blockly/blockly_compressed.js",
        "/MPS-Project-Q2/blockly/blocks_compressed.js",
        "/MPS-Project-Q2/blockly/msg/js/en.js",
        "/MPS-Project-Q2/pxtlib.js",
        "/MPS-Project-Q2/pxtcompiler.js",
        "/MPS-Project-Q2/pxtblocks.js",
        "/MPS-Project-Q2/pxteditor.js",
        "/MPS-Project-Q2/pxtsim.js",
        "/MPS-Project-Q2/target.js",
        "/MPS-Project-Q2/pxtrunner.js"
    ]

    if (typeof jQuery == "undefined")
        scripts.unshift("/MPS-Project-Q2/jquery.js")

    var pxtCallbacks = []

    window.ksRunnerReady = function(f) {
        if (pxtCallbacks == null) f()
        else pxtCallbacks.push(f)
    }

    window.ksRunnerWhenLoaded = function() {
        pxt.docs.requireHighlightJs = function() { return hljs; }
        pxt.setupWebConfig(pxtConfig || window.pxtWebConfig)
        pxt.runner.initCallbacks = pxtCallbacks
        pxtCallbacks.push(function() {
            pxtCallbacks = null
        })
        pxt.runner.init();
    }

    scripts.forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
    })

} ())
