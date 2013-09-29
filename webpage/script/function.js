// ZJU-cs-basic-opt
// function.js - 功能函数

function c_cntr()
{
    this.model = new cmodel();
    this.view = new tot_view();
    this.view_init();
}
c_cntr.prototype = {
    login: function() {
        var data = $("#frmLogin").serialize();
        var ret = this.model.fetch("login", data);
        if (ret.login_succ)
        {
            //登录成功，反馈view
            this.user_o = this.model.fetch("login_succ");
            this.view.loginview(this.user_o.user_info);
        } else {
            //登录失败，同样要反馈view
            console.debug(ret)
            if (ret.login_usrfail) ;
            else (ret.login_pwdfail);
        }
    },
    view_init: function() {
        return ;
        var o_index = this.model.fetch('index');
        this.view.normalview(o_index.lesson_title, o_index.lesson_info);
    }
}

init();

function init()
{
    if (typeof jQuery == 'undefined' || typeof cmodel == 'undefined' || typeof tab_switcher == 'undefined')
    {
        setTimeout(init, 100);
        return;
    }
    controller = new c_cntr();
}