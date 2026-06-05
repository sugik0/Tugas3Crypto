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

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Mengambil data dari server...</p>
      </div>

      <div v-else class="crypto-list">
        <div class="crypto-card" v-for="coin in coins" :key="coin.id" @click="goToDetail(coin.id)" style="cursor: pointer;">
          
          <div class="rank-container">
            <span class="rank-label">Rank</span>
            <div class="rank-badge">{{ coin.rank }}</div>
          </div>

          <div class="coin-info">
            <h3 class="coin-name">{{ coin.name }}</h3>
            <span class="coin-symbol">{{ coin.symbol }}</span>
          </div>

          <div class="price-container">
            <span class="currency-label">USD</span>
            <div class="price-value">{{ coin.price_usd }}</div>
          </div>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent 
} from '@ionic/vue';

const router = useRouter();
const goToDetail = (id) => {
  router.push(`/detail/${id}`);
};
const coins = ref([]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://api.coinlore.net/api/tickers/');
    // Mengambil 50 data teratas agar tampilan card tidak terlalu berat
    coins.value = response.data.data.slice(0, 50); 
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    alert("Gagal memuat data API.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Variabel CSS & Background */
.main-content {
  --background: #f4f6f9;
}

/* Header & Typography */
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

/* Modern Button */
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

/* List & Card Layout */
.crypto-list {
  padding: 10px 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crypto-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease;
}

/* Rank Section */
.rank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  border-right: 1px solid #f3f4f6;
  padding-right: 12px;
  margin-right: 12px;
}

.rank-label {
  font-size: 0.65rem;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.rank-badge {
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  font-size: 0.9rem;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Info Section (Name & Symbol) */
.coin-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.coin-name {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.coin-symbol {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

/* Price Section */
.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.currency-label {
  font-size: 0.65rem;
  color: #9ca3af;
  margin-bottom: 2px;
}

.price-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: #10b981; /* Warna hijau khas finansial */
}

/* Simple Loading Spinner */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  color: #6b7280;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  /* Latar Belakang Utama & Header */
  .main-content {
    --background: #111827; /* Latar belakang abu-abu sangat gelap */
  }

  ion-toolbar {
    --background: #111827;
    --border-color: transparent;
  }

  .header-title {
    color: #f9fafb;
  }

  .subtitle {
    color: #9ca3af;
  }

  /* Card Layout */
  .crypto-card {
    background: #1f2937; /* Warna card gelap */
    border: 1px solid #374151;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }

  /* Rank Section */
  .rank-container {
    border-right: 1px solid #374151;
  }

  .rank-label {
    color: #9ca3af;
  }

  .rank-badge {
    background: #374151;
    color: #f3f4f6;
  }

  /* Info Section */
  .coin-name {
    color: #f9fafb;
  }

  .coin-symbol {
    color: #9ca3af;
  }

  /* Price Section */
  .currency-label {
    color: #9ca3af;
  }

  .price-value {
    color: #34d399; /* Warna hijau zamrud yang lebih terang agar kontras di layar gelap */
  }

  /* Loading State */
  .loading-state {
    color: #d1d5db;
  }

  .spinner {
    border-color: #374151;
    border-top-color: #3b82f6;
  }
}
</style>