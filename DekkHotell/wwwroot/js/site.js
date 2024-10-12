$(document).ready(function () {
    function keepAlive() {
        setTimeout(() => {
            if (!localStorage.getItem('dekkHotellUserToken')) {
                keepAlive();
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "/api/v1/auth/keep-alive",
                    headers: { "Authorization": localStorage.getItem('dekkHotellUserToken') },
                    dataType: 'json',
                    success: function (data) {
                        keepAlive();
                    },
                    error: function (error) {
                        logoutRequest();
                    }
                });
            }
        }, 600000); // 600,000 => 10 minutes 
    }

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
        $("#edit_user_btn").unbind('click');
        $('#edit_user_btn').click(function () {
            editUser();
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
                    removeAuthCookie();
                    alert("Failed to login!");
                    return;
                }
                setAuthCookie(data.username, data.token);
                window.location.reload();
            },
            error: function (error) {
                alert(error.responseText);
                //alert("Failed to request login data. Contact support ... Ring han Torje")
            }
        });
    }

    function logoutRequest() {
        $.ajax({
            type: "DELETE",
            url: "/api/v1/auth/logout",
            success: function (data) {
                if (data.success === undefined || data.success === null || data.success === false) {
                    alert("Failed to logout. Contact support ... Ring han Torje")
                    return;
                }
                removeAuthCookie();
                window.location.reload();
            },
            error: function () {
                alert("Failed to request login data. Contact support ... Ring han Torje")
            }
        });
    }

    function updateUser(obj) {if (readAuthCookie('dekkhotell_token') == null) {
            alert("No access!");
            return;
        }
        $.ajax({
            type: "PUT",
            url: "/api/v1/user",
            headers: { "Authorization": readAuthCookie('dekkhotell_token') },
            data: obj,
            dataType: 'json',
            success: function () {
                $('#my_main_modal').modal('hide');
                alert("Bruker er oppdatert!");
            },
            error: function (error) {
                if (error.status === 401) {
                    removeAuthCookie();
                    alert("Session timeout. You need to login again");
                    window.location.reload();
                    return;
                }
                alert(error.responseText);
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

    function editUser(id) {
        $('#modal_main_title').empty();
        let edit_user_header = 'Rediger bruker';
        $('#modal_main_title').append(edit_user_header);

        $('#modal_main_content').empty();
        let edit_user_content = '<form>'
            + '<div class="form-group row">'
            + '<label for="old_password" class="col-sm-2 col-form-label">Gamle passord</label>'
            + '<div class="col-sm-10">'
            + '<input type="password" class="form-control" id="old_password" placeholder="Passord">'
            + '</div>'
            + '</br></br></br></br></br>'
            + '<label for="new_password" class="col-sm-2 col-form-label">Nytt passord</label>'
            + '<div class="col-sm-10">'
            + '<input type="password" class="form-control" id="new_password" placeholder="Passord">'
            + '</div>'
            + '</br>'
            + '<label for="new_password_2" class="col-sm-2 col-form-label">Gjenta nytt passord</label>'
            + '<div class="col-sm-10">'
            + '<input type="password" class="form-control" id="new_password_2" placeholder="Gjenta passord">'
            + '</div></div>'

            + '</form>';
        $('#modal_main_content').append(edit_user_content);

        $('#modal_main_footer').empty();
        let edit_user_footer = '<button id="save_profile_btn" type="button" class="btn btn-primary" data="' + id + '" title="Lagre data og lukk vindu"><i class="bi bi-save2"></i> Lagre</button>'
            + '<button id="close_profile_btn" type="button" class="btn btn-secondary" title="Lukk vindu uten å lagre"><i class="bi bi-x-lg"></i></button>';
        $('#modal_main_footer').append(edit_user_footer);

        editMainModalHandlers();
        $('#my_main_modal').modal('show');
    }

    function editMainModalHandlers() {
        $('#save_profile_btn').unbind('click');
        $('#save_profile_btn').click(function () {
            let object = {
                oldPassword: $('#old_password').val(),
                newPassword: $('#new_password').val(),
                repeatPassword: $('#new_password_2').val()
            };
            if (object.oldPassword.length <= 3) {
                alert('For kort passord');
                return;
            }
            if (object.newPassword.length <= 3) {
                alert('For kort passord');
                return;
            }
            if (object.newPassword !== object.repeatPassword) {
                alert('Passord matcher ikke');
                return;
            }
            updateUser(object);
        });
        $('#close_profile_btn').unbind('click');
        $('#close_profile_btn').click(function () {
            $('#my_main_modal').modal('hide');
        });
    }

    function modalStatic() {
        $('#my_main_modal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    function init() {
        initLogin();
        initLogout();
        modalStatic();
        keepAlive();
    }

    init();
});