<template>
<div class="shop_management">
    <!--搜索部分-->
    <div class="search">
        <ul class="searchWarp">
            <li>
                <span class="search_name">平台类型:</span>
                <el-select v-model="search.userSearch.platform_type" clearable>
                    <el-option v-for="item in search.platform_type_list" :label="item.platformName" :value="item.platformId" />
                </el-select>
            </li>
            <li>
                <span class="search_name">店铺状态:</span>
                <el-select v-model="search.userSearch.shop_state" clearable>
                    <el-option v-for="item in search.shop_state_list" :label="item.label" :value="item.value" />
                </el-select>
            </li>
            <li>
                <span class="search_name">站点:</span>
                <el-select v-model="search.userSearch.site" clearable>
                    <el-option v-for="item in search.siteList" :label="item.siteNameZh" :value="item.siteId" />
                </el-select>
            </li>
            <li>
                <span class="search_name">店铺名称:</span>
                <el-input v-model="search.userSearch.shop_name" />
            </li>
            <li>
                <span class="search_name">业务员:</span>
                <el-select v-model="search.userSearch.salesman" clearable>
                    <el-option v-for="item in search.salesmanList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </li>
            <li>
                <span class="search_name">店铺所有人:</span>
                <el-input v-model="search.userSearch.sole_owner" />
            </li>
        </ul>
        <el-button type="primary" @click="searchBtn">搜索</el-button>
    </div>
    <div class="operation_btn">
        <el-button type="primary" @click="amendShopData(0,)">添加</el-button>
        <el-button type="primary" @click="setPortionShopData">批量设置</el-button>
    </div>
    <!--店铺列表-->
    <div class="shop_lists">
        <el-table max-height="580" ref="multipleTable" :data="shopLists" tooltip-effect="dark" style="width: 100%" @selection-change="checks">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="平台类型/店铺状态" width="150">
                <template slot-scope="scope">
            <!-- {{ scope.row.storeName }} -->
            <div class="" style="display:flex;padding-left: 30px;">
              <img :src="scope.row.platformLogo" width="42" height="45">
              <span style="line-height:45px;margin-left:10px;">{{scope.row.activeFlag?'正常':'异常'}}</span>
            </div>
          </template>
            </el-table-column>
            <el-table-column width="250" label="图片/渠道名称/真实店铺名称">
                <template slot-scope="scope">
            <div class="" style="display:flex;padding-left: 50px;">
              <img :src="scope.row.logo" width="44" height="40">
              <div class="" style="margin-left:10px;text-align: left;">
                <p>{{scope.row.name}}</p>
                <span>{{scope.row.storeRealName}}</span>
              </div>
            </div>
          </template>
            </el-table-column>
            <el-table-column label="站点" show-overflow-tooltip width='100'>
                <template slot-scope="scope">
            <div class="" style="display:flex;">
              <img :src="scope.row.banner" width="44" height="40">
              <span style="margin-left:10px;line-height:40px;">{{scope.row.siteNameZh}}</span>
            </div>
          </template>
            </el-table-column>
            <el-table-column prop="vatTaxRate" label="VAT税号/税率" />
            <el-table-column prop="customsClearId" width="80" label="清关员" show-overflow-tooltip/>
            <el-table-column prop="salesmanId" width="80" label="业务员" />
            <el-table-column prop="ownerId" label="店铺所有人" />
            <el-table-column label="状态">
                <template slot-scope="scope">
            <div class="">
              <img v-if="scope.row.storeStatus" src="../../../assets/img/icon/zhenq.png" width="26" height="20">
              <img v-if="!scope.row.storeStatus" src="../../../assets/img/icon/u83895.png" width="26" height="20">
            </div>
          </template>
            </el-table-column>
            <el-table-column label="API授权">
                <template slot-scope="scope">
            <div>
              <img v-if="scope.row.apiFlag" src="../../../assets/img/icon/zhenq.png" width="26" height="20">
              <img v-if="!scope.row.apiFlag" src="../../../assets/img/icon/u83895.png" width="26" height="20">
            </div>
          </template>
            </el-table-column>
            <el-table-column label="发货单激活">
                <template slot-scope="scope">
            <div>
              <img v-if="scope.row.activeFlag" src="../../../assets/img/icon/zhenq.png" width="26" height="20">
              <img v-if="!scope.row.activeFlag" src="../../../assets/img/icon/u83895.png" width="26" height="20">
            </div>

          </template>
            </el-table-column>
            <el-table-column prop="nameCn" label="API接口设置" width='200'>
                <template slot-scope="scope">
                    <div >
                      <img v-if="scope.row.apiFlag" src="../../../assets/img/icon/u82590.png" width="108" height="38">
                      <img style="cursor: pointer;" @click="accredit(scope.row)" v-if="!scope.row.apiFlag" src="../../../assets/img/icon/u83924.png" width="108" height="38">
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="240">
                <template slot-scope="scope">
            <el-button type="text" size="small" @click="amendShopData(1,scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="setDispatchFn(scope.row)">发货单设置</el-button>
            <el-button type="text" size="small" @click="setInvoiceSite">发货地址设置</el-button>
          </template>
            </el-table-column>
        </el-table>
    </div>
    <!--分页条-->
    <div class="paginationBox">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]" :page-size="10" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="changeCurrentPage">
        </el-pagination>
    </div>

    <!--编辑、添加弹框-->
    <div class="setAmend">
        <el-dialog :title="dialogTitle" :visible.sync="compileShopData" width="70%">
            <el-form ref="compileAddForm" :model="compileAddForm" :rules="rules" label-width="100px">
                <ul class="dialog_content">
                    <li>
                        <div class="item">
                            <el-form-item label="店铺名称：" prop="name">
                                <el-input v-model="compileAddForm.name" />
                            </el-form-item>
                        </div>
                        <span>注：该名称会显示在任何地方,建议隐藏真实店铺名称,用渠道来源类型+编号+国家,如：Amazon-01-US</span>
                    </li>
                    <li>
                        <div class="item">
                            <el-form-item label="店铺所有人：" prop="ownerId">
                                <!-- <el-input v-model="compileAddForm.ownerId"></el-input> -->
                                <el-select v-model="compileAddForm.ownerId">
                                    <el-option label="张绍武" value="1" />
                                </el-select>
                            </el-form-item>
                        </div>
                        <span>注：用来关联同一平台，不同站点的店铺，建立店铺组的关系</span>
                    </li>
                    <li>
                        <div class="item">
                            <el-form-item label="平台类型：" prop="platformId">
                                <el-select v-model="compileAddForm.platformId">
                                    <el-option v-for="item in search.platform_type_list" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="item">
                            <el-form-item label="站点：" prop="siteId">
                                <el-select v-model="compileAddForm.siteId">
                                    <el-option v-for="item in search.siteList" :label="item.siteNameZh" :value="item.siteId" />
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="item">
                            <el-form-item label="真实店铺名称：" prop="storeRealName">
                                <el-input v-model="compileAddForm.storeRealName"></el-input>
                            </el-form-item>
                        </div>
                    </li>
                    <li>
                        <div class="item">
                            <el-form-item label="店铺状态：" prop="storeStatus">
                                <el-select v-model="compileAddForm.storeStatus">
                                    <el-option v-for="item in search.shop_state_list" :label="item.label" :value="item.value" />
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
                                <el-select v-model="compileAddForm.customsClearId" placeholder="请选择活动区域">
                                    <el-option label="清关人一" value="shanghai"></el-option>
                                    <el-option label="清关人二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="item">
                            <el-form-item label="汇率损失比率：">
                                <el-input v-model="compileAddForm.exchangeLossScale"></el-input>
                            </el-form-item>
                        </div>
                        <em>%</em>
                        <span>注：只保留两位小数，计算订单利润时用到</span>
                    </li>
                    <li>
                        <div class="item">
                            <el-form-item label="店铺logo：">
                                <el-upload class="upload-demo" :headers='headers' :data='logo' :before-upload="onBeforeUpload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" action="http://192.168.0.200:8080/store/upload/logo" list-type="picture">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                </el-upload>
                            </el-form-item>
                        </div>
                    </li>
                    <li>
                        <div class="item">
                            <el-form-item label="业务员：" prop="salesmanId">
                                <el-select v-model="compileAddForm.salesmanId" placeholder="请选择活动区域">
                                    <el-option label="业务员" value="1"></el-option>
                                    <el-option label="业务员" value="2"></el-option>
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
                            <el-form-item label="订单优选级别：">
                                <el-select v-model="compileAddForm.orderPriorityLevel">
                                    <el-option label="中" value="shanghai"></el-option>
                                    <el-option label="高" value="beijing"></el-option>
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
                <el-button type="primary" :loading="loading" @click="submitForm('compileAddForm')">保 存</el-button>
            </div>
        </el-dialog>

    </div>
    <!-- 发货单弹框 -->
    <div class="setDispatch">
        <el-dialog title="发货单设置" :visible.sync="setDispatch" width="867px">
            <el-form :model="dispatchFrom" :rules="rulesDispatch" ref="dispatchFrom" class="demo-ruleForm" :inline="true">
                <ul class="dialog_content">
                    <li>
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="dispatchFrom.name" />
                        </el-form-item>
                        <el-form-item label="域名：" prop="domain">
                            <el-input v-model="dispatchFrom.domain" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="国家：" prop="country">
                            <el-input v-model="dispatchFrom.country" />
                        </el-form-item>
                        <el-form-item label="省份：" prop="province">
                            <el-input v-model="dispatchFrom.province" />
                        </el-form-item>
                        <el-form-item label="城市：" prop="city">
                            <el-input v-model="dispatchFrom.city" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="地址：" prop="address" style="flex:1">
                            <el-input v-model="dispatchFrom.address" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="邮编：" prop="postcode">
                            <el-input v-model.number="dispatchFrom.postcode" />
                        </el-form-item>
                        <el-form-item label="电话：" prop="tel">
                            <el-input v-model.number="dispatchFrom.tel" />
                        </el-form-item>
                        <el-form-item label="邮箱：" prop="email">
                            <el-input v-model="dispatchFrom.email" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="logo：" class="formupload">
                            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="dispatchfileList" list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="包裹感谢信：" prop="thanksLetter">
                            <el-input type="textarea" :rows="2" v-model="dispatchFrom.thanksLetter" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="是否激活：">
                            <el-switch v-model="dispatchFrom.activate" />
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
    <!-- <div class="setSite">

      </div> -->
      <!-- 授权 -->
    <div class="accredit">
        <el-dialog :title="accreditObj.platformName+'账号授权'" :visible.sync="accreditDialog" width="886px" v-model="activeName">
            <div class="accreditWarp">
                <el-collapse accordion>
                    <el-collapse-item title="Step 1 : 选择商城" name="1" class="collapse1">
                        <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
                        <p>注意：<span class="red">只有专业卖家 ( Pro Merchant )可以使用MWS的服务! 如果该账号已经授权了某一个账号，不要再授权另一账号,防止引起关联或数据错乱。</span> </p>
                        <p>1.选择的商城是：
                            <el-select v-model="accreditObj.name" disabled size="mini">
                                <el-option  :label="accreditObj.name"  :value="accreditObj.name"></el-option>
                            </el-select>
                        </p>
                        <p>2.点击下列连结并且登入login</p>
                        <a target='_blank' href="https://mai.amazon.cn/gp/mws/registration/register.html" >https://mai.amazon.cn/gp/mws/registration/register.html</a>
                    </el-collapse-item>
                    <el-collapse-item title="Step 2 : MWS Access" name="2" class="collapse2">
                        <p>1.选择 ' 我希望使用某个应用程序通过 MWS 访问我的亚马逊卖家账户 '.</p>
                        <p>2.输入下列资讯</p>
                        <ul class="hiti">
                            <li>
                                应用程序名称：<span class="red blod"> Irobotbox</span>
                            </li>
                            <li>
                                应用程序开发商账号：<span class="red blod">9162-8084-9043</span>
                            </li>
                        </ul>
                        <p>3.点击 下一页</p>
                        <p>4.接受许可协议，然后点击 下一页</p>
                        <div class="">
                            <img src="./yamx.png" width="784" height="543" alt="">
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Step 3: 复制 Seller ID" name="3">
                        <div class="">
                            <img src="./yamxzh.png" width="808" height="577" alt="">
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Step 4: 输入 Seller ID" name="4">
                        <h6 class="blod">{{accreditObj.name}}</h6>
                        <el-form :rules="accreditFormRules" :model="accreditForm" label-width="130px" ref="accreditForm">
                            <el-form-item label="卖家编号:" prop="sellerId">
                                <el-input v-model="accreditForm.sellerId"></el-input>
                            </el-form-item>
                            <el-form-item label="MWS 授权令牌:" prop="userToken">
                                <el-input v-model="accreditForm.userToken"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="margin-left:300px;" type="primary" @click="onSubmitAccredit('accreditForm',accreditObj.storeId,accreditObj.siteId)">保 存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-dialog>
    </div>
</div>
</template>

<script>
import apis from "apis";
import {
    fetchData
} from "common/common";

import axios from "axios"

function getData(requestURL, params) {
    // let token = "804aea0bc70fa1be7f4045474e11d343";
    let token = localStorage.getItem('token');
    return axios({
        method: 'post',
        //url: 'http://192.168.0.123:8080/' + requestURL,//邓杰
        url: 'http://192.168.0.98:7080/yutoo-admin-erp/' + requestURL, //服务器
        //url: 'http://192.168.0.200:8080/' + requestURL,//张绍武
        data: params,
        headers: {
            token
        },
    }).then(res => {
        return res;
    }).catch(err => {
        document.write(err)
    })
}

export default {
    data() {
        return {
            total:'',//分页数量总数
            accreditDialog: false, //授权弹框
            activeName: '1',
            accreditObj: '',
            accreditForm:{
                sellerId:'',
                userToken:''
            },
            accreditFormRules:{
                sellerId: [
                    { required: true, message: '请输入编号', trigger: 'blur' },
                ],
                userToken: [
                    { required: true, message: '请输入授权令牌', trigger: 'blur' },
                ],
            },
            shopLists: [], //店铺列表数据
            search: {
                platform_type_list: [], //平台列表
                shop_state_list: [{
                        label: "正常",
                        value: "1"
                    },
                    {
                        label: "申请中",
                        value: "2"
                    },
                    {
                        label: "已暂停",
                        value: "3"
                    }
                ],
                siteList: [],
                salesmanList: [],
                userSearch: {
                    shop_name: "", //店铺名称
                    sole_owner: "", //店铺所有人
                    salesman: "", //业务员
                    site: "", //站点
                    shop_state: "", //店铺状态
                    platform_type: "" //平台类型
                }
            },
            setDispatch: false, //发货单设置弹框
            compileShopData: false, //编辑弹框

            currentPage: 1,
            //页面控制状态
            loading: false,
            dialogTitle: '',
            rules: {
                name: [{
                    required: true,
                    message: "店铺名称不能为空",
                    trigger: "blur"
                }],
                ownerId: [{
                    required: true,
                    message: "店铺所有人不能为空",
                    trigger: "change"
                }],
                platformId: [{
                    required: true,
                    message: "平台类型",
                    trigger: "change"
                }],
                siteId: [{
                    required: true,
                    message: "站点",
                    trigger: "change"
                }],
                storeRealName: [{
                    required: true,
                    message: "真实店铺名称",
                    trigger: "blur"
                }],
                storeStatus: [{
                    required: true,
                    message: "店铺状态",
                    trigger: "change"
                }],
                vatSellScale: [{
                        required: true,
                        message: "输入销售VAT比例",
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                vatTaxNum: [{
                        required: true,
                        message: "输入VAT税号",
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                vatTaxRate: [{
                        required: true,
                        message: "输入VAT税率",
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                salesmanId: [{
                    required: true,
                    message: "业务员",
                    trigger: "change"
                }],
            },
            rulesDispatch: {
                //发货单
                name: [{
                    required: true,
                    message: "名称",
                    trigger: "blur"
                }],
                domain: [{
                    required: true,
                    message: "域名",
                    trigger: "blur"
                }],
                country: [{
                    required: true,
                    message: "国家",
                    trigger: "blur"
                }],
                province: [{
                    required: true,
                    message: "省份",
                    trigger: "blur"
                }],
                city: [{
                    required: true,
                    message: "城市",
                    trigger: "blur"
                }],
                address: [{
                    required: true,
                    message: "地址",
                    trigger: "blur"
                }],
                postcode: [{
                        required: true,
                        message: "邮编",
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                tel: [{
                        required: true,
                        message: "电话",
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: '必须为数字值'
                    }
                ],
                email: [{
                        required: true,
                        message: "邮箱",
                        trigger: "blur"
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change']
                    }
                ],
                thanksLetter: [{
                    required: true,
                    message: "包裹感谢信",
                    trigger: "blur"
                }],
            },
            fileList: [],
            dispatchfileList: [],
            type: '',
            singleShopInfo: '', //单个店铺信息
            headers: {
                token: localStorage.getItem('token')
            },
            storeId: '',
            logo: '',

            //数据层
            compileAddForm: { //添加或者编辑绑定
                name: '',
                ownerId: '',
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
                mergeOrderFlag: false,
            },
            dispatchFrom: { //发货单设置
                name: "", //名称
                domain: "", //域名
                country: "", //国家
                province: "", //省份
                city: "", //城市
                address: "", //地址
                postcode: "", //邮编
                tel: "", //电话
                email: "", //邮箱
                logo: '',
                thanksLetter: "", //包裹感谢信
                activate: true //是否激活
            },
        };
    },
    mounted() {
        this.getShopLists();
        this.getPlatformList();
    },
    watch: {
        'search.userSearch.platform_type' (val) {
            this.search.userSearch.site = '';
            this.updateSite(val)
        },
        'compileAddForm.platformId' (val) {
            this.compileAddForm.siteId = '';
            this.updateSite(val)
        }
    },
    methods: {
        //删除上传图片
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        onBeforeUpload(file) {
            console.log(file)
            this.logo = {
                logo: file
            }
        },
        //授权提交
        onSubmitAccredit(formName,storeId,apiType){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params  = Object.assign({},this.accreditForm,{storeId,apiType})
                    getData('store/api/create/or/update',params).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                              message: res.data.msg,
                              type: 'success'
                            });
                            this.getShopLists();
                            for(let key in this.accreditForm){
                                this.accreditForm[key]=null
                            };
                            this.accreditDialog = false;
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        //授权
        accredit(val) {
            this.accreditObj = val;
            this.accreditDialog = true;
            // console.log(val)
        },
        //更新站点
        updateSite(val) {
            this.search.platform_type_list.forEach((item) => {
                if (item.platformId == val) {
                    this.search.siteList = item.siteList
                }
            })
        },
        //搜索
        searchBtn() {
            let params = {
                "pageSize": 10,
                "pageNumber": 1,
                "platformId": this.search.userSearch.platform_type,
                "siteId": this.search.userSearch.site,
                "storeStatus": this.search.userSearch.shop_state,
                "name": this.search.userSearch.shop_name
            }
            if (params.siteId && params.platformId && params.storeStatus) {
                getData('store/list', params).then(res => {
                    this.shopLists = res.data.rows
                })
            } else {
                this.$message.error('输入查询条件 平台或者店铺状态及站点');
            }
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
                for (let key in this.compileAddForm) {
                    this.compileAddForm[key] = null;
                }
            }
        },
        //编辑店铺
        updateShopInfo() {
            getData('store/update', this.compileAddForm).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: '编辑店铺成功',
                        type: 'success'
                    });
                    this.loading = false;
                    this.getShopLists()
                    this.compileShopData = false;
                    return
                }
                if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                }
            })
        },
        //添加店铺
        addShop() {
            let params = Object.assign({}, this.compileAddForm);
            for (let key in params) {
                if (key == 'activeFlag') {
                    params[key] ? params[key] = 1 : params[key] = 0;
                }
                if (key == 'mergeOrderFlag') {
                    params[key] ? params[key] = 1 : params[key] = 0;
                }
                if (key == 'thanksLetterFlag') {
                    params[key] ? params[key] = 1 : params[key] = 0;
                }
            }
            getData('store/create', params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: '添加店铺成功',
                        type: 'success'
                    });
                    this.getShopLists();
                    for (let key in this.compileAddForm) {
                        this.compileAddForm[key] = null;
                    }
                    this.loading = false;
                    this.compileShopData = false;
                }
            })
        },
        //编辑或者添加店铺验证
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //编辑店铺
                    if (this.type) {
                        this.updateShopInfo();
                        this.loading = true;
                    } else {
                        //添加店铺
                        this.addShop();
                        this.loading = true;
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
                    // this.singleShopInfo = Object.assign({},res.data.rows);
                    let shopInfo = Object.assign({}, res.data.rows);
                    for (let key in shopInfo) {
                        for (let i in this.compileAddForm) {
                            if (key == i) {
                                this.compileAddForm[i] = shopInfo[key]
                            }
                        }
                    }
                    this.compileAddForm['storeId'] = storeId
                }
            })
        },
        //获取店铺列表数据
        getShopLists(pageNumber=1,pageSize=10) {
            getData("/store/list", {
                "sortOrder": "asc",
                pageSize,
                pageNumber,
                "platformId": 1
            }).then(res => {
                //console.log(res)
                this.shopLists = res.data.rows;
                this.total=this.shopLists.length;
                if(res.data.code==500){
                    this.$message.error(res.data.msg);
                }
            })
        },
        //获取平台列表
        getPlatformList() {
            getData('platform/list/platform/site').then(res => {
                this.search.platform_type_list = res.data.rows;
            })
        },
        //批量设置
        setPortionShopData() {
            //alert(1)
        },
        //发货单设置
        setDispatchFn(val) {
            this.setDispatch = true;
            this.storeId = val.storeId
            console.log(val)
            //
        },
        //发货单设置保存
        submitDispatch(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = Object.assign({}, this.dispatchFrom, {
                        storeId: this.storeId
                    })
                    params.activate ? '1' : '0';
                    getData('store/deliver/create_or_update', params).then(res => {
                        if (res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getShopLists();
                            this.setDispatch = false;
                        }
                    })
                } else {
                    this.$message.error('错了哦，先填写在保存');
                    return false;
                }
            });
            // this.setDispatch = false;
        },
        //发货地址设置
        setInvoiceSite() {
            //  alert(1)
        },
        //invoice地址设置

        //当前页选择时触发
        changeCurrentPage(val) {
            //console.log(`当前页: ${val}`);
            this.getShopLists(val)
        },
        //勾选的
        checks(val) {
            console.log(val);
        },
        handleSizeChange(val) {
            //console.log(`每页 ${val} 条`);
            this.getShopLists(1,val)
        }
    }
};
</script>

<style lang="scss">
body {
    padding: 10px;
}
@import "../../../assets/style/style-scss/layout.scss";
.operation_btn,
.search {
    background: #fff;
}
.search {
    @include flex(row);
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
        background: rgba(204, 227, 248, 1);
    }
}
.paginationBox {
    position: fixed;
    right: 20px;
    bottom: 30px;
}

//发货单弹框
.setDispatch {
    .dialog_content {
        li {
            @include flex(row);
            .el-form-item {
                &:last-child {
                    flex: 1;
                    .el-form-item__content {
                        width: 79%;
                    }
                }
                input[type="file"] {
                    display: none;
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
                    width: 180px;
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
                    margin-left: 10px;
                    margin-top: -20px;
                    width: 62px;
                    height: 60px;
                }
            }
            .el-select {
                width: 180px;
            }
            .el-form-item {
                @include flex(row);
                .el-form-item__label {
                    width: 120px !important;
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
.accreditWarp{
    height: 520px;
    overflow-y: auto;
    .el-collapse-item__header{
        color: #0079c6;
        font-size: 16px;
        font-weight: 700;
    }
    .el-collapse-item{
        background: #f5f5f5;
    }
    .el-form-item {
        display: flex;
        flex-direction: row;
    }
    .el-form-item__content{
        margin-left: 0!important;
        .el-input{
            width: 400px;
        }
    }
    p{
        line-height: 30px;
        word-wrap:break-word;
    }
    .red{
        color:red;
    }
    .blod{
        font-weight: 800;
    }
    .collapse1{
        a{
            color: #0079c6;
            margin-left: 50px;
            &:hover{
                text-decoration: underline;
            }
        }
    }

}

</style>
