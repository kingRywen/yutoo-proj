//全局方法属性
import {fetchData} from './common';



//获取平台=>站点
const PLATFORM_LIST = "platform/list/platform/site";
//获取平台类目

//根据站点获取店铺
const SITE_STORE =  "store/list/by/site";

const install = function(Vue) {
	const Bus = new Vue({
        data(){
            return {

            }
        },
		methods: {
            //获取平台=>站点
            _platform_list(params={}){
                return fetchData({
                    method: 'post',
                    data:params,
                    url: PLATFORM_LIST
                })
            },
            //根据站点=>获取店铺
            _site_store(params){
                return fetchData({
                    method: 'post',
                    data:params,
                    url: SITE_STORE
                })
            },
			emit(event, ...args) {
				this.$emit(event, ...args)
			},
            on(event,callback){
                this.$on(event,callback)
            },
            off(event,callback){
                this.off(event,callback)
            }
		}
	})
    Vue.prototype.$bus = Bus;
};

export default install
