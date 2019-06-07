/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50714
Source Host           : localhost:3306
Source Database       : db_oui

Target Server Type    : MYSQL
Target Server Version : 50714
File Encoding         : 65001

Date: 2019-04-15 10:09:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tb_admin
-- ----------------------------
DROP TABLE IF EXISTS `tb_admin`;
CREATE TABLE `tb_admin` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '管理员编号',
  `user` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '管理员用户名',
  `password` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '管理员密码',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_admin
-- ----------------------------
INSERT INTO `tb_admin` VALUES ('1', 'katsuki', '123');

-- ----------------------------
-- Table structure for tb_category
-- ----------------------------
DROP TABLE IF EXISTS `tb_category`;
CREATE TABLE `tb_category` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '分类编号',
  `name` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名称',
  `sort` int(10) NOT NULL DEFAULT '99' COMMENT '排序（越小越靠前）',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_category
-- ----------------------------
INSERT INTO `tb_category` VALUES ('1', '演唱会', '1');
INSERT INTO `tb_category` VALUES ('2', '话剧歌剧', '2');
INSERT INTO `tb_category` VALUES ('3', '体育赛事', '3');
INSERT INTO `tb_category` VALUES ('4', '儿童亲子', '4');
INSERT INTO `tb_category` VALUES ('5', '度假休闲', '5');
INSERT INTO `tb_category` VALUES ('6', '音乐会', '6');
INSERT INTO `tb_category` VALUES ('7', '曲苑杂坛', '7');
INSERT INTO `tb_category` VALUES ('8', '舞蹈芭蕾', '8');
INSERT INTO `tb_category` VALUES ('9', '动漫', '9');
INSERT INTO `tb_category` VALUES ('10', '展览', '10');
INSERT INTO `tb_category` VALUES ('11', '见面会', '99');

-- ----------------------------
-- Table structure for tb_city
-- ----------------------------
DROP TABLE IF EXISTS `tb_city`;
CREATE TABLE `tb_city` (
  `code` int(6) NOT NULL COMMENT '城市编码',
  `name` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '城市名称',
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_city
-- ----------------------------
INSERT INTO `tb_city` VALUES ('440100', '广州市');
INSERT INTO `tb_city` VALUES ('440200', '韶关市');
INSERT INTO `tb_city` VALUES ('440400', '珠海市');
INSERT INTO `tb_city` VALUES ('430100', '长沙市');
INSERT INTO `tb_city` VALUES ('430800', '张家界市');
INSERT INTO `tb_city` VALUES ('610400', '咸阳市');
INSERT INTO `tb_city` VALUES ('211400', '葫芦岛市');
INSERT INTO `tb_city` VALUES ('320100', '南京市');
INSERT INTO `tb_city` VALUES ('340300', '蚌阜市');
INSERT INTO `tb_city` VALUES ('340600', '淮北市');
INSERT INTO `tb_city` VALUES ('220200', '吉林市');
INSERT INTO `tb_city` VALUES ('210300', '鞍山市');
INSERT INTO `tb_city` VALUES ('140100', '太原市');
INSERT INTO `tb_city` VALUES ('130100', '石家庄市');
INSERT INTO `tb_city` VALUES ('211000', '辽阳市');
INSERT INTO `tb_city` VALUES ('320300', '徐州市');
INSERT INTO `tb_city` VALUES ('320600', '南通市');
INSERT INTO `tb_city` VALUES ('360700', '赣州市');
INSERT INTO `tb_city` VALUES ('370200', '青岛市');
INSERT INTO `tb_city` VALUES ('420800', '荆门市');
INSERT INTO `tb_city` VALUES ('440300', '深圳市');
INSERT INTO `tb_city` VALUES ('440600', '佛山市');
INSERT INTO `tb_city` VALUES ('510100', '成都市');
INSERT INTO `tb_city` VALUES ('310100', '上海市');
INSERT INTO `tb_city` VALUES ('110000', '北京市');
INSERT INTO `tb_city` VALUES ('666666', '天津');

-- ----------------------------
-- Table structure for tb_order
-- ----------------------------
DROP TABLE IF EXISTS `tb_order`;
CREATE TABLE `tb_order` (
  `id` bigint(10) NOT NULL AUTO_INCREMENT COMMENT '订单编号',
  `l_id` bigint(13) NOT NULL COMMENT '订单流水号（生成13位随机数）',
  `status` varchar(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '订单状态（0已完成 1已取消 2未支付 3已支付 ）',
  `u_id` int(10) NOT NULL COMMENT '会员编号',
  `img` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '订单演出图片',
  `title` varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '订单演出标题',
  `date` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '订单演出日期',
  `place` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT '订单演出场馆',
  `price` int(6) NOT NULL COMMENT '订单价格',
  `num` int(2) NOT NULL COMMENT '订单票数',
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收票人姓名',
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收票人电话',
  `address` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT '收票人地址',
  `way` varchar(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '取票方式（0二维码票 1快递票 2自取票）',
  `confirm` varchar(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0' COMMENT '订单信息确认（0未确认 1已确认）',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_order
-- ----------------------------
INSERT INTO `tb_order` VALUES ('1', '6961982303227', '3', '1', 'http://localhost:8080/OuiSystem/img/dm7.jpg', '上海·NANA MIZUKI LIVE ISLAND 2018+', '2018-10-13 18:00', '上海证大喜玛拉雅艺术中心大观舞台', '3040', '3', '江俊隆', '13766666666', '', '0', '1');
INSERT INTO `tb_order` VALUES ('3', '9935427510713', '2', '1', 'http://localhost:8080/OuiSystem/img/hj2.jpg', '东野圭吾虐心悬疑舞台剧 《虚无的十字架》锦辉传播出品', '2019-05-16 19:00', '人民大舞台', '920', '6', '江俊隆', '13655555555', '广东省珠海市XX街道XX栋XX房', '1', '0');
INSERT INTO `tb_order` VALUES ('4', '6572358222422', '2', '3', 'http://localhost:8080/OuiSystem/img/0b453da2-17ba-488e-bdbd-0fb6e7199654.jpg', '广州·花泽香菜2019巡回演唱会', '2019-04-12 19:30', '广州体育馆白云大道南783号', '1960', '2', '江俊隆', '13533333333', '', '0', '0');
INSERT INTO `tb_order` VALUES ('5', '2514623865023', '3', '3', 'http://localhost:8080/OuiSystem/img/ych1.jpg', '北京·2019陈绮贞20周年－「漫漫长夜 Cheer 20」北京演唱会', '2019-06-22 19:00', '北京凯迪拉克中心', '2597', '3', '江俊隆', '13577777777', '', '0', '0');
INSERT INTO `tb_order` VALUES ('6', '8530897278354', '3', '1', 'http://localhost:8080/OuiSystem/img/0b453da2-17ba-488e-bdbd-0fb6e7199654.jpg', '广州·花泽香菜2019巡回演唱会', '2019-04-12 19:30', '广州体育馆白云大道南783号', '1080', '1', '江俊隆', '13655555555', '广东省珠海市XX街道XX栋XX房', '1', '0');

-- ----------------------------
-- Table structure for tb_show
-- ----------------------------
DROP TABLE IF EXISTS `tb_show`;
CREATE TABLE `tb_show` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '演出id',
  `title` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT '演出标题',
  `time` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT '演出时间段 ‘2018/10.13-10.14 18:00-21:40’',
  `place` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT '演出场馆',
  `img` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '演出宣传图',
  `city` varchar(16) CHARACTER SET utf8 NOT NULL COMMENT '演出城市',
  `category` varchar(16) CHARACTER SET utf8 NOT NULL COMMENT '演出分类',
  `status` varchar(1) CHARACTER SET utf8 NOT NULL DEFAULT '0' COMMENT '上架状态（0上架 1下架）',
  `price` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '所有价格 格式 ''880,980,1080''',
  `first_play_date` varchar(10) CHARACTER SET utf8 NOT NULL COMMENT '第一场场次日期 来源time如 2018.10.13 用于时间排序',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_show
-- ----------------------------
INSERT INTO `tb_show` VALUES ('1', '上海·NANA MIZUKI LIVE ISLAND 2018+', '2018/10.13-10.14,18:00-21:40', '上海证大喜玛拉雅艺术中心大观舞台', 'http://localhost:8080/OuiSystem/img/dm7.jpg', '上海市', '动漫', '0', '880,1280', '2018.10.13');
INSERT INTO `tb_show` VALUES ('2', '珠海·2019年珠港澳国际电玩动漫展', '2018/12.31-2019/01.01,10:00-17:00', '珠海市香洲区银湾路十字门国际会展中心', 'http://localhost:8080/OuiSystem/img/dm1.jpg', '珠海市', '动漫', '0', '50', '2018.12.31');
INSERT INTO `tb_show` VALUES ('3', '广州·《四月是你的谎言》——“公生”与“薰”的钢琴小提琴唯美经典音乐集', '2018/12.01,19:30-21:30', '广州市人民会堂', 'http://localhost:8080/OuiSystem/img/dm2.jpg', '广州市', '动漫', '0', '180,280,380', '2018.12.01');
INSERT INTO `tb_show` VALUES ('4', '深圳·第四届漫行社动漫嘉年华', '2019/01.01,10:00-17:00', '深圳F518时尚创意园21主街道', 'http://localhost:8080/OuiSystem/img/dm3.jpg', '深圳市', '动漫', '0', '40', '2019.01.01');
INSERT INTO `tb_show` VALUES ('5', '成都·Xi-Comic动漫嘉年华', '2018/12.30-12.31,09:30-17:00', '西村大院贝森北路1号', 'http://localhost:8080/OuiSystem/img/dm4.jpg', '成都市', '动漫', '0', '70', '2018.12.30');
INSERT INTO `tb_show` VALUES ('6', '蚌埠·蚌埠喵KU祭NO.08', '2018/12.30,09:00-16:00', '蚌山区罗曼里宴会', 'http://localhost:8080/OuiSystem/img/dm5.jpg', '蚌阜市', '动漫', '0', '45', '2018.12.30');
INSERT INTO `tb_show` VALUES ('7', '北京·石川绫子小提琴动漫音乐会', '2019/01.16,19:30-21:30', '西城区北新华街1号北京音乐厅', 'http://localhost:8080/OuiSystem/img/dm6.jpg', '北京市', '动漫', '0', '180,380,580,880', '2019.01.16');
INSERT INTO `tb_show` VALUES ('8', '北京·2019陈绮贞20周年－「漫漫长夜 Cheer 20」北京演唱会', '2019/06.22,19:00', '北京凯迪拉克中心', 'http://localhost:8080/OuiSystem/img/ych1.jpg', '北京市', '演唱会', '0', '399,599,699,1599', '2019.06.22');
INSERT INTO `tb_show` VALUES ('9', '上海·“动漫原声带”新海诚电影作品视听音乐会', '2019/03.22,19:30', '上海东方艺术中心音乐厅', 'http://localhost:8080/OuiSystem/img/dm8.jpg', '上海市', '动漫', '0', '180,380,580', '2019.03.22');
INSERT INTO `tb_show` VALUES ('10', '2019咪咕音乐现场许嵩“1直在1起”深圳粉丝见面会', '2019/05.11,18:30', '深圳蛇口风华大剧院', 'http://localhost:8080/OuiSystem/img/ych2.jpg', '深圳市', '演唱会', '0', '280,480,680', '2019.05.11');
INSERT INTO `tb_show` VALUES ('11', '新裤子乐队“新浪潮”2019工体演唱会', '2019/03.23,19:00', '北京工人体育馆', 'http://localhost:8080/OuiSystem/img/ych3.jpg', '北京市', '演唱会', '0', '180,380', '2019.03.23');
INSERT INTO `tb_show` VALUES ('12', 'MØ 2019巡演北京站', '2019/04.09,19:00', '糖果TANGO雍和宫店三层', 'http://localhost:8080/OuiSystem/img/ych4.jpg', '北京市', '演唱会', '0', '380,680,980', '2019.04.09');
INSERT INTO `tb_show` VALUES ('14', '2019张杰【未·LIVE】 巡回演唱会-佛山站', '2019/03.16,19:00', '佛山世纪莲体育中心', 'http://localhost:8080/OuiSystem/img/ych5.jpg', '佛山市', '演唱会', '0', '280,480,680,980,1280', '2019.03.16');
INSERT INTO `tb_show` VALUES ('13', '2019张信哲“未来式”世界巡回演唱会南京站', '2019/04.27,19:00', '南京青奥体育公园体育馆', 'http://localhost:8080/OuiSystem/img/ych6.jpg', '南京市', '演唱会', '0', '380,580,780,980,1280,1680', '2019.04.27');
INSERT INTO `tb_show` VALUES ('15', '【万有音乐系】Sunrise Tour 苏菲 · 珊曼妮2019巡回演唱会', '2019/05.26,19:00', '湖南音乐厅', 'http://localhost:8080/OuiSystem/img/ych7.jpg', '长沙市', '演唱会', '0', '180,280,380,580', '2019.05.26');
INSERT INTO `tb_show` VALUES ('16', '东野圭吾《信》音乐剧中文版', '2019/04.18-04.21,19:00', '云峰剧院', 'http://localhost:8080/OuiSystem/img/hj1.jpg', '上海市', '话剧歌剧', '0', '100,200,600', '2019.04.18');
INSERT INTO `tb_show` VALUES ('17', '东野圭吾虐心悬疑舞台剧 《虚无的十字架》锦辉传播出品', '2019/05.16-05.19,19:00', '人民大舞台', 'http://localhost:8080/OuiSystem/img/hj2.jpg', '上海市', '话剧歌剧', '0', '80,200,280', '2019.05.16');
INSERT INTO `tb_show` VALUES ('18', '许鞍华x张爱玲x王安忆x焦媛舞台力作《金锁记》', '2019/06.15-06.16,19:30', '广州友谊剧院', 'http://localhost:8080/OuiSystem/img/hj3.jpg', '广州市', '话剧歌剧', '0', '199,299,399', '2019.06.15');
INSERT INTO `tb_show` VALUES ('19', '开心麻花爆笑舞台剧《李茶的姑妈》第8轮-成都', '2019/04.19-04.21,19:30', '四川歌舞大剧院', 'http://localhost:8080/OuiSystem/img/hj4.jpg', '成都市', '话剧歌剧', '0', '100,180,280,380,580,880', '2019.04.19');
INSERT INTO `tb_show` VALUES ('20', '家庭音乐剧《素敵小魔女》-青岛站', '2019/03.02-03.03,19:30', '青岛大剧院', 'http://localhost:8080/OuiSystem/img/hj5.jpg', '青岛市', '话剧歌剧', '0', '80,180,280,380,480', '2019.03.02');
INSERT INTO `tb_show` VALUES ('21', '开心麻花爆笑舞台剧《二维码杀手》-太原', '2019/04.09,19:30', '山西大剧院', 'http://localhost:8080/OuiSystem/img/hj6.jpg', '太原市', '话剧歌剧', '0', '80,180,280,380,580,680', '2019.04.09');
INSERT INTO `tb_show` VALUES ('22', '格林童话经典音乐剧《睡美人》--荆门站', '2019/03.02,10:30', '荆门剧院', 'http://localhost:8080/OuiSystem/img/hj7.jpg', '荆门市', '话剧歌剧', '0', '50,80,110,150', '2019.03.02');
INSERT INTO `tb_show` VALUES ('23', '2019赛季中超联赛上海绿地申花主场赛事联票', '2019/03.01-12.01', '虹口足球场', 'http://localhost:8080/OuiSystem/img/ty1.jpg', '上海市', '体育赛事', '0', '2480,3280', '2019.03.01');
INSERT INTO `tb_show` VALUES ('24', '《守望先锋联赛》2.22线下粉丝互动会-广州站', '2019/02.22,10:30', '中影国际影城太阳新天地店', 'http://localhost:8080/OuiSystem/img/ty2.jpg', '广州市', '体育赛事', '0', '50', '2019.02.22');
INSERT INTO `tb_show` VALUES ('25', 'FAST4WARD/CDRC中国直线竞速竞标赛总决赛', '2019/03.03,10:30', '上汽国际赛车场(上海国际赛车场)', 'http://localhost:8080/OuiSystem/img/ty3.jpg', '上海市', '体育赛事', '0', '68,888', '2019.03.03');
INSERT INTO `tb_show` VALUES ('26', '深圳·2019年国际篮联篮球世界杯32强抽签仪式', '2019/03.16,10:00', '华润深圳湾体育中心“春茧”体育馆', 'http://localhost:8080/OuiSystem/img/ty4.jpg', '深圳市', '体育赛事', '0', '280,480,680,1080', '2019.03.16');
INSERT INTO `tb_show` VALUES ('27', '2019中超联赛第1轮 江苏苏宁易购 VS 天津泰达', '2019/03.03,10:30', '南京奥体中心体育场', 'http://localhost:8080/OuiSystem/img/ty5.jpg', '南京市', '体育赛事', '0', '100,200', '2019.03.03');
INSERT INTO `tb_show` VALUES ('28', '太原·2019世界职业角斗士娱乐风云争霸赛', '2019/03.23,19:00', '山西综改示范区体育馆', 'http://localhost:8080/OuiSystem/img/ty6.jpg', '太原市', '体育赛事', '0', '180,280,380,580,880,1280,1880', '2019.03.23');
INSERT INTO `tb_show` VALUES ('29', '上海·《东方有摔角》—OWE国际功夫摔角格斗秀', '2019/02.24,19:00', '长江剧场', 'http://localhost:8080/OuiSystem/img/ty7.jpg', '上海市', '体育赛事', '0', '188,288,588', '2019.02.24');
INSERT INTO `tb_show` VALUES ('30', '广州·花泽香菜2019巡回演唱会', '2019/04.12,19:30-21:30', '广州体育馆白云大道南783号', 'http://localhost:8080/OuiSystem/img/0b453da2-17ba-488e-bdbd-0fb6e7199654.jpg', '广州市', '演唱会', '0', '380,680,880,1080', '2019.04.12');

-- ----------------------------
-- Table structure for tb_user_address
-- ----------------------------
DROP TABLE IF EXISTS `tb_user_address`;
CREATE TABLE `tb_user_address` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '用户地址编号',
  `user_id` int(10) NOT NULL COMMENT '用户id ',
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '姓名',
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '电话',
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '地址详情',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_user_address
-- ----------------------------
INSERT INTO `tb_user_address` VALUES ('3', '1', '江俊隆', '13655555555', '广东省珠海市XX街道XX栋XX房');

-- ----------------------------
-- Table structure for tb_user_info
-- ----------------------------
DROP TABLE IF EXISTS `tb_user_info`;
CREATE TABLE `tb_user_info` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '用户信息编号',
  `user_id` int(10) NOT NULL COMMENT '用户id ',
  `nickname` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT '用户昵称',
  `gender` varchar(2) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT '用户性别',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_user_info
-- ----------------------------
INSERT INTO `tb_user_info` VALUES ('1', '3', 'katsuki', '女');
INSERT INTO `tb_user_info` VALUES ('2', '1', 'katsukichan', '女');
INSERT INTO `tb_user_info` VALUES ('3', '2', '', '');

-- ----------------------------
-- Table structure for tb_user_login
-- ----------------------------
DROP TABLE IF EXISTS `tb_user_login`;
CREATE TABLE `tb_user_login` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `login_phone` varchar(11) CHARACTER SET utf8 NOT NULL COMMENT '登录手机号',
  `password` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT '用户登录密码',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb_user_login
-- ----------------------------
INSERT INTO `tb_user_login` VALUES ('1', '13644444444', 'jiang233');
INSERT INTO `tb_user_login` VALUES ('2', '13688888888', 'jjl123');
INSERT INTO `tb_user_login` VALUES ('3', '13588888888', 'jjl233');
SET FOREIGN_KEY_CHECKS=1;
