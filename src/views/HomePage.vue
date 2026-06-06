<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title class="header-title">Market Crypto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="main-content">
      <div class="action-header">
        <div class="subtitle">Live Update</div>
        <button class="btn-modern-refresh" @click="fetchData" :disabled="loading">
          {{ loading ? 'Memuat...' : 'Refresh Data' }}
        </button>
      </div>

      <div v-if="loading" class="global-loading-state">
        <div class="global-spinner"></div>
        <p>Mengambil data dari server...</p>
      </div>

      <div v-else class="crypto-list">
        <CryptoCard 
          v-for="coin in coins" 
          :key="coin.id" 
          :coin="coin" 
          @click="goToDetail(coin.id)"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewWillEnter } from '@ionic/vue';
import CryptoCard from '../components/CryptoCard.vue';
import { CryptoService } from '../services/CryptoService';

const router = useRouter();
const coins = ref([]);
const loading = ref(false);

const goToDetail = (id) => {
  router.push(`/detail/${id}`);
};

const fetchData = async () => {
  loading.value = true;
  try {
    coins.value = await CryptoService.getCoins(); 
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    alert("Gagal memuat data API.");
  } finally {
    loading.value = false;
  }
};

onIonViewWillEnter(() => {
  if (coins.value.length === 0) {
    fetchData();
  }
});
</script>

<style scoped>
.main-content {
  --background: #f4f6f9;
}

.header-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: #1f2937;
  text-align: center;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px;
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-modern-refresh {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
  transition: all 0.2s ease;
}

.btn-modern-refresh:active {
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

.btn-modern-refresh:disabled {
  background: #9ca3af;
  box-shadow: none;
}

.crypto-list {
  padding: 10px 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (prefers-color-scheme: dark) {
  .main-content { --background: #111827; }
  ion-toolbar { --background: #111827; --border-color: transparent; }
  .header-title { color: #f9fafb; }
  .subtitle { color: #9ca3af; }
}
</style>