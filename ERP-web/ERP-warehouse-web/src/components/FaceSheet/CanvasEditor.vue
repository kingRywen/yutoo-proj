<template>
    <div class="editor-container">
        <!-- 上方工具栏 start -->
        <!-- {{selection}} -->
        <div class="top-toolbar flex noprint">
            <el-form :inline="true" :model="topToolbarData" class="noprint form" ref="form">
                <el-form-item label-width="40" label="选择类型：">
                    <el-select size="small" v-model="topToolbarData.modelType" @change="changeModelType">
                        <ElOption v-for="item in editOptions" :key="item.value" :label="item.label" :value="item.value"></ElOption>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="0">
                    <el-checkbox v-model="topToolbarData.defaultFlag" true-label="1" false-label="0">是否{{topToolbarData.modelType==3?'默认':'激活'}}</el-checkbox>
                </el-form-item>
                <el-form-item label-width="0" prop="tmplName" :rules="[
                        { required: true, message: '请输入模板名称', trigger: 'blur' },                    
                    ]">
                    <ElInput size="small" v-model="topToolbarData.tmplName" placeholder="请输入模板名称..."></ElInput>
                </el-form-item>
                <div>
                    <el-form-item label="规格">
                        <el-select size="small" v-model="topToolbarData.specificationId" @change="changeSpecifications">
                            <ElOption v-for="item in specificationList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="0" prop="layoutWidth" :rules="[
                        { required:topToolbarData.specificationId=='10'?true:false, message: '请输入布局宽度', trigger: 'blur' },                    
                    ]">
                        <div class="form-item">
                            <ElInput size="small" v-model="topToolbarData.layoutWidth" placeholder="布局宽" :disabled="topToolbarData.specificationId==10?false:true"></ElInput>
                            <span class="multiply">cm</span>
                        </div>
                    </el-form-item>
                    <el-form-item
                        label-width="10"
                        label="*"
                        prop="layoutWidth"
                        :rules="[
                        { required:topToolbarData.specificationId=='10'?true:false, message: '请输入布局高度', trigger: 'blur' },                    
                    ]"
                    >
                        <div class="form-item">
                            <ElInput size="small" v-model="topToolbarData.layoutHeight" placeholder="布局高" :disabled="topToolbarData.specificationId==10?false:true"></ElInput>
                            <span class="multiply">cm</span>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item label-width="0">
                    <ElButton size="small" type="default" @click="print">打印预览</ElButton>
                    <ElButton size="small" type="default" @click="clearCanvas">清空画布</ElButton>
                    <ElButton size="small" type="default" @click="saveTmpl">{{isCopy?'复制模板':'保存模板'}}</ElButton>
                    <ElButton size="small" type="default" @click="saveAndClose" v-if="isAdd">保存并关闭</ElButton>
                </el-form-item>
            </el-form>
        </div>
        <!-- 上方工具栏 End -->
        <!-- 画布 start -->
        <div class="layout-wrapper flex">
            <!-- 画布canvas -->
            <div class="canvas-wrapper">
                <canvas id="canvas"></canvas>
            </div>

            <!-- 画布左工具栏 -->
            <div class="layout-left-toolbar noprint" v-loading="leftLoading" element-loading-text="数据加载中...">
                <div style="height: 100%;overflow-y: auto;">
                    <ElCollapse>
                        <ElCollapseItem v-for="item in layoutLeftBar" :name="item.name" :key="item.name" :title="item.name">
                            <div class="tool-btn-box">
                                <template v-if="item.name=='构图元素'">
                                    <!--  -->
                                    <div class="composition-elements">
                                        <div class="composition-elements-item" v-for="btn in item.children">
                                            <div class="text" draggable="true" @dragstart="drag($event,btn)" @mousedown="mousedown">{{btn.name}}</div>
                                            <i class="iconfont icon" v-html="btn.icon || '&#xe619;'"></i>
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="item.name=='图标元素'">
                                    <div class="logisticsLogo" draggable="true" @dragstart="drag($event,btn)" @mousedown="mousedown" v-for="btn in item.children" :style="{backgroundImage: 'url('+btn.name +')' }"></div>
                                </template>
                                <template v-else>
                                    <div class="tool-btn_warp" v-for="btn in item.children">
                                        <div class="tool-btn" draggable="true" @dragstart="drag($event,btn)" @mousedown="mousedown">{{btn.name}}</div>
                                        <i class="iconfont" v-html="btn.icon || '&#xe619;'"></i>
                                    </div>
                                </template>
                            </div>
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                <!-- 画布快捷键提示 -->
                <transition name="el-fade-in-linear">
                    <div class="keyboard-shortcuts noprint" v-show="shortcutKeys">
                        <div class="keyboard-title">
                            <span>快捷键</span>
                            <i class="el-icon-close" @click="shortcutKeys=false"/>
                        </div>
                        <el-row class="keyboard-list" :gutter="10">
                            <el-col :span="12" class="keyboard-item">
                                <i class="el-icon-arrow-up"></i>
                                <div class="text">上移</div>
                            </el-col>
                            <el-col :span="12" class="keyboard-item">
                                <i class="el-icon-arrow-down"></i>
                                <div class="text">下移</div>
                            </el-col>

                            <el-col :span="12" class="keyboard-item">
                                <i class="el-icon-arrow-left"></i>
                                <div class="text">左移</div>
                            </el-col>
                            <el-col :span="12" class="keyboard-item">
                                <i class="el-icon-arrow-right"></i>
                                <div class="text">右移</div>
                            </el-col>
                            <el-col :span="12" class="keyboard-item">
                                <i>Delete</i>
                                <div class="text">或</div>
                            </el-col>
                            <el-col :span="12" class="keyboard-item">
                                <i>Del</i>
                                <div class="text">删除</div>
                            </el-col>
                        </el-row>
                    </div>
                </transition>
            </div>
            <!-- 画布右属性 -->
            <transition name="propertiesRight">
                <div v-show="propertiesRight" class="layout-right-properties noprint">
                    <h3 class="properties-title">{{navTitle}}</h3>
                    <el-tabs type="border-card" class="properties-tabs" v-show="navType==1">
                        <el-tab-pane label="标题">
                            <ul class="title-info">
                                <li>
                                    <el-checkbox v-model="propertiesData.showTitle">
                                        <span class="hint">显示标题</span>
                                    </el-checkbox>
                                    <p>标题文本：</p>
                                    <el-input size="small" v-model="propertiesData.titleText"></el-input>
                                </li>
                                <li>
                                    <div>
                                        <el-checkbox v-model="propertiesData.showAllTitle">
                                            <span class="hint">标题整行显示</span>
                                        </el-checkbox>
                                        <p>标题文字字体：</p>
                                        <el-select v-model="propertiesData.family" size="small" style="width:100%">
                                            <el-option label="Comic Sans" value="Comic Sans"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>标题文字尺寸：</p>
                                        <el-select v-model="propertiesData.size" @change="changeSize" size="small" style="width:100%">
                                            <el-option label="14px" value="14"/>
                                            <el-option label="16px" value="16"/>
                                            <el-option label="18px" value="18"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>标题行距：</p>
                                        <el-select v-model="propertiesData.lineheight" size="small" style="width:100%">
                                            <el-option label="1倍" value="1"/>
                                            <el-option label="2倍" value="2"/>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <el-checkbox v-model="propertiesData.isTitleWeight">
                                        <span class="hint">标题文字加粗</span>
                                    </el-checkbox>
                                </li>
                                <li>
                                    <el-card shadow="hover" style="background: #5ccfc71f">文字大小不能小于12px,否则打印显示异常!</el-card>
                                    <el-button-group class="title-info-btn">
                                        <el-button type="success" icon="el-icon-sort" size="small">复 制</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small" @click="attributeDel">删 除</el-button>
                                    </el-button-group>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="内容">正在开发中...</el-tab-pane>
                        <el-tab-pane label="边框">正在开发中...</el-tab-pane>
                    </el-tabs>
                    <!-- 表格 -->
                    <el-tabs type="border-card" class="properties-tabs" v-show="navType==6">
                        <el-tab-pane label="表格">
                            <ul class="title-info">
                                <li>
                                    <el-checkbox v-model="propertiesData.tableline" style="margin-bottom: 10px;">
                                        <span class="hint">显示表格框线</span>
                                    </el-checkbox>
                                    <br>
                                    <el-checkbox v-model="propertiesData.tableHeader">
                                        <span class="hint">显示表头</span>
                                    </el-checkbox>
                                    <p>表头文字字体：</p>
                                    <el-select v-model="propertiesData.tableFamily" size="small" style="width:100%">
                                        <el-option label="Comic Sans" value="Comic Sans"/>
                                    </el-select>
                                </li>
                                <li>
                                    <div>
                                        <p>表头文字尺寸：</p>
                                        <el-select v-model="propertiesData.tableHeaderSize" size="small" style="width:100%">
                                            <el-option label="14px" value="14"/>
                                            <el-option label="16px" value="16"/>
                                            <el-option label="18px" value="18"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>表格内容文字字体：</p>
                                        <el-select v-model="propertiesData.tableContenfamily" size="small" style="width:100%">
                                            <el-option label="Comic Sans" value="Comic Sans"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>表格内容文字尺寸：</p>
                                        <el-select v-model="propertiesData.tableContenSize" size="small" style="width:100%">
                                            <el-option label="1倍" value="1"/>
                                            <el-option label="2倍" value="2"/>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <el-checkbox v-model="propertiesData.isShowfoot">
                                        <span class="hint">显示脚注</span>
                                    </el-checkbox>
                                </li>
                                <li>
                                    <p>脚注文字字体：</p>
                                    <el-select v-model="propertiesData.tfootfamily" size="small" style="width:100%">
                                        <el-option label="Comic Sans" value="Comic Sans"/>
                                    </el-select>
                                </li>
                                <li>
                                    <p>脚注文字尺寸：</p>
                                    <el-select v-model="propertiesData.tfootSize" size="small" style="width:100%">
                                        <el-option label="14px" value="14"/>
                                        <el-option label="16px" value="16"/>
                                        <el-option label="18px" value="18"/>
                                    </el-select>
                                </li>
                                <li>
                                    <el-button-group class="title-info-btn">
                                        <el-button type="success" icon="el-icon-sort" size="small">复 制</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small" @click="attributeDel">删 除</el-button>
                                    </el-button-group>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="字段">正在开发中...</el-tab-pane>
                    </el-tabs>
                    <!-- 图片 -->
                    <el-tabs type="border-card" class="properties-tabs" v-show="navType==5">
                        <el-tab-pane label="上传">
                            <ul class="title-info">
                                <li>
                                    <p>选择本地图片：</p>
                                    <el-upload class="upload" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">
                                            将文件拖到此处，或
                                            <em>点击上传</em>
                                        </div>
                                    </el-upload>
                                </li>
                                <li>
                                    <el-card shadow="hover" style="background: #5ccfc71f">支持png,jpg,gif等图片格式，图片大小不能超过1MB</el-card>
                                    <el-button-group class="title-info-btn">
                                        <el-button type="success" icon="el-icon-sort" size="small">复 制</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small" @click="attributeDel">删 除</el-button>
                                    </el-button-group>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="边框">正在开发中...</el-tab-pane>
                    </el-tabs>
                    <!-- 条码 -->
                    <el-tabs type="border-card" class="properties-tabs" v-show="navType==7">
                        <el-tab-pane label="标题">
                            <ul class="title-info">
                                <li>
                                    <el-checkbox v-model="barOptions.displayValue">
                                        <span class="hint">显示标题</span>
                                    </el-checkbox>
                                    <p>标题文本：</p>
                                    <el-input size="small" v-model="barOptions.text"></el-input>
                                </li>
                                <li>
                                    <div>
                                        <el-checkbox>
                                            <span class="hint">标题整行显示</span>
                                        </el-checkbox>
                                        <p>标题文字字体：</p>
                                        <el-select v-model="barOptions.fontOptions" size="small" style="width:100%">
                                            <el-option label="bold" value="bold"/>
                                            <el-option label="italic" value="italic"/>
                                            <el-option label="bold italic" value="bold italic"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>标题文字尺寸：</p>
                                        <el-select v-model.number="barOptions.fontSize" size="small" style="width:100%">
                                            <el-option label="14px" value="14"/>
                                            <el-option label="16px" value="16"/>
                                            <el-option label="18px" value="18"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>标题行距：</p>
                                        <el-select v-model="barOptions.textMargin" size="small" style="width:100%">
                                            <el-option label="1倍" value="1"/>
                                            <el-option label="2倍" value="2"/>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <el-checkbox v-model="barOptions.fontOptionsWeight">
                                        <span class="hint">标题文字加粗</span>
                                    </el-checkbox>
                                </li>
                                <li>
                                    <el-card shadow="hover" style="background: #5ccfc71f">文字大小不能小于12px,否则打印显示异常!</el-card>
                                    <el-button-group class="title-info-btn">
                                        <el-button type="success" icon="el-icon-sort" size="small">复 制</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small" @click="attributeDel">删 除</el-button>
                                    </el-button-group>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="内容">正在开发中...</el-tab-pane>
                        <el-tab-pane label="边框">正在开发中...</el-tab-pane>
                    </el-tabs>
                    <!-- 圆形标记 -->
                    <el-tabs type="border-card" class="properties-tabs" v-show="navType==4">
                        <el-tab-pane label="标题">
                            <ul class="title-info">
                                <li>
                                    <p>圆边粗细：</p>
                                    <el-select v-model.number="propertiesData.strokeWidth" @change="changeBorder" size="small" style="width:100%">
                                        <el-option label="1px" value="1"/>
                                        <el-option label="2px" value="2"/>
                                        <el-option label="3px" value="3"/>
                                        <el-option label="4px" value="4"/>
                                    </el-select>
                                </li>
                                <li>
                                    <p>内容文本：</p>
                                    <el-input size="small" v-model.trim="propertiesData.circularText"></el-input>
                                </li>
                                <li>
                                    <p>内容文字字体：</p>
                                    <el-select v-model="propertiesData.family" size="small" style="width:100%">
                                        <el-option label="Comic Sans" value="Comic Sans"/>
                                    </el-select>
                                </li>
                                <li>
                                    <p>内容文字尺寸：</p>
                                    <el-select v-model="propertiesData.size" size="small" style="width:100%">
                                        <el-option label="18px" value="18"/>
                                        <el-option label="24px" value="24"/>
                                        <el-option label="28px" value="28"/>
                                    </el-select>
                                </li>
                                <li>
                                    <el-checkbox v-model="propertiesData.isCircularTitleWeight">
                                        <span class="hint">文字内容加粗</span>
                                    </el-checkbox>
                                </li>
                                <li>
                                    <el-button-group class="title-info-btn">
                                        <el-button type="success" icon="el-icon-sort" size="small">复 制</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small" @click="attributeDel">删 除</el-button>
                                    </el-button-group>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="内容">正在开发中...</el-tab-pane>
                        <el-tab-pane label="边框">正在开发中...</el-tab-pane>
                    </el-tabs>
                    <!-- 自定义文本 -->
                    <el-tabs type="border-card" class="properties-tabs" v-show="navType==8">
                        <el-tab-pane label="标题">
                            <ul class="title-info">
                                <li>
                                    <p>自定义文本：</p>
                                    <el-input size="small" type="textarea" :autosize="{ minRows: 6, maxRows: 6}" v-model="propertiesData.customText"></el-input>
                                </li>
                                <li>
                                    <div>
                                        <p>文字字体：</p>
                                        <el-select v-model="propertiesData.family" size="small" style="width:100%">
                                            <el-option label="Comic Sans" value="Comic Sans"/>
                                            <el-option label="arial black" value="arial black"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>文字尺寸：</p>
                                        <el-select v-model="propertiesData.size" @change="changeCustomSize" size="small" style="width:100%">
                                            <el-option label="14px" value="14"/>
                                            <el-option label="16px" value="16"/>
                                            <el-option label="18px" value="18"/>
                                            <el-option label="24px" value="24"/>
                                        </el-select>
                                    </div>
                                    <div>
                                        <p>文字行距：</p>
                                        <el-select v-model="propertiesData.lineheight" size="small" style="width:100%">
                                            <el-option label="1倍" value="1"/>
                                            <el-option label="2倍" value="2"/>
                                        </el-select>
                                    </div>
                                </li>
                                <li>
                                    <el-checkbox v-model="propertiesData.isCustomTitleWeight">
                                        <span class="hint">文字加粗</span>
                                    </el-checkbox>
                                </li>
                                <li>
                                    <el-card shadow="hover" style="background: #5ccfc71f">文字大小不能小于12px,否则打印显示异常!</el-card>
                                    <el-button-group class="title-info-btn">
                                        <el-button type="success" icon="el-icon-sort" size="small">复 制</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small" @click="attributeDel">删 除</el-button>
                                    </el-button-group>
                                </li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="内容">正在开发中...</el-tab-pane>
                        <el-tab-pane label="边框">正在开发中...</el-tab-pane>
                    </el-tabs>
                </div>
            </transition>
        </div>
        <!--  -->
        <!-- 画布 End -->
        <VueBarcode class="noprint" :value="barcodeVal" :options="barOptions" tag="img" id="barcode" v-if="isShowBarcode"/>
    </div>
</template>

<script>
/* eslint-disable */
import 'fabric';
import Vue from 'vue';
// import layoutLeftBar from './config/layoutLeftBar';
import VueBarcode from '@chenfengyuan/vue-barcode';

const IMGURL =
    'http://47.106.173.37/erp-product/files/resource/201943facesheet.png';

export default {
    components: {
        VueBarcode
    },
    inject: ['dialog'],
    props: {
        id: [String, Number]
    },
    data() {
        return {
            DialogVisible: this.dialog,
            barOptions: {
                displayValue: true,
                height: 32,
                // width: 1,
                margin: 3,
                textAlign: 'left',
                textPosition: 'top',
                fontOptions: 'normal',
                // background: '#faf9eb',
                textMargin: 3,
                fontSize: 12,
                text: '包裹号条码'
            },
            isShowBarcode: false,
            barcodeVal: '',
            fontOptionsWeight: '',
            shortcutKeys: false,
            propertiesRight: false,
            navType: 1,
            navTitle: '',
            leftLoading: true,
            fileList: [
                {
                    name: 'food.jpeg',
                    url:
                        'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }
            ],
            // 上工具栏数据
            topToolbarData: {
                tmplName: null, // 模板名称
                modelType: 1, // 编辑类型 1 发票 2 面单 3报关资料
                layoutWidth: 25, // 布局宽度 cm
                layoutHeight: 25, // 布局高度 cm
                specificationId: 10,
                defaultFlag: '0'
            },
            //右工具栏数据
            propertiesData: {
                showTitle: true, //标题是否显示
                titleText: '',
                family: 'Comic Sans',
                size: '14',
                lineheight: '1',
                showAllTitle: true, //标题是否显示全部
                isTitleWeight: false, //标题文字是否加粗
                //圆
                strokeWidth: 2,
                circularText: 'A',
                isCircularTitleWeight: false,
                //自定义
                customText: '',
                isCustomTitleWeight: false,
                //表格
                tableline: true,
                tableHeader: true,
                tableFamily: 'Comic Sans',
                tableHeaderSize: '14',
                tableContenfamily: 'Comic Sans',
                tableContenSize: '14',
                isShowfoot: true,
                tfootFamily: 'Comic Sans',
                tfootSize: '14'
            },
            // 编辑类型选项
            editOptions: [],
            //快捷键配置
            keyboardList: [
                { label: '上移', value: 'el-icon-arrow-up' },
                { label: '下移', value: 'el-icon-arrow-up' },
                { label: '左移', value: 'el-icon-arrow-up' },
                { label: '右移', value: 'el-icon-arrow-up' },
                { label: 'Delete', value: '或' },
                { label: 'Del', value: '删除' }
            ],
            // 画布左工具栏可操作选项
            layoutLeftBar: [],
            specificationList: [],
            //拖动时元素的xy
            dragDom: {
                clickX: 0,
                clickY: 0,
                width: 0,
                height: 0
            },
            /**
             * 业务数据
             */
            selection: null, // 画布中选中的元素
            headerCofig: [
                { label: 'name', value: 'name', width: 120 },
                { label: '数量', value: 'total', width: 100 },
                { label: '单价', value: 'price', width: 120 },
                { label: '产品总价', value: 'totalPrice', width: 125 }
            ],
            tableData: [
                {
                    total: '29',
                    totalPrice: '38.6',
                    price: '19.9',
                    name: 'name'
                },
                {
                    total: '15',
                    totalPrice: '99.00',
                    price: '123',
                    name: 'name1'
                }
            ],
            wmDocumentModelMId: '',
            isAdd: true,
            isCopy: false,
            strCopy: ''
        };
    },
    watch: {
        'propertiesData.titleText'(val) {
            // console.log('画布选中元素', this.selection[0]._objects);
            let [textBox, text] = this.selection[0]._objects;

            textBox.set('text', val);
            // text.set('left', textBox.width + 10);
            console.log('画布选中元素当前组', textBox, text);
            this.canvas.renderAll();
        },
        'propertiesData.isTitleWeight'(val) {
            let [textBox, text] = this.selection[0]._objects;
            textBox.set('fontWeight', val ? 'bold' : 'normal');
            this.canvas.renderAll();
        },
        //图形标记text
        'propertiesData.circularText'(val) {
            let [circular, text] = this.selection[0]._objects;
            text.set('text', val);
            this.canvas.renderAll();
        },
        //图形标记text加粗
        'propertiesData.isCircularTitleWeight'(bool) {
            let [circular, text] = this.selection[0]._objects;
            text.set('fontWeight', bool ? 'bold' : 'normal');
            this.canvas.renderAll();
        },
        //自定义
        'propertiesData.customText'(val) {
            let text = this.selection[0];
            text.set('text', val);
            this.canvas.renderAll();
        },
        'propertiesData.isCustomTitleWeight'(bool) {
            let text = this.selection[0];
            text.set('fontWeight', bool ? 'bold' : 'normal');
            this.canvas.renderAll();
        }
    },

    methods: {
        //添加打开
        addOpen() {
            //是否有缓存
            if (localStorage.getItem(this.$route.name + 'canvas')) {
                let {
                    defaultFlag,
                    modelContent,
                    modelLength,
                    modelWidth,
                    modelName,
                    modelType,
                    specificationId
                } = JSON.parse(
                    localStorage.getItem(this.$route.name + 'canvas')
                );
                let canvasOptions = modelContent;
                this.topToolbarData.defaultFlag = defaultFlag;
                this.topToolbarData.tmplName = modelName;
                this.topToolbarData.modelType = modelType;
                this.topToolbarData.specificationId = specificationId;
                this.topToolbarData.layoutHeight = modelLength;
                this.topToolbarData.layoutWidth = modelWidth;
                this.changeModelType(modelType);
                try {
                    this.canvas.loadFromJSON(canvasOptions);
                } catch (error) {
                    this.$message.error('初始话数据失败');
                }
            } else {
                let type = this.$route.name == 'invoice' ? 3 : 1;
                this.topToolbarData.modelType = type;
                this.changeModelType(type);
                this.resetCanvas();
            }
        },
        //修改类型 1 发票 2 面单 3报关资料
        changeModelType(modelType) {
            this.clearCanvas();
            this.$api['warehouse/WmDocumentGroupList']({
                modelType
            }).then(res => {
                this.layoutLeftBar = res.rows;
                this.leftLoading = false;
            });
        },
        //切换规格改变画布
        changeSpecifications(val) {
            let { width, height } = this.returnWh(val);
            this.topToolbarData.layoutWidth = width;
            this.topToolbarData.layoutHeight = height;
            this.canvas.setHeight(height * 25);
            this.canvas.setWidth(width * 35);
            this.clearCanvas();
        },
        //根据规格id返回宽高
        returnWh(num) {
            let width, height;
            switch (num) {
                case 1:
                    width = 10;
                    height = 10;
                    break;
                case 2:
                    width = 10;
                    height = 15;
                    break;
                case 3:
                    width = 21;
                    height = 29.7;
                    break;
                case 4:
                    width = 4;
                    height = 3;
                    break;
                case 5:
                    width = 5;
                    height = 2.5;
                    break;
                case 6:
                    width = 5;
                    height = 3;
                    break;
                case 7:
                    width = 8;
                    height = 3;
                    break;
                case 8:
                    width = 10;
                    height = 2.5;
                    break;
                case 9:
                    width = 10;
                    height = 3;
                    break;
                case 10:
                    width = 25;
                    height = 25;
                    break;
                default:
                    break;
            }
            return {
                width,
                height
            };
        },
        //获取规格
        getSpecifications() {
            this.$api['warehouse/getSpecificationsList']({}).then(res => {
                this.specificationList = res.rows.map(i => {
                    return {
                        label: i.name,
                        value: i.id
                    };
                });
            });
        },
        changeSize(size) {
            let [textBox, text] = this.selection[0]._objects;
            textBox.set('fontSize', size);
            this.canvas.renderAll();
        },
        changeBorder(num) {
            let [circular, text] = this.selection[0]._objects;
            circular.set('strokeWidth', num);
            this.canvas.renderAll();
        },
        changeCustomSize(size) {
            let text = this.selection[0];
            text.set('fontSize', size);
            this.canvas.renderAll();
        },
        //右边属性删除
        attributeDel() {
            let curel = this.selection[0];
            this.canvas.remove(curel);
            this.shortcutKeys = false;
            this.propertiesRight = false;
        },
        //右边属性复制

        // 初始化画布
        // 1cm = 25px  72分辨率下
        initCanvas(width, height, options = {}) {
            if (this.canvas) {
                this.unbindEvents();
            }
            this.canvas =
                this.canvas ||
                this.createCanvas({
                    ...options,
                    width: width * 35,
                    height: height * 25
                });
            // this.canvas.setDimensions({ width: width * 25, height: height * 25 })
            // 绑定拖放事件
            this.bindCanvasDragEvents();
            // 绑定选择事件
            this.bindCanvasSelection();
            // 绑定keyup事件
            this.bindCanvasKeyup();
            //绑定点击事件
            this.bindCanvasClick();

            // 载入边框
            this.loadCanvasBorder();
        },
        // 创建canvas
        createCanvas(options) {
            return new fabric.Canvas('canvas', options);
        },
        // 预览画布
        print() {
            window.print();
            // return;
            // const { href } = this.$router.resolve({
            //     name: 'faceSheetPrint',
            //     query: {
            //         width: this.topToolbarData.layoutWidth * 25,
            //         height: this.topToolbarData.layoutHeight * 25
            //     }
            // });
            // window.open(href, '_blank');
        },
        // 清除画布
        clearCanvas() {
            this.canvas.clear();
            this.loadCanvasBorder();
        },
        // 保存模板
        saveTmpl() {
            this.saveValidate().then(() => {
                if (this.isCopy) {
                    let url =
                        this.strCopy == '自定义'
                            ? 'wmDocumentModelMCopy'
                            : this.strCopy == '常用'
                            ? 'wmDocumentModelCopy'
                            : '';
                    let key =
                        this.strCopy == '常用'
                            ? 'wmDocumentModelId'
                            : 'wmDocumentModelMId';
                    let {
                        canvas,
                        topToolbarData: {
                            tmplName,
                            modelType,
                            specificationId,
                            layoutHeight,
                            layoutWidth,
                            defaultFlag
                        }
                    } = this;
                    let parameter = {
                        modelName: tmplName,
                        modelType: modelType,
                        defaultFlag:
                            defaultFlag == 'undefined' || defaultFlag == null
                                ? 0
                                : 1,
                        specificationId: specificationId,
                        modelLength: layoutHeight,
                        modelWidth: layoutWidth,
                        modelContent: JSON.stringify(
                            canvas.toObject([
                                'navType',
                                'selectable',
                                'tableList',
                                'barCode',
                                'barCodeText'
                            ])
                        )
                    };

                    this.$api[`warehouse/${url}`](
                        Object.assign(
                            {},
                            {
                                ...parameter,
                                [key]: this.wmDocumentModelMId
                            }
                        )
                    ).then(() => {
                        this.DialogVisible.visible = false;
                    });
                } else {
                    this.sendrequest();
                }

                localStorage.removeItem(this.$route.name + 'canvas');
            });
        },
        //重置所有
        resetCanvas() {
            this.$refs.form.resetFields();
            this.clearCanvas();
        },
        returnKeyUrl() {
            let key, url;
            if (this.isCopy) {
                if (this.strCopy == '自定义') {
                    key = 'wmDocumentModelMId';
                    url = 'WmDocumentModelMget';
                } else if (this.strCopy == '常用') {
                    key = 'wmDocumentModelId';
                    url = 'wmDocumentModelGet';
                }
            } else {
                key = 'wmDocumentModelMId';
                url = 'WmDocumentModelMget';
            }
            return { key, url };
        },
        //编辑 反系列化
        editContraryseries(wmDocumentModelMId) {
            let { key, url } = this.returnKeyUrl();
            this.wmDocumentModelMId = wmDocumentModelMId;
            this.$api['warehouse/' + url]({
                [key]: wmDocumentModelMId
            }).then(res => {
                let {
                    modelName,
                    modelType,
                    modelLength,
                    modelWidth,
                    specificationId,
                    modelContent,
                    defaultFlag
                } = res.rows;
                let canvasOptions = JSON.parse(modelContent);

                this.topToolbarData.defaultFlag = defaultFlag + '';
                this.topToolbarData.tmplName = this.isCopy ? '' : modelName;
                this.topToolbarData.modelType = modelType;
                this.topToolbarData.specificationId = specificationId;
                this.topToolbarData.layoutHeight = modelLength;
                this.topToolbarData.layoutWidth = modelWidth;

                this.canvas.loadFromJSON(canvasOptions);
            });
        },
        //请求后台
        sendrequest(cb) {
            let {
                canvas,
                topToolbarData: {
                    tmplName,
                    modelType,
                    specificationId,
                    layoutHeight,
                    layoutWidth,
                    defaultFlag
                }
            } = this;
            let parameter = {
                modelName: tmplName,
                modelType: modelType,
                defaultFlag:
                    Number(defaultFlag) == NaN ? 0 : Number(defaultFlag),
                specificationId: specificationId,
                modelLength: layoutHeight,
                modelWidth: layoutWidth,
                modelContent: JSON.stringify(
                    canvas.toObject([
                        'navType',
                        'selectable',
                        'tableList',
                        'barCode',
                        'barCodeText'
                    ])
                )
            };
            if (this.id) {
                parameter = Object.assign({}, parameter, {
                    wmDocumentModelMId: this.id
                });
            }
            this.$api['warehouse/WmDocumentModelMsave'](parameter).then(res => {
                this.$message.success(res.msg);
                cb && cb();
            });
        },
        //保存验证
        saveValidate() {
            return new Promise(resolve => {
                this.$refs.form.validate(valid => {
                    var items = this.canvas.getObjects();
                    if (valid) {
                        if (items.length > 1) {
                            resolve(valid);
                        } else {
                            this.$message.warning('画布空空如也');
                        }
                    } else {
                        return false;
                    }
                });
            });
        },
        // 保存并关闭
        saveAndClose() {
            this.saveValidate().then(() => {
                // this.sendrequest(() => {
                //     this.DialogVisible.visible = false;
                // });
                let {
                    canvas,
                    topToolbarData: {
                        tmplName,
                        modelType,
                        specificationId,
                        layoutHeight,
                        layoutWidth,
                        defaultFlag
                    }
                } = this;

                localStorage.setItem(
                    this.$route.name + 'canvas',
                    JSON.stringify({
                        modelName: tmplName,
                        modelType: modelType,
                        defaultFlag: defaultFlag,
                        specificationId: specificationId,
                        modelLength: layoutHeight,
                        modelWidth: layoutWidth,
                        modelContent: JSON.stringify(
                            canvas.toObject(['navType', 'selectable'])
                        )
                    })
                );
                this.DialogVisible.visible = false;
            });
        },
        //载入边框
        loadCanvasBorder() {
            let result = this.createRect({
                fill: '#faf9eb',
                width: this.canvas.width - 16,
                height: this.canvas.height - 16,
                strokeWidth: 2,
                stroke: '#333',
                left: 8,
                top: 8,
                selectable: false
            });
            this.canvas.add(result);
        },
        //创建矩形
        createRect(options = {}) {
            return new fabric.Rect(options);
        },

        //创建圆形
        createCircle({ radius, fill, originX, originY, strokeWidth, stroke }) {
            return new fabric.Circle({
                radius: radius,
                fill: fill ? fill : '#f8e1bf',
                originX: originX ? originX : 'center',
                originY: originY ? originY : 'center',
                strokeWidth: strokeWidth ? strokeWidth : 2,
                stroke: stroke ? stroke : '#333'
            });
        },

        //创建文字
        createText({ name, fontSize, originX, originY }) {
            return new fabric.Text(name, {
                fontSize: fontSize ? fontSize : 24,
                fontWeight: 'normal',
                originX: originX ? originX : 'center',
                originY: originY ? originY : 'center'
            });
        },

        //创建可编辑文字
        createTextBox({ name, left, top, fontFamily, fontSize, fontWeight }) {
            return new fabric.Textbox(name, {
                left: left < 0 ? 0 : left,
                top: top < 0 ? 0 : top,
                fontFamily: fontFamily ? fontFamily : 'Comic Sans',
                fontSize: fontSize ? fontSize : 18,
                fontWeight: fontWeight ? fontWeight : 'normal'
            });
        },

        //创建图片
        createImg({ url, left, top }, cb) {
            if (!url) return;
            fabric.Image.fromURL(url, function(img) {
                img.set({
                    left: left ? left : 0,
                    top: top ? top : 0
                });
                cb && cb(img);
            });
        },

        //创建条码
        createBarCode() {},

        //创建组
        createGroup(arr, { left, top }) {
            if (!Array.isArray(arr)) arr = [];
            return new fabric.Group(arr, {
                left: left ? left : 0,
                top: top ? top : 0
            });
        },

        //创建表格
        createTable(tHeader, tData, e) {
            if (!Array.isArray(tHeader) && !Array.isArray(tData)) return;
            let canvas = this.canvas;
            let vm = this;
            let { left, top } = canvas._offset;
            let { pageX, pageY } = e;
            let _data = vm.initTableData(tHeader, tData);
            _data.unshift(tHeader.map(item => item.label));
            //len表示表头有多少项
            let len = tHeader.length;

            let arr = _data.map((i, _dindex) => {
                //矩形数组
                let rectArr = [];
                //文字数组
                let textArr = [];
                //组合矩形文字
                let groupRtArr = [];
                i.forEach((j, jindex) => {
                    rectArr.push(
                        vm.createRect({
                            fill: '#fff',
                            width: (e.target.width - 36) / len,
                            height: 25,
                            originX: 'center',
                            originY: 'center',
                            strokeWidth: 1,
                            stroke: '#333'
                        })
                    );
                    textArr.push(
                        vm.createText({
                            name: j,
                            fontSize: 10
                        })
                    );
                    groupRtArr.push([rectArr[jindex], textArr[jindex]]);
                });
                //组合所有矩形
                let combination = groupRtArr.map((i, index) => {
                    return new fabric.Group(i, {
                        left: i[0].width * index,
                        top: 100
                    });
                });
                let result = new fabric.Group(combination, {
                    left: 10,
                    top: pageY - top + _dindex * 25
                });
                return result;
            });

            let result = new fabric.Group(arr, {
                left: 18,
                top: pageY - top
            });
            return result;
        },
        //
        initTableData(column, data) {
            //判断数据源和表头配置是否一致,系列化数据源
            let hval = column.map(i => i.value);
            let result = data.map(item => {
                let chaotic = [];
                for (let key in item) {
                    const vindex = hval.findIndex(j => j == key);
                    if (vindex != -1) {
                        chaotic.push({
                            value: item[key],
                            sort: vindex
                        });
                    }
                }
                //排序，表头配置一致返回渲染数据
                let result = chaotic
                    .sort((a, b) => {
                        var x = a.sort;
                        var y = b.sort;
                        return x < y ? -1 : x > y ? 1 : 0;
                    })
                    .map(i => i.value);
                return result;
            });
            return result;
        },
        /**
         *
         * 画布事件绑定
         *
         */

        // 绑定拖放事件
        bindCanvasDragEvents() {
            let canvas = this.canvas;
            canvas.on('dragover', this.handleDragover);
            canvas.on('drop', this.handleDrop);
        },
        // 解绑拖放事件
        unbindCanvasDragEvents() {
            let canvas = this.canvas;
            canvas.off('dragover', this.handleDragover);
            canvas.off('drop', this.handleDrop);
        },

        handleDragover({ e }) {
            e.preventDefault();
        },

        //拖动完成时
        handleDrop({ e }) {
            console.log('canvas', e);
            let canvas = this.canvas;
            let vm = this;
            let { left, top } = canvas._offset;
            let { pageX, pageY } = e;
            let eToCanvasLeft = pageX - left - this.dragDom.clickX;
            let eToCanvasTop = pageY - top - this.dragDom.clickY;
            let { name, type, value, children } = JSON.parse(
                e.dataTransfer.getData('elDom')
            );
            // debugger;
            vm.navTaype = type;
            let result = {};
            switch (type) {
                //文字可编辑
                case 1:
                    let textbox = vm.createTextBox({
                        name,
                        left: 0,
                        top: 0,
                        fontSize: 14,
                        fontWeight: 'normal',
                        fill: '#000'
                    });
                    let val = new fabric.Text(`${value}`, {
                        fontSize: 13,
                        left: textbox.width + 10,
                        width: 'auto',
                        top: 0,
                        fill: '#333'
                    });
                    result = vm.createGroup([textbox, val], {
                        left: eToCanvasLeft < 0 ? 18 : eToCanvasLeft,
                        top: eToCanvasTop < 0 ? 18 : eToCanvasTop
                    });

                    break;
                // 水平线;
                case 2:
                    result = vm.createRect({
                        left: 8,
                        top: pageY - top,
                        width: e.target.clientWidth - 16,
                        height: 1,
                        fill: '#000',
                        strokeWidth: 1,
                        stroke: '#333'
                        // selectable: false
                    });
                    break;
                //垂直线
                case 3:
                    result = vm.createRect({
                        left: pageX - left,
                        top: 8,
                        width: 1,
                        height: e.target.clientHeight - 16,
                        fill: '#000',
                        strokeWidth: 1,
                        stroke: '#333'
                        // selectable: false
                    });
                    break;
                //图形标记
                case 4:
                    let circle = vm.createCircle({ radius: 15 });
                    let text = vm.createText({ name: 'A' });
                    result = vm.createGroup([circle, text], {
                        left: pageX - left - 15,
                        top: pageY - top - 15
                    });
                    break;
                //图片
                case 5:
                    vm.createImg(
                        {
                            url: IMGURL,
                            left: pageX - left - 29,
                            top: pageY - top - 24
                        },
                        img => {
                            img['navType'] = type;
                            canvas.add(img);
                        }
                    );
                    return;
                //表格
                case 6:
                    //此处后端 的鬼数据格式 一万个草拟码
                    let headerCofig = children.children.map(item => {
                        return {
                            label: item.name,
                            value: item.value
                        };
                    });
                    let obj = {};
                    children.children.map(item => {
                        obj[item.value] = `${item.value}`;
                    });
                    result = vm.createTable(headerCofig, [obj], e);
                    result['tableList'] = value;
                    break;
                //条码
                case 7:
                    vm.isShowBarcode = true;
                    vm.barOptions.text = name;
                    vm.barcodeVal = '123456789';
                    vm.$nextTick(() => {
                        let codeDom = document.getElementById('barcode');
                        let url = codeDom.getAttribute('src');
                        vm.createImg(
                            {
                                url,
                                left: eToCanvasLeft,
                                top: eToCanvasTop
                            },
                            img => {
                                img['navType'] = type;
                                img['barCode'] = value;
                                img['barCodeText'] = name;
                                canvas.add(img);
                            }
                        );
                    });
                    return;
                //自定义文本
                case 8:
                    result = new fabric.IText('这是一段自定义文字', {
                        fontFamily: 'arial black',
                        fontSize: 14,
                        left: eToCanvasLeft < 0 ? 18 : eToCanvasLeft,
                        top: eToCanvasTop < 0 ? 18 : eToCanvasTop,
                        fontWeight: 'bold'
                    });
                    break;
                //图标元素
                case 9:
                    vm.createImg(
                        {
                            url: name,
                            left: eToCanvasLeft < 0 ? 18 : eToCanvasLeft,
                            top: eToCanvasTop < 0 ? 18 : eToCanvasTop
                        },
                        img => {
                            img['navType'] = type;
                            img.scale(0.9).set({
                                // height: vm.dragDom.height
                            });
                            canvas.add(img);
                        }
                    );
                    return;
            }
            result['navType'] = type;

            canvas.add(result);
        },

        // 绑定选择事件
        bindCanvasSelection() {
            let { canvas } = this;
            canvas.on('selection:updated', this.handleSelection);
            canvas.on('selection:created', this.handleSelection);
            canvas.on('selection:cleared', this.handleSelection);
        },

        // 解绑选择事件
        unbindCanvasSelection() {
            let { canvas } = this;
            canvas.off('selection:updated', this.handleSelection);
            canvas.off('selection:created', this.handleSelection);
            canvas.off('selection:cleared', this.handleSelection);
        },

        handleSelection(options) {
            this.selection = options.selected;
        },
        //绑定点击事件
        bindCanvasClick() {
            let { canvas } = this;
            canvas.on('mouse:down', this.handleBindCanvasClick);
        },
        handleBindCanvasClick(e) {
            let { canvas } = this;
            if (e.target && e.target.navType) {
                this.navType = e.target.navType;

                if (
                    this.navType != 2 &&
                    this.navType != 3 &&
                    this.navType != 9
                ) {
                    this.shortcutKeys = true;
                    this.propertiesRight = true;
                } else {
                    this.propertiesRight = false;
                }
                //
                switch (this.navType) {
                    case 1:
                        let {
                            text,
                            fontFamily,
                            fontSize,
                            fontWeight
                        } = e.target._objects[0];
                        this.propertiesData.titleText = text;
                        this.propertiesData.family = fontFamily;
                        this.propertiesData.size = fontSize + '';
                        this.propertiesData.isTitleWeight =
                            fontWeight == 'normal' ? false : true;

                        this.navTitle = text;
                        // console.log(e.target._objects[0]);

                        break;
                    case 4:
                        this.navTitle = '图形标记';
                        let [one, two] = e.target._objects;
                        this.propertiesData.circularText = two.text;
                        this.propertiesData.size = two.fontSize + '';
                        this.propertiesData.isTitleWeight =
                            two.fontWeight == 'normal' ? false : true;
                        this.propertiesData.strokeWidth = one.strokeWidth + '';
                        console.log(one, two);
                        break;
                    case 5:
                        this.navTitle = '本地图片';
                        // console.log(e.target);
                        break;
                    case 6:
                        this.navTitle = '产品信息';
                        console.log(e.target);
                        break;
                    case 7:
                        console.log(e.target);
                        break;
                    case 8:
                        this.navTitle = '自定义文本';
                        console.log(e.target);
                        this.propertiesData.family = e.target.fontFamily;
                        this.propertiesData.customText = e.target.text;
                        this.propertiesData.size = e.target.fontSize + '';
                        this.propertiesData.isCustomTitleWeight =
                            e.target.fontWeight == 'bold' ? true : false;
                        break;
                    case 9:
                        console.log(e.target);
                        break;
                    default:
                        break;
                }
                //
            } else {
                console.log(e.target);
                this.shortcutKeys = false;
                this.propertiesRight = false;
            }
        },
        //解除点击事件
        unbindCanvasClick() {
            let canvas = this.canvas;
            canvas.off('mouse:down', e => {
                e.stopPropagation();
            });
        },
        // 绑定keyup事件
        bindCanvasKeyup() {
            // console.log(this.canvas);
            document.addEventListener('keyup', this.handleBindCanvasKeyup);
        },

        handleBindCanvasKeyup(e) {
            let { canvas } = this;
            // console.log(e.keyCode);
            switch (e.keyCode) {
                case 46:
                    // delete键
                    if (this.selection) {
                        // this.selection.map(el => {
                        //     this.canvas.remove(el);
                        // });
                    }

                    break;

                default:
                    break;
            }
        },

        // 删除canva上的所有绑定事件及document上的绑定事件
        unbindEvents() {
            this.unbindCanvasDragEvents();
            this.unbindCanvasSelection();
            this.unbindCanvasClick();
            document.removeEventListener('keyup', this.handleBindCanvasKeyup);
        },

        /**
         *
         * 拖动排版逻辑
         *
         */
        drag(e, btn) {
            console.log(btn);
            // e.dataTransfer.setData('elDom', e.target.innerText);
            e.dataTransfer.setData('elDom', JSON.stringify(btn));
        },
        //鼠标按下
        mousedown(e) {
            const [x, y] = [e.clientX, e.clientY];
            const [x1, y1] = [e.offsetX, e.offsetY];
            const [nx, ny] = [x - x1, y - y1];
            const [sx, sy] = [x - nx, y - ny];
            this.dragDom.clickX = sx;
            this.dragDom.clickY = sy;
            this.dragDom.width = e.target.offsetWidth;
            this.dragDom.height = e.target.offsetHeight;
            // console.log('拖動元素距離的xy', nx, ny);
            // console.log('鼠标点击的', x, y);
            // console.log('鼠标点击元素的', sx, sy);
        }
    },
    mounted() {
        this.initCanvas(
            this.topToolbarData.layoutWidth,
            this.topToolbarData.layoutHeight
        );
        // this.changeModelType(1);
        this.getSpecifications();

        if (this.$route.name == 'faceSheet') {
            this.editOptions = [
                {
                    label: '面单',
                    value: 1
                },
                {
                    label: '报关资料',
                    value: 2
                }
            ];
        } else {
            this.editOptions = [
                {
                    label: '发票',
                    value: 3
                }
            ];
        }
    },
    beforeDestroy() {
        this.unbindEvents();
    }
};
</script>

<style lang='scss' >
@media print {
    .el-dialog__wrapper {
        display: block;
        width: 100%;
        height: 100%;
        .noprint {
            display: none !important;
        }
        .el-dialog__header {
            display: none;
        }
        .el-scrollbar {
            border: none !important;
            box-shadow: 0 0 !important;
        }
        .layout-right-properties {
            display: none !important;
        }
    }
}

$keyboardColor: #f8e1bf;
.el-scrollbar {
    border: 1px solid #ccc !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.editor-container {
    #barcode {
        position: absolute;
        top: 0;
        z-index: -99;
    }
    .top-toolbar {
        justify-content: space-between;
        .top-toolbar-layoutsize {
            .multiply {
                margin: 0 10px;
            }
        }
        .form {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            justify-content: space-between;
            padding-left: 10px;
            .form-item {
                display: flex;
                .el-input {
                    width: 80px;
                }
                .multiply {
                    margin-left: 5px;
                }
            }
        }
    }
    .layout-wrapper {
        position: relative;
        // margin-top: 20px;
        height: 100%;
        min-height: 755px;
        background: #3a4144;
        .canvas-wrapper {
            margin: auto;
            // background: #fff;
            // border-radius: 5px;
            // width: 50%;
            // height: 100%;

            //
            .canvas-container {
                margin: auto;
                background: #faf9eb;
                border-radius: 5px;
            }
        }
        .layout-left-toolbar,
        .layout-right-properties {
            position: absolute;
            top: 0;
            width: 240px;
            height: 100%;
            background: #fff;
            border: 2px solid #3a4144;
            box-sizing: border-box;
        }
        .layout-left-toolbar {
            left: 2px;
            border-left: none;
            .tool-btn-box {
                display: flex;
                flex-direction: column;
                padding: 12px;
                .tool-btn_warp {
                    position: relative;
                    margin-bottom: 10px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .tool-btn {
                        cursor: move;
                        user-select: none;
                        vertical-align: middle;
                        // text-align: center;
                        border: 1px solid #ddd;
                        background: #f2f2f2;
                        border-radius: 5px;
                        padding: 2px 6px;
                        font-weight: bold;
                        font-size: 14px;
                        color: #666;
                        text-shadow: 0 2px 0 #fff;
                        padding-left: 20px;
                    }
                    i {
                        position: absolute;
                        top: 4px;
                        left: 5px;
                        vertical-align: middle;
                        font-weight: normal;
                        font-size: 13px;
                        margin-right: 2px;
                    }
                }
                .logisticsLogo {
                    height: 60px;
                    width: 100%;
                    background-size: contain;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    margin-bottom: 10px;
                    background-repeat: no-repeat;
                    background-position: center;
                    &:hover {
                        cursor: move;
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                .composition-elements {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    .composition-elements-item {
                        position: relative;
                        margin-left: 10px;
                        margin-bottom: 10px;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .text {
                            cursor: move;
                            padding: 25px 10px 5px 10px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            background: #f2f2f2;
                        }
                        .icon {
                            // cursor: move;
                            user-select: none;
                            position: absolute;
                            left: 50%;
                            top: 5px;
                            transform: translateX(-50%);
                            font-size: 14px;
                        }
                    }
                }
            }
            .keyboard-shortcuts {
                position: absolute;
                right: -190px;
                bottom: 20px;
                padding: 10px;
                width: 150px;
                border-radius: 6px;
                background: $keyboardColor;
                box-shadow: 0 2px 7px 0 #b8b8b87d;
                .keyboard-title {
                    display: flex;
                    justify-content: space-between;
                    span,
                    i {
                        font-size: 14px;
                        font-weight: 700;
                    }
                    i {
                        cursor: pointer;
                    }
                }
                .keyboard-list {
                    .keyboard-item {
                        display: flex;
                        padding-top: 10px;
                        i {
                            padding: 2px 3px;
                            border: 1px solid #888787;
                            border-radius: 2px;
                            margin-right: 10px;
                            font-size: 15px;
                            font-weight: 700;
                            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.97);
                        }
                        .text {
                            line-height: 24px;
                        }
                    }
                }
            }
        }
        .layout-right-properties {
            right: 2px;
            border-right: none;
            padding: 0 1px;
            display: flex;
            width: 320px;
            flex-direction: column;
            .properties-title {
                margin: 0;
                height: 45px;
                line-height: 45px;
                text-indent: 15px;
                background: #ece9e9;
            }
            .properties-tabs {
                flex: 1;
                display: flex;
                flex-direction: column;
                .el-tabs__content {
                    flex: 1;
                    overflow-y: auto;
                }
                .title-info {
                    li {
                        margin-bottom: 10px;
                        .hint {
                            font-weight: 700;
                        }
                        &:last-child {
                            margin-top: 25px;
                            .title-info-btn {
                                margin: 20px 0 0 25%;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.editor-container {
    z-index: 33333;
    .el-collapse-item__header {
        font-size: 14px;
        background: #f6f6f6;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        &.is-active {
            border-bottom: 1px solid #ebeef5;
        }
    }
    .el-collapse-item__content {
        padding-bottom: 0px;
    }
}
</style>

<style lang="scss" scope>
.upload {
    width: 100%;
    .el-upload {
        width: 100%;
    }
    .el-upload-dragger {
        width: 100%;
    }
}

.propertiesRight-enter-active,
.propertiesRight-leave-active {
    transition: all 0.5s ease-out;
}
.propertiesRight-enter {
    transform: translateX(320px);
}
.propertiesRight-leave-active {
    transform: translateX(320px);
}
</style>