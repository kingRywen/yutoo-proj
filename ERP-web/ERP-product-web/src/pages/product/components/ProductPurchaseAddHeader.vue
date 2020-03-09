<template>
  <v-form v-if="!$attrs.props" :model="addForm" ref="addForm" direction="horizontal">
    <v-form-item
      label="国家"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="nationId"
    >
      <v-select search v-model="addForm.nationId" size="lg" style="width:100%" :data="nationLists"></v-select>
    </v-form-item>
    <v-form-item
      label="运输方"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="logisticTransportationId"
    >
      <v-select
        v-model="addForm.logisticTransportationId"
        style="width:100%"
        size="lg"
        :data="transportationList"
        clue="logisticTransportationId"
        label="logisticTransportationName"
      ></v-select>
    </v-form-item>
    <!-- <v-form-item
      label="运输方式"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="freightType"
    >
      <v-input v-model="addForm.freightType" size="lg"></v-input>
    </v-form-item>-->
    <v-form-item
      v-if="addForm.logisticTransportationId != null"
      label="运输方式"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="freightType"
    >
      <v-select
        v-model="addForm.freightType"
        style="width:100%"
        size="lg"
        :data="addFreightTypeLists"
        clue="logisticTransportTypeId"
        label="transportTypeName"
      ></v-select>
    </v-form-item>
    <v-form-item
      label="计价方式"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="priceType"
      class="__style"
    >
      <v-row :gutter="6" type="flex">
        <v-col :span="22">
          <v-select :data="priceTypeData" v-model="addForm.priceType" size="lg" :allowClear="false"></v-select>
        </v-col>
        <v-col :span="2" v-tooltip.top="`默认海运按体积计算,空运按重量计算`" style="text-align:center">
          <v-icon type="question-circle"></v-icon>
        </v-col>
      </v-row>
    </v-form-item>
    <v-form-item
      v-if="show"
      label="费用"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="freightPrice"
    >
      <!-- <v-row :gutter="6" type="flex">
        <v-col>
          <v-input v-model="addForm.freightPrice" size="lg">
            <v-select slot="after" style="width:60px" :data="productPriceData" v-model="addForm.freightPriceUnit" size="lg" :allowClear="false"></v-select>
          </v-input>
        </v-col>
        <v-col>
          /
        </v-col>
        <v-col>
          <v-select style="width:80px" :data="productColData" v-model="addForm.freightPriceTypeUnit" size="lg" :allowClear="false"></v-select>
        </v-col>
      </v-row>-->
      <div class="flex">
        <v-input-number
          :value="addForm.freightPrice || ''"
          @change="val =>addForm.freightPrice = val"
          :min="0.01"
          style="margin-right:8px;width:100%"
          size="large"
        ></v-input-number>
        <v-select
          style="width:60px"
          :data="productPriceData"
          v-model="addForm.freightPriceUnit"
          size="lg"
          :allowClear="false"
        ></v-select>
        <span style="margin:0 8px">/</span>

        <v-select
          style="width:80px"
          :data="productColData"
          v-model="addForm.freightPriceTypeUnit"
          size="lg"
          :allowClear="false"
        ></v-select>
      </div>
    </v-form-item>
    <template v-else>
      <v-form-item
        label="重量"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="[{required:true, message: '不能为空'}]"
        prop="productWeight"
      >
        <v-row>
          <v-col span="6">
            <span>长*宽*高/</span>
          </v-col>
          <v-col span="18">
            <v-input-number
              style="width:100%"
              :min="0.01"
              :value="addForm.productWeight || ''"
              @change="val => addForm.productWeight = val"
              size="large"
            ></v-input-number>
          </v-col>
        </v-row>
      </v-form-item>
      <v-form-item
        label="费用"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="[{required:true, message: '不能为空'}]"
        prop="freightPrice"
      >
        <div class="flex">
          <v-input-number
            style="margin-right:8px;width:100%"
            :min="0.01"
            :value="addForm.freightPrice || ''"
            @change="val => addForm.freightPrice = val"
            size="large"
          ></v-input-number>
          <v-select
            style="width:60px"
            :data="productPriceData"
            v-model="addForm.freightPriceUnit"
            size="lg"
            :allowClear="false"
          ></v-select>

          <span style="margin:0 8px">/</span>

          <v-select
            style="width:80px"
            :data="productWeightData"
            v-model="addForm.freightPriceTypeUnit"
            size="lg"
            :allowClear="false"
            key="productColData"
          ></v-select>
        </div>
      </v-form-item>
    </template>
    <v-form-item
      label="运输时间"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="[{required:true, message: '不能为空'}]"
      prop="freightTime"
    >
      <div class="flex">
        <v-input-number
          :value="addForm.freightTime || ''"
          @change="val =>addForm.freightTime = val"
          :min="1"
          style="margin-right:8px;width:100%"
          size="large"
        ></v-input-number>
        <span>天</span>
      </div>
    </v-form-item>
  </v-form>

  <v-form v-else ref="addForm" direction="horizontal">
    <v-form-item label="到达国家" :label-col="labelCol" :wrapper-col="wrapperCol">{{addForm.nation}}</v-form-item>
    <v-form-item
      v-if="addForm.priceType === 1"
      label="产品净重（g）"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >{{addForm.nw}}</v-form-item>
    <v-form-item v-else label="产品重量（g）" :label-col="labelCol" :wrapper-col="wrapperCol">{{addForm.productWeight}}</v-form-item>
    <v-form-item
      label="产品体积（cm³）"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >{{addForm.singleHigh *addForm.singleLong *addForm.singleWide}}</v-form-item>
    <v-form-item
      :label="`报关价格（${~~addForm.entryPriceUnit}）`"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >{{addForm.entryPrice}}</v-form-item>
    <v-form-item :label="`单个运费（RMB）`" :label-col="labelCol" :wrapper-col="wrapperCol">
      <v-input v-model="addForm.freightPriceSingle" size="lg"></v-input>
    </v-form-item>
    <v-form-item :label="`单个税费（RMB）`" :label-col="labelCol" :wrapper-col="wrapperCol">
      <v-input v-model="addForm.taxesSingle" size="lg"></v-input>
    </v-form-item>
  </v-form>
</template>

<script>
import { fetchData, handlerCode, showToast } from 'common/common'
import apis from 'apis'

export default {
  created() {
    this.getTransportationList()
    if (this.$attrs.props) {
      this.addForm = this.$attrs.props.item
    }
    // fetchData({ ...apis.TRANSPORT_FIRST_NATION, data: {} }).then(res => {
    //   this.nationLists = res.data;
    // });

    this.getNationList()
    // 重量
    fetchData({ ...apis.GLOBAL_UNIT_ITEM_TYPE_LIST, data: { type: 4 } }).then(
      res => {
        this.productWeightData = res.data.rows.map(el => ({
          label: el,
          value: el
        }))
      }
    )
    // 币种
    fetchData({ ...apis.GLOBAL_UNIT_ITEM_TYPE_LIST, data: { type: 3 } }).then(
      res => {
        this.productPriceData = res.data.rows.map(el => ({
          label: el,
          value: el
        }))
      }
    )
    // 体积
    fetchData({ ...apis.GLOBAL_UNIT_ITEM_TYPE_LIST, data: { type: 5 } }).then(
      res => {
        this.productColData = res.data.rows.map(el => ({
          label: el,
          value: el
        }))
      }
    )
  },
  data() {
    return {
      transportationList: [],
      addFreightTypeLists: [],
      show: true,
      addForm: {
        priceType: 1,
        freightPriceUnit: 'USD',
        freightPriceTypeUnit: 'cm^3'
      },
      productColData: [],
      productPriceData: [],
      productWeightData: [],
      priceTypeData: [
        {
          label: '按体积',
          value: 1
        },
        {
          label: '按重量',
          value: 2
        }
      ],
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      nationLists: []
    }
  },
  methods: {
    getTransportationList() {
      fetchData({
        ...apis.LOGISTIC_TRANSPORTATION_LIST,
        data: {}
      }).then(res => {
        if (res.data.code !== 0) {
          this.$message.error(res.data.msg)
          return
        }
        this.transportationList = res.data.rows
      })
    },
    // 新增编辑里的运输方式
    getAddFreightTypeLists(logisticTransportationId) {
      fetchData({
        ...apis.LOGISTIC_TRANSPORT_LOGISTIC_TRANSPORTATION_TYPE_LIST,
        data: { logisticTransportationId }
      }).then(res => {
        
        if ((res.data && res.data.code !== 0)) {
          this.$message.error(res.data.msg)
          return
        }
        if (!res.data.rows) {
          showToast('warning', '此运输方下不存在运输方式，请重新选择运输方')
        }
        if (res.data && res.data.code === 0) {
          this.addFreightTypeLists = res.data.rows || []
        }
      })
    },
    getNationList() {
      fetchData({
        ...apis.NATION_LIST
      }).then(res => {
        if (res.data.code === 0) {
          this.nationLists = res.data.rows.map(el => ({
            label: el.nameZh,
            value: el.nationId,
            ...el
          }))
        }
      })
    },
    ok() {
      let vm = this
      if (this.$attrs.props) {
        // 修改
        fetchData({
          ...apis.PRODUCT_TRANSPORT_REL_UPDATE,
          data: {
            ...vm.addForm,
            transportRelId: this.$attrs.props.item.transportRelId
          }
        }).then(res => {
          handlerCode(res, () => {
            vm.$listeners.set()
            vm.cancel()
          })
        })
      } else {
        vm.$refs.addForm.validate(valid => {
          if (valid) {
            
            fetchData({
              ...apis.TRANSPORT_FIRST_SAVE,
              data: { ...vm.addForm }
            }).then(res => {
              handlerCode(res, () => {
                vm.cancel()
                vm.$listeners.set()
              })
            })
          }
        })
      }
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false
    }
  },
  watch: {
    'addForm.logisticTransportationId'(val) {
      // this.addForm.freightType = null
      this.$set(this.addForm, 'freightType', undefined)
      if (val != null) {
        this.getAddFreightTypeLists(val)
      }
    },
    'addForm.priceType': {
      immediate: true,
      handler(val) {
        if (
          this.productWeightData.length == 0 ||
          this.productColData.length == 0
        ) {
          return
        }
        debugger
        if (val === 1) {
          this.show = true
          this.$nextTick(() => {
            this.addForm.freightPriceTypeUnit = this.productColData[0].value
          })
        } else {
          this.show = false
          this.$nextTick(() => {
            this.addForm.freightPriceTypeUnit = this.productWeightData[0].value
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.__style {
  position: relative;
}
.flex {
  display: flex;
}
</style>
