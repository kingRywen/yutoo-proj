<template>
  <div id="components-layout-demo-top-side" :style="!show ? styles : {}">
    <v-layout v-if="show">
      <yt-header :index="1"></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout style="padding:24px 24px">
          <v-breadcrumb style="margin-bottom:10px">
            <v-breadcrumb-item>
              <a href="/intelligentReplenishment.html">计算公式添加</a>
            </v-breadcrumb-item>
            <v-breadcrumb-item>
              <a href="#">头程管理</a>
            </v-breadcrumb-item>
          </v-breadcrumb>
          <v-content>
            <!-- 主体内容开始 -->
            <div>
              <v-card>
                <v-form :model="searchParams" ref="ruleForm">
                  <v-form-item label="国家">
                    <v-select
                      v-model="searchParams.nationId"
                      style="width:200px"
                      size="lg"
                      :data="nationLists"
                      clue="countryId"
                      label="countryName"
                    ></v-select>
                  </v-form-item>
                  <v-form-item label="运输方式">
                    <v-select
                      v-model="searchParams.freightType"
                      style="width:200px"
                      size="lg"
                      :data="freightTypeLists"
                      clue="logisticTransportTypeId"
                      label="transportTypeName"
                    ></v-select>
                  </v-form-item>
                  <v-form-item>
                    <v-button type="primary" @click="search">搜索</v-button>
                  </v-form-item>
                </v-form>

                <div class="hr"></div>
                <v-button @click="addNew" type="primary">添加</v-button>
                <v-button @click="delItem()" type="primary">删除</v-button>

                <v-data-table
                  stripe
                  ref="table"
                  :data="lists"
                  :tree-option="treeOption"
                  :page-size="pageSize"
                  :page-no="pageNo"
                  :columns="columns"
                  check-type="checkbox"
                  class="margin-top-25"
                  :current-data.sync="tableData"
                >
                  <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='priceType'">{{props.content === 1 ? '海运' : '空运'}}</div>
                    <div v-else-if="props.column.field=='productWeight'">
                      <span
                        v-if="props.item.priceType === 1"
                      >{{props.item.freightPrice}}{{props.item.freightPriceUnit}}/{{props.item.freightPriceTypeUnit}}</span>
                      <span
                        v-else
                      >重量：长*宽*高/{{props.item.productWeight}} 费用： {{props.item.freightPrice}}{{props.item.freightPriceUnit}}/{{props.item.freightPriceTypeUnit}}</span>
                    </div>
                    <div v-else-if="props.column.field=='entryPrice'">{{props.content}}{{props.item.entryPriceUnit}}</div>
                    <div v-else-if="props.column.field=='productVolume'">
                      <span v-if="props.item.singleHigh && props.item.singleLong && props.item.singleWide">
                        {{props.item.singleHigh * props.item.singleLong * props.item.singleWide}}(cm
                        <sup>3</sup>)
                      </span>
                      <span v-else>-</span>
                    </div>
                    <div v-else-if="props.column.field=='edit'">
                      <v-button @click="editItem(props)" type="primary">编辑</v-button>
                      <v-button @click="delItem(props)" type="danger">删除</v-button>
                    </div>
                    <div v-else>{{props.content}}</div>
                  </template>
                </v-data-table>
              </v-card>
            </div>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>
    <template v-else>
      <v-form :model="searchParams" ref="ruleForm">
        <v-form-item label="国家">
          <v-select
            v-model="searchParams.nationId"
            style="width:200px"
            size="lg"
            :data="nationLists"
            clue="countryId"
            label="countryName"
          ></v-select>
        </v-form-item>
        <v-form-item label="运输方式">
          <v-select
            v-model="searchParams.freightType"
            style="width:200px"
            size="lg"
            :data="freightTypeLists"
            clue="logisticTransportTypeId"
            label="transportTypeName"
          ></v-select>
        </v-form-item>
        <v-form-item>
          <v-button type="primary" @click="search">搜索</v-button>
        </v-form-item>
      </v-form>

      <div class="hr"></div>
      <v-button @click="addNew" type="primary">添加</v-button>
      <v-button @click="delItem()" type="primary">删除</v-button>

      <v-data-table
        stripe
        ref="table"
        :data="lists"
        :tree-option="treeOption"
        :page-size="pageSize"
        :page-no="pageNo"
        :columns="columns"
        check-type="checkbox"
        class="margin-top-25"
        :current-data.sync="tableData"
      >
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='priceType'">{{props.content === 1 ? '海运' : '空运'}}</div>
          <div v-else-if="props.column.field=='productWeight'">
            <span
              v-if="props.item.priceType === 1"
            >{{props.item.freightPrice}}{{props.item.freightPriceUnit}}/{{props.item.freightPriceTypeUnit}}</span>
            <span
              v-else
            >重量：长*宽*高/{{props.item.productWeight}} 费用： {{props.item.freightPrice}}{{props.item.freightPriceUnit}}/{{props.item.freightPriceTypeUnit}}</span>
          </div>
          <div v-else-if="props.column.field=='entryPrice'">{{props.content}}{{props.item.entryPriceUnit}}</div>
          <div v-else-if="props.column.field=='productVolume'">
            <span v-if="props.item.singleHigh && props.item.singleLong && props.item.singleWide">
              {{props.item.singleHigh * props.item.singleLong * props.item.singleWide}}(cm
              <sup>3</sup>)
            </span>
            <span v-else>-</span>
          </div>
          <div v-else-if="props.column.field=='edit'">
            <v-button @click="editItem(props)" type="primary">编辑</v-button>
            <v-button @click="delItem(props)" type="danger">删除</v-button>
          </div>
          <div v-else>{{props.content}}</div>
        </template>
      </v-data-table>
    </template>
    <v-modal :title="`${add ? '添加': '编辑'}运输方式`" :visible="visible" @ok="formSubmit" @cancel="handleCancel">
      <v-form :model="addForm" ref="addForm" direction="horizontal">
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
          label="国家"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="[{required:true, message: '不能为空'}]"
          prop="nationId"
        >
          <v-select
            search
            v-model="addForm.nationId"
            size="lg"
            style="width:100%"
            :data="nationLists"
            clue="countryId"
            label="countryName"
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
    </v-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import ytHeader from 'components/layout/header.vue'
import ytCard from 'components/base/ytCard.vue'
import { fetchData, handlerCode, showToast, showConfirm } from 'common/common'
import { getQueryString } from 'common/util'
import apis from 'apis'

export default {
  name: 'WarehousingLogisticsManagement',
  components: {
    ytHeader,
    ytCard
  },
  created() {
    this.show = !getQueryString('warehouse')
    this.getNationList()
    this.getFreightTypeLists()
    this.getTransportationList()
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
  data: function() {
    let vm = this
    return {
      styles: {
        background: '#fff',
        margin: '20px'
      },
      show: true,
      freightTypeLists: [],
      addFreightTypeLists: [],
      transportationList: [],
      show: true,
      addForm: {
        priceType: 1,
        freightType: null,
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
      cards: [],
      loading: true,
      ruleForm: {},
      nationLists: [], // 国家列表
      add: true,

      // 对话框
      visible: false,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },

      // 列表
      lists: data => {
        data.pageNumber = data.pageNo
        delete data.pageNo
        let reqData = Object.assign({}, data, this.params, vm.searchParams)
        delete reqData.sortColumns

        let opts = Object.assign(
          {},
          { ...apis.TRANSPORT_FIRST_LIST },
          { data: reqData }
        )

        return fetchData(opts).then(res => {
          if (!res.data.rows) {
            this.$message.error(res.data.msg)
            return
          }
          let data = res.data
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          }
        })
      },
      params: {
        sortOrder: 'asc'
      },
      searchParams: {},
      treeOption: {
        isAsync: true,
        idKey: 'productBaseStatusString',
        loadChildren: function(pramas) {
          return fetchData({
            url: GET_PRODUCT_ALL_LIST,
            data: { ...params, ...vm.searchParams }
          }).then(res => {
            console.log(res)
            return res.data
          })
        }
      },
      columns: [
        {
          title: '到达国家',
          field: 'nation'
        },
        {
          title: '运输方',
          field: 'logisticTransportationName'
        },
        {
          title: '运输类型',
          field: 'priceType'
        },

        {
          title: '产品单位体积重量',
          field: 'productWeight'
        },
        // {
        //   title: "产品体积",
        //   field: "productVolume"
        // },

        {
          title: '运输时间（天）',
          field: 'freightTime'
        },
        // {
        //   title: "进出口税费比率参考",
        //   field: "tariff"
        // },
        // {
        //   title: "单个运费（RMB）",
        //   field: "freightPriceSingle"
        // },
        // {
        //   title: "单个税费（RMB）",
        //   field: "taxesSingle"
        // },
        {
          title: '操作',
          field: 'edit'
        }
      ],
      tableData: [],
      options: [],
      searchData: '',
      items: [],
      pageNo: 1,
      pageSize: 10
    }
  },
  computed: {
    selected() {
      return (
        this.$refs.table &&
        this.$refs.table.getCheckedData().map(el => el.transportFirstId)
      )
    }
  },
  methods: {
    search() {
      this.$refs.table.refresh()
    },
    handleCancel() {
      this.visible = false
      this.$refs.table.refresh()
    },
    // 国家列表
    getNationList() {
      fetchData({ ...apis.LOGISTIC_COUNTRY_SEARCH_LIST, data: {} }).then(
        res => {
          if (res.data.code !== 0) {
            this.$message.error(res.data.msg)
            return
          }
          this.nationLists = res.data.rows
        }
      )
    },
    // 外面列表的运输方式
    getFreightTypeLists() {
      fetchData({ ...apis.logisticTransportTypeList, data: {} }).then(res => {
        if (res.data.code !== 0) {
          this.$message.error(res.data.msg)
          return
        }
        this.freightTypeLists = res.data.rows
      })
    },
    // 新增编辑里的运输方式
    getAddFreightTypeLists(logisticTransportationId) {
      fetchData({
        ...apis.LOGISTIC_TRANSPORT_LOGISTIC_TRANSPORTATION_TYPE_LIST,
        data: { logisticTransportationId }
      }).then(res => {
        if (res.data && res.data.code !== 0) {
          this.$message.error(res.data.msg)
        }
        if (res.data && res.data.code === 0) {
          this.addFreightTypeLists = res.data.rows || []
        }
      })
    },
    // 运输方列表
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
    addNew() {
      this.addForm = {
        priceType: 1,
        freightPriceUnit: 'USD',
        freightPriceTypeUnit: 'cm^3'
      }
      this.visible = true
      this.add = true
    },

    // 弹窗提交
    formSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.add) {
            this.addItemList()
          } else {
            this.editItemList()
          }
        }
      })
    },

    // 新增列表
    addItemList() {
      fetchData({
        ...apis.TRANSPORT_FIRST_SAVE,
        data: this.addForm
      }).then(res => {
        if (res.data.code === 0) {
          showToast('success', '新增成功')
          this.$refs.table.refresh()
          this.visible = false
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 编辑列表
    editItemList() {
      fetchData({
        ...apis.TRANSPORT_FIRST_UPDATE,
        data: { ...this.addForm, transportFirstId: this.editId }
      }).then(res => {
        if (res.data.code === 0) {
          showToast('success', '编辑成功')
          this.$refs.table.refresh()
          this.visible = false
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 编辑列表项
    editItem(props) {
      this.visible = true
      this.add = false
      this.editId = props.item.transportFirstId
      this.addForm = props.item
    },

    // 删除列表项
    delItem(props) {
      let ids,
        vm = this
      if (props) {
        ids = [props.item.transportFirstId]
      } else {
        ids = vm.$refs.table.getCheckedData().map(el => el.transportFirstId)
      }
      if (ids.length === 0) {
        showToast('warning', '请选择一项进行删除')
        return
      }
      showConfirm({
        title: '是否删除选中的头程？',
        onOk() {
          fetchData({
            ...apis.TRANSPORT_FIRST_BATCH_DELTE,
            data: { ids }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh()
            })
          })
        }
      })
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
    },
    'addForm.nationId'(val) {
      if (val) {
        this.addForm.nation = this.nationLists.find(
          el => el.countryId === val
        ).countryName
      }
    }
  }
}
</script>
<style lang="scss">
.flex {
  display: flex;
}
</style>