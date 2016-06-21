<?php

$config['debug'] = false;	// 网站 Debug 模式

// --------------------------  CONFIG TCLLOGIN  ------------------------- //
$config['tcllogin']['Open'] = 1; //是否使用TCL登陆系统
/*$config['tcllogin']['ServiceLoginURL'] = 'http://login.tcl.com/siam/login'; //登陆地址*/
/*$config['tcllogin']['ServiceLogoutURL'] = 'http://login.tcl.com/siam/logout'; //注销地址*/
$config['tcllogin']['ServiceLoginURL'] = 'http://siamsit.tcl.com/siam/login'; //登陆地址
$config['tcllogin']['ServiceLogoutURL'] = 'http://siamsit.tcl.com/siam/logout'; //注销地址
$config['tcllogin']['ProviderName'] = 'CE';

/*内网访问不需先登录 0 需要， 1 不需要*/
$config['inner_nologin'] = 1

/*https 开关 0为关，1为开*/;
$config['https_open'] = 0;

?>
