<template>
    <div class="box">
        <div class="water-fall" v-if="tableList!==null" 
            v-loading="boxLoading"
            :key='boxKey'>
            <div v-for="item in list" class="item">
                <div class="table-title">{{getDataType(item.dataType)}}</div>
                <el-table
                    :data="item.list"
                    style="width: 100%"
                    border
                    tooltip-effect="light"
                    stripe>
                    <el-table-column
                        prop="range"
                        label="区间"
                        min-width="120"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="productCnt"
                        label="产品数"
                        width="100">
                    </el-table-column>        
                </el-table>
            </div>
        </div>
        <div class="no-data">{{noData}}</div>
    </div>
</template>
<script>
const _ =require('lodash')
export default {
    props: ["pQuerys"],
    data(){
        return{
            boxKey: 0,
            boxLoading: false,
            tableList:[],
            list:[],
            noData:null
        }   
    },
    watch: {
        boxLoading(val) {
            this.$emit('loading', val)
        }
    },
    
    methods:{
        getDataType(dataType){
            let arr = _.filter(this.pQuerys.columnOptions, function(o) { return o.value==dataType });
            if(arr.length===1){
                return arr[0].label
            }
            return '';
        },

        handleFilter(params){
            if(params!==null){
                let {columnTypes} =params
                let query =_.cloneDeep(params)
                query.parentAsins =_.remove(query.parentAsins, function(n) {
                    return n!=='ALL_SELECT';
                });
                delete query.columnTypes

                if(query.parentAsins.length==0){
                    query.parentAsins= null
                }
                this.boxLoading = true
                this.$api["krDataStatList"](query).then(res => {
                    let {code,data} =res
                    if(code==0){
                        let list =[]
                        columnTypes.forEach(element => {
                            data.forEach(el => {
                               if(element==el.dataType){
                                   if(el.dataType==12||el.dataType==13){
                                       el.list.forEach(elist => {
                                           if(elist.range==0){
                                               elist.range ='全部出现(紧密相连)'
                                           }else if(elist.range==1){
                                               elist.range ='全部出现(非紧密相连)'
                                           }else if(elist.range==2){
                                               elist.range ='部分出现'
                                           }else if(elist.range==3){
                                               elist.range ='未出现'
                                           }else{
                                               elist.range ='-'
                                           }
                                       }); 
                                       list.push(el)
                                   }else if(el.dataType==9){
                                       el.list.forEach(elist => {
                                           let arr =elist.range.split("~")
                                           if(arr.length==2){
                                               elist.range =`${this.toPercent(arr[0])}~${this.toPercent(arr[1])}`
                                           }else if(arr.length==1){
                                               elist.range =`${this.toPercent(arr[0])}`
                                           }else{
                                               elist.range ='-'
                                           }
                                       }); 
                                       list.push(el)
                                   }else if(el.dataType==16){
                                       el.list.forEach(elist => {
                                           if(elist.range==0){
                                               elist.range ='自发货'
                                           }else if(elist.range==1){
                                               elist.range ='FBA'
                                           }else if(elist.range==2){
                                               elist.range ='自发货+FBA'
                                           }else{
                                               elist.range ='-'
                                           }
                                       }); 
                                       list.push(el)
                                   }else{
                                       list.push(el)
                                   }
                               }
                            });
                        });
                        this.tableList =data
                        this.list =list

                        if(data.length==0){
                            this.noData='暂无数据'
                        }else{
                            this.noData=null
                        }
                    }else{
                        this.tableList =[]
                        this.list =[]
                        this.noData='暂无数据'
                    }
                    
                    setTimeout(() => {
                        this.boxLoading = false
                    }, 500)
                }).catch(error => {
                   this.boxLoading = false
                });
            }
            let columnMap =new Map()
            this.pQuerys.columnOptions.forEach(element => {
                columnMap.set(element.value,element.label)
            });
            console.log(columnMap)
        },
        toPercent(point) {
            if (isNaN(point) || point == 0) {
                return '0%'
            }

            let str = Number(point * 100).toFixed()//保留两位小数 toFixed(2)
            str += '%'
            return str
        },
        setColumnTypes(val){
            let valTmp =_.cloneDeep(val)
            let selList =_.remove(valTmp, function(n) {return n!=='ALL_SELECT';});
            if(selList.length>0){
                let listTmp =_.cloneDeep(this.tableList)
                let list =[]
                selList.forEach(element => {
                    listTmp.forEach(el => {
                        if(element==el.dataType){
                            list.push(el)
                        }
                    });
                });
                 this.list =list
                
            }else{
                this.list =[]
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .box{

    
    .water-fall {
            width: 100%;
            column-gap:10px;
            column-count: 3;
            margin: 0 auto;

            .table-title{
                border-right: 1px solid @borderColor;
                border-left: 1px solid @borderColor;
                border-top: 1px solid @borderColor;
                padding: 10px;
                font-size: 14px;
                    background: #f5f5f5;
            }

            .item {
                break-inside: avoid;
                margin-bottom: 10px;
            }
        }
       
        @media (min-width: 992px) and (max-width: 1300px) {
            .water-fall {
                column-count: 3;
            }
        }

        @media (min-width: 768px) and (max-width: 991px) {
            .water-fall {
                column-count: 2;
            }
        }

        @media (max-width: 767px) {
            .water-fall {
                column-count: 1;
            }
        }
        .no-data{
            font-size:14px;
            color:#909399;
            display: flex;
            justify-content: center;
        }
    }
</style>
