<?php
/*
+--------------------------------------------------------------------------
|   WeCenter [#RELEASE_VERSION#]
|   ========================================
|   by WeCenter Software
|   © 2011 - 2014 WeCenter. All Rights Reserved
|   http://www.wecenter.com
|   ========================================
|   Support: WeCenter@qq.com
|
+---------------------------------------------------------------------------
*/


if (!defined('IN_ANWSION'))
{
	die;
}

class find_password extends AWS_CONTROLLER
{

	public function get_access_rule()
	{
		$rule_action['rule_type'] = 'black'; //黑名单,黑名单中的检查  'white'白名单,白名单以外的检查
		$rule_action['actions'] = array();

		return $rule_action;
	}

	public function setup()
	{
		$this->crumb(AWS_APP::lang()->_t('设置密码'), '/account/find_password/');

		TPL::import_css('css/register.css');
	}

	public function index_action()
	{
        $id = intval($_GET['id'])?intval($_GET['id']) : 1;

        switch($id)
        {
            case 1:
                $msg = '找回密码';
                break;
            case 2:
                $msg = '验证邮箱';
                break;
            case 3:
                $msg = '通过邮箱进行密码初始化设置';
                break;
            default :
                $msg = '找回密码';
                break;
        }

        TPL::assign('msg',$msg);

        if($id == 2 OR $id == 3)
        {
            $email = AWS_APP::session()->verify_email;
            TPL::assign('email',$email);
        }

		TPL::output('account/find_password/index');
	}

	public function process_success_action()
	{
		TPL::assign('email', AWS_APP::session()->find_password);

		TPL::output('account/find_password/process_success');
	}

	public function modify_action()
	{
		if (is_mobile())
		{
			HTTP::redirect('/m/find_password_modify/?key=' . $_GET['key']);
		}

		if (!$active_code_row = $this->model('active')->get_active_code($_GET['key'], 'FIND_PASSWORD'))
		{
			H::redirect_msg(AWS_APP::lang()->_t('链接已失效'), '/');
		}

		if ($active_code_row['active_time'] OR $active_code_row['active_ip'])
		{
			H::redirect_msg(AWS_APP::lang()->_t('链接已失效'), '/');
		}

        TPL::import_js('js/md5.js');

        $uid = $this->model('active')->get_email_by_key(htmlspecialchars($_GET['key']));

        $user = $this->model('account')->get_user_info_by_uid($uid);

        TPL::assign('email',$user['email']);

		TPL::output('account/find_password/modify');
	}
}