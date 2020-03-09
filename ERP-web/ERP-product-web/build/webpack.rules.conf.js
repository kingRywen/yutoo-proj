const extractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path')
const lessLoader = {
  loader: 'less-loader',
  options: {
    sourceMap: true,
    javascriptEnabled: true,
    modifyVars: require('./vue-beauty-override.json')
  }
}
// console.log(process.env.NODE_ENV === "development");
const rules = [{
    test: /\.(css|scss|sass)$/,
    // 不分离的写法
    // use: ["style-loader", "css-loader",sass-loader"]
    // 使用postcss不分离的写法
    // use: ["style-loader", "css-loader", "sass-loader","postcss-loader"]
    // 此处为分离css的写法
    /*use: extractTextPlugin.extract({
    fallback: "style-loader",
    use: ["css-loader", "sass-loader"],
    	// css中的基础路径
    publicPath: "../"
    })*/
    // 区别开发环境和生成环境
    use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader?sourceMap", "postcss-loader"] : extractTextPlugin.extract({
      fallback: "style-loader",
      use: ["css-loader", "sass-loader", "postcss-loader"],
      // css中的基础路径
      // publicPath: "../"

    })
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',

  },
  {
    test: /\.js$/,
    use: [{
      loader: "babel-loader"
    }],
    include: path.resolve(__dirname, '../src')
    // 不检查node_modules下的js文件
    // exclude: "/node_modules/"
  }, {
    test: /\.(png|jpg|jpeg|gif)$/,
    exclude: /favicon\.png$/,
    use: [{
      // 需要下载file-loader和url-loader
      loader: "url-loader",
      options: {
        limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
        // 图片文件输出的文件夹
        outputPath: "assets/img"
      }
    }]
  },
  {
    test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.*)?$/,
    
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'assets/fonts'
    }
  },
  // {
  //   test: /\.html$/,
  //   // html中的img标签
  //   use: {
  //     loader: 'html-loader?config=raw-loader',
  //     options: {
  //       attrs: ['img:src']
  //     }
  //   }
  // }, 
  {
    test: /\.less$/,
    // 三个loader的顺序不能变
    // 不分离的写法
    // use: ["style-loader", "css-loader", "less-loader"]
    // 区别开发环境和生成环境
    use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader?sourceMap", lessLoader] : ["style-loader", "css-loader", lessLoader]
    // extractTextPlugin.extract({
    //   fallback: "style-loader",
    //   use: ["css-loader", lessLoader],
    //   // css中的基础路径
    //   // publicPath: "../"

    // })
  }
];
module.exports = rules;