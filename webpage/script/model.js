// ZJU-cs-basic-opt
// model.js - 获取数据

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

function cmodel()
{
    jQuery.ajaxSetup({
        async: false,       //弱菜太弱所以很无奈
        error: function() {
            alert("发送数据请求出错。请检查网络连接是否良好");
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
            login_usrfail: ["reg", /用户名（请用学号）不存在,[^']+/, 0],
            login_pwdfail: ["reg", /密码错误/, 0],
            login_succ: ["reg", /index_student[.]asp/, 0],
            _method: "POST"
        },
        login_succ: {
            user_info: ["reg", /<TD  align=left>(.+?)<\/TD>/, 1],
            lesson_info: ["reg", /<TD vAlign=top><SPAN[\s\S^']+title="([^"]+)/, 1],
            lesson_announce: ["reg", /scrollDelay=200>(.+?)<\/MARQUEE><\/TD><\/TR><\/TBODY><\/TABLE><\/TD><\/TR>/, 1],
            lesson_title: ["reg", /width=300 align=left>(.+?)<\/TD><\/TR>/, 1],
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
}
cmodel.prototype = {
    fetch: function(location, data) {
        if (typeof data == 'undefined') data = '';
        var f_obj = this.r[location];
        var retstr = '', retobj = {};
        if (f_obj._method == 'GET')
        {
            $.get(url_list[location], this.linksuffix+'&'+data, function(data){retstr=data;}, "text");
        }
        else if(f_obj._method == 'POST')
        {
            $.post(url_list[location]+this.linksuffix, data, function(data){retstr=data;}, "text");
        }
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
                            if (f_obj[e][1].global) retobj[e] = matches;
                            else
                            for (var i=1;i<matches.length;i++)
                                retobj[e].push(matches[i]);
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
        return retobj;
    }
}