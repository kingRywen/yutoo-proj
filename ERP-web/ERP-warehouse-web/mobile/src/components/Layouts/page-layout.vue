<template>
  <section class="page-layout">
    <header class="page-header">
      <x-header @on-click-more="showMenus = true" class="headerbg">
        {{title}}
        <template slot="left">
          <slot name="header-left"></slot>
        </template>
        <template slot="right">
          <slot name="header-right"></slot>
        </template>
      </x-header>
    </header>
    <section class="page-container">
      <template v-if="topAllLoaded">
        <x-scroller
          use-pullup
          :pullup-config="pullupDefaultConfig"
          @on-pullup-loading="loadMore"
          use-pulldown
          :pulldown-config="pulldownDefaultConfig"
          @on-pulldown-loading="refresh"
          lock-x
          ref="scrollerBottom"
          height="-48"
        >
          <div>
            <slot></slot>
          </div>
        </x-scroller>
      </template>
      <template v-else>
        <router-view/>
        <slot></slot>
      </template>
    </section>
    <!--  -->
    <footer class="page-footer" v-if="showFooter">
      <slot name="footer">
        <mt-button type="primary" class="btn" @click="handleBtn">{{ footerText }}</mt-button>
      </slot>
    </footer>
  </section>
</template>


<script>
import { Header, Loadmore } from 'mint-ui'
export default {
  props: {
    // header
    fixed: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '导航'
    },
    //container
    topLoadingText: {
      type: String,
      default: ''
    },
    bottomDropText: {
      type: String,
      default: '释放加载数据'
    },
    bottomLoadingText: {
      type: String,
      default: '加载中...'
    },
    topAllLoaded: {
      //默认不开启上拉刷新
      type: Boolean,
      default: false
    },
    bottomAllLoaded: {
      //默认不开启下拉加载
      type: Boolean,
      default: false
    },
    //footer
    footerText: {
      type: String,
      default: '确 定'
    },
    showFooter: {
      //是否显示footer
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pulldownDefaultConfig: {
        content: '下拉刷新',
        height: 40,
        autoRefresh: false,
        downContent: '下拉刷新',
        upContent: '释放后刷新',
        loadingContent: '正在刷新...',
        clsPrefix: 'xs-plugin-pulldown-'
      },
      pullupDefaultConfig: {
        content: '上拉加载更多',
        pullUpHeight: 60,
        height: 40,
        autoRefresh: false,
        downContent: '释放后加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...',
        clsPrefix: 'xs-plugin-pullup-'
      }
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //     this.$refs.scrollerBottom.reset({ top: 0 });
    // });
  },
  methods: {
    refresh() {
      this.$refs.scrollerBottom.enablePullup() //启用上拉刷新插件
      this.$emit('drop-down')
    },
    loadMore() {
      this.$refs.scrollerBottom.enablePullup() //启用上拉刷新插件
      this.$emit('pull-up')
    },
    refreshData() {
      console.log('数据加载完成')
      this.$refs.scrollerBottom.donePulldown() //下拉刷新操作完成，在数据加载后执行
      this.$refs.scrollerBottom.donePullup() //设置上拉刷新操作完成，在数据加载后执行
      this.$refs.scrollerBottom.disablePullup() //禁用上拉刷新，在没有更多数据时执行
    },
    // reset() {
    //     this.$refs.scrollerBottom.reset();
    // },
    handleBtn() {
      this.showFooter && this.$emit('handleBtn')
    }
  }
}
</script>

<style lang="scss" scope>
.headerbg {
  background-color: #26a2ff !important ;
  .vux-header-back,
  .left-arrow {
    color: #ffff !important ;
  }
}
.page-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  .page-header {
    height: 46px;
  }
  .page-container {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }
  .page-footer {
    padding: 10px;
    text-align: center;
    .btn {
      width: 100%;
      background: linear-gradient(to right, #1d62f0, #19d5fd);
    }
  }
}
</style>
