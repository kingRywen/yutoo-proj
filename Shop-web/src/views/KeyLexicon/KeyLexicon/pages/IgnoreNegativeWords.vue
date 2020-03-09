<template>
    <div>
         <MainLayout
            :outerParams="outerParams"
            :editBtns="editBtns"
            :edits="edits"
            :columns="columns"
            @searchTrueData='searchTrueData'
            @selectChange='selectChange' 
            :searchFunc='searchFunc'
            @requestSuccess='requestSuccess'
            ref="layout"
            url="categoryKeywordListNegativeFilter"
            >
            <div slot="search">
                <el-form :label-position="'center'" :model="formInline" ref='formInline' :inline="true" :rules='rules' style='margin-bottom:-10px'>
                    <el-form-item label="包含"  prop="include">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="formInline.include">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="不包含"  prop="exclude">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="formInline.exclude">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="排除"  prop="barring">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="formInline.barring">
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="keywordTexts" label='等于'>
                        <el-input
                            style='width:260px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="formInline.keywordTexts">
                        </el-input>
                        <!-- <el-input v-model.trim="formInline.keywordText" placeholder="请输入关键词名称" size="mini" clearable></el-input> -->
                    </el-form-item>
                    <el-form-item>
                            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">搜索</el-button>
                            <el-button size="small" type="primary" plain @click="resetSearch" :loading="tableLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
         </MainLayout>
    </div>
</template>

<script>
export default {
    props:['productId','cusCateId'],
    data() {
        return {
            outerParams:{

            },
            formInline:{
               include:"",
               exclude:"",
               barring:"",
               keywordTexts:"",
            },
            rules:{

            },
            editBtns:[
                {
                    name: '设为类目词组否定',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        return this.setStatus(5);
                    }
                },
                 {
                    name: '设为类目精确否定',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        return this.setStatus(4);
                    }
                },
                 {
                    name: '设为产品词组否定',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        return this.setStatus(3);
                    }
                },
                 {
                    name: '设为产品精确否定',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        return this.setStatus(2);
                    }
                },
                // {
                //     name: '忽略',
                //     showLoading:true,
                //     disabled: () => {
                //         return this.$refs.layout && this.$refs.layout.selection.length === 0
                //     },
                //     fn: ()=>{
                //         return this.setStatus(1);
                //     }
                // },
                 {
                    name: '复制关键词',
                    //showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        this.copyKeyword();
                    }
                },

            ],
            edits:[

            ],
            columns:[
                {
                    label: "关键词",
                    value: "keywordText",
                },
            ],

            selectIds:[],//表格勾选
            searchTrueDatas:"",//搜索的所有的数据

            tableLoading:false,//搜索的loading

        };
    },
    methods: {
        setStatus(v){
            return this.$confirm('是否继续此操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return this.$api['categoryKeywordNegativeFilter']({
                    ids:this.selectIds,
                    negativeStatus:v
                })
                .then(data => {
                    this.$refs.layout.getList()
                }).catch(() => {})
            }).catch(() => {

            });
           
        },
        copyKeyword(){
            if(! this.$refs.layout.selection.length){
                this.$message.warning('请至少选择一项')
                return
            };
            let keywordTextArr = this.$refs.layout.selection.map(el => el.keywordText);
            var oInput = document.createElement('textarea');
            oInput.value = keywordTextArr.join('\n');
            //console.log(oInput.value);
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            //oInput.style.display='none';
            document.body.removeChild(oInput);
            this.$message.success('复制成功')
        },
        //   //导出
        //  exportBtn(){
        //     let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,parentAsins: this.selectIds.length ? this.selectIds : null }
        //     return this.$api[`taskRankResearchListByRankReseProdExport`](params)
        //     .then(data => {
        //         downloadFile(data, '排名研究详情' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
        //     })
        //     .catch(() => {})
        // },
        //表单搜索的真实数据
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        selectChange(v){
            //console.log(v);
            this.selectIds=[];
            v.forEach(i=>{
                this.selectIds.push(i.keywordId);
            })
        },
        //搜索参数处理
        searchFunc(data){
            let { include,exclude,barring,keywordTexts} = JSON.parse(JSON.stringify(this.formInline));
            let params = new Object() ;
            params.keywordTexts = keywordTexts ?
                        keywordTexts.split(/[\n|\r\n|\,|\，]/)
                        .map(el => el.trim())
                        .filter(el => el !== '') : null ;
            params.include = include ?
                        include.split(/[\n|\r\n|\,|\，]/)
                        .map(el => el.trim())
                        .filter(el => el !== '') : [];
            params.exclude = exclude ?
                            exclude.split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '') : [];
            params.barring = barring ?
                            barring.split(/[\n|\r\n|\,|\，]/)
                            .map(el => el.trim())
                            .filter(el => el !== '') : [];
            return {...data,...params};
        },
        //确认搜索
        handleSearch(){
            //console.log(this.formInline);
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    this.tableLoading=true;
                    this.$refs.layout.getList();
                }
            });
        },
        //接受子组件的请求成功的方法
        requestSuccess(){
            //console.log('object');
            this.tableLoading=false;
        },
        //重置搜索
        resetSearch(){
            this.tableLoading=true;
            for(let k in this.formInline){
                this.formInline[k]=null
            };
            this.$refs.formInline.clearValidate()
            this.$refs.layout.getList();
        },
    },
    created() {
        this.outerParams.productId = this.productId;
        this.outerParams.cusCateId = this.cusCateId;
        this.outerParams.flag = 1;

        if (this.sellerId && this.siteId) {
            this.outerParams.siteId = this.siteId;
            //this.outerParams.sellerId = this.sellerId;
        }
    },
    watch: {
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId = this.siteId;
                //this.outerParams.sellerId = this.sellerId;
            }
        }
    }
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom: 18px;
}
</style>
