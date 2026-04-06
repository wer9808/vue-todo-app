import { createApp } from "vue";

import App from "./App.vue";
import "@/assets/main.css";
import "@/assets/style.css";
import { createPinia } from "pinia";
import appRouter from "./router";

const app = createApp(App);
app.use(createPinia());
app.use(appRouter);
app.mount("#app");
