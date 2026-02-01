<template>
    <AuthNavbar />

    <div class="leaderboard-page">
        <div class="page-layout">

            <!-- LEFT SIDEBAR -->
            <aside class="sidebar">
                <ProfileCard v-if="user" :name="user.name" :email="user.email" :avatar="user.avatar" :level="user.level" :xp="user.xp"
                    :nextXp="user.nextXp" :totalXp="user.totalXp" :streak="user.streak" />
                <NavigationCard />
                <YourRankCard v-if="currentUid && leaderboard.length" :rank="myRank" :monthlyChange="0"
                    :nextRankXp="nextRankXp" />


            </aside>

            <!-- MAIN CONTENT -->
            <main class="leaderboard-container">

                <!-- Header -->
                <header class="leaderboard-header">
                    <h1>Leaderboard</h1>
                    <p>See how you rank among other learners</p>
                </header>

                <!-- Tabs -->
                <LeaderboardTabs v-model="activeType" />

                <!-- Table -->
                <LeaderboardTable v-if="currentUid" :items="leaderboard" :metric="activeType"
                    :currentUid="currentUid" />


                <div class="pagination">
                    <button :disabled="page === 1 || loading" @click="page--">
                        ← Previous
                    </button>

                    <span class="page-info">
                        Page {{ page }}
                    </span>

                    <button :disabled="!hasNext || loading" @click="page++">
                        Next →
                    </button>
                </div>
            </main>
        </div>
    </div>
</template>
<script setup>
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import ProfileCard from "@/components/dashboard/ProfileCard.vue"
import NavigationCard from "@/components/dashboard/NavigationCard.vue"

import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs.vue"
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable.vue"
import YourRankCard from "@/components/leaderboard/YourRankCard.vue"
import { ref, onMounted, watch, computed } from "vue";
import api from "@/services/api";
import { useUserStore } from "@/stores/userStore"

const userStore = useUserStore()

const user = ref(null);
const currentUid = ref(null)
const activeType = ref("xp")
const leaderboard = ref([])
const page = ref(1)
const totalPages = ref(1)
const hasNext = ref(false)
const loading = ref(false)
const yourRank = ref(null)
const nextXp = ref(0)
const monthlyChange = ref(0)

onMounted(async () => {
    const res = await api.get("/me")
    currentUid.value = res.data.uid
})

onMounted(async () => {
    const res = await api.get("/me")
    const data = res.data

    user.value = {
        name: data.name,
        email: data.email,
        avatar: data.avatar || "",
        level: data.stats.level,
        xp: data.stats.xp,
        nextXp: data.stats.xp_next_level,
        totalXp: data.stats.xp,
        streak: data.stats.streak,
    }

    currentUid.value = data.uid
    userStore.setUser(user.value)
})

const onTabChange = (type) => {
    console.log("Leaderboard type:", type)
}
const fetchLeaderboard = async () => {
    loading.value = true
    try {
        const res = await api.get("/leaderboard", {
            params: {
                type: activeType.value,
                page: page.value,
                limit: 10
            }
        })

        leaderboard.value = res.data.results

        // 🔥 FIND CURRENT USER RANK
        const me = leaderboard.value.find(
            u => u.uid === user.value?.uid
        )

        if (me) {
            yourRank.value = me.rank

            // 🔥 XP TO NEXT RANK
            const above = leaderboard.value.find(
                u => u.rank === me.rank - 1
            )

            if (above && activeType.value === "xp") {
                nextXp.value = Math.max(above.xp - me.xp, 0)
            } else {
                nextXp.value = 0
            }
        }
    } finally {
        loading.value = false
    }
}

watch(page, () => {
    fetchLeaderboard()
})

watch(activeType, () => {
    page.value = 1 // reset pagination
    fetchLeaderboard()
})

onMounted(fetchLeaderboard)
const myEntry = computed(() =>
    leaderboard.value.find(u => u.uid === currentUid.value)
)

const myRank = computed(() => myEntry.value?.rank ?? null)

const nextRankXp = computed(() => {
    if (!myEntry.value) return 0
    const higher = leaderboard.value.find(
        u => u.rank === myEntry.value.rank - 1
    )
    return higher ? higher.xp - myEntry.value.xp : 0
})

</script>
<style scoped>
.leaderboard-page {
    min-height: 100vh;
    background: radial-gradient(circle at top, #0f172a, #020617);
}

.page-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 28px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 24px;
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.leaderboard-container {
    padding: 32px;
}

.leaderboard-header h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #f8fafc;
}

.leaderboard-header p {
    color: #94a3b8;
    margin-top: 6px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 28px;
}

.pagination button {
    background: linear-gradient(145deg, #0b1220, #0e1628);
    border: 1px solid #1e293b;
    color: #e5e7eb;
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination button:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.15);
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.9rem;
    color: #94a3b8;
}
</style>
