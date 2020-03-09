import Vue from "vue";
import Antd from "ant-design-vue";

import vClickOutside from "v-click-outside";
Vue.use(Antd);
Vue.use(vClickOutside);
import { mapState, mapActions } from "vuex";
import undoRedoHistory from "../../../store/plugins/undo-redo/History";

// import 'element-ui/lib/theme-chalk/index.css'

// !#zh 请注意，务必使用 font-awesome@4.7.0 版本
import "font-awesome/css/font-awesome.min.css";
import "../styles/index.scss";
import "animate.css";

import RenderEditCanvas from "./canvas/edit";
import RenderPreviewCanvas from "./canvas/preview";
import RenderPropsEditor from "./edit-panel/props";
import RenderScriptEditor from "./edit-panel/script";
import RenderAnimationEditor from "./edit-panel/animation";
import RenderActoionEditor from "./edit-panel/action";
import RenderBackgroundEditor from "./edit-panel/background";
import RenderShortcutsPanel from "./shortcuts-panel/index";
import RenderPageManager from "./page-manager/index";

import LogoOfHeader from "@/components/common/header/logo.js";
import ExternalLinksOfHeader from "@/components/common/header/links.js";
import LangSelect from "@/components/common/header/LangSelect.vue";

// const sidebarMenus = [
//   {
//     i18nLabel: 'editor.sidebar.components',
//     label: '组件列表',
//     value: 'pluginList',
//     antIcon: 'bars'
//   },
//   {
//     i18nLabel: 'editor.sidebar.pages',
//     label: '页面管理',
//     value: 'pageManagement',
//     antIcon: 'snippets'
//   },
//   {
//     i18nLabel: 'editor.sidebar.templates',
//     label: '免费模板',
//     value: 'freeTemplate',
//     antIcon: 'appstore'
//   }
// ]

const fixedTools = [
  {
    i18nTooltip: "editor.fixedTool.undo",
    tooltip: "撤消", // TODO 支持快捷键
    text: "撤消",
    icon: "mail-reply",
    action: () => undoRedoHistory.undo()
  },
  {
    i18nTooltip: "editor.fixedTool.redo",
    tooltip: "恢复",
    text: "恢复",
    icon: "mail-forward",
    action: () => undoRedoHistory.redo()
  },
  {
    i18nTooltip: "editor.fixedTool.preview",
    tooltip: "刷新预览",
    text: "刷新预览",
    icon: "eye",
    action: function() {
      this.previewVisible = true;
    }
  },
  {
    i18nTooltip: "editor.fixedTool.copyCurrentPage",
    tooltip: "复制当前页",
    text: "复制当前页",
    icon: "copy",
    action: function() {
      this.pageManager({ type: "copy" });
    }
  },
  {
    i18nTooltip: "editor.fixedTool.importPSD",
    tooltip: "导入PSD",
    text: "Ps",
    icon: "",
    action: "",
    disabled: true
  },
  {
    i18nTooltip: "editor.fixedTool.zoomOut",
    tooltip: "放大画布",
    text: "放大画布",
    icon: "plus",
    action: function() {
      this.scaleRate += 0.25;
    }
  },
  {
    i18nTooltip: "editor.fixedTool.zoomIn",
    tooltip: "缩小画布",
    text: "缩小画布",
    icon: "minus",
    action: function() {
      this.scaleRate -= 0.25;
    }
  },
  {
    i18nTooltip: "editor.fixedTool.issues",
    tooltip: "issues",
    text: "常见问题",
    icon: "question",
    action: function() {
      window.open("https://github.com/ly525/luban-h5/issues/110");
    }
  }
];

export default {
  name: "Editor",
  components: {
    LogoOfHeader,
    ExternalLinksOfHeader,
    LangSelect
  },
  data: () => ({
    activeMenuKey: "pluginList",
    isPreviewMode: false,
    activeTabKey: "属性",
    previewVisible: false,
    scaleRate: 1
  }),
  computed: {
    ...mapState("editor", {
      editingPage: state => state.editingPage,
      editingElement: state => state.editingElement,
      elements: state => state.editingPage.elements,
      pages: state => state.work.pages,
      work: state => state.work
    }),
    ...mapState("loading", [
      "saveWork_loading",
      "previewWork_loading",
      "setWorkAsTemplate_loading",
      "uploadWorkCover_loading"
    ])
  },
  methods: {
    ...mapActions("editor", [
      "elementManager",
      "pageManager",
      "saveWork",
      "createWork",
      "fetchWork",
      "setWorkAsTemplate",
      "setEditingElement",
      "setEditingPage"
    ]),
    ...mapActions("loading", {
      updateLoading: "update"
    }),
    copyCode() {
      const page = this.$store.state.editor.editingPage;
      const work = { ...this.$store.state.editor.work, pages: [page] };

      this.$copyText(
        `<html>
<head>
  <meta charset="UTF-8">
  <title>${work.title}</title>
  <meta name="viewport" id="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <script src="https://unpkg.com/vue@2.5.18/dist/vue.min.js"></script>
  <link rel="stylesheet" href="http://120.79.124.232/shop2/preview-assets/animate.min.css">
  <link rel="stylesheet" href="http://120.79.124.232/shop2/preview-assets/swiper.min.css">
  <script src="http://120.79.124.232/shop2/preview-assets/swiper.min.js"></script>
  <script src="http://120.79.124.232/shop2/preview-assets/swiper-animation.umd.min.js"></script>
  <script>window.__work = ${JSON.stringify(work)}</script>
  <script src="http://120.79.124.232/shop2/preview-assets/engine.umd.js"></script>
  <style><style>
    * {
      outline: none;
    }

    .bg-wrapper {
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
    }
    /* .swiper-container {
      width: 100%;
      height: 100vh;
    } */

    .preview-wrapper {
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      width: 320px;
      height: 568px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .preview-wrapper .phone-wrapper {
      position: absolute;
      width: 320px;
      height: 568px;
      display: inline-block;
      background: #fff;
      box-sizing: content-box;
      border: 10px solid #f6f6f6;
    }
    .preview-wrapper .float-shortcuts {
      position: absolute;
      top: 100px;
      right: 0;
    }
    .preview-wrapper .float-shortcuts .page-controller {
      position: absolute;
      left: 0 !important;
      display: block;
      box-sizing: border-box;
      width: 22px;
      height: 60px;
      padding: 4px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      cursor: pointer;
      background: #2096f9;
      font-size: 12px;
      /* border: 1px solid #2096f9; */
      color: #fff;
    }
    .preview-wrapper .float-shortcuts .page-controller.next {
      top: 80px;
    }
    .preview-wrapper .work-info {
      color: #4a4a4a;
      font-size: 14px;
      margin-left: 380px;
    }

  </style>
</head>
<body>
  <div id="app">
        <engine />
      </div>
  <script>
    !function () {
      function isMobile() {
        var mobileDeviceReg = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i
        return mobileDeviceReg.test(navigator.userAgent) || window.innerWidth < 500
      }

      function updateViewport() {
        var scale = 1;
        var w = document.documentElement.clientWidth || 320;
        var h = document.documentElement.clientHeight || 568;
        scale = w/h >= 320/568 ? h/568 : w/320;
        var viewport = "width=320, initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no";
        document.getElementById("viewport").setAttribute("content", viewport)
      }

      function doMobileActions () {
        updateViewport();
        var app = document.getElementById('app');
        document.body.innerHTML = '';
        document.body.appendChild(app);
      }

      var loadJS = function (url, callback, location) {
        location = location || document.head

        var scriptTag = document.createElement('script');
        scriptTag.onload = callback;
        scriptTag.src = url;
        location.appendChild(scriptTag);
      };

      function drawQRcode () {
        var canvas = document.getElementById('qrcode-canvas')
        QRCode.toCanvas(canvas, window.location.href, {
          scale: 4
        })
      }

      function doPCActions() {
        loadJS('https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js', drawQRcode);
      }

      isMobile() ? doMobileActions() : doPCActions();
    }();
  </script>
  <script>
    new Vue({
      el: '#app',
      data: {},
    });
  </script>
  <script>
    const swiperAnimation = new SwiperAnimation();

    var mySwiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      loop: false,
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      on: {
        init: function () {
          swiperAnimation.init(this).animate();
        },
        slideChange: function () {
          swiperAnimation.init(this).animate();
        }
      }
    });

    function title(str) {
      if (str.length <= 1) return str.toUpperCase()
      return str.slice(0,1).toUpperCase() + str.slice(1)
    }

    function displayMessage ({ origin, data }) {
      if (['next', 'prev'].includes(data)  && origin === window.location.origin) {

        var action = \`slide\${title(data)}\`
        mySwiper[action]()
      }
    }

    if (window.addEventListener) {
      window.addEventListener("message", displayMessage, false);
    } else {
      window.attachEvent("onmessage", displayMessage);
    }
  </script>
</body>

</html>`
      )
        .then(() => {
          this.$message.success("复制成功");
        })
        .catch(() => {
          this.$message.error("复制失败，请保存后重试");
        });
    },
    /**
     * !#zh 点击插件，copy 其基础数据到组件树（中间画布）
     * #!en click the plugin shortcut, create new Element with the plugin's meta data
     * pluginInfo {Object}: 插件列表中的基础数据, {name}=pluginInfo
     */
    clone({ name }) {
      this.elementManager({
        type: "add",
        value: { name }
      });
    },
    /**
     * #!zh: 设置 背景图tab 作为 active tab
     * #!en: set background(bg) tab as active tab
     */
    setActiveTab(activeTabKey) {
      this.activeTabKey = activeTabKey;
    },
    _renderMenuContent() {
      return (
        <a-tabs style="height: 100%;" tabBarGutter={10}>
          <a-tab-pane
            key="plugin-list"
            tab={this.$t("editor.sidebar.components")}
          >
            <div class="plugin-usage-tip ">
              <a-icon type="info-circle" />
              {/* <span class="ml-1">使用提示: <strong>点击</strong>组件即可</span> */}
              {/* Tip: just click on component */}
              <i18n path="editor.tip.componentUsage" tag="span" class="ml-1">
                <strong>{this.$t("editor.tip.click")}</strong>
                {this.$t("editor.tip.click")}
              </i18n>
            </div>
            <RenderShortcutsPanel
              pluginsList={this.pluginsList}
              handleClickShortcut={this.clone}
            />
          </a-tab-pane>
          <a-tab-pane key="page-manager" tab={this.$t("editor.sidebar.pages")}>
            <RenderPageManager
              pages={this.pages}
              editingPage={this.editingPage}
              onSelectMenuItem={menuKey => {
                this.pageManager({ type: menuKey });
              }}
              onEditTitle={({ pageIndexForEditingTitle, newTitle }) => {
                this.pageManager({
                  type: "editTitle",
                  value: { pageIndexForEditingTitle, newTitle }
                });
                this.saveWork({ isSaveCover: false });
              }}
              onSelectPage={pageIndex => {
                this.setEditingPage(pageIndex);
              }}
            />
          </a-tab-pane>
        </a-tabs>
      );
      // switch (this.activeMenuKey) {
      //   case sidebarMenus[0].value:
      //     return (
      //       <a-tabs
      //         style="height: 100%;"
      //         tabBarGutter={10}
      //       >
      //         <a-tab-pane key="plugin-list" tab={this.$t('editor.sidebar.components')}>
      //           <RenderShortcutsPanel pluginsList={this.pluginsList} handleClickShortcut={this.clone} />
      //         </a-tab-pane>
      //         <a-tab-pane key='page-manager' tab={this.$t('editor.sidebar.pages')}>
      //           <RenderPageManager
      //             pages={this.pages}
      //             editingPage={this.editingPage}
      //             onSelectMenuItem={(menuKey) => {
      //               this.pageManager({ type: menuKey })
      //             }}
      //             onEditTitle={({ pageIndexForEditingTitle, newTitle }) => {
      //               this.pageManager({ type: 'editTitle', value: { pageIndexForEditingTitle, newTitle } })
      //               this.saveWork({ isSaveCover: false })
      //             }}
      //             onSelectPage={(pageIndex) => { this.setEditingPage(pageIndex) }}
      //           />
      //         </a-tab-pane>
      //       </a-tabs>
      //     )
      //   case sidebarMenus[1].value:
      //     return (
      //       <RenderPageManager
      //         pages={this.pages}
      //         editingPage={this.editingPage}
      //         onSelectMenuItem={(menuKey) => {
      //           this.pageManager({ type: menuKey })
      //         }}
      //         onSelectPage={(pageIndex) => { this.setEditingPage(pageIndex) }}
      //       />
      //     )
      //   default:
      //     return null
      // }
    }
  },
  // eslint-disable-next-line no-unused-vars
  render(h) {
    return (
      <a-layout
        id="luban-editor-layout"
        style={{ height: "calc(100vh - 105px)" }}
      >
        <a-layout-header class="header">
          {/* <LogoOfHeader /> */}
          {/* <LangSelect style="float: right;cursor: pointer;" /> */}
          {/* we can show the plugins shortcuts here */}
          <a-menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{
              lineHeight: "40px",
              float: "right",
              background: "transparent"
            }}
          >
            {/* 保存、预览、发布、设置为模板 */}
            <a-menu-item key="1" class="transparent-bg">
              <a-button
                type="primary"
                size="small"
                onClick={() => {
                  this.saveWork({ loadingName: "previewWork_loading" }).then(
                    () => {
                      let { href } = this.$router.resolve("/common/h5/preview");
                      window.open(href);
                    }
                  );
                }}
                loading={this.previewWork_loading}
              >
                {this.$t("editor.header.preview")}
              </a-button>
            </a-menu-item>
            <a-menu-item key="2" class="transparent-bg">
              <a-button
                size="small"
                onClick={() => this.saveWork({ isSaveCover: true })}
                loading={this.saveWork_loading || this.uploadWorkCover_loading}
              >
                {this.$t("editor.header.save")}
              </a-button>
            </a-menu-item>
            <a-menu-item key="2" class="transparent-bg">
              <a-button
                size="small"
                onClick={() => {
                  this.copyCode();
                }}
              >
                {this.$t("editor.header.copy")}
              </a-button>
            </a-menu-item>
            {/* <a-menu-item key="3" class="transparent-bg"><a-button size="small">发布</a-button></a-menu-item> */}
            <a-menu-item key="3" class="transparent-bg">
              <a-dropdown-button onClick={() => {}} size="small">
                {/* 发布 */}
                {this.$t("editor.header.publish")}
                <a-menu
                  slot="overlay"
                  onClick={({ key }) => {
                    switch (key) {
                      case "setAsTemplate":
                        this.updateLoading({
                          type: "setWorkAsTemplate_loading",
                          value: true
                        });
                        this.saveWork().then(() => {
                          this.setWorkAsTemplate();
                        });
                    }
                  }}
                >
                  <a-menu-item key="setAsTemplate">
                    <a-spin
                      spinning={this.setWorkAsTemplate_loading}
                      size="small"
                    >
                      {/* 设置为模板 */}
                      <a-icon type="cloud-upload" />
                      {this.$t("editor.header.setAsTemplate")}
                    </a-spin>
                  </a-menu-item>
                  {/* <a-menu-item key="2"><a-icon type="user" />2nd menu item</a-menu-item> */}
                  {/* <a-menu-item key="3"><a-icon type="user" />3rd item</a-menu-item> */}
                </a-menu>
              </a-dropdown-button>
            </a-menu-item>
          </a-menu>
          {/* <ExternalLinksOfHeader /> */}
        </a-layout-header>
        <a-layout>
          {/* <a-layout-sider collapsedWidth={40} style="background: #fff" collapsed>
            <a-menu
              mode="inline"
              defaultSelectedKeys={['pluginList']}
              style={{ height: '100%', borderRight: 1 }}
              onSelect={({ key }) => { this.activeMenuKey = key }}
            >
              {
                sidebarMenus.map(menu => (
                  <a-menu-item key={menu.value}>
                    <a-icon type={menu.antIcon} />
                    <span>{this.$t(menu.i18nLabel)}</span>
                  </a-menu-item>
                ))
              }
            </a-menu>
          </a-layout-sider> */}
          <a-layout-sider
            width="240"
            theme="light"
            style={{ background: "#fff", padding: "12px" }}
          >
            {this._renderMenuContent()}
          </a-layout-sider>
          <a-layout>
            <div class="mode-toggle-wrapper">
              <a-radio-group
                size="small"
                value={this.isPreviewMode}
                onInput={isPreviewMode => {
                  this.isPreviewMode = isPreviewMode;
                  if (isPreviewMode) {
                    // 当切换到预览模式的时候，清空当前编辑元素
                    this.setEditingElement(); // 相当于  setEditingElement(null)
                  }
                }}
              >
                {/* 编辑模式、预览模式 */}
                <a-radio-button label={false} value={false}>
                  {this.$t("editor.centerPanel.mode.edit")}
                </a-radio-button>
                <a-radio-button label={true} value={true}>
                  {this.$t("editor.centerPanel.mode.preview")}
                </a-radio-button>
              </a-radio-group>
            </div>
            <a-layout-content
              style={{
                transform: `scale(${this.scaleRate})`,
                "transform-origin": "center top"
              }}
            >
              <div class="canvas-wrapper">
                {/* { this.isPreviewMode ? this.renderPreview(h, this.elements) : this.renderCanvas(h, this.elements) } */}
                {this.isPreviewMode ? (
                  <RenderPreviewCanvas elements={this.elements} />
                ) : (
                  <RenderEditCanvas
                    class="edit-mode"
                    elements={this.elements}
                  />
                )}
              </div>
            </a-layout-content>
          </a-layout>
          <a-layout-sider
            width="40"
            theme="light"
            style={{ background: "#fff", border: "1px solid #eee" }}
          >
            {/* <div>
              <a-button shape="circle" icon="search" type="link" />
            </div> */}
            <a-button-group
              style={{ display: "flex", flexDirection: "column" }}
            >
              {fixedTools.map(tool => (
                // <a-tooltip effect="dark" placement="left" title={tool.tooltip}>
                <a-tooltip
                  effect="dark"
                  placement="left"
                  title={this.$t(tool.i18nTooltip)}
                >
                  <a-button
                    block
                    class="transparent-bg"
                    type="link"
                    size="small"
                    style={{ height: "40px", color: "#000" }}
                    onClick={() => tool.action && tool.action.call(this)}
                    disabled={!!tool.disabled}
                  >
                    {tool.icon ? (
                      <i
                        class={["shortcut-icon", "fa", `fa-${tool.icon}`]}
                        aria-hidden="true"
                      />
                    ) : (
                      tool.text
                    )}
                  </a-button>
                  {tool.icon === "minus" && (
                    <div style={{ fontSize: "12px", textAlign: "center" }}>
                      {this.scaleRate * 100}%
                    </div>
                  )}
                </a-tooltip>
              ))}
            </a-button-group>
          </a-layout-sider>
          <a-layout-sider
            width="320"
            theme="light"
            style={{ background: "#fff", padding: "0 0 0 12px" }}
          >
            <a-tabs
              style="height: 100%;"
              tabBarGutter={10}
              defaultActiveKey={this.activeTabKey}
              activeKey={this.activeTabKey}
              onChange={this.setActiveTab}
            >
              {/*
                #!zh tab 标题：
                #!en tab title
                  ElementUI：label
                  Ant Design Vue：tab
              */}
              <a-tab-pane key="属性">
                <span slot="tab">{this.$t("editor.editPanel.tab.prop")}</span>
                <RenderPropsEditor />
              </a-tab-pane>
              <a-tab-pane
                label="动画"
                key="动画"
                tab={this.$t("editor.editPanel.tab.animation")}
              >
                <RenderAnimationEditor />
              </a-tab-pane>
              <a-tab-pane
                label="动作"
                key="动作"
                tab={this.$t("editor.editPanel.tab.action")}
              >
                {this.activeTabKey === "动作" && <RenderActoionEditor />}
              </a-tab-pane>
              <a-tab-pane
                label="脚本"
                key="脚本"
                tab={this.$t("editor.editPanel.tab.script")}
              >
                <RenderScriptEditor />
              </a-tab-pane>
              <a-tab-pane
                label="背景"
                key="background"
                tab={this.$t("editor.editPanel.tab.background")}
              >
                {this.activeTabKey === "background" && (
                  <RenderBackgroundEditor />
                )}
              </a-tab-pane>
            </a-tabs>
          </a-layout-sider>
        </a-layout>
        {/* {
          <PreviewDialog
            work={this.work}
            visible={this.previewVisible}
            handleClose={() => {
              this.previewVisible = false;
            }}
          />
        } */}
        {/* <Feedback /> */}
      </a-layout>
    );
  },
  created() {
    // event bus for editor
    window.getEditorApp = this;
    let workId = this.$route.params.workId || 123;
    if (workId) {
      this.fetchWork(workId).then(() => this.setActiveTab("background"));
    } else {
      this.$message.error("no work id!");
    }

    window.getEditorApp.$on("setEditingElement", ({ name }) => {
      this.setActiveTab(name === "lbp-background" ? "background" : "属性");
    });
  }
};
