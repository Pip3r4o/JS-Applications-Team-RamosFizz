'use strict'

var validator = {
    date: function (date) {
        let created = new Date();

        if (date - created < 0) {
            toastr.error('You cannot create a post that is due previous date!');
            return false;
        }
    },
    destination: function (from, to) {
        if (from === to) {
            toastr.error('You must travel from/to a town different to the place of departure!');
            return false;
        }
    },
    telephone: function (contact) {
        let numberRegEx = /^(\+359|0)\s?8(\d{2}\s\d{6}|[789]\d{7})$/igm;

        if (!(numberRegEx.exec(contact))) {
            toastr.error('Mobile number is not in a valid BG format!');
            return false;
        }
    },
    title: function (title, day, author) {
        if (title.length < 10 || title.length > 30) {
            toastr.info('Title is too short or too long, converted to default format!');
            title = from + ' - ' + to + ' [' + day.getDate() + '/' + ((day.getMonth() * 1) + 1) + '/' + day.getFullYear() + '] ' + ' (' + author + ')';
        }

        return title;
    }
};

export {validator}