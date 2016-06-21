	var dateFormat = function (date,fmt) {
        var _date = date || (this.getMilliseconds ? this : new Date());
        fmt = fmt || "yyyy-MM-dd hh:mm:ss"
        var o = {
            "M+": _date.getMonth() + 1, //月份 
            "d+": _date.getDate(), //日 
            "h+": _date.getHours(), //小时 
            "m+": _date.getMinutes(), //分 
            "s+": _date.getSeconds(), //秒 
            "q+": Math.floor((_date.getMonth() + 3) / 3), //季度 
            "S": _date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

	var pageNav = function(p) {
		var ds = {}
		if (p.values && p.values.totalCount) {
			ds = {
				itemTotal: p.values.totalCount,
				itemPerPage: p.values.pageSize,
				page: p.values.pageNo //页码
			}
		} else {
			ds = p;
		}
		var q = {
			itemPerPage: ds.itemPerPage || 10, //每页的条数
			sizeArr: ds.sizeArr || [10, 20, 50],
			maxLinkShow: ds.maxLinkShow || 5, //显示的页数
			itemTotal: ds.itemTotal, //记录总数
			page: ds.page || 1, //当前页码
			lang: ds.lang || {
				allcount: '共<em>%Total%</em>条数据',
				textmode: '当前 <em>%page%</em>/%maxpage% 页 ', //其他信息模版
				textpagesize: '每页 %pagesize% 条',
				Prev: '<i class="icon-angle-left"></i>上一页',
				Next: '下一页<i class="icon-angle-right"></i>',
				more: "...",
				gotxt: '跳转'
			},
			totalPage: ds.totalPage || Math.ceil(ds.itemTotal / ds.itemPerPage),
			classNames: ds.classNames || {},
			goForm: ds.goForm || false
		}

		var v, r, html = "",
			k, B = [],
			E = q.itemPerPage - 0, //每页条数
			g = q.page - 0, //当前页码
			G = q.itemTotal, //总记录数
			C = q.maxLinkShow - 0, //[翻页按钮数]
			h = q.totalPage;

		if (g > h) {
			g = h;
		}

		if (h > 0) {
			var pagesizeHTML = [];
			if (q.sizeArr && q.sizeArr.length) {
				var pageSizeItem = [];
				var reg = new RegExp('(\\s|^)' + E + '(\\s|$)');
				if (!reg.test(q.sizeArr.join(" "))) q.sizeArr.push(E);
				q.sizeArr.sort()
				pageSizeItem.push('<select name="pagesize">')
				for (var xs = 0; xs < q.sizeArr.length; xs++) {
					var _size = q.sizeArr[xs];
					pageSizeItem.push('<option value="' + _size + '"' + (E == _size ? ' selected="selected"' : '') + '>' + q.sizeArr[xs] + '</option>')
				}
				pageSizeItem.push('</select>');
				pagesizeHTML.push(q.lang.textpagesize.replace('%pagesize%', pageSizeItem.join('')));
			} else {
				pagesizeHTML.push(q.lang.textpagesize.replace('%pagesize%', E));
			}

			html = '<span class="pagenav-wrapper' + (h === 1 ? "only-one-page" : "") + '"><span class="pagenav-desc">' +
				(typeof G !== 'undefined' ? q.lang.allcount.replace('%Total%', G) : '') +
				q.lang.textmode.replace('%page%', g).replace('%maxpage%', h) + pagesizeHTML.join("") + '</span><span class="pagenav-units">';

			if (h <= C) {
				for (v = 1; v <= h; v++) {
					var a,
						y,
						j;
					if (g == v) {
						a = "pagenav-current-link pagenav-link";
						y = true
					} else {
						a = "pagenav-link";
						y = false
					}
					j = {
						text: v,
						index: v,
						isCurrent: y,
						cls: a
					};
					B.push(j)
				}
			} else {
				if (h > C) {
					var z = C - 3;
					if (g >= h - 1 || g <= 2) {
						z++
					}
					var x = Math.floor(z / 2),
						w = z - x,
						u = g - 1,
						t = h - g,
						m;
					if (g - 1 > x) {
						B.push({
							text: q.lang.Prev,
							index: g - 1,
							isCurrent: false,
							cls: "pagenav-link pagenav-link-prev"
						})
					}
					if (t <= w) {
						m = z - t;
						B.push({
							text: 1,
							index: 1,
							isCurrent: false,
							cls: "pagenav-link"
						})
					} else {
						if (u > x) {
							m = x;
							B.push({
								text: 1,
								index: 1,
								isCurrent: false,
								cls: "pagenav-link"
							})
						} else {
							m = u
						}
					}
					var e = z - m;
					for (v = 0; v < m; v++) {
						var j = {
							text: g - m + v,
							index: g - m + v,
							isCurrent: false,
							cls: "pagenav-link"
						};
						B.push(j)
					}
					B.push({
						text: g,
						index: g,
						isCurrent: true,
						cls: "pagenav-link pagenav-current-link"
					});
					for (v = 1; v <= e; v++) {
						var j = {
							text: g + v,
							index: g + v,
							isCurrent: false,
							cls: "pagenav-link"
						};
						B.push(j)
					}
					if (t > e) {
						B.push({
							text: h,
							index: h,
							isCurrent: g == h ? true : false,
							cls: g == h ? "pagenav-link pagenav-current-link" : "pagenav-link"
						})
					}
					if (t > w) {
						B.push({
							text: q.lang.Next,
							index: g + 1,
							isCurrent: false,
							cls: "pagenav-link pagenav-link-next"
						})
					}
				}
			}
		} else {
			html = ""
		}
		var l = B.length,
			A, s = 0,
			f, F = "",
			d = false,
			D = "";

		for (; s < l; s++) {
			f = B[s];
			if (s > 0) {
				d = B[s - 1]
			}
			F = (f.isCurrent ? "<span " : '<a href="javascript:;" ') + 'data-page="' + f.index + '" class="page-' + f.index + " " + f.cls + '">' + f.text + "</" + (f.isCurrent ? "span>" : "a>");
			if (d && (d.index < f.index - 1)) {
				html += '<span class="pagenav-more">' + q.lang.more + "</span>"
			}
			html += F
		}
		html += '</span>'
		if (h > 0 && q.goForm) {
			html += '<form data-max="' + h + '" class="pagenav-gobox pagenav-goform ' + (q.classNames.goform || '') + '">'
			html += '<input type="number" class="pagenav-goinput ' + (q.classNames.goinput || '') + '" name="page" value="' + q.page + '" />'
			html += '<span class="input-group-btn">'
			html += '<button type="submit" class="pagenav-gobtn ' + (q.classNames.gobtn || '') + '">' + q.lang.gotxt + '</button>'
			html += '</span>'
			html += '</form>'
		}
		html += '</span>';
		return html;
	};

	var apis = {
		allList: "?/q/ajax/all/",
		myList: "?/q/ajax/list/"
	}

	var templateObj = {
		statumap : {"1":"未开始","5":"进行中","10":"已结束"}
		,dateFormat : dateFormat
	}

	function event_page() {
		$('#ajax_box').on('click', '.pagenav a[data-page]', function() {
			var obj = $(this);
			//document.location.href = document.location.href.replace(/([^\/]*)$/,obj.data('page'));
			document.location.hash = obj.data('page');
			return false;
		}).on('submit', ".pagenav .pagenav-goform", function() {
			var pagebox = $(this).find('input[name=page]'),
				max = $(this).data('max'),
				page = pagebox.length ? +$.trim(pagebox.val()) : "";
			if (isNaN(page)) return false;
			page = page < 1 ? 1 : page > max ? max : page;
			if (page) {
				//document.location.href = document.location.replace(/([^\/]*)$/,obj.data('page'));
				document.location.hash = page;
			}
			return false;
		})

		$('#ajax_box').on('colspanMsg','table',function(e,msg){
            var o = $(this)
                ,tds = o.find('tr:eq(0)>td').length;
            o.find('>tbody').html('<tr><td colspan="' + tds + '">' + msg + '</td></tr>')
        })
        .on('loading','table',function(){
                $(this).trigger('colspanMsg',['<div class="text-center">' + "正在加载数据..." +  '</div>']).find(':checkbox[data-checkname]').prop('checked',false)
                return false;
            })
        .on('nodata','table',function(){
                $(this).trigger('colspanMsg',['<div class="text-center">' + "暂无数据!" +  '</div>'])
                return false;
            })
        .on('errdata','table',function(e,err){
        		var errmsg="";
        		if(typeof err == "object"){
        			errmsg += err.status ? "status:" + err.status : '';
        			errmsg += err.statusText ? " statusText:" + err.statusText : '';
        			errmsg += err.responseText ? " responseText:" + err.responseText : '';
        		}else{
        			errmsg = err;
        		}
                $(this).trigger('colspanMsg',['<div class="text-center text-danger"> ' + "出错" + '：' + _.escape(errmsg) + '</div>'])
                return false;
            })
	}


$(function() {
	var getlistapi = $('#ajax_box').data('all') ? apis.allList : apis.myList;
	var templateMod = $("#qTemplate").html();
	var template = _.template(templateMod);
	event_page()
	$(window).on('hashchange',fillTable).trigger('hashchange');
	function fillTable(){
		var query = {}
		if(QID){
			query.page = QID;
		}
		if(/#\d+/.test(location.hash)){
			query.page = location.hash.substr(1);
		}
		var table = $('#ajax_box').find('table');
		table.trigger('loading');
		AWS.loading('show');
		$.post(getlistapi, query).then(function(data) {
			if (data.code) return $.Deferred().reject(data.msg);
			var qdata = data.data,page = data.page;
			if(qdata.length){
				table.find('tbody').html(template($.extend({},templateObj,{items:qdata})));
				if(data.page.total_page > 1){
					$('.pagenav').html(pageNav({
						sizeArr:[],
						totalPage: page.total_page,
						itemPerPage: page.per_page,
						page: page.current_page
					}));
				}else{
					$('.pagenav').html('');
				}
			}else{
				table.trigger('nodata');
				$('.pagenav').html('');
			}
		}).fail(function(err) {
			var msg = "";
			if(err.statusText){
				msg = err.statusText;
			}else{
				msg = err || "未知错误";
			}
			table.trigger('errdata',[err]);
			//alert(msg);
		}).always(function(){
			AWS.loading();
		})
	}
})