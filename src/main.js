
console.log('main.js')

document.getElementById("btn").onclick = function () {
    // 动态导入 --> 实现按需加载
    // 即使只被引用了一次，也会代码分割
    import("./math.js").then(({ sum }) => {
        alert(sum(1, 2, 3, 4, 5));
    });
};
