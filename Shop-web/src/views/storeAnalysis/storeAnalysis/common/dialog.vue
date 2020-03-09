<template>
  <div>
    <!-- //链接数 -->
    <div class='table' v-if='params.isLink'>
        <div class='link'>
           <span style='display:inline-block;width:600px;float:left;'  
                  :style="{borderRight: (params.dateType===1 || params.dateType===3) ? '1px solid #e5e5e5':'none' }">链接</span> 
           <span style='display:inline-block;width:140px;float:right;' v-show='params.dateType===1 || params.dateType===3'>搜索页数</span> 
        </div>
        <div v-for='item in linkDatas' :key='item.id' class='col'> 
          <a 
            :href="item.categoryUrl ? item.categoryUrl : item.url" 
            target='_blink' 
            :style="{borderRight: (params.dateType===1 || params.dateType===3) ? '1px solid #e5e5e5':'none' }"
            style='
              color: #108ee9;
              display:inline-block;
              width:600px;
              float:left;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              ' 
            >{{item.url}}</a>
          <span style='width:140px;float:right;' v-show='params.dateType===1 || params.dateType===3'>{{item.page ?item.page:"-"}}</span>
        </div>
    </div>


    <!-- //添加任务 -->
    <el-form  :label-position="labelPosition" label-width="100px"  :model="formData" ref='form' v-else>
      <!-- 任务名称 -->
      <el-form-item label="任务名称" prop='taskName' 
        :rules="[ { required: true, message: '请输入任务名称', trigger: ['blur'] }]"
      >
          <el-input v-model.trim="formData.taskName" size='mini' style='width:90%;'></el-input>
      </el-form-item>
      <!--数据类型 -->
      <el-form-item label="数据类型" prop='dataType' size='mini'
        :rules="[ { required: true, message: '请输入选择数据类型', trigger: ['blur'] }]"
      >
          <el-select v-model="formData.dataType" placeholder="请选择" @change='selectChange' style='width:90%;'>
            <el-option
              v-for="item in DataTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <!-- 关键词 -->
      <el-form-item label="关键词:" prop="keywords" 
        v-if="formData.dataType==3" 
        :rules="[ { required: true, message: '请输入关键词', trigger: ['blur'] }]"
      >
          <el-input type="textarea" :rows="5" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" v-model.trim="formData.keywords" style='width:90%;'>
          </el-input>
      </el-form-item>
      <!-- 类目 -->
      <el-form-item label="类目" prop='categoryId' size='mini' 
        v-if='formData.dataType===1'
        :rules="[{ required: true, message: '请选择类目', trigger: ['blur', 'change'] }]"       
      >
          <el-cate :Cate.sync="category.category" width="90%" :HaveChildform.sync="category.haveChildren" :CategoryId.sync="formData.categoryId" platformId="1">
          </el-cate>
      </el-form-item>
      <!-- BSRTOP100链接 -->
      <el-form-item  label="TOP100链接:" prop="top100BsrUrls"   v-if="formData.dataType==2" key="top100BsrUrls" :rules="[
                { required: true,  validator: urlValidate, trigger: ['blur'] },
                ]">
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="formData.top100BsrUrls" style='width:90%;'>
          </el-input>
      </el-form-item>
      <!-- 店铺链接 -->
      <el-form-item  label="店铺链接:" prop="storeUrls"   v-if="formData.dataType==0" key="storeUrls" :rules="[
                { required: true,  validator: urlValidate, trigger: ['blur'] },
                ]">
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="formData.storeUrls" style='width:90%;'>
          </el-input>
      </el-form-item>
      <!-- 搜索页数 -->
       <el-form-item label="搜索页数" prop='searchPages' size='mini' v-if='formData.dataType===1 || formData.dataType===3'
          :rules="[ { required: true, message: '请输入选择搜索页数', trigger: ['blur'] }]"
        >
          <el-select v-model="formData.searchPages" placeholder="请选择" style='width:90%;'>
            <el-option
              v-for="item in searchPagesOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>

  </el-form>
    
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    // Url分段验证
    let urlValidate=(rule, value, callback) =>{
      if (!value) {
        callback(new Error('输入不能为空'))
        return
      }
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== '')
      let reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
      if (!val.every(el => reg.test(el))) {
        callback(new Error('请输入正确的url, 一行一个'))
      } else if (val.length > 500) {
        callback(new Error('输入数量不能超过500个'))
      } else {
        callback()
      }
    };
    return {
      linkDatas:[],//链接展示的数据


      labelPosition: 'right',//表单label位置
      formData:{
        taskName:null,//产品名称
        dataType:null,//数据类型
       
        keywords:null,//关键词
        categoryId:null,//类目id
        top100BsrUrls:null,//top100链接
        storeUrls:null,//店铺链接
        searchPages:null,//搜索页数
        dataSource:null,//数据源
        platformId:null,

      },
      //form表单数据
      DataTypeOptions:[
        { value: 0,label: '店铺链接'},
        { value: 1,label: '类目'},
        { value: 2,label: 'Top100链接'},
        { value: 3,label: '关键词'},
          
      ],
      //选择的类目
      category: {
        category: null,
        haveChildren: null
      },
      //搜索页数的option
      searchPagesOpt:[
        {label:1,value:1},
        {label:2,value:2},
        {label:3,value:3},
        {label:4,value:4},
        {label:5,value:5},
        {label:6,value:6},
        {label:7,value:7},
        {label:8,value:8},
        {label:9,value:9},
        {label:10,value:10},
      ],
      urlValidate,//url验证
  
    }
  },
  methods: {
    //添加任务提交
    _submit() {
      if(this.formData.storeUrls){  //店铺链接
        let val = this.formData.storeUrls
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '');
        this.formData.dataSource=val;

      }else if(this.formData.keywords){ //关键词
        let val = this.formData.keywords
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '');
        this.formData.dataSource=val;

      }else if(this.formData.categoryId){  //类目
        this.formData.dataSource=[this.formData.categoryId];

      }else if(this.formData.top100BsrUrls){  //top100链接
        let val = this.formData.top100BsrUrls
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '');
        this.formData.dataSource=val;  
      };

      //console.log(this.formData);
      return this.$refs.form.validate().then(() => {
          return this.$api['taskShopAnalysisSave'](this.formData).then()
      })
    },
    _initData() {
      //console.log(213132);
      
    },
    //数据类型改变
    selectChange(){
        this.$refs.form.clearValidate(['storeUrls','keywords','categoryId','top100BsrUrls']);
        this.formData.storeUrls=null;
        this.formData.keywords=null;
        this.formData.categoryId=null;
        this.formData.top100BsrUrls=null;
        this.formData.searchPages=null;
    }
  
  },
  created(){
    //console.log(this.params);
    this.formData.siteId=this.params.siteId;
    this.formData.sellerId=this.params.sellerId;
    this.formData.platformId=this.platformId;
    //数据源的处理
    if(this.params.datas){
        if(this.params.dateType===1){  //是类目时
          this.params.datas.forEach(i=>{
            this.linkDatas.push({url:i,page:this.params.searchPages,categoryUrl:this.params.categoryUrl})
          });
        
        }else if(this.params.dateType===3){  //关键词时 ,自己拼接地址
          this.params.datas.forEach(i=>{
            this.linkDatas.push({categoryUrl:"https://www.amazon.com/s?k="+i+"&ref=nursing+tanks",url:i,page:this.params.searchPages})
          });
        }else{
          this.params.datas.forEach(i=>{
            this.linkDatas.push({url:i,page:this.params.searchPages})
          });
        }
       
    };
  
    //console.log(this.linkDatas);
  }
}
</script>

<style scoped lang="less">
.table{
  border:1px solid #e5e5e5;
  margin-bottom: 20px;
  .link{
    text-align: center;
    height: 30px;
    background-color: #f5f5f5;
    line-height: 30px;
    border-bottom:1px solid #e5e5e5;
  }
  .col{
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-bottom:1px solid #e5e5e5;
  }
}
</style>
