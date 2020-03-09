<template>
	<div class="testSteps">
		<el-steps :active="stepOptions.active" :space='120' align-center finish-status="success">
			<el-step v-for="item in stepOptions.titleList" :title="item"></el-step>
		</el-steps>
		
		<el-button style="margin-top: 12px;" @click="nextMethod">下一步</el-button>
	</div>
</template>

<script>
	export default {
		props:{
			stepOptions:{
				type:Object,
				default: () => ({
					active: 0,
					titleList:['步骤一','步骤二']
				})
			}
		},
	    methods: {
	      nextMethod() {
			let option = this.stepOptions
	        if (option.active++ > option.titleList.length - 1) option.active = 0;
	      }
	    }
	}
</script>

<style lang="scss">
	.testSteps{
		.el-steps{
			.el-step__title{
				color: #303133;
			}
			.el-step__head.is-process{
				.el-step__icon{
					background: rgb(254,152,0);
					border: none;
					.el-step__icon-inner{
						color: #FFFFFF;
					}
				}
			}
			.el-step__head.is-success{
				color: #c0c4cc ;
				border-color: #c0c4cc;
				.el-step__icon{
					border: 2px solid rgb(254,152,0);
					.el-step__icon-inner{
						color: rgb(254,152,0);
					}
				}
				
			}
			.el-step__title{
				font-size: 14px;
				font-weight: 500;
			}
			.el-step__title.is-success{
				color:#303133;
			}
		}
	}
</style>