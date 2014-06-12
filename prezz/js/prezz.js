ALL.getHostJs(function(AP) {
    window.spaceKey = URI.getQueryParam("spaceKey");
AP.request({
    url: "/rest/api/space/" + spaceKey + ".json?expand=rootpages",
    success: function (response)
    {
        alert(JSON.stringify(response));
    }
})});