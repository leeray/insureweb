<template>
	<div class="page has-navbar history" v-nav="{hideNavbar:true}">
		<von-header theme="stable">
			<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			<span slot="title" @click="back">历史记录</span>
		</von-header>
		<div style="width: 100%;height: 2px;position: absolute;top: 49px;z-index: 99;background: #f5f5f5;"></div>

		<div class="page-content text-center">
			<div v-if="data.length == 0" style="margin-top: 30px;color: #C0C0C0;">暂无数据</div>
			<div class="infoBox" v-for="(item,idx) in data">
				<div class="top" style="padding: 20px;">
					<div>
						<span class="iconfont icon-rili text"></span>
						<span class="text">{{item.query_time.substring(0,4)}}</span>
						<div class="number">{{item.query_time.substring(5,10).replace(/-/g,"/")}}</div>
					</div>
					<div style="width: 200px;text-align: right;">
						<span class="text">涉及客户数</span>
						<div class="number">{{item.query_kehushu}}</div>
					</div>

					<div>
						<i v-if="history[idx]" class="icon ion-ios-arrow-up text" style="font-size: 30px;" @click="zhankai(idx)"></i>
						<i v-else class="icon ion-ios-arrow-down text" style="font-size: 30px;" @click="zhankai(idx)"></i>
					</div>
				</div>
				<div style="padding: 0px 20px 20px 20px;" v-if="history[idx]">
					<div class="hcard">
						<div class="top">
							<div>
								<span class="iconfont icon-nv xb xbnv" v-if="item.kh_sex == 0|| item.kh_sex=='2'"></span>
								<span class="iconfont icon-nan xb xbnan" v-if="item.kh_sex == 0|| item.kh_sex=='1'"></span>
								<span style="font-size: 18px;">{{item.kh_sex_name}}</span>
							</div>
							<div style="padding-top: 6px;">
								<!--<span class="iconfont icon-vip3" style="font-size: 25px;"></span>-->
								<span style="font-size: 14px;">{{item.kh_vip_level_name}}</span>
							</div>
						</div>
						<div class="top" style="margin-top: 20px;">
							<div>
								<span style="font-size: 14px;">收入等级</span>
							</div>
							<div class="fgx1">
								&nbsp;
							</div>
							<div>
								<span style="font-size: 14px;">年龄</span>
							</div>
							<div class="fgx1">
								&nbsp;
							</div>
							<div>
								<span style="font-size: 14px;">客户得分</span>
							</div>
						</div>
						<div class="top" style="margin-top: 0px;">
							<div>
								<span style="font-size: 14px;">{{item.kh_income_level_name}}</span>
							</div>
							<div class="fgx">
								&nbsp;
							</div>
							<div>
								<span style="font-size: 14px;">{{item.kh_nianling_name}}</span>
							</div>
							<div class="fgx">
								&nbsp;
							</div>
							<div>
								<span style="font-size: 14px;">{{item.kh_defen_name}}</span>
							</div>
						</div>
					</div>
					<div class="hlabel">
						<span class="htitle">近三年是否购买过长险</span><span class="hvalue">{{item.kh_3_is_pay_insurance_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">是否购买康悦</span><span class="hvalue">{{item.kh_pay_kangyue_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">是否有退保</span><span class="hvalue">{{item.kh_tuibao_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">是否有万能余额</span><span class="hvalue">{{item.kh_wanneng_yu_e_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">重疾保障保额</span><span class="hvalue">{{item.kh_zhongji_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">意外保障保额</span><span class="hvalue">{{item.kh_yiwai_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">养老保障保额</span><span class="hvalue">{{item.kh_yanglao_name}}</span>
					</div>
					<div class="hlabel">
						<span class="htitle">推送状态</span><span class="hvalue">{{item.tuisong_status_name}}</span>
					</div>
				</div>

				<div v-if="history[idx]" style="font-size: 16px;border-top: 1px solid #eee;line-height: 50px;color:#1f79f3 ;" @click="baogao(item)">
					重新查询
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import util from '../../static/util';
	export default {
		data() {
			return {
				data: [],
				history: {
					'001': false
				}
			}
		},
		created() {
			//			this.$route.query.gl_jigouhao;
			//			this.$route.query.uid;
			//			this.$route.query.zhuti;
			this.getList();
		},

		methods: {
			getList: function() {
				debugger;
				$loading.show('正在查询，请稍后...');
				util.ajax.post(util.historylist, {
					gl_jigouhao: this.$route.query.gl_jigouhao,
					uid: this.$route.query.uid,
					zhuti: this.$route.query.zhuti
				}).then(res => {
					debugger;
					for(var i = 0; i < res.results.length; i++) {
						//推送状态
						if(res.results[i].tuisong_status == '0'){
							res.results[i].tuisong_status_name = '未推送';
						}else if(res.results[i].tuisong_status == '1'){
							res.results[i].tuisong_status_name = '准备推送';
						}else if(res.results[i].tuisong_status == '2'){
							res.results[i].tuisong_status_name = '正在推送';
						}else if(res.results[i].tuisong_status == '3'){
							res.results[i].tuisong_status_name = '推送完成';
						}

						//性别
						if(res.results[i].kh_sex == '0') {
							res.results[i].kh_sex_name = '男女';
						} else {
							res.results[i].kh_sex_name = (res.results[i].kh_sex == '1' ? '男' : '女');
						}

						//vip

						if(res.results[i].kh_vip_level == '0') {
							res.results[i].kh_vip_level_name = '无限制';
						} else {
							if(res.results[i].kh_vip_level == '1') {
								res.results[i].kh_income_level_name = 'VIP1';
							}
							if(res.results[i].kh_vip_level == '2') {
								res.results[i].kh_income_level_name = 'VIP2';
							}
							if(res.results[i].kh_vip_level == '3') {
								res.results[i].kh_income_level_name = 'VIP3';
							}
							if(res.results[i].kh_vip_level == '4') {
								res.results[i].kh_income_level_name = 'VIP4';
							}
							if(res.results[i].kh_vip_level == '5') {
								res.results[i].kh_income_level_name = 'VIP5';
							}
						}
						//收入
						if(res.results[i].kh_income_level == '0') {
							res.results[i].kh_income_level_name = '不限收入';
						} else {
							if(res.results[i].kh_income_level == '1') {
								res.results[i].kh_income_level_name = '一级';
							}
							if(res.results[i].kh_income_level == '2') {
								res.results[i].kh_income_level_name = '二级';
							}
							if(res.results[i].kh_income_level == '3') {
								res.results[i].kh_income_level_name = '三级';
							}
						}
						//年龄
						if(res.results[i].kh_nianling == '0') {
							res.results[i].kh_nianling_name = '无限制';
						} else {
							res.results[i].kh_nianling_name = res.results[i].kh_nianling + '岁';
						}

						//客户得分

						if(res.results[i].kh_defen == '0') {
							res.results[i].kh_defen_name = '无限制';
						} else {
							res.results[i].kh_defen_name = res.results[i].kh_nianling + '分';
						}

						//是否够吗悦康

						if(res.results[i].kh_pay_kangyue == '0') {
							res.results[i].kh_pay_kangyue_name = '无限制';
						} else {
							res.results[i].kh_pay_kangyue_name = (res.results[i].kh_pay_kangyue == '1' ? '是' : '否');
						}
						//进三年是否购买长险
						if(res.results[i].kh_3_is_pay_insurance == '0') {
							res.results[i].kh_3_is_pay_insurance_name = '无限制';
						} else {
							res.results[i].kh_3_is_pay_insurance_name = (res.results[i].kh_3_is_pay_insurance == '1' ? '是' : '否');
						}

						//是否有退保
						if(res.results[i].kh_tuibao == '0') {
							res.results[i].kh_tuibao_name = '无限制';
						} else {
							res.results[i].kh_tuibao_name = (res.results[i].kh_tuibao == '1' ? '是' : '否');
						}

						//是否有万能余额
						if(res.results[i].kh_wanneng_yu_e == '0') {
							res.results[i].kh_wanneng_yu_e_name = '无限制';
						} else {
							res.results[i].kh_wanneng_yu_e_name = (res.results[i].kh_wanneng_yu_e == '1' ? '是' : '否');
						}

						//重症保障保额
						if(res.results[i].kh_zhongji == '0') {
							res.results[i].kh_zhongji_name = '无限制';
						} else {
							res.results[i].kh_zhongji_name = res.results[i].kh_zhongji + '万';
						}

						//意外保障保额
						if(res.results[i].kh_yiwai == '0') {
							res.results[i].kh_yiwai_name = '无限制';
						} else {
							res.results[i].kh_yiwai_name = res.results[i].kh_yiwai + '万';
						}

						//养老保障保额
						if(res.results[i].kh_yanglao == '0') {
							res.results[i].kh_yanglao_name = '无限制';
						} else {
							res.results[i].kh_yanglao_name = res.results[i].kh_yanglao + '万';
						}
					}
					this.data = res.results;
					$loading.hide();
				}).catch(err => {
					$toast.show('获取数据失败!', 1500).then(() => {
						console.log('toast hide')
					})
					console.log(err);
					$loading.hide();
				});
			},
			zhankai: function(idx) {
				//展开详情
				debugger
				//this.history[idx] = !this.history[idx]; 

				this.$set(this.history, idx, !this.history[idx]);
			},
			baogao: function(item) {
				//				this.$router.push({
				//					path: '/',
				//					query: {
				//						randomid: item.randomid
				//					}
				//				});
				util.randomid = item.randomid;
				//this.back();
				this.$router.push({
					path: '/',
					query: {
						uid: this.$route.query.uid,
						zhuti: this.$route.query.zhuti
					}
				});
			},
			back() {
				//$router.back('/') 
				util.ispush = 1;
				this.$router.push({
					path: '/',
					query: {
						uid: this.$route.query.uid,
						zhuti: this.$route.query.zhuti
					}
				});
			}
		}
	}
</script>

<style>
	.history .bar-stable {
		box-shadow: 0 0 0px rgba(0, 0, 0, 0.08) !important;
		height: 50px;
	}
	
	.history .title {
		text-align: left !important;
		padding-left: 30px;
		line-height: 50px;
	}
	
	.history.has-navbar .page-content {
		margin-bottom: 0px;
		padding-top: 50px;
	}
	
	.infoBox {
		width: 90%;
		margin: 0 auto;
		margin-top: 10px;
		margin-bottom: 20px;
		background: #fff;
		min-height: 50px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
	}
	
	.infoBox .top {
		display: -webkit-flex;
		/* Safari */
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		text-align: center;
	}
	
	.text {
		color: #a1a1a1;
		font-size: 16px;
	}
	
	.number {
		font-size: 25px;
		color: #444;
		line-height: 35px;
	}
	
	.hcard {
		background: linear-gradient(90deg, rgba(113, 79, 238, 1), rgba(32, 117, 233, 1));
		padding-top: 1px;
		padding-bottom: 1px;
		/*box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);*/
		border-radius: 5px;
		padding: 20px;
		color: #fff;
		margin-bottom: 10px;
	}
	
	.xb {
		border: 2px solid #fff;
		color: #fff;
		border-radius: 50%;
		padding: 5px;
	}
	
	.xbnan {
		background: #16e1d1;
		margin-left: -10px;
	}
	
	.xbnv {
		background: #fd576a;
	}
	
	.fgx {
		width: 1px;
		background: linear-gradient(rgba(250, 250, 250, 0.1882352), #ccc, rgba(250, 250, 250, 0.1882352));
	}
	
	.hlabel {
		text-align: left;
		line-height: 30px;
	}
	
	.htitle {
		font-size: 14px;
		line-height: 14px;
		color: #444;
	}
	
	.hvalue {
		color: #aaa;
		font-size: 14px;
		margin-left: 10px;
	}
</style>