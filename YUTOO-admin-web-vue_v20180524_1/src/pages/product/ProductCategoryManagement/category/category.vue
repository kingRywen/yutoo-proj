<template>
<div>
    <!--  -->
    <section class="searchBox">
        <span class="line">关键字：</span>
        <div style="width:320px;">
            <el-input v-model="select.keyword"/>
        </div>
        <span class="line">添加时间：</span>
        <el-date-picker type="datetime" v-model="select.startDate" value-format="yyyy-MM-dd HH:mm:ss"/>
        <em class="line">~</em>
        <el-date-picker type="datetime" v-model="select.endDate" value-format="yyyy-MM-dd HH:mm:ss"/>
        <el-button type="primary" @click="select_category">搜索</el-button>
    </section>
    <!--  -->
    <section class="operationBox">
        <el-button type="primary" @click="edit_category(0)">添加</el-button>
        <el-button type="primary">删除</el-button>
        <el-button type="primary">导入</el-button>
        <el-button type="primary" @click='recordDialog=true'>查看操作日志</el-button>
        <el-button type="primary">
            <router-link :to="{ name: 'record', params: {} }" tag='span'>导入记录</router-link>
        </el-button>
    </section>
    <!--  -->
    <section class="categoryBox">
        <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                  提示操作<i class="header-icon el-icon-info"></i>
                </template>
                <ul>
                    <li>? 点击类目名前“+”符号，显示当前类目的下级类目，直接点新增下级时，会自动带入父级信息</li>
                    <li>? 产品活跃度设置，设置该类别产品活跃度法人规则，</li>
                    <li>? 变体值设置，设置该类别对应的变体值，添加该类别产品时，产品变体符合设置的变体值，产品图片处会按一定规则生成文件夹，导出文件夹，在文件夹中存入相应图片导入，图片会自动和变体关联</li>
                </ul>
            </el-collapse-item>
        </el-collapse>

        <el-table :data="categoryList" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                        <el-table type="expand" :data="props.row.childs" :show-header="false">
                            <!-- 3 -->
                            <el-table-column type="expand">
                                <template slot-scope="childProps3">
                                    <!-- {{childProps3.row.childs}} -->
                                    <el-table type="expand" :data="childProps3.row.childs" :show-header="false">
                                        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                                        <!-- 4 -->
                                        <el-table-column type="expand">
                                            <template slot-scope="childProps4"></template>
            </el-table-column>
            <el-table-column label="排序" width='250'></el-table-column>
            <el-table-column label="类目名称" prop="nameCn"></el-table-column>
            <el-table-column label="添加时间" prop="createTime"></el-table-column>
            <el-table-column label="添加人员" prop="editor" width="50"></el-table-column>
            <el-table-column label="操作" width='340'>
                <template slot-scope="props">
                                                <ul class="btnLists">
                                                  <li @click="differenceDialog=true">差</li>
                                                  <router-link :to="{ name: 'templateManagement', params: {} }" tag='li'>模</router-link>
                                                  <li @click="extend_attribute(props.rows)">扩</li>
                                                  <li @click="setVariantDialog=true">变</li>
                                                  <li @click='livenessDialog=true'>活</li>
                                                  <li @click="edit_category(1)"><img src="../icon/xieru_icon.png"></li>
                                                  <li><img src="../icon/del_icon.png"></li>
                                                </ul>
                                            </template>
            </el-table-column>
        </el-table>

        </template>
        </el-table-column>
        <!--  -->
        <el-table-column label="排序">
            <!-- <template slot-scope="props">{{props.row.$index}}</template> -->
        </el-table-column>
        <el-table-column label="类目名称" prop="nameCn"></el-table-column>
        <el-table-column label="添加时间" prop="createTime"></el-table-column>
        <el-table-column label="添加人员" prop="editor"></el-table-column>
        <el-table-column label="操作" width='340'>
            <template slot-scope="props">
                <ul class="btnLists">
                  <li @click="differenceDialog=true">差</li>
                  <router-link :to="{ name: 'templateManagement', params: {} }" tag='li'>模</router-link>
                  <li @click="extend_attribute(props.rows)">扩</li>
                  <li @click="setVariantDialog=true">变</li>
                  <li @click='livenessDialog=true'>活</li>
                  <li @click="edit_category(1,props.row)"><img src="../icon/xieru_icon.png"></li>
                  <li><img src="../icon/del_icon.png"></li>
                </ul>
            </template>
        </el-table-column>
        </el-table>
        </template>
        </el-table-column>
        <el-table-column label="排序" type="index">
        </el-table-column>
        <el-table-column label="类目名称" prop="nameCn">
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime">
        </el-table-column>
        <el-table-column label="添加人员" prop="editor">
        </el-table-column>
        <el-table-column label="操作" width='340'>
            <template slot-scope="scope">
                    <ul class="btnLists">
                      <li @click="differenceDialog=true">差</li>
                      <router-link :to="{ name: 'templateManagement', params: {} }" tag='li'>模</router-link>
                      <li @click="extend_attribute(scope.row.categoryId)">扩</li>
                      <li @click="set_variant(scope.row.categoryId)">变</li>
                      <li @click='livenessDialog=true'>活</li>
                      <li @click="edit_category(1,scope.row)"><img src="../icon/xieru_icon.png"></li>
                      <li><img src="../icon/del_icon.png"></li>
                    </ul>
                  </template>
        </el-table-column>
        </el-table>

        </section>
    <!-- 添加 / 修改-->
    <div class="add">
        <el-dialog title="新增产品类目" :visible.sync="addDialog" width='1086px'>
            <div style="height:500px;overflow-y: auto;">
                <el-form :model="CategoryForm" :rules="rules" ref="CategoryForm" label-position="right" :inline="true" label-width="125px" class="addForm" size="medium">
                    <!-- {{CategoryForm.parentId}}  {{CategoryForm.relatedCateId}} -->
                    <el-form-item label="父级类目：" prop="parentId">
                        <el-cascader  :change-on-select="true" :props='props' :options='categoryList' v-model="CategoryForm.parentId" />
                    </el-form-item>
                    <el-form-item label="类目中文名称：" prop="nameCn">
                        <el-input v-model='CategoryForm.nameCn'></el-input>
                    </el-form-item>
                    <el-form-item label="类目英文名称：" prop="nameEn">
                        <el-input v-model='CategoryForm.nameEn'></el-input>
                    </el-form-item>
                    <el-form-item label="海光编码：">
                        <el-input v-model='CategoryForm.customsCode' />
                    </el-form-item>
                    <el-form-item label="相关类目：" class="select bgnone">
                        <el-cascader  :change-on-select="true" :props='props' :options='categoryList' v-model="CategoryForm.relatedCateId">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="类目状态：">
                        <el-radio-group v-model='CategoryForm.lockFlag' size="small">
                            <el-radio-button label="1">正常显示</el-radio-button>
                            <el-radio-button label="0">锁定不显示</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="排序：" style="width:51%" prop='sortNumber'>
                        <el-input v-model='CategoryForm.sortNumber' />
                    </el-form-item>
                    <el-form-item label="主要开发负责人：" class="take">
                        <el-select v-model='CategoryForm.developPicId'>
                            <el-option label="王成" value="1"></el-option>
                        </el-select>
                        <div class="show" v-if='type'>
                            <el-checkbox v-model="checked1">是否更新它的下级目录</el-checkbox>
                            <el-button type="info" plain :disabled="!checked1" @click="confirmOperation(CategoryForm.developPicId,1)">确认操作</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="主要图片负责人：" class="take">
                        <el-select v-model='CategoryForm.imgPicId'>
                            <el-option label="王成" value="1"></el-option>
                        </el-select>
                        <div class="show" v-if='type'>
                            <el-checkbox v-model="checked2">是否更新它的下级目录</el-checkbox>
                            <el-button type="info" :disabled="!checked2" plain @click="confirmOperation(CategoryForm.imgPicId,2)">确认操作</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="主要编辑负责人：" class="take">
                        <el-select v-model='CategoryForm.editPicId'>
                            <el-option label="王成" value="1"></el-option>
                        </el-select>
                        <div class="show" v-if='type'>
                            <el-checkbox v-model="checked3">是否更新它的下级目录</el-checkbox>
                            <el-button type="info" plain :disabled="!checked3" @click="confirmOperation(CategoryForm.editPicId,3)">确认操作</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="主要采购人：" class="take">
                        <el-select v-model='CategoryForm.purchasePicId'>
                            <el-option label="王成" value="1"></el-option>
                        </el-select>
                        <div class="show" v-if='type'>
                            <el-checkbox v-model="checked4">是否更新它的下级目录</el-checkbox>
                            <el-button type="info" plain :disabled="!checked4" @click="confirmOperation(CategoryForm.purchasePicId,4)">确认操作</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="主要财务负责人：" class="take">
                        <el-select v-model='CategoryForm.financePicId'>
                            <el-option label="王成" value="1"></el-option>
                        </el-select>
                        <div class="show" v-if='type'>
                            <el-checkbox v-model="checked5">是否更新它的下级目录</el-checkbox>
                            <el-button type="info" plain :disabled="!checked5" @click="confirmOperation(CategoryForm.financePicId,5)">确认操作</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="类目描述：" class="textarea">
                        <el-input type="textarea" v-model='CategoryForm.cateDesc'></el-input>
                    </el-form-item>
                    <el-form-item label="SEO标题：" class="textarea">
                        <el-input type="textarea" v-model='CategoryForm.seoTitle' />
                    </el-form-item>
                    <el-form-item label="SEO关键词：" class="textarea">
                        <el-input type="textarea" v-model='CategoryForm.seoKeyword' />
                    </el-form-item>
                    <el-form-item label="选择映射平台：" class="map" prop="platformCategoryList">
                        <div class="mapbg">
                            <!-- {{CategoryForm.platformCategoryList}} -->
                            <el-checkbox-group v-model="CategoryForm.platformCategoryList">
                                <el-checkbox-button v-for="item in platformList" :label="item" style="margin:0 15px 10px;">
                                    <template>
                                            <img :src="item.logo" width="120" height="75">
                                        </template>
                                </el-checkbox-button>
                            </el-checkbox-group>
                            <i class="hint" />
                        </div>
                    </el-form-item>

                    <template v-for="(item,index) in CategoryForm.platformCategoryList" v-if="CategoryForm.platformCategoryList.length">
                            <el-form-item :label="item.platformName+'类目映射：'">
                                <!-- {{userCategorylist}} -->
                                <el-checkbox-group v-model="userCategorylist[index]">
                                    <el-checkbox-button v-for="curItem in item.siteList" :label="curItem">{{curItem.siteNameZh}}</el-checkbox-button>
                                </el-checkbox-group>
                            </el-form-item>
                    </template>
                </el-form>

                <template v-for='(item,index) in userCategorylist' v-if='item.length'>
                    <el-table :data="item" border style="width: 85%;margin:15px 0 30px 125px;">
                            <el-table-column prop="siteNameZh" label="国家" width="82" align='center'/>
                            <el-table-column prop="type" :label="item[index].platformName+'类型'" align='center'>
                            </el-table-column>
                            <el-table-column  fixed="right"  label="操作" align='center' width="220">
                              <template slot-scope="scope">
                                <el-button type="text" size="small" @click="selectPlatform(scope.row.siteId)">选择{{scope.row.platformName}}类型</el-button>
                                <el-button type="text" size="small">清空</el-button>
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
        <el-dialog width="653px" title="选择类目" :visible.sync="category_selection">
            <div style="height:280px;overflow-y: auto;">
                <p style="width:320px;margin:0 auto;">
                    <el-input class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </p>
                <!-- 平台类目 -->
                <template>
                    <div>
                        <el-cascader  style="width:100%;margin-top:10px;"
                            :options='PTList'
                            :props='PTprops'
                            @active-item-change="handleItemChange"
                            v-model="userPTList">
                        </el-cascader>
                    </div>
                </template>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
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
                    <h3>字段列表</h3>
                    <el-table border :data="arr">
                        <el-table-column property="num" label="序号"></el-table-column>
                        <el-table-column property="name" label="名称"></el-table-column>
                        <el-table-column type="selection" width="55"></el-table-column>
                    </el-table>
                </div>
                <div class="right">
                    <h3>已选中变体差异字段</h3>
                    <el-table border :data="arr">
                        <el-table-column property="num" label="序号"></el-table-column>
                        <el-table-column property="name" label="名称"></el-table-column>
                        <el-table-column label="操作" width="300">
                            <template slot-scope="scope">
                                  <span class="btn">上移</span>
                                  <span class="btn">下移</span>
                                  <span class="btn">删除</span>
                              </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:200px;" type="primary" @click="extendDialog= false">保 存</el-button>
            </div>
        </el-dialog>
    </div>
    <!--扩展弹框 -->
    <div class="extend">
        <el-dialog title="扩展属性设置" :visible.sync="extendDialog" width='520px'>
            <div class="extend_content">
                <div style="line-height:40px;">
                    <span class="title1">选择属性：</span>
                    <el-checkbox-group v-model="extend_checkList" >
                        <el-checkbox v-for="item in attributeList" :label="item.categoryPropertyId" >{{item.propertyName}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div style="display:flex;">
                    <span class="title1">自定义属性：</span>
                    <el-input type="text" v-model='extendedName'>
                        <el-button slot="append" @click='affirmBtn(1)'>确认</el-button>
                    </el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:200px;" type="primary" @click="save(1)">保 存</el-button>
            </div>
        </el-dialog>
    </div>
    <!-- 变体值设置  -->
    <div>
        <el-dialog title="变体值设置" :visible.sync="setVariantDialog" width="520px">
            <div class="setBox">
                <p>选择变体值：</p>
                <div class="setVariantWarp">
                    <span class="text">选择值：</span>
                    <p>
                        <!-- {{checkList}} -->
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox v-for="item in attributeList" :label="item">{{item.propertyName}}</el-checkbox>
                        </el-checkbox-group>
                    </p>
                </div>
                <div class="setVariantWarp">
                    <span class="text">自定义值：</span>
                    <p>
                        <el-input type="text" v-model='propertyName'>
                            <el-button slot="append" @click='affirmBtn(0)'>确认</el-button>
                        </el-input>
                    </p>
                </div>
            </div>
            <div class="setBox">
                <p>设置图片路径：</p>
                <div class="setVariantWarp">
                    <span class="text">已选值：</span>
                    <p style="display:flex;flex-wrap:wrap;padding-left: 35px;">
                        <template v-for='(item,index) in uservalueList'>
                            <el-checkbox v-model="item.checked">{{item.propertyName}}</el-checkbox>
                            <el-select v-model="item.hierarchy" @change='lockHierarchy(index)' size="mini" style="width: 130px;margin:0 10px;">
                                <el-option v-for="item in hierarchyList" :label="item.label" :value="item.value" :disabled="item.disabled"/>
                            </el-select>
                        </template>
                    </p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:200px;" type="primary" @click="save(0)">保 存</el-button>
            </div>
        </el-dialog>

    </div>
    <!--  -->
    <!-- 活跃度设置 -->
    <div class="activity">
        <el-dialog title="类目活跃度规则设置" :visible.sync="livenessDialog" width='1086px'>
            <div class="liveness-body">
                <ul>
                    <li>
                        <el-form :inline="true" class="demo-form-inline" size="medium">
                            <el-form-item label="最近">
                                <el-select>
                                    <el-option label="两周" value="shanghai"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="销量区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>  个</span>
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="呆滞库龄区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;定义为 <span class="highlight">爆款</span>
                            </el-form-item>
                        </el-form>
                    </li>
                    <li>
                        <el-form :inline="true" class="demo-form-inline" size="medium">
                            <el-form-item label="最近">
                                <el-select>
                                    <el-option label="两周" value="shanghai"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="销量区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>  个</span>
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="呆滞库龄区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;定义为 <span class="highlight">旺款</span>
                            </el-form-item>
                        </el-form>
                    </li>
                    <li>
                        <el-form :inline="true" class="demo-form-inline" size="medium">
                            <el-form-item label="最近">
                                <el-select>
                                    <el-option label="两周" value="shanghai"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="销量区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>  个</span>
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="呆滞库龄区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;定义为 <span class="highlight">平款</span>
                            </el-form-item>
                        </el-form>
                    </li>
                    <li>
                        <el-form :inline="true" class="demo-form-inline" size="medium">
                            <el-form-item label="销量区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>  个</span>
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="呆滞库龄区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;
                            </el-form-item>
                            <el-form-item label="或 全仓可售天数大于：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;定义为 <span class="highlight">滞销款</span>
                            </el-form-item>
                        </el-form>
                    </li>
                    <li>
                        <el-form :inline="true" class="demo-form-inline" size="medium">
                            <el-form-item label="渠道SKU数量区间 从：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>  个</span>
                            </el-form-item>
                            <el-form-item label="到：">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" />
                                <span>&nbsp;&nbsp;个&nbsp;且&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="（且添加/开发/审核）：">
                                <el-select>
                                    <el-option label="审核" value="shanghai"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="时间区间  从">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;
                            </el-form-item>
                            <el-form-item label="到">
                                <el-input-number controls-position="right" v-model="count" @change="countNum" :min="200" :max="250" /> 天&nbsp;定义为 <span class="highlight">新款</span>
                            </el-form-item>
                        </el-form>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:200px;" type="primary" @click="livenessDialog= false">保 存</el-button>
            </div>
        </el-dialog>
    </div>
    <!-- 操作日志 -->
    <div class="record">
        <el-dialog title="批量设置产品性质" :visible.sync="recordDialog" width='1086px'>
            <div class="record-body">
                <el-form :inline="true" class="demo-form-inline record_select" size="medium">
                    <el-form-item label="操作时间">
                        <el-date-picker type="datetime" align="right" />
                    </el-form-item>
                    <el-form-item label="~">
                        <el-date-picker type="datetime" align="right" />
                    </el-form-item>
                    <el-form-item label="操作内容：">
                        <el-input />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">搜 索</el-button>
                    </el-form-item>
                </el-form>

                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="date" label="操作时间" width="187" align="center" />
                    <el-table-column prop="name" label="操作人" width="160" align="center" />
                    <el-table-column prop="address" label="操作内容" align="center" />
                </el-table>

                <el-pagination class="pagination" :page-size="1" layout="prev, pager, next, jumper" :total="10" />
            </div>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:200px;" type="primary" @click="recordDialog= false">保 存</el-button>
            </div>
        </el-dialog>
    </div>


</div>
</template>
<script>
import axios from 'axios';
import Vue from 'vue'
function getData(requestURL, params) {
    // let token = "804aea0bc70fa1be7f4045474e11d343";
    let token = localStorage.getItem('token');
    return axios({
        method: 'post',
        //url: 'http://192.168.0.123:8080/' + requestURL,
        url: 'http://192.168.0.98:7080/yutoo-admin-erp/' + requestURL, //服务器
        //url: 'http://192.168.0.200:8080/' + requestURL,//张绍武
        //url: 'http://192.168.0.102:8080/' + requestURL,//王成
        //url: 'http://192.168.0.119:8080/' + requestURL,
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
            checked1:false,
            checked2:false,
            checked3:false,
            checked4:false,
            checked5:false,
            //假数据
            tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
            }],
            count: '200',
            arr: [{
                num: 1,
                name: "one"
            }],
            //=>基础
            props: {
                value: 'categoryId', //
                label: 'nameCn',
                children: 'childs'
            },
            PTprops: {
                value: 'categoryName',
                label: 'categoryName',
                children: 'childs'
            },
            categoryList: [], //基础类目树列表
            platformList: [], //站点列表
            PTList: [], //平台类目列表
            type: '', //判断点击是编辑还是添加
            userCategorylist: [], //选择的类目映射
            stateSiteList: [], //站点对应的国家列表

            extend_checkList: [], //扩展弹框选项
            checked:false,
            categoryId:'', //编辑时记录的类目ID
            attributeList:[], //扩展属性和变体属性列表
            hierarchyList:[{//变体设置层级列表
                label:'一级',
                value:'1',
                disabled: false
            },{
                label:'二级',
                value:'2',
                disabled: false
            },{
                label:'三级',
                value:'3',
                disabled: false
            }],
            //onOff:true,//平台列表开关
            //弹框
            category_selection: false, // 选择类目
            livenessDialog: false, //活跃度设置
            recordDialog: false, //操作日志
            differenceDialog: false, //差异弹框
            setVariantDialog: false, //设置变体
            addDialog: false, // 编辑及添加
            extendDialog: false, //扩展
            //验证规则
            rules: {
                parentId: [{
                    required: true,
                    message: '请选择类目',
                    trigger: 'change'
                }],
                nameCn: [{
                    required: true,
                    message: '请输入中文名称',
                    trigger: 'blur'
                }],
                nameEn: [{
                    required: true,
                    message: '请输入英文文名称',
                    trigger: 'blur'
                }],
                sortNumber: [{
                    required: true,
                    message: '请输入序号',
                    trigger: 'blur'
                }],
                platformCategoryList: [{
                    required: true,
                    message: '请选择平台',
                    trigger: 'change'
                }],
            },

            //=>业务
            userPTList: [], //用户选中的平台类目
            checkList: [], //设置变体弹框选择的
            CategoryForm: { //编辑添加类目
                "parentId":[],
                "nameEn": "",
                "nameCn": "",
                "relatedCateId": [],
                "customsCode": "",
                "sortNumber": '',
                "developPicId": "",
                "imgPicId": "",
                "editPicId": "",
                "purchasePicId": "",
                "financePicId": "",
                "cateDesc": "",
                "seoTitle": "",
                "seoKeyword": "",
                "lockFlag": 1,
                platformCategoryList: []
            },
            select:{//搜索
                keyword:"",
                startDate:"",
                endDate: ""
            },
            propertyName:'', //
            extendedName:'',
            uservalueList:[],
            lockHierarchyObj:[]
        }
    },
    mounted() {
        this.getCategoryList({
            keyword: "",
            // "startDate": "2000-9-11",
            // "endDate": "2007-9-11"
        })
        this.getPlatformLists();
    },
    watch: {
        'CategoryForm.platformCategoryList' (val) {
            // console.log(val)
            this.userCategorylist = [];
            val.forEach(item => {
                this.userCategorylist.push([])
            })
        },
        checkList(val){
            this.uservalueList = val
            this.uservalueList.forEach((item, index, arr)=>{
                this.$set(item, 'checked', false)
                this.$set(item, 'hierarchy','')
            })
        },
        lockHierarchyObj(val){
            console.log(val)

            val.forEach(item=>{
                item.disabled = true;
            })
        }
    },
    methods: {
        countNum(value) {
            console.log(value);
        },
        //锁定其他层级
        lockHierarchy(){
            this.uservalueList.forEach((item,uindex)=>{
                this.hierarchyList.forEach((curitem,curindex)=>{
                    if(item.hierarchy == curitem.value){
                        if(this.lockHierarchyObj.length){
                            this.lockHierarchyObj.forEach(i=>{
                                if(i.value==curitem.value){
                                    //debugger
                                    console.log(curitem)
                                }else{
                                    this.lockHierarchyObj.push(curitem)
                                }
                            })
                        }else{
                            this.lockHierarchyObj.push(curitem)
                        }
                    }
                })
            })
        },
        //更新下级目录
        confirmOperation(principalId,principalType){
            // console.log(e)
            let params = {
                principalId,
                principalType,
                categoryId:this.categoryId
            }
            getData('CategoryM/updatePrincipal',params).then(res=>{
                console.log(res)
                if(res.data.code==0){
                    this.$message({
                      message: res.data.msg,
                      type: 'success'
                    });
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        //新增产品类目保存
        submitPlatform(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证通过
                    let platformCategoryList = []
                    let categoryM = {}
                    this.CategoryForm.platformCategoryList.forEach(item => {
                        platformCategoryList.push(item.platformId)
                    })
                    for (let key in this.CategoryForm) {
                        if (key == 'platformCategoryList') continue;
                        if (key == "parentId") {
                            let num = this.CategoryForm[key][this.CategoryForm[key].length - 1]
                            categoryM[key] = num
                            continue;
                        }
                        if (key == "relatedCateId") {
                            let num = this.CategoryForm[key][this.CategoryForm[key].length - 1]
                            categoryM[key] = num
                            continue;
                        }
                        categoryM[key] = this.CategoryForm[key]
                    }
                    console.log(categoryM)
                    let params = {
                        categoryM,
                        sourceType: "Merchant",
                        platformCategoryList,
                    }
                    getData('CategoryM/save', params).then(res => {
                        // console.log(res)
                        if (res.data.code == 0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getCategoryList()
                            this.addDialog = false;
                            return;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        //平台类目根据站点获取下级类目
        handleItemChange(val) {
            console.log(val)

            this.PTList.forEach(item => {
                if (val.indexOf(item.categoryName) > -1 && !item.childs.length) {
                    getPlatformData(item.siteId, item.platformCategoryId).then(res => {
                        item.childs = res
                    })
                }
            })

            function getPlatformData(siteId, cateId) {
                let data = getData('CategoryPlatform/listChild', {
                    siteId,
                    cateId
                }).then(res => {
                    let arr = res.data.cates
                    arr.forEach(i => {
                        i['childs'] = []
                    })
                    return arr;
                })
                return data
            }
        },
        // 选择平台类目
        selectPlatform(siteId) {
            this.category_selection = true
            getData('CategoryPlatform/listChild', {
                siteId,
                // cateId:3
            }).then(res => {
                let data = res.data.cates
                // this.PTList
                data.forEach(item => {
                    item['childs'] = []
                })
                this.PTList = data
                console.log(data)
            })

        },
        //选择类目弹框后确定
        usercategory() {

            this.category_selection = false;
        },
        //获取平台列表
        getPlatformLists(){
            getData('platform/list/platform/site').then(res => {
                let data = res.data.rows;
                let obj = {};
                let newObj = null;
                data.forEach((item, index) => {
                    let siteList = item.siteList;
                    for (let key in item) {
                        if (key == 'siteList') continue;
                        obj[key] = item[key]
                    }
                    if (siteList.length) {
                        siteList.forEach((curitem, curindex) => {
                            newObj = Object.assign({}, curitem, obj);
                            siteList[curindex] = newObj
                        })
                    }
                })
                this.platformList = data;
            })
        },
        //编辑店铺级添加
        edit_category(type, curCategory) {
            //type=1编辑 =0添加
            this.addDialog = true;
            this.type = type;
            //添加
            if(!type){
                console.log(this.CategoryForm)
                for(let key in this.CategoryForm){
                    if(key=='parentId'){
                        this.CategoryForm[key]=[];
                        continue;
                    }
                    if(key=='platformCategoryList'){
                        this.CategoryForm[key]=[];
                        continue;
                    }
                    if(key=='relatedCateId'){
                        this.CategoryForm[key]=[];
                        continue;
                    }
                    this.CategoryForm[key]=null;
                }
            }
            //编辑
            if (type) {
                 //console.log(curCategory)
                this.categoryId = curCategory.categoryId
                //查询当前类目
                getData('CategoryM/findByCategoryId', {
                    CategoryId: curCategory.categoryId
                }).then(res => {
                    console.log(res)
                    let data = Object.assign({},res.data.category);
                    let arr = [];

                    if(data.platformCategoryList !=null && data.platformCategoryList instanceof Array){
                        let resultArr = []
                        let obj = {
                            platformId:'',
                            platformName:'',
                            siteList:[]
                        }
                        let plateList = data.platformCategoryList

                        for(let i=0;i<plateList.length;i++){
                            let current = plateList[i].platformId
                            if(plateList[i].platformId == current){
                                obj.siteList.push(Object.assign({},{
                                    platformId: plateList[i].platformId,
                                    siteNameZh: plateList[i].siteName,
                                    platformName: plateList[i].plateformName,
                                    siteId: plateList[i].siteId,
                                    plateformCateName: plateList[i].plateformCateName,
                                    plateformCateId: plateList[i].plateformCateId,
                                    plateformCateDesc: plateList[i].plateformCateDesc,
                                }))
                                obj.platformId = plateList[i].platformId
                                obj.platformName = plateList[i].plateformName
                                continue;
                            }
                        }
                        resultArr.push(obj)
                        data.platformCategoryList = resultArr;

                        console.log(data.platformCategoryList)
                        this.platformList.forEach((item,index)=>{
                            data.platformCategoryList.forEach((i,curindex)=>{
                                if(item.platformId == i.platformId){
                                    data.platformCategoryList[curindex] = this.platformList[index];

                                    this.CategoryForm.platformCategoryList = this.platformList[index];
                                    // debugger
                                    this.$nextTick(() => {
                                        item.siteList.forEach(k=>{
                                            i.siteList.forEach(j=>{
                                                if(k.siteId==j.siteId){
                                                    this.userCategorylist[curindex].push(k)
                                                }
                                            })
                                        })
                                    })

                                }
                            })
                        })
                    }
                    for (let key in data) {
                        //父级类目
                        if(key=='categoryId'){
                            if(data.parentId==1){
                                arr.push(data.categoryId)
                                data.categoryId =  arr
                                arr = []
                                continue;
                            }else{
                                arr.push(data.parentId,data.categoryId)
                                data.categoryId = arr
                                //debugger
                                arr = []
                                continue;
                            }
                        }
                        //相关类目
                        if(key=='relatedCateId'){
                            if(data.relatedCateId && data.parentId!==1){
                                data[key] = arr.push(data.categoryId,data.relatedCateId)
                                arr = [];
                                continue;
                            }else{
                                data[key] = []
                                arr = [];
                                continue;
                            }
                        }
                    }
                    for(let key in data){
                        if(key=='categoryId'){
                            this.CategoryForm.parentId = data[key];
                            continue;
                        }
                        for(let curkey in this.CategoryForm){
                            if(curkey=="parentId")continue;
                            if(key==curkey){
                                this.CategoryForm[curkey] = data[key];
                            }
                        }
                    }


                })
            }
        },

        //确认
        affirmBtn(type){
            //扩展属性自定义确认
            if(type){
                if(this.extendedName){
                    getData('CatePropertyM/saveExtended',{
                        categoryId:this.categoryId,
                        propertyName:this.extendedName
                    }).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                              message: res.data.msg,
                              type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            //变体属性自定义确认
            }else{
                if(this.propertyName){
                    getData('CatePropertyM/saveVariants',{
                        categoryId:this.categoryId,
                        propertyName:this.propertyName
                    }).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                              message: res.data.msg,
                              type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            }
        },
        //保存
        save(type){
            //扩展
            if(type){
                if(this.extend_checkList.length){
                    getData('CatePropertyM/updateExtended',this.extend_checkList).then(res=>{
                        if(res.data.code==0){
                            console.log(res)

                            this.$message({
                              message: res.data.msg,
                              type: 'success'
                            });
                            this.extendDialog= false
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            //变体
            }else{


                this.setVariantDialog = false;
            }
        },
        //设置变体
        set_variant(categoryId){
            this.setVariantDialog=true;
            this.categoryId = categoryId;
            this.propertyName ='';
            this.uservalueList.length = 0
            // this.getListByCateIdAndPropType({categoryId,propertyType:2})
            this.getListByCateIdAndPropType({categoryId:2,propertyType:2})
        },

        //扩展属性设置
        extend_attribute(categoryId){
            this.extendDialog=true
            this.categoryId = categoryId
            this.extendedName = ''
            this.extend_checkList = []
            // this.getListByCateIdAndPropType({categoryId,propertyType:1})
            this.getListByCateIdAndPropType({categoryId:2,propertyType:1})
        },
        //获取扩展属性或变体属性列表
        getListByCateIdAndPropType(params){
            getData('CatePropertyM/listByCateIdAndPropType',params).then(res=>{
                //console.log(res.data.rows)
                if(res.data.code==0){
                    this.attributeList = res.data.rows
                }else{
                    this.$message.error('属性获取失败');
                }
            })
        },
        //搜索
        select_category(){
            if(this.select.keyword || this.select.startDate || this.select.endDate){
                this.getCategoryList(this.select)
            }else{
                this.$message({
                  message: '最少需要一个搜索条件',
                  type: 'warning'
                });
            }
        },
        //获取类目树列表
        getCategoryList(params) {
            getData('CategoryM/list', params).then(res => {
                //console.log(res)
                if(!res.data.category){
                    this.$message.error('没有找到相关类目');
                    return
                }
                if(res.data.code==0 && res.data.category.childs){
                    this.categoryList = res.data.category.childs
                    return
                }

            })
        }
    }
}
</script>

<style lang="scss">
    @import '../../../../assets/style/style-scss/layout.scss';
    body {
        padding: 10px;
    }
    .searchBox {
        @include flex(row) padding: 10px 0;
        border-radius: 5px;
        background-color: rgba(242, 242, 242, 1);
        .line {
            line-height: 40px;
            margin: 0 10px;
        }
        .el-button {
            margin-left: 20px;
        }
    }
    .operationBox {
        padding: 10px 0;
        .el-button {
            margin-right: 20px;
        }
    }
    .categoryBox {
        border-radius: 7px;
        border: 1px solid rgba(223, 223, 223, 1);
        .el-collapse {
            padding: 0 10px;
            .el-collapse-item__header {}
        }
        .btnLists {
            @include flex(row) li {
                font-size: 16px;
                font-weight: 700;
                text-align: center;
                color: #0000FF;
                width: 33px;
                height: 33px;
                line-height: 30px;
                border: 3px solid #0000FF;
                border-radius: 5px;
                margin-right: 10px;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                }
                &:last-child,
                &:nth-last-child(2) {
                    border: none;
                }
            }
        }
        .cell {
            text-align: center;
        }
        .el-table__expanded-cell[class*=cell] {
            padding: 20px 0;
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
                    content: url("../icon/check.png");
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
                    background: url("../icon/hint.png") no-repeat center center;
                }
            }
        }

    }
    // 差异弹框
    .difference_content {
        @include flex(row);
        height: 500px;
        overflow-y: auto;
        div {
            h3 {
                background: #eee;
                height: 34px;
                line-height: 34px;
                padding-left: 10px;
            }
        }
        .left {
            margin-right: 10px;
            width: 436px;
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
                color: #0080C9;
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
        .pagination {
            position: absolute;
            bottom: 0;
            right: 20px;
        }
    }
</style>
