<template lang="html">
    <!-- 质检操作 -->
    <div  class="backWarp">
        <div class="inputBox">
            <div class="inputItem">
                <el-select v-model="form.barcode" class="select">
                    <el-option label="采购产品条形码" value="1"></el-option>
                    <el-option label="产品条形码" value="2"></el-option>
                </el-select>
                <el-input class="input" @change="barCodeChange" v-model.trim="purchaseProductBarCode"/>
                <el-select v-model.number="inspectType" class="select" style="width:100px;margin-left:10px;">
                    <el-option label="全检" :value="2"></el-option>
                    <el-option label="抽检" :value="1"></el-option>
                </el-select>
                <div style="margin-left:10px">
                    <span style="font-size:24px;">质检数：</span>
                    <el-input class="input" v-model.number="inspectQuantity" style="width:100px;" @blur="changeInspectQuantity(inspectQuantity)"/>
                </div>
                <div style="margin-left:10px">
                    <span style="font-size:24px;">本次不良品：</span>
                    <el-input class="input" v-model.number="rejectsQuantity" style="width:100px;" @blur="changeRejectsQuantity(rejectsQuantity)"/>
                </div>
                <div style="margin-left:10px">
                    <span style="font-size:24px;">退货不良品：</span>
                    <el-input class="input" v-model.number="returnQuantity" style="width:100px;" @blur="changeReturnQuantity(returnQuantity)"/>
                </div>
                <el-button plain type="primary" class="backbtn" @click="back" >确认质检</el-button>
            </div>
            <el-row style="margin:40px 0 10px 0;">
                <el-col :span="3" style="font-size:24px;">
                    总需求：{{ info.requirement }}
                </el-col>
                <el-col :span="3" style="font-size:24px;">
                    已采购：{{ info.lowerSingleQuantity  }}
                </el-col>
                <el-col :span="3" style="font-size:24px;">
                    质检通过：{{info.goodProductQuantity }}
                </el-col>
                <el-col :span="3" style="font-size:24px;">
                    质检不通过：{{info.rejectsQuantity  }}
                </el-col>
                <el-col :span="5" style="font-size:24px;">
                    退货不良品数：{{info.noback }}
                </el-col>
                <!-- <el-col :span="3" style="font-size:24px;position: relative;bottom: 8px;">
                    <el-button plain @click="add">添 加</el-button>
                </el-col> -->
            </el-row> 
            <!-- <template v-for="(item,index) in remarks">
                <div style="margin-bottom:10px;" :key="index">
                    <el-input class="input" @blur="changeAddInputNumber(item,index)" v-model.number="item.rejectsQuantity" style="width:200px;margin:0 10px;" placeholder="输入数量"/>
                    <el-input class="input" v-model="item.rejectsDesc" style="margin-right:10px;" placeholder="原因"/>
                    <el-button type="danger" icon="el-icon-close" circle style="position: relative;bottom: 5px;" @click="del(index)"></el-button>
                </div>
            </template> -->
            <div>               
                <el-row :gutter="20" style="padding:10px 0;border-top: 1px dashed #ccc;" v-for="(item,index) in rejectsInfo" :key="index">
                    <el-col :span="3">
                        <el-select placeholder="选择供应商" v-model.number="item.returnSupplierId">
                            <el-option
                            v-for="i in supplierList"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="输入不良品数量" v-model.number="item.rejectsQuantity" type="number"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="输入退回数量" v-model.number="item.returnQuantity" type="number"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-button icon="el-icon-plus" circle @click="pushRejects"></el-button>
                        <el-button type="danger" icon="el-icon-delete"  @click="removeRejects(index)" circle v-show="(rejectsInfo.length>1 && index!=0)"></el-button>
                    </el-col>
                    <el-col :span="10" style="font-size:16px;height:50px;line-height: 50px;color:#f56c6c;" v-if="index==0">
                              提示：1.添加的供应商退回数量之和 不能大于本次 退货不良品数量
                            </el-col>   
                    <!--  -->
                     <el-col :span="24" style="margin-top:10px;" v-for="(citem,cindex) in item.remarks" :key="cindex">
                        <el-row :gutter="20">                            
                            <el-col :span="6">
                                <el-input placeholder="数量" v-model.number="citem.rejectsQuantity" type="number"></el-input>
                            </el-col>
                            <el-col :span="3">                            
                                <el-select                                                          
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder="输入或选择原因"
                                    v-model="citem.rejectsDesc">
                                    <el-option
                                        v-for="i in reasonList"
                                        :key="i.value"
                                        :label="i.label"
                                        :value="i.value">
                                    </el-option>
                                </el-select>
                            </el-col>  
                            <el-col :span="3">
                                <el-button icon="el-icon-plus" circle  @click="pushRemarks(index)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="removeRemarks(index,cindex)" circle v-show="(item.remarks.length>1 && cindex!=0)"></el-button>
                            </el-col> 
                            <el-col :span="10" style="font-size:16px;height:50px;line-height: 50px;color:#f56c6c;text-indent: 50px;" v-if="cindex==0 &&index==0">
                                2.单个问题数量之和 不能大于当前供应商退回数量
                            </el-col>            
                        </el-row>  
                    </el-col>
                    
                           
                </el-row>                

            </div>

        </div>
        <!--  -->
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" class="tabsInfo">
            <el-tab-pane label="产品详情" name="first" style="height:100%;">
                <el-row style="height:100%;" :gutter="10" v-if="purchaseProductBarCode">
                    <el-col :span="8" style="height:100%;">
                        <!--  -->
                        <template v-if="productImgs.length">
    <el-tabs v-model="activeNameImg" tabPosition="right" class="tabsBox">
        <template v-for="(item,index) in productImgs">
            <el-tab-pane :name="index+''" :key="index">
                <div slot="label" style="text-align: center;">
                    <img :src="item.productImg" width="auto" height="80" alt>
                </div>
                <img :src="item.productImg" width="auto" height="260" alt>
            </el-tab-pane>
        </template>
    </el-tabs>
</template>
                        <template v-else>
    <div style="text-align: center;">暂无图片！</div>
</template>
                        <!--  -->
                    </el-col>
                    <el-col :span="8">
                        <columnTable :data="detailsInfo1" :columns="columnsA"/>
                    </el-col>
                    <el-col :span="8">
                        <columnTable :data="detailsInfo2" :columns="columnsB"/>
                    </el-col>
                </el-row>
                 <p v-else style="font-size:18px">暂无产品数据，请输入条形码获取！</p>    
            </el-tab-pane>
            <el-tab-pane label="产品历史质检记录" name="second">
                <yt-table :data="list" :columns="columnsF" :border="true" :selection="false"/>
                <el-pagination
                  class="pagination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 50, 80]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </el-tab-pane>


            <el-tab-pane label="历史不良品退回记录" name="third">
                <yt-table :data="list" :columns="columns" :border="true" :selection="false"/>
                <el-pagination
                  class="pagination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 50, 80]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
/* eslint-disable */
import columnTable from '@/components/columnTable/columnTable';
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters('common', ['supplierList'])
    },
    data() {
        return {
            reasonList: [],
            rejectsInfo: [
                {
                    returnSupplierId: '',
                    returnQuantity: '',
                    rejectsQuantity: '',
                    remarks: [
                        {
                            rejectsQuantity: '',
                            rejectsDesc: ''
                        }
                    ]
                }
            ],
            form: {
                barcode: '1'
            },
            activeName: 'first',
            list: [],
            // listB:[]
            columns: [
                { value: 'purchaseNumber', label: '采购单号' },
                { value: 'productSku', label: '产品SKU' },
                { value: 'inspectQuantity', label: '本次操作数量' },
                { value: 'inspectTypeName', label: '操作类型' },
                { value: 'createTime', label: '质检操作时间' }
            ],
            columnsF: [
                { value: 'purchaseNumber', label: '采购单号' },
                { value: 'productSku', label: '产品SKU' },
                { value: 'inspectQuantity', label: '本次操作数量' },
                { value: 'inspectName', label: '质检操作人姓名' },
                { value: 'cancelFlagName', label: '是否作废' },
                { value: 'inspectBatchNumber', label: '质检批次号' },
                { value: 'createTime', label: '质检操作时间' }
            ],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            activeNameImg: '0',
            detailsInfo1: {},
            detailsInfo2: {},
            columnsA: [
                { label: '产品重量', value: 'gw' },
                { label: '产品尺寸', value: 'sing' },
                { label: '包装尺寸', value: 'package' },
                { label: '自定义SKU', value: 'customSku' },
                { label: '产品属性', value: 'attribute' },
                { label: '入库仓库', value: 'warehouseName' },
                { label: '采购人员', value: 'purchasersName' },
                { label: '产品中文名称', value: 'productNameZh' },
                { label: '产品英文名称', value: 'productNameEn' }
            ],
            columnsB: [
                { label: '包装清单', value: 'packageList' },
                { label: '产品描述', value: 'seoDesc' },
                { label: '订单产品备注', value: 'remark' }
            ],
            purchaseProductBarCode: null,
            returnQuantity: null,
            inspectQuantity: null,
            rejectsQuantity: null,
            inspectType: 1,
            info: {
                requirement: 0,
                lowerSingleQuantity: 0,
                goodProductQuantity: 0,
                rejectsQuantity: 0,
                noback: 0
            },
            productImgs: [],
            remarks: []
        };
    },
    methods: {
        // 添加供应商备注
        pushRejects() {
            this.rejectsInfo.push({
                returnSupplierId: '',
                returnQuantity: '',
                rejectsQuantity: '',
                remarks: [
                    {
                        rejectsQuantity: '',
                        rejectsDesc: ''
                    }
                ]
            });
        },
        //删除供应商备注
        removeRejects(index) {
            this.rejectsInfo.splice(index, 1);
        },
        //添加的单个供应商数量
        pushRemarks(index) {
            this.rejectsInfo[index].remarks.push({
                rejectsQuantity: '',
                rejectsDesc: ''
            });
        },
        //删除的单个供应商数量
        removeRemarks(index, cindex) {
            this.rejectsInfo[index].remarks.splice(cindex, 1);
        },
        //
        changeAddInputNumber(item, index) {
            if (Number.isInteger(item.rejectsQuantity)) {
                let arr = this.remarks.map(item => item.rejectsQuantity);
                let num = arr.reduce((item, value) => item + value);
                if (num > this.rejectsQuantity) {
                    this.$message.warning('添加数量之和不能大于本次不良品');
                    item.rejectsQuantity = '';
                }
            } else {
                this.$message.warning('请输入数字值,且是正整数');
                item.rejectsQuantity = '';
            }
        },
        //
        changeInspectQuantity(val) {
            if (Number.isInteger(val)) {
                if (val > this.info.requirement) {
                    this.$message.warning('质检数不能大于总需求数');
                    this.inspectQuantity = null;
                }
            } else {
                this.$message.warning('请输入数字值,且是正整数');
                this.inspectQuantity = null;
            }
        },
        changeRejectsQuantity(val) {
            if (Number.isInteger(val)) {
                if (val > this.inspectQuantity) {
                    this.$message.warning('不良品数不能大于质检数');
                    this.rejectsQuantity = null;
                }
            } else {
                this.$message.warning('请输入数字值,且是正整数');
                this.rejectsQuantity = null;
            }
        },
        changeReturnQuantity(val) {
            if (Number.isInteger(val)) {
                if (val > this.rejectsQuantity) {
                    this.$message.warning('退回不良品数不能大于本次不良品');
                    this.returnQuantity = null;
                }
            } else {
                this.$message.warning('请输入数字值,且是正整数');
                this.returnQuantity = null;
            }
        },

        del(index) {
            this.remarks.splice(index, 1);
        },
        add() {
            if (this.remarks.length) {
                let status = this.remarks.every(item => {
                    return item.rejectsQuantity && item.rejectsDesc;
                });
                if (status) {
                    let arr = this.remarks.map(item => item.rejectsQuantity);
                    let num = arr.reduce((item, value) => item + value);
                    if (num > this.rejectsQuantity) {
                        this.$message.warning('添加数量之和已经大于本次不良品');
                        return;
                    }
                    this.remarks.push({
                        rejectsQuantity: '',
                        rejectsDesc: ''
                    });
                } else {
                    this.$message.warning('请填写数量，原因在添加');
                }
            } else {
                this.remarks.push({
                    rejectsQuantity: '',
                    rejectsDesc: ''
                });
            }
        },
        back() {
            if (!this.purchaseProductBarCode) {
                this.$message.warning('条形码不能为空');
                return;
            }
            if (
                this.inspectQuantity === null ||
                this.inspectQuantity === undefined ||
                this.inspectQuantity === ''
            ) {
                this.$message.warning('质检数不能为空');
                return;
            } else {
                if (this.inspectQuantity <= 0) {
                    this.$message.warning('质检数必须大于0');
                    return;
                }
            }
            // if(!this.returnQuantity){
            //     this.$message.warning("退货不良品不能为空")
            //     return
            // }
            if (
                this.rejectsQuantity === null ||
                this.rejectsQuantity === undefined ||
                this.rejectsQuantity === ''
            ) {
                this.$message.warning('本次不良品不能为空');
                return;
            }
            if (this.remarks.length) {
                let status = this.remarks.every(item => {
                    return item.rejectsQuantity && item.rejectsDesc;
                });
                if (!status) {
                    this.$message.warning('添加的数量及原因不能为空');
                    return;
                }
            }

            this.$api['procurement/QCconfirmQC']({
                purchaseProductBarCode: this.purchaseProductBarCode,
                inspectQuantity: this.inspectQuantity,
                inspectType: Number(this.inspectType),
                returnQuantity: this.returnQuantity,
                rejectsQuantity: this.rejectsQuantity,
                rejectsInfo: this.rejectsInfo
            })
                .then(res => {
                    this.$message.success(res.msg);
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        //当条形码改变时请求数据
        barCodeChange(val) {
            console.log(val);
            if (val) {
                this.getBarCodeInfo(val);
            }
        },
        getBarCodeInfo(purchaseProductBarCode) {
            this.$api['procurement/QCgetDetailByCode']({
                purchaseProductBarCode
            })
                .then(res => {
                    this.info.requirement = res.rows.requirement;
                    this.info.lowerSingleQuantity =
                        res.rows.lowerSingleQuantity;
                    this.info.goodProductQuantity =
                        res.rows.goodProductQuantity;
                    this.info.rejectsQuantity = res.rows.rejectsQuantity;
                    this.info.noback = res.rows.returnQuantity;

                    let newObj = res.rows.productInfo1;
                    newObj['sing'] = `长${newObj.singleLong ||
                        0}     /宽${newObj.singleWide ||
                        0}     /高${newObj.singleHigh || 0}`;
                    newObj['package'] = `长${newObj.packageLong ||
                        0}    /宽${newObj.packageWide ||
                        0}    /高${newObj.packageHigh || 0}`;

                    let str = res.rows.variantPropertys.map(item => {
                        return item.propertyName + ':' + item.propertyValue;
                    });

                    newObj['attribute'] = str.join('/');

                    this.detailsInfo1 = newObj;

                    this.productImgs = res.rows.productImgs;
                    this.detailsInfo2 = res.rows.productInfo2;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        handleClick(tab, event) {
            if (tab.name == 'third' && this.purchaseProductBarCode) {
                this.getReturnRecord('QCgetReturnRecord');
                return;
            }
            if (tab.name == 'second' && this.purchaseProductBarCode) {
                this.getReturnRecord('QCgetHisRecord');
            }
        },
        getReturnRecord(url) {
            this.$api['procurement/' + url]({
                purchaseProductBarCode: this.purchaseProductBarCode,
                sortOrder: 'asc',
                pageSize: this.pageSize,
                pageNumber: this.currentPage
            })
                .then(res => {
                    this.list = res.rows;
                    this.pageSize = res.pageSize;
                    this.currentPage = res.pageNo;
                    this.total = res.total;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            let url = null;
            if (this.activeName == 'third') url = 'QCgetReturnRecord';
            if (this.activeName == 'second') url = 'QCgetHisRecord';
            this.getReturnRecord(url);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            let url = null;
            if (this.activeName == 'third') url = 'QCgetReturnRecord';
            if (this.activeName == 'second') url = 'QCgetHisRecord';
            this.getReturnRecord(url);
        },
        ...mapActions('common', ['getSupplierList'])
    },
    components: {
        columnTable
    },
    mounted() {
        this.getSupplierList();
    }
};
</script>

<style lang="scss" scope>
.backWarp {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.inputBox {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #f5f7fa;
    font-size: 24px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    .inputItem {
        display: flex;
        flex-wrap: wrap;
        .backbtn {
            margin-left: 20px;
            span {
                font-size: 24px;
            }
        }
    }
}
.select {
    width: 230px;
    height: 50px;
    .el-input {
        height: 50px;
        input {
            height: 50px;
            font-size: 24px;
        }
    }
}
.input {
    width: 280px;
    height: 50px;
    input {
        height: 50px;
        font-size: 24px;
    }
}
.tabsInfo {
    margin-top: 10px;
    flex: 1;
    // position: relative;
    .el-tabs__content {
        // position: absolute;
        // left: 0;
        // right: 0;
        // top:39px;
        // bottom: 0;
        // overflow-y: auto;
        min-height: 300px;
    }
    .tabsBox {
        height: 100%;
        .el-tabs__header {
            .el-tabs__nav {
                // height: 100%;
                .el-tabs__item {
                    height: 80px !important;
                    // margin-bottom: 10px;
                }
            }
        }
        .el-tabs__content {
            position: inherit;
            .el-tab-pane {
                overflow: hidden;
                text-align: center;
            }
        }
    }
}
</style>
