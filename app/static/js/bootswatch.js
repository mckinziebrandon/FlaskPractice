/* Macro for using Bootswatch API (theme-changing). */

/** Load JSON-encoded data from api server (using ajax GET HTTP request). */
$.getJSON("https://bootswatch.com/api/3.json", function (data) {

    // Get array of themes. Each entry is an object with properties:
    // - name, description, preview, thumbnail, css, cssMin, cssCdn, less, lessVariables.
    var themes = data.themes;
    // Grab select object(s).
    var themeList = $("ul#theme-options");
    // Fill dropdown with theme names.
    themes.forEach(function(value, index){
        themeList.append($('<li/>')
                .attr('class', 'theme-item')
                .val(index)
                .html('<a href="#">'+value.name+'</a>'));
    });

    // Make a link to the theme upon selction.
    themeList.on('click', '.theme-item', function(e) {
        var theme = themes[$(this).val()];
        $("link#theme-link").attr("href", theme.css);
        $('a#theme-header').text('Theme: ' + theme.name);
        $.post('/new_theme', {'new_theme': theme.name});
    });
}, "json").fail(function(){
    $(".alert").toggleClass("alert-info alert-danger");
    $(".alert h4").text("Failure!");
});
