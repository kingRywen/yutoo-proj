import USA from "@/assets/images/USA.png";
import storage from 'Utils/saver';
import {resetRouter} from "@/router/index"
import ebayRouter from '@/router/ebayRouter/index'
import shopRouter from '@/router/shopRouter/index'

export default {
  computed: {
    stateData() {
      return this.$store.state.common.stateData;
    },
  },
  methods: {
    getSelectPlatform(params) {
      // console.log(11);
      let defaults = {
        platformId: this.platformId
      };
      let opts = {
        ...defaults,
        ...params
      };
      this.$api["SellerAuthSelectList"](opts).then(data => {
        // this.stateData = data.data;
        this.$store.commit("common/stateData", data.data);
        if (!data.data.length) {
          this.$store.commit("common/siteId__", null);
          this.$store.commit("common/seller_Name", '选择店铺');
					this.$store.commit("common/seller_Img",null);
          sessionStorage.removeItem('shop_seller_data')
          return
        }
        // 刷新的时候取本地的店铺信息来展示当前选中店铺，当然请求还是得发，因为要做下拉展示。
        let local = JSON.parse(sessionStorage.getItem("shop_seller_data"));
        let routeType = storage.get('session', 'routerType') || 'amazon'
        if (local) {
          this.$store.commit("common/sellerData", local);
          // this.seller_Name = local.sellerAlias; //店铺名字
          this.$store.commit("common/seller_Name", local.sellerAlias);
          if (local.siteId == 1) {
            // 展示图片
            this.$store.commit("common/seller_Img",USA);
          }
        } else {
          // 如果本地sess没有，则取请求回来的第一个店铺默认选中
          if (this.stateData.length > 0) {
            let data = {
              sellerId: this.stateData[0].sellerId,
              siteId: this.stateData[0].siteList[0].siteId,
              sellerAlias: this.stateData[0].sellerAlias,
              platformId: defaults.platformId,
              // 存siteId用作类目选择上级，亚马孙底层类目映射
              siteList: this.stateData[0].siteList
            };
            // 存第一个店铺的sellerId和第一个siteList的第一个siteId到本地
            sessionStorage.setItem("shop_seller_data", JSON.stringify(data));
            localStorage.setItem("shop_seller_data", JSON.stringify(data));
            // 存第一个店铺的sellerId和第一个siteList的第一个siteId到vuex
            this.$store.commit("common/sellerData", data);
            // 默认展示一个名字
            // this.seller_Name = this.stateData[0].sellerAlias; //店铺名字
            this.$store.commit(
              "common/seller_Name",
              this.stateData[0].sellerAlias
            );
            if (this.stateData[0].siteList[0].siteId == 1) {
              // 展示图片
              this.$store.commit("common/seller_Img",USA);
            }
          } else {
            // 没有店铺授权则跳转到无权限页面
            // this.seller_Name = "选择店铺"; //店铺名字
            this.$store.commit("common/seller_Name", "选择店铺");
            this.$store.commit("common/sellerData", null);
            this.$router.push("/error/notpermission");
          }
        }
        this.changeMethod(routeType, 1)
        // console.log(this.stateData);
      });
    },

    //改变session和vuex的routerType
		changeMethod(type, _default = 0){
      resetRouter();
			switch(type){
				case 'amazon':
				storage.set('session','routerType',type)
        this.$store.commit('common/routerType',type)
        this.$router.addRoutes(shopRouter);
        if (_default) {
          return
        }
        setTimeout(()=>{
          this.$router.push('/shopAuthorization')
        })
        // this.$router.onReady(()=>{
        //    this.$router.push('/dash')
        // })
				break;
				case 'ebay':
				storage.set('session','routerType',type)
        this.$store.commit('common/routerType',type)
        this.$router.addRoutes(ebayRouter);
        if (_default) {
          return
        }
        setTimeout(() => {
          this.$router.push('/ebayShopAuthorization')
        })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        // this.$router.onReady(()=>{
        //    this.$router.push('/ebayDash')
        // })
				break;
      }
      
		},
  },
};
