<template>
    <div>
        <component :is="componentId" @_submit='_submit' ref='comp' :opt='opt'></component>
    </div>
</template>

<script>
export default {
    props:['storeId','platName'],
    components:{
        Amazon:()=>import('./AmazonAuthor'),
        eBay:()=>import('./eBayAuthor'),
        wish:()=>import('./wishAuthor'),
    },
    data() {
        return {
           // componentId:'Amazon',
            opt:{}
        };
    },
    methods: {
        _submit(){
            return this.$refs.comp._submit()
        }
    },
    created() {
        this.opt.storeId = this.storeId
        this.opt.platName = this.platName
        // console.log(this.storeId);
        // console.log(this.platName);
    },
    computed:{
        componentId(){
            return  this.platName === "Amazon" ?  'Amazon' : this.platName === "eBay" ?  'eBay' : this.platName === "wish" ? 'wish' :""
        }
    }
};
</script>

<style scoped lang="scss">

</style>
