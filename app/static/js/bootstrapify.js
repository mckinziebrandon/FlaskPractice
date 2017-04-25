/* Assign certain elements to bootstrap classes by default, so
 * less typing for me.
 */
$(document).ready(function() {

    // Pretty tables.
    $('table').addClass('table table-striped table-hover');

    // Them nav drops tho.
    $('a.dropdown-toggle').attr({
        'data-toggle': 'dropdown',
        'role': 'button',
        'aria-haspopup': 'true',
        'aria-has-expanded': 'false'
    }).append('<span class="caret"></span>');

});