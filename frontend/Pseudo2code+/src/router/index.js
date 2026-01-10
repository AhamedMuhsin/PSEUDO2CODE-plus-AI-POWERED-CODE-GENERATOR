import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import GenerateCodeView from "@/views/GenerateCodeView.vue";
import { getCurrentUser } from "@/services/authState";
import Signup from "@/views/Signup.vue";
import Splash from "@/views/Splash.vue";

const routes = [
    {
    path: "/",
    name: "Splash",
    component: Splash,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
  path: "/signup",
  name: "Signup",
  component: Signup,
  meta: { guestOnly: true },
},
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/generate-code",
    name: "GenerateCode",
    component: GenerateCodeView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();

  // 🚫 Not logged in & trying to access protected page
  if (to.meta.requiresAuth && !user) {
    return next("/login");
  }

  // 🚫 Logged in & trying to access login page
  if (to.meta.guestOnly && user) {
    return next("/dashboard");
  }

  next();
});

export default router;
