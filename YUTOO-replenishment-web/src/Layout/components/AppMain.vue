<template>
    <section :class="['app-main', {'is-width': $route.meta.width}]" v-if="refresh">
        <div style="width:100%" v-if="fullScreenUrl.includes($route.path)" v-loading="$store.state.isloading" element-loading-text="加载中...">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <div v-else :class="['main-wrapper', {
      dash: $route.name === 'dash'
    }]">

            <div :class="['scroll-wrapper']" v-loading="$store.state.isloading" element-loading-text="加载中...">
                <keep-alive>
                    <router-view v-if="$route.meta.keep && classN" />
                </keep-alive>
                <transition name="fade-transform" mode="out-in" @before-enter="beforeEnter" @after-enter="afterEnter">
                    <router-view v-if="!$route.meta.keep "></router-view>
                </transition>
            </div>
        </div>
    </section>
</template>

<script>
import { commonCptd } from 'Store/helper/common';
export default {
    name: 'AppMain',
    data() {
        return {
            classN: true,
            refresh: true,
            backRoutes: [],
            fullScreenUrl: [
                '/error/404',
                '/error/403',
                '/error/empty',
                '/error/notpermission'
            ]
        };
    },
    computed: {
        ...commonCptd,
        list() {
            return this.buttedSiteList
        },
        showRouter() {
            const list = ['/product/common/setup/temp', '/product/amazon/storeProduct', '/product/amazon/platProduct', '/product/amazon/improves', '/product/amazon/banDisplay', '/product/amazon/changePro'];
            if (list.find(i => i === this.$route.path)) return true;
            return false;
        }
    },
    created() {
        GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh);
    },
    destroyed() {
        GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh);
    },
    methods: {
        afterLeave() {
            console.log('离开');
            // this.classN = true;
        },
        afterEnter() {
            console.log('进入结束');
        },
        beforeEnter() {
            // this.classN = false;

            console.log('进入');
        },
        mainRefresh() {
            console.log('刷新');
            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.app-main {
    // display: flex;
    flex: 1;
    // padding: 10px;
    // height: 100%;
    background: #fff;
    .main-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        flex: auto;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        // height: 100%;
        // overflow: auto;
        &.dash {
            background: #fff;
            height: 100%;
            // padding: 30px;
        }
        .scroll-wrapper {
            flex: auto;
            width: 100%;
            height: 100%;
            margin-bottom: 20px;
        }
    }
    &.is-width {
        background-color: #f3fbff;
        .main-wrapper {
            margin: 0 auto;
            width: 1400px;
            height: 100%;
        }
    }
}
.__cov-progress {
    height: 3px !important;
    background: $titleColor !important;
    position: absolute !important;
}
</style>

