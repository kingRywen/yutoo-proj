// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import './style/element-variables.scss'
import './style/common.scss'
import App from './App'
import router from './router'
import commonPlugin from './plugins/common'
import chart from 'echarts'
import XLSX from 'xlsx';
import {
  removeStore,
  trimAll
} from './plugins/utils'
import store from './store'
import VueLazyload from 'vue-lazyload'
import clipboard from 'clipboard' // 引入复制插件 
// Vue.use(Clipboard)

import request from './api/axios.js'
import {
  baseURL
} from './api/axios.js'
import {
  allPoint,
  MerchantOrderSave
} from './api/myApi.js'
// 引入vue-echarts

GLOBAL.vbus = new Vue()
// 引入echarts全部组件
Vue.use(chart)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2
})

Vue.prototype.$axios = request
Vue.prototype.trimAll = trimAll
// Vue.prototype.$echarts = echarts

// import plugin from './api/functions' // 引入公共方法并使用
// Vue.use(plugin)
// import querystring from 'querystring'
// const __ROOT__ = 'http://192.168.0.118:8080'
// const __ROOT__ = 'http://127.0.0.1:8080'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(commonPlugin)

Vue.prototype.$setCookie = (cname, cvalue, exdays) => {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  console.info(cname + '=' + cvalue + '; ' + expires)
  document.cookie = cname + '=' + cvalue + '; ' + expires
  console.info(document.cookie)
}

Vue.prototype._store = store

Vue.prototype.$unescape = window.unescape
router.beforeEach((to, from, next) => {
  sessionStorage.setItem('path', to.fullPath)
  next()
})

// 全局混入方法
Vue.mixin({
  data() {
    return {
      onlyOneYear: {
        disabledDate: function (time) {
          return time.getTime() > Date.now();
        },
        // 前后限制一年
        onPick(date) {
          // 当前时间
          let date_min = date.minDate;
          let date_max = date.maxDate;
          // console.log(date_min);
          if (date_max === null) {
            this.disabledDate = function (time) {
              let curDate = date_min.getTime();
              let one_year = 365 * 24 * 3600 * 1000;
              // 上一年
              let curr_year = curDate - one_year;
              // 下一年
              let next_year = curDate + one_year;
              let small;
              if (next_year > Date.now()) {
                // 如果下一年，比现在的时间大，则选择现在的时间禁用
                small = Date.now()
              } else {
                // 如果下一年都比当前时间少，则选择下一年为禁用
                small = next_year
              }
              return time.getTime() < curr_year || time.getTime() > small;
            }
          } else {
            // 两个值都有的时候，表示重新打开时间框或者选好了。重置一下
            this.disabledDate = function (time) {
              return time.getTime() > Date.now();
            }
          }
        },
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '7天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '30天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      onlyOneYear_ForOneSelect: {
        disabledDate: function (time) {
          return time.getTime() > Date.now();
        },
        // 前后限制一年
        onPick(date) {
          // 当前时间
          let date_min = date.minDate;
          let date_max = date.maxDate;
          // console.log(date_min);
          if (date_max === null) {
            this.disabledDate = function (time) {
              let curDate = date_min.getTime();
              let one_year = 365 * 24 * 3600 * 1000;
              // 上一年
              let curr_year = curDate - one_year;
              // 下一年
              let next_year = curDate + one_year;
              let small;
              if (next_year > Date.now()) {
                // 如果下一年，比现在的时间大，则选择现在的时间禁用
                small = Date.now()
              } else {
                // 如果下一年都比当前时间少，则选择下一年为禁用
                small = next_year
              }
              return time.getTime() < curr_year || time.getTime() > small;
            }
          } else {
            // 两个值都有的时候，表示重新打开时间框或者选好了。重置一下
            this.disabledDate = function (time) {
              return time.getTime() > Date.now();
            }
          }
        }
      },
    }
  },
  filters: {
    FBA_Filter(val) {
      let platformId = store.state.common.savePlatformIdAndSiteId.split(
        ','
      )[0]
      if (val !== 'FBA') {
        return val
      } else {
        if (parseInt(platformId) === 1) {
          return val
        } else {
          return '平台发货'
        }
      }
    },
    FBA_Filter_Intable(val) {
      let platformId = store.state.common.savePlatformIdAndSiteId.split(
        ','
      )[0]
      if (val === '' || val === null) {
        return '-'
      } else if (val === 0) {
        // 自发货都一样
        return '自发货'
      } else if (val === 1) {
        // FBA/平台发货
        if (parseInt(platformId) === 1) {
          return 'FBA'
        } else {
          return '平台发货'
        }
      } else {
        // FBA+自发货  or  平台发货+自发货
        if (parseInt(platformId) === 1) {
          return '自发货+FBA'
        } else {
          return '自发货+平台发货'
        }
      }
    },
    // 转化成100%并保留两位小数
    KeepTwoDecimal(val) {
      if (val === '' || val === null) {
        return '-'
      } else {
        let num = val * 10000 / 100
        if (/^\d+\.\d+$/.test(num)) {
          num = num.toFixed(2) + '%';
        } else {
          num = num + '%';
        }
        return num
      }
    },
    _formatData_cate(val) {
      if (val == null || val === -1 || val === '') {
        return '-'
      } else {
        if (val.indexOf(':') !== -1) {
          let arr = val.split(':')
          // console.log(arr);
          val = arr[0] + '...' + arr[arr.length - 1]
          return val
        } else {
          return val
        }
      }
    },
    _formatData(val) {
      return val == null || val === -1 || val === '' ? '-' : val
    },
    _formatData2(val) {
      return val == null || val === -1 || val === '' ? '' : val
    },

    // 过滤html转义标签
    filterHtml(msg) {
      msg = msg.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>')
      msg = msg.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
      msg = msg.replace(/[|]*\n/, '') // 去除行尾空格
      msg = msg.replace(/&nbsp;/ig, '') // 去掉npsp
      return msg
    }
  },
  methods: {
    // 竞品导出公用
    download(json, type, name) {
      var tmpDown //导出的二进制对象
      function s2ab(s) {
        // 字符串转字符流
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      function getCharCol(n) {
        let temCol = '',
          s = '',
          m = 0
        while (n > 0) {
          m = n % 26 + 1
          s = String.fromCharCode(m + 64) + s
          n = (n - m) / 26
        }
        return s
      }
      var tmpdata = json[0]
      json.unshift({})
      var keyMap = [] //获取keys
      keyMap = Object.keys(json[0])
      for (var k in tmpdata) {
        keyMap.push(k)
        json[0][k] = k
      }
      var tmpdata = [] //用来保存转换好的json
      json
        .map((v, i) =>
          keyMap.map((k, j) =>
            Object.assign({}, {
              v: v[k],
              position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) +
                (i + 1)
            })
          )
        )
        .reduce((prev, next) => prev.concat(next))
        .forEach(
          (v, i) =>
            (tmpdata[v.position] = {
              v: v.v
            })
        )
      var outputPos = Object.keys(tmpdata) //设置区域,比如表格从A1到D10
      var tmpWB = {
        SheetNames: [name], // 保存的表标题
        Sheets: {
          key: Object.assign({},
            tmpdata, // 内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
            }
          )
        }
      }
      // 替换key值
      var key = name
      tmpWB.Sheets = {
        key: Object.assign({},
          tmpdata, // 内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
          }
        )
      }
      // 复制原来的值
      tmpWB.Sheets[key] = tmpWB.Sheets['key']
      // 删除原来的键
      delete tmpWB.Sheets['key']
      // 替换key值end
      tmpDown = new Blob(
        [
          s2ab(
            XLSX.write(
              tmpWB, {
                bookType: type == undefined ? 'xlsx' : type,
                bookSST: false,
                type: 'binary'
              } // 这里的数据是用来定义导出的格式类型
            )
          )
        ], {
          type: ''
        }
      ) //创建二进制对象写入转换好的字节流
      var href = URL.createObjectURL(tmpDown) //创建对象超链接
      document.getElementById('hf').href = href //绑定a标签
      document.getElementById('hf').click() //模拟点击实现下载
      setTimeout(function () {
        // 延时释放
        URL.revokeObjectURL(tmpDown) //用URL.revokeObjectURL()来释放这个object URL
      }, 100)
    },
    // toBeijingTime2(daycount) {
    //   //获得北京时间
    //   //获得当前运行环境时间
    //   var d = new Date(), currentDate = new Date(), tmpHours = currentDate.getHours();
    //   //算得时区
    //   var time_zone = -d.getTimezoneOffset() / 60;
    //   //少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
    //   if (time_zone < 0) {
    //     time_zone = Math.abs(time_zone) + 8; currentDate.setHours(tmpHours + time_zone);
    //   } else {
    //     //大于0的是东区  东区时间直接跟京八区相减
    //     time_zone -= 8; currentDate.setHours(tmpHours - time_zone);
    //   }
    //   console.log(currentDate)
    //   var date1 = currentDate;
    //   let today = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
    //   let date2 = new Date(date1);
    //   date2.setDate(date1.getDate() - daycount);
    //   var computedDay = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    //   return [
    //     computedDay,
    //     today]
    // },
    refresh() {
      this.cap = baseURL + '/sys/valicode?t=' + Date.now()
    },
    getPhoneCode(messageType) {
      this.$refs['ruleForm'].validateField('username', cbVal1 => {
        if (cbVal1 === '') {
          this.$refs['ruleForm'].validateField('captcha', cbVal2 => {
            if (cbVal2 === '') {
              //  调用请求手机验证码的函数
              this.getCodeFun(messageType)
            }
          })
        }
      })
    },
    // 请求验证码接口
    getCodeFun(messageType) {
      // console.log(2222);
      this.$axios
        .post('/sys/sendMsg', {
          username: this.ruleForm.username,
          captcha: this.ruleForm.captcha,
          messageType: messageType
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '手机验证码发送成功！'
            })
            this.toggleCodeStatus = false
            let timer = setInterval(() => {
              this.waitPhoneCodeTimt = --this.waitPhoneCodeTimt
              if (this.waitPhoneCodeTimt === 0) {
                clearInterval(timer)
                this.toggleCodeStatus = true
                this.waitPhoneCodeTimt = 60
              }
            }, 1000)
          } else {
            this.refresh()
            this.ruleForm.captcha = ''
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('获取验证码失败', err)
        })
    },
    submitForm(formName, url, messageType) {
      console.log(formName)
      this.$refs[formName].validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          this.register(url, messageType)
        } else {
          // console.log(this.ruleForm, "条件缺失");
          console.log(this.ruleForm)
          return false
        }
      })
    },
    // 弹出注册协议
    showRegAgreementPage() {
      this.$message.error('暂无')
    },
    // 跳转到登陆
    // toLogin() {
    //   this.$router.push("/login");
    // },
    register(url, messageType) {
      // const formData = this.ruleForm;
      // let data = new FormData();
      // data.append("username", formData.username);
      // data.append("password", formData.password);
      // data.append("confirmPassword", formData.confirmPassword);
      // data.append("captcha", formData.captcha);
      // data.append("phoneCode", formData.phoneCode);
      // data.append("flag", formData.flag);
      // console.log(formData);
      let data = {
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        captcha: this.ruleForm.captcha,
        code: this.ruleForm.code
      }
      if (this.ruleForm.flag != '') {
        data.flag = this.ruleForm.flag
      }
      axios({
        method: 'post',
        timeout: 10000000000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data,
        // url: `${baseURL}/sys/register?username=${formData.username}&password=${
        //   formData.password
        // }&captcha=${formData.captcha}&confirmPassword=${
        //   formData.confirmPassword
        // }&phoneCode=${formData.phoneCode}&flag=${formData.flag}`
        url: baseURL + url
      })
        .then(res => {
          this.loading = false
          console.log(res)
          if (res.data.code == 0) {
            if (messageType === 1) {
              this.$message({
                type: 'success',
                message: '找回成功'
              })
            } else {
              this.$message({
                type: 'success',
                message: '注册成功'
              })
            }
            localStorage.setItem('market_toke', res.data.token)
            this.$store.commit('common/setLoginData', this.ruleForm.username)
            localStorage.setItem('userName', this.ruleForm.username)
            sessionStorage.setItem('platformId', '1,1')
            this.$router.push('/admin')
          }
          if (res.data.code !== 0) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('error submit!!', err)
        })
    },
    goIndex() {

      // this.$router.push("/index");
    },
    goLogin() {
      this.$router.push('/login')
    },
    goReg() {
      this.$router.push('/register')
    },
    goFind() {
      this.$router.push('/findpass')
    },
    goBuyMenu() {
      store.commit('common/savePlatformIdAndSiteId', '-2,1')
      this.$router.push('/admin/rechargePage?pageId=1')
    },
    toRechargePage() {
      this.$router.push('/admin/rechargePage?pageId=1')
    },
    // 格式华表格数据显示
    _formatter(row, column) {
      if (row[column.property] == null || row[column.property] === '' || row[column.property] === -1) {
        return '-'
      } else {
        return row[column.property]
      }
    },
    LogOut() {
      // console.log('退出')
      this.$axios.post('/sys/logout').then(res => {
        // this.$message({
        //   type: "success",
        //   message: res.data.msg
        // })
        // if (res.data.code == 0) {
        localStorage.removeItem('market_toke')
        sessionStorage.removeItem('path')
        sessionStorage.removeItem('platformId')
        router.push('/login')
        // } else {
        //   this.$message({
        //     type: 'warning',
        //     message: '退出不成功，请您稍后重试'
        //   })
        // }
      })
      // 清除token和store
      // store.commit('tab/clean')
    },
    PersonalCenter() {
      router.push('/admin/personalCenter?pageId=2')
      store.commit('common/savePlatformIdAndSiteId', '-2,1')
    },
    delete(sureFun, text, title, conType, cancelMsg, cancelFun) {
      this.$confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: conType,
        type: 'warning'
      }).then(() => {
        sureFun
      }).catch(() => {
        this.$message({
          type: 'info',
          message: cancelMsg
        })
        cancelFun
      })
    },
    // 请求点数
    reloadPointApi() {
      this.$axios.post(allPoint + '?time=' + Date.now()).then(res => {
        // console.log(res, "扣点")
        let code = res.data.code
        if (code == 0) {
          let point = parseInt(res.data.msg)
          store.commit('point/getPointe', point)
        }
      })
    },
    // 店铺分析，tab1 chart789通用函数
    showDialog() {
      this.$store.commit('competitive/saveChartDate', this.DateMsg.DateValue)
      // console.log(this.DateMsg.DateValue)
      this.dialog.dialogShow = true
      this.dialog.setToVuex.date = this.DateMsg.DateValue
      // 当弹窗打开的那一刹那，保存一下数据。当用户点击新品或者非新品的数字时，备用于跳转到相关的页面时作为请求参数。
      this.$store.commit(
        'competitive/saveTaskStatusAndType',
        this.dialog.setToVuex
      )

      // console.log(this.dialog.setToVuex, 212121);
    },
    // 生成订单
    makeOrder(packageId) {
      return this.$axios
        .post(MerchantOrderSave, {
          packageId: packageId
        })
        .then(res => {
          let code = res.data.code
          if (code == 0) {
            console.log('点击购买', res)
            this.Loaidng = false
            return res.data.data
          }
          if (code != 0) {
            this.Loaidng = false
            this.$message('服务器出错，请重试')
            return -1
          }
        })
        .catch(err => {
          this.Loaidng = false
          //   this.$message("服务器出错，返回上一级重试");
          console.log(err)
        })
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
    // 处理类目太长
    handCate() {
      let el = document.getElementsByClassName('el-cascader-menus')[0]
      // let windowInnerWidth = window.innerWidth / 2 + 50 + "px";
      let windowInnerWidth = window.innerWidth / 2 - 200 + 'px'
      el.style.maxWidth = windowInnerWidth
      el.style.overflow = 'auto'
      this.$nextTick(() => {
        el.scrollLeft = 1000000
      }, 10)
      // console.log(el.scrollLeft, "el.scrollLeft");
    },
    // 店铺echart图relize   dom:echart的div  parentDom：父元素   cutWidth减去的宽度   cutWidthX 保存为图片的位置
    echartsRelize(_this, dom, parentDom, cutWidth, cutWidthX) {
      console.log(arguments)
      dom.style.width = parentDom.innerWidth - cutWidth + 'px'
      _this.tool.x = parentDom.innerWidth - cutWidthX
      _this.tool.x4 = parentDom.innerWidth - cutWidthX - 100
      // this.siteLine = echarts.init(dom);
      // setInterval(this.lineInit, 2000);
      // let that = this;
      _this.tool.chart7_x = parentDom.innerWidth - cutWidthX - 100
      _this.tool.chart8_x = parentDom.innerWidth - cutWidthX - 100
      // window.addEventListener("resize", function () {
      // let myChart = echarts.init(dom);
      // dom.style.width = parentDom.innerWidth - cutWidth + "px";
      // myChart.resize();
      // });
    },
    ceshi(n) {
      // this.$axios('/quartz/jobrun',)
      this.$axios({
        method: 'post',
        url: '/quartz/job/run',
        data: [n],
        headers: {
          token: localStorage.getItem('market_toke')
        }
      })
    }
  }
})
/* eslint-disable no-new */
export const vm = new Vue({
  el: '#app',
  router,
  store,
  clipboard, // 导出插件功能

  components: {
    App
  },
  template: '<App/>'
})
