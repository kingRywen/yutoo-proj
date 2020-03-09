<template lang="html">
    <div class="time">
        <!--  -->
        <el-button v-if="show" size="mini" plain type="success" @click="getWeekTime">近 7 天</el-button>
        <!--  -->
        <el-select v-if="!show" v-model="selectTime.day" size="mini" style="width:72px;">
            <el-option v-for="item in dayList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        <!--  -->
        <el-date-picker
            @change="changeTime"
            value-format='yyyy-MM-dd'
            size="mini"
            v-model="selectTime.arr"
            type="daterange"
            align="left"
            unlink-panels
            :clearable="false"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="width:204px;">
        </el-date-picker>
        <!--  -->
    </div>
</template>

<script>
 // function getLastYearYestdy(date){
 //     var strYear = date.getFullYear() - 1;
 //     var strDay = date.getDate();
 //     var strMonth = date.getMonth()+1;
 //
 //     if(strMonth<10)
 //     {
 //        strMonth="0"+strMonth;
 //     }
 //     if(strDay<10)
 //     {
 //        strDay="0"+strDay;
 //     }
 //     var  datastr = strYear+"-"+strMonth+"-"+strDay;
 //     return datastr;
 //  }
 //
 //  var beforeTime = getLastYearYestdy(new Date());
 //
 //  var ms = new Date(beforeTime).getTime()
 //  var day = new Date()*1 - new Date(beforeTime)*1
 //
 //  console.log(parseInt(day/86400000))
export default {
      data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    let curDate = (new Date()).getTime();
                    let three = 365 * 24 * 3600 * 1000;
                    let threeMonths = curDate - three;
                    return time.getTime() > Date.now() || time.getTime() < threeMonths;;
                },
                  shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近三个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }]
            },
            selectTime: {
              day: "",
              arr: []
            },
            dayList: [
                {value: 0,label: '按日'},
                {value: 1,label: '按周'},
                {value: 2,label: '按月'}
            ],
            title:null,
        }
    },
    methods:{
        //获取今天时间
        getDate(){
            let date=new Date();
            let year = date.getFullYear();   //获取当前年份
            let mon = date.getMonth()+1;     //获取当前月份
            let day = date.getDate();         //获取当前日
            return year+'-'+ (mon < 10 ?('0'+ mon) : mon ) + '-' + (day < 10 ?('0'+ day):day);
        },
        //获取多少天以前的时间
        getBeforeTime(n){
            var n = n;
            var d = new Date();
            var year = d.getFullYear();
            var mon = d.getMonth() + 1;
            var day = d.getDate();
            if(day <= n) {
                if(mon > 1) {
                    mon = mon - 1;
                } else {
                    year = year - 1;
                    mon = 12;
                }
            }
            d.setDate(d.getDate() - n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();
            return year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
        },
        //计算本月有多少天
        getCountDays() {
            var curDate = new Date();
            var curMonth = curDate.getMonth();
            curDate.setMonth(curMonth + 1);
            curDate.setDate(0);
            return curDate.getDate();
        },
        //如果渲染的是近7天
        getWeekTime(){
            this.title  = "近7天"
            this.selectTime.arr = [];
            this.selectTime.arr.push(this.getBeforeTime(6),this.getDate());
            this.sendTime({
                minDate:this.selectTime.arr[0],
                maxDate:this.selectTime.arr[1],
            })

            this.$emit('setTitle',"商品销量分布-"+this.title) //商品自定义
            this.$emit('setshopTitle',"店铺销量分布-"+this.title)  //店铺自定义
        },
        //其他时间段改变时
        changeTime(arr){
            this.title = "从"+arr[0]+"到" + arr[1]

            if(arr !== null && arr.length){
                let obj = {
                    minDate:arr[0],
                    maxDate:arr[1],
                    displayType:this.selectTime.day,

                }
                this.$emit('setTitle',"商品销量分布-"+this.title) //商品自定义
                this.$emit('setshopTitle',"店铺销量分布-"+this.title)  //店铺自定义
                this.sendTime(obj)
            }
        },
        sendTime(time){
            this.$emit('pieTime',time)
        },
    },
    mounted(){
        this.selectTime.day = 0;
        this.selectTime.arr.push(this.getBeforeTime(6) ,this.getDate())
    },
    watch:{
        ['selectTime.day'](val){

            let obj = {
                "minDate": this.selectTime.arr[0],
                "maxDate":this.selectTime.arr[1],
                "displayType":val
            }
            this.sendTime(obj);
        },
    },
    props:{
        show:{
            type:Boolean,
            default:true
        }
    }
}
</script>

<style lang="scss">


</style>
