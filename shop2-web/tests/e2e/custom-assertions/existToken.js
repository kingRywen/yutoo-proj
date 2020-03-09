
/**
 * 断言是否存在token
 */
exports.assertion = function existToken(definition, storageName = 'localStorage') {
  // const storageMap = {
  //   LOCAL_STORAGE: 'localStorage',
  //   SESSION_STORAGE: 'sessionStorage',
  // }
  this.formatMessage = function () {
    const message = `Testing if ${storageName}:%s is ${this.negate ? 'not exist' : 'exist'}`
    return {
      message,
      args: [`<${definition}>`]
    }
  }

  this.expected = function () {
    return this.negate ? 'not exist' : 'exist'
  }
  this.pass = value => value != null && value !== ''
  this.value = res => res.value
  
  this.command = function (cb) {
    return this.api.execute(function (itemName, storageName) {
      return window[storageName].getItem(itemName)
    }, [definition, storageName], cb)
  }

}

