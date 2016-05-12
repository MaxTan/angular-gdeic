var ngApp = angular.module('ngGdeic', ['ngAnimate', 'ui.bootstrap', 'angular-linq']);

require('./src/prototype')(angular);
require('./src/component')(ngApp);