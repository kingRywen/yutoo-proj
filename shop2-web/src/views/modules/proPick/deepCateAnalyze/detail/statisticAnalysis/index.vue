<template>
  <div>
    <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="产品统计" name="first" lazy>
        <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
        <product v-if="re1" :startTime="value.date[0]" :endTime="value.date[1]" />
      </el-tab-pane>
      <el-tab-pane label="属性统计" name="second" lazy>
        <div class="flex">
          <new-form
            ref="form"
            label-width="120px"
            style="width: 230px"
            class="mr10"
            :form-schema="formSchema"
            :value="value"
          ></new-form>
          <new-form ref="form" label-width="120px" :form-schema="formSchema1" :value="value1"></new-form>
        </div>
        <prop v-if="re2" :startTime="value.date[0]" :endTime="value.date[1]" :rank="value1.rank" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {
    product: () => import('./product'),
    prop: () => import('./prop')
  },
  data() {
    const { today, computedDay } = this.cfuns.getDay(365)
    return {
      isChange: false,
      activeName: 'first',
      re1: true,
      re2: true,
      formSchema: {
        date: {
          clearable: false,
          widget: 'daterange'
        }
      },
      value1: {},
      formSchema1: {
        rank: {
          span: 4,
          widget: 'select',
          placeholder: '选择占比',
          options: [
            {
              label: '占比第一',
              value: 1
            },
            {
              label: '占比前二',
              value: 2
            }
          ]
        }
      },
      value: {
        date: [computedDay, today]
      }
    }
  },
  watch: {
    'value.date'() {
      this.isChange = true
      this.refresh()
    }
  },
  methods: {
    handleTabClick() {
      if (this.isChange) {
        this.$nextTick(() => {
          this.refresh()
          this.isChange = false
        })
      }
    },
    refresh() {
      let str = this.activeName == 'first' ? 're1' : 're2'
      this[str] = false
      this.$nextTick(() => {
        this[str] = true
      })
    }
  }
}
</script>