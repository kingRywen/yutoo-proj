<template>
  <div
    class="el-select yt-tree-select"
    :class="{'show-tree': showTreeWrapper}"
    @click="handleClick"
    v-outside="handleClickOutSide"
  >
    <div class="el-select__tags" :style="selectTagsStyle">
      <!---->
      <span @click.stop>
        <span v-for="(item, index) in showVals" :class="`el-tag el-tag--info el-tag--${collapseTagSize}`" :key="index">
          <span class="el-select__tags-text">{{item}}</span>
          <i class="el-tag__close el-icon-close" @click.stop="handleDelete(item)"></i>
        </span>
        <span v-if="value.length > 1" :class="`el-tag el-tag--info el-tag--${collapseTagSize}`">
          <span class="el-select__tags-text">+ {{value.length-1}}</span>
        </span>
      </span>
      <!---->
    </div>
    <el-input suffix-icon="el-icon-arrow-down" :size="size" readonly :placeholder="!value.length ? '请选择' : null"></el-input>
    <yt-transition name="fadeInUp-fadeOutDown">
      <!-- <div class="tree-wrapper" v-if="showTreeWrapper">
        <el-tree :data="options" :props="props"></el-tree>
      </div>-->
      <div class="tree-wrapper el-select-dropdown el-popper is-multiple" v-show="showTreeWrapper">
        <el-tree
          :node-key="props.nodeKey"
          ref="tree"
          show-checkbox
          :data="options"
          :props="props"
          :check-strictly="false"
          :check-on-click-node="true"
          :expand-on-click-node="false"
          @check-change="handleTreeCheckChange"
          :render-content="renderContent"
        >
          <span slot-scope="{node, data}">
            <span>{{data.label}}</span>
          </span>
        </el-tree>
        <div x-arrow class="popper__arrow bottom" style="left: 35px;"></div>
      </div>
    </yt-transition>
  </div>
</template>

<script>
export default {
  name: 'YtTreeSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      showTreeWrapper: false,
      selectTagsStyle: {
        width: '100%',
        userSelect: 'none',
        maxWidth: '208px',
        height: '26px',
        overflow: 'hidden'
      }
    }
  },
  props: {
    // node节点渲染函数
    renderContent: {
      type: Function,
      default: () => {}
    },
    // @选项项显示： true 显示缩写项，false显示全部项
    collapseTags: {
      type: Boolean,
      default: true
    },
    // @输入框大小： 与el-input 类似
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {},
      required: true
    }
    // 上面的选项与el-tree中的props一样
    // 新增nodeKey为el-tree中的nodeKey
    /* 
      children: 'children',
      label: 'label',
      nodeKey: 'label' 
    */
  },
  computed: {
    showVals() {
      return this.collapseTags ? this.value.slice(0, 1) : this.value
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.size) > -1 ? 'mini' : 'small'
    }
  },
  methods: {
    handleClick() {
      this.showTreeWrapper = !this.showTreeWrapper
    },
    handleClickOutSide() {
      this.showTreeWrapper = false
    },
    // eslint-disable-next-line
    handleTreeCheckChange(data, selected, subSelect) {
      this.$emit('change', this.$refs.tree.getCheckedKeys(true))
    },
    handleDelete(nodeKey) {
      if (this.collapseTags) {
        this.$emit('change', [])
      } else {
        let checked = this.$refs.tree
          .getCheckedKeys(true)
          .filter(el => el !== nodeKey)
        this.$emit('change', checked)
      }
    },
    setSelected(val) {
      this.$refs.tree.setCheckedKeys(val, true)
    }
  },
  watch: {
    value(val) {
      this.setSelected(val)
    },
    // eslint-disable-next-line
    options(val) {
      this.$nextTick(() => {
        this.setSelected(this.value)
      })
    }
  },
  mounted() {
    this.setSelected(this.value)
  }
}
</script>

<style lang="scss">
.yt-tree-select {
  .el-input__suffix-inner {
    display: inline-block;
    transition: all 0.25s ease-in-out;
  }
  .tree-wrapper {
    position: absolute;
    width: 100%;
    margin-top: 20px;
    .el-tree-node__content {
      height: 32px;
    }
    .bottom {
      top: -6px;
      left: 50%;
      margin-right: 3px;
      border-top-width: 0;
      border-bottom-color: #ebeef5;
      &:after {
        top: 1px;
        margin-left: -6px;
        border-top-width: 0;
        border-bottom-color: #fff;
      }
    }
  }
  &.show-tree {
    .el-input__suffix-inner {
      transform: rotate(180deg);
    }
  }
}
</style>
