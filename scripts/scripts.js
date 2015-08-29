Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");

function locationHashChanged() {
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
        },
        function () {
            toastr.error('There was an error while logging out! :(')
        });
});
var userBtn = $('#user');

var headers  = {
    "X-Parse-Application-Id": "oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92",
    "X-Parse-REST-API-Key": "cgUc5R9lH0nea12lwiPtyBURvi6qhfREGPkAww6x",
    "X-Parse-Session-Token": "r:ibKBnfwBNGfkNBSNbkN7kyaFm"
};
var queryURL = "https://api.parse.com/1/classes/";
var data;

if (!Parse.User.current()) {
    renderLoginView();
} else {
    renderPostsView();
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
            'price': price
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

    $('#mainContent').load('partials/posts.html');


    var query = new Parse.Query('Post');
    var data;
    query.ascending('day');
    query.greaterThan('day', new Date());
    query.find().then(function(res) {
        console.log(res);
    }, function(err) {
        console.log(err);
    })
}

function renderCreatePostView() {
    $('#mainContent').load('partials/createPost.html', function () {
        $('#btnrst').click(function () {
            $('#createpostcntnr form').trigger("reset");
        });
        $('#createpostcntnr').submit(createPost);
    });
}

function renderUserView() {
    $('#mainContent').load('partials/user.html');
    getPostsByUser();
}

function signInUser() {
    var username = $('#inputUsername').val().toLowerCase(),
        password = $('#inputPassword').val();

    if (!Parse.User.current()) {
        Parse.User.logIn(username, password)
            .then(function () {
                toastr.success('Successfully logged in!');
                renderPostsView();
            },
            function (err) {
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
    var username   = $('#registerUsername').val(),
        fName      = $('#registerFName').val(),
        lName      = $('#registerLName').val(),
        email      = $('#registerEmail').val(),
        password   = $('#registerPassword').val();
    var deferred   = new Promise(function (resolve, reject) {
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
    var author  = Parse.User.current().get('username'),
        title   = $('#titleinpt').val(),
        contact = $('#contactinpt').val(),
        from    = $('#fromslct option:selected').text(),
        to      = $('#toslct option:selected').text(),
        day     = new Date($('#yy option:selected').text(),
                    ($('#mm option:selected').text()*1) - 1,
                    $('#dd option:selected').text(),
                    $('#hourslct option:selected').text(),
                    $('#minuteslct option:selected').text(), 0),
        seats   = $('#seatsslct option:selected').text(),
        price   = $('#priceslct option:selected').text(),
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
        title = from + ' - ' + to + ' [' + day.getDate() + '/' + ((day.getMonth()*1)+1) + '/' + day.getFullYear() + '] ' + ' (' + author + ')';
    }

    var post = new Post();
    post.create(author, title, contact, from, to, day, seats, price);

    location.assign('#posts');

    return false;
}

function getPostsByUser() {
    var query = new Parse.Query('Post');
    query.equalTo('user', Parse.User.current())
        .find()
        .then(function(posts) {
        console.log(posts);
    }, function(err) {
        console.log(err);
    })
}