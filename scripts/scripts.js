'use strict'

import 'bower_components/parse-1.5.0/index.js';
import 'bower_components/jquery/dist/jquery.js'

import render from './render.js';

Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

window.onhashchange = locationHashChanged;

if (!Parse.User.current()) {
    render.loginView();
} else {
    if (location.hash !== '#posts') {
        location.assign('#posts');
    } else {
        render.postsView();
    }
}

function locationHashChanged() {
    $('.blog-nav-item').removeClass('active');

    if (!Parse.User.current()) {
        location.assign('#');
        return;
    }
    if (location.hash === "#posts") {
        render.postsView();
    } else if (location.hash === "#makepost") {
        render.createPostView();
    } else if (location.hash === '#user') {
        render.userView();
    } else if (location.hash === '#login') {
        render.loginView();
    } else {
        render.postsView();
    }
}