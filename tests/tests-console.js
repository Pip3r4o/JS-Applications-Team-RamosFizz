//run cmd in thid directory and type 'mocha tests-console'. If you have a problem running the tests, watch Doncho's video about running console tests.
import userControllers from  'scripts/userControllers.js';
import renderer from 'scripts/renderer.js';
import validator from 'scripts/validator.js';
import controllers from 'scripts/controllers.js';
var expect=require('chai').expect;


describe('Validator tests with HTML reporter', function () {
    describe('Validator tests - postCreationValidation.destinationValidation', function () {
        it('Expect to return false, when user has chose same city names', function () {
            var actual = validator.postCreationValidation.destinationValidation('Sofia', 'Sofia');

            expect(actual).to.be.false;
        });

        it('Expect to return true, when user has chose different city names', function () {
            var actual = validator.postCreationValidation.destinationValidation('Sofia', 'Plovdiv');

            expect(actual).to.be.true;
        })
    });

    describe('Validator tests - postCreationValidation.dateValidation', function () {
        it('Expect to return true, when user is trying to create post today', function () {
            var todayDate = new Date();
            var actual = validator.postCreationValidation.dateValidation(todayDate);

            expect(actual).to.be.true;
        });

        it('Expect to return false, when user is trying to create post yesterday', function () {
            var todayDate = new Date();
            var yesterday = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1)
            var actual = validator.postCreationValidation.dateValidation(yesterday);

            expect(actual).to.be.false;
        });
    });

    describe('Validator tests - postCreationValidation.mobileNumberValidation', function () {
        it('Expect to return true, when mobile number is valid bulgarian number', function () {
            var validBulgarianMobileNumber = '0888777999';
            var actual = validator.postCreationValidation.mobileNumberValidation(validBulgarianMobileNumber);

            expect(actual).to.be.true;
        });

        it('Expect to return false, when mobile number is with invalid first 3 numbers and valid length', function () {
            var invalidBulgarianMobileNumber = '0666777999';
            var actual = validator.postCreationValidation.mobileNumberValidation(invalidBulgarianMobileNumber);

            expect(actual).to.be.false;
        });

        it('Expect to return false, when mobile number is with valid  first 3 numbers and invalid length', function () {
            var invalidBulgarianMobileNumber = '088855599';
            var actual = validator.postCreationValidation.mobileNumberValidation(invalidBulgarianMobileNumber);

            expect(actual).to.be.false;
        });
    });

    describe('Validator tests - postCreationValidation.titleValidation', function () {
        it('Expect to return true, when title is in range', function () {
            var validTitle = '123456789123456789';
            var actual = validator.postCreationValidation.titleValidation(validTitle);

            expect(actual).to.be.true;
        });

        it('Expect to return false, when title is too short', function () {
            var shortInvalidTitle = '1';
            var actual = validator.postCreationValidation.titleValidation(shortInvalidTitle);

            expect(actual).to.be.false;
        });

        it('Expect to return false, when title is too long', function () {
            var longInvalidTitle = '123456789123456789123456789123456789';
            var actual = validator.postCreationValidation.titleValidation(longInvalidTitle);

            expect(actual).to.be.false;
        });
    });

    describe('Validator tests - userRegistrationValidation.emailValidation', function () {
        it('Expect to return true, when email is valid', function () {
            var validMail = 'user@gmail.com';
            var actual = validator.userRegistrationValidation.emailValidation(validMail);

            expect(actual).to.be.true;
        });

        it('Expect to return false, when email has not "@"', function () {
            var invalidMail = 'user.gmail.com';
            var actual = validator.userRegistrationValidation.emailValidation(invalidMail);

            expect(actual).to.be.false;
        });

        it('Expect to return false, when email has no valid end notation', function () {
            var invalidMail = 'user@gmail.a';
            var actual = validator.userRegistrationValidation.emailValidation(invalidMail);

            expect(actual).to.be.false;
        });

        it('Expect to return false, when email has no valid domain name', function () {
            var invalidMail = 'user@a.bg';
            var actual = validator.userRegistrationValidation.emailValidation(invalidMail);

            expect(actual).to.be.false;
        });
    });

    describe('Validator tests - userRegistrationValidation.passwordLengthValidation', function () {
        it('Expect to return true, when password symbols are in range', function () {
            var validPass = '123456';
            var actual = validator.userRegistrationValidation.passwordLengthValidation(validPass);

            expect(actual).to.be.true;
        });

        it('Expect to return false, when password symbols are not enough', function () {
            var shortInvalidTitle = '12345';
            var actual = validator.userRegistrationValidation.passwordLengthValidation(shortInvalidTitle);

            expect(actual).to.be.false;
        });
    });

    describe('Validator tests - userRegistrationValidation.usernameValidation', function () {
        it('Expect to return true, when username is valid between 8 and 20 symbols, it is alphanumeric and has only dots(.) or/and underscores(_)', function () {
            var validUserName = 'user_23.4'
            var actual = validator.userRegistrationValidation.usernameValidation(validUserName);

            expect(actual).to.be.true;
        });

        it('Expect to return false, when username with too short name is presented', function () {
            var shortInvalidUserName = 'user';
            var actual = validator.userRegistrationValidation.usernameValidation(shortInvalidUserName);

            expect(actual).to.be.false;
        });

        it('Expect to return false, when username with too long name is presented', function () {
            var longInvalidUserName = 'user_user_user_user_user_user';
            var actual = validator.userRegistrationValidation.usernameValidation(longInvalidUserName);

            expect(actual).to.be.false;
        });

        it('Expect to return false, when username with name in range of symbols, but with invalid ones', function () {
            var symbolsInvalidName = 'user$$$$$';
            var actual = validator.userRegistrationValidation.usernameValidation(symbolsInvalidName);

            expect(actual).to.be.false;
        });
    });
});

describe('Controllers tests with HTML reporter', function () {
    before(function () {
        Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");
    });
    beforeEach(function () {
        if (Parse.User.current()) {
            Parse.User.logOut();
        }
    });

    describe('Controllers tests - userControllers.signUp', function () {

        it('Expect to sign up, when valid input is presented', function (done) {
            var username = 'unit_test',
                fName = 'Unit',
                lName = 'Test',
                email = 'validemail@abv.bg',
                password = 'validPassword';

            userControllers.signUp(username, fName, lName, email, password);

            Parse.User.logIn(username, password)
                .then(function () {
                    var user = Parse.User.current();
                    var actual = user.get("username");

                    expect(actual).to.eql(username);
                    Parse.User.logOut();
                    done();
                }
            )
        });
    });

    describe('Controllers tests - userControllers.signIn', function () {
        it('Expect to log in when valid username and password are provided', function (done) {
            userControllers.signIn('unit_test', 'validPassword');

            setTimeout(function () {
                var user = Parse.User.current();
                var actual = user.get("username");

                expect(actual).to.eql('unit_test');

                Parse.User.logOut();
                done();
            }, 1500);
        });

        it('Expect not to log in when invalid username and password are provided', function (done) {
            userControllers.signIn('invalid', '123456');

            setTimeout(function () {
                var actual = Parse.User.current();

                expect(actual).to.eql(null);

                Parse.User.logOut();
                done();
            }, 1500);
        });
    });

    describe('Controllers tests - userControllers.signOut', function () {
        it('Expect to log out when logged in', function (done) {
            Parse.User.logIn('unit_test', 'validPassword')
                .then(function () {
                    userControllers.signOut();
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                });

            setTimeout(function () {
                var user = Parse.User.current();

                expect(user).to.eql(null);
                done();
            }, 1500);
        });
    });

    describe('Controllers tests - controllers.createPost', function () {

        it('Expect to create a post, when valid input is entered', function (done) {
            var username = 'unit_test',
                password = 'validPassword',
                author = 'Mbyte',
                title = 'thisIsJustATest' + new Date().getMilliseconds(),
                contact = '0888876876',
                from = 'Sofia',
                to = 'Varna',
                day = new Date(),
                seats = 2,
                price = 'Free';

            Parse.User.logIn(username, password)
                .then(function () {
                    controllers.createPost(author, title, contact, from, to, day, seats, price);
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                })
                .then(function () {
                    var query = new Parse.Query('Post');
                    query.contains('author', author);
                    query.contains('title', title);
                    query.contains('contact', contact);
                    query.find().then(function (result) {
                        var actual = result;
                        expect(actual.length).to.equal(1);
                        done();
                    });
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                });
        });


        it('Expect to create a post with default title, when invalid title is entered', function (done) {
            var username = 'unit_test',
                password = 'validPassword',
                author = 'Mbyte',
                title = 'Test' + new Date().getMilliseconds(),
                contact = '0888876876',
                from = 'Sofia',
                to = 'Varna',
                day = new Date(),
                seats = 2,
                price = 'Free';

            Parse.User.logIn(username, password)
                .then(function () {
                    controllers.createPost(author, title, contact, from, to, day, seats, price);
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                })
                .then(function () {
                    var query = new Parse.Query('Post');
                    query.contains('author', author);
                    query.contains('title', (from + ' - ' + to + ' [' + day.getDate() + '/' + ((day.getMonth() * 1) + 1) + '/' + day.getFullYear() + '] ' + ' (' + author + ')'));
                    query.contains('contact', contact);
                    query.find().then(function (result) {
                        var actual = result;
                        console.log(actual);
                        setTimeout(function() {
                            expect(actual.length).to.equal(1);
                            done();
                        }, 1000);
                    });
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                });
        });

        it('Expect to not create a post, when same city is entered as start and end destination', function (done) {

            var username = 'unit_test',
                password = 'validPassword',
                author = 'Mbyte',
                title = 'Test' + new Date().getMilliseconds(),
                contact = '0888876876',
                from = 'Sofia',
                to = 'Sofia',
                day = new Date(),
                seats = 2,
                price = 'Free';

            Parse.User.logIn(username, password)
                .then(function () {
                    controllers.createPost(author, title, contact, from, to, day, seats, price);
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                })
                .then(function () {
                    var query = new Parse.Query('Post');
                    query.contains('author', author);
                    query.contains('title', title);
                    query.contains('from', from);
                    query.find().then(function (result) {
                        var actual = result;
                        expect(actual.length).to.equal(0);
                        done();
                    });
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                });
        });

        it('Expect to not create a post, when invalid contact is entered', function (done) {

            var username = 'unit_test',
                password = 'validPassword',
                author = 'Mbyte',
                title = 'Test' + new Date().getMilliseconds(),
                contact = '6876',
                from = 'Sofia',
                to = 'Varna',
                day = new Date(),
                seats = 2,
                price = 'Free';

            Parse.User.logIn(username, password)
                .then(function () {
                    controllers.createPost(author, title, contact, from, to, day, seats, price);
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                })
                .then(function () {
                    var query = new Parse.Query('Post');
                    query.contains('author', author);
                    query.contains('title', title);
                    query.contains('from', from);
                    query.find().then(function (result) {
                        var actual = result;
                        expect(actual.length).to.equal(0);
                        done();
                    });
                }, function (err) {
                    utils.showError('Error ' + err.code + ': ' + err.message);
                });
        });
    });
});

