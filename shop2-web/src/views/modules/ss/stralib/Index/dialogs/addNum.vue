<template>
  <div class="w1100 no-asterisk">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <widget-card-wrapper tip="目标站点（跟卖站点）的跟卖数量，根据排除自己店铺和“排除店铺”。" class="mb20" title="跟卖数量策略">
      <new-form class="mt20" ref="form1" label-width="120px" :form-schema="formSchema1" :value="value1"></new-form>
      <el-form ref="form2" size="small" class="new-form" :model="value1">
        <template v-for="(item, index) in value1.multiArray">
          <div class="flex">
            <el-form-item label="目标总跟卖数量" label-width="100px">
              <ElInputNumber v-if="index !== value1.multiArray.length - 1" :disabled="true" controls-position="right" :min="0" v-model="item.minCnt" placeholder="从"></ElInputNumber>
              <div v-else>-</div>
            </el-form-item>
            <el-form-item class="ml10 mr10">~</el-form-item>
            <el-form-item class="inpt-wrapper" :prop="`multiArray.${index}.maxCnt`" :rules="notEmpty">
              <ElInputNumber v-if="index !== value1.multiArray.length - 1" controls-position="right" :min="0" v-model="item.maxCnt" @change="handleRChange" placeholder="到"></ElInputNumber>
              <div v-else>item.maxCnt</div>
            </el-form-item>
            <el-form-item class="ml10 mr10">
              <span class="_forminput-equal">=</span>
            </el-form-item>
            <el-form-item :prop="`multiArray.${index}.sellingCnt`" :rules="notEmpty">
              <ElInputNumber v-if="index !== value1.multiArray.length - 1" controls-position="right" :min="1" v-model="item.sellingCnt" placeholder="跟卖数量"></ElInputNumber>
              <div v-else>item.sellingCnt</div>
            </el-form-item>
            <el-form-item label-width="0" class="multi-array-item first">
              <el-button type="default" icon="el-icon-plus" @click="handleAdd(item, index)"></el-button>
            </el-form-item>
            <el-form-item label-width="0" class="multi-array-item" v-if="value1 && value1.length > 1">
              <el-button type="default" icon="el-icon-minus"></el-button>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </widget-card-wrapper>
  </div>
</template>
<script>
export default {
  props: ['strategyId'],
  data() {
    return {
      notEmpty: [
        {
          required: true,
          message: '不能为空'
        }
      ],
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
      formSchema1: {
        multiArray: {
          type: 'multiArray',
          lastNotReq: ['maxCnt'],
          leftUnEdit: ['minCnt', 'maxCnt'],
          children: {
            minCnt: {
              label: '目标总跟卖数量',
              labelWidth: '102px',
              disabled: true,
              width: '120px',
              widget: 'number',
              change: schema => {
                this.formSchema1.multiArray.children.maxCnt.min =
                  schema.value.minCnt
                if (schema.value.minCnt > schema.value.maxCnt) {
                  this.$set(schema.value, 'maxCnt', undefined)
                }
              },
              required: true,
              placeholder: '从'
            },
            maxCnt: {
              label: '~',
              labelWidth: '30px',
              width: '120px',
              min: 0,
              change: schema => {
                setTimeout(() => {
                  if (schema.value.minCnt > schema.value.maxCnt) {
                    this.$set(schema.value, 'maxCnt', schema.value.minCnt + 1)
                  }
                })
              },
              required: true,
              widget: 'number',
              placeholder: '到'
            },
            c: {
              widget: 'equal'
            },
            sellingCnt: {
              width: '120px',
              required: true,
              widget: 'number',
              max: 30,
              placeholder: '跟卖数量'
            }
          }
        }
      },
      value1: {
        multiArray: [{ minCnt: 0 }]
      }
    }
  },
  created() {
    if (this.strategyId) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      const params = {
        ...this.storeInfo,
        siteId: this.$store.state.selling.curSiteId,
        strategyId: this.strategyId
      }
      this.$api[`ss/sellingStrategyInfoByCnt`](params).then(data => {
        const { strategyName, defaultFlag, detail } = data.data
        this.value = {
          ...this.value,
          strategyName,
          defaultFlag: defaultFlag ? [1] : []
        }
        this.value1 = {
          ...this.value1,
          multiArray: detail
        }
      })
    },
    validate() {
      return Promise.all(['form', 'form1'].map(e => this.$refs[e].validate()))
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.storeInfo,
          siteId: this.$store.state.selling.curSiteId,
          strategyId: this.strategyId,
          strategyName: this.value.strategyName,
          defaultFlag: !!this.value.defaultFlag[0],
          detail: this.value1.multiArray.map((el, index) => ({
            ...el,
            sort: index,
            maxCnt:
              index === this.value1.multiArray.length - 1
                ? undefined
                : el.maxCnt
          }))
        }
        return this.$api[
          `ss/${
            this.strategyId
              ? 'sellingStrategyUpdateByCnt'
              : 'sellingStrategySaveByCnt'
          }`
        ](params)
      })
    },
    validateForm(fields, cb) {
      this.$refs.form2.validateField(fields, cb)
    },
    handleAdd(item, index) {
      let fields = ['minCnt', 'maxCnt'],
        added = false,
        errorMsg
      this.validateForm(fields, msg => {
        if (msg !== '') {
          errorMsg = msg
        }
      })

      if (!errorMsg && !added) {
        added = true
        let ret = {}
        if (item.maxCnt == null || item.maxCnt === '') {
          let el = [].find.call(
            document.querySelectorAll(`.inpt-wrapper input.el-input__inner`),
            e => {
              return e.value === ''
            }
          )
          el && el.focus()
          return this.$message.warning('请填写数据')
        }
        ret = {
          minCnt: item.maxCnt + 1
        }

        this.value1.multiArray.splice(index + 1, 0, ret)
      }
    },
    handleRChange() {

    }
  }
}
</script>