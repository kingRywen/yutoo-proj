const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
}

const setQueryTime = params => {
  let daterange = params.daterange;
  if (daterange === null || daterange.length === 0) {
    return [null, null]
  } else {
    return [daterange[0], daterange[1]]
  }
}

const DataUtil = {
  getList(params) {
    let self = params.self
    let listQuery = params.listQuery
    let apiName = params.apiName

    self.listLoading = true
    self.searchLoading = true
    if( self.options && self.options.btnLoading){
        self.options.btnLoading=true
    }
    
    self.$api[apiName](listQuery).then(res => {
      let {
        rows,
        total
      } = res

      if(apiName==='categoryKeywordList'){
        self.list = rows.map(el => ({...el, indicatorEntity: el.indicatorEntity  == null ? {} : el.indicatorEntity}))
      }else{
        self.list = rows
      }
      self.total = total
      self.listLoading = false
      self.searchLoading = false
      if(self.options && self.options.btnLoading){
        self.options.btnLoading=false
      }
    }).catch(() => {
      self.listLoading = false
      self.searchLoading = false
      if( self.options && self.options.btnLoading){
        self.options.btnLoading=false
      }
    })
  },
  submitForm(params) {
    let self = params.self
    let formName = params.formName
    let dialogProperty = params.dialogProperty

    let formData = params.formData

    let apiName = params.apiName
    if(self.submitKeywordRootFormDisabled){
      self.submitKeywordRootFormDisabled=true;
    }
    if (formName === null || dialogProperty === null) {
      self.$api[apiName](formData).then(res => {
        if(self.submitKeywordRootFormDisabled){
          self.submitKeywordRootFormDisabled=false;
        }
        let {
          code
        } = res
        if (code === 0) {
          self.getList()
        }
      }).
      catch( err =>{
        if(self.submitKeywordRootFormDisabled){
          self.submitKeywordRootFormDisabled=false;
        }
      })
    } else {
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.$api[apiName](formData).then(res => {
            let {
              code
            } = res
            if (code === 0) {
              self[dialogProperty].visible = false
              self.getList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  },
  deleteRows(params) {
    /**
     * params.multipleSelection [{}]
     * params.id  null or int
     * id 为 null 要有multipleSelection
     * params.idName str
     * params.apiName str
     * 
     * 删除成功后 getList
     */
    let self = params.self
    let ids = []
    if (params.id === null) {
      params.multipleSelection.forEach(element => {
        ids.push(element[params.idName])
      });
      if (ids.length === 0) {
        self.$message.warning('至少选一项');
        return
      }
    } else {
      ids = [params.id]
    }

    let data = {};
    if(params.requestName === 'Brand'){
      if( params.id === null ){
        let brandNames = [];
        let cusCateId = null ;
        params.multipleSelection.forEach(element => {
          cusCateId = element.cusCateId;
          brandNames.push(element.brandName)
        });
        data.cusCateId = cusCateId;
        data.brandNames = brandNames;
      }else{
          data.brandNames =[ params.id ];
          data.cusCateId = params.cusCateId;
      }
     
    }else{
      data.ids=ids
    }
    self.$confirm('此操作将删除数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      self.$api[params.apiName](data).then(res => {
        let {
          code
        } = res
        if (code === 0) {
          self.handleFilter()
        }
      })
    })
  }
}

// 关键词500.其他的100以内
let checkWords = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('词不能为空'));
  }
  setTimeout(() => {
    let words = _.compact(value.split('\n'))
    words = _.uniq(words)
    words.forEach(element => {
      let flag = _.isEmpty(element.replace(/(^\s+)|(\s+$)/g, ''))
      if (flag) {
        return callback(new Error('词不能为空字符串'));
      }
      if (element.length > 500) { //500
        return callback(new Error('每个词长度不能为超过500'));
      }
    });
    callback();
  }, 500);
};
let checkAsins = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('asin不能为空'));
  }
  setTimeout(() => {
    let words = _.compact(value.split('\n'))
    words = _.uniq(words)
    words.forEach(element => {
      let flag = _.isEmpty(element.replace(/(^\s+)|(\s+$)/g, ''))
      if (flag) {
        return callback(new Error('asin不能为空字符串'));
      }
      let numReg = /^[A-Z0-9]{10}$/
        if(!numReg.test(element)){
          return callback(new Error('asin是大写字母与数字的组合长度为10'));
        }
    });
    callback();
  }, 500);
};
//其他的100以内
let checkOtherWords = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('词不能为空'));
  }
  setTimeout(() => {
    let words = _.compact(value.split('\n'))
    words = _.uniq(words)
    words.forEach(element => {
      let flag = _.isEmpty(element.replace(/(^\s+)|(\s+$)/g, ''))
      if (flag) {
        return callback(new Error('词不能为空字符串'));
      }
      if (element.length > 100) { //100
        return callback(new Error('每个词长度不能为超过100'));
      }
    });
    callback();
  }, 500);
};

export {
  DataUtil,
  setQueryTime,
  pickerOptions,
  checkWords,
  checkAsins,
  checkOtherWords
}