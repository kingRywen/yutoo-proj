<template>
    <el-menu class="edit-navbar" :default-active="activeIndex" mode="horizontal" @select="handleSelect" background-color="#244c76" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="1">文 字</el-menu-item>
        <el-menu-item index="2">图 片</el-menu-item>
        <el-submenu index="3">
            <template slot="title">表 单</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
            <el-menu-item index="3-3">选项3</el-menu-item>
        </el-submenu>
        <el-menu-item index="4">背 景</el-menu-item>
        <el-menu-item index="5" disabled>音 频</el-menu-item>
        <el-menu-item index="6" disabled>视 频</el-menu-item>
        <el-menu-item index="7">
            <a href="https://www.baidu.com" target="_blank">百度</a>
        </el-menu-item>
        <el-submenu index="8">
            <template slot="title">更多</template>
            <el-menu-item index="8-1">选项1</el-menu-item>
            <el-menu-item index="8-2">选项2</el-menu-item>
            <el-menu-item index="8-3">选项3</el-menu-item>
            <el-submenu index="8-4">
                <template slot="title">构图元素</template>
                <el-menu-item index="8-4-1">水平线</el-menu-item>
                <el-menu-item index="8-4-2">垂直线</el-menu-item>
                <el-menu-item index="8-4-3">自定义文本</el-menu-item>
                <el-menu-item index="8-4-3">图形标记</el-menu-item>
            </el-submenu>
            <el-submenu index="8-5">
                <template slot="title">图标元素</template>
                <el-menu-item index="8-5-1">顺 丰</el-menu-item>
                <el-menu-item index="8-5-2">邮 政</el-menu-item>
            </el-submenu>
        </el-submenu>
    </el-menu>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: '1'
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>
