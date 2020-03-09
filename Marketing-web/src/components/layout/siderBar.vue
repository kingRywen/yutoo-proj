<template>
  <el-aside class="siderbar" style="background-color: #272b2c;height: 100%;overflow:hidden" :style="{width: isCollapse ? '50px' : '200px'}" v-if="!$route.meta.notShowPoint">

    <div class="logo" id="logo" :class="isCollapse ? 'collapse':''">
      <transition name="fade">
        <img v-if="!isCollapse" style="height:38px;display:block;margin: 0 auto;" src="~@/assets/market_logo_new.png">
        <img v-else style="height:28px;display:block" src="~@/assets/logo_mini.png">
      </transition>
    </div>

    <el-menu class="menu-main" :collapse="isCollapse" router unique-opened :default-openeds="index" @open="bindIndex" @select="bindSelect" :default-active="myPath || $route.path" background-color="#272b2c" text-color="#909399">
      <template v-for="(list, index) in lists" v-if="list.show">
        <el-submenu :index="index + ''" :key="index" v-if="list.list" class="__el-submenu__title">
          <template slot="title">
            <i :class="list.icon"></i>
            <span slot="title" style='font-weight:bold;' class="font14">{{list.name}}</span>
          </template>
          <el-menu-item v-for="(item, i) in list.list" :key="i" v-if="item.show" :index="'/' + item.url">
            <span class="font14">{{item.name}}</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item :key="index" v-else :index="'/' + list.url" class="__el-submenu__title">
          <i :class="list.icon"></i>
          <span slot="title" style='font-weight:bold' class="font14">{{list.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>
<script>
/* eslint-disable */
import { mapActions } from "vuex";
import { mapState } from "vuex";
import img1 from "@/assets/amazon_logo.png";
import img2 from "@/assets/ebay_log.png";
import img3 from "@//assets/express_logo.png";
import img4 from "@//assets/wish_logo.png";
import img5 from "@//assets/Walmart_logo.png";
export default {
  props: ["baseUrl", "isCollapse"],
  created() {
    if (this.$route.query.pageId) {
      this.$store.commit("common/savePageId", this.$route.query.pageId);
      // 如果用户刷新的是充值的页面，则讲评台的id存为-1，方便切换平台的时候出发watch
      this.$store.commit("common/savePlatformIdAndSiteId", "-2,1");
    } else {
      this.$store.commit("common/savePageId", -2);
    }
    if (!this.$route.query.pageId) {
      this.$store.commit(
        "common/savePlatformIdAndSiteId",
        sessionStorage.getItem("platformId") || "1,1"
      );
    }
    this.getSiderBar({
      route: this.$route.path
    });
  },
  data() {
    return {
      // isCollapse: false,
      index: ["0"],
      menuList: [],
      platformImg: img1
    };
  },
  methods: {
    ...mapActions("menu", ["getSiderBar"]),
    bindIndex(e, i) {
      // console.log(e)
    },
    bindClick(e) {
      this.$emit("change", e.$el.dataset.name);
    },
    bindSelect(e, i) {}
  },
  watch: {
    savePlatformIdAndSiteId(newSavePlatformIdAndSiteId) {
      let newPlatformId = newSavePlatformIdAndSiteId.split(",")[0];
      if (newPlatformId == 1) {
        this.platformImg = img1;
      } else if (newPlatformId == 2) {
        this.platformImg = img2;
      } else if (newPlatformId == 3) {
        this.platformImg = img3;
      } else if (newPlatformId == 4) {
        this.platformImg = img4;
      } else if (newPlatformId == 5) {
        this.platformImg = img5;
      }
    }
  },
  computed: {
    savePlatformIdAndSiteId() {
      return this.$store.state.common.savePlatformIdAndSiteId;
    },
    lists() {
      // console.log(this.$store.state.menu.subMenus);
      // let list = this.$store.state.menu.subMenus;
      let list = [
        {
          name: "关键词",
          type: 0,
          show: true,
          icon: "iconfont1 icon-guanjianci-",
          orderNum: 0,
          list: [
            {
              name: "关键词挖掘",
              type: 0,
              show: true,
              url: "admin/center",
              orderNum: 0
            },
            {
              name: "关键词竞争分析",
              type: true,
              show: true,
              url: "admin/center/KeywordIndex",
              orderNum: 1
            }
          ]
        },
        {
          name: "选品工具",
          type: 0,
          show: true,
          icon: "iconfont1 icon-jingxuanchanpinku-1",
          orderNum: 0,
          list: [
            {
              name: "关键词查询",
              type: true,
              show: true,
              url: "admin/SelectionTool/keyQuery",
              orderNum: 1
            },
            {
              name: "类目查询",
              type: true,
              show: true,
              url: "admin/SelectionTool/CatalogQuery",
              orderNum: 2
            }
          ]
        },
        {
          name: "排名查询",
          type: 0,
          show: true,
          icon: "iconfont1 icon-paiming-",
          orderNum: 0,
          NotKeywordRank: "1",
          list: [
            {
              name: "自然搜索排名",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/rankingQuery/keywordQuery"
            },
            {
              name: "广告搜索排名",
              type: true,
              show: true,
              orderNum: 1,
              url: "admin/rankingQuery/adkeywordRanking"
            },
            {
              name: "类目搜索排名",
              type: true,
              show: true,
              orderNum: 2,
              url: "admin/rankingQuery/categoryRanking"
            }
          ]
        },
        {
          name: "竞争分析",
          type: 1,
          icon: "iconfont1 icon-jingzhengfenxi-",
          orderNum: 1,
          list: [
            {
              name: "竞品分析",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/competitive/productAnalysis"
            },
            {
              name: "店铺分析",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/competitive/shopAnalysis"
            },
            {
              name: "销量分析",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/competitive/salesVolume"
            }
          ]
        },
        {
          name: "店铺授权",
          type: 1,
          show: true,
          icon: "iconfont1 icon-dianpu-",
          url: "admin/shopAuthorization",
          orderNum: 0
        },
        {
          name: "监控分析",
          type: 1,
          icon: "iconfont1 icon-jiankong-",
          orderNum: 1,
          list: [
            {
              name: "跟卖监控",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/monitoringCenter/salesMonitoring"
            },
            {
              name: "防跟卖处理",
              type: true,
              show: true,
              orderNum: 1,
              url: "admin/monitoringCenter/preventSalesMonitoring"
            },
            {
              name: "差评监控",
              type: true,
              show: true,
              orderNum: 2,
              url: "admin/monitoringCenter/negativeCommentMonitoring"
            }
          ]
        },
        {
          name: "销售报告",
          type: 1,
          show: true,
          icon: "iconfont1 icon-xiaoshouqushi-",
          url: "admin/salesReport/index",
          orderNum: 0
        },
        {
          name: "我的关注",
          type: 0,
          show: true,
          icon: "iconfont1 icon-weibiaoti-",
          orderNum: 0,
          list: [
            {
              name: "关键词库",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/myAttentionCenter/keyLexicon"
            },
            {
              name: "产品库",
              type: true,
              show: true,
              orderNum: 0,
              url: "admin/myAttentionCenter/commodityBank"
            }
          ]
        },
        {
          name: "描述编辑工具",
          type: 0,
          show: true,
          icon: "iconfont1 icon-miaoshu-",
          url: "admin/descriptionEditing",
          orderNum: 0
        },
        {
          name: "图片空间",
          type: 0,
          show: true,
          icon: "iconfont1 icon-tupian-",
          url: "admin/imgSpace",
          orderNum: 0
        }
      ];
      // console.log(list, "list");
      this.platformId = this.$store.state.common.savePlatformIdAndSiteId.split(
        ","
      )[0];
      // this.$nextTick(() => {
      if (this.platformId == 1) {
        list.forEach((item, index) => {
          if (item.type == 1) {
            item.show = true;
          }
          if (item.type == 0) {
            item.show = true;
          }
        });
      }
      if (this.platformId != 1) {
        list.forEach((item, index) => {
          if (item.type == 1) {
            item.show = false;
          }
          if (item.type == 0) {
            item.show = true;
          }
        });
        // this.$router.push("/admin/center");
      }
      // 如果是平台3或4则让广告排名中的广告关键词排名消失
      if (this.platformId == 3 || this.platformId == 4) {
        list.forEach((item, index) => {
          if (item.NotKeywordRank && item.NotKeywordRank == 1) {
            item.list.forEach(v => {
              if (v.orderNum == 1) {
                v.show = false;
              }
            });
          }
        });
      }
      // 如果不是平台3则显示所有
      if (this.platformId != 3 && this.platformId != 4) {
        list.forEach((item, index) => {
          if (item.list) {
            item.list.forEach(v => {
              v.show = true;
            });
          }
        });
      }
      return list;
      // });
    },
    myPath() {
      return this.$store.state.common.pathFromCheckProductAnalysis;
    }
    // 平台图片
    // platformImg() {
    //   let platformImg;
    //   let platformId = this.$store.state.common.savePlatformIdAndSiteId.split("," )[0];
    //   if (platformId == 1) {
    //     platformImg = img1;
    //   } else if (platformId == 2) {
    //     platformImg = img2;
    //   } else if (platformId == 3) {
    //     platformImg = img3;
    //   } else if (platformId == 4) {
    //     platformImg = img4;
    //   } else if (platformId == 5) {
    //     platformImg = img5;
    //   }
    //   return platformImg;
    // }
  }
};
</script>
<style scoped lang="scss">
.img_wrapper {
  display: flex;
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  // border-right: 1px solid #e6e6e6;
  justify-content: center;
  align-items: center;
  padding: 4px;
  box-sizing: border-box;
  img {
    height: 35px;
    display: block;
  }
}
</style>
