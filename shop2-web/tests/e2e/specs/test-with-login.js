module.exports = {
  beforeEach: (browser) => browser.init(),

  '登录': (browser) => {
    // console.log(browser);
    
    browser.login()
      // 出现导航栏，说明登录成功
      .waitForElementVisible('.navbar')
      // 验证token
      .assert.existToken('SHOP2_token')
      // 再导航到登录页
      .page.login()
      // 存在token的情况下会重定向到主页
      .assert.urlContains('/#/dash')
      .end()
  }
}