<template lang="html">
    <!-- 退换货 -->
    <el-form ref="form" :model="form" label-width="100px" size="small">
        <div class="infoItem">
            <h3 class="dialogItemTitle">订单信息</h3>
            <div class="border">
                <el-row>
                    <el-col :span="8">
                        <!-- 添加isAdd true 编辑false-->
                        <el-form-item label="订单号："                                
                                prop="orderNumber"
                                :rules="[
                                { required: true, message: '请输入订单号', trigger: 'change'},
                                ]">
                                <el-input placeholder="请输入订单号" v-model.trim="form.orderNumber" v-if="isAdd">
                                    <el-button slot="append" icon="el-icon-search" @click="getOrderId" :loading="loadingOrderId"></el-button>
                                </el-input>
                                <p v-else>{{form.orderNumber}}</p>
                            </el-form-item>      
                        
                    </el-col>  
                    <el-col :span="8" v-if='list.length'>
                        <el-form-item label="下单时间：">
                            {{createOrderTime}}                    
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if='list.length'>
                        <el-form-item label="下单金额：">
                            {{orderPrice}}                
                        </el-form-item>
                    </el-col>  
                </el-row>    
            </div>    
        </div>    
        <template  v-if='list.length'>
            <div class="infoItem">
                <h3 class="dialogItemTitle">仓库信息</h3>
                <div class="border">
                <el-row>
                    <el-col :span="8">
                    <el-form-item
                        label="选择仓库："
                        prop="warehouseId"
                        :rules="[
                                        { required: true, message: '仓库不能为空', trigger: 'change'},
                                        ]"
                    >                      
                        <el-select v-model="form.warehouseId" style="width:215px;" :disabled="disabled">
                        <el-option :label="i.warehouseName" :value="i.warehouseId" v-for="(i,j) in warehouseList" :key="j"></el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item
                        label="国家："
                        prop="warehouseCountry"
                        :rules="[
                                        { required: true, message: '国家不能为空', trigger: 'change'},
                                        ]"
                    >
                        <el-select v-model="form.warehouseCountry" :disabled="disabled">
                        <el-option :label="i.label" :value="i.value" v-for="(i,j) in countryList" :key="j"></el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="10" style="display:flex;">
                    <el-form-item
                        label="邮编："
                        prop="warehousePostcode"
                        :rules="[
                                        { required: true, message: '邮编不能为空',trigger: 'change'},
                                        ]"
                    >
                        <el-input v-model="form.warehousePostcode" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-button
                        :disabled="disabled"
                        type="primary"
                        plain
                        size="small"
                        style="height:32px;margin-left:10px;flex:1;"
                        @click="warehouse"
                    >管理退换货仓库</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                    <el-form-item
                        label="联系人："
                        prop="warehouseContacts"
                        :rules="[
                                        { required: true, message: '联系人不能为空',trigger: 'change'},
                                        ]"
                    >
                        <el-input v-model="form.warehouseContacts" style="width: 215px;" :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item
                        label="联系电话："
                        prop="warehousePhone"
                        :rules="[
                                        { required: true, message: '电话不能为空',trigger: 'change'},
                                        { type: 'number', message: '须为数字值'}
                                        ]"
                                    
                    >
                        <el-input v-model.number="form.warehousePhone" type='number' :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="10">
                    <el-form-item
                        label="地址："
                        prop="warehouseAddress"
                        :rules="[
                                        { required: true, message: '地址不能为空',trigger: 'change'},
                                        ]"
                    >
                        <el-input v-model="form.warehouseAddress" :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                </div>
            </div>
            <div class="infoItem">
                <h3 class="dialogItemTitle">客户信息</h3>
                <div class="border">
                <el-row>
                    <el-col :span="8">
                    <el-form-item
                        label="姓："
                        prop="customerFirstName"
                        :rules="[
                                        { required: true, message: '此项不能为空',trigger: 'change'},
                                        ]"
                    >
                        <el-input v-model.trim="form.customerFirstName" :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item
                        label="名："
                        prop="customerLastName"
                        :rules="[
                                        { required: true, message: '此项不能为空',trigger: 'change'},
                                        ]"
                    >
                        <el-input v-model.trim="form.customerLastName" :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="10">
                    <el-form-item
                        label="电话："
                        prop="customerPhone"
                        :rules="[
                                        { required: true, message: '电话不能为空',trigger: 'change'},
                                        { type: 'number', message: '须为数字值'}
                                        ]"
                    >
                        <el-input v-model.number="form.customerPhone" :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="跟踪号：">
                            <el-input v-model="form.trackingNumber" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                   <el-col :span="6">
                        <el-form-item label="邮编："
                            prop="customerPostcode"
                            :rules="[
                               { required: true, message: '请输入邮编号码',trigger: 'change'},      
                            ]"
                            >
                            <el-input v-model="form.customerPostcode" type="number" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                    <el-form-item
                        label="邮件地址："
                        prop="customerAddress"
                        :rules="[
                                        { required: true, message: '请输入邮箱地址', trigger: 'change' },                              
                                        ]"
                    >
                        <el-input v-model="form.customerAddress" :disabled="disabled"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                </div>
            </div>
            <div class="infoItem">
                <h3 class="dialogItemTitle">产品信息</h3>
                <div class="border">
                   <!--  -->
           
                 <el-table :data="list" border style="width: 100%" class="mb10">
                     <el-table-column label="图片" width="180" align="center" >
                         <template slot-scope="scope"> 
                            <el-tooltip  effect="light" placement="right">
                                <div slot="content">
                                    <img :src="scope.row.productImg" width="auto" height="180">                        
                                </div> 
                                <img :src="scope.row.productImg" width="49" height="49">                      
                            </el-tooltip>
                        </template>
                    </el-table-column>                     
                    <el-table-column prop="productName" label="产品名称" align="center"/>                   
                    <el-table-column prop="productQuantity" label="订购数量" align="center"/>
                    <el-table-column label="退货数量" width="180" align="center" >
                         <template slot-scope="scope">
  <el-form-item
    class="formItem"
    :prop="'products.' + scope.$index + '.returnAmount'"
    :rules="[
                                { required: true, message: '数量不能为空',trigger: 'change'},                                
                            ]"
  >
    <el-input v-model="form.products[scope.$index].returnAmount" size="mini" type="number" :disabled="disabled"></el-input>
  </el-form-item>
</template>
                    </el-table-column>
                </el-table>
                <!--  -->
                </div>
            </div>
            <div class="infoItem">
                <h3 class="dialogItemTitle">退货信息</h3>
                <div class="border">
                <el-form-item label="你想要：" prop="solution" >
                    <el-radio-group v-model="form.solution" :disabled="disabled">
                    <el-radio :label="i.value" v-for="i in returnedgoodsList" :key="i.id">{{i.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="问题类型：" prop="issueType">
                    <el-radio-group v-model="form.issueType" :disabled="disabled">
                    <el-radio :label="i.value" v-for="i in problemTypeList" :key="i.id">{{i.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="form.packageOpenedFlag" :disabled="disabled">是否打开外包装</el-checkbox>
                    <el-checkbox v-model="form.usedFlag" :disabled="disabled">是否使用过</el-checkbox>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model.trim="form.description" class="textarea" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item
                    label="上传图片："
                    prop="returnImgs"
                    :rules="[
                                { required: true, message: '请上传问题图片',trigger: 'change'},
                                ]"
                >
                    <el-upload
                    :disabled="disabled"
                    class="upload-demo"
                    action
                    :with-credentials="true"
                    :on-change="onChange"
                    :on-remove="onRemove"
                    accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
                    :auto-upload="false"
                    list-type="picture-card"
                    :file-list="filelist"
                    :on-preview="handlePictureCardPreview"
                    >
                    <i class="el-icon-plus"></i>
                    <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                    <div slot="tip" class="el-upload__tip" v-if="!disabled">请上传问题产品的图片,产品的条形码贴纸的照片,产品列表以及外包装</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                    <img width="100%" :src="dialogImageUrl" alt>
                    </el-dialog>
                </el-form-item>
                </div>
            </div>
        </template>
    </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { returnedgoodsList, problemTypeList } from '../mixins'
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loadingOrderId: false,
            problemTypeList,
            returnedgoodsList,
            form: {
                orderNumber: '',
                customerPostcode: '',

                warehouseId: '',
                warehouseCountry: '',
                warehousePostcode: '',
                warehouseContacts: '',
                warehousePhone: '',
                warehouseAddress: '',

                customerFirstName: '',
                customerLastName: '',
                customerPhone: '',
                trackingNumber: '',
                customerAddress: '',

                solution: 1,
                issueType: 1,
                packageOpenedFlag: false,
                usedFlag: false,
                description: null,
                returnImgs: [],
                products: []
            },
            dialogImageUrl: '',
            dialogVisible: false,
            list: [],
            orderId: '',
            createOrderTime: '',
            orderPrice: '',
            isAdd: true,
            filelist: []
        }
    },
    watch: {
        list(val) {
            this.form.products = val.map(item => {
                return {
                    orderProductId: item.orderProductId,
                    returnAmount: item.returnQuantity ? item.returnQuantity : ''
                }
            })
        }
    },
    computed: {
        ...mapGetters(['warehouseList', 'countryList'])
    },
    methods: {
        //编辑时获取全部信息
        getAllInfo(orderReturnId) {
            this.isAdd = false
            this.$api['email/returnDetail']({
                orderReturnId
            }).then(res => {
                res.rows.customerPhone = Number(res.rows.customerPhone)
                res.rows.warehousePhone = Number(res.rows.warehousePhone)
                for (let k in res.rows) {
                    for (let j in this.form) {
                        if (k == 'products') {
                            this.list = res.rows[k]
                            continue
                        }
                        if (k == 'createOrderTime') {
                            this.createOrderTime = res.rows[k]
                            continue
                        }
                        if (k == 'orderPrice') {
                            this.orderPrice = res.rows[k]
                            continue
                        }
                        if (k == 'orderNumSystem') {
                            this.form.orderNumber = res.rows[k]
                            continue
                        }
                        if (k == 'packageOpenedFlag') {
                            this.form.packageOpenedFlag = res.rows[k]
                                ? true
                                : false
                            continue
                        }
                        if (k == 'usedFlag') {
                            this.form.usedFlag = res.rows[k] ? true : false
                            continue
                        }
                        if (k == 'imgs') {
                            this.filelist = res.rows[k].map(item => {
                                return {
                                    url: item.imgPath
                                }
                            })
                            this.form.returnImgs = res.rows[k].map(item => {
                                return {
                                    url: item.imgPath
                                }
                            })
                        }
                        if (k == j) {
                            this.form[j] = res.rows[k]
                        }
                    }
                }
            })
        },
        //
        getOrderId() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.loadingOrderId = true
                    this.$api['order/getOrderIdByNumber']({
                        orderNumber: this.form.orderNumber
                    })
                        .then(res => {
                            this.orderId = res.orderId
                            this.getInfo()
                            this.getOrderEditInfo()
                            this.loadingOrderId = false
                        })
                        .catch(err => {
                            this.$message.error(err.msg)
                            this.loadingOrderId = false
                        })
                }
            })
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        onChange(file) {
            if (this.form.returnImgs.find(item => item.name === file.name))
                return
            this.form.returnImgs.push(file)
            console.log(this.form.returnImgs)
        },
        onRemove(file) {
            let index = this.form.returnImgs.findIndex(
                item => item.name === file.name
            )
            this.form.returnImgs.splice(index, 1)
        },
        //获取添加信息
        getOrderEditInfo() {
            this.$api['order/orderInfo']({
                orderId: this.orderId
            })
                .then(res => {
                    //买家信息
                    let {
                        cneeFirstName,
                        cneeLastName,
                        cneePhone,
                        postcode,
                        cneeAddressDetailFirst
                    } = res.rows.buyerInfo
                    this.form.customerFirstName = cneeFirstName
                    this.form.customerLastName = cneeLastName
                    this.form.customerPhone = Number(cneePhone)
                    this.form.customerAddress = cneeAddressDetailFirst

                    this.form.customerPostcode = postcode

                    let { createOrderTime, orderPrice } = res.rows.essentialInfo
                    this.createOrderTime = createOrderTime
                    this.orderPrice = orderPrice
                })
                .catch(err => {
                    this.$message.error(err.msg)
                })
        },
        //获取产品信息
        getInfo() {
            this.$api['order/returnInfo']({
                orderId: this.orderId
            })
                .then(res => {
                    let { products } = res.rows
                    this.list = products
                })
                .catch(err => {
                    this.$message.error(err.msg)
                })
        },
        submitForm(title, callback, orderReturnId) {
            if (!this.list.length) {
                this.getOrderId()
                return
            }
            if (this.disabled) {
                callback && callback()
                return
            }
            // if (title == '添加退换货') {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.form)

                    params.packageOpenedFlag = params.packageOpenedFlag ? 1 : 0
                    params.usedFlag = params.usedFlag ? 1 : 0
                    if (orderReturnId) {
                        //判断图片里是否全部为2进制，如不是删除
                        let arr = []
                        params.returnImgs.forEach(item => {
                            if (item.raw) {
                                arr.push(item)
                            }
                        })
                        if (arr.length) {
                            params.returnImgs = arr
                        } else {
                            delete params.returnImgs
                        }

                        params = Object.assign({}, params, {
                            orderReturnId
                        })
                    }

                    params.products = JSON.stringify(params.products)
                    this.$api['order/returnSave'](params)
                        .then(res => {
                            this.$message.success(res.msg)
                            callback && callback(true)
                        })
                        .catch(err => {
                            this.$message.error(err.msg)
                        })
                } else {
                    this.$message.warning('请填写完整在提交')
                    return false
                }
            })
        },
        resetForm() {
            this.isAdd = true
            this.list = []
            this.filelist = []
            this.form.returnImgs = []
            this.$refs.form.resetFields()
        },
        warehouse() {
            this.$notify.info({
                title: '消息',
                message: '仓库系统正在建设中...'
            })
        },
        ...mapActions(['getWarehouseList', 'getCountryList'])
    },
    mounted() {
        this.getCountryList()
        this.getWarehouseList()
    }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.formItem {
    .el-form-item__content {
        margin-left: 0 !important;
    }
}
.infoItem {
    margin-bottom: 25px;
}
.textarea {
    textarea {
        height: 120px;
        resize: none;
    }
}
</style>
