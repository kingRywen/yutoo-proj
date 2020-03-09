<template>
    <div>
        <p v-html='html'>
            
        </p>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            html:null
        };
    },
    methods: {

    },
    created() {
       //console.log(this.params.datas);
        let span = '';
        this.params.datas.forEach( (i,index)=>{
            if( index!==0 && (index+1)%4 === 0){
                span += '<span>'+ i  +'</span>'+'<br />' 
            }else{
                span += i +" , "
            }
        });
        this.html=span
    },
};
</script>

<style scoped lang="less">
p{
    text-align: center ;
    line-height: 20px;
}
</style>
