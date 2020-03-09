<template>
    <el-tabs class="sub-nav" :value="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in subMenu" :key="item.path" :label="item.subMenuName || item.name" :name="item.path"></el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    props: ['subMenu'],
    methods: {
        handleClick(tab) {
            this.$router.push(tab.name).catch(() => {});
        }
    },
    computed: {
        activeName() {
            return this.$route.path;
        }
    }
};
</script>

<style lang='scss' scoped>
</style>
