// ?$("#profile-register")
var numRegex = /^[0-9]*$/;
var temp_data = {};

$(".day-btn").click(function() {
   if($(this).hasClass("day-active"))
      $(this).removeClass("day-active")
    else
       $(this).addClass("day-active")
});
$("#profile-register").click(function() {
    $("#profile-upload").val(null);
    $("#profile-upload").trigger("click");
});

$("#profile-upload").change(function(){
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
            $("#profile-register").css("background-image", "url("+e.target.result+")");
            $("#profile-register").css("background-size", "cover");
            $("#profile-register").text("");
            uploadProfileImage(blob);
        }
        reader.readAsDataURL(file);
    }else{

    }
});

function uploadProfileImage(img){
    runLoader("이미지 업로딩...");
    var data = new FormData(document.forms[0]);

    data.append("file", img);
    axios.post("https://a4wg3kwuh7.execute-api.us-west-2.amazonaws.com/api/upload", data, {
        headers: { 'content-type': 'multipart/form-data' }
    })
        .then(response => {
            var url = response.data.result.url;
            $("#profile-register").css("background-image", "url(" + url + ")");
            $("#profile-register").attr("pro_image",  url);
        })
        .catch(err => {
            console.log(err);
        })
        .then(function() {
            stopLoader();
        });
}

$("#basic-next").click(function() {
    var pro_image = $("#profile-register").attr("pro_image") ? $("#profile-register").attr("pro_image") : "";
    var identification_num = $("#identification-number").val();
    var account_num = $("#account-num").val();
    var intro = $("#pro-intro").val();
    var days = [];
    var category = $("#content-subj").val();

    $(".day-btn").each(function(){
        if($(this).hasClass("day-active"))
            days.push($(this).attr("day"))
    });

    if(pro_image.trim().length < 1){
        $.snackbar({content: "프로 이미지를 등록해주세요."})
        return
    }
    if(intro.trim().length < 1){
        $.snackbar({content: "소개를 입력해주세요."})
        $("#pro-intro").select();
        return;
    }
    if(category.trim().length < 1){
        $.snackbar({content: "컨텐츠 주제를 입력해주세요."})
        $("#content-subj").select();
        return;
    }
    if(days.length < 1){
        $.snackbar({content: "배포 주기를 선택해주세요."})
        return;
    }
    if(!numRegex.test(identification_num) || identification_num == ""){
        $("#identification-number").select();
        $.snackbar({content: "올바른 주민번호 또는 사업자 번호를 입력해주세요."})
        return;
    }
    if(!numRegex.test(account_num) || account_num == ""){
        $("#account-num").select();
        $.snackbar({content: "올바른 계좌번호를 입력해주세요."})
        return;
    }

    saveUserInfo()
});


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
            console.log(error.response);
        });
        // .then(function(){
        //     saveUserInfo()
        // })
}
function makeBasicData() {
    var pro_image = $("#profile-register").attr("pro_image");
    var intro = $("#pro-intro").val();
    var category = $("#content-subj").val();
    var days = [];
    var identification_num = $("#identification-number").val();
    var bank_std_code = $( "#bank-name option:selected" ).val();
    var bank_name = $( "#bank-name option:selected" ).text();
    var account_num = $( "#account-num" ).val();

    $(".day-btn").each(function(){
        if($(this).hasClass("day-active"))
            days.push($(this).attr("day"))
    });

    var basic_info = {
        pro_img : pro_image,
        intro : intro,
        days : days,
        id_num : identification_num,
        category : category,
        bank : {
            bank_name : bank_name,
            bank_std_code : bank_std_code,
            account_num : account_num
        }
    };
    return basic_info;
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
                        window.location.href = "/pro/register/3/";
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
}
function getBasicData(){
    getTempData()
        .then(response => {
            var basic_info = response.data.result.basic_info;
            var intro = basic_info.intro;
            var category = basic_info.category;
            var pro_img = basic_info.pro_img;
            var days = basic_info.days ? basic_info.days : [];
            var id_num = basic_info.id_num;
            var bank = basic_info.bank;

            if(intro){
                $("#pro-intro").val(intro);
            }
            if(category){
                $("#content-subj").val(category);
            }
            if(pro_img){
                $("#profile-register").text("");
                $("#profile-register").css("background-image", "url(" + pro_img + ")");
                $("#profile-register").css("background-size", "cover");
                $("#profile-register").attr("pro_image",  pro_img);
            }
            if(days.length > 0){
                $(".day-btn").each(function() {
                    var day = $(this).attr("day");
                    if($.inArray(day, days) > -1)
                        $(this).addClass("day-active")
                });
            }
            if(id_num){
                $("#identification-number").val(id_num);
            }
            if(bank){
                $("#bank-name").val(bank.bank_std_code).prop("selected", true);
                if(bank.account_num)
                    $("#account-num").val(bank.account_num);
            }
        })
}

getBasicData();
