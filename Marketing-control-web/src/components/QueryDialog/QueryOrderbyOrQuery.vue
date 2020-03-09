<template>
    <transition name="fade">
        <div class="orderby-query" v-show="pDialogVisible" ref="dialogVisible">
            <div class="order-by">
              <div :style="ascActive" class="asc" @click="setOrderBy('asc')"><svg-icon icon-class="asc"/>&nbsp;升序</div>
              <div :style="descActive" class="desc" @click="setOrderBy('desc')"><svg-icon icon-class="desc"/>&nbsp;降序</div>
            </div>
            <div style="padding:10px;" class="daterange-or-btn">
                <el-date-picker
                  v-model="daterange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  v-if="pType==='time'">
                </el-date-picker>
                <!-- <el-input v-model="txt" placeholder="请输入内容" size="mini" v-else-if="pType==='txt'"></el-input> -->
                <el-button @click="handleFilter"  size="mini" type="warning">搜索</el-button>
                <el-button @click="cancel" size="mini" type="danger">取消</el-button>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
     props: ['pDialogVisible','pClientXY','pType','pTypeName'],
    data(){
        return{
            ascActive:{
                backgroundColor: '#fff',
            },
            descActive:{
                backgroundColor: '#eafaf2',
            },
            sortOrder:'asc',
            daterange:[],
            txt:null
        }
    },
    watch: {
        pDialogVisible(newP, oldP){
            if(newP){
                let queryVisible =this.$refs.dialogVisible.style
                    queryVisible.position ='absolute'
                    queryVisible.left =this.pClientXY[0] + 'px'
                    queryVisible.top = this.pClientXY[1] + 'px'
            }
        }
    },
    methods:{
        handleFilter(){
            let params ={
                    sortOrder:this.sortOrder
                }
            
            if(this.pType==='time'){
                params.daterange =this.daterange
                // params.type ='QueryOrderbyOrTime'
                params.type =this.pTypeName
            }
            // else if(this.pType==='txt'){
            //     params.txt =this.txt
            //     params.type ='QueryOrderbyOrTxt'
            // }
            
            this.$emit('query',params);
        },
        setOrderBy(t){
            if(t==='asc'){
                this.sortOrder ='asc'
                this.ascActive.backgroundColor='#eafaf2'
                this.descActive.backgroundColor='#fff'
            }else{
                this.sortOrder ='desc'
                this.ascActive.backgroundColor='#fff'
                this.descActive.backgroundColor='#eafaf2'
            }
        },
        cancel(){
            this.$emit('cancel');
        }
    }
}
</script>

<style lang="less" scoped>
  @import '../../styles/query-dialog';
</style>
<style lang="less" scoped>
.daterange-or-btn{
    display:flex;
    .el-button--warning,
    .el-button--danger{
      margin-left: 5px;
    }
}

</style>

