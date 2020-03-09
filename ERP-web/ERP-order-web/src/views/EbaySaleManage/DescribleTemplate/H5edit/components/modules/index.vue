<template>
    <aside class="edit-modules">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="模版管理" name="first">1</el-tab-pane>
            <el-tab-pane label="编辑状态" name="second">2</el-tab-pane>
            <el-tab-pane label="页面设置" name="third">
                <all-element/>
            </el-tab-pane>
        </el-tabs>
    </aside>
</template>
<script>
import AllElement from './allelement';
export default {
    data() {
        return {
            activeName: 'first'
        };
    },
    components: { AllElement },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style lang="scss">
.edit-modules {
    .el-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-tabs__content,
        .el-tab-pane {
            height: 100%;
        }
    }
}
</style>
