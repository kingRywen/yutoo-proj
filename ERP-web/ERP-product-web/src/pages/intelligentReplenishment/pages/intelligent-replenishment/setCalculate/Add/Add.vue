<template>
  <div>
    <IRLayout>
      <!--   -->
      <template slot="header">
        <div class="title" @click="back">
          <i class="el-icon-arrow-left"></i> 添加公式</div>

      </template>
      <template slot="table" border>
        <BasicForm />
      </template>

    </IRLayout>

  </div>
</template>

<script>
import BasicForm from "./components/BasicForm";

export default {
  name: "Add",
  components: {
    BasicForm
  },
  methods: {
    back() {
      this.$router.push("/IntelligentReplenishment/setCalculate");
    }
  }
};
</script>
