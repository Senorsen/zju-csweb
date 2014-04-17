// ZJU-cs-basic-opt
// function.js - 功能函数

function c_cntr()
{
    this.path = this.getpath();
    this.page = this.getpage(this.path);
    this.view = new tot_view(this.page);
    this.model = new cmodel(this.view);
    //this.view_init();
    if (this.page == 'csweb_main') {
        this.inittest();
    } else {
        this.fixinit(this.page);
    }
}
c_cntr.prototype = {
    getpage: function(path) {
        var preg_search = /csweb\/cstcx\/web\/index\.asp/;
        if (preg_search.exec(path)) {
            return 'csweb_main';
        } else if (path == 'csweb/'){
            return 'csweb_init';
        } else if (/^program/.exec(path)) {
            return 'program_init';
        } else {
            return 'unknown';
        }
    },
    getpath: function() {
        var href = location.href;
        var preg = /^http:\/\/(.+?)(\/.*)/;
        var ret = preg.exec(href);
        if (typeof ret[2] == 'undefined') {
            ret[2] = '/';
        }
        var check_list = {
            'blackwhite.8866.org': 'csweb',
            '10.71.45.100': 'csweb',
            '10.77.30.31': 'program',
            '10.77.30.33': 'program'
        };
        var type = 'unknown';
        if (typeof check_list[ret[1]] != 'undefined') {
            type = check_list[ret[1]];
        }
        if (/10\.77\.30\.\d+/.exec(ret[1])) {
            type = 'program';
        }
        return type + ret[2];
    },
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
    fixinit: function(which_page) {
        this.model.fetch_proxy('charset_fix', {page: which_page}, function(data) {
            document.charset = data.charset;
            document.characterSet = data.charset;
            document.title = data.title;
            document.body.innerHTML = data.body;
        });
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
                        // 注：目前一共4个task
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
            window['task'+id] = obj;
            t.view.showtasktable($('#'+ids[id]), id, t.user_o.task_title[id], obj.notification, obj.data);
        });
    },
    upload_exam: function(exam_id) {
        //alert(window.task0.data.upl[exam_id]);
        window.upload_exam_id = exam_id;
        var that = this;
        var uecb = function(data) {
            console.log(data);
            that.view.show_exam_upload(exam_id, task0.data.upl[exam_id], task0.data.uplup[exam_id], data);
        };
        this.model.fetch_sub('exam_upload_page', task0.data.upl[exam_id], uecb);
    },
    upload_exam_finish: function(exam_id) {
        this.upload_exam(exam_id);
    },
    do_exam_upload: function(url, data, callback) {
        var that = this;
        $.ajaxFileUpload({
            url: url, //'jobexam/' + url,
            secureuri: false,
            fileElementId: 'exam-file',
            dataType: 'html',
            data: {
                examInsNote: $('#exam-note').val()
            },
            success: function(data) {
                callback(that.model.parse('exam_upload_succ', data));
            },
            error: function() {
                that.view.myAlert('上传时遇到网络错误');
            }
        });
    }
};

//$(document).ready(function() {
	init();
//});

function init()
{
    window.controller = new c_cntr();
}

function senorsen_err(a, b, c, d) {
    //alert();
    
}
function navigate() {
    controller.upload_exam_finish(window.upload_exam_id);
}
