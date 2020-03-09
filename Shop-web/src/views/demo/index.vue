<template>
  <div style="height:100%">
    <div class="tabs-wrapper">
      <ElTabs v-model="activeName" type="card">
        <ElTabPane v-for="item in statusBtnList">
          <template slot="label">
            {{item[0]}}
            <b v-if="item[2]">{{item[2]}}</b>
            <!-- {{item[0] + (item[2] ? ` <b>${item[2]}</b>` : '')}} -->
          </template>
        </ElTabPane>
      </ElTabs>
      <el-button
        class="refresh-btn"
        type="primary"
        plain
        @click="setManualUpdate"
        :loading="loadingBtn1"
        :disabled="BTNdisabled"
      >
        {{refreshhtml}}
        <i class="el-icon-refresh el-icon--right"></i>
      </el-button>
    </div>

    <MainLayout
      :outerParams="outerParams"
      :edits="edits"
      :searchFields="searchFields"
      :searchData="searchData"
      :editBtns="editBtns"
      :columns="columns"
      :treeTable="treeTable"
      :searchFunc="searchFunc"
      :treeTableOtions="treeTableOtions"
      ref="layout"
      url="productList"
    >
      <template slot="search"></template>
    </MainLayout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statusBtnList: [
        ['所有产品', false, null],
        ['在售', false, 1],
        ['不可售', false, 2],
        ['禁止显示', false, 4],
        ['信息待改善', false, 3],
        ['商品信息变动', false, 0] // 0 切换接口
      ],
      refreshhtml: '手动刷新',

      treeTable: true,
      treeTableOtions: {
        childs: 'children',
        expandFunc: row => {
          return row.count > 0
        }
      },
      data: {},
      // 外部参数
      outerParams: {
        // pageSize: 10,
        // pageNumber: 1,
        cusCateId: null,
        asin: null,
        startTime: null,
        endTime: null,
        productStatus: null,
        alertType: null,
        readFlag: null,
        problem: null,
        siteId: 1,
        sellerId: 'A1NEG3KQPSQ7H7'
      },

      edits: [
        {
          name: '激活',
          icon: 'el-icon-edit-outline',
          show: scope => {
            return scope.row.productStatus === 1
          },
          fn: (scope, item) => {
            // vm.editItem(scope.row, 1)
            console.log('激活')
            this.$refs.layout.$dialog({
              title: 'hehe',
              width: '500px',
              component: () => import('./components/active.vue'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        }
      ],
      searchFields: [
        {
          label: '监控状态',
          labelWidth: '80px',
          name: 'status',
          type: 'select',
          options: [
            {
              label: '所有',
              value: 1
            }
          ]
        },
        {
          label: '创建时间',
          name: 'createTime',
          type: 'dateRange',
          // width: 240,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            }
          }
        },
        {
          noLabel: true,
          name: 'keyword',
          placeholder: '请输入关键诩'
        }
      ],
      searchData: {
        status: 1
      },
      editBtns: [
        {
          name: '添加任务',
          fn: () => {
            this.$refs.layout.$dialog({
              title: 'hehe',
              width: '1000px',
              component: () => import('./index.1.vue'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          type: 'danger',
          fn: () => {
            console.log('del')
            this.$refs.layout
          }
        }
      ],
      columns: [
        {
          sortable: 'custom',
          value: 'imgUrl', //table需要渲染的值
          label: '主图', //表头
          // width: "60", //当前行宽度
          img: true, //如图片传
          link: 'productUrl',
          style: {
            //图片宽高
            width: 40,
            height: 40
          },
          bulkyHeight: 120 //鼠标hover图片高，宽度自动
        },
        {
          sortable: true,
          label: '任务名称1',
          value: 'taskName',
          minWidth: 150
          // expand: true
        },
        {
          label: 'ASIN',
          value: 'asin',
          // width: 200,
          minWidth: 150,
          expand: true,
          async: true,
          asyncFunc: row => {
            // return this.$api[url](data)
            // .then(data => {
            //   return data
            // })
            console.log(row)
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve([
                  {
                    amzCateName:
                      'Sports & Outdoors:Sports & Fitness:Exercise & Fitness:Clothing:Women:Leggings',
                    asin: 'B01FCV8LT8',
                    count: 2,
                    createTime: '2019-04-09 13:31:02',
                    cusCateId: null,
                    deliveryType: 'AMAZON_NA',
                    explanation:
                      'Department is important for helping customers find your product.',
                    imageUrl:
                      'http://ecx.images-amazon.com/images/I/31DfAdAw9rL._SL75_.jpg',
                    parentAsin: 'B072B7WYMR',
                    problem: 1,
                    productId: 9477,
                    productName:
                      'Aenlley Womens Workout Bootleg Athletica Yoga Pants Spanx Gym Fitness Activewear Color Black Size L',
                    productStatus: 2,
                    productType: 0,
                    productUrl: 'https://www.amazon.com/dp/B01FCV8LT8',
                    sellerId: 'A1NEG3KQPSQ7H7',
                    siteId: 1,
                    sku: 'Pants-Yoga Pants-008-Black-L',
                    updateTime: '2019-04-10 09:13:21'
                  }
                ])
              }, 10)
            })
          }
        },
        {
          label: '标题',
          value: 'title',
          width: 300
        },
        {
          label: '抓取状态',
          value: 'status',
          render(h, scope) {
            return (
              <span>{scope.row.status == 1 ? '抓取成功' : '抓取失败'}</span>
            )
          }
        },
        {
          label: '监控状态',
          value: 'monitorFlag',
          render(h, scope) {
            return (
              <span>
                {scope.row.monitorFlag == 1 ? '监控成功' : '监控失败'}
              </span>
            )
          }
        },
        {
          label: '频率',
          value: 'frequency'
        },
        {
          label: '创建时间',
          value: 'createTime'
        }
      ]
    }
  },
  methods: {
    sortChange({ column, prop, order }) {
      console.log({ column, prop, order })
    },
    searchFunc() {
      return this.data
    }
  },
  created(){
    
     
  }
}
</script>

<style lang="scss" scoped>
.tabs-wrapper {
  position: relative;
  .refresh-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
