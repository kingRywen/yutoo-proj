<template lang="html">
    <div class="putaway">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>产品库</el-breadcrumb-item>
            <el-breadcrumb-item >
                <span class="nav-active" @click="toPlatform">平台产品</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>刊登上架</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="attribute-container">
            <!-- 基础属性 -->
            <el-container class="attribute">
                <el-header class="attribute-title">基础属性</el-header>
                <el-main>
                    <el-row :gutter="10">
                      <el-col :span="5">产品名称：{{productInfo.nameZh}}</el-col>
                      <el-col :span="5">产品SKU：{{productInfo.sku}}</el-col>
                      <el-col :span="5">产品侵权风险：{{productInfo.riskType}}</el-col>
                      <el-col :span="5">强电插头：{{productInfo.plugFlag?"有":"无"}}</el-col>
                      <el-col :span="4">供应商报价：{{`￥${productInfo.sale_price_now}`}}</el-col>
                    </el-row>
                </el-main>
            </el-container>
            <!-- 平台属性 -->
            <!-- <el-container class="attribute">
                <el-header class="attribute-title">平台属性</el-header>
                <el-main>
                    <el-row :gutter="10">
                      <el-col :span="5">itemType：{{properties.itemType}}</el-col>
                      <el-col :span="5">TargetAudience：{{properties.TargetAudience}}</el-col>
                    </el-row>
                </el-main>
            </el-container> -->
            <!-- <el-button type="primary" size="small" @click="uploading()">上传到店铺<i class="el-icon-upload el-icon--right"></i></el-button> -->

            <el-button type="primary" size="small" @click="uploading1()">上传到店铺<i class="el-icon-upload el-icon--right"></i></el-button>
            <!-- 已上传到店铺 -->
            <el-container class="attribute">
                <el-header class="attribute-title">已上传到店铺</el-header>
                <el-main class="auto">
                    <!-- 搜索  -->
                    <el-form :inline="true" :model="selectInfo" class="selectInfo">
                        <el-form-item label="站点：">
                            <el-select size="small" v-model="selectInfo.siteId" clearable @change="changeSite">
                              <el-option :label="item.siteNameZh" :value="item.siteId" v-for="item in siteList" :key="item.siteId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="店铺名称：">
                            <el-select size="small" v-model="selectInfo.storeId" clearable >
                              <el-option :label="item.name" :value="item.storeId" v-for="item in storeList" :key="item.storeId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产品状态：">
                            <el-select size="small" v-model="selectInfo.status" clearable >
                              <el-option :label="item.desc" :value="item.status" v-for="item in statusList" :key="item.status"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="small" @click="select">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <!--  -->
                    <!-- 切换状态 -->
                    <el-radio-group v-model="currentStatus" size="small" @change="changeStatus">
                        <el-radio-button :label="item.status" v-for="item in statusList" :key="item.desc">
                            {{`${item.desc}（ ${item.count} ）`}}
                        </el-radio-button>
                    </el-radio-group>
                    <!-- table -->
                    <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                        border  style="width: 100%"  @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column label="站点"  width="100" align="center">
                            <template slot-scope="scope">
                               <img :src="scope.row.banner" alt="" width="67" height="37">
                            </template>
                        </el-table-column>
                        <el-table-column  prop="storeName"  label="店铺"  width="120" align="center"></el-table-column>
                        <el-table-column    label="产品图片" align="center">
                            <template slot-scope="scope">
    <el-tooltip placement="right" effect="light">
        <div slot="content">
            <img :src="scope.row.img" alt width="auto" height="220">
        </div>
        <img :src="scope.row.img" alt width="auto" height="80">
    </el-tooltip>
</template>
                        </el-table-column>
                        <el-table-column label="产品名称" align="center" width="300">
                            <template slot-scope="scope">
    <p>中文名称：{{scope.row.nameCn}}</p>
    <p>英文名称：{{scope.row.nameEn}}</p>
</template>
                        </el-table-column>
                        <el-table-column  prop="address"  label="状态" align="center" width="100">
                            <template slot-scope="scope">
    <p v-for="item in scope.row.statusList" :key="item.status">{{item.statusDesc}}</p>
</template>
                        </el-table-column>
                        <el-table-column  prop="title"  label="商品标题" align="center"></el-table-column>
                        <el-table-column  prop="skuStore"  label="店铺SKU" align="center"></el-table-column>
                        <el-table-column  prop="asin"  label="ASIN" align="center"></el-table-column>
                        <el-table-column  prop="skuFn"  label="FNSKU" align="center"></el-table-column>
                        <el-table-column  prop="repertory"  label="本地仓库结余" align="center" width="80"></el-table-column>
                        <el-table-column  prop="price"  label="售价" align="center" width="80"></el-table-column>
                        <el-table-column  prop="repertory"  label="FBA状态" align="center" width="80"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination class="pagination"
                        v-if="tableData.length!=0"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 30, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                    <!--  -->
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
import { showModal, toUrl, toParamUrl } from 'common/common';
import { getQueryString } from 'common/util';
import { getData } from 'common/http';

//获取属性
const ATTRIBUTE_URL = 'putaway/product/info';
//获取站点
const SITE_URL = 'site/list';
//获取店铺名称
const STORENAME_URL = 'store/list';
//获取状态,数量
const STATUSNUMBER_URL = 'store/product/group/by/productId';
//获取店铺产品列表
const STORELIST_URl = 'store/product/list/by/productId';

export default {
    data() {
        return {
            productInfo: {},
            properties: {},
            selectInfo: {
                siteId: null,
                storeId: null,
                status: 0
            },
            statusList: [],
            siteList: [],
            storeList: [],
            currentStatus: 0,
            tableData: [],
            currentPage: null,
            pageSize: null,
            total: null,
            loading: true,

            platformId: 1,
            parentDetailId: 1431,
            baseProductParentId: 4549,

            detailId: 1431,
            productId: 4549,
            platformProductId: null
        };
    },
    mounted() {
        try {
            this.platformId = getQueryString('platformId');
            this.detailId = getQueryString('detailId');
            this.parentDetailId = getQueryString('detailId');
            this.baseProductParentId = getQueryString('productId');
            //
            this.productId = getQueryString('productId');
            this.platformProductId = getQueryString('platformProductId');
        } catch (e) {}
        //
        this.getAttribute();
        this.getStatusNumber();
        this.getStoreList();
        this.getSite();
    },
    methods: {
        select() {
            let params = this.returnParams();
            if (this.selectInfo.siteId) {
                params = { ...params, siteId: this.selectInfo.siteId };
            }
            if (this.selectInfo.storeId) {
                params = { ...params, storeId: this.selectInfo.storeId };
            }
            if (this.selectInfo.status) {
                let newobj = this.returnParams(this.selectInfo.status);
                params = Object.assign({}, params, newobj);
            }
            this.getStoreList(params);
        },
        //上传到店铺Btn
        uploading() {
            this.$router.push({
                path: '/shopPutaway',
                query: {
                    productId: this.productId,
                    detailId: this.detailId
                }
            });
        },
        uploading1() {
            this.$router.push({
                path: '/UpperShelf',
                query: {
                    productId: this.productId,
                    detailId: this.detailId,
                    platformId: this.platformId
                }
            });
        },
        toPlatform() {
            toUrl('/product/platformList.html');
        },
        handleSelectionChange(val) {
            console.log(val);
        },
        handleSizeChange(val) {
            let params = {
                parentDetailId: this.parentDetailId,
                platformId: this.platformId,
                status: this.currentStatus,
                pageSize: val,
                pageNumber: this.currentPage
            };
            if (this.selectInfo.siteId) {
                params = { ...params, siteId: this.selectInfo.siteId };
            }
            if (this.selectInfo.storeId) {
                params = { ...params, storeId: this.selectInfo.storeId };
            }
            if (this.selectInfo.status) {
                params.status = this.selectInfo.status;
            }
            this.getStoreList(params);
        },
        handleCurrentChange(val) {
            let params = {
                parentDetailId: this.parentDetailId,
                platformId: this.platformId,
                status: this.currentStatus,
                pageSize: this.pageSize,
                pageNumber: val
            };
            if (this.selectInfo.siteId) {
                params = { ...params, siteId: this.selectInfo.siteId };
            }
            if (this.selectInfo.storeId) {
                params = { ...params, storeId: this.selectInfo.storeId };
            }
            if (this.selectInfo.status) {
                params.status = this.selectInfo.status;
            }
            this.getStoreList(params);
        },
        changeSite(val) {
            this.selectInfo.storeId = '';
            this.getStoreName(val);
        },
        //获取属性
        getAttribute() {
            const params = {
                baseProductParentId: this.baseProductParentId,
                parentDetailId: this.parentDetailId
            };
            this.getSuccessInfo(ATTRIBUTE_URL, params, data => {
                this.productInfo = data.rows.productInfo;
                this.properties = data.rows.properties;
            });
        },
        //获取站点
        getSite() {
            const params = {
                platformId: this.platformId
            };
            this.getSuccessInfo(SITE_URL, params, data => {
                this.siteList = data.rows;
            });
        },
        //获取店铺名称
        getStoreName(siteId) {
            const params = {
                platformId: this.platformId,
                pageNumber: 1,
                pageSize: 10000,
                siteId
            };
            this.getSuccessInfo(STORENAME_URL, params, data => {
                this.storeList = data.rows.rows;
            });
        },
        //获取状态,数量
        getStatusNumber() {
            const params = {
                parentDetailId: this.parentDetailId,
                platformId: this.platformId
            };
            this.getSuccessInfo(STATUSNUMBER_URL, params, data => {
                this.statusList = data.rows.statusList;
            });
        },
        //获取店铺列表
        getStoreList(params = this.returnParams()) {
            this.getSuccessInfo(STORELIST_URl, params, data => {
                this.tableData = data.rows.rows;
                this.currentPage = data.rows.pageNo;
                this.pageSize = data.rows.pageSize;
                this.total = data.rows.total;
            });
        },
        returnParams(status = 0, pageSize = 10, pageNumber = 1) {
            return {
                parentDetailId: this.parentDetailId,
                platformId: this.platformId,
                status,
                pageSize,
                pageNumber
            };
        },
        changeStatus(status) {
            let params = this.returnParams(status);
            this.getStoreList(params);
        },
        //获取数据
        getSuccessInfo(url, params, callback) {
            getData(url, params).then(res => {
                this.loading = false;
                if (res.data.code == 0) {
                    callback && callback(res.data);
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        }
    }
};
</script>
<style lang="scss">
.putaway {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.nav {
    font-size: 14px;
    padding: 15px 0 15px;
    background: #ececec;
    // margin-top: -12px;
}
.nav-active {
    font-weight: 700;
    color: #303133;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
        cursor: pointer;
        color: #108ee9;
    }
}

.attribute-container {
    padding: 10px;
    .attribute {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 5px;
        &:last-child {
            margin-top: 10px;
        }
        .attribute-title {
            height: 30px !important;
            line-height: 30px !important;
            background: #f2f2f2;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .selectInfo {
            padding: 10px;
            border-radius: 5px;
            background-color: #f2f2f2;
            .el-form-item {
                margin-bottom: 0;
            }
        }

        .pagination {
            margin-top: 20px;
            text-align: right;
        }
        .auto {
            overflow-y: auto !important;
            max-height: 600px;
            min-height: 600px;
        }
    }
    .el-table th {
        background: #f3f3f3;
    }
}
</style>
