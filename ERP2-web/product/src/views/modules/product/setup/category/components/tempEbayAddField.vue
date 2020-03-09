<template>
    <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="字段名称" prop="propertyNameEn">
                <el-input v-model="form.propertyNameEn"></el-input>
            </el-form-item>
            <el-form-item label="关联字段">
                <el-input v-model="form.basePropertyName" disabled class="relation_input">
                    <el-button slot="append" style="background:#3AB6FE;color:#fff;" @click="selectField">选择关联字段</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="字段类型" prop="fieldType">
                <el-select v-model="form.fieldType" style="width:100%" @change="changefieldType">
                    <el-option :label="i.label" :value="i.value" v-for="(i,j) in fieldTypeList" :key="j" />
                </el-select>
            </el-form-item>
            <!--  -->
            <el-row v-if="form.fieldType==1">
                <el-col :span="12">
                    <el-form-item label="yes自定义名称" prop="yesName">
                        <el-input v-model="form.yesName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="no自定义名称" prop="noName">
                        <el-input v-model="form.noName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item v-if="form.fieldType==2 || form.fieldType==3 ||form.fieldType==10 || form.fieldType==11" label="字段长度" prop="dataMaxLength">
                <el-input type="age" v-model.number="form.dataMaxLength"></el-input>
            </el-form-item>
            <el-form-item v-if="form.fieldType==3" label="小数点位数" prop="decimalPlaces">
                <el-input type="age" v-model.number="form.decimalPlaces"></el-input>
            </el-form-item>
            <el-form-item v-if="form.fieldType==6 || form.fieldType==7 || form.fieldType==8 || form.fieldType==9 || form.fieldType==12" label="选项值" prop="controlValue">
                <el-tag :key="index" v-for="(tag,index) in form.controlValue" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">点击添加</el-button>
            </el-form-item>
            <!--  -->
            <el-form-item label="是否必填">
                <el-switch v-model="form.mustFlag" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="是否店铺差异">
                <el-switch v-model="form.storeFlag" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="是否变体差异">
                <el-switch v-model="form.variantsDifferenceFlag" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="字段描述">
                <el-input type="textarea" v-model="form.propertyDesc" />
            </el-form-item>
            <el-form-item label="中文翻译">
                <el-input v-model="form.propertyNameCn" />
            </el-form-item>
            <!--  -->
            <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" append-to-body>
                <associated-fields ref="associatedfields" />
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialog.visible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </span>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>
import AssociatedFields from './associatedFields';
export default {
    components: { AssociatedFields },
    data() {
        return {
            form: {
                propertyNameEn: null,
                basePropertyName: null,
                controlValue: [],
                propertyNameCn: null,
                propertyDesc: null,
                yesName: null,
                noName: null,
                propertyType: 1,
                fieldType: null,
                decimalPlaces: null,
                mustFlag: 0,
                storeFlag: 0,
                variantsDifferenceFlag: 0
            },
            rules: {
                propertyNameEn: [
                    {
                        required: true,
                        message: '请输入字段名称',
                        trigger: 'blur'
                    }
                ],
                fieldType: [
                    {
                        required: true,
                        message: '字段类型不能为空',
                        trigger: 'change'
                    }
                ],
                yesName: [
                    {
                        required: true,
                        message: '此项不能为空',
                        trigger: 'blur'
                    }
                ],
                noName: [
                    {
                        required: true,
                        message: '此项不能为空',
                        trigger: 'blur'
                    }
                ],
                dataMaxLength: [
                    {
                        required: true,
                        message: '长度不能为空',
                        trigger: 'blur'
                    },
                    { type: 'number', message: '必须为数字值' }
                ],
                decimalPlaces: [
                    {
                        required: true,
                        message: '位数不能为空',
                        trigger: 'blur'
                    },
                    { type: 'number', message: '必须为数字值' },
                    { message: '范围在1~4位', pattern: /^[1-4]$/ }
                ],
                controlValue: [
                    {
                        type: 'array',
                        required: true,
                        message: '至少需要一个选择值',
                        trigger: 'change'
                    }
                ]
            },
            fieldTypeList: [
                { label: '是否', value: 1 },
                { label: '整数', value: 2 },
                { label: '小数', value: 3 },
                { label: '日期', value: 4 },
                { label: '时间', value: 5 },
                { label: '单选项', value: 6 },
                { label: '选择框-单选', value: 7 },
                { label: '选择框-多选', value: 8 },
                { label: '复选框', value: 9 },
                { label: '文本框', value: 10 },
                { label: '多行文本框', value: 11 },
                { label: '输入/选择', value: 12 }
            ],
            inputVisible: false,
            inputValue: '',
            dialog: {
                title: '',
                visible: false,
                width: '70%'
            }
        };
    },
    methods: {
        changefieldType(v) {
            const obj = this.fieldTypeList.find(i => i.value == v);
            this.form['fieldTypeName'] = obj.label;
        },
        submit() {
            this.$refs.associatedfields.submitForm(data => {
                this.form = Object.assign({}, this.form, data);
                this.dialog.visible = false;
            });
        },
        selectField() {
            this.dialog.title = '选择关联字段';
            this.dialog.visible = true;
            this.$nextTick(() => {
                this.$refs.associatedfields.init();
            });
        },
        handleClose(tag) {
            this.form.controlValue.splice(
                this.form.controlValue.indexOf(tag),
                1
            );
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                if (!this.form.controlValue.find(i => i == inputValue)) {
                    this.form.controlValue.push(inputValue);
                } else {
                    this.$message.warning('选项值请不要重复');
                }
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        submitForm(cb) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    cb && cb(this.form);
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.form.propertyNameCn = null;
            this.form.propertyDesc = null;
            if (this.form.basePropertyName) {
                this.form.basePropertyName = null;
                this.form.basePropertyId = null;
            }
            this.$refs.form.resetFields();
        },
        edit(row) {
            this.form = { ...row };
        }
    }
};
</script>

<style lang="scss">
.relation_input {
    .el-input__inner {
        background-color: #fff !important;
        cursor: default !important;
        color: #333 !important;
    }
}
</style>
<style>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>