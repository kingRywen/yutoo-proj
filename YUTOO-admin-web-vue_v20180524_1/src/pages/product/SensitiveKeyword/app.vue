<template>
  <div class="Sensitivekeyword">
    <div class="select">
      <div class=" select_item">
        <span class="text">关键字:</span>
        <el-input placeholder="请输入内容" v-model="selectInfo.keword"/>
      </div>
      <div class="select_item">
        <span class="text">添加时间:</span>
        <el-date-picker v-model="selectInfo.beforeTime" type="datetime" placeholder="选择开始时间"/>~
        <el-date-picker v-model="selectInfo.afterTime" type="datetime" placeholder="选择结束时间"/>
      </div>
      <div class="select_item">
        <el-select v-model="selectInfo.sort" clearable placeholder="类别选择">
            <el-option v-for="item in sortList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="select_item">
          <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="operation_btn">
        <el-button type="primary" @click="pushKeyword=true">添加</el-button>
        <el-button type="primary" @click="deletePortion">删除</el-button>
    </div>

    <div class="keyword_list">
      <el-table ref="multipleTable" :data="keywordLists" tooltip-effect="dark" style="width: 100%" @selection-change="checkboxArr">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="关键词" >
              <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name" label="备注" width="160"></el-table-column>
          <el-table-column prop="address" label="类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="添加人" width="100" ></el-table-column>
          <el-table-column prop="address" label="添加时间"show-overflow-tooltip></el-table-column>

          <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteRow(scope.$index, keywordLists)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
    </div>
    <div class="paginationBox">
      <el-pagination :current-page="currentPage" :page-sizes="[10, 8,5]"
        :page-size="10"
        :total="25"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 添加关键字 -->
    <el-dialog title="添加" :visible.sync="pushKeyword">
      <ul class="dialog-content">
          <li>
              <p>关键字:</p>
              <div>
                <el-input type="textarea" :rows="3" v-model="selectInfo.keword"/>
              </div>
          </li>
          <li>
              <p>备注:</p>
              <div>
                <el-input type="textarea" :rows="3" v-model="remark"/>
              </div>
          </li>
          <li>
              <p>类别:</p>
              <el-select v-model="selectInfo.sort" clearable placeholder="类别选择">
                  <el-option v-for="item in sortList" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
          </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushKeywordBtn">保存</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  export default {
      data() {
        return {
          currentPage: 1,
          checkedArr:[],
          pushKeyword:false,
          keywordLists: [{
              id:'10',
              date: '中国',
              name: '王小虎',
              address: '正常'
          }],
          selectInfo:{ //搜索信息
            keword:'',
            beforeTime:'',
            afterTime:'',
            sort:''
          },
          remark:'',  //备注
          sortList:[],//类别
        }
      },
      methods: {
        //添加
        pushKeywordBtn() {


          this.$message({
            message: '添加成功',
            type: 'success'
          });
         // this.$message.error('添加失败');
          this.pushKeyword = false;
        },
        //单个删除
        deleteRow(index,arr) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '确定删除吗？', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
             center: true
           }).then(() => {
             this.$message({
               type: 'success',
               message: '删除成功!'
             });
             arr.splice(index,1)
           }).catch(() => {
             this.$message({
               type: 'info',
               message: '已取消删除'
             });
           });
       },

         handleClick(row) {
           console.log(row)
         },
         handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        //搜索
        select() {
            console.log(selectInfo)
        },
        //勾选
        checkboxArr(val) {
          this.checkedArr = val;
        },
        //批量删除
        deletePortion() {
            if(this.checkedArr.length){
              this.checkedArr.forEach((item)=>{
                 this.keywordLists.forEach((entity, index)=>{
                   if(item.id == entity.id) {
                     this.keywordLists.splice(index, 1);
                   }
                 })
              })
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: '请选择你要删除的',
                type: 'warning'
              });
            }
        },


     }
  }
</script>

<style lang="scss">
  @import '../../../assets/style/style-scss/layout.scss';
  body{
    // background: green;
    padding: 10px;
  }
  .select{
    @include flex(row);
    width:100%;
    background: #fff;
    .text{
      margin-right: 10px;
    }
    .select_item{
      margin-right: 20px;
      &:first-child{
          display: flex;
          flex-direction: row;
          span{
            display: block;
            height: 40px;
            line-height: 40px;
            width: 100px;
            text-align: right;
          }
      }
    }
  }
  .operation_btn{
    margin-top: 10px;
    background: #fff;
  }
  .keyword_list{
    margin-top: 15px;
    .cell{
      text-align: center;
    }
    .el-table th{
      background: #cce3f8;
    }
  }
  .paginationBox{
    position: fixed;
    right: 20px;
    bottom: 30px;
  }
  .dialog-content{
    li{
      @include flex(row);
      margin-bottom: 10px;
      p{
        width:100px;
        text-align: center;
      }
      &>div{
          flex: 1;
      }
    }
  }
  .dialog-footer{
    text-align: center;
    .el-button{
      width: 200px;
    }
  }

</style>
