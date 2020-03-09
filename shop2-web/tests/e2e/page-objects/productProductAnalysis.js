/**
 * A Nightwatch page object. The page object name is the filename.
 *
 * Example usage:
 *   browser.page.homepage.navigate()
 *
 * For more information on working with page objects see:
 *   https://nightwatchjs.org/guide/working-with-page-objects/
 *
 */

module.exports = {
  url: "/#/product/productAnalysis",

  sections: {
    list: {
      elements: {
        addTask: {
          selector:
            '//*[@id="app"]/div/div/div/div[1]/div/section/div/div/div[1]/div[1]/div/div[2]/div[1]/button',
          locateStrategy: "xpath"
        }
      }
    },
    addDialog: {
      asinTextarea: {
        selector:
          '//*[@id="app"]/div/div/div/div[1]/div/section/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div/div/div/div[1]/div[1]/div/form/div/div/div/textarea',
        locateStrategy: "xpath"
      }
    }
  }
};
