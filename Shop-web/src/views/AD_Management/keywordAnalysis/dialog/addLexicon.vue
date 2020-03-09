<template>
    <div>
        <el-form size="small" :model="dataForm" ref="ruleForm" >
          <el-form-item label="选择类目词库 " prop="id" label-width="100px" style="width:100%;margin-bottom:15px;"
            :rules="[
                { required: true, message: '请选择', trigger: ['change'] },
                ]"
          >
            <div class="flex">
              <el-cascader
                placeholder="选择类目词库"
                v-model="dataForm.id"
                :options="catOptions"
                :show-all-levels="true"
                :props="props"
                size="small"
                :filterable="true"
              ></el-cascader>
              <el-button class="ml10" type="primary" @click="showAddCate" size="small">添加类目词库</el-button>
            </div>
          </el-form-item>
        </el-form>

        <yt-dialog :close-on-click-modal="false" title="添加类目词库" :options='addGroupShowOpt'  :events='addGroupShowOptEvents'>
            <div slot="title">
                <span  style="font-size:12px;">添加类目词库</span>
            </div>
            <div class="box __box_wrapper addFollow">
                <el-form :model="form" ref="ruleForm" style="width:100%;">
                    <el-form-item label="添加类目词库: " label-width="124px" style="width:100%;">
                        <!-- <el-cascader placeholder="默认根目录" :options="dialog.groupDialog.options" :show-all-levels="true" :props="dialog.groupDialog.props" v-model="dialog.groupDialog.parentGroupId" change-on-select style="width:82%;" clearable></el-cascader> -->
                        <el-cascader
                        placeholder="选择类目（只能选择最后一级）"
                        :options="form.haveChildCateData"
                        :show-all-levels="true"
                        :props="form.props"
                        v-model="form.ids"
                        :change-on-select="false"
                        style="width:280px;"
                        clearable
                        size="small"
                        :filterable="true"
                        ></el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <div class="txc" slot="footer">
                <el-button
                :disabled="form.ids.length>0?false:true"
                :loading="form.loading"
                type="primary"
                @click="addGroupSubmit()"
                size="small"
                >确定</el-button>
                <el-button type="primary" @click.stop="addGroupShowOpt.visible = false" size="small" plain>取消</el-button>
            </div>
        </yt-dialog>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            dataForm:{
                id:null
            },
            catOptions:[],
            props: {
                value: 'cusCateId',
                label: 'cusCateName',
                 children: 'childList',
            },

            addGroupShowOpt:{
                visible:false,
                width:"500px",
                title:"添加类目词库",
                appendToBody:true,
            },
            addGroupShowOptEvents:{
                handleOKClick:()=>{

                }
            },
            form: {
                addGroupShow: false,
                loading: false,
                haveChildCateData: [],
                haveChildren: null,
                ids: [],
                props: {
                    value: 'cusCateId',
                    children: 'childList',
                    label: 'cusCateName'
                }
            }
        };
    },
    methods: {
        getOpt(id){
            let params = {
                sellerId: this.sellerId,
                siteId: this.siteId
            }
            this.$api['CategoryKeywordListForCategory'](params)
            .then(data => {
                // console.log(data, "目录返回");
                this.catOptions = data.data ;
                if(id){
                    //this.findCate(this.catOptions,id)
                    this.dataForm.id = id ;
                };
            })
            .catch(err => {
                console.log(err)
            })
        },
        showAddCate(){
            this.addGroupShowOpt.visible = true
            //console.log('object');
            let params = {
                sellerId: this.sellerId,
                siteId: this.siteId
            }
            this.$api['CustomCategoryList'](params)
                .then(data => {

                //已经添加过的不要展示出来了
                // data.data && data.data.forEach((i,ind)=>{

                //     if(i.childList){
                //         i.childList.forEach( (h,index)=>{
                //             this.catOptions.forEach(k=>{
                //                 if( k.childList ){
                //                     k.childList.forEach(p=>{
                //                         if(h.cusCateId === p.cusCateId){
                //                             delete i.childList[index]
                //                         }
                //                     })
                //                 }else{
                //                     if(h.cusCateId === k.cusCateId){
                //                          delete i.childList[index]
                //                     }
                //                 }
                //             });
                //         })
                        
                //     }else{
                //         this.catOptions.forEach(k=>{
                //             if( k.cusCateId === i.cusCateId){
                //                 delete data.data[ind]
                //             }
                //         })
                //     }
                // }) 
                this.form.haveChildCateData = data.data
                // console.log(this.form.haveChildCateData);
            })
            .catch(err => {
                console.log(err)
            })
        },
        //确认添加类目词库
        addGroupSubmit() {
            const ids = JSON.parse(JSON.stringify(this.form.ids))
            let params = {
                sellerId: this.sellerId,
                siteId: this.siteId,
                cusCateId: ids[ids.length - 1]
            }
            this.form.loading = true
            //console.log(params)
            this.$api['CustomCategorySaveCategory'](params)
            .then(data => {
                this.addGroupShowOpt.visible = false
               
                this.form.loading = false
                // 添加成功end传入回调函数
                //let lastId = ids[ids.length - 1]
                this.getOpt(ids)
                // 添加成功end
            })
            .catch(err => {
                this.form.loading = false
            })
        },
         // 根据lastId找到新添加的词库类目，展示到默认中
        findCate(data, lastId) {
           
        },
        _submit(){
             let params = {
                sellerId: this.sellerId,
                siteId: this.siteId,
                cusCateId: this.dataForm.id.pop(),
                source: 'OTHER',
                keywords: this.params.keywords
            }
            return this.$api['CategoryKeywordSaveDigKeyword'](params)
        
        }
    },
    created() {
        if(this.sellerId && this.siteId){
             this.getOpt()
        }   
       
    },
    watch:{
        sellerData(){
            if(this.sellerId && this.siteId){
                this.getOpt()
            } 
        }
    }
};
</script>

<style scoped lang="less">

</style>
