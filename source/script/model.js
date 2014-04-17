// ZJU-cs-basic-opt
// model.js - 获取数据

var DEBUG = 1;
var url_list = {
    index: "index.asp",
    login: "login/check.asp",
    login_succ: "index_student.asp",
    logout: "login/logout.asp"
};
var url_wrap = {
    'zju_csweb': '/', // temporarily useless!! don't believe it.
    'senorsen_proxy': 'http://project.qsc.senorsen.com/zju-csweb/server_proxy/'
};
var url_handler = {
    index: {
        lesson_announce: ["function", function($o) {
            $ob = $o.find('span[style="font-weight: 400"]');
            var ret = [];
            for (var i=0;i<$ob.length;i++)
                ret.push($ob.eq(i).html());
            return ret;
        }],
        _method: "GET"
    },
    login: {
        login_fail: ["reg", /alert\('(.+?)'\)/, 1],             //注释一发：reg为regexp的缩写，正则表达式；function为函数，参数为parse的jQuery对象。
        login_succ: ["reg", /index_student[.]asp/, 0],
        _method: "POST"
    },
    login_succ: {
        user_info: ["reg", /<TD  align=left>(.+?)<\/TD>/, 1],
        lesson_info: ["function", function($o) {
            $ob = $o.find('span[style="font-weight: 400"]');
            var ret = [];
            for (var i=0;i<$ob.length;i++)
                ret.push($ob.eq(i).html());
            return ret;
        }],
        lesson_announce: ["function", function($o) {
            $ob = $o.find('td > marquee');
            var ret = [];
            for (var i=0;i<$ob.length;i++)
                ret.push($ob.eq(i).html().replace(/<br \/>/g, '').replace(/<br>/g, ''));
            return ret;
        }],
        lesson_title: ["function", function($o) {
            $ob = $o.find('td[valign=middle] > b');
            var ret = [];
            for (var i=0;i<$ob.length;i++)
                ret.push($ob.eq(i).html());
            return ret;
        }],
        task_title: ["function", function() {
            return ['上机实验', '课程作业', '课程资料', '课程讲稿'];
        }],
        task_obj: ["function", function($o) {
            var retobj = [], turl = [];
            var appdurl = ['loc=%CA%B5%D1%E9%D7%F7%D2%B5%3E%3E%3E%C9%CF%BB%FA%CA%B5%D1%E9%3E%3E%CA%B5%D1%E9%C1%D0%B1%ED', '', '', '']
            $o.find("a").each(function() {
                if (this.innerHTML == '上机实验') { 
                    turl[0] = this.href;
                }
                if (this.innerHTML == '课程作业') {
                    turl[1] = this.href;
                }
                if (this.innerHTML == '课程资料') {
                    turl[2] = this.href;
                }
                if (this.innerHTML == '课程讲稿') {
                    turl[3] = this.href;
                }
            });
            for (var i in turl)
            {
                var pagename = '';
                switch(parseInt(i))
                {
                    case 0:
                        pagename = 'jobexam/ExamList.asp';break;
                    case 1:
                        pagename = 'jobexam/ExamList.asp';break;
                    case 2:
                        pagename = 'courceinfo/resource.asp';break;
                    case 3:
                        pagename = 'courceinfo/jianggao.asp';break;
                    default:
                        break;
                }
                retobj[i] = pagename+'?flag='+(i%2).toString()+'&'+appdurl[0]+'&'+$.param(getArgs(turl[i].match(/[^?]+$/)[0]));
            }
            window.exam_stat = 'jobexam/StuQueryScore.asp?flag=0&' + $.param(getArgs(turl[0].match(/[^?]+$/)[0]));
            return retobj;
            function param_noencode(args) {
                var s = '';
                for (var i in args) {
                    if (i == 'flag') continue;
                    s += i + '=' + args[i] + '&';
                }
                return s;
            }
            /**************************
                 以下func: getArgs 源自 -> 
             http://www.jsann.com/post/JS_GET_parameters_to_obtain.html
            **************************/
            function getArgs(url) {
                var args = {};
                var match = null;
                var search = url;
                var reg = /(?:([^&]+)=([^&]+))/g;
                while ((match = reg.exec(search)) !== null) {
                    if (match[1] == 'flag') continue;
                    args[match[1]] = match[2];
                }
                return args;
            }
        }],
        _method: "GET"
    },
    logout: {
        _method: "GET"
    },
    exam_upload_page: {
        title: ["reg", /<font color="#ff0000"><b>(.*?)<\/b><\/font>/, 1],
        upload_status: ["reg", /<font color='#ff0000'><b>(.*?)<\/b><\/font>/, 1],
        upload_date: ["reg", /<\/font>\[上传日期：(.*?)\]/, 1],
        upload_down: ["reg", /<a href='\.\.\/(.+?)' target='_blank'><font color='#0000ff'><b>/, 1],
        url: ["reg", /document\.frmExam\.action="(.*?)"/, 1],
        _method: "GET"
    },
    exam_upload_succ: {
        result: ["function", function($o, html) {
            if (/上传成功/.test(html)) {
                return 1;
            } else {
                return 0;
            }
        }],
        _method: "POST"
    },
    task0: {
        notification: ["function", function($o) {
            return $o.find("font").eq(0).parent().text();
        }],
        data: ["function", function($o) {
            var no = [], req = [], stt = [], ddl = [], dlr = [], prb = [], upl = [], uplup = [];
            var $trs = $o.find('tr[bordercolor="#e9f0f4"][bgcolor="#f8f3fb"]');
            if ($trs.length == 1 && $trs.children().length == 0) {
                // nothing to do.
            } else {
                try {
                    $trs.each(function() {
                        $c = $(this).children();
                        no.push($c.eq(0).html());
                        req.push($c.eq(1).html());
                        stt.push($c.eq(2).html());
                        ddl.push($c.eq(3).html());
                        dlr.push(th($c.eq(4).children('a').attr('href')));
                        prb.push('jobexam/' + $c.eq(5).children('a').attr('href'));
                        upl.push('jobexam/' + $c.eq(6).children('a').attr('href'));
                        uplup.push((upl[uplup.length] + '&action=0').replace('uploadexamsub', 'Progress_upload'));
                    });
                } catch(e) {
                    // what to do?
                }
            }
            function th(u){return '../'+/teacher\.data.+$/.exec(u)[0]}
            return {no:no,req:req,stt:stt,ddl:ddl,dlr:dlr,prb:prb,upl:upl,uplup:uplup};
        }],
        _method: "GET"
    },
    task1: {
        notification: ["function", function($o) {
            return $o.find("font").eq(0).parent().text();
        }],
        data: ["function", function($o) {
            var no = [], req = [], stt = [], ddl = [], dlr = [], prb = [], upl = [];
            var $trs = $o.find('tr[bordercolor="#e9f0f4"][bgcolor="#f8f3fb"]');
            if ($trs.length == 1 && $trs.children().length == 0) {
                // nothing to do.
            } else {
                try {
                    $trs.each(function() {
                        $c = $(this).children();
                        no.push($c.eq(0).html());
                        req.push($c.eq(1).html());
                        stt.push($c.eq(2).html());
                        ddl.push($c.eq(3).html());
                        dlr.push(th($c.eq(4).children('a').attr('href')));
                        prb.push($c.eq(5).children('a').attr('href'));
                        upl.push($c.eq(6).children('a').attr('href'));
                    });
                } catch(e) {
                    // what to do?
                }
            }
            function th(u){return '../'+/teacher\.data.+$/.exec(u)[0]}
            return {no:no,req:req,stt:stt,ddl:ddl,dlr:dlr,prb:prb,upl:upl};
        }],
        _method: "GET"
    },
    task2: {
        // id 资料号 资料主题 资料描述 发布日期 操作
        data: ["function", function($o) {
            var nod = [], res = [], sbj = [], des = [], tim = [], opr = [];
            var $trs = $o.find('tr[bgcolor="#FFFFFF"]');
            if ($trs.length == 1 && $trs.children().length == 0) {
                // nothing to do.
            } else {
                try {
                    $trs.each(function() {
                        $c = $(this).children();
                        nod.push($c.eq(0).html());
                        res.push($c.eq(1).html());
                        sbj.push($c.eq(2).html());
                        des.push($c.eq(3).html());
                        tim.push($c.eq(4).html());
                        opr.push(th($c.eq(5).children('a').attr('href')));
                    });
                } catch(e) {
                    // what to do?
                }
            }
            function th(u){return '../'+/teacher\.data.+$/.exec(u)[0]}
            return [nod,res,sbj,des,tim,opr];
        }],
        _method: "GET"
    },
    task3: {
        // id 章节号 讲稿标题 讲稿描述 操作
        data: ["function", function($o) {
            var nod = [], chn = [], cht = [], chd = [], opr = [];
            var $trs = $o.find('tr[bgcolor="#FFFFFF"]');
            if ($trs.length == 1 && $trs.children().length == 0) {
                // nothing to do.
            } else {
                try {
                    $trs.each(function() {
                        $c = $(this).children();
                        nod.push($c.eq(0).html());
                        chn.push($c.eq(1).html());
                        cht.push($c.eq(2).html());
                        chd.push($c.eq(3).html());
                        opr.push(th($c.eq(4).children('a').attr('href')));
                    });
                } catch(e) {
                    // what to do?
                }
            }
            function th(u){return '../'+/teacher\.data.+$/.exec(u)[0]}
            return [nod,chn,cht,chd,opr];
        }],
        _method: "GET"
    }
};
function cmodel(vw)
{
    this.vw = vw;
    jQuery.ajaxSetup({
        async: true,
        error: function() {
            vw.myAlert("发送网络请求失败。");
        }
    });
    try {
        this.tn = location.href.match(/tt=(\w+)[&]/)[1];
        this.linksuffix = '?tt='+this.tn+'&tn='+this.tn;
    }
    catch(e) {
        //console.error('错误：无法获知具体的链接参数');
    }
    if ($.browser.mozilla)      //for firefox
    {
        alert('本脚本不能良好地支持firefox浏览器，尤其是在奇怪的编码问题方面');
    }
    this.init();
}
cmodel.prototype = {
    init: function() {
        this.updateCookies(this.getAllCookie());
    },
    getAllCookie: function() {
        var retobj = [];
        var o1 = document.cookie.split(';');
        for (var i in o1)
        {
            var o2 = o1[i].split('=');
            retobj.push({key: o2[0], value: o2[1]});
        }
        return retobj;
    },
    updateCookies: function(arr) {
        if (typeof arr.length == 'undefined') arr = [arr];
        for (var i in arr)
        {
            document.cookie = arr[i].key + '=' + arr[i].value + "; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/cstcx";
            document.cookie = arr[i].key + '=' + arr[i].value + "; expires=Tue, 11 Mar 2036 13:12:31 GMT; path=/cstcx";
        }
    },
    clearCookies: function() {
        var arr = document.cookie.split(';');
        for (var i in arr)
        {
            var o2 = arr[i].split('=');
            document.cookie = o2[0] + '=' + '' + "; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/cstcx";
        }
    },
    fetch_proxy: function(action, callback, data) {
        var fetch_method = 'POST';
        if (typeof data == 'undefined' || data == '' || data == {} || data == []) {
            data = undefined;
            fetch_method = 'GET';
            console.log('Proxy GET: ' + action);
        }
        var _fpcb = function(data) {
            if (data.code == 0) {
                callback(data.obj, action);
            } else {
                this.vw.myAlert('向proxy请求时出错：' + data.msg);
            }
        };
        if (fetch_method == 'GET') {
            $.get(url_wrap.senorsen_proxy + '?type=jsonp&action=' + action, {}, _fpcb, "jsonp");
        } else {
            // 咋可能是post咧
            callback({code: -1, msg: 'ERR_METHOD_NOT_SUPPORTED'}, action);
        }
    },
    fetch_sub: function(type, url, callback) {
        var f_obj = url_handler[type];
        var fetch_callback_1 = this._fetch_cb;
        var fetch_sub_callback = function(data) {
            callback(fetch_callback_1(data, f_obj));
        };
        $.get(url, {}, fetch_sub_callback, "html");
    },
    fetch: function(location, data, callback) {
        if (typeof data == 'undefined') data = '';
        var f_obj = url_handler[location];
        var retstr = '';
        var fetch_callback_1 = this._fetch_cb;
        if (typeof callback == 'undefined') callback = function() {};
        if (f_obj._method == 'GET')
        {
            $.get(url_list[location], this.linksuffix+'&'+data, function(data){retstr=data;callback(fetch_callback_1(retstr, f_obj));}, "html");
        }
        else if(f_obj._method == 'POST')
        {
            $.post(url_list[location]+this.linksuffix, data, function(data){retstr=data;callback(fetch_callback_1(retstr, f_obj));}, "html");
        }
    },
    parse: function(action, retstr) {
        this._fetch_cb(retstr, url_handler[action]);
    },
    _fetch_cb: function(retstr, f_obj) {
        var retobj = {};
        var $o = $(retstr);
        for (e in f_obj)
        {
            if (e != '_method')
            {
                if (f_obj[e][0] == 'reg')
                {
                    if (f_obj[e][1].test(retstr))
                    {
                        try {
                            retobj[e] = [];
                            var matches = retstr.match(f_obj[e][1]);
                            retobj[e] = matches[f_obj[e][2]];
                        }
                        catch(e)
                        {
                            retobj[e] = 0;
                        }
                    }
                    else
                    {
                        retobj[e] = 0;
                    }
                }
                else
                {
                    retobj[e] = f_obj[e][1]($o, retstr);
                }
                
            }
        }
        if (DEBUG) console.debug(retobj);
        return retobj;
    }
}

