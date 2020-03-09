<template lang="html">
    <div class="UpperShelf-warp">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            <el-breadcrumb-item>产品库</el-breadcrumb-item>
            <el-breadcrumb-item >
                <span class="nav-active">平台产品</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/productInfo'}">刊登上架</el-breadcrumb-item>
            <el-breadcrumb-item>刊登上架信息</el-breadcrumb-item>
        </el-breadcrumb>        
        <el-steps :active="active" align-center finish-status="success" process-status="wait" class="steps" simple >
            <el-step title="选择"></el-step>
            <el-step title="生成店铺SKU" ></el-step>
            <el-step title="确认店铺SKU" ></el-step>
            <el-step title="刊登上架"></el-step>
        </el-steps>
        <!--  -->
        <div class="content-warp">
            <div class="content">
                    <!-- 选择 -->
                    <template v-show="active==1" >
                        <!-- 语种及变体  -->
                        <el-form v-show="active==1" :model="oneform" :rules="oneRules" ref="oneform" label-width="100px" :inline="true" class="oneform">
                            <el-form-item label="选择语种：" prop="languageId">
                                <el-select v-model.number="oneform.languageId"  size="medium" clearable @change="languageChange">
                                    <el-option :label="item.languageName" :value="item.languageId" v-for="item in languageList"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择变体：" prop="variantIds">
                                <el-select v-model="oneform.variantIds"  size="medium" multiple collapse-tags clearable class="variant">
                                    <el-option :label="item.sku" :value="item.platformVariantId" :disabled="!item.uploadFlag" v-for="item in variantList">
                                        <span style="float: left">{{ item.sku }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.errorMsg }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <!-- 店铺和上架类型 -->
                        <el-form v-show="active==1 && oneform.type" :model="twoform"  ref="twoform" style="width: 60%;margin:50px auto;" size="small">
                            <el-table
                                :data="storeList"
                                v-loading="!storeList.length"
                                element-loading-text="正在获取店铺数据..."
                                element-loading-spinner="el-icon-loading"
                                border style="width:100%"
                                @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="80" align="center"/>
                                <el-table-column  prop="storeName"  label="店铺名称" align="center">
                                    <template slot-scope="scope">
                                        <p style="font-size:14px;">{{scope.row.storeName}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column  label="上架类型" align="center">
                                    <template slot-scope="scope">
    <el-form-item :prop="'stores.' + scope.$index + '.saleType'" :rules="{
                                        required: scope.row.required, message: '上架类型不能为空', trigger: 'change'
                                    }">
        <el-select @change="changeSaleType(scope.$index)" placeholder="请选择上架类型" v-model="twoform.stores[scope.$index].saleType" style="width:100%;">
            <el-option :label="item.value" :value="item.key" v-for="item in scope.row.saleTypes"></el-option>
        </el-select>
    </el-form-item>
</template>
</el-table-column>
<el-table-column label="是否独立产品上架" align="center">
        <template slot-scope="scope">
    <el-form-item :prop="'stores.' + scope.$index + '.independent'" :rules="{required: scope.row.required, message: '是否独立上架', trigger: 'change'}">
        <el-select style="width:100%;" v-model="twoform.stores[scope.$index].independent">
            <!-- <el-option label="是" value="1" :disabled="false"/>
            <el-option label="否" value="0" :disabled="false"/>-->
            <el-option :label="item.label" :value="item.value" :disabled="item.disabled" v-for="item in twoform.stores[scope.$index].isSelectArr"/>
        </el-select>
    </el-form-item>
</template>
                                </el-table-column>
                            </el-table>
                            <p v-show='!selectStores.length && isSelect' style="color:#f56c6c;margin-top:10px;">请选择店铺</p>
                        </el-form>
                    </template>
                    <!-- -->
                    <!-- 需要生成的sku  -->
                    <template v-show="active==2">
    <el-form v-show="active==2" :model="skuStoreform" ref="skuStoreform" class="skuStoreform">
        <el-table :data="skuStoreList" class="skuList" :default-expand-all="true" v-loading="!skuStoreList.length" element-loading-text="生成店铺SKU数据..." element-loading-spinner="el-icon-loading">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div style="padding:0px 10px 0px 10px;">
                        <h3 class="skuStore-title">变体信息</h3>
                        <ul class="skuStore-list">
                            <template v-for="(item,index) in props.row.variantInfo">
                                <li :key="index">
                                    <div class="left">
                                        <span>{{item.key}}</span>
                                    </div>
                                    <div class="right">
                                        <ul>
                                            <li>
                                                <div class="text">属性值：</div>
                                                <div class="attributeBox">
                                                    <div class="attribute" v-for="(j,jindexs) in item[item.key].values" :key="jindexs">
                                                        <el-tooltip :content="j" placement="top" effect="light">
                                                            <span>{{ j }}</span>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                            </li>
                                            <li v-for="(j,jindex) in item[item.key].edit" :key="jindex">
                                                <div class="text name">{{j.key+'：'}}</div>
                                                <div class="attributeBox">
                                                    <div class="input" v-for="(k,kindex) in item[item.key].values" :key="kindex">
                                                        <!-- {{j.key}}
                                                        {{skuStoreform.variantProperties[props.$index].variantInfo[index][item.key][kindex]}}-->
                                                        <template v-if="j.key=='sku'">
                                                            <el-form-item
                                                                size="small"
                                                                :prop="'variantProperties.' + props.$index +'.variantInfo.'+index+'.'+ item.key +'.' + kindex + '.sku'"
                                                                :rules="{
                                                                                        required: j.editFlag, message: '此项必填', trigger: 'change'
                                                                                    }"
                                                            >
                                                                <el-input :disabled="!j.editFlag" v-model="skuStoreform.variantProperties[props.$index].variantInfo[index][item.key][kindex].sku"/>
                                                            </el-form-item>
                                                        </template>
                                                        <template v-if="j.key=='title'">
                                                            <el-form-item
                                                                size="small"
                                                                :prop="'variantProperties.' + props.$index +'.variantInfo.'+index+'.'+ item.key +'.' + kindex + '.title'"
                                                                :rules="{
                                                                                        required: j.editFlag, message: '此项必填', trigger: 'change'
                                                                                    }"
                                                            >
                                                                <el-input :disabled="!j.editFlag" v-model="skuStoreform.variantProperties[props.$index].variantInfo[index][item.key][kindex].title"/>
                                                            </el-form-item>
                                                        </template>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="店铺名称" prop="name" align="center">
                <template slot-scope="scope">
                    <p style="font-size:14px;">{{scope.row.storeInfo.storeName}}</p>
                </template>
            </el-table-column>
            <el-table-column label="店铺母体sku" align="center">
                <template slot-scope="scope">
                    <el-form-item
                        :prop="'variantProperties.' + scope.$index + '.parentInfo.sku'"
                        :rules="{
                                                required: true, message: '母体SKU不能为空', trigger: 'change'
                                            }"
                    >
                        <el-input size="small" v-model="skuStoreform.variantProperties[scope.$index].parentInfo.sku"/>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column label="标题" align="center">
                <template slot-scope="scope">
                    <el-form-item
                        :prop="'variantProperties.' + scope.$index + '.parentInfo.title'"
                        :rules="{
                                                required: true, message: '母体标题不能为空', trigger: 'change'
                                            }"
                    >
                        <el-input size="small" v-model="skuStoreform.variantProperties[scope.$index].parentInfo.title"/>
                    </el-form-item>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>
                    <!-- 生成之后的sku信息  -->
                    <template v-show="active==3">
    <el-form
        v-show="active==3"
        :model="generateStoreInfoform"
        ref="generateStoreInfoform"
        v-loading="!generateStoreList.length"
        element-loading-text="正在获生成后的店铺SKU相关数据..."
        element-loading-spinner="el-icon-loading"
        class="generateStoreInfoform"
        label-width="100px"
        size="small"
    >
        <template v-for="(item,index) in generateStoreList">
            <div class="infolist">
                <div class="info">
                    <ul>
                        <li>
                            <el-form-item label="店铺名称：">{{item.storeInfo.storeName}}</el-form-item>
                        </li>
                        <li>
                            <el-form-item label="上架类型：">
                                {{
                                item.storeInfo.saleType==1?($route.query.platformId==2?'拍卖':'跟卖'):item.storeInfo.saleType==2?($route.query.platformId==2?'一口价':'自主上架'):item.storeInfo.saleType=='3'?'关联店铺产品':'-'
                                }}
                            </el-form-item>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <el-form-item
                                label="母体SKU："
                                :prop="'list.'+index+ '.parentInfo.sku'"
                                :rules="{
                                                         required: item.parentInfo.editFlag, message: '母体SKU不能为空', trigger: 'change'
                                                    }"
                            >
                                <el-input v-model="generateStoreInfoform.list[index].parentInfo.sku" :disabled="item.editFlag"/>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item
                                label="母体标题："
                                :prop="'list.'+index+ '.parentInfo.title'"
                                :rules="{
                                                        required: item.parentInfo.editFlag, message: '母体标题不能为空', trigger: 'change'
                                                    }"
                            >
                                <el-input v-model="generateStoreInfoform.list[index].parentInfo.title"/>
                            </el-form-item>
                        </li>
                    </ul>
                </div>
                <el-table :data="item.variantInfo" border style="width: 100%">
                    <el-table-column label="变体SKU" align="center">
                        <template slot-scope="scope">
                            <el-form-item
                                class="infoformmar"
                                :prop="'list.'+index+'.variantInfo.'+scope.$index+'.sku'"
                                :rules="{
                                                        required: item.variantInfo[scope.$index].editFlag, message: 'sku不能为空', trigger: 'change'
                                                    }"
                            >
                                <el-input :disabled="!item.variantInfo[scope.$index].editFlag" v-model="generateStoreInfoform.list[index].variantInfo[scope.$index].sku"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="变体Title" align="center">
                        <template slot-scope="scope">
                            <el-form-item
                                class="infoformmar"
                                :prop="'list.'+index+'.variantInfo.'+scope.$index+'.title'"
                                :rules="{
                                                        required: item.variantInfo[scope.$index].editFlag, message: 'title不能为空', trigger: 'change'
                                                    }"
                            >
                                <el-input :disabled="!item.variantInfo[scope.$index].editFlag" v-model="generateStoreInfoform.list[index].variantInfo[scope.$index].title"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="ASIN" align="center" v-if="item.storeInfo.saleType==1 && $route.query.platformId!==2">
                        <template slot-scope="scope">
                            <el-form-item
                                class="infoformmar"
                                :prop="'list.'+index+'.variantInfo.'+scope.$index+'.sellAsin'"
                                :rules="{
                                                        required: true, message: '不能为空', trigger: 'change'
                                                    }"
                            >
                                <el-input v-model="generateStoreInfoform.list[index].variantInfo[scope.$index].sellAsin"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟卖策略" align="center" v-if="item.storeInfo.saleType==1 && $route.query.platformId!==2">
                        <template slot-scope="scope">
                            <el-form-item
                                class="infoformmar"
                                :prop="'list.'+index+'.variantInfo.'+scope.$index+'.strategyId'"
                                :rules="{
                                                        required: true, message: '请选择跟卖策略', trigger: 'change'
                                                    }"
                            >
                                <el-select v-model="generateStoreInfoform.list[index].variantInfo[scope.$index].strategyId">
                                    <el-option :label="i.name" :value="i.sellRuleId" v-for="i in strategyList"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </el-form>
</template>
                    <!-- 差异 -->
                    <template v-show="active==4">
    <!-- 站点差异 -->
    <template>
        <el-form v-if="noSiteDiff && active=='4'" ref="siteDiffForm" :model="siteDiffForm" label-width="200px" class="diff" size="small">
            <!--  -->
            <template v-for="item in siteDiffList">
                <!-- {{ item }} -->
            </template>
            <!--  -->
        </el-form>
        <p v-if="!noSiteDiff && active=='4'" style="font-size: 14px;width:80%;margin:10px auto;">暂无站点差异值</p>
    </template>
    <!--店铺差异  -->
    <template>
        <el-form
            v-if="noStoreDiff && active=='4'"
            ref="storeDiffForm"
            :model="storeDiffForm"
            label-width="250px"
            class="diff"
            size="small"
            v-loading="!storeDiffList.length"
            element-loading-text="正在获取差异数据..."
            element-loading-spinner="el-icon-loading"
        >
            <!--  -->
            <template v-for="(item,index) in storeDiffList">
                <div class="item" :key="index">
                    <h4>店铺名称：{{item.name}}</h4>

                    <el-row class="inputlist">
                        <el-col :span="j.controlType==7?24:12" v-for="(j,jindex) in item.properties" :key="jindex">
                            <!-- {{storeDiffForm.lists[index].store[jindex]}} -->
                            <el-form-item
                                :label="j.propertyHead"
                                :prop="`lists.${index}.store.${jindex}.propertyValue`"
                                :rules="[
                                                      { required:j.mustFlag?true:false, message: '此项必填', trigger: 'change' },
                                                    ]"
                            >
                                <!-- 输入款 -->
                                <el-row>
                                    <!-- <el-col :span="(j.type==3 || j.type==5 || j.type==4)?14:24">
                                                            <el-input v-model.trim="storeDiffForm.lists[index].store[jindex].propertyValue">
                                                                <el-tooltip
                                                                    v-if="j.propertyName=='model' || j.propertyName=='part_number'"
                                                                    slot="prefix"
                                                                    effect="dark"
                                                                    content="如果该字段不填默认将带入生成的Seller SKU作为该字段的值"
                                                                    placement="top">
                                                                    <i  class="el-icon-warning" style="color:#e6a23c"></i>
                                                                </el-tooltip>
                                                            </el-input>
                                    </el-col>-->
                                    <el-col :span="(j.type==3 || j.type==5 || j.type==4)?14:24">
                                        <FormInputs :remoteMethod="remoteMethod" :dataRanges="j.dataRanges" :list="j.itemProp" :item="j" v-model="storeDiffForm.lists[index].store[jindex].propertyValue"/>
                                    </el-col>
                                    <el-col :span="10" v-if="j.type==3 || j.type==5 || j.type==4">
                                        <el-button class="btn" @click="setValue(storeDiffForm.lists[index].store[jindex].propertyValue,index,jindex,j,'店铺')">{{ j.type | showMsg }}</el-button>
                                    </el-col>
                                </el-row>
                                <!-- 单选框 -->
                                <!-- <el-row v-if="j.controlType==2">
                                                        <el-col :span="(j.type==3 || j.type==5 || j.type==4)?14:24">
                                                            <el-select style="width:100%;" v-model.trim="storeDiffForm.lists[index].store[jindex].propertyValue">
                                                                <el-option v-for="k in j.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                                            </el-select>
                                                        </el-col>
                                                        <el-col :span="10" v-if="j.type==3 || j.type==5 || j.type==4">
                                                            <el-button class="btn"
                                                                @click="setValue(storeDiffForm.lists[index].store[jindex].propertyValue,index,jindex,j,'店铺')">
                                                                设置单个变体值
                                                            </el-button>
                                                        </el-col>
                                </el-row>-->
                                <!-- 多选框 -->
                                <!-- <el-row v-if="j.controlType==3">
                                                        <el-col :span="(j.type==3 || j.type==5 || j.type==4)?14:24">
                                                            <el-select style="width:100%;" multiple  collapse-tags v-model.trim="storeDiffForm.lists[index].store[jindex].propertyValue">
                                                                <el-option v-for="k in j.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                                            </el-select>
                                                        </el-col>
                                                        <el-col :span="10" v-if="j.type==3 || j.type==5 || j.type==4">
                                                            <el-button class="btn"
                                                                 @click="setValue(storeDiffForm.lists[index].store[jindex].propertyValue,index,jindex,j,'店铺')">
                                                                设置单个变体值
                                                            </el-button>
                                                        </el-col>
                                </el-row>-->
                                <!-- 文本域 -->
                                <!-- <el-row v-if="j.controlType==4">
                                                        <el-col :span="(j.type==3 || j.type==5 || j.type==4)?14:24">
                                                           <el-input type="textarea" class="textarea" v-model.trim="storeDiffForm.lists[index].store[jindex].propertyValue"/>
                                                        </el-col>
                                                        <el-col :span="10" v-if="j.type==3 || j.type==5 || j.type==4">
                                                            <el-button class="btn"
                                                                @click="setValue(storeDiffForm.lists[index].store[jindex].propertyValue,index,jindex,j,'店铺')">
                                                                设置单个变体值
                                                            </el-button>
                                                        </el-col>
                                </el-row>-->
                                <!-- 单选按钮 -->
                                <!-- <el-row v-if="j.controlType==5"> 

                                </el-row>-->
                                <!-- 日期 -->
                                <!-- <el-row v-if="j.controlType==1 && j.dataType==3"> 
                                                        <el-date-picker
                                                            value-format="yyyy-MM-dd"
                                                            v-model="storeDiffForm.lists[index].store[jindex].propertyValue"
                                                            type="date"
                                                            placeholder="选择日期">
                                                        </el-date-picker>
                                </el-row>-->
                                <!-- 富文本 -->
                                <!-- <el-row v-if="j.controlType==7">                                                            
                                                        <FormInputs :item="j" v-model="storeDiffForm.lists[index].store[jindex].propertyValue"/>    
                                </el-row>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <!--  -->
            </template>
            <!--  -->
        </el-form>
        <p v-if="!noStoreDiff && active=='4'" style="font-size: 14px;">暂无店铺差异值</p>
    </template>

    <!-- 时间 -->
    <!-- Souq平台id3不用显示 -->
    <el-form v-if="active==4 && platformId!=3" :model="publishDetailForm" ref="publishDetailForm" label-width="170px" size="small" class="publishDetailForm">
        <el-form-item label="是否审核通过立即上架：">
            <el-select v-model="publishDetailForm.autoPublish" placeholder="请选择">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
            </el-select>
        </el-form-item>

        <transition name="el-zoom-in-top">
            <div class="timeWarp" v-if="publishDetailForm.autoPublish==0">
                <div class="timeText">上架时间：</div>
                <ul v-if="selectStoreList.length">
                    <li v-for="(item,index) in selectStoreList" :key="index">
                        <el-tag>{{item.storeName}}</el-tag>
                        <el-form-item>
                            <el-select v-model="publishDetailForm.publishDetail[index].autiPublish">
                                <el-option label="审核通过立即上架" value="1"></el-option>
                                <el-option label="选择其他时间上架" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="publishDetailForm.publishDetail[index].autiPublish==0"
                            :prop="`publishDetail.${index}.publishTime`"
                            :rules="[
                                                  { required:publishDetailForm.publishDetail[index].autiPublish==0?true:false, message: '请选择时间', trigger: 'change' },
                                                ]"
                        >
                            <el-date-picker clearable v-model="publishDetailForm.publishDetail[index].publishTime" :picker-options="pickerOptions" placeholder="请选择上架时间" value-format="yyyy-MM-dd HH" type="datetime"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" plain @click="syncStore(item,index,publishDetailForm.publishDetail[index].autiPublish,publishDetailForm.publishDetail[index].publishTime)">同步到其他店铺</el-button>
                        </el-form-item>
                    </li>
                </ul>
            </div>
        </transition>
    </el-form>
</template>
                    <!-- 设置单个变体值和单个店铺值 -->
                    <el-dialog
                        :title="setMsg.title"
                        :visible.sync="setMsg.visible"
                        width="400px;"
                        center>
                        <!--  -->
                        <template v-if="setMsg.title==='设置单个变体值'">
    <el-form label-width="250px" size="small" :model="setMsg" ref="setMsg">
        <el-form-item
            :label="item.sku+'：'"
            v-for="(item,index) in setMsg.list"
            :key="index"
            :prop="'list.' + index + '.value'"
            :rules="[
                                      { required:item.mustFlag?true:false, message: '此项必填', trigger: 'change' },
                                    ]"
        >
            <!-- 输入框  -->
            <!-- <div v-if="item.controlType==1">                                        
                                        <el-input v-model.trim="setMsg.list[index].value"/>
            </div>-->
            <!--  -->
            <!-- <div v-if="item.controlType==2">
                                        <el-select style="width:100%;" v-model="setMsg.list[index].value">
                                            <el-option v-for="k in item.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                        </el-select>
            </div>-->
            <!--  -->
            <!-- <div v-if="item.controlType==3">
                                        <el-select style="width:100%;" multiple  collapse-tags v-model="setMsg.list[index].value">
                                            <el-option v-for="k in item.itemProp"  :label="k.itemValue"  :value="k.salePfPropItemId"></el-option>
                                        </el-select>
            </div>-->
            <!--  -->
            <!-- <div v-if="item.controlType==4">
                                        <el-input type="textarea" class="textarea" v-model.trim="setMsg.list[index].value"/>
            </div>-->
            <!-- {{item.info.itemProp}}                     -->
            <FormInputs :remoteMethod="remoteMethod" :dataRanges="item.dataRanges" :list="item._list" :item="item.info" v-model="setMsg.list[index].value"/>
        </el-form-item>
    </el-form>
</template>

                        <!--  -->
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="submitSetMsg()">确 定</el-button>
                        </span>
                    </el-dialog>

                    <!-- 同步到其他店铺 -->
                    <store-list
                        title="同步到其他店铺"
                        :dialog="syncStoreDialog"
                        :data="syncStoreList"
                        :changeDialogStatus="changeDialogStatusSync"
                        @search="search"
                        @submit="onSubmitSync">
                    </store-list>
                    <!--  -->
            </div>
            <!--  -->
            <div class="stepsBtn">
                <el-button style="margin-top: 12px;" @click="previous" size="small" v-if="active!=1" type="primary">上一步</el-button>
                <el-button style="margin-top: 12px;" @click="next(1)" size="small" type="primary" :loading="nuxtLoading">
                    {{ active==4 ?'保存':'下一步'}}
                </el-button>
                <el-button v-if='active==4' style="margin-top: 12px;" @click="next(0)" size="small" type="primary" :loading="nuxtLoading">
                   {{platformId==3?'导出上架模板':'确认上传'}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import apis from 'apis';
import { fetchData, showToast } from 'common/common';
import { getData } from 'common/http';
import storeList from './store-list.vue';
function showText(val) {
    if (val == 3 || val == 5) {
        return '设置单个变体值';
    } else if (val == 4) {
        return '设置单个店铺值';
    }
    return '';
}

import PurchaseInputs from 'components/base/PurchaseInputs';
import FormInputs from '@/pages/product/platformList/ebayEditLists/components/FormInputs.vue';
import PurchaseSingle from 'components/base/PurchaseSingle';
export default {
    data() {
        return {
            active: 1,
            nuxtLoading: false,
            platformId: this.$route.query.platformId,
            productId: this.$route.query.productId,
            detailId: Number(this.$route.query.detailId),
            platformProductId: this.$route.query.platformProductId,
            oneform: {
                languageId: null,
                variantIds: [],
                type: false
            },
            oneRules: {
                languageId: [
                    { required: true, message: '请选择语种', trigger: 'change' }
                ],
                variantIds: [
                    { required: true, message: '请选择变体', trigger: 'change' }
                ]
            },
            //语种和变体
            languageList: [],
            variantList: [],
            //选择店铺和上架类型
            twoform: {
                stores: []
            },
            selectVariant: [], //选择的变体信息
            storeIds: [], //选择的所有店铺id
            selectStoreList: [], //选择的店铺
            storeList: [],
            selectStores: [],
            isSelect: false,
            // 店铺sku信息
            skuStoreList: [],
            skuStoreform: {
                variantProperties: []
            },
            // 生成之后的sku信息
            generateStoreInfoform: {
                list: []
            },
            generateStoreList: [],
            strategyList: [], // 跟卖策略
            // 差异
            siteDiffList: [],
            storeDiffList: [],
            noSiteDiff: true, // 是否有差异
            noStoreDiff: true,
            siteDiffForm: {
                lists: []
            },
            storeDiffForm: {
                lists: []
            },
            autoPublish: '1',
            // 审核通过
            publishDetailForm: {
                autoPublish: '1',
                publishDetail: []
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            //
            setMsg: {
                title: '',
                visible: false,
                list: [],
                index: null,
                jindex: null,
                name: null
            },
            //
            syncStoreDialog: false,
            syncStoreList: [],
            syncIndex: null,
            syncAutiPublish: null,
            syncPublishTime: null,
            _storeInfo: [],
            platformId: null
        };
    },
    watch: {
        storeList(val) {
            console.log(val);
            this.twoform.stores = val.map(item => {
                return {
                    storeId: item.storeId,
                    saleType: null,
                    independent: null,
                    isSelectArr: []
                };
            });
        },
        skuStoreList(val) {
            this.skuStoreform.variantProperties = val.map(item => {
                let saleType = null;
                let independent = null;
                this.twoform.stores.forEach(j => {
                    if (j.storeId == item.storeInfo.storeId) {
                        saleType = j.saleType;
                        independent = j.independent;
                    }
                });
                return {
                    storeInfo: {
                        storeName: item.storeInfo.storeName,
                        storeId: item.storeInfo.storeId,
                        saleType,
                        independent
                    },
                    parentInfo: {
                        baseProductParentId:
                            item.parentInfo.baseProductParentId,
                        detailProductParentId:
                            item.parentInfo.detailProductParentId,
                        sku: item.parentInfo.sku,
                        title: item.parentInfo.title
                    },
                    variantInfo: item.variantInfo.map(j => {
                        let obj = {};
                        j[j.key].edit.forEach(k => {
                            obj[j.key] = j[j.key].values.map((k, index) => {
                                return {
                                    value: k,
                                    sku: null,
                                    title: null
                                };
                            });
                            obj['key'] = j.key;
                        });
                        return obj;
                    })
                };
            });
        },
        generateStoreList(val) {
            this.generateStoreInfoform.list = val.map(item => {
                return {
                    variantInfo: item.variantInfo.map(j => {
                        return {
                            editFlag: j.editFlag,
                            msg: j.msg,
                            uploadFlag: j.uploadFlag,
                            baseVariantProductId: j.baseVariantProductId,
                            variantDetailId: j.variantDetailId,
                            sku: j.sku,
                            sellAsin: null,
                            strategyId: null,
                            title: j.title
                        };
                    }),
                    storeInfo: {
                        storeName: item.storeInfo.storeName,
                        storeId: item.storeInfo.storeId,
                        saleType: item.storeInfo.saleType,
                        independent: item.storeInfo.independent
                    },
                    parentInfo: {
                        baseProductParentId:
                            item.parentInfo.baseProductParentId,
                        detailProductParentId:
                            item.parentInfo.detailProductParentId,
                        sku: item.parentInfo.sku,
                        title: item.parentInfo.title,
                        editFlag: item.parentInfo.editFlag
                    }
                };
            });
        },
        siteDiffList(val) {
            this.siteDiffForm.lists = val.map((item, index) => {
                if (!item.properties.length) {
                    this.noSiteDiff = false;
                } else {
                    this.noSiteDiff = true;
                }
                return {
                    site: item.properties.map(j => {
                        let obj = {
                            siteId: item.name,
                            propertyName: j.propertyHead,
                            propertyValue: j.value,
                            type: j.type,
                            list: []
                        };
                        if (j.type == 3 || j.type == 4 || j.type == 5) {
                            obj.list = this.oneform.variantIds.map(id => {
                                return {
                                    id,
                                    value: null,
                                    flag: true
                                };
                            });
                        }
                        return obj;
                    })
                };
            });
            console.log('站点差异', this.siteDiffForm.lists);
        },
        storeDiffList(val) {
            this.storeDiffForm.lists = val.map((item, index) => {
                if (!item.properties.length) {
                    this.noStoreDiff = false;
                } else {
                    this.noStoreDiff = true;
                }
                return {
                    ['store']: item.properties.map(j => {
                        let obj = {
                            storeId: item.storeId,
                            siteId: item.siteId,
                            propertyName: j.propertyName,
                            propertyValue: j.value,
                            type: j.type,
                            list: []
                        };
                        // 如果是单个变体值
                        if (j.type == 3 || j.type == 5) {
                            // obj.list = this.oneform.variantIds.map(id=>{
                            //     return {
                            //         id,
                            //         "value":null,
                            //         flag:true
                            //     }
                            // })
                            obj.list = j.list.map(k => {
                                return {
                                    id: k.id,
                                    sku: k.sku,
                                    value: k.value,
                                    flag: true
                                };
                            });
                        }
                        // 如果是单个店铺值
                        if (j.type == 4) {
                            // obj.list = this.storeIds.map(id=>{
                            //     return {
                            //         id,
                            //         "value":null,
                            //         flag:true
                            //     }
                            // })
                            obj.list = j.list.map(k => {
                                return {
                                    id: k.id,
                                    sku: k.sku,
                                    value: k.value,
                                    flag: true
                                };
                            });
                        }
                        return obj;
                    })
                };
            });
            console.log('店铺差异', this.storeDiffForm.lists);
        },
        'publishDetailForm.autoPublish': {
            handler(val) {
                if (val == 1) {
                    this.publishDetailForm.publishDetail.length = 0;
                } else {
                    this.publishDetailForm.publishDetail = this.storeIds.map(
                        storeId => {
                            return {
                                autiPublish: '1',
                                publishTime: '',
                                storeId
                            };
                        }
                    );
                }
            },
            deep: true
        }
    },
    filters: {
        showMsg(val) {
            return showText(val);
        }
    },
    methods: {
        previous() {
            if (this.active-- < 2) this.active = 1;
            this.nuxtLoading = false;
        },
        next(saveType) {
            if (this.active == 1) {
                if (this.selectStores.length && this.oneform.type) {
                    this.nuxtLoading = true;
                    this.adopt('twoform')
                        .then(valid => {
                            this.getSkuinfo().then(() => {
                                this.nuxtLoading = false;
                            });
                            if (this.active++ > 2) this.active = 2;
                        })
                        .catch(() => {
                            this.nuxtLoading = false;
                            return false;
                        });
                } else {
                    this.isSelect = true;
                }
            }
            if (this.active == 2) {
                this.nuxtLoading = true;
                this.adopt('skuStoreform')
                    .then(valid => {
                        let params = Object.assign(
                            {},
                            {
                                variantProperties: this.skuStoreform
                                    .variantProperties,
                                variantDetailIds: this.oneform.variantIds
                            }
                        );
                        getData('/putaway/get/sku', params).then(res => {
                            this.nuxtLoading = false;
                            if (res.data.code == 0) {
                                let data = res.data.rows;
                                this._storeInfo = data;
                                this.twoform.stores.forEach(item => {
                                    data.forEach(j => {
                                        if (
                                            item.storeId == j.storeInfo.storeId
                                        ) {
                                            j['saleType'] = item.saleType;
                                            j['independent'] = item.independent;
                                        }
                                    });
                                });
                                this.generateStoreList = data;
                                if (this.active++ > 2) this.active = 3;
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        });
                        if (!this.strategyList.length) this.getStrategyList();
                    })
                    .catch(() => {
                        this.nuxtLoading = false;
                        return false;
                    });
            }
            if (this.active == 3) {
                let _this = this;
                this.nuxtLoading = true;
                this.adopt('generateStoreInfoform')
                    .then(valid => {
                        if (valid) {
                            this.getDiff(() => {
                                if (_this.active++ > 2) _this.active = 4;
                                _this.nuxtLoading = false;
                            });
                        } else {
                            _this.nuxtLoading = false;
                        }
                    })
                    .catch(() => {
                        _this.nuxtLoading = false;
                        return false;
                    });
            }
            if (this.active == 4) {
                this.nuxtLoading = false;
                //如果有站点差异
                if (this.noSiteDiff) {
                    //判断站点差异必填项是否填写
                } else {
                    //
                }
                //有店铺差异
                if (this.noStoreDiff) {
                    //判断店铺差异必填项是否填写
                    this.adopt('storeDiffForm').then(valid => {
                        if (valid) {
                            //如果是suqu platformId=3 不验证时间
                            if (this.platformId == 3) {
                                this.nuxtLoading = true;
                                this.submitFormSave(
                                    saveType,
                                    this.noStoreDiff,
                                    boole => {
                                        this.nuxtLoading = boole;
                                    }
                                );
                                return;
                            }
                            this.adopt('publishDetailForm').then(valid => {
                                if (valid) {
                                    this.nuxtLoading = true;
                                    this.submitFormSave(
                                        saveType,
                                        this.noStoreDiff,
                                        boole => {
                                            this.nuxtLoading = boole;
                                        }
                                    );
                                } else {
                                    this.$message.warning('请先填写完整');
                                }
                            });
                        }
                    });
                    //无差异
                } else {
                    this.nuxtLoading = true;
                    this.submitFormSave(
                        saveType,
                        boole => {
                            this.nuxtLoading = boole;
                        },
                        this.noStoreDiff
                    );
                }
            }
        },
        languageChange(val) {
            if (val) {
                this.nuxtLoading = true;
                this.adopt('oneform')
                    .then(valid => {
                        this.getStore().then(() => {
                            this.nuxtLoading = false;
                            this.oneform.type = true;
                        });
                    })
                    .catch(() => {
                        this.nuxtLoading = false;
                        return false;
                    });
            } else {
                this.oneform.type = false;
                this.selectStores = [];
            }
        },
        syncStore(item, index, autiPublish, publishTime) {
            this.syncStoreDialog = true;
            this.syncIndex = index;
            this.syncAutiPublish = autiPublish;
            this.syncPublishTime = publishTime;
            this.syncStoreList = this.selectStoreList.filter(
                el => el.storeId != item.storeId
            );
        },
        //
        changeDialogStatusSync(val) {
            this.syncStoreDialog = val;
        },
        search(val) {
            console.log(val);
        },
        onSubmitSync(val) {
            console.log(this.publishDetailForm.publishDetail);
            console.log(val);
            this.publishDetailForm.publishDetail.forEach(item => {
                val.forEach(j => {
                    if (j.storeId == item.storeId) {
                        item.autiPublish = this.syncAutiPublish;
                        item.publishTime = this.syncPublishTime;
                    }
                });
            });
            this.syncStoreDialog = false;
        },
        //设置单个变体，店铺， 确定
        submitSetMsg() {
            this.adopt('setMsg').then(valid => {
                if (valid) {
                    // console.log(this.setMsg.index,this.setMsg.jindex,this.setMsg.name)
                    let index = this.setMsg.index;
                    let jindex = this.setMsg.jindex;
                    if (this.setMsg.name == '店铺') {
                        let list = this.storeDiffForm.lists[this.setMsg.index]
                            .store[jindex].list;
                        let setList = this.setMsg.list;
                        list.forEach(i => {
                            setList.forEach(j => {
                                if (i.id == j.id) {
                                    // if(i.flag){
                                    //     i.value = j.value
                                    //     i.flag = false
                                    // }else{
                                    //     i.value = j.value
                                    // }
                                    i.value = j.value;
                                }
                            });
                        });
                        this.$message.success('操作成功');
                    } else {
                    }
                    this.setMsg.visible = false;
                }
            });
        },
        //
        getStoreInfo(info, value, jindex) {
            this.setMsg.list = this.selectStoreList.map((item, kindex) => {
                let active = this.storeDiffForm.lists[this.setMsg.index].site[
                    jindex
                ].list[kindex].flag;
                let newVal = null;
                if (this.setMsg.list.length) {
                    newVal = this.setMsg.list[kindex].value;
                }
                return {
                    sku: item.name,
                    id: item.storeId,
                    value: active ? value : newVal,
                    itemProp: info.itemProp,
                    controlType: info.controlType,
                    mustFlag: info.mustFlag
                };
            });
        },
        getVariantInfo(info, value, jindex) {
            this.setMsg.list = this.oneform.variantIds.map((item, kindex) => {
                let active = this.storeDiffForm.lists[this.setMsg.index].store[
                    jindex
                ].list[kindex].flag;
                let newVal = null;
                if (this.setMsg.list.length) {
                    newVal = this.setMsg.list[kindex].value;
                }
                let obj = {};
                this.variantList.forEach(j => {
                    if (item == j.platformVariantId) {
                        obj['sku'] = j.sku;
                        obj['id'] = j.platformVariantId;
                    }
                });
                obj['itemProp'] = info.itemProp;
                obj['mustFlag'] = info.mustFlag;
                obj['value'] = active ? value : newVal;
                obj['controlType'] = info.controlType;
                return obj;
            });
        },

        //设置单个变体值 、店铺值
        setValue(value, index, jindex, info, name) {
            console.log(value, index, jindex, info, name);
            this.setMsg.index = index;
            this.setMsg.jindex = jindex;
            this.setMsg.name = name;
            this.setMsg.title = showText(info.type);
            this.setMsg.visible = true;
            //如果是店铺差异设置
            // if(name=='店铺'){
            //     //如果设置的是店铺差异  =>单个变体
            //     if(this.setMsg.title==="设置单个变体值"){
            //         this.getVariantInfo(info,value,jindex)
            //     //如果设置的是店铺差异  =>单个店铺值
            //     }else{
            //         this.getStoreInfo(info,value,jindex)
            //     }
            // //如果是站点差异设置
            // }else{
            //     //如果设置的是站点差异  =>单个变体
            //     if(this.setMsg.title==="设置单个变体值"){
            //         this.getVariantInfo(info,value,jindex)
            //     //如果设置的是站点店铺差异  =>单个店铺值
            //     }else{
            //         this.getStoreInfo(info,value,jindex)
            //     }
            // }

            this.setMsg.list = info.list.map((i, p) => {
                let afterVal = this.storeDiffForm.lists[index].store[jindex]
                    .list[p].value;
                console.log(afterVal);
                return {
                    sku: i.sku,
                    id: i.id,
                    value: afterVal ? afterVal : value,
                    info,
                    _list: info.itemProp
                };
            });
        },
        /**
         * saveType保存，上传
         * isDiff，是否存在差异
         */
        submitFormSave(saveType, isDiff, callback) {
            let diff = [
                ...this.storeDiffForm.lists,
                ...this.siteDiffForm.lists
            ];
            let diffProperties = [];
            diff.forEach(item => {
                for (let key in item) {
                    item[key].forEach(j => {
                        j.list.forEach(k => {
                            if (!k.value) {
                                k.value = j.propertyValue;
                            }
                        });
                        diffProperties.push(Object.assign({}, j));
                    });
                }
            });
            var params;
            //是否存在差异
            if (isDiff) {
                params = {
                    variants: this.generateStoreInfoform.list,
                    diffProperties,
                    publishDetail: this.publishDetailForm.publishDetail,
                    saveType,
                    platformId: this.$route.query.platformId,
                    parentDetailId: this.detailId,
                    autoPublish: this.publishDetailForm.autoPublish
                };
            } else {
                params = {
                    variants: this.generateStoreInfoform.list,
                    publishDetail: this.publishDetailForm.publishDetail,
                    saveType,
                    platformId: this.$route.query.platformId,
                    parentDetailId: this.detailId,
                    autoPublish: this.publishDetailForm.autoPublish
                };
            }

            getData('/putaway/commit', params).then(res => {
                if (res.data.code == 0) {
                    this.$message.success(res.data.msg);
                    //如果是soup平台
                    if (this.platformId == 3 && res.data.filePath) {
                        window.location.href = res.data.filePath;
                    }
                    callback && callback(true);
                    setTimeout(() => {
                        this.$router.back(-1);
                    }, 1000);
                } else {
                    this.$message.error(res.data.msg);
                    callback && callback(false);
                }
            });
        },
        //获取差异
        getDiff(callback) {
            let params = {
                storeIds: this.storeIds,
                detailId: this.detailId,
                storeInfo: this.generateStoreInfoform.list //this._storeInfo
            };
            // console.log(this.generateStoreInfoform.list)
            // console.log(this._storeInfo)
            getData('/putaway/diff', params).then(res => {
                if (res.data.code == 0) {
                    callback && callback();
                    this.platformId = res.data.rows.platformInfo.platformId;
                    this.siteDiffList = res.data.rows.siteDiffList;
                    this.storeDiffList = res.data.rows.storeDiffList;
                    this.nuxtLoading = false;
                } else {
                    this.nuxtLoading = false;
                    this.$message.error(res.data.msg);
                }
            });
        },
        //获取跟卖策略
        getStrategyList() {
            getData('/sell/rule/query', {}).then(res => {
                if (res.data.code == 0) {
                    this.strategyList = res.data.rows;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //上架类型切换时
        changeSaleType(index) {
            let vm = this;
            console.log(this.storeList);
            let arr = [];
            let independent;
            vm.storeList.forEach(item => {
                item.saleTypes.forEach(citem => {
                    if (vm.twoform.stores[index].saleType == citem.key) {
                        independent = citem.independent;
                        return;
                    }
                });
            });
            switch (independent) {
                case 1:
                    arr = [
                        { label: '是', value: '1', disabled: false },
                        { label: '否', value: '0', disabled: false }
                    ];
                    break;
                case 2:
                    arr = [{ label: '是', value: '1', disabled: false }];
                    break;
                case 3:
                    arr = [{ label: '否', value: '0', disabled: false }];
                    break;
            }

            this.$set(vm.twoform.stores[index], 'isSelectArr', arr);
        },
        //选择店铺后获取sku生成信息
        getSkuinfo() {
            let stores = [];
            this.selectStores.forEach(i => {
                this.twoform.stores.forEach(j => {
                    if (i == j.storeId) {
                        stores.push(j);
                    }
                });
            });
            let params = {
                stores,
                variantDetailIds: this.oneform.variantIds
            };
            return getData('/putaway/store/choose', params).then(res => {
                if (res.data.code == 0) {
                    this.skuStoreList = res.data.rows;
                }
            });
        },
        handleSelectionChange(val) {
            this.storeIds = val.map(item => item.storeId);
            this.selectStoreList = val.map(item => item);
            if (val.length) {
                this.isSelect = true;
                this.selectStores = val.map(item => {
                    item['required'] = true;
                    return item.storeId;
                });
            } else {
                this.isSelect = false;
                this.selectStores = [];
                this.storeList.forEach(item => {
                    item['required'] = false;
                });
            }
        },
        //获取店铺
        getStore() {
            let params = {
                languageId: this.oneform.languageId,
                detailId: this.detailId,
                baseVariantIds: this.oneform.variantIds
            };
            return getData('/putaway/store/info', params).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.rows;
                    data.forEach(item => {
                        item['required'] = false;
                    });
                    this.storeList = data;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //获取语种和变体
        getLanguageAndvariant() {
            let params = {
                productId: this.productId,
                detailId: this.detailId,
                platformProductId: this.platformProductId
            };
            getData('putaway/language/info', params).then(res => {
                if (res.data.code == 0) {
                    this.languageList = res.data.rows.languageInfo;
                    this.variantList = res.data.rows.variantInfo;
                    //变体默认选中
                    this.variantList.forEach(item => {
                        if (item.uploadFlag == true) {
                            this.oneform.variantIds.push(
                                item.platformVariantId
                            );
                        }
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //是否输入必须项
        adopt(formName) {
            let _this = this;
            return new Promise((resolve, reject) => {
                _this.$refs[formName].validate(valid => {
                    if (valid) {
                        resolve(valid);
                    } else {
                        reject(valid);
                    }
                });
            });
        },
        remoteMethod(searchKey, { selectKey, salePfPropertyId }) {
            console.log(searchKey);
            if (selectKey === 'Size-WISH') {
                selectKey = this.selectedSize.itemGroup;
                salePfPropertyId = this.selectedSize.salePfGlobaGroupId;
            }
            if (selectKey == null) {
                showToast('error', '请先选择size的类型');
                return Promise.resolve([]);
            }
            return this.getKey(selectKey).then(res => {
                if (!res.data.data[0]) {
                    return [
                        {
                            itemValue: searchKey,
                            salePfPropItemId: searchKey
                        }
                    ];
                }
                let { itemKey, salePfGlobaGroupId } = res.data.data[0];
                let data = {
                    itemKey,
                    salePfGlobaGroupId,
                    searchKey: searchKey
                };
                return this.getList(data).then(res => {
                    if (!res.data.data[0]) {
                        return [
                            {
                                itemValue: searchKey,
                                salePfPropItemId: searchKey
                            }
                        ];
                    }
                    return res.data.data;
                });
            });
        },
        getList({ itemKey, salePfGlobaGroupId, searchKey }) {
            return fetchData({
                ...apis.salePfGlobaGroupItemGetItem,
                data: {
                    itemKey,
                    salePfGlobaGroupId,
                    searchKey: searchKey.trim()
                }
            });
        },
        getKey(itemKey) {
            return fetchData({
                ...apis.salePfGlobaGroupGetGroupByKey,
                data: {
                    itemKey
                }
            });
        }
    },
    mounted() {
        this.getLanguageAndvariant();
    },
    components: {
        storeList,
        PurchaseSingle,
        FormInputs,
        PurchaseInputs
    }
};
</script>

<style lang="scss" scoped>
// .nav {
//     font-size: 14px;
//     padding: 15px 0;
//     background: #ececec;
//     margin-top: -12px;
// }
// .nav-active {
//     font-weight: 700;
//     color: #303133;
//     transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
//     &:hover {
//         cursor: pointer;
//         color: #108ee9;
//     }
// }
$borderCorlor: #ebeef5;
.UpperShelf-warp {
    display: flex;
    flex-direction: column;
    height: 100%;
    .steps {
        margin: 10px;
        height: 30px;
        .el-step {
            .el-step__main {
                .el-step__title {
                    font-size: 14px;
                }
            }
        }
    }
}
.content-warp {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .content {
        margin: 10px;
        // background:#f5f7fa;
        flex: 1;
        overflow-y: auto;
    }
    .stepsBtn {
        height: 44px;
        text-align: center;
        margin-bottom: 20px;
    }
}
.oneform {
    text-align: center;
    margin-top: 50px;
    .variant {
        width: 400px;
    }
}
.skuList {
    width: 90%;
    margin: 0 auto;
    border: 1px solid $borderCorlor;
    border-radius: 3px;
}
.skuStoreform {
    .skuStore-title {
        height: 30px;
        background: #f5f7fa;
        padding: 0 10px;
        line-height: 30px;
    }
    .skuStore-list {
        & > li {
            border: 1px solid $borderCorlor;
            display: flex;
            &:first-child {
                border-bottom: none;
            }
            &:hover {
                background: #f5f7fa;
            }
            .left {
                min-width: 150px;
                border-right: 1px solid $borderCorlor;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
            }
            .right {
                flex: 1;
                ul {
                    li {
                        display: flex;
                        flex-direction: row;
                        // flex-wrap: wrap;
                        border: 1px solid $borderCorlor;
                        &:first-child {
                            height: 40px;
                            line-height: 40px;
                            border: none;
                            background: #f5f7fa;
                        }
                        .text {
                            width: 100px;
                            text-align: right;
                            padding-right: 12px;
                        }
                        .name {
                            border-right: 1px solid $borderCorlor;
                            padding-top: 18px;
                        }
                        .attributeBox {
                            display: flex;
                            width: 100%;
                        }
                        .attribute {
                            border-left: 1px solid $borderCorlor;
                            text-align: center;
                            flex: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            &:after {
                                content: '*';
                                color: #f56c6c;
                                font-size: 12px;
                                margin-left: 3px;
                            }
                        }
                        .input {
                            // margin: 0 10px;
                            flex: 1;
                            padding: 18px 10px 0 10px;
                            border-right: 1px solid $borderCorlor;
                        }
                    }
                }
            }
        }
    }
}

.generateStoreInfoform {
    width: 80%;
    margin: 0 auto;
    .infolist {
        margin-bottom: 10px;
        .info {
            display: flex;
            flex-direction: row;
            border: 1px solid $borderCorlor;
            ul {
                flex: 1;
                display: flex;
                border: 1px solid $borderCorlor;
                border-bottom: none;
                &:last-child {
                    border-left: 1px solid $borderCorlor;
                }
                li {
                    flex: 1;
                    padding: 18px 10px 0 0;
                }
            }
        }
    }
    .infoformmar {
        margin-top: 18px;
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }
}

.diff {
    margin-bottom: 10px;
    min-height: 150px;
    .item {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        h4 {
            height: 32px;
            line-height: 32px;
            padding-left: 10px;
            background: #eee;
            font-size: 14px;
            font-weight: 700;
        }
        .inputlist {
            padding-top: 18px;
            padding-right: 10px;
            .btn {
                width: 100%;
            }
            textarea {
                height: 32px !important;
            }
        }
    }
}
.publishDetailForm {
    width: 80%;
    margin: 20px auto;
    .timeWarp {
        display: flex;
        .timeText {
            width: 200px;
            padding-right: 10px;
            text-align: right;
        }
        ul {
            li {
                display: flex;
                .el-form-item {
                    .el-form-item__content {
                        margin-left: 10px !important;
                    }
                }
            }
        }
    }
}
</style>
