<template>
    <div>
        <MainLayout
            :edit-btns="edits"
            :searchFields="searchFields"
            :searchData="searchData"
            :right-edit-btns="editBtns"
            :columns="columns"
            :leftTree='false'
            :treeTable="treeTable"
            :topBatchBtn='topBatchData'
            :searchFunc="searchFunc"
            :treeTableOtions="treeTableOtions"
            @selectChange='selectChange'
            ref="layout"
            url="product/PrConfigSensitiveWordMList"
            @left-batch-change='leftBatchChange'
        >
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile2} from 'Utils/tools';
export default {
    data() {
        return {
            treeTable:false,
            treeTableOtions:{},
            searchData:{},
            edits:[
                 {
                    name: '编辑',
                    icon: 'el-icon-edit-outline',
                    show: scope => {
                        return true //scope.row.productStatus === 1
                    },
                    fn: (scope) => {
                        console.log(scope.row);
                      this.$refs.layout.$dialog({
                            title: '编辑',
                            width: '1000px',
                            params:{
                                type:'edit',
                                sensitiveWordId:scope.row.sensitiveWordId
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
                        return this.deleteItem(scope.row.sensitiveWordId)
                    }
                },
            ],
            searchFields:{
                keyFlag: {
                    widget: 'select',
                    labelWidth:'44px',
                    label: '类型',
                    options: () =>{ 
                        return this.getTypeOpt().then(res=>{
                            return res
                        }).catch(err=>{
                            return []
                        })
                    }, 
                    span: 8
                },
                datetime: {
                    hidden: true,
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
                },
                configConfigSensitiveDesc:{
                    hidden: true,
                    widget: 'input',
                    label: '备注',
                    span: 8,
                }
            },
            editBtns:[
                {
                    name: '添加敏感关键词',
                    perm: 'add',
                    fn: (scope) => {
                        this.$refs.layout.$dialog({
                            title: '添加',
                            width: '1000px',
                            params:{
                               //sensitiveWordTypeId:scope.row.sensitiveWordId
                            },
                            component: () => import('./dialogs/add.vue'),
                            okBtnText: '确认',
                            cancelBtnText: '取消'
                        })
                    }
                }
            ],
            columns:[
                {
                    label: '关键词名称',
                    value: 'word',
                    minWidth: 150,
                    showTooltip:true
                },
                {
                    label: '类型',
                    value: 'sensitiveWordTypeName',
                    minWidth: 150
                },
                {
                    label: '添加日期',
                    value: 'createTime',
                    minWidth: 150,
                    sortable:'custom'
                },
                {
                    label: '添加人员',
                    value: 'userName',
                    minWidth: 150
                },
                {
                    label: '备注',
                    value: 'configConfigSensitiveDesc',
                    minWidth: 150
                },

            ],
            topBatchData:{
                title:'关键词',
                props: {
                    label: 'label',
                    value: 'value',
                    expandTrigger: 'hover'
                },
                options: [
                    {label: '删除',value:0},
                    {label: '导出',value:1},
                ],
                // 搜索
                search: {
                    field: 'keyword',
                    placeholder: '请输入名称'
                }
            },


            selctIds:[]
        };
    },
    methods: {
        selectChange(v){
            // console.log(v);
            this.selctIds = v.map(i=>{
                return i.sensitiveWordId
            })
        },
        leftBatchChange(v){
            //console.log(v);
            let val = v[0]
            switch(val){
                case 0:
                    this.deleteItem(this.selctIds)
                break;
                case 1:
                    this.exportData()
                break;
                default:
                break;

            }
        },
        exportData(){
            this.$api[`product/PrConfigSensitiveWordMExportData`]({

            })
            .then((data) => {
                console.log(data);
                let {path} = data
                console.log(path);
                downloadFile2(path, '敏感关键词管理'+'.xls')
            })
        },
        searchFunc(data){
            let {datetime,keyFlag,...info}=data;
            let [queryCreateStartTime,queryCreateEndTime] =datetime || [];
            let  sensitiveWordTypeId = keyFlag ? keyFlag.split('+')[0] : null
            let  sensitiveWordTypeFlag = keyFlag ? keyFlag.split('+')[1] : null
            return {queryCreateStartTime,queryCreateEndTime,sensitiveWordTypeFlag,sensitiveWordTypeId,...info}
        },
        //获取筛选条件的下拉
        getTypeOpt(){
            return this.$api[`product/PrConfigSensitiveWordTypeMDropDown`]()
            .then((data) => {
                console.log(data);
                let { rows} = data
                rows.forEach(i=>{
                    i.mixVal = i.key + "+" +i.flag
                })
                let arr = rows.map(i=>{
                    return {label:i.value,value:i.mixVal}
                })
                //console.log(arr);
                return  Promise.resolve(arr)
            })
        },
        deleteItem(v){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idArray = Array.isArray(v) ? v : [v]
                this.$api[`product/PrConfigSensitiveWordMRemove`]({
                    idArray
                }).then(res=>{
                    this.getLayoutList()
                })
            })
        },
    },
    created() {

    },
    mounted(){
       
    }
};
</script>

<style scoped lang="scss">

</style>
