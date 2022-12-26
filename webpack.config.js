const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 多入口 -相对项目路径
    entry: {
        app: './src/app.js',
        main: './src/main.js'
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
    mode: 'production',
    optimization: {
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
            // 以下是默认值
            // minSize: 20000, // 分割代码最小的大小
            // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
            // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
            // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
            // maxInitialRequests: 30, // 入口js文件最大并行请求数量
            // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
            // cacheGroups: { // 组，哪些模块要打包到一个组
            //   defaultVendors: { // 组名
            //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
            //     priority: -10, // 权重（越大越高）
            //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
            //   },
            //   default: { // 其他没有写的配置会使用上面的默认值
            //     minChunks: 2, // 这里的minChunks权重更大
            //     priority: -20,
            //     reuseExistingChunk: true,
            //   },
            // },
            // 修改配置
            cacheGroups: {
                // 组，哪些模块要打包到一个组
                // defaultVendors: { // 组名
                //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
                //   priority: -10, // 权重（越大越高）
                //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                // },
                default: {
                    // 其他没有写的配置会使用上面的默认值
                    minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    }
}