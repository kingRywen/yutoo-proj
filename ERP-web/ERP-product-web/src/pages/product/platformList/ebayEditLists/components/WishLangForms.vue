<template>
  <div class="wrapper" v-loading="loading">
    <el-steps v-if="tabsData" :active="active" class="mb20" finish-status="success" align-center>
      <el-step title="选择类目" v-if="siteData"></el-step>
      <el-step v-for="item in tabsData" :title="item.nameCn"></el-step>
    </el-steps>
    <div class="step">
      <div v-show="active == 0" v-if="active >= 0 && siteData">
        <One
          ref="form1"
          :review="review"
          :data="formData.one"
          :siteData="siteData"
          :productType="productType"
          :productId="productId"
          :platformId="platformId"
          :productPltDetailId="productPltDetailId"
        />
      </div>
      <div
        v-for="(item, index) in tabsData"
        v-show="siteData ? active == index + 1 : (active == index || active == tabsData.length - 1)"
        v-if="siteData ? active >= index + 1 : active >= index"
      >
        <Normal
          v-if="siteData ? index < tabsData.length - 1 : index < tabsData.length"
          :platFlag="productPltDetailId != null"
          :data="formData"
          :name="item.nameEn"
          :review="review"
          :ref="`form${index+2}`"
          :productType="productType"
          :productId="productId"
          :parentFlag="parentFlag"
          ref="form3"
          @setData="formSetData(item, index, $event)"
          :groupCode="item.code"
          :platformId="platformId"
          :productPltDetailId="productPltDetailId"
        />
        <div v-else>
          <template v-for="(item, index) in tabsData">
            <Normal
              v-if="index < tabsData.length - 1"
              :platFlag="productPltDetailId != null"
              :data="formData"
              :name="item.nameEn"
              :review="true"
              :ref="`form${index+2}`"
              :productType="productType"
              :productId="productId"
              :parentFlag="parentFlag"
              ref="form3"
              @setData="formSetData(item, index, $event)"
              :groupCode="item.code"
              :platformId="platformId"
              :productPltDetailId="productPltDetailId"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <ElButton
        size="small"
        type="primary"
        :disabled="loading"
        @click="prev"
        v-if="(productPltDetailId != null && active > 0 && active <= tabsData.length) || (productPltDetailId == null &&  active > 0 && active <= tabsData.length)"
      >上一步</ElButton>
      <ElButton
        v-if="(productPltDetailId != null && (tabsData.length === 0 || (tabsData.length !== 0 && active < tabsData.length))) || (productPltDetailId == null && active < tabsData.length - 1)"
        size="small"
        type="primary"
        :disabled="loading"
        @click="next(0)"
      >下一步</ElButton>
      <!-- 母体非预览状态 -->
      <ElButton
        v-else-if="(productPltDetailId != null && !review && !isVariant) || (productPltDetailId == null && !review)"
        size="small"
        type="primary"
        :disabled="loading"
        @click="submit"
      >提交审核</ElButton>
      <ElButton
        v-if="isVariant && productPltDetailId != null"
        size="small"
        type="primary"
        :disabled="loading"
        @click="next(1)"
      >保存</ElButton>
    </div>
  </div>
</template>

<script>
import apis from 'apis'
import bus from 'common/bus'
import { fetchData, handlerCode, showToast, toParamUrl } from 'common/common'
import One from './steps/One'
import Normal from './common/Normal'

export default {
  inheritAttrs: false,
  props: [
    'productPltDetailId',
    'isVariant',
    'review',
    'siteData',
    'languageId',
    'platformId',
    // 店铺产品需要的参数
    'productType',
    'productId',
    'tabs'
  ],
  components: {
    One,
    Normal
  },
  data() {
    return {
      tabsData: this.tabs
        ? this.tabs.concat({
            nameCn: '预览',
            review: true
          })
        : [],
      // 全局loading
      loading: false,
      // 用户填到第几步
      active: 0,
      // 表单所有数据
      formData: {
        one: {},
        Basic: {
          list: []
        }
      }
    }
  },
  computed: {
    listUrl() {
      let isPlat = this.productPltDetailId != null
      return isPlat
        ? '/product/platformList.html'
        : '/product/ShopProducts.html'
    },
    parentFlag() {
      return this.isVariant ? 0 : 1
    },
    selectedTempId() {
      if (!this.siteData) {
        return
      }
      return this.siteData.siteList
        .filter(el => el.siteInfo.templateId != null)
        .map(el => el.siteInfo.templateId)
    }
  },

  async created() {
    if (!this.parentFlag && this.productPltDetailId != null) {
      this.getTabs()
      this.active = 1
    }
    bus.$on('setLoading', loading => {
      this.loading = loading
    })
    // await this.getTabs()
  },
  methods: {
    getTabs() {
      this.loading = true
      let data = {
          platformId: this.platformId,
          productPltDetailId: this.productPltDetailId
        },
        vm = this
      return fetchData({
        ...apis.productPltDetailGroupList,
        data
      }).then(res => {
        this.loading = false
        handlerCode(
          res,
          () => {
            this.tabsData = res.data.rows.concat({
              nameCn: '预览',
              review: true
            })
            let obj = {}
            res.data.rows.forEach(el => {
              obj[el.nameEn] = { list: [] }
            })
            this.formData = Object.assign({}, this.formData, obj)
          },
          () => {
            vm.message.error(res.data.msg)
          },
          true
        )
      })
    },
    formSetData({ nameEn, code }, index, val) {
      // debugger
      if (!this.formData[nameEn]) {
        this.$set(this.formData, nameEn, { list: [] })
        this.$nextTick(() => {
          this.formData[nameEn].list = val.data
        })
      } else {
        this.formData[nameEn].list = val.data
      }
    },
    // 提交信息
    submit() {
      // console.log('提交')
      let api,
        data,
        isPlat = this.productPltDetailId != null
      if (isPlat) {
        api = 'PRODUCT_PLT_DETAIL_A_EN_COMMIT'
        data = {
          platformId: this.platformId,
          productPltDetailId: this.productPltDetailId
        }
      } else {
        api = 'storeProductEbayCommit'
        data = {
          productType: this.productType,
          productId: this.productId
        }
      }
      return fetchData({
        ...apis[api],
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            showToast('success', '提交成功')
            toParamUrl(this.listUrl)
          },
          () => {
            this.$message.error(res.data.msg)
          },
          true
        )
      })
    },
    // type 1 保存 0 下一步
    next(type) {
      if (this.active === this.tabsData.length - 1 && this.isVariant && type) {
        toParamUrl(this.listUrl)
        return
      }
      let current = this.siteData ? this.active : this.active + 1
      if (this.active < this.tabsData.length || this.active == 0) {
        let curForm = this.$refs[`form${current + 1}`]
        curForm = curForm[0] ? curForm[0] : curForm
        // debugger
        curForm &&
          curForm
            .validate()
            .then(() => {
              // 每个下一步的操作
              if (!this.review) {
                this.save()
                  .then(res => {
                    if (!type) {
                      if (res === 'first') {
                        // 在类目信息保存之后 再获取标签页
                        this.getTabs()
                        this.active++
                      } else {
                        this.active++
                      }
                    } else {
                      toParamUrl(this.listUrl)
                    }
                  })
                  .catch(err => {
                    if (err instanceof Error) {
                      console.error(err)
                    }
                    this.loading = false
                  })
              } else {
                this.getTabs()
                this.active++
              }
            })
            .catch(err => {
              err instanceof Error && console.error(err)
              if (!this.review) {
                showToast('warning', err || '请填写必填项')
              } else {
                this.active++
              }
            })
      } else if (this.active > 0 && this.active >= this.tabsData.length) {
        if (!this.review) {
          if (type) {
            toParamUrl(this.listUrl)
          } else {
            this.submit()
          }
        }
      }
    },
    // 保存操作
    async save() {
      let res,
        current = this.siteData ? this.active : this.active + 1,
        curForm = this.$refs[`form${current + 1}`]

      curForm = curForm[0] ? curForm[0] : curForm
      if (this.active === 0 && this.siteData) {
        if (this.parentFlag !== 1) {
          return 'first'
        }
        // 保存类目数据
        this.loading = true
        res = await this.saveCateData().then(() => {
          return 'first'
        })
        this.loading = false
      } else {
        // 保存编辑数据
        this.loading = true
        res = await curForm.save()
        this.loading = false
      }
      return res
    },

    // 保存类目数据
    saveCateData() {
      let siteList = this.siteData.siteList.map(el => {
        const { siteInfo } = el
        const { selectedCate, tempList, ...info } = siteInfo
        return {
          ...info,
          categoryId: selectedCate.slice(0).pop(),
          siteCategoryInfo: selectedCate.join(',')
        }
      })
      let params = {
        platformId: this.platformId,
        productPltDetailId: this.productPltDetailId,
        siteList,
        parentDetail: {},
        variantDetailList: []
      }
      this.loading = true
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_CATEGORY_UPDATE,
        data: params
      }).then(res => {
        // if (res.data.code !== 0) {
        //   return Promise.reject(res.data.msg)
        // }
        this.loading = false
        handlerCode(
          res,
          () => {},
          () => {
            // this.$message.error(res.data.msg)
            showToast('error', res.data.msg)
          },
          true
        )
      })
    },

    // 上一步
    prev() {
      if (this.active > 0) {
        this.active--
      }
    },

    // 获取系统所有站点
    getSiteList() {
      let vm = this
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_SITE_INFO,
        data: {
          parentFlag: this.isVariant ? 0 : 1,
          productPltDetailId: this.productPltDetailId
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.step {
  padding: 20px;
  flex: 1;
  overflow: auto;
}
.btn-box {
  margin: 0 auto;
  padding-top: 10px;
  // border-top: 1px solid #ddd;
}
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 200px;
  line-height: 1.5;
}
</style>
