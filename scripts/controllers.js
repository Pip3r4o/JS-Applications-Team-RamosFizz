'use strict'

import validator from './validator.js';
import render from './render.js';

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

function generatePostsFromTemplate(data, tamplateSelector) {
    data = {posts: data};

    var templateSource = $(tamplateSelector).html();
    var template = Handlebars.compile(templateSource);

    $('#mainContent').html(template(data));

    $('#showAllPostsBtn').click(function () {
        render.postsView();
    })

    $('.btn-reserve-seat').click(function (ev) {
        var tar = ev.target;

        var postID = tar.parentNode.firstChild.innerHTML;
        var seatsAvailable;
        var post;
        var query = new Parse.Query('Post');
        var user = Parse.User.current();

        query.get(postID).then(function (post) {
            if (post.get('user').id === user.id) {
                toastr.error('You cannot reserve a seat for yourself on your own post!');
                return;
            }
            if (!user.get('otherTrips')) {
                user.set('otherTrips', []);
            }
            if (!post.get('usersTraveling')) {
                post.set('usersTraveling', []);
            }
            if (user.get('otherTrips').indexOf(post.id) >= 0) {
                toastr.error('You have already reserved a seat for this particular trip!');
                return;
            }

            seatsAvailable = post.get('seats');
            seatsAvailable -= 1;
            post.set('seats', seatsAvailable);
            post.attributes.usersTraveling.push(user.get('username'));
            post.save().then(function () {
                user.attributes.otherTrips.push(post.id);
                user.save();
                toastr.info('You reserved a seat on trip: ' + post.get('title'));
                location.assign('#user');
            });
        }, function (err) {
            toastr.error('An error occured while fetching the post. Please try again later!');
            console.log(err);
        });
    });
    // TODO: add functionality to store posts a user reserves a spot for
}

function createPost() {
    var author = Parse.User.current().get('username'),
        title = $('#titleinpt').val(),
        contact = $('#contactinpt').val(),
        from = $('#postfrom option:selected').text(),
        to = $('#postto option:selected').text(),
        day = new Date($('#yy option:selected').text(),
            ($('#mm option:selected').text() * 1) - 1,
            $('#dd option:selected').text(),
            $('#hourslct option:selected').text(),
            $('#minuteslct option:selected').text(), 0),
        seats = ($('#seatsslct option:selected').text() * 1),
        price = $('#postprice option:selected').text();

    if(!validator.date(day)) {
        return false;
    }

    if(!validator.destination(from, to)) {
        return false;
    }

    if(!validator.telephone(contact)){
        return false;
    }

    title = validator.title(title, day, author, from, to);

    var post = new Post();
    post.create(author, title, contact, from, to, day, seats, price);

    location.assign('#posts');

    return false;
}

function generateUserPosts(posts, type) {
    var data = {
        type: type,
        posts: posts
    };

    var templateSource = $('#user-post-template').html();
    var template = Handlebars.compile(templateSource);

    $('#mainContent').append(template(data));
}

export default {generatePostsFromTemplate, createPost, generateUserPosts}