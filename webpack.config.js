const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 多入口 -相对项目路径
    entry: {
        app:'./src/app.js',
        main:'./src/main.js'
    },

    // 输出
    output: {
        // 输出文件名.js 区别单入口指定文件名
        filename: "[name].js",
    },

    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "./public/index.html"),
        }),
    ],

    devtool: "source-map",

    // 模式
    mode: 'production'
}