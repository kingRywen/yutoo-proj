<template lang="html">
    <div class="">
        <el-popover placement="bottom" width="250" trigger="click"> 
            <el-checkbox-group v-model="checked" class="list">                
                <el-row> 
                    <el-col :span="12" v-for="(item,index) in data" :key="index">
                        <el-checkbox :label="item" :value="item">{{item}}</el-checkbox>
                    </el-col>   
                </el-row>    
            </el-checkbox-group>
            <el-button slot="reference" size="small" icon="el-icon-menu">
                <slot></slot>
            </el-button>
        </el-popover>
    </div>
</template>

<script>
export default {
  name: 'LabelDefined',
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    selected: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  computed: {
    checked: {
      get() {
        return this.selected
      },
      set(val) {
        this.$emit('update:selected', [...val])
      }
    }
  }

  // methods: {
  //   handleChange(val) {
  //     this.$emit('update', val)
  //   }
  // },

  // computed: {
  //   _checkList: {
  //     get() {
  //       return this.data
  //     },
  //     set(val) {
  //       debugger
  //       this.$emit('update', val)
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  .el-checkbox {
    margin: 0 10px 15px 0 !important;
    flex: 1;
  }
}
</style>
