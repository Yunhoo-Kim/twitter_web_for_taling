var numRegex = /^[0-9]*$/;

function getTempData(){
    return axios.get(api_url + "/pro/temp/",
        {
            headers: _getAuthHeader()
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log(error);
        });
}
function getContent(){
    getTempData()
        .then(response => {
            var basic_info = response.data.result.basic_info;
            var exmination_content = response.data.result.content;
            for(var i in exmination_content){
                var c = exmination_content[i];
                if(c.id == content_id){
                    $("#c-title").text(c.title);
                    $("#c-content").html(c.content);
                }
            }

            return response;
        })
}

getContent();
