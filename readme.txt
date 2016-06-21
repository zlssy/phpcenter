*** 安装引导 ***

1.需手动在当前目录创建 ./cache  ./uploads  ./tmp目录,并保证赋予其可读可写的权限;
2.创建utf-8编码(utf8_general_ci)的数据库 ce_center,  并导入./ce_center.sql文件数据;
3.复制 ./system/config/database.sample.php 文件为 ./system/config/database.php 并根据自己的环境配置相应参数
4.后台管理员账号/密码: admin  123456

再次测试一下git分支

*** 上线时记得清理以上信息 ***