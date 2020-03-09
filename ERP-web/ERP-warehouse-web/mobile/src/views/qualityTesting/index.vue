<template>
  <div class="quality-testing">
    <flexbox>
      <flexbox-item>
        <search
          :results="results"
          v-model="purchaseProductBarCode"
          position="absolute"
          auto-scroll-to-top
          top="55px"
          @on-submit="onSubmit"
          ref="search"
        ></search>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group title label-width="5em">
          <yt-select
            :list="list1"
            :placeholder="'请选择质检类型'"
            :title="'质检:'"
            :popupTitle="'请选择'"
            :value.sync="inspectType"
          ></yt-select>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="primary" @click.native="handleComfirm" :disabled="disabled">确认质检</x-button>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <x-number
            title="质检数量："
            @on-change="val => rejectAllMax = val"
            v-model="inspectQuantity"
            :fillable="true"
            width="100px"
            :min="0"
          ></x-number>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <x-number
            title="本次不良品："
            v-model="rejectsQuantity"
            @on-change="val => rejectMax = val"
            :fillable="true"
            :max="rejectAllMax"
            :min="0"
            width="100px"
          ></x-number>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <span style="line-height:26px;padding-right: 10px;">退回不良品</span>
          <x-icon type="ios-plus-outline" size="26" style="position:absolute" @click="handleAdd"></x-icon>
        </group>
      </flexbox-item>
    </flexbox>
    <div v-for="(item,index) in rejectsInfo" :key="item.id">
      <group>
        <div style="width: 100%;border-top: 1px solid #000"></div>
        <!-- 选择供应商 -->
        <flexbox>
          <flexbox-item :span="9/10">
            <yt-select
              :list="suppliers"
              :placeholder="'选择内容'"
              :title="'选择供应商:'"
              :popupTitle="'请选择'"
              :value.sync="item.returnSupplierId"
              @on-change="selectChange1($event,index)"
            ></yt-select>
          </flexbox-item>
          <flexbox-item :span="1/10">
            <x-icon type="ios-close-outline" size="26" @click="handleClose(index)"></x-icon>
          </flexbox-item>
        </flexbox>
        <!-- 不良品数量： -->
        <flexbox>
          <flexbox-item :span="9/10">
            <x-number
              style="padding: 6px 15px;"
              @on-change="rejectsQNumChange($event,index)"
              title="不良品数量："
              v-model="item.rejectsQuantity"
              :fillable="true"
              :min="0"
              :max="rejectMax"
              width="100px"
            ></x-number>
          </flexbox-item>
        </flexbox>
        <!-- 退回数量： -->
        <flexbox>
          <flexbox-item :span="9/10">
            <x-number
              style="padding: 6px 15px;"
              @on-change="returnNumChange($event,index)"
              title="退回数量："
              v-model="item.returnQuantity"
              :fillable="true"
              :min="0"
              :max="item.returnMaxNum"
              width="100px"
            ></x-number>
          </flexbox-item>
        </flexbox>
      </group>
      <flexbox>
        <flexbox-item>
          <group>
            <span style="line-height:26px;padding-right: 10px; font-size: 16px;color: grey">不良品数量和备注</span>
            <x-icon type="ios-plus-outline" size="24" style="position:absolute" @click="handleAddRemark(index)"></x-icon>
          </group>
        </flexbox-item>
      </flexbox>
      <div v-for="(remak,indx) in item.remarks" :key="item.id">
        <group>
          <!-- 数量： -->
          <flexbox>
            <flexbox-item :span="9/10">
              <x-number
                style="padding: 6px 15px;"
                @on-change="numberChange($event,index,indx)"
                title="数量："
                v-model="remak.rejectsQuantity"
                :fillable="true"
                :min="0"
                :max="item.rejectsQuantity"
                width="100px"
              ></x-number>
            </flexbox-item>
            <flexbox-item :span="1/10">
              <x-icon type="ios-close-outline" size="24" @click="handleCloseRemark(index,indx)"></x-icon>
            </flexbox-item>
          </flexbox>
          <!-- 备注 -->
          <flexbox>
            <flexbox-item :span="9/10">
              <x-input title="备注:" v-model="remak.rejectsDesc" placeholder="请输入备注"></x-input>
            </flexbox-item>
          </flexbox>
        </group>
      </div>
    </div>
    <flexbox>
      <flexbox-item>
        <group>
          <yt-table :columns="columns" :data="datas"></yt-table>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <tab>
            <tab-item selected @on-item-click="onItemClick">产品详情</tab-item>
            <tab-item @on-item-click="onItemClick">质量问题归类</tab-item>
          </tab>
        </group>
      </flexbox-item>
    </flexbox>
    <div v-show="!switchFlag">
      <flexbox>
        <flexbox-item>
          <group>
            <swiper :list="swiper_list" v-model="swiper_index" :loop="true"></swiper>
          </group>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <group>
            <x-input title="产品重量：" v-model="productInfo1.productWeight"></x-input>
            <x-input title="产品尺寸：" v-model="productInfo1.productSize"></x-input>
            <x-input title="包装尺寸：" v-model="productInfo1.packageSize"></x-input>
            <x-input title="自定义SKU：" v-model="productInfo1.customSku"></x-input>
            <x-input title="产品属性：" v-model="productInfo1.productProperty"></x-input>
            <x-input title="入库仓库：" v-model="productInfo1.procurementName"></x-input>
            <x-input title="采购人员：" v-model="productInfo1.purchasersName"></x-input>
            <x-input title="产品中文名称：" v-model="productInfo1.productNameZh"></x-input>
            <x-input title="产品英文名称：" v-model="productInfo1.productNameEn"></x-input>
          </group>
        </flexbox-item>
      </flexbox>
    </div>
    <div v-show="switchFlag">
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rejectAllMax: 0,
      inspectQuantity: 0,
      inspectType: 0,
      rejectsQuantity: 0,
      rejectMax: 0,
      rejectsInfo: [
        {
          returnQuantity: 0,
          rejectsQuantity: 0,
          returnSupplierId: 0,
          returnMaxNum: 0,
          remarks: [
            {
              rejectsQuantity: 0,
              rejectsDesc: ''
            }
          ]
        }
      ],
      value1s: 'fdsa',
      swiper_list: [],
      swiper_index: 0,
      remak: '',
      numRemarks: [{}],
      purchaseProductBarCode: '',
      value1: [],
      results: [],
      list1: [{ label: '全检', value: 2 }, { label: '抽检', value: 1 }],
      datas: [],
      columns: [
        {
          label: '总数量',
          value: 'requirement'
        },
        {
          label: '质检通过',
          value: 'goodProductQuantity'
        },
        {
          label: '质检不通过',
          value: 'rejectsQuantity'
        },
        {
          label: '返回不良品数',
          value: 'returnQuantity'
        }
      ],
      switchFlag: 0,
      suppliers: [],
      requirement: 0,
      goodProductQuantity: 0,
      returnQuantity: 0,
      productInfo1: {
        productWeight: '',
        productSize: '',
        packageSize: '',
        productProperty: '',
        variantPropertys: [],
        productNameEn: '',
        productNameZh: '',
        purchasersName: '',
        procurementName: '',
        customSku: ''
      }
    }
  },
  watch: {},
  computed: {
    disabled() {
      let vm = this
      if (
        vm.inspectQuantity <= 0 ||
        vm.purchaseProductBarCode == '' ||
        !vm.inspectType
      ) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    let vm = this
    this.switchFlag = 1
    this.$nextTick(() => {
      vm.switchFlag = 0
      this.drawLine()
    })
  },
  methods: {
    onSubmit() {
      let vm = this
      let params = {
        purchaseProductBarCode: vm.purchaseProductBarCode
      }
      vm.$api[`procurement/getDetailByCode`](params).then(({ rows = {} }) => {
        let {
          suppliers = [],
          rejectsQuantity = 0,
          requirement = 0,
          goodProductQuantity = 0,
          returnQuantity = 0,
          productInfo1 = {},
          productImgs = []
        } = rows
        vm.suppliers = suppliers.map(item => {
          return {
            label: item.supplierName || '未知名字',
            value: item.supplierId
          }
        })
        // vm.rejectsQuantity = vm.inspectQuantity > rejectsQuantity ? rejectsQuantity : 0
        vm.rejectsQuantity =
          vm.rejectsQuantity >= vm.inspectQuantity ? 0 : rejectsQuantity
        vm.requirement = requirement
        vm.goodProductQuantity = goodProductQuantity
        vm.returnQuantity = returnQuantity
        vm.productInfo1 = Object.assign(vm.productInfo1, productInfo1)
        vm.productInfo1.productSize = `长${productInfo1.singleLong ||
          0}/宽${productInfo1.singleWide || 0}/高${productInfo1.singleHigh ||
          0}`
        vm.productInfo1.packageSize = `长${productInfo1.packageLong ||
          0}/宽${productInfo1.packageWide || 0}/高${productInfo1.packageHigh ||
          0}`
        vm.productInfo1.productProperty = productInfo1.variantPropertys
          .map(item => {
            return `${item.propertyName}：${item.propertyValue}`
          })
          .join('/')

        vm.swiper_list = productImgs.map(item => {
          return {
            url: 'javascript:',
            img: item.productImg
          }
        })
        vm.datas = [
          {
            requirement,
            goodProductQuantity,
            returnQuantity,
            rejectsQuantity
          }
        ]
      })
      vm.$api[`procurement/getIssueClassify`](params).then(({ rows = [] }) => {
        vm.drawLine(rows)
      })
    },
    rejectsQNumChange(val, index) {
      let vm = this
      let allNum = 0
      vm.rejectsInfo.map(item => {
        allNum += item.rejectsQuantity
        return item
      })
      vm.rejectsInfo[index].returnMaxNum = val
      if (allNum > vm.rejectsQuantity) {
        vm.$msg('不良品数量不能大于本次本良品总数')
        vm.rejectsInfo[index].rejectsQuantity = 0
      }
    },
    returnNumChange(val) {
      console.log(val)
    },
    handleClose(index) {
      this.rejectsInfo.splice(index, 1)
    },
    handleAdd() {
      this.rejectsInfo.push({
        returnQuantity: 0,
        rejectsQuantity: 0,
        returnSupplierId: 0,
        returnMaxNum: 0,
        remarks: [
          {
            rejectsQuantity: 0,
            rejectsDesc: ''
          }
        ]
      })
    },
    selectChange1(val, index) {
      let vm = this
      vm.rejectsInfo[index].returnSupplierId = val
    },
    numberChange(val, index, indx) {
      let vm = this
      let allNum = 0
      vm.rejectsInfo[index].remarks.map(item => {
        allNum += item.rejectsQuantity
      })
      if (allNum > vm.rejectsInfo[index].rejectsQuantity) {
        vm.$msg('数量不能大于不良品数量')
        vm.rejectsInfo[index].remarks[indx].rejectsQuantity = 0
      }
    },
    handleCloseRemark(index, indx) {
      this.rejectsInfo[index].remarks.splice(indx, 1)
    },
    handleAddRemark(index) {
      this.rejectsInfo[index].remarks.push({
        rejectsQuantity: 0,
        rejectsDesc: ''
      })
    },
    handleComfirm() {
      let vm = this
      if (vm.inspectQuantity <= 0) return this.$msg('质检数必须大于0')
      if (vm.purchaseProductBarCode == '') return this.$msg('条码不能为空')
      if (!vm.inspectType) return this.$msg('质检类型不能为空')
      if (vm.rejectsInfo.every(item => !item.returnSupplierId))
        return this.$msg('供应商不能为空')
      let allNum = 0
      vm.rejectsInfo.map(item => {
        allNum += item.rejectsQuantity
      })
      if (vm.rejectsQuantity != allNum) {
        return this.$msg('所有不良品数量要等于本次不良品数量')
      }
      let params = {
        purchaseProductBarCode: vm.purchaseProductBarCode,
        inspectQuantity: vm.inspectQuantity,
        inspectType: vm.inspectType,
        rejectsQuantity: vm.rejectsQuantity,
        returnQuantity: vm.returnQuantity,
        rejectsInfo: vm.rejectsInfo
      }
      vm.$api[`procurement/confirmQC`](params).then(data => {
        this.$msg('质检成功')
      })
    },
    onItemClick(val) {
      this.switchFlag = val
    },
    drawLine(data = []) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      let legendData = data.map(item => item.desc)
      if (!legendData.length) {
        legendData = ['暂无数据']
      }
      let seriesData = data.map(item => {
        return {
          name: item.desc,
          value: item.quantity
        }
      })
      if (!seriesData.length) {
        seriesData = [{ name: '暂无数据', value: 1 }]
      }
      myChart.setOption({
        baseOption: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            data: legendData
          },
          calculable: false,
          series: [
            {
              name: '面积模式',
              type: 'pie',
              data: seriesData
              // data: [
              //   { value: 10, name: '颜色不对' },
              //   { value: 5, name: '破损' },
              //   { value: 15, name: '货不对' },
              //   { value: 25, name: '尺码不对' },
              //   { value: 20, name: '有瑕疵' },
              //   { value: 35, name: '包装损坏' }
              // ]
            }
          ]
        },
        media: [
          {
            option: {
              legend: {
                right: 'center',
                bottom: 0
              },
              series: [
                {
                  radius: [0, '50%'],
                  center: ['50%', '50%']
                }
              ]
            }
          },
          {
            query: {
              minAspectRatio: 1
            },
            option: {
              legend: {
                right: 'bottom',
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [0, '50%'],
                  center: ['50%', '50%']
                }
              ]
            }
          },
          {
            query: {
              maxAspectRatio: 1
            },
            option: {
              legend: {
                right: 'center',
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [0, '50%'],
                  center: ['50%', '50%']
                }
              ]
            }
          },
          {
            query: {
              maxWidth: 500
            },
            option: {
              legend: {
                right: 10,
                top: '4%',
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [0, '50%'],
                  center: ['50%', '50%']
                }
              ]
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
.quality-testing {
  background: #fff;
  .vux-search-box {
    margin-top: -15px;
  }
}
</style>