// ZJU-cs-basic-opt
// view.js - 视觉效果，显示组件等



/* Tab Switcher */
function tab_switcher($obj_switcherlayer, $obj_layer, data, callback, defaultPage)
{
    this.$switcher = $obj_switcherlayer.children();
    this.$swlayer = $obj_switcherlayer;
    this.$layer = $obj_layer;
    if (typeof defaultPage == 'undefined') this.no = 0;
    else this.no = defaultPage;
    this.callback = typeof callback=='function'?callback:function(){};
    
    this.update();
    if (typeof data == "object") this.data = data;  //数组
    else if (typeof data == "string" || typeof data == "undefined")
    {
        if (data == "inner" || typeof data == "undefined")
        {
            var tab_no = this.no;
            var $tabs = this.$layer.children();
            $tabs.each(function() {
                $this = $(this);
                this_display = $this.css("display");
                this_no = $tabs.index($this);
                $this.attr("x-switchlayer-no", this_no).attr("x-switchlayer-displaymode", this_display=''?'block':this_display);
                if (this_no != tab_no) $this.css("display", "none");
            });
        }
    }
    else
    {
        this.$layer.html("");
        for (var e in data)
        {
            var $t = $('<div>'+this.data[e]+'</div>');
            var this_display = $t.css("display");
            this.$layer.append($t.attr("x-swichlayer-no", e).attr("x-switchlayer-displaymode", this_display==''?'block':this_display));
            if (this.no != e) this.$layer.children().eq(e).css({"display":"none"});
        }
    }
}
tab_switcher.prototype = {
    clear: function() {
        this.$layer.html('');
        this.$switcher.remove();
        return this;    //链式访问 2013年10月1日0:43:55 国庆节！
    },
    insert: function(titlehtml, html) {
        var thisnum = this.$layer.children().size();
        this.$layer.append($('<div>'+html+'</div').attr("x-switchlayer-no", thisnum).attr("x-switchlayer-displaymode","block").css({"display":thisnum?"none":"display", "position":""}));
        //this.$switcher.last().after(titlehtml);
        this.$swlayer.append($(titlehtml));
        return this;
    },
    update: function() {     //apply & update
        var $tab_this = this;
        this.$switcher = this.$swlayer.children();
        this.$switcher.each(function() {
            var $this = $(this);
            var this_no = $tab_this.$switcher.index($this);
            $this.attr("x-switcher-no", this_no);
            $this.removeClass("selected");
            if (this_no == $tab_this.no) $this.addClass("selected");
        }).unbind("click").click(function() {
            var $this = $(this);
            $tab_this.switchTo($this.attr("x-switcher-no"));
        });
        this.switchTo(0);
        return this;
    },
    get: function(num) {
        return $layer.children().eq(num);
    },
    switchTo: function(num) {
        var $o = this.$layer.children().eq(this.no);
        var $t = this.$layer.children().eq(num);
        $o.css("display", "none");
        //$o.fadeOut(100);
        $t.fadeIn(100);
        //$t.css("display", "block").css("display", $t.attr("x-switchlayer-displaymode"));
        this.$switcher.eq(this.no).removeClass("selected");
        this.no = num;
        this.$switcher.eq(num).addClass("selected");
        this.callback(num);
        return this;
    },
    destroy: function() {
        this.$switcher.removeAttr("x-switcher-no").removeClass("selected").unbind("click");
        this.$layer.children().removeAttr("x-switchlayer-displaymode").html("");
    }
}


////////////////////////////////////
//     这是一个通用的视图类       //
////////////////////////////////////
function tot_view()
{
    t = this;
    this.pageSwitcher = new tab_switcher($("#nav-top-content"), $("#rp-switcher-layer"), "inner");
    this.lessonSwitcher = new tab_switcher($("#lesson-intro-switcher-layer"), $("#lesson-intro-txt"), "inner");
}
tot_view.prototype = {
    loginview: function(txt, issucc) {
        var $login_layer = $("#login-layer");
        if (issucc)
        {
            $login_layer.html('<h1>用户信息</h1><div id="user-info" style="margin-left:20px;">'+txt+'<br><br><center><input style="width:120px;height:35px" type=button value=退出登录 onclick="controller.logout()"></div>');
        }
        else
        {
            this.myAlert(txt);
        }
    },
    loginshow: function() {
        $("#login-layer").html('<h1>用户登录</h1><form id="frmLogin">            <table style="margin-left:20px" border="0"><tr><td width="68">用户名</td><td width="187"><input type="text" id="txtUsername" name="txtUser"></td></tr><tr><td>密码</td><td><input type="password" id="txtPassword" name="txtPwd" onKeyDown="if(event)k=event.keyCode;else if(event.which)k=event.which;if(k==13)controller.login();"></td></tr><tr><td></td><td><input type="button" id="btnLogin" value="登 录" onclick="controller.login();"></table>            </form>');
    },
    normalview: function(title_o, txt_o, callback) {
        this.lessonSwitcher.callback = typeof callback=='function'?callback:function(){};
        this.lessonSwitcher.clear();
        for(var i=0,len=title_o.length;i<len;i++)
        {
            this.lessonSwitcher.insert('<a class="switcher fence fence-small">'+title_o[i]+'</a>',
                                        txt_o[i]);
        }
        this.lessonSwitcher.update();
    },
    showtask: function(title, url) {
        $("#task-list").html('');
        for (var i in title)
        {
            $("#task-list").css('margin-left', '40px').append('<a x-url="'+url[i]+'" onclick="controller.switchtask('+i+');">'+title[i]+'</a>&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    },
    myAlert: function(txt) {
        var aid = 'alert'+Math.random();
        var $o = $('<div id="'+aid+'" class="myalert">'+txt+'</div>');
        $(document.body).append($o);
        _myAlert_close = function() {
            $o.fadeOut(1000, "linear", function() {
                $o.remove();
            });
        };
        setTimeout(_myAlert_close, 2000);
    }
}