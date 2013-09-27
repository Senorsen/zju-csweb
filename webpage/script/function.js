// ZJU-cs-basic-opt
// function.js - 功能函数

function page()
{
    this.pageSwitcher = new tab_switcher($("#nav-top-content > .switcher"), $("#rp-switcher-layer"), [$("#rp-switcher-layer").html(),'','','','']);
    this.lessonSwitcher = new tab_switcher($("#lesson-intro-switcher-layer > .switcher"), $("#lesson-intro-txt"), ['<div>我自己给不了我自己一个理由从现在这种状态中转换一下，当然你更不可能给我一个。。。反正不放在心上不是一直是我的特长么，反正这样不是很好么，反正我也不胆大也没多余精力么，操心毛线。</div>','','','']);
}
page.prototype = {
    
}