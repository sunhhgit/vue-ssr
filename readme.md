SSR
所谓的SSR其实就是服务端渲染，也就是我们常说的直出。
优势
9. ⾸屏加载速度⾮常快
;. 请求能够放在服务端，减少响应时间
<. 有利于爬⾍搜索
劣势
9. 对服务器提出更⾼的要求，⽣成虚拟DOM如果相对较⻓的运⾏和计算耗时；
;. 由于cgi拉取和vdom直出后才吐出HTML⻚⾯，FMP虽然提前了，但是FP相对
延迟了；
延迟了；
<. SSR渲染后，由于仍然需要进⾏依赖、vue初始化，⻚⾯可交互时间并没有较⼤
改善。
简单实现 vue SSR
新建⼀个⽂件夹vue-ssr-demo，进⼊其中执⾏如下命令：
// 安装模块
npm install vue vue-server-renderer --save
创建⽂件 server.js
//第⼀步，创建vue实例
const Vue = require('vue');
const app = new Vue({
template: "<div>hello world</div>"
});
//第⼆步，创建⼀个renderer
const renderer = require('vue-server-renderer').createRenderer();
//第三步，将vue渲染为HTML
renderer.renderToString(app, (err, html)=>{
if(err){
 throw err;
 }
console.log(html);
});
执⾏ node server.js，可得到如下 HTML 内容：
<div data-server-rendered="true">hello world</div>
第⼀种渲染数据⽅式
// server.js
const data_vue = {
word: 'Hello World!'
word: 'Hello World!'
};
//第⼀步，创建vue实例
const Vue = require('vue');
//vue 实例化过程中插⼊数据
const app = new Vue({
data: data_vue,
template: "<div>{{word}}</div>"
});
//第⼆步，创建⼀个renderer
const renderer = require('vue-server-renderer').createRenderer();
//第三步，将vue渲染为HTML
renderer.renderToString(app, (err, html)=>{
if(err){
 throw err;
 }
console.log(html);
}); 
第⼀种⽅式在创建 vue 实例时，将需要的数据传⼊ vue 的模板，使⽤⽅法与客户端
vue ⼀样；运⾏ server.js 结果如下，数据 data_vue 已经插⼊到 vue 模板⾥⾯了：
<div data-server-rendered="true">Hello World!</div>
第⼆种，模板插值，这⾥我们也直接先放代码：
const data_vue = {
word: 'Hello World!'
};
};
const data_tpl = {
people: 'Hello People!'
};
//第⼀步，创建vue实例
const Vue = require('vue');
const app = new Vue({
data: data_vue,
template: "<div>{{word}}</div>"
});
//第⼆步，创建⼀个 renderer 实例
const renderer = require('vue-server-renderer').createRenderer({
template: "<!--vue-ssr-outlet--><div>{{people}}</div>"
});
//第三步，将vue渲染为HTML
renderer.renderToString(app, data_tpl, (err, html)=>{
if(err){
 throw err;
 }
console.log(html);
});
这⾥我们增加了数据 data_tpl，你会发现，在 renderToString ⽅法中传⼊了这个参
数，那么这个参数作⽤在哪⾥呢？这就要看下官⽹中关于 createRenderer 和
renderToString ⽅法的介绍了，
createRenderer: 使⽤（可选的）选项创建⼀个 Renderer 实例。 const {
createRenderer } = require('vue-server-renderer') const renderer =
createRenderer({ / 选项 / }) 在选项中，就有⼀个参数叫 template，看官⽹怎么说
的：
template: 为整个⻚⾯的 HTML 提供⼀个模板。此模板应包含注释 <!--vue-ssr￾outlet-->，作为渲染应⽤程序内容的占位符。
为整个⻚⾯的 HTML 提供⼀个模板。此模板应包含注释 <!--vue-ssr-outlet-->，作为
为整个⻚⾯的 HTML 提供⼀个模板。此模板应包含注释 <!--vue-ssr-outlet-->，作为
渲染应⽤程序内容的占位符。
模板还⽀持使⽤渲染上下⽂ (render context) 进⾏基本插值：
使⽤双花括号 (double-mustache) 进⾏ HTML 转义插值 (HTML-escaped
interpolation)；
使⽤三花括号 (triple-mustache) 进⾏ HTML 不转义插值 (non-HTML-escaped
interpolation)。
根据介绍，在创建 renderer 实例时，可以通过 template 参数声明⼀个模板，这个
模板⽤来⼲嘛呢？就⽤来挂载 vue 模板渲染完成之后⽣成的 HTML。这⾥要注意⼀
下，当创建 renderer 实例时没有声明 template 参数，那么默认渲染完就是 vue 模
板⽣成的 HTML；当创建 renderer 实例时声明了 template 参数，⼀定要在模板中
增加⼀句注释 “” 作为 vue 模板插⼊的占位符，否则会报找不到插⼊模板位置的错
误。
再次运⾏ server.js ，结果如下，vue 模板已成功插⼊，且 template 模板中的
{{people}} 变量也因在 renderToString ⽅法中第⼆位参数的传⼊，显示了数据：
<div data-server-rendered="true">Hello World!</div><div>Hello
People!</div>
如果我们把 template 换成⼀个 HTML ⻚⾯的基本架构，来包裹 vue 模板，是不是
就能得到⼀个完整⻚⾯了呢？我们来试⼀下：
const data_vue = {
word: 'Hello World!'
};
};
const data_tpl = {
people: 'Hello People!'
};
//第⼀步，创建vue实例
const Vue = require('vue');
const app = new Vue({
data: data_vue,
template: "<div>{{word}}</div>"
});
//第⼆步，创建⼀个renderer
const renderer = require('vue-server-renderer').createRenderer({
template: `<!DOCTYPE html>
 <html lang="en">
 <head><title>Hello</title></head>
 <body>
 <!--vue-ssr-outlet--><div>{{people}}</div>
 </body>
 </html>`
});
//第三步，将vue渲染为HTML
renderer.renderToString(app, data_tpl, (err, html)=>{
if(err){
 throw err;
 }
console.log(html);
});
运⾏ server.js ，结果如下，我们得到了⼀个完整的 HTML ⻚⾯，且成功插⼊了数
据：
<!DOCTYPE html>
<html lang="en"> <head><title>Hello</title></head> <body> <div data-server-rendered="true">Hello World!</div><div>Hello
People!</div>
</body>
</html>
好，现在⻚⾯⽣成了，该怎么显示呢？这⾥我们借助下框架 Koa 实现，先来安
装：
npm install koa -S
然后修改 server.js ，如下：
const data_vue = {
word: 'Hello World!'
};
};
const data_tpl = {
people: 'Hello People!'
};
const Koa = require('koa');
//创建 koa 实例
const koa = new Koa();
const Vue = require('vue');
//创建⼀个renderer
const renderer = require('vue-server-renderer').createRenderer({
template: `<!DOCTYPE html>
 <html lang="en">
 <head><title>Hello</title></head>
 <body>
 <!--vue-ssr-outlet--><div>{{people}}</div>
 </body>
 </html>`
});
// 对于任何请求，app将调⽤该异步函数处理请求：
koa.use(async (ctx, next) => {
// await next();
//创建vue实例
const app = new Vue({
 data: data_vue,
 template: "<div>{{word}}</div>"
 });
//将vue渲染为HTML
const body = await renderer.renderToString(app, data_tpl);
 ctx.body = body;
});
// 在端⼝3001监听:
koa.listen(3001);
console.log('app started at port 3001...');
运⾏ server.js :
 vue-ssr-demo node server.js
app started at port 3001...
然后打开浏览器，输⼊⽹址 http://localhost:3001/ ，即可看到运⾏后的效果。
这样就实现了⼀个简单的服务端渲染项⽬