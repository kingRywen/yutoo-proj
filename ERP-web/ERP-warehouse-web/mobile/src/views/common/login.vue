<template>
  <div class="wrap">
    <div class="top50"></div>
    <div v-if="!login">
      <group title="条码登入：">
        <!-- <selector :options="list" v-model="defaultValue"></selector> -->
        <x-input v-model="userCode"></x-input>
      </group>
      <div style="padding:15px 0;">
        <x-button type="primary" @click.native="getValue(userCode)">请扫描员工条码</x-button>
      </div>
    </div>
    <div v-else>
      <group title="选择仓库">
        <!-- <selector :options="warehouseList" v-model="warehouseId"></selector> -->
        <yt-select :list="warehouseList" :placeholder="'输选择仓库'" :title="'仓库:'" :value.sync="warehouseId"></yt-select>
      </group>
      <div style="padding:15px 0;">
        <x-button type="primary" @click.native="handleChose(warehouseId)">提交</x-button>
      </div>
      <div style="padding: 0;">
        <x-button type="primary" @click.native="handleLogin()">注销</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from 'Utils/saver'

export default {
  data() {
    return {
      login: false,
      demo02: '',
      warehouseId: 3,
      userCode: 'app-admin-123',
      warehouseList: []
    }
  },
  created() {
    // storage.set('local', 'token', null)
    if (storage.get('local', 'token')) {
      this.login = true
      let list = JSON.parse(storage.get('local', 'warehouseList'))
      this.warehouseList = this.$.dataType(list) === 'Array' ? list : []
      this.warehouseList.length &&
        (this.warehouseId = this.warehouseList[0].value)
    } else {
      this.login = false
    }
  },
  methods: {
    selectChange(val) {
      console.log(val)
      this.warehouseId = val
    },
    getValue(userCode) {
      let vm = this
      vm.$api[`login/userlogin`]({
        userCode
      })
        .then(({ rows }) => {
          if (rows) {
            // vm.$router.push('choseWarehouse')
            let { warehouseInfo, userInfo } = rows
            storage.set('local', 'token', userInfo.token)
            storage.set('local', 'nickname', userInfo.nickname)
            vm.warehouseList = warehouseInfo.map(item => {
              return {
                label: item.wmWarehouseName,
                value: item.wmWarehouseId
              }
            })
            if (vm.warehouseList.length) {
              vm.warehouseId = vm.warehouseList[0].value
            }
            storage.set(
              'local',
              'warehouseList',
              JSON.stringify(vm.warehouseList)
            )
            vm.login = true
          }
        })
        .catch(err => {
          vm.MessageBox('提示', '登录失败')
        })
    },
    handleChose(warehouseId) {
      let vm = this
      if (warehouseId) {
        vm.$api[`login/warehouseChose`]({ warehouseId })
          .then(({ rows }) => {
            if (rows) {
              vm.$router.push('app')
            }
          })
          .catch(() => {
            vm.login = false
          })
      } else {
        vm.MessageBox('', '请选择仓库')
      }
    },
    handleLogin() {
      storage.set('local', 'token', null)
      this.login = false
    }
  }
}
</script>

<style lang="scss">
.wrap {
  .top50 {
    margin-top: 50%;
  }
}
</style>
