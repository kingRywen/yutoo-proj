<template>
  <div class="w1100 no-asterisk">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <widget-card-wrapper class="mb20" title="库存策略">
      <label class="lb">
        采购对象
        <el-tooltip content="采购对象分为：平台采购和非平台采购" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </label>
      <el-radio class="mt10 mb20" size="mini" v-model="purchaseObject" :label="0">
        系统默认
        <el-tooltip placement="top">
          <div slot="content">
            系统默认，按照如下优先顺序
            <br />1、非平台采购--如果跟卖上架时填写了成本价，并且该ASIN有库存，优先取填写值作为成本价；
            <br />2、平台采购--
            <br />2.1优先目标站点，其次源站点；
            <br />2.2有FBA就优先取FBA最低价作为成本，如果没有FBA，就取FBM最低价作为成本价；
            <br />3、当库存没有后，就暂停跟卖。
            <br />补充：价格都是不含运费的。
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-radio>
      <el-radio class="mt10" size="mini" v-model="purchaseObject" :label="1">
        指定卖家
        <el-tooltip placement="top">
          <div slot="content">
            1、以产品跟卖上架时指定的某个卖家及其发货方式的售价作为成本（多条取最低售价）。
            <br />2、当指定卖家不再跟卖时，优先取目标站点所有跟卖的FBA的最低售价，再取FBM最低售价；如果没有，然后才是源站点的所有跟卖的FBA最低售价、如果还没有FBA就再取FBM最低售价。
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-radio>
      <new-form
        ref="form0"
        inline
        label-width="120px"
        :form-schema="formSchema0"
        :value="value0"
        style="overflow: auto;"
      ></new-form>
    </widget-card-wrapper>
    <widget-card-wrapper class="mb20" title="价格策略">
      <!-- <el-divider style="margin-top: 40px" content-position="left">价格策略</el-divider> -->
      <label class="lb">定价方式</label>
      <el-radio class="mt10 mb20" size="mini" v-model="pricing" :label="0">
        按成本价
        <el-tooltip placement="top">
          <div slot="content">
            成本价是按成本价公式计算之后的价格，
            <br />1、分为非平台采购的成本价、平台采购的成本价；
            <br />2、前者可以在可跟卖库中统一维护，跟卖时也可填写/修改；
            <br />3、后者是从平台抓取的。
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-radio>
      <el-radio class="mt10" size="mini" v-model="pricing" @change="value1.defaultProfitRate = undefined" :label="1">
        固定售价
        <el-tooltip placement="top">
          <div slot="content">以固定售价跟卖，产品跟卖上架时，必须填写。</div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-radio>
      <new-form
        v-show="pricing === 0"
        ref="form1"
        inline
        label-width="120px"
        :form-schema="formSchema1"
        :value="value1"
        style="overflow: auto;"
      ></new-form>
      <new-form
        v-show="pricing !== 0"
        ref="form2"
        inline
        label-width="120px"
        :form-schema="formSchema11"
        :value="value11"
        style="overflow: auto;"
      ></new-form>
    </widget-card-wrapper>
    <widget-card-wrapper title="价格范围策略">
      <!-- <el-divider style="margin-top: 40px" content-position="left">价格范围策略</el-divider> -->
      <new-form
        class="mt20"
        ref="form3"
        inline
        label-width="120px"
        :form-schema="formSchemaMinRange"
        :value="valueMinRange"
      ></new-form>
      <new-form ref="form4" inline label-width="120px" :form-schema="formSchemaMaxRange" :value="valueMaxRange"></new-form>
    </widget-card-wrapper>
  </div>
</template>
<script>
import { validLegal } from 'Views/modules/proPick/deepCateAnalyze/dialogs/propAdd.js'
export default {
  props: ['strategyId'],
  data() {
    return {
      pricing: 0,
      purchaseObject: 0,
      formSchema: {
        ddd: {
          widget: 'txt',
          text: '策略名称',
          style: {
            fontSize: '16px',
            textAlign: 'right'
          },
          span: 2
        },
        strategyName: {
          // label: '策略名称',
          required: true,
          span: 10
        },
        defaultFlag: {
          widget: 'checkbox',
          span: 12,
          options: [{ label: '设为默认', value: 1 }]
        }
      },
      value: {},
      value0: {},
      formSchema0: {
        d: {
          defaultVal: '成本价',
          style: {
            fontSize: '16px',
            textAlign: 'right'
          },
          width: '10px',
          widget: 'text'
        },
        d1: {
          tip: {
            content: '用于计算销售价格、最低售价、最高售价'
          },
          widget: 'txt',
          labelWidth: '10px',
          label: ' '
        },
        d2: {
          widget: 'equal'
        },
        d3: {
          defaultVal: '公式',
          widget: 'text',

          style: {
            fontSize: '14px',
            margin: '0 12px 0 10px',
            padding: '0 8px',
            border: '1px solid #333'
          }
        },
        costExpression: {
          required: {
            value: (rule, value, cb) => {
              // eslint-disable-next-line no-useless-escape
              if (/[^(MN\+\-\.\*\/0-9)]/.test(value)) {
                cb(new Error('公式只能包含M、N、数字、运算符'))
              }
              if (!validLegal(value, ['M', 'N'], true)) {
                cb(new Error('公式不合法'))
              }
              cb()
            }
          },
          placeholder: '成本价计算公式，如：(N*1.5)+3+M',
          width: '300px'
        },
        d4: {
          widget: 'txt',
          labelWidth: '10px',
          tip: {
            content:
              'M=运费;N=采购价（平台采购就是就是平台销售价格，不含运费，非平台采购就是成本价）'
          },
          label: ' '
        }
      },
      value11: {},
      formSchema11: {
        d: {
          defaultVal: '销售价格',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d1: {
          widget: 'equal'
        },
        d2: {
          defaultVal: '跟卖上架时，逐个产品填写价格',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        }
      },
      formSchema1: {
        d: {
          text: '销售价格',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d1: {
          widget: 'equal'
        },
        d2: {
          text: '成本价  /  (1',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d3: {
          widget: 'equal',
          text: '-'
        },
        d4: {
          text: '默认利润率',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        defaultProfitRate: {
          // required: true,
          required: {
            value: (rule, value, cb) => {
              if (!value) {
                cb(new Error('不能为空'))
              }
              if (value < this.valueMinRange.minProfitRate) {
                cb(new Error('不能低于保底利润率'))
              }
              if (value > this.valueMaxRange.maxProfitRate) {
                cb(new Error('不能高于最高利润率'))
              }
              cb()
            }
          },
          min: 1,
          precision: 0,
          max: 99,
          controls: false,
          widget: 'number',
          width: 60
        },
        d5: {
          text: '% )',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        }
      },
      value1: {},

      rangeMinCalculation: 0,
      formSchemaMinRange: {
        d: {
          text: '最低售价',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d1: {
          widget: 'equal'
        },
        d2: {
          text: '成本价  /  (1',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d3: {
          widget: 'equal',
          text: '-'
        },
        d4: {
          text: '保底利润率',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        // 保底 valueMinRange.minProfitRate <= 默认 value1.defaultProfitRate <= 最高 valueMaxRange.maxProfitRate
        minProfitRate: {
          required: {
            value: (rule, value, cb) => {
              if (!value) {
                cb(new Error('不能为空'))
              }
              if (
                value >
                Math.min(
                  this.value1.defaultProfitRate || this.valueMaxRange.maxProfitRate,
                  this.valueMaxRange.maxProfitRate
                )
              ) {
                cb(new Error('不能高于默认利润率或最高利润率'))
              }
              cb()
            }
          },
          min: 1,
          precision: 0,
          max: 99,
          controls: false,
          widget: 'number',
          width: 60
        },
        d5: {
          text: '% )',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        }
      },
      valueMinRange: {},
      formSchemaMaxRange: {
        d: {
          text: '最高售价',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d1: {
          widget: 'equal'
        },
        d2: {
          text: '成本价  /  (1',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d3: {
          widget: 'equal',
          text: '-'
        },
        d4: {
          text: '最高利润率',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        maxProfitRate: {
          // required: true,
          required: {
            value: (rule, value, cb) => {
              if (!value) {
                cb(new Error('不能为空'))
              }
              if (
                value <
                Math.min(
                  this.value1.defaultProfitRate || this.valueMinRange.minProfitRate,
                  this.valueMinRange.minProfitRate
                )
              ) {
                cb(new Error('不能低于默认利润率或保底利润率'))
              }
              cb()
            }
          },
          min: 1,
          precision: 0,
          max: 99,
          controls: false,
          widget: 'number',
          width: 60
        },
        d5: {
          text: '% )',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        }
      },
      valueMaxRange: {}
    }
  },
  created() {
    if (this.strategyId) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      let params = {
        ...this.storeInfo,
        siteId: this.$store.state.selling.curSiteId,
        strategyId: this.strategyId
      }
      this.$api[`ss/sellingStrategyInfoByPrice`](params).then(data => {
        const {
          strategyName,
          defaultFlag,
          purchaseObject,
          costExpression,
          pricing,
          defaultProfitRate,
          minProfitRate,
          maxProfitRate
        } = data.data
        this.value = {
          ...this.value,
          strategyName,
          defaultFlag: defaultFlag ? [1] : []
        }
        this.purchaseObject = purchaseObject || 0
        this.pricing = pricing || 0
        this.value0 = {
          ...this.value0,
          costExpression
        }
        this.value1 = {
          ...this.value1,
          defaultProfitRate: defaultProfitRate * 100
        }
        this.valueMinRange = {
          ...this.valueMinRange,
          minProfitRate: minProfitRate * 100
        }
        this.valueMaxRange = {
          ...this.valueMaxRange,
          maxProfitRate: maxProfitRate * 100
        }
      })
    },
    validate() {
      let forms = [
        'form',
        'form0',
        'form3',
        'form4',
        this.pricing == 0 ? 'form1' : 'form2'
      ]

      return Promise.all(forms.map(f => this.$refs[f].validate()))
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.storeInfo,
          siteId: this.$store.state.selling.curSiteId,
          strategyName: this.value.strategyName,
          defaultFlag: !!this.value.defaultFlag[0],
          purchaseObject: this.purchaseObject,
          costExpression: this.value0.costExpression,
          pricing: this.pricing,
          defaultProfitRate: this.value1.defaultProfitRate / 100,
          minProfitRate: this.valueMinRange.minProfitRate / 100,
          maxProfitRate: this.valueMaxRange.maxProfitRate / 100,
          strategyId: this.strategyId
        }
        return this.$api[
          `ss/${
            this.strategyId
              ? 'sellingStrategyUpdateByPrice'
              : 'sellingStrategySaveByPrice'
          }`
        ](params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.lb {
  font-size: 16px;
  margin-right: 20px;
}
.no-asterisk {
  /deep/ .el-form-item__error {
    white-space: nowrap;
  }
}
</style>