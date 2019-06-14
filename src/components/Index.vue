<template>
	<div class="page has-tabbar has-navbar" v-nav="{
		title: '客户分布图',
		showBackButton:true,
		backButtonText:backButtonText,
		showMenuButton:true,
		menuButtonText:menuButtonText,
		onMenuButtonClick:shaiXuan
	}">
		<div style="position: fixed;top: 10px;left: 10px;z-index: 10;font-size: 17px;color: #444;" @click="ditu" class="labelsl">
			<span class="iconfont icon-location" style="font-size: 20px;margin-right: 5px;"></span>{{checkOrg.value}}
		</div>
		<div class="page-content">
			<div class="legend">
				<div class="legendbox">
					<div class="hitem" :class="legendAction=='all'?'action':''" @click="legendClick('all')">全部</div>
					<div class="hitem" :class="legendAction=='gexian'?'action':''" @click="legendClick('gexian')">
						<div class="bj" style="background: #12aa9e;"></div>个险
					</div>
					<div class="hitem" :class="legendAction=='yinbao'?'action':''" @click="legendClick('yinbao')">
						<div class="bj" style="background: #f95965;"></div>银保</div>
				</div>
			</div>
			<div class="chart" id="chart"></div>
			<list class="list-ios" style="margin-top: 20px;">
				<item>
					客户总人数
					<span class="item-note">
                {{chartData.kehu_renshu||0}}
              </span>
				</item>
				<item>
					营销员总人数
					<span class="item-note">
                 {{chartData.yinxiao_renshu||0}}
              </span>
				</item>
			</list>
			<div v-if="chartData.yinxiao_fenduan" class="yxfdgrouptitle" style="margin-top: 20px;background: #fff;line-height: 50px;padding: 0px 20px 0px 20px;">
				<table style="width: 100%;border: 1px;">
					<tr >
						<td>推荐客户数量范围</td>
						<td style="text-align: right;">营销人员人数</td>
					</tr>
					<tr style="border-top: 1px solid #eee;"  v-for="(item,idx) in getYinxiaoGroup">
						<td class="yxfdgroup">
							<template v-if='idx ==0'>0~9</template>
							<template v-else-if='idx ==1'>10~29</template>
							<template v-else-if='idx ==2'>30~49</template>
							<template v-else-if='idx ==3'>50~100</template>
							<template v-else='idx ==4'>100+</template>
						</td>
						<td style="text-align: right;color: #aaa;">{{item}}</td>
					</tr> 
				</table>
			</div>
			<!--<list v-if="chartData.yinxiao_fenduan" class="list-ios" style="margin:20px 0px 20px 0px;">
				<item>
					推荐客户范围
					<div class="item-note yxfdgrouptitle" style="display: flex;width: 240px;justify-content: space-around;">
						<span class="yxfdgroup">0~9</span>
						<span class="yxfdgroup">10~29</span>
						<span class="yxfdgroup">30~49</span>
						<span class="yxfdgroup">50~100</span>
						<span class="yxfdgroup">100+</span>
					</div>
				</item>
				<item>
					营销人员人数
					<div class="item-note" style="display: flex;width: 240px;justify-content: space-around;">
						<span v-for="(item,idx) in getYinxiaoGroup" class="yxfdgroup">{{item}}</span>
					</div>
				</item>
			</list>-->
		</div>

		<div class="b">
			<div class="bleft" @click="history">
				<span class="iconfont icon-lishichaxun"></span>
				<span>历史查询</span>
			</div>
			<div class="bright" @click="pushClick">
				<span class="iconfont icon-dianmingdan"></span>
				<span>推送名单</span>
			</div>
		</div>

		<transition :name="'vux-pop-'+rigetName">
			<div class="rightBox" v-if="right" @click.stop="shaiXuan">
				<div class="rightitem" @click.stop="stop">
					<scroller ref="scroller">
						<div style="padding-bottom: 50px;">

							<von-header theme="light" style="">
								<span slot="title">客户信息筛选</span>
							</von-header>
							<list class="list-ios">
								<item class="item-icon-right">
									<span class="iconfont icon-kehuxinxi"></span>渠道
									<i v-if="sfq['qd']" class="icon ion-ios-arrow-up" style="color: #DDD;" @click.stop="checkSfq('qd')"></i>
									<i v-else class="icon ion-ios-arrow-down" style="color: #DDD;" @click.stop="checkSfq('qd')"></i>
								</item>
								<transition name="draw">
									<div class="sfq" v-show="sfq['qd']">
										<div class="item-divider">
											渠道
											<div class="legendbox">
												<div class="hitem" :class="form.kh_channels=='0'?'action':''" @click="shaiXuanRadio('kh_channels','0')">全部</div>
												<div class="hitem" :class="form.kh_channels=='1'?'action':''" @click="shaiXuanRadio('kh_channels','1')">
													个险
												</div>
												<div class="hitem" :class="form.kh_channels=='2'?'action':''" @click="shaiXuanRadio('kh_channels','2')">
													银保</div>
											</div>
										</div>
									</div>
								</transition>
								<item class="item-icon-right">
									<span class="iconfont icon-kehuxinxi"></span>客户信息
									<i v-if="sfq['khxx']" class="icon ion-ios-arrow-up" style="color: #DDD;" @click.stop="checkSfq('khxx')"></i>
									<i v-else class="icon ion-ios-arrow-down" style="color: #DDD;" @click.stop="checkSfq('khxx')"></i>
								</item>
								<transition name="draw">
									<div class="sfq" v-show="sfq['khxx']">
										<div class="item-divider">客户得分
											<!-- <span>{{kh_defen||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_defen',0)">无限制</div>
											</div>

										</div>
										<div class="sfqitem">
											<vue-slider v-model="form.kh_defen" :marks="true" :data="slider.nl" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>
										<div class="item-divider">
											性别
											<div class="legendbox">
												<div class="hitem" :class="form.kh_sex=='0'?'action':''" @click="shaiXuanRadio('kh_sex','0')">男女</div>
												<div class="hitem" :class="form.kh_sex=='1'?'action':''" @click="shaiXuanRadio('kh_sex','1')">
													男
												</div>
												<div class="hitem" :class="form.kh_sex=='2'?'action':''" @click="shaiXuanRadio('kh_sex','2')">
													女</div>
											</div>
										</div>
										<div class="item-divider">年龄
											<!--<span>{{kh_nianling||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_nianling',0)">无限制</div>
											</div>
										</div>
										<div class="sfqitem">
											<vue-slider v-model="form.kh_nianling" :marks="true" :data="slider.nl" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>
										<div class="item-divider">VIP等级
											<!--<span>{{kh_vip_level||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_vip_level',0)">无限制</div>
											</div>
										</div>
										<div class="sfqitem">
											<vue-slider v-model="form.kh_vip_level" :marks="true" :data="slider.vip" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>
										<div class="item-divider">收入等级
											<!--<span>{{kh_income_level||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_income_level',0)">无限制</div>
											</div>
										</div>
										<div class="sfqitem">
											<vue-slider v-model="form.kh_income_level" :marks="true" :data="slider.srdj" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>
									</div>
								</transition>
								<!--<item class="item-icon-right">
									<span class="iconfont icon-shangchuan"></span>上传名单
									<i v-if="sfq['scmd']" class="icon ion-ios-arrow-up" style="color: #DDD;" @click.stop="checkSfq('scmd')"></i>
									<i v-else class="icon ion-ios-arrow-down" style="color: #DDD;" @click.stop="checkSfq('scmd')"></i>
								</item>
								<transition name="draw">
									<div class="sfq" v-show="sfq['scmd']">
										<div class="item-divider">
											&nbsp;
											<div class="legendbox" style="float: left;width: 70%;">
												<div class="hitem" style="width: 45%;" :class="form.kh_file_type=='1'?'action':''" @click="shaiXuanRadio('kh_file_type','1')">按三要素</div>
												<div class="hitem" style="width: 45%;" :class="form.kh_file_type=='2'?'action':''" @click="shaiXuanRadio('kh_file_type','2')">按身份证</div>
											</div>

										</div>
										<div class="sfqitem" style="display: -webkit-flex; display: flex;flex-direction: row;align-items:center; justify-content:flex-start;">
 											<div v-if="getFileInfo.stutas" style="width: calc(100% - 50px);display: -webkit-flex; display: flex;flex-direction: row;align-items:center; ">
												<span class="iconfont icon-Excel" style="color: #1f79f3;font-size:25px;margin-right: 5px;"></span>
												<div style="display: -webkit-flex; display: flex;flex-direction: column ;">
													<span class="labelsl" style="font-size: 14px;line-height: 20px;">{{getFileInfo.name}}</span>
													<span style="font-size: 12px;line-height: 14px;color: #a1a1a1;">{{getFileInfo.size}}</span>
												</div>
												<div style="color: #ccc;padding-left: 5px;" @click="delfile"><span class="iconfont icon-menu_reject2Submitor"></span></div>
											</div>
											<span v-else style="width: calc(100% - 50px);line-height: 30px;color: #ccc;font-size: 14px;padding-left: 10px;">无文件</span>

											<file-upload :data="{kh_file_type: form.kh_file_type}" class="btn btn-primary" :post-action="upload" accept="application/vnd.ms-excel
,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :extensions="['xls','xlsx']" v-model="files" ref="upload" @input-file="inputFile">
												<button class="button button-positive button-small" style="width: 50px; height: 25px;background-color: #1f79f3;float: right;">选择</button>
											</file-upload>
										</div>
									</div>
								</transition>-->
								<item class="item-icon-right">
									<span class="iconfont icon-baoxian1"></span>客户购买行为
									<i v-if="sfq['khgmxw']" class="icon ion-ios-arrow-up" style="color: #DDD;" @click.stop="checkSfq('khgmxw')"></i>
									<i v-else class="icon ion-ios-arrow-down" style="color: #DDD;" @click.stop="checkSfq('khgmxw')"></i>
								</item>
								<transition name="draw">
									<div class="sfq" v-show="sfq['khgmxw']">
										<div class="item-divider">近三年是否购买过长险 </div>
										<div class="sfqitem">
											<div class="legendbox" style="float: left;width: 80%;">
												<div class="hitem" style="width: 30%;" :class="form.kh_3_is_pay_insurance=='0'?'action':''" @click="shaiXuanRadio('kh_3_is_pay_insurance','0')">无限制</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_3_is_pay_insurance=='1'?'action':''" @click="shaiXuanRadio('kh_3_is_pay_insurance','1')">是</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_3_is_pay_insurance=='2'?'action':''" @click="shaiXuanRadio('kh_3_is_pay_insurance','2')">否</div>
											</div>
										</div>
										<div class="item-divider">是否购买康悦 </div>
										<div class="sfqitem">
											<div class="legendbox" style="float: left;width: 80%;">
												<div class="hitem" style="width: 30%;" :class="form.kh_pay_kangyue=='0'?'action':''" @click="shaiXuanRadio('kh_pay_kangyue','0')">无限制</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_pay_kangyue=='1'?'action':''" @click="shaiXuanRadio('kh_pay_kangyue','1')">是</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_pay_kangyue=='2'?'action':''" @click="shaiXuanRadio('kh_pay_kangyue','2')">否</div>
											</div>
										</div>
										<div class="item-divider">是否有退保 </div>
										<div class="sfqitem">
											<div class="legendbox" style="float: left;width: 80%;">
												<div class="hitem" style="width: 30%;" :class="form.kh_tuibao=='0'?'action':''" @click="shaiXuanRadio('kh_tuibao','0')">无限制</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_tuibao=='1'?'action':''" @click="shaiXuanRadio('kh_tuibao','1')">是</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_tuibao=='2'?'action':''" @click="shaiXuanRadio('kh_tuibao','2')">否</div>
											</div>
										</div>

										<div class="item-divider">是否有万能余额 </div>
										<div class="sfqitem">
											<div class="legendbox" style="float: left;width: 80%;">
												<div class="hitem" style="width: 30%;" :class="form.kh_wanneng_yu_e=='0'?'action':''" @click="shaiXuanRadio('kh_wanneng_yu_e','0')">无限制</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_wanneng_yu_e=='1'?'action':''" @click="shaiXuanRadio('kh_wanneng_yu_e','1')">是</div>
												<div class="hitem" style="width: 30%;" :class="form.kh_wanneng_yu_e=='2'?'action':''" @click="shaiXuanRadio('kh_wanneng_yu_e','2')">否</div>
											</div>
										</div>
										<div class="sfqitem" v-if="form.kh_wanneng_yu_e=='1'">
											<von-input type="text" v-model="form.kh_wanneng_yu_e_qja" class="input" style="width: 45%;float: left;" placeholder="金额" label="收入">
											</von-input>
											<div style="width: 10%;float: left;line-height: 50px;text-align: center;">至</div>
											<von-input type="text" v-model="form.kh_wanneng_yu_e_qjb" class="input" style="width: 45%;float: left;" placeholder="金额">
											</von-input>
										</div>
									</div>
								</transition>

								<item class="item-icon-right">
									<span class="iconfont icon-baoxian"></span>客户保障情况
									<i v-if="sfq['khbzqk']" class="icon ion-ios-arrow-up" style="color: #DDD;" @click.stop="checkSfq('khbzqk')"></i>
									<i v-else class="icon ion-ios-arrow-down" style="color: #DDD;" @click.stop="checkSfq('khbzqk')"></i>
								</item>
								<transition name="draw">
									<div class="sfq" v-show="sfq['khbzqk']">
										<div class="item-divider">重疾保障保额
											<!--<span>{{kh_zhongji||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_zhongji',0)">无限制</div>
											</div>
										</div>
										<!--<div class="sfqitem">
											<vue-slider v-model="form.kh_zhongji" :marks="true" :data="slider.baoer" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>-->
										<div class="sfqitem">
											<von-input type="text" v-model="form.kh_zhongji[0]" class="input" style="width: 45%;float: left;" placeholder="金额" label="保额">
											</von-input>
											<div style="width: 10%;float: left;line-height: 50px;text-align: center;">至</div>
											<von-input type="text" v-model="form.kh_zhongji[1]" class="input" style="width: 45%;float: left;" placeholder="金额">
											</von-input>
										</div>
										<div class="item-divider">意外保障保额
											<!--<span>{{kh_yiwai||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_yiwai',0)">无限制</div>
											</div>
										</div>
										<!--<div class="sfqitem">
											<vue-slider v-model="form.kh_yiwai" :marks="true" :data="slider.baoer" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>-->
										<div class="sfqitem">
											<von-input type="text" v-model="form.kh_yiwai[0]" class="input" style="width: 45%;float: left;" placeholder="金额" label="保额">
											</von-input>
											<div style="width: 10%;float: left;line-height: 50px;text-align: center;">至</div>
											<von-input type="text" v-model="form.kh_yiwai[1]" class="input" style="width: 45%;float: left;" placeholder="金额">
											</von-input>
										</div>
										<div class="item-divider">养老保障保额
											<!--<span>{{kh_yanglao||'无限制'}}</span>-->
											<div class="legendbox wxz">
												<div class="hitem" @click="wuxianzhi('kh_yanglao',0)">无限制</div>
											</div>
										</div>
										<!--<div class="sfqitem">
											<vue-slider v-model="form.kh_yanglao" :marks="true" :data="slider.baoer" :contained="true">
												<template v-slot:label="{ label, active }">
													<div :class="['vue-slider-mark-label', 'custom-label', { active }]">{{ label }}</div>
												</template>
											</vue-slider>
										</div>-->
										<div class="sfqitem">
											<von-input type="text" v-model="form.kh_yanglao[0]" class="input" style="width: 45%;float: left;" placeholder="金额" label="保额">
											</von-input>
											<div style="width: 10%;float: left;line-height: 50px;text-align: center;">至</div>
											<von-input type="text" v-model="form.kh_yanglao[1]" class="input" style="width: 45%;float: left;" placeholder="金额">
											</von-input>
										</div>
									</div>
								</transition>
							</list>
						</div>
					</scroller>
					<div class="b">
						<div class="bleft" @click="shaixuanCZ">
							<span>重置</span>
						</div>
						<div class="bright" @click="shaixuanOk">
							<span>确定</span>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import util from '../../static/util';
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入柱状图
	require('echarts/lib/chart/bar');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
	import organization from './organization.vue'

	export default {
		data() {
			return {
				checkOrg: {},
				org_modal: null,
				upload: util.uploadexcel,
				files: [],
				basePar: {},
				form: {
					kh_zhongji: [0, 0], //重疾保障
					kh_yiwai: [0, 0], //意外保障
					kh_yanglao: [0, 0], //养老保障
					kh_defen: [0, 0], //客户得分
					kh_nianling: [0, 0], //年龄 
					kh_wanneng_yu_e_qja: 5000, //万能余额区间
					kh_wanneng_yu_e_qjb: 10000,
					khdt: '',
					kh_sex: '0', //性别
					kh_channels: '0', //渠道
					kh_file_type: '1', //上传名单，按身份证
					kh_3_is_pay_insurance: '0', //近三年是否购买过常险
					kh_pay_kangyue: '0', //是否购买过悦康
					kh_tuibao: '0', //是否有退保
					kh_wanneng_yu_e: '0', //万能余额
					kh_vip_level: [0, 0], //VIP
					kh_income_level: [0, 0], //收入等级
				},
				form2: {},
				slider: {
					khdf: ['', '50', '100'], //客户得分
					nl: ['', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'], //年龄
					vip: ['', 'VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'], //VIP等级
					srdj: ['', '一级', '二级', '三级'], //收入等级
					baoer: ['', '10万', '20万', '30万', '40万', '50万'], //保额
					wnyr: ['', '1万', '2万', '3万', '4万', '5万', '6万', '7万', '8万', '9万', '10万'], //万能余额
				},
				sliderForm: {
					'一级': 1,
					'二级': 2,
					'三级': 3,
					'VIP1': 1,
					'VIP2': 2,
					'VIP3': 3,
					'VIP4': 4,
					'VIP5': 5,
					'10万': 100000,
					'20万': 200000,
					'30万': 300000,
					'40万': 400000,
					'50万': 500000,
				},
				sfq: {
					qd: true,
					khxx: true,
					scmd: true,
					khgmxw: true,
					khbzqk: true
				},
				rigetName: 'in',
				right: false,
				legendAction: 'all',
				//backButtonText: '<span class="iconfont icon-location"></span><span id="orgname"></span>',
				menuButtonText: "筛选",
				chartData: {},
				myChart: {},
			}
		},
		watch: {},
		created: function() {},
		destroyed() {
			if(this.push_modal) {
				$modal.destroy(this.push_modal)
			}
			if(this.org_modal) {
				$modal.destroy(this.org_modal)
			}
		},
		mounted: function() {
			this.form2 = JSON.stringify(this.form);
			this.basePar.uid = this.$route.query.uid || '001';
			this.basePar.zhuti = this.$route.query.zhuti || 'zj';

			util.uid = this.basePar.uid;
			util.zhuti = this.basePar.zhuti;
			this.getcorplist();
			console.log(this.basePar);
		},
		methods: {
			getcorplist: function() {
				if(util.ispush == 1) {
					this.checkOrg = Object.assign({}, util.checkOrg);
					this.chartData = util.chartData;
					this.initChart();

					util.ispush = 0;
					return;
				}

				if(util.Organization && util.Organization.length > 0) {
					this.checkOrg = Object.assign({}, util.checkOrg);
					if(util.randomid && util.randomid != '') {
						this.getHistorydata();
					} else {
						this.getIndex();
					}
					return;
				}

				$loading.show('正在查询，请稍后...');

				util.ajax.post(util.corplist, {
					uid: this.basePar.uid,
					zhuti: this.basePar.zhuti
				}).then(res => { 
					var data = [];
					for(var i = 0; i < res.corpList.length; i++) {
						data.push({
							name: res.corpList[i].corpCode,
							value: res.corpList[i].corpName,
							c: []
						});

						if(res.corpList[i].cityList && res.corpList[i].cityList.length > 0) {
							for(var j = 0; j < res.corpList[i].cityList.length; j++) {
								data[i].c.push({
									name: res.corpList[i].cityList[j].cityCode,
									value: res.corpList[i].cityList[j].cityName,
									c: [],
									p: data[i]
								});

								if(res.corpList[i].cityList[j].manageList && res.corpList[i].cityList[j].manageList.length > 0) {
									for(var k = 0; k < res.corpList[i].cityList[j].manageList.length; k++) {
										data[i].c[j].c.push({
											name: res.corpList[i].cityList[j].manageList[k].manageCode,
											value: res.corpList[i].cityList[j].manageList[k].manageName,
											p: data[i].c[j]
										});
									}
								}
							}
						}
					}
					this.checkOrg[data[0].name] = true;
					this.checkOrg['value'] = data[0].value;

					util.checkOrg[data[0].name] = true;
					util.checkOrg['value'] = data[0].value;
					util.Organization = data;

					if(util.randomid && util.randomid != '') {
						this.getHistorydata();
					} else {
						this.getIndex();
					}
					console.log(data);
				}).catch(err => {
					$toast.show('获取机构数据失败!', 1500);
					console.log(err);

					$loading.hide();
				});
			},
			wuxianzhi: function(key, value) {
				//无限制
				if(typeof this.form[key] == 'object') {
					this.form[key] = [0, 0];
				} else {
					this.form[key] = value;
				}
			},
			pushClick: function() {
				if(!this.chartData.randomid) {
					$toast.show('请先筛选推送数据!', 1500);
					return;
				}
				$loading.show('请稍后...');
				//checkpush
				util.ajax.post(util.checkpush, {
					randomid: this.chartData.randomid,
					uid: this.basePar.uid,
					zhuti: this.basePar.zhuti
				}).then(res => {
					if(res.ispushed == '0') {
						$loading.hide();
						this.$router.push({
							path: '/push',
							query: {
								randomid: this.chartData.randomid,
								uid: this.basePar.uid,
								zhuti: this.basePar.zhuti,
								gl_jigouhao: this.getjigouhao()
							}
						});
					} else {
						$toast.show('已推送过名单了。', 1500);
					}

				}).catch(err => {
					debugger;
					$toast.show('检查是否推送失败!', 1500);
					console.log(err);
				});
			},
			delfile: function() {
				this.files = [];
			},
			inputFile: function(newFile, oldFile) {
				if(newFile && oldFile) {
					console.log('update', newFile);
					if(newFile.success) {
						this.form.randomid = newFile.response.randomid;
						this.shaixuanPost();
					}
				}
			},
			getHistorydata: function() {
				$loading.show('正在查询，请稍后...');
				util.ajax.post(util.historydata, {
					randomid: util.randomid,
					uid: this.basePar.uid,
					zhuti: this.basePar.zhuti
				}).then(res => {
					this.chartData = res;
					this.initChart();
					$loading.hide();
				}).catch(err => {
					$toast.show('获取数据失败!', 1500);
					console.log(err);

					$loading.hide();
				});
				util.randomid = null;
			},
			getIndex: function() {
				$loading.show('正在查询，请稍后...');

				var idx = 0;
				util.ajax.post(util.index, {
					gl_jigouhao: this.getjigouhao(),
					uid: this.basePar.uid,
					zhuti: this.basePar.zhuti
				}).then(res => {
					for(var i in res) {
						this.$set(this.chartData, i, res[i]);
						util.chartData[i] = res[i];
					}
					idx++;
					this.initChart();
					if(idx == 2) {
						$loading.hide();
					}
				}).catch(err => {
					$toast.show('获取数据失败!', 1500);
					console.log(err);
				});

				util.ajax.post(util.indexnum, {
					gl_jigouhao: this.getjigouhao(),
					uid: this.basePar.uid,
					zhuti: this.basePar.zhuti
				}).then(res => {
					for(var i in res) {
						this.$set(this.chartData, i, res[i]);
						util.chartData[i] = res[i];
					}
					idx++;
					if(idx == 2) {
						$loading.hide();
					}
				}).catch(err => {
					$toast.show('获取数据失败!', 1500);
					console.log(err);
				});

				//indexnum
			},
			checkSfq: function(v) {
				//切换手风琴面板
				this.sfq[v] = !this.sfq[v];
			},
			stop: function() {
				return false;
			},
			ditu: function() {
				//点击地图 
				var _this = this;
				$modal.fromComponent(organization, {
					title: '选择机构',
					theme: 'default',
					onHide: function() {
						var a = JSON.stringify(_this.checkOrg);
						var b = JSON.stringify(Object.assign({}, util.checkOrg)); 
						if(a != b) {
							_this.checkOrg = Object.assign({}, util.checkOrg);

							if(_this.chartData.randomid) {
								_this.right = true;
								_this.shaixuanOk();
							} else {
								_this.getIndex();
							}
						}

					}
				}).then((modal) => {
					this.org_modal = modal;

					this.org_modal.show();
				})
			},
			shaiXuan: function(e) {
				//筛选 
				if(this.right) {
					this.rigetName = 'out';
				} else {
					this.rigetName = 'in';
				}

				this.$nextTick(function() {
					this.right = !this.right;
					setTimeout(() => {
						if(this.$refs.scroller)
							this.$refs.scroller.resize()
					});
				});

			},
			shaixuanCZ: function() {
				this.form = JSON.parse(this.form2);
			},
			shaixuanOk: function() {
				//存在文件，进行上传
				if(this.files && this.files.length > 0 && this.files[0].data.kh_file_type == this.form.kh_file_type && !this.files[0].success) {

					$loading.show('上传名单，请稍后...');
					this.$refs.upload.active = true;
				} else {
					this.form.kh_file_type = '0';
					this.shaixuanPost();
				}
			},
			shaixuanPost: function() {
				var form = JSON.parse(JSON.stringify(this.form));
				form.gl_jigouhao = this.getjigouhao();
				form.uid = this.basePar.uid;
				form.zhuti = this.basePar.zhuti;
				//格式化值
				if(form.kh_zhongji) {
					if(form.kh_zhongji[0] == '' && form.kh_zhongji[1] == '') {
						form.kh_zhongji = 0;
					} else if(form.kh_zhongji[0] == '' && form.kh_zhongji[1] != '') {
						form.kh_zhongji = '0-' + form.kh_zhongji[1].replace(/万/g, "0000")
					} else {
						form.kh_zhongji = form.kh_zhongji.join('-').replace(/万/g, "0000");
					}
				}

				if(form.kh_yiwai) {
					if(form.kh_yiwai[0] == '' && form.kh_yiwai[1] == '') {
						form.kh_yiwai = 0;
					} else if(form.kh_yiwai[0] == '' && form.kh_yiwai[1] != '') {
						form.kh_yiwai = '0-' + form.kh_yiwai[1].replace(/万/g, "0000")
					} else {
						form.kh_yiwai = form.kh_yiwai.join('-').replace(/万/g, "0000");
					}
				}

				if(form.kh_yanglao) {
					if(form.kh_yanglao[0] == '' && form.kh_yanglao[1] == '') {
						form.kh_yanglao = 0;
					} else if(form.kh_yanglao[0] == '' && form.kh_yanglao[1] != '') {
						form.kh_yanglao = '0-' + form.kh_yanglao[1].replace(/万/g, "0000")
					} else {
						form.kh_yanglao = form.kh_yanglao.join('-').replace(/万/g, "0000");
					}
				}

				if(form.kh_defen) {
					if(form.kh_defen[0] == '' && form.kh_defen[1] == '') {
						form.kh_defen = 0;
					} else if(form.kh_defen[0] == '' && form.kh_defen[1] != '') {
						form.kh_defen = '0-' + form.kh_defen[1];
					} else {
						form.kh_defen = form.kh_defen.join('-');
					}
				}

				if(form.kh_nianling) {
					if(form.kh_nianling[0] == '' && form.kh_nianling[1] == '') {
						form.kh_nianling = 0;
					} else if(form.kh_nianling[0] == '' && form.kh_nianling[1] != '') {
						form.kh_nianling = '0-' + form.kh_nianling[1];
					} else {
						form.kh_nianling = form.kh_nianling.join('-');
					}
				}

				if(form.kh_wanneng_yu_e == '1') {
					//					if(form.kh_wanneng_yu_e_qjb[0] == '' && form.kh_wanneng_yu_e_qjb[1] == '') {
					//						form.kh_wanneng_yu_e = 0;
					//					} else if(form.kh_wanneng_yu_e_qj[0] == '' && form.kh_wanneng_yu_e_qj[1] != '') {
					//						form.kh_wanneng_yu_e = '0-' + form.kh_wanneng_yu_e_qj[1].replace(/万/g, "0000")
					//					} else {
					//						form.kh_wanneng_yu_e = form.kh_wanneng_yu_e_qj.join('-').replace(/万/g, "0000");
					//					}
					if(parseInt(form.kh_wanneng_yu_e_qjb) <= parseInt(form.kh_wanneng_yu_e_qja)) {
						$toast.show('请正确输入万能余额区间!', 1500);
						return;
					} else {
						form.kh_wanneng_yu_e = parseInt(form.kh_wanneng_yu_e_qja) + '-' + parseInt(form.kh_wanneng_yu_e_qjb);
					}
				}

				if(form.kh_vip_level) {
					if(form.kh_vip_level[0] == '' && form.kh_vip_level[1] == '') {
						form.kh_vip_level = 0;
					} else if(form.kh_vip_level[0] == '' && form.kh_vip_level[1] != '') {
						form.kh_vip_level = '0-' + this.sliderForm[form.kh_vip_level[1]];
					} else {
						form.kh_vip_level = this.sliderForm[form.kh_vip_level[0]] + '-' + this.sliderForm[form.kh_vip_level[1]];
					}
				}

				if(form.kh_income_level) {
					if(form.kh_income_level[0] == '' && form.kh_income_level[1] == '') {
						form.kh_income_level = 0;
					} else if(form.kh_income_level[0] == '' && form.kh_income_level[1] != '') {
						form.kh_income_level = '0-' + this.sliderForm[form.kh_income_level[1]];
					} else {
						form.kh_income_level = this.sliderForm[form.kh_income_level[0]] + '-' + this.sliderForm[form.kh_income_level[1]];
					}
				}

				debugger;
				for(var i in form) {
					if(this.sliderForm[form[i]]) {
						form[i] = this.sliderForm[form[i]];
					}
				}
				if(util.push[JSON.stringify(form)]) {
					$toast.show('重复查询。', 1500);
					return;
				} else {
					util.push = {};
				}
				$loading.show('正在查询，请稍后...');
				var idx = 0;
				util.push[JSON.stringify(form)] = true;
				util.ajax.post(util.queryChart, form).then(res => {
					debugger;
					this.chartData.chart = res.chart;
					util.chartData.chart = res.chart;
					this.initChart();
					idx++;
					
					if(idx == 3){
						$loading.hide();
					}
				}).catch(err => {
					$toast.show('查询筛选图表失败!', 1500);
					console.log(err);
				});

				util.ajax.post(util.queryNum, form).then(res => {
					debugger;
					//this.chartData = res;
					for(var i in res) {
						//this.chartData[i] = res[i];
						this.$set(this.chartData, i, res[i]);
						util.chartData[i] = res[i];
					}
					
					idx++;
					
					if(idx == 3){
						$loading.hide();
					}
				}).catch(err => {
					$toast.show('查询筛人数失败!', 1500);
					console.log(err);
				});

				util.ajax.post(util.queryFenduan, form).then(res => {
					//this.chartData.yinxiao_fenduan = res.yinxiao_fenduan; 
					this.$set(this.chartData, 'yinxiao_fenduan', res.yinxiao_fenduan);
					util.chartData.yinxiao_fenduan = res.yinxiao_fenduan;
					idx++;
					if(idx == 3){
						$loading.hide();
					}
					
				}).catch(err => {
					$toast.show('查询筛选分段人数失败!', 1500);
					console.log(err);
				});
				debugger;
				this.shaiXuan();

				this.form.kh_file_type = '1';
			},
			getjigouhao: function() {

				var list = [];

				if(this.checkOrg.isP) {
					list.push(this.checkOrg.isP);
				} else {
					for(var i in this.checkOrg) {
						if(i != 'value' && this.checkOrg[i]) {
							list.push(i);
						}
					}
				}

				return list.join(','); //this.checkOrg.name;
			},
			initChart: function() {

				if(this.form.kh_channels == '0') {
					//this.legendAction = 'all';
				} else if(this.form.kh_channels == '1') {
					this.legendAction = 'gexian';
				} else {
					this.legendAction = 'yinbao';
				}

				var data = [];
				var group = {
					'10': 0,
					'20': 0,
					'30': 0,
					'40': 0,
					'50': 0,
					'60': 0,
					'70': 0,
					'80': 0,
					'90': 0,
					'100': 0,
				};
				var xAxisData = [];
				var series = [];
				for(var i in group) {
					var groupname = (parseInt(i) - 10) + '-' + i + '分';
					xAxisData.push(groupname);
				}
				if(this.legendAction == 'all') {
					var yb = [];
					var ybdata = JSON.parse(JSON.stringify(group));
					var ybdaatList = [];
					var gx = [];
					var gedata = JSON.parse(JSON.stringify(group));
					var gxdataList = [];

					for(var i = 0; i < this.chartData.chart.length; i++) {
						if(this.chartData.chart[i].channel == "gexian") {
							gx = this.chartData.chart[i].data;
						}
						if(this.chartData.chart[i].channel == "yinbao") {
							yb = this.chartData.chart[i].data;
						}
					}

					//个险
					for(var i = 0; i < gx.length; i++) {
						gedata[gx[i].fen.substring(3, 10) + ''] = gx[i].renshu;
					}
					for(var i in gedata) {
						gxdataList.push(gedata[i]);
					}

					var obj = {
						barMaxWidth: 20,
						name: "个险",
						type: 'bar',
						data: gxdataList,
						itemStyle: {
							color: '#12aa9e'
						}
					};
					series.push(obj);

					//银保
					for(var i = 0; i < yb.length; i++) {
						ybdata[yb[i].fen.substring(3, 10) + ''] = yb[i].renshu;
					}
					for(var i in ybdata) {
						ybdaatList.push(ybdata[i]);
					}

					var obj2 = {
						barMaxWidth: 20,
						name: "银保",
						type: 'bar',
						data: ybdaatList,
						itemStyle: {
							color: '#f95965'
						}
					};
					series.push(obj2);

				} else {

					for(var i = 0; i < this.chartData.chart.length; i++) {
						if(this.chartData.chart[i].channel == this.legendAction) {
							data = this.chartData.chart[i].data;
						}
					}

					for(var i = 0; i < data.length; i++) {
						group[data[i].fen.substring(3, 10) + ''] = data[i].renshu;
					}

					var dataGroup = [];

					for(var i in group) {
						var groupname = (parseInt(i) - 10) + '-' + i + '分';

						dataGroup.push(group[i]);
					}

					var name;
					if(this.legendAction == 'all') {
						name = '全部'
					} else if(this.legendAction == 'gexian') {
						name = '个险';
					} else {
						name = '银保';
					}

					var obj = {
						barMaxWidth: 20,
						name: name,
						type: 'bar',
						data: dataGroup
					};
					if(this.legendAction == 'gexian') {
						obj.itemStyle = {};
						obj.itemStyle.color = '#12aa9e';
					} else if(this.legendAction == 'yinbao') {
						obj.itemStyle = {};
						obj.itemStyle.color = '#f95965';
					}
					series.push(obj);
				}

				var option = {
					color: ['#12aa9e', '#f95965'],
					//backgroundColor: '#eee',
					legend: {
						show: false,
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						data: xAxisData,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							color: '#a1a1a1',
							interval: 0,
							rotate: 45
						},
					},
					yAxis: {
						name: '单位(人)',
						nameLocation: 'end',
						nameTextStyle: {
							color: '#a1a1a1',
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							color: '#eee',
						},
						axisLabel: {
							color: '#a1a1a1',
						}
					},
					grid: {
						top: 40,
						right: 30,
						left: 70
					},
					series: series
				};

				// 基于准备好的dom，初始化echarts实例
				if(!this.myChart.setOption) {
					this.myChart = echarts.init(document.getElementById('chart'));
				}
				// 绘制图表
				this.myChart.setOption(option, true);

			},
			legendClick: function(id) {
				debugger
				if(this.form.kh_channels == '0') {
					this.legendAction = id;
					this.initChart();
				}

			},
			shaiXuanRadio: function(key, value) {
				var obj = {};
				obj[key] = value;
				this.form = Object.assign({}, this.form, obj);

				if(key == 'kh_wanneng_yu_e') {
					setTimeout(() => {
						if(this.$refs.scroller)
							this.$refs.scroller.resize()
					});
				}
			},
			menuClicked(index) {
				this.tabIndex = index
			},
			history: function() {
				this.$router.push({
					path: '/history',
					query: {
						gl_jigouhao: this.getjigouhao(),
						uid: this.basePar.uid,
						zhuti: this.basePar.zhuti
					}
				});

			}
		},
		computed: {
			kh_income_level: function() {
				if(this.form.kh_income_level[0] == '' && this.form.kh_income_level[1] == '') {
					return '无限制';
				}
				if(this.form.kh_income_level[0] == '' && this.form.kh_income_level[1] != '') {
					return '0 - ' + this.form.kh_income_level[1];
				}
				return this.form.kh_income_level[0] + ' - ' + this.form.kh_income_level[1];
			},
			kh_vip_level: function() {
				if(this.form.kh_vip_level[0] == '' && this.form.kh_vip_level[1] == '') {
					return '无限制';
				}
				if(this.form.kh_vip_level[0] == '' && this.form.kh_vip_level[1] != '') {
					return '0 - ' + this.form.kh_vip_level[1];
				}
				return this.form.kh_vip_level[0] + ' - ' + this.form.kh_vip_level[1];
			},
			kh_yanglao: function() {
				if(this.form.kh_yanglao[0] == '' && this.form.kh_yanglao[1] == '') {
					return '无限制';
				}
				if(this.form.kh_yanglao[0] == '' && this.form.kh_yanglao[1] != '') {
					return '0 - ' + this.form.kh_yanglao[1];
				}
				return this.form.kh_yanglao[0] + ' - ' + this.form.kh_yanglao[1];
			},
			kh_yiwai: function() {
				if(this.form.kh_yiwai[0] == '' && this.form.kh_yiwai[1] == '') {
					return '无限制';
				}
				if(this.form.kh_yiwai[0] == '' && this.form.kh_yiwai[1] != '') {
					return '0 - ' + this.form.kh_yiwai[1];
				}
				return this.form.kh_yiwai[0] + ' - ' + this.form.kh_yiwai[1];
			},
			kh_zhongji: function() {
				if(this.form.kh_zhongji[0] == '' && this.form.kh_zhongji[1] == '') {
					return '无限制';
				}
				if(this.form.kh_zhongji[0] == '' && this.form.kh_zhongji[1] != '') {
					return '0 - ' + this.form.kh_zhongji[1];
				}
				return this.form.kh_zhongji[0] + ' - ' + this.form.kh_zhongji[1];
			},
			//			kh_wanneng_yu_e_qj: function() {
			//				
			//				return this.form.kh_wanneng_yu_e_qja + ' - ' + this.form.kh_wanneng_yu_e_qjb;
			//			},
			kh_defen: function() {
				if(this.form.kh_defen[0] == '' && this.form.kh_defen[1] == '') {
					return '无限制';
				}
				if(this.form.kh_defen[0] == '' && this.form.kh_defen[1] != '') {
					return '0 - ' + this.form.kh_defen[1] + '分';
				}
				return this.form.kh_defen[0] + ' - ' + this.form.kh_defen[1] + '分';
			},
			kh_nianling: function() {
				if(this.form.kh_nianling[0] == '' && this.form.kh_nianling[1] == '') {
					return '无限制';
				}
				if(this.form.kh_nianling[0] == '' && this.form.kh_nianling[1] != '') {
					return '0 - ' + this.form.kh_nianling[1] + '岁';
				}
				return this.form.kh_nianling[0] + ' - ' + this.form.kh_nianling[1] + '岁';
			},
			backButtonText: function() {
				return '  ';
			},
			getFileInfo: function() {
				var obj = {};

				if(this.files && this.files.length > 0 && this.files[0].data.kh_file_type == this.form.kh_file_type) {
					obj.name = this.files[0].name;
					obj.size = (this.files[0].size / 1000).toFixed(2) + 'kb';
					obj.stutas = true;
				}
				return obj;
			},
			getYinxiaoGroup: function() {
				var data = [];
				var group = {
					'10': 0,
					'30': 0,
					'50': 0,
					'100': 0,
					'100p': 0
				};
				if(this.chartData.yinxiao_fenduan) {
					for(var i = 0; i < this.chartData.yinxiao_fenduan.length; i++) {
						var name = this.chartData.yinxiao_fenduan[i].level;
						name = name.substring(3, 10);
						group[name] = this.chartData.yinxiao_fenduan[i].num;
					}
				}

				for(var i in group) {
					data.push(group[i])
				}
				return data;
			}
		}

	}
</script>
<style>
	.yxfdgroup {
		margin-right: 5px;
		display: -webkit-inline-box;
		text-align: center;
	}
	
	.yxfdgrouptitle .yxfdgroup {
		color: #ff9800;
	}
	
	.labelsl {
		overflow: hidden;
		/*自动隐藏文字*/
		text-overflow: ellipsis;
		/*文字隐藏后添加省略号*/
		white-space: nowrap;
		/*强制不换行*/
		width: 150px;
		/*不允许出现半汉字截断*/
	}
	
	h2 {
		font-family: Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif;
		color: #888;
	}
	
	.title span {
		font-size: 20px;
		font-weight: 400;
		color: #444;
	}
	/*导航按钮图标*/
	
	.navbar-container .iconfont {
		font-size: 20px;
	}
	/*导航阴影*/
	
	.navbar .navbar-container .bar.bar-header {
		box-shadow: 0 0 0px rgba(0, 0, 0, 0.15);
		border: 0px;
	}
	
	.bar.bar-header {
		box-shadow: 0 0 0px rgba(0, 0, 0, 0.15);
		border: 0px;
	}
	
	.rightitem .bar.bar-header .title {
		text-align: left;
	}
	/*图标*/
	
	.chart {
		background: #fff;
		height: 330px;
	}
	/*图例*/
	
	.legend {
		height: 65px;
		padding: 10px 20px 15px 10px;
		background: #fff;
	}
	
	.legendbox {
		height: 100%;
		border-radius: 30px;
		background: #f5f5f5;
		padding: 5px;
		display: flex;
		display: -webkit-flex;
		/* Safari */
		justify-content: space-between;
		align-items: center;
	}
	
	.legendbox .hitem {
		border-radius: 30px;
		width: 25%;
		height: 100%;
		line-height: 30px;
		text-align: center;
		color: #444;
	}
	
	.legendbox .hitem:active {
		background: #CCCCCC;
	}
	
	.legendbox .action {
		color: #FFFFFF;
		background: rgb(78, 78, 78);
	}
	
	.legendbox .bj {
		width: 8px;
		height: 8px;
		display: inline-block;
		margin-right: 5px;
	}
	/*主面板
	.page-content{
		background: #fff;
	}*/
	
	.page.has-navbar .page-content {
		margin-bottom: 50px;
		/*padding-top: 100px;*/
	}
	
	.vipbox {
		flex-direction: column;
		float: left;
		margin-left: 10px;
		line-height: 12px;
	}
	
	.vip {
		font-size: 30px;
		color: #fca902;
	}
	
	.b {
		background: #fff;
		height: 50px;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 10;
		line-height: 50px;
		text-align: center;
		color: #FFFFFF;
	}
	
	.b span {
		font-size: 16px;
	}
	
	.b .iconfont {
		margin-right: 2px;
	}
	
	.bleft {
		width: 40%;
		float: left;
		height: 100%;
		background: #27282a;
	}
	
	.bleft:active {
		color: #ccc;
	}
	
	.bright {
		width: 60%;
		float: left;
		height: 100%;
		background: #1f79f3;
	}
	
	.bright:active {
		color: #ccc;
	}
	/*侧边栏*/
	/*.von-sidebar-wrapper .von-sidebar.open {
		width: 85% !important;
		background: #fff;
	}*/
	
	.rightBox .iconfont {
		margin-right: 5px;
		font-size: 18px;
	}
	
	.rightBox .b {
		position: absolute;
		border-top: 1px solid #1f79f3;
		box-sizing: border-box;
	}
	
	.rightBox .bleft {
		width: 50%;
		float: left;
		height: 100%;
		background: #fff;
		color: #444;
	}
	
	.rightBox .bleft:active {
		color: #ccc;
	}
	
	.rightBox .bright {
		width: 50%;
		float: left;
		height: 100%;
		background: #1f79f3;
	}
	
	.rightBox .bright:active {
		color: #ccc;
	}
	
	.rightBox {
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: fixed;
		z-index: 999999999999;
		/*background: rgba(0, 0, 0, 0.5);*/
	}
	
	.rightitem {
		width: 85%;
		height: 100%;
		background: #fff;
		float: right;
		box-shadow: 0 0 10px rgba(0, 0, 0, .2);
		-webkit-transition: -webkit-transform .4s cubic-bezier(.4, 0, 0, 1);
		box-shadow: 0 0 10px rgba(0, 0, 0, .2);
		box-sizing: border-box;
		position: relative;
		border-left: 1px solid #ddd;
	}
	
	.vux-pop-out-enter-active,
	.vux-pop-out-leave-active,
	.vux-pop-in-enter-active,
	.vux-pop-in-leave-active {
		will-change: transform;
		transition: all 250ms;
		height: 100%;
		top: 0;
		position: absolute;
		backface-visibility: hidden;
		perspective: 1000;
	}
	
	.vux-pop-out-enter {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
	
	.vux-pop-out-leave-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}
	
	.vux-pop-in-enter {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}
	
	.vux-pop-in-leave-active {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
	/*.draw-enter-active,
	.draw-leave-active {
		transition: all .3s;
	}
	
	.draw-enter,
	.draw-leave-active {
		transform: translate3d(0, 3rem, 0);
		opacity: 0;
	}*/
	
	.rightBox .item {
		border: 1px solid #8abbfd;
		background: #ebf3ff;
		color: #1f79f3;
		font-size: 17px;
		padding-left: 10px;
	}
	
	.rightBox .list {
		padding-left: 0px;
	}
	
	.rightBox .list .icon {
		color: #1f79f3 !important;
	}
	
	.rightBox .bar-header {
		position: relative;
		height: 50px;
		background: #fff;
	}
	
	.rightBox .bar-header .title {
		line-height: 50px;
	}
	
	.sfq {
		/*height: 100px;*/
		padding: 0px 10px 0px 10px;
	}
	
	.sfqitem {
		height: 65px;
	}
	
	.sfqitem .legendbox {
		height: 35px;
	}
	
	.sfq .item-divider {
		/*padding-left: 10px;*/
		background: #fff;
		font-size: 14px;
		color: #444;
		line-height: 35px;
	}
	
	.sfq .item-divider span {
		float: right;
		color: #a1a1a1;
	}
	
	.sfq .item-divider .wxz {
		height: 35px;
		float: right;
		width: 100px;
	}
	
	.sfq .item-divider .wxz .hitem {
		width: 100%;
	}
	
	.sfq .item-divider:not(:first-child) {
		border-top: 1px solid #ddd;
	}
	
	.vue-slider .vue-slider-mark-label {
		color: #a1a1a1;
		font-size: 12px;
	}
	
	.vue-slider-process {
		background-color: #1f79f3;
	}
	
	.vue-slider-dot-tooltip-inner {
		border-color: #1f79f3;
		background-color: #1f79f3;
		font-size: 12px;
	}
	
	.vue-slider-marks .vue-slider-mark:first-child .vue-slider-mark-label {
		margin-left: 15px;
	}
	
	.vue-slider-marks .vue-slider-mark:last-child .vue-slider-mark-label {
		margin-left: -10px;
	}
	/*侧边栏选中按钮*/
	
	.item-divider .legendbox,
	.sfqitem .legendbox {
		background: #fff;
		width: 75%;
		float: right;
		font-weight: 300;
	}
	
	.item-divider .legendbox .hitem,
	.sfqitem .legendbox .hitem {
		background: #f5f5f5;
		color: #a1a1a1;
		line-height: 25px;
		width: 30%;
	}
	
	.item-divider .legendbox .hitem:active,
	.sfqitem .legendbox .hitem:active {
		background: #ccc;
	}
	
	.item-divider .legendbox .action,
	.sfqitem .legendbox .action {
		background: #1f79f3;
		color: #fff;
	}
	
	.vue-slider-mark-step {
		width: 1px;
		height: 9px;
		top: -8px !important;
	}
	
	.loading-container {
		z-index: 999999999999999999999999999999;
	}
	
	.input .item {
		border: 1px solid #fff;
		background: #fff;
	}
	
	.navbar-container .button {
		font-weight: 700;
	}
</style>