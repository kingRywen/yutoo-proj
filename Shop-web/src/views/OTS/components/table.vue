<template>
    <div>
        <el-table
            :data="datas"
            stripe
            :span-method="objectSpanMethod"
            style="width: 100%">
            <el-table-column
                prop="type"
                label=""
                width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.type===0 ? '目标' : '实际'}}</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="statTime"
                label="日期"
                min-width="200">
                <template slot-scope="scope"  width="300">
                    <span style='vertical-align: text-top;'>{{ scope.row.statTime }}</span>
                    <el-button  v-if='scope.row.type===1 && tableData.length>2 && scope.$index===1 ' type='text' class="el-icon-d-arrow-right lookMoreBtn" style='float:right;margin-right:20px;font-size:18px;' @click='lookMore($event)' ref=''></el-button>
                </template>
            </el-table-column>

            <el-table-column
                label="访客数">
                <el-table-column
                    prop="normalSessions"
                    min-width="110"
                    label="自然">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.normalSessions}}</span>
                            <span v-if='scope.row.normalSessions < tableData[0].normalSessions  '>
                                <i class='el-icon-sort-down' style='color:red;font-size:24px;margin-left:6px;vertical-align: middle;'></i>
                                <span>{{Math.ceil((tableData[0].normalSessions - scope.row.normalSessions )/tableData[0].normalSessions *10000)/100+"%" }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="adSessions"
                     min-width="110"
                    label="广告">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.adSessions}}</span>
                            <span v-if='scope.row.adSessions < tableData[0].adSessions '>
                                <i class='el-icon-sort-down' style='color:red;font-size:24px;margin-left:6px;vertical-align: middle;'></i>
                                <span>{{Math.ceil((tableData[0].adSessions - scope.row.adSessions )/tableData[0].adSessions *10000)/100+"%" }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>   
            </el-table-column>

            <el-table-column
                label="转化率">
                <el-table-column
                    prop="normalConversionRate"
                    min-width="110"
                    label="自然">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ Math.ceil(scope.row.normalConversionRate * 10000)/100+"%"}}</span>
                            <span v-if='scope.row.normalConversionRate < tableData[0].normalConversionRate '>
                                <i class='el-icon-sort-down' style='color:red;font-size:24px;margin-left:6px;vertical-align: middle;'></i>
                                <span>{{ Math.ceil((tableData[0].normalConversionRate *10000 - scope.row.normalConversionRate*10000 ) / (tableData[0].normalConversionRate *10000) *10000 )/100+"%" }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="adConversionRate"
                    min-width="110"
                    label="广告">
                    <template slot-scope="scope">
                        <div>
                            <span>{{ Math.ceil(scope.row.adConversionRate*10000)/100 +'%'}}</span>
                            <span v-if='scope.row.adConversionRate < tableData[0].adConversionRate '>
                                <i class='el-icon-sort-down' style='color:red;font-size:24px;margin-left:6px;vertical-align: middle;'></i>
                                <span>{{ Math.ceil((tableData[0].adConversionRate*10000 - scope.row.adConversionRate*10000 ) / (tableData[0].adConversionRate *10000) *10000  )/100+"%" }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>   
            </el-table-column>

            <el-table-column
                label="订单数">
                <el-table-column
                    prop="normalOrderCnt"
                     min-width="110"
                    label="自然">
                     <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.normalOrderCnt}}</span>
                            <span v-if='scope.row.normalOrderCnt < tableData[0].normalOrderCnt '>
                                <i class='el-icon-sort-down' style='color:red;font-size:24px;margin-left:6px;vertical-align: middle;'></i>
                                <span>{{Math.ceil((tableData[0].normalOrderCnt - scope.row.normalOrderCnt )/tableData[0].normalOrderCnt *10000)/100+"%" }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="adOrderCnt"
                     min-width="110"
                    label="广告">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.adOrderCnt}}</span>
                            <span v-if='scope.row.adOrderCnt < tableData[0].adOrderCnt'>
                                <i class='el-icon-sort-down' style='color:red;font-size:24px;margin-left:6px;vertical-align: middle;'></i>
                                <span>{{Math.ceil((tableData[0].adOrderCnt - scope.row.adOrderCnt )/tableData[0].adOrderCnt *10000)/100+"%" }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>   
            </el-table-column>

            <el-table-column
                prop="stageNo"
                label="目标阶段"
            >
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props:{
        tableData:{
            type:Array,
            default:()=>[]
        },

    },
    data() {
        return {
            datas:[]
        };
    },
    methods: {
        lookMore(e,type){
             this.datas=[];
            let btn = e.target;
            if(btn.classList.contains('rotate')){
                btn.classList.remove("rotate");
                this.datas= JSON.parse(JSON.stringify(this.tableData.slice(0,2)));
            }else{
                btn.classList.add("rotate");
                this.datas=JSON.parse(JSON.stringify(this.tableData));
            }
           
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
         
            // console.log(rowIndex);
            // console.log(columnIndex);
            // console.log('object');
            if (columnIndex === 8) {
                return {
                    rowspan: this.datas.length,
                    colspan: 1
                };
            }
        }
        
    },
    watch:{
        tableData:{
            immediate: true,
            handler(newName, oldName) {
               if(this.tableData.length){
                   this.datas= JSON.parse(JSON.stringify(this.tableData.slice(0,2)));
                   this.$nextTick(function(){
                       let btn = document.querySelector('.lookMoreBtn');
                       if(btn){
                           if(btn.classList.contains('rotate')){
                                btn.classList.remove("rotate");
                            }
                       }
                   })
               }
            },

        }
    }
};
</script>

<style scoped lang="less">
    .rotate{
        transform-origin: center;
        transform: rotate(90deg)
    }
</style>
