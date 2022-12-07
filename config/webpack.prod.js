const path = require("path")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        ...preProcessor,
    ].filter(Boolean);
};

module.exports = {
    // 入口 -相对项目路径
    entry: './src/main.js',

    // 输出
    output: {
        // 输出路径 -绝对路径
        path: path.resolve(__dirname, '../dist'),
        // 文件名 将 js 文件输出到 static/js 目录中
        filename: "static/js/main.js",
        // 自动将上次打包目录资源清空
        clean: true,
    },

    // 加载器
    module: {
        rules: [
            // loader配置
            {
                // https://webpack.docschina.org/loaders/css-loader/
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                use: getStyleLoaders([])
            },
            {
                test: /\.less$/,
                // loader:'less-loader'
                use: getStyleLoaders(['less-loader'])
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders(['sass-loader'])
            },
            {
                test: /\.styl$/,
                // use 数组里面 Loader 执行顺序是从下到上
                use: getStyleLoaders(['stylus-loader'])
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
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/main.css",
        }),
    ],

    // 模式
    mode: 'production'
}