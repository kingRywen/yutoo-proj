<template>
    <!-- 添加编辑 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" size="small">
        <el-row>
            <el-col :span="12">
                <el-form-item label="选择仓库：" prop="wmWarehouseId">
                    <el-select v-model="ruleForm.wmWarehouseId" @change="warehouseChange">
                        <el-option :label="i.label" :value="i.value" :key="i.label" v-for="i in $store.state.daily.warehouseList"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="盘点类型：" prop="type">
                    <el-select v-model="ruleForm.type">
                        <el-option :label="item.label" :value="item.value" v-for="item in $store.state.daily.inventoryType" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="盘点库存范围：" prop="scope">
                    <el-radio-group v-model="ruleForm.scope" @change="change">
                        <el-radio :label="item.value" v-for="item in $store.state.daily.inventoryRange" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-collapse-transition>
                    <div v-if="ruleForm.scope==2">
                        <el-form-item prop="wmLocationIds" :label="`当前已选择${ruleForm.wmLocationIds.length}条`">
                            <!-- <div class="btnbox">
              <el-button size="mini" type="success">添 加</el-button>
              <el-button size="mini" type="success" :disabled="list.length?false:true">删 除</el-button>
            </div>
                            <yt-table :data="list" :columns="columns" :border="true" @selectChange="selectChange"></yt-table>-->
                            <region ref="region" :isWarehouse="isWarehouse" :columns="columns" @change="changeRegion" :findType="null" :wmWarehouseIds="wmWarehouseIds" :lockFlag="false" :checkedList="checkedList" @setData="setData" @del="delcheckedList"/>
                        </el-form-item>
                        <el-pagination
                            class="pagination"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNo"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        ></el-pagination>
                    </div>
                </el-collapse-transition>
            </el-col>
            <el-col :span="24" style="margin-top:15px;">
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea" v-model="ruleForm.remark" class="textarea"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
/* eslint-disable */
import region from './region';
export default {
    components: {
        region
    },
    data() {
        return {
            ruleForm: {
                wmWarehouseId: '',
                type: '',
                scope: 1,
                remark: '',
                wmLocationIds: []
            },
            rules: {
                wmWarehouseId: [
                    {
                        required: true,
                        message: '请选择仓库',
                        trigger: 'change'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请选择盘点类型',
                        trigger: 'change'
                    }
                ],
                remark: [
                    {
                        required: true,
                        message: '请输入备注信息',
                        trigger: 'change'
                    }
                ],
                scope: [
                    {
                        required: true,
                        message: '请选择库存范围',
                        trigger: 'change'
                    }
                ],
                wmLocationIds: [
                    {
                        required: true,
                        message: '请选择库存范围',
                        trigger: 'change'
                    }
                ]
            },
            list: [],
            columns: [],
            checkedList: [],
            wmInventoryPlanId: '',
            pageNo: 1,
            pageSize: 10,
            total: 0,
            isAdd: true
        };
    },
    computed: {
        wmWarehouseIds() {
            return [this.ruleForm.wmWarehouseId]
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNo = val;

            this.isAdd ? this.getPlanlocations() : this.getPartitionList();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.isAdd ? this.getPlanlocations() : this.getPartitionList();
        },
        async setData(val, cb) {
            let locationIds = val.map(i => i.wmLocationId);

            let { code } = await this.$api[
                'warehouse/wminventoryplansavelocations'
            ]({
                locationIds,
                pageNumber: 1,
                pageSize: 10
            });
            if (code == 0) {
                let code = await this.getPlanlocations();
                if (code == 0) {
                    cb && cb();
                }
            } else {
                this.$message.error('出错了,请稍后再试');
            }
        },
        //获取保存后的库位
        getPlanlocations() {
            return this.$api['warehouse/wminventoryplanlocations']({
                pageNumber: this.pageNo,
                pageSize: this.pageSize
            }).then(res => {
                let { code, rows, pageNo, pageSize, total } = res;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.total = total;
                this.checkedList = rows;
                return code;
            });
        },

        //删除
        delcheckedList(arr) {
            let nArr = [];
            this.checkedList.forEach((i, index) => {
                let everp = arr.findIndex(j => i.wmLocationId == j);
                if (everp != -1) {
                    return;
                } else {
                    nArr.push(i);
                }
            });
            this.checkedList = nArr;
            if (nArr.length == 0) {
                this.$refs.region.clearSelection();
            }
        },
        //
        changeRegion(val) {
            this.ruleForm.wmLocationIds = val;
        },
        //编辑
        editInfo(wmInventoryPlanId) {
            this.isAdd = false;
            this.columns = [
                { value: 'area', label: '区域' },
                { value: 'wmLocationName', label: '库位' },
                { value: 'specification', label: '规格' }
            ];
            this.wmInventoryPlanId = wmInventoryPlanId;
            this.$api['warehouse/inventoryPlanInfo']({
                wmInventoryPlanId,
                pageNumber: 1,
                pageSize: 10
            }).then(res => {
                let { wmWarehouseId, type, scope, remark } = res.rows;
                this.ruleForm.wmWarehouseId = wmWarehouseId;
                this.ruleForm.type = type;
                this.ruleForm.scope = scope;
                this.ruleForm.remark = remark;
                this.ruleForm.wmLocationIds = [];
                if (scope == 2) {
                    this.getPartitionList();
                }
            });
        },
        //选择仓库改变时
        warehouseChange(wmWarehouseId) {
            this.ruleForm.wmLocationIds = [];
            this.checkedList = [];
            this.pageNo = 1;
            this.pageSize = 10;
            this.total = 0;
        },
        //添加时是否选择仓库
        isWarehouse() {
            this.$refs.ruleForm.validateField('wmWarehouseId');
            return new Promise((resolve, reject) => {
                if (this.ruleForm.wmWarehouseId) {
                    resolve(this.ruleForm.wmWarehouseId);
                } else {
                    reject();
                }
            });
        },
        //盘点范围改变时
        change(val) {
            // if (val == 2) {
            //     let wmwmWarehouseIds = this.ruleForm.wmWarehouseId
            //     if (wmwmWarehouseIds) {
            //         this.getPartitionList(Array.of(wmwmWarehouseIds))
            //     } else {
            //         this.$refs.ruleForm.validateField('wmWarehouseId')
            //     }
            // } else {
            //     this.ruleForm.wmLocationIds = []
            // }
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
        //区域
        getPartitionList() {
            this.$api['warehouse/inventoryPlanArea']({
                pageNumber: this.pageNo,
                pageSize: this.pageSize,
                wmInventoryPlanId: this.wmInventoryPlanId
            }).then(res => {
                let { pageNo, pageSize, total, rows } = res;
                this.checkedList = rows;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.total = total;
            });
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
            this.columns = [
                { value: 'area', label: '区域' },
                { value: 'wmLocationName', label: '库位' },
                { value: 'specification', label: '规格' }
            ];
            this.isAdd = true;
        },
        selectChange(val) {
            this.ruleForm.wmLocationIds = val.map(i => i.wmLocationId);
        }
    }
};
</script>
<style lang="scss">
.textarea {
    textarea {
        height: 150px;
        resize: none;
    }
}
.btnbox {
    padding: 10px 0 10px 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
}
</style>
