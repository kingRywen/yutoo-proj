<template>
  <div class="w1100">
    <el-form ref="form" :model="formData" label-width="80px" label-position="left" size="small">
      <h4>
        <span style="color:red">*</span>周期监控参数
      </h4>
      <el-form-item label="计算方式" style="margin-bottom:0">
        <div class="flex">
          <el-form-item class="mr10">
            <el-switch
              v-model="formData.cycleMonitorParm.autoFlag"
              active-text="手动"
              inactive-text="自动"
              :inactive-value="true"
              :active-value="false"
              active-color="#00a7e2"
              inactive-color="#00a7e2"
            ></el-switch>
          </el-form-item>
          <!-- <el-form-item> -->
          <div class="flex">
            <div style="white-space: nowrap;margin-right: 6px;margin-bottom:18px">连续</div>
            <el-form-item prop="cycleMonitorParm.weeks" :rules="notEmpty">
              <el-input-number :controls="false" :min="1" v-model="formData.cycleMonitorParm.weeks" placeholder></el-input-number>
            </el-form-item>
            <div style="white-space: nowrap;margin:0 6px;margin-bottom:18px">周，订单增长率高于</div>
            <el-form-item prop="cycleMonitorParm.jumpLv" :rules="notEmpty">
              <el-input-number :controls="false" :min="0.01" v-model="formData.cycleMonitorParm.jumpLv" placeholder></el-input-number>%
            </el-form-item>
          </div>
          <!-- </el-form-item> -->
        </div>
      </el-form-item>
      <el-form-item label="日均销量=" prop="cycleMonitorParm.avgSaleDays" :rules="notEmpty">
        <div class="flex">
          <div>近</div>
          <el-input-number
            style="margin:0 6px"
            :controls="false"
            :min="1"
            v-model="formData.cycleMonitorParm.avgSaleDays"
            placeholder
          ></el-input-number>
          <div>天订单</div>
        </div>
      </el-form-item>
      <h4>
        <span style="color:red">*</span>缺货监控参数
      </h4>

      <el-form-item
        label="运输方式"
        label-width="60px"
        v-for="(item, index) in formData.shortageMonitorParm"
        :key="index"
        style="margin-bottom:0"
      >
        <div class="flex">
          <el-form-item :prop="`shortageMonitorParm.${index}.transportId`" :rules="notEmpty">
            <el-select class="mr10" style="width:130px" v-model="item.transportId" placeholder="运输方式">
              <el-option
                v-for="i in transportList"
                :label="i.label"
                :disabled="item.transportId != i.value && i.disabled"
                :value="i.value"
                :key="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="保底可售天数"
            label-width="95px"
            :prop="`shortageMonitorParm.${index}.insuredDays`"
            :rules="notEmpty"
          >
            <el-input-number class="mr10" :controls="false" v-model="item.insuredDays" :min="1" :max="99999999999"></el-input-number>
          </el-form-item>
          <el-form-item
            label="备货天数"
            label-width="75px"
            :prop="`shortageMonitorParm.${index}.stockDays`"
            :rules="notEmpty"
          >
            <el-input-number class="mr10" :controls="false" v-model="item.stockDays" :min="1" :max="99999999999"></el-input-number>
          </el-form-item>
          <el-form-item
            label="运输天数"
            label-width="75px"
            :prop="`shortageMonitorParm.${index}.transportDays`"
            :rules="notEmpty"
          >
            <el-input-number class="mr10" :controls="false" v-model="item.transportDays" :min="1" :max="99999999999"></el-input-number>
          </el-form-item>
          <el-form-item
            label="固定补货天数"
            label-width="95px"
            :prop="`shortageMonitorParm.${index}.fixedDays`"
            :rules="notEmpty"
          >
            <el-input-number class="mr10" :controls="false" v-model="item.fixedDays" :min="1" :max="99999999999"></el-input-number>
          </el-form-item>
          <el-form-item v-if="!(index == 0 && formData.shortageMonitorParm.length == 1)">
            <el-button
              icon="el-icon-delete"
              class="danger"
              type="text"
              @click="formData.shortageMonitorParm.splice(index, 1)"
            ></el-button>
          </el-form-item>
        </div>
        <el-button
          @click="formData.shortageMonitorParm.push({})"
          v-if="index == formData.shortageMonitorParm.length-1"
          icon="el-icon-plus"
          class="rect-btn"
        ></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['cycleType'],
  data() {
    return {
      notEmpty: [
        {
          required: true,
          message: '不能为空'
        }
      ],
      formData: {
        cycleMonitorParm: {},
        shortageMonitorParm: [{}]
      }
    }
  },
  created() {
    this.$store.dispatch('fba/getTransportList')
    this.getInfo()
  },
  computed: {
    transportList() {
      const hasSel = this.formData.shortageMonitorParm.map(e => e.transportId)
      return this.$store.state.fba.transportList.map(e => ({
        ...e,
        disabled: hasSel.indexOf(e.value) > -1
      }))
    }
  },
  methods: {
    getInfo() {
      this.$api[`fba/FbaReplenishInfoCalculateView`]({
        cycleType: this.cycleType
      }).then(data => {
        data = data.data
        if (!data.shortageMonitorParm || data.shortageMonitorParm.length == 0) {
          data.shortageMonitorParm = [{}]
        }
        // this.formData = data
        Object.assign(this.formData, data)
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = { ...this.formData, cycleType: this.cycleType }
        return this.$api[`fba/FbaReplenishInfoCalculateEdit`](params)
      })
    }
  }
}
</script>