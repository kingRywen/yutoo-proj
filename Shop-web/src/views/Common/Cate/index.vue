<!-- 类目组件 -->
<template>
  <div class="___common __cate">
    <!-- todoh -->
    <el-cascader v-loading="loadingCas" :placeholder="placeholder" @active-item-change="handleItemChange" @change="model_change" :style='{width:width}' v-model="siteForm.category" :options="skuListw" :props="props" @focus="getCategorList" :size="size" clearable></el-cascader>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: String
    },
    size:{
      type:String,
      default:"mini"
    },
    // platformId: {
    //   default: 1
    // },
    placeholder: {
      default: "选择类目"
    }
    // siteId__: {
    //   default: null
    // }
  },
  data() {
    return {
      skuListw: [],
      siteForm: {
        category: []
      },
      loadingCas: false,
      // 类目选择todod
      props: {
        value: "name",
        children: "childs",
        label: "name"
        //  value: "categoryName",
      }
    };
  },

  created() {
    this.getCategorList();
  },
  mounted() {},
  methods: {
    //类目列表获取  类目排名添加类目
    getCategorList(id = 0) {
      if (this.skuListw.length) {
        return;
      }
      let params = {
        platformId: +this.platformId, //上线要改
        // siteId:
        //   +this.$store.state.common.siteId__ ||
        //   +this.$route.query.siteId__ ||
        //   this.siteId,
		siteId: this.siteId,
        sellerId: this.sellerId, //上线要改
        parentPcid: id
      };
      // console.log(this.$store.state.common.savePlatformIdAndSiteId.split("," )[0]);
      this.$api["GetCateList"](params).then(data => {
        if (data.code == 0) {
          let data_ = data.data;
          data_.forEach(el => {
            if (el.haveChildren == 1) {
              this.$set(el, "childs", []);
            }
          });
          this.skuListw = data_;
          // console.log(this.skuListw);
          // console.log(this.skuList, "4545");
        }
      });
    },
    model_change(val) {
      this.handleItemChange(val, true);
    },
    getCategorById(id = 0) {
      let params = {
        platformId: +this.platformId, //上线要改
        // siteId:
        //   +this.$store.state.common.siteId__ ||
        //   +this.$route.query.siteId__ ||
        //   this.siteId,
		siteId:this.siteId,
        sellerId: this.sellerId, //上线要改
        parentPcid: id
      };
      return this.$api["GetCateList"](params);
    },
    //类目列表获取  类目排名添加类目
    getCategorList(id = 0) {
      if (this.skuListw.length) {
        return;
      }
      let params = {
        // siteId:
        //   +this.$store.state.common.siteId__ ||
        //   +this.$route.query.siteId__ ||
        //   this.siteId,
		siteId:this.siteId,
        platformId: +this.platformId, //上线要改
        parentPcid: id
      };
      // console.log(this.$store.state.common.savePlatformIdAndSiteId.split("," )[0]);
      this.$api["GetCateList"](params).then(data => {
        if (data.code == 0) {
          let data_ = data.data;
          data_.forEach(el => {
            if (el.haveChildren == 1) {
              this.$set(el, "childs", []);
            }
          });
          this.skuListw = data_;
        }
      });
    },
    handleItemChange(val, notSend_getCategorById) {
      const valStr = val.join(":");
      const parent = val.slice(0, val.length - 1).join(":");
      // let cateList = this.cfuns.getStorage("cateList");
      this.siteForm.category = val;
      let categoryId = this.findItem(
        this.skuListw,
        val[val.length - 1],
        parent
      );
      //change进来的不要发请求
      if (notSend_getCategorById === true) {
        return;
      }
      // if (Object.keys(cateList).indexOf(valStr) > -1) {
      //   this.setSub(this.selEl, cateList[valStr], val);
      //   this.cfuns.handCate(this);
      //   return;
      // }
      this.getCategorById(this.selEl.pcid).then(data => {
        if (data.code == null) {
          return;
        }
        if (data && data.code === 500) {
          return;
        }
        let data_ = data.data;
        this.setSub(this.selEl, data_, val);
        this.cfuns.handCate(this);
      });
    },
    setSub(selEl, data, val) {
      const valStr = val.join(":");
      // get
      // let cateList = this.cfuns.getStorage("cateList");
      data.forEach(el => {
        if (el.haveChildren == 1) {
          this.$set(el, "childs", []);
        }
      });
      // cateList[valStr] = data;
      // this.cfuns.setStorage("cateList", JSON.stringify(cateList));

      this.$set(this.selEl, "childs", data);
    },
    findItem(arr, name, pName) {
      if (pName) {
        arr.forEach(el => {
          if (el.name === name && pName === el.parentName) {
            this.selEl = el;
            // this.siteForm.categoryId = el.pcid;
            // this.siteForm.haveChildren = el.haveChildren;
            this.$emit("update:CategoryId", el.pcid);
            this.$emit("update:HaveChildform", el.haveChildren);
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name, pName);
            }
          }
        });
      } else {
        arr.forEach(el => {
          if (el.name === name) {
            this.selEl = el;
            // this.siteForm.categoryId = el.pcid;
            // this.siteForm.haveChildren = el.haveChildren;
            this.$emit("update:CategoryId", el.pcid);
            this.$emit("update:HaveChildform", el.haveChildren);
            // console.log(el);
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name);
            }
          }
        });
      }
      // console.log(this.siteForm, "此时的siteForm");
      // this.$refs.ruleForm.validateField("category");
    }
  },
  computed: {
    clearCate() {
      return this.$store.state.common.clearCate;
    },
    siteId__() {
      return this.$store.state.common.siteId__;
    }
  },
  watch: {
    "siteForm.category"(newV) {
      let cate = JSON.parse(JSON.stringify(newV));
      // 数组转字符串
      let cate_ = cate.join(":");
      this.$emit("update:Cate", cate_);
      this.$emit('way',' ');
      // console.log(cate_);
    },
    clearCate() {
      this.siteForm.category = [];
    },
    siteId__() {
      this.getCategorList();
    },
  
  }
};
</script>

<style lang='less' scoped>
</style>
