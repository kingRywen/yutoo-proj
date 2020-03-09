<template>
  <div class="__FilterInput">
    <!-- {{ruleForm}} ---{{ranges}} -->
    <el-collapse v-model="activeNames">
      <el-collapse-item v-if="!depthType" name="1">
        <template slot="title">
          常用筛选条件
        </template>
        <div>
          <div :class="[$style.flex,$style.color,$style.border]" v-if="str1 && str1 !== ''">
            <div>{{str1}}</div>
            <i class="el-icon-edit-outline" :class="[$style.iconfs, $style.cursor]" @click="editCon"></i>
            <i class="iconfont22" :class="[$style.close, $style.cursor]">&#xe676;</i>
          </div>
          <div v-else>
            您暂时没有保存的搜索条件。请
            <el-button type="text" @click="activeNames = '2'">自定义搜索条件</el-button> 并保存
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <!-- <div :class="$style.flex"> -->
          <el-row :gutter="12" :class="$style.nowrap">
            <el-col :md="2" :lg="2" :class="$style.nowrap">{{depthType ? '筛选条件': '自定义筛选条件'}}</el-col>
            <el-col :md="6" :lg="12" :class="$style.nowrap">
              <span :class="[$style.color, $style.ml20]" :title="str">当前搜索：{{str}}</span>
            </el-col>
            <el-col :md="13" :offset="3" :lg="6" class="text-right" :class="[$style.reset,$style.nowrap]">
              <el-button type="text" @click.stop="resetCondition">重置条件</el-button>
              <el-button v-if="!depthType" type="text" @click.stop="saveCondition">保存为常用筛选条件</el-button>
            </el-col>
          </el-row>
        </template>
        <div>
          <el-row :gutter="20">
            <el-col :md="24" :lg="5" v-if="showCategory">
              <el-cascader :options="options2" :placeholder="depthType ? '子分类选择' : '全部分类'" v-model="category" @active-item-change="handleItemChange" :props="props" style="width:100%"></el-cascader>
            </el-col>
            <el-col :md="24" :lg="19">
              <el-form ref="form" :model="ruleForm" label-width="160px">
                <el-form-item :label="time.label">
                  <el-date-picker value-format="yyyy-MM-dd" size="small" v-model="ruleForm[time.prop]" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>

                <el-row :gutter="12" v-if="!depthType">
                  <el-col :xs="12" :sm="12" :md="12" :lg="8">
                    <el-form-item label="时间筛选">
                      <!-- <el-input v-model="ruleForm.email" style="width:100%"></el-input> -->
                      <el-select size="small" v-model="ruleForm.time" placeholder="" style="width:100%">
                        <el-option v-for="(item, index) in optionsTime" :key="index" :value="item.value" :label="item.label"></el-option>
                      </el-select>
                      <el-tooltip content="针对新增评价数搜索" placement="">
                        <i slot="content" class="iconfont22">&#xe61a;</i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="12" :lg="16">
                    <el-form-item label-width="0">
                      <el-date-picker @change="ruleForm.time = null" value-format="yyyy-MM-dd" size="small" v-model="ruleForm.rangeDate1" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item :label="btn.name" v-for="(btn, index) in buttonList" :key="index">
                  <div>
                    <el-radio-group v-model="ruleForm[btn.prop]" @change="divideProp(btn, $event)" size="small">
                      <el-radio :label="btn.bindVal ? item.value : item.label" v-for="item in btn.list" :key="item.value" border>{{item.label}}</el-radio>
                    </el-radio-group>
                    <template v-if="btn.custom">
                      <el-input size="small" v-model="ranges['min_' + btn.prop]" @focus="handlerFocus(btn.prop)" @blur="handlerFocus(btn.prop)" @input="handlerFocus(btn.prop)" style="margin-left: 6px;width:124px" :placeholder="btn.custom[0].label"></el-input>
                      <span> ~ </span>
                      <el-input size="small" v-model="ranges['max_' + btn.prop]" @focus="handlerFocus(btn.prop)" @blur="handlerFocus(btn.prop)" @input="handlerFocus(btn.prop)" style="width:140px" :placeholder="btn.custom[1].label"></el-input>
                    </template>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
                </el-form-item>
              </el-form>

            </el-col>
          </el-row>

        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>

<script>
export default {
  props: {
    showCategory: {
      type: Boolean,
      default: true
    },
    time: {
      type: Object,
      default: { prop: "shopTime", label: "上架时间" },
      required: true
    },
    buttonList: {
      type: Array,
      default() {
        return new Array();
      }
    },
    depthType: {
      type: Boolean,
      default: false
    },
    saveUrl: {
      type: String,
      default: ""
      // required: true
    },
    getUrl: {
      type: String,
      default: ""
      // required: true
    }
  },
  created() {
    this.resetCondition();
    // 不显示类目的情况
    if (this.showCategory) {
      if (this.$route.query.parentCategory) {
        this.getCategoryList(this.$route.query.parentCategory);
      } else {
        this.getCategoryList();
      }
    }
    if (this.depthType) {
      return;
    }
    this.getProductTerm();
  },
  data() {
    return {
      category: [],
      condition: {},
      activeNames: "1",
      ranges: {},
      str1: null,
      ruleForm: {
        rangeDate1: [],
        time: 7
      },
      rangeDate: [],
      optionsTime: [
        {
          value: 1,
          label: "近1天"
        },
        {
          value: 7,
          label: "近7天"
        },
        {
          value: 15,
          label: "近15天"
        },
        {
          value: 30,
          label: "近30天"
        }
      ],

      options2: [],
      props: {
        label: "category",
        value: "category",
        children: "childs"
      }
    };
  },
  methods: {
    // 获取类目
    getCategoryList(name = "", cb) {
      this.$axios
        .post("/category/listByParentCategory", {
          parentCategory: name
        })
        .then(res => {
          if (res.data && res.data.data) {
            if (cb) {
              cb(res.data.data);
            } else {
              let data = res.data.data;
              data.forEach(el => {
                this.$set(el, "childs", []);
              });
              this.options2 = data;
            }
          }
        });
    },

    getCategorById(name = "") {
      if (this.cacheCate && this.cacheCate[name]) {
        return Promise.resolve({
          cache: true,
          cacheData: this.cacheCate[name]
        });
      } else {
        let params = {
          parentCategory: name
        };
        return this.$axios.post("/category/listByParentCategory", params);
      }
    },

    saveCacheData(key, data) {
      const cache = JSON.parse(sessionStorage.getItem("souq_cachecate")) || {};
      cache[key] = data;
      sessionStorage.setItem("souq_cachecate", JSON.stringify(cache));
      this.cacheCate = cache;
    },

    handleItemChange(val) {
      // 设置选择项
      this.category = [...val];

      let sub = val.slice(val.length - 1).join();
      let parent = val.slice(0, val.length - 1).join(":");

      this.findItem(this.options2, sub, parent);
      if (this.selEl.childs && this.selEl.childs.length > 0) {
        return;
      }
      let cate = this.selEl.parentCategory
        ? this.selEl.parentCategory + ":" + this.selEl.category
        : this.selEl.category;
      this.getCategorById(cate).then(res => {
        let data;
        if (res.data && res.data.code !== 0) {
          this.$message.error(res.data.msg);
          return;
        }

        if (res.cache) {
          data = res.cacheData;
        } else {
          data = res.data.data;
        }

        if (data.length == 0) {
          this.$set(this.selEl, "childs", null);
          // this.category.push(val);
          return;
        }

        data.forEach(el => {
          this.$set(el, "childs", []);
        });
        this.saveCacheData(cate, data);
        this.$set(this.selEl, "childs", data);
      });
    },

    findItem(arr, name, pName) {
      if (pName) {
        arr.forEach(el => {
          if (el.category === name && pName === el.parentCategory) {
            this.selEl = el;
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name, pName);
            }
          }
        });
      } else {
        arr.forEach(el => {
          if (el.category === name) {
            this.selEl = el;
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name);
            }
          }
        });
      }
    },

    // 设置保存的选项到编辑
    editCon() {
      this.initFormdata(this.condition);
      this.activeNames = "2";
    },

    // 分离属性
    divideProp({ prop, bindVal }, val) {
      if (bindVal) {
        // 如果是绑定的值
        this.$set(this.ranges, prop, this.ruleForm[prop]);
      } else if (val.indexOf("~") < 0) {
        if (val.indexOf(">") >= 0) {
          let vals = val.split(/\>=*/);
          this.ranges["min_" + prop] = +vals[1];
          this.ranges["max_" + prop] = "";
        } else {
          this.ranges["min_" + prop] = "";
          this.ranges["max_" + prop] = "";
        }
      } else {
        let vals = val.split("~");
        this.ranges["min_" + prop] = +vals[0];
        this.ranges["max_" + prop] = +vals[1];
      }
    },
    // 重置选择条件
    resetCondition() {
      this.buttonList.forEach(el => {
        this.$set(this.ruleForm, el.prop, el.list[0].value);
        if (el.bindVal) {
          this.$set(this.ranges, el.prop, el.list[0].value);
        } else {
          this.$set(this.ranges, "min_" + el.prop, "");
          this.$set(this.ranges, "max_" + el.prop, "");
        }
      });

      // 清除上架时间
      if (this.depthType) {
        this.$set(this.ruleForm, this.time.prop, this.getNumDay(7));
        this.$set(this.ruleForm, "time", 7);
      } else {
        this.$set(this.ruleForm, this.time.prop, []);
        this.$set(this.ruleForm, "time", null);
      }
      this.ruleForm.rangeDate1 = [];

      // 清除ranges条件
      this.ranges.fbpFlag = null;
      this.ranges.period = null;

      // 清除选择的类目
      this.category = [];
    },

    // 初始化表单数据
    initFormdata(data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (key === "categoryQuery") {
            continue;
          }
          if (key.indexOf("min") > -1 || key.indexOf("max") > -1) {
            // 日期处理
            if (
              key === "minDate" ||
              key === "maxDate" ||
              key.indexOf(this.$.firstCase(this.time.prop)) > -1
            ) {
              continue;
            } else {
              // 其它处理
              let prop = key
                .replace(/^(min|max)/, "")
                .replace(/^[A-Z]/, function(val) {
                  return val.toLowerCase();
                });
              let value =
                data["min" + this.$.firstCase(prop)] +
                "~" +
                data["max" + this.$.firstCase(prop)];
              if (
                data["min" + this.$.firstCase(prop)] == null &&
                data["max" + this.$.firstCase(prop)] == null
              ) {
                // 如果是空，则是默认
                let btn = this.buttonList.find(el => el.prop === prop);
                let value = btn.list[0].value;
                if (btn.bindVal) {
                  console.log(12112);
                } else {
                  this.$set(this.ruleForm, prop, value);
                }
              } else if (
                data["min" + this.$.firstCase(prop)] &&
                data["min" + this.$.firstCase(prop)] !== "" &&
                data["max" + this.$.firstCase(prop)] == null
              ) {
                this.$set(
                  this.ruleForm,
                  prop,
                  ">=" + data["min" + this.$.firstCase(prop)]
                );
                this.$set(
                  this.ranges,
                  "min_" + prop,
                  data["min" + this.$.firstCase(prop)]
                );
              } else if (
                data["max" + this.$.firstCase(prop)] &&
                data["max" + this.$.firstCase(prop)] !== "" &&
                data["min" + this.$.firstCase(prop)] == null
              ) {
                this.$set(
                  this.ruleForm,
                  prop,
                  "<=" + data["max" + this.$.firstCase(prop)]
                );
                this.$set(
                  this.ranges,
                  "max_" + prop,
                  data["max" + this.$.firstCase(prop)]
                );
              } else {
                this.$set(this.ruleForm, prop, value);
                this.$set(
                  this.ranges,
                  "min_" + prop,
                  data["min" + this.$.firstCase(prop)]
                );
                this.$set(
                  this.ranges,
                  "max_" + prop,
                  data["max" + this.$.firstCase(prop)]
                );
              }
            }
          } else {
            this.$set(this.ruleForm, key, element);
            this.$set(this.ranges, key, element);
          }

          this.$nextTick(() => {
            this.str1 = this.str;
          });
        }
      }

      this.$set(this.ruleForm, this.time.prop, [
        data["min" + this.$.firstCase(this.time.prop)] || "",
        data["max" + this.$.firstCase(this.time.prop)] || ""
      ]);

      // 设置上架时间的初始化，如果都为空，赋null值，而不是数组值
      if (
        data["min" + this.$.firstCase(this.time.prop)] == null &&
        data["max" + this.$.firstCase(this.time.prop)] == null
      ) {
        this.$set(this.ruleForm, this.time.prop, []);
      } else {
        this.$set(this.ruleForm, this.time.prop, [
          data["min" + this.$.firstCase(this.time.prop)] || "",
          data["max" + this.$.firstCase(this.time.prop)] || ""
        ]);
      }

      // 设置时间筛选的选择项
      if (data.minDate && data.minDate !== "") {
        let rangeData = [data.minDate, data.maxDate];
        this.$set(this.ruleForm, "rangeDate1", rangeData);
        // 判断最后一个日期是否为今天 ，如果不是今天 ，时间筛选就不是快捷方式
        if (this.$.formatDate(Date.now(), "{y}-{m}-{d}") === data.maxDate) {
          this.optionsTime.forEach(element => {
            let date = this.getNumDay(element.value)[0];
            if (date === data.minDate) {
              this.$set(this.ruleForm, "time", element.value);
            }
          });
        }
      }

      // 设置类目选项
      this.setCategoryByName(data.categoryQuery);
    },

    setCategoryByName(nameArr) {
      nameArr = nameArr.split(":");
      let parent = "";
      if (nameArr.length !== 1) {
        nameArr.reduce((cur, first) => {
          this.getCategoryList(cur, data => {
            this.findItem(this.options2, cur, parent);
            if (this.selEl) {
              data.forEach(el => {
                el.childs = [];
              });
              this.$set(this.selEl, "childs", data);
              parent += ":" + first;
            }
          });
        });
      }
      this.category = nameArr;
    },

    // 获取近几天范围
    getNumDay(n) {
      return [
        this.$.formatDate(
          Date.now() - 24 * 3600 * 1000 * (n - 1),
          "{y}-{m}-{d}"
        ),
        this.$.formatDate(Date.now(), "{y}-{m}-{d}")
      ];
    },

    // 搜索
    search() {
      this.$emit("search-click", this.formatRange);
      this.activeNames = "";
    },

    handlerFocus(prop) {
      // console.log(2312);
      if (
        this.ranges["min_" + prop] === "" &&
        this.ranges["max_" + prop] === ""
      ) {
        let btn = this.buttonList.find(el => el.prop === prop);
        this.ruleForm[prop] = btn.list[0].value;
      } else if (
        this.ranges["min_" + prop] === "" &&
        this.ranges["max_" + prop] !== ""
      ) {
        this.ruleForm[prop] = "<=" + this.ranges["max_" + prop];
      } else if (
        this.ranges["min_" + prop] !== "" &&
        this.ranges["max_" + prop] === ""
      ) {
        this.ruleForm[prop] = ">=" + this.ranges["min_" + prop];
      } else if (
        this.ranges["min_" + prop] !== "" &&
        this.ranges["max_" + prop] !== ""
      ) {
        this.ruleForm[prop] =
          this.ranges["min_" + prop] + "~" + this.ranges["max_" + prop];
      }
    },

    // 条件保存及重载
    saveCondition() {
      const { str: categoryQuery, ranges } = this;
      let obj = {};

      if (!this.saveUrl) {
        console.error("没有传入url");
        return;
      }

      for (const key in ranges) {
        if (ranges.hasOwnProperty(key)) {
          const element = ranges[key];
          if (key.indexOf("_") > -1) {
            let m = key.split("_");
            let i = m[0] + this.$.firstCase(m[1]);
            obj[i] = element;
          } else {
            obj[key] = element;
          }
        }
      }

      this.$axios
        .post(this.saveUrl, {
          categoryQuery: this.category.join(":"),
          ...obj,
          ["min" + this.$.firstCase(this.time.prop)]: this.ruleForm[
            this.time.prop
          ][0],
          ["max" + this.$.firstCase(this.time.prop)]: this.ruleForm[
            this.time.prop
          ][1],
          ["minDate"]: this.ruleForm.rangeDate1[0],
          ["maxDate"]: this.ruleForm.rangeDate1[1]
        })
        .then(res => {
          this.$.handlerCode(res, () => {
            this.getProductTerm();
            this.activeNames = "1";
          });
        });
    },

    // 获取常用筛选信息
    getProductTerm() {
      if (!this.getUrl) {
        return;
      }
      this.$axios.post(this.getUrl).then(res => {
        if (res.data.code !== 0) {
          return;
        }
        let data = res.data.data;
        const date = this.getNumDay(7);
        data = { ...data, minDate: date[0], maxDate: date[1] };
        this.condition = data;
        // this.str = data.categoryQuery;
        this.initFormdata(data);
      });
    }
  },

  watch: {
    // 选择日期快捷
    "ruleForm.time"(val) {
      if (!val) {
        return;
      }
      this.$set(this.ruleForm, "rangeDate1", this.getNumDay(val));
    }
  },
  computed: {
    formatRange() {
      let ret = {};
      // 把格式转成陀峰
      for (const key in this.ranges) {
        if (this.ranges.hasOwnProperty(key)) {
          const element = this.ranges[key];
          let i;
          if (key.indexOf("_") > -1) {
            i = key.replace(/\_[a-z]/, function(val) {
              return val.toUpperCase().substr(1);
            });
          } else {
            i = key;
          }
          ret[i] = element;
        }
      }

      // 时间
      if (this.ruleForm.rangeDate1.length > 1) {
        ret.minDate = this.ruleForm.rangeDate1[0];
        ret.maxDate = this.ruleForm.rangeDate1[1];
      }

      let propTime = this.ruleForm[this.time.prop];

      if (propTime && propTime.length > 1) {
        ret["min" + this.$.firstCase(this.time.prop)] = propTime[0];
        ret["max" + this.$.firstCase(this.time.prop)] = propTime[1];
      }

      // 获取当前选择的类目
      ret.categoryQuery = this.category.join(":");

      return ret;
    },

    str: {
      get() {
        console.log("object");
        let arr = [];
        let first = this.ruleForm[this.time.prop];
        let senc = this.ruleForm.rangeDate1;

        // 类目信息
        if (
          this.category &&
          this.category.length > 0 &&
          this.category.some(el => el !== "")
        ) {
          arr.push(`类目：` + this.category.join(" > "));
        }

        // 第一个时间
        if (first && first.length > 0 && first[0]) {
          arr.push(`${this.time.label}: ${first[0]}~${first[1]}`);
        }

        // 时间筛选
        if (senc && senc.length > 0 && senc[0]) {
          if (this.ruleForm.time) {
            const text = this.optionsTime.find(
              el => el.value === this.ruleForm.time
            ).label;
            arr.push(`时间筛选: ${text}`);
          } else {
            arr.push(`时间筛选: ${senc[0]}~${senc[1]}`);
          }
        }

        this.ranges &&
          this.buttonList.forEach(el => {
            if (el.bindVal) {
              // 绑定的值是value
              if (this.ranges[el.prop] != null && this.ranges[el.prop] !== "") {
                const text = el.list.find(i => i.value === this.ranges[el.prop])
                  .label;
                arr.push(`${el.name}: ${text}`);
              }
            } else {
              // 绑定的是label
              let val = this.ruleForm[el.prop];
              if (val != null && val !== "") {
                if (val == el.list[0].label) {
                  return false;
                } else {
                  arr.push(`${el.name}: ${val}`);
                }
              } else {
                // ranges
                let val,
                  min = this.ranges["min_" + this.$.firstCase(el.prop)],
                  max = this.ranges["max_" + this.$.firstCase(el.prop)];
                if (min != null && min !== "" && !~~max) {
                  arr.push(`${el.name}: >=${min}`);
                } else if (min != null && min !== "" && ~~max) {
                  arr.push(`${el.name}: ${min}~${max}`);
                } else if (!~~min && ~~max) {
                  arr.push(`${el.name}: <=${max}`);
                }
              }
            }
          });

        return arr.join(";  ");
      }
      // set(val) {
      //   // this.str = val;
      //   this.str1 = val;
      // }
    }
  }
};
</script>

<style lang="scss">
.el-collapse-item__header {
  // color: $titleColor;
  padding: 0 10px;
}
.el-collapse {
  border: 1px solid #ebeef5;
}
.el-collapse-item__content {
  padding: 15px;
}
.__FilterInput {
  .el-form-item {
    margin-bottom: 8px;
  }
}
</style>


<style module lang="scss">
.color {
  composes: color from "sass-loader!@/style/cssModule/color.scss";
}
.ml20 {
  composes: ml20 from "sass-loader!@/style/cssModule/color.scss";
}
.flex {
  composes: flex__space_between from "sass-loader!@/style/cssModule/color.scss";
}
.iconfs {
  composes: iconfs from "sass-loader!@/style/cssModule/color.scss";
  margin-right: 20px;
}
.border {
  composes: border from "sass-loader!@/style/cssModule/color.scss";
}
.close {
  position: absolute;
  right: 0;
  top: 0;
}
.reset {
  min-width: 224px;
}
.nowrap {
  composes: no_wrap from "sass-loader!@/style/cssModule/color.scss";
}
.cursor {
  cursor: pointer;
}
</style>
