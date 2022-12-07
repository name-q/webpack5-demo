const path = require("path")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 入口 -相对项目路径
    entry: './src/main.js',

    // 输出
    output: {
        // 文件名 将 js 文件输出到 static/js 目录中
        filename: "static/js/main.js",
    },

    // 加载器
    module: {
        rules: [
            // loader配置
            {
                // https://webpack.docschina.org/loaders/css-loader/
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                // loader:'less-loader'
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.styl$/,
                // use 数组里面 Loader 执行顺序是从下到上
                use: [
                    // commonjs编译成<style>标签内容并挂在在html中
                    "style-loader",
                    // css编译成commonjs
                    "css-loader",
                    // styl编译成css
                    "stylus-loader"
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        // 小于30kb的图片会被base64处理
                        // 优点：减少请求数 缺点：体积会变大
                        maxSize: 30 * 1024
                    }
                },
                generator: {
                    // 将图片文件输出到 static/img 目录中
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: "static/img/[hash:8][ext][query]",
                },
            },
            {
                test: /\.(ttf|woff2?|map4|map3|avi)$/,
                // 原封不动的输出
                type: "asset/resource",
                generator: {
                    filename: "static/media/[hash:8][ext][query]",
                },
            },
            {
                test: /\.js$/,
                // 排除node_modules代码不编译
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },

    // 插件
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
    ],
    
    // 开发服务器
    // 编译指令由npx webpacl -> npx webpack serve
    // 无dist文件输出 改为内存输出
    devServer: {
        // 启动服务器域名
        host: "localhost",
        // 启动服务器端口号
        port: "2333",
        // 是否自动打开浏览器
        open: true,
    },

    // https://webpack.docschina.org/configuration/devtool/
    devtool: "cheap-module-source-map",

    // 模式
    mode: 'development'
}