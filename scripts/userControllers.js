'use strict'

function signIn() {
    var username = $('#inputUsername').val().toLowerCase(),
        password = $('#inputPassword').val();

    if (!Parse.User.current()) {
        Parse.User.logIn(username, password)
            .then(function () {
                $('#user').html(Parse.User.current().getUsername() + ' posts');
                $('#userProfile').html(Parse.User.current().getUsername());

                toastr.success('Successfully logged in!');
                //renderPostsView();
                location.assign('#posts');
            }, function (err) {
                console.log(err);
                toastr.error('Error ' + err.code + ': ' + err.message);
            });
    } else {
        toastr.info('You are already logged in!');
        location.assign('#posts');
    }

    return false;
}

function signUp() {
    var emailRegEx = /\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/ig;
    var username = $('#registerUsername').val(),
        fName = $('#registerFName').val(),
        lName = $('#registerLName').val(),
        email = $('#registerEmail').val(),
        password = $('#registerPassword').val();
    var deferred = new Promise(function (resolve, reject) {
        if (!(emailRegEx.exec(email))) {
            reject('Invalid Email!');
            return;
        }
        if (password.length < 6) {
            reject('Password must contain 6 or more characters');
            return;
        }
        if (username.length < 5) {
            reject('Username must contain 5 or more characters');
            return;
        }

        resolve({
            username: username.toLowerCase(),
            password: password,
            email: email,
            fName: fName,
            lName: lName
        });

    }).then(function (values) {
            Parse.User.signUp(values.username, values.password,
                {email: values.email, fName: values.fName, lName: values.lName})
                .then(function () {
                    toastr.success('Successfully signed up!');
                    location.assign('#post')
                },
                function (err) {
                    console.log(err);
                    toastr.error('Error ' + err.code + ': ' + err.message);
                });
        },
        function (error) {
            toastr.error(error);
        });
    return false;
}

export default {signIn, signUp}