/**
 * Created by damith on 7/5/17.
 */

opConsoleApp.factory('confirmBoxFactory', function ($ngConfirm,$scope) {

    var confirmation = function (title, contentData, okText, okFunc, closeFunc) {
        $ngConfirm({
            title: title,
            content: contentData, // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {
                // long hand button definition
                ok: {
                    text: okText,
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function (scope) {
                        okFunc();
                    }
                },
                // short hand button definition
                close: function (scope) {
                    closeFunc();
                }
            }
        });
    };

    return {confirmation: confirmation};

});