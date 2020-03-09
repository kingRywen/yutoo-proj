<template>
    <div>
        <div style='padding-bottom:20px;position:relative;'>
            <el-button style="margin-left: 5px;width:70px;" size="mini" type="primary" @click="exportMethod" plain>导出</el-button>
            <!-- <ElButton  type="text" icon="el-icon-back" style='position:absolute;right:11px;top:-4px;' @click='goBack'>返回</ElButton> -->
        </div>
        <YtTable :data='datas' :columns='columns' v-loading="tableLoading" @sortChange="sortChange" @selectChange='selectChange' :border='true'></YtTable>
        <el-pagination background v-if="total" :total="total" :current-page="pageNumber" :page-size="pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange" class="pagination" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    data() {
        let vm=this;
        return {
            columns:[
                {
                    label: "序号",
                    value: "buyerName",
                    minWidth: 80,
                    render(h,scope){
                        return (
                            <span>{ (vm.pageNumber-1)*vm.pageSize+scope.$index+1}</span>
                        )
                    }
                },
                {
                    label: "买家姓名",
                    value: "buyerName",
                    minWidth: 150
                },
                {
                    label: "买家邮箱",
                    value: "buyerEmail",
                    minWidth: 150
                },
                {
                    label: "购买次数",
                    value: "count",
                    minWidth: 150,
                    sortable:"custom"
                },
                {
                    label: "单次购买均价",
                    value: "priceAvg",
                    minWidth: 150,
                    sortable:"custom"
                },
                {
                    label: "平均间隔时间",
                    value: "intervalTime",
                    minWidth: 150,
                    sortable:"custom"
                },
            ],

            params:"",//路由传过传过来的数据

            //表格数据
            datas:[],
            pageSize: 10,
            pageNumber: 1,
            total: 0,
            tableLoading: false,
            sort:null,
            sortField:null,

            selectIDS:'',//勾选客户邮箱数组
            exportName:"",//导出文件名字
            exportPath:"",//导出地址

        };
    },

    methods: {
        //返回按钮
        goBack(){
            this.$router.go(-1)
        },
        //导出
        exportMethod(){
            if(this.$route.query.type===1){  //老客户分析
                let {sellerId,siteId ,startTime,endTime,parentSkus,pageSize,pageNumber}=this.params;
                let data={ sellerId,siteId ,startTime,endTime,parentSkus,pageSize,pageNumber };
                if(this.exportPath==='salesShopDayOldCustCountExport'){  //'成交统计-重复购买次数-客户 导出',
                    data.minBuyQty=this.params['minBuyQty'];
                    data.maxBuyQty=this.params['maxBuyQty'];
                }else if(this.exportPath==='salesShopDayOldCustPriceExport'){ //'成交统计-客户平均单价-客户 导出',
                    data.minPrice=this.params['minPrice'];
                    data.maxPrice=this.params['maxPrice'];
                }else if(this.exportPath==='salesShopDayOldCustTimeExport'){ //成交统计-重复购买间隔时间-客户 导出
                    data.minDays=this.params['minDays'];
                    data.maxDays=this.params['maxDays'];
                };

                if(this.selectIDS.length){
                    data.emails=this.selectIDS
                };
                this.$api[this.exportPath](
                    data
                )
                .then(data => {
                    downloadFile(data,this.$route.query.name)
                }).catch(() => {})

            }else{  //老客户分布
                let {sellerId,siteId ,startTime,endTime,parentSkus,pageSize,pageNumber}=this.params;
                let  data={sellerId,siteId ,startTime,endTime,parentSkus,pageSize,pageNumber};
                if(this.exportPath==='salesShopDayOldCustCountryExport'){ //'成交统计-国家-客户 导出'
                    data.countryCode=this.params['countryCode'];
                }else if(this.exportPath==='salesShopDayOldCustStateExport'){ //'成交统计-州-客户 导出',
                    data.countryCode=this.params['countryCode'];
                    data.state=this.params['state'];
                }else if(this.exportPath==='salesShopDayOldCustCityExport'){//'成交统计-城市-客户 导出',
					 data.countryCode=this.params['countryCode'];
                     data.state=this.params['state'];
                     data.city=this.params['city'];
                };
                if(this.selectIDS.length){
                    data.emails=this.selectIDS
                };
                this.$api[this.exportPath](
                    data
                )
                .then(data => {
                    downloadFile(data,this.$route.query.name)
                }).catch(() => {})

            };

            
        },
        //表格勾选改变
        selectChange(v){
            //console.log(v);
            this.selectIDS=v.map(i=>{
                return i.buyerEmail
            });
        },
        //排序改变
        sortChange({ column, prop, order }) {
            //console.log({ column, prop, order });
        
            let params = this.sortableFunc(column, prop, order);
            console.log(params);
            this.sort=params.sort;
            this.sortField=params.sortField;
            this.pageNumber=1;
            this.getList();
        },
        //排序参数处理
       sortableFunc(column, prop, order ){
            console.log( column, prop, order );
            let pro = prop.replace(/[A-Z]/g, function (match) {
                return '_' + match.toLowerCase()
            })
            return {
                sort: order === 'ascending' ? 1 : 0,
                sortField: pro
            }
        },
        // 分页 pageNo变化
        handleCurrentChange(val) {
            this.pageNumber = val;
            this.getList();
        },
        // 分页 pageSize变化
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList();
        },
        getList(){
            this.tableLoading=true;
            if( this.pageNumber){
                this.params.pageNumber= this.pageNumber;
            };
            if( this.pageSize){
                this.params.pageSize= this.pageSize;
            };
            if( this.sort || this.sort===0){
                this.params.sort= this.sort;
            }else{
                 this.params.sort= null;
            };
            if( this.sortField){
                this.params.sortField= this.sortField;
            }else{
                 this.params.sortField= null;
            };
            this.$api[this.URL](this.params)
                .then(data => {
                    this.tableLoading=false;
                    let rows = data.rows;
                    this.datas = rows;
                    this.total=data.total;
                })
                .catch(err => {
                // console.log(err, "errs");
                  this.tableLoading=false;
                
                });
        }
    },
    created() {
        // this.cumData.rows=this.$route.params.rows;
        this.params={...this.$route.query};
        this.URL=this.$route.query.Listpath;//列表请求地址
        this.exportName=this.$route.query.exportName;
        this.exportPath=this.$route.query.exportPath;
        
        console.log(this.params);

        // if( !this.params.sellerId){
        //     this.$router.go(-1)
        // };
        this.getList();
    },
};
</script>

<style scoped lang="less">

</style>
