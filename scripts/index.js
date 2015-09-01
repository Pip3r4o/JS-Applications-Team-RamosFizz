'use strict';

import 'bower_components/parse-1.5.0/index.js';
import 'bower_components/jquery/dist/jquery.js'

import renderer from './renderer.js';

(function() {
    Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");

    window.onhashchange = locationHashChanged;

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

    if (!Parse.User.current()) {
        renderer.loginView();
    } else {
        if (location.hash !== '#posts') {
            location.assign('#posts');
        } else {
            renderer.postsView();
        }
    }

    function locationHashChanged() {
        $('.blog-nav-item').removeClass('active');

        if (!Parse.User.current()) {
            location.assign('#');
            return;
        }
        if (location.hash === "#posts") {
            renderer.postsView();
        } else if (location.hash === "#makepost") {
            renderer.createPostView();
        } else if (location.hash === '#user') {
            renderer.userView();
        } else if (location.hash === '#login') {
            renderer.loginView();
        } else {
            renderer.postsView();
        }
    }
}());