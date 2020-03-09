<template>
  <v-spin :tip="`加载中...`" :spinning="loadingTb">
    <v-form :model="formObj" :showMessage="false" class="plat-variant-table" ref="form">
      <v-data-table
        class="customTablePurchase"
        :currentData.sync="tableData"
        ref="table"
        :data="loadData"
        border
        :columns="columns"
        style="height:auto;margin:20px"
      >
        <template slot="td" slot-scope="props">
          <v-form-item
            v-if="props.column.props.editFlag && formObj"
            class="custom"
            style="width:100%"
            :rules="props.index !== 0 ? [{required: true, message: '请输入'}] : null"
            :prop="props.index !== 0 ? `${props.index}.${props.column.field}` : null"
          >
            <v-select
              :disabled="disabled"
              @focus="handleFocus(props, $event)"
              size="lg"
              v-if="props.column.props.controlType === 2"
              style="width:100%"
              clue="salePfPropItemId"
              label="itemValue"
              :value="+props.content"
              :data="props.column.props.propItem"
              @change="handleChange(props, $event)"
            ></v-select>
            <v-input
              :disabled="disabled"
              v-if="props.column.props.controlType === 1"
              :value="props.content"
              @input="handleChange(props, $event)"
              @focus="handleFocus(props, $event)"
            ></v-input>
          </v-form-item>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
    </v-form>
  </v-spin>
</template>

<script>
export default {
  props: {
    values: {
      required: true,
      type: Array,
      default: []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log(this.values)
    let vm = this
    vm.columns = vm.values
      .slice()
      .pop()
      .map(el => ({
        title:
          el.propertyHead != null && el.propertyHead.trim() !== ''
            ? el.propertyHead
            : el.propertyName,
        field: el.propertyName,
        props: el,
        width: (100 / (vm.values[0].length + 1)).toFixed(2) + '%'
      }))
    vm.values.forEach((element, index) => {
      let list = {
        props: element
      }
      vm.lists1.push(list)

      element.forEach(el => {
        let val = el
        list[val.propertyName] = val.value
        if (val.controlType === 2) {
          list.propItem = val.propItem
        }
      })
    })
  },
  data() {
    let vm = this
    return {
      currentIndex: 0,
      loadingTb: false,
      tableData: [],
      lists1: [],
      columns: [],
      loadData(pramas) {
        return Promise.resolve().then(() => {
          return {
            result: vm.lists1
          }
        })
      }
    }
  },
  computed: {
    formObj() {
      let ret = {}
      this.tableData.forEach((el, index) => {
        ret[index] = JSON.parse(JSON.stringify(el))
      })
      return ret
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler(val) {
        this.$emit('set', val)
      }
    }
  },
  methods: {
    handleFocus(props, e) {
      if (props.index !== 0) {
        return
      }
      // this.tableData.forEach(el => {
      //   if (!e) {
      //     this.$set(el, '_edit', false)
      //   } else if (el[props.column.field] === e.target.value) {
      //     this.$set(el, '_edit', false)
      //   } else {
      //     this.$set(el, '_edit', true)
      //   }
      // })
    },
    handleChange(props, val) {
      console.log(props, val, props.item)
      let { index, cindex } = props
      let _val = JSON.parse(JSON.stringify(this.tableData[props.index]))
      _val[props.column.field] = val
      this.$set(this.tableData, props.index, _val)

      this.tableData.forEach((el, index) => {
        if (!el.props[0].variantProperties) {
          return false
        }
        // let _props = props.item.props
        // let { value, propItem } = _props
        // let _v = propItem.find(el => el.itemValue)

        if (
          el.props[0].variantProperties[props.column.field] ===
          props.item.props[0].variantProperties[props.column.field]
        ) {
          this.$set(el, props.column.field, val)
        }
      })
    }
  }
}
</script>

<style>
.custom > div {
  width: 100%;
}
</style>
<style lang="scss">
.customTablePurchase {
  .ant-table-tbody {
    .ant-table-row:first-child {
      display: none;
    }
  }
}
</style>
