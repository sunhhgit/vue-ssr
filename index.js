const Vue = require('vue')

const inData = {
  msg: "vue-ssr !"
}

// 第⼀步，创建vue实例, 实例化的过程中插入数据 data
const app = new Vue({
  data: inData,
  template: "<div>hello {{msg}}</div>"
})

// 第⼆步，创建⼀个renderer
const renderer = require('vue-server-renderer').createRenderer()
// 第三步，将vue渲染为HTML
renderer.renderToString(app, (err, html) => {
  if (err) {
    throw err
  }
  console.log('html ===>', html)
})


const tplData = {
  testMsg: 'just a test !'
}

// template: 为整个⻚⾯的 HTML 提供⼀个模板。此模板应包含注释 <!--vue-ssroutlet-->，作为渲染应⽤程序内容的占位符。
// 在创建 renderer 实例时，可以通过 template 参数声明⼀个模板，⽤来挂载 vue 模板渲染完成之后⽣成的 HTML。
// 这⾥要注意⼀下，当创建 renderer 实例时没有声明 template 参数，那么默认渲染完就是 vue 模板⽣成的 HTML；
// 当创建 renderer 实例时声明了 template 参数，⼀定要在模板中增加⼀句注释 “<!--vue-ssr-outlet-->” 作为 vue 模板插⼊的占位符，
// 否则会报找不到插⼊模板位置的错误。
const rendererTpl = require('vue-server-renderer').createRenderer({
  template: "<!--vue-ssr-outlet--><div>{{testMsg}}</div>"
})

rendererTpl.renderToString(app, tplData, (err, html) => {
  if(err) {
    throw err
  }
  console.log('rendererTpl html ===>', html)
})


const rendererHtml = require('vue-server-renderer').createRenderer({
  template: `<!DOCTYPE html>
             <html lang="en">
               <head><title>Hello</title></head>
               <body>
               <!--vue-ssr-outlet--><div>{{testMsg}}</div>
               </body>
             </html>`
});

rendererHtml.renderToString(app, tplData, (err, html) => {
  if(err) {
    throw err
  }
  console.log('rendererHtml html ===>', html)
})
