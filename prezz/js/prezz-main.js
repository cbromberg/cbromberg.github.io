ALL.getHostJs(function (AP) {

    var pageId = URI.getQueryParam('pageId');

    var parsePage = function (responseObj) {
        var defaultPrezzOptions = { theme: 'default'};
        defaultPrezzOptions.theme = $($(responseObj.body.storage.value).find('ac\\:structured-macro[ac\\:name="prezz-options-macro"]>ac\\:parameter[ac\\:name="theme"]')[0]).text() || 'k15t';
        defaultPrezzOptions.theme = defaultPrezzOptions.theme.toLowerCase();
        defaultPrezzOptions.transition = $($(responseObj.body.storage.value).find('ac\\:structured-macro[ac\\:name="prezz-options-macro"]>ac\\:parameter[ac\\:name="transition"]')[0]).text() || 'page';
        defaultPrezzOptions.transition = defaultPrezzOptions.transition.toLowerCase();
        return {
            id: responseObj.id,
            title: responseObj.title,
            sections: $('<div id="prezz-temp" />').html(responseObj.body.view.value).find('.contentLayout2 .columnLayout'),
            prezzOptions: defaultPrezzOptions
        };
    };


    var addSlides = function (sections, prezzOptions) {
        if (prezzOptions.theme != 'k15t') {
            $($('.slides')).html('');
        }
        sections.each(function () {
            sanatizeContent($(this).find('.innerCell'));

            $('.slides').append('<section>' + $(this).find('.innerCell').html() + '</section>');
        });
    };


    var sanatizeContent = function (rawSlideContent) {
        $.each(SANATIZERS, function(idx, val) {
            val(rawSlideContent);
        });
    };

    var setBacklink = function(pageId) {
        $('a.prezz-backlink a').attr('href', ALL.hostBaseUrl + "/pages/viewpage.action?pageId=" + pageId);
    };

    AP.request({url: '/rest/api/content/' + pageId + '.json?expand=body.view,body.storage', success: function (responseText) {
        var responseObj = JSON.parse(responseText);
        var page = parsePage(responseObj);
        addSlides(page.sections, page.prezzOptions);

        $('#prezz-temp .columnLayout').each(function (idx) {
            addSlide($(this).html())
        });

        setBacklink(page.id);

        AP.sizeToParent();

        // Full list of configuration options available here:
        // https://github.com/hakimel/reveal.js#configuration
        Reveal.initialize({
            controls: false,
            progress: true,
            history: true,
            center: true,
            embedded: true,

            theme: page.prezzOptions.theme, // available themes are in /css/theme
            transition: page.prezzOptions.transition || 'page', // default/cube/page/concave/zoom/linear/fade/none

            // Parallax scrolling
            // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
            // parallaxBackgroundSize: '2100px 900px',

            // Optional libraries used to extend on reveal.js
            dependencies: [
                { src: 'lib/js/classList.js', condition: function () {
                    return !document.body.classList;
                } },
                { src: 'plugin/markdown/marked.js', condition: function () {
                    return !!document.querySelector('[data-markdown]');
                } },
                { src: 'plugin/markdown/markdown.js', condition: function () {
                    return !!document.querySelector('[data-markdown]');
                } },
                { src: 'plugin/highlight/highlight.js', async: true, callback: function () {
                    hljs.initHighlightingOnLoad();
                } },
                { src: 'plugin/zoom-js/zoom.js', async: true, condition: function () {
                    return !!document.body.classList;
                } },
                { src: 'plugin/notes/notes.js', async: true, condition: function () {
                    return !!document.body.classList;
                } }
            ]
        });

    }});

    var SANATIZERS = [
        function table(rawSlideContent) {
            rawSlideContent.find('div.table-wrap').each(function() {
                // move header
                var tableWrapEl = $(this);
                var tableEl = tableWrapEl.find('table.confluenceTable');
                var trEl = tableEl.find('tbody tr th').parent();
                tableEl.prepend('<thead/>');
                var theadEl = tableEl.find('thead');
                trEl.appendTo(theadEl);
                // remove div wrapper
                tableWrapEl.replaceWith(tableEl.detach());
            });
        },
        function listItems(rawSlideContent) {
            rawSlideContent.find('li').each(function() {
                // move header
                var liEl = $(this);
                liEl.addClass('fragment');
            });
        },
        function fixConfluenceImageSrc(rawSlideContent) {
            rawSlideContent.find('img.confluence-embedded-image').each(function() {
                $(this).attr('src', ALL.hostUrl + $(this).attr('src'))
            })
        },
        function codeExample(rawSlideContent) {
            rawSlideContent.find('div.code.panel.pdl').each(function() {
                var codePanelEl = $(this);
                var codeExampleString = codePanelEl.find('script[type="syntaxhighlighter"]').text().replace('<![CDATA[', '').replace(']]>', '');
                codePanelEl.replaceWith('<pre><code data-trim>' + codeExampleString + '</code></pre>');
            });
        }
    ]

});