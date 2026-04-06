import { createApp } from "vue";

import App from "./App.vue";
import "@/assets/main.css";
import "@/assets/style.css";
import appRouter from "./router";

const app = createApp(App);
app.use(appRouter);
app.mount("#app");
