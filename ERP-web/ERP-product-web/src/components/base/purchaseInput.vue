<template>
  <!-- 正常输入 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-if="$attrs.type == 1"
    :prop="item.uploadMustFlag ? item.displayKey : ''"
  >
    <!-- {{$attrs.disabled}} -->
    <v-input-number
      :disabled="item.disabled"
      :value="+value"
      @input="$emit('input', $event)"
      v-if="$attrs.dataType === 1"
      size="large"
      style="width:100%"
      v-on="parentListeners"
    ></v-input-number>
    <v-input
      :disabled="item.disabled"
      :value="value"
      @input="$emit('input', $event)"
      v-on="parentListeners"
      style="width:100%"
      v-else
    ></v-input>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 选择 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 2"
    :prop="item.uploadMustFlag ? item.displayKey : ''"
  >
    <v-select
      :disabled="item.disabled"
      size="lg"
      style="width: 100%;"
      :data="options"
      :value="value"
      @input="$emit('input', $event)"
      label="propertyValue"
      clue="propertyValue"
    ></v-select>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 多行文本 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 4"
    :prop="item.uploadMustFlag ? item.displayKey : ''"
  >
    <v-input :disabled="item.disabled" :value="value" @input="$emit('input', $event)" type="textarea"></v-input>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 单选 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 5"
    :prop="item.uploadMustFlag ? item.displayKey : ''"
  >
    <v-radio
      :disabled="item.disabled"
      v-for="i in options_new"
      :value="value"
      @input="$emit('input', $event)"
      :label="i.value"
    >{{i.value}}</v-radio>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 日期 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 6"
    :prop="item.uploadMustFlag ? item.displayKey : ''"
  >
    <v-date-picker
      :disabled-date="disabledDate"
      :disabled="item.disabled"
      :value="value"
      @input="$emit('input', $event)"
      style="width:100%"
    ></v-date-picker>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 颜色选择器 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 9"
    :prop="item.uploadMustFlag ? item.displayKey : ''"
  >
    <v-date-picker :disabled="item.disabled" :value="value" @input="$emit('input', $event)" style="width:100%"></v-date-picker>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 级联类目选择器 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 100"
  >
    <el-cascader
      :disabled="item && item.disabled"
      size="small"
      :options="categoryPlatformEntityList"
      @active-item-change="handleItemChange"
      :props="props"
      @change="$emit('input', $event)"
      :value="value"
      style="width:100%"
    ></el-cascader>
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <!-- 正常显示文字 -->
  <v-form-item
    ref="inputs"
    :label="$attrs.label"
    :label-col="{span:4}"
    :wrapper-col="{span:16}"
    v-else-if="$attrs.type == 101"
  >
    {{value}}
    <!-- <el-tooltip :content="after" v-if="after" placement="top">
      <img @click="setVal" src="/static/icons/tip.png" alt="">
    </el-tooltip>-->
  </v-form-item>

  <v-form-item ref="inputs" :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else>
    <div>{{$attrs.type}}:无组件</div>
  </v-form-item>
</template>

<script>
import Vue from 'vue'
import { fetchData } from 'common/common'
import apis from 'apis'
import { Cascader, Tooltip } from 'element-ui'

Vue.use(Cascader)
Vue.use(Tooltip)

export default {
  inheritAttrs: false,
  components: {
    Cascader
  },
  props: ['value', 'item', 'isVariant', 'site', 'categoryId', 'after'],
  created() {
    //  采购编辑动态字段
    if (this.$attrs.type == 2) {
      let site = this.site
      let id = []
      for (const key in site) {
        if (site.hasOwnProperty(key)) {
          const element = site[key]
          if (element.cate && element.cate[1]) {
            id.push(element.cate && element.cate[1])
          }
        }
      }
      // 查询接口
      fetchData({
        ...apis.CATEPLTTEMPPROPM_FINDCATEPLTPROPITEM,
        data: {
          propertyName: this.item.propertyName,
          siteId: this.item.siteId[0],
          platformCategoryId: this.site ? +id.join('') : this.categoryId
        }
      }).then(res => {
        console.log(res)
        this.options = res.data.item
      })
    }

    if (this.$attrs.type == 5) {
      let site = this.site
      let id = []
      for (const key in site) {
        if (site.hasOwnProperty(key)) {
          const element = site[key]
          id.push(element.cate && element.cate[1])
        }
      }

      // 查询接口
      fetchData({
        ...apis.CATEPLTTEMPPROPM_FINDCATEPLTPROPITEM,
        data: {
          propertyName: this.item.propertyName,
          siteId: this.item.siteId[0],
          platformCategoryId: this.site ? +id.join('') : this.categoryId
        }
      }).then(res => {
        console.log(res)
        this.options_5 = res.data.item
      })
    }

    if (this.$attrs.type == 100) {
      console.log(this.value, '-------------------')
      let data = {}
      if (this.value) {
        data = this.value
      }
      // 查询接口获取级联类目选择器
      // this.handleItemChange(this.value);
      this.getCategoryPlatformEntityList().then(res => {
        console.log(res)

        this.categoryPlatformEntityList = res.data.categoryPlatformEntityList

        this.categoryPlatformEntityList.forEach(el => {
          if (el.itemType == '') {
            el.childs = []
          }
        })

        this.getCategoryPlatformEntityList({
          parentCategoryId: data[0]
        }).then(res1 => {
          // 设置下级类目列表，如果找到类目ID， 设置类目列表到当前类目下
          // 如果没找到类目id，说明不是此类目
          this.categoryPlatformEntityList.map((el, index) => {
            this.$set(
              this.categoryPlatformEntityList,
              index,
              Object.assign({}, this.categoryPlatformEntityList[index], {
                childs: res1.data.categoryPlatformEntityList
              })
            )
          })
        })
      })
    }
  },
  data() {
    return {
      options: [],
      options_5: [],
      props: {
        children: 'childs',
        value: 'platformCategoryId',
        label: 'categoryName'
      },
      categoryPlatformEntityList: []
    }
  },
  methods: {
    disabledDate(current) {
      return current && current.valueOf() < Date.now()
    },
    setVal() {
      console.log(this.after)
      if (this.after) this.$emit('input', this.after)
    },
    // 设置单选type的值
    setType_5(val) {
      this.$emit('input', val)
    },

    // 获取级联数据
    handleItemChange(val) {
      console.log('active item:', val)

      this.getCategoryPlatformEntityList({
        parentCategoryId: val[val.length - 1]
      }).then(res => {
        console.log(res)

        // 添加childs设置可点击获取数据
        res.data.categoryPlatformEntityList.map((el, index) => {
          if (el.itemType == '') {
            el.childs = []
          }
        })

        // 设置下级类目列表，如果找到类目ID， 设置类目列表到当前类目下
        // 如果没找到类目id，说明不是此类目
        this.categoryPlatformEntityList.map((el, index) => {
          this.$set(
            this.categoryPlatformEntityList,
            index,
            Object.assign({}, this.categoryPlatformEntityList[index], {
              childs: res.data.categoryPlatformEntityList
            })
          )
        })
      })
    },

    // 获取类目
    getCategoryPlatformEntityList(data) {
      return fetchData({
        // FIXME: 可能需要修改站点的参数，现在是暂时写死
        ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
        data: { siteId: 1, ...data }
      })
    }
  },
  watch: {
    optionsAttr(val) {
      this.options = val
    }
  },
  computed: {
    optionsAttr() {
      return this.$attrs.options
    },
    options_new() {
      let opt = this.options_5
      let obj = []
      opt.map((el, i) =>
        obj.push({
          value: el.propertyValue,
          text: el.propertyName
        })
      )

      return obj
    },

    // 监听事件
    parentListeners() {
      let vm = this

      if (!this.isVariant) {
        return {}
      }

      return {
        ...vm.$listeners,
        blur(val) {
          vm.$emit('blur', val)
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
img {
  position: ABSOLUTE;
  z-index: 12;
  width: 36px;
  height: 36px;
  top: 0;
  right: -42px;
  cursor: pointer;
}
</style>
