<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" :row-class-name="tableRowClassName"  v-loading="loading" element-loading-text="拼命加载中">
    <el-table-column type="selection" width="55" align='center'></el-table-column>
    <el-table-column type="index"  label="排序" width="50" align="center"></el-table-column>
    <!--  -->
    <el-table-column v-if="columns.length===0" width="150" align="center">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>


    <!--  -->
    <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width" :align="column.value=='nameCn'?'':'center'">
          <template slot-scope="scope">
            <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>

            <el-tooltip content="查看下級" placement="left" >
               <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">

                 <i v-if="!scope.row._expanded" class="el-icon-plus"></i>

                 <i v-else class="el-icon-minus"></i>
               </span>
            </el-tooltip>


            <span v-if="column.value=='lockFlag'">{{scope.row[column.value]?'锁定不显示':'正常显示'}}</span>


            <span v-else>{{scope.row[column.value]}}</span>

            <span  v-if="column.value=='nameCn'" class="add" @click="addCategoryNext(scope.row)">
               <i class="el-icon-circle-plus-outline"></i> 新增下級
            </span>
          </template>
    </el-table-column>




    <slot></slot>
  </el-table>
</template>

<script>

import treeToArray from './eval'
export default {
  name: 'treeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    loading:{
        type:Boolean,
        default:true
    },
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
      //
      addCategoryNext(item){
        if(item.parentId == 1 ){
            this.$emit('addCategoryNext',[item.categoryId])
        }else{
            let idlist = []
            //说明不是顶级目录
            if(item.parent !=null){
                let arr = []
                function queryParentId(parent){
                    for(let key in parent){
                       if(parent.parent!=null && key=="parentId"){
                           arr.unshift(parent[key])
                           queryParentId(parent.parent)
                       }
                    }
                }
                arr.unshift(item.parentId,item.categoryId)
                queryParentId(item.parent)
                idlist = arr
            //顶级目录
            }else{
                idlist = [item.parentId,item.categoryId]
            }
            this.$emit('addCategoryNext',idlist)
        }
      },

    //表格隔行变色
    tableRowClassName({row,rowIndex}) {
        // if (rowIndex % 2 == 1) {
        //     return 'warning-row';
        // }
        // else {
        //    return 'success-row';
        // }
        return '';
    },
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.childs && record.childs.length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" >
    .add{
        margin-left:10px;
        color:#ccc;
        cursor: pointer;
        &:hover{
            color:red;
        }
    }
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }
  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
  .el-table .warning-row {
      background: oldlace;
  }
  .el-table .success-row {
      background: #f0f9eb;
  }
</style>
