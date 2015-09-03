'use strict';

import validator from './validator.js';
import renderer from './renderer.js';
import utils from './utils.js';

var userControllers = (function () {
    function signIn(username,password) {
        if (!Parse.User.current()) {
            Parse.User.logIn(username, password)
                .then(function () {
                    utils.showSuccess('Successfully logged in!');
                    location.assign('#posts');
                    showUserControls();
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                });
        } else {
            utils.showInfo('You are already logged in!');
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

    function signUp(username,fName,lName,email,password) {
        if (!validator.userRegistrationValidation.emailValidation(email)) {
            utils.showSuccess('Invalid email format. Please enter a valid email!');
            return false;
        }

        if (!validator.userRegistrationValidation.passwordLengthValidation(password)) {
            utils.showSuccess('Password must contain 6 or more characters');
            return false;
        }

        if (!validator.userRegistrationValidation.usernameValidation(username)) {
            utils.showSuccess('Username must be between 8 and 20 characters and contain alphanumeric characters, underscores (_) or dots (.)');
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
                utils.showSuccess('Successfully signed up!');
                location.assign('#post');
                showUserControls();
            },
            function (err) {
                utils.showError('Error ' + err.code + ': ' + err.message);
            });

        return false;
    }

    function signOut() {
        Parse.User.logOut().then(
            function () {
                utils.showSuccess('You successfully logged out!');
                hideUserControls();
                renderer.loginView();
            },
            function () {
                utils.showError('There was an error while logging out! :(');
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