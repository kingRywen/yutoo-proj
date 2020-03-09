<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const delta = 15

export default {
  name: 'ScrollBar',
  data() {
    return {
      top: 0
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerHeight = $container.offsetHeight
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperHeight = $wrapper.offsetHeight
      if ($containerHeight === $wrapperHeight) {
        return
      }
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta)
      } else if ($containerHeight - delta < $wrapperHeight) {
        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
          this.top = this.top
        } else {
          this.top = Math.max(
            this.top + eventDelta,
            $containerHeight - $wrapperHeight - delta
          )
        }
      } else {
        this.top = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  // width: 100%;
  // height: 100%;
  // height: calc(100vh - 64px);
  overflow: hidden;
  border: 1px solid #dcdfe6;
  background-color: #fafafa;
  height: 100%;
  .scroll-wrapper {
    position: relative;
    width: 100%;
    height: auto;
  }
}
</style>
