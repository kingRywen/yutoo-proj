<template>
    <div id="app">
        <loading :show="$store.state.isloading" text="加载中..."></loading>
        <router-view></router-view>
    </div>
</template>

<script>
import { Loading } from 'vux';
export default {
    components: {
        Loading
    },
    name: 'app',
    created() {
        this.bindEvent();
    },
    methods: {
        bindEvent() {
            GLOBAL.vbus.$on('business.response.incorrect', message => {
                // ... code 不为 0，业务不正确处理
                this.$vux.toast.show({
                    type: 'warn',
                    text: message || '未知异常，请联系客服人员'
                });
            });
            GLOBAL.vbus.$on('business.response.success', message => {
                // ... code 为 0，显示成功信息
                this.$vux.toast.show({
                    type: 'success',
                    text: message
                });
            });
            // 自行触发
            GLOBAL.vbus.$on('ajax.request.error', resData => {
                console.info(resData);
            });
            GLOBAL.vbus.$on('ajax.response.error', message => {
                console.info(message);
                this.$vux.toast.show({
                    type: 'warn',
                    text: message
                });
            });
        }
    }
};
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html,
body,
#app {
    height: 100%;
}
</style>
