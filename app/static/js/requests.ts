/* requests.js: Handles the majority of ajax calls, POST/DELETE, in particular. */

// Global vars.
// http://stackoverflow.com/questions/13252225
declare var $SCRIPT_ROOT: string;

class UserRequest {
     baseURL: string;

    // Default constructor.
    constructor() {
        this.baseURL = $SCRIPT_ROOT + '/user';
    }

    deleteUser = (nickname: string): void => {
        $.ajax({
            url: `${ this.baseURL }/${ nickname }`,
            type: 'DELETE',
            success: function() {
                // Remove user from DOM.
                $(`.user-row-${ nickname }`).remove();
            }
        });
    }
}

/** As in, blog post (sorry about naming, I know . . . ) */
class UserPostRequest {
     baseURL: string;

    constructor() {
        this.baseURL = $SCRIPT_ROOT + '/user_post';
    }

    deleteUserPost = (postID: string): void => {
        $.ajax({
            url: `${ this.baseURL }/${ postID }`,
            type: 'DELETE',
            success: function() {
                // Removing a single post.
                $(`.post-row-${ postID }`).remove();
            }
        });
    }
}

class UserListRequest {
    url: string;

    constructor() {
        this.url = $SCRIPT_ROOT + '/user';
    }

    get = (): void => {
        console.log("UserList get request . . . ");
        $.get(this.url, function(users) {
            console.log(`users (get): ${ users }`);
        })
    }

    post = (nickname: string): void => {
        // I prefer the explicit notation of $.ajax to
        // that of $.post.
        console.log("UserList post request . . . ");
        let self = this;
        $.ajax({
            type: 'POST',
            url: self.url,
            data: {'nickname': nickname},
            success: function(response) {
                self.display(response);
            }
        });
    }

    /** Insert data response into DOM. */
    display = (userPosts: any[]): void => {
        let requestDisplay = $('#request-display');
        requestDisplay.html(` ${ userPosts }`);
        if (userPosts.constructor == Array) {
            userPosts.forEach(function(userPost) {
                let body = userPost.body;
                requestDisplay.append(`<p>${ body }</p>`);
            })
        }
    }
}

$(document).ready(function() {

    let userRequest = new UserRequest();
    let userListRequest = new UserListRequest();
    let userPostRequest = new UserPostRequest();

    /* Handle DELETE requests. */

    // Delete a user upon click.
    $('.delete-user .btn').on('click', function(e) {
        userRequest.deleteUser($(this).attr('nickname'));
    });

    // Delete a post of a given user upon click.
    $('.delete-post .btn').on('click', function(e) {
        userPostRequest.deleteUserPost($(this).attr('post-id'));
    });

    /** Handle POST requests associated with UserForm.
      * 
      * - Info: UserForm has two fields:
      *   - nickname: string;
      *   - post: text (area);
      * 
      * - Actions: Update database via . . . 
      *   - POST request to UserListAPI.
      *   - POST request to PostListAPI.
      */
    $('.user-form .submit-btn').click(function(e) {

        // Extract values from user form(s).
        let nickname = $(':input[name="nickname"]');
        let userPost = $(':input[name="post"]');

        // Post for user name.
        userListRequest.post(nickname.val());

        // Post for userPost.
        $.post($SCRIPT_ROOT + '/user_post', {
            'nickname': nickname.val(),
            'post': userPost.val()
        }, function(userPost) {
            // :(
            location.reload();

            /* TODO: .....
            let userName = userPost.author.nickname;
            let postBody = userPost.body;
            let timestamp = userPost.timestamp;

            if (!$(`.user-row-${ userName }`).length) {
                $('.user-post-list').prepend(
                    `<p>New user ${ userName } registered.</p>`);
            } else {
                let ul = $(`.user-row-${ userName } #${ userName }-posts`)
                    .find('ul');
                let postRow = $(`<div class='row post-row-${ userPost.id}'></div>`)
                postRow
                    .append(`<div class='col-sm-10'></div>`)
                    .append(`<li class='justify-content-between'></li>`);
            }
            */

        });

        e.preventDefault();
        e.stopPropagation();

    });

    /** Handle POST requests for message-only forms. 
      * 
      * - Info: BasicForm has one field:
      *   - message: simple <input type=text/>;
      */
    $('.basic-form .submit-btn').on('click', function(e) {

        // Display a modal on submission.
        let message = $(':input[name="message"]');
        $('.modal').modal('show');
        $('.modal-body').html(`<p>Message: ${ message.val() }</p>`);
    });

    $('.basic-form').on('keydown', function(e) {
        if (e.which == 13) {
            $('.basic-form .submit-btn').click();
        }
    });

});

