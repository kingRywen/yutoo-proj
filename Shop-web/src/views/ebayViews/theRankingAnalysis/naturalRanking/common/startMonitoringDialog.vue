<template>
<!-- 开启监控 -->
    <div>
         <yt-form ref="form" label-width="120px" :fields="activeFields" :formData="formData"></yt-form>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            formData: {},
            activeFields:[
                {
                    label: '抓取页数',
                    name: 'searchPages',
                    span: 24,
                    type:"input",
                    required: true,
                    type: 'select',
                    options:[
                        {value:1,label:1},
                        {value:2,label:2},
                        {value:3,label:3},
                        {value:4,label:4},
                        {value:5,label:5},
                        {value:6,label:6},
                        {value:7,label:7},
                        {value:8,label:8},
                        {value:9,label:9},
                        {value:10,label:10},
                    ],
                    required: true
                },
                {
                    label: '选择监控时间',
                    name: 'time',
                    span: 24,
                    type:"dateRange",
                    required: true,
                    width:328,
                    pickerOptions:{
                        disabledDate(time) {
                            return time.getTime() < Date.now() -24*3600*1000;
                        },
                    }
                },
                {
                    label: '监控间隔时间',
                    name: 'frequency',
                    span: 24,
                    type:"input",
                    required: true,
                    type: 'number',
                    min: 11,
                    required: true
                },
            ]
        };
    },
    methods: {
        //修改时数据色回显
        _initData(){
           //console.log(this.params.datas);
           if(this.params.datas){
               this.formData.time=[this.params.datas.monitorFrom,this.params.datas.monitorTo];
               this.formData.frequency=this.params.datas.frequency;
               this.formData.searchPages=this.params.datas.searchPages;
            //    console.log(this.params.frequency);
            //    console.log(this.formData.frequency);
           }
        },
        _submit() {
            return this.$refs.form.validate().then(()=>{
                let datas={};
                datas.taskIds=this.params.taskIds;
                datas.frequency=this.formData.frequency;
                datas.monitorFrom=this.formData.time[0];
                datas.monitorTo=this.formData.time[1];
                datas.searchPages=this.formData.searchPages;
                return this.$api[this.params.url](datas).then();
            })
        },
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>
