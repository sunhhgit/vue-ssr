// ⼀个简单的服务端渲染项⽬
const Vue = require('vue')
const Koa = require('koa');
//创建 koa 实例
const koa = new Koa();

const inData = {
  msg: "vue-ssr !"
}

const tplData = {
  testMsg: 'This is just a test !'
}

const app = new Vue({
  data: inData,
  template: "<div>hello {{msg}}</div>"
})

const rendererHtml = require('vue-server-renderer').createRenderer({
  template: `<!DOCTYPE html>
             <html lang="en">
               <head><title>vue-ssr</title></head>
               <body>
               <!--vue-ssr-outlet--><div>{{testMsg}}</div>
               </body>
             </html>`
});

koa.use(async(ctx, next) => {
  const body = await rendererHtml.renderToString(app, tplData)
  ctx.body = body
})

koa.listen(3001)
console.log('app started at http://127.0.0.1:3001...');

