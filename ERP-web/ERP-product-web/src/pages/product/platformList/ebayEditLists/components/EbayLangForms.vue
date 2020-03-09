<template>
  <div class="wrapper" v-loading="loading">
    <!-- {{productPltDetailId}} - {{$attrs}} -->
    <el-steps :active="active" class="mb20" finish-status="success" align-center>
      <el-step title="选择分类" v-show="siteData"></el-step>
      <el-step title="基本信息"></el-step>
      <el-step title="产品属性"></el-step>
      <el-step title="描述信息"></el-step>
      <el-step title="业务政策"></el-step>
      <el-step title="预览"></el-step>
      <el-step title="提交审核"></el-step>
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
      <div v-show="active == 1" v-if="active >= 1">
        <Two
          ref="form2"
          :review="review"
          :parentFlag="parentFlag"
          :productType="productType"
          :productId="productId"
          :data="formData.two"
          @setData="formSetData"
          :platformId="platformId"
          
          :productPltDetailId="productPltDetailId"
        />
      </div>
      <div v-show="active == 2" v-if="active >= 2">
        <Three
          :siteId="siteId"
          :data="formData.three"
          :review="review"
          :productType="productType"
          :productId="productId"
          :parentFlag="parentFlag"
          ref="form3"
          :platformId="platformId"
          :productPltDetailId="productPltDetailId"
        />
      </div>
      <div v-show="active == 3" v-if="active >= 3">
        <Four
          :data="formData.four"
          @setData="formSetData"
          :review="review"
          :productType="productType"
          :productId="productId"
          :parentFlag="parentFlag"
          ref="form4"
          :platformId="platformId"
          :productPltDetailId="productPltDetailId"
        />
      </div>
      <div v-show="active == 4" v-if="active >= 4">
        <Five
          :data="formData"
          :review="review"
          @setData="formSetData"
          :parentFlag="parentFlag"
          :productType="productType"
          :productId="productId"
          ref="form5"
          :platformId="platformId"
          :productPltDetailId="productPltDetailId"
        />
      </div>
      <div v-show="active == 5" v-if="active >= 5">
        <Review
          :data="formData"
          :review="review"
          :parentFlag="parentFlag"
          :productType="productType"
          :productId="productId"
          :platformId="platformId"
          :productPltDetailId="productPltDetailId"
        />
      </div>
      <div v-show="active == 6" v-if="active >= 6">6</div>
    </div>
    <div class="btn-box">
      <ElButton
        size="small"
        type="primary"
        :disabled="loading"
        @click="prev"
        v-if="(productPltDetailId != null && active > 0 && active <= 6) || (productPltDetailId == null &&  active > 1 && active <= 6)"
      >上一步</ElButton>
      <ElButton v-if="active < 5" size="small" type="primary" :disabled="loading" @click="next(0)">下一步</ElButton>
      <template v-if="active == 5">
        <ElButton
          v-if="!review && ((!isVariant && productPltDetailId != null) || productPltDetailId == null)"
          size="small"
          type="primary"
          :disabled="loading"
          @click="submit"
        >提交审核</ElButton>
      </template>
      <ElButton
        v-if="isVariant && productPltDetailId != null"
        size="small"
        type="primary"
        :disabled="loading"
        @click="next(1)"
      >保存</ElButton>
    </div>
    <ElDialog title="设置图片属性" width="400px" :visible.sync="imgPropVisible">
      <ElSelect style="width:100%" size="small" v-model="imgProp">
        <ElOption v-for="item in imgPropList" :label="item.label" :value="item.value" :key="item.value"></ElOption>
      </ElSelect>
      <div style="text-align:center;margin-top:20px">
        <ElButton size="small" type="primary" @click="storeSubmit">确认提交</ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast, toParamUrl } from 'common/common'
import One from './steps/One'
import Two from './steps/Two'
import Three from './steps/Three'
import Four from './steps/Four'
import Five from './steps/Five'
import Review from './steps/Review'
import bus from '@/common/bus'

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
    'productId'
  ],
  components: {
    One,
    Two,
    Three,
    Four,
    Review,
    Five
  },
  data() {
    return {
      imgProp: null,
      imgPropList: [],
      imgPropVisible: false,
      // 全局loading
      loading: false,
      // 用户填到第几步
      active: this.productPltDetailId != null ? 0 : 1,
      // 表单所有数据
      formData: {
        one: {
          selectedCate: null
        },
        two: {
          listTyle: 1,
          salesStrategyType: 0
        },
        three: {
        },
        four: {
          value: ''
        },
        five: {
          autopayFlag: 0,
          paymentType: [],
          domesticRefundFlag: 0,
          abroadRefundFlag: 0,
          buyConditions: 1,
          defaultFlag: 0,
          domesticPermitTransportAreaList: [],
          noTransportAreaList: [],
          foreignPermitTransportAreaList: []
        },
        six: {},
        seven: {},
        eight: {},
        nine: {}
      }
    }
  },
  computed: {
    siteId() {
      if (!this.siteData || !this.siteData.siteList) {
        return null
      }
      return this.siteData.siteList[0].siteInfo.siteId
    },
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

  created() {
    if (!this.parentFlag || this.siteId != null) {
      this.active = 1
    }
    bus.$on('setLoading', loading => {
      this.loading = loading
    })
  },
  methods: {
    formSetData({ data, code }) {
      // console.log(data)
      // console.log(data, code)
      let keyName
      switch (code) {
        case 0:
          keyName = 'two'
          if (data.salesStrategyType == null) {
            data.salesStrategyType = 0
          }
          break
        case 1:
          keyName = 'three'
          break
        case 2:
          keyName = 'four'
          break

        case 4:
          keyName = 'five'
          data.paymentType =data.paymentType.split('@,,#@')
          // if (!Array.isArray(data.paymentType)) {
          //   data.paymentType = []
          // }
          break
        case 6:
          keyName = 'six'
          break
        case 3:
          keyName = 'seven'
          break
        case 7:
          if (
            !data.domesticPermitTransportAreaList ||
            !data.domesticPermitTransportAreaList.length
          ) {
            data.domesticPermitTransportAreaList = []
          } else {
            data.domesticPermitTransportAreaList = data.domesticPermitTransportAreaList.map(
              el => ({ ...el, transportTypeName: el.transportTypeStr })
            )
          }
          if (
            !data.foreignPermitTransportAreaList ||
            !data.foreignPermitTransportAreaList.length
          ) {
            data.foreignPermitTransportAreaList = []
          } else {
            data.foreignPermitTransportAreaList = data.foreignPermitTransportAreaList.map(
              el => ({ ...el, transportTypeName: el.transportTypeStr })
            )
          }
          if (!data.noTransportAreaList || !data.noTransportAreaList.length) {
            data.noTransportAreaList = []
          } else {
            let obj = {}
            data.noTransportAreaList.forEach(el => {
              let d = obj[el.regionId]
              if (d) {
                
                d.country.push({
                  areaId: el.countryId, 
                  supperId: el.countryId, 
                  parentName: el.regionName,
                  parentId: el.regionId,
                  name: el.countryName,
                  areaName: el.countryName,
                })
              } else {
                obj[el.regionId] = {
                  country: [],
                  name: el.regionName,
                  supperId: el.regionId
                }
              }
            })

            console.log(Object.values(obj));
            
            data.noTransportAreaList = Object.values(obj)
          }
          keyName = 'eight'
          break
        case 5:
          keyName = 'nine'
          break

        default:
          break
      }
      if (keyName) {
        this.formData[keyName] = { ...(this.formData[keyName] || {}), ...data }
      }
    },
    // 提交信息
    // 如果是ebay的店铺提交，需要设置图片属性
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
      if (isPlat) {
        return this._fetch(api, data, true)
      } else {
        return this.storeSubmit()
        // 同时需要设置图片属性
        // return Promise.all([this._fetch(api, data), this.setImgProp()])
      }
    },

    storeSubmit() {
      let api = 'storeProductEbayCommit'
      let data = {
        productType: this.productType,
        productId: this.productId
      }
      // let api1 = 'storeImgSetImgProperty'
      // let data1 = {
      //   productType: this.productType,
      //   productId: this.productId,
      //   propertyName: this.imgProp
      // }
      return Promise.all([this._fetch(api, data)])
        .then(res => {
          if (res.every(el => el.data.code === 0)) {
            showToast('success', '提交成功')
            toParamUrl('/product/ShopProducts.html')
          } else {
            showToast('error', res.filter(el => el.data.code !== 0)[0].data.msg)
          }
        })
        .catch(err => {
          showToast('error', err.message)
        })
    },

    

    _fetch(api, data, link = false) {
      let isPlat = this.productPltDetailId != null
      return fetchData({
        ...apis[api],
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            if (link) {
              showToast('success', '提交成功')
              toParamUrl(this.listUrl)
            }
          },
          () => {
            showToast('error', res.data.msg)
          },
          true
        )
        return res
      })
    },
    // type 1 保存 0 下一步
    next(type) {
      if (this.active === 5 && this.isVariant && type) {
        toParamUrl(this.listUrl)
        return
      }
      if (this.active < 6) {
        let curForm = this.$refs[`form${this.active + 1}`]
        curForm &&
          curForm
            .validate()
            .then(() => {
              // 每个下一步的操作
              if (!this.review) {
                this.save()
                  .then(() => {
                    if (!type) {
                      this.active++
                    } else {
                      toParamUrl(this.listUrl)
                    }
                  })
                  .catch(err => {
                    this.loading = false
                    showToast('error', err)
                  })
              } else {
                this.active++
              }
            })
            .catch(err => {
              this.loading = false
              err instanceof Error && console.error(err)
              if (!this.review) {
                showToast('warning', err || '请填写必填项')
              } else {
                this.active++
              }
            })
      } else {
        if (!this.review) {
          this.submit()
        }
      }
    },
    // 保存操作
    async save() {
      if (this.active === 0) {
        if (this.parentFlag !== 1) {
          return
        }
        // 保存类目数据
        this.loading = true
        await this.saveCateData()
        this.loading = false
      } else {
        // 保存编辑数据
        this.loading = true
        await this.$refs[`form${this.active + 1}`].save()
        this.loading = false
      }
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
        parentFlag: this.parentFlag,
        siteList,
        parentDetail: {},
        variantDetailList: []
      }
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_CATEGORY_UPDATE,
        data: params
      }).then(res => {
        handlerCode(
          res,
          () => {},
          () => {
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
