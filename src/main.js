import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import * as ElIcons from '@element-plus/icons-vue'

const app = createApp(App)
for(const name in ElIcons){
    app.component(name,(ElIcons)[name])
}
app.use(ElementPlus).mount('#app')
