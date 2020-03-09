<template>
<!-- 添加或修改树形节点的弹框 -->
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :label-position="'left'">
            <el-form-item label="分组名称" prop="classifyName">
                <el-input v-model.trim="ruleForm.classifyName" size='small'></el-input>
            </el-form-item>
            <el-form-item label="选择上级分组" prop="parentClassifyId">
                <el-cascader
                    :props='props'
                    v-model="ruleForm.parentClassifyId"
                    :options="options"
                    size='small'
                    placeholder="请选择分组"
                     change-on-select
                    style='width:100%'
                >
                </el-cascader>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            arr: [],
            rules:{
                classifyName:[
                    { required: true, message: '请输入分组名称', trigger: ['blur','change'] }
                ]
            },
            ruleForm:{
                classifyName:null,
                classifyType:3,//固定的
                parentClassifyId:[],
            },
            options:[],
            props:{
                children: 'childList',
                label: 'classifyName',
                value:'classifyId',
            }
        };
    },
    methods: {
        _submit(){
             return this.$refs.ruleForm.validate().then(() => {
                let {parentClassifyId,...info}=this.ruleForm;
                let datas={...info};
                datas.parentClassifyId=parentClassifyId.pop() || 0;

                return this.$api[this.params.url](datas).then(
                        data=>{
                            this.params.fn();
                        }
                    )
                }).then(
                    ()=>{
                        return Promise.resolve(true)
                    }
                )
             
        },
        //获取选择项的option
        getOption(){
            let {parentClassifyId,...info}=this.ruleForm;
            let datas={...info};
            datas.parentClassifyId= 0;
            delete datas.classifyName;
            delete datas.classifyId;
            this.$api['riceSeoManualtaskReviewContentList'](
                datas
            )
            .then(data => {
                // let newData;
                // if(data.data.length){
                //     newData = [
                //         {
                //             childList: data.data,
                //             classifyName: "全部",
                //             haveChildren: 1,
                //             classifyId:0,
                //             parentClassifyId: 0
                //         }
                //     ];
                // }else{
                //     newData = [
                //         {
                //             classifyName: "全部",
                //             haveChildren: 0,
                //             classifyId:0,
                //             parentClassifyId: 0
                //         }
                //     ];
                // }
               

                this.options=data.data[0].childList;
                this.options.forEach( (i,index)=>{
                    if(i.classifyId ===-1){
                        delete this.options[index]
                    }
                })
                //console.log(this.options);
                this.setDisabled(this.options)
                //console.log(this.options);
            })
        },
        setDisabled(all,parent) {
            all.forEach((el, index) =>{
                if(!el.haveChildren && el.dataFlag===1) {
                   //el.disabled=true
                   if(parent){
                        parent.flagIndex = parent.flagIndex || 0;
                        parent.flagIndex ++;
                   }
                   delete all[index];
                   if( parent && parent.flagIndex === all.length){
                       delete parent.childList
                   }    
                };
                if(el.childList) {
                    this.setDisabled(el.childList,el) 
                }
            })
        },
    },
    created() {
        let {sellerId,siteId,platformId}=this.sellerData;
        this.ruleForm.sellerId=sellerId;
        this.ruleForm.siteId=siteId;
        this.ruleForm.platformId=platformId;

        //上级分组的id
        this.ruleForm.parentClassifyId=[this.params.parentClassifyId];

        //是点击单个节点的添加按钮,上级分组不让选
        if(this.params.oneAdd){
            delete this.params.options.childList
            this.options=[this.params.options];
        };
        //是点击顶部的添加按钮,需要获取所有的选择项
        if(this.params.topAdd){
              this.getOption();
        };
        //是点击单个节点的编辑按钮,需要获取所有的选项
        if(this.params.oneAlter){
            this.ruleForm.parentClassifyId=this.params.parentClassifyId.slice(0, -1); //回显当前的分类
            this.ruleForm.classifyName=this.params.classifyName;
            this.ruleForm.classifyId=this.params.classifyId;
            this.getOption();
        }
      
    },
};
</script>

<style scoped lang="less">

</style>
