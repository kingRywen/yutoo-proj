<template lang="html">
    <!-- 退换货 -->
    <el-form ref="form" :model="form" label-width="100px" size="small">
        <div class="infoItem">
            <h3 class="dialogItemTitle">仓库信息</h3>
            <div class="border">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="选择仓库："
                            prop="warehouseId"
                            :rules="[
                              { required: true, message: '仓库不能为空', trigger: 'change'},
                            ]">
                            <el-select v-model="form.warehouseId" style="width:215px;">
                                <el-option :label="i.warehouseName" :value="i.warehouseId" v-for="(i,j) in warehouseList" :key='j'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="国家："
                            prop="warehouseCountry"
                            :rules="[
                              { required: true, message: '国家不能为空', trigger: 'change'},
                            ]">
                            <el-select v-model="form.warehouseCountry" >
                                <el-option :label="i.label" :value="i.value" v-for="(i,j) in countryList" :key='j'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" style="display:flex;">
                        <el-form-item label="邮编："
                            prop="warehousePostcode"
                            :rules="[
                              { required: true, message: '邮编不能为空',trigger: 'change'},
                            ]">
                            <el-input v-model="form.warehousePostcode"></el-input>
                        </el-form-item>
                        <el-button type="primary" plain size="small" style="height:32px;margin-left:10px;flex:1;" @click="warehouse">管理退换货仓库</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系人："
                            prop="warehouseContacts"
                            :rules="[
                              { required: true, message: '联系人不能为空',trigger: 'change'},
                            ]">
                            <el-input v-model="form.warehouseContacts" style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系电话："
                            prop="warehousePhone"
                            :rules="[
                              { required: true, message: '电话不能为空',trigger: 'change'},
                              { type: 'number', message: '须为数字值'}
                            ]">
                            <el-input v-model.number="form.warehousePhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="地址："
                            prop="warehouseAddress"
                            :rules="[
                              { required: true, message: '地址不能为空',trigger: 'change'},
                            ]">
                            <el-input v-model="form.warehouseAddress"></el-input>
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
                        <el-form-item label="姓："
                            prop="customerFirstName"
                            :rules="[
                               { required: true, message: '此项不能为空',trigger: 'change'},
                            ]">
                            <el-input v-model.trim="form.customerFirstName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名："
                            prop="customerLastName"
                            :rules="[
                               { required: true, message: '此项不能为空',trigger: 'change'},
                            ]">
                            <el-input v-model.trim="form.customerLastName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="电话："
                            prop="customerPhone"
                            :rules="[
                               { required: true, message: '电话不能为空',trigger: 'change'},
                               { type: 'number', message: '须为数字值'}
                            ]">
                            <el-input v-model.number="form.customerPhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="跟踪号：">
                            <el-input v-model="form.trackingNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="邮编："
                            prop="customerPostcode"
                            :rules="[
                               { required: true, message: '请输入邮编号码',trigger: 'change'}, 
                               { type: 'number', message: '须为数字值'}                              
                            ]"
                            >
                            <el-input v-model.number="form.customerPostcode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="邮寄地址："
                            prop="customerAddress"
                            :rules="[
                               { required: true, message: '请输入邮寄地址',trigger: 'change'},                               
                            ]">
                            <el-input v-model="form.customerAddress"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="infoItem">
            <h3 class="dialogItemTitle">产品信息</h3>
            <div class="border">
                <yt-table :data="list" :columns="columns" :border="true" :selection="false">
                    <el-table-column label="退货数量" width="180" align="center" slot="right">
                        <template slot-scope="scope">
                            <el-form-item
                                class="formItem"
                                :prop="'products.' + scope.$index + '.returnAmount'"
                                :rules="[
                                   { required: true, message: '数量不能为空',trigger: 'change'},
                                   { type: 'number', message: '须为数字值'}
                                ]">
                                <el-input v-model.number="form.products[scope.$index].returnAmount" size="mini"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </yt-table>
            </div>
        </div>
        <div class="infoItem">
            <h3 class="dialogItemTitle">退货信息</h3>
            <div class="border">
                <el-form-item label="你想要：" prop="solution">
                    <el-radio-group v-model="form.solution">
                        <el-radio label="1">退款不退货</el-radio>
                        <el-radio label="2">退货不退款</el-radio>
                        <el-radio label="3">退款退货</el-radio>
                        <el-radio label="4">换货</el-radio>
                        <el-radio label="5">退款</el-radio>
                        <el-radio label="6">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="问题类型：" prop="issueType">
                    <el-radio-group v-model="form.issueType">
                        <el-radio label="1">库房致残</el-radio>
                        <el-radio label="2">无实物少配件</el-radio>
                        <el-radio label="3">没有收到包裹</el-radio>
                        <el-radio label="4">到货商品有残损</el-radio>
                        <el-radio label="5">商品错发</el-radio>
                        <el-radio label="6">客户无理由退换</el-radio>
                        <el-radio label="7" style="margin: 10px 0;">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="form.packageOpenedFlag">是否打开外包装</el-checkbox>
                    <el-checkbox v-model="form.usedFlag">是否使用过</el-checkbox>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model.trim="form.description" class="textarea"></el-input>
                </el-form-item>
                <el-form-item label="上传图片："
                    prop="returnImgs"
                    :rules="[
                       { required: true, message: '请上传问题图片',trigger: 'change'},
                    ]">
                    <el-upload
                      class="upload-demo"
                      action=""
                      :with-credentials='true'
                      :on-change='onChange'
                      :on-remove ='onRemove'
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                      :auto-upload="false"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      >
                       <i class="el-icon-plus"></i>
                      <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                      <div slot="tip" class="el-upload__tip">请上传问题产品的图片,产品的条形码贴纸的照片,产品列表以及外包装</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </div>
        </div>
    </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            form: {
                orderId: this.$route.query.orderServiceId,
                solution: '1',
                issueType: '1',
                packageOpenedFlag: false,
                usedFlag: false,
                customerFirstName: '',
                customerPhone: '',
                description: null,
                customerPostcode: '',
                customerEmail: '',
                customerLastName: '',
                trackingNumber: '',
                returnImgs: [],
                products: []
            },
            dialogImageUrl: '',
            dialogVisible: false,
            list: [],
            columns: [
                {
                    value: 'productImg',
                    label: '图片',
                    width: '100',
                    img: true,
                    style: {
                        width: 49,
                        height: 49
                    },
                    bulkyHeight: 180
                },
                { value: 'productName', label: '产品名称' },
                { value: 'productQuantity', label: '订购数量' }
            ]
        };
    },
    watch: {
        list(val) {
            this.form.products = val.map(item => {
                return {
                    orderProductId: item.orderProductId,
                    returnAmount: ''
                };
            });
        }
    },
    computed: {
        ...mapGetters('common', ['warehouseList', 'countryList'])
    },
    methods: {
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        onChange(file) {
            if (this.form.returnImgs.find(item => item.name === file.name))
                return;
            this.form.returnImgs.push(file);
        },
        onRemove(file) {
            let index = this.form.returnImgs.findIndex(
                item => item.name === file.name
            );
            this.form.returnImgs.splice(index, 1);
            console.log(this.form.returnImgs);
        },
        getInfo() {
            this.$api['order/returnInfo']({
                orderId: this.$route.query.orderServiceId
            })
                .then(res => {
                    let {
                        products,
                        info: {
                            cneeFirstName,
                            cneeLastName,
                            cneePhone,
                            cneePostcode,
                            cneeEmail
                        }
                    } = res.rows;
                    this.list = products;

                    this.form.customerFirstName = cneeFirstName;
                    this.form.customerLastName = cneeLastName;
                    this.form.customerPhone = Number(cneePhone);
                    this.form.customerPostcode = Number(cneePostcode);
                    this.form.customerEmail = cneeEmail;
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        },
        submitForm(callback) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.form);
                    params.packageOpenedFlag = params.packageOpenedFlag ? 1 : 0;
                    params.usedFlag = params.usedFlag ? 1 : 0;
                    this.$api['order/returnSave'](params)
                        .then(res => {
                            this.$message.success(res.msg);
                            callback && callback(true);
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                        });
                } else {
                    this.$message.warning('请填写完整');
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        warehouse() {
            this.$.toUrl(
                'erp-warehouse/#/warehouse/warehouseManagement/subwarehouse',
                '_blank'
            );
        },
        ...mapActions('common', ['getWarehouseList', 'initCountryList'])
    }
};
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
