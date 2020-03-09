<template>
    <!-- 待采购产品列表 -->
    <universal-layout @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" :pagination="false" :pageNo="pageNo" :pageSize="pageSize" :total="total">
        <template slot="search">
            <search :searchList.sync="searchList" :searchBtnList="['加载待采购产品','生成采购清单']" @search="search">
                <div slot="right">
                    <!-- <userDefined :data="columns" :defaultData="defaultData" :selectCheck="selectCheck">自定义列表展示</userDefined> -->
                </div>
            </search>
        </template>
        <template slot="table">
            <el-form :model="formData" ref="form">
                <el-table :data="tableList.length?tableList:[]" height="660px" border @selection-change="handleSelectionChange" :span-method="objectSpanMethod">
                    <el-table-column type="selection" width="55" align="center" />
                    <template v-for="(item) in columns">
                        <el-table-column :key="item.id" :width="item.width" :label="item.label" align="center">
                            <template slot-scope="scope">
                                <el-tooltip v-if="item['img']" effect="light" placement="right">
                                    <div slot="content">
                                        <img :src="scope.row[item.value]" width="auto" :height="item.bulkyHeight || 180" />
                                    </div>
                                    <img :src="scope.row[item.value]" :width="item.style.width || 80" :height="item.style.height || 80" />
                                </el-tooltip>
                                <p v-else :style="item.style ||''">{{scope.row[item.value]}}</p>
                            </template>
                        </el-table-column>
                    </template>
                    <!--  -->
                    <el-table-column label="供应商" align="center" width="130">
                        <template slot-scope="scope">
                            <div style>
                                <el-select v-model="scope.row._selectId" size="mini" @change="handleInputChange(scope, $event)">
                                    <el-option :label="item.supplierName" :value="item.supplierId" :disabled="item.disabled" v-for="item in scope.row.suppliers" :key="item.id"></el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="报价" align="center" width="140">
                        <template slot-scope="scope">
                            <!-- /* eslint-disable */ -->
                            <div v-for="(item) in scope.row.suppliers" :key="item.id">
                                <ul v-for="j in item.prices" style="text-align: left;" :key="j.id">
                                    <template v-if="j.supplierId === scope.row._selectId">
                                        <li>数量：{{ j.numStart + '-' + j.numEnd }}</li>
                                        <li>价格：{{ j.supplierPrice + ' ' + j.supplierPriceUnit }}</li>
                                    </template>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购数量" align="center">
                        <template slot-scope="scope">
                            <el-form-item
                                v-if="scope.row.suppliers.length"
                                :prop="`data.${scope.$index}.determineQuantity`"
                                :rules="[
                                {required:scope.row.required, message: '数量不能为空', trigger: 'change'},
                                { type: 'number', message: '须为数字值'}
                            ]"
                            >
                                <div style="display:flex;">
                                    <el-input size="mini" style="margin-right:12px;" min="1" v-model.number="scope.row.determineQuantity" />
                                    <el-button v-if="scope.row.suppliers.length > 1 && isRepeating(scope.row.onlyOrderProductId)" type="text" icon="el-icon-delete" size="mini" @click="handledel(scope,scope.row.suppliers.length,scope.row)"></el-button>
                                </div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" placement="left" v-if="scope.row.repulseQuantity || scope.row.repulseReason">
                                <div slot="content">
                                    <p>打回需求数：{{ scope.row.repulseQuantity}}</p>
                                    <p style="max-width: 200px;">原因：{{scope.row.repulseReason}}</p>
                                </div>
                                <i class="el-icon-document iconRecord"></i>
                            </el-tooltip>

                            <el-button size="mini" plain icon="el-icon-plus" v-if="scope.row.suppliers.length > 1" @click="handleAdd(scope,scope.row.suppliers.length)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </template>
    </universal-layout>
</template>

<script>
/* eslint-disable */
import { mapMutations, mapGetters, mapActions } from 'vuex';
import userDefined from '@/components/userDefined/userDefined.vue';

export default {
    data() {
        return {
            searchList: [
                {
                    label: '订单来源店铺',
                    value: 'storeId',
                    type: 'select',
                    children: [],
                    props: {
                        label: 'name',
                        value: 'storeId'
                    }
                },
                {
                    label: '产品sku',
                    value: 'productSku',
                    type: 'input'
                }
            ],
            tableList: [],
            columns: [
                {
                    value: 'productImg',
                    label: '产品图片',
                    img: true,
                    style: {
                        width: 50,
                        height: 50
                    },
                    bulkyHeight: 180,
                    width: 80
                },
                {
                    value: 'customSku',
                    label: '自定义SKU',
                    width: 150
                },
                {
                    value: 'productName',
                    label: '产品名称'
                },
                {
                    value: 'warehouseName',
                    label: '仓库'
                },
                {
                    value: 'orderDemand',
                    label: '订单总需求'
                },
                {
                    value: 'orderQuantity',
                    label: '订单总数'
                },
                {
                    value: 'currentStock',
                    label: '当前库存'
                },
                {
                    value: 'purchasing',
                    label: '采购中'
                },
                {
                    value: 'finalBalance',
                    label: '需要采购'
                },
                {
                    value: 'developName',
                    label: '开发人员'
                },
                {
                    value: 'purchasersName',
                    label: '采购人员'
                }
            ],
            defaultData: [],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            form: {
                generates: []
            },
            spanArr: [],
            pos: 0,
            productIds: [],
            onlyOrderProductIds: []
        };
    },
    // watch: {
    //     tableList: {
    //         // handler(val) {
    //         //     let self = this
    //         //     let num = null
    //         //     this.form.generates = val.map((i, index) => {
    //         //         return {
    //         //             productId: i.productId,
    //         //             suppliers: i.suppliers.map((j, jindex) => {
    //         //                 // if(self.form.generates.length){
    //         //                 //     num = self.form.generates[index].suppliers[jindex].determineQuantity
    //         //                 // }
    //         //                 // console.log(num)
    //         //                 return {
    //         //                     supplierId: j.supplierId,
    //         //                     determineQuantity: i.orderDemand
    //         //                 }
    //         //             }),
    //         //             allSupplierlen: i.suppliers.length,
    //         //             purchasersId: i.purchasersId,
    //         //             warehouseId: i.warehouseId
    //         //         }
    //         //     })
    //         // },
    //         // immediate: true,
    //         // deep: true
    //     }
    // },
    computed: {
        ...mapGetters('common', ['shopList']),
        formData() {
            return {
                data: this.tableList
            };
        }
    },
    methods: {
        //
        selectCheck(val) {
            let arr = this.columns.filter(
                (item, index) => val.indexOf(item.label) >= 0
            );
            this.defaultData = [...arr];
            localStorage.setItem(
                'procurementList1',
                JSON.stringify(this.defaultData)
            );
        },
        //判断当前列表是否有重复的ID项
        isRepeating(onlyOrderProductId) {
            let arr = this.tableList.map(item => item.onlyOrderProductId);
            let obj = {};
            arr.forEach(item => {
                if (obj[item]) {
                    obj[item]++;
                } else {
                    obj[item] = 1;
                }
            });

            if (obj[onlyOrderProductId] > 1) {
                return true;
            } else {
                return false;
            }
        },
        handleInputChange(scope, val) {
            let arr = this.tableList
                .filter(
                    item =>
                        scope.row.onlyOrderProductId === item.onlyOrderProductId
                )
                .map(el => el._selectId);

            scope.row.suppliers.forEach(el => {
                if (arr.indexOf(el.supplierId) > -1) {
                    el.disabled = true;
                } else {
                    el.disabled = false;
                }
            });
        },
        //删除
        handledel(scope, length) {
            let { row, $index } = scope;
            let { suppliers } = row;
            let _selectId;
            let arr = this.tableList.filter(
                item => scope.row.onlyOrderProductId === item.onlyOrderProductId
            );
            if (arr.length == 1) {
                return;
            }

            this.tableList.splice($index, 1);
            this.handleInputChange(scope);
            this.getSpanArr(this.tableList);
        },

        //添加
        handleAdd(scope, length) {
            let { row, $index } = scope;
            let { suppliers } = row;
            let _selectId;
            let arr = this.tableList.filter(
                item => scope.row.onlyOrderProductId === item.onlyOrderProductId
            );

            if (arr.length === suppliers.length) {
                this.$message.warning('当前添加供应商已达到上限，无法继续添加');
                return;
            }

            suppliers.slice(0).forEach(el => {
                if (!el.disabled) {
                    _selectId = el.supplierId;
                    return false;
                }
            });

            this.tableList.splice($index + arr.length, 0, {
                ...row,
                _selectId
            });
            this.handleInputChange(scope);
            this.getSpanArr(this.tableList);
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (this.tableList.length <= 0) {
                return false;
            }
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

            if (columnIndex === arr[columnIndex]) {
                let _row = this.spanArr[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
            if (columnIndex === 15) {
                let _row = this.spanArr[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        //
        getSpanArr(data) {
            this.spanArr = [];
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    // 如果是第一条记录（即索引是0的时候），向数组中加入１
                    this.spanArr.push(1);
                    this.pos = 0;
                } else {
                    if (
                        data[i].onlyOrderProductId ===
                        data[i - 1].onlyOrderProductId
                    ) {
                        // 如果id相等就累加，并且push 0
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        // 不相等push 1
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        handleSelectionChange(val) {
            this.onlyOrderProductIds = val.map(item => item.onlyOrderProductId);

            this.productIds = val.map(item => item.productId);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getList();
        },

        //搜索
        search(val, name) {
            console.log(val, name);
            if (name == '生成采购清单') {
                if (this.onlyOrderProductIds.length) {
                    this.$refs.form.validate(valid => {
                        if (valid) {
                            this.generateOrder();
                        } else {
                            return false;
                        }
                    });
                } else {
                    this.$message.warning('请选择需要生成的采购单数据');
                }
                return;
            }
            if (name == '加载待采购产品') {
                this.getList('search', val);
            }
        },
        generateOrder() {
            let arr = [];
            this.tableList.forEach(item => {
                this.onlyOrderProductIds.forEach(onlyOrderProductId => {
                    if (item.onlyOrderProductId == onlyOrderProductId) {
                        arr.push(item);
                    }
                });
            });

            let generates = arr.map(item => {
                return {
                    productId: item.productId,
                    purchasersId: item.purchasersId,
                    warehouseId: item.warehouseId,
                    suppliers: {
                        supplierId: item._selectId,
                        determineQuantity: item.determineQuantity
                    }
                };
            });

            console.log(generates);

            this.$api['procurement/generateCreatePurchase']({
                generates
            })
                .then(res => {
                    this.$message.success(res.msg);
                    this.getList();
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        //获取列表数据
        getList(val, obj) {
            let self = this;
            let params = {
                sortOrder: 'asc',
                pageSize: self.pageSize,
                pageNumber: self.pageNo
            };
            if (val == 'search') {
                params = Object.assign({}, params, obj);
            }
            self.$api['procurement/generateLoad'](params).then(res => {
                if (res.rows && res.rows.length) {
                    res.rows.forEach((item, index) => {
                        item._selectId = item.suppliers[0].supplierId;
                        item.determineQuantity = item.orderDemand;
                        item['len'] = 0;
                        item['required'] = false;
                        item.suppliers.map((citem, i) => {
                            if (i == 0) {
                                citem['disabled'] = true;
                            }
                            citem['disabled'] = false;
                        });
                    });
                    self.tableList = res.rows;
                    this.getSpanArr(this.tableList);
                } else {
                    self.tableList = [];
                }
            });
        },
        ...mapActions('common', ['getAllShopList'])
    },
    created() {
        this.getList(1);
        let defaultData = localStorage.getItem('procurementList1');
        if (defaultData) {
            this.defaultData = JSON.parse(defaultData);
        } else {
            localStorage.setItem(
                'procurementList1',
                JSON.stringify(this.columns)
            );
        }
        if (!this.$store.state.common.allShopList.length) {
            this.getAllShopList().then(_ => {
                this.$set(this.searchList[0], 'children', this.shopList);
            });
        } else {
            this.$set(this.searchList[0], 'children', this.shopList);
        }
    },
    components: {
        userDefined
    }
};
</script>

<style lang="scss">
.iconRecord {
    font-size: 24px;
    color: red;
    position: relative;
    right: 10px;
    top: 5px;
}
.el-table__body tr.hover-row > td {
    background-color: #fff !important;
}
</style>
