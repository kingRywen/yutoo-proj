<template>
  <div class="picking-task">
    <div v-if="!productFlag">
      <flexbox>
        <flexbox-item>
          <div class="no-product">当前用户无可分配的拣货批次 当前用户未获取到已分配的拣货任务</div>
        </flexbox-item>
      </flexbox>
    </div>
    <div v-else-if="productFlag == 1">
      <flexbox>
        <flexbox-item>
          <yt-table :columns="columns" select="true" @selectChange="selectChange" :data="data"></yt-table>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <group>
            <x-button type="primary" @click.native="handleClick">确认打印拣货清单</x-button>
          </group>
        </flexbox-item>
      </flexbox>
    </div>
    <div v-else-if="productFlag == 2" id="ytCavans">
      <flexbox>
        <flexbox-item>
          <group>拣货单：{{printInfo.date}}</group>
        </flexbox-item>
      </flexbox>
      <group>
        <yt-table class="table" :columns="tableColumns" :data="tableData"></yt-table>
      </group>
      <group>
        <flexbox>
          <flexbox-item style="text-align: center">合计：</flexbox-item>
          <flexbox-item style="text-align: center">{{printInfo.skuTotal || 0}}</flexbox-item>
          <flexbox-item style="text-align: center">{{printInfo.totalAmount || 0}}</flexbox-item>
          <flexbox-item style="text-align: center">{{printInfo.locationTotal || 0}}</flexbox-item>
          <flexbox-item style="text-align: center">{{printInfo.warehouseName || '-'}}</flexbox-item>
        </flexbox>
      </group>
    </div>

    <!-- dialog轮播图 -->
    <flexbox>
      <flexbox-item>
        <div v-transfer-dom>
          <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
            <mt-swipe :auto="3000">
              <mt-swipe-item v-for="item in imgList" :key="item.id">
                <img width="100%" :src="item.imageBase">
              </mt-swipe-item>
              <!-- <mt-swipe-item>
                <img width="100%" src="http://sc.jb51.net/uploads/allimg/150716/14-150G6093925932.jpg">
              </mt-swipe-item>
              <mt-swipe-item>
                <img width="100%" src="http://img4.imgtn.bdimg.com/it/u=3377301164,1214067452&fm=214&gp=0.jpg">
              </mt-swipe-item>-->
            </mt-swipe>
            <div @click="showHideOnBlur=false">
              <span>
                <icon type="cancel"></icon>
              </span>
            </div>
          </x-dialog>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { TransferDomDirective as TransferDom } from 'vux'
import html2canvas from 'html2canvas'
export default {
  directives: {
    TransferDom
  },

  data() {
    let vm = this
    return {
      tableData: [],
      tableColumns: [
        {
          label: '主图',
          value: 'image',
          type: 'img'
        },
        {
          label: 'SKU',
          value: 'sku'
        },
        {
          label: '数量',
          value: 'amount'
        },
        {
          label: '库位',
          value: 'location'
        },
        {
          label: '产品名',
          value: 'name'
        }
      ],

      showHideOnBlur: false,
      productFlag: 0,
      data: [],
      columns: [
        {
          label: '包裹单号',
          value: 'packageNumber'
        },
        {
          label: '产品数',
          render(h, scope, index) {
            return (
              <span
                style="color: blue"
                onClick={() => {
                  vm.productShow(index, scope)
                }}
              >
                {scope.totalAmount}
              </span>
            )
          }
        },
        {
          label: '发货备注',
          value: 'deliverRemark'
        }
      ],
      imgList: [],
      selectData: [],
      printInfo: {}
    }
  },
  created() {
    let vm = this

    vm.$api[`warehouse/pickTaskList`]({}).then(({ rows }) => {
      if (rows == null || (Array.isArray(rows) && !rows.length)) {
        vm.productFlag = 0
        return
      } else {
        vm.productFlag = 1
      }
      vm.data = rows
    })
  },
  mounted() {},
  watch: {
    productFlag(val) {
      if (val == 2) {
        this.$nextTick(() => {
          html2canvas(document.getElementById('ytCavans')).then(function(
            canvas
          ) {
            console.log(canvas)
            document.getElementById('ytCavans').innerHTML = ''
            //新Image对象，可以理解为DOM
            var image = new Image()
            image.src = canvas.toDataURL('image/png')
            image.style.width = '100%'
            document.getElementById('ytCavans').append(image)
          })
        })
      }
    }
  },
  methods: {
    selectChange(val) {
      this.selectData = val
    },
    productShow(index, row) {
      let vm = this
      let params = {
        wmAppPickTaskId: row.wmAppPickTaskId
      }
      vm.showHideOnBlur = true
      vm.$api[`warehouse/pickTaskProductList`](params).then(({ rows }) => {
        vm.imgList = rows
      })
    },
    async handleClick() {
      let vm = this
      let params = {
        wmPackageIds: vm.selectData.map(item => item.wmPackageId)
      }
      if (!vm.selectData.length) {
        this.$msg('请选择需打印的包裹单')
        return
      }
      await vm.$api[`warehouse/pickTaskPrint`](params)
        .then(({ rows = [] }) => {
          vm.printInfo = rows
          vm.tableData = rows.products
          vm.productFlag = 2
        })
        .catch(() => {
          vm.productFlag = 1
        })
    },
    showTime() {
      var date = new Date()
      let time =
        date.getFullYear() +
        '年/' +
        date.getMonth() +
        1 +
        '月/' +
        date.getDate() +
        '日/ ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds()
      return time
    }
  }
}
</script>

<style lang="scss">
.mint-swipe {
  height: 400px;
}
.picking-task {
  background: #fff;

  .no-product {
    height: 100px;
    background: gray;
    text-align: center;
    box-sizing: border-box;
    padding: 30px 10% 0;
    color: #fff;
  }
}
</style>