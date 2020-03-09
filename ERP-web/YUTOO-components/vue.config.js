var slugify = require('transliteration').slugify
var striptags = require('./build/strip-tags')
var md = require('markdown-it')()
const fs = require('fs')
const path = require('path')
var components = fs
  .readdirSync(path.resolve(__dirname, './src/components'))
  .filter(el => el.indexOf('.js') === -1)
var prod = process.env.NODE_ENV === 'production'

var entries = {}

components.map(dirname => {
  entries[dirname] = `./src/components/${dirname}/index.js`
})

const output = {
  libraryExport: 'default'
}

var configureWebpack = {
  externals: process.env.NODE_ENV === 'test'
    ? {}
    : {
      vue: 'Vue',
      UE: 'UE',
      'element-ui': 'ELEMENT',
      axios: 'axios'
    },
  output
}

function convert(str) {
  str = str.replace(/(&#x)(\w{4});/gi, function($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16))
  })
  return str
}
module.exports = {
  configureWebpack,
  chainWebpack: config => {
    if (!prod) {
      var wrap = function(render) {
        return function() {
          return render.apply(this, arguments)
            .replace('<code v-pre class="', '<code class="hljs ')
            .replace('<code>', '<code class="hljs">')
        }
      }
      const vueMarkdown = {
        raw: true,
        use: [
          [require('markdown-it-anchor'), {
            level: 2,
            slugify: slugify,
            permalink: true,
            permalinkBefore: true
          }],
          [require('markdown-it-container'), 'demo', {
            validate: function(params) {
              return params.trim().match(/^demo\s*(.*)$/)
            },

            render: function(tokens, idx) {
              var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
              if (tokens[idx].nesting === 1) {
                var description = (m && m.length > 1) ? m[1] : ''
                var content = tokens[idx + 1].content
                var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1')
                var script = striptags.fetch(content, 'script')
                var style = striptags.fetch(content, 'style')
                var jsfiddle = {
                  html: html,
                  script: script,
                  style: style
                }
                var descriptionHTML = description
                  ? md.render(description)
                  : ''

                jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle))

                return `<demo-block class="demo-box" :jsfiddle="${jsfiddle}">
                          <div class="source" slot="source">${html}</div>
                          ${descriptionHTML}
                          <div class="highlight" slot="highlight">`
              }
              return '</div></demo-block>\n'
            }
          }],
          [require('markdown-it-container'), 'tip'],
          [require('markdown-it-container'), 'warning']
        ],
        preprocess: function(MarkdownIt, source) {
          MarkdownIt.renderer.rules.table_open = function() {
            return '<table class="table">'
          }
          MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence)
          return source
        }
      }
      config.module
        .rule('md')
        .test(/\.md/)
        .use('vue-loader')
        .loader('vue-loader')
        .end()
        .use('vue-markdown-loader')
        .loader('vue-markdown-loader/lib/markdown-compiler')
        .options(vueMarkdown)
    }
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
  }
}
