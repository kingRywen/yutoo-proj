<template>
  <div class="sorting">
    <flexbox>
      <flexbox-item>
        <group>包裹单号：{{packageNumber}}</group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item :span="6/10">
        <group>
          <div class="bar-code bcolor" contenteditable>
            <!-- <icon type="success"></icon>
            <icon type="cancel"></icon>-->
            <!-- 仓库唯一标识 -->
            <x-input :placeholder="placeholder" @on-enter="handleEnter" v-model="code"></x-input>
          </div>
        </group>
      </flexbox-item>
      <flexbox-item :span="4/10" style="margin: 0">
        <group>
          <div v-if="exceptionFlag && !completeFlag">
            <x-button type="default" style="padding: 0;margin:0;font-size: 12px;">
              <icon type="cancel" style="line-height:25px;font-size: 22px;"></icon>分拣未完成
            </x-button>
            <x-button
              type="default"
              @click.native="handlePackage('exception')"
              style="padding: 0;margin:0;font-size: 12px;"
            >
              <icon type="safe_warn" style="line-height:25px;font-size: 22px;"></icon>异常分拣完成
            </x-button>
          </div>

          <div v-else-if="exceptionFlag && completeFlag">
            <x-button type="default" @click.native="handlePackage" style="padding: 0;margin:0;font-size: 12px;">
              <icon type="success" style="line-height:25px;font-size: 22px!important;"></icon>分拣完成
            </x-button>
            <x-button
              type="default"
              @click.native="handlePackage('exception')"
              style="padding: 0;margin:0;font-size: 12px;"
            >
              <icon type="safe_warn" style="line-height:25px;font-size: 22px;"></icon>异常分拣完成
            </x-button>
          </div>

          <div v-else-if="!exceptionFlag && completeFlag">
            <x-button type="default" @click.native="handlePackage" style="padding: 0;margin:0;font-size: 12px;">
              <icon type="success" style="line-height:50px;"></icon>分拣完成
            </x-button>
          </div>
          <div v-else-if="!exceptionFlag && !completeFlag">
            <x-button type="default" style="padding: 0;margin:0;font-size: 12px;">
              <icon type="cancel" style="line-height:50px;font-size: 22px;"></icon>分拣未完成
            </x-button>
          </div>
        </group>
      </flexbox-item>
    </flexbox>
    <div v-for="item in baskets" :key="item.id">
      <flexbox>
        <flexbox-item>
          <group>篮子编号：{{ item.basketCode }}</group>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <group title="产品列表" title-color="black">
            <yt-table :columns="columns" :data="item.products"></yt-table>
          </group>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      placeholder: '扫描产品条码&篮子条码',
      warehouseFlag: false,
      columns: [
        {
          label: '产品图片',
          value: 'image',
          width: '2',
          type: 'img'
        },
        {
          label: '自定义SKU',
          value: 'sku'
        },
        {
          label: '规则参数',
          value: 'specification'
        },
        {
          label: '总需求数',
          value: 'amountPackage'
        },
        {
          label: '拣货任务数',
          value: 'amountTask'
        },
        {
          label: '扫描数量',
          value: 'amountScanned'
        },
        {
          label: '扫描状态',
          width: '0',
          render(h, scope) {
            if (scope.passFlag) {
              return (
                <span style="font-size:15px;">
                  <div style="line-height: 30px;">
                    <icon type="success" is-msg />
                  </div>
                  <div style="line-height: 30px;">扫描匹配通过</div>
                </span>
              )
            } else {
              return (
                <span style="font-size:15px;">
                  <div style="line-height: 30px;">
                    <icon type="cancel" is-msg />
                  </div>
                  <div style="line-height: 30px;">扫描匹配不通过</div>
                </span>
              )
            }
          }
        }
      ],
      PackageInfo: {},
      exceptionFlag: false,
      completeFlag: false,
      baskets: [
        // {
        //   products: [],
        //   basketCode: ''
        // }
      ],
      wmPackageId: null,
      wmPickingBasketId: null,
      packageNumber: ''
    }
  },
  methods: {
    handleEnter() {
      let vm = this
      let params = {
        wmPickingBasketId: vm.wmPickingBasketId,
        code: vm.code
      }
      vm.$api[`warehouse/pickScan`](params).then(({ rows }) => {
        if (rows.basketFlag) {
          vm.wmPickingBasketId = rows.wmPickingBasketId
          vm.$msg('请继续扫描产品')
          vm.placeholder = '请继续扫描产品'
          vm.code = ''
        } else {
          let {
            completeFlag = false,
            wmPackageId,
            baskets = [],
            exceptionFlag = false,
            packageNumber = ''
          } = rows
          vm.wmPackageId = wmPackageId
          vm.baskets = baskets
          vm.completeFlag = completeFlag
          vm.placeholder = '扫描产品条码&篮子条码'
          vm.exceptionFlag = exceptionFlag
          vm.packageNumber = packageNumber
        }
      })
    },
    handlePackage(exception) {
      let vm = this
      let url = ''
      if (!vm.wmPackageId && vm.wmPackageId !== 0) {
        return
      }
      let params = {
        wmPackageId: vm.wmPackageId
      }
      if (exception == 'exception') {
        url = 'pickException'
      } else {
        url = 'pickIsComplete'
      }
      vm.$api[`warehouse/${url}`](params)
    }
  }
}
</script>

<style lang="scss">
.sorting {
  background: #fff;
  .bar-code {
    height: 3rem;
    margin: 0 auto;
    text-align: center;
  }
}
</style>