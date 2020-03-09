<template>
    <div class='titleRule'>
        <MainLayout
            :edit-btns="edits"
            :searchFields="searchFields"
            :searchData="searchData"
            :right-edit-btns="editBtns"
            :columns="columns"
            :leftTree='leftTree'
            :treeTable="treeTable"
            :topBatchBtn='topBatchData'
            :searchFunc="searchFunc"
            :treeTableOtions="treeTableOtions"
            @selectChange='selectChange'
            ref="layout"
            url="product/PrConfigTitleWordList"
            @left-batch-change='leftBatchChange'
        >
        </MainLayout>
    </div>
</template>

<script>
import { Promise } from 'q';
import { setTimeout } from 'timers';
export default {
    props:['languageId'],
    data() {
        let vm = this
        return {
            treeTable:false,
            treeTableOtions:{},
            leftTree:{
                showCheckbox:true,
                checkStrictly:true,
                showClassName:true,
                props: {
                    label: 'systemCategoryName',
                    children: 'titleWordGroupArray',
                    isLeaf: 'leaf',
                    num:'quantity'
                },
                topHandle:[
                    {
                        icon:"el-icon-refresh",
                        content:'刷新',
                        fn:()=>{
                            return this.refreshTree()
                        }
                    },
                    {
                        icon:"el-icon-plus",
                        content:'全局添加标题分组',
                        fn:()=>{
                            return this.addTitle()
                        }
                    },
                    {
                        icon:"el-icon-delete",
                        content:"全局删除标题分组",
                        fn:()=>{
                            return this.deleteTitle()
                        }
                    }
                ],
                dataFn(data) {
                    //console.log(data);
                    let { titleWordGroupFlag } = data
                    vm.treeClick(data)
                    if ( titleWordGroupFlag ) {
                        return { 
                            systemCategoryId: data.parentId ,
                            titleWordGroupId: data.systemCategoryId 
                        }
                        
                    } else {
                        return ''
                    }
                },
                // dataPromise:()=>{
                //     return this.getTreeData()
                // },
                loadNode(node, resolve) {
                    //console.log(node);
                    if (node.level === 0) {
                        vm.getTreeData(0).then(res=>{
                            return resolve(res)
                        }).catch(err=>{
                            return resolve([])
                        })
                    }
                    if (node.level >= 1) {
                        if(node.data.childFlag !== 1){
                            vm.getTreeData(node.data.systemCategoryId).then(res=>{
                                return resolve(res)
                            }).catch(err=>{
                                return resolve([])
                            })
                        }
                    }

                 }
            },
            edits:[
                {
                    name: '编辑',
                    icon: 'el-icon-edit-outline',
                    show: scope => {
                        return true //scope.row.productStatus === 1
                    },
                    fn: (scope) => {
                      this.$refs.layout.$dialog({
                            title: '编辑',
                            width: '1000px',
                            params:{
                                type:'edit',
                                titleWordId:scope.row.titleWordId
                            },
                            component: () => import('./dialogs/add.vue'),
                            okBtnText: '确认',
                            cancelBtnText: '取消'
                        })
                    }
                },
                {
                    name: '删除',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.deleteItem(scope.row.titleWordId)
                    }
                },
            ],
            searchFields:{
                // activateFlag: {
                //     widget: 'select',
                //     label: '是否激活',
                //     options:[
                //         {label:"是",value:1},
                //         {label:"否",value:0},
                //     ], 
                //     span: 8
                // },
                datetime: {
                    // hidden: true,
                    widget: 'daterange',
                    label: '创建时间',
                    time: true, // 是否显示时间
                    span: 8,
                    width:300
                },
                userName:{
                    hidden: true,
                    widget: 'input',
                    label: '添加人员',
                    span: 8,
                }
            },
            searchData:{},
            editBtns:[
                {
                    name: '添加',
                    perm: 'add',
                    fn: () => {
                        let idArray = this.$refs.layout.$refs.tree.getCheckedNodes()
                        let {systemCategoryId} = this.currentTreeData 
                     
                        if ( ( !systemCategoryId && systemCategoryId!==0 ) && ( !idArray.length || idArray.length>1) ) {
                            this.$message.warning('请点击或勾选一项要添加的词库组')
                            return
                        }
                        if (idArray.length === 1) {
                            this.addWordItem(idArray)
                        } else {
                             this.addWordItem([this.currentTreeData])
                        }
                        
                       
                    }
                }
            ],
            columns:[
                {
                    label: '名称',
                    value: 'word',
                    minWidth: 150
                },
                // {
                //     label: '是否激活',
                //     value: 'activateFlag',
                //     minWidth: 150,
                //     _enum:{
                //         0:'否',
                //         1:'是'
                //     }
                // },
                {
                    label: '添加人员',
                    value: 'userName',
                    minWidth: 150
                },
                {
                    label: '添加日期',
                    value: 'createTime',
                    sortable:'custom',
                    minWidth: 150
                },
            ],
            topBatchData:{
                title:'删除',
                props: {
                    label: 'label',
                    value: 'value',
                    expandTrigger: 'hover'
                },
                options: [
                    {label: '删除',value:0},
                ],
                // 搜索
                search: {
                    field: 'keyword',
                    placeholder: '请输入名称'
                }
            },

            currentTreeData: {},//当前点击节点的数据
            selctIds:[]
        };
    },
    methods: {
        addWordItem(idArray){
            this.$refs.layout.$dialog({
                title: '添加',
                width: '1000px',
                params:{
                    systemCategoryId : idArray[0].parentId,
                    titleWordGroupId : idArray[0].systemCategoryId,
                    languageId:this.languageId,
                    type:'add',
                },
                component: () => import('./dialogs/add.vue'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        selectChange(v){
            console.log(v);
            this.selctIds = v.map(i=>{
                return i.titleWordId
            })
        },
        leftBatchChange(v){
            //console.log(v);
            this.deleteItem(this.selctIds)
        },
        treeClick(data){
            //console.log(data);
            this.currentTreeData = data
        },
        //删除一项
        deleteItem(v){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idArray = Array.isArray(v) ? v : [v]
                this.$api[`product/PrConfigTitleWordRemove`]({
                    idArray
                }).then(res=>{
                    this.getLayoutList()
                })
            })
        },
        searchFunc(data){
            let {datetime,...info}=data;
            let [queryCreateStartTime,queryCreateEndTime] = datetime || [];
            let languageId = this.languageId
            let systemCategoryId = this.currentTreeData.parentId 
            let titleWordGroupId = this.currentTreeData.systemCategoryId 
            return {queryCreateStartTime,queryCreateEndTime,languageId,systemCategoryId,titleWordGroupId,...info}
        },
        async refreshTree(){
            this.$refs.layout.leftTreeData = []
            this.currentTreeData = {}
            let res = await this.getTreeData(0)
            this.$refs.layout.leftTreeData = res
        },
        //左侧树形添加
        addTitle(){
            //console.log(7);
            this.$refs.layout.$dialog({
                title: '添加标题组',
                width: '1000px',
                params:{
                   fn:this.refreshTree
                },
                component: () => import('./dialogs/addTree.vue'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        //左侧树形删除
        deleteTitle(){
            let idArray = this.$refs.layout.$refs.tree.getCheckedNodes()
            if(!idArray.length){
                this.$message.warning('请选择要删除的项')
                return
            }
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api[`product/PrConfigTitleWordGroupRemove`]({
                    idArray
                }).then(res=>{
                    this.getLayoutList()
                })
            })
        },
        getTreeData(v){
            return this.$api[`product/CateSystemCategoryTreeTitleWord`]({
                id:v,
                languageId: this.languageId
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                rows.forEach(i=>{
                    if(i.childFlag === 1){
                        i.leaf = true
                    }else{
                        i.leaf = false
                    };
                    if( i.titleWordGroupFlag !== 1){
                        i.disabled = true
                    }   
                });
                //第一次进来
                // if(this.currentTreeData === null){
                //     this.currentTreeData = rows[0]
                   
                // }
                //影藏不能选择的树形的选择框
                setTimeout(() => {
                    let parent  = this.$refs.layout.$refs.tree.treeItems
                    let arr = []
                    parent.forEach( i=> {
                        let is = i.querySelectorAll('.el-checkbox .is-disabled')
                        is.forEach( k => {
                            arr.push(k)
                        })
                    })
                    arr.forEach( k => {
                        k.style.display = 'none'
                    })
                })

                return rows
            })
        },
    },
    created() {
        
    },
    watch:{
        languageId(){
            this.refreshTree()
        }
    },
};
</script>

<style scoped lang="scss">

</style>
