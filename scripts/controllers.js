'use strict';

import validator from './validator.js';
import renderer from './renderer.js';
import Post from './post.js';
import utils from './utils.js';

var controllers = (function() {
    function reserveSeat(ev) {
        var tar = ev.target;

        var postID = tar.parentNode.firstChild.innerHTML;
        var seatsAvailable;
        var post;
        var query  = new Parse.Query('Post');
        var user   = Parse.User.current();

        query.get(postID).then(function (post) {
            if (post.get('user').id === user.id) {
                utils.Error('You cannot reserve a seat for yourself on your own post!');
                return;
            }
            if (!user.get('otherTrips')) {
                user.set('otherTrips', []);
            }
            if (!post.get('usersTraveling')) {
                post.set('usersTraveling', []);
            }
            if (user.get('otherTrips').indexOf(post.id) >= 0) {
                utils.showError('You have already reserved a seat for this particular trip!');
                return;
            }

            seatsAvailable = post.get('seats');
            seatsAvailable -= 1;
            post.set('seats', seatsAvailable);
            post.attributes.usersTraveling.push(user.get('username'));
            post.save().then(function () {
                user.attributes.otherTrips.push(post.id);
                user.save();
                utils.showInfo('You reserved a seat on trip: ' + post.get('title'));
                location.assign('/#user');
            });
        }, function (err) {
            utils.showError('An error occured while fetching the post. Please try again later!');
            console.log(err);
        });
    }

    function generatePostsFromTemplate(data, tamplateSelector) {
        data = {posts: data};

        var templateSource = $(tamplateSelector).html();
        var template       = Handlebars.compile(templateSource);

        $('#content').html(template(data));

        // TODO: Separete concerns of compiling html template and adding events to buttons after that(Maybe promises)
        $('#showAllPostsBtn').click(function () {
            renderer.postsView();
        });
        $('.btn-reserve-seat').click(reserveSeat);
    }

    function generateUserPostsFromTemplate(posts, type) {
        var data = {
            type: type,
            posts: posts
        };

        var templateSource = $('#user-post-template').html();
        var template       = Handlebars.compile(templateSource);

        $('#mainContent').append(template(data));
    }


    function createPost(author,title,contact,from,to,day,seats,price) {
        if (!validator.postCreationValidation.mobileNumberValidation(contact)) {
            utils.showError('Mobile number is not in a valid BG format!');
            return false;
        }

        if (!validator.postCreationValidation.destinationValidation(from, to)) {
            utils.showError('You must travel from/to a town different to the place of departure!');
            return false;
        }

        if (!validator.postCreationValidation.dateValidation(day)) {
            utils.showError('You cannot create a post that is due previous date!');
            return false;
        }

        if (!validator.postCreationValidation.titleValidation(title)) {
            utils.showInfo('Title is too short or too long, converted to default format!');
            title = from + ' - ' + to + ' [' + day.getDate() + '/' + ((day.getMonth() * 1) + 1) + '/' + day.getFullYear() + '] ' + ' (' + author + ')';
        }

        var post = new Post();
        post.create(author, title, contact, from, to, day, seats, price);

        location.assign('#/posts');

        return false;
    }

    return {
        generatePostsFromTemplate: generatePostsFromTemplate,
        generateUserPostsFromTemplate: generateUserPostsFromTemplate,
        createPost: createPost
    }
}());

export default controllers