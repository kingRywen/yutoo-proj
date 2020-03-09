<template lang="html">
    <div class="info-content">
        <!-- 基本信息 -->
        
        <el-row :gutter="15" class="baseinfo">
            <el-col :span="$route.query.orderType==1?8:12">
                <columnTable :data="info.essentialInfo" :columns="$route.query.orderType==2?columnsD:columnsA" title="订单来源" />
            </el-col>
            <el-col :span="8"  v-if="$route.query.orderType==1">
                <columnTable :data="info.orderPrice" :columns="columnsB" :title="`订单金额（${info.essentialInfo && info.essentialInfo.currencyTypeName}）`"/>
            </el-col>
            <el-col :span="$route.query.orderType==1?8:12">
                <columnTable :data="info.buyerInfo" :columns="columnsC" title="买家信息" v-if="$route.query.orderType==1 || $route.query.orderType==3"/>

                <columnTable :data="info.buyerInfo" :columns="columnsE" title="收货地址" v-if="$route.query.orderType==2"/>   
            </el-col>
        </el-row>
        <!--  -->
        <yt-table :data="info.products" :columns="listColumns" :border="true" :selection="false"></yt-table>
        <!--  -->
        <div style="margin-top:15px;" v-if="$route.query.orderType==1 || $route.query.orderType==3">
            <el-table :data="info.distributions"  border >
                <el-table-column label="配送信息" width="400" align="center">
                    <template slot-scope="scope">
                        <columnTable :data="info.distributions[scope.$index]" :columns="distributionsTableColumns"/>
                    </template>
                </el-table-column>
                <el-table-column label="关联产品"  align="center">
                    <template slot-scope="scope">
    <ul style="width: 100%;height: 100%;verflow-x: auto;">
        <li v-for="item in scope.row.products" :key="item.id" style="float: left;position: relative;border: 1px solid #ccc;margin-right: 12px;">
            <img v-lazy="item.productImg" alt width="auto" height="156" style="display: block;">
            <div class="amount">{{item.deliveryAmount}}</div>
        </li>
    </ul>
</template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center" :render-header="handlerRenderHeader">
                    <template slot-scope="scope">
    <el-button type="text" @click="editDeliver(scope.row.orderDeliverId)">编辑</el-button>
    <el-button type="text" @click="delDeliver(scope.row.orderDeliverId)">删除</el-button>
</template>
                </el-table-column>
            </el-table>
        </div>
        <el-collapse-transition>
            <ul class="moreInfo" v-if="ismore">
                <li>
                    <div class="moreItem">
                        <div class="text" style="width: 75px;">待审查原因：</div>
                        <span class="text" v-show="!editStatus.a" style="flex:1;">{{info.essentialInfo.issue}}</span>
                        <transition name="el-zoom-in-center">
                                <el-input type="textarea"  v-show="editStatus.a" v-model.trim="editStatus.remark4" clearable size="small" style="flex:1;margin-right:10px;" placeholder="请输入内容"></el-input>
                        </transition>  
                        <div style="display:flex;justify-content: flex-end;">                            
                            <el-button style="height:32px;" type="primary" plain icon="el-icon-edit" size="small" @click="edit(4,editStatus.remark4,info.essentialInfo.issue)">{{editStatus.a?'保存':'录入问题'}}</el-button>
                            <el-button style="height:32px;" type="primary" plain icon="el-icon-delete" size="small" @click="removeProblem">清除问题</el-button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="moreItem">
                        <span class="text">订单备注：</span>
                        <span class="text" v-show="!editStatus.b" style="flex:1;">{{ info.essentialInfo.orderRemark }}</span>
                        <transition name="el-zoom-in-center">
                                <el-input
                                    type="textarea"
                                    v-show="editStatus.b"
                                    v-model.trim="editStatus.remark1"
                                    clearable size="small"
                                    style="margin-right:10px;flex:1;"
                                    placeholder="请输入内容">
                                </el-input>
                        </transition>
                        <div class="" style="display:flex;justify-content: flex-end;">                            
                            <el-button type="primary" plain icon="el-icon-edit" size="small"
                                style="height:32px;"
                                @click="edit(1,editStatus.remark1,info.essentialInfo.orderRemark)">
                                    {{editStatus.b ? '保存' : '修改备注'}}
                                </el-button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="moreItem">
                        <span class="text">发货备注： </span>
                        <span class="text" v-show="!editStatus.c" style="flex:1;">{{ info.essentialInfo.deliverRemark }}</span>
                        <transition name="el-zoom-in-center">
                                <el-input
                                    type="textarea"
                                    v-show="editStatus.c"
                                    v-model.trim="editStatus.remark2"
                                    clearable size="small"
                                    style="margin-right:10px;flex:1;"
                                    placeholder="请输入内容">
                                </el-input>
                            </transition>
                        <div class="" style="display:flex;justify-content: flex-end;">                            
                            <el-button type="primary" plain icon="el-icon-edit" size="small"
                                style="height:32px;"
                                @click="edit(2,editStatus.remark2,info.essentialInfo.deliverRemark)">
                                {{editStatus.c ? '保存' : '修改备注'}}
                            </el-button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="moreItem">
                        <span class="text"  >其他备注：</span>
                        <span class="text" v-show="!editStatus.d" style="flex:1;">{{ info.essentialInfo.otherRemark }}</span>
                        <transition name="el-zoom-in-center">
                                <el-input
                                    type="textarea"
                                    v-show="editStatus.d"
                                    v-model.trim="editStatus.remark3"
                                    clearable size="small"
                                    style="margin-right:10px;flex:1;"
                                    placeholder="请输入内容">
                                </el-input>
                            </transition>
                        <div class="" style="display:flex;justify-content: flex-end;">                            
                            <el-button plain type="primary" icon="el-icon-edit" size="small"
                                style="height:32px;"
                                @click="edit(3,editStatus.remark3,info.essentialInfo.otherRemark)">
                                    {{editStatus.d ? '保存' : '修改备注'}}
                            </el-button>
                        </div>
                    </div>
                </li>
            </ul>
        </el-collapse-transition>
        <el-button type="text" class="more" @click='ismore=!ismore'>{{ismore?'隐藏更多':'展开更多'}}</el-button>


        <!-- 添加编辑配送信息 -->
        <el-dialog :title="addEditDialog.title" :visible.sync="addEditDialog.status" width="1150px" center>
            <el-form class="addEditDialog-content" :model="addEditform" ref='addEditform'>
                <el-table :data="addEditDialog.listA"  border style="width: 100%">
                    <el-table-column label="配送方式"  align="center">
                        <template slot-scope="scope">
    <el-form-item prop="dispatchType" :rules="[
                                                            { required: true, message: '请选择配送方式', trigger: ['blur', 'change'] }
                                                            ]">
        <el-select v-model="addEditform.dispatchType" size="small">
            <el-option :label="item.distName" :value="item.distId" v-for="item in distributionModeList" :key="item.id"/>
        </el-select>
    </el-form-item>
</template>
                                                </el-table-column>
                                                <el-table-column label="运输方式" align="center">
                                                    <template slot-scope="scope">
    <el-form-item prop="transportTypeSys" :rules="[
                                                            { required: true, message: '请选择运输方式', trigger: ['blur', 'change'] }
                                                            ]">
        <el-select v-model="addEditform.transportTypeSys" size="small">
            <el-option :label="item.label" :value="item.value" v-for="item in transportTypeList" :key="item.id"></el-option>
        </el-select>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column label="承诺发货时间"   align="center">
                        <template slot-scope="scope">
    <el-form-item prop="scheduledDeliveryTime" :rules="[
                              { required: true, message: '请选择承诺发货时间', trigger: ['blur', 'change'] }
                            ]">
        <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" size="small" v-model="addEditform.scheduledDeliveryTime" type="datetime"></el-date-picker>
    </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column label="实际发货时间"  align="center">
                        <template slot-scope="scope">
    <el-form-item prop="deliveryTime" :rules="[
                                     { required: true, message: '请选择实际发货时间', trigger: ['blur', 'change'] }
                                ]">
        <el-date-picker style="width:100%" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" size="small" v-model="addEditform.deliveryTime" type="datetime"></el-date-picker>
    </el-form-item>
</template>
                            </el-table-column>
                            <el-table-column label="追踪号"  align="center">
                                <template slot-scope="scope">
    <el-form-item
        prop="logisticsNumber"
        :rules="[
                                                                    { required: true, message: '请输入追踪号', trigger: ['blur', 'change'] }
                                                                    ]"
    >
        <el-input v-model="addEditform.logisticsNumber" size="small"/>
    </el-form-item>
</template>
                    </el-table-column>
                </el-table>
                <el-button round style="margin:10px 0;" size="small" type="primary" plain @click='addRelevancy'>添加关联订单产品</el-button>
                <el-form-item
                    prop="products"
                    :rules="[
                      { required: true, message: '请添加关联订单产品', trigger: 'change' }
                    ]">
                    <el-table :data="addEditform.products"  border style="width: 100%">

                        <el-table-column label="图片"  align="center" width="100">
                            <template slot-scope="scope">
    <img :src="scope.row.productImg" height="60" width="auto">
</template>
                        </el-table-column>
                        <el-table-column label="产品SKU" prop="productSku" align="center" ></el-table-column>  
                        <el-table-column label="自定义SKU" prop="customSku" align="center"></el-table-column>   
                        <el-table-column label="产品名称" prop="nameEn" align="center"></el-table-column>
                        <el-table-column label="订购数量"  align="center">
                            <template slot-scope="scope">
    <el-input-number :min="1" :max="+scope.row.productQuantity" v-model="scope.row.quantity"/>
</template>
                        </el-table-column> 
                        <el-table-column label="操作"  align="center">
                            <template slot-scope="scope">
    <el-button type="danger" circle @click="delproductsitem(scope.$index)">
        <i class="el-icon-delete"></i>
    </el-button>
</template>
                        </el-table-column>    
                    </el-table> 


                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddEditform('addEditform')">取 消</el-button>
                <el-button type="primary" @click="submitAddEditform('addEditform')">确 定</el-button>
            </span>
        </el-dialog>

        <!--  -->
        <el-dialog title="关联sku" :visible.sync="skuDialog" width="888px" center>
            <div class="addEditDialog-content">
                <search :searchList="skuSearchList" @search="search"></search>
                <yt-table
                    @handleSelectionChange='handleSelectionChange'
                    :data="skuRelevancyList"
                    :columns="skuRelevancyColumns"
                    :border="true" style="margin-top:20px;"/>
                <el-pagination
                    style="text-align: right;margin-top: 10px;"
                    @size-change="handleSkuSizeChange"
                    @current-change="handleSkuCurrentChange"
                    :current-page="currentPageSku"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSizeSku"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalSku">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="skuDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitSelectSku">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
import columnTable from '@/components/columnTable/columnTable';
import { mapGetters, mapActions } from 'vuex';
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        update: Function
    },
    data() {
        // let vm = this
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            columnsA: [
                { label: '来源平台', value: 'platformName' },
                { label: '来源店铺', value: 'storeName' },
                { label: '国家', value: 'cneeCountryName' },
                { label: '下单时间', value: 'createOrderTime' },
                { label: '添加时间', value: 'createTime' }
            ],
            columnsD: [
                { label: '状态', value: 'orderStatusName' },
                { label: '备货仓库', value: 'stockUpWarehouseName' },
                { label: '下单时间', value: 'createOrderTime' },
                { label: '国家', value: 'cneeCountryName' }
            ],
            columnsE: [
                // { label: '联系人', value: 'senderContacts' },
                // { label: 'TEL', value: 'senderContactPhone' },
                // { label: 'Address', value: 'address' },
                { label: '联系人', value: 'cneeName' },
                { label: 'TEL', value: 'cneePhone' },
                { label: 'Address', value: 'cneeAddressDetailFirst' },
                { label: 'REgion', value: 'address' }
                // { label: 'Email', value: '' }
            ],
            columnsB: [
                { label: '支付方式', value: 'payTypeName' },
                { label: '商品总额', value: 'productPriceSum' },
                { label: '配送费用', value: 'freight' },
                { label: '优惠金额', value: 'discountCouponPrice' },
                { label: 'VIP折扣', value: 'vipDiscountPrice' },
                { label: '订单金额', value: 'orderPrice' }
            ],
            columnsC: [
                { label: '买家ID', value: 'cneeMemberId' },
                { label: '买家名称', value: 'cneeName' },
                { label: 'TEL', value: 'cneePhone' },
                { label: 'Address', value: 'cneeAddressDetailFirst' },
                { label: 'REgion', value: 'address' },
                { label: 'Email', value: 'cneeEmail' }
            ],
            //
            list: [],
            listColumns: [
                { value: 'customSku', label: '自定义SKU', width: '180' },
                { value: 'productSku', label: '产品SKU' },
                { value: 'asin', label: 'ASIN' },
                { value: 'productPrice', label: '商品单价' },
                {
                    children: 'variantProperty',
                    label: '产品参数',
                    prop: {
                        key: 'propertyName',
                        value: 'propertyValue'
                    }
                },
                { value: 'orderAmount', label: '订购数量' },
                { value: 'logisticsProperty', label: '物流属性' },
                { value: 'tortProperty', label: '侵权属性' },
                { value: 'deliveryWarehouseName', label: '发货仓库' },
                { value: 'availableStock', label: '可用库存', width: '100' },
                { value: 'lockStock', label: '锁定库存', width: '100' },
                { value: 'purchaseing', label: '采购情况' }
            ],

            distributionsColumns: [
                {
                    children: 'products',
                    label: '关联产品'
                }
            ],
            distributionsTableColumns: [
                { label: '配送方式', value: 'dispatchType' },
                { label: '运输方式', value: 'transportType' },
                { label: '承诺发货时间', value: 'scheduledDeliveryTime' },
                { label: '实际发货时间', value: 'deliveryTime' },
                { label: '追踪号', value: 'logisticsNumber' }
            ],
            editStatus: {
                a: false,
                b: false,
                c: false,
                d: false,

                remark1: null,
                remark2: null,
                remark3: null,
                remark4: null
            },
            ismore: false,
            addEditDialog: {
                status: false,
                title: '',
                listA: [{}],
                listB: []
            },
            addEditform: {
                dispatchType: null,
                transportTypeSys: null,
                scheduledDeliveryTime: null,
                deliveryTime: null,
                logisticsNumber: null,
                products: []
            },
            skuSearchList: [
                {
                    label: 'SKU:',
                    value: 'sku',
                    type: 'input',
                    style: {
                        width: '150px'
                    }
                },
                { label: '产品名称:', value: 'name', type: 'input' },
                {
                    label: '发货仓库:',
                    value: 'warehouseId',
                    type: 'select',
                    style: {
                        width: '120px'
                    },
                    children: [],
                    props: {
                        label: 'warehouseName',
                        value: 'warehouseId'
                    }
                }
            ],
            skuRelevancyList: [],
            skuRelevancyColumns: [
                {
                    value: 'productImg',
                    label: '图片',
                    width: '100',
                    img: true,
                    style: {
                        width: 60,
                        height: 60
                    },
                    bulkyHeight: 180
                },
                { value: 'nameZh', label: '产品名称' },
                { value: 'productSku', label: '系统SKU' },
                { value: 'customSku', label: '自定义SKU' },
                { value: 'nameEn', label: '产品英文名称' },
                { value: 'purchaser', label: '采购人员' },
                { value: 'deliveryWarehouseName', label: '默认本地发货仓库' }
            ],
            //
            skuDialog: false,
            searchInfo: {},
            currentPageSku: 1,
            pageSizeSku: 10,
            totalSku: 0,
            selectSkuList: [],
            orderDeliverId: null
        };
    },
    methods: {
        removeProblem() {
            this.$api['order/orderClean']({
                orderId: this.$route.query.orderServiceId
            })
                .then(res => {
                    this.$message.success(res.msg);
                    this.update();
                    this.editStatus.a = false;
                    this.editStatus.remark4 = null;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        //
        submitSelectSku() {
            if (this.selectSkuList.length) {
                let params = {
                    orderId: this.$route.query.orderServiceId,
                    storeProductIds: this.selectSkuList.map(
                        item => item.storeProductId
                    )
                };
                this.$api['order/addConnection'](params)
                    .then(res => {
                        res.rows.forEach(i => {
                            i['quantity'] = i.productQuantity;
                        });
                        this.addEditform.products = res.rows;
                        this.skuDialog = false;
                    })
                    .catch(() => {
                        // this.$message.error(res.msg)
                    });
            } else {
                this.$message.warning('请先选择需要关联的sku产品');
            }
        },
        handleSelectionChange(val) {
            this.selectSkuList = val;
        },
        search(val) {
            this.searchInfo = val;
            this.getRelevancyData('search');
        },
        handleSkuSizeChange(val) {
            this.pageSizeSku = val;
            this.getRelevancyData('search');
        },
        handleSkuCurrentChange(val) {
            this.currentPageSku = val;
            this.getRelevancyData('search');
        },
        //请求关联产品数据
        getRelevancyData(val) {
            let params = {
                sortOrder: 'asc',
                pageSize: this.pageSizeSku || 10,
                pageNumber: this.currentPageSku || 1,
                orderId: this.$route.query.orderServiceId
            };
            if (val == 'search') {
                let data = { ...this.searchInfo };
                let obj = {};
                for (let key in data) {
                    if (data[key]) obj[key] = data[key];
                }
                params = Object.assign({}, params, obj);
            }
            this.$api['order/GetConnection'](params)
                .then(res => {
                    this.skuRelevancyList = res.rows;
                    this.pageSizeSku = res.pageSize;
                    this.currentPageSku = res.pageNo;
                    this.totalSku = res.total;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        //添加关联产品
        addRelevancy() {
            this.skuDialog = true;
            this.getRelevancyData();
            this.getWarehouseList().then(() => {
                this.skuSearchList[2].children = this.warehouseList;
            });
        },
        //////////////////////////////////////////////////////////////////////////////

        //配送信息编辑
        editDeliver(orderDeliverId) {
            this.orderDeliverId = orderDeliverId;
            this.addEditDialog.status = true;
            this.addEditDialog.title = '编辑配送信息';
            this.initTransportTypeList();
            this.getDistributionMode();
            this.$api['order/deliverDetail']({ orderDeliverId })
                .then(res => {
                    res.rows.products.forEach(i => {
                        i['quantity'] = i.productQuantity;
                    });
                    let obj = Object.assign({}, res.rows);
                    for (let k in this.addEditform) {
                        for (let j in obj) {
                            if (k == j) {
                                this.addEditform[k] = obj[j];
                            }
                        }
                    }
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        //配送信息删除
        delDeliver(orderDeliverIds) {
            this.$confirm('确定删除该条配送信息吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api['order/deliverRemove']({
                        orderDeliverIds: Array.of(orderDeliverIds)
                    })
                        .then(res => {
                            this.$message.success(res.msg);
                            this.update();
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                })
                .catch(() => {
                    return false;
                });
        },
        //关联的配送信息删除
        delproductsitem(index) {
            this.addEditform.products.splice(index, 1);
        },
        //配送信息取消
        resetAddEditform(formName) {
            this.$refs[formName].resetFields();
            this.addEditDialog.status = false;
        },
        //配送信息确定
        submitAddEditform(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.addEditform, {
                        orderId: this.$route.query.orderServiceId
                    });
                    let newProducts = params.products.map(item => {
                        return {
                            orderProductId: item.orderProductId,
                            quantity: item.quantity
                        };
                    });
                    let url = null;
                    if (this.addEditDialog.title == '添加配送信息') {
                        url = 'deliverSave';
                    } else {
                        url = 'deliverUpdate';
                        params = Object.assign({}, this.addEditform, {
                            orderDeliverId: this.orderDeliverId
                        });
                    }
                    params.products = newProducts;
                    this.$api['order/' + url](params)
                        .then(res => {
                            this.$message.success(res.msg);
                            this.addEditDialog.status = false;
                            this.update();
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                } else {
                    return false;
                }
            });
        },
        //修改更多
        edit(type, remark, beforeRemark) {
            switch (type) {
                case 4:
                    this.editStatus.a = !this.editStatus.a;
                    if (!this.editStatus.a) {
                        if (remark == beforeRemark) return;
                        this.updateRemark(type, remark);
                    }
                    break;
                case 1:
                    this.editStatus.b = !this.editStatus.b;
                    if (!this.editStatus.b) {
                        if (remark == beforeRemark) return;
                        this.updateRemark(type, remark);
                    }
                    break;
                case 2:
                    this.editStatus.c = !this.editStatus.c;
                    if (!this.editStatus.c) {
                        if (remark == beforeRemark) return;
                        this.updateRemark(type, remark);
                    }
                    break;
                case 3:
                    this.editStatus.d = !this.editStatus.d;
                    if (!this.editStatus.d) {
                        if (remark == beforeRemark) return;
                        this.updateRemark(type, remark);
                    }
                    break;
            }
        },
        //修改备注
        updateRemark(type, remark) {
            let params = {
                orderIds: [this.$route.query.orderServiceId],
                remark,
                type
            };
            this.$api['order/updateRemark'](params)
                .then(res => {
                    this.$message.success(res.msg);
                    this.update();
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        handlerRenderHeader() {
            return (
                <el-button
                    type="primary"
                    size="small"
                    plain
                    onClick={this.addEdit}
                    domPropsInnerHTML="添加配送"
                />
            );
        },

        addEdit() {
            this.addEditDialog.status = true;
            this.addEditDialog.title = '添加配送信息';
            this.initTransportTypeList();
            this.getDistributionMode();
            this.$nextTick(() => {
                this.$refs.addEditform.resetFields();
            });
        },
        ...mapActions('common', [
            'initTransportTypeList',
            'getWarehouseList',
            'getDistributionMode'
        ])
    },
    computed: {
        ...mapGetters('common', [
            'transportTypeList',
            'warehouseList',
            'distributionModeList'
        ])
    },
    components: {
        columnTable
    }
};
</script>

<style lang="scss" scoped>
.info-content {
    padding-bottom: 30px;
}
.baseinfo {
    margin-bottom: 15px;
}
.moreInfo {
    margin-top: 15px;
    li {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .moreItem {
        display: flex;
        flex-direction: row;
        .text {
            line-height: 32px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
.addEditDialog-content {
    height: 520px;
    overflow-y: auto;
}
.amount {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: #fff;
}
</style>
