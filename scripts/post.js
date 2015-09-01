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
                    toastr.info('You added a new post: ' + post.get('title'));
                },
                error: function (post, error) {
                    toastr.error(post);
                    toastr.error(error);
                }
            });
        }
    });

    return post;
}();

export default Post;