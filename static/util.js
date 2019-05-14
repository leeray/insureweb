import axios from 'axios';
const ajaxUrl = ''; //'http://localhost:8011'; //发布时改完空

var util = {
	index: '/customerrecommend/queryindex', //首页数据
	uploadexcel: '/customerrecommend/uploadexcel', //文件上传
	query: '/customerrecommend/query', //筛选查询
	historylist: '/customerrecommend/historylist', //历史记录
	historydata: '/customerrecommend/historydata', //历史记录详情
	pushdata: '/customerrecommend/pushdata' //推送名单
};

util.checkOrg=0;

util.Organization = [{
		name: '110000',
		value: '北京市分公司'
	},
	{
		name: '120000',
		value: '天津市分公司'
	},
	{
		name: '130000',
		value: '河北省分公司'
	},
	{
		name: '140000',
		value: '山西省分公司'
	},
	{
		name: '150000',
		value: '内蒙古分公司'
	},
	{
		name: '210000',
		value: '辽宁省公司'
	},
	{
		name: '210200',
		value: '大连市分公司'
	},
	{
		name: '220000',
		value: '吉林省分公司'
	},
	{
		name: '230000',
		value: '黑龙江省分公司'
	},
	{
		name: '310000',
		value: '上海分公司'
	},
	{
		name: '320000',
		value: '江苏省分公司'
	},
	{
		name: '330000',
		value: '浙江省分公司'
	},
	{
		name: '330200',
		value: '宁波市分公司'
	},
	{
		name: '340000',
		value: '安徽省分公司'
	},
	{
		name: '350000',
		value: '福建省分公司'
	},
	{
		name: '350200',
		value: '厦门市分公司'
	},
	{
		name: '360000',
		value: '江西省分公司'
	},
	{
		name: '370000',
		value: '山东省分公司'
	},
	{
		name: '370200',
		value: '青岛市分公司'
	},
	{
		name: '410000',
		value: '河南省分公司'
	},
	{
		name: '420000',
		value: '湖北省分公司'
	},
	{
		name: '430000',
		value: '湖南省分公司'
	},
	{
		name: '440000',
		value: '广东省分公司'
	},
	{
		name: '440200',
		value: '深圳市分公司'
	},
	{
		name: '450000',
		value: '广西分公司'
	},
	{
		name: '460000',
		value: '海南省分公司'
	},
	{
		name: '510000',
		value: '四川省分公司'
	},
	{
		name: '520000',
		value: '贵州省分公司'
	},
	{
		name: '530000',
		value: '云南分公司'
	},
	{
		name: '610000',
		value: '陕西省分公司'
	},
	{
		name: '620000',
		value: '甘肃省分公司'
	},
	{
		name: '630000',
		value: '青海省分公司'
	},
	{
		name: '640000',
		value: '宁夏分公司'
	},
	{
		name: '650000',
		value: '新疆分公司'
	},
	{
		name: '660000',
		value: '重庆市分公司'
	},
	{
		name: '850000',
		value: '西藏自治区分公司'
	}

];

//form 表单方式提交
util.ajax = axios.create({
	baseURL: ajaxUrl,
	timeout: 10000,
	withCredentials: true // default
});
//ajax 拦截器
util.ajax.interceptors.response.use(res => {
	console.log("res.data----------------------------------");
	console.log("url:" + res.config.url);
	console.log(res.data);
	if(res.data.status != null && res.data.status != undefined && res.data.status === false) {
		try {
			console.log(res.data.msg);
		} catch(e) {
			console.log(e)
		}

	}
	return res.data;
});
//设置请求参数放到 Form Data
util.ajax.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
util.ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
util.ajax.defaults.transformRequest = [function(data) {
	let ret = [];
	for(let it in data) {
		ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]));
	}
	return ret.join('&');
}];

//body数据方式提交
util.ajaxByBody = axios.create({
	baseURL: ajaxUrl,
	timeout: 10000,
	withCredentials: true// default
});
//ajax 拦截器
util.ajaxByBody.interceptors.response.use(res => {
	if(res.data.status != null && res.data.status != undefined && res.data.status === false) {
		console.log(res.data.msg);
	}
	return res.data;
});

util.guid = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for(var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
};

util.getDate = function() {
	var myDate = new Date();
	var DataStr = myDate.getFullYear() + "-" +
		((myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)) +
		"-" + (myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
	return DataStr;
};

export default util;