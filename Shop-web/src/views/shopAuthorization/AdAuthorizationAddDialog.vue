<template>
    <div>
        <div style='margin-top:-16px;'> <span>1、</span><p>点击复制URL。</p></div>
        <div> <span>2、</span><p>为防止店铺关联，请务必在<b style='color:red'>店铺常用的电脑上</b>操作：打开浏览器，粘贴访问上面复制的URL。</p> </div>
        <div> <span>3、</span><p>在弹出的亚马逊登录页面中，使用店铺账号登录亚马逊，完成授权。</p> </div>
        <div> <span>4、</span><p>授权成功后，会收到成功提示；如果失败，也会收到失败提示。</p></div>
        <!-- <yt-dialog :options='options' :events='events'>
            <p style='width:430px;word-break: break-all;' id='biao1'>{{text}}</p>
        </yt-dialog> -->
        <input type="text" :value="text" id='biao1' style='position: absolute;left:-100000px;top:-10000px' />
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            text:null,
            // options:{
            //     visible:false,
            //     width:500,
            //     title:'链接',
            //     appendToBody:true,
            //     showFooter:false
            // },
            // events:{
            //     handleOkClick:()=>{

            //     }
            // }
        };
    },
    methods: {
        _submit(){
            return this.$api['apiAdGetAdAuthUrl']({
                sellerId : this.params.sellerId
            })
            .then(data => {
                //console.log(data);
                this.text = data.data;
                //this.options.visible = true;  
                //console.log(this.text);
                let res = this.copyUrl();
                //console.log(res);
                return res
            })
        },
        copyUrl(){
            this.$nextTick(function(){
                var Url2=document.getElementById("biao1");
                Url2.select(); // 选择对象
                document.execCommand("Copy"); 
                this.$message.success('已复制好，可粘贴访问链接。')
                
            })
            return true ;
        }
    },
    created() {

    },
};
</script>

<style scoped lang="less">
    div span:first-child{
        float: left;
    }
    div p{
        margin-left: 20px;
    }
</style>
