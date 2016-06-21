$(function()
{
	if ($('#question_id').length)
	{
		ITEM_ID = $('#question_id').val();
	}
	else if ($('#article_id').length)
	{
		ITEM_ID = $('#article_id').val();
	}
    else
    {
        ITEM_ID = '';
    }

	// 判断是否开启富文本编辑器
	if (G_ADVANCED_EDITOR_ENABLE == 'Y')
	{
		// 初始化编辑器
		if(typeof UM.instances === 'undefined')
		{
			UM.instances = [];
		}
		var EDITOR = UM.getEditor('wmd-input');
		var editor_loading = false;	//加一个保存草稿锁
		var EDITOR_CALLBACK = function(){
			var cv = EDITOR.getContent();
			if(cv.length) {
				editor_loading = true;
				$.post(G_BASE_URL + '/account/ajax/save_draft/item_id-1__type-' +　PUBLISH_TYPE, 'message=' + cv, function (result) {
					editor_loading = false;
					$('#question_detail_message').html(result.err + ' <a href="#" onclick="$(\'textarea#advanced_editor\').attr(\'value\', \'\'); AWS.User.delete_draft(1, \'' + PUBLISH_TYPE + '\'); $(this).parent().html(\' \'); return false;">' + _t('删除草稿') + '</a>');
				}, 'json');
			}
		};
		UM.instances.push(EDITOR);

		//自动保存草稿
		var article_id = parseInt($('#article_id').val());
		var question_id = parseInt($('#question_id').val());
		article_id = isNaN(article_id) && 0;
		question_id = isNaN(question_id) && 0;
		if(article_id === 0 && question_id === 0) {	//只有增加帖子或者文章才加上自动保存草稿功能
			EDITOR.addListener('blur', EDITOR_CALLBACK);
		}

		if (PUBLISH_TYPE == 'question')
		{
			if (ATTACH_ACCESS_KEY != '' && $('.aw-upload-box').length)
			{
				var fileupload = new FileUpload('file', '.aw-editor-box .aw-upload-box .btn', '.aw-editor-box .aw-upload-box .upload-container', G_BASE_URL + '/publish/ajax/attach_upload/id-' + PUBLISH_TYPE + '__attach_access_key-' + ATTACH_ACCESS_KEY, {
					'editor' : EDITOR,
					'insertBtnTemplate' : ''
				});
			}

			if (ITEM_ID && G_UPLOAD_ENABLE == 'Y' && ATTACH_ACCESS_KEY != '')
			{
				if ($(".aw-upload-box .upload-list").length) {
					$.post(G_BASE_URL + '/publish/ajax/' + PUBLISH_TYPE + '_attach_edit_list/', PUBLISH_TYPE + '_id=' + ITEM_ID, function (data) {
						if (data['err']) {
							return false;
						} else {
							if (data['rsm']['attachs'])
							{
								$.each(data['rsm']['attachs'], function (i, v) {
									fileupload.setFileList(v);
								});
							}
						}
					}, 'json');
				}
			}
		}
	}

    AWS.Dropdown.bind_dropdown_list($('.aw-mod-publish #question_contents'), 'publish');

    //初始化分类
	if ($('#category_id').length)
	{
		var category_data = '', category_id;

		$.each($('#category_id option').toArray(), function (i, field) {
			if ($(field).attr('selected') == 'selected')
			{
				category_id = $(this).attr('value');
			}
			if (i > 0)
			{
				if (i > 1)
				{
					category_data += ',';
				}

				category_data += "{'title':'" + $(field).text() + "', 'id':'" + $(field).val() + "'}";
			}
		});

		if(category_id == undefined)
		{
			category_id = CATEGORY_ID;
		}

		$('#category_id').val(category_id);

		AWS.Dropdown.set_dropdown_list('.aw-publish-title .dropdown', eval('[' + category_data + ']'), category_id);

		$('.aw-publish-title .dropdown li a').click(function() {
			$('#category_id').val($(this).attr('data-value'));
		});

		$.each($('.aw-publish-title .dropdown .aw-dropdown-list li a'),function(i, e)
		{
			if ($(e).attr('data-value') == $('#category_id').val())
			{
				$('#aw-topic-tags-select').html($(e).html());
			}
		});
	}

	//自动展开标签选择
	$('.aw-edit-topic').click();
});
