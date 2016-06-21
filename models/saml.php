<?php
/**
 * Created by PhpStorm.
 * User: 李冬云
 * Date: 2016/5/3
 * Time: 15:30
 */

if (!defined('IN_ANWSION'))
{
    die;
}

class saml_class extends  AWS_MODEL {

    //生成40位随机字符串
    public function getRandChar($length){
        $str = null;
        $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        $max = strlen($strPol)-1;
        for($i=0;$i<$length;$i++){
            $str.=$strPol[rand(0,$max)];
        }
        return $str;
    }

    //SAML明文编码
    public function encoding($str){
        $zstr = gzdeflate($str);
        $res = base64_encode($zstr);
        return $res;
    }

    /*  生成明文 */
    public function getSAML($tcl_arr){
        $tcl = $tcl_arr;
        if(!$tcl['Open']) return '';
        $ID = $this->getRandChar(40);
        $IssueInstant = date("Y-m-d")."T".date("H:i:s")."Z";
        $ProviderName = $tcl['ProviderName'];
        $AssertionConsumerServiceURL = get_js_url('/account/saml/');
        $saml = '<?xml version="1.0" encoding="UTF-8"?><samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="'.$ID.'" Version="2.0" IssueInstant="'.$IssueInstant.'" ProtocolBinding="urn:oasis:names.tc:SAML:2.0:bindings:HTTP-Redirect" ProviderName="'.$ProviderName.'" AssertionConsumerServiceURL="'.$AssertionConsumerServiceURL.'"/>';
        $SAMLRequest = $this->encoding($saml);  //SAML明文编码
        return $SAMLRequest;
    }

    /* 单点登录 --注册 */
    public function do_register( $username, $email, $password,$_is_mobile='',$return_url='' ){

        if (trim($username) == '')
        {
            return  array('status' => -1, 'msg' => AWS_APP::lang()->_t('请输入用户名'));
        }
        else if ($check_rs = $this->model('account')->check_username_char($username))
        {
            return  array('status' => -1, 'msg' => AWS_APP::lang()->_t('用户名包含无效字符'));
        }
        else if ($this->model('account')->check_username_sensitive_words($username) OR trim($username) != $username)
        {
            return  array('status' => -1, 'msg' => AWS_APP::lang()->_t('用户名中包含敏感词或系统保留字'));
        }

        if ($this->model('account')->check_email($email))
        {
            return  array('status' => -1, 'msg' => AWS_APP::lang()->_t('E-Mail 已经被使用, 或格式不正确'));
        }

        $change_pwd_flag = 1;
        $uid = $this->model('account')->user_register($username, $password, $email, $change_pwd_flag);

        $this->model('account')->setcookie_logout();
        $this->model('account')->setsession_logout();

        if (get_setting('register_valid_type') == 'N' OR (get_setting('register_valid_type') == 'email' AND get_setting('register_type') == 'invite'))
        {
            $this->model('active')->active_user_by_uid($uid);
        }

        $user_info = $this->model('account')->get_user_info_by_uid($uid);

        if (get_setting('register_valid_type') == 'N' OR $user_info['group_id'] != 3 )
        {
            $this->model('account')->setcookie_login($user_info['uid'], $user_info['user_name'], $user_info['password'], $user_info['salt'],null,false);

            if (!$_is_mobile)
            {
                return  array('status' => 1, 'url' => get_js_url('/home/first_login-TRUE'));
            }
        }
        else
        {
            AWS_APP::session()->valid_email = $user_info['email'];

            $this->model('active')->new_valid_email($uid);

            if (!$_is_mobile)
            {
                return  array('status' => 1, 'url' => get_js_url('/account/valid_email/'));
            }
        }

        if ($_is_mobile)
        {
            $this->model('account')->setcookie_login($user_info['uid'], $user_info['user_name'], $user_info['password'], $user_info['salt'],null,false);

            if ($return_url)
            {
                $return_url = strip_tags($return_url);
            }
            else
            {
                $return_url = get_js_url('/m/');
            }

            return  array('status' => 1, 'url' => $return_url);

        }
    }

    /* 单点登录 --登录 */
    public function do_login( $username, $password,$_is_mobile='',$return_url='' )
    {

        $user_info =  $this->model('account')->get_user_info_by_username($username);

        if (! $user_info)
        {
            return array('status' => -1, 'msg' => AWS_APP::lang()->_t('请输入正确的帐号或密码'));
        }
        else
        {
            if ($user_info['forbidden'] == 1)
            {
                return array('status' => -1, 'msg' =>  AWS_APP::lang()->_t('抱歉, 你的账号已经被禁止登录'));
            }

            if (get_setting('site_close') == 'Y' AND $user_info['group_id'] != 1)
            {
                return array('status' => -1, 'msg' =>  get_setting('close_notice'));
            }

            if (get_setting('register_valid_type') == 'approval' AND $user_info['group_id'] == 3)
            {
                $url = get_js_url('/account/valid_approval/');
            }
            else
            {
                $this->model('account')->setsession_logout();
                $this->model('account')->setcookie_logout();
                $this->model('account')->update_user_last_login($user_info['uid']);

                $this->model('account')->setcookie_login($user_info['uid'], $username, $user_info['password'], $user_info['salt'], null,false);

                if (get_setting('register_valid_type') == 'email' AND !$user_info['valid_email'])
                {
                    AWS_APP::session()->valid_email = $user_info['email'];

                    $url = get_js_url('/account/valid_email/');
                }
                else if ($user_info['is_first_login'] AND !$_is_mobile)
                {
                    $url = get_js_url('/home/first_login-TRUE');
                }
                else if ($return_url AND !strstr($return_url, '/logout') AND
                    ($_is_mobile AND strstr($return_url, '/m/') OR
                        strstr($return_url, '://') AND strstr($return_url, base_url())))
                {
                    $url = get_js_url($return_url);
                }
                else if ($_is_mobile)
                {
                    $url = get_js_url('/m/');
                }

                if (get_setting('ucenter_enabled') == 'Y')
                {
                    $sync_url = get_js_url('/account/sync_login/');

                    $url = ($url) ? $sync_url . 'url-' . base64_encode($url) : $sync_url;
                }
            }

            return array('status' => 1, 'url' =>  $url);

        }
    }

    //签名校验
    public function validate($responseStr){

        require(AWS_PATH.'/Extensions/xmldsig/XmlDSig.php');

        $adapter = new \FR3D\XmlDSig\Adapter\XmlseclibsAdapter();

        $adapter->setPublicKey(file_get_contents(AWS_PATH.'/Extensions/xmldsig/x509.pem'));

        $data = new DOMDocument();

        $data->loadXML($responseStr);

        return $adapter->verify($data);
    }


}
