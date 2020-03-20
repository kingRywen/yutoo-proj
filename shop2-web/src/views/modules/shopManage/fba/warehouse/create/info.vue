<template>
  <div>
    <header>
      <h5>
        <template v-if="editName">
          <el-input size="small" style="width: 200px" v-model="value"></el-input>
          <el-button type="text" size="mini" style="padding: 0;margin-left: 10px" @click="ok">确认</el-button>
          <el-button type="text" size="mini" style="padding: 0" @click="editName = !editName, value = null">取消</el-button>
        </template>
        <template v-else>{{planInfo.planName}}</template>
        <span v-if="planInfo.createTime">（{{planInfo.createTime}}）</span>
        <el-button
          v-if="!editName && planInfo.createTime"
          type="text"
          size="mini"
          style="padding: 0"
          @click="editName = !editName"
        >{{editName ? '取消' : '重命名'}}</el-button>
      </h5>
    </header>
    <table v-if="this.addressInfo.addressId" :style="{width:'700px'}" class="custom-table">
      <template v-if="!type">
        <tr>
          <td class="table-header" style="width:80px">发货地址</td>
          <td>
            <div class="flex just-sb">
              <span>{{addressGroupName}}</span>
              <el-button type="text" size="mini" style="padding: 0" @click="editAddress">修改</el-button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">目标商城</td>
          <td>{{planInfo.storeName}}</td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">包装类型</td>
          <td>{{packageTypeName}}</td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td class="table-header" style="width:80px">发货地址</td>
          <td>
            <div class="flex just-sb">
              <span>{{addressGroupName}}</span>
              <el-button type="text" size="mini" style="padding: 0" @click="editAddress">修改</el-button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">总费用</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{planInfo.totalFee}}</span>
            </div>
          </td>
        </tr>
        <!-- <tr>
          <td class="table-header" style="width:80px">包装类型</td>
          <td>{{packageTypeName}}</td>
          <td class="table-header" style="width:80px">标签费用</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{addressGroupName}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">主题</td>
          <td>{{packageTypeName}}</td>
          <td class="table-header" style="width:80px">放置费用</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{addressGroupName}}</span>
            </div>
          </td>
        </tr>-->
      </template>
    </table>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  props: ['type'],
  data() {
    return {
      editName: false,
      value: null
    }
  },
  computed: {
    ...mapState('fba', ['planInfo', 'addressInfo']),
    ...mapGetters('fba', ['addressGroupName', 'packageTypeName'])
  },
  methods: {
    ...mapMutations('fba', ['setAddressInfo']),
    ...mapActions('fba', ['updatePlan']),
    ok() {
      this.updatePlan({
        info: { ...this.planInfo, planName: this.value }
      }).then(() => {
        this.value = null
        this.editName = false
      })
    },
    editAddress() {
      this._openDialog({
        size: 'medium',
        fullscreen: false,
        title: '地址管理',
        params: {
          cb: row => {
            this.setAddressInfo(row)
          }
        },
        cancelBtnText: '关闭',
        component: () => import('./address.vue')
      })
    }
  }
}
</script>