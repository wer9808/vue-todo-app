import NotFoundPage from "@/pages/NotFoundPage.vue";
import TodoPage from "@/pages/TodoPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const appRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: TodoPage },
    { path: "/:paths(.*)*", component: NotFoundPage },
  ],
});

export default appRouter;
