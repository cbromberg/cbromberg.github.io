ALL.getHostJs(function (AP) {

    AP.sizeToParent();

    var pageId = URI.getQueryParam('pageId');

    AP.request({url: '/rest/api/content/' + pageId + '.json?expand=body.view', success: function (responseText) {
        var responseObj = JSON.parse(responseText);
        console.log(responseObj.body.view.value);

        var page = parsePage(responseObj)
        addSlides(page.sections);

        $('#prezz-temp .columnLayout').each(function(idx) {
            addSlide($(this).html())
        });
    }});

    var parsePage = function(responseObj) {
        return {
            id: responseObj.id,
            title: responseObj.title,
            sections: $('<div id="prezz-temp" />').html(responseObj.body.view.value).find('.contentLayout2 .columnLayout')
        };
    };

    var addSlides = function(sections) {
        sections.each(function() {
            $('.slides').append('<section>' + $(this).html() + '</section>');
        });
    };


    // Full list of configuration options available here:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,
        embedded: true,

        theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
        transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

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

});