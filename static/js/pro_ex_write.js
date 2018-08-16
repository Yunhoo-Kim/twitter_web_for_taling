// ?$("#profile-register")
var numRegex = /^[0-9]*$/;
var temp_data = {};
var content = null;

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
        // .then(function(){
        //     saveUserInfo()
        // })
}
function saveUserInfo(){
    return getTempData()
        .then(response => {
            var basic_info = makeBasicData();
            if(basic_info){
                axios.post(api_url + "/pro/temp/basic/", {
                    basic_info : basic_info
                } ,{
                    headers: _getAuthHeader()
                })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        })
        .then(r => {
            window.location.href = "/pro/register/3/";
        });
}
var boldButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<img src="/static/image/bold.png"> ',
        click: function () {
            // invoke insertText method with 'hello' on editor module.
            context.invoke('editor.bold');
        }
    });

    return button.render();   // return button as jquery object
}
var italicButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<img src="/static/image/italic.png"> ',
        click: function () {
            // invoke insertText method with 'hello' on editor module.
            context.invoke('editor.italic');
        }
    });

    return button.render();   // return button as jquery object
}
var underButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<img src="/static/image/underline.png"> ',
        click: function () {
            // invoke insertText method with 'hello' on editor module.
            context.invoke('editor.underline');
        }
    });

    return button.render();   // return button as jquery object
}

var leftButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<img src="/static/image/leftalign.png"> ',
        click: function () {
            // invoke insertText method with 'hello' on editor module.
            context.invoke('editor.justifyLeft');
        }
    });

    return button.render();   // return button as jquery object
}
var centerButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<img src="/static/image/centeralign.png"> ',
        click: function () {
            // invoke insertText method with 'hello' on editor module.
            context.invoke('editor.justifyCenter');
        }
    });

    return button.render();   // return button as jquery object
}
var imageButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<img src="/static/image/image.png"> ',
        click: function () {
            $("#post-image").trigger("click");
        }
    });

    return button.render();   // return button as jquery object
}
function getBasicData(){
    getTempData()
        .then(response => {
            var basic_info = response.data.result.basic_info;
            var exmination_content = response.data.result.content;
            var category = basic_info.category;
            var pro_img = basic_info.pro_img;
            var days = basic_info.days ? basic_info.days : [];

            if(category){
                $("#category").text(category);
            }
            if(pro_img){
                $("#pro-img").css("background-image", "url(" + pro_img + ")");
                $("#pro-img").css("background-size", "cover");
                $("#pro-img").attr("pro_image",  pro_img);
            }
            if(days.length > 0){
                $(".day-btn").each(function() {
                    var day = $(this).attr("day");
                    if($.inArray(day, days) > -1)
                        $(this).addClass("day-active")
                });
            }
            $("#summernote").summernote({
                tabsize: 4,
                lineHeight: 0.5,
                height: 600,
                lang: 'ko-KR',
                toolbar: [
                    ["alignbtn", ['left', 'center']],
                    ["stylebtn", ['cbold', 'citalic', 'cunder']],
                    ["imgbtn", ['img']],
                ],
                disableResizeEditor: true,
                buttons: {
                    left: leftButton,
                    center: centerButton,
                    cbold: boldButton,
                    citalic: italicButton,
                    cunder: underButton,
                    img: imageButton
                },
                callbacks: {
                    onChange: function(contents, $editable) {
                        var _t = $("#summernote").summernote("code");
                        _t = $(_t).text();
                        var c_len = _t.length;
                        var r_len = 3000 - c_len;

                        if(c_len > 3000)
                            r_len = 0;

                        $("#remain-len").text(r_len);

                        if(r_len > 0) {
                            $("#remain-len").parent().removeClass("d-none");
                        }else{
                            $("#remain-len").parent().addClass("d-none");
                        }
                    },
                    onPaste: function(e){
                        if (document.queryCommandSupported("insertText")) {
                            var text = $(e.currentTarget).html();
                            var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                            bufferText = bufferText.replace(/\r?\n\r?\n/g, '\r\n');

                            setTimeout(function () {
                                document.execCommand('insertText', false, bufferText);
                            }, 10);
                            e.preventDefault();
                        } else { //IE
                            var text = window.clipboardData.getData("text")
                            if (trap) {
                                trap = false;
                            } else {
                                trap = true;
                                setTimeout(function () {
                                    document.execCommand('paste', false, text);
                                }, 10);
                                e.preventDefault();
                            }
                        }
                    },
                    onImageUpload: function(files, editor, welEditable){
                        console.log("drag and drop excuted");
                        console.log(files[0]["type"]);
                        uploadPostImage(files[0]);
                    }
                }
            });

            $('.note-statusbar').hide();
            if(content_id.trim().length > 0){
                for(var i in exmination_content) {
                    if($.isEmptyObject(exmination_content[i]))
                        continue

                    if(exmination_content[i].id == content_id) {
                        console.log(exmination_content[i].content);
                        $("#summernote").summernote("code", exmination_content[i].content);
                        $("#title").val(exmination_content[i].title);
                        break;
                    }
                }

            }
            return response;
        });
}

getBasicData();

$("#save-writing").click(function() {
    var title = $("#title").val();
    var content = $("#summernote").summernote("code");

    if(!title.trim()){
        $.snackbar({content: "제목을 입력해주세요."});
        $("#title").select();
        return;
    }
    if($("#summernote").summernote("isEmpty")){
        $.snackbar({content: "본문을 입력해주세요."});
        return;
    }
    var data = {
        title: title,
        content: content,
        raw_content: $(content).text()
    };
    if(content_id.trim().length > 0){
        data["id"] = content_id;
    }
    else{
        data["id"] = parseInt(new Date()/ 1);
    }
    getTempData()
        .then(res => {
            var content = res.data.result.content;
            if($.isArray(content)){
                for(var i in content){
                    if($.isEmptyObject(content[i]))
                        content.splice(i, 1);

                    if(content[i].id == content_id)
                        content.splice(i, 1);
                }
                content.push(data);
            }else{
                content = [data];
            }
            return content;
        })
        .then(content => {
            axios.post(api_url + "/pro/temp/", {
                content: content
            }, {
                headers: _getAuthHeader()
            })
                .then(res => {
                    var code = res.data.result.code;
                    if(code != 0){
                        $.snackbar({content: "오류가 발생했습니다. 잠시후 시도해주세요."});
                    }else{
                        // goto register 3 page
                        window.location.href = "/pro/register/3/";
                    }
                })
        });
});

function uploadPostImage(img){
    var fileType = img["type"];
    var validImgType = ["image/gif","image/jpeg","image/png"];
    if($.inArray(fileType, validImgType) < 0){
        $.snackbar({content: "이미지 파일을 선택해주세요."});
        return;
    }

    runLoader("잠시만 기다려주세요.");
    var data = new FormData(document.forms[0]);

    data.append("file", img);
    axios.post("https://a4wg3kwuh7.execute-api.us-west-2.amazonaws.com/api/post", data, {
        headers: { 'content-type': 'multipart/form-data' }
    })
        .then(response => {
            var url = response.data.result.url;
            console.log(url);
            $("#summernote").summernote('insertImage', url);
        })
        .catch(err => {
            console.log(err);
        })
        .then(function() {
            stopLoader();
        });
}


$("#post-image").change(function(){
    var file = $(this)[0].files[0];
    try{
        var fileType = file["type"];
    }
    catch(err){
        return;
    }

    var validImgType = ["image/gif","image/jpeg","image/png"];
    if($.inArray(fileType, validImgType) > 0){
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(e.target.result);
            var blob = dataURItoBlob(e.target.result);
            uploadPostImage(blob);
        }
        reader.readAsDataURL(file);
    }else{
        $.snackbar({content: "이미지 파일을 선택해주세요."});
    }
});

