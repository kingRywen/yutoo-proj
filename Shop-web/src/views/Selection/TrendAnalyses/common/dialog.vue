<template>
  <div>
    <!-- //链接数 -->
    <div class='table' v-if='params.isLink'>
       <div class='link'>链接</div>
       <div v-for='item in params.datas' :key='item.id' class='col'> 
         <a :href="item" target='_blink' style='color: #108ee9;'>{{item}}</a>
       </div>
    </div>
    <!-- //添加任务 -->
    <yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData" v-else></yt-form>
    
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      tableData: [],
      formData: {
        sellerId:null,
        siteId:null,
        platformId:this.platformId,
        dataSources:null,
      },
      activeFields: [
         {
            label: "数据类型",
            name: "dataType",
            span: 24,
            type: "select",
            placeholder:'请选择数据类型',
            options: [
                {label: "店铺链接",value: 0 },
                {label: "Top100链接",value: 1},
                {label: "产品链接",value: 2},
            ],
            required: true
        },
        {
          label: "链接",
          name: 'dataArr',
          type: "textarea",
          span: 24,
          rows:5,
          required: 'multiUrl'
        },
        {
          label: "任务名称",
          name: "taskName",
          span: 24,
          type: "input",
          placeholder:'请输入任务名称',
          required: true
        },
      ],
  
    }
  },
  methods: {
    _submit() {
        //console.log(this.formData);
        if(this.formData.dataArr){  //ASIN
          let val = this.formData.dataArr
            .split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== '');
          this.formData.dataSources=val;
        };
      return this.$refs.form.validate().then(() => {
        let url=this.params.type==='store'? 'taskShopTrendAnalysisSave' : 'taskProductTrendAnalysisSave';
        return this.$api[url](this.formData).then(() => 'reset')
      })
    },
    _initData() {
      //console.log(213132);
      
    }
  },
  created(){
      if(this.params.type==='store'){ //如果是店铺的话添加任务的数据类型不一养
          this.activeFields[0].options=[
            {label: "店铺链接",value: 0 },
            {label: "Top100链接",value: 1},
          ]
      };
      this.formData.sellerId=this.params.sellerId;
      this.formData.siteId=this.params.siteId;
      this.formData.platformId=this.platformId;
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
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    padding-left:5px;
    padding-right:5px;
  }
}
</style>
