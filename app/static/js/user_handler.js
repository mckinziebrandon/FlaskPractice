/**
 * Created by brandon on 4/14/17.
 */

$(document).ready(function() {
    var userName = $('#user-form :input[name="userName"]');
    var userEmail = $('#user-form :input[name="userEmail"]');

    function onSubmit(event) {
        if (!userName.val() || !userEmail.val()) {
            console.log("You screwed up.");
            return;
        }
    }

    $('#user-submit').click(onSubmit);
});
