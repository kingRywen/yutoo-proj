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
                    min: 10,
                    max:1440,
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
