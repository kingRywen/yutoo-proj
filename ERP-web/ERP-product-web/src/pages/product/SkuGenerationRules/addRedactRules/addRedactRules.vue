<template lang="html">
    <section class="addRedactRules">
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px" class="rule_content">
                <el-form-item label="规则名称:" prop="ruleName" class="form_item">
                    <el-input v-model="form.ruleName" placeholder="请输入规则名称"/>
                </el-form-item>
                <el-form-item class="form_item" label="店铺名称:" prop="objectId">
                    <el-select v-model="form.objectId" placeholder="请选择店铺">
                        <el-option :label="item.name" :value="item.storeId" v-for='item in selectList'/>
                    </el-select>
                </el-form-item>
                <el-form-item class="form_item" label="规则：" prop="formalList">
                    <div class="lebelBox">
                        <div class="lebel">
                            <el-tooltip class="item" effect="dark" :content="item.description" placement="top"  v-for='item in clickList'>
                                <el-button size="small" @click='add(item)'>{{item.ruleName}}</el-button>
                            </el-tooltip>
                        </div>
                        <div class="lebel" ref="container">
                            <template v-for="(item,index) in formalList">
                                <el-input  :disabled="item.autoFlag?false:true" size="small" class="addinput" v-model.number='form.formalList[index].digit' @input="onPreview(form.formalList[index].digit)">
                                   <template slot="prepend">{{item.ruleName}}</template>
                                   <template v-if="item.autoFlag" slot="append">位数</template>
                                </el-input>
                            </template>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="form_item" label="规则描述：">
                    <div class="textarea">
                        <el-input v-model='form.type' type="textarea" :rows="2"/>
                    </div>
                </el-form-item>
                <el-form-item class="form_item" label="预览：">
                    <div class="preview_inputBox">
                        <!-- <el-input placeholder="输入SKU" v-model="skuinput"/> -->
                        <span v-model="preview">{{preview}}</span>
                    </div>
                </el-form-item>
                <el-form-item class="form_item">
                    <el-checkbox v-model="form.activateFlag">是否激活</el-checkbox>
                </el-form-item>
        </el-form>


        <el-button type="primary" @click="submit('ruleForm')" class="btn">保存</el-button>
    </section>
</template>

<script>
export default {
    name: 'addRedactRules',
    data() {
        return {
            rules: {
                ruleName: [
                    {
                        required: true,
                        message: '请输入规则名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 10,
                        message: '长度在 8 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                objectId: [
                    { required: true, message: '请选择店铺', trigger: 'change' }
                ],
                formalList: [
                    { required: true, message: '请输入规则', trigger: 'blur' }
                ]
            },
            formalList: [],
            preview: '输入规则预览',
            form: {
                ruleName: '',
                formalList: [],
                description: '',
                type: '',
                objectId: '',
                activateFlag: 0
            }
        };
    },
    methods: {
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = this.form;
                    // params.formal = JSON.stringify(params.formal)
                    params.activateFlag = params.activateFlag ? 0 : 1;
                    this.$emit('preserve', params);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //预览
        onPreview(val) {
            console.log(val);
            this.preview = val;
        },
        //添加规则按钮
        add(curitem) {
            if (this.formalList.length) {
                if (
                    this.formalList.find(
                        item => item.globalSkuRuleId === curitem.globalSkuRuleId
                    )
                )
                    return;
                this.formalList.push(curitem);
            } else {
                this.formalList.push(curitem);
            }
        }
    },
    watch: {
        formalList(val) {
            this.form.formalList = [];
            val.forEach((item, index) => {
                this.form.formalList.push(
                    Object.assign(
                        {},
                        {
                            key: item.ruleKey,
                            digit: '',
                            content: item.autoFlag ? 0 : 1,
                            auto: item.autoFlag ? 1 : 0,
                            sort: index
                        }
                    )
                );
            });
        },
        status(val) {
            console.log(val);
            //添加
            // if(this.status){
            //     for(let key in this.form){
            //         if(key=='formalList'){
            //             this.form[key] = []
            //             continue
            //         };
            //         if(key=='activateFlag'){
            //             this.form[key] = 0
            //             continue
            //         };
            //         this.form[key] = ''
            //     }
            // }
        }
    },
    props: {
        selectList: {
            type: Array,
            default: []
        },
        clickList: {
            type: Array,
            default: []
        },
        status: {
            type: Boolean,
            defaltu: ''
        }
    }
};
</script>
<style lang="scss">
.addinput {
    width: 100px;
    margin-right: 5px;
    .el-input-group__prepend,
    .el-input-group__append {
        padding: 0 10px;
    }
    .el-input__inner {
        min-width: 50px;
    }
}
.rule_content {
    .form_item {
        .el-select {
            width: 100%;
        }
        .lebelBox {
            display: flex;
            flex-direction: row;
            .lebel {
                min-height: 200px;
                // height: auto;
                width: 300px;
                padding: 10px;
                border: 1px solid #dcdfe6;
                border-radius: 5px;
                margin-right: 10px;
                .el-button {
                    float: left;
                    margin: 0 10px 10px 0;
                }
                &:last-child {
                    flex: 1;
                    margin-right: 0;
                }
            }
        }
        .preview_inputBox {
            .el-input {
                width: 160px;
                input {
                    text-align: center;
                }
            }
            span {
                line-height: 40px;
                margin-left: 10px;
            }
        }
        &:last-child {
            div {
                margin-left: 80px;
            }
        }
        .textarea {
            .el-textarea__inner {
                resize: none;
                height: 83px;
            }
        }
    }
}
.btn {
    width: 200px;
    position: relative;
    left: 50%;
    margin-left: -100px;
}
</style>
