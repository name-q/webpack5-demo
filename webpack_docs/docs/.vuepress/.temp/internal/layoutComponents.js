import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import("/Users/qy/Documents/other/webpack5-demo/webpack_docs/node_modules/@vuepress/theme-default/lib/client/layouts/404.vue")),
  "Layout": defineAsyncComponent(() => import("/Users/qy/Documents/other/webpack5-demo/webpack_docs/node_modules/@vuepress/theme-default/lib/client/layouts/Layout.vue")),
}
