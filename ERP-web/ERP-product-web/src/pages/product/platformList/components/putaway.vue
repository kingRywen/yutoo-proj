<template lang="html">
    <div class="putaway">
        <div class="putaway_header">刊登上架</div>
        <div class="putaway_body">
            <div class="putaway_info">
                <p class="title">基础属性</p>
                <div class="list">
                    <div class="item">产品名称：{{attribute.productInfo.nameZh}}</div>
                    <div class="item">产品sku：{{attribute.productInfo.sku}}</div>
                    <div class="item">产品侵权风险：{{attribute.productInfo.riskType?'非仿冒':'仿冒'}}</div>
                    <div class="item">强电插头：{{attribute.productInfo.plugFlag?'无':'有'}}</div>
                    <div class="item">供应商报价：{{attribute.productInfo.supplierPrice}}</div>
                </div>
            </div>
            <div class="putaway_info">
                <p class="title">平台属性</p>
                <div class="list">
                    <div class="item">ItemType：{{attribute.properties.itemName}}</div>
                    <div class="item">TargetAudience：{{attribute.properties.itemSku}}</div>
                    <el-button type="primary" size="small" class="infoBtn" @click="redactDialog=true">编辑</el-button>
                </div>
            </div>
            <!-- 编辑弹框 -->
            <el-dialog title="亚马逊信息编辑" :visible.sync="redactDialog"  width="80%" >
              <el-row>
                  <!-- 语种 -->
                  <el-col :span="6">
                      <product-infoList :productInfoLists="languageList" @click="product_correlation"></product-infoList>
                  </el-col>
                  <!-- 语种form -->
                  <el-col :span="18">
                    <el-form label-position="right" label-width="80px" :model="redactForm">
                      <el-form-item label="名称">
                        <el-input ></el-input>
                      </el-form-item>
                      <el-form-item label="活动区域">
                        <el-input ></el-input>
                      </el-form-item>
                      <el-form-item label="活动形式">
                        <el-input ></el-input>
                      </el-form-item>
                    </el-form>

                  </el-col>
              </el-row>


              <span slot="footer" class="dialog-footer">
                <el-button >翻 译</el-button>
                <el-button @click="redactDialog = false">保 存</el-button>
                <el-button type="primary" @click="redactDialog = false">提 交</el-button>
              </span>
            </el-dialog>
            <!--  -->
            <div class="uploadingBtn">
                <el-button type="primary" size="small" class="infoBtn" @click="uploading">上传到店铺</el-button>
            </div>
            <!-- 已上传到店铺列表 -->
            <div class="uploading_shoplist mtp10">
                <p class="title">已上传到店铺</p>
                <div class="shoplist_content margin-top: 10px;">
                    <div class="select">
                        <el-form  :model="formInline" class="demo-form-inline" :inline='true'>
                            <el-form-item label="站点：">
                              <el-select v-model="formInline.user" placeholder="活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="店铺名称：">
                              <el-select v-model="formInline.region" placeholder="活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="产品状态：">
                              <el-select v-model="formInline.region" placeholder="活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="select" size="small">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="uploadingBtn mtp10">
                          <el-button type="primary" size="small" class="infoBtn">批量审核</el-button>
                          <el-button type="primary" size="small" class="infoBtn">批量上架</el-button>
                    </div>

                    <div class="stateListsBtn mtp10">
                        <el-button class="btnitem" size="medium" v-for="item in startList" @click="changeTable(item)">{{item.desc+'('+item.count+')'}}</el-button>
                    </div>

                    <div class="table">
                      <el-table :data="dynamicData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                          <el-table-column type="selection"/>
                          <el-table-column label="站点国家/店铺名称" >
                              <template slot-scope="scope">
                                  <img :src="scope.row.imgPath" width="67" height="37" alt="">
                                  <p>{{ scope.row.storeName }}</p>
                              </template>
                          </el-table-column>
                          <el-table-column prop="name" label="状态"/>
                          <el-table-column prop="name" label="本地仓结余库存"/>
                          <el-table-column prop="name" label="今日销量"/>
                          <el-table-column prop="name" label="本周销量"/>
                          <el-table-column prop="statusList" label="FAB状态"/>
                          <el-table-column  fixed="right" label="操作" >
                              <template slot-scope="scope">
  <el-button type="text">复制上传到其他店铺</el-button>
  <el-button type="text">审核</el-button>
  <el-button type="text">取消刊登</el-button>
  <el-button type="text">编辑listing</el-button>
  <el-button type="text">下架</el-button>
</template>
                          </el-table-column>
                      </el-table>
                      <el-pagination class="paginationBox"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="currentPage"
                          :page-sizes="[5, 10, 15,20]"
                          :page-size="100"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="dynamicData.length">
                      </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- 上传到店铺弹框 -->
        <el-dialog title="上传到店铺" :visible.sync="uploadingDialog" width="910" >
            <el-form :model="uploadingform" :inline='true'>
              <el-form-item label="选择语种：">
                  <el-select v-model="languageId">
                    <el-option v-for='item in languageList' :label="item.languageName" :value="item.languageId"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="选择变体：">
                  <el-select v-model="variantId" multiple>
                    <el-option v-for="item in variantList" :label="item.sku" :value="item.variantId"></el-option>
                  </el-select>
              </el-form-item>
              <el-button type="info" style="height:40px;" @click="selectShopDialog=true" v-if="languageId">选择店铺</el-button>
              <!-- 选择店铺弹框 -->
              <el-dialog  width="30%" title="选择店铺" :visible.sync="selectShopDialog" append-to-body>
                <el-input placeholder="请输入店铺名称" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <div class="search_result">
                    <!-- <el-button type="info" style="margin:10px 0 0 0;width:100%" v-for="item in shopList">{{item.storeName}}</el-button> -->
                  <el-table :data="shopList" :show-header='false'  style="width: 100%;margin-top:15px;" @selection-change="checkedShops">
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column label="storeName" prop="storeName" width="100%"/>
                  </el-table>

                </div>
                <div slot="footer" class="dialog-footer" style="text-align: center">
                  <el-button type="primary" @click="selectShop">确 定</el-button>
                </div>
              </el-dialog>
              <!--  -->
            </el-form>

            <div class="shop" v-if="shopInfo.show">
                <div>
                    <span style="margin-right:10px;">
                    店铺名称：<el-button v-for='item in shopInfo.sku.storeList' size="medium">{{item.storeName}}</el-button>
                    </span>
                </div>
                <div class="" style="margin-top:10px;">
                    <span style="margin-right:10px;">
                      渠道SKU：<el-button size="medium" v-for="item in shopInfo.sku.skuList">{{item.sku}}</el-button>
                    </span>
                </div>
                <el-row style="margin-top:25px;">
                    <!-- 站点列表 -->
                    <el-col  :span="24" style="display:flex; margin-right:10px" v-for='(item,index) in shopInfo.siteDiffList' ref="ruleForm">
                        <img :src="item.siteInfo.banner" width="40" height="40" alt="" style="margin-right:10px;">
                        <div style="padding:10px 10px 0 10px;border:1px solid #ccc; border-radius: 4px;flex:1">
                          <el-form  :inline='true' class="siteform" :model="siteDiffProperties[index]">
                              <!-- {{siteDiffProperties}} -->
                            <el-form-item v-for='(i,siteCurIndex) in item.properties' :label="i.displayKey+'：'"
                                :prop="i.displayKey"
                                :rules="i.mustFlag?[{ required: true, message: '此项必填', trigger: 'change' }]:[]"
                                >
                                <!-- 1.输入款 -->
                                <el-input v-model='siteDiffProperties[index][i.displayKey]' v-if="i.propertyType==1" @change='updateInput(item,index, i, $event)'>
                                    <el-button v-if='typeText' type="info" slot="append" @click="setVariantDialog(i.displayKey,i,siteCurIndex,index,item,1)">{{typeText}}</el-button>
                                    <!-- <el-button  @click="setVariantDialog(i.displayKey,i,siteCurIndex,index,item,1)">设置单个变体值</el-button> -->
                                </el-input>
                                <!-- 2.单选款 -->
                                <div v-if="i.propertyType==2">
                                    <el-select @change="updateSelect(item,index, i, $event)" @focus="changeSelect(i.displayKey,item.siteInfo.siteId)" v-model='siteDiffProperties[index][i.displayKey]'>
                                       <el-option v-for='j in siteSectelt' :label="j.propertyValue" :value="j.propertyValue"/>
                                    </el-select>
                                    <el-button v-if='typeText' @click="setVariantDialog(i.displayKey,i,siteCurIndex,index,item,2)">{{typeText}}</el-button>
                                    <!-- <el-button  @click="setVariantDialog(i.displayKey,i,siteCurIndex,index,item,2)">设置单个变体值</el-button> -->
                                </div>
                                <!-- 3.多选款  -->
                                <!--
                                    多选需要把绑定的值变成数组
                                -->
                                <!-- <div v-if="i.propertyType==3">
                                    <el-select  multiple  @focus="changeSelect(i.displayKey,item.siteInfo.siteId)" v-model='siteDiffProperties[index][i.displayKey]' @change="updateSelect(item,index, i, $event)">
                                      <el-option v-for='j in siteSectelt' :label="j.propertyValue" :value="j.propertyValue"></el-option>
                                    </el-select>
                                    <el-button v-if='typeText' @click="setVariantDialog()">{{typeText}}</el-button>
                                </div> -->
                                <!-- 4. 文本域-->
                                <!-- <div v-if="i.propertyType==4">
                                    <el-input v-model='siteDiffProperties[index][i.displayKey]' type="textarea" @change='updateInput(item,index, i, $event)' :autosize="{ minRows: 2, maxRows: 4}" style="width:200px;height:40px;"/>
                                    <el-button v-if='typeText' @click="setVariantDialog()">{{typeText}}</el-button>
                                </div> -->
                            </el-form-item>
                          </el-form>
                        </div>
                    </el-col>


                </el-row>
                <el-row style="margin-top:25px;" class="shoplistform">
                    <!-- 店铺列表 -->
                    <el-col v-for="(item,index) in shopInfo.storeDiffList" :span="24" style="display:flex; margin-bottom:10px" ref="ruleForm">
                        <p>{{item.info.name}}：</p>
                        <div style="padding:10px 10px 0 10px;border:1px solid #ccc; border-radius: 4px; width:100%;">
                          <el-form :inline='true' status-icon label-position="right" :model="diffProperties[index]">
                              <!-- {{diffProperties}} -->
                            <el-form-item
                                v-for="(curitem,curIndex) in item.properties" :label="curitem.displayKey+':'"
                                :prop="curitem.displayKey"
                                :rules="curitem.mustFlag?[{ required: true, message: '此项必填', trigger: 'blur' }]:[]">
                                <!-- 1.输入框 -->
                                <el-input v-if="curitem.propertyType==1" v-model="diffProperties[index][curitem.displayKey]" @input="diffInput(item,index, curitem, $event)">
                                  <el-button v-if="curitem.type==5" type="info" slot="append" @click="setVariantDialog(curitem.displayKey,curitem,curIndex,index,1)">设置单个变体值</el-button>
                                </el-input>
                                <!-- 2.单选框 -->
                                <div v-if='curitem.propertyType==2'>
                                    <el-select  v-model="diffProperties[index][curitem.displayKey]" @focus='changeSelectShop(curitem.displayKey,item.info.siteId)'>
                                       <el-option v-for='j in shopSectelt' :label="j.propertyValue" :value="j.propertyValue"/>
                                    </el-select>
                                </div>
                                <!-- 3.多选框 -->
                                <el-select  multiple v-if='curitem.propertyType==3' v-model="diffProperties[index][curitem.displayKey]"  @focus='changeSelectShop(curitem.displayKey,item.info.siteId)'>
                                    <el-option v-for='j in shopSectelt' :label="j.propertyValue" :value="j.propertyValue"></el-option>
                                </el-select>
                                <!-- 4.文本域 -->
                                <el-input v-if='curitem.propertyType==4' v-model="diffProperties[index][curitem.displayKey]" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"/>
                            </el-form-item>
                          </el-form>
                        </div>
                    </el-col>
                </el-row>
                <!-- 店铺设置单个变体值弹框 -->
                <el-dialog  width="30%" title="设置店铺值" :visible.sync="variantDialog" append-to-body>
                    <el-form  class="demo-form-inline">
                      <el-form-item v-for="(item,index) in variantList"  :label="item.sku"  style="display:flex;" class="variantInput">
                        <!-- 输入款 -->
                        <el-input v-if="type==1" :value="list[index]['value']" @input="singleVariant(index,item,$event)"></el-input>
                        <!-- 单选框 -->
                        <el-select  v-if="type==2" v-model="list[index]['value']" @change="updateList(item,index,$event)">
                           <el-option v-for='j in siteSectelt' :label="j.propertyValue" :value="j.propertyValue"/>
                        </el-select>
                        <!-- 多选框 -->

                        <!-- 文本域 -->
                      </el-form-item>
                      {{list}}
                    </el-form>
                    <div slot="footer" class="dialog-footer" style="text-align: center">
                      <el-button type="primary" @click="setVariantVal(list)">确 定</el-button>
                    </div>
                </el-dialog>
                <!--  -->
                <div style="margin-top:25px;display:flex;">
                    <span style="margin-right:10px;">image:</span>
                    <div style="padding:10px;border:1px solid #ccc; border-radius: 4px;width:100%">
                        <img src="http://placehold.it/160x160.jpg" width="160" height="160" alt="">
                    </div>
                </div>

                 <div style='margin-top:15px;'>
                    <el-checkbox v-model="autoPublish">是否审核通过后立即上架</el-checkbox>
                    <div v-if='autoPublish' style="margin-top:15px;">
                        <el-row>
                              <el-col :span="2">
                                  上架时间：
                              </el-col>
                              <el-col :span="22">
                                    <!-- {{publishDetail}} -->
                                    <el-form :inline="true" class="demo-form-inline" v-for='(item,index) in shopInfo.sku.storeList'>
                                        <el-form-item>
                                            <el-button  size="medium">{{item.storeName}}</el-button>
                                        </el-form-item>

                                        <el-form-item>
                                            <el-select v-model="publishDetail[index]['autiPublish']" @change='addProperty(item,index,$event)'>
                                              <el-option label="审核通过立即上架" value="0"></el-option>
                                              <el-option label="选择其他时间上架" value="1"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item v-if="publishDetail[index]['autiPublish']==1">
                                            <el-date-picker
                                              @change='addtime(item,index,$event)'
                                              v-model="publishDetail['publishTime']"
                                              type="datetime"
                                              placeholder="选择日期时间"
                                              align="right">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button size="medium">同步到店铺</el-button>
                                        </el-form-item>
                                    </el-form>
                              </el-col>
                        </el-row>
                    </div>
                 </div>
                <!-- 同步到店铺弹框 -->
            </div>
            <!--  -->
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button  type="primary" @click="submitShopForm('ruleForm',0)">确认上传</el-button>
              <el-button type="primary" @click="submitShopForm('ruleForm',1)">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import productInfoList from "../product-infoList";
import { BASE_URL } from "common/config";
import { _storage } from "common/common";

function getData(requestURL, params) {
  //   let token = "804aea0bc70fa1be7f4045474e11d343";
  return axios({
    method: "post",
    //url: 'http://192.168.0.123:8080/' + requestURL,
    //url: 'http://192.168.0.98:7080/yutoo-admin-erp/' + requestURL, //服务器
    url: BASE_URL + "/" + requestURL, //张绍武
    data: params,
    headers: {
      token: _storage._get('local', 'token')
    }
  })
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log("网络又挂了" + err);
    });
}

export default {
  data() {
    return {
      list: [], //设置单个变体值对应的ID和value

      diffProperties: [], //店铺的属性名和属性值
      siteDiffProperties: [], //站点的属性和属性值

      autoPublish: false, //是否审核立即上架
      publishDetail: [], //同步信息
      siteSectelt: [], //站点动态下拉框数据
      shopSectelt: [], //店铺列表动态下拉字段数据
      languageList: [], //语种
      variantList: [], //变体
      formInline: {
        user: "",
        region: ""
      },

      languageId: "", //语种ID
      variantId: [], //变体ID

      uploadingform: {
        language: ""
      },
      shopList: [], //店铺列表
      multipleSelection: [],
      currentPage: 1,
      uploading_shoplist: [],
      startList: [], //查询各种状态的店铺产品的数量
      dynamicData: [], //tabs动态数据容器
      redactDialog: false, //编辑弹框
      uploadingDialog: false, //上传店铺弹框
      selectShopDialog: false, //选择店铺弹框
      variantDialog: false, //设置变体弹框
      redactForm: {}, //编辑form数据
      attribute: {}, //基础属性和平台属性及ID
      storeIds: [], //用户选中的店铺
      shopInfo: {}, //选择店铺后的店铺信息

      userDiffProperties: [], //店铺设置单个变体值数据
      shopIndex: "",
      shopCurIndex: "",
      state: false,

      userSiteDiffProperties: [], // 站点设置多单个变体及店铺值
      siteIndex: "",
      siteCurIndex: "",
      siteId: "",

      type: "",
      //参数
      params: {
        platformId: 1,
        productId: 731,
        detailId: 134,
        platformProductId: 3,
        ids: {}
      }
    };
  },
  components: {
    productInfoList
  },
  mounted() {
    this.getAttribute();
    this.getStart();
    this.getShoplist();
  },
  computed: {
    typeText() {
      let str = "";
      this.shopInfo.siteDiffList.forEach(item => {
        item.properties.forEach(i => {
          if (i.type == 3) {
            str = "设置单个变体值";
          } else if (i.type == 4) {
            str = "设置单个店铺值";
          } else {
            str = false;
          }
        });
      });
      return str;
    }
  },
  methods: {
    addProperty(item, index, val) {
      Vue.set(
        this.publishDetail,
        index,
        Object.assign({}, this.publishDetail[index], {
          autiPublish: val,
          storeId: item.storeId
        })
      );
    },
    addtime(item, index, val) {
      Vue.set(
        this.publishDetail,
        index,
        Object.assign({}, this.publishDetail[index], {
          publishTime: val
        })
      );
    },
    //更新list数组
    updateList(item, index, val) {
      Vue.set(
        this.list,
        index,
        Object.assign({}, this.list[index], {
          value: val
        })
      );
    },
    //更新站点input
    updateInput(item, index, i, val) {
      Vue.set(
        this.siteDiffProperties,
        index,
        Object.assign({}, this.siteDiffProperties[index], {
          siteId: item.siteInfo.siteId,
          [i.displayKey]: val,
          propertyType: i.propertyType,
          propertyId: i.propertyId
        })
      );
    },
    //更新站点单项框数据
    updateSelect(item, index, i, val) {
      //debugger
      Vue.set(
        this.siteDiffProperties,
        index,
        Object.assign({}, this.siteDiffProperties[index], {
          siteId: item.siteInfo.siteId,
          [i.displayKey]: val,
          propertyType: i.propertyType,
          propertyId: i.propertyId
        })
      );
    },
    //更新单个变体值弹框数据
    singleVariant(index, item, val) {
      Vue.set(
        this.list,
        index,
        Object.assign({}, this.list[index][val], {
          id: item.variantId,
          value: val
        })
      );
    },

    //提交刊登上架
    submitShopForm(formName, num) {
      let refsArr = [];
      this.$refs[formName].forEach(item => {
        item.$children.forEach(existing => {
          existing.validate(valid => {
            refsArr.push(valid);
          });
        });
      });
      let state = refsArr.every(val => {
        return val == true;
      });
      let mock = true;
      if (state) {
        this.$refs[formName].forEach(item => {
          item.$children.forEach(curitem => {
            curitem.validate(valid => {
              if (valid && mock) {
                mock = false;
                console.log(valid);
                //alert('submit!');
                this.submitData(num);
                // this.uploadingDialog = false;
              } else {
                mock = true;
                console.log("error submit!!");
                return false;
              }
            });
          });
        });
      }
    },
    //提交数据
    submitData(num) {
      let data = {
        storeIds: this.storeIds,
        variantInfo: [],
        diffProperties: [],
        ids: this.params.ids, //从平台带过来
        autoPublish: this.autoPublish ? 1 : 0,
        publishDetail: [],
        platformId: this.params.platformId,
        saveType: num
      };
      let skulist = this.shopInfo.sku.skuList;
      if (skulist.length) {
        skulist.forEach(item => {
          data.variantInfo.push(Object.assign({}, item));
        });
      }

      //同步信息
      if (this.publishDetail.length) {
        this.publishDetail.forEach(item => {
          data.publishDetail.push(Object.assign(item));
        });
      }

      let variantVal = this.userDiffProperties;
      let obj = {
        storeId: "",
        propertyType: "",
        propertyId: "",

        propertyName: "",
        propertyValue: ""
      };

      this.diffProperties.forEach(item => {
        obj.storeId = item.storeId;
        obj.propertyType = item.propertyType;
        obj.propertyId = item.propertyId;
        for (var key in item) {
          if (key == "storeId") continue;
          if (key == "propertyType") continue;
          if (key == "propertyId") continue;
          obj.propertyName = key;
          obj.propertyValue = item[key];
          //是否设置店铺变体值
          if (variantVal.length) {
            variantVal.forEach(variantList => {
              variantList.forEach(varIten => {
                //debugger
                if (varIten.displayKey == key) {
                  obj["list"] = [...varIten.list];
                  // console.log(obj)
                } else {
                  return;
                }
              });
            });
          }
          data.diffProperties.push(Object.assign({}, obj));
        }
      });
      let siteObj = {
        siteId: "",
        propertyType: "",
        propertyId: "",

        propertyName: "",
        propertyValue: ""
      };
      this.siteDiffProperties.forEach(item => {
        siteObj.siteId = item.siteId;
        siteObj.propertyType = item.propertyType;
        siteObj.propertyId = item.propertyId;
        for (var key in item) {
          if (key == "siteId") continue;
          if (key == "propertyType") continue;
          if (key == "propertyId") continue;
          siteObj.propertyName = key;
          siteObj.propertyValue = item[key];
          if (variantVal.length) {
            variantVal.forEach(variantList => {
              variantList.forEach(varIten => {
                //debugger
                if (varIten.displayKey == key) {
                  siteObj["list"] = [...varIten.list];
                } else {
                  return;
                }
              });
            });
          }
          data.diffProperties.push(Object.assign({}, siteObj));
        }
      });
      console.log(data);

      getData("putaway/commit", data).then(res => {
        console.log(res);
      });
    },
    //站点列表动态字段获取焦点时触发
    changeSelect(propertyName, siteId) {
      if (propertyName && siteId) {
        getData("CatePltTempPropM/findCatePltPropItem", {
          propertyName,
          siteId
        }).then(res => {
          this.siteSectelt = res.data.item;
        });
      } else {
        this.$message.error("数据还在路上");
      }
    },
    //店铺列表动态字段获取焦点时触发
    changeSelectShop(propertyName, siteId) {
      if (propertyName && siteId) {
        getData("CatePltTempPropM/findCatePltPropItem", {
          propertyName,
          siteId
        }).then(res => {
          this.shopSectelt = res.data.item;
        });
      } else {
        this.$message.error("数据还在路上");
      }
    },
    //上传到店铺Btn
    uploading() {
      this.uploadingDialog = true;
      //获取语种及变体 根据产品id获取语种列表，变体==>需要从平台产品列表页传过来
      getData("putaway/language/info", {
        productId: this.params.productId,
        detailId: this.params.detailId,
        platformProductId: this.params.platformProductId
      }).then(res => {
        this.languageList = res.data.languageInfo;
        this.variantList = res.data.variantInfo;
        this.variantList.forEach(item => {
          this.variantId.push(item.variantId);
        });
      });
    },
    //user选中的店铺
    checkedShops(arr) {
      this.storeIds = arr.map(item => {
        return item.storeId;
      });
    },
    //选择店铺
    selectShop() {
      if (this.storeIds.length) {
        getData("putaway/store/choose", {
          storeIds: this.storeIds,
          variantIds: this.variantId,
          detailId: this.params.detailId
        }).then(res => {
          this.shopInfo = Object.assign(
            {
              show: true
            },
            res.data
          );
        });
        this.selectShopDialog = false;
      } else {
        this.$message({
          message: "最少需要选择一个店铺",
          type: "warning"
        });
      }
      //console.log(this.shopInfo)
    },
    //设置单个变体值
    setVariantDialog(displayKey, item, curindex, index, siteItem, type) {
      this.variantDialog = true;
      if (item.storeId) {
        this.shopIndex = index;
        this.shopCurIndex = curindex;
        this.type = siteItem;
        this.state = true;

        this.userDiffProperties[index] = [];
        this.userDiffProperties[index][curindex] = {
          displayKey: item.displayKey,
          storeId: item.storeId,
          list: []
        };
      }
      if (siteItem.siteInfo.siteId) {
        this.type = type;
        this.siteIndex = index;
        this.siteCurIndex = curindex;
        this.siteId = siteItem.siteInfo.siteId;

        this.userSiteDiffProperties[index] = [];
        this.userSiteDiffProperties[index][curindex] = {
          displayKey: item.displayKey,
          siteId: siteItem.siteInfo.siteId,
          list: []
        };
      }
      //debugger
    },
    //设置当个变体值保存
    setVariantVal(arr) {
      let shopIndex = this.shopIndex;
      let shopCurindex = this.shopCurIndex;
      let siteIndex = this.siteIndex;
      let siteCurIndex = this.siteCurIndex;
      let curSiteId = this.siteId;
      if (this.state) {
        if (this.userDiffProperties[shopIndex][shopCurindex].storeId) {
          this.userDiffProperties[shopIndex][shopCurindex].list.push(...arr);
        }
      }
      if (curSiteId) {
        if (this.userSiteDiffProperties[siteIndex][siteCurIndex].siteId) {
          this.userSiteDiffProperties[siteIndex][siteCurIndex].list.push(
            ...arr
          );
        }
      }
      this.$message({
        message: "设置成功",
        type: "success"
      });
      this.variantDialog = false;
    },
    //切换table数据
    changeTable(currentObj) {
      if (currentObj.status || currentObj.status == 0) {
        this.getShoplist(currentObj.status);
      }
      //this.getShoplist(currentObj.status)
    },
    //获取产品基础属性和平台属性
    getAttribute() {
      getData("putaway/product/info", {
        productId: this.params.productId,
        detailId: this.params.detailId,
        platformProductId: this.params.platformProductId
      }).then(res => {
        if (res.data.code == 0) {
          this.attribute = Object.assign({}, res.data.rows);
        }
      });
    },
    diffInput(item, index, curitem, val) {
      Vue.set(
        this.diffProperties,
        index,
        Object.assign({}, this.diffProperties[index], {
          storeId: curitem.storeId,
          [curitem.displayKey]: val,
          propertyType: curitem.propertyType,
          propertyId: curitem.propertyId
        })
      );
    },
    //获取上传店铺了列表数据
    getShoplist(status = 0) {
      getData("store/product/list/by/status", {
        sortOrder: "asc",
        pageSize: 10,
        pageNumber: 1,
        platformId: his.params.platformId,
        status
      }).then(res => {
        console.log(res.data.rows);
        this.dynamicData = res.data.rows;
      });
    },
    //获取tab状态数量
    getStart() {
      getData("store/product/group/by/status", {
        platformId: this.params.platformId
      }).then(res => {
        this.startList = res.data.rows;
      });
    },
    //语种切换form表单
    product_correlation(item) {},
    //搜索
    select() {
      alert("select!");
    },
    //勾选
    handleSelectionChange(val) {
      console.log(val);
    },
    //
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  watch: {
    "shopInfo.storeDiffList"(val) {
      let l = this.diffProperties.length;
      let cache = this.diffProperties;
      if (l > val.length) {
        cache.length = val.length;
        cache.forEach((el, index) => {
          if (index < val.length) {
            return;
          } else {
            for (var key in object) {
              if (object.hasOwnProperty(key)) {
                el[key] = null;
              }
            }
          }
        });
      } else {
        val.forEach((el, index) => {
          if (cache[index]) {
            return;
          } else {
            cache[index] = {};
          }
        });
      }
    },
    "shopInfo.siteDiffList"(val) {
      //console.log(val)
      val.forEach((item, index) => {
        //console.log(item)
        this.siteDiffProperties[index] = {};
      });
    },
    languageId(val) {
      getData("putaway//store/info", {
        languageId: val
      }).then(res => {
        //console.log(res.data.rows)
        this.shopList = res.data.rows;
      });
    },
    variantList(val) {
      val.forEach((item, index) => {
        this.list[index] = {
          id: item.variantId,
          value: ""
        };
      });
    },
    "shopInfo.sku.storeList"(val) {
      val.forEach((item, index) => {
        this.publishDetail[index] = {
          autiPublish: "",
          publishTime: ""
        };
      });
    }
  }
};
</script>
<style lang="scss">
.title {
  height: 38px;
  line-height: 38px;
  font-weight: 400;
  padding-left: 10px;
  background-color: rgba(242, 242, 242, 1);
}
.mtp10 {
  margin-top: 10px;
}
* {
  margin: 0;
  padding: 0;
}
.putaway {
}
.putaway_header {
  height: 38px;
  line-height: 38px;
  padding: 0 10px;
  background-color: rgba(110, 123, 155, 1);
  font-weight: 400;
  color: #fff;
  font-style: normal;
}
.putaway_body {
  // background: green;
  padding: 10px;
  .putaway_info {
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 4px;
    margin-bottom: 10px;
    .list {
      background-color: #fff;
      display: flex;
      padding: 10px;
      .item {
        margin-right: 80px;
      }
      .infoBtn {
        width: 83px;
        height: 30px;
      }
    }
  }
  .uploadingBtn .infoBtn {
    width: 118px;
    height: 30px;
  }
  .uploading_shoplist {
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 4px;
    .shoplist_content {
      padding: 10px;
      .select {
        // padding: 10px 0 10px 10px;
        border: 1px solid rgba(204, 204, 204, 1);
        height: 65px;
        border-radius: 4px;
        form {
          padding: 12px 0 12px 10px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
      .stateListsBtn {
        .el-tabs--border-card > .el-tabs__header {
          background: #fff;
          border-bottom: none;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
          background: #fff;
          border-bottom-color: #dcdfe6;
          color: #333;
        }
        .el-tabs__item {
          background: #807c7c;
          color: #fff;
        }
        .btnitem {
          margin: 0;
          background: rgba(102, 102, 102, 1);
          color: #fff;
          border-radius: 0;
        }
      }
    }
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .paginationBox {
    float: right;
    margin: 30px 30px 20px;
  }
}
.search_result {
  .el-table__body {
    width: 100% !important;
  }
}
//
.variantInput .el-form-item__content {
  flex: 1;
}
.siteform,
.shoplistform {
  .el-select,
  .el-input__inner {
    width: 160px;
  }
  .el-form-item__label {
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
