<template>
    <div>   
        <div>
            <div style='margin-top:-16px;'> <span>1、</span><p>点击复制URL。</p></div>
            <div> <span>2、</span><p>为防止店铺关联，<b style='color:red'>请务必在店铺常用的电脑上操作：</b>打开浏览器，粘贴访问上面复制的URL。</p> </div>
            <div> <span>3、</span><p>在弹出的亚马逊登录页面中，使用<b style='color:red'>店铺账号登录亚马逊</b>，完成授权。</p> </div>
            <div> <span>4、</span><p>授权成功后，会收到成功提示；如果失败，也会收到失败提示。</p></div>
        </div>
    </div>
</template>

<script>
export default {
    props:['storeId'],
    data() {
        return {
            text:''
        };
    },
    methods: {
        _submit(){
            return this.$api['product/GlStoreAdAuthAmz']({
                storeId : this.storeId
            })
            .then(data => {
                console.log(data);
                let {rows} = data
                this.text = rows;
                this.copyUrl();
                //console.log(res);
                return Promise.resolve(true)
            })
        },
        copyUrl(){
            var oInput = document.createElement('textarea');
            oInput.value = this.text;
            //console.log(oInput.value);
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            //oInput.style.display='none';
            document.body.removeChild(oInput);
            this.$message.success('已复制好，可粘贴访问链接。')
        }
    },
    created() {
        console.log(this.storeId);
    },
};
</script>

<style scoped lang="scss">
div span:first-child{
    float: left;
}
div p{
    margin-left: 20px;
}

</style>
