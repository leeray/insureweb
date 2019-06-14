<template>
	<div class="page-content padding padding-top">
		<scroller ref="scroller2">
			<template v-for="(item,idx) in orgOptions">
				<div class="list von-radio" style="padding-top: 44px; margin-bottom: 0px">
					<label class="item item-borderless item-icon-left" @click="check(item, $event)">
				<div class="hairline-top"> </div> 
			<input type="radio" name="von-radio-ppn" :value="item.name"> 
				<i class="icon ion-ios-checkmark" :class="{ 'assertive': org[item.name], 'grey': !org[item.name]}"></i> <span>{{item.value}}</span> 
			</label>
				</div>

				<template v-if="item.c.length > 0" v-for="(ic,idxc) in item.c">
					<div class="list von-radio" style="padding-top: 0px;margin-bottom: 0px">
						<label class="item item-borderless item-icon-left" @click="check(ic, $event)">
							<div class="hairline-top"> </div> 
							<input type="radio" name="von-radio-ppn" :value="ic.name"> 
							<i class="icon ion-ios-checkmark"  :class="{ 'assertive': org[ic.name], 'grey': !org[ic.name]}"></i> <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ic.value}}</span> 
						</label>
					</div>

					<template v-if="ic.c.length > 0" v-for="(icc,idxcc) in ic.c">
						<div class="list von-radio" style="margin-bottom: 0px">
							<label class="item item-borderless item-icon-left" @click.stop="check(icc, $event)">
							<div class="hairline-top"> </div> 
							<input type="radio" name="von-radio-ppn" :value="icc.name"> 
							<!--org[icc.name]?'assertive':'grey'-->
							<i class="icon ion-ios-checkmark" :class="{ 'assertive': org[icc.name], 'grey': !org[icc.name]}"></i> <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{icc.value}}</span> 
						</label>
						</div>
					</template>

				</template>

			</template>

		</scroller>
	</div>
</template>
<script>
	import util from '../../static/util';
	export default {
		data() {
			return {
				org: {},
				orgOptions: [],
			}
		},
		created() {
			this.org = util.checkOrg; 
			this.orgOptions = util.Organization;
			debugger;
		},
		mounted: function() {
			this.$nextTick(function() {
				setTimeout(() => {
					if(this.$refs.scroller2)
						this.$refs.scroller2.resize()
				});
			});
		},
		methods: {
			check: function(item, event) {
				debugger;
				if(event) {
					event.preventDefault();
				}
				var v = !this.org[item.name];
				this.$set(this.org, item.name, v);
				if(item.p){
					this.$set(this.org, 'value', item.p.value);
				}else{
					this.$set(this.org, 'value', item.value);
				}
				
				
				
				if(item.c) {
					for(var i = 0; i < item.c.length; i++) {
						this.$set(this.org, item.c[i].name, v);
						this.$set(this.org, 'isP', item.name);

						if(item.c[i].c) {
							for(var j = 0; j < item.c[i].c.length; j++) {
								this.$set(this.org, item.c[i].c[j].name, v);
							}
						}

					}
				}else{
					this.$set(this.org, 'isP', false);
				}

				util.checkOrg = this.org;

			}
		}
	}
</script>

<style></style>