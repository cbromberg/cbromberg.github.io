function includeAll(callback) {
// parse query parameters from web-panel iframe URL
    var hostname = getQueryParam('xdm_e');
    var contextPath = getQueryParam('cp');

// construct URL targeting host application
    var allUrl = hostname + contextPath + '/atlassian-connect/all.js';

// retrieve script asynchronously
    jQuery.getScript(allUrl, function () {
        // window.AP is now available
        // can now launch pop-ups, use REST APIs and interact with host UI
        callback(window.AP);
    });
}