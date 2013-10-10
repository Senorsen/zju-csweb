// ZJU-cs-basic-opt
// model.js - 获取数据

var DEBUG = 1;
var url_list = {
    index: "index.asp",
    login: "login/check.asp",
    login_succ: "index_student.asp",
    logout: "login/logout.asp"
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
                ret.push($ob.eq(i).html());
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
            $o.find("a").each(function() {
                if (this.innerHTML == '上机实验') 
                turl[0] = this.href.replace(/&amp;/g, '&');
                if (this.innerHTML == '课程作业') 
                turl[1] = this.href.replace(/&amp;/g, '&');
                if (this.innerHTML == '课程资料') 
                turl[2] = this.href.replace(/&amp;/g, '&');
                if (this.innerHTML == '课程讲稿') 
                turl[3] = this.href.replace(/&amp;/g, '&');
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
                retobj[i] = pagename+'?flag='+(i%2).toString()+'&'+$.param(getArgs(turl[i].match(/[^?]+$/)[0]));
            }
            return retobj;
            /**************************
                 以下func: getArgs 源自 -> 
             http://www.jsann.com/post/JS_GET_parameters_to_obtain.html
            **************************/
            function getArgs(url){
                var args = {};
                var match = null;
                var search = url;
                var reg = /(?:([^&amp;]+)=([^&amp;]+))/g;
                while((match = reg.exec(search))!==null){
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
    task0: {
        notification: ["function", function($o) {
            return $o.find("font").eq(0).parent().text();
        }],
        data: ["function", function($o) {
            var no = [], req = [], stt = [], ddl = [], dlr = [], prb = [], upl = [];
            var $trs = $o.find('tr[bordercolor="#e9f0f4"][bgcolor="#f8f3fb"]');
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
            function th(u){return '../'+/teacherdata.+$/.exec(u)[0]}
            return {no:no,req:req,stt:stt,ddl:ddl,dlr:dlr,prb:prb,upl:upl};
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
            function th(u){return '../'+/teacherdata.+$/.exec(u)[0]}
            return {no:no,req:req,stt:stt,ddl:ddl,dlr:dlr,prb:prb,upl:upl};
        }],
        _method: "GET"
    },
    task2: {
        // id 资料号 资料主题 资料描述 发布日期 操作
        data: ["function", function($o) {
            var nod = [], res = [], sbj = [], des = [], tim = [], opr = [];
            var $trs = $o.find('tr[bgcolor="#FFFFFF"]');
            $trs.each(function() {
                $c = $(this).children();
                nod.push($c.eq(0).html());
                res.push($c.eq(1).html());
                sbj.push($c.eq(2).html());
                des.push($c.eq(3).html());
                tim.push($c.eq(4).html());
                opr.push(th($c.eq(5).children('a').attr('href')));
            });
            function th(u){return '../'+/teacherdata.+$/.exec(u)[0]}
            return [nod,res,sbj,des,tim,opr];
        }],
        _method: "GET"
    },
    task3: {
        // id 章节号 讲稿标题 讲稿描述 操作
        data: ["function", function($o) {
            var nod = [], chn = [], cht = [], chd = [], opr = [];
            var $trs = $o.find('tr[bgcolor="#FFFFFF"]');
            $trs.each(function() {
                $c = $(this).children();
                nod.push($c.eq(0).html());
                chn.push($c.eq(1).html());
                cht.push($c.eq(2).html());
                chd.push($c.eq(3).html());
                opr.push(th($c.eq(4).children('a').attr('href')));
            });
            function th(u){return '../'+/teacherdata.+$/.exec(u)[0]}
            return [nod,chn,cht,chd,opr];
        }],
        _method: "GET"
    }
};
function cmodel(vw)
{
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
        console.error('错误：无法获知具体的链接参数');
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
    fetch: function(location, data, callback) {
        if (typeof data == 'undefined') data = '';
        var f_obj = url_handler[location];
        var retstr = '';
        fetch_callback_1 = this._fetch_cb;
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
                    retobj[e] = f_obj[e][1]($o);
                }
                
            }
        }
        if (DEBUG) console.debug(retobj);
        return retobj;
    }
}

