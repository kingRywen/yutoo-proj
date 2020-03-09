<template>
    <div class="overweightOrFragile">
        <img src="./cz.jpg" alt v-if="title=='超重'" height="auto">
        <img src="./ys.jpg" alt v-else height="auto">
    </div>
</template>

<script>
export default {
    props: {
        isLoading: Function
    },
    data() {
        return {
            title: '超重'
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.isLoading();
        });
        this.title = this.$route.query.wmPackageId;
    }
};
</script>
<style>
.overweightOrFragile {
    margin: 50px auto;
    text-align: center;
}
</style>