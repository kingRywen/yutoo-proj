<template>
    <div id="app">
        <breadcrumb :data="breadcrumblist"/>
        <el-button v-show="($route.name !== 'category' && $route.name)" size="small" type="text" icon="el-icon-back" style="float: right;position: relative;top: -33px;right:10px;" @click="$router.back(-1)">返 回</el-button>
        <!-- <keep-alive> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
    </div>
</template>

<script>
import Breadcrumb from './breadcrumb.vue';
export default {
    name: 'App',
    components: {
        Breadcrumb
    },
    data() {
        const _this = this;
        return {
            breadcrumblist: [
                { url: null, title: '产品管理' },
                { url: null, title: '相关设置' },
                { url: '/category', title: '产品类目管理' }
            ],
            isLook: false
        };
    },
    computed: {
        navInfo() {
            return {
                a: [
                    { url: null, title: '产品管理' },
                    { url: null, title: '相关设置' },
                    { url: '/category', title: '产品类目管理' }
                ],
                b: [
                    { url: null, title: '产品管理' },
                    { url: null, title: '相关设置' },
                    { url: '/category', title: '产品类目管理' },
                    { url: '/record', title: '导入记录' }
                ],
                c: [
                    { url: null, title: '产品管理' },
                    { url: null, title: '相关设置' },
                    { url: '/category', title: '产品类目管理' },
                    { url: '/templateManagement', title: '模板管理' }
                ],
                d: [
                    { url: null, title: '产品管理' },
                    { url: null, title: '相关设置' },
                    { url: '/category', title: '产品类目管理' },
                    { url: '/templateManagement', title: '模板管理' },
                    {
                        url: '/uploading',
                        title: `${this.isLook ? '修改' : '查看'}模板`
                    }
                ]
            };
        }
    },
    watch: {
        $route(to, from) {
            this.isLook = to.params.operate === true ? true : false;
            switch (to.meta.title) {
                case '产品类目管理':
                    this.breadcrumblist = this.navInfo.a;
                    break;
                case '导入记录':
                    this.breadcrumblist = this.navInfo.b;
                    break;
                case '模板管理':
                    this.breadcrumblist = this.navInfo.c;
                    break;
                case '导入模板':
                    this.breadcrumblist = this.navInfo.d;
                    break;
            }
            // console.log(this.breadcrumblist);
        }
    }
};
</script>
