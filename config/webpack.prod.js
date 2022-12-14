const os = require("os");
const path = require("path")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

// cpu核数
const threads = os.cpus().length;

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
        // 文件名 将 js 文件输出到 static/js 目录中 .[contenthash:8]根据文件内容输出hash值前8位
        filename: "static/js/[name].[contenthash:8].js",
        // 动态导入输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
        // 图片、字体等资源命名方式（通过type: "asset"处理的文件）（注意用hash）
        assetModuleFilename: "static/media/[name].[hash:8][ext]",
        // 自动将上次打包目录资源清空
        clean: true,
    },

    // 加载器
    module: {
        rules: [
            {
                oneOf: [
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
                        // generator: {
                        //     // 将图片文件输出到 static/img 目录中
                        //     // [hash:8]: hash值取8位
                        //     // [ext]: 使用之前的文件扩展名
                        //     // [query]: 添加之前的query参数
                        //     filename: "static/img/[hash:8][ext][query]",
                        // },
                    },
                    {
                        test: /\.(ttf|woff2?|map4|map3|avi)$/,
                        // 原封不动的输出
                        type: "asset/resource",
                        // generator: {
                        //     filename: "static/media/[hash:8][ext][query]",
                        // },
                    },
                    {
                        test: /\.js$/,
                        // 排除node_modules代码不编译
                        // exclude: /node_modules/,
                        // // 也可以用包含
                        include: path.resolve(__dirname, "../src"),
                        use: [
                            {
                                // 开启多进程
                                loader: "thread-loader",
                                options: {
                                    // 进程数量
                                    workers: threads,
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    // 开启babel编译缓存
                                    cacheDirectory: true,
                                    // 缓存文件不要压缩
                                    cacheCompression: false,
                                    // 减少代码体积
                                    plugins: ["@babel/plugin-transform-runtime"],
                                },
                            }
                        ]
                    },
                ]
            }
        ],
    },

    // 插件
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            // 默认值
            exclude: "node_modules",
            // 开启缓存
            cache: true,
            // 缓存目录
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
            // 开启多进程
            threads,
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
        new TerserPlugin({
            // 开启多进程
            parallel: threads
        }),
        new PreloadWebpackPlugin({
            // preload 空闲加载当前页资源 兼容性更好
            rel: "preload",
            as: "script",
            // rel: 'prefetch' 空闲加载其他页面资源 兼容性更差
        }),
    ],

    optimization: {
        // 压缩操作
        minimize: true,
        minimizer: [
            // css压缩 也可以写到plugins中效果一样
            new CssMinimizerPlugin(),
            new TerserPlugin({
                // 开启多进程
                parallel: threads
            }),
            // 压缩图片
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
            // 其他内容用默认配置即可
        },

        // runtime中存储地址 防止模块内容改变导致名称改变 
        // 引发相关联的模块名称改变最终导致的缓存失效
        runtimeChunk: {
            // runtime文件命名规则
            name: (entrypoint) => `runtime~${entrypoint.name}`, 
        },
    },

    // https://webpack.docschina.org/configuration/devtool/
    devtool: "source-map",

    // 模式
    mode: 'production'
}