-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-06-21 09:04:45
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ce_center`
--

-- --------------------------------------------------------

--
-- 表的结构 `aws_active_data`
--

CREATE TABLE IF NOT EXISTS `aws_active_data` (
  `active_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `expire_time` int(10) DEFAULT NULL,
  `active_code` varchar(32) DEFAULT NULL,
  `active_type_code` varchar(16) DEFAULT NULL,
  `add_time` int(10) DEFAULT NULL,
  `add_ip` bigint(12) DEFAULT NULL,
  `active_time` int(10) DEFAULT NULL,
  `active_ip` bigint(12) DEFAULT NULL,
  PRIMARY KEY (`active_id`),
  KEY `active_code` (`active_code`),
  KEY `active_type_code` (`active_type_code`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_answer`
--

CREATE TABLE IF NOT EXISTS `aws_answer` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '回答id',
  `question_id` int(11) NOT NULL COMMENT '问题id',
  `answer_content` text COMMENT '回答内容',
  `add_time` int(10) DEFAULT '0' COMMENT '添加时间',
  `against_count` int(11) NOT NULL DEFAULT '0' COMMENT '反对人数',
  `agree_count` int(11) NOT NULL DEFAULT '0' COMMENT '支持人数',
  `uid` int(11) DEFAULT '0' COMMENT '发布问题用户ID',
  `comment_count` int(11) DEFAULT '0' COMMENT '评论总数',
  `uninterested_count` int(11) DEFAULT '0' COMMENT '不感兴趣',
  `thanks_count` int(11) DEFAULT '0' COMMENT '感谢数量',
  `category_id` int(11) DEFAULT '0' COMMENT '分类id',
  `has_attach` tinyint(1) DEFAULT '0' COMMENT '是否存在附件',
  `ip` bigint(11) DEFAULT NULL,
  `force_fold` tinyint(1) DEFAULT '0' COMMENT '强制折叠',
  `anonymous` tinyint(1) DEFAULT '0',
  `publish_source` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `question_id` (`question_id`),
  KEY `agree_count` (`agree_count`),
  KEY `against_count` (`against_count`),
  KEY `add_time` (`add_time`),
  KEY `uid` (`uid`),
  KEY `uninterested_count` (`uninterested_count`),
  KEY `force_fold` (`force_fold`),
  KEY `anonymous` (`anonymous`),
  KEY `publich_source` (`publish_source`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='回答' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_answer_comments`
--

CREATE TABLE IF NOT EXISTS `aws_answer_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `answer_id` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `message` text,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`),
  KEY `time` (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_answer_thanks`
--

CREATE TABLE IF NOT EXISTS `aws_answer_thanks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `answer_id` int(11) DEFAULT '0',
  `user_name` varchar(255) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_answer_uninterested`
--

CREATE TABLE IF NOT EXISTS `aws_answer_uninterested` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `answer_id` int(11) DEFAULT '0',
  `user_name` varchar(255) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_answer_vote`
--

CREATE TABLE IF NOT EXISTS `aws_answer_vote` (
  `voter_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自动ID',
  `answer_id` int(11) DEFAULT NULL COMMENT '回复id',
  `answer_uid` int(11) DEFAULT NULL COMMENT '回复作者id',
  `vote_uid` int(11) DEFAULT NULL COMMENT '用户ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `vote_value` tinyint(4) NOT NULL COMMENT '-1反对 1 支持',
  `reputation_factor` int(10) DEFAULT '0',
  PRIMARY KEY (`voter_id`),
  KEY `answer_id` (`answer_id`),
  KEY `vote_value` (`vote_value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_approval`
--

CREATE TABLE IF NOT EXISTS `aws_approval` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `type` varchar(16) DEFAULT NULL,
  `data` mediumtext NOT NULL,
  `uid` int(11) NOT NULL DEFAULT '0',
  `time` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `uid` (`uid`),
  KEY `time` (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_article`
--

CREATE TABLE IF NOT EXISTS `aws_article` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text,
  `comments` int(10) DEFAULT '0',
  `views` int(10) DEFAULT '0',
  `add_time` int(10) DEFAULT NULL,
  `has_attach` tinyint(1) NOT NULL DEFAULT '0',
  `lock` int(1) NOT NULL DEFAULT '0',
  `votes` int(10) DEFAULT '0',
  `title_fulltext` text,
  `category_id` int(10) DEFAULT '0',
  `is_recommend` tinyint(1) DEFAULT '0',
  `chapter_id` int(10) unsigned DEFAULT NULL,
  `sort` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `has_attach` (`has_attach`),
  KEY `uid` (`uid`),
  KEY `comments` (`comments`),
  KEY `views` (`views`),
  KEY `add_time` (`add_time`),
  KEY `lock` (`lock`),
  KEY `votes` (`votes`),
  KEY `category_id` (`category_id`),
  KEY `is_recommend` (`is_recommend`),
  KEY `chapter_id` (`chapter_id`),
  KEY `sort` (`sort`),
  FULLTEXT KEY `title_fulltext` (`title_fulltext`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_article_comments`
--

CREATE TABLE IF NOT EXISTS `aws_article_comments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `article_id` int(10) NOT NULL,
  `message` text NOT NULL,
  `add_time` int(10) NOT NULL,
  `at_uid` int(10) DEFAULT NULL,
  `votes` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `article_id` (`article_id`),
  KEY `add_time` (`add_time`),
  KEY `votes` (`votes`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_article_vote`
--

CREATE TABLE IF NOT EXISTS `aws_article_vote` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `type` varchar(16) DEFAULT NULL,
  `item_id` int(10) NOT NULL,
  `rating` tinyint(1) DEFAULT '0',
  `time` int(10) NOT NULL,
  `reputation_factor` int(10) DEFAULT '0',
  `item_uid` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `type` (`type`),
  KEY `item_id` (`item_id`),
  KEY `time` (`time`),
  KEY `item_uid` (`item_uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_attach`
--

CREATE TABLE IF NOT EXISTS `aws_attach` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL COMMENT '附件名称',
  `access_key` varchar(32) DEFAULT NULL COMMENT '批次 Key',
  `add_time` int(10) DEFAULT '0' COMMENT '上传时间',
  `file_location` varchar(255) DEFAULT NULL COMMENT '文件位置',
  `is_image` int(1) DEFAULT '0',
  `item_type` varchar(32) DEFAULT '0' COMMENT '关联类型',
  `item_id` bigint(20) DEFAULT '0' COMMENT '关联 ID',
  `wait_approval` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `access_key` (`access_key`),
  KEY `is_image` (`is_image`),
  KEY `fetch` (`item_id`,`item_type`),
  KEY `wait_approval` (`wait_approval`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_category`
--

CREATE TABLE IF NOT EXISTS `aws_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `sort` smallint(6) DEFAULT '0',
  `url_token` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `url_token` (`url_token`),
  KEY `title` (`title`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `aws_category`
--

INSERT INTO `aws_category` (`id`, `title`, `type`, `icon`, `parent_id`, `sort`, `url_token`) VALUES
(1, '默认分类', 'question', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `aws_draft`
--

CREATE TABLE IF NOT EXISTS `aws_draft` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `type` varchar(16) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `data` text,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `item_id` (`item_id`),
  KEY `time` (`time`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `aws_draft`
--

INSERT INTO `aws_draft` (`id`, `uid`, `type`, `item_id`, `data`, `time`) VALUES
(1, 1, 'question', 1, 'a:1:{s:7:"message";s:161:"<p><img src="http://dev.wecenter.com/uploads/umeditor/20160526/14642615984730.jpg" _src="http://ce.center.com/uploads/umeditor/20160526/14642615984730.jpg"/></p>";}', 1464261603),
(2, 1, 'article', 1, 'a:1:{s:7:"message";s:164:"<p><img src="http://dev.wecenter.com/uploads/umeditor/20160606/14651972356969.jpg" _src="http://dev.wecenter.com/uploads/umeditor/20160606/14651972356969.jpg"/></p>";}', 1465197239);

-- --------------------------------------------------------

--
-- 表的结构 `aws_edm_task`
--

CREATE TABLE IF NOT EXISTS `aws_edm_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` mediumtext NOT NULL,
  `subject` varchar(255) NOT NULL,
  `from_name` varchar(255) NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_edm_taskdata`
--

CREATE TABLE IF NOT EXISTS `aws_edm_taskdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sent_time` int(10) NOT NULL,
  `view_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `taskid` (`taskid`),
  KEY `sent_time` (`sent_time`),
  KEY `view_time` (`view_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_edm_unsubscription`
--

CREATE TABLE IF NOT EXISTS `aws_edm_unsubscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_edm_userdata`
--

CREATE TABLE IF NOT EXISTS `aws_edm_userdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usergroup` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usergroup` (`usergroup`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_edm_usergroup`
--

CREATE TABLE IF NOT EXISTS `aws_edm_usergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_education_experience`
--

CREATE TABLE IF NOT EXISTS `aws_education_experience` (
  `education_id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `education_years` int(11) DEFAULT NULL COMMENT '入学年份',
  `school_name` varchar(64) DEFAULT NULL COMMENT '学校名',
  `school_type` tinyint(4) DEFAULT NULL COMMENT '学校类别',
  `departments` varchar(64) DEFAULT NULL COMMENT '院系',
  `add_time` int(10) DEFAULT NULL COMMENT '记录添加时间',
  PRIMARY KEY (`education_id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='教育经历' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_favorite`
--

CREATE TABLE IF NOT EXISTS `aws_favorite` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `item_id` int(11) DEFAULT '0',
  `time` int(10) DEFAULT '0',
  `type` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `time` (`time`),
  KEY `item_id` (`item_id`),
  KEY `type` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_favorite_tag`
--

CREATE TABLE IF NOT EXISTS `aws_favorite_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `title` varchar(128) DEFAULT NULL,
  `item_id` int(11) DEFAULT '0',
  `type` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `title` (`title`),
  KEY `type` (`type`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_feature`
--

CREATE TABLE IF NOT EXISTS `aws_feature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL COMMENT '专题标题',
  `description` varchar(255) DEFAULT NULL COMMENT '专题描述',
  `icon` varchar(255) DEFAULT NULL COMMENT '专题图标',
  `topic_count` int(11) NOT NULL DEFAULT '0' COMMENT '话题计数',
  `css` text COMMENT '自定义CSS',
  `url_token` varchar(32) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `url_token` (`url_token`),
  KEY `title` (`title`),
  KEY `enabled` (`enabled`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_feature_topic`
--

CREATE TABLE IF NOT EXISTS `aws_feature_topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL DEFAULT '0' COMMENT '专题ID',
  `topic_id` int(11) NOT NULL DEFAULT '0' COMMENT '话题ID',
  PRIMARY KEY (`id`),
  KEY `feature_id` (`feature_id`),
  KEY `topic_id` (`topic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_geo_location`
--

CREATE TABLE IF NOT EXISTS `aws_geo_location` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `item_type` varchar(32) NOT NULL,
  `item_id` int(10) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `add_time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `item_type` (`item_type`),
  KEY `add_time` (`add_time`),
  KEY `geo_location` (`latitude`,`longitude`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_help_chapter`
--

CREATE TABLE IF NOT EXISTS `aws_help_chapter` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `url_token` varchar(32) DEFAULT NULL,
  `sort` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `title` (`title`),
  KEY `url_token` (`url_token`),
  KEY `sort` (`sort`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='帮助中心' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_inbox`
--

CREATE TABLE IF NOT EXISTS `aws_inbox` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL COMMENT '发送者 ID',
  `dialog_id` int(11) DEFAULT NULL COMMENT '对话id',
  `message` text COMMENT '内容',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `sender_remove` tinyint(1) DEFAULT '0',
  `recipient_remove` tinyint(1) DEFAULT '0',
  `receipt` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `dialog_id` (`dialog_id`),
  KEY `uid` (`uid`),
  KEY `add_time` (`add_time`),
  KEY `sender_remove` (`sender_remove`),
  KEY `recipient_remove` (`recipient_remove`),
  KEY `sender_receipt` (`receipt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_inbox_dialog`
--

CREATE TABLE IF NOT EXISTS `aws_inbox_dialog` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '对话ID',
  `sender_uid` int(11) DEFAULT NULL COMMENT '发送者UID',
  `sender_unread` int(11) DEFAULT NULL COMMENT '发送者未读',
  `recipient_uid` int(11) DEFAULT NULL COMMENT '接收者UID',
  `recipient_unread` int(11) DEFAULT NULL COMMENT '接收者未读',
  `add_time` int(11) DEFAULT NULL COMMENT '添加时间',
  `update_time` int(11) DEFAULT NULL COMMENT '最后更新时间',
  `sender_count` int(11) DEFAULT NULL COMMENT '发送者显示对话条数',
  `recipient_count` int(11) DEFAULT NULL COMMENT '接收者显示对话条数',
  PRIMARY KEY (`id`),
  KEY `recipient_uid` (`recipient_uid`),
  KEY `sender_uid` (`sender_uid`),
  KEY `update_time` (`update_time`),
  KEY `add_time` (`add_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_integral_log`
--

CREATE TABLE IF NOT EXISTS `aws_integral_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `action` varchar(16) DEFAULT NULL,
  `integral` int(11) DEFAULT NULL,
  `note` varchar(128) DEFAULT NULL,
  `balance` int(11) DEFAULT '0',
  `item_id` int(11) DEFAULT '0',
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `action` (`action`),
  KEY `time` (`time`),
  KEY `integral` (`integral`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `aws_integral_log`
--

INSERT INTO `aws_integral_log` (`id`, `uid`, `action`, `integral`, `note`, `balance`, `item_id`, `time`) VALUES
(1, 1, 'REGISTER', 2000, '初始资本', 2000, 0, 1461724957),
(2, 1, 'UPLOAD_AVATAR', 20, '上传头像', 2020, 0, 1461726492),
(3, 1, 'NEW_QUESTION', -20, '发起问题 #1', 2000, 1, 1461726614),
(4, 1, 'NEW_QUESTION', -20, '发起帖子 #2', 1980, 2, 1462865993);

-- --------------------------------------------------------

--
-- 表的结构 `aws_invitation`
--

CREATE TABLE IF NOT EXISTS `aws_invitation` (
  `invitation_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '激活ID',
  `uid` int(11) DEFAULT '0' COMMENT '用户ID',
  `invitation_code` varchar(32) DEFAULT NULL COMMENT '激活码',
  `invitation_email` varchar(255) DEFAULT NULL COMMENT '激活email',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `add_ip` bigint(12) DEFAULT NULL COMMENT '添加IP',
  `active_expire` tinyint(1) DEFAULT '0' COMMENT '激活过期',
  `active_time` int(10) DEFAULT NULL COMMENT '激活时间',
  `active_ip` bigint(12) DEFAULT NULL COMMENT '激活IP',
  `active_status` tinyint(4) DEFAULT '0' COMMENT '1已使用0未使用-1已删除',
  `active_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`invitation_id`),
  KEY `uid` (`uid`),
  KEY `invitation_code` (`invitation_code`),
  KEY `invitation_email` (`invitation_email`),
  KEY `active_time` (`active_time`),
  KEY `active_ip` (`active_ip`),
  KEY `active_status` (`active_status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_jobs`
--

CREATE TABLE IF NOT EXISTS `aws_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_name` varchar(64) DEFAULT NULL COMMENT '职位名',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

--
-- 转存表中的数据 `aws_jobs`
--

INSERT INTO `aws_jobs` (`id`, `job_name`) VALUES
(1, '销售'),
(2, '市场/市场拓展/公关'),
(3, '商务/采购/贸易'),
(4, '计算机软、硬件/互联网/IT'),
(5, '电子/半导体/仪表仪器'),
(6, '通信技术'),
(7, '客户服务/技术支持'),
(8, '行政/后勤'),
(9, '人力资源'),
(10, '高级管理'),
(11, '生产/加工/制造'),
(12, '质控/安检'),
(13, '工程机械'),
(14, '技工'),
(15, '财会/审计/统计'),
(16, '金融/银行/保险/证券/投资'),
(17, '建筑/房地产/装修/物业'),
(18, '交通/仓储/物流'),
(19, '普通劳动力/家政服务'),
(20, '零售业'),
(21, '教育/培训'),
(22, '咨询/顾问'),
(23, '学术/科研'),
(24, '法律'),
(25, '美术/设计/创意'),
(26, '编辑/文案/传媒/影视/新闻'),
(27, '酒店/餐饮/旅游/娱乐'),
(28, '化工'),
(29, '能源/矿产/地质勘查'),
(30, '医疗/护理/保健/美容'),
(31, '生物/制药/医疗器械'),
(32, '翻译（口译与笔译）'),
(33, '公务员'),
(34, '环境科学/环保'),
(35, '农/林/牧/渔业'),
(36, '兼职/临时/培训生/储备干部'),
(37, '在校学生'),
(38, '其他');

-- --------------------------------------------------------

--
-- 表的结构 `aws_mail_queue`
--

CREATE TABLE IF NOT EXISTS `aws_mail_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `send_to` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_error` tinyint(1) NOT NULL DEFAULT '0',
  `error_message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `is_error` (`is_error`),
  KEY `send_to` (`send_to`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_nav_menu`
--

CREATE TABLE IF NOT EXISTS `aws_nav_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `type_id` int(11) DEFAULT '0',
  `link` varchar(255) DEFAULT NULL COMMENT '链接',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `sort` smallint(6) DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`link`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `aws_nav_menu`
--

INSERT INTO `aws_nav_menu` (`id`, `title`, `description`, `type`, `type_id`, `link`, `icon`, `sort`) VALUES
(1, '默认分类', '默认分类描述', 'category', 1, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- 表的结构 `aws_notification`
--

CREATE TABLE IF NOT EXISTS `aws_notification` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `sender_uid` int(11) DEFAULT NULL COMMENT '发送者ID',
  `recipient_uid` int(11) DEFAULT '0' COMMENT '接收者ID',
  `action_type` int(4) DEFAULT NULL COMMENT '操作类型',
  `model_type` smallint(11) NOT NULL DEFAULT '0',
  `source_id` varchar(16) NOT NULL DEFAULT '0' COMMENT '关联 ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `read_flag` tinyint(1) DEFAULT '0' COMMENT '阅读状态',
  PRIMARY KEY (`notification_id`),
  KEY `recipient_read_flag` (`recipient_uid`,`read_flag`),
  KEY `sender_uid` (`sender_uid`),
  KEY `model_type` (`model_type`),
  KEY `source_id` (`source_id`),
  KEY `action_type` (`action_type`),
  KEY `add_time` (`add_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='系统通知' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_notification_data`
--

CREATE TABLE IF NOT EXISTS `aws_notification_data` (
  `notification_id` int(11) unsigned NOT NULL,
  `data` text,
  PRIMARY KEY (`notification_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='系统通知数据表';

-- --------------------------------------------------------

--
-- 表的结构 `aws_pages`
--

CREATE TABLE IF NOT EXISTS `aws_pages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `url_token` varchar(32) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `contents` text,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_token` (`url_token`),
  KEY `enabled` (`enabled`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_posts_index`
--

CREATE TABLE IF NOT EXISTS `aws_posts_index` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `post_id` int(10) NOT NULL,
  `post_type` varchar(16) NOT NULL DEFAULT '',
  `add_time` int(10) NOT NULL,
  `update_time` int(10) DEFAULT '0',
  `category_id` int(10) DEFAULT '0',
  `is_recommend` tinyint(1) DEFAULT '0',
  `view_count` int(10) DEFAULT '0',
  `anonymous` tinyint(1) DEFAULT '0',
  `popular_value` int(10) DEFAULT '0',
  `uid` int(10) NOT NULL,
  `lock` tinyint(1) DEFAULT '0',
  `agree_count` int(10) DEFAULT '0',
  `answer_count` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `post_type` (`post_type`),
  KEY `add_time` (`add_time`),
  KEY `update_time` (`update_time`),
  KEY `category_id` (`category_id`),
  KEY `is_recommend` (`is_recommend`),
  KEY `anonymous` (`anonymous`),
  KEY `popular_value` (`popular_value`),
  KEY `uid` (`uid`),
  KEY `lock` (`lock`),
  KEY `agree_count` (`agree_count`),
  KEY `answer_count` (`answer_count`),
  KEY `view_count` (`view_count`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `aws_posts_index`
--

INSERT INTO `aws_posts_index` (`id`, `post_id`, `post_type`, `add_time`, `update_time`, `category_id`, `is_recommend`, `view_count`, `anonymous`, `popular_value`, `uid`, `lock`, `agree_count`, `answer_count`) VALUES
(1, 1, 'question', 1461726614, 1461726614, 1, 0, 0, 1, 0, 1, 0, 0, 0),
(2, 2, 'question', 1462865993, 1462865993, 1, 0, 0, 0, 0, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `aws_question`
--

CREATE TABLE IF NOT EXISTS `aws_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_content` varchar(255) NOT NULL DEFAULT '' COMMENT '问题内容',
  `question_detail` text COMMENT '问题说明',
  `add_time` int(11) NOT NULL COMMENT '添加时间',
  `update_time` int(11) DEFAULT NULL,
  `published_uid` int(11) DEFAULT NULL COMMENT '发布用户UID',
  `answer_count` int(11) NOT NULL DEFAULT '0' COMMENT '回答计数',
  `answer_users` int(11) NOT NULL DEFAULT '0' COMMENT '回答人数',
  `view_count` int(11) NOT NULL DEFAULT '0' COMMENT '浏览次数',
  `focus_count` int(11) NOT NULL DEFAULT '0' COMMENT '关注数',
  `comment_count` int(11) NOT NULL DEFAULT '0' COMMENT '评论数',
  `action_history_id` int(11) NOT NULL DEFAULT '0' COMMENT '动作的记录表的关连id',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT '分类 ID',
  `agree_count` int(11) NOT NULL DEFAULT '0' COMMENT '回复赞同数总和',
  `against_count` int(11) NOT NULL DEFAULT '0' COMMENT '回复反对数总和',
  `best_answer` int(11) NOT NULL DEFAULT '0' COMMENT '最佳回复 ID',
  `has_attach` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否存在附件',
  `unverified_modify` text,
  `unverified_modify_count` int(10) NOT NULL DEFAULT '0',
  `ip` bigint(11) DEFAULT NULL,
  `last_answer` int(11) NOT NULL DEFAULT '0' COMMENT '最后回答 ID',
  `popular_value` double NOT NULL DEFAULT '0',
  `popular_value_update` int(10) NOT NULL DEFAULT '0',
  `lock` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否锁定',
  `anonymous` tinyint(1) NOT NULL DEFAULT '0',
  `thanks_count` int(10) NOT NULL DEFAULT '0',
  `question_content_fulltext` text,
  `is_recommend` tinyint(1) NOT NULL DEFAULT '0',
  `weibo_msg_id` bigint(20) DEFAULT NULL,
  `received_email_id` int(10) DEFAULT NULL,
  `chapter_id` int(10) unsigned DEFAULT NULL,
  `sort` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`question_id`),
  KEY `category_id` (`category_id`),
  KEY `update_time` (`update_time`),
  KEY `add_time` (`add_time`),
  KEY `published_uid` (`published_uid`),
  KEY `answer_count` (`answer_count`),
  KEY `agree_count` (`agree_count`),
  KEY `question_content` (`question_content`),
  KEY `lock` (`lock`),
  KEY `thanks_count` (`thanks_count`),
  KEY `anonymous` (`anonymous`),
  KEY `popular_value` (`popular_value`),
  KEY `best_answer` (`best_answer`),
  KEY `popular_value_update` (`popular_value_update`),
  KEY `against_count` (`against_count`),
  KEY `is_recommend` (`is_recommend`),
  KEY `weibo_msg_id` (`weibo_msg_id`),
  KEY `received_email_id` (`received_email_id`),
  KEY `unverified_modify_count` (`unverified_modify_count`),
  KEY `chapter_id` (`chapter_id`),
  KEY `sort` (`sort`),
  FULLTEXT KEY `question_content_fulltext` (`question_content_fulltext`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='问题列表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `aws_question`
--

INSERT INTO `aws_question` (`question_id`, `question_content`, `question_detail`, `add_time`, `update_time`, `published_uid`, `answer_count`, `answer_users`, `view_count`, `focus_count`, `comment_count`, `action_history_id`, `category_id`, `agree_count`, `against_count`, `best_answer`, `has_attach`, `unverified_modify`, `unverified_modify_count`, `ip`, `last_answer`, `popular_value`, `popular_value_update`, `lock`, `anonymous`, `thanks_count`, `question_content_fulltext`, `is_recommend`, `weibo_msg_id`, `received_email_id`, `chapter_id`, `sort`) VALUES
(1, '如何评价史玉柱说的将兔窝变成狼窝？', '史玉柱一定是忘记自己是怎样成功的了。\n在互联网的江湖里，论创业的资历，没有人比史玉柱更老的了，即使是马云，也要礼让三分。史大胆纵横商海数十年，三起三落，打造出了一支像狼一样的高执行力团队。\n这支团队，在史玉柱手里，指哪打哪，每战必胜。但你以为胜利的原因，就在于此，那就大错特错了。\n说实话，在中国互联网杀红了眼的战场上，哪家成功的企业没有一支高执行力的团队，但为什么有些继续辉煌，有些分崩离析，有些困兽犹斗？关键还是统帅。统帅冲锋在前，发现了肉，群狼才能齐心协力，勇往冲杀。\n若不然，一群狼再狠，也只能互相撕咬，挥霍徒劳的精力。\n\n史玉柱曾经是一个拥有火眼金睛的天才统帅。\n他的第一次，是看准了个人电脑进入中国，却缺乏汉字输入法的需求，以汉卡产品一炮而红。这款产品让他冲上云霄，成为1995年的福布斯中国十大富豪，也让他破产消失，成为坊间笑谈。\n很多人以为，二十年前巨人公司的破产，是源于史玉柱的头脑发热，建巨人大厦导致资金链断裂造成的。其实并不是，巨人大厦的地只花了500万元，几乎是珠海市政府白送的，房子也只是打了个地基，并没有投进去多少钱。根本的原因，其实是1995年微软windows平台的推出，导致基于dos平台的汉卡产品失去了市场。\n同样是那支善于冲锋陷阵的团队，只是因为肉突然不见了，瞬间就失去了方向，四散溃逃。\n\n这次失败，让史玉柱沉下心来，痛苦反思。\n他意识到，IT行业的技术变化太快了，肉可能今天还在，明天就突然消失了，风险非常大。而在传统行业，机会同样很多，只要善于洞察人性，发现欲望，肉，很多，还很香。\n史玉柱开始参透“欲望”两个字的巨大价值，他深入的研究中国社会的阶层浮华背后，那些不能言说的秘密。1990年代末的中国，经济正在金融风暴的冲击下摇摇欲坠，社会阶层的动荡十分激烈，每一个人都处于惶恐之中，充满不安全感。人们渴望通过向有利益关系的人物“示好”，来保证自身地位的安全。\n“送礼”这种需求，自古就有。但是一般来说，被满足的，其实只是权贵阶层的需求。那些奢侈品，往往会以历史传承的高贵，文化品味的高雅，来曲径通幽站上高端的礼品台。可是，这个市场只是送礼金字塔的塔尖啊，还有更广大的三四线市场的群众呢？\n对于低收入、低教育水平的三四五六线市场来说，送车送房送江诗丹顿，是送不起的，传统上更多的是抓两只鸡，提一篮鸡蛋，这多上不了台面啊。人们正愁不知道送什么好的时候，史玉柱站出来了，他大声说：“我已经帮你准备好了，就送脑白金吧，你看价格不贵百来块钱，又健康寓意好，还不赶紧滴。”\n很多人不齿于“今年过节不收礼，收礼只收脑白金”这句广告语的脑残，但他们不知道的是，对于脑白金的目标受众来说，你端着他们就听不懂，就是要这么直白才能将欲望全部钓出来。\n\n几年之后，经济危机过去，脑白金的市场开始饱和甚至萎缩，史玉柱又将目光投向了另一块肥肉。\n网络游戏这个行业，说白了，考验的就是从业者对人心“欲望”的洞察。\n早期的网络游戏，成功的有两种。一种是暴雪为代表的美式游戏，他创作一个宏大的虚拟世界，就像一座神圣的宫殿，你沉浸在里面，摸索三月，也就是略知皮毛，或许穷尽一生，才能窥见真谛。这种精品思路，就像四大名著一样，充满艺术感，占据了金字塔尖的高端市场。\n另一种，则是韩式传奇、奇迹为代表的升级打怪游戏，他们就像网络小说里的YY故事，让你肾上腺激素飙升，宣泄即时的快感。暴雪虽好，但是就像是四大名著，不是每个人都能够读的下去的，大量的低端小白用户还是更青睐于这种韩式的泡菜。\n史玉柱进来了，他发现了另外一块肉。\n如果说，暴雪的目标人群是中产阶层，韩式泡菜的目标人群是低龄屌丝，史玉柱看上的，则是“土豪”。他们不差钱，差的是时间，他们的工作很忙碌，压力很大，进入游戏就想得到快速的压力释放，在杀戮中享受肆意的快感。\n——但是传统的游戏无法满足他们的欲望！\n暴雪的游戏需要高度熟练的技巧，没有长时间的专注练习是不可能享受到快感的，泡菜游戏又需要长时间的打怪，一步步从低级升上来。他们的乐趣都在“时间”的消磨中获得，于是依靠时间收费模式，赚“时间”的钱。\n但是对于土豪来说，他们没有时间，于是在几乎任何的游戏中，都只能被人虐，毫无乐趣可言。他们可是“人民币玩家”啊，可是竟然被华丽丽的无视。\n史玉柱发现了这块大肥肉，于是砸进全部身家搞网络游戏，将传统的游戏收费模式从“时间”改为“道具”，彻底点燃了土豪们的欲望。土豪们不缺钱，只要愿意，随时都可以获得武器、坐骑、法力，享受成为“人上人”，权倾天下，一剑封喉的快感。\n当然，如果史玉柱的游戏是这么的粗浅，土豪玩过几次估计也就索然无味了。就像人世间的性爱，最无趣的就是去妓院找宣泄了。得到的东西太容易，人们是不会珍惜的。史玉柱深深的明白这个道理，因此在他设计的虚拟世界里，实际要复杂的多。你要宣泄，可以让你花钱得到，但是在这个实现快感的征途中，你一定会在无意中失去一些东西，这些东西或许只是一些细小的不如意，但就是这样，让你的人生永远也就差一点才能圆满。你可以看得到希望，却总也得不到，即使花费了再多的金钱，也只能永远都在“征途”上跋涉。\n\n“征途”游戏的开发团队，是史玉柱从盛大挖来的，在陈天桥手里只是一群小白兔，开发的“英雄年代”游戏惨淡收场，但在史大胆手里就成了一群狼。\n在这个过程中，这群狼到底发生了什么脱胎换骨的变化？\n我相信变化是不大的。如果没有史玉柱发现的肉，群狼们就算24小时上班工作制，365天工作制，天天喊口号打激素，他们也不可能获得成功。\n这些年来，屡屡听到大公司们说要打造狼性团队，要激起斗志，要拿鞭子在后面抽他们。\n注意了，这往往说明这个公司遇到了瓶颈，他的统帅找不到肉了。这个时候，你越是抽鞭子，狼崽们只会越恐惧，他们为了生存不得不互相撕咬，斗得遍体鳞伤，或者心灰意冷，离群而去，加速整个团队的灭亡。\n这不是一个好兆头。', 1461726614, 1461726614, 1, 0, 0, 7, 1, 0, 0, 1, 0, 0, 0, 0, NULL, 0, 2130706433, 0, 1.7781512503836, 1466154104, 0, 1, 0, '3578020215 214902957726609 2082031389 2146425104 2943631389', 0, NULL, NULL, NULL, 0),
(2, '测试发个帖子', '而是离开的房间\n啥的减肥了\n熟练度附近了', 1462865993, 1462865993, 1, 0, 0, 11, 1, 0, 0, 1, 0, 0, 0, 0, NULL, 0, 2130706433, 0, 2, 1464014792, 0, 0, 0, '2797935797 2145720010 2408623376', 0, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- 表的结构 `aws_question_comments`
--

CREATE TABLE IF NOT EXISTS `aws_question_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `message` text,
  `time` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `time` (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_question_focus`
--

CREATE TABLE IF NOT EXISTS `aws_question_focus` (
  `focus_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `question_id` int(11) DEFAULT NULL COMMENT '话题ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `add_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`focus_id`),
  KEY `question_id` (`question_id`),
  KEY `question_uid` (`question_id`,`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='问题关注表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `aws_question_focus`
--

INSERT INTO `aws_question_focus` (`focus_id`, `question_id`, `uid`, `add_time`) VALUES
(1, 1, 1, 1461726614),
(2, 2, 1, 1462865993);

-- --------------------------------------------------------

--
-- 表的结构 `aws_question_invite`
--

CREATE TABLE IF NOT EXISTS `aws_question_invite` (
  `question_invite_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `question_id` int(11) NOT NULL COMMENT '问题ID',
  `sender_uid` int(11) NOT NULL,
  `recipients_uid` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL COMMENT '受邀Email',
  `add_time` int(10) DEFAULT '0' COMMENT '添加时间',
  `available_time` int(10) DEFAULT '0' COMMENT '生效时间',
  PRIMARY KEY (`question_invite_id`),
  KEY `question_id` (`question_id`),
  KEY `sender_uid` (`sender_uid`),
  KEY `recipients_uid` (`recipients_uid`),
  KEY `add_time` (`add_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='邀请问答' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_question_thanks`
--

CREATE TABLE IF NOT EXISTS `aws_question_thanks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `question_id` int(11) DEFAULT '0',
  `user_name` varchar(255) DEFAULT NULL,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_question_uninterested`
--

CREATE TABLE IF NOT EXISTS `aws_question_uninterested` (
  `interested_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `question_id` int(11) DEFAULT NULL COMMENT '话题ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `add_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`interested_id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='问题不感兴趣表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_received_email`
--

CREATE TABLE IF NOT EXISTS `aws_received_email` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `config_id` int(10) NOT NULL,
  `message_id` varchar(255) NOT NULL,
  `date` int(10) NOT NULL,
  `from` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text,
  `question_id` int(11) DEFAULT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `config_id` (`config_id`),
  KEY `message_id` (`message_id`),
  KEY `date` (`date`),
  KEY `ticket_id` (`ticket_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='已导入邮件列表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_receiving_email_config`
--

CREATE TABLE IF NOT EXISTS `aws_receiving_email_config` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `protocol` varchar(10) NOT NULL,
  `server` varchar(255) NOT NULL,
  `ssl` tinyint(1) NOT NULL DEFAULT '0',
  `port` smallint(5) DEFAULT NULL,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `uid` int(10) NOT NULL,
  `access_key` varchar(32) NOT NULL,
  `has_attach` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `server` (`server`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='邮件账号列表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_redirect`
--

CREATE TABLE IF NOT EXISTS `aws_redirect` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT '0',
  `target_id` int(11) DEFAULT '0',
  `time` int(10) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_related_links`
--

CREATE TABLE IF NOT EXISTS `aws_related_links` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `item_type` varchar(32) NOT NULL,
  `item_id` int(10) NOT NULL,
  `link` varchar(255) NOT NULL,
  `add_time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `item_type` (`item_type`),
  KEY `item_id` (`item_id`),
  KEY `add_time` (`add_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_related_topic`
--

CREATE TABLE IF NOT EXISTS `aws_related_topic` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` int(11) DEFAULT '0' COMMENT '话题 ID',
  `related_id` int(11) DEFAULT '0' COMMENT '相关话题 ID',
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `related_id` (`related_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_report`
--

CREATE TABLE IF NOT EXISTS `aws_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0' COMMENT '举报用户id',
  `type` varchar(50) DEFAULT NULL COMMENT '类别',
  `target_id` int(11) DEFAULT '0' COMMENT 'ID',
  `reason` varchar(255) DEFAULT NULL COMMENT '举报理由',
  `url` varchar(255) DEFAULT NULL,
  `add_time` int(11) DEFAULT '0' COMMENT '举报时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否处理',
  PRIMARY KEY (`id`),
  KEY `add_time` (`add_time`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_reputation_category`
--

CREATE TABLE IF NOT EXISTS `aws_reputation_category` (
  `auto_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) DEFAULT '0',
  `category_id` smallint(4) DEFAULT '0',
  `update_time` int(10) DEFAULT '0',
  `reputation` int(10) DEFAULT '0',
  `thanks_count` int(10) DEFAULT '0',
  `agree_count` int(10) DEFAULT '0',
  `question_count` int(10) DEFAULT '0',
  PRIMARY KEY (`auto_id`),
  UNIQUE KEY `uid_category_id` (`uid`,`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_reputation_topic`
--

CREATE TABLE IF NOT EXISTS `aws_reputation_topic` (
  `auto_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `topic_id` int(11) DEFAULT '0' COMMENT '话题ID',
  `topic_count` int(10) DEFAULT '0' COMMENT '威望问题话题计数',
  `update_time` int(10) DEFAULT NULL COMMENT '更新时间',
  `agree_count` int(10) DEFAULT '0' COMMENT '赞成',
  `thanks_count` int(10) DEFAULT '0' COMMENT '感谢',
  `reputation` int(10) DEFAULT '0',
  PRIMARY KEY (`auto_id`),
  KEY `topic_count` (`topic_count`),
  KEY `uid` (`uid`),
  KEY `topic_id` (`topic_id`),
  KEY `reputation` (`reputation`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_school`
--

CREATE TABLE IF NOT EXISTS `aws_school` (
  `school_id` int(11) NOT NULL COMMENT '自增ID',
  `school_type` tinyint(4) DEFAULT NULL COMMENT '学校类型ID',
  `school_code` int(11) DEFAULT NULL COMMENT '学校编码',
  `school_name` varchar(64) DEFAULT NULL COMMENT '学校名称',
  `area_code` int(11) DEFAULT NULL COMMENT '地区代码',
  PRIMARY KEY (`school_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='学校';

-- --------------------------------------------------------

--
-- 表的结构 `aws_search_cache`
--

CREATE TABLE IF NOT EXISTS `aws_search_cache` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `hash` varchar(32) NOT NULL,
  `data` mediumtext NOT NULL,
  `time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hash` (`hash`),
  KEY `time` (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_sessions`
--

CREATE TABLE IF NOT EXISTS `aws_sessions` (
  `id` varchar(32) NOT NULL,
  `modified` int(10) NOT NULL,
  `data` text NOT NULL,
  `lifetime` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `modified` (`modified`),
  KEY `lifetime` (`lifetime`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `aws_sessions`
--

INSERT INTO `aws_sessions` (`id`, `modified`, `data`, `lifetime`) VALUES
('9lit79cluaa8kot7e322oju6o0', 1466490540, 'btf__Anwsion|a:2:{s:10:"permission";a:15:{s:16:"is_administortar";s:1:"1";s:12:"is_moderator";s:1:"1";s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:13:"edit_question";s:1:"1";s:10:"edit_topic";s:1:"1";s:12:"manage_topic";s:1:"1";s:12:"create_topic";s:1:"1";s:17:"redirect_question";s:1:"1";s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:15:"publish_article";s:1:"1";s:12:"edit_article";s:1:"1";s:19:"edit_question_topic";s:1:"1";s:15:"publish_comment";s:1:"1";}s:11:"client_info";a:3:{s:12:"__CLIENT_UID";i:1;s:18:"__CLIENT_USER_NAME";s:5:"admin";s:17:"__CLIENT_PASSWORD";s:32:"d1d2dcd3ab5c784e0464a9ccd18aa363";}}', 1800);

-- --------------------------------------------------------

--
-- 表的结构 `aws_system_setting`
--

CREATE TABLE IF NOT EXISTS `aws_system_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `varname` varchar(255) NOT NULL COMMENT '字段名',
  `value` text COMMENT '变量值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `varname` (`varname`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='系统设置' AUTO_INCREMENT=130 ;

--
-- 转存表中的数据 `aws_system_setting`
--

INSERT INTO `aws_system_setting` (`id`, `varname`, `value`) VALUES
(1, 'db_engine', 's:6:"MyISAM";'),
(2, 'site_name', 's:8:"WeCenter";'),
(3, 'description', 's:30:"WeCenter 社交化知识社区";'),
(4, 'keywords', 's:47:"WeCenter,知识社区,社交社区,问答社区";'),
(5, 'sensitive_words', 's:0:"";'),
(6, 'def_focus_uids', 's:1:"1";'),
(7, 'answer_edit_time', 's:2:"30";'),
(8, 'cache_level_high', 's:2:"60";'),
(9, 'cache_level_normal', 's:3:"600";'),
(10, 'cache_level_low', 's:4:"1800";'),
(11, 'unread_flush_interval', 's:3:"100";'),
(12, 'newer_invitation_num', 's:1:"5";'),
(13, 'index_per_page', 's:2:"20";'),
(14, 'from_email', 's:13:"admin@tcl.com";'),
(15, 'img_url', 's:0:"";'),
(16, 'upload_url', 's:31:"http://dev.wecenter.com/uploads";'),
(17, 'upload_dir', 's:25:"D:/code/ce_center/uploads";'),
(18, 'ui_style', 's:7:"default";'),
(19, 'uninterested_fold', 's:1:"5";'),
(20, 'sina_akey', NULL),
(21, 'sina_skey', NULL),
(22, 'sina_weibo_enabled', 's:1:"N";'),
(23, 'answer_unique', 's:1:"N";'),
(24, 'notifications_per_page', 's:2:"10";'),
(25, 'contents_per_page', 's:2:"10";'),
(26, 'hot_question_period', 's:1:"7";'),
(27, 'category_display_mode', 's:4:"icon";'),
(28, 'recommend_users_number', 's:1:"6";'),
(29, 'ucenter_enabled', 's:1:"N";'),
(30, 'register_valid_type', 's:5:"email";'),
(31, 'best_answer_day', 's:2:"30";'),
(32, 'answer_self_question', 's:1:"Y";'),
(33, 'censoruser', 's:5:"admin";'),
(34, 'best_answer_min_count', 's:1:"3";'),
(35, 'reputation_function', 's:78:"[最佳答案]*3+[赞同]*1-[反对]*1+[发起者赞同]*2-[发起者反对]*1";'),
(36, 'db_version', 's:8:"20150226";'),
(37, 'statistic_code', 's:0:"";'),
(38, 'upload_enable', 's:1:"Y";'),
(39, 'answer_length_lower', 's:1:"2";'),
(40, 'quick_publish', 's:1:"Y";'),
(41, 'register_type', 's:4:"open";'),
(42, 'question_title_limit', 's:3:"100";'),
(43, 'register_seccode', 's:1:"Y";'),
(44, 'admin_login_seccode', 's:1:"Y";'),
(45, 'comment_limit', 's:1:"0";'),
(46, 'backup_dir', ''),
(47, 'best_answer_reput', 's:2:"20";'),
(48, 'publisher_reputation_factor', 's:2:"10";'),
(49, 'request_route_custom', 's:0:"";'),
(50, 'upload_size_limit', 's:3:"512";'),
(51, 'upload_avatar_size_limit', 's:3:"512";'),
(52, 'topic_title_limit', 's:2:"12";'),
(53, 'url_rewrite_enable', 's:1:"N";'),
(54, 'best_agree_min_count', 's:1:"3";'),
(55, 'site_close', 's:1:"N";'),
(56, 'close_notice', 's:39:"站点已关闭，管理员请登录。";'),
(57, 'qq_login_enabled', 's:1:"N";'),
(58, 'qq_login_app_id', ''),
(59, 'qq_login_app_key', ''),
(60, 'integral_system_enabled', 's:1:"N";'),
(61, 'integral_system_config_register', 's:4:"2000";'),
(62, 'integral_system_config_profile', 's:3:"100";'),
(63, 'integral_system_config_invite', 's:3:"200";'),
(64, 'integral_system_config_best_answer', 's:3:"200";'),
(65, 'integral_system_config_answer_fold', 's:3:"-50";'),
(66, 'integral_system_config_new_question', 's:3:"-20";'),
(67, 'integral_system_config_new_answer', 's:2:"-5";'),
(68, 'integral_system_config_thanks', 's:3:"-10";'),
(69, 'integral_system_config_invite_answer', 's:3:"-10";'),
(70, 'username_rule', 's:1:"1";'),
(71, 'username_length_min', 's:1:"2";'),
(72, 'username_length_max', 's:2:"14";'),
(73, 'category_enable', 's:1:"Y";'),
(74, 'integral_unit', 's:6:"金币";'),
(75, 'nav_menu_show_child', 's:1:"1";'),
(76, 'anonymous_enable', 's:1:"Y";'),
(77, 'report_reason', 's:50:"广告/SPAM\n违规内容\n文不对题\n重复发问";'),
(78, 'allowed_upload_types', 's:41:"jpg,jpeg,png,gif,zip,doc,docx,rar,pdf,psd";'),
(79, 'site_announce', 's:0:"";'),
(80, 'icp_beian', 's:0:"";'),
(81, 'report_message_uid', 's:1:"1";'),
(82, 'today_topics', 's:0:"";'),
(83, 'welcome_recommend_users', 's:0:"";'),
(84, 'welcome_message_pm', 's:180:"尊敬的{username}，您已经注册成为{sitename}的会员，请您在发表言论时，遵守当地法律法规。\n如果您有什么疑问可以联系管理员。\n\n{sitename}";'),
(85, 'time_style', 's:1:"Y";'),
(86, 'reputation_log_factor', 's:1:"3";'),
(87, 'advanced_editor_enable', 's:1:"Y";'),
(88, 'auto_question_lock_day', 's:1:"0";'),
(89, 'default_timezone', 's:9:"Etc/GMT-8";'),
(90, 'reader_questions_last_days', 's:2:"30";'),
(91, 'reader_questions_agree_count', 's:2:"10"'),
(92, 'weixin_mp_token', 's:0:"";'),
(93, 'new_user_email_setting', 'a:2:{s:9:"FOLLOW_ME";s:1:"N";s:10:"NEW_ANSWER";s:1:"N";}'),
(94, 'new_user_notification_setting', 'a:0:{}'),
(95, 'user_action_history_fresh_upgrade', 's:1:"Y";'),
(96, 'cache_dir', 's:0:"";'),
(97, 'ucenter_charset', 's:5:"UTF-8";'),
(98, 'question_topics_limit', 's:2:"10";'),
(99, 'mail_config', 'a:7:{s:9:"transport";s:8:"sendmail";s:7:"charset";s:5:"UTF-8";s:6:"server";s:0:"";s:3:"ssl";s:1:"0";s:4:"port";s:0:"";s:8:"username";s:0:"";s:8:"password";s:0:"";}'),
(100, 'auto_create_social_topics', 's:1:"N";'),
(101, 'weixin_subscribe_message_key', 's:0:"";'),
(102, 'weixin_no_result_message_key', 's:0:"";'),
(103, 'weixin_mp_menu', 'a:0:{}'),
(104, 'new_question_force_add_topic', 's:1:"N";'),
(105, 'unfold_question_comments', 's:1:"N";'),
(106, 'report_diagnostics', 's:1:"Y";'),
(107, 'weixin_app_id', 's:0:"";'),
(108, 'weixin_app_secret', 's:0:"";'),
(109, 'weixin_account_role', 's:7:"base";'),
(110, 'weibo_msg_enabled', 's:1:"N";'),
(111, 'weibo_msg_published_user', 'a:0:"";'),
(112, 'admin_notifications', 'a:10:{s:15:"answer_approval";i:0;s:17:"question_approval";i:0;s:16:"article_approval";i:0;s:24:"article_comment_approval";i:0;s:23:"unverified_modify_count";i:0;s:11:"user_report";i:0;s:17:"register_approval";i:0;s:15:"verify_approval";i:0;s:10:"sina_users";N;s:19:"receive_email_error";N;}'),
(113, 'slave_mail_config', 's:0:"";'),
(114, 'receiving_email_global_config', 'a:2:{s:7:"enabled";s:1:"N";s:12:"publish_user";N;}'),
(115, 'last_sent_valid_email_id', 'i:0;'),
(116, 'google_login_enabled', 's:1:"N";'),
(117, 'google_client_id', 's:0:"";'),
(118, 'google_client_secret', 's:0:"";'),
(119, 'facebook_login_enabled', 's:1:"N";'),
(120, 'facebook_app_id', 's:0:"";'),
(121, 'facebook_app_secret', 's:0:"";'),
(122, 'twitter_login_enabled', 's:1:"N";'),
(123, 'twitter_consumer_key', 's:0:"";'),
(124, 'twitter_consumer_secret', 's:0:"";'),
(125, 'weixin_encoding_aes_key', 's:0:"";'),
(126, 'integral_system_config_answer_change_source', 's:1:"Y";'),
(127, 'enable_help_center', 's:1:"N";'),
(128, 'ucenter_path', 's:0:"";'),
(129, 'register_agreement', 's:1608:"当您申请用户时，表示您已经同意遵守本规章。\n欢迎您加入本站点参与交流和讨论，本站点为社区，为维护网上公共秩序和社会稳定，请您自觉遵守以下条款：\n\n一、不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：\n　（一）煽动抗拒、破坏宪法和法律、行政法规实施的；\n　（二）煽动颠覆国家政权，推翻社会主义制度的；\n　（三）煽动分裂国家、破坏国家统一的；\n　（四）煽动民族仇恨、民族歧视，破坏民族团结的；\n　（五）捏造或者歪曲事实，散布谣言，扰乱社会秩序的；\n　（六）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；\n　（七）公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；\n　（八）损害国家机关信誉的；\n　（九）其他违反宪法和法律行政法规的；\n　（十）进行商业广告行为的。\n\n二、互相尊重，对自己的言论和行为负责。\n三、禁止在申请用户时使用相关本站的词汇，或是带有侮辱、毁谤、造谣类的或是有其含义的各种语言进行注册用户，否则我们会将其删除。\n四、禁止以任何方式对本站进行各种破坏行为。\n五、如果您有违反国家相关法律法规的行为，本站概不负责，您的登录信息均被记录无疑，必要时，我们会向相关的国家管理部门提供此类信息。";');

-- --------------------------------------------------------

--
-- 表的结构 `aws_topic`
--

CREATE TABLE IF NOT EXISTS `aws_topic` (
  `topic_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '话题id',
  `topic_title` varchar(64) DEFAULT NULL COMMENT '话题标题',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `discuss_count` int(11) DEFAULT '0' COMMENT '讨论计数',
  `topic_description` text COMMENT '话题描述',
  `topic_pic` varchar(255) DEFAULT NULL COMMENT '话题图片',
  `topic_lock` tinyint(2) NOT NULL DEFAULT '0' COMMENT '话题是否锁定 1 锁定 0 未锁定',
  `focus_count` int(11) DEFAULT '0' COMMENT '关注计数',
  `user_related` tinyint(1) DEFAULT '0' COMMENT '是否被用户关联',
  `url_token` varchar(32) DEFAULT NULL,
  `merged_id` int(11) DEFAULT '0',
  `seo_title` varchar(255) DEFAULT NULL,
  `parent_id` int(10) DEFAULT '0',
  `is_parent` tinyint(1) DEFAULT '0',
  `discuss_count_last_week` int(10) DEFAULT '0',
  `discuss_count_last_month` int(10) DEFAULT '0',
  `discuss_count_update` int(10) DEFAULT '0',
  PRIMARY KEY (`topic_id`),
  UNIQUE KEY `topic_title` (`topic_title`),
  KEY `url_token` (`url_token`),
  KEY `merged_id` (`merged_id`),
  KEY `discuss_count` (`discuss_count`),
  KEY `add_time` (`add_time`),
  KEY `user_related` (`user_related`),
  KEY `focus_count` (`focus_count`),
  KEY `topic_lock` (`topic_lock`),
  KEY `parent_id` (`parent_id`),
  KEY `is_parent` (`is_parent`),
  KEY `discuss_count_last_week` (`discuss_count_last_week`),
  KEY `discuss_count_last_month` (`discuss_count_last_month`),
  KEY `discuss_count_update` (`discuss_count_update`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='话题' AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `aws_topic`
--

INSERT INTO `aws_topic` (`topic_id`, `topic_title`, `add_time`, `discuss_count`, `topic_description`, `topic_pic`, `topic_lock`, `focus_count`, `user_related`, `url_token`, `merged_id`, `seo_title`, `parent_id`, `is_parent`, `discuss_count_last_week`, `discuss_count_last_month`, `discuss_count_update`) VALUES
(1, '默认话题', NULL, 0, '默认话题', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0),
(2, '企业管理', 1461726614, 2, '', NULL, 0, 1, 0, NULL, 0, NULL, 0, 0, 1, 2, 1462865993),
(3, '企业文化', 1461726614, 1, '', NULL, 0, 1, 0, NULL, 0, NULL, 0, 0, 1, 1, 1461726614);

-- --------------------------------------------------------

--
-- 表的结构 `aws_topic_focus`
--

CREATE TABLE IF NOT EXISTS `aws_topic_focus` (
  `focus_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `topic_id` int(11) DEFAULT NULL COMMENT '话题ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`focus_id`),
  KEY `uid` (`uid`),
  KEY `topic_id` (`topic_id`),
  KEY `topic_uid` (`topic_id`,`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='话题关注表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `aws_topic_focus`
--

INSERT INTO `aws_topic_focus` (`focus_id`, `topic_id`, `uid`, `add_time`) VALUES
(1, 2, 1, 1461726614),
(2, 3, 1, 1461726614);

-- --------------------------------------------------------

--
-- 表的结构 `aws_topic_merge`
--

CREATE TABLE IF NOT EXISTS `aws_topic_merge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source_id` int(11) NOT NULL DEFAULT '0',
  `target_id` int(11) NOT NULL DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `source_id` (`source_id`),
  KEY `target_id` (`target_id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_topic_relation`
--

CREATE TABLE IF NOT EXISTS `aws_topic_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增 ID',
  `topic_id` int(11) DEFAULT '0' COMMENT '话题id',
  `item_id` int(11) DEFAULT '0',
  `add_time` int(10) DEFAULT '0' COMMENT '添加时间',
  `uid` int(11) DEFAULT '0' COMMENT '用户ID',
  `type` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `uid` (`uid`),
  KEY `type` (`type`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `aws_topic_relation`
--

INSERT INTO `aws_topic_relation` (`id`, `topic_id`, `item_id`, `add_time`, `uid`, `type`) VALUES
(1, 2, 1, 1461726614, 1, 'question'),
(2, 3, 1, 1461726614, 1, 'question'),
(3, 2, 2, 1462865993, 1, 'question');

-- --------------------------------------------------------

--
-- 表的结构 `aws_users`
--

CREATE TABLE IF NOT EXISTS `aws_users` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户的 UID',
  `user_name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `email` varchar(255) DEFAULT NULL COMMENT 'EMAIL',
  `enname` varchar(50) DEFAULT NULL COMMENT '英文名',
  `realname` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `mobile` varchar(16) DEFAULT NULL COMMENT '用户手机',
  `password` varchar(32) DEFAULT NULL COMMENT '用户密码',
  `salt_0` varchar(16) DEFAULT NULL,
  `salt` varchar(16) DEFAULT NULL COMMENT '用户附加混淆码',
  `avatar_file` varchar(128) DEFAULT NULL COMMENT '头像文件',
  `sex` tinyint(1) DEFAULT NULL COMMENT '性别',
  `birthday` int(10) DEFAULT NULL COMMENT '生日',
  `province` varchar(64) DEFAULT NULL COMMENT '省',
  `city` varchar(64) DEFAULT NULL COMMENT '市',
  `job_id` int(10) DEFAULT '0' COMMENT '职业ID',
  `reg_time` int(10) DEFAULT NULL COMMENT '注册时间',
  `reg_ip` bigint(12) DEFAULT NULL COMMENT '注册IP',
  `last_login` int(10) DEFAULT '0' COMMENT '最后登录时间',
  `last_ip` bigint(12) DEFAULT NULL COMMENT '最后登录 IP',
  `online_time` int(10) DEFAULT '0' COMMENT '在线时间',
  `last_active` int(10) DEFAULT NULL COMMENT '最后活跃时间',
  `notification_unread` int(11) NOT NULL DEFAULT '0' COMMENT '未读系统通知',
  `inbox_unread` int(11) NOT NULL DEFAULT '0' COMMENT '未读短信息',
  `inbox_recv` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-所有人可以发给我,1-我关注的人',
  `fans_count` int(10) NOT NULL DEFAULT '0' COMMENT '粉丝数',
  `friend_count` int(10) NOT NULL DEFAULT '0' COMMENT '观众数',
  `invite_count` int(10) NOT NULL DEFAULT '0' COMMENT '邀请我回答数量',
  `article_count` int(10) NOT NULL DEFAULT '0' COMMENT '文章数量',
  `question_count` int(10) NOT NULL DEFAULT '0' COMMENT '问题数量',
  `answer_count` int(10) NOT NULL DEFAULT '0' COMMENT '回答数量',
  `topic_focus_count` int(10) NOT NULL DEFAULT '0' COMMENT '关注话题数量',
  `invitation_available` int(10) NOT NULL DEFAULT '0' COMMENT '邀请数量',
  `group_id` int(10) DEFAULT '0' COMMENT '用户组',
  `reputation_group` int(10) DEFAULT '0' COMMENT '威望对应组',
  `forbidden` tinyint(1) DEFAULT '0' COMMENT '是否禁止用户',
  `valid_email` tinyint(1) DEFAULT '0' COMMENT '邮箱验证',
  `is_first_login` tinyint(1) DEFAULT '1' COMMENT '首次登录标记',
  `agree_count` int(10) DEFAULT '0' COMMENT '赞同数量',
  `thanks_count` int(10) DEFAULT '0' COMMENT '感谢数量',
  `views_count` int(10) DEFAULT '0' COMMENT '个人主页查看数量',
  `reputation` int(10) DEFAULT '0' COMMENT '威望',
  `reputation_update_time` int(10) DEFAULT '0' COMMENT '威望更新',
  `weibo_visit` tinyint(1) DEFAULT '1' COMMENT '微博允许访问',
  `integral` int(10) DEFAULT '0',
  `draft_count` int(10) DEFAULT NULL,
  `common_email` varchar(255) DEFAULT NULL COMMENT '常用邮箱',
  `url_token` varchar(32) DEFAULT NULL COMMENT '个性网址',
  `url_token_update` int(10) DEFAULT '0',
  `verified` varchar(32) DEFAULT NULL,
  `default_timezone` varchar(32) DEFAULT NULL,
  `email_settings` varchar(255) DEFAULT '',
  `weixin_settings` varchar(255) DEFAULT '',
  `recent_topics` text,
  `change_pwd_flag` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  KEY `user_name` (`user_name`),
  KEY `email` (`email`),
  KEY `reputation` (`reputation`),
  KEY `reputation_update_time` (`reputation_update_time`),
  KEY `group_id` (`group_id`),
  KEY `agree_count` (`agree_count`),
  KEY `thanks_count` (`thanks_count`),
  KEY `forbidden` (`forbidden`),
  KEY `valid_email` (`valid_email`),
  KEY `last_active` (`last_active`),
  KEY `integral` (`integral`),
  KEY `url_token` (`url_token`),
  KEY `verified` (`verified`),
  KEY `answer_count` (`answer_count`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `aws_users`
--

INSERT INTO `aws_users` (`uid`, `user_name`, `email`, `enname`, `realname`, `mobile`, `password`, `salt_0`, `salt`, `avatar_file`, `sex`, `birthday`, `province`, `city`, `job_id`, `reg_time`, `reg_ip`, `last_login`, `last_ip`, `online_time`, `last_active`, `notification_unread`, `inbox_unread`, `inbox_recv`, `fans_count`, `friend_count`, `invite_count`, `article_count`, `question_count`, `answer_count`, `topic_focus_count`, `invitation_available`, `group_id`, `reputation_group`, `forbidden`, `valid_email`, `is_first_login`, `agree_count`, `thanks_count`, `views_count`, `reputation`, `reputation_update_time`, `weibo_visit`, `integral`, `draft_count`, `common_email`, `url_token`, `url_token_update`, `verified`, `default_timezone`, `email_settings`, `weixin_settings`, `recent_topics`, `change_pwd_flag`) VALUES
(1, 'admin', 'admin@tcl.com', NULL, NULL, '', 'd1d2dcd3ab5c784e0464a9ccd18aa363', 'wqvblw', 'fcuv', '000/00/00/01_avatar_min.jpg', 1, NULL, '', '', 0, 1461724957, 2130706433, 1466063561, 2130706433, 2827138, 1466490520, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 10, 1, 5, 0, 1, 0, 0, 0, 3, 0, 1466490205, 1, 1980, 0, NULL, NULL, 0, NULL, '', '', '', 'a:2:{i:0;s:12:"企业管理";i:1;s:12:"企业文化";}', 2);

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_attrib`
--

CREATE TABLE IF NOT EXISTS `aws_users_attrib` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `uid` int(11) DEFAULT NULL COMMENT '用户UID',
  `company` varchar(255) DEFAULT NULL COMMENT '公司',
  `position` varchar(255) DEFAULT NULL COMMENT '职位',
  `introduction` varchar(255) DEFAULT NULL COMMENT '个人简介',
  `signature` varchar(255) DEFAULT NULL COMMENT '个人签名',
  `qq` bigint(15) DEFAULT NULL,
  `homepage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户附加属性表' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `aws_users_attrib`
--

INSERT INTO `aws_users_attrib` (`id`, `uid`, `company`, `position`, `introduction`, `signature`, `qq`, `homepage`) VALUES
(1, 1, NULL, NULL, NULL, '', 0, '');

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_facebook`
--

CREATE TABLE IF NOT EXISTS `aws_users_facebook` (
  `id` bigint(20) unsigned NOT NULL,
  `uid` int(11) unsigned NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `gender` varchar(8) DEFAULT NULL,
  `locale` varchar(16) DEFAULT NULL,
  `timezone` tinyint(3) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `expires_time` int(10) unsigned NOT NULL DEFAULT '0',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `access_token` (`access_token`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_google`
--

CREATE TABLE IF NOT EXISTS `aws_users_google` (
  `id` varchar(64) NOT NULL,
  `uid` int(11) unsigned NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `locale` varchar(16) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `gender` varchar(8) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `access_token` varchar(128) DEFAULT NULL,
  `refresh_token` varchar(128) DEFAULT NULL,
  `expires_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `access_token` (`access_token`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_group`
--

CREATE TABLE IF NOT EXISTS `aws_users_group` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) DEFAULT '0' COMMENT '0-会员组 1-系统组',
  `custom` tinyint(1) DEFAULT '0' COMMENT '是否自定义',
  `group_name` varchar(50) NOT NULL,
  `reputation_lower` int(11) DEFAULT '0',
  `reputation_higer` int(11) DEFAULT '0',
  `reputation_factor` float DEFAULT '0' COMMENT '威望系数',
  `permission` text COMMENT '权限设置',
  PRIMARY KEY (`group_id`),
  KEY `type` (`type`),
  KEY `custom` (`custom`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户组' AUTO_INCREMENT=100 ;

--
-- 转存表中的数据 `aws_users_group`
--

INSERT INTO `aws_users_group` (`group_id`, `type`, `custom`, `group_name`, `reputation_lower`, `reputation_higer`, `reputation_factor`, `permission`) VALUES
(1, 0, 0, '超级管理员', 0, 0, 5, 'a:15:{s:16:"is_administortar";s:1:"1";s:12:"is_moderator";s:1:"1";s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:13:"edit_question";s:1:"1";s:10:"edit_topic";s:1:"1";s:12:"manage_topic";s:1:"1";s:12:"create_topic";s:1:"1";s:17:"redirect_question";s:1:"1";s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:15:"publish_article";s:1:"1";s:12:"edit_article";s:1:"1";s:19:"edit_question_topic";s:1:"1";s:15:"publish_comment";s:1:"1";}'),
(2, 0, 0, '前台管理员', 0, 0, 4, 'a:14:{s:12:"is_moderator";s:1:"1";s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:13:"edit_question";s:1:"1";s:10:"edit_topic";s:1:"1";s:12:"manage_topic";s:1:"1";s:12:"create_topic";s:1:"1";s:17:"redirect_question";s:1:"1";s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:15:"publish_article";s:1:"1";s:12:"edit_article";s:1:"1";s:19:"edit_question_topic";s:1:"1";s:15:"publish_comment";s:1:"1";}'),
(3, 0, 0, '未验证会员', 0, 0, 0, 'a:5:{s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:11:"human_valid";s:1:"1";s:19:"question_valid_hour";s:1:"2";s:17:"answer_valid_hour";s:1:"2";}'),
(4, 0, 0, '普通会员', 0, 0, 0, 'a:3:{s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:19:"question_valid_hour";s:2:"10";s:17:"answer_valid_hour";s:2:"10";}'),
(5, 1, 0, '注册会员', 0, 100, 1, 'a:6:{s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:11:"human_valid";s:1:"1";s:19:"question_valid_hour";s:1:"5";s:17:"answer_valid_hour";s:1:"5";s:15:"publish_comment";s:1:"1";}'),
(6, 1, 0, '初级会员', 100, 200, 1, 'a:8:{s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:19:"question_valid_hour";s:1:"5";s:17:"answer_valid_hour";s:1:"5";s:15:"publish_article";s:1:"1";s:19:"edit_question_topic";s:1:"1";}'),
(7, 1, 0, '中级会员', 200, 500, 1, 'a:9:{s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:10:"edit_topic";s:1:"1";s:12:"create_topic";s:1:"1";s:17:"redirect_question";s:1:"1";s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:15:"publish_article";s:1:"1";s:15:"publish_comment";s:1:"1";}'),
(8, 1, 0, '高级会员', 500, 1000, 1, 'a:11:{s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:13:"edit_question";s:1:"1";s:10:"edit_topic";s:1:"1";s:12:"create_topic";s:1:"1";s:17:"redirect_question";s:1:"1";s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:15:"publish_article";s:1:"1";s:19:"edit_question_topic";s:1:"1";s:15:"publish_comment";s:1:"1";}'),
(9, 1, 0, '核心会员', 1000, 999999, 1, 'a:12:{s:16:"publish_question";s:1:"1";s:21:"publish_approval_time";a:2:{s:5:"start";s:0:"";s:3:"end";s:0:"";}s:13:"edit_question";s:1:"1";s:10:"edit_topic";s:1:"1";s:12:"manage_topic";s:1:"1";s:12:"create_topic";s:1:"1";s:17:"redirect_question";s:1:"1";s:13:"upload_attach";s:1:"1";s:11:"publish_url";s:1:"1";s:15:"publish_article";s:1:"1";s:19:"edit_question_topic";s:1:"1";s:15:"publish_comment";s:1:"1";}'),
(99, 0, 0, '游客', 0, 0, 0, 'a:9:{s:10:"visit_site";s:1:"1";s:13:"visit_explore";s:1:"1";s:12:"search_avail";s:1:"1";s:14:"visit_question";s:1:"1";s:11:"visit_topic";s:1:"1";s:13:"visit_feature";s:1:"1";s:12:"visit_people";s:1:"1";s:13:"visit_chapter";s:1:"1";s:11:"answer_show";s:1:"1";}');

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_notification_setting`
--

CREATE TABLE IF NOT EXISTS `aws_users_notification_setting` (
  `notice_setting_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `uid` int(11) NOT NULL,
  `data` text COMMENT '设置数据',
  PRIMARY KEY (`notice_setting_id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='通知设定' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_online`
--

CREATE TABLE IF NOT EXISTS `aws_users_online` (
  `uid` int(11) NOT NULL COMMENT '用户 ID',
  `last_active` int(11) DEFAULT '0' COMMENT '上次活动时间',
  `ip` bigint(12) DEFAULT '0' COMMENT '客户端ip',
  `active_url` varchar(255) DEFAULT NULL COMMENT '停留页面',
  `user_agent` varchar(255) DEFAULT NULL COMMENT '用户客户端信息',
  KEY `uid` (`uid`),
  KEY `last_active` (`last_active`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='在线用户列表';

--
-- 转存表中的数据 `aws_users_online`
--

INSERT INTO `aws_users_online` (`uid`, `last_active`, `ip`, `active_url`, `user_agent`) VALUES
(1, 1466490520, 2130706433, 'http://dev.wecenter.com/?/q/share/a245f8e8e7', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36');

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_qq`
--

CREATE TABLE IF NOT EXISTS `aws_users_qq` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户在本地的UID',
  `nickname` varchar(64) DEFAULT NULL,
  `openid` varchar(128) DEFAULT '',
  `gender` varchar(8) DEFAULT NULL,
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `access_token` varchar(64) DEFAULT NULL,
  `refresh_token` varchar(64) DEFAULT NULL,
  `expires_time` int(10) DEFAULT NULL,
  `figureurl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `add_time` (`add_time`),
  KEY `access_token` (`access_token`),
  KEY `openid` (`openid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_sina`
--

CREATE TABLE IF NOT EXISTS `aws_users_sina` (
  `id` bigint(11) NOT NULL COMMENT '新浪用户 ID',
  `uid` int(11) NOT NULL COMMENT '用户在本地的UID',
  `name` varchar(64) DEFAULT NULL COMMENT '微博昵称',
  `location` varchar(255) DEFAULT NULL COMMENT '地址',
  `description` text COMMENT '个人描述',
  `url` varchar(255) DEFAULT NULL COMMENT '用户博客地址',
  `profile_image_url` varchar(255) DEFAULT NULL COMMENT 'Sina 自定义头像地址',
  `gender` varchar(8) DEFAULT NULL,
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `expires_time` int(10) DEFAULT '0' COMMENT '过期时间',
  `access_token` varchar(64) DEFAULT NULL,
  `last_msg_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `access_token` (`access_token`),
  KEY `last_msg_id` (`last_msg_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_twitter`
--

CREATE TABLE IF NOT EXISTS `aws_users_twitter` (
  `id` bigint(20) unsigned NOT NULL,
  `uid` int(11) unsigned NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `screen_name` varchar(128) DEFAULT NULL,
  `location` varchar(64) DEFAULT NULL,
  `time_zone` varchar(64) DEFAULT NULL,
  `lang` varchar(16) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `access_token` varchar(255) NOT NULL DEFAULT 'a:2:{s:11:"oauth_token";s:0:"";s:18:"oauth_token_secret";s:0:"";}',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `access_token` (`access_token`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_ucenter`
--

CREATE TABLE IF NOT EXISTS `aws_users_ucenter` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT '0',
  `uc_uid` int(11) DEFAULT '0',
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `uc_uid` (`uc_uid`),
  KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_users_weixin`
--

CREATE TABLE IF NOT EXISTS `aws_users_weixin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `openid` varchar(255) NOT NULL,
  `expires_in` int(10) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `scope` varchar(64) DEFAULT NULL,
  `headimgurl` varchar(255) DEFAULT NULL,
  `nickname` varchar(64) DEFAULT NULL,
  `sex` tinyint(1) DEFAULT '0',
  `province` varchar(32) DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `country` varchar(32) DEFAULT NULL,
  `add_time` int(10) NOT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `location_update` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `openid` (`openid`),
  KEY `expires_in` (`expires_in`),
  KEY `scope` (`scope`),
  KEY `sex` (`sex`),
  KEY `province` (`province`),
  KEY `city` (`city`),
  KEY `country` (`country`),
  KEY `add_time` (`add_time`),
  KEY `latitude` (`latitude`,`longitude`),
  KEY `location_update` (`location_update`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_user_action_history`
--

CREATE TABLE IF NOT EXISTS `aws_user_action_history` (
  `history_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` int(11) NOT NULL COMMENT '用户id',
  `associate_type` tinyint(1) DEFAULT NULL COMMENT '关联类型: 1 问题 2 回答 3 评论 4 话题',
  `associate_action` smallint(3) DEFAULT NULL COMMENT '操作类型',
  `associate_id` int(11) DEFAULT NULL COMMENT '关联ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  `associate_attached` int(11) DEFAULT NULL,
  `anonymous` tinyint(1) DEFAULT '0' COMMENT '是否匿名',
  `fold_status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`history_id`),
  KEY `add_time` (`add_time`),
  KEY `uid` (`uid`),
  KEY `associate_id` (`associate_id`),
  KEY `anonymous` (`anonymous`),
  KEY `fold_status` (`fold_status`),
  KEY `associate` (`associate_type`,`associate_action`),
  KEY `associate_attached` (`associate_attached`),
  KEY `associate_with_id` (`associate_id`,`associate_type`,`associate_action`),
  KEY `associate_with_uid` (`uid`,`associate_type`,`associate_action`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户操作记录' AUTO_INCREMENT=13 ;

--
-- 转存表中的数据 `aws_user_action_history`
--

INSERT INTO `aws_user_action_history` (`history_id`, `uid`, `associate_type`, `associate_action`, `associate_id`, `add_time`, `associate_attached`, `anonymous`, `fold_status`) VALUES
(1, 1, 4, 401, 2, 1461726614, -1, 0, 0),
(2, 1, 4, 406, 2, 1461726614, -1, 0, 0),
(3, 1, 1, 401, 1, 1461726614, 2, 0, 0),
(4, 1, 4, 401, 2, 1461726614, 1, 0, 0),
(5, 1, 4, 401, 3, 1461726614, -1, 0, 0),
(6, 1, 4, 406, 3, 1461726614, -1, 0, 0),
(7, 1, 1, 401, 1, 1461726614, 3, 0, 0),
(8, 1, 4, 401, 3, 1461726614, 1, 0, 0),
(9, 1, 1, 101, 1, 1461726614, -1, 1, 0),
(10, 1, 1, 401, 2, 1462865993, 2, 0, 0),
(11, 1, 4, 401, 2, 1462865993, 2, 0, 0),
(12, 1, 1, 101, 2, 1462865993, -1, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `aws_user_action_history_data`
--

CREATE TABLE IF NOT EXISTS `aws_user_action_history_data` (
  `history_id` int(11) unsigned NOT NULL,
  `associate_content` text,
  `associate_attached` text,
  `addon_data` text COMMENT '附加数据',
  PRIMARY KEY (`history_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `aws_user_action_history_data`
--

INSERT INTO `aws_user_action_history_data` (`history_id`, `associate_content`, `associate_attached`, `addon_data`) VALUES
(1, '企业管理', '', ''),
(2, '', '', ''),
(3, '企业管理', '', ''),
(4, '企业管理', '', ''),
(5, '企业文化', '', ''),
(6, '', '', ''),
(7, '企业文化', '', ''),
(8, '企业文化', '', ''),
(9, '如何评价史玉柱说的将兔窝变成狼窝？', '史玉柱一定是忘记自己是怎样成功的了。\n在互联网的江湖里，论创业的资历，没有人比史玉柱更老的了，即使是马云，也要礼让三分。史大胆纵横商海数十年，三起三落，打造出了一支像狼一样的高执行力团队。\n这支团队，在史玉柱手里，指哪打哪，每战必胜。但你以为胜利的原因，就在于此，那就大错特错了。\n说实话，在中国互联网杀红了眼的战场上，哪家成功的企业没有一支高执行力的团队，但为什么有些继续辉煌，有些分崩离析，有些困兽犹斗？关键还是统帅。统帅冲锋在前，发现了肉，群狼才能齐心协力，勇往冲杀。\n若不然，一群狼再狠，也只能互相撕咬，挥霍徒劳的精力。\n\n史玉柱曾经是一个拥有火眼金睛的天才统帅。\n他的第一次，是看准了个人电脑进入中国，却缺乏汉字输入法的需求，以汉卡产品一炮而红。这款产品让他冲上云霄，成为1995年的福布斯中国十大富豪，也让他破产消失，成为坊间笑谈。\n很多人以为，二十年前巨人公司的破产，是源于史玉柱的头脑发热，建巨人大厦导致资金链断裂造成的。其实并不是，巨人大厦的地只花了500万元，几乎是珠海市政府白送的，房子也只是打了个地基，并没有投进去多少钱。根本的原因，其实是1995年微软windows平台的推出，导致基于dos平台的汉卡产品失去了市场。\n同样是那支善于冲锋陷阵的团队，只是因为肉突然不见了，瞬间就失去了方向，四散溃逃。\n\n这次失败，让史玉柱沉下心来，痛苦反思。\n他意识到，IT行业的技术变化太快了，肉可能今天还在，明天就突然消失了，风险非常大。而在传统行业，机会同样很多，只要善于洞察人性，发现欲望，肉，很多，还很香。\n史玉柱开始参透“欲望”两个字的巨大价值，他深入的研究中国社会的阶层浮华背后，那些不能言说的秘密。1990年代末的中国，经济正在金融风暴的冲击下摇摇欲坠，社会阶层的动荡十分激烈，每一个人都处于惶恐之中，充满不安全感。人们渴望通过向有利益关系的人物“示好”，来保证自身地位的安全。\n“送礼”这种需求，自古就有。但是一般来说，被满足的，其实只是权贵阶层的需求。那些奢侈品，往往会以历史传承的高贵，文化品味的高雅，来曲径通幽站上高端的礼品台。可是，这个市场只是送礼金字塔的塔尖啊，还有更广大的三四线市场的群众呢？\n对于低收入、低教育水平的三四五六线市场来说，送车送房送江诗丹顿，是送不起的，传统上更多的是抓两只鸡，提一篮鸡蛋，这多上不了台面啊。人们正愁不知道送什么好的时候，史玉柱站出来了，他大声说：“我已经帮你准备好了，就送脑白金吧，你看价格不贵百来块钱，又健康寓意好，还不赶紧滴。”\n很多人不齿于“今年过节不收礼，收礼只收脑白金”这句广告语的脑残，但他们不知道的是，对于脑白金的目标受众来说，你端着他们就听不懂，就是要这么直白才能将欲望全部钓出来。\n\n几年之后，经济危机过去，脑白金的市场开始饱和甚至萎缩，史玉柱又将目光投向了另一块肥肉。\n网络游戏这个行业，说白了，考验的就是从业者对人心“欲望”的洞察。\n早期的网络游戏，成功的有两种。一种是暴雪为代表的美式游戏，他创作一个宏大的虚拟世界，就像一座神圣的宫殿，你沉浸在里面，摸索三月，也就是略知皮毛，或许穷尽一生，才能窥见真谛。这种精品思路，就像四大名著一样，充满艺术感，占据了金字塔尖的高端市场。\n另一种，则是韩式传奇、奇迹为代表的升级打怪游戏，他们就像网络小说里的YY故事，让你肾上腺激素飙升，宣泄即时的快感。暴雪虽好，但是就像是四大名著，不是每个人都能够读的下去的，大量的低端小白用户还是更青睐于这种韩式的泡菜。\n史玉柱进来了，他发现了另外一块肉。\n如果说，暴雪的目标人群是中产阶层，韩式泡菜的目标人群是低龄屌丝，史玉柱看上的，则是“土豪”。他们不差钱，差的是时间，他们的工作很忙碌，压力很大，进入游戏就想得到快速的压力释放，在杀戮中享受肆意的快感。\n——但是传统的游戏无法满足他们的欲望！\n暴雪的游戏需要高度熟练的技巧，没有长时间的专注练习是不可能享受到快感的，泡菜游戏又需要长时间的打怪，一步步从低级升上来。他们的乐趣都在“时间”的消磨中获得，于是依靠时间收费模式，赚“时间”的钱。\n但是对于土豪来说，他们没有时间，于是在几乎任何的游戏中，都只能被人虐，毫无乐趣可言。他们可是“人民币玩家”啊，可是竟然被华丽丽的无视。\n史玉柱发现了这块大肥肉，于是砸进全部身家搞网络游戏，将传统的游戏收费模式从“时间”改为“道具”，彻底点燃了土豪们的欲望。土豪们不缺钱，只要愿意，随时都可以获得武器、坐骑、法力，享受成为“人上人”，权倾天下，一剑封喉的快感。\n当然，如果史玉柱的游戏是这么的粗浅，土豪玩过几次估计也就索然无味了。就像人世间的性爱，最无趣的就是去妓院找宣泄了。得到的东西太容易，人们是不会珍惜的。史玉柱深深的明白这个道理，因此在他设计的虚拟世界里，实际要复杂的多。你要宣泄，可以让你花钱得到，但是在这个实现快感的征途中，你一定会在无意中失去一些东西，这些东西或许只是一些细小的不如意，但就是这样，让你的人生永远也就差一点才能圆满。你可以看得到希望，却总也得不到，即使花费了再多的金钱，也只能永远都在“征途”上跋涉。\n\n“征途”游戏的开发团队，是史玉柱从盛大挖来的，在陈天桥手里只是一群小白兔，开发的“英雄年代”游戏惨淡收场，但在史大胆手里就成了一群狼。\n在这个过程中，这群狼到底发生了什么脱胎换骨的变化？\n我相信变化是不大的。如果没有史玉柱发现的肉，群狼们就算24小时上班工作制，365天工作制，天天喊口号打激素，他们也不可能获得成功。\n这些年来，屡屡听到大公司们说要打造狼性团队，要激起斗志，要拿鞭子在后面抽他们。\n注意了，这往往说明这个公司遇到了瓶颈，他的统帅找不到肉了。这个时候，你越是抽鞭子，狼崽们只会越恐惧，他们为了生存不得不互相撕咬，斗得遍体鳞伤，或者心灰意冷，离群而去，加速整个团队的灭亡。\n这不是一个好兆头。', ''),
(10, '企业管理', '', ''),
(11, '企业管理', '', ''),
(12, '测试发个帖子', '而是离开的房间\n啥的减肥了\n熟练度附近了', '');

-- --------------------------------------------------------

--
-- 表的结构 `aws_user_action_history_fresh`
--

CREATE TABLE IF NOT EXISTS `aws_user_action_history_fresh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `history_id` int(11) NOT NULL,
  `associate_id` int(11) NOT NULL,
  `associate_type` tinyint(1) NOT NULL,
  `associate_action` smallint(3) NOT NULL,
  `add_time` int(10) NOT NULL DEFAULT '0',
  `uid` int(10) NOT NULL DEFAULT '0',
  `anonymous` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `associate` (`associate_type`,`associate_action`),
  KEY `add_time` (`add_time`),
  KEY `uid` (`uid`),
  KEY `history_id` (`history_id`),
  KEY `associate_with_id` (`id`,`associate_type`,`associate_action`),
  KEY `associate_with_uid` (`uid`,`associate_type`,`associate_action`),
  KEY `anonymous` (`anonymous`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- 转存表中的数据 `aws_user_action_history_fresh`
--

INSERT INTO `aws_user_action_history_fresh` (`id`, `history_id`, `associate_id`, `associate_type`, `associate_action`, `add_time`, `uid`, `anonymous`) VALUES
(11, 11, 2, 4, 401, 1462865993, 1, 0),
(9, 9, 1, 1, 101, 1461726614, 1, 1),
(8, 8, 3, 4, 401, 1461726614, 1, 0),
(12, 12, 2, 1, 101, 1462865993, 1, 0);

-- --------------------------------------------------------

--
-- 表的结构 `aws_user_follow`
--

CREATE TABLE IF NOT EXISTS `aws_user_follow` (
  `follow_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `fans_uid` int(11) DEFAULT NULL COMMENT '关注人的UID',
  `friend_uid` int(11) DEFAULT NULL COMMENT '被关注人的uid',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`follow_id`),
  KEY `fans_uid` (`fans_uid`),
  KEY `friend_uid` (`friend_uid`),
  KEY `user_follow` (`fans_uid`,`friend_uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户关注表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_verify_apply`
--

CREATE TABLE IF NOT EXISTS `aws_verify_apply` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `attach` varchar(255) DEFAULT NULL,
  `time` int(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `data` text,
  `status` tinyint(1) DEFAULT '0',
  `type` varchar(16) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `time` (`time`),
  KEY `name` (`name`,`status`),
  KEY `type` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weibo_msg`
--

CREATE TABLE IF NOT EXISTS `aws_weibo_msg` (
  `id` bigint(20) NOT NULL,
  `created_at` int(10) NOT NULL,
  `msg_author_uid` bigint(20) NOT NULL,
  `text` varchar(255) NOT NULL,
  `access_key` varchar(32) NOT NULL,
  `has_attach` tinyint(1) NOT NULL DEFAULT '0',
  `uid` int(10) NOT NULL,
  `weibo_uid` bigint(20) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`),
  KEY `uid` (`uid`),
  KEY `weibo_uid` (`weibo_uid`),
  KEY `question_id` (`question_id`),
  KEY `ticket_id` (`ticket_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='新浪微博消息列表';

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_accounts`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_accounts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `weixin_mp_token` varchar(255) NOT NULL,
  `weixin_account_role` varchar(20) DEFAULT 'base',
  `weixin_app_id` varchar(255) DEFAULT '',
  `weixin_app_secret` varchar(255) DEFAULT '',
  `weixin_mp_menu` text,
  `weixin_subscribe_message_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `weixin_no_result_message_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `weixin_encoding_aes_key` varchar(43) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `weixin_mp_token` (`weixin_mp_token`),
  KEY `weixin_account_role` (`weixin_account_role`),
  KEY `weixin_app_id` (`weixin_app_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='微信多账号设置' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_login`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_login` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `token` int(10) NOT NULL,
  `uid` int(10) DEFAULT NULL,
  `session_id` varchar(32) NOT NULL,
  `expire` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `token` (`token`),
  KEY `expire` (`expire`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_message`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `weixin_id` varchar(32) NOT NULL,
  `content` varchar(255) NOT NULL,
  `action` text,
  `time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `weixin_id` (`weixin_id`),
  KEY `time` (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_msg`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_msg` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `msg_id` bigint(20) NOT NULL,
  `group_name` varchar(255) NOT NULL DEFAULT '未分组',
  `status` varchar(15) NOT NULL DEFAULT 'unsent',
  `error_num` int(10) DEFAULT NULL,
  `main_msg` text,
  `articles_info` text,
  `questions_info` text,
  `create_time` int(10) NOT NULL,
  `filter_count` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `msg_id` (`msg_id`),
  KEY `group_name` (`group_name`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='微信群发列表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_qr_code`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_qr_code` (
  `scene_id` mediumint(5) NOT NULL AUTO_INCREMENT,
  `ticket` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `subscribe_num` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`scene_id`),
  KEY `ticket` (`ticket`),
  KEY `subscribe_num` (`subscribe_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='微信二维码' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_reply_rule`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_reply_rule` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `account_id` int(10) NOT NULL DEFAULT '0',
  `keyword` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `image_file` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `link` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '0',
  `sort_status` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  KEY `keyword` (`keyword`),
  KEY `enabled` (`enabled`),
  KEY `sort_status` (`sort_status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_weixin_third_party_api`
--

CREATE TABLE IF NOT EXISTS `aws_weixin_third_party_api` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `account_id` int(10) NOT NULL DEFAULT '0',
  `url` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `rank` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  KEY `enabled` (`enabled`),
  KEY `rank` (`rank`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='微信第三方接入' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `aws_wenjuan`
--

CREATE TABLE IF NOT EXISTS `aws_wenjuan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `username` char(50) DEFAULT NULL COMMENT '用户名',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '调查问卷状态',
  `title` varchar(255) NOT NULL,
  `desc` text NOT NULL,
  `version` int(11) NOT NULL DEFAULT '1' COMMENT '调查问卷当前版本',
  `islogin` int(11) DEFAULT '0',
  `starttime` int(11) DEFAULT NULL COMMENT '问卷开始时间',
  `endtime` int(11) DEFAULT NULL COMMENT '问卷结束时间',
  `createtime` int(11) NOT NULL COMMENT '问卷创建时间',
  `sn` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- 转存表中的数据 `aws_wenjuan`
--

INSERT INTO `aws_wenjuan` (`id`, `uid`, `username`, `status`, `title`, `desc`, `version`, `islogin`, `starttime`, `endtime`, `createtime`, `sn`) VALUES
(4, 1, NULL, 10, '1111', 'bbb', 1, 0, 0, 0, 1463039867, '5d7def6e97'),
(5, 1, 'admin', 5, '测试新闻卷', '1111', 1, 0, 1463463070, 1466055070, 1463463070, '2bef9e9ebf'),
(6, 1, 'admin', 5, '测试一下', '', 1, 0, 1463469480, 1466061480, 1463469480, '4646d56d77'),
(7, 1, 'admin', 5, '来个日期时间的', '', 1, 0, 2147483647, 2147483647, 1463470183, '501ba80348'),
(8, 1, 'admin', 10, '重新来个日期的', '', 1, 0, 1462060800, 1464652800, 1463470708, '125114fe4d'),
(9, 1, 'admin', 10, '测试编辑', 'aaa', 1, 0, 1463646300, 1464944400, 1463479215, '6d76722ce9'),
(10, 1, 'admin', 10, '测试', '', 1, 0, 1463629140, 1463801940, 1463629195, '5241638b3e'),
(11, 1, 'admin', 10, 'ggg', '', 1, 0, 1463542980, 1464925380, 1463629390, '2064c4bb03'),
(12, 1, 'admin', 10, '1111', '<p>222</p>', 1, 0, 1464073800, 1465110660, 1463987467, 'c7c6888990'),
(13, 1, 'admin', 10, '1111', '<p>bbbb</p>', 1, 0, 1464203400, 1464997800, 1464262265, '14d9499b81'),
(14, 1, 'admin', 10, '111', '', 1, 0, 1464245400, 1464364500, 1464332187, 'ea57b5cd2a'),
(15, 1, 'admin', 10, '测试时间', '', 1, 0, 1464590100, 1465022100, 1464590581, '6d5e0622da'),
(16, 1, 'admin', 5, '1111', '', 1, 0, 1464748980, 1467340980, 1464749053, '68198c33d2'),
(17, 1, 'admin', 5, '4444', '', 1, 0, 1465180080, 1467772080, 1465180180, '2c03016d01'),
(18, 1, 'admin', 5, 'TTT', '', 1, 0, 1465180200, 1467772200, 1465180288, '56eee68026'),
(19, 1, 'admin', 5, 'test', '<p>111</p>', 1, 1, 1465723680, 1468315680, 1465723707, '9b72035da6'),
(20, 1, 'admin', 5, '123', '', 1, 1, 1465726740, 1466870400, 1465726774, '704306adb3'),
(21, 1, 'admin', 5, 'ffff', '<p>aaaa</p>', 1, 0, 1465874340, 1468466340, 1465874396, '46672b5aeb'),
(22, 1, 'admin', 10, '34234234', '<p>324324324324</p>', 1, 0, 1466011200, 1466235000, 1465874700, 'ef9f03e14c'),
(23, 1, 'admin', 5, '1111', '', 1, 0, 1466148600, 1468567920, 1465975976, '950f58204f'),
(24, 1, 'admin', 10, '222', '', 1, 0, 1465323900, 1465623000, 1465976037, 'a245f8e8e7');

-- --------------------------------------------------------

--
-- 表的结构 `aws_wenjuan_answer`
--

CREATE TABLE IF NOT EXISTS `aws_wenjuan_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL COMMENT '问卷ID',
  `uid` char(50) DEFAULT NULL,
  `username` char(50) DEFAULT NULL COMMENT '用户名',
  `content` text NOT NULL COMMENT '答卷内容',
  `version` int(11) NOT NULL COMMENT '答卷版本',
  `createtime` int(11) DEFAULT NULL COMMENT '答卷时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- 转存表中的数据 `aws_wenjuan_answer`
--

INSERT INTO `aws_wenjuan_answer` (`id`, `qid`, `uid`, `username`, `content`, `version`, `createtime`) VALUES
(1, 4, '1', 'admin', '[{"cid":"c2","label":"我是单选题","result":["123"]},{"cid":"c5","label":"我是多选","result":["444"]}]', 1, 1463106593),
(2, 18, '1', 'admin', '[{"cid":"c2","result":["3333","55555"]}]', 1, 1465180791),
(3, 21, 'm29ne3vngtgj45brjehit00vn7', '', '[{"cid":"c2","result":["jjj"]}]', 1, 1465874520),
(4, 21, '6cpcufkgfc3ar391rmq8ctpep6', '', '[{"cid":"c2","result":["ksdf"]}]', 1, 1465874645),
(5, 21, '2kv94mml6jf39jcq76vs1nj4j1', '', '[{"cid":"c2","result":["ksdf"]}]', 1, 1465874678),
(6, 22, '2kv94mml6jf39jcq76vs1nj4j1', '', '[{"cid":"c2","result":["22"]}]', 1, 1465874810),
(7, 22, '8v60dukn70ql21k0oaerac3pk7', '', '[{"cid":"c2","result":["2"]}]', 1, 1465874898),
(8, 21, '1', 'admin', '[{"cid":"c2","result":["jjj"]}]', 1, 1465874917),
(9, 22, '1', 'admin', '[{"cid":"c2","result":["2"]}]', 1, 1465874923);

-- --------------------------------------------------------

--
-- 表的结构 `aws_wenjuan_detail`
--

CREATE TABLE IF NOT EXISTS `aws_wenjuan_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL COMMENT '关联问卷主表ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `title` varchar(255) NOT NULL COMMENT '问卷标题',
  `desc` text NOT NULL COMMENT '问卷描述',
  `content` text NOT NULL COMMENT '问卷内容',
  `version` int(11) NOT NULL COMMENT '问卷版本',
  `createtime` int(11) NOT NULL,
  `updatetime` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- 转存表中的数据 `aws_wenjuan_detail`
--

INSERT INTO `aws_wenjuan_detail` (`id`, `qid`, `uid`, `title`, `desc`, `content`, `version`, `createtime`, `updatetime`) VALUES
(3, 3, 1, '测试新问卷', '', '[{"label":"来个单选题","field_type":"radio","required":true,"field_options":{"options":[{"label":"芒果","checked":false},{"label":"香蕉","checked":false},{"label":"苹果","checked":false}]},"cid":"c2"},{"label":"来个多选题","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"电影","checked":false},{"label":"书籍","checked":false},{"label":"跑步","checked":false},{"label":"游泳","checked":false},{"label":"游戏","checked":false}]},"cid":"c6"},{"label":"","field_type":"section_break","required":true,"field_options":{},"cid":"c10"},{"label":"请问你最喜欢的人是？","field_type":"text","required":true,"field_options":{},"cid":"c14"}]', 1, 1463033903, 1463033903),
(4, 4, 1, '1111', 'bbb', '[{"label":"我是单选题","field_type":"radio","required":true,"field_options":{"options":[{"label":"123","checked":false},{"label":"444","checked":false}]},"cid":"c2"},{"label":"我是多选","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"444","checked":false},{"label":"5555","checked":false}]},"cid":"c5"}]', 1, 1463039867, 1463047015),
(5, 5, 1, '测试新闻卷', '1111', '[{"label":"我是单选题","field_type":"radio","required":true,"field_options":{"options":[{"label":"选项一","checked":false},{"label":"选项二","checked":false}],"description":""},"cid":"c2"}]', 1, 1463463070, NULL),
(6, 6, 1, '测试一下', '', '[{"label":"我是单选","field_type":"radio","required":true,"field_options":{"options":[{"label":"选项一","checked":false},{"label":"选项二","checked":false}]},"cid":"c2"}]', 1, 1463469480, NULL),
(7, 7, 1, '来个日期时间的', '', '[{"label":"就一个单选","field_type":"radio","required":true,"field_options":{"options":[{"label":"对","checked":false},{"label":"错","checked":false}]},"cid":"c2"}]', 1, 1463470183, NULL),
(8, 8, 1, '重新来个日期的', '', '[{"label":"单选题","field_type":"radio","required":true,"field_options":{"options":[{"label":"选项对的","checked":false},{"label":"选项错的","checked":false}]},"cid":"c2"}]', 1, 1463470708, NULL),
(9, 9, 1, '测试编辑', 'aaa', '[{"label":"1","field_type":"radio","required":true,"field_options":{"options":[{"label":"我是一二","checked":false},{"label":"我是发发发","checked":false}]},"cid":"c2"},{"label":"来个是否","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"","checked":false},{"label":"","checked":false}]},"cid":"c5"}]', 1, 1463479215, 1463563586),
(10, 10, 1, '测试', '', '[{"label":"aaaa","field_type":"radio","required":true,"field_options":{"options":[{"label":"33","checked":false},{"label":"44","checked":false}]},"cid":"c2"}]', 1, 1463629195, NULL),
(11, 11, 1, 'ggg', '', '[{"label":"ggg","field_type":"radio","required":true,"field_options":{"options":[{"label":"gg","checked":false},{"label":"gg","checked":false}]},"cid":"c2"},{"label":"qqqq","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"22","checked":false},{"label":"3355","checked":false},{"label":"44","checked":false},{"label":"3362554","checked":false}],"description":"1111"},"cid":"c5"}]', 1, 1463629390, 1463629429),
(12, 12, 1, '1111', '<p>222</p>', '[{"label":"111","field_type":"radio","required":true,"field_options":{"options":[{"label":"b","checked":false},{"label":"c","checked":false}],"description":"2"},"cid":"c2"},{"label":"sdfs","field_type":"checkboxes","required":true,"field_options":{"options":[{"label":"111","checked":false},{"label":"222","checked":false}],"description":"bb"},"cid":"c6"},{"label":"xxxxx","field_type":"dropdown","required":true,"field_options":{"options":[{"label":"aaa","checked":false},{"label":"bbbb","checked":false}],"include_blank_option":false},"cid":"c10"},{"label":"sfsdff","field_type":"text","required":true,"field_options":{},"cid":"c14"}]', 1, 1463987467, NULL),
(13, 13, 1, '1111', '<p>bbbb</p>', '[{"label":"1111","field_type":"radio","required":true,"field_options":{"options":[{"label":"vv","checked":false},{"label":"vvvvvvv","checked":false}]},"cid":"c2"}]', 1, 1464262265, 1464262551),
(14, 14, 1, '111', '', '[{"label":"bbbb","field_type":"radio","required":true,"field_options":{"options":[{"label":"aaaa","checked":false},{"label":"aaaa","checked":false}]},"cid":"c2"}]', 1, 1464332187, NULL),
(15, 15, 1, '测试时间', '', '[{"label":"单选题","field_type":"radio","required":true,"field_options":{"options":[{"label":"kankan","checked":false},{"label":"liaoliao","checked":false}]},"cid":"c2"}]', 1, 1464590581, NULL),
(16, 16, 1, '1111', '', '[{"label":"1111","field_type":"singleMatrix","required":true,"field_options":{"rows":[{"label":"222"},{"label":"333"}],"cols":[{"label":"444"},{"label":"555"}]},"cid":"c2"}]', 1, 1464749053, NULL),
(17, 17, 1, '4444', '', '[{"label":"2222222","field_type":"singlePic","required":true,"field_options":{"options":[{"label":"111","checked":false,"uri":"http://dev.wecenter.com/uploads/wenjuan/20160606/14651801054170.jpg","thumb":"http://dev.wecenter.com/uploads/wenjuan/20160606/100_100/14651801054170.jpg"},{"label":"222","checked":false,"uri":"http://dev.wecenter.com/uploads/wenjuan/20160606/14651801073218.jpg","thumb":"http://dev.wecenter.com/uploads/wenjuan/20160606/100_100/14651801073218.jpg"}]},"cid":"c2"}]', 1, 1465180180, NULL),
(18, 18, 1, 'TTT', '', '[{"label":"TTTT","field_type":"mutiPic","required":true,"field_options":{"options":[{"label":"3333","checked":false,"uri":"http://dev.wecenter.com/uploads/wenjuan/20160606/14651802709161.jpg","thumb":"http://dev.wecenter.com/uploads/wenjuan/20160606/100_100/14651802709161.jpg"},{"label":"55555","checked":false,"uri":"http://dev.wecenter.com/uploads/wenjuan/20160606/14651802765061.jpg","thumb":"http://dev.wecenter.com/uploads/wenjuan/20160606/100_100/14651802765061.jpg"}]},"cid":"c2"}]', 1, 1465180288, NULL),
(19, 19, 1, 'test', '<p>111</p>', '[{"label":"111","field_type":"radio","required":true,"field_options":{"options":[{"label":"22","checked":false},{"label":"33","checked":false}]},"cid":"c2"}]', 1, 1465723707, 1465725187),
(20, 20, 1, '123', '', '[{"label":"111","field_type":"radio","required":true,"field_options":{"options":[{"label":"2222","checked":false},{"label":"3333","checked":false}]},"cid":"c2"}]', 1, 1465726774, 1465726953),
(21, 21, 1, 'ffff', '<p>aaaa</p>', '[{"label":"111","field_type":"radio","required":true,"field_options":{"options":[{"label":"ksdf","checked":false},{"label":"jjj","checked":false}]},"cid":"c2"}]', 1, 1465874396, 1465874473),
(22, 22, 1, '34234234', '<p>324324324324</p>', '[{"label":"324324","field_type":"radio","required":true,"field_options":{"options":[{"label":"2","checked":false},{"label":"22","checked":false}],"description":"324234234324"},"cid":"c2"}]', 1, 1465874700, 1465975829),
(23, 23, 1, '1111', '', '[{"label":"asfsdf","field_type":"radio","required":true,"field_options":{"options":[{"label":"11","checked":false},{"label":"22","checked":false}]},"cid":"c2"}]', 1, 1465975976, NULL),
(24, 24, 1, '222', '', '[{"label":"bbb","field_type":"radio","required":true,"field_options":{"options":[{"label":"cc","checked":false},{"label":"dd","checked":false}]},"cid":"c2"}]', 1, 1465976037, 1465976241);

-- --------------------------------------------------------

--
-- 表的结构 `aws_work_experience`
--

CREATE TABLE IF NOT EXISTS `aws_work_experience` (
  `work_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` int(11) DEFAULT NULL COMMENT '用户ID',
  `start_year` int(11) DEFAULT NULL COMMENT '开始年份',
  `end_year` int(11) DEFAULT NULL COMMENT '结束年月',
  `company_name` varchar(64) DEFAULT NULL COMMENT '公司名',
  `job_id` int(11) DEFAULT NULL COMMENT '职位ID',
  `add_time` int(10) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`work_id`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='工作经历' AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
