<template>
<!-- buybox获得卖家数 -->
    <div>
        <div v-loading='loading'>
            <el-button type="primary" size="mini" @click='addStore'>加入店铺分析</el-button>
            <el-table
                :data="tableData"
                style="width: 100%;margin-top:10px;"
                border
                ref='table'
                @sort-change='handleSortChange'
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="seller"
                    label="卖家名称"
                    width="300">
                    <template slot-scope="scope">
                        <a :href="scope.row.sellerUrl" target='_blink' style='color:#108ee9'>{{scope.row.sellerName ? scope.row.sellerName :"-"}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="newFeedbackCntD30"
                    label="店铺Feedback月新增数"
                    :sortable='true'
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="shopNewReviewCntD30"
                    label="是否加入店铺分析"
                    width="200">
                    <template slot-scope="scope">
                       <span>{{scope.row.count===0?"否":"是"}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

          <!-- 弹框 -->
        <!-- <Dialog :options="innerDialogOpts" :events="events" @close="innerDialogOpts.visible = false">
            <transition-type name="fadeIn-fadeOut">
                <component
                v-if="innerDialogOpts.visible"
                :is="dialogComponent.component"
                :params="dialogComponent.params"
                ref="component"
                ></component>
            </transition-type>
        </Dialog> -->
        
            <div class='wrap-box' v-if='boxShow'>
                <transition-type name="fadeIn-fadeOut">
                    <div class='box-div'>
                        <div style='line-height:30px;font-size: 18px;color: #303133;padding-top:16px;padding-bottom:16px;padding-left:22px;border-bottom:1px solid #e5e5e5;'>加入店铺分析</div>
                        <i class="el-icon-close close" style='position:absolute;right:30px;top:20px;font-size:16px;' @click='handleCancelClick'></i>
                        <div style='height:20px;'></div>
                        <div style="padding-left:26px;padding-right:26px;">
                            <el-form  :label-position="labelPosition" label-width="80px"  :model="formData" ref='form' >
                                <!-- 任务名称 -->
                                <el-form-item label="任务名称" prop='taskName' 
                                    :rules="[ { required: true, message: '请输入任务名称', trigger: ['blur'] }]"
                                >
                                    <el-input v-model.trim="formData.taskName" size='mini'></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot='btns' style='text-align:center;margin-top:40px;border-top:1px solid #e5e5e5;padding-top:15px;'>
                                <el-button
                                    size="small"
                                    type="primary"
                                    :loading="loadingBtn"
                                    @click="handleOkClick"
                                    >确定</el-button>
                                <el-button  size="small" @click="handleCancelClick">取消</el-button>
                            </div>
                        </div>
                    </div>
                </transition-type>
            </div>
        
    </div>
</template>

<script>
import Dialog from './bigDialog';
export default {
    props:['params'],
    components:{
        Dialog
    },
    data() {
        return {
            tableData:[],
            loading:false,

              //弹框的配置
            innerDialogOpts: {
                visible: false,
                closeOnClickModal: true
            },
            dialogComponent: {},//弹框的组件
            //弹框的事件
            events:{
                open() {
                    setTimeout(() => {
                        vm.$nextTick(() => {
                        // 弹窗里的组件
                        let component = vm.$refs.component
                        if (!component) {
                            return
                        }
                        // 调用组件初始化函数
                        component && component._initData && component._initData()
                        })
                    })
                },
                close() {
                    // 弹窗里的组件
                    let component = vm.$refs.component
                    // 调用组件关闭函数
                    component && component._close && component._close()
                    },
                    handleOkClick() {
                    let component = vm.$refs.component
                    // if (!component) {
                    //   return
                    // }
                    if (!component._submit) {
                        throw new Error('确保弹窗组件内定义了_submit方法')
                    }
                    return (
                        component &&
                        component._submit &&
                        component._submit().then(res => {
                        if (res) {
                            vm.innerDialogOpts.visible = false
                            vm.getList(undefined, res === 'reset')
                        }
                        })
                    )
                }
            },
            dialogTableVisible:false,

            formData:{
                taskName:'',
                dataType:0,
                dataSource:[],//勾选的
                sellerId:"",
                platformId:this.platformId,
                siteId:"",
            },
            labelPosition:'center',
            loadingBtn:false,

            boxShow:false,
            

        };
    },
    methods: {
        //排序的方法
        handleSortChange(col){
            let order = col.order 
            if( order === 'descending'){
                this.tableData.sort((a,b)=>{
                    return a-b
                })
            }else{
                this.tableData.sort((a,b)=>{
                    return b-a
                })
            }
           
        },
        //勾选改变
        handleSelectionChange(v){
            //console.log(v)
            this.formData.dataSource=[];
            v.forEach(i=>{
                 this.formData.dataSource.push(i.sellerUrl)
                
            });
        },
        //加入店铺分析
        addStore(){
            if(this.formData.dataSource.length===0){
                this.$message({
                    message:'请至少选择一项',
                    type:"warning"
                });
                return
            };  
            this.boxShow=true;
        },
         //加入店铺提交
        handleOkClick() {
            this.loadingBtn=true;

            this.$refs.form.validate((valid) => {
                if (valid) {
                     this.$api['taskShopAnalysisSave'](this.formData).then(
                         (data)=>{
                             if(data.code===0){

                                this.$refs.table.clearSelection();
                                this.handleCancelClick();
                                this.getList();
                                this.loadingBtn=false;
                                this.formData.dataSource=[];
                               
                             }
                         }
                     ).catch(err=>{
                           this.loadingBtn=false;
                     })
                } else{
                     this.loadingBtn=false;
                }
            });
          
            
        },
        //取消加入店铺分析
        handleCancelClick(){
           this.boxShow=false;
           this.formData.taskName='';
        },
        //获取buybox列表数据
        getList(){
            this.loading=true;
            this.$api['taskSelectionListBuybox']({
                sellerId:this.params.sellerId,
                siteId:this.params.siteId,
                taskId:this.params.taskId,
                parentAsin:this.params.parentAsin,
            })
            .then(data => {
                 //console.log(data);
                 this.tableData=data.data;
                 this.loading=false;
            })
        }
        
    },
    created() {
        // console.log('object');
        //console.log(this.params);
        this.getList();
        this.formData.sellerId=this.params.sellerId;
        this.formData.siteId=this.params.siteId;
        this.formData.platformId=this.platformId;

    },
};
</script>

<style scoped lang="less">
.box-div{
    position: fixed;
    top: 14vh;
    right: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    overflow: auto;
    margin: 0;
    width: 500px;
    z-index:1000000;
    background-color: #fff;
    height: 240px;
    box-shadow: 0px 1px 1px #ccc;
    //position: relative;
}
.wrap-box{
    width:100%;
    height:100%;
    position:fixed;
    left: 0;
    top:0;
    z-index:10000;
}
.close{
    cursor:pointer;
    &:hover{
        color:#108ee9;
    }

}

</style>
