<template>
    <!-- <div>包裹复核</div> -->
    <div class="parcelReview">
        <div class="item">
            <h3 class="title">发货备货</h3>
            <div class="content">
                <el-form :inline="true" :model="form">
                    <el-form-item label="包裹单号：">
                        <el-input v-model.trim="form.packageNumber" @change="changePackageNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="产品条码：">
                        <el-input v-model.trim="form.code" @change="changecode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="toReview" type="primary" plain class="btn" :disabled="(form.packageNumber && form.code)?false:true">确认人工复核</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template v-if="isShowInfo">
            <div v-loading="!isShowInfo" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
                <div class="item">
                    <h3 class="title">发货备注</h3>
                    <div class="content remarks">{{deliverRemark}}</div>
                </div>
                <div class="item">
                    <h3 class="title">产品列表</h3>
                    <div class="content">
                        <yt-table :data="productlist" :columns="productColumns" :border="true" :selection="false"/>
                    </div>
                </div>
                <div class="item">
                    <h3 class="title">物流信息</h3>
                    <div class="content">
                        <div class="logistics">
                            <template v-for="item in logisticsList">
                                <el-row class="logistics_item" :key="item.label">
                                    <el-col :span="4" class="logistics_text">{{item.label}}</el-col>
                                    <el-col :span="20" class="logistics_info">{{item.value || "-"}}</el-col>
                                </el-row>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <span style="font-size:15px;color:#f56c6c;">提示：请输入包裹单号信息</span>
        </template>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                packageNumber: '',
                code: ''
            },
            logisticsList: [],
            productlist: [],
            productColumns: [
                {
                    value: 'imageBase',
                    label: '产品图片',
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'skuCus', label: '自定义sku' },
                { value: 'nameEn', label: '商品名称' },
                { value: 'logisticType', label: '产品物流属性' },
                { value: 'specification', label: '规则参数' },
                { value: 'scannedAmount', label: '扫描数量' },
                { value: 'packageAmount', label: '需求数量' },
                { value: 'scannedFlag', label: '扫描状态',render(h, scope) {
                    return <span>{scope.row.scannedFlag ? '是': '否'}</span>
                }, }
            ],
            deliverRemark: '',
            isShowInfo: false,
            wmPackageReviewId: ''
        };
    },
    methods: {
        toReview() {
            this.$api['warehouse/reviewConfirm']({
                wmPackageReviewId: this.wmPackageReviewId
            }).then(res => {
                this.$message.success(res.msg);
                this.changePackageNumber(this.form.packageNumber);
            });
        },
        //包裹单号改变时
        changePackageNumber(packageNumber) {
            if (packageNumber) {
                this.$api['warehouse/reviewPackage']({
                    packageNumber
                }).then(res => {
                    let {
                        deliverRemark,
                        productInfo,
                        logisticsInfo: {
                            customerName,
                            customerEmail,
                            customerAddress,
                            customerNation,
                            customerPostcode,
                            customerNameTelephone
                        },
                        wmPackageReviewId
                    } = res.rows;

                    this.wmPackageReviewId = wmPackageReviewId;

                    this.deliverRemark = deliverRemark;
                    this.productlist = productInfo;
                    this.logisticsList = [
                        { label: '收货人', value: customerName },
                        { label: 'EMAIL', value: customerEmail },
                        { label: '地址', value: customerAddress },
                        { label: '省市国家', value: customerNation },
                        { label: '邮编', value: customerPostcode },
                        { label: '电话', value: customerNameTelephone }
                    ];

                    this.isShowInfo = true;
                });
            }
        },
        //产品条码改变时
        changecode(code) {
            if (!code) {
                return this.$message.warning('请输入产品条码');
            }
            this.$api['warehouse/reviewProduct']({
                code,
                wmPackageReviewId: this.wmPackageReviewId
            }).then(res => {
                this.productlist = res.rows;
            });
        }
    }
};
</script>
<style lang="scss" scope>
.parcelReview {
    padding: 10px;
    .item {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        border: 1px solid rgba(228, 228, 228, 1);
        .title {
            height: 35px;
            line-height: 35px;
            text-indent: 12px;
            font-weight: 700;
            font-size: 14px;
            background: rgba(242, 242, 242, 1);
            margin: 0;
        }
        .content {
            padding: 20px;
            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                    label {
                        font-size: 24px;
                    }
                    .btn {
                        margin-left: 15px;
                        span {
                            font-size: 15px;
                            font-weight: 700;
                        }
                    }
                    input {
                        font-size: 24px;
                    }
                }
            }
        }
        .remarks {
            min-height: 44px;
            max-height: 80px;
            overflow-y: auto;
        }
        .logistics {
            min-height: 240px;
            border: 1px solid rgba(228, 228, 228, 1);
            .logistics_item {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid rgba(228, 228, 228, 1);
                &:last-child {
                    border-bottom: none;
                }
                .logistics_text {
                    font-size: 14px;
                    text-align: center;
                    background: #e3e3e347;
                    border-right: 1px solid rgba(228, 228, 228, 1);
                }
                .logistics_info {
                    font-size: 14px;
                    text-indent: 12px;
                }
            }
        }
    }
}
</style>

