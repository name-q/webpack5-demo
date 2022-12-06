const path = require("path")

module.exports = {
    // 入口 -相对路径
    entry:'./src/main.js',

    // 输出
    output:{
        // 输出路径 -绝对路径
        path:path.resolve(__dirname,'dist'),
        // 文件名
        filename:'main.js',
    },

    // 加载器
    module:{
        rules:[
            // loader配置
        ],
    },

    // 插件
    plugins:[

    ],
    
    // 模式
    mode:'development'
}