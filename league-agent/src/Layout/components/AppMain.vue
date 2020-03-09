<template>
  <section :class="['app-main', {'is-width': $route.meta.width}]" v-if="refresh">
    <div
      style="width:100%"
      v-if="fullScreenUrl.includes($route.path)"
      v-loading="$store.state.isloading"
      element-loading-text="加载中..."
    >
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div v-else :class="['main-wrapper', {
      dash: $route.name === 'dash'
    }]">
      <div :class="['scroll-wrapper']" v-loading="$store.state.isloading" element-loading-text="加载中...">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      classN: true,
      refresh: true,
      logCounts: this.$storage.get('local', 'logCounts'),
      introSteps: this.$storage.get('local', 'introSteps') || {},
      backRoutes: [],
      fullScreenUrl: [
        '/error/404',
        '/error/403',
        '/error/empty',
        '/error/notpermission'
      ]
    }
  },
  computed: {
    ...mapState('app', ['keepAlive']),
    showRouter() {
      const list = [
        '/product/common/setup/temp',
        '/product/amazon/storeProduct',
        '/product/amazon/platProduct',
        '/product/amazon/improves',
        '/product/amazon/banDisplay',
        '/product/amazon/changePro'
      ]
      if (list.find(i => i === this.$route.path)) return true
      return false
    }
  },
  created() {
    GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh)
    GLOBAL.vbus.$on('intro.start', this.startIntro)
  },
  mounted() {
    if (this.logCounts === 0 && !this.introSteps.one) {
      this.$nextTick(() => {
        this.startIntro()
      })
    }
  },
  destroyed() {
    GLOBAL.vbus.$off('page.main.refresh', this.mainRefresh)
    GLOBAL.vbus.$off('intro.start', this.startIntro)
  },
  methods: {
    setIntro(el, content, step) {
      el.setAttribute('data-intro', content)
      el.setAttribute('data-step', step)
    },
    // 开始引导
    startIntro(isNavClick = false) {
      // 首页引导
      if (this.$route.name !== '店铺管理') {
        this.$router.replace('/stores').then(() => {
          if (isNavClick) {
            setTimeout(() => {
              this.routeStrag(isNavClick)
            }, 500)
          }
        })
      } else {
        this.routeStrag(isNavClick)
      }
    },
    routeStrag(isNavClick) {
      if (
        this.$route.name === '店铺管理' &&
        (isNavClick || !this.introSteps.one)
      ) {
        if (this.introJs) {
          this.initialIntro(this.introJs, isNavClick)
        } else {
          import('intro.js/introjs.css')
          import('intro.js').then(({ default: introJs }) => {
            this.introJs = introJs
            this.initialIntro(introJs, isNavClick)
          })
        }
      }
    },
    initialIntro(introJs, isNavClick) {
      let mainLayout = document.querySelectorAll(
        '.scroll-wrapper .main-layout'
      )[0]
      this.loadUtilDisplay(() => {
        // clearIntro()
        // this.intro = introJs()
        // 打开充值消费的下拉
        GLOBAL.vbus.$emit('nav.open', true)
        if (this.intro) {
          this.intro.start()
        } else {
          let vm = this
          const clearIntro = () => {
            // if (vm.intro) {
            //   vm.intro.exit(true)
            //   vm.intro._introItems.splice(0)
            //   vm.intro = null
            // }
          }
          const setViewed = newChargeNode => {
            setTimeout(() => {
              clearIntro()
            }, 200)
            GLOBAL.vbus.$emit('nav.open', false)
            vm.$storage.set('local', 'introSteps', { one: true })
            if (vm.$route.path !== '/dash') {
              vm.$router.replace('/dash')
            }

            // if (newChargeNode && newChargeNode.parentElement) {
            //   newChargeNode.parentElement.removeChild(newChargeNode)
            // }
            newChargeNode.style.visibility = 'hidden'
            newChargeNode.firstElementChild.innerHTML = '新增店铺'
            if (vm.nextBtn && vm.nextBtn.parentElement) {
              vm.nextBtn.removeEventListener('click', vm.again)
              vm.nextBtn.parentElement.removeChild(vm.nextBtn)
              vm.nextBtn = null
            }
          }
          const setBtn = (el, width, left, top, path) => {
            if (path) {
              this.$router.replace(path)
            }
            el.style.visibility = 'visible'
            el.style.position = 'fixed'
            el.style.display = 'block'
            el.style.width = width + 'px'
            el.style.left = left + 'px'
            el.style.top = top + 'px'
            document.body.appendChild(el)
          }
          let btn = mainLayout.querySelectorAll('.tabs button')[0]
          let nav_recharge = document.querySelectorAll(
            '.el-menu--horizontal .el-menu li'
          )[0]
          let nav_task = document.querySelectorAll(
            '.el-menu--horizontal .el-menu-item .nav-item'
          )[0]
          // debugger
          let btnOffset = this.getOffset(btn)
          let newChargeNode
          if (this.newChargeNode) {
            newChargeNode = this.newChargeNode
          } else {
            newChargeNode = btn.cloneNode(true)
            newChargeNode.style.display = 'none'
            newChargeNode.style.fontSize = '16px'
            newChargeNode.firstElementChild.innerHTML = '新增店铺'
            btn.parentElement.appendChild(newChargeNode)
          }
          this.intro = introJs()
            .setOptions({
              prevLabel: '上一步',
              nextLabel: '下一步',
              skipLabel: '跳过',
              doneLabel: '完成',
              hideNext: true,
              exitOnOverlayClick: false,
              disableInteraction: true,
              showProgress: true,
              steps: [
                {
                  element: newChargeNode,
                  intro: '请先新增一个店铺'
                },
                {
                  element: nav_recharge,
                  intro:
                    '新增店铺以后，您可以为自己的账户充值余额，点击“充值”进入页面'
                },
                {
                  element: newChargeNode,
                  intro:
                    '点击“充值”，填写完充值信息提交后，请等待我们的审核结果，审核通过后您本次充值成功'
                },
                {
                  element: nav_task,
                  intro: '接下来点击进入到“任务中心”'
                },
                {
                  element: newChargeNode,
                  intro:
                    '点击“发布任务”即可发布您的任务，提交任务后会在您的余额中扣除相应的任务佣金'
                }
              ]
            })
            .onbeforechange(targetElement => {
              // console.log(targetElement)
              if (newChargeNode === targetElement) {
                if (newChargeNode.firstElementChild.innerHTML == '充值') {
                  // 充值提示
                  setBtn(
                    newChargeNode,
                    100,
                    btnOffset.left,
                    btnOffset.top + 28,
                    '/recharge'
                  )
                } else if (
                  newChargeNode.firstElementChild.innerHTML == '新增店铺'
                ) {
                  // 新增店铺提示
                  setBtn(newChargeNode, 110, btnOffset.left - 10, btnOffset.top)
                } else {
                  // 任务中心提示
                  setBtn(
                    newChargeNode,
                    120,
                    btnOffset.left - 20,
                    btnOffset.top,
                    '/dash'
                  )
                }
              } else if (nav_task === targetElement) {
                // 任务中心跳转提示
                newChargeNode.firstElementChild.innerHTML = '发布任务'
                newChargeNode.style.visibility = 'hidden'
              }
            })
            .onafterchange(targetElement => {
              if (newChargeNode === targetElement && !isNavClick) {
                if (newChargeNode.firstElementChild.innerHTML == '发布任务') {
                  let parent = document.querySelectorAll(
                    '.introjs-tooltip .introjs-tooltipbuttons'
                  )[0]
                  let bt = parent.querySelectorAll('.introjs-donebutton')[0]
                  let nextBtn = bt.cloneNode()
                  this.nextBtn = nextBtn
                  // debugger
                  if (this._addBtn !== true) {
                    this._addBtn = true

                    setTimeout(() => {
                      nextBtn.style.float = 'left'
                      nextBtn.classList.remove('.introjs-donebutton')
                      nextBtn.classList.add('.introjs-nextbutton')
                      parent.insertBefore(nextBtn, bt)
                      nextBtn.innerHTML = '再来一次'
                      nextBtn.addEventListener('click', this.again)
                    }, 500)
                  }
                }
              }
              if (
                newChargeNode.firstElementChild.innerHTML == '新增店铺' &&
                nav_recharge === targetElement
              ) {
                newChargeNode.style.visibility = 'hidden'
                newChargeNode.firstElementChild.innerHTML = '充值'
              }
            })
            .oncomplete(() => {
              try {
                newChargeNode.parentElement.removeChild(newChargeNode)
              } catch (error) {}
              setViewed(newChargeNode)
            })
            .onbeforeexit(() => {
              setViewed(newChargeNode)
            })
            .start()
        }
      }, mainLayout)
    },
    again() {
      this.intro.exit()
      setTimeout(() => {
        this.startIntro(true)
      }, 200)
    },
    getOffset(el) {
      let left = el.offsetLeft,
        top = el.offsetTop
      while (el.offsetParent) {
        left += el.offsetParent.offsetLeft
        top += el.offsetParent.offsetTop
        el = el.offsetParent
      }
      return { left, top }
    },
    loadUtilDisplay(fn, el) {
      this.loadNum = this.loadNum + 1 || 0
      if (this.loadNum > 10) {
        return
      }

      if (el) {
        fn.call(this)
        clearTimeout(this.timer)
        this.timer = null
        // this.loadNum = 11
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.loadUtilDisplay(fn, el)
        }, 300)
      }
    },
    mainRefresh() {
      console.log('刷新')
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    }
  }
  // computed: {
  //   cachePage() {
  //     return this.$store.state.app.cachePage
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.app-main {
  flex: 1;
  background: #fff;
  .main-wrapper {
    margin: 0 auto;
    transition: all 0.15s ease;
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
    background: #fff;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    position: relative;
    // height: 100%;
    // overflow: auto;
    &.dash {
      background: #fff;
      height: 100%;
      // padding: 30px;
    }
    .scroll-wrapper {
      flex: auto;
      width: 100%;
      height: 100%;
      margin-bottom: 20px;
    }
  }
  &.is-width {
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    .main-wrapper {
      width: 1140px;
      height: 100%;
    }
  }
}
.__cov-progress {
  height: 3px !important;
  background: $titleColor !important;
  position: absolute !important;
}
</style>
