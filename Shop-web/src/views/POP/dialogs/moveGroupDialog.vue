<template>
<!-- 移动分组 -->
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="94px" class="demo-ruleForm" :label-position="'left'">
            <el-form-item label="选择上级分组" prop="parentClassifyId">
                <el-cascader
                    :props='prop'
                    v-model="ruleForm.parentClassifyId"
                    :options="options"
                    size='mini'
                    placeholder="请选择分组"
                    style='width:100%'
                    clearable
                    change-on-select
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
            ruleForm:{
                classifyName:null,
                classifyType:3,//固定的
                parentClassifyId:[],
            },
            options:[],
            prop:{
                children: 'childList',
                label: 'classifyName',
                value:'classifyId',
            },

            rules:{
                parentClassifyId:[
                    { required: true, message: '请选择上级分组', trigger: ['blur'] },
                ]
            }
        };
    },
    methods: {
        //获取选择项的option
        getOption(){
            let {parentClassifyId,...info}=this.ruleForm;
            let datas={...info};
            datas.parentClassifyId=0;
            this.$api['riceSeoManualtaskReviewContentList'](datas)
            .then(data => {
                this.options=data.data[0].childList;
                this.options.forEach( (i,index)=>{
                    if(i.classifyId ===-1){
                        delete this.options[index]
                    }
                })
                //console.log(this.options);
                //this.setDisabled(this.options)
                //console.log(this.options);
            }).catch(() => {})
        },
        // setDisabled(all) {
        //     all.forEach(el =>{
        //         if(!el.haveChildren && el.dataFlag===1) {
        //             el.disabled = true;
        //             //delete all[all.indexOf(el)];
        //         };
        //         if(el.childList) {
        //             this.setDisabled(el.childList) 
        //         }
        //     })
        // },
         _submit(){
             return this.$refs.ruleForm.validate().then(() => {
                let {sellerId,siteId,ids,parentClassifyId}=this.ruleForm;
                let datas={};
                datas.ids=ids;
                datas.sellerId=sellerId;
                datas.siteId=siteId;
                //console.log(parentClassifyId.pop());
                datas.classifyId=parentClassifyId.pop() || 0;
                //console.log(datas);
                //return
                return this.$api['priceSeoManualMoveClassify'](datas).then(
                        data=>{
                            this.params.fn();
                            this.params.refeshFn();
                        }
                )
            })
            .then(()=>{
                 return Promise.resolve(true)
            })
        },
    },
    created() {
        let {sellerId,siteId,platformId}=this.sellerData;
        this.ruleForm.sellerId=sellerId;
        this.ruleForm.siteId=siteId;
        this.ruleForm.platformId=platformId;
        //this.ruleForm.parentClassifyId=[this.params.parentClassifyId];
        this.ruleForm.ids=this.params.ids;

        this.getOption();
    },
};
</script>

<style scoped lang="less">

</style>
