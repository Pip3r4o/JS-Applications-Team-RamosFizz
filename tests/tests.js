/**
 * Created by Antoan on 9/2/2015.
 */

describe('Validator tests - postCreationValidation.destinationValidation',function(){
    it('Expect to return false, when user has chose same city names',function(){
        var actual=validator.postCreationValidation.destinationValidation('Sofia','Sofia');

        expect(actual).to.be.false;
    });

    it('Expect to return true, when user has chose different city names',function(){
        var actual=validator.postCreationValidation.destinationValidation('Sofia','Plovdiv');

        expect(actual).to.be.true;
    })
});

describe('Validator tests - postCreationValidation.dateValidation',function(){
    it('Expect to return true, when user is trying to create post today',function(){
        var todayDate=new Date();
        var actual=validator.postCreationValidation.dateValidation(todayDate);

        expect(actual).to.be.true;
    });

    it('Expect to return false, when user is trying to create post yesterday',function(){
        var todayDate=new Date();
        var yesterday=new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate()-1)
        var actual=validator.postCreationValidation.dateValidation(yesterday);

        expect(actual).to.be.false;
    });
});

describe('Validator tests - postCreationValidation.mobileNumberValidation',function(){
    it('Expect to return true, when mobile number is valid bulgarian number',function(){
        var validBulgarianMobileNumber='0888777999';
        var actual=validator.postCreationValidation.mobileNumberValidation(validBulgarianMobileNumber);

        expect(actual).to.be.true;
    });

    it('Expect to return false, when mobile number is with invalid first 3 numbers and valid length',function(){
        var invalidBulgarianMobileNumber='0666777999';
        var actual=validator.postCreationValidation.mobileNumberValidation(invalidBulgarianMobileNumber);

        expect(actual).to.be.false;
    });

    it('Expect to return false, when mobile number is with valid  first 3 numbers and invalid length',function(){
        var invalidBulgarianMobileNumber='088855599';
        var actual=validator.postCreationValidation.mobileNumberValidation(invalidBulgarianMobileNumber);

        expect(actual).to.be.false;
    });
});

describe('Validator tests - postCreationValidation.titleValidation',function(){
    it('Expect to return true, when title is in range',function(){
        var validTitle='123456789123456789';
        var actual=validator.postCreationValidation.titleValidation(validTitle);

        expect(actual).to.be.true;
    });

    it('Expect to return false, when title is too short',function(){
        var shortInvalidTitle='1';
        var actual=validator.postCreationValidation.titleValidation(shortInvalidTitle);

        expect(actual).to.be.false;
    });

    it('Expect to return false, when title is too long',function(){
        var longInvalidTitle='123456789123456789123456789123456789';
        var actual=validator.postCreationValidation.titleValidation(longInvalidTitle);

        expect(actual).to.be.false;
    });
});

describe('Validator tests - userRegistrationValidation.emailValidation',function(){
    it('Expect to return true, when email is valid',function(){
        var validMail='user@gmail.com';
        var actual=validator.userRegistrationValidation.emailValidation(validMail);

        expect(actual).to.be.true;
    });

    it('Expect to return false, when email has not "@"',function(){
        var invalidMail='user.gmail.com';
        var actual=validator.userRegistrationValidation.emailValidation(invalidMail);

        expect(actual).to.be.false;
    });

    it('Expect to return false, when email has no valid end notation',function(){
        var invalidMail='user@gmail.a';
        var actual=validator.userRegistrationValidation.emailValidation(invalidMail);

        expect(actual).to.be.false;
    });

    it('Expect to return false, when email has no valid domain name',function(){
        var invalidMail='user@a.bg';
        var actual=validator.userRegistrationValidation.emailValidation(invalidMail);

        expect(actual).to.be.false;
    });
});

describe('Validator tests - userRegistrationValidation.passwordLengthValidation',function(){
    it('Expect to return true, when password symbols are in range',function(){
        var validPass='123456';
        var actual=validator.userRegistrationValidation.passwordLengthValidation(validPass);

        expect(actual).to.be.true;
    });

    it('Expect to return false, when password symbols are not enough',function(){
        var shortInvalidTitle='12345';
        var actual=validator.userRegistrationValidation.passwordLengthValidation(shortInvalidTitle);

        expect(actual).to.be.false;
    });
});

describe('Validator tests - userRegistrationValidation.usernameValidation',function(){
    it('Expect to return true, when username is valid between 8 and 20 symbols, it is alphanumeric and has only dots(.) or/and underscores(_)',function(){
        var validUserName='user_23.4'
        var actual=validator.userRegistrationValidation.usernameValidation(validUserName);

        expect(actual).to.be.true;
    });

    it('Expect to return false, when username with too short name is presented',function(){
        var shortInvalidUserName='user';
        var actual=validator.userRegistrationValidation.usernameValidation(shortInvalidUserName);

        expect(actual).to.be.false;
    });

    it('Expect to return false, when username with too long name is presented',function(){
        var longInvalidUserName='user_user_user_user_user_user';
        var actual=validator.userRegistrationValidation.usernameValidation(longInvalidUserName);

        expect(actual).to.be.false;
    });

    it('Expect to return false, when username with name in range of symbols, but with invalid ones',function(){
        var symbolsInvalidName='user$$$$$';
        var actual=validator.userRegistrationValidation.usernameValidation(symbolsInvalidName);

        expect(actual).to.be.false;
    });
});

