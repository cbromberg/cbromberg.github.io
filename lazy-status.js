// ==UserScript==
// @name         lazy_status
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Inserts links and summaries in a way that is easy to use for daily status updates.
// @author       Christoffer
// @match        https://jira.k15t.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=k15t.com
// @grant        none
// ==/UserScript==

(function($, AJS) {
    'use strict';

    //     function copy(event) {
        //         process(html).then(console.log)
        //     }

        //     async function process(html) {
        //         // https://chromestatus.com/feature/5357049665814528
        //         // unfortunately html copy is not supported yet
        //         const queryOpts = { name: 'clipboard-write', allowWithoutGesture: true };
        //         const permissionStatus = await navigator.permissions.query(queryOpts);
        //         var blob = new Blob([html], { type: "text/html" });
        //         return await navigator.clipboard.write([
        //             new ClipboardItem({
        //                 [blob.type]: blob
        //             })
        //         ]);
        //     }

    function output(selector, message) {
        $(selector).after(`<div id="lazy-status-out"><span>${message}&nbsp;</span></div>`)
    }

    function copy() {
        var w = $("#lazy-status-out")[0]
        var r = document.createRange()
        r.selectNodeContents(w);
        var sel=window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        document.execCommand('copy')
    }

    function remove() {
        $('#lazy-status-out').remove()
    }

    function flag(issueKey) {
        AJS.flag({
            type: 'success',
            body: `Copied issue data for ${issueKey}`,
            close: `auto`
        });
    }
    // on a particular issue
    if (window.location.host === "jira.k15t.com" && (window.location.pathname.indexOf("/browse/") == 0
        || window.location.pathname.indexOf("/projects/") == 0)) {
        let issueSummary = $('#summary-val').text()
        let issueKey = $('.aui-page-header-main .issue-link:not(#parent_issue_summary)').text()
        let issueLink = $('.aui-page-header-main .issue-link:not(#parent_issue_summary)').attr('href')
        output('.aui-page-header-main .issue-link:not(#parent_issue_summary)', `<a href="${issueLink}">${issueKey}</a><i>&nbsp;${issueSummary}</i>-`)
        copy()
        flag(issueKey)
        remove()
    }
    // boards
    if (window.location.host === "jira.k15t.com" && window.location.pathname.indexOf("/secure/RapidBoard.jspa") == 0) {
        let issueSummary = $('#ghx-detail-head #summary-val').text()
        let issueKey = $('#issuekey-val').text()
        let issueLink = $('#issuekey-val a').attr('href')
        output('#issuekey-val a', `<a href="${issueLink}">${issueKey}</a><i >&nbsp;${issueSummary}</i>-`)
        copy()
        flag(issueKey)
        remove()
    }
    // issue navigator
    if (window.location.host === "jira.k15t.com" && window.location.pathname.indexOf("/issues") == 0 && $('#issuetable').length > 0) {
        let issueSummary = $('#issuetable .issuerow.focused .summary .issue-link:not(.parentIssue)').text()
        let issueKey = $('#issuetable .issuerow.focused .issuekey a.issue-link').attr('data-issue-key')
        let issueLink = $('#issuetable .issuerow.focused .issuekey a.issue-link').attr('href')
        output('#issuetable .issuerow.focused .issuekey a.issue-link', `<a href="${issueLink}">${issueKey}</a><i >&nbsp;${issueSummary}</i>-`)
        copy()
        flag(issueKey)
        remove()
    }

})($, AJS); // on jira.k15t.com $ is available
