var apis = {
    get:"?/q/ajax/query/",
    //get:"?/q/ajax/view/",
    save:"?/q/ajax/answer/"
}
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
    },
    showtypes: {
        "checkboxes":"多选",
        "mutiMatrix":"多选",
        "mutiPic":"多选"
    }
}

var qs = {}

qs.init = function(){
    this.box = $('.question-list');
    this.elebind();
}
qs.elebind = function(){
    var o = this;
    this.box.on('focus','input.other-answer-input',function(){
        $(this).prev().prop('checked',true).trigger('change.fill');
    }).on('change','ul :radio,ul :checkbox',function(){
        var otherch = $(this).closest('ul').find('[data-other]')
        var otherinput =  otherch.next('input.other-answer-input');
        if(otherch.prop("checked") &&  this == otherch[0]){
            otherinput.trigger('focus');
        }else{
            if(!otherch.prop("checked")) otherinput.val('');
        }
    }).on('focus',".question-item",function(){
        o.hideErr($(this));
    })
    $("#submit_btn").on('click',function(){
        o.submit();
    })

}
qs.findafter = function(){
    this.box.find('[data-type="singlePic"],[data-type="mutiPic"]').each(function(index, el) {
        $(el).find(".imgitem a").fancybox({
            openEffect  : 'none',
            closeEffect : 'none',
            loop        : false,
            helpers     : {
                title   : { type : 'float' },
                buttons : {}
            }
        })
    })
}
qs.verifyQuer =  function(obj){
    var data = obj.data(),
        type = data.type;
    var sItem;
    //添加 图片多选，图片单选 验证
    if(type == 'radio' || type == 'checkboxes' || type=='singlePic' || type=='mutiPic'){ 
        if((sItem = obj.find('.answer-list input:checked')).length){
            if(sItem.last().data('other') && ($.trim(sItem.last().next().val()) == "")){
                qs.showErr(obj,'请填写"其他"项的内容!'); return true;
            }
            if(data.min && data.min>sItem.length){
                qs.showErr(obj,'最少选择'+data.min+'项!'); return true;
            }
            if(data.max && data.max<sItem.length){
                qs.showErr(obj,'最多选择'+data.max+'项!'); return true;
            }
        }else if(data.required){
            qs.showErr(obj,'此题为必答题!'); return true;
        }
    }
    if(type == "dropdown" && data.required && data.boption){
        if(obj.find('.answer-list option:selected').data("boption")){
            qs.showErr(obj,'此题为必答题!'); return true;
        } 
    }
    if(type == "text" || type == "mutitext"){
        if($.trim(obj.find('[name='+data.id+']').val()) == ""){
            if(data.required){qs.showErr(obj,'此题为必答题!'); return true;}
        }else{
            var str = $.trim(obj.find('[name='+data.id+']').val());
            if(data.minlength && data.minlength>str.length){
                qs.showErr(obj,'最少填写'+data.minlength+'个字!'); return true;
            }
            if(data.maxlength && data.maxlength<str.length){
                qs.showErr(obj,'最多填写'+data.maxlength+'个字!'); return true;
            }
        }
    }
    //矩阵题校验
    if(type == "singleMatrix" || type == "mutiMatrix"){
        var qtr = obj.find('tr.question_tr');
        if(data.required){
            var nor = qtr.has(":input:checked");
            if(nor.length<qtr.length){

                qs.showErr(obj,nor.length == 0 ? '此题为必答题!': '所有行都需要回答!'); return true;
            }
        }
    }
}

qs.submit = function(){
    var o = this;
    var items = this.box.find(".question-item");
    var unpass = false;
    items.each(function(index, el) {
        if(o.verifyQuer($(el))) unpass = true;
    });

    if(unpass){
        this.scroll(this.box.find('.iserr'));
        return;  
    } 
    
    var r = {
        sn: QID,
        content: JSON.stringify(o.getDate())
    }
    $("#submit_btn").prop('disabled',true);
    AWS.loading('show');
    $.post(apis.save,r).always(function(){
        AWS.loading();
    }).then(function(data){
        // AWS.alert('您的答卷已经提交，感谢您的参与！');
        // setTimeout(function(){
        //     document.location.href="?/q/";
        // }, 2000);
        if(data.code) return $.Deferred().reject(data.msg);
        document.location.href="?/q/success/";
    }).fail(function(err){
        AWS.alert(err);
    })
};

qs.getDate = function(){
    var item = this.box.find('.question-item');
    var rdata = [];
    item.each(function(index, el) {
        var q = $(el),qd = q.data(),type=qd.type;
        var r = {
            "cid":qd.id
            // ,"label":qd.label
        };
        if(type == "text" || type == "mutitext"){
            r.result = q.find('[name]').val();
        }
        if(type == "radio" || type == "checkboxes" || type == "dropdown" || type == "singlePic" || type == "mutiPic" ){ 
            r.result = [];
            var sitem = q.find(":checked:not([data-other]),:selected");
            sitem.each(function(index, el) {
                r.result.push(el.value);
            });
            if(q.find("[data-other]:checked").length){
                r.result_other = q.find('.other-answer-input').val();
            }
        }
        if(type == "singleMatrix" || type == "mutiMatrix"){
            r.result = [];
            var qtr = q.find('tr.question_tr');
            qtr.each(function(index, el){
                var _r = {},key=$(el).data("label");
                _r[key] = [];
                $(el).find(":checked").each(function(index, el) {
                    _r[key].push(el.value)  
                });
                r.result.push(_r);
            });
        }
        rdata.push(r);
    });
    console.log(rdata);
    return rdata;
}

qs.showErr = function(obj,msg){
    obj.find('.errmsg').text(msg);
    obj.addClass('iserr');
}
qs.hideErr = function(obj,msg){
    obj.removeClass('iserr');
}
qs.scroll = function(obj){
    var top = obj.offset().top - $('#nv').height();
    $("body,html").animate({scrollTop:top},300)
}
//var testData = {"code":0,"msg":null,"data":{"id":13,"uid":1,"username":"admin","status":5,"title":"\u5168\u9898\u578b\u6d4b\u8bd511111111","desc":"","version":1,"starttime":1463383523,"endtime":1465975523,"createtime":1463383523,"sn":"45bc6cd4b5","qid":13,"content":[{"label":"\u5355\u9009\u98981","field_type":"radio","required":true,"field_options":{"options":[{"label":"\u5355\u9009\u98981_1","checked":false},{"label":"\u5355\u9009\u98981_2","checked":false},{"label":"\u5355\u9009\u98981_3","checked":false},{"label":"\u5355\u9009\u98981_4","checked":false}]},"cid":"c2"},{"label":"\u5355\u9009\u98982","field_type":"radio","required":true,"field_options":{"options":[{"label":"\u5355\u9009\u98982_1","checked":false},{"label":"\u5355\u9009\u98982_2","checked":false},{"label":"\u5355\u9009\u98982_3","checked":false}],"include_other_option":true},"cid":"c9"},{"label":"\u591a\u9009\u98981","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"\u591a\u9009\u98981_1","checked":false},{"label":"\u591a\u9009\u98981_2","checked":false},{"label":"\u591a\u9009\u98981_3","checked":false},{"label":"\u591a\u9009\u98981_4","checked":false}]},"cid":"c5"},{"label":"\u591a\u9009\u98982","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"\u591a\u9009\u98982_1","checked":false},{"label":"\u591a\u9009\u98982_2","checked":false},{"label":"\u591a\u9009\u98982_3","checked":false}],"include_other_option":true},"cid":"c14"},{"label":"\u9009\u62e9\u98981","field_type":"dropdown","required":true,"field_options":{"options":[{"label":"\u9009\u62e9\u98981_1","checked":false},{"label":"\u9009\u62e9\u98981_2","checked":false},{"label":"\u9009\u62e9\u98981_3","checked":false},{"label":"\u9009\u62e9\u98981_4","checked":false},{"label":"\u9009\u62e9\u98981_5","checked":false},{"label":"\u9009\u62e9\u98981_5","checked":false}],"include_blank_option":false,"description":""},"cid":"c18"},{"label":"\u9009\u62e9\u98982","field_type":"dropdown","required":true,"field_options":{"options":[{"label":"\u9009\u62e9\u98982_1","checked":false},{"label":"\u9009\u62e9\u98982_2","checked":false},{"label":"\u9009\u62e9\u98982_3","checked":false},{"label":"\u9009\u62e9\u98982_4","checked":false},{"label":"\u9009\u62e9\u98982_5","checked":false}],"include_blank_option":true},"cid":"c22"},{"label":"\u586b\u7a7a\u98981","field_type":"text","required":true,"field_options":[],"cid":"c26"},{"label":"\u586b\u7a7a\u98982","field_type":"text","required":false,"field_options":[],"cid":"c30"},{"label":"\u7b80\u7b54\u98981","field_type":"mutitext","required":true,"field_options":{"size":"medium"},"cid":"c34"},{"label":"\u7b80\u7b54\u98982","field_type":"mutitext","required":false,"field_options":{"size":"medium"},"cid":"c38"},{"label":"对什么打分","field_type":"range","required":true,"field_options":{"description":"ttt","num":"10"},"cid":"c39"},{"label":"单选矩阵","field_type":"singleMatrix","required":true,"field_options":{"description":"xxx","cols":[{label:"满意"},{label:"一般"},{label:"不满意"}],"rows":[{label:"问题1"},{label:"问题2"}]},"cid":"c40"},{"label":"多选矩阵","field_type":"mutiMatrix","required":true,"field_options":{"description":"xxx","cols":["满意","一般","不满意"],"rows":["问题1","问题2"]},"cid":"c41"},{"label":"图片3423423fsdfsdf单选","field_type":"singlePic","required":true,"field_options":{"description":"xxx","options":[{label:"图片1",uri:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png",thumb:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png"},{label:"图片2",uri:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png",thumb:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png"}]},"cid":"c350"},{"label":"图片多选","field_type":"mutiPic","required":true,"field_options":{"description":"xxx","options":[{label:"图342343222224234片1",uri:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png",thumb:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png"},{label:"图片2",uri:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png",thumb:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png"},{label:"图片3",uri:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png",thumb:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png"},{label:"图片23423423423432rtretert4",uri:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png",thumb:"http://127.0.0.1:8880/uploads/umeditor/20160518/14635523893392.png"}]},"cid":"c351"}],"updatetime":1463384520}};
$(function(){
    qs.init();
    var templateMode = $("#qTemplate").html();
    var template = _.template(templateMode);
    //AWS.loading('show');
    AWS.loading_mini($('.question-list'),'show')
    $.post(apis.get,{sn:QID}).always(function(){
        //AWS.loading();
        //AWS.loading();
        AWS.loading_mini($('.question-list'))
    }).then(function(data){
        if(data && data.code == 1){
            //document.location.href = LOGIN_URL;
            $('#unlogin').show();
            return $.Deferred().reject("  ");
        }else{
            return $.Deferred().resolve(data);
        }
    }).then(function(data){
        //data = testData;
        if(data.code) return $.Deferred().reject(data.msg);
        var qdata = data.data.content;
        $('#q_title h2').text(data.data.title);
        $('#q_desc').html(data.data.desc);
        $('.question-list').html(template($.extend({},templateObj,{items:qdata})));
        $('#submitcomm').show();
        qs.findafter();
    }).fail(function(err) {
        var msg = "";
        if(err.statusText){
            msg = err.statusText;
        }else{
            msg = err || "未知错误";
        }
        //alert(msg);
        $('.question-list').addClass('text-danger text-center').text(msg);
        $('#q_navs').removeClass('hide')
        //document.location.href = "?/q/";
    })
})