<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" size="small">
        <el-form-item label="规格名称" prop="normName">
            <el-input v-model="ruleForm.normName"></el-input>
        </el-form-item>
        <el-form-item label="尺寸单位" prop="sizeUnit">
            <el-select v-model="ruleForm.sizeUnit" style="width:100%;">
                <el-option label="cm" value="1"></el-option>
                <el-option label="dm" value="2"></el-option>
                <el-option label="m" value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="长" prop="valueLength">
            <!-- <el-input v-model.number="ruleForm.valueLength" type="number"></el-input> -->
            <el-input-number v-model.number="ruleForm.valueLength" :precision="2" :step="0.1" :min="0" controls-position="right" style="width:100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="宽" prop="valueWidth">
            <!-- <el-input v-model.number="ruleForm.valueWidth" type="number"></el-input> -->
            <el-input-number v-model.number="ruleForm.valueWidth" :precision="2" :step="0.1" :min="0" controls-position="right" style="width:100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="高" prop="valueHigh">
            <!-- <el-input v-model.number="ruleForm.valueHigh" type="number"></el-input> -->
            <el-input-number v-model.number="ruleForm.valueHigh" :precision="2" :step="0.1" :min="0" controls-position="right" style="width:100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="normDesc">
            <el-input type="textarea" class="textarea" v-model="ruleForm.normDesc"></el-input>
        </el-form-item>
        <el-form-item>
            <el-checkbox v-model="ruleForm.activatedFlag" true-label="1" false-label="0">是否启用</el-checkbox>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            ruleForm: {
                normName: '',
                sizeUnit: '',
                valueLength: '',
                valueWidth: '',
                valueHigh: '',
                normDesc: '',
                activatedFlag: '0'
            },
            rules: {
                normName: [
                    {
                        required: true,
                        message: '请输入规格名称,长度20个字符',
                        trigger: 'change',
                        pattern: /^[\s\S]{0,20}$/
                    }
                ],
                sizeUnit: [
                    {
                        required: true,
                        message: '请选择单位',
                        trigger: 'change'
                    }
                ],
                valueLength: [
                    {
                        required: true,
                        message: '请输入长度',
                        trigger: 'change'
                        // pattern: /^(1|[1-9][0-9]*)$/
                    }
                ],
                valueWidth: [
                    {
                        required: true,
                        message: '请输入宽度',
                        trigger: 'change'
                        // pattern: /^(1|[1-9][0-9]*)$/
                    }
                ],
                valueHigh: [
                    {
                        required: true,
                        message: '请输入高度',
                        trigger: 'change'
                        // pattern: /^(1|[1-9][0-9]*)$/
                    }
                ],
                normDesc: [
                    {
                        required: false,
                        message: '备注不能为空',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    methods: {
        edit(wmPickingBasketNormId) {
            this.$api['warehouse/WmPickingBasketNormInfo']({
                wmPickingBasketNormId
            }).then(res => {
                let {
                    normName,
                    sizeUnit,
                    valueLength,
                    valueWidth,
                    valueHigh,
                    normDesc,
                    activatedFlag
                } = res.rows;
                this.ruleForm.normName = normName;
                this.ruleForm.sizeUnit = sizeUnit;
                this.ruleForm.valueLength = Number(valueLength);
                this.ruleForm.valueWidth = Number(valueWidth);
                this.ruleForm.valueHigh = Number(valueHigh);
                this.ruleForm.normDesc = normDesc;
                this.ruleForm.activatedFlag = activatedFlag;
            });
        },
        submitForm(cb) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    cb && cb(this.ruleForm);
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        }
    }
};
</script>
