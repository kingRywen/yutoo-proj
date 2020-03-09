<template>
  <div class="not-permission">
    <div class="exception-content">
      <img :src="imgSrc" class="imgException" />
      <div>
        <BackContent>
          <div>{{title}}</div>
        </BackContent>
      </div>
    </div>
  </div>
</template>

<script>
import BackContent from '../back-content'
const imgSrc =
  'https://img.alicdn.com/tfs/TB1Gy4Yjv6H8KJjy0FjXXaXepXa-780-780.png'
const notPermissionTitle = '抱歉，您没有权限'
const notPermissionDescription = '请确保自己有足够权限访问'

export default {
  name: 'NotPermission',
  components: {
    BackContent
  },
  data() {
    return {
      imgSrc,
      title: notPermissionTitle,
      description: notPermissionDescription
    }
  },
  methods: {
    backHome() {
      this.$router.replace({
        name: 'dash'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$container-height: 70vh;

.exception-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 1199px) and (min-width: 721px) {
  .exception-content {
    .imgException {
      max-width: 180px;
      margin-right: 30px;
    }
    .title {
      font-size: 20px;
      margin: 10px 0;
    }
    .description {
      font-size: 14px;
    }
  }
}
@media screen and (min-width: 1200px) {
  .exception-content {
    min-height: $container-height;

    .imgException {
      max-width: 260px;
      margin-right: 50px;
    }
    .title {
      font-size: 24px;
      margin: 20px 0;
    }
    .description {
      font-size: 16px;
    }
  }
}
</style>
