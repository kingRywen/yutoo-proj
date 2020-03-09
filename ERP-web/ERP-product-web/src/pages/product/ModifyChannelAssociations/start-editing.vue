<template lang="html">
    <div class="start-editing">
        <el-tabs type="border-card">
            <el-tab-pane label="用户管理">

                <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="135px" class="editForm">
                    <div class="flex">
                        <el-form-item label="销售类型：" prop="type">
                            <el-select v-model="editForm.type" @change="changeType">
                                <el-option :label="item.label" :value="item.value" v-for="item in editTypeList"></el-option>
                            </el-select>
                            <el-popover placement="top-start"  width="250" trigger="hover">
                                <p>选择跟卖，为跟卖产品</p>
                                <p>选择自主上架，表示为自己的新产品</p>
                                <i slot="reference" class="el-icon-question icon"/>
                            </el-popover>
                        </el-form-item>
                        <!--  -->
                        <el-form-item label="跟卖产品ASIN：" prop="tail" v-show="typeStatus">
                            <el-input v-model.trim="editForm.tail"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="亚马逊类别：" prop="tail">
                        <el-cascader :options="[]"></el-cascader>
                    </el-form-item>
                    <el-form-item label="选择模板：" prop="template">
                        <el-select v-model="editForm.template">
                           <el-option :label="item.label" :value="item.value" v-for="item in editTypeList"></el-option>
                        </el-select>
                    </el-form-item>

                    <div class="flex" v-show="typeStatus">
                        <el-form-item label="选择策略：" prop="strategy">
                            <el-select v-model="editForm.strategy">
                                <el-option :label="item.label" :value="item.value" v-for="item in editTypeList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" style="height:40px;margin-left:20px;">添 加</el-button>
                    </div>

                    <el-form-item class="next">
                        <el-button type="primary" @click="onNext('editForm')">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>




    </div>
</template>

<script>
export default {
    data() {
        return {
            editTypeList: [
                {
                    label: "自主上架",
                    value: 0
                },{
                    label: "跟卖",
                    value: 1
                }
            ],
            editFormRules: {
                type: [{
                    required: true,
                    message: '请选择类型',
                    trigger: 'change'
                }],
                template: [{
                    required: true,
                    message: '请选择模板',
                    trigger: 'change'
                }],
            },
            typeStatus: false,
            editForm: {
                type: null,
                template:'',
                tail: "",
                strategy:'',
            },

        }
    },
    methods: {
        //切换销售类型
        changeType(val) {
            this.typeStatus = val?true:false;
            if(val){
                this.$set(this.editFormRules,"tail",[{required: true,message: '请輸入产品ASIN',trigger: 'blur'}])
                this.$set(this.editFormRules,"strategy",[{required: true,message: '请选择策略',trigger: 'change'}])
            }else{
                if(this.editFormRules.hasOwnProperty('tail'))delete this.editFormRules.tail
                if(this.editFormRules.hasOwnProperty('strategy'))delete this.editFormRules.strategy
            }
        },
        //下一步
        onNext(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.editForm)
                    this.$emit("oneNext",this.editForm)
                } else {
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    flex-direction: row;
    .icon {
        font-size: 20px;
        margin: 0 10px;
        color: #6de2a5;
    }
}
.next {
    margin-top: 100px;
}
</style>
