<template>
  <div>
    <div class="select">
      <div class=" select_item">
        <el-input placeholder="产品标题" v-model="searchInfo.title"/>
      </div>
      <div class="select_item">
        <el-select v-model="searchInfo.platform_type" clearable placeholder="选择平台">
          <el-option v-for="item in options" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="searchInfo.decided" clearable placeholder="是否使用">
          <el-option v-for="item in whetherArr" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="select_item">
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="operation_btn">
      <el-button type="primary" @click="delChecked">删除</el-button>
      <el-button type="primary" @click="establish=true">创建</el-button>
    </div>

    <div class="keyword_list">
      <el-table ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        :data="skuList" tooltip-effect="dark" style="width: 100%" @selection-change="checkboxArr">
        <el-table-column  type="selection"
          width="55"></el-table-column>
        <el-table-column label="序号" >
          <template slot-scope="scope">{{ scope.row.skuRuleId }}</template>
        </el-table-column>
        <el-table-column prop="ruleName" label="标题名称"  width="160"></el-table-column>
        <el-table-column prop="address" label="标题语言" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformName" label="适用平台" width="100" ></el-table-column>
        <el-table-column prop="address" label="占用listing ID" show-overflow-tooltip></el-table-column>
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

    <!--创建 -->
    <el-dialog title="添加标题规则" :visible.sync="establish">
        <ul class="pushTitleDialog">
            <li>
                <p>标题名称:</p>
                <div>
                    <el-input placeholder="请输入内容" v-model="searchInfo.title"/>
                </div>
            </li>
            <li>
                <p>平台类型:</p>
                <div>
                    <el-select v-model="searchInfo.platform_type" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
            </li>
            <li>
                <p>标题语言:</p>
                <div class="labelBtn label_unify">
                    <el-button type="primary">品牌</el-button>
                    <el-button type="primary">款式</el-button>
                    <el-button type="info" plain>颜色</el-button>
                    <el-button type="info" plain>适用机型</el-button>
                    <el-button type="info" plain>适用人群</el-button>
                </div>
                <div class="label_content label_unify">
                    <el-input type="textarea" :rows="3"/>
                </div>
            </li>
            <li>
                <p>规则描述:</p>
                <div>
                    <el-input type="textarea" :rows="3"/>
                </div>
            </li>
            <li class="preview">
                <p>预览:</p>
                <span>41545413213</span>
            </li>
            <li>
                <p><el-switch v-model="regulationInfo.activate"/></p>
                <span style="line-height:45px;">是否激活</span>
            </li>
        </ul>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="pushTitle">保存</el-button>
        </div>
      </el-dialog>

  </div>
</template>
<script>
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
          loading:false,         //加载动画
          currentPage: 1,       //显示当前第几页
          searchInfo:{//搜索信息
            title:'',           //产品标题
            platform_type:'',  //平台类型
            decided:'',        //是否使用
          },
          regulationInfo:{
              title_name:'',    //规则名称
              title_language:'',//标题语言
              describe:'',      //规则描述
              activate:false   //是否激活
          },
          options: [{
              value: '选项1',
              label: '黄金糕'
          }, {
              value: '选项2',
              label: '双皮奶'
          }],
          checkedList: [],

            establish:false, //创建弹框状态
            checkedArr:[],  // 勾选中的
            skuList: [],    //SKU列表
            whetherArr:[{
              value: '是',
              label: '是'
            },{
              value: '否',
              label: '否'
            }]
        }
      },
      mounted() {
          this.getPlatformSku()
      },
      methods: {
        //获取平台sku列表
        getPlatformSku() {
            getData('/sku/rule/list',{
                "sortOrder":"asc",
                "pageSize":10,
                "pageNumber":1,
                "platformId":"1",
                "activateFlag":"1",
                "type":"2"
            }).then(res=>{
                console.log(res)
                this.skuList = res.data.rows;
            })
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
        search() {
          console.log(this.searchInfo)
          alert(1)
        },
        //勾选时触发
        checkboxArr(arr) {
          if(arr.length){
              this.checkedArr = arr;
          }else {
              this.checkedArr = [];
          }
        },
        //删除
        delChecked() {
            if(this.checkedArr.length){
                this.$confirm('此操作将删除选中的, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.checkedArr.forEach(item => {
                      this.titleLists.forEach((entity, index) => {
                      if(item.id == entity.id) {
                        this.titleLists.splice(index, 1);
                      }
                  });
               });
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
                 message: '选择要删除的',
                 type: 'warning'
               });
            }
        },
        //创建保存
        pushTitle() {

          // this.titleLists.push({
          //
          // })
          console.log(this.regulationInfo)

          this.$message({
            message: '创建成功',
            type: 'success'
          });
          // this.$message({
          //   message: '创建失败了',
          //   type: 'warning'
          // });
          this.establish = false;
        }
        //搜索

     }
  }
</script>

<style lang="scss">
    @import '../../../assets/style/style-scss/layout.scss';
    body{
      padding: 10px;
    }
  .select{
    @include flex(row);
    width:100%;
    .text{
      margin-right: 10px;
    }
    .select_item{
      margin-right: 20px;
      &:first-child{
          @include flex(row);
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
  }
  .keyword_list{
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
  // 创建弹框样式
  .pushTitleDialog{
    li{
      @include flex(row);
      margin-bottom: 10px;
      &:nth-child(3){
        .label_unify{
           height: 230px;
        }
        .labelBtn{
          border: 1px solid #dcdfe6;
          padding: 10px;
          border-radius: 5px;
          margin-right: 10px;
          .el-button{
            float: left;
            margin-bottom: 10px;
          }
        }

        .el-textarea__inner{
           height: 230px;
        }
      }
      p{
        width: 80px;
        text-align: center;
        line-height: 40px;
      }
      &>div{
        flex: 1;
        .el-select{
          width: 100%;
        }
      }
      &:last-child{
          span{
            line-height: 40px;
          }
      }
    }
    .preview{
      span{

        line-height: 40px;
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
