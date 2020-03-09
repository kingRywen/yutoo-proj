<template lang="html">
    <div class="">
        <el-popover placement="bottom" width="250" trigger="click"> 
            <el-checkbox-group v-model="_checkList" class="list">                
                <el-row> 
                    <el-col :span="12" v-for="(item,index) in data" :key="index">
                        <el-checkbox :label="item.label"   :value="item.label">{{item.label}}</el-checkbox>
                    </el-col>   
                </el-row>    
            </el-checkbox-group>
            <el-button slot="reference" size="small" icon="el-icon-menu">
                <slot></slot>
            </el-button>
        </el-popover>
    </div>
</template>

<!--
    data为必传 =>数组
    defaultData为选中的 =>数组
    selectCheck 传入的函数.用于子组件数据改变时触发父亲方法更新数据
 -->

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    defaultData: {
      type: Array,
      default: () => []
    },
    selectCheck: Function
  },

  computed: {
    _checkList: {
      get() {
        return this.defaultData
          .filter(el => !el.defaultHidden)
          .map(i => i.label)
      },
      set(val) {
        this.selectCheck(val)
      }
    }
  }
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
