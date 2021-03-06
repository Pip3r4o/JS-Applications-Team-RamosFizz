'use strict';

var validator = (function () {
    var postCreationValidation = function() {
        function dateValidation(date) {
            let currentDate = new Date();


            if (date - currentDate < 0) {
                return false;
            }

            return true;
        }

        function destinationValidation(from, to) {
            if (from === to) {
                return false;
            }

            return true;
        }

        function mobileNumberValidation(contact) {
            let numberRegEx = /^(\+359|0)\s?8(\d{2}\s\d{6}|[789]\d{7})$/igm;

            if (!(numberRegEx.exec(contact))) {
                return false;
            }

            return true;
        }

        function titleValidation(title) {
            const MIN_LENGTH=15;
            const MAX_LENGTH=35;


            if (title.length < MIN_LENGTH || title.length > MAX_LENGTH) {
                return false;
            }

            return true;
        }

        return {
            dateValidation: dateValidation,
            destinationValidation: destinationValidation,
            mobileNumberValidation: mobileNumberValidation,
            titleValidation: titleValidation
        };
    }();

    var userRegistrationValidation = function() {
        function emailValidation(email) {
            var emailRegEx = /\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]{2,}\.)+[A-Z]{2,4}\b/ig;

            if (!(emailRegEx.exec(email))) {
                return false;
            }

            return true;
        }

        function passwordLengthValidation(password) {
            const MIN_LENGTH=6;

            if (password.length < MIN_LENGTH) {
                return false;
            }

            return true;
        }

        function usernameValidation(username) {
            var usernameRegEx = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/igm;

            if (!(usernameRegEx.exec(username))) {
                return false;
            }

            return true;
        }

        return {
            emailValidation: emailValidation,
            passwordLengthValidation: passwordLengthValidation,
            usernameValidation: usernameValidation
        }

    }();

    return {
        postCreationValidation: postCreationValidation,
        userRegistrationValidation: userRegistrationValidation
    }
}());

export default validator;