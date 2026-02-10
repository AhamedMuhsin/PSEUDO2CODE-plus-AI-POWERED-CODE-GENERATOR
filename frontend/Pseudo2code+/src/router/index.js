import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import GenerateCodeView from '@/views/GenerateCodeView.vue'
import { getCurrentUser } from '@/services/authState'
import Signup from '@/views/Signup.vue'
import Splash from '@/views/Splash.vue'
import Visualize from '@/views/Visualize.vue'
import VisualizePlayground from '@/views/VisualizePlayground.vue'
import ViewHistory from '@/views/ViewHistory.vue'
import ViewBadge from '@/views/BadgesView.vue'
import ViewLeaderboard from '@/views/LeaderboardView.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AlgorithmHub from '@/views/AlgorithmHub.vue'

const routes = [
  {
    path: '/',
    name: 'Splash',
    component: Splash,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/generate-code',
    name: 'GenerateCode',
    component: GenerateCodeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/visualize',
    name: 'Visualize',
    component: Visualize,
    meta: { requiresAuth: true },
  },
  {
    path: '/visualize-playground',
    name: 'VisualizePlayground',
    component: VisualizePlayground,
    meta: { requiresAuth: true },
  },
  {
    path: '/history',
    name: 'History',
    component: ViewHistory,
    meta: { requiresAuth: true },
  },
  {
    path: '/badges',
    name: 'Badges',
    component: ViewBadge,
    meta: { requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: ViewLeaderboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/algorithm-hub',
    name: 'AlgorithmHub',
    component: AlgorithmHub,
    meta: { requiresAuth: true },
  },
  {
    path: '/visualize/:category/:algorithm',
    name: 'AlgorithmVisualizer',
    component: () => import('@/views/AlgorithmVisualizerPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/array-operations',
    component: () => import('@/views/ArrayOperationsHub.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stack-operations',
    component: () => import('@/views/StackOperationsHub.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/queue-operations',
    component: () => import('@/views/QueueOperationsHub.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/linkedlist-operations',
    component: () => import('@/views/LinkedListOperationsHub.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/binary-tree-operations',
    component: () => import('@/views/BinaryTreeOperationsHub.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()

  // 🚫 Not logged in & trying to access protected page
  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  // 🚫 Logged in & trying to access login page
  if (to.meta.guestOnly && user) {
    return next('/dashboard')
  }

  next()
})

export default router
