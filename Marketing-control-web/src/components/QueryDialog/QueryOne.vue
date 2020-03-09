<template>
    <transition name="fade">
        <div class="query-box" v-show="pDialogVisible" ref="dialogVisible">
              <el-input v-model="txt" placeholder="请输入内容" size="mini" v-if="pType==='txt'" clearable></el-input>
              <!-- <el-radio-group v-model="radio" size="mini" v-else-if="pType==='status'">
                    <el-radio-button label="10">全部</el-radio-button>
                    <el-radio-button label="0">关闭</el-radio-button>
                    <el-radio-button label="1">开启</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="radio" size="mini" v-else-if="pType==='payType'">
                    <el-radio-button label="10">全部</el-radio-button>
                    <el-radio-button label="0">微信</el-radio-button>
                    <el-radio-button label="1">支付宝</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="radio" size="mini" v-else-if="pType==='defaultFlag'">
                    <el-radio-button label="10">全部</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                    <el-radio-button label="1">是</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="radio" size="mini" v-else-if="pType==='chargeType'">
                    <el-radio-button label="10">全部</el-radio-button>
                    <el-radio-button label="0">按次</el-radio-button>
                    <el-radio-button label="1">包月</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="radio" size="mini" v-else-if="pType==='photoFlag'">
                    <el-radio-button label="10">全部</el-radio-button>
                    <el-radio-button label="0">关闭</el-radio-button>
                    <el-radio-button label="1">开启</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="radio" size="mini" v-else-if="pType==='messageType'">
                    <el-radio-button label="10">全部</el-radio-button>
                    <el-radio-button label="0">注册</el-radio-button>
                    <el-radio-button label="1">找回密码</el-radio-button>
                    <el-radio-button label="2">修改密码</el-radio-button>
                    <el-radio-button label="3">修改手机号</el-radio-button>
              </el-radio-group> -->
              
              <el-radio-group v-model="radio" size="mini" v-else-if="pType==='radioCustom'">
                    <el-radio-button label="radio_all">全部</el-radio-button>
                    <el-radio-button v-for="item in radioItems" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
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
              <el-button @click="handleFilter" size="mini" type="warning">搜索</el-button>
              <el-button @click="cancel" size="mini" type="danger">取消</el-button>
          </div>
    </transition>
</template>
<script>
export default {
     props: ['pDialogVisible','pClientXY','pType','pTypeName','radioItems'],
    data(){
        return{
            txt:null,
            radio:'radio_all',
            daterange:[]
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
            let params ={}
                if(this.pType==='txt'){
                    params.type =this.pTypeName
                    params.value =this.txt
                }else if(this.pType==='radioCustom'){
                    params.type =this.pTypeName
                    params.value =this.radio
                }
               
            this.$emit('query',params);
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
