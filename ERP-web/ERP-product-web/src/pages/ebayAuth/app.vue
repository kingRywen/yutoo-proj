y<template>
    <div class="auth" v-loading="status" :element-loading-text="msg" element-loading-spinner="el-icon-loading"></div>
</template>
<script>
import { getData } from 'common/http';
import { BASE_URL } from 'common/config';

console.log(BASE_URL);

export default {
    data() {
        return {
            msg: '',
            status: true
        };
    },
    methods: {
        getUrlParam(name) {
            var reg = new RegExp(
                '(^|&)' + encodeURIComponent(String(name)) + '=([^&]*)(&|$)'
            ); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return decodeURIComponent(r[2]);
            return null; //返回参数值
        },
        auth() {
            this.msg = '正在授权,连接服务器...';
            var code = this.getUrlParam('code');

            var state = this.getUrlParam('state');

            let arr = state.split('|');

            var project = arr[1] == 1;

            var storeId = parseInt(arr[0]);

            let url = '';
            let cburl = '';
            var params = {
                code,
                storeId
            };
            //店铺
            if (project) {
                url = 'api/ebay/authCallback';
                cburl = 'http://120.79.124.232/ebayShops/sellerAuth/list';
                this.save(url, params, cburl);
                //erp
            } else {
                url = 'store/api/auth/ebay/callback';
                cburl = '/product.html#/product/StoreManagement.html';
                this.save(url, params, cburl);
                // https://shunzeng.goho.co
            }
        },
        save(url, params, cburl) {
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    this.msg = res.data.msg + ',正在返回店铺管理...';
                } else {
                    this.msg = res.data.msg + '请重新授权';
                }
                setTimeout(() => {
                    window.location.href = cburl;
                }, 2000);
            });
        }
    },
    mounted() {
        this.auth();
    }
};
</script>
<style>
html,
body,
.auth {
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
