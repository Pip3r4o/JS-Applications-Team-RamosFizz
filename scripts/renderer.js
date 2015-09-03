'use strict';

import controllers from './controllers.js';
import userControllers from './userControllers.js';
import utils from './utils.js'

var renderer = (function () {
    var sgnOutBtn = $('#btnsgnout').click(userControllers.signOut);

    function registerView() {
        $('#mainContent').load('partials/register.html', function () {
            $('#signup').submit(function (e) {
                var input = getInputWhenSigningUp();
                userControllers.signUp(input.username, input.fName, input.lName, input.email, input.password);
                e.preventDefault();
            });
            $('#btnsgnin').click(loginView);
        });
    }

    function loginView() {
        $('#mainContent').load('partials/login.html', function () {
            $('#signin').submit(function(e){
                var input=getInputWhenLoggingIn();
                userControllers.signIn(input.username,input.password);
                e.preventDefault();
            });

            $('#btnrgstr').click(registerView);
        });
    }

    function filteredPostsView(e) {
        var fromSelect = $('#from-select-filter').val(),
            toSelect = $('#to-select-filter').val(),
            userInput = $('#filteredDriver').val(),
            query = new Parse.Query('Post'),
            data;

        e.preventDefault();

        if (userInput !== '') {
            query.contains('author', userInput);
        }

        query.greaterThan('day', new Date());
        query.greaterThan('seats', 0);
        query.contains('from', fromSelect);
        query.contains('to', toSelect);

        query.find().then(function (res) {
            data = res;
            if (res.length === 0) {
                utils.showInfo('There are no posts matching these parameters!');
                return false;
            }

            controllers.generatePostsFromTemplate(data, '#post-template');

            e.preventDefault();
        })
    }

    function postsView() {
        var data,
            query = new Parse.Query('Post');

        var $container = $('<div />').addClass('container');

        var $title = $('<h2 />').html('Find other people to travel with!').addClass('white title').appendTo($container);

        var $filterRevealButton = $('<button />').addClass('btn btn-primary btn-md center-block').html('Filter').appendTo($container);

        var $filter = $('<div />').attr('id', 'filter').addClass('container panel-body').css('display',
            'none').appendTo($container);

        var $content = $('<div />').attr('id', 'content').appendTo($container);

        query.ascending('day');
        query.greaterThan('day', new Date());
        query.greaterThan('seats', 0);
        query.find().then(function (res) {
            data = res;

            $filterRevealButton.click(function () {
                $filter.toggle();
            });

            $filter.load('partials/filter.html', function () {
                $filter.submit(filteredPostsView);
                $('#btn-cancel-filter').click(function () {
                    $('#filter form').trigger('reset');
                });
            });

            $('#mainContent').html($container);

            controllers.generatePostsFromTemplate(data, '#post-template');
        }, function (err) {
            console.log(err);
        });
    }

    function createPostView() {
        $('#mainContent').load('partials/createPost.html', function () {
            $('#btnrst').click(function () {
                $('#createpostcntnr form').trigger('reset');
            });
            setInitialDateToUI();
            $('#createpostcntnr').on('submit', function (e) {
                var input = getInputWhenCreatingPost();
                controllers.createPost(input.author, input.title, input.contact, input.from, input.to, input.day, input.seats, input.price);
                e.preventDefault();
            });
        });
    }

    function userView() {
        $('#mainContent').html('');

        // TODO: Figure out how to run them in this specific order, synchronously

        getUpcomingPostsByUser();
        getPastPostsByUser();
        getOtherPostsOfUser();
    }

    function setInitialDateToUI() {
        $('#dd option:eq(' + (getCurrentDate().date - 1) + ')').attr('selected', true);
        $('#mm option:eq(' + (getCurrentDate().month) + ')').attr('selected', true);
    }

    function getUpcomingPostsByUser() {
        var query = new Parse.Query('Post');
        query.equalTo('user', Parse.User.current())
            .greaterThanOrEqualTo('day', new Date())
            .find()
            .then(function (posts) {
                controllers.generateUserPostsFromTemplate(posts, 'Pending trips!');
            }, function (err) {
                console.log(err);
            })
    }

    function getPastPostsByUser() {
        var query = new Parse.Query('Post');
        query.equalTo('user', Parse.User.current())
            .lessThan('day', new Date())
            .find()
            .then(function (posts) {
                controllers.generateUserPostsFromTemplate(posts, 'Past trips!')
            }, function (err) {
                console.log(err);
            })
    }

    function getOtherPostsOfUser() {
        var postIDs = Parse.User.current().get('otherTrips');

        if (!postIDs) {
            return;
        }

        var count = postIDs.length;
        var posts = [];
        var i;
        for (i = 0; i < count; i += 1) {
            var query = new Parse.Query('Post');

            if (i === (count - 1)) {
                query.get(postIDs[i]).then(function (post) {
                    posts.push(post);
                    controllers.generateUserPostsFromTemplate(posts, 'Your trips with others!');
                });
            } else {
                query.get(postIDs[i]).then(function (post) {
                    posts.push(post);
                });
            }
        }
    }

    function getInputWhenLoggingIn(){
        var username = $('#inputUsername').val().toLowerCase(),
            password = $('#inputPassword').val();

        return {
            username:username,
            password:password
        }
    }

    function getInputWhenSigningUp() {
        var username = $('#registerUsername').val(),
            fName = $('#registerFName').val(),
            lName = $('#registerLName').val(),
            email = $('#registerEmail').val(),
            password = $('#registerPassword').val();

        return {
            username: username,
            fName: fName,
            lName: lName,
            email: email,
            password: password
        }
    }

    function getInputWhenCreatingPost() {
        var author = Parse.User.current().get('username'),
            title = $('#titleinpt').val(),
            contact = $('#contactinpt').val(),
            from = $('#fromslct option:selected').text(),
            to = $('#toslct option:selected').text(),
            day = new Date($('#yy option:selected').text(),
                ($('#mm option:selected').text() * 1) - 1,
                $('#dd option:selected').text(),
                $('#hourslct option:selected').text(),
                $('#minuteslct option:selected').text(), 0),
            seats = ($('#seatsslct option:selected').text() * 1),
            price = $('#priceslct option:selected').text();

        return {
            author: author,
            title: title,
            contact: contact,
            from: from,
            to: to,
            day: day,
            seats: seats,
            price: price
        }
    }

    function getCurrentDate() {
        var date = new Date(),
            currentDate = date.getDate(),
            currentMonth = date.getMonth(),
            currentYear = date.getFullYear();
        return {
            date: currentDate,
            month: currentMonth,
            year: currentYear
        }
    }

    function getUsername() {
        var data;

        if (Parse.User.current()) {
            data = 'Welcome, ' + Parse.User.current().getUsername();
        }
        else {
            data = '';
        }

        return data;
    }

    return {
        loginView: loginView,
        postsView: postsView,
        filteredPostsView: filteredPostsView,
        createPostView: createPostView,
        userView: userView
    }
}());

export default renderer;