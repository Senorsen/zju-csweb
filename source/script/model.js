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
        try {
            console.error('错误：无法获知具体的链接参数');
        }
        catch(e2) {
            //防止没有console对象
        }
    }
    if ($.browser.mozilla)      //for firefox
    {
        alert('本脚本不能良好地支持firefox浏览器，尤其是在奇怪的编码问题方面');
    }
}
cmodel.prototype = {
    _ffajax: function(url, data, method, callback) {        //通过iframe来模拟ajax，firfox。蛋疼的小森森的无奈之举！。 2013年9月30日3:43:59
        var frmAjax = document.createElement('form');       //只可惜仍然不太好。
        frmAjax.target='encodeiframe';
        if (typeof data == 'string')    // 2013年9月30日4:41:38
        {
            var data2 = new Array();
            var o1 = data.split('&');
            for (var i in o1)
            {
                var o2 = o1[i].split('=');
                data2[o2[0]] = o2[1];
            }
            data = data2;
        }
        frmAjax.method = method;
        frmAjax.action = url;
        frmAjax.innerHTML = "";
        for (var i in data)
        {
            var o = document.createElement('input');
            o.type = 'hidden';
            o.name = i;
            o.value = data[i];
            frmAjax.appendChild(o);
        }
        frmAjax.id = "frmAjax";
        document.body.appendChild(frmAjax);
        var obj_if = document.createElement('iframe');
        obj_if.id = obj_if.name = 'encodeiframe';
        obj_if.onload = _ready;
        document.body.appendChild(obj_if);
        document.getElementById("frmAjax").submit();
        var isfinish = 0, retstr = '';
        function _ready() {
            isfinish = 1;
            encodeiframe = window.parent.document.getElementById('encodeiframe');
            retstr = encodeiframe.document.body.innerHTML;
            window.parent.document.getElementById("encodeiframe").parentNode.removeChild(window.parent.document.getElementById("encodeiframe"));
            window.parent.document.getElementById("frmAjax").parentNode.removeChild(window.parent.document.getElementById("frmAjax"));
            alert(retstr)
            callback(retstr);
        }
    },
    fetch: function(location, data, callback) {
        if (typeof data == 'undefined') data = '';
        var f_obj = url_handler[location];
        var retstr = '';
        fetch_callback_1 = this._fetch_cb;
        if (typeof callback == 'undefined') callback = function() {};
        if (1 || !$.browser.mozilla)
        {
            if (f_obj._method == 'GET')
            {
                $.get(url_list[location], this.linksuffix+'&'+data, function(data){retstr=data;callback(fetch_callback_1(retstr, f_obj));}, "html");
            }
            else if(f_obj._method == 'POST')
            {
                $.post(url_list[location]+this.linksuffix, data, function(data){retstr=data;callback(fetch_callback_1(retstr, f_obj));}, "html");
            }
        }
        else
        {
            this._ffajax(url_list[location]+this.linksuffix, data, f_obj._method, function(data){retstr=data;callback(fetch_callback_1(retstr, f_obj));});
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

