/* requests.js: Handles the majority of ajax calls, POST/DELETE, in particular.
 *
 * Available resource APIs:
 *  - UserAPI:
 *      - GET, POST, DELETE
 *      - Required args: nickname
 *  - PostAPI:
 *      - GET, POST, DELETE
 *      - Required args: post_id
 *
 */

$(document).ready(function() {

    /** Handle DELETE requests. */
    $('.delete-request .btn').click(function(e) {
        var url = $(this).attr('url');
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(result) {
                /* ----- DOM Updating ----- */
                if (url.includes('user_post')) {
                    var postID = new String(url)
                            .substring(url.lastIndexOf('/') + 1);
                    $('.post-row-'+postID).remove();
                } else {
                    var name = new String(url)
                            .substring(url.lastIndexOf('/') + 1)
                            .toLowerCase();
                    $('.user-row-'+name).remove();
                }
                location.reload();
            }
        });
    });

    /** Handle POST requests associated with forms. */
    $('.user-form .submit-btn').click(function(e) {

        e.preventDefault();
        e.stopPropagation();

        // Extract values from user form(s).
        var nickname = $(':input[name="nickname"]');
        var userPost = $(':input[name="post"]');

        // Post for user name.
        $.post($SCRIPT_ROOT + '/user/' + nickname.val(), {
            'nickname': nickname.val()
        });

        // Post for userPost.
        $.post($SCRIPT_ROOT + '/new_user_post', {
            'nickname': nickname.val(),
            'post': userPost.val()
        }, function(data) {
            location.reload();
        });
    });

    /** Handle POST requests for message-only forms. */
    $('.basic-form .submit-btn').on('click', function(e) {

        // Display a modal on submission.
        var message = $(':input[name="message"]');
        $('.modal').modal('show');
        $('.modal-body').html("<p>Message: " + message.val() + "</p>");
    });

    $('.basic-form').keydown(function(e) {
        if (e.which == 13) {
            $('.basic-form .submit-btn').click();
        }
    });

});

