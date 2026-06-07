<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="main-toolbar">
        <ion-title class="header-title">Market Crypto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="main-content">
      
      <ion-refresher :slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="dashboard-panel">
        <div class="status-container">
          <div class="live-indicator">
            <span class="pulse-dot" :class="{ 'loading-pulse': loading }"></span>
            <span class="live-text">Live Update</span>
          </div>
          <div class="time-text">{{ lastUpdated || 'Menunggu data...' }}</div>
        </div>

        <button class="btn-refresh-elegant" @click="fetchData" :disabled="loading">
          {{ loading ? 'Memuat...' : 'Refresh' }}
        </button>
      </div>

      <div class="search-container">
        <ion-searchbar 
          v-model="searchQuery" 
          placeholder="Cari koin (contoh: btc, ethereum)..." 
          animated="true"
          class="custom-searchbar">
        </ion-searchbar>
      </div>

      <div v-if="loading && coins.length === 0" class="global-loading-state">
        <div class="global-spinner"></div>
        <p>Mengambil data dari server...</p>
      </div>

      <div v-else-if="filteredCoins.length === 0" class="empty-state">
        <p>Koin "{{ searchQuery }}" tidak ditemukan.</p>
      </div>

      <div v-else class="crypto-list">
        <CryptoCard 
          v-for="coin in filteredCoins" 
          :key="coin.id" 
          :coin="coin" 
          @click="goToDetail(coin.id)"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// 1. Tambahkan onMounted dan onUnmounted dari 'vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'; 
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  onIonViewWillEnter, onIonViewDidLeave, 
  IonRefresher, IonRefresherContent, IonSearchbar 
} from '@ionic/vue';
import CryptoCard from '../components/CryptoCard.vue';
import { CryptoService } from '../services/CryptoService';

const router = useRouter();
const coins = ref([]);
const loading = ref(false);
const lastUpdated = ref('');
const searchQuery = ref(''); 
let refreshInterval = null;

const goToDetail = (id) => {
  router.push(`/detail/${id}`);
};

const fetchData = async (event = null, isBackground = false) => {
  if (!isBackground) {
    loading.value = true;
  }
  try {
    coins.value = await CryptoService.getCoins(); 
    const now = new Date();
    lastUpdated.value = now.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  } finally {
    loading.value = false;
    if (event) {
      event.target.complete();
    }
  }
};

const handleRefresh = (event) => {
  fetchData(event, false);
};

const startAutoRefresh = () => {
  // Cegah interval ganda jika dipanggil berkali-kali
  if (refreshInterval) return; 
  refreshInterval = setInterval(() => {
    fetchData(null, true); 
  }, 30000);
};

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

const filteredCoins = computed(() => {
  if (!searchQuery.value) return coins.value;
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return coins.value.filter(coin => 
    coin.name.toLowerCase().includes(lowerCaseQuery) || 
    coin.symbol.toLowerCase().includes(lowerCaseQuery)
  );
});

// ==========================================
// PENYELESAIAN BUG HMR VITE + IONIC ROUTER
// ==========================================

// Bekerja sangat baik saat HMR (Save di VS Code) dan saat aplikasi pertama kali dibuka
onMounted(() => {
  if (coins.value.length === 0) fetchData();
  startAutoRefresh();
});

// Membersihkan memori saat HMR me-reload komponen
onUnmounted(() => {
  stopAutoRefresh();
});

// Melanjutkan auto-refresh saat kembali dari DetailPage (Navigasi Ionic)
onIonViewWillEnter(() => {
  if (coins.value.length > 0) fetchData(null, true);
  startAutoRefresh();
});

// Menghentikan auto-refresh saat pergi ke DetailPage agar kuota internet hemat
onIonViewDidLeave(() => {
  stopAutoRefresh();
});

</script>

<style scoped>
/* Latar Belakang Area Konten */
.main-content {
  --background: #f4f6f9;
}

.main-toolbar {
  --background: #ffffff;
  --padding-top: 8px;
  --padding-bottom: 0px;
}

.header-title {
  font-weight: 800;
  font-size: 1.3rem;
  color: #111827;
  text-align: center;
  letter-spacing: -0.5px;
}

.dashboard-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 12px 20px 24px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.02);
  /* margin-bottom dihapus agar lebih rapat dengan search bar */
}

/* === SEARCH BAR STYLE === */
.search-container {
  padding: 10px 10px 0px;
}

.custom-searchbar {
  --background: #ffffff;
  --border-radius: 14px;
  --box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  --color: #1f2937;
  --placeholder-color: #9ca3af;
  --icon-color: #6b7280;
  padding-bottom: 10px;
}

.status-container { display: flex; flex-direction: column; gap: 4px; }
.live-indicator { display: flex; align-items: center; gap: 8px; }
.live-text { font-size: 0.9rem; font-weight: 700; color: #374151; letter-spacing: 0.5px; }
.time-text { font-size: 0.75rem; color: #6b7280; font-weight: 500; }

.pulse-dot {
  width: 10px; height: 10px; background-color: #10b981; border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite;
}
.pulse-dot.loading-pulse {
  background-color: #f59e0b; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.btn-refresh-elegant {
  background: #eff6ff; color: #2563eb; border: none; padding: 10px 20px;
  border-radius: 14px; font-weight: 700; font-size: 0.85rem; transition: all 0.2s ease;
}
.btn-refresh-elegant:active { transform: scale(0.95); background: #dbeafe; }
.btn-refresh-elegant:disabled { background: #f3f4f6; color: #9ca3af; }

.crypto-list { padding: 0 20px 30px; display: flex; flex-direction: column; gap: 12px; }

.empty-state { text-align: center; color: #6b7280; padding: 40px 20px; font-weight: 500; }

/* === TEMA GELAP === */
@media (prefers-color-scheme: dark) {
  .main-content { --background: #111827; }
  .main-toolbar, .dashboard-panel { --background: #1f2937; background: #1f2937; }
  .header-title, .live-text { color: #f9fafb; }
  .time-text { color: #9ca3af; }
  .dashboard-panel { box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); }
  
  .custom-searchbar {
    --background: #1f2937;
    --color: #f9fafb;
    --placeholder-color: #6b7280;
    --box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }

  .btn-refresh-elegant { background: #374151; color: #60a5fa; }
  .btn-refresh-elegant:active { background: #4b5563; }
  .btn-refresh-elegant:disabled { background: #374151; color: #6b7280; }
  .empty-state { color: #9ca3af; }
}
</style>