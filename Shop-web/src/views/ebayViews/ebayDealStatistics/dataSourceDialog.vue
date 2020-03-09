<template>
    <div>
       <!-- //链接数 -->
    <div class='table'>
        <div class='link'>
           <span style='display:inline-block;width:600px;float:left;border-right:1px solid #e5e5e5;'
                :style="{borderRight: (params.dateType===1 || params.dateType===2) ? '1px solid #e5e5e5':'none' }"
           >链接</span> 
           <span style='display:inline-block;width:140px;float:right;'  v-show='params.dateType===1 || params.dateType===2'>搜索页数</span> 
        </div>
        <div v-for='item in linkDatas' :key='item.id' class='col' style=''> 
          <!-- 如果数据类型为 0是产品链接 直接 name, ; 如果数据类型为 1,是关键词,; 如果数据类型为 2 是类目需要 categoryUrl ; 如果数据类型为 3 是店铺链接,直接 name-->
          <a   
            v-bind="{
              href:item.dataType=== 1? 'https://www.amazon.com/s?k='+item.name+'&ref=nursing+tanks':
              item.dataType===2 ? item.url: item.name
             }"
              :style="{borderRight: (params.dateType===1 || params.dateType===2) ? '1px solid #e5e5e5':'none' }"
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
          <span style='width:140px;float:right;'  v-show='params.dateType===1 || params.dateType===2'>{{item.page?item.page:"-"}}</span>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            linkDatas:[]

        };
    },
    methods: {

    },
    created() {
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
    },
};
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
