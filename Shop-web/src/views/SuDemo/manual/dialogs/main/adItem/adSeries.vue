<template>
    <div>
        <!-- 创建广告活动 -->
        <div class='item'>
            <div class="tit">
                广告活动
            </div>
            <div class="cont">
                <div class='form'>
                    <el-form :label-position="'top'" label-width="80px" :model="adCampaign" ref='adCampaign' :rules='adCampaignRules'>
                        <el-form-item label="广告系列名称" prop='name'>
                            <el-input v-model.trim="adCampaign.name" size="small" style='width:500px' clearable></el-input>
                        </el-form-item>
                        <el-form-item label="开始时间" prop='startDate' >
                            <el-date-picker
                                v-model="adCampaign.startDate"
                                type="date"
                                size="small" 
                                value-format='yyyy-MM-dd'
                                style='width:500px'
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop='endDate'>
                            <el-date-picker
                                size="small" 
                                style='width:500px'  
                                value-format='yyyy-MM-dd' 
                                v-model="adCampaign.endDate"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="投放类型" prop='targetingType'>
                            <el-select disabled v-model="adCampaign.targetingType" placeholder="请选择" size="small" style='width:500px' clearable >
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='每日预算'  prop='dailyBudget' style="margin-bottom: 20px;">
                            <el-input placeholder="请输入值" v-model.trim.number="adCampaign.dailyBudget"  clearable size="small" style='width:500px'>
                                <template slot="prepend">$</template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 完 -->
        <!-- 广告活动竞争策略 -->
        <div class='item' style='margin-top:20px;'>
            <div class="tit">
                广告活动竞争策略
            </div>
            <div class="cont">
                <div class='div-item' style='padding-bottom:20px;'>
                    <div style='display:inline-block;'>
                        是否开启竞价:
                    </div>
                    <div style='display:inline-block;margin-left:30px;'>
                        <input type="radio" name="premiumBidAdjustment" id="three" value="true"  v-model='premiumBidAdjustment'>
                        <label for="three" style='margin-left:6px;'>是</label>
                   </div>
                    <div style='display:inline-block;'>
                        <input type="radio" name="premiumBidAdjustment" id="threes" value="false"  v-model='premiumBidAdjustment'>
                        <label for="threes" style='margin-left:6px;'>否</label>
                   </div>
                </div>
            </div>
        </div>                  
    </div>
</template>

<script>
export default {
	props:['params'],
    data() {
        let dailyBudgetValidatePass = (rule, value, callback) => {
            console.log(rule);
            if (!value) {
                return callback(new Error('请输入每日预算'));
            };
            if(isNaN(Number(value))){
                 return callback(new Error('请输入数字'));
            };         
            callback()
        };
        return {		
            //广告活动的表单
            adCampaign:{
                name:"",
                startDate:"",
                endDate:"",
                targetingType:null,
                dailyBudget:null,
            },
            adCampaignRules:{
                name:[
                    { required: true, message: '请输入广告系列名称', trigger: 'blur' }
                ],
                startDate:[
                    { required: true, message: '请选择开始时间', trigger: ['blur'] }
                ],
                // endDate:[
                //     { required: true, message: '请选择结束时间', trigger: ['blur'] }
                // ],
                targetingType:[
                    { required: true, message: '请选择投放类型', trigger: 'blur' }
                ],
                dailyBudget:[
                    { required: true, validator: dailyBudgetValidatePass, trigger: 'blur' }
                ],
            },
            typeOptions:[
                {label:"手动",value:'manual'},
                {label:"自动",value:'auto'},
            ],
            premiumBidAdjustment:false,
        };
    },
    methods: {
		_submit(){
		    return this.$refs.adCampaign.validate().then(()=>{			
				let form = this.adCampaign
				let params = {
					...this.storeIds,
					campaignIds:[this.params.objectId],
					premiumBidAdjustment:this.premiumBidAdjustment,
					name:form.name,
					startDate:form.startDate.split('-').join(''),
					endDate: form.endDate ? form.endDate.split('-').join('') : null,
					dailyBudget:form.dailyBudget
				}
				return this.$api[`adCampaignUpdate`](params).then(data=>{
					return  Promise.resolve(true);
				})				
			})			
		},
    },
    created() {
		let vm = this
		this.$nextTick(function(){
			this.$api['adCampaignInfo']({...vm.storeIds,campaignId:vm.params.objectId}).then((e)=>{
				if(e.code == 0){
					let data = e.data
					vm.adCampaign = {
						name:data.name,
						startDate:data.startDate,
						endDate:data.endDate,
						dailyBudget:data.dailyBudget,
						targetingType:data.targetingType
					}
					vm.premiumBidAdjustment = data.premiumBidAdjustment
				}
			})
		})
    },
   
};
</script>

<style scoped lang="less">
.item{
    border:1px solid #dcdcdc;
    .tit{
        font-size: 18px;
        color:#333;
        padding-left: 4px;
        line-height: 40px;
        border-bottom:1px solid #dcdcdc;
    }
    .cont{
        padding-left: 20px;
        .form{
            /deep/.el-form--label-top .el-form-item__label{
                padding:0 
            }
            /deep/.el-form-item__content{
                padding:0 ;
            }
            /deep/.el-form-item__label {
                line-height: 30px;
                font-size: 14px;
            }
        }
        .formChild{
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 204px;
            }
        }
        .div-item{
            margin-top: 20px;
            &>div:last-child{
                margin-left:16px;
                margin-top:10px;
            }
            /deep/.el-button--text.el-button i {
                font-size: 24px;
            }
        }
        .label{
              margin: 14px 4px;
        }
        .inp{
            margin: 10px 4px;
        }
        
    }
}
.el-form-item {
    margin-bottom: 10px;
}
.adGroup{
    /deep/.el-input__inner{
        border-color: #f56c6c;
    }
}

</style>
