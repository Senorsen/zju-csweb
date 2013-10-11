// ZJU-cs-basic-opt
// function.js - 功能函数

function c_cntr()
{
    this.view = new tot_view();
    this.model = new cmodel(this.view);
    //this.view_init();
    this.inittest();
}
c_cntr.prototype = {
    inittest: function() {
        if(/uid=\d+;/.test(document.cookie))
        {
            console.debug('登录状态可能有效');
            this._login({login_succ:1});
        }
        else
        {
            console.debug('无登录状态');
        }
    },
    login: function() {
        var data = $("#frmLogin").serialize();
        t = this;
        this.model.fetch("login", data, function(a){t._login(a)});
    },
    _login: function(ret) {
        if (ret.login_succ)
        {
            //登录成功，反馈view
            var t = this;
            this.model.fetch("login_succ", '', function(a) {
                t.user_o = a;
                t.view.loginview(t.user_o.user_info, 1);
                t.view.normalview(a.lesson_title, a.lesson_info, function(b){$("#nav-info-layer-b").html(a.lesson_title[b]+'：'+a.lesson_announce[b])}, t);
                for (var i in a.task_obj)
                {
                    url_list['task'+i] = a.task_obj[i];
                }
                t.view.showtask(a.task_title, a.task_obj);
                t.view.pageSwitcher.setcallback(
                    function(id0) {
                        id0 = parseInt(id0);
                        if (id0 >= 1 && id0 <= 4)
                        {
                            this.switchTask(id0 - 1);
                        }
                    }, t);
            });
        } else {
            //登录失败，同样要反馈view
            if (ret.login_fail) this.view.loginview(ret.login_fail, 0);
        }
    },
    logout: function() {
        this.model.fetch('logout');
        this.model.clearCookies();
        this.view.loginshow();
    },
    switchTask: function(id) {
        var ids = ['rp-experiment', 'rp-homework', 'rp-file', 'rp-document'];
        var t = this;
        t.model.fetch('task'+id, '', function(obj) {
            t.view.showtasktable($('#'+ids[id]), id, t.user_o.task_title[id], obj.notification, obj.data);
        });
    }
};

$(document).ready(function() {
	init();
});

function init()
{
    if (typeof jQuery == 'undefined' || typeof cmodel == 'undefined' || typeof tab_switcher == 'undefined')
    {
        setTimeout(init, 100);
        return;
    }
    controller = new c_cntr();
}