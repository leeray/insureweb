<template>
	<div class="page has-navbar" v-nav="{hideNavbar:true}" style="padding-top: 50px;">
		<von-header>
			<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			<span slot="title" @click="back">推送名单</span>
		</von-header>
		<von-input type="text" v-model="from.pd_title" placeholder="批次主题" label="批次主题"></von-input>
		<datepicker v-model="from.pd_startdate" label="任务开始时间" date-format="yyyy-mm-dd"></datepicker>
		<datepicker v-model="from.pd_enddate" label="任务结束时间" date-format="yyyy-mm-dd"></datepicker>
		<md-button class="button button-positive" style="  width: 80%; margin-left: 10%;  margin-top: 30px;" @click.native="push">
			推送
		</md-button>
	</div>
</template>
<script>
	import util from '../../static/util';
	export default {
		data() {
			return {
				from: {
					pd_title: '',
					pd_startdate: util.getDate(),
					pd_enddate: util.getDate(),
				}
			}
		},
		created() {
			debugger;
		},
		mounted: function() {

		},
		methods: {
			push: function() {
				debugger;
				if(util.push[this.$route.query.randomid]) {
					$toast.show('已推送过名单了。', 1500);
					return;
				}
				if(this.from.pd_title == '') {
					$toast.show('请输入批次主题!', 1500);
					return;
				}
				var a = parseInt(this.from.pd_startdate.replace(/-/g, ""));
				var b = parseInt(this.from.pd_enddate.replace(/-/g, ""));
				if(a > b) {
					$toast.show('请正确选择任务时间!', 1500);
					return;
				}

				var data = this.from;
				data.randomid = this.$route.query.randomid;
				data.uid = this.$route.query.uid;
				data.zhuti = this.$route.query.zhuti;
				data.gl_jigouhao = this.$route.query.gl_jigouhao;
				$loading.show('正在推送...');
				util.ajax.post(util.pushdata, data).then(res => {
					debugger;
					if(res.status == 200) {
						util.push[this.$route.query.randomid] = true;
						$toast.show(res.message, 1500);
					} else {
						$toast.show(res.message, 1500);
					}
				}).catch(err => {
					$toast.show('推送失败!', 1500);
					console.log(err);
				});
			},
			back: function() {
				//$router.go(-1);
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
	.input-label {
		font-size: 16px !important;
	}
</style>