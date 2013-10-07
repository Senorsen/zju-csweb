// ZJU-cs-basic-opt
// model.js - 获取数据

var DEBUG = 1;
var url_list = {
    index: "index.asp",
    login: "login/check.asp",
    login_succ: "index_student.asp",
    kcjg: "",
    kczl: "",
    kczy: "",
    sjsy: "",
    xxxx: ""
};

function cmodel(vw)
{
    jQuery.ajaxSetup({
        async: false,       //弱菜太弱所以很无奈
        error: function() {
            vw.myAlert("发送网络请求失败。");
        }
    });
    this.r = {
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
            login_fail: ["reg", /alert\('(.+?)'\)/, 1],             //注释一发：reg为regexp的缩写，正则表达式；function为函数。
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
                return ['上机实验', '课程作业'];
            }],
            task_obj: ["function", function($o) {
                var retobj = [];
                $o.find("a").each(function() {
                    if (this.innerHTML == '上机实验') 
                    retobj[0] = this.href.replace(/&amp;/g, '&');
                    if (this.innerHTML == '课程作业') 
                    retobj[1] = this.href.replace(/&amp;/g, '&');
                });
                return retobj;
            }],
            _method: "GET"
        },
        
    };
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
    _ffajax: function(url, data, method, callback) {      //通过iframe来模拟ajax。蛋疼的小森森的无奈之举！。 2013年9月30日3:43:59
        var frmAjax = document.createElement('form');
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
        var f_obj = this.r[location];
        var retstr = '';
        if (1 || !$.browser.mozilla)
        {
            if (f_obj._method == 'GET')
            {
                $.get(url_list[location], this.linksuffix+'&'+data, function(data){retstr=data;}, "html");
            }
            else if(f_obj._method == 'POST')
            {
                $.post(url_list[location]+this.linksuffix, data, function(data){retstr=data;}, "html");
            }
        }
        else
        {
            this._ffajax(url_list[location]+this.linksuffix, data, f_obj._method, function(data){retstr=data});
        }
        callback(this._fetch_cb(retstr, f_obj));
        
    },
    _fetch_cb: function(retstr, f_obj) {
        var retobj = {};
        $o = $(retstr);
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

