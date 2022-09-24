$(document).ready(function () {
    function initLogin() {
        if ($("#login_btn").length <= 0) {
            return;
        }
        $("#login_btn").unbind('click');
        $('#login_btn').click(function () {
            let userObj = {
                username: $("#login_username").val(),
                password: $("#login_password").val()
            }
            verifyLogin(userObj);
        });
    }

    function initLogout() {
        if ($("#logout_btn").length <= 0) {
            return;
        }
        $("#logout_btn").unbind('click');
        $('#logout_btn').click(function () {
            logoutRequest();
        });
    }

    function loginRequest(userObj) {
        $.ajax({
            type: "POST",
            url: "/api/v1/auth/login",
            data: userObj,
            dataType: 'json',
            success: function (data) {
                if (data.success === undefined || data.success === null || data.success === false) {
                    $("#login_username").val('');
                    $("#login_password").val('');
                    localStorage.removeItem('dekkHotellUserToken');
                    localStorage.removeItem('dekkHotellUsername');
                    alert("Failed to login!");
                    return;
                }
                localStorage.setItem('dekkHotellUserToken', data.token);
                localStorage.setItem('dekkHotellUsername', data.username);
                window.location.reload();
            },
            error: function () {
                alert("Failed to request login data. Contact support ... Ring han Torje")
            }
        });
    }

    function logoutRequest() {
        $.ajax({
            type: "DELETE",
            url: "/api/v1/auth/logout",
            success: function (data) {
                console.log(data)
                if (data.success === undefined || data.success === null || data.success === false) {
                    alert("Failed to logout. Contact support ... Ring han Torje")
                    return;
                }
                localStorage.removeItem('dekkHotellUserToken');
                localStorage.removeItem('dekkHotellUsername');
                window.location.reload();
            },
            error: function () {
                alert("Failed to request login data. Contact support ... Ring han Torje")
            }
        });
    }

    function verifyLogin(userObj) {
        if (userObj.username === null || userObj.username === '') {
            alert("Input error");
            return;
        }
        if (userObj.password === null || userObj.password === '') {
            alert("Input error");
            return;
        }
        loginRequest(userObj);
    }

    function init() {
        initLogin();
        initLogout();
    }

    init();
});