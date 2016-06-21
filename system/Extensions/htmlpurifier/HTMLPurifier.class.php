<?php

require 'HTMLPurifier.includes.php';  
require 'HTMLPurifier.autoload.php';  

class WE_HTMLPurifier
{
	private $_config = null;

	private $_html_purifier = null;
		
	public function __construct()
	{
		$this->config = HTMLPurifier_Config::createDefault(); 
		
		$this->_setConfig();	//purify 默认配置
		
		$this->_html_purifier = new HTMLPurifier($this->config);
	}
	
	public function purify($html)
	{
		return $this->_html_purifier->purify($html);
	}

	private function _setConfig()
	{
		/*
		TODO setting
		$this->config->set('Code.Encoding', 'UTF-8');   
		$this->config->set('HTML.Doctype', 'XHTML 1.0 Transitional');
		*/
	}
}