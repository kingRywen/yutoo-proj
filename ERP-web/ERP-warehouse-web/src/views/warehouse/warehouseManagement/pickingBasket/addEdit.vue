<template>
    <div class="contentform">
        <el-form :model="ruleForm" ref="ruleForm" label-width="85px" size="small" @validate="validate">
            <el-form-item label="选择仓库：" prop="warehouseId" :rules="[
          { required: true, message: '请选择仓库', trigger: 'change' },          
        ]">
                <el-select v-model="ruleForm.warehouseId" style="width:100%;">
                    <el-option :label="i.label" :value="i.value" :key="i.label" v-for="i in $store.state.daily.warehouseList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="篮子编码：" prop="basketModels" :rules="[
          { required: _isBatch?false:true,message: '编码须为数字，英文，-，长度24以内', trigger: 'blur',pattern:/^[A-Za-z0-9][A-Za-z0-9-]{0,24}$/  },
        ]">
                <el-row>
                    <el-col :span="editBoole?18:24" v-if="!isBatch">
                        <el-input v-model="ruleForm.basketModels"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button v-if="editBoole" type="primary" plain style="margin-left:10px;" @click="changeIsBatch">{{isBatch?'取消批量生成编码':'批量生成编码'}}</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-collapse-transition>
                <div v-if="isBatch">
                    <div class="formitem">
                        <el-form-item class="marleft1" label="批量添加：" prop="prefix" :rules="[
              { required: true,pattern:/^[A-Za-z0-9][A-Za-z0-9-]{0,9}$/ , trigger: 'change',message:'须为数字/英文,长度10' },
            ]">
                            <el-row>
                                <el-col :span="6" class="textCenter">前缀</el-col>
                                <el-col :span="18">
                                    <el-input v-model="ruleForm.prefix" placeholder="英文/数字"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <!--  -->
                        <el-form-item class="marleft2" prop="min" label="从" :rules="[
              { required: true, validator: minRules, trigger: 'blur' },
            ]">
                            <!-- <el-row>
                <el-col :span="4" class="textCenter">从</el-col>
                <el-col :span="20">
                  
                </el-col>
                            </el-row>-->
                            <el-input style="width:100%;" v-model="ruleForm.min" controls-position="right" @change="changeMin" placeholder="开 始" type="number"></el-input>
                        </el-form-item>
                        <el-form-item class="marleft3" prop="max" label="到" :rules="[
              { required: true,  validator: maxRules, trigger: 'change' },
            ]">
                            <el-row>
                                <!-- <el-col :span="3" class="textCenter">到</el-col> -->
                                <el-col :span="10">
                                    <el-input style="width:100%;" v-model="ruleForm.max" controls-position="right" placeholder="结 束" type="number"></el-input>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain style="margin-left:10px;" @click="generate">生成到文本款</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </div>
                    <!--  -->
                    <el-form-item :label="ruleForm.generateList.length?`共${ruleForm.generateList.length}条`:''" prop="generateList" :rules="[
              { required: true, message: '请生成编码', trigger: 'change' },
            ]">
                        <div class="generate" :style="generateStyle">
                            <ul>
                                <li v-for="(item,index) in ruleForm.generateList" :key="index">
                                    <span>{{item}}</span>
                                    <el-button type="text" icon="el-icon-delete" @click="del(index)"></el-button>
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                </div>
            </el-collapse-transition>
            <el-form-item label="篮子规格：" prop="wmPickingBasketNormId" :rules="[
          { required: true, message: '请选择规格', trigger: 'change' },          
        ]">
                <el-row>
                    <el-col :span="10">
                        <el-select v-model="ruleForm.wmPickingBasketNormId" style="width:100%;">
                            <el-option :label="i.label" :value="i.value" :key="i.label" v-for="i in wmPickingBasketNormList"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" plain style="margin-left:10px;" @click="specifications">规格管理</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="是否激活：" prop="activatedFlag">
                <el-checkbox v-model="ruleForm.activatedFlag" :true-label="1" :false-label="0"></el-checkbox>
            </el-form-item>
        </el-form>
        <!--  -->
        <el-dialog title="拣货篮规格管理" :visible.sync="visible" width="1100px" :append-to-body="true">
            <div style="height: 550px;overflow-y: auto;">
                <specifications></specifications>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import specifications from './specifications';
import { mapGetters } from 'vuex';
export default {
    components: {
        specifications
    },
    data() {
        return {
            isBatch: false,
            prefix: (rule, value, callback) => {
                const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if (!value) {
                    return callback(new Error('前缀不能为空'));
                }
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('须为中英文或数字'));
                }
            },
            minRules: (rule, val, callback) => {
                let value = Number(val);
                const reg = /(^[1-9][0-9]$)|(^101&)|(^[1-9]$)$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('须为1-99的整数值'));
                }
            },
            maxRules: (rule, val, callback) => {
                let value = Number(val);
                const reg = /(^[1-9][0-9]$)|(^101&)|(^[1-9]$)$/;
                if (!reg.test(value)) {
                    callback(new Error('须为1-99的整数值'));
                } else if (this.ruleForm.min > value) {
                    callback(new Error('须大于开始时间'));
                } else {
                    callback();
                }
            },
            ruleForm: {
                warehouseId: '',
                basketModels: '',
                wmPickingBasketNormId: '',
                activatedFlag: '0',
                //
                prefix: '',
                min: '1',
                max: '',
                generateList: []
            },
            generateStyle: 'border: 1px solid #ebeef5;',
            isClick: {
                prefix: false,
                min: false,
                max: false
            },
            editBoole: true,
            visible: false
        };
    },
    computed: {
        _isBatch() {
            return this.isBatch;
        },
        ...mapGetters(['wmPickingBasketNormList'])
    },
    methods: {
        //規格管理
        specifications() {
            this.visible = true;
        },
        validate(val, boole) {
            for (let k in this.isClick) {
                if (k == val) {
                    this.isClick[k] = boole;
                }
            }
        },
        changeMin(val) {
            if (val > this.ruleForm.max) {
                this.ruleForm.max = '';
            }
        },
        add() {
            this.editBoole = true;
        },
        edit(wmPickingBasketId) {
            this.editBoole = false;
            this.$api['warehouse/WmPickingBasketInfo']({
                wmPickingBasketId
            }).then(res => {
                console.log(res);
                let {
                    wmWarehouseId,
                    wmPickingBasketNormId,
                    basketModel,
                    activatedFlag
                } = res.rows;
                this.ruleForm.warehouseId = wmWarehouseId;
                this.ruleForm.basketModels = basketModel;
                this.ruleForm.wmPickingBasketNormId = wmPickingBasketNormId;
                this.ruleForm.activatedFlag = activatedFlag;
            });
        },
        //文本款删除
        del(index) {
            this.ruleForm.generateList.splice(index, 1);
        },
        //生成到文本款
        generate() {
            this.$refs.ruleForm.validateField('prefix');
            this.$refs.ruleForm.validateField('min');
            this.$refs.ruleForm.validateField('max');
            this.ruleForm.generateList = [];
            let {
                ruleForm: { prefix, min, max, generateList }
            } = this;
            let arr = Object.values(this.isClick);
            if (arr.every(item => item)) {
                let arr = [];
                let len = Number(max) + 1;
                for (let i = Number(min); i < len; i++) {
                    arr.push(prefix + '' + i);
                }
                this.ruleForm.generateList = arr;
                this.generateStyle = 'border: 1px solid #4CAF50;';
                this.$refs.ruleForm.validateField('generateList');
            }
        },
        //取消批量生成编码
        changeIsBatch() {
            this.isBatch = !this.isBatch;
            setTimeout(() => {
                if (this.isBatch) {
                    this.$refs.ruleForm.validateField('basketModels');
                    if (this.ruleForm.generateList.length) {
                        this.generateStyle = 'border: 1px solid #4CAF50;';
                    } else {
                        this.generateStyle = 'border: 1px solid #ebeef5;';
                    }
                }
            });
        },
        submitForm(cb) {
            if (this.ruleForm.generateList.length && this.isBatch) {
                this.generateStyle = 'border: 1px solid #4CAF50;';
            } else {
                this.generateStyle = 'border: 1px solid #f56c6c;';
            }
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    cb && cb({ ...this.ruleForm, isBatch: this.isBatch });
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.generateStyle = 'border: 1px solid #ebeef5;';
            this.ruleForm.prefix = '';
            this.isBatch = false;
            this.ruleForm.generateList = [];
            this.$refs.ruleForm.resetFields();
        }
    }
};
</script>
<style lang="scss">
.contentform {
    min-height: 400px;
    .textCenter {
        text-align: center;
    }
}
.formitem {
    display: flex;
    .marleft1 {
        .el-form-item__content {
            width: 130px !important;
        }
    }
    .marleft2 {
        .el-form-item__label {
            width: 38px !important;
        }
        .el-form-item__content {
            margin-left: 38px !important;
        }
    }
    .marleft3 {
        .el-form-item__label {
            width: 38px !important;
        }
        .el-form-item__content {
            margin-left: 34px !important;
        }
    }
}
.generate {
    height: 200px;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    overflow-y: auto;
    padding: 5px;
    li {
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
    }
    &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition: 0.3s;
    }
}
</style>