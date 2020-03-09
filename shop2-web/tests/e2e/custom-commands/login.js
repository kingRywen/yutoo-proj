module.exports = {
  command: async function() {
    const login = this.page.login();
    // 是否加载页面成功
    login
      .waitForElementVisible(".user-login")
      .assert.titleContains("店铺")
      .assert.visible(".slogan")
      .clearValue("@userInput")
      .clearValue("@pwdInput")
      // 输入账号
      .setValue("@userInput", "admin")
      // 输入密码
      .setValue("@pwdInput", "1")
      // 给10秒时间输入验证码
      .pause(10000)
      // 点登录按钮
      .click("@submitBtn")
      // 出现导航栏，说明登录成功
      .waitForElementVisible(".navbar")
      // 验证token
      .assert.existToken("SHOP2_token");
  }
};
