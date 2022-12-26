module.exports = {
    // 解析选项
    parserOptions: {
        // ES 语法版本
        ecmaVersion: 6,
        // ES 模块化
        sourceType: "module",
        // ES 其他特性
        ecmaFeatures: {
            // 如果是 React 项目，就需要开启 jsx 语法
            jsx: true
        }
    },
    env: {
        // 启用node中全局变量
        node: true,
        // 启用浏览器中全局变量
        browser: true,
    },
    // 具体检查规则
    rules: {
        // 不能使用 var 定义变量
        "no-var": 2,
    },
    // 继承其他规则
    extends: ["eslint:recommended"],
    // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring

    // 解决动态导入import语法报错问题 --> 使用eslint-plugin-import解决
    plugins: ["import"],
};
