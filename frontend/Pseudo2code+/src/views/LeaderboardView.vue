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

                <!-- BACK BUTTON -->
                <div class="back-top-bar">
                    <button class="back-btn-compact" @click="router.push('/dashboard')">
                        <img :src="arrowLeft" class="arrow" />
                        Back
                    </button>
                </div>

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
import { useRouter } from 'vue-router';
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import arrowLeft from '@/assets/arrow-left.svg';

const router = useRouter();
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
        hasNext.value = res.data.has_next ?? false
        totalPages.value = res.data.total_pages ?? 1

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
/* ════════ BACK ════════ */
.back-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent-lighter); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: var(--accent-bg-hover); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }

.leaderboard-page {
    min-height: 100vh;
    background: var(--bg-page);
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
    color: var(--text-primary);
}

.leaderboard-header p {
    color: var(--text-muted);
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
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    color: var(--text-secondary);
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination button:hover:not(:disabled) {
    background: var(--accent-bg);
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.9rem;
    color: var(--text-muted);
}

/* ===== Mobile Responsive ===== */
@media (max-width: 1024px) {
    .page-layout {
        grid-template-columns: 1fr;
        padding: 24px 16px;
    }

    .sidebar {
        display: none;
    }

    .leaderboard-container {
        padding: 16px 0;
    }
}

@media (max-width: 640px) {
    .page-layout {
        padding: 16px 12px;
    }

    .leaderboard-header h1 {
        font-size: 1.5rem;
    }

    .leaderboard-header p {
        font-size: 0.85rem;
    }

    .pagination {
        gap: 10px;
    }

    .pagination button {
        padding: 8px 14px;
        font-size: 0.85rem;
    }
}
</style>
