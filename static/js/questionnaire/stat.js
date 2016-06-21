var templateObj = {
    types : {
        "radio":"单选",
        "checkboxes":"多选",
        "dropdown":"下拉",
        "text":"填空",
        "mutitext":"简答",
        "singleMatrix":"矩阵单选",
        "mutiMatrix":"矩阵多选",
        "singlePic":"图片单选",
        "mutiPic":"图片多选"
    }
} 
//var testdata = {"code":0,"msg":null,"data":{"id":2,"sn":"e50fcea55e","uid":1,"username":"admin","status":2,"title":"测试下调查一下","desc":"测试一下","version":1,"starttime":1463390227,"endtime":1465982227,"createtime":1463390227,"qid":2,"content":[{"label":"你最常用的手机？","field_type":"radio","required":true,"field_options":{"options":[{"label":"苹果","checked":false,"amount":0},{"label":"三星","checked":false,"amount":2}],"description":"","include_other_option":true},"cid":"c2"},{"label":"你的爱好？","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"运动","checked":false,"amount":1},{"label":"读书","checked":false,"amount":2},{"label":"看电影","checked":false,"amount":2},{"label":"宅神","checked":false,"amount":0}],"include_other_option":true},"cid":"c6"},{"label":"选择你最喜欢的省？","field_type":"dropdown","required":true,"field_options":{"options":[{"label":"广东省","checked":false,"amount":1},{"label":"陕西省","checked":false,"amount":1},{"label":"湖北省","checked":false,"amount":0}],"include_blank_option":false},"cid":"c11"},{"label":"你对相关品牌的感受？","field_type":"singleMatrix","required":true,"field_options":{"rows":[{"label":"苹果"},{"label":"三星"}],"cols":[{"label":"喜欢"},{"label":"不喜欢"}],"options":[{"label":"苹果","items":[{"label":"喜欢","amount":2},{"label":"不喜欢","amount":0}]},{"label":"三星","items":[{"label":"喜欢","amount":1},{"label":"不喜欢","amount":1}]}]},"cid":"c2"},{"label":"您的Email","field_type":"text","required":false,"field_options":{"options":[{"result":"sfsfs","time":"2016-06-14 11:40:57"},{"result":"zhu@tcl.com","time":"2016-06-14 11:32:29"}]},"cid":"c11"},{"label":"您的想法？","field_type":"mutitext","required":false,"field_options":{"options":[{"result":"fdasfdafdsafdsaf","time":"2016-06-14 11:40:57"},{"result":"这仅仅是                                                                                                                                           一个\n测试而已~~~","time":"2016-06-14 11:32:29"}]},"cid":"c15"}],"updatetime":null,"count":2}};

function imgshow(){
    $("#wrap").find("a[rel]").fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        loop        : false,
        helpers     : {
            title   : { type : 'float' },
            buttons : {}
        }
    })
}

$(function() {
    var templateMode = $("#qTemplate").html();
    var template = _.template(templateMode);
    $.post("?/q/ajax/statistic/", {"sn":QID} ,function(res){
        //res = testdata;
        if (res.code == 0) {
            $("#wrap").html(template($.extend({},templateObj,res)))
        } else {
            $("#wrap").html('<div class="title"><h2><div class="title_content">' + res.msg + '</div></h2></div>');
            $("#down_excel").hide();
        }
        imgshow();
    });
});