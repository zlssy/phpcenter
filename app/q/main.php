<?php
/**
 * 调查问卷模块
 */
if (!defined('IN_ANWSION'))
{
    die;
}

class main extends AWS_CONTROLLER
{

    /**
     * 默认配置加载的资源文件
     */
    public function __construct(){
        parent::__construct();
        $this->base_url = base_url();
        if (get_setting('url_rewrite_enable') != 'Y'){
            $this->base_url .= '/'.rtrim(G_INDEX_SCRIPT, '/');
        }
    }

    public function get_access_rule(){
        $rule_action['rule_type'] = 'white'; //黑名单,黑名单中的检查  'white'白名单,白名单以外的检查
        $rule_action['actions'] = array(
            'index',
            'list',
            'show',
            'success'
        );
        return $rule_action;
    }

    public function index_action(){
        $this->list_action();
    }

    public function add_action(){
        $id = $_GET['sn'];
        $this->import_res();
        import_editor_static_files();
        TPL::assign('q_id', isset($id) ? $id : '');
        TPL::output('q/add');
    }

    public function edit_action(){
        $id = $_GET['id'];
        $this->import_res();
        import_editor_static_files();
        TPL::assign('q_id', isset($id) ? $id : '');
        TPL::output('q/add');
    }

    public function list_action(){
        TPL::import_css(array(
            'css/q/question.css'
        ));
        TPL::import_js(array(
            'js/questionnaire/lib.js',
            'js/questionnaire/list.js'
        ));
        TPL::assign('alllist', 1);
        TPL::output('q/list');
        echo $_GET['id'];
    }

    public function my_action(){
        TPL::import_css(array(
            'css/q/question.css'
        ));
        TPL::import_js(array(
            'js/questionnaire/lib.js',
            'js/questionnaire/list.js'
        ));
        TPL::assign('alllist', 0);
        TPL::output('q/list');
        echo $_GET['id'];
    }

    public function show_action(){
        TPL::import_css(array(
            'css/q/question.css'
        ));
        TPL::import_js(array(
            'js/questionnaire/lib.js',
            'js/questionnaire/show.js'
        ));
        TPL::assign('islogin', !!$this->user_id);
        TPL::output('q/show');
    }

    public function stat_action(){
        TPL::import_css(array(
            'css/q/question.css'
        ));
        TPL::import_js(array(
            'js/questionnaire/lib.js',
            'js/questionnaire/stat.js'
        ));
        TPL::output('q/stat');
    }

    public function share_action(){
        $id = $_GET['sn'];
        $id = isset($id) ? $id : $_GET['id'];
        TPL::import_css('css/questionnaire.css');
        TPL::import_js(array(
            'js/trd/ZeroClipboard.js',
            'js/trd/jquery.qrcode.min.js'
        ));
        TPL::assign('qid', $id);
        TPL::assign('base_url', $this->base_url);
        TPL::output('q/share');
    }

    public function success_action(){
        TPL::import_css(array(
            'css/q/question.css'
        ));
        TPL::output('q/success');
    }

    private function import_res(){
        TPL::import_css(array(
            'trd-css/datetimepicker.min.css',
            'css/vendor.css',
            'css/questionnaire.css'
        ));
        TPL::import_js(array(
            'js/trd/moment.min.js',
            'js/trd/datetimepicker.min.js',
            'js/trd/jquery-ui.custom.min.js',
            'js/trd/jquery.fileupload.js',
            'js/questionnaire/lib.js',
            'js/questionnaire/index.js'
        ));
    }
}
