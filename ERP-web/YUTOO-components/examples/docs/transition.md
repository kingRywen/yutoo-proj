## 动画组件

用于处理动画效果，动画库使用[animate.css](https://daneden.github.io/animate.css/)

### 基础 动画组件

左右渐隐动画

:::demo `name`属性使用animate.css中的Class名称拼接, 例如，要创建一个上下淡出动画，可以传入`fadeIn-fadeOut`给name, 默认名字`fadeInRight-fadeOutRight`, `mdoe`属性对应transition中的`mode` 默认`out-in`, 注意：使用时如果存在两个子元素，最好给每个子元素添加不同的key属性，目前只支持两个元素的动画效果

```html
<yt-transition mode="out-in">
  <div v-if="show">123123</div>
  <span v-else>1111</span>
</yt-transition>
<el-button @click="handleClick">切换</el-button>
<script>
  export default {
    data() {
      return {
        show: true
      }
    },
    methods: {
      handleClick() {
        this.show = !this.show
      }
    }
  }
</script>
```
:::

