import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import Projects from "../pages/Projects.vue";
import Analytics from "../pages/Analytics.vue";
import Tasks from "../pages/Tasks.vue";
import Profile from "../pages/Profile.vue";
import Animations from "../pages/Animations.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics,
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: Tasks,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/animations",
    name: "Animations",
    component: Animations,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
