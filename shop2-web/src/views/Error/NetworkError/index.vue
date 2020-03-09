<template>
  <div class="empty-content">
    <div class="exception-content">
      <img src="./error.png" class="imgException" />
      <div>
        <BackContent>
          抱歉，请检查网络状态是否正常。
          <template slot="go">
            <a @click="$router.replace($route.query.back)" class="exception__return-home">点击刷新</a>
          </template>
        </BackContent>
      </div>
    </div>
  </div>
</template>

<script>
import BackContent from '../back-content'
const emptyContentTitle = '网络异常'

export default {
  name: 'EmptyContent',
  components: {
    BackContent
  },
  data() {
    return {
      title: emptyContentTitle
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
  .title {
    color: rgb(51, 51, 51);
  }
  .description {
    color: rgb(102, 102, 102);
  }
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
