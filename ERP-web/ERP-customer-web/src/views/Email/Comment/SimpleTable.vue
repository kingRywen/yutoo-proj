<template>
  <div :style="style.marginTop">
    <div class="simple-table" :style="style.border" v-if="isFlag">
      <div class="left" :style="style.lw">
        <div class="colmuns" :class="{ mustFillSign:lMust}">{{ columns[0] }}</div>
      </div>
      <div class="right" :style="style.rw">
        <div class="colmuns" :class="{ mustFillSign:rMust}">{{columns[1] }}</div>
      </div>
      <div class="right" :style="style.rw">
        <div class="colmuns" :class="{ mustFillSign:rMust}">{{columns[2] }}</div>
      </div>
      <div class="right" :style="style.rw">
        <div class="colmuns" :class="{ mustFillSign:rMust}">{{columns[3] }}</div>
      </div>
    </div>
    <div class="simple-table" :style="style.border" :class="{borderTop: !addClass}">
      <div class="left" :style="style.lw">
        <slot name="left"></slot>
      </div>
      <div class="right" :style="style.rw">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lw: {
      type: String, // 左行宽
      default: '280px'
    },
    rw: {
      type: String, // 右行宽
      default: '590px'
    },
    lMust: {
      type: Boolean, // 左必选标记
      default: false
    },
    rMust: {
      type: Boolean, // 右必选标记
      default: false
    },
    marginTop: {
      type: String,
      default: ''
    },
    isNav: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array // 必传 ['1','2']
    }
  },
  data() {
    return {
      borderTop: '',
      isFlag: this.isNav,
      addClass: false,
      style: {
        lw: {
          width: this.lw
        },
        rw: {
          width: this.rw
        },
        marginTop: {
          'margin-top': this.marginTop
        }
      }
    }
  },
  mounted() {
    if (!this.isFlag) {
      this.addClass = true
    } else {
      this.addClass = false
    }
  }
}
</script>

<style lang='scss'>
.simple-table {
  overflow: hidden;
  border: 1px solid #bbb;
  &::before {
    content: '';
    clear: both;
  }
  .left {
    float: left;
    padding: 4px 0 4px 10px;

    box-sizing: border-box;
    .colmuns {
      line-height: 30px;
    }
  }

  .right {
    float: left;
    padding: 4px 0 4px 10px;
    box-sizing: border-box;
    border-left: 1px solid #bbb;
    .colmuns {
      line-height: 30px;
    }
  }
  .mustFillSign {
    @include must-fill-sign;
  }
}
.borderTop {
  border-top: none;
}
</style>
