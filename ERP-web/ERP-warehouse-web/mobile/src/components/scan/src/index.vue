<template>
  <div class="scan">
    <div class="product-code">
      <flexbox>
        <flexbox-item :span="4/5">
          <x-input
            v-if="type == 'input'"
            v-model="values"
            :placeholder="placeholder"
            :title="title"
            placeholder-align="left"
            :disabled="disabled"
            @on-click-clear-icon="onClickClear"
            @on-change="change"
          ></x-input>
          <x-textarea
            v-else-if="type == 'textarea'"
            :title="title"
            :placeholder="placeholder"
            v-model="values"
            :height="40"
            :disabled="disabled"
            @on-change="change"
          ></x-textarea>
        </flexbox-item>
        <flexbox-item :span="1/5">
          <div class="scanning">
            <i class="iconfont icon-saoyisao scanningicon" @click="handleClick"></i>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scan',
  props: {
    value: {
      default: ''
    },
    placeholder: {
      default: '产品条码'
    },
    type: {
      default: 'input'
    },
    title: {
      default: ''
    },
    disabled: {
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    values: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  methods: {
    change(val) {
      this.$emit('update:value', val)
    },
    handleClick() {
      if (!this.values) {
        this.$msg(`请扫描${this.placeholder}`)
        return
      }
      this.$emit('click', this.values)
    },
    onClickClear() {
      this.values = ''
      this.$emit('clear')
    }
  }
}
</script>

<style lang='scss'>
.scan {
  background: #fff;
  .product-code {
    margin-top: 10px;
    border: 1px solid #c7c7c7;
    margin-bottom: 10px;
    border-radius: 5px;
    .weui-cell {
      padding: 15px;
    }
    .scanning {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .scanningicon {
        padding: 0 10px;
        font-size: 28px;
      }
    }
  }
}
</style>