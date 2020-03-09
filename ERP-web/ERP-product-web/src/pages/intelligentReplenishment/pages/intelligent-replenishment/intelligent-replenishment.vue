<template>
  <section class="intelligent-replenishment">
    <!-- -->
    <IRLayout>
      <!--   -->
      <template slot="header">
        <div class="title">智能补货列表</div>
        <ul class="title-btn">
          <li>
            <el-button type="primary" size="small" @click="onManualSync">手动同步</el-button>
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/IntelligentReplenishment/SynchronousLog')"
            >同步日志</el-button>
          </li>
          <li>
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/IntelligentReplenishment/setCalculate')"
            >计算公式参数设置
              <!-- <router-link :to="{ path:'/IntelligentReplenishment/setCalculate', params: {} }">计算公式参数设置</router-link> -->
            </el-button>
          </li>
          <li>
            <el-button type="primary" size="small" @click="changePeriod(1)">恢复系统周期</el-button>
            <el-button type="primary" size="small" @click="changePeriod(0)">更改生命周期</el-button>
          </li>
          <li>
            <el-button type="primary" size="small" @click="attention(1)">批量关注</el-button>
            <el-button type="primary" size="small" @click="attention(0)">批量取消关注</el-button>
            <el-button type="primary" size="small" @click="delVariant()" :disabled="!!attentionFlag">批量删除</el-button>
          </li>
          <li>
            <el-dropdown @command="handleCommand">
              <el-button size="small" type="primary">
                批量导入
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">导入运输中数量</el-dropdown-item>
                <el-dropdown-item command="e">导入生产中数量</el-dropdown-item>
                <el-dropdown-item command="b">导入生产详情</el-dropdown-item>
                <el-dropdown-item command="c">导入库存</el-dropdown-item>
                <el-dropdown-item command="d">导入上架时间</el-dropdown-item>
                <!-- <el-dropdown-item disabled>导入采购中数量</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button
              type="primary"
              size="small"
              @click="$message.info('正在建设中')"
              style="background:#888;border-color:#888"
            >导入采购中数量</el-button>
            <el-button type="primary" size="small" @click="importExcel('num')">导入运输中数量</el-button>
            <el-button type="primary" size="small" @click="importExcel('produce')">导入生产详情</el-button>
            <el-button type="primary" size="small" @click="importExcel('stock')">导入库存</el-button>
            <el-button type="primary" size="small" @click="importExcel('time')">导入上架时间</el-button>-->
          </li>
          <li>
            <el-button
              type="primary"
              size="small"
              @click="$router.push({path: '/IntelligentReplenishment/batchReplenishment', query: {intelligentReplenishmentSelected: JSON.stringify(selected.map(el => el.replenishProductId)), type:'FBA'}})"
            >批量补货</el-button>
            <el-button
              type="primary"
              size="small"
              @click="$router.push({path: '/IntelligentReplenishment/batchReplenishment', query: {intelligentReplenishmentSelected: JSON.stringify(selected.map(el => el.replenishProductId)), type:'LOCALHOST'}})"
            >批量生产</el-button>
            <el-button type="primary" size="small" @click="$router.push('/IntelligentReplenishment/Replenishment')">补货明细</el-button>
            <el-button type="primary" size="small" @click="$router.push('/IntelligentReplenishment/Produce')">生产明细</el-button>
          </li>
        </ul>
      </template>
      <!-- 搜索  -->
      <template slot="select">
        <ul class="selectList">
          <li>
            <el-select
              v-model="select.platformId"
              multiple
              placeholder="来源平台（可多选）"
              filterable
              clearable
              collapse-tags
              size="small"
              @change="handlerPlatformIdChange"
            >
              <el-option v-for="item in sourcePlatformList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </li>
          <li>
            <el-select
              v-model="select.shopId"
              multiple
              placeholder="来源店铺（可多选）"
              filterable
              clearable
              collapse-tags
              size="small"
            >
              <el-option v-for="item in sourceShopList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </li>
          <li>
            <el-select placeholder="产品生命周期" clearable size="small" v-model="select.productCycle">
              <!-- <el-option v-for="item in periodList" :key="item.value" :label="item.label" :value="item.value" /> -->
              <el-option v-for="(val,key,index) in cycleList" :key="index" :label="key" :value="val"/>
            </el-select>
          </li>
          <li>
            <el-select placeholder="是否手动更改周期" clearable size="small" v-model="select.artificialCycle">
              <el-option v-for="item in attentionList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </li>
          <li class="inputrow">
            <!-- <span>产品SKU：</span> -->
            <el-input placeholder="产品SKU" size="small" style="width:100%" v-model="select.sku"/>
          </li>
          <li class="inputrow">
            <!-- <span>产品名称：</span> -->
            <el-input placeholder="产品名称" size="small" style="width:100%" v-model="select.productName"/>
          </li>
          <li>
            <el-button type="primary" size="small" @click="onSeek('search')" icon="el-icon-search">搜 索</el-button>
          </li>
        </ul>
      </template>

      <!-- table -->
      <template slot="table">
        <div style="display: flex;justify-content:space-between;align-item:center;margin-bottom:12px">
          <p class="userSelect">
            已选择：
            <strong>{{selected.length}}</strong> 条
          </p>
          <el-radio-group v-model="attentionFlag" size="small" @change="onSeek('reset')">
            <el-radio-button :label="1">关注产品</el-radio-button>
            <el-radio-button :label="0">非关注产品</el-radio-button>
          </el-radio-group>
          <CustomList :data.sync="columns" save-field="intelligent_list"></CustomList>
        </div>

        <el-table
          :max-height="tableMaxHeight"
          row-key="replenishProductId"
          v-loading="loading"
          @sort-change="handleSort"
          @selection-change="userSelectTable"
          @select="selectTable"
          @select-all="selectTable"
          element-loading-text="拼命加载中"
          :data="intelligentReplenishmentList.rows"
          tooltip-effect="dark"
          ref="table"
          style="width: 100%"
          class="curtable"
          :cell-class-name="cellName"
        >
          <el-table-column type="selection" width="30" :reserve-selection="true"/>
          <el-table-column label="查看变体" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                class="intelligent-btn"
                v-if="scope.row.variantsFlag && scope.row.parentFlag && scope.row._isOpen"
                type="text"
                @click="closeVariant(scope.row, scope.$index)"
              >关闭变体</el-button>
              <el-button
                class="intelligent-btn"
                v-if="scope.row.variantsFlag && scope.row.parentFlag && !scope.row._isOpen"
                type="text"
                @click="viewVariant(scope.row, scope.$index)"
              >
                查看变体
                ({{scope.row.childCount}})
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="edit-box btn_wrapper" style="text-align:center">
                <div>
                  <span>
                    <el-tooltip class="item" effect="dark" content="打开产品链接" placement="top-start" :open-delay="500">
                      <a :href="scope.row.productUrl" class="btn" target="_blank">
                        <i class="iconfont __editBtns" v-html="`&#xe7e2;`"></i>
                      </a>
                    </el-tooltip>
                  </span>
                  <span v-if="!attentionFlag">
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :open-delay="500">
                      <span @click.stop="delVariant(scope)" class="btn">
                        <i class="iconfont __editBtns" v-html="`&#xe7c3;`"></i>
                      </span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="产品图片"
            align="center"
            width="70"
            v-if="columns.find(el =>el.field === 'productImage' && el.show)"
          >
            <template slot-scope="scope">
              <div class="subItems">
                <el-tooltip placement="right" effect="light" :open-delay="300">
                  <div slot="content">
                    <img
                      :src="scope.row.productImage && scope.row.productImage.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'"
                    >
                  </div>
                  <div class="divContent" style="position:relative" :class="!scope.row.parentFlag ? '__variant' : ''">
                    <img
                      :src="scope.row.productThumbnailImage || '/static/no-image.jpg'"
                      :key="scope.row.productThumbnailImage"
                    >
                  </div>
                </el-tooltip>

                <div class="img-wrapper">
                  <img
                    v-if="isCycle(scope.row) == 1"
                    src="/static/icons/intelligent_replenishment/top.png"
                    alt
                    class="hintIcon"
                  >
                  <!-- 上升 -->
                  <img
                    v-if="isCycle(scope.row) == 2"
                    src="/static/icons/intelligent_replenishment/bottom.png"
                    alt
                    class="hintIcon"
                  >
                  <!-- 下降 -->
                  <img
                    v-if="isCycle(scope.row) == 3"
                    src="/static/icons/intelligent_replenishment/usertop.png"
                    alt
                    class="hintIcon"
                  >
                  <!-- 手动上升 -->
                  <img
                    v-if="isCycle(scope.row) == 4"
                    src="/static/icons/intelligent_replenishment/userbottom.png"
                    alt
                    class="hintIcon"
                  >
                  <!-- 手动下降 -->
                  <img
                    v-if="isCycle(scope.row) == 5"
                    src="/static/icons/intelligent_replenishment/keep.png"
                    alt
                    class="hintIcon"
                  >
                  <!-- 关注 -->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="产品名称"
            min-width="130"
            align="left"
            v-if="columns.find(el =>el.field === 'productName' && el.show)"
          >
            <template slot-scope="scope">
              <el-tooltip placement="top" effect="light">
                <div>
                  <p class="show1line">{{scope.row.productName | _formatData}}</p>
                  <p class="show1line">SKU：{{scope.row.sku | _formatData}}</p>
                  <p class="show1line">店铺：{{scope.row.shopName | _formatData}}</p>
                </div>

                <div slot="content">
                  <p>{{scope.row.productName | _formatData}}</p>
                  <p>SKU：{{scope.row.sku | _formatData}}</p>
                  <p>店铺：{{scope.row.shopName | _formatData}}</p>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="产品ID"
            min-width="150"
            align="left"
            v-if="columns.find(el =>el.field === 'ID' && el.show)"
          >
            <template slot-scope="scope">
              <p>ASIN：{{scope.row.asin | _formatData}}</p>
              <p v-if="!scope.row.parentFlag">FNSKU：{{scope.row.fnsku | _formatData}}</p>
              <p
                v-if="(scope.row.parentFlag || !scope.row.variantsFlag) && scope.row.shelfTime"
              >上架时间：{{scope.row.shelfTime.split(' ')[0]}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="localInventory"
            label="仓库库存"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'warehouseName' && el.show)"
          />
          <el-table-column
            label="当前库存"
            min-width="170"
            prop="actualStockSort"
            align="center"
            :render-header="handlerRenderHeader1"
            sortable="custom"
            v-if="columns.find(el =>el.field === 'currentStock' && el.show)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.actualStock + scope.row.transportStock}}</div>
              <el-button-group>
                <el-button type="info" size="mini">{{scope.row.actualStock | _formatData}}</el-button>
                <el-tooltip
                  :open-delay="300"
                  placement="bottom"
                  effect="light"
                  content="Bottom Center"
                  @mouseenter.native="handlerToolTipMouseenter(scope.row, scope.$index)"
                  @mouseleave.native="handlerToolTipMouseleave"
                >
                  <div slot="content">
                    <table-hover :table-data="tableDatas[scope.$index]"/>
                  </div>
                  <el-button plain size="mini">{{scope.row.transportStock | _formatData}}</el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            prop="produceingCount"
            label="采购中库存"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'purchaseAccount' && el.show)"
          />
          <el-table-column
            label="当日销量/日均销量"
            min-width="240"
            align="center"
            :render-header="handlerRenderHeader2"
            v-if="columns.find(el =>el.field === 'dailySales' && el.show)"
          >
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="300"
                placement="bottom"
                effect="light"
                content="Bottom Center"
                @mouseenter.native="handlerToolTipMouseenter1(scope.row, scope.$index)"
                @mouseleave.native="handlerToolTipMouseleave"
              >
                <div slot="content">
                  <DailyBox :table-data="tableDatasDailySales[scope.$index]"/>
                </div>
                <div>
                  <el-button type="text" style="color:#333;">{{scope.row.dailySales | _formatData}}</el-button>
                  <i>/</i>
                  <el-button type="text">{{scope.row.avgSales | _formatData}}</el-button>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="运输方式"
            min-width="120"
            align="center"
            v-if="columns.find(el =>el.field === 'transportName' && el.show)"
          >
            <template slot-scope="scope">
              <p>{{scope.row.transportName | _formatData}}</p>
              <el-tooltip
                :open-delay="300"
                placement="bottom"
                effect="light"
                content="Bottom Center"
                @mouseenter.native="handlerToolTipMouseenter2(scope.row, scope.$index)"
                @mouseleave.native="handlerToolTipMouseleave"
              >
                <div slot="content">
                  <input-table :table-data="tableDatasShipping[scope.$index]"/>
                </div>
                <div @click="showTransDialog(scope.$index)">
                  <img src="/static/icons/intelligent_replenishment/more.png" width="21" height="21" alt class="more">
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="准备天数"
            align="center"
            min-width="120"
            v-if="columns.find(el =>el.field === 'transportDays' && el.show)"
          >
            <template slot-scope="scope">
              <p>运输天数：{{scope.row.transportDays | _formatData}}</p>
              <p>保底可售天数：{{scope.row.insuredDays | _formatData}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="stockDays"
            label="备货所需天数"
            min-width="95"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'stockDays' && el.show)"
          />
          <el-table-column
            prop="availableStock"
            label="可售库存"
            min-width="70"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'availableStock' && el.show)"
          />
          <el-table-column
            prop="availableDayCount"
            label="可售天数"
            min-width="70"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'availableDayCount' && el.show)"
          />
          <el-table-column
            prop="lackDayCount"
            label="缺货天数"
            min-width="70"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'lackDayCount' && el.show)"
          />
          <el-table-column
            prop="produceDays"
            label="生产需要天数"
            min-width="100"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'produceDays' && el.show)"
          />
          <el-table-column
            prop="produceDaysDef"
            label="固定补货天数"
            min-width="100"
            align="center"
            :formatter="_formatter"
            v-if="columns.find(el =>el.field === 'produceDaysDef' && el.show)"
          />
          <el-table-column
            label="补货详情"
            width="170"
            fixed="right"
            align="center"
            :render-header="handlerRenderHeader3"
            v-if="columns.find(el =>el.field === 'info' && el.show)"
          >
            <template slot-scope="scope">
              <div>
                剩余备货天数:
                <span style="color:#00CCFF;">{{scope.row.stockDaysCountdown | _formatData}}</span>天
              </div>
              <el-button-group>
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  content="Bottom Center"
                  @mouseenter.native="handlerToolTipMouseenter3(scope.row, scope.$index)"
                  @mouseleave.native="handlerToolTipMouseleave"
                >
                  <div slot="content">
                    <replenish-table :table-data="tableDatasReplenishmentNum[scope.$index]"/>
                  </div>
                  <el-button plain type="info" size="mini">{{ scope.row.inReplenishmentNum | _formatData}}</el-button>
                </el-tooltip>
                <el-button plain size="mini">{{scope.row.restockNumNeeded | _formatData}}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            label="生产详情"
            width="170"
            fixed="right"
            align="center"
            :render-header="handlerRenderHeader4"
            v-if="columns.find(el =>el.field === 'info' && el.show)"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  content="Bottom Center"
                  @mouseenter.native="handlerToolTipMouseenter4(scope.row, scope.$index)"
                  @mouseleave.native="handlerToolTipMouseleave"
                >
                  <div slot="content">
                    <replenish-table type="produce" :table-data="tableDataProduceDays[scope.$index]"/>
                  </div>
                  <el-button plain type="info" size="mini">{{ scope.row.produceingCount | _formatData}}</el-button>
                </el-tooltip>
                <el-button plain size="mini">{{scope.row.produceLackCount | _formatData}}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template slot="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="intelligentReplenishmentList.pageNo"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="intelligentReplenishmentList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="intelligentReplenishmentList.total"
        ></el-pagination>
      </template>
    </IRLayout>
    <!-- 更改恢复生命周期-->
    <el-dialog :title="!type ? '批量更改产品周期' : '是否恢复生命周期'" :visible.sync="periodDialog" width="30%" center append-to-body>
      <div v-if="!type" style="text-align: center;">
        <span>选择周期：</span>
        <el-select placeholder="产品生命周期" v-model="userProductCycle">
          <el-option v-for="(val,key,index) in cycleList" :key="index" :label="key" :value="val"/>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="periodDialog = false">取 消</el-button>
        <el-button type="primary" @click="onChangePeriod()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入导入运输中数量
      case 'a':
          this.importExcel('num')
          break

        case 'b':
          this.importExcel('produce')
          break

        case 'c':
          this.importExcel('stock')
          break

        case 'd':
          this.importExcel('time')
          break

        case 'e':
          this.importExcel('produceCount')
          break
    -->
    <el-dialog
      :title="toLeadType === 'num' ? '导入运输中数量' :toLeadType === 'produce' ? '导入生产详情' :toLeadType === 'stock' ? '导入库存' :toLeadType === 'produceCount' ? '导入生产中数量' :  '导入上架时间'"
      :visible.sync="toLeadDialog"
      width="40%"
      center
      append-to-body
      class="____inteReplinshment"
    >
      <el-button
        :loading="downloadLoading"
        type="primary"
        plain
        size="medium"
        icon="el-icon-download"
        style="margin-bottom:10px"
        @click="download()"
      >下载模板</el-button>
      <el-upload
        class="upload-demo"
        :key="toLeadType"
        drag
        :limit="1"
        :headers="uploadHeader"
        :action="uploadURL"
        :on-change="handleChange"
        :on-exceed="exceedUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :file-list="fileList"
        :before-remove="beforeRemove"
        :with-credentials="true"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xls, .xlsx"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" style="width:100%">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传csv/xls/xlsx文件</div>
      </el-upload>
      <!-- 上传的模板信息 -->
      <div class="tempInfo" v-if="uploadAfterInfo.success">
        <template v-if="toLeadType === 'num'">
          <ul style="margin-top:40px;max-height: 160px;overflow-y: auto;">
            <li v-for="(item,index) in uploadAfterInfo.info.errorInfos">{{index+1}}. {{item}}</li>
          </ul>
          <h4>
            <span>批次号：{{uploadAfterInfo.info.batchNumber}}</span>
            <span v-if="uploadAfterInfo.info.fastestArrival">最早到货时间：{{uploadAfterInfo.info.fastestArrival}}</span>
          </h4>
          <el-table :data="uploadAfterInfo.info.items" border style="width: 100%" height="280">
            <el-table-column prop="asin" label="ASIN" align="center" width="120"/>
            <el-table-column prop="sku" label="SKU" align="center" width="120"/>
            <el-table-column prop="fnsku" label="FNSKU" align="center" width="120"/>
            <el-table-column prop="count" label="数量" align="center" width="80"/>
            <el-table-column prop="price" label="价格" align="center" width="80"/>
            <el-table-column label="提示" align="center">
              <template slot-scope="scope">
                <p v-for="item in scope.row.errorInfo" style="color:#ff3c3c;">{{item}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 导入上架时间 -->
        <template v-else-if="toLeadType === 'time'">
          <el-table :data="uploadAfterInfo.info" border style="width: 100%" height="280">
            <el-table-column prop="sellerSku" label="sellerSku" align="center"/>
            <el-table-column prop="addedDate" label="上架时间" align="center"/>
            <el-table-column prop="errorInfo" label="错误信息" align="center">
              <template slot-scope="scope">
                <p style="color:#ff3c3c;">{{scope.row.errorInfo}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 导入生产详情 -->
        <template v-else-if="toLeadType === 'produce'">
          <el-table :data="uploadAfterInfo.info" border style="width: 100%" height="280">
            <el-table-column prop="sellerSku" label="sellerSku" align="center"/>
            <el-table-column prop="produceDays" label="生产所需天数" align="center"/>
            <el-table-column prop="replenishDays" label="固定补货天数" align="center"/>
            <el-table-column prop="errorInfo" label="错误信息" align="center">
              <template slot-scope="scope">
                <p style="color:#ff3c3c;">{{scope.row.errorInfo}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 导入库存 -->
        <template v-else-if="toLeadType === 'stock'">
          <el-table :data="uploadAfterInfo.info" border style="width: 100%" height="280">
            <el-table-column prop="sellerSku" label="sellerSku" align="center"/>
            <el-table-column prop="inventory" label="当前库存" align="center"/>
            <el-table-column prop="errorInfo" label="错误信息" align="center">
              <template slot-scope="scope">
                <p style="color:#ff3c3c;">{{scope.row.errorInfo}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 导入生产中数量 -->
        <!-- <template v-else-if="toLeadType === 'produceCount'">
          <el-table :data="uploadAfterInfo.info" border style="width: 100%" height="280">
            <el-table-column prop="sellerSku" label="sellerSku" align="center"/>
            <el-table-column prop="count" label="交货数量" align="center"/>
            <el-table-column prop="errorInfo" label="错误信息" align="center">
              <template slot-scope="scope">
                <p style="color:#ff3c3c;">{{scope.row.errorInfo}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>-->
        <template v-else-if="toLeadType === 'produceCount'">
          <ul style="margin-top:40px;max-height: 160px;overflow-y: auto;">
            <li v-for="(item,index) in uploadAfterInfo.info.errorInfos">{{index+1}}. {{item}}</li>
          </ul>
          <h4>
            <span>批次号：{{uploadAfterInfo.info.batchNumber}}</span>
            <!-- <span v-if="uploadAfterInfo.info.fastestArrival">最早到货时间：{{uploadAfterInfo.info.fastestArrival}}</span> -->
          </h4>
          <el-table :data="uploadAfterInfo.info.deliveryUploadItemInfos" border style="width: 100%" height="280">
            <el-table-column prop="sku" label="SKU" align="center"/>
            <el-table-column prop="count" label="交货数量" align="center"/>
            <el-table-column prop="errorInfo" label="错误信息" align="center">
              <template slot-scope="scope">
                <p style="color:#ff3c3c;">{{scope.row.errorInfo.join(';')}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel()">取 消</el-button>
        <el-button type="primary" @click="ontoLead()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 提示 -->
    <el-dialog title="详情" :visible.sync="tipVisible" width="60%">
      <div>
        <input-table
          :is-h="true"
          v-if="shippingIndex != null"
          :table-data="shippingIndex != null ? tableDatasShipping[shippingIndex] : []"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tipVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 手动同步 -->
    <el-dialog title="手动同步" :visible.sync="manualSyncDialog" width="408px" center>
      <el-form
        :model="manualSyncForm"
        :rules="manualSyncRules"
        ref="manualSyncForm"
        label-width="100px"
        class="manualSyncForm"
      >
        <el-form-item label="选择平台：" prop="platformId">
          <el-select v-model.number="manualSyncForm.platformId" @change="changePlatform">
            <el-option v-for="item in syncPlatformList" :label="item.platformName" :value="item.platformId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择站点：" prop="siteId">
          <el-select v-model.number="manualSyncForm.siteId" @change="changeSite" @focus="focusSite">
            <el-option v-for="item in syncSiteList" :label="item.siteNameZh" :value="item.siteId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择店铺：" prop="storeId">
          <el-select v-model.number="manualSyncForm.storeId" @focus="focusStore">
            <el-option v-for="item in syncStoreList" :label="item.name" :value="item.storeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择类型：" prop="synType">
          <el-select v-model.number="manualSyncForm.synType">
            <el-option v-for="(value,key) in syncTypeList" :label="key" :value="value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitSyncForm('manualSyncForm')">确 认 同 步</el-button>
      </span>
    </el-dialog>
  </section>
</template>


<script>
import TableHover from '@/components/intelligent_replenishment/table'
import InputTable from '@/components/intelligent_replenishment/inputTable'
import ReplenishTable from '@/components/intelligent_replenishment/ReplenishTable'
import DailyBox from '@/components/intelligent_replenishment/dailySalesBox'
import CustomList from '@/components/base/customList'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  fetchData,
  showToast,
  _storage,
  downloadFile,
  showConfirm,
  handlerCode
} from '@/common/common'
import apis from '@/apis'
import { debounce } from '@/common/util'
import { BASE_URL, REP_URL } from '@/common/config'

export default {
  name: 'intelligent-replenishment',
  data() {
    return {
      downloadLoading: false,
      toLeadType: 'num',
      selected: [],
      daySort: 'descending',
      sortParams: {
        dailySalesSort: 'desc'
      },
      averageSort: null,
      columns: [
        {
          field: 'productImage',
          title: '产品图片',
          show: true
        },
        {
          field: 'productName',
          title: '产品名称',
          show: true
        },
        {
          field: 'ID',
          title: '产品ID',
          show: true
        },
        // {
        //   field: 'shopName',
        //   title: '店铺',
        //   show: true
        // },
        {
          field: 'warehouseName',
          title: '仓库',
          show: true
        },
        {
          field: 'currentStock',
          title: '当前库存',
          show: true
        },
        {
          field: 'purchaseAccount',
          title: '采购中',
          show: true
        },
        {
          field: 'dailySales',
          title: '当日销量/日均销量',
          show: true
        },
        {
          field: 'transportName',
          title: '运输方式',
          show: true
        },
        {
          field: 'transportDays',
          title: '准备天数',
          show: true
        },
        {
          field: 'stockDays',
          title: '备货所需天数',
          show: true
        },
        {
          field: 'availableStock',
          title: '可售库存',
          show: true
        },
        {
          field: 'availableDayCount',
          title: '可售天数',
          show: true
        },
        {
          field: 'lackDayCount',
          title: '缺货天数',
          show: true
        },
        {
          field: 'produceDays',
          title: '生产需要天数',
          show: true
        },
        {
          field: 'produceDaysDef',
          title: '固定补货天数',
          show: true
        },
        {
          field: 'info',
          title: '补货详情',
          show: true
        }
      ],
      syncPlatformList: [],
      syncSiteList: [],
      syncStoreList: [],
      syncTypeList: {},
      manualSyncRules: {
        platformId: [
          {
            type: 'date',
            required: true,
            message: '请选择平台',
            trigger: 'change'
          }
        ],
        siteId: [
          {
            type: 'date',
            required: true,
            message: '请选择站点',
            trigger: 'change'
          }
        ],
        synType: [
          {
            type: 'date',
            required: true,
            message: '请选择店铺',
            trigger: 'change'
          }
        ],
        storeId: [
          {
            type: 'date',
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ]
      },
      cellName({ row, rowIndex }) {
        if (row.variantsFlag && !row.parentFlag) {
          return 'variant-row'
        }
      },
      tableMaxHeight: 540,
      manualSyncForm: {
        platformId: null,
        siteId: null,
        synType: null,
        storeId: null
      },
      manualSyncDialog: false,

      shippingIndex: null,
      uploadAfterInfo: {
        //上传成功之后的模板信息
        success: false,
        uploadCode: null,
        info: {}
      },
      uploadHeader: {
        token: _storage._get('local', 'token')
      },
      uploadURL: REP_URL + '/replenishDetailed/uploadShippingCount',

      tipVisible: false,

      userProductCycle: null,
      loading: false,
      periodDialog: false,
      type: '',
      toLeadDialog: false,
      allNumData: {},

      platformList: [], //来源平台列表
      storeSourceList: [], //店铺来源列表
      tableDatas: [], // 补货信息列表-当前库存(提示框列表)
      tableDatasDailySales: [], // 日销量(提示框列表)
      tableDatasShipping: [], // 列表-运输方式(提示框列表)
      tableDatasDailySalesAvarage: [], // 平均日销量
      tableDatasReplenishmentNum: [], // 列表-在补数量(提示框列表)
      tableDataProduceDays: [], // 列表-生产批次(提示框列表)
      productList: [
        {
          //产品table列表
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      attentionList: [
        //是否关注 //是否手动更改生命周期
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      attentionFlag: 1,
      hasSelect: 0,
      // selected: [], //用户选中的列表
      userSelectListId: [], //用户选中的列表id
      // 业务层
      select: {
        //搜索
        pageSize: '10',
        pageNumber: '1',
        parentId: null,
        shopId: [],
        platformId: [],
        artificialCycle: null,
        sku: '',
        productName: ''
      },
      fileList: []
    }
  },

  beforeRouteEnter(to, from, next) {
    console.log('进入路由')

    next(async vm => {
      // vm.$store.commit("setLoading", false);
      await vm.searchList(vm.select)
      vm.tableMaxHeight = document.documentElement.clientHeight - 400
      vm.hasSelect = vm.getAllSelected().length
    })
  },

  beforeRouteLeave(to, from, next) {
    // this.$store.commit("setLoading", true);
    if (to.path.indexOf('/IntelligentReplenishment/batchReplenishment') > -1) {
      if (Object.keys(this.selected).length <= 0) {
        showToast('error', '请至少选择一个产品进行补货')
        return next(false)
      }
    }
    next()
  },

  created() {
    this.debGetCurrentStockList = debounce(300, this.getCurrentStockList)
    this.debGetCurrentShippingList = debounce(300, this.getCurrentShippingList)
    this.debGetCurrentReplenishmentNum = debounce(
      300,
      this.getCurrentReplenishmentNum
    )
    this.debGetCurrentDailySalesList = debounce(
      300,
      this.getCurrentDailySalesList
    )
    // 移上去获取 生产批次
    this.debGetCurrentProduceDaysList = debounce(
      300,
      this.getCurrentProduceDaysList
    )

    this.getCycleList()
    this.getAllDataNum()
  },

  mounted() {
    let vm = this
    window.onresize = debounce(200, function() {
      vm.tableMaxHeight = document.documentElement.clientHeight - 400
    })
  },

  methods: {
    delVariant(scope) {
      let vm = this
      showConfirm({
        title: `是否删除${scope ? '该' : '选中的'}产品?`,
        onOk() {
          if (!scope) {
            if (vm.selected.length > 0) {
              vm.delVariants(vm.selected.map(el => el.replenishProductId))
            } else {
              showToast('warning', '请选择产品进行操作')
            }
          } else {
            vm.delVariants([scope.row.replenishProductId])
          }
        }
      })
    },
    delVariants(ids) {
      fetchData({
        ...apis.REPLENISH_PRODUCT_DELETE_PRODUCT,
        data: { ids }
      }).then(res => {
        handlerCode(res, () => {
          this.clearAndFetch()
        })
      })
    },
    getAllDataNum() {
      this.allNumData = {}
      let vm = this
      let {
        artificialCycle,
        parentIds,
        platformIds,
        productName,
        shopId,
        sku
      } = this.select
      let data = {
        artificialCycle,
        parentIds,
        platformIds,
        attentionFlag: this.attentionFlag,
        productName,
        shopId,
        sku
      }
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (
            element === '' ||
            element == null ||
            (element.length && element.length == 0)
          ) {
            delete data[key]
          }
        }
      }
      fetchData({
        ...apis.REPLENISHPRODUCT_REPLENISHPRODUCTLISTCOUNT,
        data
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        vm.allNumData = res.data.counts
      })
    },
    handleCustomSortChange(cur, prev, prop, sort) {
      this.$refs.table.clearSort()
      let vm = this
      if (vm[prev]) {
        vm[prev] = null
      }
      if (sort) {
        if (sort !== vm[cur]) {
          vm[cur] = sort
        }
      } else {
        if (vm[cur] === null) {
          vm[cur] = 'ascending'
        } else if (vm[cur] === 'ascending') {
          vm[cur] = 'descending'
        } else {
          vm[cur] = null
        }
      }

      vm.handleSortChange({
        columns: null,
        prop,
        order: vm[cur]
      })
    },
    handleSort({ column, prop, order }) {
      this.daySort = null
      this.averageSort = null
      this.handleSortChange({ column, prop, order })
    },
    handleSortChange({ column, prop, order }) {
      let vm = this
      let parents = this.$refs.table.data.filter(el => el._isOpen == true)
      this.sortParams = {}
      this.sortParams[prop] = order
        ? order === 'ascending'
          ? 'asc'
          : 'desc'
        : null

      this.clearData()

      if (parents.length) {
        console.log('变体排序')
        // 如果有打开变体的项，则改变排序规则，只排变体项
        vm.loading = true
        fetchData({
          ...apis.REPLENISHPRODUCT_REPLENISHCHILDPRODUCTSHORTLIST,
          data: {
            parentIds: parents.map(el => el.replenishProductId),
            ...vm.sortParams,
            attentionFlag: this.attentionFlag
          }
        }).then(res => {
          vm.loading = false

          const { code, data, msg } = res.data
          const list = vm.$refs.table.data
          if (code === 0) {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const element = data[key]
                let index = list.findIndex(el => el.replenishProductId == key)
                let row = list.find(el => el.replenishProductId == key)
                if (index > -1) {
                  console.log('object')
                  vm.delIntelligentReplenishmentList({
                    len: row._len,
                    index
                  })
                  vm.insertIntelligentReplenishmentList({
                    index: index,
                    info: element
                  })
                }
              }
            }
          } else {
            showToast('error', msg)
          }
        })
      } else {
        console.log('母体排序')
        // 正常排序
        this.select.pageNumber = 1
        this.searchList({
          ...this.select,
          ...this.sortParams,
          pageSize: this.select.pageSize,
          pageNumber: this.select.pageNumber
        })
      }
    },
    handleChange(file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList
    },
    onCancel() {
      this.uploadAfterInfo.success = false
      this.uploadAfterInfo.uploadCode = null
      this.uploadAfterInfo.info = {}
      this.fileList = []
      this.toLeadDialog = false
    },
    focusSite() {
      if (!this.manualSyncForm.platformId) {
        this.$notify.info({
          title: '提示',
          message: '请先选择平台'
        })
      }
    },
    focusStore() {
      if (!this.manualSyncForm.siteId) {
        this.$notify.info({
          title: '提示',
          message: '请先选择站点'
        })
      }
    },
    //
    submitSyncForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          fetchData({
            ...apis.REPLENISHSYN_SYNSTOREINFO,
            data: {
              storeId: this.manualSyncForm.storeId,
              synType: this.manualSyncForm.synType
            }
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.manualSyncDialog = false
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 切换站点更新店铺
    changeSite(val) {
      this.manualSyncForm.storeId = null
      fetchData({
        ...apis.STORE_LIST_BY_SITE,
        data: {
          siteIds: Array.of(val)
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.syncStoreList = res.data.rows
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //切换平台更新站点
    changePlatform(val) {
      this.manualSyncForm.siteId = null
      this.syncPlatformList.forEach(item => {
        if (item.platformId == val) {
          this.syncSiteList = item.siteList
        }
      })
    },
    //手动同步
    onManualSync() {
      this.manualSyncDialog = true
      if (!this.syncPlatformList.length) this.getPlatform()
      if (Object.keys(this.syncTypeList).length < 1) this.getTypes()
    },
    //获取手动同步类型
    getTypes() {
      fetchData({
        ...apis.REPLENISHSYN_GETSYNTYPE,
        data: {}
      }).then(res => {
        console.log(res)
        if (res.data.code == 0) {
          this.syncTypeList = res.data.map
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //获取平台
    getPlatform() {
      fetchData({
        ...apis.PLATFORMSITE
      }).then(res => {
        console.log(res)
        if (res.data.code == 0) {
          this.syncPlatformList = res.data.rows
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    handleCommand(command) {
      /**
      * <el-dropdown-item command="a">导入运输中数量</el-dropdown-item>
        <el-dropdown-item command="b">导入生产详情</el-dropdown-item>
        <el-dropdown-item command="c">导入库存</el-dropdown-item>
        <el-dropdown-item command="d">导入上架时间</el-dropdown-item>
       */
      switch (command) {
        case 'a':
          this.importExcel('num')
          break

        case 'b':
          this.importExcel('produce')
          break

        case 'c':
          this.importExcel('stock')
          break

        case 'd':
          this.importExcel('time')
          break

        case 'e':
          this.importExcel('produceCount')
          break

        default:
          break
      }
    },
    importExcel(type) {
      this.toLeadType = type
      this.uploadURL =
        REP_URL +
        (type === 'num'
          ? '/replenishDetailed/uploadShippingCount'
          : type === 'produce' // 生产详情
          ? '/ReplenishProduceUpload/uploadProduceInfoModel'
          : type === 'stock' // 库存
          ? '/ReplenishProduceUpload/uploadLocalInventoryModel'
          : type === 'produceCount' // 生产中数量
          ? '/ReplenishPd/uploadProduceCount'
          : '/replenishProduct/uploadShelfTime')
      this.toLeadDialog = true

      this.fileList = []
      this.uploadAfterInfo = {}
    },

    isCycle(row) {
      // 先判断是否有关注，如果没有
      // 判断是否有手动设置上升下降
      // 最后判断系统上升下降
      if (!row.attentionFlag) {
        return 5
      }
      if (row.artificialCycle == 0) {
        if (row.productCycle === 1) {
          return 3
        }
        if (row.productCycle === 3) {
          return 4
        }
      } else {
        if (row.productCycle === 1) {
          return 1
        }
        if (row.productCycle === 3) {
          return 2
        }
      }
    }, //上传失败
    uploadError(err) {
      if (err.type == 'error') {
        this.$message.error('上传失败')
      }
    },

    //上传成功
    uploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      if (response.code == 0) {
        this.uploadAfterInfo.success = true

        this.uploadAfterInfo.uploadCode = response.uploadCode
        // if (this.toLeadType === 'time') {
        //   this.uploadAfterInfo.info = []
        //   for (const key in response.info) {
        //     if (response.info.hasOwnProperty(key)) {
        //       const element = response.info[key]
        //       this.uploadAfterInfo.info.push(element)
        //     }
        //   }
        // } else {
        //   this.uploadAfterInfo.info = Object.assign({}, response.info)
        // }

        if (this.toLeadType === 'num' || this.toLeadType === 'produceCount') {
          this.uploadAfterInfo.info = Object.assign({}, response.info)
        } else {
          let data = []
          for (const key in response.info) {
            if (response.info.hasOwnProperty(key)) {
              const element = response.info[key]
              data.push(element)
            }
          }
          this.uploadAfterInfo.info = data
        }
      } else {
        this.$message.error(response.msg)
      }
    },
    //上传运输中的数量
    exceedUpload(files, fileList) {
      this.$message({
        message: '上传文件超出限制，请先删除后在上传',
        type: 'warning'
      })
    },
    beforeRemove(file, fileList) {
      this.uploadAfterInfo.success = false
      this.uploadAfterInfo.uploadCode = null
      this.uploadAfterInfo.info = {}
      this.fileList = []
    },
    //下载运输中模板
    download() {
      let api = apis.REPLENISHDETAILED_DOWNLOADSHIPPINGCOUNTMODEL
      if (this.toLeadType === 'time') {
        api = apis.REPLENISHPRODUCT_SETSHELFTIMEMODELDOWNLOAD
      }
      if (this.toLeadType === 'produce') {
        api = apis.REPLENISH_PRODUCE_UPLOAD_DOWNLOAD_PRODUCE_INFO_MODEL
      }
      if (this.toLeadType === 'stock') {
        api = apis.REPLENISH_PRODUCE_UPLOAD_DOWNLOAD_LOCAL_INVENTORY_MODEL
      }
      if (this.toLeadType === 'produceCount') {
        api = apis.REPLENISH_PD_DOWNLOAD_PRODUCE_COUNT_MODEL
      }
      this.downloadLoading = true
      fetchData({
        ...api,
        data: {}
      }).then(res => {
        this.downloadLoading = false
        // console.log(res)
        if (res.data.code == 0) {
          downloadFile(res.data.path)
          // window.location.href = res.data.path
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    showTransDialog(index) {
      this.shippingIndex = index
      this.tipVisible = true
    },
    viewVariant(row, index) {
      this.clearData()
      this.loading = true
      fetchData({
        ...apis.REPLENISHPRODUCT_REPLENISHPRODUCTLISTVARIANTS,
        data: {
          parentId: row.replenishProductId,
          // attentionFlag: row.attentionFlag
          attentionFlag: this.attentionFlag
        }
      }).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.$set(row, '_isOpen', true)
          this.$set(row, '_len', res.data.list.length)
          this.insertIntelligentReplenishmentList({
            index: index,
            info: res.data.list.sort((a, b) => b.dailySales - a.dailySales)
          })
          this.$nextTick(() => {
            this.setSelectionSubIndex(row, index)
          })
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    // 取消查看变体
    closeVariant(row, index) {
      let _deleted = this.intelligentReplenishmentList.rows.slice(
          index + 1,
          row._len + index + 1
        ),
        insert = []
      this.clearData()
      this.$set(row, '_isOpen', false)
      // console.log(row._len, '----------------------')
      // 这个是把选择的去掉
      // this.setSelectionSubIndex(row, index, true)

      // console.log(_deleted)
      // _deleted.forEach(el => {
      //   if (
      //     this.selected.find(
      //       _el => _el.replenishProductId === el.replenishProductId
      //     )
      //   ) {
      //     insert.push(el)
      //   }
      // })

      // insert.forEach(el => {
      //   if (
      //     !this.selected.find(
      //       _el => _el.replenishProductId === el.replenishProductId
      //     )
      //   ) {
      //     this.selected.push(el)
      //   }
      // })
      this.delIntelligentReplenishmentList({
        len: row._len,
        index
      })
    },
    // 鼠标移过显示
    handlerToolTipMouseenter(row, index) {
      console.log(row)
      if (!this.tableDatas[index]) {
        this.timer = this.debGetCurrentStockList(row, index)
      }
    },

    // 鼠标移过显示
    handlerToolTipMouseenter1(row, index) {
      console.log(row)
      if (!this.tableDatasDailySales[index]) {
        this.timer = this.debGetCurrentDailySalesList(row.fnsku, index)
      }
    },

    // 鼠标移过显示
    handlerToolTipMouseenter2(row, index) {
      console.log(row)
      if (!this.tableDatasShipping[index]) {
        this.timer = this.debGetCurrentShippingList(row, index)
      }
    },
    // 鼠标移过显示
    handlerToolTipMouseenter3(row, index) {
      console.log(row)
      if (!this.tableDatasReplenishmentNum[index]) {
        this.timer = this.debGetCurrentReplenishmentNum(row, index)
      }
    },
    // 鼠标移过显示
    handlerToolTipMouseenter4(row, index) {
      console.log(row)
      if (!this.tableDataProduceDays[index]) {
        this.timer = this.debGetCurrentProduceDaysList(row, index)
      }
    },

    handlerToolTipMouseleave() {
      clearTimeout(this.timer)
    },
    handlerRenderHeader4(h, { column, $index }) {
      return this.getVnode(arguments, '采购中库存', '生产缺货')
    },
    // 自定义表头
    handlerRenderHeader1(h, { column, $index }) {
      let len = Object.keys(this.allNumData).length
      return h('span', [
        h('span', column.label),
        !len
          ? h(
              'el-button',
              {
                props: {
                  loading: true,
                  type: 'text'
                }
              },
              ''
            )
          : h('span', {}, ` (${this.allNumData.actualStock})`),
        h(
          'el-tooltip',
          {
            props: {
              effect: 'light'
            },
            style: {
              borderColor: '#e8e8e8'
            }
          },
          [
            h(
              'div',
              {
                slot: 'content'
              },
              [
                h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      padding: '10px'
                    }
                  },
                  [
                    h(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          marginRight: '20px'
                        }
                      },
                      [
                        h(
                          'div',
                          {
                            style: {
                              width: '12px',
                              height: '12px',
                              background: '#909399',
                              border: '1px solid #909399',
                              marginRight: '10px'
                            }
                          }
                          // "实际"
                        ),
                        h('div', '实际')
                      ]
                    ),
                    h(
                      'div',
                      {
                        style: {
                          display: 'flex'
                        }
                      },
                      [
                        h(
                          'div',
                          {
                            style: {
                              width: '12px',
                              height: '12px',
                              background: '#fff',
                              border: '1px solid #ddd',
                              marginRight: '10px'
                            }
                          }
                          // "运输中"
                        ),
                        h('div', '运输中')
                      ]
                    )
                  ]
                )
              ]
            ),
            h(
              'i',
              {
                class: 'el-icon-question tips',
                style: {
                  color: '#409EFF',
                  cursor: 'pointer',
                  fontSize: '16px',
                  textIndent: '4px'
                }
              },
              ''
            )
          ]
        )
      ])
    },

    // 自定义表头
    handlerRenderHeader3(h, { column, $index }) {
      return this.getVnode(arguments, '在补', '还需补')
    },

    getVnode(args, left, right) {
      let [h, { column, $index }] = args
      return h('span', [
        h('span', column.label),
        h(
          'el-tooltip',
          {
            props: {
              effect: 'light'
            },
            style: {
              borderColor: '#e8e8e8'
            }
          },
          [
            h(
              'div',
              {
                slot: 'content'
              },
              [
                h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      padding: '10px'
                    }
                  },
                  [
                    h(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          marginRight: '20px'
                        }
                      },
                      [
                        h('div', {
                          style: {
                            width: '12px',
                            height: '12px',
                            background: '#F4F4F5',
                            border: '1px solid #F4F4F5',
                            marginRight: '10px'
                          }
                        }),
                        h('div', left)
                      ]
                    ),
                    h(
                      'div',
                      {
                        style: {
                          display: 'flex'
                        }
                      },
                      [
                        h('div', {
                          style: {
                            width: '12px',
                            height: '12px',
                            background: '#fff',
                            border: '1px solid #ddd',
                            marginRight: '10px'
                          }
                        }),
                        h('div', right)
                      ]
                    )
                  ]
                )
              ]
            ),
            h(
              'i',
              {
                class: 'el-icon-question tips',
                style: {
                  color: '#409EFF',
                  cursor: 'pointer',
                  fontSize: '16px',
                  textIndent: '4px'
                }
              },
              ''
            )
          ]
        )
      ])
    },
    // 自定义表头
    handlerRenderHeader2(h, { column, $index }) {
      let len = Object.keys(this.allNumData).length
      return (
        <span style={{ cursor: 'pointer' }}>
          <span
            onClick={() => {
              this.handleCustomSortChange(
                'daySort',
                'averageSort',
                'dailySalesSort'
              )
            }}
          >
            <span>
              当日销量
              {!len ? (
                <el-button loading={!len} />
              ) : (
                ` (${this.allNumData.dailySales})`
              )}
            </span>
            <span class="caret-wrapper">
              <i
                class="sort-caret ascending"
                style={{
                  borderBottomColor:
                    this.daySort === 'ascending' ? '#409EFF' : null
                }}
                onClick={e => {
                  e.stopPropagation()
                  if (e.target !== e.currentTarget) return
                  this.handleCustomSortChange(
                    'daySort',
                    'averageSort',
                    'dailySalesSort',
                    'ascending'
                  )
                }}
              />
              <i
                class="sort-caret descending"
                style={{
                  borderTopColor:
                    this.daySort === 'descending' ? '#409EFF' : null
                }}
                onClick={e => {
                  e.stopPropagation()
                  if (e.target !== e.currentTarget) return
                  this.handleCustomSortChange(
                    'daySort',
                    'averageSort',
                    'dailySalesSort',
                    'descending'
                  )
                }}
              />
            </span>
          </span>
          /
          <span
            onClick={() => {
              this.handleCustomSortChange(
                'averageSort',
                'daySort',
                'avgSalesSort'
              )
            }}
          >
            <span style={{ color: '#409EFF' }}>
              日均销量
              {!len ? (
                <el-button loading={!len} />
              ) : (
                ` (${this.allNumData.avgSales})`
              )}
            </span>
            <span class="caret-wrapper">
              <i
                class="sort-caret ascending"
                style={{
                  borderBottomColor:
                    this.averageSort === 'ascending' ? '#409EFF' : null
                }}
                onClick={e => {
                  e.stopPropagation()
                  if (e.target !== e.currentTarget) return
                  this.handleCustomSortChange(
                    'averageSort',
                    'daySort',
                    'avgSalesSort',
                    'ascending'
                  )
                }}
              />
              <i
                class="sort-caret descending"
                style={{
                  borderTopColor:
                    this.averageSort === 'descending' ? '#409EFF' : null
                }}
                onClick={e => {
                  e.stopPropagation()
                  if (e.target !== e.currentTarget) return
                  this.handleCustomSortChange(
                    'averageSort',
                    'daySort',
                    'avgSalesSort',
                    'descending'
                  )
                }}
              />
            </span>
          </span>
        </span>
      )
    },

    // 获取当前列表-当前库存(提示框列表)
    getCurrentStockList({ replenishProductId }, index) {
      fetchData({
        ...apis.REPLENISHDETAILED_GETREPLENISHTRANSPORTITEM,
        data: {
          productId: replenishProductId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatas, index, res.data.list)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 列表-运输方式(提示框列表)
    getCurrentShippingList({ replenishProductId, asin }, index) {
      fetchData({
        ...apis.REPLENISHPRODUCT_GETTRANSPORTATIONLIST,
        data: {
          productId: replenishProductId,
          asin
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatasShipping, index, res.data.list)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 列表-在补(提示框列表)
    getCurrentReplenishmentNum(row, index) {
      fetchData({
        ...apis.REPLENISHPRODUCT_GETREPLENISHDETAILSLIST,
        data: {
          productId: row.replenishProductId,
          asin: row.asin,
          transportFirstId: row.transportFirstId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatasReplenishmentNum, index, res.data.list)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 获取当前列表-日销量提示框
    getCurrentDailySalesList(asin, index) {
      fetchData({
        ...apis.REPLENISHPRODUCTSTATUSRECORD_GETDAILYSALES,
        data: {
          fnsku: asin
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatasDailySales, index, res.data.list)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    // 获取当前列表-生产批次提示框
    getCurrentProduceDaysList(row, index) {
      fetchData({
        ...apis.REPLENISH_PD_ITEM_GET_IN_PRODUCE_SORT,
        data: {
          productId: row.replenishProductId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDataProduceDays, index, res.data.list)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    //导入确定
    ontoLead() {
      let api = apis.REPLENISHDETAILED_UPLOADSHIPPINGCOUNTCONFIRM
      if (this.toLeadType === 'time') {
        api = apis.REPLENISHPRODUCT_UPLOADSHELFTIMECONFIRM
      }
      if (this.toLeadType === 'produce') {
        api = apis.REPLENISH_PRODUCE_UPLOAD_UPLOAD_PRODUCE_INFO_CONFIRM
      }
      if (this.toLeadType === 'stock') {
        api = apis.REPLENISH_PRODUCE_UPLOAD_UPLOAD_LOCAL_INVENTORY_CONFIRM
      }
      if (this.toLeadType === 'produceCount') {
        api = apis.REPLENISH_PD_UPLOAD_PRODUCE_COUNT_CONFIRM
      }
      if (this.uploadAfterInfo.uploadCode) {
        fetchData({
          ...api,
          data: {
            uploadCode: this.uploadAfterInfo.uploadCode
          }
        }).then(res => {
          if (res.data.code === 0) {
            showToast('success', res.data.msg)
            this.toLeadDialog = false
            let reloads = ['time', 'produce', 'stock', 'produceCount']
            if (reloads.indexOf(this.toLeadType) > -1) {
              this.onSeek()
            }
          } else {
            showToast('error', res.data.msg)
          }
        })
      } else {
        showToast('warning', '请上传文件')
      }
    },
    //批量关注和取消关注
    attention(type) {
      if (this.selected.length) {
        this.userAttention = null
        this.attentionDialog = true
        this.type = type
        if (type) {
          this.$confirm('是否确认关注?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.sendAttention('REPLENISHPRODUCT_UPDATEATTENTIONFLAG', 1)
          })
        } else {
          this.$confirm('是否确认取消关注?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.sendAttention('REPLENISHPRODUCT_UPDATEATTENTIONFLAG', 0)
          })
        }
      } else {
        this.userHint('warning', '请先勾选您要操作的产品!')
      }
    },
    sendAttention(url, num) {
      const obj = {
        pageNumber: 1,
        pageSize: 10
      }
      return fetchData({
        ...apis[url],
        data: {
          attentionFlag: num,
          replenishProductId: this.selected.map(el => el.replenishProductId)
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.clearAndFetch()
          showToast('success', res.data.msg)
          this.attentionDialog = false
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    clearAndFetch() {
      this.clearData()
      this.$refs.table.clearSelection()
      this.selected.splice(0)
      this.onSeek()
    },
    //更改产品生命周期
    changePeriod(type) {
      debugger
      if (this.selected.length) {
        this.userProductCycle = null
        this.periodDialog = true
        this.type = type
      } else {
        this.userHint('warning', '请先勾选您要操作的产品!')
      }
    },
    //生命周期确定
    onChangePeriod(url) {
      //恢复系统周期
      if (this.type) {
        this.sendChangePeriod('REPLENISHPRODUCT_RECOVERYPRODUCTCYCLE', true)
        //更改生命周期
      } else {
        this.sendChangePeriod('REPLENISHPRODUCT_UPDATEPRODUCTCYCLE')
      }
    },
    sendChangePeriod(url, type) {
      if (this.userProductCycle || type) {
        const obj = {
          pageNumber: 1,
          pageSize: 10
        }
        return fetchData({
          ...apis[url],
          data: type
            ? {
                replenishProductId: this.selected.map(
                  el => el.replenishProductId
                )
                // productCycle: 1 // 恢复周期
              }
            : {
                productCycle: this.userProductCycle,
                replenishProductId: this.selected.map(
                  el => el.replenishProductId
                )
              }
        }).then(res => {
          if (res.data.code === 0) {
            showToast('success', res.data.msg)
            this.periodDialog = false
            this.getIntelligentReplenishmentList(obj)
          } else {
            showToast('error', res.data.msg)
          }
        })
      }
    },
    //table选中的
    userSelectTable(val) {
      console.log(val)

      // this.selected = val
      // this.userSelectNotValId = []
      // val.forEach(element => {
      //   if (element.variantsFlag && !element.parentFlag) {
      //     return
      //   }
      //   this.userSelectNotValId.push(element.replenishProductId)
      // })
      // this.userSelectListId = val.map(item => item.replenishProductId)
    },

    setSelectionSub(selection, row) {
      const selected = selection.some(
        el => el.replenishProductId === row.replenishProductId
      )
      const i = this.intelligentReplenishmentList.rows.findIndex(
        el => el.replenishProductId === row.replenishProductId
      )
      // 单选
      if (row._isOpen) {
        for (let index = i + 1; index < i + row.childCount + 1; index++) {
          const row = this.intelligentReplenishmentList.rows[index]
          this.$refs.table.toggleRowSelection(row, selected)
        }
      }
    },

    setSelectionSubIndex(row, i, isChecked) {
      const checked = this.$refs.table.selection.find(
        el => el.replenishProductId === row.replenishProductId
      )
      for (let index = i + 1; index < i + row.childCount + 1; index++) {
        const row = this.intelligentReplenishmentList.rows[index]
        if (isChecked) {
          this.$refs.table.toggleRowSelection(row, false)
        } else {
          this.$refs.table.toggleRowSelection(row, !!checked)
        }
      }
    },

    selectTable(selection, row) {
      // 如果变体状态是打开 的， 把变体的操作附加到母体上
      if (row) {
        this.setSelectionSub(selection, row)
      } else {
        // 全选
      }

      // // 存储到vuex中
      // this.setIntelligentSelected({
      //   item: selection
      // })

      this.selected = selection

      this.$nextTick(() => {
        // let selected = this.getAllSelected()
        this.hasSelect = this.selected.length
      })
    },
    //搜索
    async onSeek(type) {
      // this.loading = true
      this.clearData()
      this.getAllDataNum()

      if (type && type === 'search') {
        // this.select.pageSize = 10
        this.select.pageNumber = 1
      }

      if (type && type === 'reset') {
        this.$refs.table.clearSort()
        this.daySort = 'descending'
        this.averageSort = null
        this.sortParams = {
          dailySalesSort: 'desc'
        }
        // this.select.pageSize = 10
        this.select.pageNumber = 1
        await this.searchList({
          pageSize: this.select.pageSize,
          pageNumber: 1,
          ...this.sortParams
        })
      } else {
        await this.searchList({
          ...this.select,
          ...this.sortParams
        })
      }

      // this.loading = false
    },
    async searchList(data) {
      this.loading = true
      try {
        let ret = await this.getIntelligentReplenishmentList({
          ...data,
          ...this.sortParams,
          attentionFlag: this.attentionFlag
        })
        this.loading = false
        return ret
      } catch (error) {
        this.loading = false
        this.$message.error('请求错误')
        // console.error(error)
      }
    },
    async handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.clearData()
      // this.setSelected();
      this.select.pageSize = val + ''
      await this.onSeek()
      // this.setSelected();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.clearData()

      this.select.pageNumber = val
      this.onSeek()
      // this.setSelected();
    },
    userHint(status = 'success', msg = '操作成功') {
      this.$message({
        message: msg,
        type: status,
        center: true
      })
    },
    handlerPlatformIdChange(e) {
      this.select.shopId.splice(0)
      this.getSourceShopList({
        platformIds: e.join(',')
      })
    },
    // 清空数据
    clearData() {
      this.tableDatas.splice(0)
      this.tableDatasDailySales.splice(0)
      this.tableDatasReplenishmentNum.splice(0)
      this.tableDataProduceDays.splice(0)
      this.tableDatasShipping.splice(0)
    },

    getAllSelected() {
      let selected = this.selected,
        arr = []
      for (const key in selected) {
        if (selected.hasOwnProperty(key)) {
          const element = selected[key]
          arr = arr.concat(element)
        }
      }

      return [...new Set(arr)]
    },

    setSelected() {
      let selected = this.getAllSelected()

      console.log(selected)
      this.intelligentReplenishmentList.rows.map((el, index) => {
        if (
          selected.find(i => i.replenishProductId === el.replenishProductId)
        ) {
          console.log(index)
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(el, true)
            })
          }, 0)
        }
      })
    },
    getIntelligentReplenishmentSelected() {
      // 选择的数据
      let selected = this.selected
    },
    ...mapActions([
      'getIntelligentReplenishmentList',
      'getSourceShopList',
      'getCycleList'
    ]),
    ...mapMutations([
      'setIntelligentSelected',
      'insertIntelligentReplenishmentList',
      'delIntelligentReplenishmentList'
    ])
  },
  computed: mapState([
    'sourcePlatformList',
    'sourceShopList',
    'intelligentReplenishmentList',
    'cycleList',
    'intelligentReplenishmentSelected'
  ]),
  components: {
    TableHover,
    CustomList,
    DailyBox,
    InputTable,
    ReplenishTable
  },
  watch: {
    'intelligentReplenishmentList.rows'(val) {
      this.setSelected()
    }
  }
}
</script>

<style lang="scss">
@mixin flex($direction: columin, $inline: block) {
  display: if($inline==block, flex, inline-flex);
  flex-direction: $direction;
  flex-wrap: wrap;
}

.intelligent-btn {
  span {
    font-size: 12px !important;
  }
}

.__variant {
  left: 10px;
}

.____inteReplinshment {
  .upload-demo {
    width: 100% !important;
    .el-upload--text,
    .el-upload-dragger {
      width: 100% !important;
    }
    input[type='file'] {
      display: none !important;
    }
  }
}
.intelligent-replenishment {
  height: 100%;
}
.title-btn {
  @include flex(row);
  padding-right: 10px;
  // border: 1px solid #bdb9b9;
  border-bottom: none;
  li {
    margin-left: 10px;
    padding-right: 10px;
    // border-right: 1px solid #bdb9b9;
    &:last-child {
      border-right: none;
      padding-right: 0;
    }
  }
}

.el-upload-list {
  position: absolute;
  left: 18px;
}

.selectList {
  @include flex(row);
  flex-wrap: nowrap;
  li {
    // width: 184px;
    margin-right: 10px;
  }
  .inputrow {
    @include flex(row);
    color: #333;
    width: 210px;
    .el-input {
      width: 130px;
    }
    span {
      line-height: 32px;
    }
  }
}
.userSelect {
  padding-bottom: 10px;
  strong {
    color: #00ccff;
  }
}
.curtable {
  border-top: 1px solid #bdb9b9;
  .imgbox {
    text-align: center;
    margin-top: 10px;
    position: relative;
    img {
      display: inline-block;
    }
    .hintIcon {
      position: absolute;
      top: -13px;
      left: -3px;
    }
    .el-button {
      padding: 0;
    }
  }
  .more {
    margin-top: 5px;
    cursor: pointer;
  }
}

.tempInfo {
  margin-top: 50px;
  ul {
    margin: 0 0 15px 5px;
    li {
      color: #ff3c3c;
    }
  }
  h4 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
