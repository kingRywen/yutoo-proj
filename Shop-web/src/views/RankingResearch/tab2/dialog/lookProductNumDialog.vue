<template>
    <div>
        <yt-table :columns='columns' :data='data' :selection='false'></yt-table>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            columns:[
                {
                    label: "ASIN",
                    value: "asin",
                    minWidth: 150
                },
            ],
            data:[],
        };
    },
    methods: {

    },
    created() {
        console.log(this.params);
        if( this.params.type === 'asin'){
            this.columns = [
                {
                    label: "ASIN",
                    value: "asin",
                    minWidth: 150
                },
            ]
        }else{
            this.columns = [
                {
                    label: "关键词",
                    value: "asin",
                    minWidth: 150
                },
            ]
        }
        this.params.data.forEach(i=>{
            this.data.push({
                asin:i
            })
        })
    },
};
</script>

<style scoped lang="less">

</style>
