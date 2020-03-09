<template>
    <div>
        <div style='padding-bottom:6px;'>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
                <div style='border-bottom:1px solid #dcdcdc;padding-bottom:16px;'>
                    <div style='font-size:15px;'><b>细化分类 : {{addName.name}}</b></div>
                    <div style='margin-top:4px;'>根据特定品牌、价格范围、星级和Prime配送资格，细化分类。</div>
                </div>
                <div>
                    <p> <b>品牌</b> </p>
                    <el-select v-model="ruleForm.brands" multiple collapse-tags placeholder="请选择" size="small" style='width:350px' clearable>
                        <el-option
                        v-for="item in brandsOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <p> <b>商品价格范围</b> </p>
                    <div style='display:flex;'>
                        <el-form-item label="" prop="priceMin" style='width:30%;'>
                            <el-input placeholder="请输入" v-model="ruleForm.priceMin" size='small' clearable>
                                <template slot="prepend">$</template>
                            </el-input>
                        </el-form-item>
                        <div style='width:5%;text-align:center;line-height: 40px;'>~</div>
                        <el-form-item label="" prop="priceMax" style='width:30%;'>
                            <el-input placeholder="请输入" v-model="ruleForm.priceMax" size='small' clearable>
                                <template slot="prepend">$</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
                <div>
                    <p> <b>查看星级评定</b> </p>
                    <div style='width:90%;display:flex;'>
                        <div style='width:70%;'>
                            <el-slider
                                v-model="ruleForm.graded"
                                range
                                show-stops
                                :max="5">
                            </el-slider>
                        </div>
                        <div style='line-height: 36px;margin-left:40px;'>
                            <b>{{ruleForm.graded[0]}} - {{ruleForm.graded[1]}} 星</b> 
                        </div>
                    </div>
                </div>
                <div>
                    <p> <b>配送</b> </p>
                    <div>
                        <el-radio v-model="ruleForm.primeEligible" label="1">所有</el-radio>
                        <el-radio v-model="ruleForm.primeEligible" label="2">具备Perime资格</el-radio>
                        <el-radio v-model="ruleForm.primeEligible" label="3">不具备Perime资格</el-radio>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    props:['addName','brandsOpts'],
    data() {
        let validateNumPass = (rule, value, callback) => {
            if (value && isNaN(Number(value)) ) {
                return callback(new Error('请输入数字'));
            }else{
                if (value && rule.field === 'priceMin') {
                    this.ruleForm.priceMin =  Math.abs( +this.ruleForm.priceMin )
                } else if ( value && rule.field === 'priceMax') {
                    this.ruleForm.priceMax = Math.abs( +this.ruleForm.priceMax )
                }
            }
            callback()
        };
        return {
            ruleForm:{
                brands:null,
                priceMin:null,
                priceMax:null,
                graded:[0,5],
                primeEligible:'1',
            },
            rules:{
                priceMax:[
                    { validator: validateNumPass, trigger: 'change' }
                ],
                priceMin:[
                    { validator: validateNumPass, trigger: 'change' }
                ],
            },
            
            
        };
    },
    methods: {
        saveBtn(){
            return this.$refs.ruleForm.validate().then(() => {
				let form = this.ruleForm
				let brandsList = []
				if(form.brands && form.brands.length){
					form.brands.forEach((e)=>{
						brandsList.push({
							id:e,
							name:this.brandsOpts.find(i=>i.value === e).label
						})
					})	
				}				
				
                let params = {}
                params.name = this.addName.name
                params.pcid = this.addName.pcid
                params.brands = brandsList.length ? brandsList : null
                params.priceMin = this.ruleForm.priceMin
                params.priceMax = this.ruleForm.priceMax
                params.reviewMin = this.ruleForm.graded[0] == 0 ? null : this.ruleForm.graded[0]
                params.reviewMax = this.ruleForm.graded[1] == 5 ? null : this.ruleForm.graded[1]
                params.primeEligible = this.ruleForm.primeEligible === "1" ? null : this.ruleForm.primeEligible  === '2' ? true : false
				
                return  Promise.resolve(params)
            })
        }
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>
