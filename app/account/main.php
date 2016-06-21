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

class main extends AWS_CONTROLLER
{
	public function get_access_rule()
	{
		$rule_action['rule_type'] = 'black';

		$rule_action['actions'] = array(
			'complete_profile'
		);

		return $rule_action;
	}

	public function setup()
	{
		HTTP::no_cache_header();
	}

	public function index_action()
	{
		HTTP::redirect('/account/setting/');
	}

	public function captcha_action()
	{
		AWS_APP::captcha()->generate();
	}

	public function logout_action($return_url = null)
	{
		if ($_GET['return_url'])
		{
			$url = strip_tags(urldecode($_GET['return_url']));
		}
		else if (! $return_url)
		{
			$url = '/';
		}
		else
		{
			$url = $return_url;
		}

		if ($_GET['key'] != md5(session_id()))
		{
			H::redirect_msg(AWS_APP::lang()->_t('正在准备退出, 请稍候...'), '/account/logout/?return_url=' . urlencode($url) . '&key=' . md5(session_id()));
		}

		$this->model('account')->logout();

		$this->model('admin')->admin_logout();

		if (get_setting('ucenter_enabled') == 'Y')
		{
			if ($uc_uid = $this->model('ucenter')->is_uc_user($this->user_info['email']))
			{
				$sync_code = $this->model('ucenter')->sync_logout($uc_uid);
			}

			H::redirect_msg(AWS_APP::lang()->_t('您已退出站点, 现在将以游客身份进入站点, 请稍候...') . $sync_code, $url);
		}
		else
		{
			HTTP::redirect($url);
		}
	}

	public function login_action()
	{

		$url = base64_decode($_GET['url']);

		if ($this->user_id)
		{
			if ($url)
			{
				header('Location: ' . $url);
			}
			else
			{
				HTTP::redirect('/');
			}
		}
        else
        {
            AWS_APP::mustHttps();
        }

		if (is_mobile())
		{
			HTTP::redirect('/m/login/url-' . $_GET['url']);
		}

		$this->crumb(AWS_APP::lang()->_t('登录'), '/account/login/');

		TPL::import_css(array('css/login.css','css/emailAutoComplete.css'));

		// md5 password...

		TPL::import_js(array('js/md5.js','js/emailAutoComplete.js' ));
		
		if ($_GET['url'])
		{
			$return_url = htmlspecialchars(base64_decode($_GET['url']));
		}
		else
		{
			$return_url = htmlspecialchars($_SERVER['HTTP_REFERER']);
		}

		TPL::assign('return_url', $return_url);

		TPL::output("account/login");
	}

    public function newlogin_action(){

        $tcl = AWS_APP::config()->get('system')->tcllogin;

        if($tcl['Open'] == 0 )
        {
            HTTP::redirect('/');
        }
        $url = base64_decode($_GET['url']);

        if ($this->user_id)
        {
            if ($url)
            {
                header('Location: ' . $url);
            }
            else
            {
                HTTP::redirect('/');
            }
        }

        $tcl = AWS_APP::config()->get('system')->tcllogin;

        $saml = new saml_class();

        $saml_msg = $saml->getSAML($tcl);

        if($url)
        {
            $RelayState = $url;
        }
        else
        {
            $RelayState = '/';
        }

        TPL::assign('SAMLRequest', $saml_msg);
        TPL::assign('ServiceLoginURL', $tcl['ServiceLoginURL']);
        TPL::assign('RelayState', $RelayState);

        TPL::output('account/newlogin');

    }

    public function saml_action(){

        if(AWS_APP::config()->get('system')->tcllogin['Open'] == 0 OR $this->user_id){
            HTTP::redirect('/');
        }

         $responseStr =  $_POST['SAMLResponse'];
         $refer_url =  $_POST['RelayState'];

        if($responseStr && $refer_url){
            $saml = new saml_class();

            $verify = $saml->validate($responseStr);

            if($verify==1)
            {
                $xmldoc = new DOMDocument();
                $xmldoc->loadXML($responseStr);
                $nameID = $xmldoc->getElementsByTagName('NameID')->item(0)->nodeValue;

                $_POST['user_name'] = htmlspecialchars($nameID);
                $_POST['password'] = '123456';
                $_POST['email'] = $_POST['user_name'].'@tcl.com';
                $_POST['return_url'] = $refer_url;

                $is_username = $this->model('account')->check_username($_POST['user_name']);

                if($is_username)
                {
                    $result= $saml->do_login($_POST['user_name'],  $_POST['password'],$_POST['_is_mobile'], $_POST['return_url']);
                }
                else
                {
                    $result = $saml->do_register($_POST['user_name'],  $_POST['email'], $_POST['password'],$_POST['_is_mobile'], $_POST['return_url']);
                }

                if($result['status']==1)
                {
                    if(empty($result['url']))
                    {
                        $result['url'] = $refer_url;
                    }

                    header('Location: ' . $result['url']);
                }

            }
            else
            {
                $result['msg'] = '签名校验失败';
            }
        }else{
            $result['msg'] = '参数来源错误或没有参数！';
        }

        echo $result['msg'];

    }


	public function weixin_login_action()
	{
		if ($this->user_id OR !get_setting('weixin_app_id') OR !get_setting('weixin_app_secret') OR get_setting('weixin_account_role') != 'service')
		{
			HTTP::redirect('/');
		}

		$this->crumb(AWS_APP::lang()->_t('微信登录'), '/account/weixin_login/');

		TPL::output('account/weixin_login');
	}

	public function register_action()
	{
		if (is_mobile() AND !$_GET['ignore_ua_check'])
		{
			HTTP::redirect('/m/register/?email=' . $_GET['email'] . '&icode=' . $_GET['icode']);
		}

		if (get_setting('register_type') == 'close')
		{
			H::redirect_msg(AWS_APP::lang()->_t('本站目前关闭注册'), '/');
		}
		else if (get_setting('register_type') == 'invite' AND !$_GET['icode'])
		{
			if (get_setting('weixin_app_id') AND get_setting('weixin_account_role') == 'service')
			{
				HTTP::redirect('/account/weixin_login/command-REGISTER');
			}

			H::redirect_msg(AWS_APP::lang()->_t('本站只接受邀请注册'), '/');
		}
		else if (get_setting('register_type') == 'weixin')
		{
			H::redirect_msg(AWS_APP::lang()->_t('本站只能通过微信注册'), '/');
		}

		if ($_GET['icode'])
		{
			if ($this->model('invitation')->check_code_available($_GET['icode']))
			{
				TPL::assign('icode', $_GET['icode']);
			}
			else
			{
				H::redirect_msg(AWS_APP::lang()->_t('邀请码无效或已经使用, 请使用新的邀请码'), '/');
			}
		}

		if ($this->user_id)
		{
			HTTP::redirect('/');
		}

		$this->crumb(AWS_APP::lang()->_t('注册'), '/account/register/');

		TPL::assign('job_list', $this->model('work')->get_jobs_list());

		TPL::import_css('css/register.css');

		TPL::output('account/register');
	}

	public function sync_login_action()
	{
		if (get_setting('ucenter_enabled') == 'Y')
		{
			if ($uc_uid = $this->model('ucenter')->is_uc_user($this->user_info['email']))
			{
				$sync_code = $this->model('ucenter')->sync_login($uc_uid);
			}
		}

		if ($_GET['url'])
		{
			$url = base64_decode($_GET['url']);
		}

		$base_url = base_url();

		if (!$url OR strstr($url, '://') AND substr($url, 0, strlen($base_url)) != $base_url)
		{
			$url = '/';
		}

		H::redirect_msg(AWS_APP::lang()->_t('欢迎回来: %s , 正在带您进入站点...', $this->user_info['user_name']) . $sync_code, $url);
	}

	public function valid_email_action()
	{
		if (!AWS_APP::session()->valid_email)
		{
			HTTP::redirect('/');
		}

		if (!$user_info = $this->model('account')->get_user_info_by_email(AWS_APP::session()->valid_email))
		{
			HTTP::redirect('/');
		}

		if ($user_info['valid_email'])
		{
			H::redirect_msg(AWS_APP::lang()->_t('邮箱已通过验证，请返回登录'), '/account/login/');
		}

		$this->crumb(AWS_APP::lang()->_t('邮件验证'), '/account/valid_email/');

		TPL::import_css('css/register.css');

		TPL::assign('email', AWS_APP::session()->valid_email);

		TPL::output("account/valid_email");
	}

	public function valid_email_active_action()
	{
		if (!$active_code_row = $this->model('active')->get_active_code($_GET['key'], 'VALID_EMAIL'))
		{
			H::redirect_msg(AWS_APP::lang()->_t('链接已失效, 请使用最新的验证链接'), '/');
		}

		if ($active_code_row['active_time'] OR $active_code_row['active_ip'])
		{
			H::redirect_msg(AWS_APP::lang()->_t('邮箱已通过验证, 请返回登录'), '/account/login/');
		}

		$users = $this->model('account')->get_user_info_by_uid($active_code_row['uid']);

		if ($users['valid_email'])
		{
			H::redirect_msg(AWS_APP::lang()->_t('帐户已激活, 请返回登录'), '/account/login/');
		}

		$this->crumb(AWS_APP::lang()->_t('邮件验证'), '/account/valid_email/');

		TPL::assign('active_code', $_GET['key']);

		TPL::assign('email', $users['email']);

		TPL::import_css('css/register.css');

		TPL::output('account/valid_email_active');
	}

	public function complete_profile_action()
	{
		if ($this->user_info['email'])
		{
			HTTP::redirect('/');
		}

		TPL::import_css('css/register.css');

		TPL::output('account/complete_profile');
	}

	public function valid_approval_action()
	{
		if ($this->user_id AND $this->user_info['group_id'] != 3)
		{
			HTTP::redirect('/');
		}

		TPL::import_css('css/register.css');

		TPL::output('account/valid_approval');
	}
}