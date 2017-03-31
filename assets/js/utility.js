/**
 * Created by damith on 3/31/17.
 */

'use strict';
$(function () {
    var showPNotifyMsg = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3',
            animate: {
                animate: true,
                in_class: "bounceIn",
                out_class: "bounceOut"
            }
        });
    };
    return {
        showPNotifyMsg: showPNotifyMsg
    }
});