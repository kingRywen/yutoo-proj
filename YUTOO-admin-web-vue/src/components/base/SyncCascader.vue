<template>
  <el-cascader class="__yt_cascader" :options="options2" :disabled="disabled" @active-item-change="handleItemChange" :props="props" :size="size" style="width:100%" @change="handlerChange" :value="value" @input="$emit('input', $event)" separator=" > "></el-cascader>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "small"
    },
    load: {
      type: Function,
      default: () => Promise.resolve([])
    },
    city: {
      type: String
    },
    props: {
      type: Object,
      default: () => ({
        value: "label",
        children: "children"
      })
    }
  },
  data() {
    return {
      options2: [],
      selEl: null
    };
  },
  created() {
    let vm = this;

    const quene = async function(arr) {
      const promises = arr.map(async id => {
        const res = await vm.load([id]);
        return res.map(el => ({
          ...el,
          disabled: !el[vm.enabledKey]
        }));
      });

      let ret = [];

      for (const promise of promises) {
        ret.push(await promise);
      }
      return ret;
    };
    // debugger
    if (this.value && this.value.length > 0) {
      // 有初始值

      vm.load().then(data => {
        if (data && Array.isArray(data)) {
          vm.options2 = data.map(el => ({
            ...el,
            disabled: !el[vm.enabledKey]
          }));
          quene(vm.value.slice(0, vm.value.length - 1)).then(res => {
            console.log(res);
            res.forEach((el, index) => {
              vm.findItem(vm.options2, vm.value[index]);
              if (vm.selEl) {
                vm.$set(vm.selEl, vm.props.children, el);
              }
            });
          });
        }
      });
    } else {
      this.load().then(data => {
        console.log(data);
        if (data && Array.isArray(data)) {
          this.options2 = data.map(el => ({
            ...el,
            disabled: !el[vm.enabledKey]
          }));
        } else {
          console.error("数据错误", JSON.stringify(data));
        }
      });
    }
  },
  methods: {
    handlerChange(val) {
      let _el = this.selEl[this.props.children].find(
        el => el[this.props.value] === val[val.length - 1]
      );
      this.$emit("change", _el);
    },
    getName() {
      let text = this.$el
        .querySelectorAll(".el-cascader__label")[0]
        .innerText.split("/")
        .map(el => el.trim());
      console.log(text);
      return text;
    },
    handleItemChange(e) {
      // debugger;
      let vm = this;
      vm.findItem(vm.options2, e[e.length - 1]);
      if (vm.selEl.childs.length === 0) {
        if (this.city) {
          // 城市
          vm.load(e, this.city).then(data => {
            data = data.map(el => ({
              ...el,
              disabled: !el[vm.enabledKey]
            }));
            if (vm.selEl) {
              vm.$set(vm.selEl, vm.props.children, data);
            }
          });
        } else {
          // 正常的
          vm.load(e).then(data => {
            data = data.map(el => ({
              ...el,
              disabled: !el[vm.enabledKey]
            }));
            if (vm.selEl) {
              vm.$set(vm.selEl, vm.props.children, data);
            }
          });
        }
      }
    },
    findItem(arr, id) {
      arr.forEach(el => {
        if (el[this.props.value] === id) {
          this.selEl = el;
          return false;
        } else {
          if (el[this.props.children] && el[this.props.children].length > 0) {
            this.findItem(el[this.props.children], id);
          }
        }
      });
    }
  },
  computed: {
    enabledKey() {
      return this.props.enabled;
    }
  }
};
</script>

<style lang='scss'>
.__yt_cascader {
  .el-cascader__label {
    padding: 0 25px 0 8px;
    font-size: 12px;
  }
}
</style>
