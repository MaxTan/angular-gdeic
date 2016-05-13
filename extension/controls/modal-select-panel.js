module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicModalSelectPanel', gdeicModalSelectPanel);

    gdeicModalSelectPanel.$inject = ['$gdeic'];

    function gdeicModalSelectPanel($gdeic) {
        return {
            restrict: 'EA',
            scope: {
                isShow: '=',
                headerTitle: '@',
                sourceList: '=',
                keyProperty: '@',
                valueProperty: '@',
                filterProperty: '@',
                ngModel: '=',
                multiSelect: '='
            },
            template: function (tElement, tAttrs) {
                var strClass, strInput;
                if (tAttrs.multiSelect === 'true') {
                    strClass = 'checkbox';
                    strInput = '<label ng-class="{\'highlight\': isCheck(item)}">'
                        + '<input type="checkbox" name="items" ng-checked="isCheck(item)" ng-click="selectItem(item)" />&nbsp;&nbsp;{{item.' + tAttrs.valueProperty + '}}'
                        + '</label>';
                } else {
                    strClass = 'radio';
                    strInput = '<label ng-class="{\'highlight\': item.' + tAttrs.keyProperty + ' === selectedItem.' + tAttrs.keyProperty + ' }">'
                        + '<input type="radio" name="items" ng-checked="isCheck(item)" ng-click="selectItem(item)" />&nbsp;&nbsp;{{item.' + tAttrs.valueProperty + '}}'
                        + '</label>';
                }

                var template = '<div gradual-show="isShow" style="position:absolute; width:100%; height:100%; top:0">'
                    + '<div class="modal-select">'
                    + '<div class="modal-select-header">'
                    + '<b>{{headerTitle}}</b>'
                    + '<button type="button" class="close" ng-click="isShow = !isShow">&times;</button>'
                    + '</div>'
                    + '<div class="modal-select-filter" ng-if="filterProperty">'
                    + '<div class="input-group">'
                    + '<input type="text" class="form-control" ng-model="search.' + tAttrs.filterProperty + '">'
                    + '<span class="input-group-addon"><span class="glyphicon glyphicon-filter"></span></span>'
                    + '</div>'
                    + '</div>'
                    + '<div class="modal-select-body">'
                    + '<div class="text-center" ng-show="!sourceList"><br />'
                    + '<span class="fa fa-spinner anime-spinner"></span>&nbsp;正在加载..'
                    + '</div>'
                    + '<p ng-show="sourceList.length === 0">无可选项</p>'
                    + '<div class="' + strClass + '" ng-repeat="item in sourceList' + (angular.isUndefined(tAttrs.filterProperty) ? '' : ' | filter:search') + '" ng-show="sourceList">'
                    + strInput
                    + '</div>'
                    + '</div>'
                    + '<div class="modal-select-footer">'
                    + '<div class="pull-right">'
                    + '<button type="button" class="btn btn-default btn-xs" ng-click="isShow = !isShow">'
                    + '<span class="glyphicon glyphicon-remove"></span> 取消' +
                    '</button>&nbsp;'
                    + '<button type="button" class="btn btn-warning btn-xs" ng-click="clear()">'
                    + '<span class="glyphicon glyphicon-trash"></span> 清空'
                    + '</button>&nbsp;'
                    + '<button type="button" class="btn btn-primary btn-xs" ng-click="ok()">'
                    + '<span class="glyphicon glyphicon-ok"></span> 确定'
                    + '</button>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                return template;
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                var _originalValue;
                if (scope.multiSelect === true) {
                    _originalValue = [];
                } else {
                    _originalValue = {};
                    Object.defineProperty(_originalValue, iAttrs.keyProperty, {
                        value: ''
                    });
                }

                if (angular.isDefined(scope.filterProperty)) {
                    scope.search = {};
                }

                scope.$watch('isShow', function (newValue) {
                    if (newValue) {
                        if (scope.multiSelect === true) {
                            scope.selectedItem = angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : _originalValue;
                        } else {
                            scope.selectedItem = angular.isObject(scope.ngModel) && !angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : _originalValue;
                        }
                    }
                });

                scope.isCheck = function (oItem) {
                    if (angular.isUndefined(scope.selectedItem)
                        || angular.isUndefined(oItem[iAttrs.keyProperty])) {
                        return false;
                    }

                    if (scope.multiSelect === true) {
                        return scope.selectedItem.some(function (item) {
                            return item[scope.keyProperty] === oItem[scope.keyProperty];
                        });
                    } else {
                        return scope.selectedItem[iAttrs.keyProperty] === oItem[iAttrs.keyProperty];
                    }
                }

                scope.selectItem = function (item) {
                    if (scope.multiSelect === true) {
                        $gdeic.toggleItem(scope.selectedItem, item);
                    } else {
                        scope.selectedItem = item;
                    }
                }

                scope.clear = function () {
                    scope.selectedItem = angular.copy(_originalValue);
                }

                scope.ok = function () {
                    if (scope.selectedItem === _originalValue) {
                        if (scope.multiSelect === true) {
                            scope.ngModel = [];
                        } else {
                            scope.ngModel = null;
                        }
                    } else {
                        scope.ngModel = angular.copy(scope.selectedItem);
                    }
                    scope.isShow = false;
                }
            }
        };
    }
};