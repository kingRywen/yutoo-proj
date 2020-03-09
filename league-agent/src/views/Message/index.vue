<template>
  <main-layout
    :searchFields="searchFields"
    ref="layout"
    url="agent/merchantMessageList"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :searchFunc="searchFunc"
    :treeTable="false"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      searchFields: {
        type: {
          widget: 'select',
          options: '$const.OTHER/sysInform',
          label: '消息类型',
          labelWidth: '70px'
        }
      },
      columns: [
        {
          label: '消息类型',
          value: 'type',
          width: 100,
          _enum: {
            1: '系统通知',
            2: '账号支付',
            3: '年费'
          }
        },
        {
          label: '标题',
          value: 'title'
        },
        {
          label: '内容',
          value: 'content',
          noTooltip: true
        },
        {
          label: '通知日期',
          width: 85,
          value: 'noticeStartDate'
        }
      ],
      edits: [
        {
          name: '查看',
          fn: scope => {
            this.$dialog({
              size: 'medium',
              title: '查看消息',
              params: { id: scope.row.id },
              cancelBtnText: '关闭',
              component: () => import('./dialogs/view.vue')
            })
          }
        }
      ]
    }
  },
  created() {
    GLOBAL.vbus.$on('logic.msg.show', id => {
      this.$dialog({
        size: 'medium',
        title: '查看消息',
        params: { id },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/view.vue')
      })
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.$dialog({
          size: 'medium',
          title: '查看消息',
          params: { id: this.$route.query.id },
          cancelBtnText: '关闭',
          component: () => import('./dialogs/view.vue')
        })
        this.$router.replace({
          path: this.$route.path,
          query: {}
        })
      }
    })
  },
  methods: {
    searchFunc(data) {
      return data
    }
  }
}
</script>