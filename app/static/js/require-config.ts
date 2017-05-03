/**
 * Entry point for requireJS to use.
 *
 * Examples:
 *
 * __________  Single-Page App: __________
 *
 * // For any third party dependencies, like jQuery,
 * // place them in the lib folder.
 * // Configure loading modules from the lib directory,
 * // except for 'app' ones, which are in a sibling
 * // directory.
 *      requirejs.config({
 *          baseUrl: 'lib',
 *          paths: {
 *              app: '../app'
 *          }
 *          });
 *
 * // Start loading the main app file. Put all of
 * // your application logic in there.
 *      requirejs(['app/main']);
 */

// requirejs(["games/util"], function(util) {
//     //This function is called when scripts/helper/util.js is loaded.
//     //If util.js calls define(), then this function is not fired until
//     //util's dependencies have loaded, and the util argument will hold
//     //the module value for "helper/util".
// });

declare var require: any;
require.config({
    paths: {
        'knockout': 'lib/knockout-3.4.2'
    }
})