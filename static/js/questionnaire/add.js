(function(global, $){
    var editor, ready = false;
    var retryStartDate = new Date().getTime();
    var retryTime = 10000;
    var fb;

    $(function(){
        if(id){
            $.ajax({
                url:'?/q/ajax/view/',
                method: 'post',
                data: {sn: id},
                success:function(json) {
                    if (json.code == 0 && json.data) {
                        initilize({
                            title: json.data.title,
                            content: json.data.desc,
                            fields: json.data.content,
                            version: json.data.version,
                            sn: json.data.sn,
                            id: json.data.id,
                            starttime: json.data.starttime ? getDateStr(json.data.starttime) : '',
                            endtime: json.data.endtime ? getDateStr(json.data.endtime) : '',
                            islogin: json.data.islogin - 0,
                            createtime: json.createtime,
                            qid: json.data.qid
                        });
                    }
                }
            });
        }
        else {
            initilize('');
        }
    });

    function initilize(defaultData) {
        fb = new Formbuilder({
            selector: '.fb-body',
            bootstrapData: defaultData,
            getDateFromStr: function(str){
                var n = new Date(helper.getDateFromStr(str)).getTime() / 1000;
                return n;
            }
        });
        if(defaultData){
            delete  defaultData.title;
            delete  defaultData.content;
            delete defaultData.starttime;
            delete defaultData.endtime;
            delete  defaultData.fields;
            delete  defaultData.islogin;
        }
        fb.on('save', function (data) {
            var d = JSON.parse(data);
            var p = {
                title: d.title,
                desc: editor.getContent() || d.content || '',
                starttime: d.starttime ? new Date(helper.getDateFromStr(d.starttime)).getTime() / 1000 : null,
                endtime: d.endtime ? new Date(helper.getDateFromStr(d.endtime)).getTime() / 1000 : null,
                islogin: d.islogin,
                content: JSON.stringify(d.fields)
            };
            if(defaultData){
                p = $.extend(p, defaultData);
            }
            $.ajax({
                url: '?/q/ajax/save/',
                method: 'post',
                data: p,
                success: function (json) {
                    if (json.code == 0) {
                        fb.mainView.updateFormButton('saved');
                        // 判断是否跳转分享页
                        if(json.data){
                            if(json.data.status == 5) {
                                location.href = '?/q/share/' + json.data.sn;
                            }
                            else if(json.data.status == 1){
                                AWS.alert('您的问卷未开始，暂不可分享！\r\n若需立即分享，请修改问卷启动时间');
                            }
                            else if(json.data.status == 10){
                                AWS.alert('您的问卷已结束，不可进行分享！\r\n若需分享，请修改时间重启问卷');
                            }
                        }
                    }
                    else if(json.code == 1){
                        location.href = '/account/login/'; // 需要登录
                    }
                    else {
                        AWS.show_tips('保存失败');
                        fb.mainView.updateFormButton('ready');
                    }
                },
                error: function (e) {
                    fb.mainView.updateFormButton('ready');
                }
            });
        });

        // 新增时 给全局设置 时间选项设置默认值 30d
        if(!defaultData) {
            var now = Date.now();
            $('#start_date').val(getDateStr(now / 1000));
            $('#end_date').val(getDateStr(now / 1000 + 30*24*60*60));
        }
    }

    setTimeout(function(){
        if(document.getElementById('cnt1')){
            if(!ready) {
                ready = true;
                $.fn.datetimepicker.dates['zh-CN'] = {
                    days: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"],
                    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
                    meridiem: ["上午", "下午"],
                    today: "今天"
                };
                editor = UM.getEditor('cnt1', {
                    toolbar: UMEDITOR_TOOLBAR_OPTIONS.mini,
                    initialFrameWidth: '100%',
                    initialFrameHeight: 100,
                    zIndex: 999
                });
                editor.addListener('contentchange', function(d){
                    //fb && fb.mainView.forceRender();
                    $('#cnt1').text(editor.getContent());
                });
                $('#start_date, #end_date').datetimepicker({
                    language: 'zh-CN',
                    autoclose: true,
                    todayHighlight: true
                }).on('changeDate', function(d){
                    var $this = $(this);
                    fb && fb.mainView.forceRender();
                    $this.parents('.input-group').removeClass('has-error');
                    if($this.attr('id') === 'start_date'){
                        $('#end_date').datetimepicker('setStartDate', new Date(d.timeStamp));
                    }
                });
                $('#title').on('keyup', function(){
                    $(this).removeClass('error');
                });
            }
        }
        else{
            var retryEndDate = new Date().getTime(),
                fn = arguments.callee;
            if(retryEndDate - retryStartDate < retryTime){
                setTimeout(function(){
                    fn.call(null);
                }, 13);
            }
        }
    }, 13);

    function getDateStrOld(time){
        try {
            var d = new Date(time * 1000),
                h = d.getHours(),
                m = d.getMinutes(),
                ap = '凌晨';
            if (h > 12) {
                h = h % 12;
                ap = '下午';
            }
            return d.getFullYear() + '-' + fix(d.getMonth() + 1) + '-' + fix(d.getDate()) + ' ' + ap + '' + fix(h) + '点' + fix(m) + '分';
        }
        catch (e) {

        }
        return '';
    }

    function getDateStr(time){
        try {
            var d = new Date(time * 1000),
                h = d.getHours(),
                m = d.getMinutes();
            return d.getFullYear() + '-' + fix(d.getMonth() + 1) + '-' + fix(d.getDate()) + ' ' + fix(h) + ':' + fix(m);
        }
        catch (e) {

        }
        return '';
    }

    function getDateFromStr(time){
        var ts = time.trim().split(' '), d='', t2;

        if(ts.length === 2) {
            var t1 = ts[0].split('-');
            t2 = ts[1];
            var pm = t2.replace(/[^0-9]*(\d+)+[^0-9]+(\d+)[^0-9]*/, '$1:$2');
            if(t1.length === 3) {
                d = t1[1] + '/' + t1[2] + '/' + t1[0];
            }
            else{
                d = t1.join('/');
            }
            d += ' ' + pm + ':00';
            return d;
        }
        return null;
    }

    function fix(s){
        s = '0'+s;
        return s.substr(s.length - 2);
    }

    !global.helper && (global.helper = {});
    global.helper.getDateStr = getDateStr;
    global.helper.getDateFromStr = getDateFromStr;
}(this, jQuery));