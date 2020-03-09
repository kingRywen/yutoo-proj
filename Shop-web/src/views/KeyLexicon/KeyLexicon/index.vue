<template>
 <div>
    <div class="box ___common" v-if='$route.name==="keyLexiconKey"'>
      <div class="c-btn" @click="setShow()" :style="position">
        <i :class="icon"></i>
      </div>
      <!-- 根据需求自定义的返回按钮 -->
      <ElButton
        @click.stop="backBtn"
        type="text"
        v-if="backBtnShow"
        icon="el-icon-back"
        style="position:absolute;right:26px;top:6px;"
      >返回</ElButton>
      <div class="box-body">
        <div class="menu" v-show="isShow">
          <div class="div-cascader">
            <el-cascader
              placeholder="选择类目"
              :options="cusCateIdOptions"
              :props="defaultCategoryProps"
              v-model="cusCateIdArray"
              @change="changeCusCateId"
              filterable
              size="mini"
            ></el-cascader>
            <!-- <el-select v-model="cusCateId" placeholder="请选择" @change="changeCusCateId" size="mini" class="cus-cate-id">
              <el-option v-for="item in cusCateIdOptions" :key="item.cusCateId" :label="item.cusCateName" :value="item.cusCateId"></el-option>
            </el-select>-->
          </div>
          <div class="handleBtn">
            <el-button-group class="btn-icon">
              <el-tooltip class="item" effect="light" content="刷新类目词库" placement="bottom" :open-delay="1000">
                <el-button type="text" icon="el-icon-refresh" @click.stop="refreshGetCategoryKeywordList"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="添加类目" placement="bottom" :open-delay="1000">
                <el-button
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  @click.stop="customCategoryOptions.visible = true"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除类目词库" placement="bottom" :open-delay="1000">
                <el-button type="text" icon="el-icon-delete" @click.stop="showCustomCategoryDelDialog"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="设置标题卖点策略" placement="bottom" :open-delay="1000">
                <el-button type="text" icon="el-icon-document" @click.stop="showProductStrategyDialog"></el-button>
              </el-tooltip>
            </el-button-group>
          </div>


          <el-tabs class="keyLexicon-tab" v-model="activeName" @tab-click="handleTabsClick" v-show="cusCateId!=null">

            <el-tab-pane label="类目词库" name="category">
              <el-tree
                :default-expanded-keys="defaultExpanded"
                :current-node-key="currentNodeKey"
                @node-expand="handleNodeExpand"
                :data="categoryTree"
                ref="categoryTree"
                node-key="id"
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleCategoryNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <!-- todo -->
                    <el-button
                      v-if="showEditBtn(data.id)"
                      type="text"
                      size="mini"
                      icon="el-icon-edit"
                      @click.stop="() => showEditParamsDialog(data,'cate')"
                    ></el-button>
                  </span>
                </span>
              </el-tree>
            </el-tab-pane>

            <el-tab-pane label="产品词库" name="product">
              <el-button-group class="btn-icon btn-icon-product">
                <el-tooltip class="item" effect="light" content="添加产品词库" placement="top" :open-delay="500">
                  <el-button type="text" icon="el-icon-circle-plus-outline" @click="showProductAddDialog"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除产品词库" placement="top" :open-delay="500">
                  <el-button type="text" icon="el-icon-delete" @click="showCustomProductDelDialog"></el-button>
                </el-tooltip>
              </el-button-group>

              <div class="div-cascader" style="margin-bottom: 10px;">
                <!-- <el-cascader
                        placeholder="选择商品"
                        :options="options"
                        filterable
                        change-on-select
                        size="mini">
                </el-cascader>-->
                <!-- <el-autocomplete
                  class="autocomplete-product-id"
                  v-model="autocomplete.productId"
                  :fetch-suggestions="querySearch"
                  :hide-loading ="true"
                  placeholder="请输入内容"
                  size="mini"
                  @select="changeProductId"
                ></el-autocomplete>-->
                <el-select
                  v-model="autocomplete.productId"
                  filterable
                  placeholder="请输入内容或选择"
                  size="mini"
                  @change="changeProductId"
                  class="select-product-id"
                >
                  <el-option
                    v-for="item in productRestaurants"
                    :key="item.productId"
                    :label="item.sku"
                    :value="item.productId"
                  ></el-option>
                </el-select>
              </div>

              <el-tree
                v-show="autocomplete.productId!==null"
                :default-expanded-keys="defaultExpandedPro"
                :current-node-key="currentNodeKeyPro"
                @node-expand="handleNodeExpand"
                :data="productTree"
                ref="productTree"
                node-key="id"
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleProductNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      v-if="showEditBtn(data.id)"
                      type="text"
                      size="mini"
                      icon="el-icon-edit"
                      @click.stop="() => showEditParamsDialog(data,'prod')"
                    ></el-button>
                  </span>
                </span>
              </el-tree>
            </el-tab-pane>


          </el-tabs>
        </div>



        <div class="body">
          <component :is="componentName" :p-params="pParams" @setMenuClose="val => isShow = val" :key="keyRandom"></component>
        </div>
      </div>


      <yt-dialog :options="editRuleOptions" :events="editRule" class="product-lexicon-dialog __ruleinput">
        <!-- <div style="height:30px;line-height:26px;margin-right:10px;font-size:12px;">公式 : </div> -->
        <div class="draggable" v-loading="loading_" v-if="formulaParamBtns">
          <div v-for="(item,index) in formulaParamBtns" :key="index" class="formula-btn">
            <div class="btn-txt">{{item.displayName}}</div>
            <div class="item-symbol" v-if="item.fieldKey!=='symbol'">
              <el-select
                v-model="item.value"
                placeholder="符号"
                size="mini"
                style="width:55px;"
                :clearable="true"
                :disabled="true"
              >
                <el-option v-for="el in item.selects" :key="el.value" :label="el.label" :value="el.value"></el-option>
              </el-select>
            </div>
            <div class="item-symbol" v-if="item.fieldKey!=='symbol'">
              <el-input size="mini" placeholder="值" v-model.trim="item.inputValue" style="width:50px;">
                <template v-if="item.fieldKey&&item.fieldKey.includes('_rates')" slot="append">%</template>
              </el-input>
            </div>
          </div>
        </div>
        <div v-else style="height: 100vh;line-height:60vh;margin-right:10px;font-size:12px;">暂无数据</div>
      </yt-dialog>

      <yt-dialog :options="productOptions" :events="productEvents" class="product-lexicon-dialog">
        <el-form size="small" label-position="right" label-width="100px" :model="formProduct" ref="ruleFormProduct">
          <el-form-item
            label="商品SKU:"
            :rules="[{ required: true, message: '商品SKU不能为空',trigger: 'change'}]"
            prop="productId"
          >
            <!-- 可选可输入 -->
            <!-- <el-autocomplete
              class="inline-input"
              v-model="formProduct.asin"
              :fetch-suggestions="querySearchProductId"
              :hide-loading ="true"
              placeholder="请输入内容"
              size="mini"
            ></el-autocomplete>-->
            <el-select
              v-model="formProduct.productId"
              filterable
              @visible-change="handleVisibleChange"
              placeholder="请输入内容或选择"
              size="mini"
              @change="setCustomName"
            >
              <el-option
                v-for="item in filteredOptions"
                :key="item.productId"
                :label="item.value"
                :value="item.productId"
              ></el-option>
            </el-select>
            <!--
                          :trigger-on-focus="false"
            -->
          </el-form-item>

          <el-form-item label="词库名称:" prop="customName">
            <el-input v-model.trim="formProduct.customName" size="mini"></el-input>
          </el-form-item>
          <!-- <div class="formula-box">
                <div class="item-1">计算公式参数:</div>
                <div class="item-title">名称</div>
                <div class="item-title">公式</div>
                <div class="item-title">自定义参数</div>

                <div class="item-label">核心词</div>
                <div class="item-label">展现量+点击量&gt;=</div>
                <div class="item-input">
                  <el-form-item>
                      <el-input v-model="formVie.value2" size="mini"></el-input>
                  </el-form-item>
                </div>
                <div class="item-label">按竞争分高</div>
                <div class="item-label">点击量&gt;=</div>
                <div class="item-input">
                  <el-form-item>
                      <el-input v-model="formVie.value2" size="mini"></el-input>
                  </el-form-item>
                </div>

                <div class="item-label">按竞争分中</div>
                <div class="item-label">点击量&gt;=</div>
                <div class="item-input">
                  <el-form-item>
                      <el-input v-model="formVie.value2" size="mini"></el-input>
                  </el-form-item>
                </div>
                <div class="item-label">按竞争分低</div>
                <div class="item-label">点击量&gt;=</div>
                <div class="item-input">
                  <el-form-item>
                      <el-input v-model="formVie.value2" size="mini"></el-input>
                  </el-form-item>
                </div>
          </div>-->
        </el-form>
      </yt-dialog>

      <yt-dialog :options="customCategoryDelOptions" :events="customCategoryDelEvents" class="del-table-dialog">
        <!-- <el-tree
          :data="categoryOptions"
          ref="cusCateIdTree"
          node-key="cusCateId"
          accordion
          default-expand-all
          highlight-current
          :expand-on-click-node="true"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                v-if="showDelCusCateIdBtn(data)"
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click.stop="() => delCusCateId(data)"
              ></el-button>
            </span>
          </span>
        </el-tree>-->
        <!-- ref="multipleTableCustomCategoryDel"
        @selection-change="handleSelectionCustomCategoryDelChange"-->
        <div style="display:flex;justify-content: flex-end;">
          <el-button type="primary" plain size="mini" @click="delCusCateId(null)">删除</el-button>
        </div>
        <!-- <el-table
          :data="cusCateIdOptions"
          style="width: 100%;margin-bottom: 10px;margin-top: 10px;"
          tooltip-effect="light"
          @selection-change="handleCusCateIdSelectionChange"
          ref="multipleCusCateIdTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="cusCateName" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column width="55" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-delete" @click="delCusCateId(scope.row.cusCateId)"></el-button>
            </template>
          </el-table-column>
        </el-table>-->
        <yt-table
          v-if='customCategoryDelOptions.visible'
          :treeTable="treeTable"
          :treeTableOtions="treeTableOtions"
          :data="cusCateIdOptionsTable"
          @select="handleSelect"
          :columns="columns"
          border
          :expandAll="true"
          :reserveSelection='"cusCateId"'
          style="margin-top:10px;"
          @selectChange="handleCusCateIdSelectionChange"
          ref="table"
        >
          <template slot="right">
            <el-table-column label="操作" v-if="edits.length">
              <template slot-scope="scope">
                <template v-for="(item, index) in edits">
                  <template v-if="typeof item.show === 'boolean' ? item.show : item.show(scope)">
                    <template v-if="!item.childs">
                      <el-button
                        v-if="!item.icon"
                        class="right-btns"
                        type="text"
                        :key="index"
                        @click="item.fn(scope, item)"
                        :icon="item.icon"
                      >item.name</el-button>
                      <el-tooltip v-else :content="item.name" placement="top">
                        <el-button
                          class="right-btns"
                          type="text"
                          :key="index"
                          @click="item.fn(scope, item)"
                          :icon="item.icon"
                        ></el-button>
                      </el-tooltip>
                    </template>

                    <el-button
                      type="text"
                      v-else-if="(item.childs(scope)).length === 1"
                      :key="index"
                      @click="item.fn(scope, item, (item.childs(scope))[0].name,(item.childs(scope))[0].value)"
                    >{{(item.childs(scope))[0].name}}</el-button>

                    <el-dropdown
                      v-else-if="(item.childs(scope)).length !== 0"
                      split-button
                      type="text"
                      @click="item.fn(scope, item,item.name)"
                      @command="c => item.fn(scope, item,c)"
                    >
                      {{(item.childs(scope))[0].name}}
                      <el-dropdown-menu slot="dropdown">
                        <template v-for="(i, subIndex) in (item.childs(scope))">
                          <el-dropdown-item v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
        </yt-table>
      </yt-dialog>

      <yt-dialog :options="customProductDelOptions" :events="customProductDelEvents" class="del-table-dialog">
        <!-- <div class="all-del-btn">
          <el-button type="primary" plain size="mini">删除</el-button>
        </div>-->
        <div style="display:flex;justify-content: flex-end;">
          <el-button type="primary" plain size="mini" @click="deleteProductRows(null)">删除</el-button>
        </div>
        <el-table
          :data="productRestaurants"
          tooltip-effect="light"
          style="width: 100%;margin-bottom: 10px;margin-top: 10px;"
          @selection-change="handleCusProductSelectionChange"
          ref="multipleProductTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="customName" label="名称"></el-table-column>
          <!-- <el-table-column prop="asin" label="ASIN"></el-table-column> -->
          <el-table-column width="55" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteProductRows(scope.row.productId)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </yt-dialog>

      <yt-dialog :options="customCategoryOptions" :events="customCategoryEvents" class="custom-category-dialog">
        <el-form size="small" label-position="right" label-width="80px" :model="formCustomCategory">
          <el-form-item label="选择类目:">
            <el-cascader
              style='width:320px;'
              placeholder="选择类目"
              v-if='customCategoryOptions.visible'
              :options="categoryOptions"
              :props="defaultCategoryProps"
              v-model="formCustomCategoryCusCateId"
              filterable
              size="small"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </yt-dialog>

      <yt-dialog :options="productStrategyOptions" :events="productStrategyEvents">
        <el-form size="small" label-position="right" label-width="70px" :model="formProductStrategy">
          <el-form-item label="核心词">
            <el-select v-model="formProductStrategy.coreRuleId" placeholder="请选择" clearable size="mini">
              <el-option
                v-for="item in coreRuleIdOptions"
                :key="item.ruleId+'_core'"
                :label="item.ruleName"
                :value="item.ruleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="长尾词">
            <el-select v-model="formProductStrategy.longRuleId" placeholder="请选择" clearable size="mini">
              <el-option
                v-for="item in longRuleIdOptions"
                :key="item.ruleId+'_long'"
                :label="item.ruleName"
                :value="item.ruleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="其他词">
            <el-select v-model="formProductStrategy.otherRuleId" placeholder="请选择" clearable size="mini">
              <el-option
                v-for="item in otherRuleIdOptions"
                :key="item.ruleId+'_other'"
                :label="item.ruleName"
                :value="item.ruleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </yt-dialog>

      <!-- <el-dialog title="外层 Dialog" :visible.sync="productStrategyEditVisible">
        <el-dialog width="30%" title="内层 Dialog" :visible.sync="productStrategyEditInnerVisible" append-to-body></el-dialog>

        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
        </div>
      </el-dialog>-->
      <!-- <yt-dialog :options="editParamsOptions" :events="editParamsEvents" class="edit-params-dialog">
        <div class="item-title">
          <div class="column-1">名称</div>
          <div class="column-2">自定义参数</div>
        </div>
        <el-form size="small" label-position="right" label-width="100px" :model="formEditParams">
          <el-form-item label="展现量>=">
            <el-input v-model="formEditParams.value1" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="展现量>=">
            <el-input v-model="formEditParams.value2" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="展现量>=">
            <el-input v-model="formEditParams.value3" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="展现量>=">
            <el-input v-model="formEditParams.value4" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </yt-dialog>-->
    </div>
    <router-view v-else />
  </div>

 
</template>

<script>
import {
  Attribute,
  OnlineRelatedWords,
  NegateWords,
  EtymaValid,
  EtymaInvalid,
  AdRelatedWords,
  Unscreened,
  AdAsin,
  Brand,
  NoKeyLexicon,
  KeywordManagement,
  NegativeWordSelectionPage
} from './include'
import { CategoryTreeData, ProductTreeData } from './treeData'
import { deepFind } from 'Utils/tools'
import storage from 'Utils/saver'
// import func from '../../../../vue-temp/vue-editor-bridge';
export default {
  components: {
    Attribute,
    OnlineRelatedWords,
    NegateWords,
    EtymaValid,
    EtymaInvalid,
    AdRelatedWords,
    Unscreened,
    AdAsin,
    Brand,
    NoKeyLexicon,
    KeywordManagement,
    NegativeWordSelectionPage
  },
  data() {
    return {
      currentNodeKey: null,
      defaultExpanded: [],
      currentNodeKeyPro: null,
      defaultExpandedPro: [],
      treeTable: true,
      treeTableOtions: {
        childs: 'childList',
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      columns: [
        {
          label: '名称',
          value: 'cusCateName',
          expand: true,
          width: '300px'
        }
      ],
      //表格列表操作按钮
      edits: [
        {
          name: '删除',
          icon: 'el-icon-delete',
          fontSize: '16px',
          show: scope => {
            //console.log(scope);
            return  true //!scope.row.childList
          },
          fn: scope => {
            return this.delCusCateId(scope.row.cusCateId,scope.row)
          }
        }
      ],
      editWidth: '',
      backBtnShow: false,
      cusCateIdArray: [],
      activeName: 'category',
      pParams: {
        type: 'category',
        treeId: null,
        cusCateId: null,
        productId: null
      },
      isShow: true,
      icon: 'el-icon-caret-left',
      position: {
        position: 'absolute',
        top: '400px',
        left: '13px', // 默认开启
        color: '#108ee9'
      },
      keyRandom: Date.now(),
      componentName: 'noKeyLexicon',
      categoryTree: JSON.parse(JSON.stringify(CategoryTreeData)),
      productTree: JSON.parse(JSON.stringify(ProductTreeData)),

      cusCateIdOptions: [],
      cusCateIdOptionsTable: [],
      autocomplete: {
        productId: null
      },
      productOptions: {
        visible: false,
        // width:'650px',
        width: '380px',
        title: '添加产品词库',
        okBtnText: '确认'
      },
      productEvents: {
        handleOkClick: () => {
          this.submitProductForm()
        }
      },
      editRuleOptions: {
        visible: false,
        width: '500px',
        title: '编辑参数',
        okBtnText: '确认'
      },
      editRule: {
        handleOkClick: () => {
          this.editRuleFun()
        }
      },
      formProduct: {
        // asin: null,
        siteId: null,
        cusCateId: null,
        productId: null,
        customName: null
      },
      productRestaurants: [],
      productAddRestaurants: [],
      filteredOptions: [],

      customCategoryDelOptions: {
        visible: false,
        width: '500px',
        title: '删除类目词库',
        //okBtnText: '关闭'
        showFooter: false
      },
      customCategoryDelEvents: {
        handleOkClick: () => {
          this.customCategoryDelOptions.visible = false
        }
      },
      customProductDelOptions: {
        visible: false,
        width: '350px',
        title: '删除产品词库',
        okBtnText: '关闭',
        showFooter: false
      },
      customProductDelEvents: {
        handleOkClick: () => {
          this.customProductDelOptions.visible = false
        }
      },
      customCategoryOptions: {
        visible: false,
        width: '500px',
        title: '添加类目',
        okBtnText: '确认'
      },
      customCategoryEvents: {
        handleOkClick: () => {
          this.submitCustomCategoryForm()
        }
      },
      isQueryPcid: true,
      formCustomCategoryCusCateId: [],
      formCustomCategory: {
        sellerId: null,
        cusCateId: null,
        siteId: null
      },
      coreRuleIdOptions: [],
      longRuleIdOptions: [],
      otherRuleIdOptions: [],
      productStrategyOptions: {
        visible: false,
        width: '350px',
        title: '设置标题卖点策略',
        okBtnText: '确认'
      },
      productStrategyEvents: {
        handleOkClick: () => {
          this.submitProductStrategy()
        }
      },
      formProductStrategy: {
        cusCateId: null,
        coreRuleId: null,
        longRuleId: null,
        otherRuleId: null
      },
      // productStrategyEditVisible: false,
      // productStrategyEditInnerVisible: false,

      // editParamsOptions: {
      //   visible: false,
      //   width: "350px",
      //   title: "编辑参数",
      //   okBtnText: "确认"
      // },
      // editParamsEvents: {
      //   handleOkClick: () => {
      //     this.vieOptions.visible = false;
      //   }
      // },
      // formEditParams: {
      //   value1: null,
      //   value2: null,
      //   value3: null,
      //   value4: null
      // },
      defaultCategoryProps: {
        children: 'childList',
        label: 'cusCateName',
        value: 'cusCateId'
      },
      customCategoryListQuery: {
        sellerId: null,
        haveChildren: 0,
        siteId: null
      },
      categoryOptions: [],
      // cusCateId: null,
      defaultProps: {
        children: 'childList',
        label: 'cusCateName'
      },
      formulaParamList: [],
      formulaParamBtns: [],
      selects: [
        {
          value: '<',
          label: '<'
        },
        {
          value: '>',
          label: '>'
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
        },

        {
          value: '==',
          label: '='
        }
      ],
      // value: ""
      i: 0,
      edit: {},
      loading_: false,
      multipleCusCateIdSelection: [],
      multipleProductSelection: [],

      currentRow:null,//要删除的当前的数据
    }
  },
  computed: {
    cusCateId() {
      // get() {
      //   return typeof this.cusCateIdArray === 'number'
      //     ? this.cusCateIdArray
      //     : this.cusCateIdArray.slice(0).pop()
      // },
      // set(val) {
      //   this.cusCateIdArray = [val]
      //   return

      //   if (!val) {
      //     this.cusCateIdArray = []
      //     return
      //   }
      //   this.cusCateIdArray = val
      // }
      let id = JSON.parse(JSON.stringify(this.cusCateIdArray))
      return id.pop()
    }
  },
  mounted(){
	this.$nextTick(function(){
		if(this.cusCateId) this.getListForProduct(null)	
	})  
  },
  created() {
    if (storage.get('session', 'sellerId') && this.$store.state.common.sellerData.sellerId && storage.get('session', 'sellerId') !== this.$store.state.common.sellerData.sellerId) {
      this.setCache(true)
    }
 
    this.backBtnShow = this.$route.query.backBtnShow
    if (this.sellerId && this.siteId) {
      // debugger
      this.getCategoryKeywordList()
      //this.getCustomCategoryList()
    }
    this.setCache()
  },
  watch: {
    productAddRestaurants: {
      immediate: true,
      handler(val) {
        this.filteredOptions = val
      }
    },
    sellerId() {
      this.cusCateId = null
      // this.setCache(true)
      this.getCategoryKeywordList()
    },
    'customCategoryDelOptions.visible'(){
        this.multipleCusCateIdSelection = []
        if( this.$route.query.cusCateIds && !this.customCategoryDelOptions.visible ){
            this.$router.replace('/keyLexicon/key')
        }
    }
  },
  methods: {
    setCache(clear) {
      console.log(clear);
      
      let cached = [
        'cusCateIdArray',
        'activeName',
        'pParams',
        'componentName',
        'defaultExpanded',
        'currentNodeKey',
        'currentNodeKeyPro',
        'defaultExpandedPro'
      ]
      cached.forEach(name => {
        if (clear) {
          storage.set('session', name, null)
        } else {
          let value = storage.get('session', name)
        if (value != null) {
          this[name] = value
        }
        }
        
      })
    },
    handleSelect(select, row) {
      let vm = this
      if (row.childList) {
        this.setToggleRowSelection(row.childList)
      }
    },
    setToggleRowSelection(data) {
      let vm = this
      data.forEach(i => {
        vm.$refs.table.$refs.table.toggleRowSelection(i)
        if (i.childList) {
          this.setToggleRowSelection(i.childList)
        }
      })
    },
    backBtn() {
      this.$router.go(-1)
    },
    handleFilterMethod(val, arr) {
      if (val.trim() === '') {
        this.filteredOptions = this.productAddRestaurants
        return
      }
      this.filteredOptions = this.productAddRestaurants.filter(
        el =>
          el.value.toLowerCase().indexOf(
            val
              .trim()
              .replace(' ', '')
              .toLowerCase()
          ) > -1
      )
    },
    handleVisibleChange() {
      this.filteredOptions = this.productAddRestaurants
    },
    changeProductPage(params) {
      let { cusCateId, productId, customName } = params
      
      if (
        cusCateId === null ||
        productId === undefined ||
        productId === null ||
        productId === undefined
      ) {
        // this.$message.warning('参数无效')
        return
      }
      cusCateId = +cusCateId
      productId = +productId
      let arr = deepFind(
        this.cusCateIdOptions,
        (item, index, level) => item.cusCateId === cusCateId,
        'childList'
      )
      let cusArr = arr.map(e => e.cusCateId)
      let firstArr = cusArr
      console.log(cusArr)
      if (cusArr.length > 1) {
        this.cusCateIdArray = firstArr
      } else {
        this.cusCateIdArray = cusArr
      }

      this.pParams.cusCateId = cusCateId
      this.activeName = 'product'
      this.getListForProduct(productId)
    },
    handleTabsClick(tab, event) {
      this.saveCacheUserSelect('activeName', this.activeName)
      this.componentName = 'noKeyLexicon'
      this.$refs.categoryTree.setCurrentKey(null)
      this.$refs.productTree.setCurrentKey(null)
      if (tab.name === 'product') {
        this.getListForProduct(null)
      }
    },
    showEditBtn(id) {
      if (
        id === 5 ||
        id === 6 ||
        id === 9 ||
        id === 10 ||
        // id === 11 ||
        id === 31
      ) {
        return true
      } else {
        return false
      }
    },
    setShow(show) {
      this.isShow = !this.isShow
      if (show) {
        this.isShow = false
        this.icon = 'el-icon-caret-right'
        this.position.left = '13px'
        return
      }
      if (this.isShow) {
        this.icon = 'el-icon-caret-left'
        this.position.left = '13px'
      } else {
        this.icon = 'el-icon-caret-right'
        this.position.left = '13px'
      }
    },
    //   console.log('---------------------6666666666');
    //   console.log(data);

    //   this.handleNodeClick("category", data);
    // },
    handleNodeExpand(data) {
      let name =
        this.activeName == 'product' ? 'defaultExpandedPro' : 'defaultExpanded'
      let expanded = storage.get('session', name) || []
      expanded.push(data.id)
      expanded = [...new Set(expanded)]
      this.saveCacheUserSelect(name, expanded)
      // this.saveCacheUserSelect()
    },
    //类目词库点击节点
    handleCategoryNodeClick(data) {
      this.handleNodeClick('category', data)
    },
    //产品词库点击节点
    handleProductNodeClick(data) {
      this.handleNodeClick('product', data)
    },
    handleNodeClick(type, data) {
      //console.log(data);
      this.pParams.type = type
      let page = data.page
      if (page !== null) {
        this.componentName = page
        this.keyRandom = Date.now()
        //this.pParams.treeId = data.id
        this.$set(this.pParams, 'treeId', data.id)
        console.log(page +'页面名字')
        //console.log(data.id)
        console.log(this.pParams.treeId +"树形id")
      }
      this.$nextTick(() => {
        //存储选择组件的名字 和 参数
        this.saveCacheUserSelect('pParams', this.pParams)
        this.saveCacheUserSelect('componentName', this.componentName)
        this.saveCacheUserSelect(
          type == 'category' ? 'currentNodeKey' : 'currentNodeKeyPro',
          data.id
        )
      })
    },
    //类目刷新
    refreshGetCategoryKeywordList() {

      this.getCategoryKeywordList()
    },
    //获取添加过的类目
    getCategoryKeywordList() {
      this.$api['categoryKeywordListForCategory']({
        siteId: this.siteId,
        sellerId: this.sellerId
      }).then(res => {
        let { code, data } = res
        if (code === 0) {
          this.cusCateIdOptions = data
          if (
            !(JSON.stringify(this.$route.query) === '{}') &&
            this.isQueryPcid
          ) {
            this.isQueryPcid = false
            this.changeProductPage(this.$route.query)
          }
          this.getCustomCategoryList()
          this.cusCateIdOptionsTable = this.cusCateIdOptions
          if (this.$route.query.cusCateIds) {

            let ids = this.$route.query.cusCateIds*1
            
            this.findItem(data, ids )
            //console.log(data);
            
            //为有父亲的赋值上父亲的数据
            assignmentParent(data) ;
            function assignmentParent(data){
                data.forEach(i=>{
                    if( i.childList){
                        i.childList.forEach(k=>{
                            k.parent = i;
                        })
                        assignmentParent(i.childList)
                    }
                })
            }
            //console.log(data); 
            let arr = [] ;
            if(this.currentRow.childList){
              arr.push(this.currentRow)
              getAllChild(this.currentRow.childList)
            }
            if(this.currentRow.parentCusCateId){
                getAllParent(this.currentRow)
            }
            function getAllParent(data){
                if(data.parent){
                    getAllParent(data.parent)
                }
                arr.push(data)
            }
            function getAllChild(data){
                data.forEach(i=>{
                  arr.push(i);
                  if(i.childList){
                      getAllChild(i.childList)
                  }
                })
            }
            console.log(arr);
            this.showCustomCategoryDelDialog()
            this.$nextTick(function(){
                arr.forEach(i=>{
                    this.$refs.table.$refs.table.toggleRowSelection(i,true)
                })
              
            })
          }
          //console.log(this.cusCateIdOptionsTable);
          if (this.cusCateIdOptions.length === 0) {
            this.cusCateId = null
          }

          let tmp = this.cusCateIdOptions.filter(
            item => item.cusCateId === this.cusCateId
          )
          if (tmp.length === 0) {
            this.cusCateId = null
          }
          this.setCache()
        }
      })
    },
    //找寻要删除的类目
    findItem(data, id) {
      data.forEach(i => {
        if (i.cusCateId === id) {
          this.currentRow = i
          return
        }
        if (i.childList) {
          this.findItem(i.childList, id)
        }
      })
    },
    //获取所有的类目
    getCustomCategoryList() {
      this.customCategoryListQuery.sellerId = this.sellerId
      this.customCategoryListQuery.siteId = this.siteId
      let params = JSON.parse(JSON.stringify(this.customCategoryListQuery));
      delete params.haveChildren
      //delete params.siteId
      this.$api['customCategoryList'](params).then(
        res => {
          let datas = res.data
          // console.log('========================总数据')
          // console.log(datas)

          // console.log('添加过得')
          // console.log(this.cusCateIdOptions)

          //let sameId = [] //存储相同的项id
          //let cusCateIdOptions = this.cusCateIdOptions
          let data = JSON.parse(JSON.stringify(datas))

          // setData(data)
          // //处理数据
          // function setData(data) {
          //   data.forEach((i, index) => {
          //     if (i.childList) {
          //       setData(i.childList)
          //     } else {
          //       if (i.cusCateId) {
          //         getSameItem(i.cusCateId, cusCateIdOptions)
          //       }
          //     }
          //   })
          // }

          // //获取相同的项
          // function getSameItem(id, data) {
          //   data.forEach(i => {
          //     if (i.childList) {
          //       getSameItem(id, i.childList)
          //     } else {
          //       if (i.cusCateId === id) {
          //         sameId.push(i.cusCateId)
          //       }
          //     }
          //   })
          // }
          // //console.log(sameId);

          // //删除相同的项
          // deleteSameItem(data)
          // function deleteSameItem(data) {
          //   data.forEach((i, index) => {
          //     sameId.forEach(k => {
          //       if (i.cusCateId === k) {
          //         delete data[index]
          //       }
          //     })
          //     if (i.childList) {
          //       deleteSameItem(i.childList)
          //     }
          //   })
          // }
          // // console.log('-----------------------------没加过的')
          // // console.log(data)

          // //删除不是底层并且没有子级的
          // let hasChildList = true
          // // while (hasChildList) {
          // //   deleteNoChild(data)

          // // }
          // deleteNoChild(data)
          // // console.log('--------------最终的  ')
          // // console.log(data)
          this.categoryOptions = data
          // function deleteNoChild(data, parent, array, _i) {
          //   if (!parent) {
          //     deleteNoChild.root = data
          //   }
          //   if (parent && parent.childList.every(el => el == null)) {
          //     array.splice(_i, 1)
          //   }
          //   data.forEach((i, _index, _arr) => {
          //     i._parent = parent && parent._parent
          //     if (i.childList) {
          //       let flag = true
          //       i.childList.forEach((k, index, arr) => {
          //         if (k) {
          //           flag = false
          //           if (k.childList) {
          //             deleteNoChild(k.childList, k, arr, index)
          //           }
          //         }
          //       })
          //       if (flag && i.haveChildren === 1) {
          //         delete data[_index]
          //       }
          //       //console.log(_arr.every(e => e == null), _arr)
          //       if (_arr.every(e => e == null)) {
          //         _arr.length = 0
          //       }

          //       if (_arr.length === _index + 1 && _arr.every(e => e == null) || !_arr.length) {
          //         if (!i._parent) {
          //           let __index = deleteNoChild.root
          //             .filter(el => el != null)
          //             .findIndex(el => el.cusCateId === i.cusCateId)
          //           deleteNoChild.root.splice(__index, 1)
          //           return
          //         }
          //         deleteNoChild(
          //           i._parent.childList,
          //           i._parent,
          //           i.childList,
          //           _index
          //         )
          //       }
          //     }
          //   })
          // }
        }
      )
    },
    // 缓存选择的数据
    // name => cusCateIdArray '选择的类目'
    saveCacheUserSelect(name, value) {
      if (name === 'activeName') {
        storage.remove('session', 'componentName')
      }
      storage.set('session', name, value)
    },
    changeCusCateId(value) {
      storage.set('session', 'revokeKeywords_next', [])
      storage.set('session', 'revokeKeywords', [])
      // this.pParams = { cusCateId: this.cusCateId };
      this.pParams.cusCateId = this.cusCateId
      if (this.activeName === 'product') {
        this.getListForProduct(null)
        this.autocomplete.productId = null
        this.componentName = 'noKeyLexicon'
      }
      this.$nextTick(() => {
        this.saveCacheUserSelect('sellerId', this.sellerId)
        this.saveCacheUserSelect('cusCateIdArray', value)
        this.saveCacheUserSelect('pParams', this.pParams)
      })
    },
    changeProductId() {
      // let arr = this.productAddRestaurants.filter(
      //   item => item.value === this.autocomplete.productId
      // )
      // this.formProduct.productId = arr[0].productId
      // this.pParams.productId = arr[0].productId
      // this.formProduct.productId = this.autocomplete.productId
      this.pParams.productId = this.autocomplete.productId
	  console.log(this.pParams.treeId)
	  if(this.pParams.treeId === 42){
		  this.handleProductNodeClick({id:42,page:'NegativeWordSelectionPage'})
	  } 
    },
    showProductAddDialog() {
      if (this.$refs['ruleFormProduct'] !== undefined) {
        this.$refs['ruleFormProduct'].resetFields()
        this.formProduct.productId = null
      }
      this.getProductListForCategory()
      this.productOptions.visible = true
    },
    showProductDialog(fieldOrigin) {
      return this.$api['keywordDataFieldListAll']({})
        .then(res => {
          this.formulaParamList = []
          this.formulaParamBtns = []
          let { data } = res
          data.forEach(val => {
            let item = {
              fieldKey: val.fieldKey,
              displayName: val.displayName,
              selects: this.selects,
              value: '',
              inputValue: ''
            }
            this.formulaParamList.push(item)
          })
          return this.formulaParamList
        })
        .catch(err => {
          this.loading_ = false
          console.log(err)
          this.$message.error('数据项加载失败!')
        })
    },

    getRuleId(treeId, resolve, reject) {
      let apiName = 'keywordDecisionRuleListUp'
      if (treeId == 31) {
        // 否定词
        apiName = 'keywordDecisionRuleListAD'
      }
      this.$api[apiName]()
        .then(res => {
          let { code, data } = res
          if (code === 0) {
            if (treeId == 31) {
              let ruleArr = null
              if (this.pParams.type === 'category') {
                ruleArr = data.filter(element => {
                  return element.ruleType === 'CATE_ADVERT_NEGATE'
                })
              } else {
                ruleArr = data.filter(element => {
                  return element.ruleType === 'PRODUCT_ADVERT_NEGATE'
                })
              }
              if (ruleArr === null) {
                reject(null)
              } else {
                resolve(ruleArr[0].ruleId)
              }
            } else {
              let ruleIdMap = new Map()
              let ruleArr = data.filter(element => {
                return element.ruleName === '核心词'
              })
              if (ruleArr.length > 0) {
                ruleIdMap.set('coreWords', ruleArr[0].ruleId)
              }
              ruleArr = data.filter(element => {
                return element.ruleName === '长尾词'
              })
              if (ruleArr.length > 0) {
                ruleIdMap.set('longWords', ruleArr[0].ruleId)
              }

              let ruleId = null
              if (treeId == 5 || treeId == 9) {
                ruleId = ruleIdMap.get('coreWords')
              } else if (treeId == 6 || treeId == 10) {
                ruleId = ruleIdMap.get('longWords')
              }
              resolve(ruleId)
            }
          }
          reject(null)
        })
        .catch(err => {
          reject(null)
        })
    },

    async showEditParamsDialog(data, type, fieldOrigin) {
      this.loading_ = true
      this.editRuleOptions.visible = true
      // console.log(data, "data");
      // 非品牌词 核心词 长尾词 其它词 5 6 7
      // 可布局品牌词 核心词 长尾词 其它词 9 10 11
      // 否定词 31
      let formulaParamList = await this.showProductDialog()
      // console.log(formulaParamList, "formulaParamList");
      if (!formulaParamList) {
        this.loading_ = false
        return
      }
      let id = data.id
      // let ruleId = null
      // if (id === 5 || id === 9) {
      //   ruleId = 1
      // } else if (id === 6 || id === 10) {
      //   ruleId = 2
      // } else if (id === 7 || id === 1) {
      //   ruleId = 3
      // } else {
      //   if (type === 'cate') {
      //     ruleId = 4
      //   } else {
      //     ruleId = 5
      //   }
      // }
      let ruleId = await new Promise((resolve, reject) => {
        return this.getRuleId(id, resolve, reject)
      })
      // 判断广告否定词  上架词
      if (id === 31) {
        this.editUrl = 'KeywordVariateValueSaveAD'
      } else {
        this.editUrl = 'KeywordVariateValueSave'
      }
      this.$api['keywordDecisionRuleInfo']({
        ruleId
      })
        .then(data => {
          // 根据ruleId获取公式和公式名称等信息
          // console.log(data, "data");
          if (!data.expression) {
            this.$message.warning('暂无数据')
          } else {
            // 请求类目或系统级别的可编辑参数
            let params = {
              ruleId: ruleId
            }
            if (type === 'prod') {
              params.productId = this.autocomplete.productId
              // 设置确认编辑按钮所需参数 productId
              this.edit.productId = this.autocomplete.productId
              // 设置确认编辑按钮所需参数 end
            }

            // if (id === 5 || id === 6 || id === 7) {
            if (id === 5 || id === 6) {
              params.brandType = 0
            } else {
              params.brandType = 1
            }
            // 否定词
            if (id === 31) {
              delete params.brandType
            }
            params.cusCateId = this.cusCateId
            params = this.$.dealObjectValue(params)
            // 设置确认编辑按钮所需参数
            this.edit.cusCateId = this.cusCateId
            this.edit.ruleId = ruleId
            this.edit.brandType = params.brandType
            // 设置确认编辑按钮所需参数 end
            this.$api['KeywordVariateValueInfo'](params)
              .then(res => {
                // console.log(res, "商品库->商品库 编辑参数-详情回显");
                let fieldKey,
                  displayName,
                  selects = this.selects,
                  value,
                  inputValue,
                  item
                // this.formulaParamBtns.push(item);
                let arr,
                  arr2 = [],
                  arr3 = [],
                  arr4 = [],
                  str = JSON.parse(JSON.stringify(data.expression))
                // console.log(str, "str");
                arr = str.split('||')
                let arr_copy = JSON.parse(JSON.stringify(arr))
                // 增加||
                let reslut = this.insert(arr, arr_copy, '||')
                // console.log(reslut, "relsut");
                // 增加&&
                reslut.forEach((el, index) => {
                  let new_el = []
                  new_el = el.split('&&')
                  // console.log(new_el);
                  let new_el_copy = JSON.parse(JSON.stringify(new_el))
                  let new_el_result = this.insert(new_el, new_el_copy, '&&')
                  arr2.push(...new_el_result)
                })
                // 将‘（’和‘）’变成项
                arr2.forEach((el, index) => {
                  let new_el = []
                  new_el = el.split('(')
                  new_el.forEach((i, j) => {
                    if (i === '') {
                      new_el.splice(j, 1, '(')
                    }
                  })
                  arr3.push(...new_el)
                })
                arr3.forEach((el, index) => {
                  let new_el = []
                  new_el = el.split(')')
                  new_el.forEach((i, j) => {
                    if (i === '') {
                      new_el.splice(j, 1, ')')
                    }
                  })
                  arr4.push(...new_el)
                })
                // console.log(arr4, "arr4");
                //  将数组处理成回显
                this.formulaParamBtns = []
                arr4.forEach((el, index) => {
                  if (el === '(' || el === ')' || el === '&&' || el === '||') {
                    this.formulaParamBtns.push({
                      fieldKey: 'symbol',
                      displayName: el
                    })
                  } else {
                    // console.log(res, "res");
                    let values
                    if (res.data && res.data.variateValues) {
                      values = JSON.parse(res.data.variateValues)
                    } else {
                      values = data.values
                    }
                    if (el.indexOf('>=') !== -1) {
                      this.byStr(el, '>=', values)
                    } else if (el.indexOf('<=') !== -1) {
                      this.byStr(el, '<=', values)
                    } else if (el.indexOf('=') !== -1) {
                      this.byStr(el, '==', values)
                    } else if (el.indexOf('>') !== -1) {
                      this.byStr(el, '>', values)
                    } else if (el.indexOf('<') !== -1) {
                      this.byStr(el, '<', values)
                    }
                  }
                })
                this.loading_ = false
              })
              .catch(err => {
                this.loading_ = false
                console.log(err)
                this.$message.warning('数据加载失败')
              })
          }
        })
        .catch(err => {
          console.log(err)
          this.loading_ = false
          this.$message.warning('数据加载失败')
        })

      // 可布局品牌词
    },
    // 增加||和&&
    insert(arr, arr_copy, str) {
      this.i = 0
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== str) {
          // console.log(i, "i");
          // console.log(arr[i], "arr[i]");
          arr_copy.splice(i + this.i, 0, str)
          this.i += 1
          // console.log(this.i, "this.i");
          // console.log(arr_copy, "arr_copy");
        }
      }
      return arr_copy
    },
    // 根据符号切割回显
    byStr(el, str, values) {
      let new_el = el.split(str)
      // 通过fieldKey 找出displayName
      // console.log(this.formulaParamList, "formulaParamList");
      let item = this.formulaParamList.find(i => {
        return i.fieldKey === new_el[0]
      })
      let inputValue
      if (values) {
        inputValue = values[new_el[1]]
      } else {
        inputValue = ''
      }
      // console.log(item, "item");
      this.formulaParamBtns.push({
        fieldKey: new_el[0],
        displayName: item.displayName,
        selects: this.selects,
        value: str,
        inputValue: inputValue
      })
    },
    // 确认编辑参数
    editRuleFun() {
      let notAllStr = false
      let notAllInput = false
      let hasNaN = false
      let expression = '',
        params = [],
        variables = {}
      // console.log(this.formulaParamBtns, "提交this.formulaParamBtns");
      this.formulaParamBtns.forEach((el, index) => {
        if (el.fieldKey === 'symbol') {
          expression += el.displayName
        } else {
          if (!el.value) {
            if (el.fieldKey !== 'symbol') {
              notAllStr = true
            }
          } else if (el.inputValue === '') {
            if (el.fieldKey !== 'symbol') {
              notAllInput = true
            }
            return false
          } else {
            expression += el.fieldKey
            expression += el.value
            let key = 'key' + index
            expression += key
            params.push(el.fieldKey)
            let u = +el.inputValue
            console.log(expression, 'expression')
            if (isNaN(u)) {
              // console.log(u, "uuuu");
              hasNaN = true
            } else {
              variables[key] = +el.inputValue
              // console.log(variables, "variables");
            }
          }
        }
      })
      if (notAllStr === true) {
        this.$message.warning('请确认每个选择框都选择了符号')
        return
      } else if (notAllInput === true) {
        this.$message.warning('请确认每个输入框都输入了值')
        return
      } else if (hasNaN === true) {
        this.$message.warning('请确认每个输入的值是数字')
        return
      }
      let arg = {
        brandType: this.edit.brandType,
        cusCateId: this.edit.cusCateId,
        ruleId: this.edit.ruleId,
        productId: this.edit.productId,
        variables: JSON.parse(JSON.stringify(variables))
      }
      arg = this.$.dealObjectValue(arg)
      // console.log(arg, "arg");
      if (this.editUrl === 'KeywordVariateValueSaveAD') {
        delete arg.brandType
      }
      this.$api[this.editUrl](arg).then(data => {
        this.editRuleOptions.visible = false
      })
      // console.log(arg, "arg");
    },
    getListForProduct(pId) {
      this.$api['categoryKeywordListForProduct']({
        cusCateId: +this.cusCateId,
        sellerId: this.sellerId
      }).then(res => {
        //productRestaurants
        let { code, data } = res
        if (code === 0) {
          let productRestaurants = []
          data.forEach(element => {
            let item = {}
            item.asin = element.asin
            item.sku = element.sku
            item.productId = element.productId
            item.customName = element.customName
            productRestaurants.push(item)
          })
          this.productRestaurants = productRestaurants
          if (pId !== null) {
            let productArr = productRestaurants.filter(element => {
              return element.productId === pId
            })
            if (productArr.length > 0) {
              this.autocomplete.productId = pId
              this.pParams.productId = pId
            } else {
              this.autocomplete.productId = null
              this.pParams.productId = null
              // this.$message.warning('未找到相应商品')
            }
          }
          if (this.productRestaurants.length === 0) {
            this.autocomplete.productId = null
          }
          let tmp = this.productRestaurants.filter(
            item => item.productId === this.autocomplete.productId
          )
          if (tmp.length === 0) {
            this.autocomplete.productId = null
          }
        }
      })
    },
    // querySearch(queryString, cb) {
    //   let restaurants = this.productRestaurants
    //   let results = queryString
    //     ? restaurants.filter(this.createStateFilter(queryString))
    //     : restaurants
    //     cb(results)
    //   // clearTimeout(this.timeout)
    //   // this.timeout = setTimeout(() => {
    //   //   cb(results)
    //   // }, 1000 * Math.random())
    // },
    getProductListForCategory() {
      this.$api['productListForCategory']({
        sellerId: this.sellerId,
        cusCateId: this.cusCateId,
        siteId: this.siteId,
				useFlag:0
      }).then(res => {
        let { code, data } = res
        if (code === 0) {
          let productAddRestaurants = []
          data.forEach(element => {
            let item = {}
            //item.value = element.parentSku
			item.value = element.sku
            item.productId = element.productId
            item.customName = element.customName
            productAddRestaurants.push(item)
          })
          this.productAddRestaurants = productAddRestaurants
        }
      })
    },
    // querySearchProductId(queryString, cb) {
    //   let restaurants = this.productAddRestaurants
    //   let results = queryString
    //     ? restaurants.filter(this.createStateFilter(queryString))
    //     : restaurants
    //     cb(results)
    //   // clearTimeout(this.timeout)
    //   // this.timeout = setTimeout(() => {
    //   //   cb(results)
    //   // }, 1000 * Math.random())
    // },
    // createStateFilter(queryString) {
    //   return state => {
    //     return (
    //       state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    //     )
    //   }
    // },
    setCustomName(val) {
      // let tmpArr = this.productAddRestaurants.filter(function(
      //   element,
      //   index,
      //   self
      // ) {
      //   return element.productId == val
      // })
      // if (tmpArr.length === 1) {
      //   // this.formProduct.customName = tmpArr[0].customName
      //   this.formProduct.customName = tmpArr[0].value
      // }
    },
    submitProductForm() {
      this.$refs['ruleFormProduct'].validate(valid => {
        if (valid) {
          // let arr = this.productAddRestaurants.filter(
          //   item => item.value === this.formProduct.asin
          // )
          // if (arr.length === 0) {
          //   this.$message.warning('商品ASIN找不到相应的商品')
          //   return
          // }
          // this.formProduct.productId = arr[0].productId
          // alert(this.formProduct.productId)
          this.formProduct.siteId = this.siteId
          this.formProduct.cusCateId = this.cusCateId

          this.$api['categoryKeywordSaveProduct'](this.formProduct).then(
            res => {
              let { code } = res
              if (code === 0) {
                this.productOptions.visible = false
                this.getListForProduct(null)
              }
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showCustomCategoryDelDialog() {
      this.customCategoryDelOptions.visible = true
    },
    showCustomProductDelDialog() {
      this.customProductDelOptions.visible = true
    },
  
    submitCustomCategoryForm() {
      this.formCustomCategory.cusCateId = _.last(
        this.formCustomCategoryCusCateId
      )
      // this.formCustomCategory.cusCateId =this.formCustomCategoryCusCateId.slice(0).pop();
      this.formCustomCategory.sellerId = this.sellerId
      this.formCustomCategory.siteId = this.siteId
      this.$api['customCategorySaveCategory'](this.formCustomCategory).then(
        res => {
          let { code } = res
          if (code === 0) {
            this.customCategoryOptions.visible = false
            this.getCategoryKeywordList()
          }
        }
      )
    },
    showDelCusCateIdBtn(data) {
      if (data.childList === null) {
        return true
      }
      return false
    },
    handleCusCateIdSelectionChange(val) {
      //console.log(val);
      this.multipleCusCateIdSelection = val
    },
    delCusCateId(cusCateId,row) {
      if(row && row.childList){
        this.$message.warning('请选择底层删除')
        return
      }
      //return
      let ids = []
      if (cusCateId === null) {
        let multipleSelection = this.multipleCusCateIdSelection
        if (multipleSelection.length === 0) {
          this.$message.warning('至少选一项')
          return
        }
        multipleSelection.forEach(element => {
          if (!element.childList) {
            ids.push(element.cusCateId)
          }
        })
        //console.log(multipleSelection);
      } else {
        ids = [cusCateId]
      }
      // console.log(ids);
      // return
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['categoryKeywordRemoveCategory']({
            ids,
            siteId: this.siteId,
            sellerId: this.sellerId
          }).then(res => {
            let { code } = res
            if (code === 0) {
             
              // 如果类目选择的那项被删，清除掉
              if (ids.indexOf(this.cusCateId) > -1) {
                this.cusCateId = null
                this.componentName = 'noKeyLexicon'
              }
              this.customCategoryDelOptions.visible = false
              //this.$refs.multipleCusCateIdTable.clearSelection()
              // this.getCustomCategoryList();
              this.refreshGetCategoryKeywordList()
            }
          })
        })
        .catch(() => {})
    },
    handleCusProductSelectionChange(val) {
      this.multipleProductSelection = val
    },
    deleteProductRows(productId) {
      let ids = []
      if (productId === null) {
        let multipleSelection = this.multipleProductSelection
        if (multipleSelection.length === 0) {
          this.$message.warning('至少选一项')
          return
        }
        multipleSelection.forEach(element => {
          ids.push(element.productId)
        })
      } else {
        ids = [productId]
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['categoryKeywordRemoveProduct']({ ids }).then(res => {
            let { code } = res
            if (code === 0) {
              this.customProductDelOptions.visible = false
              this.$refs.multipleProductTable.clearSelection()
              this.getListForProduct(null)
            }
          })
        })
        .catch(() => {})
    },
    showProductStrategyDialog() {
      this.$api['keywordDecisionRuleListUp']().then(res => {
        let { code, data } = res
        if (code === 0) {
          if (data.length === 3) {
            data.forEach(element => {
              if (element.ruleName === '核心词') {
                this.coreRuleIdOptions = element.children
              } else if (element.ruleName === '长尾词') {
                this.longRuleIdOptions = element.children
              } else if (element.ruleName === '其他词') {
                this.otherRuleIdOptions = element.children
              }
            })
            this.productStrategyOptions.visible = true

            let cusCateId = this.cusCateId
            if (cusCateId !== null) {
              this.$api['productStrategyInfo']({
                cusCateId
              }).then(res => {
                let { code, data } = res
                if (code === 0) {
                  if (data !== null) {
                    let { coreRuleId, longRuleId, otherRuleId } = data
                    this.formProductStrategy.coreRuleId = coreRuleId
                    this.formProductStrategy.longRuleId = longRuleId
                    this.formProductStrategy.otherRuleId = otherRuleId
                  }
                }
              })
            }
          } else {
            this.coreRuleIdOptions = []
            this.longRuleIdOptions = []
            this.otherRuleIdOptions = []
          }
        }
      })
    },
    submitProductStrategy() {
      if (this.cusCateId === null) {
        this.$message.warning('请确选择类目!')
        return
      }
      this.formProductStrategy.cusCateId = this.cusCateId
      if (this.formProductStrategy.coreRuleId === '') {
        this.formProductStrategy.coreRuleId = null
      }
      if (this.formProductStrategy.longRuleId === '') {
        this.formProductStrategy.longRuleId = null
      }
      if (this.formProductStrategy.otherRuleId === '') {
        this.formProductStrategy.otherRuleId = null
      }
      this.$api['productStrategySave'](this.formProductStrategy).then(res => {
        let { code } = res
        if (code === 0) {
          this.productStrategyOptions.visible = false
        }
      })
    }
    // showEditProductStrategyDialog() {
    //   this.productStrategyEditVisible = true;
    // }
    // showProductDelDialog(){
    //   this.customCategoryOptions.visible = true
    // }
  },
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.box {
  .c-btn {
    background-color: #fff;
    border: 1px solid @borderColor;
    width: 15px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .box-body {
    display: flex;
    .menu {
      .el-tree {
        font-size: 12px;
      }
      height: 100vh;

      overflow-y: auto;
      border-right: 1px solid @borderColor;
      // border-radius: 3px;
      width: 300px;
      margin-right: 10px;
      margin-bottom: 10px;
      .div-cascader {
        display: flex;
        justify-content: center;
      }

      padding: 10px;
      padding-top: 0;
      .btn-icon {
        .el-button {
          // width: 53px;
          // margin-left: 18px;
          // margin-right: 18px;
          // flex: 1;
          margin-left: 10px;
        }
        /deep/[class^='el-icon-'] {
          font-size: 14px;
        }
      }
      /deep/.el-tabs__header {
        margin-bottom: 5px;
      }
      .btn-icon-product {
        .el-button {
          // width: 100px;
          margin-left: 44px;
          margin-right: 44px;
          // padding-top: 0;
        }
      }
    }
    .body {
      width: 100%;
      overflow-y: auto;
    }
  }
  .product-lexicon-dialog {
    .el-input,
    .el-select {
      width: 180px;
    }
    // .formula-box{
    //   display: grid;
    //   grid-template: e('25px 70px 70px 70px 70px / 100px 100px 150px auto');

    //   .item-1{
    //     grid: 1;
    //     grid-row: e('1/6')
    //   }
    //   .item-title{
    //     background-color: @boxQueryBGColor;
    //     font-weight: bold;
    //   }
    //   .item-title,
    //   .item-label,
    //   .item-input{
    //     padding-top: 5px;
    //     text-align: center;
    //      border-bottom: 1px solid @borderColor;
    //      width: 100%;
    //   }
    //   .item-label{

    //   padding-top: 15px;
    //   }
    //   .item-input{
    //     /deep/.el-form-item__content{
    //       margin-left: 0!important;
    //     }
    //     .el-input{
    //       width: 200px;
    //     }
    //   }
    // }
  }
  .edit-params-dialog {
    .item-title {
      display: flex;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid @borderColor;
      background-color: @boxQueryBGColor;
      padding-bottom: 8px;
      padding-top: 8px;
      .column-1 {
        width: 100px;
        text-align: center;
      }
      .column-2 {
        width: 200px;
        text-align: center;
      }
    }
    /deep/.el-form-item {
      border-bottom: 1px solid @borderColor;
    }
  }
  .cus-cate-id,
  .select-product-id {
    width: 210px;
  }

  .del-table-dialog {
    /deep/.el-dialog__body {
      padding-top: 5px;
    }
    .all-del-btn {
      display: flex;
      justify-content: flex-end;

      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less" scope>
.menu {
  .div-cascader {
    .el-cascader--mini {
      line-height: 32px;
      width: 100%;
    }
  }
  .btn-icon {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

.keyLexicon-tab {
  .el-tabs__nav.is-top {
    width: 100%;
    display: flex;
    .el-tabs__item {
      flex: 1;
      text-align: center;
    }
  }
}
.product-strategy-popover {
  .el-popover__title {
    font-size: 14px;
  }
  .product-strategy-popover-btn {
    display: flex;
    justify-content: center;
  }
}
.draggable {
  display: flex;
  flex-wrap: wrap;
  .formula-btn {
    margin-right: 10px;
    font-size: 12px;
    display: flex;
    height: 30px;
    .btn-txt {
      padding-top: 8px;
      padding-right: 5px;
    }
    .item-symbol {
      width: 55px;
      margin-right: 5px;
      /deep/.el-input__inner {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
    .item-param {
      width: 50px;
      margin-right: 0;
      /deep/.el-input__inner {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
    /deep/[class^='el-icon-'] {
      font-size: 10px;
      width: 10px;
      height: 10px;
      color: red;
      cursor: pointer;
    }
  }
}
.handleBtn {
  /deep/.el-icon-refresh {
    font-size: 15px !important;
  }
}
</style>
