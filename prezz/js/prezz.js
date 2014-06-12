ALL.getHostJs(function(AP) {
AP.request({
    url: "/rest/api/space/" + spaceKey + ".json?expand=rootpages",
    success: function (response)
    {
        alert(JSON.stringify(response));
    }
})});