<template>
  <div class="vm-location-search">
    <!-- <flexbox>
      <flexbox-item>
        <group>
          <x-input placeholder="请输入库位条码" @on-enter="handleEnter" title="扫描库位：" v-model="locationCode"></x-input>
        </group>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="locationCode" title="扫描库位:" placeholder="请输入库位条码" @click="handleEnter"></scan>
  </div>
</template>

<script>
/**
 使用： 

 <location-search  @change="el => id = el.id" ></location-search>
 
 * 
 */
export default {
  name: 'location-search',
  data() {
    return {
      locationCode: ''
    }
  },
  methods: {
    handleEnter() {
      let vm = this
      vm.$api[`warehouse/getByCode`]({
        locationCode: vm.locationCode
      }).then(({ rows = {} }) => {
        vm.$emit('change', rows)
      })
    },
    clear() {
      this.locationCode = ''
    }
  }
}
</script>

<style lang='scss'>
.vm-location-search {
  background: #fff;
}
</style>