import USA from "@/assets/images/USA.png";
import storage from 'Utils/saver';
import { resetRouter } from "@/router/index"
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
      let defaults = {
        platformId: 1
      };
      let opts = {
        ...defaults,
        ...params
      };
      this.selectShopLoading = true
	  const ca = storage.get('local', 'isShowCate')
	  if(ca == null) {
		  storage.set('local', 'isShowCate', false)
	  }
	  // storage.set('local', 'isShowCate', false)
      this.$api["SellerAuthSelectList"](opts).then(data => {
        this.selectShopLoading = false
        // this.stateData = data.data;
        this.$store.commit("common/stateData", data.data);
        if (!data.data.length) {
          this.$store.commit("common/siteId__", null);
          this.$store.commit("common/seller_Name", '选择店铺');
          this.$store.commit("common/seller_Img", null);
          sessionStorage.removeItem('shop_seller_data')
          return
        }
        // 刷新的时候取本地的店铺信息来展示当前选中店铺，当然请求还是得发，因为要做下拉展示。
        let local = JSON.parse(sessionStorage.getItem("shop_seller_data"));
        let routeType = storage.get('local', 'routerType') || 'amazon'
        if (local) {
          this.$store.commit("common/sellerData", local);
          // this.seller_Name = local.sellerAlias; //店铺名字
          this.$store.commit("common/seller_Name", local.sellerAlias);
          if (local.siteId == 1) {
            // 展示图片
            this.$store.commit("common/seller_Img", USA);
          }
        } else {
          // 如果本地sess没有
          // 找到对应的平台，并设置第一个店铺为默认显示店铺
          if (this.stateData.length > 0) {
            this.setStore(this.stateData, routeType)
            
          } else {
            // 没有店铺授权则跳转到无权限页面
            // this.seller_Name = "选择店铺"; //店铺名字
            this.$store.commit("common/seller_Name", "选择店铺");
            this.$store.commit("common/sellerData", null);
            this.$router.push("/error/notpermission");
          }
        }
        this.changeMethod(routeType, 1)
        // 
      });
    },

    //改变session和vuex的routerType toggle true代表是直接点击跳转店铺授权
    changeMethod(type, _default = 0, path, toggle,isShowCate) {
      // 如果只是切换同一平台的店铺，不需要重置路由
      if (type === storage.get('local', 'routerType') && toggle) {
        this.$router.push(type == 'amazon' ? '/shopAuthorization' : '/ebayShopAuthorization')
        return
      }
      resetRouter();
      switch (type) {
        case 'amazon':
          this.setDynamicRoutes(type, _default, path || '/shopAuthorization',isShowCate)
          
          break;
        case 'ebay':
          this.setDynamicRoutes(type, _default, path || '/ebayShopAuthorization',isShowCate)
          
          break;
      }
    },
    setStore(stateData) {
      let routeType = storage.get('local', 'routerType') || 'amazon'
      let el = routeType === 'amazon' ? stateData[0] : stateData[1]
      let sellerOne = el.siteList[0].sellerList[0],
        siteOne = el.siteList[0]
      let data = {
        sellerId: sellerOne.sellerId,
        siteId: siteOne.siteId,
        sellerAlias: sellerOne.sellerAlias,
        platformId: el.platformId,
        // 存siteId用作类目选择上级，亚马孙底层类目映射
        siteList: el.siteList
      };
      // 存第一个店铺的sellerId和第一个siteList的第一个siteId到本地, 如果已经有选择的店铺了，就把选择的店铺存进去 
      // let _sellerData = sessionStorage.getItem("shop_seller_data") || localStorage.getItem("shop_seller_data")
      // if (_sellerData) {
      //   data = _sellerData
      // }
      sessionStorage.setItem("shop_seller_data", JSON.stringify(data));
      localStorage.setItem("shop_seller_data", JSON.stringify(data));
      // 存第一个店铺的sellerId和第一个siteList的第一个siteId到vuex
      this.$store.commit("common/sellerData", data);
      // 默认展示一个名字
      // this.seller_Name = el.sellerAlias; //店铺名字
      this.$store.commit(
        "common/seller_Name",
        sellerOne.sellerAlias
      );
      if (siteOne.siteId == 1) {
        // 展示图片
        this.$store.commit("common/seller_Img", USA);
      }
    },

    // 动态注册路由
    /**
     * 
     * @param {String} type       平台类型
     * @param {Boolean} _default  是否非登录时注册
     * @param {*} linkPath        登录时需要跳转的路由
     */
    setDynamicRoutes(type, _default, linkPath,isShowCate) {
      storage.set('local', 'routerType', type)
      this.$store.commit('common/routerType', type)
      this.$router.addRoutes(type === 'amazon' ? shopRouter : type === 'ebay' ? ebayRouter : shopRouter);
      if (_default) {
        return
      }
      setTimeout(() => {
        
        this.$router.push(linkPath)
        this.setStore(this.$store.state.common.stateData, type)
      })
    }
  },
};
