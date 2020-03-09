module.exports = {
  url: '/#/login',
  elements: {
    userLogin: '.user-login',
    formItems: '.form-items',
    slogan: '.slogan',
    userInput: {
      selector: '//*[@id="app"]/div/div[2]/div/form/div/div[1]/div/div/div/div[1]/div/input',
      locateStrategy: 'xpath'
    },
    pwdInput: {
      selector: '//*[@id="app"]/div/div[2]/div/form/div/div[2]/div/div/div/div[1]/div/input',
      locateStrategy: 'xpath'
    },
    submitBtn: {
      selector: '//*[@id="app"]/div/div[2]/div/form/div/div[5]/button',
      locateStrategy: 'xpath'
    }
  }
}