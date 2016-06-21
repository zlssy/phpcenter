$(function(){
    var openBtn = $('#btn_open'),
        copyBtn = $('#btn_copy'),
        urlIpt = $('#url'),
        qrcode = $('#qrcode'),
        shareList = $('#share_list'),
        shareTitle = '',
        shareDesc = '',
        timer,
        sinaWeiboShareLink = 'http://v.t.sina.com.cn/share/share.php?title={title}&url={url}',
        qqShareLink = 'http://connect.qq.com/widget/shareqq/index.html?url={url}&showcount=0&desc=&summary={summary}&title={title}&site=qq&pics={pics}';

    var wechatIcon = shareList.find('a').eq(0),
        qqIcon = shareList.find('a').eq(2),
        weiboIcon = shareList.find('a').eq(1);

    $('<div id="__qr_download"></div>').appendTo($(document.body));

    var qrdownload = $('#__qr_download');
    qrdownload.css({
        position: 'absolute',
        left: -1000,
        top: -1000,
        opacity: 0
    });

    ZeroClipboard.config({
        swfPath: window.G_STATIC_URL + '/swf/ZeroClipboard.swf',
        trustedDomains: window.location.host ? [window.location.host] : [],
        forceHandCursor: true,
        bubbleEvents: false,
        hoverClass: 'hover'
    });

    var swfCopy = new ZeroClipboard(copyBtn),
        bridge = $("#global-zeroclipboard-html-bridge");

    swfCopy.on('ready', function(){
        bridge.data('placement', 'top').attr('title', '复制到剪贴板').tooltip();
        swfCopy.on('active', function(e){
           console.log('go');
        });
        swfCopy.on('copy', function(e){
            var cd = e.clipboardData;
            cd.clearData();
            cd.setData({
                "text/plain":urlIpt.val()
            });
        }).on('aftercopy', function(){
            timer && clearTimeout(timer);
            copyBtn.attr("title", "复制成功！").tooltip("fixTitle").tooltip("show").attr('title', "").tooltip("fixTitle");
            timer = setTimeout(function(){
                copyBtn.tooltip('hide');
            }, 1000);
        });
    });
    swfCopy.on("noflash wrongflash", function() {
        $(".zero-clipboard").remove();
        ZeroClipboard.destroy();
        copyBtn.attr('title', '请使用Ctrl+C复制').tooltip();
    });

    qrcode.qrcode({
        width: 100,
        height: 100,
        text: urlIpt.val()
    });

    $('#size_list').on('click', 'a', function() {
        if(/msie|Trident/i.test(navigator.userAgent)){
            AWS.alert('IE浏览器不支持下载，请使用chrome或者firefox等高级浏览器使用此功能。');
            return;
        }
        var index = $('#size_list').find('a').index($(this));
        var size = [256, 512, 1024];

        qrdownload.html('').qrcode({
            width: size[index],
            height: size[index],
            text: urlIpt.val()
        });

        var data = qrdownload.find('canvas').get(0).toDataURL('png');
        data = data.replace('image/png', 'image/octet-stream');
        download(data, 'code_' + size[index] + '_' + size[index] + '.png');
    });

    openBtn.size() && openBtn.on('click', function(){
        var url = urlIpt.val();
        openUrl(url, '_blank');
    });

    /* 微信分享 */
    wechatIcon.size() && wechatIcon.on('mouseenter', function(e){
        var $p = $(this),
            cover = $p.find('.cover');
        if(cover.size()){
            cover.show();
        }
        else{
            $('<div class="cover"></div>').appendTo($p);
            $p.find('.cover').css({
                position: 'absolute',
                top: 0,
                left: 14,
                zIndex: 1
            }).qrcode({
                width: 100,
                height: 100,
                text: urlIpt.val()
            });
        }
    }).on('mouseleave', function(e){
        $(this).find('.cover').hide();
    });

    /* qq分享 */
    qqIcon.size() && qqIcon.on('click', function(e){
        openUrl(qqShareLink.format({
            title: encodeURIComponent(shareTitle),
            url: encodeURIComponent(urlIpt.val()),
            summary: encodeURIComponent(shareDesc.replace(/(<.+?>)/g, '')),
            pics: encodeURIComponent(G_STATIC_URL + '/css/default/img/share_logo.png')
        }), '_blank');
    });
//url:http://www.jiathis.com/#jtss-cqq
//showcount:0
//desc:JiaThis - 社会化分享按钮及移动端分享代码提供商！
//summary:JiaThis - 社会化分享按钮及移动端分享代码提供商！
//title:JiaThis - 社会化分享按钮及移动端分享代码提供商！
//site:jiathis
//pics:http://blog.jiathis.com/wp-content/uploads/2013/02/jtweixin.jpg
    /* 新浪微博分享 */
    weiboIcon.size() && weiboIcon.on('click', function(e) {
        openUrl(sinaWeiboShareLink.format({
            title:encodeURIComponent(shareTitle),
            url: encodeURIComponent(urlIpt.val())
        }), '_blank');
    });

    $.ajax({
        url: '?/q/ajax/view/',
        method: 'post',
        data: {sn: qid},
        success: function(json){
            if (json.code == 0 && json.data){
                shareTitle = json.data.title;
                shareDesc = json.data.desc;
                $('h1').html(shareTitle);
            }
        }
    });

    function openUrl(url, target){
        var a = document.createElement('A');
        a.href = url;
        target && (a.target = target);
        a.opacity = 0;
        a.zIndex = -1000;
        a.position = 'absolute';
        a.left = -1000;

        document.body.appendChild(a);

        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, false);
        a.dispatchEvent(e);
        a.parentNode.removeChild(a);
    }

    function download(data, filename){
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;

        a.opacity = 0;
        a.zIndex = -1000;
        a.position = 'absolute';
        a.left = -1000;

        document.body.appendChild(a);

        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, false);
        a.dispatchEvent(e);
        a.parentNode.removeChild(a);
    }

    function format(content, data) {
        var d = data || {};
        return content.replace(/{([^{}]+)}/g, function (v, key) {
            return d[key] || '';
        });
    }

    String.prototype.format = function(d){
        return format(this, d);
    };
});