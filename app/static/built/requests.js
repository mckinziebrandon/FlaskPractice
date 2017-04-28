/* requests.js: Handles the majority of ajax calls, POST/DELETE, in particular. */
class UserRequest {
    // Default constructor.
    constructor() {
        this.deleteUser = (nickname) => {
            $.ajax({
                url: `${this.baseURL}/${nickname}`,
                type: 'DELETE',
                success: function () {
                    // Remove user from DOM.
                    $(`.user-row-${nickname}`).remove();
                }
            });
        };
        this.baseURL = $SCRIPT_ROOT + '/user';
    }
}
/** As in, blog post (sorry about naming, I know . . . ) */
class UserPostRequest {
    constructor() {
        this.deleteUserPost = (postID) => {
            $.ajax({
                url: `${this.baseURL}/${postID}`,
                type: 'DELETE',
                success: function () {
                    // Removing a single post.
                    $(`.post-row-${postID}`).remove();
                }
            });
        };
        this.baseURL = $SCRIPT_ROOT + '/user_post';
    }
}
class UserListRequest {
    constructor() {
        this.get = () => {
            console.log("UserList get request . . . ");
            $.get(this.url, function (users) {
                console.log(`users (get): ${users}`);
            });
        };
        this.post = (nickname) => {
            // I prefer the explicit notation of $.ajax to
            // that of $.post.
            console.log("UserList post request . . . ");
            let self = this;
            $.ajax({
                type: 'POST',
                url: self.url,
                data: { 'nickname': nickname },
                success: function (response) {
                    self.display(response);
                }
            });
        };
        /** Insert data response into DOM. */
        this.display = (userPosts) => {
            let requestDisplay = $('#request-display');
            requestDisplay.html(` ${userPosts}`);
            if (userPosts.constructor == Array) {
                userPosts.forEach(function (userPost) {
                    let body = userPost.body;
                    requestDisplay.append(`<p>${body}</p>`);
                });
            }
        };
        this.url = $SCRIPT_ROOT + '/user';
    }
}
$(document).ready(function () {
    let userRequest = new UserRequest();
    let userListRequest = new UserListRequest();
    let userPostRequest = new UserPostRequest();
    /** Handle DELETE requests. */
    $('.delete-user .btn').on('click', function (e) {
        userRequest.deleteUser($(this).attr('nickname'));
    });
    $('.delete-post .btn').on('click', function (e) {
        userPostRequest.deleteUserPost($(this).attr('post-id'));
    });
    /** Handle POST requests associated with forms.
      *
      * - Info: UserForm has two fields:
      *   - nickname: string;
      *   - post: text (area);
      *
      * - Actions: Update database via . . .
      *   - POST request to UserListAPI.
      *   - POST request to PostListAPI.
      */
    $('.user-form .submit-btn').click(function (e) {
        // Extract values from user form(s).
        let nickname = $(':input[name="nickname"]');
        let userPost = $(':input[name="post"]');
        // Post for user name.
        userListRequest.post(nickname.val());
        // Post for userPost.
        $.post($SCRIPT_ROOT + '/user_post', {
            'nickname': nickname.val(),
            'post': userPost.val()
        }, function (userPost) {
            let userName = userPost.author.nickname;
            let postBody = userPost.body;
            let timestamp = userPost.timestamp;
            if (!$(`.user-row-${userName}`).length) {
                $('.user-post-list').prepend(`<p>New user ${userName} registered.</p>`);
            }
        });
        e.preventDefault();
        e.stopPropagation();
    });
    /** Handle POST requests for message-only forms.
      *
      * - Info: BasicForm has one field:
      *   - message: simple <input type=text/>;
      */
    $('.basic-form .submit-btn').on('click', function (e) {
        // Display a modal on submission.
        let message = $(':input[name="message"]');
        $('.modal').modal('show');
        $('.modal-body').html(`<p>Message: ${message.val()}</p>`);
    });
    $('.basic-form').on('keydown', function (e) {
        if (e.which == 13) {
            $('.basic-form .submit-btn').click();
        }
    });
});
//# sourceMappingURL=requests.js.map