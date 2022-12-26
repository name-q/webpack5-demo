import count from "./js/count";
import sum from "./js/sum";

// 引入资源，Webpack才会对其打包
import "./css/iconfont.css";
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));

// 判断是否支持HMR功能
if (module.hot) {
    // 这种方式不会导致页面刷新 -所有数据重载
    module.hot.accept("./js/count.js");
    module.hot.accept("./js/sum.js");
}

document.getElementById('btn').onclick = () => {
    import(/* webpackChunkName: "math" */ './js/math').then(({ mul }) => {
        console.log(mul(3, 3))
    })
}