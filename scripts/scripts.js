Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");

/*
 function locationHashChanged() {
 if (location.hash === "#home") {
 renderHomeView();
 } else if (location.hash === "#posts") {
 renderPostsView();
 } else if (location.hash === "#login") {
 renderLoginView();
 } else {
 renderHomeView();
 }
 }

 window.onhashchange = locationHashChanged;

 function renderHomeView() {

 }

 function renderPostsView() {

 }

 function renderLoginView() {

 }
 */

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
    //renderCreatePostView();
    renderPostsView();
}

function renderRegisterView() {
    $('#mainContent').load('partials/register.html', function () {
        $('#signup').submit(signUpUser);
        $('#btnsgnin').click(renderLoginView);
    });
    sgnOutBtn.hide();
}

function renderLoginView() {
    $('#mainContent').load('partials/login.html', function () {
        $('#signin').submit(signInUser);
        $('#btnrgstr').click(renderRegisterView);
    });
    sgnOutBtn.hide();
}

function renderPostsView() {
    $('#mainContent').load('partials/posts.html');

    sgnOutBtn.show();
}

function renderCreatePostView() {
    $('#mainContent').load('partials/createPost.html');
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