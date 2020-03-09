<template>
    <div class='setPrice'>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px"  size='small'>
             <el-table
                :data="ruleForm.products"
                border
                style="width: 100%">
                <el-table-column
                    prop="sku"
                    label="SKU"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="priceOld"
                    label="原价">
                    <template slot-scope="scope">
                        <el-form-item label="" :rules='getRules(scope.$index)' :prop="'products.' + scope.$index + '.priceOld'">
                            <el-input v-model.trim="scope.row.priceOld" placeholder="请输入值">
                                <template slot="prepend">$</template>
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        
    </div>
</template>

<script>
export default {
    props:['selectSkus','params'],
    data() {
        return {
            ruleForm: {
                products: [
                    {
                        productId :'',
                        priceOld :'',
                    }
                ]
            },
            getRules(index) {
                var validatePass = (rule, value, callback) => {
                //    console.log(rule);
                //    console.log(value);
                   if ( !value || isNaN(Number(value)) ){
                       return callback ( new Error('请输入数字'))
                   }
                   this.ruleForm.products[index].priceOld = Math.abs(+value)
                   callback()
                }
                return {validator: validatePass, trigger: 'blur'}
            }
        };
    },
    methods: {
        saveBtn() {
            return this.$refs.ruleForm.validate().then(()=> {
                return this.$api[this.params.url](
                    {
                        products : this.ruleForm.products,
                        ...this.params.datas
                    }
                )
            })
        }
    },
    created() {
        console.log(this.params);
        this.ruleForm.products = this.selectSkus
    },
};
</script>

<style scoped lang="scss">
.setPrice {
    /deep/{
        .el-form-item__content{
            margin: 0 auto !important;
        }
    }
    .el-form-item{
        margin: 14px 20px;
    }
}

</style>
