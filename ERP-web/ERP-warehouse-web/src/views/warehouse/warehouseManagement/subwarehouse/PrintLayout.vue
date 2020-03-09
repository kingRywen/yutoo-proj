<template>
  <div class="flex-v h100 printLayout">
    <template v-if="info.warehouseName">
      <ElButton class="mar10 noprint" type="primary" @click="handlePrint">打印布局图</ElButton>
      <h1>{{info.warehouseName}} 布局图</h1>
      <div class="field" v-for="field in info.warehouse">
        <h3>{{field.divisionName}}</h3>
        <div class="flex-c">
          <template v-for="rowItem in field.rowList">
            <template v-for="colItem in rowItem.columnList">
              <template v-for="item in colItem.floorList">
                <div class="box">
                  <div class="cube">
                    <div></div>
                    <div></div>
                    <div class="code">{{item.locationCode}}</div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </template>
            </template>
          </template>
        </div>
      </div>
    </template>
    <NonePage v-else-if="!loading" :text="errorText"></NonePage>
  </div>
</template>

<script>
export default {
  props: ['wmWarehouseId'],
  created() {
    this.init()
  },
  data() {
    return {
      errorText: null,
      loading: false,
      info: {
        warehouseName: '',
        warehouse: {}
      }
    }
  },
  methods: {
    handlePrint() {
      window.print()
    },
    init() {
      this.loading = true
      this.$api[`warehouse/wmWarehousePrintLayout`]({
        wmWarehouseId: +this.wmWarehouseId
      })
        .then(data => {
          this.loading = false
          let { warehouseName, warehouse } = data
          this.info = { warehouseName, warehouse }
        })
        .catch(err => {
          this.loading = false
          this.errorText = err.msg
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.printLayout {
  justify-content: start;
  .flex-c {
    flex-wrap: wrap;
  }
  .field {
        margin: 10px;
    border: 2px dotted #ddd;
    padding: 20px;
  }
}
.box {
  width: 80px;
  perspective: 400px;
  margin: 10px;
}
.cube {
  position: relative;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: 2s;
}
.cube div {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #333;
  text-align: center;
  line-height: 1;
  font-size: 16px;
  opacity: 0.4;
  &.code {
    opacity: 0.9;
    color: #000;
  }
}
.cube div:nth-child(1) {
  /*先旋转90度再往相应的方向移动*/
  transform: rotateX(90deg) translateZ(42px);
  background: #ddd;
}
.cube div:nth-child(2) {
  transform: rotateX(-90deg) translateZ(42px);
  background: #ddd;
}
.cube div:nth-child(3) {
  transform: translateZ(42px);
  display: flex;
    justify-content: center;
    align-items: center;
  background: #ddd;
}
.cube div:nth-child(4) {
  transform: translateZ(-42px);
  background: #ddd;
}
.cube div:nth-child(5) {
  transform: rotateY(90deg) translateZ(42px);
  background: #ddd;
}
.cube div:nth-child(6) {
  transform: rotateY(-90deg) translateZ(42px);
  background: #ddd;
}
.cube:hover {
  transform: rotateY(360deg);
}
@media print {
  .noprint {
    display: none;
  }
}
</style>
