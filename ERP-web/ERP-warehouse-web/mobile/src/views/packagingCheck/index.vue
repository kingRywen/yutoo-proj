<template>
  <div class="packaging-check">
    <flexbox>
      <flexbox-item :span="2/3">
        <group>
          <x-input placeholder="输入包裹订单号" title="包裹订单号：" @on-enter="handleAddScan" v-model="packageNumber"></x-input>
        </group>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <group>
          <x-button type="default" v-if="!packageFlag">
            <flexbox>
              <flexbox-item>
                <icon type="cancel"></icon>不可打包
              </flexbox-item>
              <!-- <flexbox-item>不可打包</flexbox-item> -->
            </flexbox>
          </x-button>
          <x-button v-else type="default" @click.native="handlePackage">
            <icon type="success"></icon>可以打包
          </x-button>
        </group>
      </flexbox-item>
    </flexbox>
    <div v-if="infoFlag">
      <flexbox v-if="scanFlag">
        <flexbox-item>
          <group>
            <x-input placeholder="输入射频号" title="扫描射频：" @on-enter="handleAddProduct" v-model="codes"></x-input>
          </group>
        </flexbox-item>
      </flexbox>
      <!-- 产品列表 -->
      <flexbox>
        <flexbox-item>
          <div class="martop15" style="line-height: 40px;">产品列表：</div>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <yt-table :columns="columns" :data="data"></yt-table>
        </flexbox-item>
      </flexbox>
      <!-- 装箱列表 -->
      <section class="martop15">
        <mt-button
          :disabled="!isTrue"
          type="primary"
          style="width: 100%;position: fixed;bottom: 0;z-index:999999"
          @click.native="subClick"
        >更新箱子信息</mt-button>
        <div v-for="(tableData,index) in tableDatas" :key="index">
          <flexbox>
            <flexbox-item>
              <div style="line-height: 20px;">
                <flexbox>
                  <flexbox-item span="80px">
                    <div>
                      <br>
                      {{tableData.name || '箱子名字:'}}
                    </div>
                  </flexbox-item>
                  <flexbox-item>
                    长
                    <yt-input @input="val => tableData.length = val" :value="tableData.length">
                      <span slot="right">CM</span>
                    </yt-input>
                  </flexbox-item>
                  <flexbox-item>
                    宽
                    <yt-input @input="val => tableData.wide = val" :value="tableData.wide">
                      <span slot="right">CM</span>
                    </yt-input>
                  </flexbox-item>
                  <flexbox-item>
                    高
                    <yt-input @input="val => tableData.high = val" :value="tableData.high">
                      <span slot="right">CM</span>
                    </yt-input>
                  </flexbox-item>
                  <!-- <flexbox-item>
                  重量
                  <yt-input
                    @input="val => {tableData.weight = val;handleChange(val,tableData)}"
                    :value="tableData.weight"
                  >
                    <span slot="right">G</span>
                  </yt-input>
                  </flexbox-item>-->
                  <flexbox-item :span="1/16">
                    <br>
                    <span v-if="index==0" @click="handleAdd">
                      <x-icon type="ios-plus-outline" size="26" style="margin-top: 14px"></x-icon>
                    </span>
                    <span v-else @click="handleDelete(index,tableData)">
                      <x-icon type="ios-close-outline" size="26" style="margin-top: 14px"></x-icon>
                    </span>
                  </flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>
                    <group>
                      <x-input
                        title="箱子条码:"
                        placeholder="请输入条码"
                        @on-enter="handleChange('code',tableData)"
                        v-model="tableData.code"
                      ></x-input>
                    </group>
                  </flexbox-item>
                </flexbox>
              </div>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <group>
                <yt-table class="table" :columns="tableColumns" :data="tableData.products"></yt-table>
              </group>
            </flexbox-item>
          </flexbox>
        </div>
      </section>
      <!-- 发货备注 -->
      <section>
        <flexbox>
          <flexbox-item>
            <div class="martop15" style="line-height: 40px;">发货备注：</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <x-textarea style="border: 1px solid rgb(189, 189, 189)" v-model="packageInfo.deliverRemark"></x-textarea>
          </flexbox-item>
        </flexbox>
      </section>
      <!-- 物流信息 -->
      <section>
        <flexbox>
          <flexbox-item>
            <div class="martop15" style="line-height: 40px;">物流信息：</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <div class="bcolor">
              <x-input title="收货人" placeholder="暂无数据" disabled v-model="packageInfo.customerName"></x-input>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <div class="bcolor tncolor">
              <x-input title="EMAIL" placeholder="暂无数据" disabled v-model="packageInfo.customerEmail"></x-input>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <div class="bcolor tncolor">
              <x-input title="地址" placeholder="暂无数据" disabled v-model="packageInfo.customerAddress"></x-input>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <div class="bcolor tncolor">
              <x-input title="省市国家" placeholder="暂无数据" disabled v-model="packageInfo.customerCountry"></x-input>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <div class="bcolor tncolor">
              <x-input title="邮编" placeholder="暂无数据" disabled v-model="packageInfo.customerPostcode"></x-input>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <div class="bcolor tncolor">
              <x-input title="电话" placeholder="暂无数据" disabled v-model="packageInfo.customerTelephone"></x-input>
            </div>
          </flexbox-item>
        </flexbox>
      </section>

      <!-- 称重 -->
      <section>
        <flexbox>
          <flexbox-item>
            <div class="martop15" style="line-height: 40px;">称重：</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <x-input title="运输方式" placeholder="平邮" disabled v-model="value"></x-input>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <x-input title="箱子条码" @on-enter="handleWeigh" placeholder="输入箱子条码" v-model="boxCode"></x-input>
          </flexbox-item>
        </flexbox>

        <flexbox>
          <flexbox-item :span="7/8">
            <group>
              <x-input title="重量：" @on-enter="handleWeigh" placeholder="请输入重量" v-model="weight"></x-input>
            </group>
          </flexbox-item>
          <flexbox-item :span="1/8">
            <group>克(G)</group>
          </flexbox-item>
        </flexbox>
      </section>
    </div>
    <div style="margin-top: 30px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      infoFlag: true,
      packageFlag: false,
      boxCode: '',
      scanFlag: true,
      codes: '',
      code: '',
      packageNumber: null,
      value: '',
      data: [],
      columns: [
        {
          label: '主图',
          value: 'imageBase',
          type: 'img'
        },
        {
          label: '自定义SKU',
          value: 'skuCus'
        },
        {
          label: '规则参数',
          value: 'specification'
        },
        {
          label: '需求数量',
          value: 'packageAmount'
        },
        {
          label: '扫描数量',
          value: 'scannedAmount'
        },
        {
          label: '扫描状态',
          render(h, scope) {
            if (scope.scannedStatus) {
              return (
                <span style="font-size:15px;">
                  <div style="line-height: 30px;">
                    <icon type="success" is-msg />
                  </div>
                  <div style="line-height: 30px;">扫描匹配通过</div>
                </span>
              )
            } else {
              return (
                <span style="font-size:15px;">
                  <div style="line-height: 30px;">
                    <icon type="cancel" is-msg />
                  </div>
                  <div style="line-height: 30px;">扫描匹配不通过</div>
                </span>
              )
            }
          }
        }
      ],
      tableColumns: [
        {
          label: '产品图片',
          value: 'imageBase',
          type: 'img'
        },
        {
          label: '自定义SKU',
          value: 'skuCus'
        },
        {
          label: '规则参数',
          value: 'specification'
        },
        {
          label: '装箱数量',
          render(h, scope) {
            return (
              <input
                class="xinput"
                onInput={val => {
                  scope.amount = val.target.value
                }}
                value={scope.amount}
              />
            )
          }
        }
      ],
      tableDatas: [
        {
          products: [
            {
              amount: null
            }
          ],
          weight: null,
          length: null,
          wide: null,
          high: null,
          code: null
        }
      ],
      packageInfo: {},
      startTime: null,
      endTime: null,
      weight: ''
    }
  },
  watch: {
    tableDatas: {
      deep: true,
      handler() {
        // console.log(val)
      }
    }
  },
  computed: {
    isTrue: {
      get() {
        return this.tableDatas.some(item => {
          return (
            (parseFloat(item.wmAppPackId) || item.wmAppPackId == 0) &&
            parseFloat(item.length) &&
            parseFloat(item.wide) &&
            parseFloat(item.high) &&
            (item.code || item.code == 0) &&
            item.products.every(
              item =>
                parseFloat(item.amount) &&
                (item.wmPackageProductId || item.wmPackageProductId == 0)
            )
          )
        })
      },
      set() {}
    }
  },
  methods: {
    subClick(val) {
      let vm = this
      let datas = vm.$clone(vm.tableDatas)
      let boxInfo = datas.map(item => {
        let { wmAppPackBoxId, products, code, length, wide, high } = item
        return {
          wmAppPackBoxId,
          code,
          products: products.map(el => {
            let { wmPackageProductId, amount } = el
            return { wmPackageProductId, amount: parseFloat(amount) }
          }),
          length: parseFloat(length),
          wide: parseFloat(wide),
          high: parseFloat(high)
        }
      })
      let params = {
        boxInfo,
        wmAppPackId: vm.packageInfo.wmAppPackId
      }
      vm.updateBox(params)
    },
    ytinput(val) {
      console.log(val)
    },
    handleAddProduct() {
      let vm = this
      vm.$api[`warehouse/packScanProduct`]({
        codes: vm.codes.split(','),
        wmAppPackId: vm.packageInfo.wmAppPackId
      })
        .then(() => {
          // vm.infoFlag = false
          vm.getPackScanPackage()
        })
        .catch(() => {
          // vm.infoFlag = true
        })
    },
    handleAdd() {
      if (!this.$.dataType(this.tableDatas) === 'Array') {
        return
      }
      let len = this.tableDatas.length
      let obj = this.$clone(this.tableDatas[len - 1])
      delete obj.wmAppPackBoxId
      if (!this.$.dataType(obj.products) === 'Array') {
        return
      }
      obj.products.map(item => {
        item.amount = 0
      })
      obj.code = ''
      obj.weight = 0
      obj.length = 0
      obj.wide = 0
      obj.high = 0
      obj.name = ''
      this.tableDatas.push(obj)
    },

    handleDelete(index, row) {
      let vm = this
      if (!row.wmAppPackBoxId && row.wmAppPackBoxId != 0) {
        vm.tableDatas.splice(index, 1)
        return
      }
      let params = {
        wmAppPackBoxId: row.wmAppPackBoxId
      }
      vm.$api[`warehouse/packBoxDelete`](params).then(() => {
        vm.tableDatas.splice(index, 1)
        vm.getPackListBox()
      })
    },
    handleChange(val, row, type) {
      let vm = this
      vm.startTime = vm.endTime
      vm.endTime = new Date().getTime()
      if (val == 'code') {
        //箱子条码
        let wmAppPackBoxId = parseInt(row.wmAppPackBoxId)
        let length = parseInt(row.length)
        let wide = parseInt(row.wide)
        let high = parseInt(row.high)
        let weight = parseInt(row.weight)
        // if (
        //   wmAppPackBoxId != wmAppPackBoxId ||
        //   length != length ||
        //   wide != wide ||
        //   high != high ||
        //   weight != weight
        // ) {
        //   return
        // }
        let params = {
          wmAppPackBoxId,
          length,
          wide,
          high,
          weight,
          code: vm.code
        }
        vm.updateBox(params)
      }
      if (vm.startTime != null && vm.endTime - vm.startTime > 100) {
        if (type !== 'amount') {
          let wmAppPackBoxId = parseInt(row.wmAppPackBoxId)
          let length = parseInt(row.length)
          let wide = parseInt(row.wide)
          let high = parseInt(row.high)
          let weight = parseInt(row.weight)
          if (
            wmAppPackBoxId != wmAppPackBoxId ||
            length != length ||
            wide != wide ||
            high != high ||
            weight != weight
          ) {
            return
          }
          let params = {
            wmAppPackBoxId,
            length,
            wide,
            high,
            weight
          }
          if (val == 'code') {
            params.code = vm.code
          }
          vm.updateBox(params)
        } else {
          let amount = parseInt(row.amount)
          if (amount != amount) {
            return
          }
          console.log(amount)
          vm.updateProduct({
            wmPackageProductId: row.wmPackageProductId,
            wmAppPackBoxId: row.wmAppPackBoxId,
            amount
          })
        }
      }
    },
    updateProduct(params) {
      let vm = this
      vm.$api[`warehouse/packBoxProductUpdate`](params).then(() => {
        vm.getPackListBox()
      })
    },
    updateBox(params) {
      let vm = this
      console.log(params)
      vm.$api[`warehouse/packBoxUpdate`](params).then(() => {
        vm.getPackListBox()
      })
    },
    handleAddScan() {
      let vm = this
      let params = {
        packageNumber: vm.packageNumber.toString()
      }
      vm.$api[`warehouse/packScanPackage`](params)
        .then(({ rows = {} }) => {
          vm.infoFlag = true
          vm.packageInfo = rows
          console.log(vm.packageInfo)
          vm.getPackScanPackage()
          vm.getPackListBox()
        })
        .catch(() => {
          vm.infoFlag = false
        })
    },
    getPackListBox() {
      //获取装箱的产品
      let vm = this
      return vm.$api[`warehouse/packListBoxProduct`]({
        wmAppPackId: vm.packageInfo.wmAppPackId
      }).then(({ rows = [] }) => {
        vm.tableDatas = rows
        return Promise.resolve()
      })
    },
    getPackScanPackage() {
      //获取扫描的射频
      let vm = this
      vm.$api[`warehouse/packListScanProduct`]({
        wmAppPackId: vm.packageInfo.wmAppPackId
      }).then(({ rows = [] }) => {
        vm.data = rows
        vm.packageFlag = vm.data.every(item => item.scannedStatus == 1)
      })
    },
    handlePackage() {
      let vm = this
      let params = {
        wmAppPackId: vm.packageInfo.wmAppPackId
      }
      vm.$api[`warehouse/packComplate`](params)
    },
    handleWeigh() {
      let vm = this
      let boxCode = vm.boxCode
      let weight = vm.weight
      if (!boxCode || !weight) {
        let msg = ''
        if (!boxCode) {
          msg = '请输入箱子条码'
        } else {
          msg = '请输入重量'
        }
        vm.$msg(msg)
        return
      }
      vm.$api[`warehouse/packWeigh`]({
        weight,
        boxCode
      })
    }
  }
}
</script>

<style lang="scss">
.packaging-check {
  padding-bottom: 30px;
  background: #fff;
  .weui-btn_default {
    font-size: 12px;
  }
  .weui-btn {
    line-height: 3.9 !important;
  }
  .martop15 {
    .weui-cell {
      padding: 0;
    }
    .table {
      .xinput {
        height: 26px;
        width: 60px;
      }
    }
  }
  .remark {
    min-height: 100px;
  }
  .vux-flexbox-item {
    margin-left: 0px !important;
  }
}
</style>