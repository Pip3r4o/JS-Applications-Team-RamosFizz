'use strict';

import controllers from './controllers.js';
import userControllers from './userControllers.js';

var renderer = (function () {
    function showFilterButton() {
        $('#filterBtnContainer').removeClass('hidden');
    }

    function hideFilterButton() {
        $('#filterBtnContainer').addClass('hidden');
    }

    function showFilterMenu() {
        $('#filterMenuContainer').removeClass('hidden');
        hideFilterButton();
    }

    function hideFilterMenu() {
        $('#filterMenuContainer').addClass('hidden')
    }

    function showFilterContainer() {
        $('#filter').removeClass('hidden');
        showFilterButton();
    }

    function hideFilterContainer() {
        $('#filter').addClass('hidden');
        hideFilterButton();
        hideFilterMenu();
    }

    var showFilterMenuBtn = $('#filterBtn').click(function () {
        showFilterMenu();
    });

    var cancelFilterBtn = $('#cancelFilterBtn').click(function () {
        hideFilterMenu();
        showFilterButton();
    });

    var searchFilterBtn = $('#searchFilterBtn').click(function () {
        filteredPostsView();
        hideFilterMenu();
        showFilterButton();
    });

    // TODO: Implement userControllers.signOut instead of callback
    var sgnOutBtn = $('#btnsgnout').click(function () {
        hideFilterContainer();
        userControllers.signOut();
    });

    function setInitialDateToUI() {
        $('#dd option:eq(' + (getCurrentDate().date - 1) + ')').attr('selected', true);
        $('#mm option:eq(' + (getCurrentDate().month) + ')').attr('selected', true);
    }

    function registerView() {
        $('#mainContent').load('partials/register.html', function () {
            $('#signup').submit(userControllers.signUp);
            $('#btnsgnin').click(loginView);
        });
    }

    function loginView() {
        $('#mainContent').load('partials/login.html', function () {
            $('#signin').submit(userControllers.signIn);
            $('#btnrgstr').click(registerView);
        });
    }

    function filteredPostsView() {
        var fromSelect  = $('#from-select-filter').val(),
            toSelect    = $('#to-select-filter').val(),
            priceSelect = $('#price-select-filter').val(),
            userInput   = $('#filteredDriver').val(),
            query       = new Parse.Query('Post'),
            data;

        if (priceSelect !== '-') {
            query.contains('price', priceSelect);
        }

        if (userInput !== '') {
            query.contains('author', userInput);
        }

        query.contains('from', fromSelect);
        query.contains('to', toSelect);
        query.find().then(function (res) {
            data = res;
            if (res.length === 0) {
                toastr.info('There are no posts matching these parameters!');
                return;
            }

            controllers.generatePostsFromTemplate(data, '#post-template');
        })
    }

    function postsView() {
        var data;
        var query = new Parse.Query('Post');
        query.ascending('day');
        query.greaterThan('day', new Date());
        query.greaterThan('seats', 0);
        query.find().then(function (res) {
            data = res;

            controllers.generatePostsFromTemplate(data, '#post-template');
        }, function (err) {
            console.log(err);
        }).then(function () {
            showFilterContainer();
        });
    }

    function createPostView() {
        hideFilterContainer();

        $('#mainContent').load('partials/createPost.html', function () {
            $('#btnrst').click(function () {
                $('#createpostcntnr form').trigger("reset");
            });
            setInitialDateToUI();
            $('#createpostcntnr').submit(controllers.createPost);
        });
    }

    function userView() {
        hideFilterContainer();

        $('#mainContent').html('');

        // TODO: Figure out how to run them in this specific order, synchronously

        getUpcomingPostsByUser();
        getPastPostsByUser();
        getOtherPostsOfUser();
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

    function getCurrentDate() {
        var date         = new Date(),
            currentDate  = date.getDate(),
            currentMonth = date.getMonth(),
            currentYear  = date.getFullYear();
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