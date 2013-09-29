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
        console.debug(ret);
        if (ret.login_succ)
        {
            //登录成功，反馈view
            this.user_o = this.model.fetch("login_succ");
            this.view.loginview(this.user_o.user_info, 1);
        } else {
            //登录失败，同样要反馈view
            if (ret.login_usrfail) this.view.loginview('用户名不存在，请确认任课老师选择正确', 0);
            else if(ret.login_pwdfail) this.view.loginview('密码错误', 0);
        }
    },
    view_init: function() {
        return ;
        var o_index = this.model.fetch('index');
        this.view.normalview(o_index.lesson_title, o_index.lesson_info);
    },
    logout: function() {
        $.get("login/logout.asp");
        this.view.loginshow();
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