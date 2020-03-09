<template>
    <div class="lookPicking">
        <universal-layout :btnList="btnConfig" :pagination="false">
            <template slot="search">
                <search :searchList="searchConfig" @search="search"></search>
            </template>
            <template slot="table">
                <yt-table :data="tableList" @selectChange="selectChange" ref="table" :columns="columns" :border="true">
                    <el-table-column label="数量" align="center" slot="right">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.amount"></el-input>
                        </template>
                    </el-table-column>
                </yt-table>
            </template>
        </universal-layout>
        <!--  -->
        <el-dialog title="修改拣货人员" :visible.sync="visible" width="480px" :append-to-body="true">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="拣货人员" prop="pickerId" :rules="[
      { required: true, message: '请选择人员', trigger: 'change' }      
    ]">
                    <el-select v-model="form.pickerId" style="width:100%;">
                        <el-option :label="item.label" :value="item.value" :key="item.label" v-for="item in $store.state.daily.personnel.pickingList"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPersonnelForm">取 消</el-button>
                <el-button type="primary" @click="changePersonnel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            form: {
                pickerId: '',
                productInfo: []
            },
            //
            btnConfig: [
                {
                    name: '修改拣货人员',
                    fn: () => {
                        if (!this.form.productInfo.length) {
                            return this.$message.warning(
                                '请选择需要修改人员的产品'
                            );
                        }
                        if (!this.form.productInfo.every(item => item.amount)) {
                            return this.$message.warning('请输入数量');
                        }
                        this.visible = true;
                    }
                }
            ],
            searchConfig: [
                {
                    label: 'sku：',
                    value: 'sku',
                    type: 'input'
                },
                {
                    label: '产品名称：',
                    value: 'name',
                    type: 'input'
                },
                {
                    label: '拣货人员：',
                    value: 'pickerIds',
                    type: 'multiple',
                    children: this.$store.state.daily.personnel.pickingList
                }
            ],
            tableList: [],
            columns: [
                {
                    value: 'imageBase',
                    label: '图片',
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'nameCh', label: '产品名称' },
                { value: 'customSku', label: '自定义SKU' },
                { value: 'nameEn', label: '产品英文名称' },
                { value: 'userName', label: '拣货人员',render(h, scope) {
                    const {pickerName,pickerTypeName} = scope.row
                    return <span>{pickerName} ({pickerTypeName})</span>
                }, }
            ],
            wmPackageId: '',
            searchInfo: {},
            type: ''
        };
    },
    methods: {
        resetPersonnelForm() {
            this.$refs.form.resetFields();
            this.visible = false;
        },
        //修改拣货人员列表
        changePersonnel() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$api['warehouse/packageModifyPicker']({
                        ...this.form,
                        wmPackageId: this.wmPackageId,
                        pickerType: this.type
                    }).then(res => {
                        this.$message.success(res.msg);
                        this.getList();
                        this.visible = false;
                    });
                } else {
                    return false;
                }
            });
        },
        search(val) {
            this.searchInfo = { ...val };
            this.getList('search');
        },
        selectChange(val) {
            this.form.productInfo = val.map(item => {
                return {
                    amount: item.amount,
                    wmAppPickTaskProId: item.wmAppPickTaskProId
                };
            });
        },
        getdetailList(params) {
            this.wmPackageId = params.wmPackageId;
            this.type = params.type;
            this.getList();
        },
        getList(val) {
            let params = {
                wmPackageId: this.wmPackageId,
                type: this.type
            };
            if (val == 'search') {
                params = Object.assign({}, params, this.searchInfo);
            }
            this.$api['warehouse/packagepickerlist'](params).then(res => {
                this.tableList = res.rows;
            });
        }
    }
};
</script>
<style lang="scss">
.lookPicking {
    position: relative;
    height: 560px;
    overflow-y: auto;
}
</style>