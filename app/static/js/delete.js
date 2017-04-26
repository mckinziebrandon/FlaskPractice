



$(document).ready(function() {

    $('.delete-model .btn').on('click', function(e) {
        var url = $(this).attr('url');
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(result) {
                console.log('SUCCESS', result);
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


    var userForm = $('.user-form');
    console.log('userForm', userForm);
    console.log('userForm.find', userForm.find('.submit-btn'));
    userForm.find('.submit-btn').on('click', function(e) {

        //e.preventDefault();
        //e.stopPropagation();

        console.log("submit triggered");

        var nickname = $(':input[name="nickname"]');
        console.log('nickname:', nickname.val());

        // Post for user name.
        $.post($SCRIPT_ROOT + '/user', {
            'nickname': nickname.val()
        }, function(data) {
            console.log('nick post data:', data);
        });


        var userPost = $(':input[name="post"]');
        console.log('userPost:', userPost.val());

        // Post for userPost.
        $.post($SCRIPT_ROOT + '/user_post', {
            'nickname': nickname.val(),
            'post': userPost.val()
        }, function(data) {
            console.log('userPost data:', data);
            location.reload();
        });
    });

});

