'use strict';

import validator from './validator.js';
import renderer from './renderer.js';

var userControllers = (function () {
    function signIn() {
        var username = $('#inputUsername').val().toLowerCase(),
            password = $('#inputPassword').val();

        if (!Parse.User.current()) {
            Parse.User.logIn(username, password)
                .then(function () {
                    toastr.success('Successfully logged in!');
                    location.assign('#posts');
                    showUserControls();
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

    function hideUserControls() {
        $('#user-nav').hide();
    }

    function showUserControls() {
        $('#userProfile').html(Parse.User.current().get('username') + '\'s posts');
        $('#user-nav').show();
    }

    function signUp() {
        var username = $('#registerUsername').val(),
            fName    = $('#registerFName').val(),
            lName    = $('#registerLName').val(),
            email    = $('#registerEmail').val(),
            password = $('#registerPassword').val();

        if (!validator.userRegistrationValidation.emailValidation(email)) {
            toastr.error('Invalid email format. Please enter a valid email!');
            return false;
        }

        if (!validator.userRegistrationValidation.passwordLengthValidation(password)) {
            toastr.error('Password must contain 6 or more characters');
            return false;
        }

        if (!validator.userRegistrationValidation.usernameValidation(username)) {
            toastr.error('Username must be between 8 and 20 characters and contain alphanumeric characters, underscores (_) or dots (.)');
            return false;
        }

        var credentials = {
            username: username.toLowerCase(),
            password: password,
            email: email,
            fName: fName,
            lName: lName
        };

        Parse.User.signUp(credentials.username, credentials.password, {
            email: credentials.email,
            fName: credentials.fName,
            lName: credentials.lName
        })
            .then(function () {
                toastr.success('Successfully signed up!');
                location.assign('#post');
                showUserControls();
            },
            function (err) {
                console.log(err);
                toastr.error('Error ' + err.code + ': ' + err.message);
            });

        return false;
    }

    function signOut() {
        Parse.User.logOut().then(
            function () {
                toastr.success('You successfully logged out!');
                hideUserControls();
                renderer.loginView();
            },
            function () {
                toastr.error('There was an error while logging out! :(');
            });
    }

    return {
        signIn: signIn,
        signUp: signUp,
        signOut: signOut,
        hideUserControls: hideUserControls,
        showUserControls: showUserControls
    }

}());

export default userControllers