<template>
  <!-- <div>竞品分析</div> -->
  <MainLayout
    :outerParams="outerParams"
    :edits="edits"
    :searchFields="searchFields"
    :searchFunc="searchFunc"
    :editBtns="editBtns"
    :columns="columns"
    ref="layout"
    url="productKrList"
  >
    <!-- <div slot="left">123</div> -->
  </MainLayout>
</template>

<script>
import { mapState } from 'vuex'
import { downloadFile } from 'Utils/tools'
export default {
  name: 'PartFour',
  computed: {
    ...mapState('common', ['sellerData']),
    outerParams() {
      return { taskId: +this.$route.query.taskId }
    }
  },
  data() {
    let vm = this
    return {
      edits: [
        {
          name: '查看详情',
          icon: 'el-icon-search',
          show: scope => {
            return !!scope.row.updateTime
          },
          fn: (scope, item) => {
            this.$refs.layout.$dialog({
              title: '数据展示',
              size: 'medium',
              component: () => import('../charts/DataPresentation.vue'),
              params: { recordId: scope.row.recordId,startTime:scope.row.createTime },
							showMaxBtn:true,
              // okBtnText: '确认',
              // cancelBtnText: '取消'
            })
          }
        }
      ],
      searchFields: [
        {
          noLabel: true,
          name: 'keyword',
          placeholder: '请输入关键词名称'
        },
        {
          noLabel: true,
          name: 'asin',
          placeholder: '请输入ASIN'
        },
        {
          noLabel: true,
          placeholder: '是否有广告排名',
          labelWidth: '80px',
          name: 'adRankFlag',
          type: 'select',
          options: [
            // {
            //   label: '全部',
            //   value: null
            // },
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          noLabel: true,
          placeholder: '是否布局',
          labelWidth: '80px',
          name: 'layoutFlag',
          type: 'select',
          options: [
            // {
            //   label: '全部',
            //   value: null
            // },
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        }
      ],

      editBtns: [
        {
          name: '导出',
          showLoading:true,
          disabled: selection => {
            return vm.$refs.layout && vm.$refs.layout.tableList && vm.$refs.layout.tableList.length === 0
          },
          fn: () => {
            let recordIds = this.getId()
            let params = {
              taskId: this.$route.query.taskId
            }
            if (!recordIds.length) {
              Object.assign(params, this.$refs.layout.searchData)
            } else {
              Object.assign(params, { recordIds })
            }

            const fetch = recordIds => {
              return this.$api[`productKrExport`](params)
                .then(data => {
                  downloadFile(data)
                  // this.$refs.layout.getList()
                })
                .catch(err => {})
            }
            if (!recordIds.length) {
              recordIds = []
              return this.$.showWarning('是否导出全部数据？', () => {
                 return fetch(recordIds)
              })
            } else {
               return fetch(recordIds)
            }
          }
        }
      ],
      columns: [
        {
          value: 'imageUrl', //table需要渲染的值
          label: '主图', //表头
          width: '60', //当前行宽度
          img: true //如图片传
        },
        {
          value: 'asin',
          label: 'ASIN',
          url: 'productUrl'
        },
        {
          label: '关键词',
          value: 'keyword',
		  align:'left',
			render(h, scope) {
				let { keyword } = scope.row
				return keyword ? (
				  <el-tooltip open-delay={300} content={keyword} placement="top" effect="light">
					<span class="fix__row_1">{keyword}</span>
				  </el-tooltip>
				) : (
				  <span>-</span>
				)
			}
        },
        {
          label: '自然排名',
          value: 'webRank',
					sortable:"custom",
        },
        {
          label: '广告排名',
          value: 'adWebRank',
					sortable:"custom",
        },
        {
          label: '是否布局',
          value: 'layoutFlag',
          enum: {
            0: '否',
            1: '是'
          }
        },
        {
          label: '更新时间',
          value: 'updateTime',
					sortable:"custom",
        }
      ]
    }
  },
  methods: {
    searchFunc(data) {
      let { createTime, ...info } = data
      let [startTime, endTime] = createTime || []
      return { startTime, endTime, ...info }
    },
    getSelection() {
      return this.$refs.layout.selection
    },
    getId() {
      return this.getSelection().map(el => el.recordId)
    },
    getList() {
      return this.$refs.layout.getList()
    }
  }
}
</script>

<style>
</style>
