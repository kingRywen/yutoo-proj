<template>
  <v-spin style="height: 100%;" :tip="`加载中...`" :spinning="loading">
    <div style="height:100%" class="review____box" :class="name === '审核' ? '_view' : null">
      <!-- 平台信息，图片 -->
      <el-tabs ref="tab" style="height: 100%;" type="border-card" v-model="name" class="review__tabs">
        <el-tab-pane v-for="(item, index) in tabs" :label="item.title" :key="item.title" :name="item.title" lazy>
          <component
            v-if="item.component"
            ref="com"
            :is="item.component"
            :disable="true"
            :show="true"
            :is-variant="isVariant"
            :language-id="languageId"
            :info="info"
            :productPltDetailId="productPltDetailId"
            :platformId="platformId"
            :review="isReview"
            :siteData="siteData"
          ></component>
          <div style="height: 100%;" v-else>
            <el-tabs style="height: 100%;" tabPosition="left" type="border-card" v-model="reviewName">
              <el-tab-pane
                :label="item.name"
                :name="item.name"
                v-for="item in reviewTabs"
                :disabled="item.productPltDetailId == null"
              >
                <div v-if="item.productPltDetailId != null" span="24" style="margin-bottom: 70px;">
                  <v-form direction="horizontal" :model="item" :rules="rules" ref="ruleForm">
                    <v-row>
                      <v-col span="24">
                        <v-form-item label="审核" prop="auditStatus">
                          <v-radio-group
                            v-model="item.auditStatus"
                            :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]"
                          ></v-radio-group>
                        </v-form-item>
                      </v-col>
                      <v-col>
                        <v-form-item
                          label="原因"
                          :key="item.auditStatus"
                          :prop="item.auditStatus === 3 ? `auditReason` : ''"
                          :required="item.auditStatus === 3"
                        >
                          <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder v-model="item.auditReason"></v-input>
                        </v-form-item>
                      </v-col>
                    </v-row>
                  </v-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="name === '审核'" class="saveBtn" style="left: 0 !important">
      <div style="margin: 0 auto">
        <v-button type="primary" @click.prevent="save">确定</v-button>
        <v-button type="primary" @click.prevent="cancel">取消</v-button>
      </div>
    </div>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import { Tabs, TabPane } from 'element-ui'
import { fetchData, showToast, toParamUrl } from 'common/common'
import { getQueryString } from 'common/util'
import apis from 'apis'
import fetchSite from '../ebayEditLists/components/common/fetchSite'

Vue.use(Tabs)
Vue.use(TabPane)

// 异步组件
const PlatformInformation = () =>
  import('../components/PlatformInformation.vue').then(m => m.default)
// 异步组件
const EbayPlatformInformation = () =>
  import('../ebayEditLists/components/PlatformInformation.vue').then(
    m => m.default
  )
const Picture = () => import('../components/picture.vue').then(m => m.default)

export default {
  components: {
    PlatformInformation,
    EbayPlatformInformation,
    Picture
  },
  mixins: [fetchSite],

  created() {
    this.isVariant = getQueryString('variant')
    this.productPlatformId = getQueryString('productPlatformId')
    this.productId = getQueryString('productId')
    this.isReview = getQueryString('review')
    // 平台id
    this.platformId = getQueryString('platformId')

    /* 判断显示哪个页面 */
    this.name = '审核'
    if (getQueryString('tab') == 1) {
      this.reviewName = '平台信息审核'
    } else {
      this.reviewName = '图片信息审核'
    }
    this.getInfoData()

    fetchData({
      ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
      data: {
        languageIds: [1],
        productPlatformId: +getQueryString('productPlatformId'),
        productPltDetailId: +getQueryString('productPltDetailId')
      }
    }).then(res => {
      console.log(res)
      this.ruleForm = res.data.EN
      this.ruleForm.productId = this.ruleForm.productId
      this.ruleForm.platformId = this.ruleForm.platformId
      this.ruleForm.productPlatformId = this.ruleForm.productPlatformId

      this.ruleForm.auditType = 2
    })
  },
  data() {
    // let name = this.isAmazon ? 'PlatformInformation' : 'EbayPlatformInformation'
    return {
      loading: false,
      reviewTabs: [
        {
          name: '图片信息审核',
          languageId: 2,
          productPltDetailId: true
        }
      ],
      info: {},
      languageId: null,
      reviewName: '平台信息审核',
      name: '平台信息',
      tabs: [
        {
          title: '平台信息',
          component: 'PlatformInformation',
          dataName: 'f'
        },
        {
          title: '图片',
          component: 'Picture',
          dataName: 'w'
        },
        {
          title: '审核',
          dataName: 'r'
        }
      ],

      ruleForm: {},
      ruleForm1: {},
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }],
        auditReason: [{ required: true, message: '请输入审核不通过原因' }]
      },

      // 获取到的语种审核信息
      reviewData: []
    }
  },
  computed: {
    isAmazon() {
      return this.platformId === 1 || this.platformId === 3
    }
  },
  watch: {
    isAmazon: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.tabs[0].component = 'EbayPlatformInformation'
        } else {
          this.tabs[0].component = 'PlatformInformation'
        }
      }
    }
  },
  methods: {
    getInfoData() {
      this.loading = true
      let vm = this
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_LANGUAGE_LIST,
        data: {
          productPlatformId: this.productPlatformId,
          type: 1
        }
      }).then(res => {
        vm.loading = false
        let { code, msg, rows } = res.data
        let tabs = []
        if (code !== 0) {
          showToast('error', msg)
          return
        }
        let { languageInfos, defaultFlag, id } = rows

        vm.info = languageInfos
        vm.languageId = id || languageInfos[0].languageId
        languageInfos.forEach(element => {
          tabs.push({
            name: element.languageName,
            languageId: element.languageId,
            productPltDetailId: element.productPltDetailId
          })
        })
        vm.reviewTabs.unshift(...tabs)
        if (!id) {
          vm.reviewName = '图片信息审核'
        } else {
          vm.reviewName = languageInfos.find(
            el => el.languageId === id
          ).languageName
        }
      })
    },
    cancel() {
      history.go(-1)
    },

    save() {
      let forms = this.$refs.ruleForm
      Promise.all(
        forms.map(
          (form, index) =>
            new Promise((resolve, reject) => {
              form.validate(valid => {
                if (valid) {
                  resolve()
                } else {
                  reject(form)
                }
              })
            })
        )
      )
        .then(res => {
          console.log(res)
          let promises = []
          this.reviewTabs.forEach(el => {
            if (el.productPltDetailId) {
              let data = {
                // FIXME:
                productId: this.productId,
                platformId: this.platformId,
                productPlatformId: this.productPlatformId,
                auditReason: el.auditReason,
                auditStatus: el.auditStatus,
                languageId: el.languageId,
                productPltDetailId: el.productPltDetailId,
                auditType: 2,
              }
              if (el.name !== '图片信息审核') {
                promises.push(this.saveLang(data))
              } else {
                promises.push(this.saveImg(data))
              }
            }
          })

          Promise.all(promises)
            .then(res => {
              showToast('success', '审核成功')
              toParamUrl('/product/platformList.html')
            })
            .catch(err => {
              showToast('error', err)
            })
        })
        .catch(el => {
          // console.log(el)
          this.reviewName = el.model.name
          showToast('error', '请输入必填项')
        })
    },
    saveLang(data) {
      return fetchData({
        ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_UPDATE,
        data
      }).then(res => {
        if (res.data.code === 0) {
          return
        } else {
          return Promise.reject(res.data.msg)
        }
      })
    },
    saveImg(data) {
      return fetchData({
        ...apis.PRODUCT_PLT_AUDIT_IMG_UPDATE,
        data
      }).then(res => {
        if (res.data.code === 0) {
          return
        } else {
          return Promise.reject(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less">
.review____box {
  & > .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__content {
      height: 100%;
      // padding-bottom: 50px;
      .el-tab-pane {
        height: 100%;
        .el-tabs--left {
          height: 100%;
          .el-tabs__content {
            overflow: auto;
          }
        }
      }
    }
  }
}
._view {
  & > .el-tabs {
    .el-tabs__content {
      padding-bottom: 66px;
    }
  }
}
</style>
