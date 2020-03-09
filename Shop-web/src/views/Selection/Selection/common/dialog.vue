<template>
  <div>
    <!-- //链接数 -->
    <div class='table' v-if='params.isLink'>
        <div class='link'>
           <span style='display:inline-block;width:600px;float:left;border-right:1px solid #e5e5e5;'>链接</span> 
           <span style='display:inline-block;width:140px;float:right;'>搜索页数</span> 
        </div>
        <div v-for='item in linkDatas' :key='item.id' class='col' style=''> 
          <!-- 如果数据类型为 0是产品 ,需要自己手动加地址前缀 ; 如果数据类型为 2是类目,需要 categoryUrl ; 如果数据类型为 3 是top100链接 直接 name -->
          <a   v-bind="{href:item.dataType===0 ? 'https://www.amazon.com/dp/'+item.name:item.dataType===2 ? item.url:item.dataType===3 ? item.name:'Javascript:void(0);'}" 
              target='_blink' 
              style='
              color: #108ee9;
              display:inline-block;
              width:600px;
              float:left;
              border-right:1px solid #e5e5e5;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;' 
          >{{item.name}}</a>
          <span style='width:140px;float:right;'>{{item.page?item.page:"-"}}</span>
        </div>
    </div>


    <!-- //添加任务 -->
    <el-form  :label-position="labelPosition" label-width="100px"  :model="formData" ref='form' v-else>
      <!-- 任务名称 -->
      <el-form-item label="任务名称" prop='taskName' 
        :rules="[ { required: true, message: '请输入选择任务名称', trigger: ['blur'] }]"
      >
          <el-input v-model.trim="formData.taskName" size='mini'></el-input>
      </el-form-item>
      <!--数据类型 -->
      <el-form-item label="数据类型" prop='dataType' size='mini'
        :rules="[ { required: true, message: '请输入选择数据类型', trigger: ['blur'] }]"
      >
          <el-select v-model="formData.dataType" placeholder="请选择" @change='selectChange' style='width:352px;'>
            <el-option
              v-for="item in DataTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <!-- ASIN -->
      <el-form-item label="ASIN" prop='ASIN' size='mini' v-if='formData.dataType===0'
        :rules="[ { required: true, validator: asinValidate, trigger: ['blur'] }]"
      >
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="formData.ASIN">
          </el-input>
      </el-form-item>
      <!-- 关键词 -->
      <el-form-item label="关键词:" prop="keywords" 
        v-if="formData.dataType==1" 
        :rules="[ { required: true, message: '请输入关键词', trigger: ['blur'] }]"
      >
          <el-input type="textarea" :rows="5" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" v-model.trim="formData.keywords">
          </el-input>
      </el-form-item>
      <!-- 类目 -->
      <el-form-item label="类目" prop='categoryId' size='mini' 
        v-if='formData.dataType===2'
        :rules="[{ required: true, message: '请选择类目', trigger: ['blur', 'change'] }]"       
      >
          <el-cate :Cate.sync="category.category" width="100%" :HaveChildform.sync="category.haveChildren" :CategoryId.sync="formData.categoryId" :platformId="platformId">
          </el-cate>
      </el-form-item>
      <!-- BSRTOP100链接 -->
      <el-form-item  label="TOP100链接:" prop="top100BsrUrls" v-if="formData.dataType==3" key="top100BsrUrls" :rules="[
                { required: true,  validator: urlValidate, trigger: ['blur'] },
                ]"  >
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="formData.top100BsrUrls">
          </el-input>
      </el-form-item>
      <!-- 搜索页数 -->
       <el-form-item label="搜索页数" prop='searchPages' size='mini' v-if='formData.dataType===1 || formData.dataType===2'
          :rules="[ { required: true, message: '请输入选择搜索页数', trigger: ['blur'] }]"
        >
          <el-select v-model="formData.searchPages" placeholder="请选择" style='width:366px;'>
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
    // ASIN验证
    let asinValidate=(rule, value, callback) =>{
      if (!value) {
        callback(new Error('输入不能为空'))
        return
      }
      if (value == null || value == undefined) return
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== '')
      this.skusArr = val
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi
      let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
      let changePlatformd = 1 //上线要改
      let str = 'ASIN须为10位数，纯数字或大写字母和数字的组合'
      if (changePlatformd == 2) {
        reg = /^[0-9]{12,12}$/
        str = '请输入12位纯数字'
      } else if (changePlatformd == 3) {
        reg = /^(?!_)(?!.*?_$)[0-9_]+$/
        str = '请输入纯数字，允许下划线'
      } else if (changePlatformd == 4) {
        reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/
        str = '长度24位，须小写字母与纯数字的组合'
      } else if (changePlatformd == 5) {
        reg = /^[0-9]*$/
        str = '请输入纯数字'
      }
      if (!val.every(el => reg.test(el))) {
        callback(new Error(str))
      } else if (
        val.some(el => regEn.test(el)) ||
        val.some(el => regCn.test(el))
      ) {
        callback(new Error('不能包含特殊字符'))
      } else if (val.length > 500) {
        callback(new Error('输入数量不能超过500个'))
      } else {
        callback()
      }
    };
    return {
      linkDatas:[],//链接展示的数据


      labelPosition: 'center',//表单label位置
      formData:{
        taskName:null,//产品名称
        dataType:null,//数据类型
        ASIN:null,//ASIN
        keywords:null,//关键词
        categoryId:null,//类目id
        top100BsrUrls:null,//top100链接
        searchPages:null,//搜索页数
        dataSources:null,//数据源
        platformId:this.platformId,

      },//form表单数据
      DataTypeOptions:[
        { value: 0,label: '产品'},
        { value: 1,label: '关键词'},
        { value: 2,label: '类目'},
        { value: 3,label: 'BSRTOP100链接'},
          
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
      asinValidate,//asin验证
  
    }
  },
  methods: {
    //添加任务提交
    _submit() {
      if(this.formData.ASIN){  //ASIN
        let val = this.formData.ASIN
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '');
        this.formData.dataSources=val;

      }else if(this.formData.keywords){ //关键词
        let val = this.formData.keywords
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '');
        this.formData.dataSources=val;

      }else if(this.formData.categoryId){  //类目
        this.formData.dataSources=[this.formData.categoryId];

      }else if(this.formData.top100BsrUrls){  //top100链接
        let val = this.formData.top100BsrUrls
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '');
        this.formData.dataSources=val;  
      };

      //console.log(this.formData);
      return this.$refs.form.validate().then(() => {
          return this.$api['taskSelectionSave'](this.formData).then()
      })
    },
    _initData() {
      //console.log(213132);
      
    },
    //数据类型改变
    selectChange(){
        this.$refs.form.clearValidate(['ASIN','keywords','categoryId','top100BsrUrls']);
        this.formData.ASIN=null;
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

    //数据源的处理
     //console.log(this.params);
    if(this.params.datas){
        this.params.datas.forEach(i=>{
          this.linkDatas.push(
              {
                url:this.params.categoryUrl, 
                name:i,
                page:this.params.searchPages,
                dataType:this.params.dataType
              }
            )
        });
    };

    this.formData.platformId=this.platformId;
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
