var utils = (function () {
    var isTesting = false;

    function showInfo(msg) {
        if (isTesting) {
            console.log('info: ' + msg);
        }
        else {
            toastr.info(msg);
        }
    }

    function showError(msg) {
        if (isTesting) {
            console.log('error: ' + msg);
        }
        else {
            toastr.error(msg);
        }
    }

    function showSuccess(msg) {
        if (isTesting) {
            console.log('success ' + msg);
        }
        else {
            toastr.success(msg);
        }
    }

    return {
        showError: showError,
        showInfo: showInfo,
        showSuccess: showSuccess
    }
})();

export default utils;