import {
  Code,
  Eye,
  Trophy,
  Flame,
  LayoutDashboard,
  History,
  BarChart3,
  Award,
  Rocket,
  Search,
} from 'lucide-vue-next'

export const TASK_DEFINITIONS = [
  // 🟢 ONBOARDING (one-time)
  {
  id: 'first_code',
  title: 'Generate your first code',
  description: 'Turn pseudocode into executable code',
  icon: Code,
  route: '/generate-code',
  once: true,
  condition: u => (u.stats?.codes_generated ?? 0) === 0,
  priority: () => 100,
},

{
  id: 'first_visualization',
  title: 'Visualize an algorithm',
  description: 'Understand algorithms step-by-step',
  icon: Eye,
  route: '/visualize-playground',
  once: true,
  condition: u => (u.stats?.visualizations ?? 0) === 0,
  priority: () => 90,
},

{
  id: 'first_badge',
  title: 'Earn your first badge',
  description: 'Unlock achievements by learning',
  icon: Trophy,
  route: '/badges',
  once: true,
  condition: u => (u.stats?.badges ?? 0) === 0,
  priority: () => 80,
},

  // 🔁 DAILY / REPEATABLE
  {
    id: 'daily_streak',
    title: 'Don’t break your streak',
    description: 'Complete one task today',
    icon: Flame,
    route: '/dashboard',
    repeat: 'daily',
    priority: (u) => (u.stats?.streak_active_today ? 0 : 100),
  },
  {
    id: 'daily_code',
    title: 'Generate a code today',
    description: 'Practice makes perfect',
    icon: Code,
    route: '/generate-code',
    repeat: 'daily',
    condition: () => true,
    priority: () => 60,
  },

  // 📈 PROGRESSION
  {
    id: 'reach_next_level',
    title: 'Reach the next level',
    description: 'Earn XP to level up',
    icon: Rocket,
    route: '/dashboard',
    condition: (u) => (u.stats?.xp ?? 0) < (u.stats?.xp_next_level ?? Infinity),
    priority: (u) => {
      const xp = u.stats?.xp ?? 0
      const next = u.stats?.xp_next_level ?? 1
      const progress = xp / next
      return Math.floor(progress * 60)
    },
  },
  {
    id: 'visualize_more',
    title: 'Visualize more algorithms',
    description: 'Improve understanding with visuals',
    icon: Eye,
    route: '/visualize-playground',
    condition: (u) => (u.stats?.visualizations ?? 0) < 10,
    priority: (u) => 50 - (u.stats?.visualizations ?? 0),
  },
  {
    id: 'generate_more',
    title: 'Generate more code',
    description: 'Increase your coding experience',
    icon: Code,
    route: '/generate-code',
    condition: (u) => (u.stats?.codes_generated ?? 0) < 10,
    priority: (u) => 50 - (u.stats?.codes_generated ?? 0),
  },

  // 🧭 EXPLORATION
  {
    id: 'check_leaderboard',
    title: 'Check the leaderboard',
    description: 'See how you rank globally',
    icon: BarChart3,
    route: '/leaderboard',
    condition: () => true,
    priority: () => 15,
  },
  {
    id: 'check_leaderboard',
    title: 'Check the leaderboard',
    description: 'See how you rank globally',
    icon: BarChart3,
    route: '/leaderboard',
    condition: () => true,
    priority: () => 15,
  },

  // 🏆 ACHIEVEMENTS
  {
    id: 'unlock_badge',
    title: 'Unlock a new badge',
    description: 'Push yourself to earn rewards',
    icon: Award,
    route: '/badges',
    condition: () => true,
    priority: () => 10,
  },
]
