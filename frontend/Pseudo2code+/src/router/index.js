import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import GenerateCodeView from '@/views/GenerateCodeView.vue'
import { getCurrentUser } from '@/services/authState'
import Signup from '@/views/Signup.vue'
import Splash from '@/views/Splash.vue'
import LandingPage from '@/views/LandingPage.vue'
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
    name: 'Landing',
    component: LandingPage,
  },
  {
    path: '/splash',
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
    path: '/auth/callback/google',
    name: 'GoogleCallback',
    component: () => import('@/views/AuthCallback.vue'),
  },
  {
    path: '/auth/callback/github',
    name: 'GithubCallback',
    component: () => import('@/views/AuthCallback.vue'),
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
    path: '/pricing',
    name: 'Pricing',
    component: () => import('@/views/PricingPage.vue'),
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
  {
    path: '/graph-operations/:algo?',
    name: 'GraphOperations',
    component: () => import('@/views/GraphOperationsHub.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/nqueen-visualizer',
    name: 'NQueenVisualizer',
    component: () => import('@/views/NQueenVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/hanoi-visualizer',
    name: 'TowerOfHanoiVisualizer',
    component: () => import('@/views/TowerOfHanoiVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/waterjug-visualizer',
    name: 'WaterJugVisualizer',
    component: () => import('@/views/WaterJugVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/minmax-visualizer',
    name: 'MinMaxVisualizer',
    component: () => import('@/views/MinMaxVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/missionaries-visualizer',
    name: 'MissionariesVisualizer',
    component: () => import('@/views/MissionariesVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/puzzle-visualizer',
    name: 'EightPuzzleVisualizer',
    component: () => import('@/views/EightPuzzleVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/vacuum-visualizer',
    name: 'VacuumCleanerVisualizer',
    component: () => import('@/views/VacuumCleanerVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/alphabeta-visualizer',
    name: 'AlphaBetaVisualizer',
    component: () => import('@/views/AlphaBetaVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/hillclimbing-visualizer',
    name: 'HillClimbingVisualizer',
    component: () => import('@/views/HillClimbingVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/annealing-visualizer',
    name: 'SimulatedAnnealingVisualizer',
    component: () => import('@/views/SimulatedAnnealingVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/mapcoloring-visualizer',
    name: 'MapColouringVisualizer',
    component: () => import('@/views/MapColouringVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/genetic-visualizer',
    name: 'GeneticAlgorithmVisualizer',
    component: () => import('@/views/GeneticAlgorithmVisualizer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ai-problems/:problem',
    name: 'AIProblem',
    component: () => import('@/views/AIProblemsHub.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactPage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutPage.vue'),
  },
  {
    path: '/showcase',
    name: 'Showcase',
    component: () => import('@/views/ShowcasePage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
