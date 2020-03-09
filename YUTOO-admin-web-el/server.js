const jsonServer = require('json-server')
const server = jsonServer.create()
const Mock = require('mockjs')
const middlewares = jsonServer.defaults()

server.use(middlewares)
// server.use(router)

server.post('/sys/login', (req, res) => {
  res.send(Mock.mock({
    rows: [{
      code: 0
    }]
  }))
})

// server.get('/sys/user/info', (req, res) => {
//   res.send({
//     code: 0
//   })
// })

server.post('/sys/area/list', (req, res) => {
  res.send({
    rows: [
      {
        areaId: 222,
        areaCode: 22,
        name:'北京市',
        layer: 2,
        orderNum: 1,
      }
    ]
  })
})

server.post('/sys/area/add', (req, res) => {
  res.send({
    "code|1": [0,1],
    "msg": 'error'
  })
})

server.listen(8080, () => {
  console.log('JSON Server is running')
})