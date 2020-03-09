<template>
  <div class="bargain-info">
    <ElRow>
      <ElCol :span="24">
        <div style="background: #f2f2f2;padding: 10px;">产品信息</div>
        <yt-table :border="true" :selection="false" :data="productData" :columns="productColumns"></yt-table>
      </ElCol>
    </ElRow>
    <ElRow class="martop">
      <ElCol :span="24">
        <div style="background: #f2f2f2;padding: 10px;">议价信息</div>
        <yt-table :border="true" :selection="false" :data="bargainData" :columns="bargainColumns"></yt-table>
      </ElCol>
    </ElRow>
    <ElRow class="martop">
      <ElCol :span="24">
        <div style="background: #f2f2f2;padding: 10px;">议价过程</div>
        <yt-table :border="true" :selection="false" :data="courseData" :columns="courseColumns"></yt-table>
      </ElCol>
    </ElRow>
    <ElRow class="martop" v-if="isHandle">
      <ElCol :span="24">
        <div style="background: #f2f2f2;padding: 10px;">处理结果</div>
        <ElForm :model="form" size="small" ref="form" :inline="true" class="martop">
          <!-- <ElFormItem>
            <ElButton type="default">接受</ElButton>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="default">谢绝</ElButton>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="default">继续议价</ElButton>
          </ElFormItem>-->
          <ElFormItem>
            <el-radio v-model="form.bargainingType" :label="1" border>接受</el-radio>
            <el-radio v-model="form.bargainingType" :label="2" border>谢绝</el-radio>
            <el-radio v-model="form.bargainingType" :label="3" border>继续议价</el-radio>
          </ElFormItem>
          <ElRow v-if="form.bargainingType == 3">
            <ElCol :span="24">
              <ElFormItem label="价格USD" label-width="70px">
                <el-input v-model="form.price" style="width: 60px"></el-input>
              </ElFormItem>
              <ElFormItem label="数量" label-width="40px">
                <!-- <el-input v-model="form.quantity" style="width: 70px"></el-input> -->
                <el-input-number v-model="form.quantity" style="width: 60px" :controls="false" :min="1"></el-input-number>
              </ElFormItem>
            </ElCol>
          </ElRow>
          <div></div>
          <ElFormItem label="Seller Response" label-width="120px">
            <el-input v-model="form.message" type="textarea" style="width:360px"></el-input>
          </ElFormItem>
        </ElForm>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        bargainingType: 1
      },
      productData: [],
      productColumns: [
        {
          label: 'item ID',
          value: 'itemId'
        },
        {
          label: '主图',
          value: 'productImg',
          img: true,
          style: {
            width: 80,
            height: 80
          }
        },
        {
          label: '标题',
          value: 'title',
          width: '170px'
        },
        {
          label: '价格',
          value: 'price',
          width: '60px'
        },
        {
          label: '下架时间',
          value: 'publishTime'
        }
      ],
      bargainColumns: [
        {
          label: 'Best Offer ID',
          value: 'bestOfferId'
        },

        {
          label: '截止时间',
          value: 'deadlineTime'
        },
        {
          label: '买家名称',
          value: 'customName'
        },
        {
          label: '买家邮箱',
          value: 'customEmail'
        },
        {
          label: '买家国家',
          value: 'customCountryCode'
        }
      ],
      bargainData: [],
      courseColumns: [
        {
          label: '时间',
          value: 'createTime'
        },

        {
          label: '内容',
          value: 'content'
        },
        {
          label: '消息',
          value: 'message'
        }
      ],
      courseData: [],
      isHandle: false,
      ebayBargainingId: null
    }
  },
  computed: {},
  methods: {
    handleFlagChange() {
      this.isHandle = true
    },
    edit(params) {
      let vm = this
      let { ebayBargainingId } = params
      vm.ebayBargainingId = ebayBargainingId
      return vm.$api[`order/bargainingInfo`]({ ebayBargainingId }).then(
        ({ rows }) => {
          console.log(rows)
          let {
            processList,
            bestOfferId,
            deadlineTime,
            customName,
            customEmail,
            customCountryCode,
            itemId,
            productImg,
            title,
            price,
            publishTime
          } = rows
          vm.courseData = processList
          vm.bargainData = [
            {
              bestOfferId,
              deadlineTime,
              customName,
              customEmail,
              customCountryCode
            }
          ]
          vm.productData = [
            {
              itemId,
              productImg,
              title,
              price,
              publishTime
            }
          ]
          return Promise.resolve()
        }
      )
    },
    submitForm(cb) {
      let vm = this

      if (!vm.isHandle) {
        cb && cb(false)
      } else {
        vm.$refs['form'].validate(valid => {
          if (valid) {
            let _data = vm.$clone(vm.form)
            _data.ebayBargainingIds = [vm.ebayBargainingId]
            console.log(_data.ebayBargainingIds)
            cb && cb(_data)
          } else {
            console.log('error')
          }
        })
      }
    },
    resetForm() {}
  }
}
</script>

<style lang='scss'>
.bargain-info {
  background: #fff;
}
</style>