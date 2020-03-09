<template>
  <div class="accreditWarp">
    <el-collapse accordion v-model="activeName1" style="width:99%">
      <el-collapse-item title="Step 1 : 选择商城" name="1" class="collapse1">
        <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
        <p>
          注意：
          <span class="red">只有专业卖家 ( Pro Merchant )可以使用MWS的服务! 如果该账号已经授权了某一个账号，不要再授权另一账号,防止引起关联或数据错乱。</span>
        </p>
        <p>
          1.选择的商城是：
          <el-select :popper-append-to-body="false" v-model="accreditObj.name" disabled size="mini">
            <el-option :label="accreditObj.name" :value="accreditObj.name"></el-option>
          </el-select>
        </p>
        <p>2.点击下列连结并且登入login</p>
        <a
          target="_blank"
          href="https://sellercentral.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1"
        >https://sellercentral.amazon.com/gp/mws/registration/register.html</a>
      </el-collapse-item>
      <el-collapse-item title="Step 2 : MWS Access" name="2" class="collapse2">
        <p>1.选择 ' 我希望使用某个应用程序通过 MWS 访问我的亚马逊卖家账户 '.</p>
        <p>2.输入下列资讯</p>
        <ul class="hiti">
          <li>
            应用程序名称：
            <span class="red blod">{{info.applicationName}}</span>
          </li>
          <li>
            应用程序开发商账号：
            <span class="red blod">{{info.developerId}}</span>
          </li>
          <li>
            应用程序版本：
            <span class="red blod">{{info.applicationVersion}}</span>
          </li>
        </ul>
        <p>3.点击 下一页</p>
        <p>4.接受许可协议，然后点击 下一页</p>
        <div class>
          <img src="./yamx.png" width="784" height="543" alt />
        </div>
      </el-collapse-item>
      <el-collapse-item title="Step 3: 复制 Seller ID" name="3">
        <div class>
          <img src="./yamxzh.png" width="808" height="577" alt />
        </div>
      </el-collapse-item>
      <el-collapse-item title="Step 4: 输入 Seller ID" name="4">
        <!-- <h6 class="blod">{{accreditObj.name}}</h6> -->
        <img src="./yamx3.png" alt />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName1: '1',
      accreditObj: {
        name: 'Amazon'
      },
      info: {}
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.$api[`shopAuth/configDeveloperMwsInfo`]({}).then(data => {
        this.info = data.data
      })
    }
  }
}
</script>
<style lang="scss">
.accreditWarp {
  height: 520px;
  overflow-y: auto;
  .hiti {
    list-style: circle;
    padding-left: 40px;
    font-weight: bold;
    li {
      font-weight: bold;
    }
  }
  .el-collapse-item__header {
    color: #0079c6 !important;
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 48px;
    cursor: pointer;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;
  }
  .el-collapse-item {
    background: #f5f5f5;
  }
  .el-form-item {
    display: flex;
    flex-direction: row;
  }
  .el-form-item__content {
    margin-left: 0 !important;
    .el-input {
      width: 400px;
    }
  }

  p {
    line-height: 30px;
    word-wrap: break-word;
  }
  .red {
    color: red;
  }
  .blod {
    font-weight: 800;
  }
  .collapse1 {
    a {
      color: #0079c6;
      margin-left: 50px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>