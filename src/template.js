module.exports = function (ngModule) {
    'use strict';

    ngModule.run(runFunc);

    runFunc.$inject = ['$templateCache'];

    function runFunc($templateCache) {
        var templates = [
            'blank.html',
            'error.html'
        ], i = 0, max = templates.length, curr;

        for (; i < max; i++) {
            curr = templates[i];
            $templateCache.put('gdeic/template/' + curr, require('./template/' + curr));
        }
    }
};