<template>
  <div>
    <section>
      <h2>基本信息</h2>
      <Two
        ref="form2"
        :review="true"
        :parentFlag="parentFlag"
        :productType="productType"
        :productId="productId"
        :data="data.two"
        :platformId="platformId"
        :productPltDetailId="productPltDetailId"
      />
    </section>
    <section>
      <h2>产品属性</h2>
      <Three
        :data="data.three"
        :review="true"
        :productType="productType"
        :productId="productId"
        :parentFlag="parentFlag"
        ref="form3"
        :platformId="platformId"
        :productPltDetailId="productPltDetailId"
      />
    </section>
    <section>
      <h2>描述信息</h2>
      <Four
        :data="data.four"
        :review="true"
        :productType="productType"
        :productId="productId"
        :parentFlag="parentFlag"
        ref="form4"
        :platformId="platformId"
        :productPltDetailId="productPltDetailId"
      />
    </section>
    <section>
      <h2>业务政策</h2>
      <Five
        :data="data"
        :review="true"
        :parentFlag="parentFlag"
        :productType="productType"
        :productId="productId"
        ref="form5"
        :platformId="platformId"
        :productPltDetailId="productPltDetailId"
      />
    </section>
  </div>
</template>

<script>
import One from './One'
import Two from './Two'
import Three from './Three'
import Four from './Four'
import Five from './Five'

export default {
  props: {
    data: {
      default: () => ({})
    },
    // 是否审核状态
    review: {
      default: false
    },
    // 母变体
    parentFlag: Number,
    // 平台id
    productPltDetailId: Number,
    platformId: Number,
    productType: Number,
    productId: Number
  },
  components: {
    One,
    Two,
    Three,
    Four,
    Five
  },
  methods: {
    validate() {
      return Promise.resolve()
    }
  }
}
</script>

<style scoped>
h2 {
  border-bottom: 2px solid #e4e7ed;
  line-height: 3;
  margin-bottom: 30px;
  font-weight: bold;
  color: #333;
  font-size: 22px;
}
section {
  margin-bottom: 40px;
}
</style>
