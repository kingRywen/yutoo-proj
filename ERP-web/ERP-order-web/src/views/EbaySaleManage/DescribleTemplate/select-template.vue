<template>
  <div class="select-template">
    <el-row :gutter="10" class="temp-list">
      <el-col :span="6" class="temp-item" v-for="(item,index) in list" :key="item.id">
        <div class="temp-img" :style="{backgroundImage: 'url('+item.image +')' }" @click="selectTemp(index)"></div>
        <el-radio v-model="radio" :label="index">{{item.name}}</el-radio>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: '1',
      list: [
        {
          image: 'https://img.mukewang.com/5cbfc68c0001bbc418720632.jpg',
          tempID: 1,
          name: '空模板'
        },
        {
          image: 'https://img.mukewang.com/5cbfc68c0001bbc418720632.jpg',
          tempID: 2,
          name: '模板一'
        },
        {
          image: 'https://img.mukewang.com/5cbfc68c0001bbc418720632.jpg',
          tempID: 3,
          name: '模板二'
        }
      ]
    }
  },
  methods: {
    selectTemp(index) {
      this.radio = index
    },
    submitForm(cb) {
      cb && cb(this.radio)
    }
  }
}
</script>
<style lang="scss">
.select-template {
  .temp-item {
    text-align: center;
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
    .temp-img {
      height: 240px;
      width: 180px;
      border: 1px solid #ccc;
      border-radius: 3px;
      margin-bottom: 15px;
      background-repeat: no-repeat;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      overflow: hidden;
      transition: all 0.2s;
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.31);
        transform: translate3d(0, -3px, 0);
      }
    }
  }
}
</style>

