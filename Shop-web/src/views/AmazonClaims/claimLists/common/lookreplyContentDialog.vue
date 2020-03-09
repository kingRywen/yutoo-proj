<template>
    <div>
        <!-- 查看回复内容 -->
        <el-radio-group v-model="radio1" @change="change">
            <el-radio-button :label="item.caseId" v-for='(item,index) in data' :key='item.id'></el-radio-button>
        </el-radio-group>
        <div class='box' v-loading='loading'>
            <div></div>
            <!-- 时间 -->
            <span class='time'>{{replyTime}}</span>
            <!-- =内容 -->
            <div class='contont' v-html='replyContent' style='overflow:hidden;' :style="{height:replyContentHeight}">
            </div>
            <div >
                <el-button type="text" v-if='replyIsUnfold' @click='replayContentBtn(0)' style='font-size:14px;margin-left:6px;'>折叠</el-button>
                <el-button type="text" v-else @click='replayContentBtn(1)' style='font-size:14px;margin-left:6px;'>展开</el-button>
            </div>
        </div>
        <div class='box'>
            <div></div>
            <!-- 时间 -->
            <span class='time'>{{applyTime}}</span>
             <!-- =内容 -->
            <div class='contont' v-html='sendContent' style='overflow:hidden;'  :style="{height:sentContentHeight}">

            </div>
            <div >
                <el-button type="text" v-if='sendIsUnfold' @click='sendContentBtn(0)' style='font-size:14px;margin-left:6px;'>折叠</el-button>
                <el-button type="text" v-else @click='sendContentBtn(1)' style='font-size:14px;margin-left:6px;'>展开</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            radio1: '',
            data:[],

            replyTime:"",//回复时间
            replyContent:"",//回复内容
            replyIsUnfold:false,//展开

            applyTime:"",//申请时间
            sendContent:"",//发送内容
            sendIsUnfold:false,//展开

            loading:true,

            replyContentHeight:'140px',
            sentContentHeight:'80px',

        };
    },
    methods: {
        //回复内容点击展开或折叠
        replayContentBtn(v){
            //console.log(v);
            this.replyIsUnfold=!this.replyIsUnfold;
            if(!v){
                this.replyContentHeight='140px';
            }else{
                this.replyContentHeight='100%';
            }
        },
        //发送内容点击折叠
        sendContentBtn(v){
            this.sendIsUnfold=!this.sendIsUnfold;
            if(!v){
                this.sentContentHeight='70px';
            }else{
                this.sentContentHeight='100%';
            }
        },
        //获取回复内容
        getContent(){
            this.$api['taskClaimCaseList']({
               taskId: this.params.taskId
            })
            .then(data => {
                console.log(data);
                if(data.code===0){
                    this.loading=false;
                    this.data=data.data;
                    this.radio1=this.data[0].caseId;
                    let content=this.data[0];
                    this.replyTime=content.replyTime;
                    this.replyContent=content.replyContent;
                    this.applyTime=content.applyTime;
                    this.sendContent=content.sendContent;
                }   

            }).catch(() => {
                this.loading=false;
            })
        },
        //头部单选按钮点击改变
        change(v){
            //debugger
            //console.log(v);
            let index;
            this.data.forEach((i,indx)=>{
                if(i.caseId===v){
                    index=indx;
                    return;
                };
            });
            let content=this.data[index];
            this.replyTime=content.replyTime;
            this.replyContent=content.replyContent;
            this.applyTime=content.applyTime;
            this.sendContent=content.sendContent;
        }
    },
    created() {
        this.getContent();
    },
};
</script>

<style scoped lang="less">
.box{
    margin-top: 10px;
    border: 1px solid #e5e5e5;
    position: relative;
    .time{
        position: absolute;
        top:10px;
        right: 12px;
    }
    .contont{
        position: relative;
        padding-top: 10px;
        padding-left: 10px;
        margin-right: 170px;
        white-space: pre-line;
        word-break: break-all;
    }
}
</style>
