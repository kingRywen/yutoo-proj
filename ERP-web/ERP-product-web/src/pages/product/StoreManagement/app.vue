<template>
    <div class="shop_management">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>相关设置</el-breadcrumb-item>
            <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  -->
        <div style="padding:10px;flex:1;background: #fff;">
            <!--搜索部分-->
            <div class="search">
                <ul class="searchWarp">
                    <li>
                        <span class="search_name">平台类型:</span>
                        <el-select v-model="search.userSearch.platformId" clearable size="medium">
                            <el-option v-for="item in search.platformId_list" :label="item.platformName" :value="item.platformId"/>
                        </el-select>
                    </li>
                    <li>
                        <span class="search_name">站点:</span>
                        <el-select v-model="search.userSearch.siteId" clearable size="medium">
                            <el-option v-for="item in (search.userSearch.platformId)?search.siteIdList:[]" :label="item.siteNameZh" :value="item.siteId"/>
                        </el-select>
                    </li>
                    <li>
                        <span class="search_name">店铺状态:</span>
                        <el-select v-model="search.userSearch.storeStatus" clearable size="medium">
                            <el-option v-for="item in search.storeStatus_list" :label="item.label" :value="item.value"/>
                        </el-select>
                    </li>
                    <li>
                        <span class="search_name">店铺名称:</span>
                        <el-input v-model="search.userSearch.name" size="medium" clearable/>
                    </li>
                    <li>
                        <span class="search_name">业务员:</span>
                        <el-select v-model="search.userSearch.salesmanId" clearable size="medium">
                            <el-option :label="item.nickName" :value="item.userId" v-for="item in salesmanIdList"/>
                        </el-select>
                    </li>
                    <li>
                        <span class="search_name">店铺所有人:</span>
                        <el-input v-model="search.userSearch.owner" clearable size="medium"/>
                    </li>
                    <li>
                        <el-button type="primary" @click="searchBtn" size="medium" icon="el-icon-search">搜 索</el-button>
                    </li>
                </ul>
            </div>
            <div class="operation_btn">
                <el-button type="primary" @click="amendShopData(0,)" size="small" icon="el-icon-plus">添 加</el-button>
                <el-button type="primary" @click="onSetVolumeDialog" :disabled="!userShopList.length" size="small" icon="el-icon-s-tools">批量设置</el-button>
            </div>
            <!--  -->
            <el-dialog title="批量设置" :visible.sync="setVolumeDialog" width="30%" class="setVolumeDialog">
                <el-form :model="setVolumeform" label-width="100px">
                    <el-form-item label="店铺状态：">
                        <el-select v-model="setVolumeform.status" placeholder="请选择店铺状态">
                            <el-option :label="item.label" :value="item.value" v-for="item in search.storeStatus_list"/>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="setVolumeDialogfooter">
                    <el-button type="primary" @click="setVolume" size="medium">确 定</el-button>
                </span>
            </el-dialog>

            <!--店铺列表-->
            <div class="shop_lists">
                <el-table border v-loading="loading" element-loading-text="拼命加载中..." element-loading-spinner="el-icon-loading" height="620px" ref="multipleTable" :data="shopLists" tooltip-effect="dark" style="width: 100%" @selection-change="checks">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="平台类型/店铺状态" width="150" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <div class style="display:flex;">
                                <img :src="scope.row.platformLogo" width="65" height="40">
                                <span style="line-height:40px;margin-left:10px;" :style="scope.row.storeStatus==3?'color:red':scope.row.storeStatus==2?'color:#67c23a':''">{{scope.row.storeStatusDesc}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="250" label="图片/渠道名称/真实店铺名称" align="center">
                        <template slot-scope="scope">
                            <div class style="display:flex;">
                                <el-tooltip effect="light" placement="right">
                                    <div class="shoplogoimgBox" slot="content">
                                        <img :src="scope.row.logo || '/static/no-image.jpg'" width="240" height="180" class="shoplogoimg">
                                    </div>
                                    <img :src="scope.row.logo || '/static/no-image.jpg'" width="auto" height="40">
                                </el-tooltip>
                                <div class style="margin-left:10px;text-align: left;">
                                    <p style="font-weight: 700;color: #409EFF;">{{scope.row.name}}</p>
                                    <span style="font-size: 12px;">{{scope.row.storeRealName}}</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="站点" show-overflow-tooltip width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.siteEntity.banner" width="auto" height="32">
                        </template>
                    </el-table-column>
                    <el-table-column label="VAT税号/税率">
                        <template slot-scope="scope">{{scope.row.vatTaxNum}} / {{scope.row.vatTaxRate?scope.row.vatTaxRate+'%':'-'}}</template>
                    </el-table-column>
                    <el-table-column prop="customsClearName" width="100" label="清关员" show-overflow-tooltip/>
                    <el-table-column prop="salesManName" width="100" label="业务员"/>
                    <el-table-column prop="owner" label="店铺所有人"/>
                    <el-table-column label="状态" width="80">
                        <template slot-scope="scope">
                            <div class>
                                <img v-if="scope.row.activeFlag" src="../../../assets/img/icon/zhenq.png" width="26" height="20">
                                <img v-if="!scope.row.activeFlag" src="../../../assets/img/icon/u83895.png" width="26" height="20">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="API授权" width="80">
                        <template slot-scope="scope">
                            <div v-if="scope.row.platformId !=3">
                                <img v-if="scope.row.apiFlag" src="../../../assets/img/icon/zhenq.png" width="26" height="20">
                                <img v-if="!scope.row.apiFlag" src="../../../assets/img/icon/u83895.png" width="26" height="20">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="发货单激活" width="80">
                        <template slot-scope="scope">
                            <div>
                                <img v-if="scope.row.deliverFlag" src="../../../assets/img/icon/zhenq.png" width="26" height="20">
                                <img v-if="!scope.row.deliverFlag" src="../../../assets/img/icon/u83895.png" width="26" height="20">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nameCn" label="API接口设置" width="170">
                        <template slot-scope="scope">
                            <div v-if="scope.row.platformId !=3">
                                <img v-if="scope.row.apiFlag" src="../../../assets/img/icon/u82590.png" width="76" height="32">
                                <img style="cursor: pointer;" @click="accredit(scope.row)" v-if="!scope.row.apiFlag" src="../../../assets/img/icon/u83924.png" width="76" height="32">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="220" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="amendShopData(1,scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="setDispatchFn(scope.row.storeId)">发货单设置</el-button>
                            <el-button v-if="scope.row.platformId !=3" type="text" size="small" :disabled="!scope.row.syncProductFlag" @click="sync(scope.row.storeId)">同步</el-button>
                            <!-- <el-button type="text" size="small" @click="setInvoicesiteId">发货地址设置</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--分页条-->
            <div class="paginationBox">
                <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="changeCurrentPage"></el-pagination>
            </div>

            <!--编辑、添加弹框-->
            <div class="setAmend">
                <el-dialog :title="dialogTitle" :visible.sync="compileShopData" width="1100px" top="8vh">
                    <el-form ref="compileAddForm" :model="compileAddForm" :rules="rules" label-width="120px">
                        <ul class="dialog_content">
                            <li>
                                <div class="item">
                                    <el-form-item label="店铺名称：" prop="name">
                                        <el-input v-model="compileAddForm.name"/>
                                    </el-form-item>
                                </div>
                                <span>注：该名称会显示在任何地方,建议隐藏真实店铺名称,用渠道来源类型+编号+国家,如：Amazon-01-US</span>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="店铺所有人：" prop="owner">
                                        <el-autocomplete v-model="compileAddForm.owner" @select="handleSelect" :fetch-suggestions="querySearchAsync"/>
                                    </el-form-item>
                                </div>
                                <span>注：用来关联同一平台，不同站点的店铺，建立店铺组的关系</span>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="平台类型：" prop="platformId">
                                        <el-select v-model="compileAddForm.platformId">
                                            <el-option v-for="item in search.platformId_list" :label="item.platformName" :value="item.platformId"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="item">
                                    <el-form-item label="站点：" prop="siteId">
                                        <el-select v-model="compileAddForm.siteId">
                                            <el-option v-for="item in search.siteIdList" :label="item.siteNameZh" :value="item.siteId"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="item">
                                    <el-form-item label="真实店铺名称：" label-width="150px" prop="storeRealName">
                                        <el-input v-model="compileAddForm.storeRealName"></el-input>
                                    </el-form-item>
                                </div>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="店铺状态：" prop="storeStatus">
                                        <el-select v-model="compileAddForm.storeStatus">
                                            <el-option v-for="item in search.storeStatus_list" :label="item.label" :value="item.value"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="item">
                                    <el-form-item label="销售VAT比例：" prop="vatSellScale">
                                        <el-input v-model.number="compileAddForm.vatSellScale"></el-input>
                                    </el-form-item>
                                </div>
                                <span>注：仅针对海外仓和FBA发货且是英国到英国、德国到德国的订单计算销售VAT费用</span>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="VAT税号：" prop="vatTaxNum">
                                        <el-input v-model.number="compileAddForm.vatTaxNum"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="item">
                                    <el-form-item label="VAT税率：" prop="vatTaxRate">
                                        <el-input v-model.number="compileAddForm.vatTaxRate"></el-input>
                                    </el-form-item>
                                </div>
                                <em>%</em>
                                <span>注：用于导出订单发票等显示</span>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="清关人：">
                                        <el-select v-model="compileAddForm.customsClearId">
                                            <el-option :label="item.name" :value="item.storeClearId" v-for="item in customsList"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="item">
                                    <el-form-item label="汇率损失比率：" prop="exchangeLossScale">
                                        <el-input v-model="compileAddForm.exchangeLossScale"></el-input>
                                    </el-form-item>
                                </div>
                                <em>%</em>
                                <span>注：只保留两位小数，计算订单利润时用到</span>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="店铺logo：">
                                        <el-upload
                                            class="upload-demo"
                                            :limit="1"
                                            :headers="headers"
                                            :before-upload="onBeforeUpload"
                                            :file-list="fileList"
                                            :action="uploadLogoUrl"
                                            :with-credentials="true"
                                            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .GIF"
                                            list-type="picture"
                                        >
                                            <el-button size="small" type="primary">点击上传</el-button>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                            </li>
                            <li>
                                <div class="item">
                                    <el-form-item label="业务员：" prop="salesmanId">
                                        <el-select v-model="compileAddForm.salesmanId">
                                            <el-option :label="item.nickName" :value="item.userId" v-for="item in salesmanIdList"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="item line">
                                    合并相同地址和包裹:
                                    <el-switch v-model="compileAddForm.mergeOrderFlag"></el-switch>
                                </div>
                                <div class="item line">
                                    是否打印包裹感谢信：
                                    <el-switch v-model="compileAddForm.thanksLetterFlag"></el-switch>
                                </div>
                            </li>
                            <li>
                                <div class="item line">
                                    <el-form-item label="订单优选级别：" class="specific">
                                        <el-select v-model.number="compileAddForm.orderPriorityLevel">
                                            <el-option :label="item.rank" :value="item.id" v-for="item in orderPriorityList"/>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <span>注：订单有设置取订单的优先级别，订单未设置取渠道来源的优先级别，一般用于生单调库优先设置</span>
                            </li>
                            <li>
                                <p>是否激活：</p>
                                <el-switch v-model="compileAddForm.activeFlag"></el-switch>
                            </li>
                        </ul>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm('compileAddForm')">保 存</el-button>
                    </div>
                </el-dialog>
            </div>
            <!-- 发货单弹框 -->
            <div class="setDispatch">
                <el-dialog title="发货单设置" :visible.sync="setDispatch" width="867px">
                    <el-form :model="dispatchFrom" ref="dispatchFrom" class="demo-ruleForm" :inline="true">
                        <ul class="dialog_content">
                            <li>
                                <el-form-item label="名称：" prop="name" :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                                    <el-input v-model="dispatchFrom.name"/>
                                </el-form-item>
                                <el-form-item label="域名：" prop="domain" :rules="{required: true, message: '域名不能为空', trigger: 'blur'}">
                                    <el-input v-model="dispatchFrom.domain"/>
                                </el-form-item>
                            </li>
                            <li>
                                <el-form-item label="国家：" prop="country" :rules="{required: true, message: '国家不能为空', trigger: 'blur'}">
                                    <el-input v-model="dispatchFrom.country"/>
                                </el-form-item>
                                <el-form-item label="省份：" prop="province" :rules="{required: true, message: '省份不能为空', trigger: 'blur'}">
                                    <el-input v-model="dispatchFrom.province"/>
                                </el-form-item>
                                <el-form-item label="城市：" prop="city" :rules="{required: true, message: '城市不能为空', trigger: 'blur'}">
                                    <el-input v-model="dispatchFrom.city"/>
                                </el-form-item>
                            </li>
                            <li>
                                <el-form-item label="地址：" style="flex:1" prop="address" :rules="{required: true, message: '地址不能为空', trigger: 'blur'}">
                                    <el-input v-model="dispatchFrom.address"/>
                                </el-form-item>
                            </li>
                            <li>
                                <el-form-item
                                    label="邮编："
                                    prop="postcode"
                                    :rules="[
                                        {required: true, message: '邮编不能为空', trigger: 'blur'},
                                        { type: 'number', message: '须为数字值'}
                                    ]"
                                >
                                    <el-input v-model.number="dispatchFrom.postcode"/>
                                </el-form-item>
                                <el-form-item
                                    label="电话："
                                    prop="tel"
                                    :rules="[
                                        {required: true, message: '电话不能为空', trigger: 'blur'},
                                        { type: 'number', message: '须为数字值'}
                                    ]"
                                >
                                    <el-input v-model.number="dispatchFrom.tel"/>
                                </el-form-item>
                                <el-form-item
                                    label="邮箱："
                                    prop="email"
                                    :rules="[
                                      { required: true, message: '邮箱不能为空', trigger: 'blur' },
                                      { type: 'email', message: '请输入正确的邮箱地址', trigger:  'blur' }
                                    ]"
                                >
                                    <el-input v-model="dispatchFrom.email"/>
                                </el-form-item>
                            </li>
                            <li>
                                <el-form-item label="logo：" class="formupload">
                                    <el-upload
                                        class="upload-demo"
                                        :action="dispatchLogoURL"
                                        :file-list="dispatchfileList"
                                        :headers="headers"
                                        :with-credentials="true"
                                        :on-success="dispatchSuccess"
                                        :before-upload="onBeforeDispatchUpload"
                                        :data="dispatchUploadData"
                                        accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .GIF"
                                        list-type="picture"
                                        :limit="1"
                                    >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                    </el-upload>
                                </el-form-item>
                            </li>
                            <li>
                                <el-form-item label="包裹感谢信：">
                                    <el-input type="textarea" v-model="dispatchFrom.thanksLetter"/>
                                </el-form-item>
                            </li>
                            <li>
                                <el-form-item label="是否激活：">
                                    <el-switch v-model="dispatchFrom.activeFlag"/>
                                </el-form-item>
                            </li>
                        </ul>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitDispatch('dispatchFrom')">保存</el-button>
                    </div>
                </el-dialog>
            </div>
            <!--发货地址弹框  -->
            <!-- <div class="setsiteId">
            </div>-->
            <!-- 授权 -->
            <div class="accredit">
                <el-dialog :title="accreditObj.platformName+'账号授权'" :visible.sync="accreditDialog" width="886px">
                    <div class="accreditWarp">
                        <el-collapse accordion v-model="activeName">
                            <!-- 如果是wish -->
                            <template v-if="accreditObj.platformId==5">
                                <el-collapse-item title="Step 1 : 登入wish后台" name="1">
                                    <p>1.请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
                                    <p>
                                        注意：
                                        <span class="red">可在常登陆的电脑上登陆或者复制URL，然后在卖家的vps上登录授权，不能随意直接在我们的系统上点击URL登录。可能会照成店铺关联。</span>
                                    </p>
                                    <!-- <p>2.复制下列连结并且登入login</p>
                                    <p>{{ebayAccreditUrl}}</p>-->
                                </el-collapse-item>
                                <el-collapse-item title="Step 2 : 获得【APPkey】和【APPsecret】" name="2">
                                    <div class>
                                        <img src="./wish.png" width="784" height="543" alt>
                                    </div>
                                    <p class="red">必须填写Redirect URL：{{loginUrl}}</p>
                                </el-collapse-item>
                                <el-collapse-item title="Step 3 : 复制【APPkey】和【APPsecret】" name="3">
                                    <p>
                                        注意：
                                        <span class="red">将获取到的【ClintID】 和【Clintsecret】两个参数分别填入API店铺授权界面【APPkey】和【APPsecret】处，ClintID 复制到AppKey ，Clintsecret复制到AppSecret。</span>
                                    </p>

                                    <el-form :rules="wishFormRules" :model="wishForm" label-width="130px" ref="wishForm">
                                        <el-form-item label="APPkey:" prop="appKey">
                                            <el-input v-model="wishForm.appKey"></el-input>
                                        </el-form-item>
                                        <el-form-item label="APPsecret:" prop="appSecret">
                                            <el-input v-model.trim="wishForm.appSecret"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button style="margin-left:300px;" :loading="wishLoading" type="primary" @click="wishSubmit()">开始授权</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-collapse-item>
                            </template>
                            <!--  -->
                            <template v-else>
                                <el-collapse-item title="Step 1 : 选择商城" name="1" class="collapse1">
                                    <p>1.请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
                                    <p>
                                        注意：
                                        <span class="red">只有专业卖家 ( Pro Merchant )可以使用MWS的服务! 如果该账号已经授权了某一个账号，不要再授权另一账号,防止引起关联或数据错乱。</span>
                                    </p>
                                    <p>
                                        1.选择的商城是：
                                        <el-select v-model="accreditObj.name" disabled size="mini">
                                            <el-option :label="accreditObj.name" :value="accreditObj.name"></el-option>
                                        </el-select>
                                    </p>
                                    <p>2.复制下列链接并且登入login</p>
                                    <p v-if="accreditObj.platformId==1">https://sellercentral.amazon.com/gp/mws/registration/register.html</p>
                                    <p v-else>{{ebayAccreditUrl}}</p>
                                </el-collapse-item>
                                <el-collapse-item v-if="accreditObj.platformId==1" title="Step 2 : MWS Access" name="2" class="collapse2">
                                    <p>1.选择 ' 我希望使用某个应用程序通过 MWS 访问我的亚马逊卖家账户 '.</p>
                                    <p>2.输入下列资讯</p>
                                    <ul class="hiti">
                                        <li>
                                            应用程序名称：
                                            <span class="red blod">yutoo-erp</span>
                                        </li>
                                        <li>
                                            应用程序开发商账号：
                                            <span class="red blod">440050292702</span>
                                        </li>
                                    </ul>
                                    <p>3.点击 下一页</p>
                                    <p>4.接受许可协议，然后点击 下一页</p>
                                    <div class>
                                        <img src="./yamx.png" width="784" height="543" alt>
                                    </div>
                                </el-collapse-item>
                                <el-collapse-item v-if="accreditObj.platformId==1" title="Step 3: 复制 Seller ID" name="3">
                                    <div class>
                                        <img src="./yamxzh.png" width="808" height="577" alt>
                                    </div>
                                </el-collapse-item>
                                <el-collapse-item v-if="accreditObj.platformId==1" title="Step 4: 输入 Seller ID" name="4">
                                    <el-form :rules="accreditFormRules" :model="accreditForm" label-width="130px" ref="accreditForm">
                                        <el-form-item label="卖家编号:" prop="sellerId">
                                            <el-input v-model="accreditForm.sellerId"></el-input>
                                        </el-form-item>
                                        <el-form-item label="MWS 授权令牌:" prop="userToken">
                                            <el-input v-model="accreditForm.userToken"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button style="margin-left:300px;" type="primary" :loading="accreditLoading" @click="onSubmitAccredit('accreditForm',accreditObj.storeId,accreditObj.siteId)">保 存</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-collapse-item>
                            </template>
                        </el-collapse>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { BASE_URL, PERMS_URL, LOGIN_URL } from 'common/config';
import { uploadFileToOss, _storage } from 'common/common';
import { getData } from 'common/http';

console.log(BASE_URL);
export default {
    computed: {
        loginUrl() {
            return window.location.origin + '/login.html';
        }
    },
    data() {
        var validateEL = (rule, value, callback) => {
            if (this.compileAddForm.exchangeLossScale) {
                let val = Number(value);
                if (typeof val === 'number' && isFinite(val)) {
                    let num = val.toFixed(2);
                    this.compileAddForm.exchangeLossScale = num;
                    callback();
                    return;
                } else {
                    callback(new Error('请输入数字值'));
                }
            } else {
                callback();
            }
        };

        return {
            wishFormRules: {
                appKey: [
                    {
                        required: true,
                        message: '请输入APPsecret',
                        trigger: 'blur'
                    }
                ],
                appSecret: [
                    {
                        required: true,
                        message: '请输入APPsecret',
                        trigger: 'blur'
                    }
                ]
            },
            wishForm: {
                appKey: '',
                appSecret: ''
            },
            wishLoading: false,
            accreditLoading: false,
            loading: true,
            restaurants: [],
            timeout: null,
            dispatchLogoURL: BASE_URL + '/store/deliver/logo',
            dispatchUploadData: {},

            salesmanIdList: [],
            customsList: [],

            setVolumeform: {
                status: ''
            },
            setVolumeDialog: false,
            orderPriorityList: [
                {
                    rank: '中',
                    id: 1
                },
                {
                    rank: '高',
                    id: 2
                }
            ],
            accreditDialog: false, //授权弹框
            activeName: '1',
            accreditObj: '',
            accreditForm: {
                sellerId: '',
                userToken: ''
            },
            accreditFormRules: {
                sellerId: [
                    {
                        required: true,
                        message: '请输入编号',
                        trigger: 'blur'
                    }
                ],
                userToken: [
                    {
                        required: true,
                        message: '请输入授权令牌',
                        trigger: 'blur'
                    }
                ]
            },
            shopLists: [], //店铺列表数据
            search: {
                platformId_list: [], //平台列表
                storeStatus_list: [
                    {
                        label: '正常',
                        value: 1
                    },
                    {
                        label: '申请中',
                        value: 2
                    },
                    {
                        label: '已暂停',
                        value: 3
                    }
                ],
                siteIdList: [],
                userSearch: {
                    name: '', //店铺名称
                    owner: '', //店铺所有人
                    salesmanId: '', //业务员
                    siteId: '', //站点
                    storeStatus: '', //店铺状态
                    platformId: '' //平台类型
                }
            },
            setDispatch: false, //发货单设置弹框
            compileShopData: false, //编辑弹框

            currentPage: 1,
            total: null, //分页数量总数
            pageSize: null,
            pageNumber: null,

            dialogTitle: '',
            rules: {
                name: [
                    {
                        required: true,
                        message: '店铺名称不能为空',
                        trigger: 'blur'
                    }
                ],
                owner: [
                    {
                        required: true,
                        message: '店铺所有人不能为空',
                        trigger: 'change'
                    }
                ],
                platformId: [
                    {
                        required: true,
                        message: '平台类型不能为空',
                        trigger: 'change'
                    }
                ],
                siteId: [
                    {
                        required: true,
                        message: '站点不能为空',
                        trigger: 'change'
                    }
                ],
                storeRealName: [
                    {
                        required: true,
                        message: '真实店铺名称不能为空',
                        trigger: 'blur'
                    }
                ],
                storeStatus: [
                    {
                        required: true,
                        message: '店铺状态不能为空',
                        trigger: 'change'
                    }
                ],
                vatSellScale: [
                    {
                        required: true,
                        message: '输入销售VAT比例不能为空',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                vatTaxNum: [
                    {
                        required: true,
                        message: '输入VAT税号',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                exchangeLossScale: [
                    { validator: validateEL, trigger: 'blur', required: false }
                ],
                vatTaxRate: [
                    {
                        required: true,
                        message: 'VAT税率不能为空',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                salesmanId: [
                    {
                        required: true,
                        message: '业务员不能为空',
                        trigger: 'change'
                    }
                ]
            },
            fileList: [],
            dispatchfileList: [],
            type: '',
            singleShopInfo: '', //单个店铺信息
            storeId: '',
            userShopList: [],
            headers: {
                token: _storage._get('local', 'token')
            },
            // uploadLogoParams: { "suffix":"png"},
            uploadLogoUrl: BASE_URL + '/store/logo/dir',
            dir: '',
            file: '',
            ebayAccreditUrl: '',
            //数据层
            compileAddForm: {
                //添加或者编辑绑定
                name: '',
                owner: '',
                platformId: '',
                storeStatus: '',
                vatTaxNum: '',
                vatSellScale: '',
                vatTaxRate: '',
                customerClearId: '',
                exchangeLossScale: '',
                siteId: '',
                logo: '',
                storeRealName: '',
                salesmanId: '',
                activeFlag: false,
                mergeSameAddressOrderFlag: '',
                thanksLetterFlag: false,
                orderPriorityLevel: '',
                mergeOrderFlag: false
            },
            dispatchFrom: {
                //发货单设置
                name: '', //名称
                domain: '', //域名
                country: '', //国家
                province: '', //省份
                city: '', //城市
                address: '', //地址
                postcode: '', //邮编
                tel: '', //电话
                email: '', //邮箱
                logo: '',
                thanksLetter: '', //包裹感谢信
                activeFlag: true //是否激活
            }
        };
    },
    mounted() {
        this.getShopLists();
        this.getPlatformList();

        this.getClearList();
        this.getSaleman();

        this.loadAll();
    },
    watch: {
        'search.userSearch.platformId'(val) {
            this.search.userSearch.siteId = '';
            this.updatesiteId(val);
        },
        'compileAddForm.platformId'(val) {
            // this.compileAddForm.siteId = "";
            this.updatesiteId(val);
        },
        //根据站点改变验证
        'compileAddForm.siteId'(val) {
            //美国
            if (val == 1) {
                this.rules.vatSellScale = [];
                this.rules.vatTaxNum = [];
                this.rules.vatTaxRate = [];
            } else {
                this.rules.vatSellScale = [];
                this.rules.vatTaxNum = [];
                this.rules.vatTaxRate = [];
                this.$refs.compileAddForm.clearValidate();
                this.rules.vatSellScale.push(
                    {
                        required: true,
                        message: '输入销售VAT比例不能为空',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                );
                this.rules.vatTaxNum.push(
                    {
                        required: true,
                        message: '输入VAT税号',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                );
                this.rules.vatTaxRate.push(
                    {
                        required: true,
                        message: 'VAT税率不能为空',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                );
            }
        }
    },
    methods: {
        //wishSubmit授权
        wishCb(url, params) {
            return new Promise((resolve, reject) => {
                getData(url, params).then(res => {
                    if (res.data.code == 0) {
                        resolve(res.data);
                        this.wishLoading = false;
                    } else {
                        this.$message.error(res.data.msg);
                        reject(res.data);
                        this.wishLoading = false;
                    }
                });
            });
        },
        wishSubmit() {
            this.$refs.wishForm.validate(valid => {
                if (valid) {
                    this.wishLoading = true;
                    let params = {
                        storeId: this.accreditObj.storeId
                    };
                    this.wishCb('store/api/auth/wish', {
                        ...params,
                        ...this.wishForm
                    }).then(sres => {
                        this.wishCb('store/api/auth/wish/url', params).then(
                            res => {
                                if (res.rows.authUrl) {
                                    this.$alert(
                                        `复制此链接链接登录授权：${
                                            res.rows.authUrl
                                        }`,
                                        sres.msg,
                                        {
                                            showConfirmButton: false
                                        }
                                    );
                                }
                            }
                        );
                    });
                } else {
                    return false;
                }
            });
        },
        dispatchSuccess(response, file, fileList) {
            console.log(response, file, fileList);
            if (response.code == 0) {
                this.dispatchFrom.logo = response.logo;
            } else {
            }
        },
        onBeforeDispatchUpload(file) {
            console.log(file);
            this.dispatchUploadData['file'] = file;
        },
        handleSelect(item) {
            console.log(item);
        },
        loadAll() {
            getData('store/list/owner', {
                owner: this.compileAddForm.owner
            }).then(res => {
                if (res.data.code == 0) {
                    this.restaurants = res.data.owners;
                }
            });
        },
        createStateFilter(queryString) {
            return state => {
                return (
                    state.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;

            var results = queryString
                ? restaurants.filter(this.createStateFilter(queryString))
                : restaurants;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 300 * Math.random());
        },

        //获取业务员列表
        getSaleman() {
            getData(
                'merchant/user/list',
                {
                    pageNumber: 1,
                    pageSize: 100
                },
                LOGIN_URL
            ).then(res => {
                if (res.data.code == 0) {
                    this.salesmanIdList = res.data.rows.rows;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },

        //获取清光人列表
        getClearList() {
            getData('store/clear/list', {}).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.customsList = res.data.rows;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        onBeforeUpload(file) {
            getData('store/logo/dir', {
                suffix: 'png'
            }).then(res => {
                if (res.data.code == 0) {
                    this.dir = res.data.rows;
                    uploadFileToOss(file, this.dir, key => {
                        this.compileAddForm.logo = key;
                    });
                }
            });
        },
        //授权提交
        onSubmitAccredit(formName, storeId, apiType) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.accreditLoading = true;
                    let params = Object.assign({}, this.accreditForm, {
                        storeId,
                        apiType
                    });
                    getData('store/api/auth', params).then(res => {
                        this.accreditLoading = false;
                        if (res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getShopLists();
                            for (let key in this.accreditForm) {
                                this.accreditForm[key] = null;
                            }
                            this.accreditDialog = false;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //授权
        accredit(val) {
            this.accreditDialog = true;
            this.accreditObj = val;
            //如果是ebay
            if (val.platformId == 2) {
                getData('store/api/auth/ebay', { storeId: val.storeId }).then(
                    res => {
                        if (res.data.code == 0) {
                            this.ebayAccreditUrl = res.data.msg;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }
                );
            }
        },
        //更新站点
        updatesiteId(val) {
            this.search.platformId_list.forEach(item => {
                if (item.platformId == val) {
                    this.search.siteIdList = item.siteList;
                }
            });
        },

        //判断点击是编辑/添加
        amendShopData(type, row) {
            this.compileShopData = true;
            this.type = type;
            //编辑
            if (type) {
                this.dialogTitle = '编辑店铺';
                if (row.storeId) {
                    this.findShopInfo(row.storeId);
                }
                //添加
            } else {
                this.dialogTitle = '添加店铺';
                this.fileList = [];
                for (let key in this.compileAddForm) {
                    if (key == 'activeFlag') {
                        this.compileAddForm[key] = false;
                        continue;
                    }
                    if (key == 'thanksLetterFlag') {
                        this.compileAddForm[key] = false;
                        continue;
                    }
                    if (key == 'mergeOrderFlag') {
                        this.compileAddForm[key] = false;
                        continue;
                    }
                    this.compileAddForm[key] = '';
                }
                this.$refs['compileAddForm'].resetFields();
            }
        },
        //编辑店铺保存
        updateShopInfo() {
            let params = Object.assign({}, this.compileAddForm);
            params.activeFlag = params.activeFlag ? 1 : 0;
            params.thanksLetterFlag = params.thanksLetterFlag ? 1 : 0;
            params.mergeOrderFlag = params.mergeOrderFlag ? 1 : 0;
            getData('store/update', params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getShopLists();
                    this.compileShopData = false;
                    return;
                }
                if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //添加店铺
        addShop() {
            let params = Object.assign({}, this.compileAddForm);
            for (let key in params) {
                if (key == 'activeFlag') {
                    params[key] ? (params[key] = 1) : (params[key] = 0);
                }
                if (key == 'mergeOrderFlag') {
                    params[key] ? (params[key] = 1) : (params[key] = 0);
                }
                if (key == 'thanksLetterFlag') {
                    params[key] ? (params[key] = 1) : (params[key] = 0);
                }
            }
            getData('store/create', params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getShopLists();
                    this.compileShopData = false;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //编辑或者添加店铺验证
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //编辑店铺保存
                    if (this.type) {
                        this.updateShopInfo();
                    } else {
                        //添加店铺
                        this.addShop();
                    }
                } else {
                    this.$message({
                        message: '填写完整再保存',
                        type: 'warning'
                    });
                    return false;
                }
            });
        },
        //查询店铺信息
        findShopInfo(storeId) {
            getData('store/info', {
                storeId
            }).then(res => {
                if (res.data.code == 0) {
                    let shopInfo = Object.assign({}, res.data.rows);
                    if (shopInfo.logo.length) {
                        this.fileList = [
                            {
                                name: '',
                                url: shopInfo.logo
                            }
                        ];
                        let len = 'https://yutoo-admin-erp.oss-cn-shenzhen.aliyuncs.com/'
                            .length;
                        let result = shopInfo.logo;
                        const str = result.slice(len);
                        shopInfo.logo = str;
                    } else {
                        this.fileList = [];
                    }
                    shopInfo['vatSellScale'] = Number(shopInfo['vatSellScale']);
                    shopInfo['vatTaxNum'] = Number(shopInfo['vatTaxNum']);
                    shopInfo['vatTaxRate'] = Number(shopInfo['vatTaxRate']);
                    shopInfo['orderPriorityLevel'] = shopInfo[
                        'orderPriorityLevel'
                    ]
                        ? Number(shopInfo['orderPriorityLevel'])
                        : shopInfo['orderPriorityLevel'];
                    for (let key in shopInfo) {
                        for (let i in this.compileAddForm) {
                            if (key == i) {
                                if (key == 'activeFlag') {
                                    this.$set(
                                        this.compileAddForm,
                                        i,
                                        shopInfo[key] ? true : false
                                    );
                                    continue;
                                }
                                if (key == 'thanksLetterFlag') {
                                    this.$set(
                                        this.compileAddForm,
                                        i,
                                        shopInfo[key] ? true : false
                                    );
                                    continue;
                                }
                                if (key == 'mergeOrderFlag') {
                                    this.$set(
                                        this.compileAddForm,
                                        i,
                                        shopInfo[key] ? true : false
                                    );
                                    continue;
                                }
                                this.$set(
                                    this.compileAddForm,
                                    i,
                                    shopInfo[key]
                                );
                            }
                        }
                    }
                    this.compileAddForm['storeId'] = storeId;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //获取平台列表
        getPlatformList() {
            getData('platform/list/platform/site').then(res => {
                if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                    return;
                }
                this.search.platformId_list = res.data.rows;
            });
        },

        //批量设置
        onSetVolumeDialog() {
            this.setVolumeDialog = true;
        },
        setVolume() {
            let arr = [...this.userShopList];
            const status = this.setVolumeform.status;
            arr.forEach(item => {
                item.status = status;
            });
            if (status) {
                getData('store/setting/batch', {
                    data: arr
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.getShopLists();
                        this.setVolumeDialog = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            }
        },
        //发货单设置
        setDispatchFn(storeId) {
            this.setDispatch = true;
            this.storeId = storeId;

            this.$nextTick(() => {
                this.$refs.dispatchFrom.resetFields();
                this.dispatchfileList = [];
            });

            getData('store/deliver/info', { storeId }).then(res => {
                if (res.data.code == 0) {
                    let obj = res.data.rows;
                    obj.tel = Number(obj.tel);
                    obj.postcode = Number(obj.postcode);
                    for (let k in this.dispatchFrom) {
                        for (let j in obj) {
                            if (k == 'activeFlag') {
                                console.log(k);
                                this.dispatchFrom[k] =
                                    obj[j] == 1 ? true : false;
                                continue;
                            }
                            if (k == j) {
                                this.dispatchFrom[k] = obj[j];
                            }
                        }
                    }
                    this.dispatchfileList = [
                        {
                            name: '',
                            url: obj.host + obj.logo
                        }
                    ];
                } else {
                    // this.$message.error(res.data.msg)
                }
            });
        },

        // 同步
        sync(storeId) {
            this.loading = true;
            getData('store/sync', { storeId }).then(res => {
                this.loading = false;
                if (res.data.code !== 0) {
                    this.$message.error(res.data.msg);
                } else {
                    this.$message.success(res.data.msg);
                    this.getShopLists();
                }
            });
        },
        //发货单设置保存
        submitDispatch(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.dispatchFrom, {
                        storeId: this.storeId
                    });
                    params.activeFlag = params.activeFlag ? 1 : 0;
                    getData('store/deliver/create_or_update', params).then(
                        res => {
                            if (res.data.code == 0) {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.getShopLists();
                                this.setDispatch = false;
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        //发货地址设置
        setInvoicesiteId() {
            //  alert(1)
        },
        //勾选的
        checks(val) {
            this.userShopList = val.map(item => {
                return {
                    storeId: item.storeId,
                    status: item.storeStatus
                };
            });
        },
        //获取店铺列表数据
        getShopLists(
            params = {
                sortOrder: 'asc',
                pageSize: 10,
                pageNumber: 1
            }
        ) {
            getData('store/list', params).then(res => {
                this.loading = false;
                if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                    return;
                }
                this.shopLists = res.data.rows.rows;
                this.total = res.data.rows.total;
                this.currentPage = res.data.rows.pageNo;

                this.pageNumber = res.data.rows.pageNo;
                this.pageSize = res.data.rows.pageSize;
            });
        },
        //搜索
        searchBtn() {
            this.loading = true;
            let params = {
                pageSize: 10,
                pageNumber: 1,
                platformId: this.search.userSearch.platformId,
                siteId: this.search.userSearch.siteId,
                storeStatus: this.search.userSearch.storeStatus,
                name: this.search.userSearch.name,
                salesmanId: this.search.userSearch.salesmanId,
                owner: this.search.userSearch.owner
            };
            this.getShopLists(params);
        },
        //当前页选择时触发
        changeCurrentPage(val) {
            this.loading = true;
            //console.log(`当前页: ${val}`);
            let params = {
                sortOrder: 'asc',
                pageSize: this.pageSize,
                pageNumber: val,
                platformId: this.search.userSearch.platformId
            };
            for (let k in this.search.userSearch) {
                if (this.search.userSearch[k]) {
                    params = Object.assign({}, params, {
                        [k]: this.search.userSearch[k]
                    });
                }
            }
            this.getShopLists(params);
        },
        handleSizeChange(val) {
            this.loading = true;
            //console.log(`每页 ${val} 条`);
            let params = {
                sortOrder: 'asc',
                pageSize: val,
                pageNumber: this.pageNumber,
                platformId: this.search.userSearch.platformId
            };
            for (let k in this.search.userSearch) {
                if (this.search.userSearch[k]) {
                    params = Object.assign({}, params, {
                        [k]: this.search.userSearch[k]
                    });
                }
            }
            this.getShopLists(params);
        }
    }
};
</script>

<style lang="scss">
@import '../../../assets/style/style-scss/layout.scss';

.setVolumeDialog {
    .el-dialog__footer {
        text-align: center;
        .setVolumeDialogfooter {
            width: 100px;
        }
    }
}

.shop_management {
    height: 100%;
    display: flex;
    flex-direction: column;
    .operation_btn,
    .search {
        background: #fff;
        .search_name {
            font-size: 14px;
        }
    }
    .search {
        @include flex(row);
        padding: 10px 10px;
        border-radius: 5px;
        background-color: #f2f2f2;
        .searchWarp {
            @include flex(row);
            .el-input,
            .el-select {
                width: 110px;
            }
            li {
                margin-right: 15px;
            }
        }
    }
}

.operation_btn {
    margin-top: 10px;
}
.shop_lists {
    margin-top: 10px;
    .cell {
        text-align: center;
        @extend .textOverflow;
    }
    .el-button {
        margin: 0 10px 0 0;
        float: left;
    }
    .el-table th {
        background: #f3f3f3;
    }
}
.paginationBox {
    text-align: right;
    margin-top: 15px;
}

//发货单弹框
.setDispatch {
    .dialog_content {
        li {
            @include flex(row);
            .el-form-item {
                &:last-child {
                    flex: 1;
                    margin-right: 0 !important;
                    .el-form-item__content {
                        width: 75%;
                    }
                }
                input[type='file'] {
                    display: none;
                }
            }
            .upload-demo {
                display: flex;
                .el-upload-list {
                    margin: -15px 0 0 20px;
                    li {
                        img {
                            height: 70px;
                            // width: auto!important;
                        }
                    }
                }
            }
        }
    }
}
.dialog-footer {
    text-align: center;
    .el-button {
        width: 200px;
    }
}
//编辑弹框样式
.setAmend {
    .dialog_content {
        li {
            @include flex(row);
            position: relative;
            top: -14px;
            span {
                line-height: 40px;
                margin-left: 10px;
                color: red;
                flex: 1;
                @extend .textOverflow;
            }
            em {
                line-height: 40px;
                margin-left: 10px;
            }
            .el-form-item {
                margin-bottom: 20px;
                height: 40px;
                .el-button {
                    height: 40px;
                    line-height: 40px;
                    width: 202px;
                    span {
                        color: #fff;
                        position: relative;
                        bottom: 10px;
                    }
                }
            }
            .upload-demo {
                @include flex(row);
                .el-upload-list {
                    z-index: 10;
                    margin-left: 19px !important;
                    margin-top: -20px !important;
                    width: 62px !important;
                    height: 60px !important;
                }
            }
            .el-select {
                width: 202px;
            }
            .el-form-item {
                @include flex(row);
                .el-form-item__label {
                    width: 120px;
                }
                .el-form-item__content {
                    margin: 0 !important;
                }
            }
            .item {
                margin-right: 10px;
                .el-upload__input {
                    display: none;
                }
            }
            .line {
                line-height: 40px;
                margin: 0 10px;
            }
            &:last-child {
                p {
                    width: 120px;
                    text-align: center;
                }
            }
        }
    }
}
//授权弹框
.accreditWarp {
    height: 520px;
    overflow-y: auto;
    .el-collapse-item__header {
        color: #0079c6;
        font-size: 16px;
        font-weight: 700;
    }
    .el-collapse-item {
        background: #f5f5f5;
    }
    .el-form-item {
        display: flex;
        flex-direction: row;
    }
    .el-form-item__content {
        margin-left: 0 !important;
        .el-input {
            width: 400px;
        }
    }
    p {
        line-height: 30px;
        word-wrap: break-word;
    }
    .red {
        color: red;
    }
    .blod {
        font-weight: 800;
    }
    .collapse1 {
        a {
            color: #0079c6;
            margin-left: 50px;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
.specific {
    .el-form-item__content {
        .el-select {
            width: 192px !important;
        }
    }
}
.shoplogoimgBox {
    width: 240px;
    height: 180px;
    overflow: hidden;
    .shoplogoimg {
        transition: all 0.6s;
        &:hover {
            transform: scale(1.4);
        }
    }
}
</style>
