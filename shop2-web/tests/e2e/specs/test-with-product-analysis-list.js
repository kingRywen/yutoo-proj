module.exports = {
  beforeEach: (browser) => browser.init(),

  '添加任务': (browser) => {
    let login = browser.login()
    let list = browser.page.productProductAnalysis().section.list
    
      // .page.productProductAnalysis().navigate()

  }
}