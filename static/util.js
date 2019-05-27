import axios from 'axios';
const ajaxUrl = ''; //'http://localhost:8011'; //发布时改完空

var util = {
	index: '/customerrecommend/queryindex/chart', //首页数据
	indexnum: '/customerrecommend/queryindex/num', //首页数据
	uploadexcel: '/customerrecommend/uploadexcel', //文件上传
	queryChart: '/customerrecommend/query/chart', //筛选查询
	queryNum: '/customerrecommend/query/num', //筛选查询
	queryFenduan: '/customerrecommend/query/fenduan', //筛选查询
	historylist: '/customerrecommend/historylist', //历史记录
	historydata: '/customerrecommend/historydata', //历史记录详情
	pushdata: '/customerrecommend/pushdata', //推送名单
	corplist:'/customerrecommend/corplist',//机构列表
	checkpush:'/customerrecommend/checkpush',//是否推送
};

util.checkOrg={};
util.push = {};
util.chartData = {};
util.Organization = [];

//form 表单方式提交
util.ajax = axios.create({
	baseURL: ajaxUrl,
	timeout: 300000,
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
	timeout: 300000,
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