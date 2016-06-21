<?php

$config['INVITE_REG'] = array(
	'subject' => "[#user_name#] 邀请您加入 [#site_name#]",
	'message' => "[#user_name#] 邀请您加入 [#site_name#]",
);

$config['VALID_EMAIL'] = array(
	'subject' => "[#site_name#] 邮箱验证",
	'message' => "这是您在 [#site_name#] 上的重要邮件, 功能是进行 [#site_name#] 帐户邮箱验证, 请点击下面的连接完成验证"
);

$config['FIND_PASSWORD'] = array(
	'subject' => "[#site_name#] 设置CE社区独立密码",
	'message' => "您在 [#site_name#] 提交了设置CE社区独立密码申请。<br />如果您没有提交该申请, 请忽略本邮件",
);

$config['QUESTION_INVITE'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 上邀请您回复帖子: [#question_title#]",
	'message' => "[#user_name#] 在 [#site_name#] 上邀请您回复帖子: [#question_title#]",
);

$config['FOLLOW_ME'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 上关注了你",
	'message' => "[#user_name#] 在 [#site_name#] 上关注了你",
	'link_title' => "查看 [#user_name#] 的个人主页",
);

$config['NEW_ANSWER'] = array(
	'subject' => "您在 [#site_name#] 上关注的帖子有了新的回复: [#question_title#]",
	'message' => "您在 [#site_name#] 上关注的帖子有了新的回复: [#question_title#]",
);

$config['NEW_MESSAGE'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 上给您发送了私信",
	'message' => "[#user_name#] 在 [#site_name#] 上给您发送了私信<br /><br />----- 私信内容 -----<br /><br />[#message#]<br /><br />",
);

$config['INVITE_QUESTION'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 上邀请您参与帖子 [#question_title#]",
	'message' => "[#user_name#] 在 [#site_name#] 上邀请您参与帖子 [#question_title#]",
	'link_title' => "[#question_title#]",
);

$config['QUESTION_SHARE'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 给你分享了一个帖子: [#question_title#]",
	'message' => "[#user_name#] 在 [#site_name#] 给你分享了一个帖子: [#question_title#]",
);

$config['ANSWER_SHARE'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 给你分享了一个帖子: [#question_title#]",
	'message' => "[#user_name#] 在 [#site_name#] 给你分享了一个帖子: [#question_title#] [#answer_user#]：[#answer_content#]",
);

$config['TOPIC_SHARE'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 给你分享了一个话题: [#topic_title#]",
	'message' => "[#user_name#] 在 [#site_name#] 给你分享了一个话题: [#topic_title#]",
);

$config['QUESTION_MOD'] = array(
	'subject' => "[#user_name#] 在 [#site_name#] 修改了你发布的帖子: [#question_title#]",
	'message' => "[#user_name#] 在 [#site_name#] 修改了你发布的帖子: [#question_title#]",
);

$config['QUESTION_DEL'] = array(
	'subject' => "您在 [#site_name#] 上发表的帖子 [#question_title#] 已被管理员删除",
	'message' => "您发表的帖子 [#question_title#] 已被管理员删除<br /><br />----- 所删除的内容 -----<br /><br />[#question_detail#]<br /><br />-----------------------------<br /><br />如有疑问, 请联系管理员",
);

$config['REGISTER_DECLINE'] = array(
	'subject' => "您在 [#site_name#] 的注册申请未通过审核",
	'message' => "您在 [#site_name#] 的注册申请未通过审核<br /><br />----- 原因 -----<br /><br />[#message#]<br /><br />-----------------------------<br /><br />如有疑问, 请联系管理员",
);
