'use strict'

import controllers from './controllers.js';
import userControllers from './userControllers.js';

var userBtn = $('#user');

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
})

var cancelFilterBtn = $('#cancelFilterBtn').click(function () {
    hideFilterMenu();
    showFilterButton();
})

var searchFilterBtn = $('#searchFilterBtn').click(function () {
    renderFilteredPostsView();
    hideFilterMenu();
    showFilterButton();
})


var sgnOutBtn = $('#btnsgnout').click(function () {
    hideFilterContainer();
    Parse.User.logOut().then(
        function () {
            toastr.success('You successfully logged out!');
            loginView();
        },
        function () {
            toastr.error('There was an error while logging out! :(')
        });
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
    userBtn.hide();
    sgnOutBtn.hide();
    $('#userProfile').html('');
}

function loginView() {
    $('#mainContent').load('partials/login.html', function () {
        $('#signin').submit(userControllers.signIn);
        $('#btnrgstr').click(registerView);
    });
    userBtn.hide();
    sgnOutBtn.hide();
    $('#userProfile').html('');
}

function renderFilteredPostsView() {
    var fromSelect = $('#fromslct').val(),
        toSelect = $('#toslct').val(),
        priceSelect=$('#priceslct').val(),
        userInput=$('#filteredDriver').val(),
        query = new Parse.Query('Post'),
        data;

    if(priceSelect!=='-'){
        query.contains('price',priceSelect);
    }

    if(userInput!==''){
        query.equalTo('author',userInput);
    }

    query.contains('from', fromSelect)
    query.contains('to', toSelect)
    query.find().then(function (res) {
        data = res;
        if (res.length === 0) {
            toastr.info('There are no posts for this query!');
            return;
        }

        controllers.generatePostsFromTemplate(data, '#post-template');
    })
}

function postsView() {

    userBtn.html(Parse.User.current().getUsername() + ' posts').show();
    $('#userProfile').html(Parse.User.current().getUsername());

    sgnOutBtn.show();

    $('#posts').addClass('active');

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
    $('#makepost').addClass('active');

    $('#mainContent').load('partials/createPost.html', function () {
        $('#btnrst').click(function () {
            $('#createpostcntnr form').trigger("reset");
        });
        setInitialDateToUI();
        $('#createpostcntnr').submit(createPost);
    });
}

function userView() {
    hideFilterContainer();
    $('#user').addClass('active');

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
            controllers.generateUserPosts(posts, 'Panding posts!');
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
            controllers.generateUserPosts(posts, 'Past trips!')
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
                controllers.generateUserPosts(posts, 'Your trips with others!');
            });
        } else {
            query.get(postIDs[i]).then(function (post) {
                posts.push(post);
            });
        }
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

export default {loginView, postsView, createPostView, userView};