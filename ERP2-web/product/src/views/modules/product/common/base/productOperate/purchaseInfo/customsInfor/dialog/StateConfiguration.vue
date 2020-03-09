<template>
    <div>
        <yt-table :data='data' :columns="columns" border  ref='table' @selectChange='selectChange'></yt-table>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import { Promise } from 'q';
export default {
    props:['productRepoId'],
    data() {
        return {
            columns:[
                {
                    label:'国家',
                    value:"customsCountryName",
                    align:'center'
                }
            ],
            data:[],
            selectIds:[],
        };
    },
    methods: {
        //获取国家配置
        getArea(id,options){
            return this.$api[`product/prProductRepoPurchaseCountryGet`]({
                productRepoId:this.productRepoId
            })
            .then((data) => {
                let {rows} =  data
                this.data = rows
                setTimeout(()=>{
                    this.data.forEach(i=>{
                        if(i.selectFlag ===1){
                            this.$refs.table.$refs.table.toggleRowSelection(i,true)
                        }
                    })
                })
                
                // console.log(this.data );
            })
        },
        selectChange(v){
            this.selectIds = v
        },
        saveBtn(){
            this.data.forEach(i=>{
                if( this.selectIds.includes(i)){
                    i.selectFlag = 1
                }else{
                    i.selectFlag = 0
                }
            })
            let countryList = this.data.map(i=>{
                return{
                    customsCountrySetId : i.customsCountrySetId,
                    selectFlag : i.selectFlag
                }
            })
            return this.$api[`product/prProductRepoPurchaseCountryUpdate`]({
                productRepoId : this.productRepoId,
                countryList
            })
            .then((data) => {
                return Promise.resolve(this.selectIds)
            })
        }
    },
    created() {
        this.getArea()
    },
    computed:{
        validate(){
            return ()=>{
                if(!this.selectIds.length){
                    this.$message.warning('请至少选择一项')
                }
                return  this.selectIds.length ? Promise.resolve(true) : Promise.reject(false) 
            }
        },
    }
};
</script>

<style scoped lang="scss">

</style>
