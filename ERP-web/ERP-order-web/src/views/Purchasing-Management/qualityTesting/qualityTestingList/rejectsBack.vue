<template lang="html">
    <!-- 不良品退回操作 -->
    <div  class="backWarp">
        <div class="inputBox">
            <div class="inputItem">
                <el-select v-model="form.barcode" placeholder="请选择活动区域" class="select">
                    <el-option label="采购产品条形码" value="1"></el-option>
                    <el-option label="产品条形码" value="2"></el-option>
                </el-select>
                <el-input class="input" @change="barCodeChange" v-model.trim="purchaseProductBarCode"/>
                <div style="margin-left:10px">
                    <span style="font-size:24px;">本次退回不良品：</span>
                    <el-input class="input" v-model.number="returnQuantity"  type="number" min='0'/>
                </div>
                <el-button plain type="primary" class="backbtn" @click="back" >确认退回</el-button>
            </div>
            <el-row style="margin:40px 0 10px 0;">
                <el-col :span="4" style="font-size:24px;">
                    总数量：{{ info.lowerSingleQuantity || 0 }}
                </el-col>
                <el-col :span="4" style="font-size:24px;">
                    良品数：{{ info.good || 0 }}
                </el-col>
                <el-col :span="4" style="font-size:24px;">
                    不良品数：{{info.rejectsQuantity || 0 }}
                </el-col>
                <!-- <el-col :span="5" style="font-size:24px;">
                    未退回不良品数：{{info.noback || 0 }}
                </el-col>                 -->
            </el-row>
            <el-row 
              v-for="(item,index) in returnDetail"
              :key="index"
              style="margin-top: 20px;
              padding: 10px 0;
              border-top: 1px dashed #ccc;">
                <el-col :span="5" style="font-size:24px;">
                  <el-select placeholder="请选择供应商"  v-model.number="item.returnSupplierId" class="select">
                      <el-option :label="i.supplierName" :value="i.supplierId" v-for="i in suppliersList" :key='i.id'></el-option>                     
                  </el-select>
                </el-col>
                <el-col :span="6" style="font-size:24px;">
                  <el-input  v-model.number="item.returnQuantity" class="input"  placeholder="输入退回数量" type="number" min='0'/>
                </el-col>
                <el-col :span="3" style="height:50px;line-height: 50px;">
                  <el-button icon="el-icon-plus" circle @click="pushReturnDetail"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle @click="removeReturnDetail(index)" v-if="index!=0"></el-button> 
                </el-col>
                <el-col :span="9" style="font-size:16px;height:50px;line-height: 50px;color:#f56c6c;" v-if="index==0">
                    提示：添加的供应商退回数量之和 不能大于本次 不良退回不良品数量
                </el-col>
            </el-row>
        </div>
        <!--  -->
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" class="tabsInfo">
            <el-tab-pane label="产品详情" name="first" style="height:100%;">
                <el-row style="height:100%;" :gutter="10" v-if="purchaseProductBarCode">
                    <el-col :span="8" style="height:100%;">
                        <!--  -->
                        <template v-if="productImgs.length">
                            <el-tabs v-model="activeNameImg" tabPosition="right"  class="tabsBox">
                                <template v-for="(item,index) in productImgs">
                                    <el-tab-pane :name="index+''" :key="index">
                                        <div slot="label" style="text-align: center;">
                                            <img :src="item.productImg" width="auto" height="80" alt="">
                                        </div>
                                        <img :src="item.productImg" width="100%" height="auto" alt="">
                                    </el-tab-pane>
                                </template>
                            </el-tabs>
                        </template>
                       
                        <div v-else style="text-align: center;">暂无图片！</div>
                    
                        <!--  -->
                    </el-col>
                    <el-col :span="8">
                        <columnTable :data="detailsInfo1" :columns="columnsA"/>
                    </el-col>
                    <el-col :span="8">
                        <columnTable :data="detailsInfo2" :columns="columnsB"/>
                    </el-col>
                </el-row>
                <p v-else style="font-size:18px">暂无产品数据，请输入条形码获取！</p>    

            </el-tab-pane>
            <el-tab-pane label="历史不良品退回记录" name="second">
                <yt-table :data="list" :columns="columns" :border="true" :selection="false"/>
                <el-pagination
                  class="pagination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 50, 80]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
/* eslint-disable */
import columnTable from '@/components/columnTable/columnTable'
export default {
  data() {
    return {
      form: {
        barcode: '1'
      },
      returnDetail: [{ returnQuantity: '', returnSupplierId: '' }],
      suppliersList: [],
      activeName: 'first',
      list: [],
      columns: [
        { value: 'purchaseNumber', label: '采购单号' },
        { value: 'productSku', label: '产品SKU' },
        { value: 'inspectQuantity', label: '本次操作数量' },
        { value: 'inspectTypeName', label: '操作类型' },
        { value: 'createTime', label: '质检操作时间' }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      activeNameImg: '0',
      detailsInfo1: {},
      detailsInfo2: {},
      columnsA: [
        { label: '产品重量', value: 'gw' },
        { label: '产品尺寸', value: 'sing' },
        { label: '包装尺寸', value: 'package' },
        { label: '自定义SKU', value: 'customSku' },
        { label: '产品属性', value: 'attribute' },
        { label: '入库仓库', value: 'warehouseName' },
        { label: '采购人员', value: 'purchasersName' },
        { label: '产品中文名称', value: 'productNameZh' },
        { label: '产品英文名称', value: 'productNameEn' }
      ],
      columnsB: [
        { label: '包装清单', value: 'packageList' },
        { label: '产品描述', value: 'seoDesc' },
        { label: '订单产品备注', value: 'remark' }
      ],
      purchaseProductBarCode: null,
      returnQuantity: null,
      info: {
        lowerSingleQuantity: null,
        rejectsQuantity: null,
        good: null,
        noback: null
      },
      productImgs: []
    }
  },
  methods: {
    pushReturnDetail() {
      this.returnDetail.push({
        returnQuantity: '',
        returnSupplierId: ''
      })
    },
    removeReturnDetail(index) {
      this.returnDetail.splice(index, 1)
    },
    back() {
      if (!this.purchaseProductBarCode) {
        this.$message.warning('条形码不能为空')
        return
      }
      if (!this.returnQuantity) {
        this.$message.warning('退回不良品不能为空')
        return
      }
      this.$api['procurement/QCRejectsRetuen']({
        purchaseProductBarCode: this.purchaseProductBarCode,
        returnQuantity: this.returnQuantity,
        returnDetail: this.returnDetail
      })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    //当条形码改变时请求数据
    barCodeChange(val) {
      console.log(val)
      if (val) {
        this.getBarCodeInfo(val)
      }
    },
    getBarCodeInfo(purchaseProductBarCode) {
      this.$api['procurement/QCgetDetailByCode']({
        purchaseProductBarCode
      })
        .then(res => {
          this.info.rejectsQuantity = res.rows.rejectsQuantity
          this.info.lowerSingleQuantity = res.rows.lowerSingleQuantity
          this.info.good = res.rows.goodProductQuantity
          this.info.noback = res.rows.noRejectsQuantity

          let newObj = res.rows.productInfo1
          newObj['sing'] = `长${newObj.singleLong ||
            0}     /宽${newObj.singleWide || 0}     /高${newObj.singleHigh ||
            0}`
          newObj['package'] = `长${newObj.packageLong ||
            0}    /宽${newObj.packageWide || 0}    /高${newObj.packageHigh ||
            0}`

          let str = res.rows.variantPropertys.map(item => {
            return item.propertyName + ':' + item.propertyValue
          })

          newObj['attribute'] = str.join('/')

          this.detailsInfo1 = newObj

          this.productImgs = res.rows.productImgs
          this.detailsInfo2 = res.rows.productInfo2
          //供应商
          this.suppliersList = res.rows.suppliers
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    handleClick(tab, event) {
      if (tab.name == 'second' && this.purchaseProductBarCode) {
        this.getReturnRecord()
      }
    },
    getReturnRecord() {
      this.$api['procurement/QCgetReturnRecord']({
        purchaseProductBarCode: this.purchaseProductBarCode,
        sortOrder: 'asc',
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      })
        .then(res => {
          this.list = res.rows
          this.pageSize = res.pageSize
          this.currentPage = res.pageNo
          this.total = res.total
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getReturnRecord()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getReturnRecord()
    }
  },
  components: {
    columnTable
  },
  mounted() {
    console.log(123456)
  }
}
</script>

<style lang="scss" scope>
.backWarp {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.inputBox {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f5f7fa;
  font-size: 24px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  .inputItem {
    display: flex;
    flex-wrap: wrap;
    .backbtn {
      margin-left: 20px;
      span {
        font-size: 24px;
      }
    }
  }
}
.select {
  width: 230px;
  height: 50px;
  .el-input {
    height: 50px;
    input {
      height: 50px;
      font-size: 24px;
    }
  }
}
.input {
  width: 280px;
  height: 50px;
  input {
    height: 50px;
    font-size: 24px;
  }
}
.tabsInfo {
  margin-top: 10px;
  flex: 1;
  // position: relative;
  // .el-tabs__content {
  //   // position: absolute;
  //   // left: 0;
  //   // right: 0;
  //   // top: 39px;
  //   // bottom: 0;
  //   // overflow-y: auto;
  // }
  .tabsBox {
    height: 100%;
    .el-tabs__header {
      .el-tabs__nav {
        // height: 100%;
        .el-tabs__item {
          height: 80px !important;
          // margin-bottom: 10px;
        }
      }
    }
    .el-tabs__content {
      position: inherit;
      .el-tab-pane {
        overflow: hidden;
      }
    }
  }
}
</style>
