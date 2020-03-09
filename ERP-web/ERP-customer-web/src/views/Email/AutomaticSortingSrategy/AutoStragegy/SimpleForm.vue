<template>
  <div class="add-strategy">
    <el-form ref="ruleForms">
      <el-button icon="el-icon-plus" class="addbtn martop" @click="addRule"></el-button>
      <el-button icon="el-icon-delete" v-if="deleteFlag" class="addbtn martop" @click="deleteRule"></el-button>
      <div>
        <el-row class="mar10"></el-row>
        <el-row class="form-wrap">
          <simple-item :label="'发件人'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.senderFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input
              slot="right"
              class="mar10 normal-input"
              v-model="form.senderList"
              placeholder="( 例如：test@qq.com )支持多个，以逗号“,”分隔"
            ></el-input>
          </simple-item>
          <simple-item :label="'发件域'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.senderSuffixFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input
              slot="right"
              class="mar10 normal-input"
              v-model="form.senderSuffixList"
              placeholder="( 例如：@qq.com ) 支持多个，以逗号“,”分隔"
            ></el-input>
          </simple-item>
          <simple-item :label="'收件人'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.receiverFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input slot="right" class="mar10 normal-input" v-model="form.receiver" placeholder="( 例如：admin@qq.com )"></el-input>
          </simple-item>
          <simple-item :label="'主题'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.subjectFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input
              slot="right"
              class="mar10 normal-input"
              v-model="form.subjectList"
              placeholder="( 温馨提示：前后会进行模糊匹配，注意中间的空格，标点符号必须半角 )"
            ></el-input>
          </simple-item>
          <simple-item :label="'系统订单号'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.orderNumSystemFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input
              slot="right"
              class="mar10 normal-input"
              v-model="form.orderNumSystemList"
              placeholder="（支持多个，以逗号“,”分隔。）"
            ></el-input>
          </simple-item>
          <simple-item :label="'平台订单号'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.orderNumPlatformFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input
              slot="right"
              class="mar10 normal-input"
              v-model="form.orderNumPlatformList"
              placeholder="（支持多个，以逗号“,”分隔。）"
            ></el-input>
          </simple-item>
          <simple-item :label="'客户ID'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.customerIdFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input
              slot="right"
              class="mar10 normal-input"
              v-model="form.customerIdList"
              placeholder="（支持多个，以逗号“,”分隔。）"
            ></el-input>
          </simple-item>
          <simple-item :label="'收件时间'" :selectValue="form.checkList" @change="change">
            <div slot="right">
              <span class="mar10">从当日</span>
              <el-input class="mar10" style="width: 100px;" v-model="form.receiveTimeStart"></el-input>
              <span class="mar10">时至当日</span>
              <el-input class="mar10" style="width: 100px;" v-model="form.receiveTimeEnd" placeholder="限制1~24"></el-input>
              <span class="mar10">时</span>
            </div>
          </simple-item>
          <simple-item :label="'订购产品包含SKU'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.productSkuFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <div slot="right" class="marleft10">
              <!-- 选择SKU -->
              <add-sku :skuDate="form.productSkuList" @close="skuClose" :storeId="storeId"></add-sku>
            </div>
            <div slot="bottom" class="sign-title" style="width: 344px;">
              <span class="ellipsis-abbreviation" :title="skuList">{{ skuList }}</span>
              <el-button icon="el-icon-close" class="close" circle style="margin-top:-10px;" @click="clearSku"></el-button>
            </div>
          </simple-item>
          <simple-item :label="'订购产品包含类别'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.productCategoryFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <div slot="right" class="marleft10">
              <!-- 选择类目 -->
              <add-category :categoryData="form.productCategoryList" @close="categoryChose"></add-category>
            </div>
            <div slot="bottom" class="sign-title" style="width:57%">
              <span class="ellipsis-abbreviation" :title="categoryList">{{ categoryList }}</span>
              <el-button icon="el-icon-close" class="close" circle style="margin-top:-10px;" @click="clearCategory"></el-button>
            </div>
          </simple-item>
          <simple-item :label="'黑名单'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.blackListFlag">
              <el-option label="排除" :value="1"></el-option>
              <el-option label="不排除" :value="0"></el-option>
            </el-select>
            <div slot="right">
              <span class="pad8">黑名单</span>
            </div>
          </simple-item>
          <simple-item :label="'内容'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.contentFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-input slot="right" class="mar10 normal-input" v-model="form.content" placeholder="只支持一个关键词或语句"></el-input>
          </simple-item>
          <simple-item :label="'订单付款时间'" :selectValue="form.checkList" @change="change">
            <el-date-picker
              class="mar10"
              slot="right"
              value-format="yyyy-MM-dd hh:mm:ss"
              v-model="form.paymentTime"
              size="small"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </simple-item>
          <simple-item :label="'客服人员'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.serviceFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <el-select class="mar10" multiple collapse-tags slot="right" placeholder="多选" v-model="form.serviceList">
              <el-option v-for="item in serviceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </simple-item>
          <simple-item :label="'国家缩写'" :selectValue="form.checkList" @change="change">
            <el-select class="mar10" v-model="form.nationFlag">
              <el-option label="包含" :value="1"></el-option>
              <el-option label="不包含" :value="0"></el-option>
            </el-select>
            <div slot="right" class="marleft10">
              <!-- 选择国家 -->
              <national-table :nationalData="form.nationList" @close="nationalClose"></national-table>
              <div
                slot="bottom"
                class="sign-title"
                style="width: 370px;height: 33px;display: inline-block;top: 11px;right: 15px;position: absolute;"
              >
                <span class="ellipsis-abbreviation" :title="nationalList">{{ nationalList }}</span>
                <el-button icon="el-icon-close" class="close" circle style="margin-top:-10px;" @click="clearNational"></el-button>
              </div>
            </div>
          </simple-item>
        </el-row>
      </div>
    </el-form>
    <div>
      <yt-dialog :options="options">
        <div class="dialog-wrap">
          <el-form>
            <el-form-item>
              <el-row>
                <el-col :span="24">
                  <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                </el-col>
              </el-row>
              <el-checkbox-group v-model="form.checkList">
                <el-row>
                  <el-col :span="8">
                    <el-checkbox label="发件人"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="发件域"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="收件人"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="系统订单号"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="平台订单号"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="客户ID"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="收件时间"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="黑名单"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="订购产品包含类别">订单包含类别</el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="订购产品包含SKU">订单包含SKU</el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="主题"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="内容"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="客服人员"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="订单付款时间"></el-checkbox>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox label="国家缩写"></el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
              <el-form-item class="saveBtn" label-width="0px">
                <el-button size="small" type="primary" @click="handleSure">确认</el-button>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
      </yt-dialog>
    </div>
  </div>
</template>

<script>
import SimpleItem from './SimpleItem'
import AddSku from '../../Comment/AddSku'
import AddCategory from '../../Comment/AddCategory'
import NationalTable from '../../Comment/NationalTable'
import { mapActions, mapState } from 'vuex'

let defaultValue = [
  '发件域',
  '平台订单号',
  '黑名单',
  '订单付款时间',
  '主题',
  '客服人员',
  '订购产品包含SKU',
  '收件时间',
  '系统订单号',
  '发件人',
  '收件人',
  '客户ID',
  '订购产品包含类别',
  '内容',
  '国家缩写'
]

export default {
  props: {
    ruleform: {
      type: Object,
      default: () => {
        return {
          checkList: []
        }
      }
    },
    storeId: {
      type: Number,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      checkAll: false,
      nationalList: '',
      categoryList: '',
      skuList: '',
      nationalVisible: false,
      categoryVisible: false,
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      deleteFlag: false,
      options: {
        visible: false,
        title: '选择条件',
        width: '500px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      form: { checkList: [] },
      emailClassificationData: {}
    }
  },
  created() {
    let vm = this
    vm.emailClassificationData = {
      value: vm.form.emailClassificationId,
      label: vm.form.emailClassificationName
    }
    vm.getservice()
  },
  computed: {
    ...mapState('email', ['serviceList'])
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler(val) {
        let _data = JSON.parse(JSON.stringify(val))
        this.$emit('dataChange', _data)
      }
    },
    ruleform: {
      deep: true,
      immediate: true,
      handler(val) {
        let vm = this
        val = JSON.parse(JSON.stringify(val))
        vm.form = Object.assign(
          {},
          {
            checkList: []
          },
          val
        )
        if (vm.form.productCategoryList && vm.form.productCategoryList.length) {
          vm.categoryList = vm.form.productCategoryList
            .map(item => item.label)
            .join()
        }
        if (vm.form.productSkuList && vm.form.productSkuList.length) {
          vm.skuList = vm.form.productSkuList.map(item => item.label).join()
        }
        if (vm.form.nationList && vm.form.nationList.length) {
          vm.nationalList = vm.form.nationList.map(item => item.label).join()
        }
        vm.deleteFlag = vm.form.checkList.length ? true : false
      }
    }
  },
  methods: {
    ...mapActions('email', ['getservice']),
    getForm() {
      let vm = this
      let form = JSON.parse(JSON.stringify(vm.form))
      let checkList = form.checkList
      let arr = [...defaultValue]
      arr.map(item => {
        if (checkList.indexOf(item) < 0) {
          vm.selected(item, form)
        }
      })
      console.log(form)

      return form
    },
    handleCheckAllChange(val) {
      this.form.checkList = val ? defaultValue : []
    },
    handleSure() {
      this.options.visible = false
    },
    addRule() {
      this.deleteFlag = true
      this.options.visible = true
    },
    deleteRule() {
      this.form = { checkList: [] }
      this.nationalList = ''
      this.skuList = ''
      this.categoryList = ''
      this.deleteFlag = false
      this.$emit('ruleClose')
    },
    change(val) {
      // this.selected(val, this.form)
      let index = this.form.checkList.indexOf(val)
      this.form.checkList.splice(index, 1)
      if (!this.form.checkList.length) {
        this.deleteFlag = false
        this.$emit('ruleClose')
      }
    },
    skuClose(val) {
      let vm = this
      if (val) {
        vm.$set(vm.form, 'productSkuList', vm.$.deepClone(val))
        vm.skuList = val
          .map(item => {
            return item.label
          })
          .join(',')
      }
    },
    categoryChose(val) {
      let vm = this
      if (val) {
        this.$set(this.form, 'productCategoryList', vm.$.deepClone(val))
        this.categoryList = val
          .map(item => {
            return item.label
          })
          .join(',')
      }
    },
    nationalClose(val) {
      let vm = this
      if (val) {
        vm.$set(vm.form, 'nationList', vm.$.deepClone(val))
        vm.nationalList = val
          .map(item => {
            return item.label
          })
          .join(',')
      }
      vm.nationalVisible = false
    },
    clearSku() {
      this.skuList = ''
      this.form.productSkuList = null
    },
    clearCategory() {
      this.categoryList = ''
      this.form.productCategoryList = null
    },
    clearNational() {
      this.nationalList = ''
      this.form.nationList = null
    },
    selected(val, form) {
      val = JSON.parse(JSON.stringify(val))
      switch (val) {
        case '发件人':
          delete form.senderFlag
          delete form.senderList
          break
        case '发件域':
          delete form.senderSuffixFlag
          delete form.senderSuffixList
          break
        case '收件人':
          delete form.receiverFlag
          delete form.receiver
          break
        case '主题':
          delete form.subjectFlag
          delete form.subjectList
          break
        case '系统订单号':
          delete form.orderNumSystemFlag
          delete form.orderNumSystemList
          break
        case '平台订单号':
          delete form.orderNumPlatformFlag
          delete form.orderNumPlatformList
          break
        case '客户ID':
          delete form.customerIdFlag
          delete this.form.customerIdList
          break
        case '收件时间':
          delete this.form.receiveTimeStart
          delete form.receiveTimeEnd
          break
        case '黑名单':
          delete form.blackListFlag
          break
        case '订购产品包含类别':
          delete form.productCategoryFlag
          delete form.productCategoryList
          break
        case '订购产品包含SKU':
          delete form.productSkuFlag
          delete form.productSkuList
          break
        case '内容':
          delete form.contentFlag
          delete form.content
          break
        case '客服人员':
          delete form.serviceFlag
          delete form.serviceList
          break
        case '订单付款时间':
          delete form.paymentTime
          delete form.paymentTimeStart
          delete form.paymentTimeEnd
          break
        case '国家缩写':
          delete form.nationFlag
          delete form.nationList
          break
      }
    }
  },
  components: {
    SimpleItem,
    AddSku,
    AddCategory,
    NationalTable
  }
}
</script>

<style lang="scss">
.add-strategy {
  .rule-top {
    td {
      padding: 0 !important;
    }
  }
  .form-wrap {
    border-top: 1px solid #ebeef5;
  }
  .tree-btns {
    position: absolute;
    z-index: 2;
  }
  .tree-input {
    width: 20px;
    opacity: 0;
  }
  .must-height {
    height: 48px;
    margin-top: 10px;
    padding: 0;
  }
  .dialog-wrap {
    width: 100%;
    border-top: 1px solid #bbbbbb;
    padding-top: 20px;
  }
  .table2 {
    height: 40px;
    line-height: 40px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    padding-left: 10px;
    .el-table .cell {
      padding-left: 0;
    }
  }
  .sign-title {
    line-height: 33px;
    border: 1px solid #a3edff;
    border-radius: 4px;
    width: 53%;
    display: inline-block;
    position: absolute;
    top: 11px;
    right: 15px;
    & > span {
      display: block;
      height: 33px;
    }
    .close {
      border: none;
      padding: 5px;
      position: absolute;
      right: 0px;
      top: 10px;
      i {
        font-size: 18px;
      }
    }
  }
  .addbtn {
    padding: 6px;
    i {
      font-size: 22px;
    }
  }

  .must-fill-sign-div {
    @include must-fill-sign;
  }
  .cell.must-fill-sign {
    @include must-fill-sign;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__content {
    line-height: 33px;
  }
  .channel-input {
    .el-input {
      width: 160px;
    }
  }
  .filtrate-input {
    padding-left: 18px;
    .el-input {
      width: 130px;
    }
  }
  .warp-input {
    .el-input {
      width: 250px;
    }
  }
  .search-wrap-right {
    padding-left: 18px;
  }

  .table-top14s {
    margin: 30px 0 20px 0;
  }
  .filtrate-input-time {
    padding-left: 0 !important;
    input {
      width: 120px;
    }
  }

  .condition-table {
    .input-width {
      .el-input {
        width: 426px;
      }
    }
  }
  .rule-name {
    width: 566px;
  }
  .isChecked {
    margin-top: 14px;
    padding-left: 0px;
  }
  .must-table {
    .el-table th,
    .el-table td {
      padding: 6px 0 !important;
    }
  }
}
</style>
