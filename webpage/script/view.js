// ZJU-cs-basic-opt
// view.js - 视觉效果，显示组件等



/* Tab Switcher */
function tab_switcher($obj_switcher, $obj_layer, data, defaultPage)
{
    this.$switcher = $obj_switcher;
    this.$swlayer = $obj_switcher.parent();
    this.$layer = $obj_layer;
    if (typeof defaultPage == 'undefined') this.no = 0;
    else this.no = defaultPage;
    
    this.update();
    if (typeof data == "object") this.data = data;  //数组
    else if (typeof data == "string" || typeof data == "undefined")
    {
        if (data == "inner" || typeof data == "undefined")
        {
            tab_no = this.no;
            $tabs = this.$layer.children();
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
            $t = $('<div>'+this.data[e]+'</div>');
            this_display = $t.css("display");
            this.$layer.append($t.attr("x-swichlayer-no", e).attr("x-switchlayer-displaymode", this_display==''?'block':this_display));
            if (this.no != e) this.$layer.children().eq(e).css("display", "none");
        }
    }
}
tab_switcher.prototype = {
    clear: function() {
        this.$layer.html('');
        this.$switcher.remove();
    },
    insert: function(titlehtml, html) {
        this.$layer.append($('<div>'+html+'</div').attr("x-switchlayer-no", this.$layer.children().size()).attr("x-switchlayer-displaymode","block").css("display","none"));
        //this.$switcher.last().after(titlehtml);
        this.$swlayer.append(titlehtml);
    },
    update: function() {     //apply & update
        var $tab_this = this;
        this.$switcher = this.$swlayer.children();
        this.$switcher.each(function() {
            $this = $(this);
            var this_no = $tab_this.$switcher.index($this);
            $this.attr("x-switcher-no", this_no);
            $this.removeClass("selected");
            if (this_no == $tab_this.no) $this.addClass("selected");
        }).unbind("click").click(function() {
            $this = $(this);
            $tab_this.switchTo($this.attr("x-switcher-no"));
        });
    },
    switchTo: function(num) {
        $o = this.$layer.children().eq(this.no);
        $t = this.$layer.children().eq(num);
        $o.css("display", "none");
        //$o.fadeOut(50);
        $t.fadeIn(100);
        //$t.css("display", "block").css("display", $t.attr("x-switchlayer-displaymode"));
        this.$switcher.eq(this.no).removeClass("selected");
        this.no = num;
        this.$switcher.eq(num).addClass("selected");
    },
    destroy: function() {
        this.$switcher.removeAttr("x-switcher-no").removeClass("selected").unbind("click");
        this.$layer.children().removeAttr("x-switchlayer-displaymode").html("");
    }
}

// 这是一个通用的视图类。
function tot_view()
{
    this.pageSwitcher = new tab_switcher($("#nav-top-content > .switcher"), $("#rp-switcher-layer"), "inner");
    this.lessonSwitcher = new tab_switcher($("#lesson-intro-switcher-layer > .switcher"), $("#lesson-intro-txt"), "inner");
}
tot_view.prototype = {
    loginview: function(txt) {
        var $login_layer = $("#login-layer");
        $login_layer.html('<h1>用户信息</h1><div id="user-info" style="margin-left:20px;">'+txt+'</div>');
    },
    normalview: function(title_o, txt_o) {
        this.lessonSwitcher.clear();
        for(var i=0,len=title_o.length;i<len;i++)
        {
            this.lessonSwitcher.insert('<a class="switcher fence fence-small" href="javascript:">'+title_o[i]+'</a>',
                                        txt_o[i]);
        }
        this.lessonSwitcher.update();
    }
}