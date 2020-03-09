<template>
  <div class="box ___common">
    <div>
        <el-button type="primary" plain  @click="setManualUpdate" :loading="loadingBtn1" :disabled="BTNdisabled"  style="position:absolute;right:26px;top:6px;">
            {{refreshhtml}}
            <i class="el-icon-refresh el-icon--right"></i>
        </el-button>
      </div>
    <tpl-drawer>
      <div slot="leftMenu" class="box-left-menu">
        <el-input clearable placeholder="输入sku搜索" v-model.trim="filterText" size="mini" class="menu-select">
          <!-- <el-button slot="append" icon="el-icon-search" size="mini" @click="filterSider" :disabled="!filterText"></el-button> -->
        </el-input>
        <div class="el-icon-box">
	      <el-tooltip class="item" effect="light" :open-delay="300" content='刷新' placement="top-start">
				<el-button type="text" icon="el-icon-refresh " @click="filterText=null;init()" size="small"></el-button>
		  </el-tooltip>
		  <el-tooltip class="item" effect="light" :open-delay="300" content='添加' placement="top-start">
        <el-button type="text" icon="el-icon-plus " @click="showDialog" size="small"></el-button>
		  </el-tooltip>
		  <!-- <el-tooltip class="item" effect="light" :open-delay="300" content='编辑' placement="top-start">
				<el-button type="text" icon="el-icon-edit-outline" @click="showDialog2"></el-button>
		  </el-tooltip> -->
          <!-- <i class="el-icon-menu" v-show="elIconMenuShow" @click="showRelateDialog"></i> -->
		  <el-tooltip class="item" effect="light" :open-delay="300" content='删除' placement="top-start">
				<el-button type="text" icon="el-icon-delete" @click="sideDelete"></el-button>
		  </el-tooltip>
          <!-- <i class="el-icon-download common_color" @click="uploadTaskShow = true;"></i> -->
        </div>
        <el-tree  :expand-on-click-node="false"  show-checkbox node-key="taskId"  :default-expanded-keys="defaultExpandedKeys" :data="customCategoryData" :props="defaultProps" highlight-current @node-click="handleNodeClick" ref="treeCustomCategory" :filter-node-method="filterNode" v-loading="treeLoading"  :current-node-key="currentNodeKey" >
          <span class="span-ellipsis" slot-scope="{ node, data }" style='display:block;width:100%'>
            <span :title="node.label" class="font12" style='display:inline-block;width:85%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>{{ node.label }}</span>
            <i class='el-icon-close' style='color:#ff3040;font-size:14px;' v-if='data.successFlag===0'></i>
            <i class='el-icon-check' style='color:blue;font-size:14px;'  v-if='data.successFlag===1'></i>
          </span>
        </el-tree>
      </div>
      <div slot="body" class="box-body" style="min-width:900px;" v-if="detail && customCategoryData.length> 0">
        <template>
          <el-button type='primary' plain size='mini' @click="POPshowDialog">加入价格自动优化</el-button>
          <el-button type='primary' plain size='mini' @click="uploadTaskShow = true;buttonLoading.upload = false;">导入操作数据</el-button>
          <el-button type='primary' plain size='mini' @click="targetMethod('open')" :disabled="$store.state.isloading || $store.state.loading">开启任务</el-button>
          <el-button type='primary' plain size='mini' @click="targetMethod('close')" :disabled="$store.state.isloading || $store.state.loading">暂停任务</el-button>
          <el-button type='primary' plain size='mini' @click="showDialog2">编辑阶段目标</el-button>
          <div style='margin-top:10px;width:100%' v-loading="messageLoading">
            <header class="header">
              产品信息
              <!-- <el-tooltip class="item" effect="light" content="开启目标" placement="top">
              <i @click="targetMethod('open')" class="el-icon-success" style="font-size: 20px;position: absolute;right: 40px;top: 9px;cursor:pointer;"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="暂停目标" placement="top">
              <i @click="targetMethod('close')" class="el-icon-warning" style="font-size: 20px;position: absolute;right: 10px;top: 9px;cursor:pointer;"></i>
              </el-tooltip> -->
            </header>
            <!-- 图片 -->
            <div style="overflow: auto;box-sizing: content-box;border:1px solid #dcdcdc;">
              <div class="p-container">
                <div class="picture" v-if='detail.entity.imageUrl'>
                  <!-- <img class="loadingImg" v-lazy="detail.imageUrl?detail.imageUrl:'-'"> -->
                  <img v-lazy="detail.entity.imageUrl">
                </div>
                <div class="picture" v-else>
                </div>
              </div>
              <!-- 详情 -->
              <div class="pd-container">
                <!-- 头部 -->
                <div>
                  <div>
                    <span style='font-weight:900;float:left;'>商品名称：</span>
                    <div style='margin-left:70px;'>
                        <a v-if="detail.entity.title" rel="noopener noreferrer nofollow" class="aLink common__color" target="_blank" :href="detail.entity.productUrl?detail.entity.productUrl:false" style="text-decoration:none;">{{detail.entity.title}}</a>
                        <span v-else class='s'>-</span>
                    </div>
                  </div>
                  <div style='margin-top:8px;'>
                      <span style='font-weight:900;float:left;'>SKU:</span>
                      <div style='margin-left:70px;'>
                          <span>{{detail.entity.sku ? detail.entity.sku :"-"}}</span>
                      </div>
                  </div>
                  <div style='margin-top:8px;'>
                      <span style='font-weight:900;'>优化状态:</span>
                      <span style='margin-left:10px;'>{{detail.entity.stageNo===-1 ? '暂停' : detail.entity.stageNo===0 ? "未开始": detail.entity.stageNo >=1 ? '已开始' :'-'}}</span>
                  </div>
                </div>
                <!-- 底部评分 -->
                <div class='margin_top8'>
                  <el-table size='mini' ref="multipleTable" :data="detail.cntList" style="width: 100%;position:relative;margin-top:10px;" :stripe="true">
                    <el-table-column prop="starCnt" label="评分">
                      <template slot-scope="scope">
                        {{scope.row.starCnt | _formatData}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="aqCnt" label="AQ数">
                      <template slot-scope="scope">
                        {{scope.row.aqCnt | _formatData}}
                      </template>
                    </el-table-column>
                    <el-table-column label="底部评分" align="center">
                      <el-table-column label="1星">
                        <template slot-scope="scope">
                          {{scope.row.bottom1StarCnt | _formatData}}
                        </template>
                      </el-table-column>
                      <el-table-column label="2星">
                        <template slot-scope="scope">
                          {{scope.row.bottom2StarCnt | _formatData}}
                        </template>
                      </el-table-column>
                      <el-table-column label="3星">
                        <template slot-scope="scope">
                          {{scope.row.bottom3StarCnt | _formatData}}
                        </template>
                      </el-table-column>
                      <el-table-column label="4星">
                        <template slot-scope="scope">
                          {{scope.row.bottom4StarCnt | _formatData}}
                        </template>
                      </el-table-column>
                      <el-table-column label="5星">
                        <template slot-scope="scope">
                          {{scope.row.bottom5StarCnt | _formatData}}
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick" style='margin-top:20px;'>
              <el-tab-pane label="目标完成状态" name="first" :lazy='true'>
                  <TabTable :tableData='tabTableData'></TabTable>
                  <div v-for="item in lookOtherStageData" :key='item.key' v-if='islookOtherStage'>
                    <TabTable :tableData='item' style='margin-top:20px;'></TabTable>
                  </div>
                  <div style='margin-top:10px;' v-if='lookOtherStageData && lookOtherStageData.length'>
                      <el-button type='text' style='color:#108ee9;cursor:pointer;' @click='lookOtherStage'>{{lookOtherStageHtml}}</el-button>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="详细数据" name="second" :lazy='true'>
                  <TabDatails :taskId='taskId'></TabDatails>
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
      </div>
    </tpl-drawer>
    <el-dialog class="customDialog" :title="title" :visible.sync="dialogVisible" width="900px" :close-on-click-modal="false">
      <!-- <div slot="title" style="font-size:14px;">
        {{title}}
      </div> -->
        <el-scrollbar
        wrap-class="default-scrollbar__wrap"
        view-class="p20-scrollbar__view"
        ref="scroll"
        v-loading='table1.loading'
      >
        <el-form size="small" :model="form" :rules="rules" ref="ruleForm" style="width:100%;" label-width="110px" >
          <div  
            v-for="(item,index) in form.stages" 
            :key="index" 
            style='border-bottom:1px solid #e5d5d5;margin:10px 0;padding-left:70px;' 
            :style="{marginTop:index===0 ? '0' : '10px' }"
          >

            <div style="font-weight:bold;font-size:15px;">
              阶段{{index+1}}:
              <el-input :autofocus="false" type="hidden" v-model.trim="item.stageNo" style="width:100px;visibilitity:" :value="index+1" size='mini' />
            </div>

            <el-form-item label="时间段" :prop="'stages.'+index+'.date'" :rules="rules.date" >
              <el-date-picker v-model="item.date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="cfuns._pickerFuture" size="mini" value-format="yyyy-MM-dd" style='width:300px'>
              </el-date-picker>
            </el-form-item>
    
            <div>
               <el-form-item label="广告订单目标" :prop="'stages.'+index+'.adOrderCnt'" :rules="ruluNumber(item.adOrderCnt,index)" style="width:300px;display:inline-block">
                  <el-input :autofocus="false" v-model.trim="item.adOrderCnt" style="width:150px;" placeholder="请输入数值" size='mini' clearable />
                </el-form-item>


                <el-form-item label="自然订单目标" :prop="'stages.'+index+'.normalOrderCnt'" :rules="ruluNumber(item.normalOrderCnt,index)" style="width:300px;display:inline-block">
                  <el-input :autofocus="false" v-model.trim="item.normalOrderCnt" style="width:150px;" placeholder="请输入数值" size='mini' clearable />
                </el-form-item>
            </div>

            <div>
              <el-form-item label="广告转化率" :prop="'stages.'+index+'.adConversionRate'" :rules="ruluNumber1To100(item.adConversionRate,index)" style="width:300px;display:inline-block">
                <el-input :autofocus="false" v-model.trim="item.adConversionRate" style="width:150px;" placeholder="请输入数值" size='mini' clearable />%
              </el-form-item>

              <el-form-item label="自然转化率" :prop="'stages.'+index+'.normalConversionRate'" :rules="ruluNumber1To100(item.normalConversionRate,index)" style="width:300px;display:inline-block">
                <el-input :autofocus="false" v-model.trim="item.normalConversionRate" style="width:150px;" placeholder="请输入数值" size='mini' clearable />%
              </el-form-item>
            </div>
          
            <div>
              <el-form-item label="广告访客数" :prop="'stages.'+index+'.adSessions'" :rules="ruluNumber(item.adSessions,index)" style="width:300px;display:inline-block" >
                <el-input :autofocus="false" v-model.trim="item.adSessions" style="width:150px;" placeholder="请输入数值" size='mini' clearable />
              </el-form-item>

              <el-form-item label="自然访客数" :prop="'stages.'+index+'.normalSessions'" :rules="ruluNumber(item.adSessions,index)" style="width:300px;display:inline-block" clearable>
                <el-input :autofocus="false" v-model.trim="item.normalSessions" style="width:150px;" placeholder="请输入数值" size='mini' clearable />
              </el-form-item>

              <el-form-item style="width:100px;display:inline-block" label-width="10px">
                <span class="esc_desc __pointer common__color el-icon-minus" v-if="form.stages.length>1?true:false" @click="spliceItem(index)"></span>
                <span class="esc_desc __pointer common__color el-icon-plus" v-if="index===0&&form.stages.length===1||index===form.stages.length-1&&form.stages.length>1?true:false" @click="addItem(index)"></span>
              </el-form-item>
            </div>

            <!-- <el-form-item label-width="260px" style="width:70%;inline;position:relative;top:-25px;" v-if="showTips100">
              <span class="_fontSize1">广告访客占比 与 自然访客占比 之和应该等于100%</span>
            </el-form-item> -->
          </div>
          <template>
            <div v-if="status==2" style="width:800px;margin-left:25px;">
              <div>
                <el-form-item label-width="0px">
                  <!-- 列表中添加 -->
                  <!-- <el-table ref="Table" :data="table1.rows" style="width: 100%" border :stripe="true" :highlight-current-row="true">
                    <el-table-column v-if="selection" type="selection" width="55" :header-row-style="{'position':'absolute'}">
                    </el-table-column>
                    <el-table-column prop="imageUrl" label="主图" width="80px">
                      <template slot-scope="scope">
                        <el-popover placement="right" title="" trigger="hover">
                          <img :src="scope.row.imageUrl" class="big__" />
                          <div class="__img_wrapper" slot="reference">
                            <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
                          </div>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column prop="asin" label="商品ASIN">
                      <template slot-scope="scope">
                        <span>{{scope.row.asin ||'-'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sku" label="SKU">
                      <template slot-scope="scope">
                        <span>{{scope.row.sku ||'-'}}</span>
                      </template>
                    </el-table-column>
                  </el-table> -->
                  <yt-table  
                    :data="table1.rows" 
                    border 
                    :treeTable='true'
                    :stripe='false'
                    :treeTableOtions='{
                      childs: "childList",
                      expandFunc: row => {
                          return (row.childList && row.childList.length > 0);
                                  }
                    }'
                    :columns='columns'
                  ></yt-table>
                  <el-pagination style="margin-top:5px;" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table1.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="table1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="table1.total">
                  </el-pagination>
                </el-form-item>
              </div>
              <div v-if="radio==='自定义输入'">
                <el-form-item prop="keywords" label="ASIN : " label-width="110px" style="width:100%;margin-top:10px;">
                  <el-input type="textarea" :rows="4" placeholder="输入asin,多asin个换行输入或用逗号隔开" v-model.trim="form2.asins" style="width:100%" />
                  <div v-if="showTips1" class="_fontSize1">请输入asin</div>
                  <div v-if="showTips" class="_fontSize1">asin个数不能超过500个</div>
                  <div class="_fontSize" >已输入 {{fontSum||0}} 个</div>
                </el-form-item>
              </div>
            </div>
            <div v-if="status==1" style="width:800px;margin-left:25px;">
              <el-radio-group v-model="radio" size="mini">
                <el-radio-button label="从列表中选择产品"></el-radio-button>
                <el-radio-button label="自定义输入"></el-radio-button>
              </el-radio-group>
              <div v-if="radio==='从列表中选择产品'">
                <!-- {{table1.userSelect}} -->
                <el-form-item label-width="0px" style='margin-top:10px;'>
                  <el-input placeholder="输入asin或sku" v-model.trim="searchData.asin" clearable style='max-width:150px;' size="mini" @clear="getSkus({pageSize:10,pageNumber:1})">
                  </el-input>
                  <el-button size="mini" type="primary" plain @click="searchFun" :loading="searchLoading" style="margin-left:5px;">搜索</el-button>
                  <!-- 列表中添加 -->
                  <!-- <el-table ref="Table" @selection-change="handleSelectionChange" :data="table1.rows" style="width: 100%" border :stripe="true" :row-key='table1.rowKey' :highlight-current-row="true">
                    <el-table-column type="selection" width="55" :header-row-style="{'position':'absolute'}" v-if="status==1">
                    </el-table-column>
                    <el-table-column prop="imageUrl" label="主图" width="80px">
                      <template slot-scope="scope">
                        <el-popover placement="right" title="" trigger="hover">
                          <img :src="scope.row.imageUrl" class="big__" />
                          <div class="__img_wrapper" slot="reference">
                            <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
                          </div>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column prop="asin" label="商品ASIN">
                      <template slot-scope="scope">
                        <span>{{scope.row.asin ||'-'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sku" label="SKU">
                      <template slot-scope="scope">
                        <span>{{scope.row.sku ||'-'}}</span>
                      </template>
                    </el-table-column>
                  </el-table> -->
                   <yt-table  
                    style='margin-top:10px;'
                    :data="table1.rows"  
                    :treeTable='true'
                    border
                    :stripe='false'
                     @selectChange='handleSelectionChange'
                    :treeTableOtions='{
                      childs: "childList",
                      expandFunc: row => {
                          return (row.childList && row.childList.length > 0);
                                  }
                    }'
                    :columns='columns'
                  ></yt-table>
                  <el-pagination style="margin-top:5px;" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table1.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="table1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="table1.total">
                  </el-pagination>
                </el-form-item>
              </div>
              <div v-if="radio==='自定义输入'">
                <el-form-item prop="keywords" label="ASIN : " label-width="80px" style="width:100%;margin-top:16px;">
                  <el-input type="textarea" :rows="4" placeholder="输入asin,多asin个换行输入或用逗号隔开" v-model.trim="form2.asins" style="width:90%" />
                  <div v-if="showTips1" class="_fontSize1">请输入asin</div>
                  <div v-if="showTips" class="_fontSize1">asin个数不能超过500个</div>
                  <div class="_fontSize" style='right:70px;'>已输入 {{fontSum||0}} 个</div>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()" size='small' :loading="submitLoading">确 定</el-button>
        <el-button @click="dialogVisible = false" size='small' type='primary' plain>取 消</el-button>
      </div>
    </el-dialog>
    <a v-show="false" ref="exportExcel"></a>
    <!-- 导入任务弹窗 -->
    <el-dialog class="customDialog" :close-on-click-modal="false" title="导入操作数据" :visible.sync="uploadTaskShow" style="padding-right:100px;" width="500px">
      <div slot="title">
        <span style="font-size:14px">导入操作数据</span>
      </div>
      <div style="position:relative;">
        <!-- <div style="position:relative;left:100px;top:-6px;width: 300px;">
          <el-upload style="margin-top:8px;" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange" :file-list="fileList" :on-remove="handleFileRemove" :auto-upload="false">
            <el-button size="mini" type="primary" plain>导入数据</el-button>
          </el-upload>
        </div>
        <el-button size="mini" type="primary" plain @click="downLoad" style="position:relative;left:0px;top:-6px;position:absolute;left: 270px;top:-6px;">下载模板</el-button>
        <el-button style="margin:8px 0;width:40%;position:relative;top:-0px;left:29%" :disabled=" fileList.length>0?false:true" :loading="buttonLoading.upload" size="mini" type="primary" plain @click="upload">确 定</el-button> -->
        <ImportFile @success="handleSuccess" filename="订单目标设置模板" :data="ImportFileData" :downloadApi="downloadApi" :action="action" />
      </div>
    </el-dialog>
    <!-- 加入价格自动优化 产品价格优化的添加弹窗 -->
    <yt-dialog title="添加优化" :visible.sync="dialogVisiblePop" width="550px" :close-on-click-modal="false" :options='dialogVisiblePopOpt'  :events='dialogVisiblePopOptEvents'>
      <div slot="title" style="font-size:14px;">
        加入价格自动优化
      </div>
      <template>
        <div class="__box_wrapper__local_page">
          <el-form :model="formPop" :rules="rulesPop" ref="ruleFormPop" style="width:100%;margin-top:-20px" label-width="110px">
            <el-form-item label="产品ASIN" prop="parentAsin" :rules="rulesPop.parentAsin">
              <el-select v-model="formPop.parentAsin" placeholder="输入或选择产品ASIN" style='width:300px;' clearable size="mini" filterable>
                <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="最高价" prop="seoMaxPrice" :rules="rulesPop.seoMaxPrice">
              <el-input placeholder="请输入最高价" v-model.trim="formPop.seoMaxPrice" clearable style='width:300px' size="mini">
              </el-input>
            </el-form-item>

            <el-form-item label="最低价" prop="seoMinPrice" :rules="rulesPop.seoMinPrice">
              <el-input placeholder="请输入最低价" v-model.trim="formPop.seoMinPrice" clearable style='width:300px' size="mini">
              </el-input>
            </el-form-item>

            <el-form-item label="原价" prop="originalPrice" :rules="rulesPop.originalPrice">
              <el-input placeholder="请输入原价" v-model.trim="formPop.originalPrice" clearable style='width:300px' size="mini">
              </el-input>
            </el-form-item>

            <el-form-item label="改价幅度" prop="priceRange" :rules="rulesPop.priceRange">
              <el-input placeholder="请输入金额" v-model.trim="formPop.priceRange" clearable style='width:140px' size="mini">
              </el-input>
            </el-form-item>

            <el-form-item prop="priceFrequency" :rules="rulesPop.priceFrequency" label-width="20px">
              <el-input placeholder="请输入频率" v-model.trim="formPop.priceFrequency" clearable style="width:140px" size="mini">
              </el-input>分
            </el-form-item>

            <el-form-item label="区间最低价" prop="lowestSalesAsin" :rules="rulesPop.lowestSalesAsin" v-if="formPop.parentAsin&&childSkuOptions.length>0">
              <el-select v-model="formPop.lowestSalesAsin" placeholder="请输入ASIN" style='width:140px;' clearable size="mini" filterable>
                <el-option v-for="item in childSkuOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="intervalMinPrice" :rules="rulesPop.intervalMinPrice" label-width="20px" v-if="formPop.parentAsin&&childSkuOptions.length>0">
              <el-input placeholder="请输入价格" v-model.trim="formPop.intervalMinPrice" clearable style='width:140px;' size="mini">
              </el-input>
            </el-form-item>

            <el-form-item prop="newProductFlag" label="是否新品 : ">
              <el-checkbox-group v-model="formPop.newProductFlag">
                <el-checkbox label="是"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="参考ASIN" prop="refParentAsin" :rules="rulesPop.refParentAsin" v-if="formPop.newProductFlag">
              <el-select v-model="formPop.refParentAsin" placeholder="输入或选择参考ASIN" style='width:300px;' clearable size="mini" filterable>
                <el-option v-for="item in refParentAsinOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="sameParentAsins" label="同款ASIN : " style="width:100%;">
              <el-input type="textarea" :rows="4" placeholder="输入asin,多asin个换行输入或用逗号隔开" v-model.trim="formPop.sameParentAsins" style="width:300px" />
              <!-- <div v-if="showTips1Pop" class="_fontSize1">请输入asin</div> -->
              <div v-if="showTipsPop" class="_fontSize1">asin个数不能超过500个</div>
              <div v-if="showTips2Pop" class="_fontSize1">以下asin长度不对：{{errorSameParentAsin}}</div>
              <div class="_fontSize" v-model="fontSumPop">已输入 {{fontSumPop||0}} 个</div>
            </el-form-item>
            <div  style='border-bottom:1px solid #dcdcdc;margin-top:10px;'></div>
            <div v-for="(item,index) in formPop.stageList" :key="index" style='border-bottom:1px solid #dcdcdc;margin-top:10px;'>
              <div style="font-weight:bold;font-size:15px">
                阶段{{index+1}}:
                <el-input :autofocus="false" type="hidden" v-model.trim="item.stageNo" style="width:100px;" :value="index+1" size='mini' />
              </div>
              <el-form-item label="时间段" :prop="'stageList.'+index+'.date'" :rules="rulesPop.date">
                <el-date-picker v-model="item.date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="cfuns.__pickerOptions" size="mini" value-format="yyyy-MM-dd" style='width:286px;'>
                </el-date-picker>
              </el-form-item>

              <el-form-item label="订单目标类型" prop="targetType" :prop="'stageList.'+index+'.targetType'" :rules="rulesPop.targetType">
                <el-select v-model="item.targetType" placeholder="订单目标类型" style='width:286px;' clearable size="mini">
                  <el-option v-for="item in targetTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="订单目标设置" :prop="'stageList.'+index+'.stageOrderCnt'" :rules="getRule(item.stageOrderCnt,index)" v-if="item.targetType==1">
                <el-input :autofocus="false" v-model.trim="item.stageOrderCnt" style="width:286px;" placeholder="订单目标设置" size='mini' />
              </el-form-item>

              <el-form-item label="选择类目:" :prop="'stageList.'+index+'.bsrCategory'" :rules="rulesPop.bsrCategory" v-if="item.targetType==2">
                <el-cate :Cate.sync="item.bsrCategory" width='286px' :platformId="platformId"></el-cate>
              </el-form-item>

              <el-form-item label="目标排名" :prop="'stageList.'+index+'.rank'" :rules="getRule(item.rank,index)" v-if="item.targetType==2">
                <el-input :autofocus="false" v-model.trim="item.rank" style="width:286px;" placeholder="请输入目标排名" size='mini' />
              </el-form-item>

              <el-form-item style="display:inline-block" label-width="10px">
                <span class="esc_desc __pointer common__color el-icon-minus" v-if="formPop.stageList.length>1?true:false" @click="spliceItemPop(index)"></span>
                <span class="esc_desc __pointer common__color el-icon-plus" v-if="index===0&&formPop.stageList.length===1||index===formPop.stageList.length-1&&formPop.stageList.length>1?true:false" @click="addItemPop"></span>
              </el-form-item>

            </div>
          </el-form>
        </div>
      </template>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePopOpt.visible = false" size='mini'>取 消</el-button>
        <el-button type="primary" @click="submitPop()" size='mini' :loading="submitLoadingPop">确 定</el-button>
      </div> -->
    </yt-dialog>
  </div>
</template>
<script>
import {debounce} from 'throttle-debounce';
import { CONST_PORT_CONFIG } from "Config";
import TplDrawer from "../Common/tpl-drawer/index";
import YTemplate from "../Common/y-template/index";
import TabTable from './components/table'
import TabDatails from './components/TabDatails';
import dayjs from 'dayjs'

import { host } from "Config";
class newItem {
  constructor() {
    (this.stageNo = ""), //阶段编号
      (this.date = []), // 时间段
      (this.normalOrderCnt = ""), //自然订单目标
      (this.adOrderCnt = ""), //广告订单目标
      (this.adConversionRate = ""), //广告转化率
      (this.normalConversionRate = ""), //自然转化率
      (this.adSessions = ""), //广告访客数
      (this.normalSessions = ""); //自然访客数
  }
}
class newItemPop {
  constructor() {
    (this.stageNo = ""), //阶段编号
      (this.date = []), // 时间段
      (this.targetType = ""), //目标类型
      (this.stageOrderCnt = ""), //目标
      (this.bsrCategory = ""), //亚马逊类目
      (this.rank = ""); //目标排名
  }
}
export default {
  components: {
    TplDrawer,
    YTemplate,
    TabTable,
    TabDatails
  },
  provide() {
    return {
      getList: this.getList,
      showEchart__: this.showEchart__
    };
  },
  data() {
    let vm=this;


    var itemVali1 = (item_, index) => {
      let validator = (rule, value, callback) => {
        if (!item_) {
          return callback(new Error("请输入数值"));
        };
        if (isNaN(item_)) {
          return callback(new Error("请输入数值"));
        } else {
          if (item_ < 0) {
            return callback(new Error("不能输入负数"));
          }
        };
        //console.log(item_ + '==item');
        if(item_.toString().indexOf('-')!==-1 || item_.toString().indexOf('+')!==-1){
            return callback(new Error("请输入数值"));
        };

        let ruleName=rule.field.split('.')[2] ;
        // console.log(ruleName);
        // console.log(index);
        // console.log(vm.form.stages[index].adConversionRate);
        if ( ruleName==='adOrderCnt' ||  ruleName==='normalOrderCnt'){ //自动计算广告访客数和自然访客数
           if(vm.form.stages[index].adConversionRate.toString()  && vm.form.stages[index].adOrderCnt.toString()){
              vm.form.stages[index].adSessions = Math.round(vm.form.stages[index].adOrderCnt / vm.form.stages[index].adConversionRate *100)
           };
           if(vm.form.stages[index].normalConversionRate.toString() && vm.form.stages[index].normalOrderCnt.toString()){
              vm.form.stages[index].normalSessions = Math.round(vm.form.stages[index].normalOrderCnt / vm.form.stages[index].normalConversionRate *100)
           }
        }
        callback();
      };
      return [
        {
          required: true,
          validator: validator,
          trigger: ["change", "blur"]
        }
      ];
    };
    var vali = (item, index, type) => {
      let validator = (rule, value, callback) => {
        let item1 = +item.stageAdSessionsRate;
        let item2 = +item.stageNormalSessionsRate;
        let total = item1 + item2;
        console.log(total, "1");
        if (!value) {
          callback(new Error("请输入数值"));
        } else {
          callback();
        }
      };
      return [
        {
          required: true,
          validator: validator,
          trigger: ["change", "blur"]
        }
      ];
    };
    var itemVali1To100 = (item_, index) => {
      let validator = (rule, value, callback) => {
        if (!item_ && item_!==0) {
          return callback(new Error("请输入数值"));
        };
        if (isNaN(item_)) {
           return callback(new Error("请输入数值"));
        } else {
          if (item_ < 0 || item_ > 100) {
            return callback(new Error("数值应该在0-100中取值"));
          }
        };
        if(item_.toString().indexOf('-')!==-1 || item_.toString().indexOf('+')!==-1){
            return callback(new Error("请输入数值"));
        } 
        callback()
      
        let ruleName=rule.field.split('.')[2]
        // console.log(index);
        // console.log(ruleName);
        //console.log(vm.form.stages[0].adConversionRate);
        //自动计算广告转化率和自然转化率 , 广告访客数和自然访客数
        if(ruleName==='adConversionRate'){

            //自动计算广告转化率和自然转化率 
            vm.form.stages[index].normalConversionRate=100-vm.form.stages[index].adConversionRate*1 ;

            //自带计算广告访客数和自然访客数
            if(vm.form.stages[index].normalConversionRate.toString() && vm.form.stages[index].normalOrderCnt.toString()){
              vm.form.stages[index].normalSessions = Math.round(vm.form.stages[index].normalOrderCnt / vm.form.stages[index].normalConversionRate *100) 
            };
            if(vm.form.stages[index].adConversionRate.toString()  && vm.form.stages[index].adOrderCnt.toString()){
              vm.form.stages[index].adSessions = Math.round(vm.form.stages[index].adOrderCnt / vm.form.stages[index].adConversionRate *100)
            };

        }else{
            //自动计算广告转化率和自然转化率 
            vm.form.stages[index].adConversionRate=100-vm.form.stages[index].normalConversionRate*1;
            
            //自带计算广告访客数和自然访客数
            if(vm.form.stages[index].normalConversionRate.toString() && vm.form.stages[index].normalOrderCnt.toString()){
              vm.form.stages[index].normalSessions = Math.round(vm.form.stages[index].normalOrderCnt / vm.form.stages[index].normalConversionRate *100)
            };
            if(vm.form.stages[index].adConversionRate.toString()  && vm.form.stages[index].adOrderCnt.toString()){
              vm.form.stages[index].adSessions = Math.round(vm.form.stages[index].adOrderCnt / vm.form.stages[index].adConversionRate *100)
            };  
        }
      };
      return [
        {
          required: true,
          validator: validator,
          trigger: ["change", "blur"]
        }
      ];
    };
    // 加入产品价格优化  itemVali1 用上面的
    var validatorNumber = (rule, value, callback) => {
      let value_ = +value;
      // console.log(isNaN(value_));
      if (isNaN(value_)) {
        callback(new Error("请输入数值"));
        return;
      } else {
        if (value_ < 0) {
          callback(new Error("不能输入负数"));
          return;
        } else {
          callback();
        }
      }
    };
    //添加计划输入的时间
    let dateValidatePass =(rule, value, callback) => {
        // console.log(rule);
        // console.log(value);
        let nowIndex = rule.field.split('.')[1]*1;
        //console.log(nowIndex);
        if( !value ){
          return  callback(new Error("请选择时间"));
        };
        if( nowIndex!==0 ){
            let previousDate =   this.form.stages[nowIndex-1].date;
            if ( !previousDate || !previousDate.length  ) {
                this.form.stages[nowIndex].date = [] ;
                return  callback(new Error('请先选择上一阶段的时间'));
            }else{
                let pre = new Date(this.form.stages[nowIndex-1].date[1]).getTime()
                let now = new Date(this.form.stages[nowIndex].date[0]).getTime()
                // console.log(pre +"pre");
                // console.log(now +'now');
                // console.log(pre<now);
                if(pre>now){
                    return  callback(new Error('不能早于上一阶段的时间'));
                };          
            }
          };
    
        //debugger
        if( this.form.stages[nowIndex+1] && this.form.stages[nowIndex+1].date && this.form.stages[nowIndex+1].date.length ){
            console.log(this.form.stages[nowIndex+1].date);
            let now = new Date(this.form.stages[nowIndex].date[1]).getTime()
            let next= new Date(this.form.stages[nowIndex+1].date[0]).getTime()
            // console.log(old);
            // console.log(now);
            // console.log(now);
            // console.log(next);
            // console.log(now<next);
            if(now>next){
                return  callback(new Error('不能晚于下一阶段的时间'));
            };
        };
        this.form.stages.forEach((i , index) =>{
            // console.log(i);
            // console.log(i.date);
            if(value[0]===i.date[0] && value[1]===i.date[1] && index !== nowIndex){
               return  callback(new Error('阶段'+`${index+1}选择已有相同时间`));
            }
        });
        callback()
    }
    
    return {
      columns:
        [
          {
            label: "主图",
            value: "imageUrl",
            minWidth: 150,
            img: true, //如图片传
            style: {
                //图片宽高
                width: 40,
                height: 40
            },
            bulkyHeight: 100 //鼠标hover图片高，宽度自动
          },    
          {
            label: "SKU",
            value: "sku",
            minWidth: 150,
            expand:true,
            render(h,scope,a,b){
              let { sku } = scope.row
              // return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
              return sku ? (
                <el-tooltip open-delay={300} content={sku} effect="light" placement="top">
                  <span style='display:inline-block;vertical-align: middle;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width:140px;'>{sku}</span>
                </el-tooltip>
              ) : (
                <span>-</span>
            )
            }
          },                  
          {
            label: "商品ASIN",
            value: "asin",
            minWidth: 150,
          },            
      ],
      downloadApi: 'orderTargetDownloadFile',
      action: `${host}orderTarget/importData`,
      ImportFileData:{
        
      },

      activeName:'first',
	    taskIds:[],
      errorSameParentAsin: "",
      ruluNumber(item,index) {
        return itemVali1(item,index);
      },
      ruluNumber1To100(item,index) {
        return itemVali1To100(item,index);
      },
      percent100(item, index, type) {
        return vali(item, index, type);
      },
      // 加入产品价格优化
      getRule(item, index) {
        return itemVali1(item, index);
      },
      //tableDialogShow: false,
      messageLoading: false,
      currentNodeKey: "",
      defaultExpandedKeys:[],
      parentAsin: null,
      addPriceOptimizeSku:null,
      submitLoadingPop: false,
      dialogVisiblePopOpt:{
        visible:false,
        title:'加入价格自动优化',
        width:"550px",
      },
      dialogVisiblePopOptEvents:{
        handleOkClick:()=>{
          return this.submitPop()
        }
      },
      dialogVisiblePop: false,
      skuOptions: [],
      childSkuOptions: [],
      showTips1Pop: false,
      showTipsPop: false,
      showTips2Pop: false,
      fontSumPop: 0,
      targetTypeOptions: [
        {
          label: "按订单目标",
          value: 1
        },
        {
          label: "按BSR目标",
          value: 2
        }
      ],
      editTaskId: null,
      searchData: {},
      searchLoading: false,
      radio: "从列表中选择产品",
      form2: {
        asins: ""
      },
      asinArr: null,
      asinArrPop: null,
      fontSum: 0,
      showTips: false,
      showTips1: false,
      showTips2: false,
      // 画图需要的数据 四
      // pcMonitoringData: false,
      // chartData: {
      //   title: "",
      //   taskId: "",
      //   type: "",
      //   monitorFrom: "",
      //   monitorTo: "",
      //   itemType: ""
      // },
      //selection:true,
      uploadTaskShow: false,
      title: "添加计划",
      fileList: [],
      fileList2: [],
      buttonLoading: {
        upload: false
      },
      status: 1,
      dialogVisible: false,
      submitLoading: false,
      elIconMenuShow: false,
      filterText: null,
      treeKey: 1,
      treeLoading: false,
      customCategoryData: [],
      defaultProps: {
        children: "list",
        label: "cusCateName"
      },
      form: {
        stages: [new newItem()]
      },
      rules: {
        date: [
           {  required: true, validator: dateValidatePass, trigger: ['blur','change'] }
        ],
        stageOrderCnt: [
          {
            required: true,
            message: "请输入订单目标",
            trigger: ["blur", "change"]
          }
        ],
        stageConversionRate: [
          {
            required: true,
            message: "请设置转化率",
            trigger: ["blur", "change"]
          }
        ],
        stageAdSessionsRate: [
          {
            required: true,
            message: "请设置广告访客占比"
            // trigger: ["blur", "change"]
          }
        ],
        stageNormalSessionsRate: [
          {
            required: true,
            message: "请设置自然访客占比"
            // trigger: ["blur", "change"]
          }
        ]
      },
      formPop: {
        stageList: [new newItemPop()]
      },
      rulesPop: {
        parentAsin: [
          {
            required: true,
            message: "产品ASIN不能为空"
            // trigger: ["blur", "change"]
          }
        ],
        seoMaxPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入最高价"
          }
        ],
        seoMinPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入最低价"
          }
        ],
        originalPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入原价"
          }
        ],
        priceRange: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入改价幅度"
          }
        ],
        priceFrequency: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入频率"
          }
        ],
        refParentAsin: [
          {
            required: true,
            message: "参考ASIN不能为空"
          }
        ],
        lowestSalesAsin: [
          {
            required: true,
            message: "区间asin不能为空"
          }
        ],
        intervalMinPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入价格"
          }
        ],
        sameParentAsins: [
          {
            required: true,
            message: "同款asin不能为空"
          }
        ],
        date: [
          {
            required: true,
            message: "请选择时间段"
          }
        ],
        targetType: [
          {
            required: true,
            message: "请选择订单目标类型"
          }
        ],
        stageOrderCnt: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入订单目标"
          }
        ],
        bsrCategory: [
          {
            required: true,
            message: "请选择类目"
          }
        ],
        rank: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ["change", "blur"]
            // message: "请输入目标排名"
          }
        ]
      },
      detail: null,
      stageList: null,
      // switch: false,
      taskId: null,
      //添加计划
      table1: {
        loading: false,
        // rowKey: "asin",
        rows: [],
        rows2: [],
        historyAsin: null,
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        userSelect: []
      },
      // // 表格
      // table: {
      //   loading: false,
      //   rows: []
      // }
      addAsins:null,//保存添加过的asin
      addNewData:null,//保存新添加的数据

      tabTableData:[],
      lookOtherStageData:[],
      lookOtherStageHtml:'查看其他阶段详情',
      islookOtherStage:false,

      loadingBtn1: false,
      refreshhtml: '手动刷新',
      BTNdisabled: false,

      addNewTaskId:null,

      handleNodeData:null,
    };
  },
  mounted() {
    this.debounceFilter = debounce(300, this.filterSider)
    this.$nextTick(() => {
      this.init();
    });
  },
  created(){
      if( this.sellerId && this.siteId){
         this.ImportFileData.sellerId=this.sellerId;
        this.ImportFileData.siteId=this.siteId;
      }
  },
  watch: {
    "formPop.parentAsin"(n) {
      if (n) {
        this.getChildSku();
        this.getDetailsPop({ taskId: this.taskId });
      }
    },
    filterText(val) {
      //this.debounceFilter()
       this.$refs.treeCustomCategory.filter(val);
    },
    sellerData() {
      this.init();
      this.ImportFileData.sellerId=this.sellerId;
      this.ImportFileData.siteId=this.siteId;
    },
    "form2.asins"(val) {
      //   console.log(val, "val");
      // 自定义校验
      let value = val
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.asinArr = value;
      this.fontSum = value.length;
      if (value.length > 500) {
        this.showTips = true;
        // callback(new Error("asin最多只能输入500个"));
      } else {
        this.showTips = false;
      }
    },
    "formPop.sameParentAsins"(val) {
      if (val === "") {
        this.showTipsPop = false;
        this.showTips1Pop = false;
        this.showTips2Pop = false;
      }
      //   console.log(val, "val");
      // 自定义校验
      let value = val
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.asinArrPop = value;
      this.fontSumPop = value.length;
      if (value.length > 500) {
        this.showTipsPop = true;
        // callback(new Error("asin最多只能输入500个"));
      } else {
        this.showTipsPop = false;
      }
    },
    radio() {
      this.table1.userSelect = [];
      this.form2.asins = null;
      this.fontSum=0
    }
  },
  methods: {
    //导入数据成功
    handleSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.params.success()
      }
    },
    //查看其他阶段详情
    lookOtherStage(){
      this.islookOtherStage=!this.islookOtherStage;
      if(this.islookOtherStage){
            this.lookOtherStageHtml='收起其他阶段详情'
      }else{
         this.lookOtherStageHtml='查看其他阶段详情'
      }
    },
	  targetMethod(type){
      // if(!this.taskIds.length) return this.$message.warning('请选择至少一项')
      let params = {sellerId:this.sellerId,siteId:this.siteId,ids:[this.taskId],pauseFlag:type==='open'?1:0}
      this.$confirm(type==='open'?'此操作将开启目标,是否继续?':'此操作将暂停目标,是否继续' , '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        this.$api['orderTargetPause'](params).then((e)=>{
          this.init()
        })
      }).catch(()=>{})
    },
    handleSelectionChangeItem(i){
      this.taskIds = []
      i.forEach(e => {	
        this.taskIds.push(e.taskId)
      })
    },
    handleTabClick(){},
    // 侧边栏搜索asin/sku
    filterSider() {
      let params = {
        asin: this.filterText
      };
      this.init(params);
    },
    async init(arg) {
      if (this.sellerId && this.siteId) {
        let siderSkuList = await this.getcustomCategoryListList(arg);
        //console.log(siderSkuList);
        if (siderSkuList && !this.addNewTaskId) {
            //console.log('1rewrewrwerwer');
            this.handleNodeClick(siderSkuList[0].list[0]);
        }else{
            //console.log('rewrewrwerwer');
            this.handleNodeClick(this.addNewData);
        }
      }
    },
    //加入价格自动优化获取当前选的asin的子asin
    getChildSku() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentAsin: this.formPop.parentAsin
      };
      this.$api["ProductListAsin"](params)
        .then(data => {
          // console.log(data);
          let data1 = data.data;
          let arr = [];
          data1.forEach(el => {
            arr.push({
              label: el,
              value: el
            });
          });
          this.childSkuOptions = arr;
          this.$set(this.formPop, "lowestSalesAsin", null);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //加入价格自动优化获取产品ASIN的下拉
    getSkusPop(arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      };
      params = this.$.dealObjectValue(params);
      return this.$api["ProductListParentProduct"](params)
        .then(data => {
          this.skuOptions = [];
          this.refParentAsinOptions = [];
          // console.log(data);
          let data1 = data.data;
          data1.forEach(el => {
            this.skuOptions.push({
              label: el.asin,
              value: el.asin
            });
            this.refParentAsinOptions.push({
              label: el.asin,
              value: el.asin
            });
          });
          //console.log(this.parentAsin);
          // this.skuOptions.forEach(k=>{
          //     if( k.label === this.parentAsin){
          //         this.$set(this.formPop, "parentAsin", k.label);
          //     }
          // })
          this.$set(this.formPop, "parentAsin",this.parentAsin);
          return true;
        })
        .catch(err => {
          console.log(err);
          return true;
        });
    },
    // 加入价格自动优化增加一项
    addItemPop() {
      let item = new newItemPop();
      this.formPop.stageList.push(item);
    },
    // 加入价格自动优化删除一项
    spliceItemPop(index) {
      this.formPop.stageList.splice(index, 1);
    },
    // 加入价格自动优化
    POPshowDialog() {
      this.dialogVisiblePopOpt.visible= true;
      this.$nextTick(() => {
        this.formPop = {
          stageList: [new newItemPop()]
        };
        this.showTips2Pop = false;
        this.showTips1Pop = false;
        this.showTipsPop = false;
        this.$refs.ruleFormPop.resetFields();
      });
      // this.URL = "OrderTargetSave";
      this.getDetailsPop({ taskId: this.taskId });
      this.getSkusPop();
    },
    // 获取编辑信息 todo
    getDetailsPop(arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        ...arg
      };
      this.$api["TaskPriceSeoInfo"](params)
        .then(data => {
          // console.log(data.data.stageList, "data.data.stageList");
          let stageList = [];
          data.data.stageList.forEach((el, index) => {
            stageList.push({
              date: [el.startTime, el.endTime],
              targetType: el.targetType, //目标类型
              stageOrderCnt: el.stageOrderCnt, //目标
              bsrCategory: el.bsrCategory, //亚马逊类目
              rank: el.rank
            });
          });
          // console.log(stageList, "stageList");
          this.formPop = {
            parentAsin: data.data.parentAsin,
            seoMaxPrice: data.data.seoMaxPrice,
            seoMinPrice: data.data.seoMinPrice,
            originalPrice: data.data.originalPrice,
            priceRange: data.data.priceRange,
            priceFrequency: data.data.priceFrequency,
            intervalMinPrice: data.data.intervalMinPrice,
            lowestSalesAsin: data.data.lowestSalesAsin,
            sameParentAsins: data.data.sameParentAsins,
            newProductFlag: data.data.newProductFlag === 1 ? true : false,
            refParentAsin: data.data.refParentAsin,
            stageList: stageList
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    async searchFun() {
      this.searchLoading = true;
      this.table1.pageNumber = 1;
      let result = await this.getSkus(this.searchData);
      this.searchLoading = false;
    },
    // 添加计划table选中的项
    handleSelectionChange(val) {
      this.table1.userSelect = val;
    },
    // 添加计划table的分页
    handleSizeChange(pageSize) {
      //   this.table1.pageNumber = 1;
      this.$set(this.table1, "pageNumber", 1);
      this.getSkus({ pageSize: pageSize });
    },
    // 添加计划table的当前分页改变
    handleCurrentChange(pageNumber) {
      //   this.table1.pageSize = 10;
      this.$set(this.table1, "pageSize", 10);
      this.getSkus({ pageNumber: pageNumber });
    },
    //添加计划获取table的数据
    getSkus(arg) {
      let params = {
        pageNumber: this.table1.pageNumber,
        pageSize: this.table1.pageSize,
        sellerId: this.sellerId,
        siteId: this.siteId,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.table1.loading = true;
      return this.$api["ProductPageParentProduct"](params)
        .then(data => {
          this.table1.loading = false;
          this.table1.rows = data.rows;
          this.table1.pageNumber = data.pageNo;
          this.table1.pageSize = data.pageSize;
          this.table1.total = data.total;
          return data.rows;
        })
        .catch(err => {
          console.log(err);
          this.table1.loading = false;
          return true;
        });
    },
    // 下载模板
    downLoad() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + "orderTarget/downloadFile",
        data: "",
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "订单目标设置模板.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 上传模板
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    //模板删除
    handleFileRemove(file, fileList) {
      this.fileList = [];
    },
    // 模板确认上传
    upload() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      let params = new FormData();
      params.append("siteId", this.siteId);
      params.append("sellerId", this.sellerId);
      params.append("file", this.fileList[0].raw);
      this.buttonLoading.upload = true;
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$ajax
        .post(BASE_URL + "orderTarget/importData", params, headers)
        .then(res => {
          // console.log(res);
          this.buttonLoading.upload = false;
          let code = res.code;
          if (code == 0) {
            this.uploadTaskShow = false;
            this.$message.success(res.msg);
          } else if (code === 500) {
            this.buttonLoading.upload = false;
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.buttonLoading.upload = false;
          this.$message.error(res.msg);
        });
    },
    //添加计划阶段增加一项
    addItem(index) {
      // console.log(index);
      // console.log(this.form.stages[0].date); 
      let item = new newItem();
      if(this.form.stages[index].date && this.form.stages[index].date[1]){
        let day = dayjs(new Date(this.form.stages[index].date[1]).getTime()+3600*24*1000).format('YYYY-MM-DD')
        item.date=[this.form.stages[index].date[1],day]
      }
      //console.log(item);
      this.form.stages.push(item);
    },
    //添加计划阶段删除一项
    spliceItem(index) {
      this.form.stages.splice(index, 1);
    },
    //添加计划
    showDialog() {
      // status 为1 是添加状态
      this.status = 1;
      this.title = "添加计划";
      this.dialogVisible = true;
      this.table1.pageNumber=1;
      this.searchData.asin=null;
      this.form2.asins=null;
      this.fontSum=0;
      this.$nextTick(() => {
        this.form = {
          stages: [new newItem()]
        };
        this.$refs.ruleForm.resetFields();
      });
      this.URL = "OrderTargetSave";
      console.log('getSkus');
      this.getSkus();
    },
    //编辑计划
    async showDialog2() {
      // 将status 设置为2 表示编辑状态
      this.status = 2;
      this.title = "编辑计划";
      let arr = this.$refs.treeCustomCategory.getCheckedKeys(true);
      let newArr = arr.filter(item => item);
      if  (newArr.length > 1) {
        this.$message.warning("编辑只能选中一个sku");
        return;
      }else if( !this.taskId){
        this.$message.warning("请选择有数据的进行编辑");
        return;
      }
      this.dialogVisible = true;
      this.table1.pageNumber=1;
      this.searchData.asin=null;
      this.form2.asins=null;
      this.fontSum=0;
      this.$nextTick(() => {
        this.form = {
          stages: [new newItem()]
        };
        this.$refs.ruleForm.resetFields();
      });
      this.URL = "OrderTargetEdit";
      this.editTaskId = newArr[0] || this.taskId;
      // 回显
      console.log(this.editTaskId);
      //return
      this.getDetails(this.editTaskId );
    },
  
    //获取计划编辑信息
    getDetails(taskId) {
      this.table1.loading=true;
      let params = {
        taskId: taskId,
        sellerId: this.sellerId,
        siteId: this.siteId
      };
      this.$api["OrderTargetStage"](params)
        .then(data => {
          console.log(data, "data");
           this.table1.loading=false;
          let stages = [];
          data.data.forEach((el, index) => {
            stages.push({
              date: [el.startTime, el.endTime],
              adOrderCnt: el.adOrderCnt, 
              normalOrderCnt: el.normalOrderCnt, 
              adSessions: el.adSessions, 
              normalSessions: el.normalSessions, 
              normalConversionRate: Number(el.normalConversionRate * 100).toFixed(
                2
              ), 
              adConversionRate: Number(el.adConversionRate * 100).toFixed(
                2
              ),
      
            });
          });
          //   console.log(stages, "stageList");
          this.form = {
            stages: stages
          };
          // todo
          if (this.status == 2) {
            // console.log(data.asin);
            this.getSkus({ asin: data.asin });
          }
          // this.historySku = data.data.
        })
        .catch(err => {
          console.log(err);
          this.table1.loading=false;
        });
    },
    //添加计划添加提交
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.stages.forEach((el, index) => {
            el.stageNo = index + 1;
          });
          for (let i = 0; i < this.form.stages.length; i++) {
            let el = this.form.stages[i];
            let stageNo = i + 1;
            let adConversionRate = +el.adConversionRate;
            let normalConversionRate = +el.normalConversionRate;
            if (adConversionRate + normalConversionRate != 100) {
              this.$alert(
                "阶段" +
                  stageNo +
                  " 有误 ：" +
                  "广告转化率 与 自然转化率 之和应该等于100%",
                "提示",
                {
                  confirmButtonText: "确定"
                }
              );
              return;
            }
          }
          this.submitLoading = true;
          let params = {
            siteId: this.siteId,
            sellerId: this.sellerId,
            platformId: this.platformId,
            taskId: this.editTaskId,
            ...this.form
          };
          if (this.status == 1) {
            if (this.radio === "从列表中选择产品") {
              if (this.table1.userSelect.length === 0) {
                this.$message.warning("请选择asin");
                this.submitLoading = false;
                return;
              } else if (this.table1.userSelect.length > 500) {
                this.$message.warning("asin不能超过500");
                this.submitLoading = false;
                return;
              }
              params.asins = [];
              this.table1.userSelect.forEach(el => {
                params.asins.push(el.asin);
              });
            } else if (this.radio === "自定义输入") {
              // console.log(this.asinArr, "asinArr");
              if (!this.asinArr) {
                this.showTips1 = true;
                this.submitLoading = false;
                return;
              } else if (this.asinArr.length > 500) {
                this.showTips = true;
                this.submitLoading = false;
                return;
              } else {
                this.showTips = false;
                this.showTips1 = false;
              }
              params.asins = this.asinArr;
            }
          }
          //   console.log(params, "params");
          let data_ = JSON.parse(JSON.stringify(params.stages));
          data_.forEach(el => {
            el.adConversionRate = Number(el.adConversionRate) / 100;
            el.normalConversionRate = Number(el.normalConversionRate) / 100;
            el.startTime = el.date[0];
            el.endTime = el.date[1];
            for(let k in el){
              if(k!=='startTime' && k!=='endTime' && k!=='date'){
                  el[k]=el[k]*1
              }
            }
          });
          params.stages = data_;

          this.addAsins = params.asins ;
          this.$api[this.URL](params)
            .then(data => {
              this.submitLoading = false;
              this.dialogVisible = false;
              this.init();
            })
            .catch(err => {
              this.submitLoading = false;
              console.log(err);
            });
        }
      });
    },
    //加入价格自动优化提交
    submitPop() {
      this.errorSameParentAsin = false;
      let errorSameParentAsin = "";
      this.$refs.ruleFormPop.validate(valid => {
        if (valid) {
          if (this.asinArrPop) {
            this.asinArrPop.forEach(el => {
              if (el.length !== 10) {
                errorSameParentAsin += el + ",";
              }
            });
            this.errorSameParentAsin = errorSameParentAsin.slice(0, -1);
            if (this.errorSameParentAsin) {
              this.showTips2Pop = true;
              return;
            } else {
              this.showTips2Pop = false;
            }
          }
          this.formPop.stageList.forEach((el, index) => {
            el.stageNo = index + 1;
          });
          this.submitLoadingPop = true;
          let params = {
            siteId: this.siteId,
            sellerId: this.sellerId,
            platformId: this.platformId,
            ...this.formPop
          };
          params.stageList.forEach(el => {
            el.startTime = el.date[0];
            el.endTime = el.date[1];
          });
          // console.log(this.asinArrPop, "asinArrPop");
          if (!this.asinArrPop) {
            this.showTips1Pop = true;
            this.submitLoading = false;
            return;
          } else if (this.asinArrPop.length > 500) {
            this.showTips = true;
            this.submitLoading = false;
            return;
          } else {
            this.showTips1Pop = false;
            this.showTips = false;
          }
          params.sameParentAsins = this.asinArrPop;
          params.newProductFlag = params.newProductFlag === true ? 1 : 0;
          //   console.log(params, "params");
          this.$api["TaskPriceSeoSave"](params)
            .then(data => {
              this.submitLoadingPop = false;
              this.dialogVisiblePopOpt.visible = false;
              // this.getcustomCategoryList();
            })
            .catch(err => {
              this.submitLoadingPop = false;
              console.log(err);
            });
        }
      });
    },
    // showAll() {
    //   this.tableDialogShow = true;
    //   this.stageList = this.detail.stageList;
    // },
    // closeDialog() {
    //   this.stageList = this.detail.stageList.slice(0, 2);
    // },
    //左边的树形结构点击节点
    handleNodeClick(data) {
      console.log(data);
      this.handleNodeData = data;
      if (data.parentAsin) {
        this.parentAsin = data.parentAsin;
        this.addPriceOptimizeSku = data.sku;
        console.log(this.addPriceOptimizeSku);
      };
      let taskId = data.taskId;
      let params = {
        siteId: this.siteId,
        sellerId: this.sellerId,
        taskId: data.taskId
      };
      if (taskId &&  taskId!==-10000) {
          this.messageLoading = true;
          if(this.detail && this.detail.entity && this.detail.entity.imageUrl){
              this.detail.entity.imageUrl=null
          }
        this.taskId = data.taskId;
        console.log(this.taskId+'this.taskId');
        this.$api["OrderTargetTaskDetail"](params)
          .then(data => {
            let cntList = [
              {
                starCnt: data.data.entity.starCnt,
                aqCnt: data.data.entity.aqCnt,
                bottom1StarCnt: data.data.entity.bottom1StarCnt,
                bottom2StarCnt: data.data.entity.bottom2StarCnt,
                bottom3StarCnt: data.data.entity.bottom3StarCnt,
                bottom4StarCnt: data.data.entity.bottom4StarCnt,
                bottom5StarCnt: data.data.entity.bottom5StarCnt
              }
            ];
            data.data.cntList = cntList;
            //console.log('object66666666666');
            this.tabTableData=data.data.stageList || [];
            //console.log(this.tabTableData);
            this.detail = data.data;
            //console.log(this.detail, "this.detail");
            if( this.detail.stageList){
                this.stageList = this.detail.stageList.slice(0, 2);
            }
            //this.table.rows = this.detail.asinList;
            this.messageLoading = false;
       
            // tableDialog 查看详情
            // this.tableDialog.rows = data.data.stageList;
          })
          .catch(err => {
             this.messageLoading = false;
             this.tabTableData=null;
             this.detail=null;
             this.stageList=null;
            
            console.log(err);
          });
          this.$api['orderTargetListStage']({
              sellerId:this.sellerId,
              siteId:this.siteId,
              taskId : data.taskId
          })
          .then(data => {
            this.lookOtherStageData=data.data || [];
            //console.log(data);
          }).catch(() => {
                this.lookOtherStageData=[]
          })
        // this.getList({ taskId: taskId });
      }
    },
    //左边的树形结构删除节点
    sideDelete() {
      console.log(this.$refs.treeCustomCategory.getCheckedKeys());
      let arr = this.$refs.treeCustomCategory.getCheckedKeys();
      if (!arr.length) {
        this.$message.warning("未选中sku");
        return;
      }
      let newArr = arr.filter(item => item);
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            sellerId: this.sellerId,
            siteId: this.siteId,
            ids: newArr
          };
          this.$api["OrderTargetBatchRemove"](params).then(res => {
            // 重新请求列表
            this.init();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      //   console.log(newArr);
    },
    //处理数据
    processingData(data){
      data.forEach(i=>{
        if( i.childList){
            i.list=i.childList
            delete i.childList
        };
        if(i.sku){
            i.cusCateName=i.sku
        };  
        if( i.childList || i.list){
            let el=  i.childList || i.list ;
            this.processingData(el)
        }
      })
    },
    //获取左边树形结构的数据
    getcustomCategoryListList(arg) {
      this.treeLoading = true;
      return this.$api["OrderTargetListTask"]({
        sellerId: this.sellerId,
        platformId: this.platformId,
        siteId: this.siteId,
        ...arg
      })
        .then(res => {
          this.treeLoading = false;
          let data = res.data;
          // console.log(data, "data");
  
          this.processingData(data)
          this.customCategoryData = data;
          //console.log(this.customCategoryData);
          this.currentNodeKey = data[0].list[0].taskId;
          //console.log(currentNodeKey);
          this.defaultExpandedKeys=[];
          this.customCategoryData.forEach(i=>{
              i.taskId=-10000;
               this.defaultExpandedKeys.push(-10000)
          })
          //console.log(this.currentNodeKey, "currentNodeKey");
        
          this.setCurrentKey(this.currentNodeKey)

          // console.log(this.addAsins);
          if(this.addAsins){
            let asin= this.setNewAdd(data);
            // console.log(this.addNewTaskId);
            // console.log(this.addNewData);
            this.setCurrentKey(this.addNewTaskId);
            this.currentNodeKey = this.addNewTaskId ;
          };

          
          return data;
        })
        .catch(err => {
          console.log(err);
          this.treeLoading = false;
          this.customCategoryData = [];
          return false;
        });
    },
    //找寻刚添加的节点的
    setNewAdd(data){
        data.forEach(i=>{
          this.addAsins.forEach(k=>{
             if(i.asin === k && i.taskId){
                this.addNewTaskId = i.taskId;
                this.addNewData = i;
                this.defaultExpandedKeys.push(i.taskId) ;
            };
          });
          if(i.list){
            this.setNewAdd(i.list)
          };
        })
    },
    //设置当前选中节点
    setCurrentKey(k){
      // console.log(k);
      this.$nextTick(() => { this.$refs.treeCustomCategory.setCurrentKey(k);} )
    },
    //左边树形结构的搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.cusCateName.indexOf(value) !== -1;
    },
    // //获取更新状态
    //   getManualUpdate() {
    //     this.$api['productManualUpdateStatus']({
    //       //siteId:this.listQuery.siteId,
    //       //siteId:this.listQuery.siteId,
    //       siteId: this.siteId,
    //       sellerId: this.sellerId,
    //       merchantId: 2
    //     })
    //       .then(data => {
    //         // debugger

    //         if (data.code === 0) {
    //           this.loadingBtn1 = false
    //         }
    //       })
    //       .catch(err => {
    //         // if (err && err.code) {
    //         //   this.refreshhtml = '正在刷新中'
    //         //   this.loadingBtn1 = true
    //         // }
    //         if (err.code === 500) {
    //           this.refreshhtml = '正在刷新中'
    //           this.loadingBtn1 = true
    //         }
    //         if (err.code === 400) {
    //           this.refreshhtml = '今日数据已更新'
    //           this.loadingBtn1 = false
    //           this.BTNdisabled = true
    //         }
    //       })
    //   },
    //手动更新
      setManualUpdate() {
        // this.$confirm('数据更新可能需要2~3个小时，是否确认更新?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
            this.loadingBtn1 = true
            this.refreshhtml = '正在刷新中'
            this.$api['orderTargetManualUpdate']({
              //siteId:this.listQuery.siteId,
              //siteId:this.listQuery.siteId,
              siteId: this.siteId,
              sellerId: this.sellerId,
            })
            .then(res => {
                //console.log(res);
                if (res.code === 0) {
                
                  //this.handleFilter()
                  // this.refreshhtml = '正在刷新中'
                  // this.BTNdisabled = true
                  // this.loadingBtn1 = false
                  //console.log('66666ewqeqe');
                  this.refreshhtml = '手动更新'
                  this.BTNdisabled = false
                  this.loadingBtn1 = false

                  this.handleNodeClick(this.handleNodeData);
                 
                }
              })
              .catch(err => {
                  this.refreshhtml = '手动更新'
                  this.BTNdisabled = false
                  this.loadingBtn1 = false
                //console.log(err);
                // if (err.code === 400) {
                //   this.BTNdisabled = true
                //   this.refreshhtml = '今日数据已更新'
                //   this.loadingBtn1 = false
                // } else if (err.code === 500) {
                //   this.BTNdisabled = true
                //   this.refreshhtml = '正在刷新中'
                // }
              })
        // }).catch(() => {

        // });
      },
  }
};
</script>
<style lang="less" scoped>
.el-icon-box {
  display: flex;
  justify-content: flex-end;
  font-size: 16px !important;
}
.box {
  .box-left-menu {
    .el-icon-box {
      margin-top: 5px;
      margin-bottom: 5px;
      /deep/[class^="el-icon-"] {
        // margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .box-body {
    .el-tabs {
      -webkit-box-shadow: 0 0 0 0;
      box-shadow: 0 0 0 0;
      /deep/.el-tabs__content {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
.inner-add-visible-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 270px;
      margin-right: 10px;
    }
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
  }
}
.inner-visible-dialog {
  .body-box {
    padding: 10px;
    border: 1px solid @borderColor;
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
  }
}

.add-yt-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 260px;
      margin-right: 10px;
    }
  }
}
.tree-dialog {
  .el-tree {
    // border:1px solid @borderColor;
    // padding: 5px;
    height: 300px;
    overflow-y: auto;
  }
}
.dialog-footer {
  text-align: center;
}
.esc_desc {
  padding: 0px 7px;
}
.header {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  background: #faf7f5;
  padding: 0 10px;
  position: relative;
}
.p-container {
  // float: left;
  float: left;
  box-sizing: border-box;
  padding: 10px 0px;
  top: 79px;
  left: 10px;
  width: 260px;
  display: inline-block;
  .picture {
    width: 240px;
    height: 240px;
    overflow: hidden;
    background-color: #fff;

    img {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    img[lazy="loaded"] {
      background: #fff;
    }
  }
}
.pd-container {
  float: left;
  box-sizing: border-box;
  width: calc(100% - 260px);
  // float: right;
  display: inline-block;
  vertical-align: top;
  padding: 10px 0px;
  margin-top: 5px;
  font-size: 14px;
  .s {
    margin-right: 40px;
  }
}
.big__ {
  width: 300px;
  height: 150px;
  object-fit: contain;
  overflow: hidden;
}
.__box_wrapper__local_page {
  display: flex;
  margin: 12px 10px 0px;
  .el-form-item {
    display: inline-block !important;
    position: relative;
    margin-bottom: 18px;
  }
}
</style>
