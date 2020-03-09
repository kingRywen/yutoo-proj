<template>
    <div style="padding:10px;">
        <!--  -->
        <section v-if="!noshowMain" class="searchBox">
            <span class="line">关键字：</span>
            <div style="width:320px;">
                <el-input v-model="select.keyword" clearable size="small" @input="selectInput(select.keyword)" placeholder="请输入关键字" />
            </div>
            <span class="line">添加时间：</span>
            <el-date-picker size="small" v-model="select.timeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            <el-button type="primary" size="small" icon="el-icon-search" @click="select_category">搜 索</el-button>
        </section>
        <!--  -->
        <section v-if="!noshowMain" class="operationBox">
            <el-button type="primary" @click="edit_category(0)" size="small" icon="el-icon-plus">添 加</el-button>
            <!-- <el-button type="primary" size="small">删 除</el-button> -->
            <el-button type="primary" @click="record()" size="small" icon="el-icon-zoom-in">查看操作日志</el-button>
            <el-button type="primary" size="small" icon="el-icon-document">
                <router-link :to="{ path: '/record', params: {} }" tag="span">导 入 记 录</router-link>
            </el-button>
            <el-button type="primary" size="small" @click="ontempalate()" icon="el-icon-download">下 载 模 板</el-button>
            <el-upload
                class="upload-demo"
                name="file"
                :with-credentials="true"
                :action="uploadTemplateUrl"
                :headers="headers"
                :data="file"
                :before-upload="beforeUploadTemp"
                :on-success="tolead_success"
                :on-error="tolead_error"
                :file-list="fileList"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                multiple
            >
                <el-button size="small" icon="el-icon-upload2
" type="success">导 入</el-button>
            </el-upload>
        </section>
        <!--类目树  -->
        <section v-if="!noshowMain" class="categoryBox">
            <el-collapse accordion v-model="activeNames">
                <el-collapse-item name="1">
                    <template slot="title">
                        提示操作
                        <i class="header-icon el-icon-info"></i>
                    </template>
                    <ul>
                        <li>• 点击类目名前“+”符号，显示当前类目的下级类目，直接点新增下级时，会自动带入父级信息</li>
                        <li>• 产品活跃度设置，设置该类别产品活跃度分类规则，</li>
                        <li>• 变体值设置，设置该类别对应的变体值，添加该类别产品时，产品变体符合设置的变体值，产品图片处会按一定规则生成文件夹，导出文件夹，在文件夹中存入相应图片导入，图片会自动和变体关联</li>
                    </ul>
                </el-collapse-item>
            </el-collapse>

            <category-tree v-if="!noshowMain" :data="categoryList" :columns="columns" @addCategoryNext="addCategoryNext" :loading="loading">
                <el-table-column label="操 作" width="400px" align="center">
                    <template slot-scope="scope">
                        <ul class="btnLists">
                            <el-tooltip effect="dark" content="变体差异值设置" placement="top">
                                <li @click="operateDifference(scope.row.categoryId)">差</li>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="模板设置" placement="top">
                                <li @click="goTempSet(scope.row.categoryId)">模</li>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="扩展属性设置" placement="top">
                                <li @click="extend_attribute(scope.row.categoryId)">扩</li>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="变体值设置" placement="top">
                                <li @click="set_variant(scope.row.categoryId)">变</li>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="活跃度规则设置" placement="top">
                                <li @click="setEvent(scope.row.categoryId)">活</li>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="编辑" placement="top">
                                <li class="border" @click="edit_category(1,scope.row.categoryId)">
                                    <img src="../icon/xieru_icon.png" />
                                </li>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <li v-if="scope.row.sourceType=='Merchant'" class="border" @click="delCategory(scope.row.categoryId)">
                                    <img src="../icon/del_icon.png" />
                                </li>
                            </el-tooltip>
                        </ul>
                    </template>
                </el-table-column>
            </category-tree>
        </section>

        <!-- 添加 / 修改-->
        <div class="add">
            <el-dialog :title="title" :visible.sync="addDialog" width="1086px">
                <div style="height:500px;overflow-y: auto;">
                    <el-form :model="CategoryForm" ref="CategoryForm" label-position="right" :inline="true" label-width="145px" class="addForm" size="medium">
                        <el-form-item label="父级类目：">
                            <el-cascader :change-on-select="true" :props="props" :options="categoryList" v-model="CategoryForm.parentId" clearable :disabled="sourceType=='Default'?true:false" />
                        </el-form-item>
                        <el-form-item label="类目中文名称：" prop="nameCn" :rules="{required: true, message: '中文名称不能为空', trigger: 'blur'}">
                            <el-input v-model="CategoryForm.nameCn" :disabled="sourceType=='Default'?true:false"></el-input>
                        </el-form-item>
                        <el-form-item label="类目英文名称：" prop="nameEn" :rules="{required: true, message: '英文名称不能为空', trigger: 'blur'}">
                            <el-input v-model="CategoryForm.nameEn" :disabled="sourceType=='Default'?true:false"></el-input>
                        </el-form-item>
                        <el-form-item label="海关编码：">
                            <el-input v-model="CategoryForm.customsCode" />
                        </el-form-item>
                        <!-- <el-form-item label="相关类目：" class="select bgnone">
              <el-cascader :change-on-select="true" :props='props' :options='categoryList' v-model="CategoryForm.relatedCateId" clearable />
                        </el-form-item>-->
                        <el-form-item label="类目状态：">
                            <el-radio-group v-model.number="CategoryForm.lockFlag" size="small">
                                <el-radio-button label="0">正常显示</el-radio-button>
                                <el-radio-button label="1">锁定不显示</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            label="排序："
                            style="width:51%"
                            prop="sortNumber"
                            :rules="[
                          { required: true, message: '序号不能为空'},
                          { type: 'number', message: '序号必须为数字值'}
                        ]"
                        >
                            <el-input v-model.number="CategoryForm.sortNumber" clearable />
                        </el-form-item>
                        <el-form-item label="主要开发负责人：" class="take">
                            <el-select v-model.number="CategoryForm.developPicId" clearable @focus="getRelevant(1)">
                                <el-option v-for="item in roleInfo.developResponsible" :label="item.label" :value="item.value" />
                            </el-select>
                            <div class="show" v-if="type">
                                <el-checkbox v-model="checked1">是否更新它的下级目录</el-checkbox>
                                <el-button type="info" plain :disabled="!checked1" @click="confirmOperation(CategoryForm.developPicId,1)">确认操作</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="主要图片负责人：" class="take">
                            <el-select v-model.number="CategoryForm.imgPicId" clearable @focus="getRelevant(2)">
                                <el-option v-for="item in roleInfo.imgResponsible" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <div class="show" v-if="type">
                                <el-checkbox v-model="checked2">是否更新它的下级目录</el-checkbox>
                                <el-button type="info" :disabled="!checked2" plain @click="confirmOperation(CategoryForm.imgPicId,2)">确认操作</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="主要编辑负责人：" class="take">
                            <el-select v-model.number="CategoryForm.editPicId" clearable @focus="getRelevant(3)">
                                <el-option v-for="item in roleInfo.editRsponsible" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <div class="show" v-if="type">
                                <el-checkbox v-model="checked3">是否更新它的下级目录</el-checkbox>
                                <el-button type="info" plain :disabled="!checked3" @click="confirmOperation(CategoryForm.editPicId,3)">确认操作</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="主要采购人：" class="take">
                            <el-select v-model.number="CategoryForm.purchasePicId" clearable @focus="getRelevant(4)">
                                <el-option v-for="item in roleInfo.procurementRsponsible" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <div class="show" v-if="type">
                                <el-checkbox v-model="checked4">是否更新它的下级目录</el-checkbox>
                                <el-button type="info" plain :disabled="!checked4" @click="confirmOperation(CategoryForm.purchasePicId,4)">确认操作</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="主要财务负责人：" class="take">
                            <el-select v-model.number="CategoryForm.financePicId" clearable @focus="getRelevant(5)">
                                <el-option v-for="item in roleInfo.financeRsponsible" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <div class="show" v-if="type">
                                <el-checkbox v-model="checked5">是否更新它的下级目录</el-checkbox>
                                <el-button type="info" plain :disabled="!checked5" @click="confirmOperation(CategoryForm.financePicId,5)">确认操作</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="类目描述：" class="textarea">
                            <el-input type="textarea" v-model="CategoryForm.cateDesc" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="SEO标题：" class="textarea">
                            <el-input type="textarea" v-model="CategoryForm.seoTitle" clearable />
                        </el-form-item>
                        <el-form-item label="SEO关键词：" class="textarea">
                            <el-input type="textarea" v-model="CategoryForm.seoKeyword" clearable />
                        </el-form-item>
                        <!-- {{CategoryForm.platformCategoryList}} -->
                        <el-form-item label="选择映射平台：" class="map" prop="platformCategoryList" :rules="{required: true, message: '平台不能为空', trigger: 'change'}">
                            <div class="mapbg">
                                <el-checkbox-group v-model="CategoryForm.platformCategoryList">
                                    <el-checkbox-button :disabled="sourceType=='Default'" v-for="item in platformList" :label="item" style="margin:0 15px 10px;">
                                        <img :src="item.logo" width="120" height="75" />
                                    </el-checkbox-button>
                                </el-checkbox-group>
                                <i class="hint" />
                            </div>
                        </el-form-item>
                        <!-- {{CategoryForm.userSelectSite}} -->
                        <template v-for="(item,index) in userCategorylist" v-if="userCategorylist.length">
                            <el-form-item :prop="'userSelectSite.' + index+ '.site'" :label="item.platformName + '类目映射'" :rules="{required: true, message: '站点不能为空', trigger: 'change'}">
                                <el-checkbox-group v-model="CategoryForm.userSelectSite[index].site">
                                    <el-checkbox-button :disabled="sourceType=='Default'" v-for="curItem in item.siteList" :label="curItem">{{curItem.siteNameZh}}</el-checkbox-button>
                                </el-checkbox-group>
                            </el-form-item>
                        </template>
                    </el-form>
                    <!-- {{CategoryForm.userSelectSite}} -->
                    <template v-for="(item,index) in CategoryForm.userSelectSite" v-if="item.site.length">
                        <el-table :data="item.site" border style="width: 85%;margin:15px 0 30px 125px;">
                            <el-table-column prop="siteNameZh" label="国家" width="82" align="center" />
                            <el-table-column prop="type" :label="item.platformName+'类型'" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" align="center" width="220">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" :disabled="sourceType=='Default'?true:false" @click="selectPlatform(scope.row.siteId,scope.row.platformId)">选择{{scope.row.platformName}}类型</el-button>
                                    <el-button type="text" size="small" :disabled="sourceType=='Default'?true:false" @click="empty(scope.row.siteId,index,scope.$index)">清空</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-button style="width:200px;" type="primary" @click="submitPlatform('CategoryForm')">保 存</el-button>
                </div>
            </el-dialog>
            <!-- 选择相关类目弹框 -->
            <el-dialog width="683px" title="选择类目" :visible.sync="category_selection" class="selectTreeDialog">
                <div style="height:380px;overflow-y: auto;">
                    <p style="width:320px;margin:10px 0;display:flex">
                        <el-input size="medium" v-model.trim="treeName" clearable>
                            <!-- <el-button slot="append" icon="el-icon-search" @click="selectPlatformtree"></el-button> -->
                        </el-input>
                        <el-button type="primary" size="medium" @click="selectPlatformtree(1)" style="margin-left:10px;">搜 索</el-button>
                    </p>
                    <SyncCascader v-if="!treeName" ref="platformTree" v-model="userPTList" :props="PTprops" :load="loadTree" size="medium" />

                    <template v-if="treeName && platformTreeList.length">
                        <el-table :data="platformTreeList" stripe style="width: 100%" :show-header="false">
                            <el-table-column width="90">
                                <template slot-scope="scope">
                                    <el-button size="mini" :disabled="!scope.row.haveTemplate" @click="selectTree(scope.row.categoryPath,scope.row.platformCategoryId)">选择</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <p>{{scope.row.categoryName}}</p>
                                    <p>{{scope.row.categoryPath}}</p>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            style="text-align: center;position: absolute;left: 0;right: 0;bottom: 20px;"
                            border
                            @current-change="handleCurrentChangeTree"
                            :current-page="currentPageTree"
                            :page-size="20"
                            layout="total, prev, pager, next"
                            :total="totalTree"
                        ></el-pagination>
                    </template>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;" v-if="!treeName">
                    <el-button style="width:200px;" type="primary" @click="usercategory()">确 定</el-button>
                </div>
            </el-dialog>
            <!--  -->
        </div>
        <!--操作 -->
        <!-- 差异 -->
        <div class="difference">
            <el-dialog title="产品信息变体差异值设置" :visible.sync="differenceDialog" width="1086px">
                <div class="difference_content">
                    <div class="left">
                        <h3>字段列表{{`（${fieldsList.length}）`}}</h3>
                        <el-table border ref="table" :data="fieldsList" height="465" @selection-change="allfieldsList">
                            <el-table-column property="propertySort" label="序号" width="80" />
                            <el-table-column property="propertyName" label="名称"></el-table-column>
                            <el-table-column type="selection" width="55" :selectable="checkSelectable"></el-table-column>
                        </el-table>
                    </div>
                    <div class="right">
                        <h3>
                            <span>已选中变体差异字段 {{`（${userFieldsList.length}）`}}</span>
                        </h3>
                        <el-table border :data="userFieldsList" height="465">
                            <el-table-column property="propertySort" label="序号" width="80"></el-table-column>
                            <el-table-column property="propertyName" label="名称" width="220"></el-table-column>
                            <el-table-column label="操作" width="300">
                                <template slot-scope="scope">
                                    <el-button class="btn" v-if="scope.$index" type="text" ref="up" @click="moveFieldsList(true,scope.$index,scope.row)">上移</el-button>
                                    <el-button class="btn" v-if="!(userFieldsList.length-1==scope.$index)" type="text" ref="down" @click="moveFieldsList(false,scope.$index)">下移</el-button>
                                    <el-button v-if="scope.row.setVariantsFlag" class="btn" type="text" @click="delFieldsList(scope.$index,scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-button style="width:200px;" type="primary" @click="accessFieldsList">保 存</el-button>
                </div>
            </el-dialog>
        </div>
        <!--扩展弹框 -->
        <div class="extend">
            <el-dialog title="扩展属性设置" :visible.sync="extendDialog" width="520px">
                <div class="extend_content">
                    <div style="line-height:40px;">
                        <span class="title1">选择属性：</span>
                        <el-checkbox-group v-model="extend_checkList" style="position: relative;">
                            <el-checkbox v-for="item in attributeList" :label="item">
                                {{item.propertyName}}
                                <i @click.stop.prevent="delitem(item,1)" v-if="item.propertySourceType !=='Default'" class="el-icon-circle-close-outline" style="color:#ff6a6a;position:absolute;right: -16px;top: 3px;" />
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div style="display:flex;">
                        <span class="title1">自定义属性：</span>
                        <el-input type="text" v-model.trim="extendedName" clearable>
                            <el-button slot="append" @click="affirmBtn(1)" :loading="setExtendInfo.addloading">添加</el-button>
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-button style="width:200px;" type="primary" @click="save(1)" :loading="setExtendInfo.saveloading">保 存</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 变体值设置  -->
        <div>
            <el-dialog title="变体值设置" :visible.sync="setVariantDialog" :class="{'product_add': categoryId != null}" :show-close="categoryId == null" :fullscreen="categoryId != null" :modal="categoryId == null" width="520px">
                <div slot="title" v-if="categoryId != null">&nbsp;</div>
                <div class="setBox">
                    <p>选择变体值：</p>
                    <div class="setVariantWarp">
                        <span class="text">选择值：</span>
                        <p>
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox v-for="item in attributeList" :label="item" style="position: relative;">
                                    <template>
                                        {{item.propertyName}}
                                        <i @click.stop.prevent="delitem(item,2)" v-if="item.propertySourceType !=='Default'" class="el-icon-circle-close-outline" style="color:#ff6a6a;position:absolute;right: -16px;top: 3px;" />
                                    </template>
                                </el-checkbox>
                            </el-checkbox-group>
                        </p>
                    </div>
                    <div class="setVariantWarp">
                        <span class="text">自定义值：</span>
                        <p>
                            <el-input type="text" v-model="propertyName" clearable>
                                <el-button slot="append" @click="affirmBtn(0)" :loading="setVariantInfo.addloading">添加</el-button>
                            </el-input>
                        </p>
                    </div>
                </div>
                <div class="setBox">
                    <p>设置图片路径：</p>
                    <div class="setVariantWarp">
                        <span class="text">已选值：</span>
                        <p style="display:flex;flex-wrap:wrap;padding-left: 35px;">
                            <template v-for="(item,index) in uservalueList">
                                <el-checkbox v-model="item.checked" style="margin-right: 10px;">{{item.propertyName}}</el-checkbox>
                                <el-select v-if="item.checked" :value="item.imgPathLevel==0?item.imgPathLevel=null:item.imgPathLevel" @change="lockHierarchy(index)" size="mini" style="width: 130px;margin:0 10px;">
                                    <el-option v-for="item in hierarchyList" :label="item.label" :value="item.value" :disabled="item.disabled" />
                                </el-select>
                            </template>
                        </p>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-button :size="categoryId != null ? 'small' : null" style="width:200px;" type="primary" @click="save(0)" :loading="setVariantInfo.saveloading">保 存</el-button>
                </div>
            </el-dialog>
        </div>
        <!--  -->
        <!-- 活跃度设置 -->
        <div class="activity">
            <el-dialog title="类目活跃度规则设置" :visible.sync="livenessDialog" width="1086px">
                <div class="liveness-body">
                    <ul>
                        <li>
                            <el-form :inline="true" class="demo-form-inline" size="medium">
                                <el-form-item label="最近">
                                    <el-select v-model="setActivitiesList[0] && setActivitiesList[0].saleLatterDay">
                                        <el-option :label="item.week" :value="item.day" v-for="item in saleLatterDayList" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="销量区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[0] && setActivitiesList[0].saleStartCount" :min="0" :max="setActivitiesList[0] && setActivitiesList[0].saleEndCount" />
                                    <span>个</span>
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[0] && setActivitiesList[0].saleEndCount"
                                        :min="setActivitiesList[0] && setActivitiesList[0].saleStartCount"
                                        :max="setActivitiesList[0] && setActivitiesList[0].saleEndCount"
                                    />
                                    <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                                </el-form-item>
                                <el-form-item label="呆滞库龄区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[0] && setActivitiesList[0].delayStartDay" :min="0" :max="setActivitiesList[0] && setActivitiesList[0].delayEndDay" />
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[0] && setActivitiesList[0].delayEndDay"
                                        :min="setActivitiesList[0] && setActivitiesList[0].delayStartDay"
                                        :max="setActivitiesList[0] && setActivitiesList[0].delayEndDay"
                                    />天&nbsp;定义为
                                    <span class="highlight">{{setActivitiesList[0] && setActivitiesList[0].activeName}}</span>
                                </el-form-item>
                            </el-form>
                        </li>
                        <li>
                            <el-form :inline="true" class="demo-form-inline" size="medium">
                                <el-form-item label="最近">
                                    <el-select v-model="setActivitiesList[1] && setActivitiesList[2].saleLatterDay">
                                        <el-option :label="item.week" :value="item.day" v-for="item in saleLatterDayList" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="销量区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[1] && setActivitiesList[1].saleStartCount" :min="0" :max="setActivitiesList[1] && setActivitiesList[1].saleEndCount" />
                                    <span>个</span>
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[1] && setActivitiesList[1].saleEndCount"
                                        :min="setActivitiesList[1] && setActivitiesList[1].saleStartCount"
                                        :max="setActivitiesList[1] && setActivitiesList[1].saleEndCount"
                                    />
                                    <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                                </el-form-item>
                                <el-form-item label="呆滞库龄区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[1] && setActivitiesList[1].delayStartDay" :min="0" :max="setActivitiesList[1] && setActivitiesList[1].delayEndDay" />
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[1] && setActivitiesList[1].delayEndDay"
                                        :min="setActivitiesList[1] && setActivitiesList[1].delayStartDay"
                                        :max="setActivitiesList[1] && setActivitiesList[1].delayEndDay"
                                    />天&nbsp;定义为
                                    <span class="highlight">{{setActivitiesList[1] && setActivitiesList[1].activeName}}</span>
                                </el-form-item>
                            </el-form>
                        </li>
                        <li>
                            <el-form :inline="true" class="demo-form-inline" size="medium">
                                <el-form-item label="最近">
                                    <el-select v-model="setActivitiesList[2] && setActivitiesList[2].saleLatterDay">
                                        <el-option :label="item.week" :value="item.day" v-for="item in saleLatterDayList" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="销量区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[2] && setActivitiesList[2].saleStartCount" :min="0" :max="setActivitiesList[2] && setActivitiesList[2].saleEndCount" />
                                    <span>个</span>
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[2] && setActivitiesList[2].saleEndCount"
                                        :min="setActivitiesList[2] && setActivitiesList[2].saleStartCount"
                                        :max="setActivitiesList[2] && setActivitiesList[2].saleEndCount"
                                    />
                                    <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                                </el-form-item>
                                <el-form-item label="呆滞库龄区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[2] && setActivitiesList[2].delayStartDay" :min="0" :max="setActivitiesList[2] && setActivitiesList[2].delayEndDay" />
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[2] && setActivitiesList[2].delayEndDay"
                                        :min="setActivitiesList[2] && setActivitiesList[2].delayStartDay"
                                        :max="setActivitiesList[2] && setActivitiesList[2].delayEndDay"
                                    />天&nbsp;定义为
                                    <span class="highlight">{{setActivitiesList[2] && setActivitiesList[2].activeName}}</span>
                                </el-form-item>
                            </el-form>
                        </li>
                        <li>
                            <el-form :inline="true" class="demo-form-inline" size="medium">
                                <el-form-item label="销量区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[3] && setActivitiesList[3].saleStartCount" :min="0" :max="setActivitiesList[3] && setActivitiesList[3].saleEndCount" />
                                    <span>个</span>
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[3] && setActivitiesList[3].saleEndCount"
                                        :min="setActivitiesList[3] && setActivitiesList[3].saleStartCount"
                                        :max="setActivitiesList[3] && setActivitiesList[3].saleEndCount"
                                    />
                                    <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                                </el-form-item>
                                <el-form-item label="呆滞库龄区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[3] && setActivitiesList[3].delayStartDay" :min="0" :max="setActivitiesList[3] && setActivitiesList[3].delayEndDay" />天
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[3] && setActivitiesList[3].delayEndDay"
                                        :min="setActivitiesList[3] && setActivitiesList[3].delayStartDay"
                                        :max="setActivitiesList[3] && setActivitiesList[3].delayEndDay"
                                    />天&nbsp;
                                </el-form-item>
                                <el-form-item label="或 全仓可售天数大于：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[3] && setActivitiesList[3].availableDaysOr" :min="1" />天&nbsp;定义为
                                    <span class="highlight">{{setActivitiesList[3] && setActivitiesList[3].activeName}}</span>
                                </el-form-item>
                            </el-form>
                        </li>
                        <li>
                            <el-form :inline="true" class="demo-form-inline" size="medium">
                                <el-form-item label="渠道SKU数量区间 从：">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[4] && setActivitiesList[4].channelStartSkuCount" :min="0" :max="setActivitiesList[4] && setActivitiesList[4].channelEndSkuCount" />
                                    <span>个</span>
                                </el-form-item>
                                <el-form-item label="到：">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[4] && setActivitiesList[4].channelEndSkuCount"
                                        :min="setActivitiesList[4] && setActivitiesList[4].channelStartSkuCount"
                                        :max="setActivitiesList[4] && setActivitiesList[4].channelEndSkuCount"
                                    />
                                    <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                                </el-form-item>
                                <el-form-item label="（且添加/开发/审核）：">
                                    <el-select v-model="setActivitiesList[4] && setActivitiesList[4].productStatus">
                                        <el-option :label="item.label" :value="item.val" v-for="item in optionsList" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="时间区间  从">
                                    <el-input-number controls-position="right" v-model="setActivitiesList[4] && setActivitiesList[4].saleStartDay" :min="0" :max="setActivitiesList[4] && setActivitiesList[4].saleEndDay" />天&nbsp;
                                </el-form-item>
                                <el-form-item label="到">
                                    <el-input-number
                                        controls-position="right"
                                        v-model="setActivitiesList[4] && setActivitiesList[4].saleEndDay"
                                        :min="setActivitiesList[4] && setActivitiesList[4].saleStartDay"
                                        :max="setActivitiesList[4] && setActivitiesList[4].saleEndDay"
                                    />天&nbsp;定义为
                                    <span class="highlight">{{setActivitiesList[3] && setActivitiesList[3].activeName}}</span>
                                </el-form-item>
                            </el-form>
                        </li>
                    </ul>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-button style="width:200px;" type="primary" @click="updatEactivity()">保 存</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 操作日志 -->
        <div>
            <el-dialog title="查看操作日志" :visible.sync="recordDialog" width="1086px">
                <div class="record-body">
                    <el-form :inline="true" class="demo-form-inline record_select" size="medium">
                        <el-form-item label="操作时间">
                            <el-date-picker size="small" v-model="recordForm.time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                        </el-form-item>
                        <el-form-item label="操作内容：">
                            <el-input v-model.trim="recordForm.logDesc" clearable />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onRecordSelect()" icon="el-icon-search">搜 索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="recordList" border style="width: 100%" height="420">
                        <el-table-column prop="createTime" label="操作时间" width="187" align="center" />
                        <el-table-column prop="creator" label="操作人" width="160" align="center" />
                        <el-table-column prop="logDesc" label="操作内容" align="center" />
                    </el-table>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-pagination
                        class="pagination1"
                        @size-change="recordSizeChange"
                        @current-change="recordCurrentChange"
                        :current-page="logcurpage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="logpagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="logtotal"
                    ></el-pagination>
                    <el-button style="width:200px;" type="primary" @click="recordDialog= false">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import CategoryTree from '../category-tree/category-tree.vue';
import { getData } from 'common/http';
import { BASE_URL, PERMS_URL, LOGIN_URL } from 'common/config';
import { _storage, showToast } from 'common/common';
import SyncCascader from '@/components/base/SyncCascader.vue';
// import AddEditsCategory from './AddEditsCategory'
const getQueryString = (name, p) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = decodeURIComponent(window.location.search.substr(1)).match(reg);
    if (p) {
        r = decodeURIComponent(parent.location.search.substr(1)).match(reg);
    }
    try {
        if (r != null) return JSON.parse(r[2]);
    } catch (error) {}
    return null;
};

export default {
    components: {
        CategoryTree,
        SyncCascader
        // AddEditsCategory
    },
    data() {
        let vm = this;
        return {
            noshowMain: false,
            logcurpage: 1,
            logpagesize: 10,
            logtotal: 0,
            loadTree(id) {
                id = id ? id[id.length - 1] : -1;
                return getData('CategoryPlatform/listChild', {
                    cateId: id,
                    siteId: vm.siteId
                }).then(res => {
                    if (res.data.code == 0) {
                        return res.data.cates.map(el => ({
                            ...el,
                            childs: el.childCount > 0 ? [] : null
                        }));
                    } else {
                        vm.$message.error(res.data.msg);
                    }
                });
            },

            breadcrumbList: [],
            loading: true,
            setExtendInfo: {
                addloading: false,
                saveloading: false
            },
            setVariantInfo: {
                addloading: false,
                saveloading: false
            },
            treeName: '',
            platformId: null,
            currentPageTree: 1,
            platformTreeList: [],
            totalTree: null,
            columns: [
                {
                    value: 'nameCn',
                    text: '类目名称',
                    width: '300px'
                },
                {
                    value: 'createTime',
                    text: '添加时间'
                },
                {
                    value: 'creatorName',
                    text: '添加人员'
                },
                {
                    value: 'lockFlag',
                    text: '锁定状态'
                }
            ],

            activeNames: ['1'],
            relevantList: [], //相关负责人列表
            roleInfo: {
                developResponsible: [],
                imgResponsible: [],
                editRsponsible: [],
                procurementRsponsible: [],
                financeRsponsible: []
            },
            optionsList: [
                {
                    label: '添加',
                    val: 1
                },
                {
                    label: '开发',
                    val: 2
                },
                {
                    label: '审核',
                    val: 3
                }
            ],
            saleLatterDayList: [
                {
                    week: '一周',
                    day: 7
                },
                {
                    week: '二周',
                    day: 14
                },
                {
                    week: '三周',
                    day: 21
                },
                {
                    week: '四周',
                    day: 28
                },
                {
                    week: '五周',
                    day: 35
                }
            ],
            uploadTemplateUrl: BASE_URL + '/CategoryM/upload',
            headers: {
                token: _storage._get('local', 'token')
            },
            file: {},
            fileList: [],
            setActivitiesList: [],
            fieldsList: [],
            userFieldsList: [],
            checked1: false,
            checked2: false,
            checked3: false,
            checked4: false,
            checked5: false,
            //=>基础
            title: '',
            recordList: [], //操作日志
            props: {
                value: 'categoryId', //
                label: 'nameCn',
                children: 'childs'
            },
            PTprops: {
                value: 'platformCategoryId',
                label: 'categoryName',
                children: 'childs',
                enabled: 'haveTemplate'
            },
            PTList: [], //平台类目列表
            categoryList: [], //基础类目树列表
            platformList: [], //站点列表
            type: '', //判断点击是编辑还是添加
            userCategorylist: [], //选择的类目映射
            stateSiteList: [], //站点对应的国家列表

            extend_checkList: [], //扩展弹框选项
            checked: false,
            categoryId: '', //编辑时记录的类目ID
            attributeList: [], //扩展属性和变体属性列表

            hierarchyList: [
                {
                    //变体设置层级列表
                    label: '一级',
                    value: 1,
                    disabled: false
                },
                {
                    label: '二级',
                    value: 2,
                    disabled: false
                },
                {
                    label: '三级',
                    value: 3,
                    disabled: false
                }
            ],
            from_product: false,
            //onOff:true,//平台列表开关
            //弹框
            category_selection: false, // 选择类目
            livenessDialog: false, //活跃度设置
            recordDialog: false, //操作日志
            differenceDialog: false, //差异弹框
            setVariantDialog: false, //设置变体
            addDialog: false, // 编辑及添加
            extendDialog: false, //扩展
            //=>
            userPTList: [], //用户选中的平台类目
            checkList: [], //设置变体弹框选择的
            CategoryForm: {
                //编辑添加类目
                parentId: [],
                nameEn: '',
                nameCn: '',
                relatedCateId: [],
                customsCode: '',
                sortNumber: '',
                developPicId: '',
                imgPicId: '',
                editPicId: '',
                purchasePicId: '',
                financePicId: '',
                cateDesc: '',
                seoTitle: '',
                seoKeyword: '',
                lockFlag: 0,
                platformCategoryList: [],
                userSelectSite: []
            },
            sourceType: '',
            parentId: '',
            select: {
                //搜索
                keyword: '',
                timeArr: []
            },
            propertyName: '', //
            extendedName: '',
            uservalueList: [],
            lockHierarchyObj: [],
            recordForm: {
                //日志搜索
                startDate: '',
                endDate: '',
                logDesc: '',
                time: []
            },
            allfieldsArr: [],
            /**/
            siteId: ''
        };
    },
    created() {
        let categoryId = getQueryString('categoryId');
        if (categoryId != null) {
            this.noshowMain = true
        }
    },
    mounted() {
        this.getCategoryList();
        this.getPlatformLists();

        let categoryId = getQueryString('categoryId');
        this.categoryId = categoryId
        
        this.fromBase = getQueryString('base');
        if (categoryId) {
            this.from_product = true;
            this.set_variant(categoryId);
            this.setVariantDialog = true;
        }
        if (this.fromBase) {
            this.addDialog = true;
        }
    },
    watch: {
        'CategoryForm.platformCategoryList'(val, nval) {
            let vm = this;
            this.userCategorylist = val.map((item, index) => {
                return {
                    platformName: item.platformName,
                    platformId: item.platformId,
                    siteList: item.siteList.map((citem, cindex) => {
                        return {
                            siteNameZh: citem.siteNameZh,
                            siteId: citem.siteId,
                            platformName: item.platformName,
                            platformId: item.platformId,
                            type: '',
                            typeId: ''
                        };
                    })
                };
            });

            this.CategoryForm.userSelectSite = val.map((item, index) => {
                let obj = this.CategoryForm.userSelectSite[index];
                let arr = [];
                if (obj) {
                    let site = obj.site;
                    site.forEach((st, sindex) => {
                        let el = this.userCategorylist[index].siteList.find(
                            el => el.siteId === st.siteId
                        );
                        if (el) {
                            el.type = site[sindex].type;
                            el.typeId = site[sindex].typeId;
                            arr.push(el);
                        }
                    });
                }
                return {
                    platformName: item.platformName,
                    site: arr
                };
            });
        },
        //选中的变体属性（上）
        checkList(val) {
            this.uservalueList = val;
            this.uservalueList.forEach((item, index, arr) => {
                if (item.imgPathFlag) {
                    this.$set(item, 'checked', true);
                } else {
                    this.$set(item, 'checked', false);
                }
                if (item.imgPathLevel) {
                    this.$set(item, 'hierarchy', item.imgPathLevel);
                } else {
                    this.$set(item, 'hierarchy', '');
                }
            });
        },
        lockHierarchyObj(val) {
            [...val].forEach(item => {
                this.hierarchyList.forEach(curitem => {
                    if (item == curitem.value) {
                        curitem.disabled = true;
                    }
                });
            });
        }
    },
    methods: {
        goTempSet(categoryId) {
            localStorage.removeItem('cur_category_platform');
            this.$router.push({
                name: 'templateManagement',
                categoryId
            });
        },
        selectTree(name, id) {
            console.log(this.userCategorylist);
            this.userCategorylist.forEach(i => {
                i.siteList.forEach((j, index) => {
                    if (this.siteId == j.siteId) {
                        this.$set(j, 'type', name);
                        this.$set(j, 'typeId', id);
                    }
                });
            });
            this.category_selection = false;
        },
        //
        handleCurrentChangeTree(val) {
            this.currentPageTree = val;
            this.selectPlatformtree(0);
        },
        //平台类目搜索
        selectPlatformtree(val) {
            let params = {
                siteId: this.siteId,
                name: this.treeName,
                platformId: this.platformId,
                pageSize: 20,
                pageNumber: val ? 1 : this.currentPageTree
            };
            getData('CategoryPlatform/searchPath', params).then(res => {
                if (res.data.code == 0) {
                    this.totalTree = res.data.list.total;
                    this.currentPageTree = res.data.list.pageNo;
                    let data = res.data.list.rows;
                    data.forEach(item => {
                        item.categoryPath = item.categoryPath.replace(
                            /:/g,
                            ' >> '
                        );
                    });
                    this.platformTreeList = data;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },

        //新增下級類目
        addCategoryNext(categoryId) {
            this.edit_category(0, categoryId);
        },
        //删除自定义的变体值
        delitem(item, propertyType) {
            getData('CatePropertyM/remove', {
                catePropertyId: item.categoryPropertyId
            }).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.getListByCateIdAndPropType({
                        propertyType,
                        categoryId: item.categoryId
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },

        //上传之前
        beforeUploadTemp(file) {
            this.file['file'] = file;
        },
        //导入模板失败
        tolead_error(err, file, fileList) {
            console.log(err);
        },
        //导入模板success
        tolead_success(response, file, fileList) {
            console.log(response);
            if (response.code == 0) {
                this.$message({
                    type: 'success',
                    message: response.msg
                });
                this.getCategoryList();
            } else {
                this.$message.error(response.msg);
            }
        },
        //下载模板
        ontempalate() {
            getData('CategoryM/download').then(res => {
                if (res.data.code == 0) {
                    window.location.href = res.data.path;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //更新活动数据
        updatEactivity() {
            getData('CateProActiveRule/update', this.setActivitiesList).then(
                res => {
                    if (res.data.code == 0) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.livenessDialog = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }
            );
        },
        //获取活动设置数据
        setEvent(categoryId) {
            this.livenessDialog = true;
            getData('CateProActiveRule/info', {
                categoryId
            }).then(res => {
                if (res.data.code == 0) {
                    this.setActivitiesList = res.data.rows;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //类目删除
        delCategory(categoryId) {
            this.$confirm('此操作将删除该类目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                getData('CategoryM/remove', {
                    categoryId
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCategoryList();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            });
        },
        //操作日志分页
        recordSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.logpagesize = val;

            let params = {
                startDate:
                    Array.isArray(this.recordForm.time) &&
                    this.recordForm.time.length
                        ? this.recordForm.time[0]
                        : '',
                endDate:
                    Array.isArray(this.recordForm.time) &&
                    this.recordForm.time.length
                        ? this.recordForm.time[1]
                        : '',
                logDesc: this.recordForm.logDesc,
                pageSize: val,
                pageNumber: this.logcurpage
            };
            this.record(
                params.startDate,
                params.endDate,
                params.logDesc,
                params.pageSize,
                params.pageNumber
            );
        },
        recordCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.logcurpage = val;
            let params = {
                startDate:
                    Array.isArray(this.recordForm.time) &&
                    this.recordForm.time.length
                        ? this.recordForm.time[0]
                        : '',
                endDate:
                    Array.isArray(this.recordForm.time) &&
                    this.recordForm.time.length
                        ? this.recordForm.time[1]
                        : '',
                logDesc: this.recordForm.logDesc,
                pageSize: this.logpagesize,
                pageNumber: val
            };
            this.record(
                params.startDate,
                params.endDate,
                params.logDesc,
                params.pageSize,
                params.pageNumber
            );
        },
        //操作日志搜索
        onRecordSelect(type) {
            this.record(
                this.recordForm.startDate,
                this.recordForm.endDate,
                this.recordForm.logDesc
            );
        },
        //查看操作日志
        record(
            startDate = '',
            endDate = '',
            logDesc = '',
            pageSize = 10,
            pageNumber = 1
        ) {
            this.recordDialog = true;

            if (
                Array.isArray(this.recordForm.time) &&
                this.recordForm.time.length
            ) {
                startDate = this.recordForm.time[0];
            }
            if (
                Array.isArray(this.recordForm.time) &&
                this.recordForm.time.length
            ) {
                endDate = this.recordForm.time[1];
            }
            let params = {
                sortOrder: 'asc',
                pageSize,
                pageNumber,
                startDate,
                endDate,
                logDesc
            };
            getData('CategoryLogM/list', params).then(res => {
                if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                    return;
                }
                this.logcurpage = res.data.pageNo;
                this.logpagesize = res.data.pageSize;
                this.logtotal = res.data.total;
                this.recordList = res.data.rows;
            });
        },
        //差异字段上移下移
        moveFieldsList(type, index, item) {
            //上移
            if (type) {
                if (!index) {
                    console.log('到顶了');
                } else {
                    this.userFieldsList.splice(
                        index - 1,
                        0,
                        this.userFieldsList[index]
                    );
                    this.userFieldsList.splice(index + 1, 1);
                }
                //下移
            } else {
                if (this.userFieldsList.length - 1 == index) {
                    console.log('最后一个');
                } else {
                    this.userFieldsList.splice(
                        index + 2,
                        0,
                        this.userFieldsList[index]
                    );
                    this.userFieldsList.splice(index, 1);
                }
            }
        },
        //全部选中差异字段
        allfieldsList(val) {
            this.allfieldsArr = val;
            this.userFieldsList = val;
        },
        //差异字段列表保存
        accessFieldsList() {
            let params = {
                baseProPropId: this.userFieldsList.map(item => item.id),
                categoryId: this.categoryId
            };
            getData('BasePropertySetM/batchSave', params).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.differenceDialog = false;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        checkSelectable(row) {
            return row.setVariantsFlag == true ? true : false;
        },
        //差异字段删除
        delFieldsList(index, id) {
            //右边的
            this.userFieldsList.splice(index, 1);
            this.fieldsList.forEach((item, jindex) => {
                if (item.id == id) {
                    this.allfieldsArr.splice(jindex, 1);
                    let delindex = this.fieldsList.findIndex(i => i.id == id);
                    this.$refs.table.toggleRowSelection(
                        this.fieldsList[delindex],
                        false
                    );
                }
            });
        },
        //获取差异字段列表
        operateDifference(categoryId) {
            this.differenceDialog = true;
            this.categoryId = categoryId;
            // this.allfieldsArr = [];
            getData('BasePropertySetM/getListForSetVariants', {
                categoryId
            }).then(res => {
                if (res.data.code == 0) {
                    //左边
                    let left = res.data.rows.left;
                    let right = res.data.rows.right;
                    this.fieldsList = [...left];
                    this.userFieldsList = [...right];
                    let vm = this;
                    vm.$nextTick(() => {
                        right.map(item => {
                            let curIndex = vm.fieldsList.findIndex(
                                curItem => item.id == curItem.id
                            );
                            vm.$refs.table.toggleRowSelection(
                                vm.fieldsList[curIndex],
                                true
                            );
                        });
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //变体设置锁定属性层级
        lockHierarchy() {
            // let s = new Set()
            // this.hierarchyList.forEach((item, uindex) => {
            //     this.uservalueList.forEach((curitem, curindex) => {
            //         if (item.value == curitem.hierarchy) {
            //             s.add(item.value)
            //         } else {
            //             item.disabled = false;
            //         }
            //     })
            // })
            // this.lockHierarchyObj = s
        },
        //更新下级目录
        confirmOperation(principalId, principalType) {
            if (principalId) {
                let params = {
                    principalId: Number(principalId),
                    principalType,
                    categoryId: this.categoryId
                };
                getData('CategoryM/updatePrincipal', params).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            } else {
                this.$message({
                    showClose: true,
                    message: '请先选择相关负责人',
                    type: 'warning'
                });
            }
        },
        addAndUpdate(url, params) {
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    if (this.fromBase) {
                        top.vm.$children[0].$refs.modalContent.ok();
                    }

                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getCategoryList();
                    this.addDialog = false;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //添加/编辑产品类目保存
        submitPlatform(formName) {
            let _this = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let platformCategoryList = [];

                    this.CategoryForm.userSelectSite.forEach(item => {
                        let arr = item.site.map(j => j.typeId);
                        platformCategoryList = platformCategoryList.concat(
                            [],
                            arr
                        );
                    });
                    let params = {
                        categoryM: {
                            parentId: this.CategoryForm.parentId.length
                                ? this.CategoryForm.parentId[
                                      this.CategoryForm.parentId.length - 1
                                  ]
                                : 1,
                            nameEn: this.CategoryForm.nameEn,
                            nameCn: this.CategoryForm.nameCn,
                            relatedCateId: this.CategoryForm.relatedCateId
                                .length
                                ? this.CategoryForm.relatedCateId[
                                      this.CategoryForm.relatedCateId.length - 1
                                  ]
                                : null,
                            customsCode: this.CategoryForm.customsCode,
                            sortNumber: this.CategoryForm.sortNumber,
                            developPicId: this.CategoryForm.developPicId,
                            imgPicId: this.CategoryForm.imgPicId,
                            editPicId: this.CategoryForm.editPicId,
                            purchasePicId: this.CategoryForm.purchasePicId,
                            financePicId: this.CategoryForm.financePicId,
                            cateDesc: this.CategoryForm.cateDesc,
                            seoTitle: this.CategoryForm.seoTitle,
                            seoKeyword: this.CategoryForm.seoKeyword,
                            lockFlag: this.CategoryForm.lockFlag
                        },
                        platformCategoryList,
                        sourceType: 'Merchant'
                    };
                    //判断选择的站点是否选择了平台类目
                    if (platformCategoryList.every(item => item !== '')) {
                        //编辑保存
                        if (this.type) {
                            params.sourceType = _this.sourceType;
                            params.categoryM['categoryMId'] = _this.categoryId;

                            _this.addAndUpdate('CategoryM/update', params);
                            //添加保存
                        } else {
                            this.addAndUpdate('CategoryM/save', params);
                        }
                    } else {
                        this.$message.warning('请选择平台类目对应的类型');
                    }
                } else {
                    this.$message.warning('请填写完整再保存');
                    return false;
                }
            });
        },

        // 选择平台类目
        selectPlatform(siteId, platformId) {
            console.log(siteId, platformId);
            this.category_selection = true;
            this.siteId = siteId;
            this.platformId = platformId;
            this.treeName = null;
            this.platformTreeList = [];
            this.userPTList = [];
            this.$nextTick(() => {
                this.$refs.platformTree.resetData();
            });
        },
        //选择类目弹框后确定
        usercategory() {
            if (!this.userPTList.length) {
                this.$message.warning('请先选择类目');
                return;
            }
            var name = this.$refs.platformTree.getName();
            var str = name.join('/');
            var typeId = this.userPTList[this.userPTList.length - 1];
            this.userCategorylist.forEach(i => {
                i.siteList.forEach((j, index) => {
                    if (this.siteId == j.siteId) {
                        this.$set(j, 'type', str);
                        this.$set(j, 'typeId', typeId);
                    }
                });
            });
            this.category_selection = false;
        },
        //清空
        empty(siteId, index, pindex) {
            this.CategoryForm.userSelectSite[index].site[pindex].type = '';
            this.CategoryForm.userSelectSite[index].site[pindex].typeId = '';
        },
        //获取平台列表
        getPlatformLists() {
            getData('platform/list/platform/site').then(res => {
                let data = res.data.rows;
                let obj = {};
                let newObj = null;
                data.forEach((item, index) => {
                    let siteList = item.siteList;
                    for (let key in item) {
                        if (key == 'siteList') continue;
                        obj[key] = item[key];
                    }
                    if (siteList.length) {
                        siteList.forEach((curitem, curindex) => {
                            newObj = Object.assign({}, curitem, obj);
                            siteList[curindex] = newObj;
                        });
                    }
                });
                this.platformList = data;
            });
        },
        //获取相关负责人列表
        getRelevant(type) {
            switch (type) {
                //开发
                case 1:
                    if (this.roleInfo.developResponsible.length) return;
                    fn([7, 2, 3, 4, 74], data => {
                        this.roleInfo.developResponsible = data;
                    });
                    break;
                //图片
                case 2:
                    if (this.roleInfo.imgResponsible.length) return;
                    fn([7, 2, 3, 4, 74], data => {
                        this.roleInfo.imgResponsible = data;
                    });
                    break;
                //编辑
                case 3:
                    if (this.roleInfo.editRsponsible.length) return;
                    fn([7, 2, 3, 4], data => {
                        this.roleInfo.editRsponsible = data;
                    });
                    break;
                //采购
                case 4:
                    if (this.roleInfo.procurementRsponsible.length) return;
                    fn([76], data => {
                        this.roleInfo.procurementRsponsible = data;
                    });
                    break;
                //财务
                case 5:
                    if (this.roleInfo.financeRsponsible.length) return;
                    fn([84], data => {
                        this.roleInfo.financeRsponsible = data;
                    });
                    break;
                default:
                    break;
            }
            function fn(rolesIds, callback) {
                getData(
                    'merchant/user/allList',
                    {
                        activateFlag: 1,
                        rolesIds
                    },
                    LOGIN_URL
                ).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data.map(i => {
                            return {
                                label: i.name,
                                value: i.id
                            };
                        });
                        callback && callback(data);
                    } else {
                        callback && callback([]);
                    }
                });
            }
        },
        //编辑店铺级添加
        edit_category(type, categoryId) {
            //type=1编辑 =0添加
            this.addDialog = true;
            this.type = type;
            //添加
            if (!type) {
                this.title = '新增产品类目';
                this.sourceType = null;
                for (let key in this.CategoryForm) {
                    if (key == 'parentId') {
                        this.CategoryForm[key] = [];
                        continue;
                    }
                    if (key == 'platformCategoryList') {
                        this.CategoryForm[key] = [];
                        continue;
                    }
                    if (key == 'relatedCateId') {
                        this.CategoryForm[key] = [];
                        continue;
                    }
                    if (key == 'lockFlag') {
                        this.CategoryForm[key] = 0;
                        continue;
                    }
                    this.CategoryForm[key] = null;
                }
                //新增下级时候
                if (
                    categoryId != null ||
                    (categoryId != undefined && categoryId.length)
                ) {
                    this.CategoryForm.parentId = categoryId;
                }
            }
            //编辑
            if (type) {
                this.title = '编辑产品类目';
                this.categoryId = categoryId;
                this.checked1 = false;
                this.checked2 = false;
                this.checked3 = false;
                this.checked4 = false;
                this.checked5 = false;
                //查询当前类目
                this.CategoryForm.platformCategoryList = [];
                this.queryCategoryInfo(categoryId);
            }
        },
        //根据类目id获取所有父级类目id
        getParentIds(cateId) {
            return getData('CategoryM/getPath', { cateId }).then(res => {
                if (res.data.code == 0) {
                    return res.data.ids;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //查询当前类目
        queryCategoryInfo(categoryId, callback) {
            getData('CategoryM/findByCategoryId', {
                CategoryId: categoryId
            }).then(res => {
                if (res.data.code == 0) {
                    let categoryInfo = { ...res.data.category };
                    this.sourceType = categoryInfo.sourceType;
                    this.parentId = categoryInfo.parentId;
                    // console.log("父级类目ID",this.parentId)
                    //编辑添加类目
                    categoryInfo.parentId == 1
                        ? []
                        : this.getParentIds(categoryInfo.parentId).then(val => {
                              this.CategoryForm.parentId = val;
                          });
                    categoryInfo.relatedCateId == null
                        ? []
                        : this.getParentIds(categoryInfo.relatedCateId).then(
                              val => {
                                  this.CategoryForm.relatedCateId = val;
                              }
                          );
                    this.CategoryForm.nameEn = categoryInfo.nameEn;
                    this.CategoryForm.nameCn = categoryInfo.nameCn;
                    this.CategoryForm.customsCode = categoryInfo.customsCode;
                    this.CategoryForm.sortNumber = categoryInfo.sortNumber;
                    this.CategoryForm.developPicId = categoryInfo.developPicId;
                    this.CategoryForm.imgPicId = categoryInfo.imgPicId;
                    this.CategoryForm.editPicId = categoryInfo.editPicId;
                    this.CategoryForm.purchasePicId =
                        categoryInfo.purchasePicId;
                    this.CategoryForm.financePicId = categoryInfo.financePicId;
                    this.CategoryForm.cateDesc = categoryInfo.cateDesc;
                    this.CategoryForm.seoTitle = categoryInfo.seoTitle;
                    this.CategoryForm.seoKeyword = categoryInfo.seoKeyword;
                    this.CategoryForm.lockFlag = categoryInfo.lockFlag ? 1 : 0;
                    //映射平台
                    // this.CategoryForm.platformCategoryList
                    if (
                        categoryInfo.platformCategoryList instanceof Array &&
                        categoryInfo.platformCategoryList.length
                    ) {
                        categoryInfo.platformCategoryList.forEach(
                            (i, index) => {
                                this.platformList.forEach(j => {
                                    if (i.platformId == j.platformId) {
                                        this.$set(
                                            this.CategoryForm
                                                .platformCategoryList,
                                            index,
                                            j
                                        );

                                        this.$nextTick(() => {
                                            this.userCategorylist.forEach(k => {
                                                var obj = k.siteList.find(
                                                    site =>
                                                        site.siteId == i.siteId
                                                );
                                                if (obj) {
                                                    obj.typeId =
                                                        i.plateformCateId;
                                                    obj.type = i.plateformCateDesc.replace(
                                                        /:/g,
                                                        ' >> '
                                                    );
                                                    this.CategoryForm.userSelectSite[
                                                        index
                                                    ].site.push(obj);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        );
                    }
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        //确认
        affirmBtn(type) {
            //扩展属性自定义确认
            if (type) {
                if (this.extendedName) {
                    this.setExtendInfo.addloading = true;
                    getData('CatePropertyM/createMProperty', {
                        categoryId: this.categoryId,
                        propertyName: this.extendedName,
                        propertyType: 1
                    }).then(res => {
                        this.setExtendInfo.addloading = false;
                        if (res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getListByCateIdAndPropType({
                                categoryId: this.categoryId,
                                propertyType: 1
                            });
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }
                //变体属性自定义确认
            } else {
                if (this.propertyName) {
                    this.setVariantInfo.addloading = true;
                    getData('CatePropertyM/createMProperty', {
                        categoryId: this.categoryId,
                        propertyName: this.propertyName,
                        propertyType: 2
                    }).then(res => {
                        this.setVariantInfo.addloading = false;
                        if (res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getListByCateIdAndPropType({
                                categoryId: this.categoryId,
                                propertyType: 2
                            });
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }
            }
        },
        //保存
        save(type) {
            //扩展
            if (type) {
                if (this.extend_checkList.length) {
                    this.setExtendInfo.saveloading = true;
                    let params = [];
                    params = this.attributeList.map(item => {
                        return {
                            propertySourceType: item.propertySourceType,
                            categoryPropertyId: item.categoryPropertyId,
                            flag: this.extend_checkList.find(
                                curItem =>
                                    curItem.categoryPropertyId ==
                                    item.categoryPropertyId
                            )
                                ? 1
                                : 0
                        };
                    });
                    params.push({
                        categoryId: this.categoryId
                    });
                    getData('CatePropertyM/updateExtended', params).then(
                        res => {
                            this.setExtendInfo.saveloading = false;
                            if (res.data.code == 0) {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.extendDialog = false;
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        }
                    );
                } else {
                    this.$message.error('请先选择扩展属性');
                }
                //变体
            } else {
                if (this.uservalueList.length) {
                    this.setVariantInfo.saveloading = true;
                    let arr = this.attributeList.map(item => {
                        return {
                            propertySourceType: item.propertySourceType, //是否默认
                            categoryPropertyId: item.categoryPropertyId, //属性id
                            variantsFlag: this.checkList.find(
                                i =>
                                    i.categoryPropertyId ==
                                    item.categoryPropertyId
                            )
                                ? 1
                                : 0, //item.variantsFlag, //变体是否选中
                            imgPathFlag: item.checked ? 1 : 0, //是否选中层及
                            imgPathLevel: 0 //层及等级
                        };
                    });

                    let params = this.uservalueList.map(item => {
                        return {
                            categoryPropertyId: item.categoryPropertyId,
                            imgPathLevel: Number(item.imgPathLevel)
                        };
                    });

                    arr.forEach((item, index) => {
                        params.forEach(curitem => {
                            if (
                                item.categoryPropertyId ==
                                curitem.categoryPropertyId
                            ) {
                                arr[index] = Object.assign({}, item, curitem);
                            }
                        });
                    });

                    if (arr.find(item => item.categoryId)) {
                        return;
                    } else {
                        arr.unshift({
                            categoryId: this.categoryId
                        });
                    }

                    getData('CatePropertyM/updateVariants', arr).then(res => {
                        this.setVariantInfo.saveloading = false;
                        if (res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.setVariantDialog = false;

                            if (this.from_product) {
                                showToast('success', res.data.msg);
                                top.vm.$children[0].$refs.modalContent.ok();
                            }
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }
            }
        },
        //设置变体
        set_variant(categoryId) {
            this.setVariantDialog = true;
            this.categoryId = categoryId;
            this.propertyName = '';
            this.uservalueList.length = 0;
            this.hierarchyList.forEach(item => {
                item.disabled = false;
            });

            //this.getListByCateIdAndPropType({categoryId,propertyType:2})
            this.getListByCateIdAndPropType({
                categoryId,
                propertyType: 2 //2为变体
            });
        },

        //扩展属性设置
        extend_attribute(categoryId) {
            this.extendDialog = true;
            this.categoryId = categoryId;
            this.extendedName = '';
            this.extend_checkList = [];

            this.getListByCateIdAndPropType({
                categoryId,
                propertyType: 1 //1为扩展属性
            });
        },
        //获取扩展属性或变体属性列表
        getListByCateIdAndPropType(params) {
            getData('CatePropertyM/listByCateIdAndPropType', params).then(
                res => {
                    if (res.data.code == 0) {
                        let data = res.data.rows;
                        this.attributeList = data;

                        this.extend_checkList = [];
                        this.checkList = [];
                        //扩展extend_checkList
                        data.forEach(item => {
                            if (item.editExtendedFlag == 1) {
                                this.extend_checkList.push(item);
                            }
                        });
                        //变体checkList
                        data.forEach(item => {
                            if (item.variantsFlag == 1) {
                                this.checkList.push(item);
                            }
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }
            );
        },
        selectInput(val) {
            if (!val.trim() && !this.select.startDate && !this.select.endDate) {
                this.getCategoryList();
            }
        },
        //搜索
        select_category() {
            this.loading = true;
            let params = {
                keyword: this.select.keyword
            };
            if (this.select.timeArr !== null && this.select.timeArr.length) {
                params = Object.assign({}, params, {
                    startDate: this.select.timeArr[0],
                    endDate: this.select.timeArr[1]
                });
            }
            this.getCategoryList(params);
        },
        //获取类目树列表
        getCategoryList(
            params = {
                keyword: ''
            }
        ) {
            getData('CategoryM/list', params).then(res => {
                this.loading = false;
                if (res.data.code == 0) {
                    if (
                        res.data.category == null ||
                        res.data.category == undefined
                    ) {
                        this.categoryList = [];
                        return;
                    }
                    let tree = res.data.category.childs;
                    if (tree instanceof Array) {
                        function recursion(arr) {
                            let len = arr.length;
                            for (let i = 0; i < len; i++) {
                                if (arr[i].childs.length) {
                                    recursion(arr[i].childs);
                                } else {
                                    delete arr[i].childs;
                                }
                            }
                            return arr;
                        }
                        this.categoryList = recursion(tree);
                    } else {
                        return;
                    }
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss">
@import '../../../../assets/style/style-scss/layout.scss';
.product_add {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        padding: 10px
    }
}
.searchBox {
    @include flex(row) padding: 10px 0;
    border-radius: 5px;
    background-color: rgba(242, 242, 242, 1);
    .line {
        line-height: 32px;
        margin: 0 10px;
    }
    .el-button {
        margin-left: 20px;
    }
}
.operationBox {
    display: flex;
    padding: 10px 0;
    .el-button {
        margin-right: 20px;
    }
    .el-upload__input {
        display: none;
    }
    .upload-demo {
        display: flex;
        .el-upload-list {
            height: 32px;
            display: flex;
            flex-direction: row;
            li {
                margin-right: 5px;
                margin-top: 0;
            }
        }
    }
}
//

//
.categoryBox {
    min-height: 686px;
    border-radius: 7px;
    border: 1px solid rgba(223, 223, 223, 1);
    .el-collapse {
        padding: 0 10px;
    }
    .tree_title {
        height: 40px;
        line-height: 40px;
        .el-col {
            text-align: center;
        }
    }
    .el-tree-node__content {
        height: 50px;
    }

    .btnLists {
        @include flex(row) justify-content: center;
        li {
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            color: #108ee9;
            width: 33px;
            height: 33px;
            line-height: 30px;
            border: 3px solid #108ee9;
            border-radius: 5px;
            margin-right: 10px;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .border {
            border: none;
        }
    }
    .el-table__expanded-cell[class*='cell'] {
        padding: 0;
    }
}

//添加弹框
.addForm {
    .el-form-item {
        width: 48%;
        margin-bottom: 20px;
    }
    .select {
        .el-cascader__label {
            width: 190px;
        }
    }
    .el-input__inner {
        width: 316px;
    }
    .take {
        width: 98%;
        display: flex;
        .el-form-item__content {
            display: flex;
            flex-direction: row;
        }
        .show {
            padding-left: 20px;
            .el-button {
                margin-left: 10px;
            }
        }
    }
    .textarea {
        width: 98%;
        display: flex;
        .el-form-item__content {
            width: 88%;
            .el-textarea__inner {
                height: 72px;
            }
        }
    }
    .bgnone {
        background: #fff;
    }
    .map {
        width: 98%;
        display: flex;
        .el-checkbox-button--medium .el-checkbox-button__inner {
            padding: 0;
            border: 0 solid #fff;
        }
        .el-checkbox-button.is-checked .el-checkbox-button__inner {
            padding: 0;
            border: 0 solid #fff;
            position: relative;
            background-color: #fff;
            &::after {
                content: url('../icon/check.png');
                position: absolute;
                left: 0;
                top: 0;
                width: 120px;
                height: 75px;
                background-color: rgba(0, 0, 0, 0.46);
            }
        }
        .el-form-item__content {
            width: 98%;
        }
        .mapbg {
            border: 1px solid #dcdfe6;
            width: 99%;
            padding: 10px 0;
            border-radius: 4px;
            margin-left: 10px;
            .hint {
                display: block;
                height: 20px;
                border-top: 1px solid #dcdfe6;
                background: url('../icon/hint.png') no-repeat center center;
            }
        }
    }
}
// 差异弹框
.difference_content {
    // @include flex(row);
    display: flex;
    flex-direction: row;
    height: 500px;
    overflow-y: auto;
    div {
        h3 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: #eee;
            height: 34px;
            line-height: 34px;
            padding: 0 10px;
            .delall {
                color: #409eff;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    .left {
        margin-right: 10px;
        width: 420px;
    }
    .right {
        flex: 1;
        .btn {
            margin-right: 10px;
            cursor: pointer;
            padding: 10px;
        }
    }
    .cell {
        text-align: center;
    }
}
//扩展属性设置弹框
.extend_content {
    div {
        &:first-child {
            @include flex(row);
        }
        .title1 {
            line-height: 40px;
            width: 100px;
            text-align: center;
        }
        .el-input {
            width: 300px;
        }
    }
}
//设置变体弹框
.setBox {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 2px;
    padding: 0 0 15px;
    margin-bottom: 5px;
    & > p {
        background: rgba(242, 242, 242, 1);
        padding: 10px;
    }
    .setVariantWarp {
        @include flex(row) &>span {
            line-height: 40px;
            margin-right: 3px;
        }
        .text {
            width: 100px;
            text-align: center;
        }
        p {
            line-height: 40px;
        }
    }
}
//活动弹框
.liveness-body {
    height: 500px;
    overflow-y: auto;
    .el-input-number--medium,
    .el-input__inner {
        width: 106px;
    }
    li {
        border-bottom: 1px dashed #c5c0c0;
        margin-top: 20px;
        &:first-child {
            margin-top: 0;
        }
        &:last-child {
            border-bottom: none;
        }
        .highlight {
            font-weight: 700;
            color: #0080c9;
            font-size: 16px;
        }
        .el-form-item {
            margin-bottom: 10px;
        }
    }
}
//操作记录
.record-body {
    height: 480px;
    overflow-y: auto;
    position: relative;
    .record_select {
        text-align: center;
    }
}
.pagination1 {
    position: absolute;
    bottom: 64px;
    right: 35px;
}
.selectTreeDialog {
    .el-dialog__body {
        padding: 30px 20px 60px;
    }
    
}
</style>
