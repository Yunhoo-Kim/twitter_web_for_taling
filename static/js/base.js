function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$("#logout").click(function() {
    console.log("logout");
})
// var api_url = "http://www.thrink.co.kr:8000";
var api_url = "http://localhost:8000";

var login = amplify.store("login");
var _t = $("#_token").attr("token");
$("#_token").remove();


if(login){
    if(!_t) {
        $.snackbar({content: "로그인 세션이 종료되었습니다."});
        amplify.store("login", null);
        location.reload(true);
    }
    else {
        getUserData(false).then(res => {
                $("#nav-username").text(res.last_name + res.first_name);
                $(".username").text(res.last_name + res.first_name);
                if(res.is_pro)
                    $(".pro-register-btn").remove();
            }
        )
    }
}

$("#signup-in-login").click(function() {
    $("#loginModal").modal("hide");
    $(".modal-backdrop").remove();
    $("#signUpModal").modal("show");
});

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function _getAuthHeader(){
    if(login)
        return {"Authorization" : "Thrink " + _t};
    else
        return {};
}

if(window.location.href.indexOf("/pro/register") > -1){
    $(".pro-register-btn").remove();
}

function _getUserData(){
    return axios.get(api_url + '/ui/',
        {
            headers: _getAuthHeader()
        })
        .then(response => {
            amplify.store("user_info", response.data.result.data);
            return response.data.result.data;
        })
        .catch(err => {
            console.log(err);
        });
}

function getUserData(_force){
    if(_force)
        return _getUserData();
    else {
        var u_i = amplify.store("user_info");
        if(!u_i)
            return _getUserData();
        else
            return new Promise(function (resolve, reject) {
            resolve(amplify.store("user_info"));
        });
    }
}
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function stopLoader(){
    $("body").waitMe("hide");
}
function runLoader(txt){
    $('body').waitMe({

//none, rotateplane, stretch, orbit, roundBounce, win8,
//win8_linear, ios, facebook, rotation, timer, pulse,
//progressBar, bouncePulse or img
//         effect: 'bounce',

//place text under the effect (string).
        text: txt,

//background for container (string).
        bg: 'rgba(255,255,255,0.7)',

//color for background animation and text (string).
        color: '#74ccf4',

//max size
//         maxSize: '',

//wait time im ms to close
//         waitTime: -1,

//url to image
//         source: '',

//or 'horizontal'
//         textPos: 'vertical',

//font size
//         fontSize: '',

// callback
//         onClose: function() {}

    });
}
