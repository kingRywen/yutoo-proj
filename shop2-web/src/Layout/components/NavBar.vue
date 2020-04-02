<template>
  <div :class="['nav-wrapper __tr']">
    <transition name="nav-search-slide" mode="out-in">
      <div v-if="!showSearch" :key="1">
        <div class="ad-wrapper">
          <div class="ad">广告</div>
        </div>
        <el-menu
          background-color="#232f3e"
          text-color="#ccc"
          active-text-color="#fff"
          :class="['navbar', {'fixed-menu': $route.meta.menuFixed}]"
          mode="horizontal"
          :default-active="defaultActive"
          @select="handleSelect"
        >
          <div class="logo" @click="toHome">SHOP</div>
          <div
            class="logo store"
            @mouseenter="showShop = true"
            @mouseleave="showShop = false"
            v-if="storeInfo.platformId"
          >
            <img class="country-img" width="18" :src="imgMap[currentSite.siteName].img" />
            {{siteName}}
            <i class="el-icon-caret-bottom"></i>
            <transition name="el-zoom-in-top">
              <div class="shop-panel" v-show="showShop">
                <el-cascader-panel
                  :props="{ expandTrigger: 'hover' }"
                  :options="shops"
                  @change="setShopMethod"
                  :value="currentSites"
                ></el-cascader-panel>
              </div>
            </transition>
          </div>

          <el-menu-item :index="item.activeIndex" v-for="item in mainMenu" :key="item.index">
            <div
              class="nav-item"
              @mouseenter="handleMouseEnter($event, item.activeIndex)"
              @mouseleave="handleMouseleave"
            >{{item.name}}</div>
          </el-menu-item>
          <div v-if="islogged">
            <div class="user-profile-container" trigger="click">
              <div class="user-profile-content">
                <div class="menu-icons top-menu-row">
                  <span class="menu-icon" @click="showSearch = true">
                    <i class="el-icon-search icon"></i>
                  </span>
                  <span
                    class="menu-icon"
                    style="position: relative"
                    @mouseenter="showUserPanel"
                    @mouseleave="showUser = false"
                  >
                    <i class="el-icon-user-solid icon"></i>
                    <transition name="el-zoom-in-top">
                      <div class="user-panel" v-show="showUser">
                        <ul>
                          <li class="disabled">个人中心</li>
                          <li @click="$router.push('/shopAuth')">店铺管理</li>
                          <li @click="logout">退出</li>
                        </ul>
                      </div>
                    </transition>
                  </span>
                  <el-select
                    v-model="shopValue"
                    size="small"
                    v-if="isShowShop"
                    @change="shopChange"
                    style="width: 150px;margin-left: 10px;"
                  >
                    <el-option v-for="item in allShopList" :key="item.value" :label="item.label" :value="item.value">
                      <img class="country-img" width="18" :src="item.imgUrl" style="margin-top: 11px;" />
                      <span style="float: right;font-size: 13px">{{ item.label }}</span>
                    </el-option>
                    <img
                      v-if="shopValue"
                      slot="prefix"
                      class="country-img"
                      width="18"
                      :src="allShopList.find(e => e.value === shopValue).imgUrl"
                      style="padding-top: 17px;"
                    />
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </el-menu>
      </div>
      <div class="nav-search navbar" v-else :key="2">
        <div class="logo" @click="toHome">SHOP</div>
        <div class="search-wp">
          <i class="el-icon-search"></i>
          <input type="text" placeholder="请输入搜索.." />
          <div v-if="showSearch" :class="['quick-search', {hide: hideSearchPanel}]">
            <div>快速链接</div>
            <ul>
              <li>
                <router-link tag="div" to="/">ASIN挖掘</router-link>
              </li>
              <li>
                <router-link tag="div" to="/">跟卖系统</router-link>
              </li>
              <li>
                <router-link tag="div" to="/">竞品ASIN挖掘</router-link>
              </li>
            </ul>
          </div>
        </div>
        <i class="el-icon-close" @click="closeSearch"></i>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="mask" @click="closeSearch" v-show="showSearch"></div>
    </transition>

    <transition name="el-zoom-in-top">
      <div
        class="top-menu"
        :style="{paddingLeft: targetL - 95 + 'px'}"
        v-show="showTopMenu"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseleave"
      >
        <el-scrollbar style="height: 100%">
          <div class="top-menu-row dropdown-wrapper">
            <ElTree
              class="right"
              @node-click="toRouter"
              :data="currentMenu"
              :props="defaultProps"
              :indent="22"
              :expand-on-click-node="false"
              default-expand-all
            >
              <div slot-scope="{node, data}">
                <div class="top-menu-node flex-c">
                  <i class="iconfont" v-html="data.icon"></i>
                  <div>
                    <h3>
                      <a>{{data.name}}</a>
                    </h3>
                    <span>{{data.desc}}</span>
                  </div>
                </div>
              </div>
            </ElTree>
          </div>
        </el-scrollbar>

        <ElButton class="close-btn" type="text" icon="el-icon-close info" @click="handleMouseleave"></ElButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { authMethods } from 'Store/helper/auth'
import { INJECT_CONFIG } from '@/main'
import store from 'Store'
export async function getPlatformInfo() {
  let allData = store.state.storeInfo.allData
  let info = localStorage.getItem(
    INJECT_CONFIG.STORAGE_NAME + '_storeInfo.info'
  )
  info = info && JSON.parse(info)
  let { platformId, siteId, sellerId } = info || {}

  if (!allData.length) {
    allData = await GLOBAL.ajax['common/platformSiteList']({}).then(
      data => data.data
    )
    // debugger
    platformId = platformId || allData[0].platformId
    siteId = siteId || allData[0].sites[0].siteId
    const plat = allData.find(e => e.platformId == platformId)
    const site = plat.sites.find(e => e.siteId === siteId)
    //存所有的信息
    store.commit('storeInfo/setAllData', allData)

    //取第一个平台第一个站点
    store.commit('storeInfo/setInfo', {
      platformId,
      siteId,
      sellerId
    })

    //存所有url的信息
    store.commit('storeInfo/setOtherData', {
      platformUrl: plat.platformUrl, //平台url
      asinUrl: site.asinUrl, //asinUrl
      keywordUrl: site.keywordUrl //关键词Url
    })
  }
  //存展示的下拉所有的数据
  if (this && this.shops) {
    this.shops = allData.map(e => {
      return {
        value: e.platformId,
        label: e.platformName,
        children: e.sites.map(i => {
          return {
            value: i.siteId,
            label: i.siteName
          }
        })
      }
    })
  }
  return { allData, platformId }
}

export default {
  name: 'NavBar',
  data() {
    return {
      shopValue: null,
      allShopList: [],
      isShowShop: false,
      hideSearchPanel: false,
      showSearch: false,
      showUser: false,
      showShop: false,
      targetL: 0,
      showTopMenu: false,
      imgMap: {
        美国站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InNjYWxlKC45Mzc1KSI+CiAgICA8ZyBzdHJva2Utd2lkdGg9IjFwdCI+CiAgICAgIDxwYXRoIGQ9Ik0wIDBoOTcyLjgxdjM5LjM4NUgwem0wIDc4Ljc3aDk3Mi44MXYzOS4zODVIMHptMCA3OC43N2g5NzIuODF2MzkuMzg1SDB6bTAgNzguNzdoOTcyLjgxdjM5LjM4NUgwem0wIDc4Ljc3aDk3Mi44MXYzOS4zODVIMHptMCA3OC43N2g5NzIuODF2MzkuMzg1SDB6bTAgNzguNzdoOTcyLjgxdjM5LjM4NUgweiIgZmlsbD0iI2JkM2Q0NCIvPgogICAgICA8cGF0aCBkPSJNMCAzOS4zODVoOTcyLjgxVjc4Ljc3SDB6bTAgNzguNzdoOTcyLjgxdjM5LjM4NUgwem0wIDc4Ljc3aDk3Mi44MXYzOS4zODVIMHptMCA3OC43N2g5NzIuODF2MzkuMzg1SDB6bTAgNzguNzdoOTcyLjgxdjM5LjM4NUgwem0wIDc4Ljc3aDk3Mi44MXYzOS4zODVIMHoiIGZpbGw9IiNmZmYiLz4KICAgIDwvZz4KICAgIDxwYXRoIGZpbGw9IiMxOTJmNWQiIGQ9Ik0wIDBoMzg5LjEydjI3NS42OUgweiIvPgogICAgPGcgZmlsbD0iI2ZmZiI+CiAgICAgIDxwYXRoIGQ9Ik0zMi40MjcgMTEuOGwzLjU0IDEwLjg5NmgxMS40NThsLTkuMjcgNi43MzUgMy41NDEgMTAuODk2LTkuMjctNi43MzQtOS4yNjggNi43MzQgMy41NC0xMC44OTYtOS4yNjktNi43MzVoMTEuNDU3em02NC44NTMgMGwzLjU0MSAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1SDkzLjc0em02NC44NTYgMGwzLjU0IDEwLjg5NmgxMS40NThsLTkuMjcgNi43MzUgMy41NDEgMTAuODk2LTkuMjY5LTYuNzM0LTkuMjY5IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1OHptNjQuODUyIDBsMy41NCAxMC44OTZoMTEuNDU3bC05LjI2OSA2LjczNSAzLjU0IDEwLjg5Ni05LjI2OC02LjczNC05LjI3IDYuNzM0IDMuNTQxLTEwLjg5Ni05LjI3LTYuNzM1aDExLjQ1OHptNjQuODU1IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1N3ptNjQuODU1IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI2OS02LjczNC05LjI3IDYuNzM0IDMuNTQyLTEwLjg5Ni05LjI3LTYuNzM1aDExLjQ1OHpNNjQuODU1IDM5LjM3bDMuNTQgMTAuODk2aDExLjQ1OEw3MC41ODMgNTdsMy41NDIgMTAuODk3LTkuMjctNi43MzQtOS4yNjkgNi43MzRMNTkuMTI2IDU3bC05LjI2OS02LjczNGgxMS40NTh6bTY0Ljg1MiAwbDMuNTQgMTAuODk2aDExLjQ1N0wxMzUuNDM1IDU3bDMuNTQgMTAuODk3LTkuMjY4LTYuNzM0LTkuMjcgNi43MzRMMTIzLjk3OCA1N2wtOS4yNy02LjczNGgxMS40NTh6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OEwyMDAuMjkgNTdsMy41NDEgMTAuODk3LTkuMjctNi43MzQtOS4yNjggNi43MzRMMTg4LjgzMyA1N2wtOS4yNjktNi43MzRoMTEuNDU3em02NC44NTUgMGwzLjU0IDEwLjg5NmgxMS40NThMMjY1LjE0NSA1N2wzLjU0MSAxMC44OTctOS4yNjktNi43MzQtOS4yNyA2LjczNEwyNTMuNjkgNTdsLTkuMjctNi43MzRoMTEuNDU4em02NC44NTIgMGwzLjU0IDEwLjg5NmgxMS40NTdMMzI5Ljk5NyA1N2wzLjU0IDEwLjg5Ny05LjI2OC02LjczNC05LjI3IDYuNzM0TDMxOC41NCA1N2wtOS4yNy02LjczNGgxMS40NTh6TTMyLjQyNyA2Ni45MzlsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1N3ptNjQuODUzIDBsMy41NDEgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNUg5My43NHptNjQuODU2IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI2OS02LjczNC05LjI2OSA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNWgxMS40NTh6bTY0Ljg1MiAwbDMuNTQgMTAuODk2aDExLjQ1N2wtOS4yNjkgNi43MzUgMy41NCAxMC44OTYtOS4yNjgtNi43MzQtOS4yNyA2LjczNCAzLjU0MS0xMC44OTYtOS4yNy02LjczNWgxMS40NTh6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNWgxMS40NTd6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNjktNi43MzQtOS4yNyA2LjczNCAzLjU0Mi0xMC44OTYtOS4yNy02LjczNWgxMS40NTh6TTY0Ljg1NSA5NC41MDhsMy41NCAxMC44OTdoMTEuNDU4bC05LjI3IDYuNzM0IDMuNTQyIDEwLjg5Ny05LjI3LTYuNzM0LTkuMjY5IDYuNzM0IDMuNTQtMTAuODk3LTkuMjY5LTYuNzM0aDExLjQ1OHptNjQuODUyIDBsMy41NCAxMC44OTdoMTEuNDU3bC05LjI2OSA2LjczNCAzLjU0IDEwLjg5Ny05LjI2OC02LjczNC05LjI3IDYuNzM0IDMuNTQxLTEwLjg5Ny05LjI3LTYuNzM0aDExLjQ1OHptNjQuODU1IDBsMy41NCAxMC44OTdoMTEuNDU4bC05LjI3IDYuNzM0IDMuNTQxIDEwLjg5Ny05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk3LTkuMjY5LTYuNzM0aDExLjQ1N3ptNjQuODU1IDBsMy41NCAxMC44OTdoMTEuNDU4bC05LjI3IDYuNzM0IDMuNTQxIDEwLjg5Ny05LjI2OS02LjczNC05LjI3IDYuNzM0IDMuNTQyLTEwLjg5Ny05LjI3LTYuNzM0aDExLjQ1OHptNjQuODUyIDBsMy41NCAxMC44OTdoMTEuNDU3bC05LjI2OSA2LjczNCAzLjU0IDEwLjg5Ny05LjI2OC02LjczNC05LjI3IDYuNzM0IDMuNTQxLTEwLjg5Ny05LjI3LTYuNzM0aDExLjQ1OHpNMzIuNDI3IDEyMi4wNzhsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1N3ptNjQuODUzIDBsMy41NDEgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNUg5My43NHptNjQuODU2IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI2OS02LjczNC05LjI2OSA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNWgxMS40NTh6bTY0Ljg1MiAwbDMuNTQgMTAuODk2aDExLjQ1N2wtOS4yNjkgNi43MzUgMy41NCAxMC44OTYtOS4yNjgtNi43MzQtOS4yNyA2LjczNCAzLjU0MS0xMC44OTYtOS4yNy02LjczNWgxMS40NTh6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNWgxMS40NTd6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNjktNi43MzQtOS4yNyA2LjczNCAzLjU0Mi0xMC44OTYtOS4yNy02LjczNWgxMS40NTh6TTY0Ljg1NSAxNDkuNjQ3bDMuNTQgMTAuODk3aDExLjQ1OGwtOS4yNyA2LjczNCAzLjU0MiAxMC44OTctOS4yNy02LjczNC05LjI2OSA2LjczNCAzLjU0LTEwLjg5Ny05LjI2OS02LjczNGgxMS40NTh6bTY0Ljg1MiAwbDMuNTQgMTAuODk3aDExLjQ1N2wtOS4yNjkgNi43MzQgMy41NCAxMC44OTctOS4yNjgtNi43MzQtOS4yNyA2LjczNCAzLjU0MS0xMC44OTctOS4yNy02LjczNGgxMS40NTh6bTY0Ljg1NSAwbDMuNTQgMTAuODk3aDExLjQ1OGwtOS4yNyA2LjczNCAzLjU0MSAxMC44OTctOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ny05LjI2OS02LjczNGgxMS40NTd6bTY0Ljg1NSAwbDMuNTQgMTAuODk3aDExLjQ1OGwtOS4yNyA2LjczNCAzLjU0MSAxMC44OTctOS4yNjktNi43MzQtOS4yNyA2LjczNCAzLjU0Mi0xMC44OTctOS4yNy02LjczNGgxMS40NTh6bTY0Ljg1MiAwbDMuNTQgMTAuODk3aDExLjQ1N2wtOS4yNjkgNi43MzQgMy41NCAxMC44OTctOS4yNjgtNi43MzQtOS4yNyA2LjczNCAzLjU0MS0xMC44OTctOS4yNy02LjczNGgxMS40NTh6Ii8+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGQ9Ik0zMi40MjcgMTc3LjIxN2wzLjU0IDEwLjg5NmgxMS40NThsLTkuMjcgNi43MzUgMy41NDEgMTAuODk2LTkuMjctNi43MzQtOS4yNjggNi43MzQgMy41NC0xMC44OTYtOS4yNjktNi43MzVoMTEuNDU3em02NC44NTMgMGwzLjU0MSAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1SDkzLjc0em02NC44NTYgMGwzLjU0IDEwLjg5NmgxMS40NThsLTkuMjcgNi43MzUgMy41NDEgMTAuODk2LTkuMjY5LTYuNzM0LTkuMjY5IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1OHptNjQuODUyIDBsMy41NCAxMC44OTZoMTEuNDU3bC05LjI2OSA2LjczNSAzLjU0IDEwLjg5Ni05LjI2OC02LjczNC05LjI3IDYuNzM0IDMuNTQxLTEwLjg5Ni05LjI3LTYuNzM1aDExLjQ1OHptNjQuODU1IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1N3ptNjQuODU1IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI2OS02LjczNC05LjI3IDYuNzM0IDMuNTQyLTEwLjg5Ni05LjI3LTYuNzM1aDExLjQ1OHpNNjQuODU1IDIwNC43ODZsMy41NCAxMC44OTdoMTEuNDU4bC05LjI3IDYuNzM0IDMuNTQyIDEwLjg5Ny05LjI3LTYuNzM0LTkuMjY5IDYuNzM0IDMuNTQtMTAuODk3LTkuMjY5LTYuNzM0aDExLjQ1OHptNjQuODUyIDBsMy41NCAxMC44OTdoMTEuNDU3bC05LjI2OSA2LjczNCAzLjU0IDEwLjg5Ny05LjI2OC02LjczNC05LjI3IDYuNzM0IDMuNTQxLTEwLjg5Ny05LjI3LTYuNzM0aDExLjQ1OHptNjQuODU1IDBsMy41NCAxMC44OTdoMTEuNDU4bC05LjI3IDYuNzM0IDMuNTQxIDEwLjg5Ny05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk3LTkuMjY5LTYuNzM0aDExLjQ1N3ptNjQuODU1IDBsMy41NCAxMC44OTdoMTEuNDU4bC05LjI3IDYuNzM0IDMuNTQxIDEwLjg5Ny05LjI2OS02LjczNC05LjI3IDYuNzM0IDMuNTQyLTEwLjg5Ny05LjI3LTYuNzM0aDExLjQ1OHptNjQuODUyIDBsMy41NCAxMC44OTdoMTEuNDU3bC05LjI2OSA2LjczNCAzLjU0IDEwLjg5Ny05LjI2OC02LjczNC05LjI3IDYuNzM0IDMuNTQxLTEwLjg5Ny05LjI3LTYuNzM0aDExLjQ1OHoiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMzIuNDI3IDIzMi4zNTZsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI3LTYuNzM0LTkuMjY4IDYuNzM0IDMuNTQtMTAuODk2LTkuMjY5LTYuNzM1aDExLjQ1N3ptNjQuODUzIDBsMy41NDEgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNUg5My43NHptNjQuODU2IDBsMy41NCAxMC44OTZoMTEuNDU4bC05LjI3IDYuNzM1IDMuNTQxIDEwLjg5Ni05LjI2OS02LjczNC05LjI2OSA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNWgxMS40NTh6bTY0Ljg1MiAwbDMuNTQgMTAuODk2aDExLjQ1N2wtOS4yNjkgNi43MzUgMy41NCAxMC44OTYtOS4yNjgtNi43MzQtOS4yNyA2LjczNCAzLjU0MS0xMC44OTYtOS4yNy02LjczNWgxMS40NTh6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNy02LjczNC05LjI2OCA2LjczNCAzLjU0LTEwLjg5Ni05LjI2OS02LjczNWgxMS40NTd6bTY0Ljg1NSAwbDMuNTQgMTAuODk2aDExLjQ1OGwtOS4yNyA2LjczNSAzLjU0MSAxMC44OTYtOS4yNjktNi43MzQtOS4yNyA2LjczNCAzLjU0Mi0xMC44OTYtOS4yNy02LjczNWgxMS40NTh6Ii8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo='
        },
        加拿大站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzQuMTE4KSBzY2FsZSguOTM3NSkiPgogICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTgxLjEzNyAwaDM2Mi4yNzZ2NTEySDgxLjEzN3oiLz4KICAgIDxwYXRoIGZpbGw9IiNiZjBhMzAiIGQ9Ik0tMTAwIDBIODEuMTM4djUxMkgtMTAwem01NDMuNDEzIDBINjI0LjU1djUxMkg0NDMuNDE0ek0xMzUuMzEgMjQ3LjQxbC0xNC4wNjcgNC44MDggNjUuNDU2IDU3LjQ0NmM0Ljk1IDE0Ljc2NC0xLjcyIDE5LjExNi01Ljk3IDI2Ljg2bDcxLjA2LTkuMDItMS44NSA3MS41MTIgMTQuNzE4LS40MjMtMy4yMS03MC45MTggNzEuMTMgOC40MzJjLTQuNDAyLTkuMjk3LTguMzItMTQuMjMzLTQuMjQ3LTI5LjA5OGw2NS40MTQtNTQuNDI2LTExLjQ0Ny00LjE0NGMtOS4zNi03LjIyMiA0LjA0NC0zNC43ODQgNi4wNjYtNTIuMTc4IDAgMC0zOC4xOTUgMTMuMTM1LTQwLjY5OCA2LjI2MmwtOS43MjctMTguNjg1LTM0Ljc0NyAzOC4xN2MtMy43OTYuOTEtNS40MTMtLjYtNi4zMDQtMy44MDhsMTYuMDUzLTc5Ljc2Ni0yNS40MiAxNC4yOTdjLTIuMTI4LjkxLTQuMjU2LjEyNS01LjY1OC0yLjM1NWwtMjQuNDUtNDkuMDYtMjUuMjEgNTAuOTVjLTEuOSAxLjgyNi0zLjgwMyAyLjAzNy01LjM4Mi43OTZsLTI0LjIwNC0xMy41NzggMTQuNTMgNzkuMTQzYy0xLjE1NiAzLjE0LTMuOTI0IDQuMDI1LTcuMTggMi4zMjRsLTMzLjIxNi0zNy43MzdjLTQuMzQ1IDYuOTYyLTcuMjkgMTguMzM2LTEzLjAzMyAyMC44ODUtNS43NDQgMi4zODctMjQuOTgtNC44MjMtMzcuODczLTcuNjM3IDQuNDA0IDE1Ljg5NSAxOC4xNzYgNDIuMzAyIDkuNDYgNTAuOTU3eiIvPgogIDwvZz4KPC9zdmc+Cg=='
        },
        墨西哥站: {
          img: 'mx.gif'
        },
        巴西站: {
          img: 'br.gif'
        },
        英国站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImEiPgogICAgICA8cGF0aCBmaWxsLW9wYWNpdHk9Ii42NyIgZD0iTS04NS4zMzMgMGg2ODIuNjd2NTEyaC02ODIuNjd6Ii8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KICA8ZyBjbGlwLXBhdGg9InVybCgjYSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgwKSBzY2FsZSguOTQpIj4KICAgIDxnIHN0cm9rZS13aWR0aD0iMXB0Ij4KICAgICAgPHBhdGggZmlsbD0iIzAwNiIgZD0iTS0yNTYgMEg3NjguMDJ2NTEyLjAxSC0yNTZ6Ii8+CiAgICAgIDxwYXRoIGQ9Ik0tMjU2IDB2NTcuMjQ0bDkwOS41MzUgNDU0Ljc2OEg3NjguMDJWNDU0Ljc3TC0xNDEuNTE1IDBILTI1NnpNNzY4LjAyIDB2NTcuMjQzTC0xNDEuNTE1IDUxMi4wMUgtMjU2di01Ny4yNDNMNjUzLjUzNSAwSDc2OC4wMnoiIGZpbGw9IiNmZmYiLz4KICAgICAgPHBhdGggZD0iTTE3MC42NzUgMHY1MTIuMDFoMTcwLjY3VjBoLTE3MC42N3pNLTI1NiAxNzAuNjd2MTcwLjY3SDc2OC4wMlYxNzAuNjdILTI1NnoiIGZpbGw9IiNmZmYiLz4KICAgICAgPHBhdGggZD0iTS0yNTYgMjA0LjgwNHYxMDIuNDAySDc2OC4wMlYyMDQuODA0SC0yNTZ6TTIwNC44MSAwdjUxMi4wMWgxMDIuNFYwaC0xMDIuNHpNLTI1NiA1MTIuMDFMODUuMzQgMzQxLjM0aDc2LjMyNGwtMzQxLjM0IDE3MC42N0gtMjU2ek0tMjU2IDBMODUuMzQgMTcwLjY3SDkuMDE2TC0yNTYgMzguMTY0VjB6bTYwNi4zNTYgMTcwLjY3TDY5MS42OTYgMGg3Ni4zMjRMNDI2LjY4IDE3MC42N2gtNzYuMzI0ek03NjguMDIgNTEyLjAxTDQyNi42OCAzNDEuMzRoNzYuMzI0TDc2OC4wMiA0NzMuODQ4djM4LjE2MnoiIGZpbGw9IiNjMDAiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo='
        },
        法国站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utd2lkdGg9IjFwdCI+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDY0MHY0ODBIMHoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDI2N2YiIGQ9Ik0wIDBoMjEzLjMzN3Y0ODBIMHoiLz4KICAgIDxwYXRoIGZpbGw9IiNmMzE4MzAiIGQ9Ik00MjYuNjYyIDBINjQwdjQ4MEg0MjYuNjYyeiIvPgogIDwvZz4KPC9zdmc+Cg=='
        },
        德国站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPHBhdGggZmlsbD0iI2ZmY2UwMCIgZD0iTTAgMzIwaDY0MHYxNjAuMDAySDB6Ii8+CiAgPHBhdGggZD0iTTAgMGg2NDB2MTYwSDB6Ii8+CiAgPHBhdGggZmlsbD0iI2QwMCIgZD0iTTAgMTYwaDY0MHYxNjBIMHoiLz4KPC9zdmc+Cg=='
        },
        意大利站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utd2lkdGg9IjFwdCI+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDY0MHY0NzkuOTk3SDB6Ii8+CiAgICA8cGF0aCBmaWxsPSIjMDA5MjQ2IiBkPSJNMCAwaDIxMy4zMzF2NDc5Ljk5N0gweiIvPgogICAgPHBhdGggZmlsbD0iI2NlMmIzNyIgZD0iTTQyNi42NjMgMGgyMTMuMzMxdjQ3OS45OTdINDI2LjY2M3oiLz4KICA8L2c+Cjwvc3ZnPgo='
        },
        西班牙站: {
          img: require('@/assets/images/cityImg/es.svg')
        },
        日本站: {
          img:
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgwIiB3aWR0aD0iNjQwIiB2aWV3Qm94PSIwIDAgNjQwIDQ4MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImEiPgogICAgICA8cGF0aCBmaWxsLW9wYWNpdHk9Ii42NyIgZD0iTS04OC4wMDEgMzJoNjQwdjQ4MGgtNjQweiIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPGcgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXBhdGg9InVybCgjYSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4LjAwMSAtMzIpIiBzdHJva2Utd2lkdGg9IjFwdCI+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNLTEyOCAzMmg3MjB2NDgwaC03MjB6Ii8+CiAgICA8ZWxsaXBzZSByeD0iMTk0LjkzIiByeT0iMTk0LjkzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjQ0IDguNjE4KSBzY2FsZSguNzY1NTQpIiBjeT0iMzQ0LjA1IiBjeD0iNTIzLjA4IiBmaWxsPSIjZDMwMDAwIi8+CiAgPC9nPgo8L3N2Zz4K'
        },
        澳大利亚站: {
          img: 'au.gif'
        },
        迪拜站: {
          img: 'ae.gif'
        }
      },
      shops: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeMenu: 'common',
      topActive: null
    }
  },
  methods: {
    ...authMethods,
    setShopMethod(e) {
      //改变平台站点Id
      this.$store.commit('storeInfo/setInfo', {
        platformId: e[0],
        siteId: e[1]
      })

      //改变平台站点Url
      let allData = store.state.storeInfo.allData
      store.commit('storeInfo/setOtherData', {
        platformUrl: allData.find(i => i.platformId === e[0]).platformUrl,
        asinUrl: allData
          .find(i => i.platformId === e[0])
          .sites.find(v => v.siteId === e[1]).asinUrl,
        keywordUrl: allData
          .find(i => i.platformId === e[0])
          .sites.find(v => v.siteId === e[1]).keywordUrl
      })

      this.showShop = false

      // 如果是第三级以上的路由，统一跳转到第二级去
      if (this.$route.meta.bread && this.$route.meta.bread.length >= 2) {
        this.$router.push({
          path: this.$route.meta.bread[1].path
        })
      }

      //改变店铺
      this.getShop()
    },
    shopChange(e) {
      this.shopValue = e
      this.$storage.set('local', 'shopValue', this.shopValue)
      this.$store.commit('storeInfo/setInfo', {
        ...this.storeInfo,
        sellerId: e
      })
      GLOBAL.vbus.$emit('page.main.refresh')
    },
    getShop() {
      this.$api['shopAuth/sellerAuthListToSeller']({ ...this.storeInfo }).then(
        res => {
          console.log(store.getters['storeInfo/currentSite'])
          let siteName = store.getters['storeInfo/currentSite'].siteName
          this.allShopList = res.data
            ? res.data.map(e => ({
                label: e.sellerAlias,
                value: e.sellerId,
                imgUrl: this.imgMap[siteName].img
              }))
            : []

          //如果缓存中没有 ,  默认取第一个
          if (this.allShopList && this.allShopList.length) {
            let localShowValue = this.$storage.get('local', 'shopValue')
            if (
              localShowValue &&
              this.allShopList.some(e => e.value === localShowValue)
            ) {
              this.shopValue = localShowValue
            } else {
              this.shopValue = this.allShopList[0].value
              this.$storage.set('local', 'shopValue', this.shopValue)
            }
          } else {
            this.shopValue = null
            this.$storage.remove('local', 'shopValue')
          }

          //存sellerId进入storeInfo
          this.$store.commit('storeInfo/setInfo', {
            ...this.storeInfo,
            sellerId: this.shopValue
          })
        }
      )
    },
    closeSearch() {
      this.hideSearchPanel = true
      setTimeout(() => {
        this.showSearch = false
        this.hideSearchPanel = false
      })
    },
    showUserPanel() {
      this.showUser = true
    },
    toHome() {
      if (this.$route.name == 'dash') {
        return
      }
      this.$router.push('/dash')
    },
    toRouter(data) {
      const { url } = data
      url &&
        this.$router.push({
          path: url
        })

      this.handleMouseleave()
    },
    logout() {
      this.loggOut()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // eslint-disable-next-line no-unused-vars
    handleSelect(index) {
      // this.$router.push(this.$store.state.auth.mainMenu[index].url)
    },
    getOffsetLeft(el) {
      let left = el.offsetLeft
      while (el.offsetParent) {
        left += el.offsetParent.offsetLeft
        el = el.offsetParent
      }
      return left
    },
    handleMouseEnter(e, active) {
      if (this.timer2) {
        clearTimeout(this.timer2)
      }
      clearTimeout(this.timer)
      clearTimeout(this.timer1)
      if (active) {
        this.targetL = this.getOffsetLeft(e.target)
        this.topActive = active
      }
      this.timer2 = setTimeout(() => {
        this.showTopMenu = true
      }, 400)
    },
    handleMouseleave() {
      clearTimeout(this.timer2)
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.timer1 = setTimeout(() => {
          this.topActive = this.$route.path.split('/')[1]
        }, 100)
        this.showTopMenu = false
      }, 100)
    },
    getPlatformInfo,
    bindKeydown(e) {
      // console.log(e.keyCode == 27)

      if (e.keyCode == 27) {
        this.closeSearch()
      }
    },
    addKeyEvent() {
      document.addEventListener('keydown', this.bindKeydown)
    },
    removeKeyEvent() {
      document.removeEventListener('keydown', this.bindKeydown)
    }
  },
  created() {
    this.addKeyEvent()
    if (
      /^\/helps\/.*$/.test(this.$route.path) &&
      !this.$store.getters['auth/logged']
    ) {
      return
    }

    this.getPlatformInfo()
  },
  beforeDestroy() {
    this.removeKeyEvent()
  },
  computed: {
    islogged() {
      return this.$store.getters['auth/logged']
    },
    // 当前模块的菜单
    currentTopMenu() {
      return this.mainMenu[this.defaultActive] || { children: [] }
    },
    // 当前模块左侧菜单
    leftMenu() {
      return this.currentTopMenu.children.map(el => ({
        name: el.name,
        index: el.activeIndex
      }))
    },
    // 当前模块右侧菜单
    menuData() {
      let ret = {}
      this.currentTopMenu.children.forEach(el => {
        ret[el.activeIndex] = el.children
      })
      return ret
    },
    defaultActive() {
      return this.topActive || this.$route.path.split('/')[1]
      // this.$store.state.auth.mainMenu.find(el => this.$route.path.split('/')[1].indexOf(f1) > -1)
    },
    currentMenu() {
      // return this.menuData[this.activeMenu]
      return (
        this.mainMenu[this.topActive] && this.mainMenu[this.topActive].children
      )
    },
    mainMenu() {
      return this.$store.state.auth.mainMenu
    },
    //显示的站点
    siteName() {
      let store = this.$store.state.storeInfo,
        name = '',
        curPlatform = store.allData.find(
          e => store.info.platformId === e.platformId
        )

      name += curPlatform.platformName
      return name
    },
    currentSites() {
      let { platformId, siteId } = this.$store.state.storeInfo.info
      return [platformId, siteId]
    }
  },
  watch: {
    '$route.meta': {
      handler(val) {
        if (val.isShowShop) {
          this.getShop()
          this.isShowShop = true
        } else {
          if (this.storeInfo.sellerId) {
            this.$store.commit('storeInfo/setInfo', {
              ...this.storeInfo,
              sellerId: null
            })
          }
          this.isShowShop = false
        }
      },
      immediate: true
    },
    '$route.path'(val) {
      this.topActive = val.split('/')[1]
    }
  }
}
</script>


<style lang="scss" scoped>
$maxWidth: 1400px;
$navColor: #cfcfcf;
.nav-wrapper {
  // overflow: hidden;
  background-color: #232f3e;
  // &.__search {
  //   overflow: initial;
  // }
  .ad-wrapper {
    color: $navColor;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    display: none;
    background-color: hsla(0, 0%, 100%, 0.1);
    .ad {
      text-align: right;
      max-width: $maxWidth;
      margin: 0 auto;
      padding: 0 14px;
      box-sizing: border-box;
    }
  }
  .mask {
    // transition: 400ms;
    z-index: 99999;
    content: '';
    display: block;
    position: absolute;
    top: 45px;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .nav-search {
    color: $navColor;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .search-wp {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .el-icon-search {
        line-height: 53px;
        margin-right: 8px;
        margin-left: 20px;
        font-size: 21px;
      }
      input {
        flex: 1;
        background: transparent;
        border-width: 0;
        color: $navColor;
        text-align: left;
        margin: 4px 0;
        &::-webkit-input-placeholder {
          text-align: left;
          color: #999;
        }
        &:-moz-placeholder {
          text-align: left;
          color: #999;
        }
        &:-ms-input-placeholder {
          text-align: left;
          color: #999;
        }
      }
      .quick-search {
        transform: scaleY(0);
        position: absolute;
        padding: 16px;
        color: rgb(102, 102, 102);
        left: 0;
        top: 49px;
        z-index: 999999;
        background: #fff;
        line-height: 14px;
        width: 100%;
        font-size: 14px;
        animation: 0.1s _slideUp 0.3s forwards;
        &.hide {
          animation: 0.1s _slideUp 0.3s forwards reverse;
        }
        & > div {
          margin-bottom: 10px;
        }
        & > ul {
          margin-left: 24px;
          li {
            padding: 10px 0;
            cursor: pointer;
            &:hover {
              color: #000;
            }
          }
        }
      }
    }

    i.el-icon-close {
      cursor: pointer;
    }
  }
}
.navbar {
  color: #fff;
  max-width: $maxWidth;
  margin: 0 auto;
  height: 45px;
  line-height: 45px;
  &.fixed-menu {
    position: fixed;
    width: 100%;
    max-width: 100%;
    z-index: 1001;
  }
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .user-panel {
    padding: 10px;
    position: absolute;
    background: #fff;
    top: 45px;
    right: -10px;
    z-index: 99999;
    width: auto;
    border: 1px solid #bbb;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.13);
    border-radius: 3px;

    ul {
      li {
        padding: 5px 12px;
        color: #333;
        line-height: 24px;
        font-size: 13px;
        white-space: nowrap;
        &.disabled {
          color: #ddd;
          &:hover {
            color: #ddd;
          }
        }
      }
    }
    &:after {
      content: '';
      display: block;
      border-style: solid;
      border-width: 9px;
      border-color: transparent;
      border-top-width: 0;
      border-bottom: 9px solid #fff;
      width: 0;
      height: 0;
      font-size: 0;
      line-height: 0;
      position: absolute;
      top: -8px;
      right: 8px;
    }
  }
  .shop-panel {
    // padding: 10px;
    position: absolute;
    background: #fff;
    top: 45px;
    left: 0;
    z-index: 99999;
    width: auto;
    border: 1px solid #bbb;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.13);
    border-radius: 3px;
    &:after {
      content: '';
      display: block;
      border-style: solid;
      border-width: 9px;
      border-color: transparent;
      border-top-width: 0;
      border-bottom: 9px solid #fff;
      width: 0;
      height: 0;
      font-size: 0;
      line-height: 0;
      position: absolute;
      top: -8px;
      left: 46px;
    }
  }
  .logo {
    float: left;
    cursor: pointer;
    &:not(.store) {
      width: 70px;
    }
    // padding: 0 10px;
    margin: 0px;
    // font-family: 'Bauhaus 93 Normal', 'Bauhaus 93';
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1;
    -webkit-font-feature-settings: 'kern';
    -moz-font-feature-settings: 'kern';
    -moz-font-feature-settings: 'kern=1';
    font-kerning: normal;
    &:not(.store) {
      text-align: center;
      font-family: 'Bauhaus 93 Normal', 'Bauhaus 93';
    }
    &.store {
      font-size: 12px;
      position: relative;
      color: #999;
      vertical-align: middle;
      margin-right: 10px;
      .country-img {
        vertical-align: middle;
        margin-right: 4px;
      }
      i {
        transition: 400ms;
      }
      &:hover i {
        transform: rotate(180deg);
      }
    }
    span {
      font-size: 24px;
      font-weight: bold;
      line-height: 64px;
      margin-left: 20px;
      margin-right: 20px;
    }
    // img {
    //   height: 60px;
    // }
  }
  .user-profile-container {
    position: absolute;
    right: 0;
    cursor: pointer;
    .user-profile-content {
      position: relative;
      display: flex;
      padding: 0;
      align-items: center;
      height: 45px;
      line-height: 45px;
      .intro {
        font-size: 14px;
        text-decoration: none;
        color: #ddd;
        &:hover {
          color: #999;
        }
      }
    }
    .menu-icons {
      display: flex;
      margin-right: 20px;
      align-items: center;
      :link,
      :visited {
        color: #fff;
      }
      :hover {
        color: #a8a8a8;
      }
      .menu-icon {
        // margin: 0 8px;
        padding-left: 14px;
        .icon {
          font-size: 16px;
          font-style: normal;

          display: inline-block;
          font-size: 18px;
          font-weight: normal;
          text-align: center;
        }
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-right: 14px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
    }
    .user-name {
      color: rgba(255, 255, 255, 0.65);
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 13px;
      font-size: 12px;
    }
  }
}
.top-menu {
  position: absolute;
  background: #232f3e;
  z-index: 9999;
  bottom: 10%;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
  padding-bottom: 40px;
  // height: 800px;
  color: #fff;
  left: 40px;
  right: 40px;
  top: 45px;
  border-top: 1px solid #151719;
  padding-top: 25px;
  box-sizing: border-box;
  /deep/ .el-tree {
    background: transparent;
  }
  .top-menu-row {
    // max-width: 1120px;
    // margin: 0 auto;
    height: 100%;
    .left {
      text-align: right;
      padding: 20px;
      border-right: 1px solid #ddd;
      height: 100%;
      li {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        line-height: 42px;
        cursor: default;
        &:hover,
        &.active {
          color: $titleColor;
        }
      }
    }
    .right {
      padding: 12px;
      .iconfont {
        color: #aab7b8;
        font-size: 30px;
        margin-right: 10px;
        font-weight: 100;
        -webkit-text-stroke-width: 0;
        margin-top: 7px;
      }
      .top-menu-node {
        color: #fff;
        a {
          color: #fff;
          font-weight: normal;
        }
        & > span {
          width: 100%;
          white-space: normal;
          line-height: 1.4;
        }
      }
    }
  }
  .help {
    & h3 {
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }
    ul {
      border: 1px solid $boxBorderColor;
      border-width: 0 0 1px 1px;
    }
    &-item {
      line-height: 24px;
      font-size: 14px;
      cursor: pointer;
      padding: 10px 16px;
      border: 1px solid $boxBorderColor;
      border-width: 1px 1px 0 0;
      &:first-child {
        border-top-color: $subColor;
      }
      &:hover {
        color: $subColor;
      }
    }
  }
  .close-btn {
    position: absolute;
    top: 20px;
    font-size: 18px;
    right: 40px;
  }
}
</style>
<style lang="scss">
.bell-wrapper {
  top: 48px !important;
  font-size: 14px;
  padding: 0;
  .bell {
    display: flex;
    flex-direction: column;
    .bell--item {
      font-size: 12px;
      padding: 14px;
      border-bottom: 1px solid #f2f2f2;
      cursor: pointer;
      p {
        float: left;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        float: right;
      }
      &:hover {
        background-color: #f3fbff;
      }
      * {
        margin: 10px 0;
      }
      * + * {
        margin: 6px 0;
      }
      h5 {
        max-width: 300px;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        margin: 0;
      }
      p,
      span {
        color: #999;
      }
    }
  }
  .el-popover__title {
    margin-bottom: 0;
    font-size: 14px;
    padding: 14px;
    font-weight: bold;
    min-width: 230px;
    color: #000;
    border-bottom: 1px solid #f2f2f2;
  }
}
.el-menu.el-menu--horizontal {
  border: none;
}
// .el-menu--horizontal > .el-menu-item.is-active,
// .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
//   border-bottom: 4px solid $titleColor !important;
// }

.el-menu--popup-bottom-start {
  margin-top: 1px !important;
}

.el-menu--popup-bottom-start {
  margin-top: 0 !important;
  background: rgba(35, 47, 62, 0.8) !important;
  .el-menu-item {
    background: transparent !important;
    &:hover {
      background: rgba(35, 47, 62, 0.8) !important;
    }
  }
}
.el-menu--popup {
  background: rgba(35, 47, 62, 0.85) !important;
  border-radius: 0;
}
.user-dropdown {
  .el-dropdown-menu__item {
    padding: 0;
    span {
      padding: 0 20px;
    }
  }
}
.el-menu--horizontal > .el-submenu {
  .el-submenu__title {
    border: none;
    color: #000;
    &:hover {
      color: $hoverColor;
    }
  }
  &.is-active {
    .el-submenu__title {
      border: none;
      color: $hoverColor;
    }
  }
}

.navbar.el-menu--horizontal > .el-menu-item {
  .nav-item:after {
    transition: transform 0.25s ease;
    content: '';
    display: none;
    position: absolute;
    bottom: 0;
    width: 100%;
    transform: scaleX(0);
    height: 3px;
    background: #f96;
    left: 0;
  }
  &.is-active .nav-item:after {
    transform: scaleX(0.5);
  }
}
</style>