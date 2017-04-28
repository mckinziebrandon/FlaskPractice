define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HelloViewModel {
        constructor(language, framework) {
            this.language = ko.observable(language);
            this.framework = ko.observable(framework);
        }
    }
    ko.applyBindings(new HelloViewModel('TypeScript', 'Knockout'));
});
//# sourceMappingURL=hello.js.map