(function() {
    if (window.ksRunnerInit) return;

    // This line gets patched up by the cloud
    var pxtConfig = {
    "relprefix": "/Coraffic/",
    "workerjs": "/Coraffic/worker.js",
    "tdworkerjs": "/Coraffic/tdworker.js",
    "monacoworkerjs": "/Coraffic/monacoworker.js",
    "pxtVersion": "2.3.29",
    "pxtRelId": "",
    "pxtCdnUrl": "/Coraffic/",
    "commitCdnUrl": "/Coraffic/",
    "blobCdnUrl": "/Coraffic/",
    "cdnUrl": "/Coraffic/",
    "targetVersion": "0.0.0",
    "targetRelId": "",
    "targetUrl": "",
    "targetId": "Beat The Traffic",
    "simUrl": "/Coraffic/simulator.html",
    "partsUrl": "/Coraffic/siminstructions.html",
    "runUrl": "/Coraffic/run.html",
    "docsUrl": "/Coraffic/docs.html",
    "isStatic": true
};

    var scripts = [
        "/Coraffic/highlight.js/highlight.pack.js",
        "/Coraffic/bluebird.min.js",
        "/Coraffic/typescript.js",
        "/Coraffic/semantic.js",
        "/Coraffic/marked/marked.min.js",
        "/Coraffic/lzma/lzma_worker-min.js",
        "/Coraffic/blockly/blockly_compressed.js",
        "/Coraffic/blockly/blocks_compressed.js",
        "/Coraffic/blockly/msg/js/en.js",
        "/Coraffic/pxtlib.js",
        "/Coraffic/pxtcompiler.js",
        "/Coraffic/pxtblocks.js",
        "/Coraffic/pxteditor.js",
        "/Coraffic/pxtsim.js",
        "/Coraffic/target.js",
        "/Coraffic/pxtrunner.js"
    ]

    if (typeof jQuery == "undefined")
        scripts.unshift("/Coraffic/jquery.js")

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
