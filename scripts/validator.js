'use strict';

var validator = function () {
    function dateValidation(date) {
        let created = new Date();

        if (date - created < 0) {
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
        if (title.length < 15 || title.length > 35) {
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

export default validator;