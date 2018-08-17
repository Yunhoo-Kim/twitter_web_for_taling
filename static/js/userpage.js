var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})/;

// Signup
$("#signup-form").submit(function(event){
    event.preventDefault()
});

$("#signup").click(function(event) {
    var first_name = $("#signup-first-name").val();
    var last_name = $("#signup-last-name").val();
    var email = $("#signup-email").val();
    var password = $("#signup-password").val();

    if(!regEmail.test(email)){
        $.snackbar({content: "정확한 이메일을 입력해주세요."});
        $("#signup-email").select();
        return;
    }

    axios.post(api_url + "/user/signup/", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    })
        .then(function(response){
            if(response.data.code == 0){
                $.snackbar({content: "회원가입이 완료되었습니다. 로그인 해주세요."});
                $("#signUpModal").modal("hide");
                $(".modal-backdrop").remove();
                $("#loginModal").modal("show");
                return;
            }else if(response.data.code == 1){
                $.snackbar({content: "인증번호가 일치하지 않습니다."});
                $("#signup-phone-code").select();
                return;
            }else{
                $.snackbar({content: "회원가입 중 오류가 발생했습니다. 잠시후 시도해주세요."});
            }
            console.log(response.data);
        })
        .catch(function(err) {
            console.log(err);
        });
});



// login

$("#login-form").submit(function(event){
    event.preventDefault()
});

$("#login").click(function() {
    var email = $("#login-email").val();
    var password = $("#login-password").val();

    if(!regEmail.test(email)){
        $.snackbar({content: "올바른 이메일을 입력해주세요."});
        $("#login-email").select();
        return;
    }

    axios.post(api_url + "/user/login/", {
        email: email,
        password: password
    })
        .then(function(response) {
            if(response.data.code == 999){
                var token = response.data.token;
                registerSession(token).
                then(res => {
                    amplify.store("user_info", null);
                    amplify.store("login", true);
                    location.reload();
                });
            }
            else if(response.data.code == 1){
                $.snackbar({content: "존재하지 않는 이메일입니다."});
                $("#login-email").select();
            }
            else if(response.data.code == 2 ){
                $.snackbar({content: "비밀번호가 일치하지 않습니다."});
                $("#login-password").select();
            }
            else {
                $.snackbar({content: "로그인 과정에서 에러가 발생했습니다."});
            }
            console.log(response.data);
        })
        .catch(function(error) {
            console.log(error);
        })
});
function getTweetList(user_id){
    runLoader("트윗 불러오는중.");
    axios.get(api_url + "/user/{0}/".format(user_id), {
       headers: _getAuthHeader()
    })
        .then(function(response){
            $(".card-img-top").attr("src", "/static/image/cover{0}.jpg".format(parseInt((Math.random()* 100000000 )% 5) +1));
            $("#username").text("{0}{1}".format(response.data.data.last_name, response.data.data.first_name));
            var tweets = response.data.data.tweet;

            for(var i in tweets){
                addTweet(tweets[i]);
            }
        })
        .catch(function(error){
            console.log(error);
        })
        .then(function(){
            stopLoader();
        });
}


function registerSession(token){
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    return axios.post("/login/", {
        token: token
    })
        .then(function(response) {
            if(response.data.code == 0){
                // refresh user info
                $("#loginModal").modal("hide");
                $(".modal-backdrop").remove();
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}

getTweetList(user_id);
