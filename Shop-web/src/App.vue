<template>
  <div id="app" v-loading="selectShopLoading" element-loading-text="载入中...">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import shopRoutes from "./router/shopRouter/index";
import ebayRouter from '@/router/ebayRouter/index';
import storage from "Utils/saver";
import setSite from 'Service/mixins/setSite';

export default {
  mixins: [setSite],
  data() {
    return {
      selectShopLoading: false
    }
  },
  methods: {
    ...mapActions("perms", ["initMenu"]),
    bindEvent() {
	
	  //新版提示
	  GLOBAL.vbus.$on("business.response.newSuccess", regData => {
	    let msg = `<span>共处理: ${regData.total}条 , <span style="color:#67C23A">成功: ${regData.success}条</span> , <span style="color:#F56C6C">失败: ${regData.fail}条</span> , <span style="color:#409EFF">忽略: ${regData.ignore}条 ! </span></span>`
	    this.$message({
	      type: "success",
	      dangerouslyUseHTMLString: true,
	      message:msg
	    });
	  });
	  GLOBAL.vbus.$on("business.response.newFalseMessage", regData => {
	    let str = ''
	    if(regData.failMsgList && regData.failMsgList.length){
	    	str = `<p style="font-weight: bold;">失败原因:</p>`
	    	regData.failMsgList.forEach((e)=>{
	    		str += e+'<br/>'
	    	})
	    	if(regData.ignoreMsgList && regData.ignoreMsgList.length) str += '<br/>'
	    }
	    if(regData.ignoreMsgList && regData.ignoreMsgList.length){
	    	str += `<p style="font-weight: bold;">忽略原因:</p>`
	    	regData.ignoreMsgList.forEach((e)=>{
	    		str += e+'<br/>'
	    	})
	    }
	    this.$notify({
	      type: "error",
	      dangerouslyUseHTMLString: true,
	      message:str
	    });
	  });
	  
	  
		
	  //旧版提示
      GLOBAL.vbus.$on("business.response.incorrect", message => {
        // ... code 不为 0，业务不正确处理
        this.$message({
          type: "error",
          dangerouslyUseHTMLString: true,
          message
        });
      });
      GLOBAL.vbus.$on("business.response.success", message => {
        // ... code 为 0，显示成功信息
        console.log(message);
        this.$message({
          type: "success",
          dangerouslyUseHTMLString: true,
          message,
        });
      });
	  //显示失败及忽略的原因
	  GLOBAL.vbus.$on("business.response.falseSuccess", messageList => {
		let str = ''
		messageList.forEach((e)=>{
			str += e+'<br/>'
		})
		this.$notify({
		  type: "error",
		  dangerouslyUseHTMLString: true,
		  message:str,
		  showClose: true,
		});   
	  });
      // 自行触发
      GLOBAL.vbus.$on("ajax.request.error", resData => {
        console.info(resData);
      });
      GLOBAL.vbus.$on("ajax.response.error", message => {
        console.info(message);
        this.$message({
          type: "error",
          dangerouslyUseHTMLString: true,
          message
        });
      });
	  
	  //新版提示
	  
	  
    },
    init() {
      // 登录成功之后获取主菜单
      this.initMenu();
    },
  },

  created() {
    this.bindEvent();
  },
  watch: {
    $route(to, from) {
      if (from.name === 'login') {
        this.$nextTick(() => {
          this.getSelectPlatform();
        })
      }
    }
  },
  mounted(){
    
    let routerType = storage.get('local','routerType')
    if (!routerType) {
      routerType = 'amazon'
      storage.set('local','routerType', 'amazon')
    }
		this.$store.commit('common/routerType',routerType)
		switch(routerType){
			case 'amazon':
			this.$router.addRoutes(shopRoutes);
			break;
			case 'ebay':
			this.$router.addRoutes(ebayRouter);
			break;
		}
    
	},
};
</script>
<style lang="scss">
@import "./assets/font/iconfont/iconfont.css";
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #5e5e5e;
}
a:hover,
a:focus {
  color: #40a5ed !important;
}
// a:visited {
//   color: #551a8b !important;
// }
</style>
