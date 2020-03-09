<template>
    <div style="max-height: 560px;overflow-y: auto;padding:0 10px;" v-loading="loading" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="87px" size="medium">
            <el-form-item label="选择仓库：" prop="wmWarehouseId">
                <el-select v-model.number="ruleForm.wmWarehouseId">
                    <el-option :label="i.label" :value="i.value" v-for="i in $store.state.daily.warehouseList" :key="i.value"></el-option>
                </el-select>
            </el-form-item>
            <div class="productListBox">
                <div class="btnbox">
                    <span class="tipsText">移库产品：</span>
                    <div>
                        <el-button size="mini" type="success" @click="add">添 加</el-button>
                        <el-button size="mini" type="danger" @click="del" :disabled="baseProductIds.length?false:true">删 除</el-button>
                    </div>
                </div>
                <el-table :data="productList" style="width: 100%" @selection-change="handleSelectionChange" border>
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column label="主图" align="center" width="80">
                        <template slot-scope="scope">
                            <el-tooltip content="Bottom center" placement="right" effect="light">
                                <div slot="content">
                                    <img v-lazy="scope.row.imgPath || scope.row.imageBase" width="auto" height="180" />
                                </div>
                                <img v-lazy="scope.row.imgPath || scope.row.imageBase" width="60" height="auto" />
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="自定义SKU" prop="skuCustom" align="center" width="140px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.skuCustom || scope.row.skuCus}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="原库位" align="center" width="150px">
                        <template slot-scope="scope">
                            <el-form-item class="labelwidth" :prop="'productInfo.'+scope.$index+'.originalLocationIds'" :rules="[
                  { required: true, message: '请选择库位', trigger: 'change' },
                ]">
                                <el-select multiple collapse-tags v-model="ruleForm.productInfo[scope.$index].originalLocationIds" size="small" placeholder="原库位">
                                    <el-option v-for="item in scope.row.originalLocation" :key="item.wmLocationId" :label="item.wmLocationName" :value="item.wmLocationId" />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="原库位总数量" prop="inventory" align="center" width="130px"></el-table-column>
                    <el-table-column label="转移总数量" align="center" width="120px">
                        <template slot-scope="scope">
                            <el-form-item
                                class="labelwidth"
                                :prop="'productInfo.'+scope.$index+'.amount'"
                                :rules="[
                            { required: true, message: '须大于0的整数', trigger: 'blur',pattern:/^[1-9]{1}[0-9]*$/ },
                            ]"
                            >
                                <el-input size="small" v-model.number="ruleForm.productInfo[scope.$index].amount" placeholder="数量" type="number"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column label="转移库位" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="labelwidth" :prop="'productInfo.'+scope.$index+'.targetLocationIds'" :rules="[
                  { required: true, message: '请选择库位', trigger: 'change' },
                ]">
                                <div style="display:flex;">
                                    <el-select multiple collapse-tags v-model="ruleForm.productInfo[scope.$index].targetLocationIds" size="small" placeholder="转移库位">
                                        <el-option v-for="item in scope.row.targetLocation" :key="item.wmLocationId" :label="item.wmLocationName" :value="item.wmLocationId" />
                                    </el-select>
                                    <el-button plain size="small" @click="getTransferStore(ruleForm.productInfo[scope.$index].originalLocationIds,ruleForm.productInfo[scope.$index].amount,scope.row,scope.$index)">获取</el-button>
                                </div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-pagination
                    @size-change="handleProuctSizeChange"
                    @current-change="handleProuctCurrentChange"
                    :current-page="productPageNo"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="productPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="productTotal"
                    class="pagination"
                ></el-pagination>-->

                <p class="productTipsText" v-if="!productList.length && isShowText">请选择移库产品</p>
            </div>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" class="textarea" v-model.trim="ruleForm.remark"></el-input>
            </el-form-item>
            <!--  -->
            <el-dialog title="选择SKU" :visible.sync="skuVisible" width="1020px" :append-to-body="true">
                <div class="skuDialog">
                    <el-form :inline="true" size="small">
                        <el-form-item label="SKU：">
                            <el-input v-model="sku" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="产品名称：">
                            <el-input v-model="name" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <yt-table ref="table" :data="skuProductList" reserveSelection="productId" :columns="columns" :border="true" @selectChange="selectChange" />
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNo"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        class="pagination"
                    ></el-pagination>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="skuVisible = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="checkedproduct" size="medium">确 定</el-button>
                </span>
            </el-dialog>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
export default {
    data() {
        return {
            ruleForm: {
                wmWarehouseId: '',
                productInfo: [],
                remark: ''
            },
            rules: {
                wmWarehouseId: [
                    {
                        required: true,
                        message: '请选择仓库',
                        trigger: 'change'
                    }
                ]
            },
            columns: [
                {
                    value: 'imgPath',
                    label: '图片',
                    img: true,
                    width: 80,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'nameZh', label: '产品名称' },
                { value: 'sku', label: '系统SKU' },
                { value: 'skuCustom', label: '自定义SKU' },
                { value: 'nameEn', label: '产品英文名称' },
                { value: 'purchase', label: '采购人员' }
            ],
            productList: [], // 产品列表
            skuProductList: [], // 仓库产品列表
            skuVisible: false,
            pageNo: 1,
            pageSize: 10,
            total: 0,
            isShowText: false,
            checkedSku: [], //选中的sku产品,
            sku: '',
            name: '',
            loading: false,
            wmMovePlanId: '',

            productPageSize: 10,
            productPageNo: 1,
            productTotal: 0,
            productIds: [],
            baseProductIds: []
        };
    },
    watch: {
        productList: {
            handler(val) {
                console.log(val);
                this.ruleForm.productInfo = val.map(item => {
                    let oarr = [];
                    let tarr = [];
                    item.originalLocation.forEach(j => {
                        if (j.hasOwnProperty('selected') && j.selected) {
                            oarr.push(j.wmLocationId);
                        }
                    });
                    item.targetLocation.forEach(j => {
                        if (j.hasOwnProperty('selected') && j.selected) {
                            tarr.push(j.wmLocationId);
                        }
                    });
                    return {
                        baseProductId: item.productId || item.baseProductId,
                        amount: item.amount,
                        originalLocationIds: oarr,
                        targetLocationIds: tarr
                    };
                });
            },
            immediate: true
        }
    },
    methods: {
        getTransferStore(wmLocationIds, amount, row, index) {
            console.log(wmLocationIds, amount, row);

            this.$refs.ruleForm.validateField(
                'productInfo.' + index + '.amount'
            );
            this.$refs.ruleForm.validateField(
                'productInfo.' + index + '.originalLocationIds'
            );
            if (wmLocationIds.length && amount && amount > 0) {
                this.$api['warehouse/wmMovePlanLocation']({
                    wmLocationIds,
                    amount,
                    baseProductId: row.productId,
                    warehouseId: this.ruleForm.wmWarehouseId
                }).then(res => {
                    row.targetLocation = res.rows;
                    this.$message.success(res.msg);
                });
            }
        },
        async edit(wmMovePlanId) {
            this.loading = true;
            this.wmMovePlanId = wmMovePlanId;
            let {
                rows: { wmWarehouseId, remark }
            } = await this.$api['warehouse/movePlanInfo']({ wmMovePlanId });

            // let { rows } = await this.$api['warehouse/movePlanlistProduct']({
            //     pageNumber: 1,
            //     pageSize: 10,
            //     wmMovePlanId
            // });
            // this.productList = [...rows];
            await this.getProductList();
            this.ruleForm.wmWarehouseId = wmWarehouseId;
            this.ruleForm.remark = remark;
            this.loading = false;
        },
        getProductList() {
            return this.$api['warehouse/movePlanlistProduct']({
                pageNumber: this.productPageNo,
                pageSize: this.productPageSize,
                wmMovePlanId: this.wmMovePlanId
            }).then(res => {
                let { pageSize, pageNo, total, rows } = res;
                this.productPageSize = pageSize;
                this.productPageNo = pageNo;
                this.productTotal = total;

                this.productList = [...rows];
            });
        },
        handleProuctSizeChange(val) {
            this.productPageSize = val;
        },
        handleProuctCurrentChange(val) {
            this.productPageNo = val;
        },
        handleSelectionChange(val) {
            this.baseProductIds = val.map(i => i.productId);
        },
        selectChange(val) {
            this.productIds = val.map(item => item.productId);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            let p = {};
            if (this.sku) {
                p['sku'] = this.sku;
            }
            if (this.name) {
                p['name'] = this.name;
            }
            this.getSkuProductList(p);
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            let p = {};
            if (this.sku) {
                p['sku'] = this.sku;
            }
            if (this.name) {
                p['name'] = this.name;
            }
            this.getSkuProductList(p);
        },
        search() {
            this.pageNo = 1;
            let p = {};
            if (this.sku) {
                p['sku'] = this.sku;
            }
            if (this.name) {
                p['name'] = this.name;
            }
            this.getSkuProductList(p);
            this.$refs.table.clearSelection();
        },
        add() {
            this.$refs.ruleForm.validateField('wmWarehouseId');
            if (this.ruleForm.wmWarehouseId) {
                this.skuVisible = true;
                this.getSkuProductList();
            }
        },
        del() {
            let nArr = [];
            this.productList.forEach((i, index) => {
                let everp = this.baseProductIds.findIndex(
                    j => i.productId == j
                );
                if (everp != -1) {
                    return;
                } else {
                    nArr.push(i);
                }
            });
            this.productList = nArr;
        },
        //确认添加sku产品
        checkedproduct() {
            if (this.productIds.length) {
                this.$api['warehouse/movePlanChooseWarehouse']({
                    productIds: this.productIds,
                    wmWarehouseId: this.ruleForm.wmWarehouseId
                }).then(res => {
                    this.$message.success(res.msg);
                    this.$refs.table.clearSelection();
                    this.productList = res.rows;
                    this.skuVisible = false;
                });
            } else {
                this.$message.warning('请先选择sku产品');
            }
        },
        //查詢仓库中的商品
        getSkuProductList(p = {}) {
            let params = {
                wmWarehouseId: this.ruleForm.wmWarehouseId,
                pageSize: this.pageSize,
                pageNumber: this.pageNo
            };
            this.$api['warehouse/movePlanProductList']({
                ...params,
                ...p
            }).then(res => {
                let { pageNo, pageSize, rows, total } = res;
                this.pageNo = pageNo;
                this.pageSize = pageSize;
                this.total = total;
                this.skuProductList = rows;
            });
        },
        submitForm(cb) {
            this.isShowText = true;
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if (!this.ruleForm.productInfo.length) {
                        return this.$message.warning(
                            '移库计划产品不能为空,请先添加'
                        );
                    }
                    cb && cb(this.ruleForm);
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.isShowText = false;
            this.productList = [];
            this.$refs.ruleForm.resetFields();
            this.loading = false;
        }
    }
};
</script>
<style lang="scss" scope>
.textarea {
    textarea {
        height: 150px;
        resize: none;
    }
}
.productListBox {
    margin-bottom: 22px;
    .btnbox {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border: 1px solid #ebeef5;
        border-bottom: none;
        .tipsText {
            line-height: 28px;
            &::before {
                content: '*';
                color: #f56c6c;
                margin-right: 4px;
            }
        }
    }
}
.productTipsText {
    color: #f56c6c;
    margin-top: 10px;
}
.labelwidth {
    .el-form-item__content {
        margin-left: 0px !important;
    }
}
.tdp0 {
    padding-bottom: 0 !important;
}
.skuDialog {
    height: 500px;
    overflow-y: auto;
    padding: 0 10px;
}
.pagination {
    text-align: right;
    margin-top: 10px;
}
</style>

