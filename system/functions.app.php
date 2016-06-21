<?php
/**
 * WeCenter Framework
 *
 * An open source application development framework for PHP 5.2.2 or newer
 *
 * @package		WeCenter Framework
 * @author		WeCenter Dev Team
 * @copyright	Copyright (c) 2011 - 2014, WeCenter, Inc.
 * @license		http://www.wecenter.com/license/
 * @link		http://www.wecenter.com/
 * @since		Version 1.0
 * @filesource
 */

/**
 * WeCenter APP 函数类
 *
 * @package		WeCenter
 * @subpackage	App
 * @category	Libraries
 * @author		WeCenter Dev Team
 */


/**
 * 获取头像地址
 *
 * 举个例子：$uid=12345，那么头像路径很可能(根据您部署的上传文件夹而定)会被存储为/uploads/000/01/23/45_avatar_min.jpg
 *
 * @param  int
 * @param  string
 * @return string
 */
function get_avatar_url($uid, $size = 'min')
{
	$uid = intval($uid);

	if (!$uid)
	{
		return G_STATIC_URL . '/common/avatar-' . $size . '-img.png';
	}

	foreach (AWS_APP::config()->get('image')->avatar_thumbnail as $key => $val)
	{
		$all_size[] = $key;
	}

	$size = in_array($size, $all_size) ? $size : $all_size[0];

	$uid = sprintf("%09d", $uid);
	$dir1 = substr($uid, 0, 3);
	$dir2 = substr($uid, 3, 2);
	$dir3 = substr($uid, 5, 2);

	if (file_exists(get_setting('upload_dir') . '/avatar/' . $dir1 . '/' . $dir2 . '/' . $dir3 . '/' . substr($uid, - 2) . '_avatar_' . $size . '.jpg'))
	{
		return get_setting('upload_url') . '/avatar/' . $dir1 . '/' . $dir2 . '/' . $dir3 . '/' . substr($uid, - 2) . '_avatar_' . $size . '.jpg';
	}
	else
	{
		return G_STATIC_URL . '/common/avatar-' . $size . '-img.png';
	}
}

/**
 * 附件url地址，实际上是通过一定格式编码指配到/app/file/main.php中，让download控制器处理并发送下载请求
 * @param  string $file_name 附件的真实文件名，即上传之前的文件名称，包含后缀
 * @param  string $url 附件完整的真实url地址
 * @return string 附件下载的完整url地址
 */
function download_url($file_name, $url)
{
	return get_js_url('/file/download/file_name-' . base64_encode($file_name) . '__url-' . base64_encode($url));
}

// 检测当前操作是否需要验证码
function human_valid($permission_tag)
{
	if (! is_array(AWS_APP::session()->human_valid))
	{
		return FALSE;
	}

	if (! AWS_APP::session()->human_valid[$permission_tag] or ! AWS_APP::session()->permission[$permission_tag])
	{
		return FALSE;
	}

	foreach (AWS_APP::session()->human_valid[$permission_tag] as $time => $val)
	{
		if (date('H', $time) != date('H', time()))
		{
			unset(AWS_APP::session()->human_valid[$permission_tag][$time]);
		}
	}

	if (sizeof(AWS_APP::session()->human_valid[$permission_tag]) >= AWS_APP::session()->permission[$permission_tag])
	{
		return TRUE;
	}

	return FALSE;
}

function set_human_valid($permission_tag)
{
	if (! is_array(AWS_APP::session()->human_valid))
	{
		return FALSE;
	}

	AWS_APP::session()->human_valid[$permission_tag][time()] = TRUE;

	return count(AWS_APP::session()->human_valid[$permission_tag]);
}

/**
 * 仅附件处理中的preg_replace_callback()的每次搜索时的回调
 * @param  array $matches preg_replace_callback()搜索时返回给第二参数的结果
 * @return string  取出附件的加载模板字符串
 */
function parse_attachs_callback($matches)
{
	if ($attach = AWS_APP::model('publish')->get_attach_by_id($matches[1]))
	{
		TPL::assign('attach', $attach);

		return TPL::output('question/ajax/load_attach', false);
	}
}

/**
 * 获取主题图片指定尺寸的完整url地址
 * @param  string $size
 * @param  string $pic_file 某一尺寸的图片文件名
 * @return string           取出主题图片或主题默认图片的完整url地址
 */
function get_topic_pic_url($size = null, $pic_file = null)
{
	if ($sized_file = AWS_APP::model('topic')->get_sized_file($size, $pic_file))
	{
		return get_setting('upload_url') . '/topic/' . $sized_file;
	}

	if (! $size)
	{
		return G_STATIC_URL . '/common/topic-max-img.png';
	}

	return G_STATIC_URL . '/common/topic-' . $size . '-img.png';
}

/**
 * 获取专题图片指定尺寸的完整url地址
 * @param  string $size     三种图片尺寸 max(100px)|mid(50px)|min(32px)
 * @param  string $pic_file 某一尺寸的图片文件名
 * @return string           取出专题图片的完整url地址
 */
function get_feature_pic_url($size = null, $pic_file = null)
{
	if (! $pic_file)
	{
		return false;
	}
	else
	{
		if ($size)
		{
			$pic_file = str_replace(AWS_APP::config()->get('image')->feature_thumbnail['min']['w'] . '_' . AWS_APP::config()->get('image')->feature_thumbnail['min']['h'], AWS_APP::config()->get('image')->feature_thumbnail[$size]['w'] . '_' . AWS_APP::config()->get('image')->feature_thumbnail[$size]['h'], $pic_file);
		}
	}

	return get_setting('upload_url') . '/feature/' . $pic_file;
}

function get_host_top_domain()
{
	$host = strtolower($_SERVER['HTTP_HOST']);

	if (strpos($host, '/') !== false)
	{
		$parse = @parse_url($host);
		$host = $parse['host'];
	}

	$top_level_domain_db = array('com', 'edu', 'gov', 'int', 'mil', 'net', 'org', 'biz', 'info', 'pro', 'name', 'coop', 'aero', 'xxx', 'idv', 'mobi', 'cc', 'me', 'jp', 'uk', 'ws', 'eu', 'pw', 'kr', 'io', 'us', 'cn');

	foreach ($top_level_domain_db as $v)
	{
		$str .= ($str ? '|' : '') . $v;
	}

	$matchstr = "[^\.]+\.(?:(" . $str . ")|\w{2}|((" . $str . ")\.\w{2}))$";

	if (preg_match('/' . $matchstr . '/ies', $host, $matchs))
	{
		$domain = $matchs['0'];
	}
	else
	{
		$domain = $host;
	}

	return $domain;
}

function parse_link_callback($matches)
{
	if (preg_match('/^(?!http).*/i', $matches[1]))
	{
		$url = 'http://' . $matches[1];
	}
	else
	{
		$url = $matches[1];
	}

	if (is_inside_url($url))
	{
		return '<a href="' . $url . '">' . FORMAT::sub_url($matches[1], 50) . '</a>';
	}
	else
	{
		return '<a href="' . $url . '" rel="nofollow" target="_blank">' . FORMAT::sub_url($matches[1], 50) . '</a>';
	}
}

function is_inside_url($url)
{
	if (!$url)
	{
		return false;
	}

	if (preg_match('/^(?!http).*/i', $url))
	{
		$url = 'http://' . $url;
	}

	$domain = get_host_top_domain();

	if (preg_match('/^http[s]?:\/\/([-_a-zA-Z0-9]+[\.])*?' . $domain . '(?!\.)[-a-zA-Z0-9@:;%_\+.~#?&\/\/=]*$/i', $url))
	{
		return true;
	}

	return false;
}

function get_weixin_rule_image($image_file, $size = '')
{
	return AWS_APP::model('weixin')->get_weixin_rule_image($image_file, $size);
}

function import_editor_static_files()
{
	//TPL::import_js('js/editor/ckeditor/ckeditor.js');
	//TPL::import_js('js/editor/ckeditor/adapters/jquery.js');
	TPL::import_css('js/umeditor/themes/default/css/umeditor.css');
	TPL::import_js('js/umeditor/umeditor.config.js');
	TPL::import_js('js/umeditor/umeditor.min.js');
	TPL::import_js('js/umeditor/lang/zh-cn/zh-cn.js');
}

function get_chapter_icon_url($id, $size = 'max', $default = true)
{
	if (file_exists(get_setting('upload_dir') . '/chapter/' . $id . '-' . $size . '.jpg'))
	{
		return get_setting('upload_url') . '/chapter/' . $id . '-' . $size . '.jpg';
	}
	else if ($default)
	{
		return G_STATIC_URL . '/common/help-chapter-' . $size . '-img.png';
	}

	return false;
}

function base64_url_encode($parm)
{
	if (!is_array($parm))
	{
		return false;
	}

	return strtr(base64_encode(json_encode($parm)), '+/=', '-_,');
}

function base64_url_decode($parm)
{
	return json_decode(base64_decode(strtr($parm, '-_,', '+/=')), true);
}

function remove_assoc($from, $type, $id)
{
	if (!$from OR !$type OR !is_digits($id))
	{
		return false;
	}

	return $this->query('UPDATE ' . $this->get_table($from) . ' SET `' . $type . '_id` = NULL WHERE `' . $type . '_id` = ' . $id);
}

/**
 * 净化html函数,过滤script标签之类
 * @param $html
 */
function html_purify($html)
{
	static $purify_obj = null;
	if(empty($purify_obj))
	{
		include AWS_PATH . 'Extensions/htmlpurifier/HTMLPurifier.class.php';
		$purify_obj = new WE_HTMLPurifier();
	}
	return $purify_obj->purify($html);
}

/**
 * @param $content
 */
function replace_old_new_img_url($content)
{
	$pattern = '/<img(?:.*)src="([^"]*)"([^>]*)>/iU';

	$content = preg_replace_callback($pattern, 'img_replace_preg_callback', $content);
	//解析图片表情
	$content = FORMAT::parse_attachs(parse_emotion($content));
	return $content;
}

/**
 * 增加图片正则替换函数 new add by yee at 2016/5/13
 */
function img_replace_preg_callback($matches)
{
	$old_pos = 'class="img-polaroid"';
	$fv = $matches[0];
	$img_src = $matches[1];

	if(strpos($fv, $old_pos) === false && strpos($img_src, '/emotion') === false && strpos($img_src, 'baidu.com') === false)
	{
		return '<a href="'.$img_src.'" target="_blank" data-fancybox-group="thumb" rel="lightbox">'.$fv.'</a>';
	}
	return $fv;
}

function br2nl($string)
{
	return preg_replace("/<br[^>]*>\s*\r*\n*/is", "\n", $string);
}

/**
 * 替换表情函数
 */
function parse_emotion($html)
{
	if(!is_string($html) || empty($html))
	{
		return $html;
	}
	$map_extra = array(
		'style' => '(#{pos})',
		'baseurl' => base_url() . '/static/common/emotions/',
		'template' => '<img src="{url}" alt="{name}" />',
	);
	static $emotion_map_arr = array (
			'呵呵' => 'image_emoticon1.png',
			'哈哈' => 'image_emoticon2.png',
			'吐舌' => 'image_emoticon3.png',
			'啊' => 'image_emoticon4.png',
			'酷' => 'image_emoticon5.png',
			'怒' => 'image_emoticon6.png',
			'开心' => 'image_emoticon7.png',
			'汗' => 'image_emoticon8.png',
			'泪' => 'image_emoticon9.png',
			'黑线' => 'image_emoticon10.png',
			'鄙视' => 'image_emoticon11.png',
			'不高兴' => 'image_emoticon12.png',
			'真棒' => 'image_emoticon13.png',
			'钱' => 'image_emoticon14.png',
			'疑问' => 'image_emoticon15.png',
			'阴险' => 'image_emoticon16.png',
			'吐' => 'image_emoticon17.png',
			'咦' => 'image_emoticon18.png',
			'委屈' => 'image_emoticon19.png',
			'花心' => 'image_emoticon20.png',
			'呼~' => 'image_emoticon21.png',
			'笑眼' => 'image_emoticon22.png',
			'冷' => 'image_emoticon23.png',
			'太开心' => 'image_emoticon24.png',
			'滑稽' => 'image_emoticon25.png',
			'勉强' => 'image_emoticon26.png',
			'狂汗' => 'image_emoticon27.png',
			'乖' => 'image_emoticon28.png',
			'睡觉' => 'image_emoticon29.png',
			'惊哭' => 'image_emoticon30.png',
			'升起' => 'image_emoticon31.png',
			'惊讶' => 'image_emoticon32.png',
			'喷' => 'image_emoticon33.png',
			'爱心' => 'image_emoticon34.png',
			'心碎' => 'image_emoticon35.png',
			'玫瑰' => 'image_emoticon36.png',
			'礼物' => 'image_emoticon37.png',
			'彩虹' => 'image_emoticon38.png',
			'星星月亮' => 'image_emoticon39.png',
			'太阳' => 'image_emoticon40.png',
			'钱币' => 'image_emoticon41.png',
			'灯泡' => 'image_emoticon42.png',
			'茶杯' => 'image_emoticon43.png',
			'蛋糕' => 'image_emoticon44.png',
			'音乐' => 'image_emoticon45.png',
			'haha' => 'image_emoticon46.png',
			'胜利' => 'image_emoticon47.png',
			'大拇指' => 'image_emoticon48.png',
			'弱' => 'image_emoticon49.png',
			'OK' => 'image_emoticon50.png',
			'Kiss~' => 't_0001.gif',
			'Love' => 't_0002.gif',
			'Yeah' => 't_0003.gif',
			'啊!' => 't_0004.gif',
			'背扭' => 't_0005.gif',
			'顶起' => 't_0006.gif',
			'抖胸' => 't_0007.gif',
			88 => 't_0008.gif',
			'汗!' => 't_0009.gif',
			'瞌睡' => 't_0010.gif',
			'鲁拉' => 't_0011.gif',
			'拍砖' => 't_0012.gif',
			'揉脸' => 't_0013.gif',
			'生日快乐' => 't_0014.gif',
			'赖皮' => 'ali_001.gif',
			'感动' => 'ali_002.gif',
			'惊讶2' => 'ali_003.gif',
			'怒气' => 'ali_004.gif',
			'哭泣' => 'ali_005.gif',
			'吃惊' => 'ali_006.gif',
			'嘲弄' => 'ali_007.gif',
			'飘过' => 'ali_008.gif',
			'转圈哭' => 'ali_009.gif',
			'神经病' => 'ali_010.gif',
			'揪耳朵' => 'ali_011.gif',
			'惊汗' => 'ali_012.gif',
			'隐身' => 'ali_013.gif',
			'不要嘛' => 'ali_014.gif',
			'遁' => 'ali_015.gif',
			'不公平' => 'ali_016.gif',
			'爬来了' => 'ali_017.gif',
			'蛋花哭' => 'ali_018.gif',
			'温暖' => 'ali_019.gif',
			'点头' => 'ali_020.gif',
			'撒钱' => 'ali_021.gif',
			'献花' => 'ali_022.gif',
			'寒' => 'ali_023.gif',
			'傻笑' => 'ali_024.gif',
			'扭扭' => 'ali_025.gif',
			'疯' => 'ali_026.gif',
			'抓狂' => 'ali_027.gif',
			'抓' => 'ali_028.gif',
			'蜷' => 'ali_029.gif',
			'挠墙' => 'ali_030.gif',
			'狂笑' => 'ali_031.gif',
			'抱枕' => 'ali_032.gif',
			'吼叫' => 'ali_033.gif',
			'嚷' => 'ali_034.gif',
			'唠叨' => 'ali_035.gif',
			'捏脸' => 'ali_036.gif',
			'狂笑2' => 'ali_037.gif',
			'郁闷' => 'ali_038.gif',
			'潜水' => 'ali_039.gif',
			'开心2' => 'ali_040.gif',
			'冷笑话' => 'ali_041.gif',
			'顶' => 'ali_042.gif',
			'潜' => 'ali_043.gif',
			'画圈圈' => 'ali_044.gif',
			'玩电脑' => 'ali_045.gif',
			'吐2' => 'ali_046.gif',
			'哭着跑' => 'ali_047.gif',
			'阿狸侠' => 'ali_048.gif',
			'冷死了' => 'ali_049.gif',
			'惆怅~' => 'ali_050.gif',
			'摸头' => 'ali_051.gif',
			'蹭' => 'ali_052.gif',
			'打滚' => 'ali_053.gif',
			'叩拜' => 'ali_054.gif',
			'摸' => 'ali_055.gif',
			'数钱' => 'ali_056.gif',
			'拖走' => 'ali_057.gif',
			'热' => 'ali_058.gif',
			'加1' => 'ali_059.gif',
			'压力' => 'ali_060.gif',
			'表逼我' => 'ali_061.gif',
			'人呢' => 'ali_062.gif',
			'摇晃' => 'ali_063.gif',
			'打地鼠' => 'ali_064.gif',
			'这个屌' => 'ali_065.gif',
			'恐慌' => 'ali_066.gif',
			'晕乎乎' => 'ali_067.gif',
			'浮云' => 'ali_068.gif',
			'给力' => 'ali_069.gif',
			'杯具了' => 'ali_070.gif',
			'蹦蹦跳跳' => '10th_001.gif',
			'晃悠' => '10th_002.gif',
			'摇摇摆摆' => '10th_003.gif',
			'大撒花' => '10th_004.gif',
			'高高兴兴' => '10th_005.gif',
			'弹吉他' => '10th_006.gif',
			'魔法棒' => '10th_007.gif',
			'扛大旗' => '10th_008.gif',
			'点蜡烛' => '10th_009.gif',
			'大秧歌' => '10th_010.gif',
			'贴吧十周年' => '10th_011.gif',
			'十周年' => '10th_012.gif',
	);
	$replace_keys = $relate_values = array();
	foreach($emotion_map_arr as $name => $url)
	{
		$replace_keys[] = str_replace('{pos}', $name, $map_extra['style']);
		$tmp_url = $map_extra['baseurl'] . $url;
		$replace_values[] = str_replace(array('{url}','{name}'), array($tmp_url, $name), $map_extra['template']);
	}
	return str_replace($replace_keys, $replace_values, $html);
}