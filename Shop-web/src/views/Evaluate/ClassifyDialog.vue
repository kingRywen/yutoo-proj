<template>
    <yt-dialog  :options="options" :events="events">
        <el-form size="small" :model="ruleForm"  ref="ruleForm" label-width="115px" class="options-form" v-if='isShow'>
            <el-form-item label="分类名称" prop="classifyName" 
            v-if="classifyNameShow"
            :rules="[
             { required: true, message: '请输入分类名称', trigger: 'blur' },
            ]">
                <el-input v-model.trim="ruleForm.classifyName" placeholder="请输入值" size="small" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item :label="parentClassifyIdLabel" prop="parentClassifyId" 
            
			>
                <el-cascader
				style="width: 250px;"
                clearable
                :options="parentClassifyOptions"
                v-model="ruleForm.parentClassifyId"
                change-on-select
                size="small"
                placeholder='请选择'
                @change='cascaderChange'
                :props="props"
                ></el-cascader>
            </el-form-item>
        </el-form>
    </yt-dialog>
</template>
<script>
const _ =require('lodash')
export default {
    props: ['multipleSelection','taskClassify1List'],
    data(){
        return{
            props: {
                label:'classifyName',
                value: 'classifyId',
                children: 'childList'
            },
            options: {
                visible: false,
                width:'500',
                size:"small",
                title: '添加分类',
                okBtnText: '确认'
            },
            events: {
                handleOkClick: () =>{
                    this.submitForm()
                }
            },
            parentClassifyIdLabel:'选择分类',
            parentClassifyOptions:[],
            classifyNameShow:true,
            classifyIdRequired:false,
            ruleForm:{
                parentClassifyId:[],
                classifyId:null,
                platformId:null,
                siteId:null,
                sellerId:null,
                classifyType:null,
                classifyName:null,
            },
            dialogType:null,

            isShow:false,
        
        }
    },
    methods:{
        cascaderChange(){
            //console.log(this.ruleForm.parentClassifyId);
        },
        showDialog(visible,params,nodeDate,parentNode,allNode,node){
             console.log('7777777777777777777777777');
            
            // console.log(nodeDate);
             console.log(allNode);
             //console.log(node);
            //console.log(this.ruleForm.parentClassifyId)
            
            if(this.$refs['ruleForm']!==undefined){
                this.$refs['ruleForm'].resetFields();
            }
            // this.classifyIdRequired =false
            this.ruleForm={
                parentClassifyId:[],
                classifyId:null,
                platformId:this.platformId,
                siteId:null,
                sellerId:null,
                classifyType:null,
                classifyName:null,
            };
            this.isShow=false;
            this.classifyNameShow =true;
            let {fun,type,sellerId,siteId} =params;
            this.ruleForm.sellerId =sellerId;
            this.ruleForm.siteId =siteId;
            // if(fun!=='add'&&fun!=='move'){
            //     this.ruleForm.classifyId =nodeDate[0].classifyId
            // }
            this.dialogType =`${fun}:${type}`
            let title ='添加分类'
            // if(fun=='add'||fun=='edit'){
            //     if(nodeDate!==null){
                   
            //        this.$api["taskClassifyFindParent"](
            //             {classifyId:nodeDate[0].classifyId}
            //            ).then(res => {
            //             let {code,data} =res;
            //             console.log('----------------------');
            //             console.log(res);

            //             if(code==0){
            //                 if(fun=='add'){
            //                     //this.ruleForm.parentClassifyId=data.classifyIds
            //                 }else if(fun=='edit'){
            //                     let classifyIds =data.classifyIds
            //                     if(classifyIds.length>0){
            //                         this.ruleForm.parentClassifyId=classifyIds.slice(0,classifyIds.length-1)
            //                     }else{
            //                         this.ruleForm.parentClassifyId =[]
            //                     }
            //                 }
            //             }else{
            //                 this.$message.error('获取分类失败!');
            //                 return
            //             }
            //         })
            //    }else{
            //          this.ruleForm.parentClassifyId=0;
            //    }
            // }
            //console.log(fun);
            //console.log(this.ProductTaskList);
            if(fun=='add' && (type===2 || type===4)){  //左边的任务分类和产品分类树形结构点击单个的添加按钮
                setTimeout(()=>{
                    this.isShow=true;
                    this.parentClassifyOptions=[];
                    let node=_.cloneDeep(nodeDate);
                    if(node[0].childList){
                        node[0].childList=null;
                    };
                    //console.log(node);
                    this.parentClassifyOptions=node;
                    let id=nodeDate[0].classifyId;
                    this.ruleForm.parentClassifyId=[id];
                    this.ruleForm.classifyId=nodeDate[0].parentClassifyId;
                    this.ruleForm.classifyName=null;
                })
            }
            else if(fun=='add' && (type===1 || type===3)){//左边的任务分类和产品分类树形结构顶部的点击的单个的添加按钮
                setTimeout(()=>{
                    this.isShow=true;
                   // this.parentClassifyOptions=allNode
                   //console.log('object666666666666');
                    this.parentClassifyOptions=[];
                    //debugger
                    let all=_.cloneDeep(allNode);
                    this.setDisabled(all)
                    this.parentClassifyOptions=all;


                    //console.log(this.parentClassifyOptions);
                    let id=nodeDate[0].classifyId;
                    this.ruleForm.parentClassifyId=[id];
                    this.ruleForm.classifyId=nodeDate[0].parentClassifyId;
                    this.ruleForm.classifyName=null;
                })
            }
            else if(fun=='move'){

                title ='移动分组'
             
                setTimeout(()=>{
                    this.classifyNameShow =false;
                    this.parentClassifyOptions=[];
                    this.isShow=true;
                    this.parentClassifyOptions=this.taskClassify1List;
                    // console.log('object');
                    // console.log(this.ProductTaskList);
                })

                //this.parentClassifyOptions=this.ProductTaskList;

            }else if(fun=='edit'){   //左边的任务分类和产品分类树形结构的点击的单个编辑按钮
                title ='编辑分类'
                // this.classifyIdRequired =false
                // this.ruleForm.classifyName=nodeDate[0].classifyName;
                // this.$api["taskClassifyFindParent"](
                //         {classifyId:nodeDate[0].classifyId}
                //        ).then(res => {
                //         let {code,data} =res;
                //         console.log('----------------------');
                //         console.log(res);

                //         if(code==0){
                //             if(fun=='add'){
                //                 //this.ruleForm.parentClassifyId=data.classifyIds
                //             }else if(fun=='edit'){
                //                 let classifyIds =data.classifyIds
                //                 if(classifyIds.length>0){
                //                     this.ruleForm.parentClassifyId=classifyIds.slice(0,classifyIds.length-1)
                //                 }else{
                //                     this.ruleForm.parentClassifyId =[]
                //                 }
                //             }
                //         }else{
                //             this.$message.error('获取分类失败!');
                //             return
                //         }
                // });
                setTimeout(()=>{
                    this.isShow=true;
                    this.parentClassifyOptions=[];
                    // console.log('object');
                    //console.log(node);
                    // console.log(parentNode);
                    //this.parentClassifyOptions=allNode;
                     let all=_.cloneDeep(allNode);
                    this.setDisabled(all)
                    this.parentClassifyOptions=all;

                    let id=nodeDate[0].classifyId;
                    this.ruleForm.classifyId=id;
                    let idArray=[];//拿到当前点击节点的所有父级id和当前节点的id
                    function searach(node){
                        if(node.parent && node.parent.data.classifyId!==0){
                            idArray.unshift(node.parent.data.classifyId);
                            searach(node.parent)
                        };
                        //console.log('object');
                    };
                    searach(node);
                    //idArray.push(node.data.classifyId);
                    //console.log(idArray);
                    this.ruleForm.parentClassifyId=idArray;
                    this.ruleForm.classifyName=node.data.classifyName;
                })
            };

            if(type==1||type==3){
                this.parentClassifyIdLabel='上级分类'
                // this.classifyIdRequired =false
            }else if(type==2||type==4){
                // this.parentClassifyIdLabel='选择任务分类'
                this.parentClassifyIdLabel='上级分类'
            }
            // this.parentClassifyIdOptions =parentClassifyIdOptions
            this.options.title =title
            this.options.visible =visible
        },
        setDisabled(all,parent) {
            all.forEach( (el,index) =>{
                if(!el.haveChildren && el.dataFlag ===1) {
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
                    this.setDisabled(el.childList,el) ;
                }
            });
            

            // function deleteUndefined(){
            //     all.forEach(el =>{
            //         if(el.childList) {
            //             let isTrue=0;
            //             el.childList.forEach(item=>{
            //                 console.log(item[0]);
            //                 console.log(item[1]);
            //                 if(item===undefined){
            //                     isTrue++;
            //                 }
            //             });
            //             console.log(isTrue);
            //             console.log(el.childList.length);
            //             if(isTrue===el.childList.length){
            //                 el.childList.length=0;
            //             }
            //             //this.setDisabled(el.childList) 
            //         }
            //     });
            // }

           
        },
        submitForm(){
            //console.log('submit');
            // console.log( this.ruleForm.parentClassifyId);
            // return;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let dialogTypeArr =this.dialogType.split(":")
                    let fun =dialogTypeArr[0]
                    let type =dialogTypeArr[1]

                    if(fun=='add'){
                        let classifyType =0
                        
                        if(type==3||type==4){
                            classifyType =1
                        }
                        // this.ruleForm.platformId =this.listQuery.platformId
                        let ruleForm =_.cloneDeep(this.ruleForm)
                        ruleForm.parentClassifyId =_.last(ruleForm.parentClassifyId)
                        if(ruleForm.parentClassifyId==null||ruleForm.parentClassifyId==undefined){
                            ruleForm.parentClassifyId=0
                        }
                        
                        ruleForm.classifyType =classifyType

                        this.$api["taskClassifySave"](ruleForm).then(res => {
                            // this.getTaskClassifyList(classifyType,false)
                            this.$emit('reloadTree',{classifyType,flag:false});
                            this.ruleForm={
                                parentClassifyId:[],
                                classifyId:null,
                                platformId:this.platformId,
                                siteId:null,
                                sellerId:null,
                                classifyType:null,
                                classifyName:null,
                            };
                            this.parentClassifyOptions=[];
                        })

                    }else if(fun=='edit'){
                        let classifyType =0
                         
                        if(type==3||type==4){
                            classifyType =1
                        }
                         let parentClassifyId = _.last(this.ruleForm.parentClassifyId);
                        // let parentClassifyIdArr =this.ruleForm.parentClassifyId
                        // if(Array.isArray(parentClassifyIdArr)){
                        //     if(parentClassifyIdArr.length==1){
                        //         parentClassifyId=parentClassifyIdArr[0]
                        //     }else if(parentClassifyIdArr.length>1){
                        //         parentClassifyId=parentClassifyIdArr[parentClassifyIdArr.length-1]
                        //     }
                        // }

                        // if(parentClassifyId===null){
                        //     parentClassifyId =0
                        // }
                        // if(parentClassifyId===this.ruleForm.classifyId){
                        //     this.$message.warning('父类与子类不能相同');
                        //     return
                        // }
						
						// :rules="[
						//  { required: true, message: '请输入'+parentClassifyIdLabel, trigger: 'blur' },
						// ]"
						
                        this.$api["taskClassifyUpdate"]({
                            parentClassifyId,
                            // classifyId:_.last(this.ruleForm.parentClassifyId),
                            classifyId:this.ruleForm.classifyId,
                            classifyName:this.ruleForm.classifyName
                        }).then(res => {
                            if(res.code==0){
                                // this.getTaskClassifyList(classifyType,false)
                                this.$emit('reloadTree',{classifyType,flag:false});
                                this.ruleForm={
                                    parentClassifyId:[],
                                    classifyId:null,
                                    platformId:this.platformId,
                                    siteId:null,
                                    sellerId:null,
                                    classifyType:null,
                                    classifyName:null,
                                };
                                this.parentClassifyOptions=[];
                            }
                            
                        })
                    }else if(fun=='move'){
                        let multipleSelection =this.multipleSelection
                        let taskIds =[]
                        multipleSelection.forEach(element => {
                            taskIds.push(element.taskId)
                        });
                       
                        // if(multipleSelection.length!==1){
                        //     this.$message.warning('不支持批量移动');
                        //     return
                        // }
                        
                        this.$api["taskReviewContentUpdateClassifyId"]({
                            taskIds,
                            classifyId:_.last(this.ruleForm.parentClassifyId),
                            // parentClassifyId:_.last(this.ruleForm.parentClassifyId),
                            // classifyId:multipleSelection[0].classifyId,
                            // classifyName:this.ruleForm.classifyName
                        }).then(res => {
                            if(res.code==0){
                                this.$emit('reloadList');
                                // this.getList()
                                // this.getTaskClassifyList(classifyType)
                                this.ruleForm={
                                    parentClassifyId:[],
                                    classifyId:null,
                                    platformId:this.platformId,
                                    siteId:null,
                                    sellerId:null,
                                    classifyType:null,
                                    classifyName:null,
                                };
                                this.parentClassifyOptions=[];
                            }
                            
                        })
                    }
                    this.options.visible =false;
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
    },
    created(){
        this.ruleForm.platformId=this.platformId
    }

}
</script>
<style lang="less" scoped>
    .options-form{
        .el-form-item__content{
            .el-input,
            .el-cascader{
                width: 100%;
            }
        }
    } 
</style>
