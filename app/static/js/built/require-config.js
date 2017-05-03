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
require.config({
    paths: {
        'knockout': 'lib/knockout-3.4.2'
    }
});
//# sourceMappingURL=require-config.js.map