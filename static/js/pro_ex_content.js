// ?$("#profile-register")
var numRegex = /^[0-9]*$/;
var temp_data = {};

function getTempData(){
    return axios.get(api_url + "/pro/temp/",
        {
            headers: _getAuthHeader()
        })
        .then(response => {
            temp_data = response;
            return response;
        })
        .catch(error => {
            console.log(error);
        });
}

function getBasicData(){
    getTempData()
        .then(response => {
            var basic_info = response.data.result.basic_info;
            var exmination_content = response.data.result.content;
            var category = basic_info.category;
            var pro_img = basic_info.pro_img;
            var days = basic_info.days ? basic_info.days : [];
            var dates = [];

            if(category){
                $("#category").text(category);
            }
            if(pro_img){
                $("#pro-img").css("background-image", "url(" + pro_img + ")");
                $("#pro-img").css("background-size", "cover");
                $("#pro-img").attr("pro_image",  pro_img);
            }

            days.sort();
            for(var i in days){
                var today = new Date();
                var next_wd = new Date();
                today.setDate(today.getDate() + (((parseInt(days[i]) + 1) + 7) - today.getDay()));
                next_wd.setDate(next_wd.getDate() + (((parseInt(days[i]) + 1) + 14) - next_wd.getDay()));
                dates.push(today);
                dates.push(next_wd);
            }

            dates.sort(function(a, b){
                return a - b;
            });

            for(var i in dates){
               addDeployDate(dates[i]);
            }

            for(var i in exmination_content){
                var d = exmination_content[i];
                if($.isEmptyObject(d))
                    continue;

                var _obj = '<div onclick="location.href=\'/pro/register/view/'
                    + d.id
                    + '/\'" class="t-b col-12 text-center py-3 mt-2 ex-content">'
                    + '<span class="content-subj font-weight-bold">'
                    + d.title
                    + '</span>'
                    + '<a href="/pro/register/write/'
                    + d.id
                    + '/" class="float-right revise-btn"'
                    +'">수정</a>'
                    + '</div>';
                if(d.raw_content.trim().length > 3000) {
                    var _obj_select = '<option value="'
                        + d.id
                        + '">'
                        + d.title
                        + '</option>';
                    var $obj_select = $(_obj_select);
                    $(".content-date-select").append($obj_select);
                }
                var $obj = $(_obj);
                $obj.insertBefore($("#register-content"));
            }
            return response;
        });
}
$("body").on("click", ".revise-btn", function(){
    // var content_id = $(this).attr("content_id");
    // var contents = temp_data.data.result.content;
    // for(var i in contents){
    //     if(contents[i].id == content_id){
    //         $("#content-preview-mdoal .modal-title").text(contents[i].title);
    //         $("#content-preview-mdoal .modal-body").html(contents[i].content);
    //         $("#content-preview-mdoal").modal("show");
    //         break;
    //     }
    // }
});
getBasicData();

function addDeployDate(date){
    var day = "";

    switch (date.getDay()){
        case 1: day = "월"; break;
        case 2: day = "화"; break;
        case 3: day = "수"; break;
        case 4: day = "목"; break;
        case 5: day = "금"; break;
        case 6: day = "토"; break;
        case 0: day = "일"; break;
    }

    var _d_str = (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "(" + day + ")";
    var _d_id = (date.getMonth() + 1).toString() + "-" + date.getDate().toString() ;

    var $_d = $('<div class="deploy-date input-group mb-3" id="'
        + _d_id
        +'">'
        +'<div class="input-group-prepend py-3 px-5 t-b">'
        +'<label class="input-group-text" for="deployDateSelect'
        + _d_id
        +'">'
        + _d_str
        +    '</label>'
        + '</div>'
        + '<select class="custom-select py-3 px-5 content-date-select t-b" id="deployDateSelect'
        + _d_id
        +'">)'
        + '<option class="content-date-unset" disabled selected>배포 글 선택하기</option>'
        + '</select>'
        + '</div>');
    $_d.prop("date", date);
    $("#deploy-dates").append($_d);
    $_d.change(function() {
        var _id = $(this).attr("id");
        var _selected_ids = [];

        $.when(
            $(".deploy-date").each(function() {
                // var _id = $(this).find(".custom-select :selected").val();
                var _id = $(this).find(".custom-select").val();

                if(_id){
                    _selected_ids.push(_id);
                }
            }))
            .then(function(){
                console.log(_selected_ids);
                var _cts = temp_data.data.result.content;
                var _el_cts = [];
                console.log(_cts);

                for (var i in _cts) {
                    var d = _cts[i];
                    if($.inArray(d.id.toString(), _selected_ids) < 0 && d.raw_content.trim().length > 3000){
                        _el_cts.push(d);
                    }
                }
                console.log(_el_cts);
                return _el_cts;
            })
            .then(contents => {
                $(".deploy-date").each(function () {
                    if ($(this).attr("id").toString() != _id.toString()) {
                        if (!$(this).find(".custom-select").val()) {
                            $(this).find(".custom-select")
                                .empty()
                                .append('<option class="content-date-unset" disabled selected>배포 글 선택하기</option>');

                            for (var i in contents) {
                                var d = contents[i];
                                if(d.raw_content.trim().length > 3000) {
                                    var _obj_select = '<option value="'
                                        + d.id
                                        + '">'
                                        + d.title
                                        + '</option>';
                                    var $obj_select = $(_obj_select);
                                    $(this).find(".content-date-select").append($obj_select);
                                }
                            }
                        }
                    }
                });
            })
    });
}


$("#complete-register-pro").click(function() {
    var _c_wi_d = [];
    $.when(
        $(".custom-select").each(function (){
            if(!$(this).val()){
                $.snackbar({content: "배포할 컨텐츠를 등록해주세요. 3000자 이상 컨텐츠만 등록 가능합니다."});
                return;
            }
            else{
                var date = $(this).parent().prop("date");
                _c_wi_d.push({
                    id: $(this).val(),
                    deploy_date: "{0}.{1}.{2}".format(date.getFullYear(), date.getMonth() +1, date.getDate())
                });
            }
        }))
        .then(function() {
            console.log(_c_wi_d);
            var basic_info = temp_data.data.result.basic_info;
            var content = temp_data.data.result.content;

            for(var i in content){
               for(var j in _c_wi_d){
                  if(_c_wi_d[j].id === content[i].id){
                      _c_wi_d[j]["content"] = content[i].content;
                      _c_wi_d[j]["raw_content"] = content[i].raw_content;
                      _c_wi_d[j]["title"] = content[i].title;
                  }
               }
            }
            console.log(_c_wi_d);
            basic_info["examination_contents"] = _c_wi_d;

            basic_info["user_identification"] = {identification: basic_info.id_num};
            delete basic_info.id_num;

            basic_info["bank_account"] = basic_info.bank;
            delete basic_info.bank;

            basic_info["pro_image"] = basic_info.pro_img;
            delete basic_info.pro_img;
            console.log(basic_info);

            axios.post(api_url + "/pro/register/", basic_info, {
                headers: _getAuthHeader()
            })
                .then(response => {
                    console.log(response.data.result);
                    if(response.data.result.code === 1){
                        // already registered pro
                        $.snackbar({content: "등록 완료"});
                        return;
                    }
                    else if(response.data.result.code !== 0){
                        $.snackbar({content: "에러 발생"});
                        return;
                    }
                    // force update user data
                    getUserData(true);
                   // goto main page
                })
                .catch(err => {
                    console.log(err);
                });
        });
});
