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

var Post = Parse.Object.extend('Post', {
    create: function (author, title, contact, from, to, day, seats, price) {
        this.save({
            'user': Parse.User.current(),
            'author': author,
            'title': title,
            'contact': contact,
            'from': from,
            'to': to,
            'day': day,
            'seats': seats,
            'price': price,
            'otherTrips': [],
            'usersTraveling': []
        }, {
            success: function (post) {
                toastr.info('You added a new post: ' + post.get('title'));
            },
            error: function (post, error) {
                toastr.error(post);
                toastr.error(error);
            }
        });
    }
});

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