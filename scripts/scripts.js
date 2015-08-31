//import 'scripts/handlebarsUserCompiler.js';

Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");

function locationHashChanged() {

    $('.blog-nav-item').removeClass('active');

    if (!Parse.User.current()) {
        location.assign('#');
        return;
    }
    if (location.hash === "#posts") {
        renderPostsView();
    } else if (location.hash === "#makepost") {
        renderCreatePostView();
    } else if (location.hash === '#user') {
        renderUserView();
    } else {
        renderPostsView();
    }
}

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

var sgnOutBtn = $('#btnsgnout').click(function () {
    Parse.User.logOut().then(
        function () {
            toastr.success('You successfully logged out!');
            renderLoginView();
            //copmpileTemplate(getUsername());
        },
        function () {
            toastr.error('There was an error while logging out! :(')
        });
});
var userBtn = $('#user');

var headers = {
    "X-Parse-Application-Id": "oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92",
    "X-Parse-REST-API-Key": "cgUc5R9lH0nea12lwiPtyBURvi6qhfREGPkAww6x",
    "X-Parse-Session-Token": "r:ibKBnfwBNGfkNBSNbkN7kyaFm"
};
var queryURL = "https://api.parse.com/1/classes/";
if (!Parse.User.current()) {
    renderLoginView();
} else {
    if (location.hash !== '#posts') {
        location.assign('#posts');
    } else {
        renderPostsView();
    }
}

function renderRegisterView() {
    $('#mainContent').load('partials/register.html', function () {
        $('#signup').submit(signUpUser);
        $('#btnsgnin').click(renderLoginView);
    });
    userBtn.hide();
    sgnOutBtn.hide();
}

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

function renderLoginView() {
    $('#mainContent').load('partials/login.html', function () {
        $('#signin').submit(signInUser);
        $('#btnrgstr').click(renderRegisterView);
    });
    userBtn.hide();
    sgnOutBtn.hide();
}

function renderPostsView() {
    userBtn.show();
    sgnOutBtn.show();

    $('#posts').addClass('active');

    var data;
    var query = new Parse.Query('Post');
    query.ascending('day');
    query.greaterThan('day', new Date());
    query.greaterThan('seats', 0);
    query.find().then(function (res) {
        data = res;
        generatePostsFromTemplate(data, '#post-template');
    }, function (err) {
        console.log(err);
    });
}

function generatePostsFromTemplate(data, tamplateSelector) {
    data = {posts: data};

    var templateSource = $(tamplateSelector).html();
    var template = Handlebars.compile(templateSource);

    $('#mainContent').html(template(data));

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

function renderCreatePostView() {
    $('#makepost').addClass('active');

    $('#mainContent').load('partials/createPost.html', function () {
        $('#btnrst').click(function () {
            $('#createpostcntnr form').trigger("reset");
        });
        setInitialDateToUI();
        $('#createpostcntnr').submit(createPost);
    });
}

function renderUserView() {
    $('#user').addClass('active');

    $('#mainContent').html('');

    // TODO: Figure out how to run them in this specific order, synchronously

    getUpcomingPostsByUser();
    getPastPostsByUser();
    getOtherPostsOfUser();
}

function generateUserPosts(posts, type){
    var data = {
        type: type,
        posts: posts
    };

    var templateSource = $('#user-post-template').html();
    var template = Handlebars.compile(templateSource);

    $('#mainContent').append(template(data));
}

function signInUser() {
    var username = $('#inputUsername').val().toLowerCase(),
        password = $('#inputPassword').val();

    if (!Parse.User.current()) {
        Parse.User.logIn(username, password)
            .then(function () {
                toastr.success('Successfully logged in!');
                //renderPostsView();
                location.assign('#posts');
                //copmpileTemplate(getUsername());
            }, function (err) {
                console.log(err);
                toastr.error('Error ' + err.code + ': ' + err.message);
            });
    } else {
        toastr.info('You are already logged in!');
        renderPostsView();
    }

    return false;
}

function signUpUser() {
    var emailRegEx = /\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/ig;
    var username = $('#registerUsername').val(),
        fName = $('#registerFName').val(),
        lName = $('#registerLName').val(),
        email = $('#registerEmail').val(),
        password = $('#registerPassword').val();
    var deferred = new Promise(function (resolve, reject) {
        if (!(emailRegEx.exec(email))) {
            reject('Invalid Email!');
            return;
        }
        if (password.length < 6) {
            reject('Password must contain 6 or more characters');
            return;
        }
        if (username.length < 5) {
            reject('Username must contain 5 or more characters');
            return;
        }

        resolve({
            username: username.toLowerCase(),
            password: password,
            email: email,
            fName: fName,
            lName: lName
        });

    }).then(function (values) {
            Parse.User.signUp(values.username, values.password,
                {email: values.email, fName: values.fName, lName: values.lName})
                .then(function () {
                    toastr.success('Successfully signed up!');
                    renderPostsView();
                },
                function (err) {
                    console.log(err);
                    toastr.error('Error ' + err.code + ': ' + err.message);
                });
        },
        function (error) {
            toastr.error(error);
        });
    return false;
}

function createPost() {
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
        price = $('#priceslct option:selected').text(),
        created = new Date();

    var numberRegEx = /^(\+359|0)\s?8(\d{2}\s\d{6}|[789]\d{7})$/igm;

    if (day - created < 0) {
        toastr.error('You cannot create a post that is due previous date!');
        return false;
    }

    if (from === to) {
        toastr.error('You must travel from/to a town different to the place of departure!');
        return false;
    }

    if (!(numberRegEx.exec(contact))) {
        toastr.error('Mobile number is not in a valid BG format!');
        return false;
    }

    if (title.length < 10 || title.length > 30) {
        toastr.info('Title is too short or too long, converted to default format!');
        title = from + ' - ' + to + ' [' + day.getDate() + '/' + ((day.getMonth() * 1) + 1) + '/' + day.getFullYear() + '] ' + ' (' + author + ')';
    }

    var post = new Post();
    post.create(author, title, contact, from, to, day, seats, price);

    location.assign('#posts');

    return false;
}

function getUpcomingPostsByUser() {
    var query = new Parse.Query('Post');
    query.equalTo('user', Parse.User.current())
        .greaterThanOrEqualTo('day', new Date())
        .find()
        .then(function (posts) {
            generateUserPosts(posts, 'Panding posts!');
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
            generateUserPosts(posts, 'Past trips!')
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

        if (i === (count-1)) {
            query.get(postIDs[i]).then(function(post) {
                posts.push(post);
                generateUserPosts(posts, 'Your trips with others!');
            });
        } else {
            query.get(postIDs[i]).then(function(post) {
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

function setInitialDateToUI() {
    $('#dd option:eq(' + (getCurrentDate().date - 1) + ')').attr('selected', true);
    $('#mm option:eq(' + (getCurrentDate().month) + ')').attr('selected', true);
}

function getUsername() {
    var data;

    if (Parse.User.current()) {
        data = Parse.User.current().getUsername();
    }
    else {
        data = 'Sign in!';
    }

    return data;
}