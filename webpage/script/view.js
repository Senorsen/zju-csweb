// ZJU-cs-basic-opt
// view.js - 视觉效果，显示组件等



/* Tab Switcher */
function tab_switcher($obj_switcher, $obj_layer, data, defaultPage)
{
    this.$switcher = $obj_switcher;
    this.$layer = $obj_layer;
    if (typeof defaultPage == 'undefined') this.no = 0;
    else this.no = defaultPage;
    this.$layer.html("");
    this.apply();
    if (typeof data == "object") this.data = data;  //数组
    else if (typeof data == "string")
    {
        if (data == "inner")
        {
            $tab_this = this;
            this.$switcher.each(function() {
                $this = $(this);
                $tab_this.data[$this.attr("x-switcher-no")] = $this.attr("x-switcher-data");
            });
        }
        else this.data = $.parseJSON(data);
    }
    else if (typeof data == "undefined")
    {
        this.$switcher.each(function() {
            $this = $(this);
            $tab_this.data[$this.attr("x-switcher-no")] = $this.attr("x-switcher-data");
        });
    }
    for (var e in data)
    {
        $t = $(this.data[e]);
        this.$layer.append($t.attr("x-swichlayer-no",e).attr("x-switchlayer-displaymode",$t.css("display")==''?'block':$t.css("display")));
        if (this.no != e) this.$layer.children().eq(e).css("display", "none");
    }
}
tab_switcher.prototype = {
    apply: function() {
        var $tab_this = this;
        this.$switcher.each(function() {
            $this = $(this);
            var this_no = $tab_this.$switcher.index($this);
            $this.attr("x-switcher-no", this_no);
            if (this_no == $tab_this.no) $this.addClass("selected");
        });
        this.$switcher.click(function() {
            $this = $(this);
            $tab_this.switchTo($this.attr("x-switcher-no"));
        });
    },
    switchTo: function(num) {
        $o = this.$layer.children().eq(this.no);
        $t = this.$layer.children().eq(num);
        $o.css("display", "none");
        $t.css("display", "block").css("display", $t.attr("x-switchlayer-displaymode"));
        this.$switcher.eq(this.no).removeClass("selected");
        this.no = num;
        this.$switcher.eq(num).addClass("selected");
    }
}

