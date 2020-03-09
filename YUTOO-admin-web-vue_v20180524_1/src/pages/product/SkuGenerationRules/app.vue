<template>
  <div>
    <div class="regulation_select">
      <div class="select_item">
        <span>规则名称:</span>
        <el-input placeholder="请输入内容" v-model="selectInfo.name"/>
      </div>
      <div class="select_item">
        <el-select v-model="selectInfo.state" clearable placeholder="规则状态">
          <el-option
            v-for="item in regulation_select"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </div>
      <div class="select_item">
        <span class="text">添加时间:</span>
        <el-date-picker v-model="selectInfo.beforeTime" type="datetime" placeholder="选择开始时间"/>~
        <el-date-picker v-model="selectInfo.afterTime" type="datetime" placeholder="选择结束时间"/>
      </div>
      <div class="select_item">
        <el-button type="primary" @click='select'>搜索</el-button>
      </div>
    </div>
    <div class="operation_btn">
      <el-button type="primary" @click="pushRule=true">添加</el-button>
      <el-button type="primary" @click="delAll">批量删除</el-button>
    </div>
    <div class="regulation_list">
      <el-table ref="multipleTable" :data="skuLists" tooltip-effect="dark"
        style="width: 100%"
        @selection-change="userSelect">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="规则编号" >
          <template slot-scope="scope">{{ scope.row.skuRuleId }}</template>
        </el-table-column>
        <el-table-column  label="是否激活" width="80">
            <template slot-scope="scope">{{ scope.row.activateFlag?'激活':'未激活'}}</template>
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="storeName" label="店铺名称" width="100" ></el-table-column>
        <el-table-column prop="formal" label="规则公式" show-overflow-tooltip width='200'></el-table-column>
        <el-table-column prop="description" label="规则说明" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="规则日志" show-overflow-tooltip></el-table-column>

        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="compile(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, skuLists)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paginationBox">
      <el-pagination :current-page="currentPage"
        :page-sizes="[10, 8,5]"
        size="10"
        :total="25"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!--添加 -->

    <el-dialog title="添加规则" :visible.sync="pushRule">
        <ul class="rule_content">
            <li>
                <p>规则名称:</p>
                <div>
                    <el-input/>
                </div>
            </li>
            <li>
                <p>店铺名称:</p>
                <div>
                    <el-input/>
                </div>
            </li>
            <li>
                <p>规则公司</p>
                <div class="lebelBox">
                    <div class="lebel">
                        <el-button type="primary">随机数字</el-button>
                        <el-button type="primary">随机按钮</el-button>
                        <el-button type="info">主要按钮</el-button>
                        <el-button type="info">主要按钮</el-button>
                        <el-button type="info">主要按钮</el-button>
                    </div>
                    <div class="lebel Content">
                        <el-input type="textarea" :rows="2"/>
                    </div>
                </div>
            </li>
            <li>
                <p>规则描述:</p>
                <div>
                  <el-input type="textarea" :rows="2"/>
                </div>
            </li>
            <li>
                <p>预览:</p>
                <div class="preview_inputBox">
                    <el-input placeholder="输入SKU"/>
                    <span>12345K4528</span>
                </div>

            </li>
            <li>
                <div>
                  <input type="checkbox" style="cursor: pointer;">
                  <span>是否激活</span>
                </div>
            </li>
        </ul>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="preserve">保存</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
// import apis from 'apis';
// import {fetchData} from "common/common";
import axios from 'axios';
function getData(requestURL, params) {
  // let token = "804aea0bc70fa1be7f4045474e11d343";
  let token = localStorage.getItem('token');
  return axios({
    method: 'post',
    //url: 'http://192.168.0.123:8080/' + requestURL,
    url: 'http://192.168.0.98:7080/yutoo-admin-erp/' + requestURL, //服务器
    //url: 'http://192.168.0.200:8080/' + requestURL,//张绍武
    data: params,
    headers: {
      token
    },
  }).then(res => {
    return res;
  }).catch(err => {
    document.write(err)
  })
}
export default {
   data() {
     return {
       selectInfo:{//搜索信息
          name:'',
          state:'',
          beforeTime:'',
          afterTime:''
       },
       regulation_select: [{
         value: '选项1',
         label: '黄金糕'
       }, {
         value: '选项2',
         label: '双皮奶'
       }],
       options: [{
           value: '选项1',
           label: '黄金糕'
       }, {
           value: '选项2',
           label: '双皮奶'
       }],
       value5: '',
       skuLists: [],//sku列表
       currentPage: 1,//显示第几页
       pushRule:false,//添加弹窗
       selectArr:[] //勾选的

     }
   },
   mounted() {
     this.getSkuLists()
   },
   methods:{
     //获取SKU规则列表
     getSkuLists() {
        getData('/sku/rule/list',{
            "sortOrder":"asc",
           "pageSize":10,
           "pageNumber":1,
           // "ruleName":"试", //搜索加此
           "type":"1"
       }).then(res=>{
           console.log(res)
           this.skuLists = res.data.rows
       })

     },
     //搜索
     select() {
        console.log(this.selectInfo)
     },
     //编辑
     compile(row) {
       console.log(row)
     },
     //保存
     preserve() {

       this.$message({
         message: '添加成功',
         type: 'success'
       });
      // this.$message.error('添加失败');
       this.pushRule= false;
     },
     //删除
     deleteRow(index,arr){
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
     handleSizeChange(val) {
         console.log(`每页 ${val} 条`);
     },
     handleCurrentChange(val) {
         console.log(`当前页: ${val}`);
     },
     //勾选时触发
     userSelect(val) {
         if(val.length){
           this.selectArr = val;
         }else{
           this.selectArr = [];
         }
     },
     //批量删除
     delAll() {
        if(this.selectArr.length){
          this.$confirm('确定删除吗, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }).then(() => {
             this.selectArr.forEach(item=>{
                this.skuLists.forEach((entity,index)=>{
                  if(item.skuRuleId == entity.skuRuleId) {
                    this.skuLists.splice(index, 1);
                  }
                })
             })
             this.$message({
               type: 'success',
               message: '删除成功!'
             });
           }).catch(() => {
             this.$message({
               type: 'info',
               message: '已取消删除'
             });
           });
        }else{
          this.$message({
            message: '选择你要删除的',
            type: 'warning'
          });
        }
     }

   }

}
</script>

<style lang="scss">
  @import '../../../assets/style/style-scss/layout.scss';
  body{
    padding: 10px;
  }
  .text{
    display: block;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
    text-align: center;
  }
  .regulation_select{
    @include flex(row);
    .select_item{
      display: flex;
      flex-direction: row;
      margin-right: 10px;
      &:first-child{
        span{
          @extend .text;
          width:100px;

        }
      }
    }
  }
  .operation_btn{
    margin-top: 10px;
  }
  .regulation_list{
    margin-top: 15px;
    .cell{
      text-align: center;
    }
    .el-table th{
      background-color: rgba(223, 223, 223, 1);
    }
  }
  .paginationBox{
    position: fixed;
    right: 20px;
    bottom: 30px;
  }

  .rule_content{
    li{
        @include flex(row);
        margin-bottom: 10px;
        p{
          width: 80px;
          text-align: center;
          line-height: 40px;
        }
        div{
          flex: 1;
        }
        .lebelBox{
           @include flex(row);
          .lebel{
            height: 230px;
            &:first-child{
              width: 300px;
              padding: 10px;
              border:1px solid #dcdfe6;
              border-radius:5px;
              margin-right: 10px;
              .el-button{
                float: left;
                margin:0 10px 10px 0;
              }
            }
            &:last-child{
              flex:1;
              .el-textarea{
                height:230px;
                .el-textarea__inner{
                    height: 100%;
                }
              }
            }
          }
        }
        .preview_inputBox{
          .el-input{
            width: 160px;
            input{
              text-align: center;
            }
          }
          span{
            line-height: 40px;
            margin-left: 10px;
          }

        }
        &:last-child{

          div{
            margin-left: 80px;
            margin-top: 30px;
          }
        }
    }
  }

  .el-dialog__footer{
    text-align: center;
    .el-button{
      width: 200px;
    }
  }
</style>
