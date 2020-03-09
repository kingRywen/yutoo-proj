<template>
    <div>
        <CustomTable v-model="selectData"  :columns="columns" :searchConfig="searchConfig" @searchForm='searchForm' :tableData='tableData' v-loading='tableLoading' />
        <Dialog :opts='opts' :events='addEvents' :validate='validate'>
            <Remark  v-if='opts.visible' ref='RemarkDialog' :productRepoIds='productRepoIds' :produceStatus='produceStatus' />
        </Dialog>
    </div>
</template>

<script>
export default {
    components:{
        CustomTable:()=>import('../../../components/customTable/src/index'),
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        Remark:()=>import('./dialogs/remark'),
    },
    props:['productRepoId'],
    data() {
        return {
            selectData: [],
            tableData:[],
            columns:[],
            tableLoading:false,
            searchConfig: [
                {
                    type: "dropDowm",
                    btns: [
                        {
                            name: "正常",
                            fn:(val) =>{
                                console.log(val);
                                let productRepoId = val.map(i=>i.productRepoId)
                                this.opts.visible = true
                                this.productRepoIds = productRepoId
                                this.produceStatus = 0
                            }
                        },
                        {
                            name: "停产",
                            fn:(val)=> {
                                let productRepoId = val.map(i=>i.productRepoId)
                                this.opts.visible = true
                                this.productRepoIds = productRepoId
                                this.produceStatus = 1
                            }
                        },
                        {
                            name: "缺货",
                            fn:(val) =>{
                                let productRepoId = val.map(i=>i.productRepoId)
                                this.opts.visible = true
                                this.productRepoIds = productRepoId
                                this.produceStatus = 2
                            }
                        },
                    ],
                },
                {
                    type: "input",
                    value: "search",
                },
                {
                    value: "status",
                    type: "select",
                    children: [
                        {label:'正常',value:0},
                        {label:'缺货',value:2},
                        {label:'停产',value:1},
                    ]
                },
            ],

            searchFormData:'',

            opts:{
                visible:false,
                fullscreen:false,
                appendToBody:true,
                title:'添加备注',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                size:'small'
            },
            addEvents:{
                handleOkClick:()=>{
                    return  this.$refs.RemarkDialog.changeStatus().then((res)=>{
                        this.getData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate:()=>{
                return this.$refs.RemarkDialog.Validate()
            },

            productRepoIds:'',
            produceStatus:"",


        };
    },
    methods: {
        getData(){
            this.tableLoading = true
            this.$api[`product/prProductRepoPurchaseVariantGet`]({
                productRepoId :this.productRepoId,
                ...this.searchFormData
            })
            .then((data) => {
                this.tableLoading = false
                let {rows} = data
                let {title,list} = rows
                this.columns= [
                    {
                        label: "系统SKU",
                        value: "sysSku"
                    },
                    {
                        label: "仓库SKU",
                        value: "repoSku"
                    },
                    {
                        label: "状态",
                        value: "statusName",
                    },
                    {
                        label: "备注",
                        value: "remark",
                    
                    },
                    {
                        label: "操作",
                        width:'160px',
                        btns: [
                            {
                                type: "dropdown",
                                name: "正常",
                                fn:(index, row) =>{
                                    ///console.log(index, row);
                                    let {productRepoId} = row
                                    this.opts.visible = true
                                    this.productRepoIds = [productRepoId]
                                    this.produceStatus = 0
                                },
                                children: [
                                    {
                                        name: "缺货",
                                        fn:(index, row)=> {
                                            let {productRepoId} = row
                                            this.opts.visible = true
                                            this.productRepoIds = [productRepoId]
                                            this.produceStatus = 2
                                        }
                                    },
                                    {
                                        name: "停产",
                                        fn:(index, row) =>{
                                            let {productRepoId} = row
                                            this.opts.visible = true
                                            this.productRepoIds = [productRepoId]
                                            this.produceStatus = 1
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ];
                title.forEach(i=>{
                    this.columns.splice(2,0,{
                        label:i.propertyName,
                        value:i.propertyName + i.categoryPropertyId 
                    })
                })
                list.forEach(i=>{
                    i.variantPropertyList.forEach(k=>{
                        let key = k.propertyName + k.categoryPropertyId 
                        i[key] = k.propertyValue
                    })
                })
                this.tableData = list
            })
        },
        searchForm(v){
            this.searchFormData = v
            this.getData()
        },
    },
    created() {
        this.getData()
    },
};
</script>

<style scoped lang="scss">
</style>
