import utils from './utils.js';
Parse.initialize("oXLbvSKFI0HQJAT5QCpStZbr0Lx5Upt4j6MJFh92", "KAtLgD0vTTYionS73fIxYY1XYWGedKaUgXvzFd26");

var Post = function() {
    var post = Parse.Object.extend('Post', {
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
                    utils.showInfo('You added a new post: ' + post.get('title'));
                },
                error: function (post, error) {
                    utils.showError(post);
                    utils.showError(error);
                }
            });
        }
    });

    return post;
}();

export default Post;