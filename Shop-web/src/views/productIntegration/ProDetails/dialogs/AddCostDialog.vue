<template>
  <div>
    <yt-form ref="form" label-width="150px" :fields="activeFields" :formData="formData"></yt-form>
  </div>
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      formData: {},
      activeFields: [
        {
          label: "时间",
          name: "createTime",
          span: 24,
          type: "date",
          //   rows: 5
          required: "true"
          // disabled: true
        },
        {
          label: "佣金($)",
          name: "commission",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
          {
          label: "成本($)",
          name: "cost",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
          {
          label: "FBA配送费($)",
          name: "fbaFulfillmentFee",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
        {
          label: "1-90天仓储费($)",
          name: "inv0To90DaysFee",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
        {
          label: "91-180天仓储费($)",
          name: "inv91To180DaysFee",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
        {
          label: "181-271天仓储费($)",
          name: "inv181To270DaysFee",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
        {
          label: "271-365天仓储费($)",
          name: "inv271To365DaysFee",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        },
         {
          label: "365~天仓储费($)",
          name: "inv365PlusDaysFee",
          span: 24,
          type: "text",
          //   rows: 5
          required: "true"
          // disabled: true
        }
      ],
      copyContent:"",//复制的内容

    };
  },
  methods: {
    _initData() {

      //编辑
      if (this.params && this.params.edit) {
        this.getHistory();

      }else if(this.params && this.params.copy){ //复制
          
          this.formData={...this.params.copyContent};
          this.copyContent={...this.params.copyContent};
          delete this.params.copyContent;
          //delete this.params.copy;
          delete this.formData.financeCostId;

          this.formData.skus=this.params.slectsku;

          delete this.params.slectsku;

          // console.log(this.params);
          // console.log(this.formData);

      }else{ //添加
          //this.formData={...this.params.copyContent};
          if(this.params.slectsku){
                this.formData.skus=this.params.slectsku;
                delete this.params.slectsku;
          };
          // console.log(this.params);
          // console.log(this.formData);
      };  
    },
    getHistory() {
        let params={
          sellerId:this.params.sellerId,
          siteId:this.params.siteId,
          financeCostId:this.params.financeCostId
        };
        this.$api['productInfoCostDetail'](params)
        .then(data => {
            let res=data.data;
            this.formData={...res};
            let skus=this.formData.sku;
            delete this.formData.sku;
            this.formData.skus=[skus];
            //console.log(this.formData);
        })
    },
    _close() {
      //this.params.copyContent=null;
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let datas={
          ...this.formData,
          ...this.params
        };
        
        //复制添加时,必须修改时间
        if(this.formData['createTime']===this.copyContent['createTime']){
              this.$message.warning('请修改时间');
        }else{
           return this.$api[`productInfoSaveCost`](
            datas
            ).then(data => {
            
              return Promise.resolve("reset");
            });
        }
      });
    }
  },
  created(){
    //console.log(this.params);
  }
};
</script>

<style>
</style>
