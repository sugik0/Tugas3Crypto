<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text="Kembali"></ion-back-button>
        </ion-buttons>
        <ion-title class="header-title">Detail Koin</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="main-content ion-padding">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat detail informasi...</p>
      </div>

      <div v-else-if="coin" class="detail-container">
        
        <div class="detail-header">
          <div class="rank-badge">Rank #{{ coin.rank }}</div>
          <h1 class="coin-name">{{ coin.name }} <span class="symbol-text">({{ coin.symbol }})</span></h1>
          <div class="price-value">USD {{ coin.price_usd }}</div>
        </div>

        <div class="info-card">
          
          <div class="info-row">
            <span class="info-label">Perubahan (1 Jam)</span>
            <span :class="['info-value', coin.percent_change_1h >= 0 ? 'text-green' : 'text-red']">
              {{ coin.percent_change_1h > 0 ? '+' : '' }}{{ coin.percent_change_1h }}%
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Perubahan (24 Jam)</span>
            <span :class="['info-value', coin.percent_change_24h >= 0 ? 'text-green' : 'text-red']">
              {{ coin.percent_change_24h > 0 ? '+' : '' }}{{ coin.percent_change_24h }}%
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Perubahan (7 Hari)</span>
            <span :class="['info-value', coin.percent_change_7d >= 0 ? 'text-green' : 'text-red']">
              {{ coin.percent_change_7d > 0 ? '+' : '' }}{{ coin.percent_change_7d }}%
            </span>
          </div>

          <div class="divider"></div>

          <div class="info-row">
            <span class="info-label">Nilai dalam BTC</span>
            <span class="info-value">{{ coin.price_btc }} BTC</span>
          </div>

          <div class="info-row">
            <span class="info-label">Market Cap</span>
            <span class="info-value">USD {{ formatNumber(coin.market_cap_usd) }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Volume (24 Jam)</span>
            <span class="info-value">USD {{ formatNumber(coin.volume24) }}</span>
          </div>

          <div class="divider"></div>

          <div class="info-row">
            <span class="info-label">Suplai Beredar (Circulating)</span>
            <span class="info-value">{{ formatNumber(coin.csupply) }} {{ coin.symbol }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Total Suplai</span>
            <span class="info-value">{{ formatNumber(coin.tsupply) }} {{ coin.symbol }}</span>
          </div>

          <div class="info-row" v-if="coin.msupply">
            <span class="info-label">Maksimal Suplai</span>
            <span class="info-value">{{ formatNumber(coin.msupply) }} {{ coin.symbol }}</span>
          </div>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton 
} from '@ionic/vue';

const route = useRoute();
const coin = ref(null);
const loading = ref(false);

// Fungsi pembantu untuk memformat angka (contoh: 1000000 -> 1,000,000)
const formatNumber = (num) => {
  if (!num) return '-';
  return parseFloat(num).toLocaleString('en-US');
};

const fetchCoinDetail = async () => {
  loading.value = true;
  try {
    // API Coinlore untuk satu koin menggunakan ticker/?id=
    const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=${route.params.id}`);
    // Endpoint ini mengembalikan array, jadi kita ambil index [0]
    coin.value = response.data[0]; 
  } catch (error) {
    console.error("Gagal memuat detail:", error);
    alert("Gagal memuat data detail API.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCoinDetail();
});
</script>

<style scoped>
/* Variabel CSS & Background */
.main-content {
  --background: #f4f6f9;
}

.header-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: #1f2937;
}

/* Detail Header */
.detail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  padding-top: 20px;
}

.rank-badge {
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.coin-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 8px 0;
  text-align: center;
}

.symbol-text {
  color: #6b7280;
  font-size: 1.2rem;
  font-weight: 600;
}

.price-value {
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
}

/* Info Card */
.info-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.info-label {
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  text-align: right;
}

.divider {
  height: 1px;
  background: #f3f4f6;
  margin: 8px 0;
}

/* Dynamic Colors for Trends */
.text-green {
  color: #10b981;
}

.text-red {
  color: #ef4444;
}

/* Loading State */
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

/* ======= DUKUNGAN TEMA GELAP (DARK MODE) ======= */
@media (prefers-color-scheme: dark) {
  .main-content {
    --background: #111827;
  }
  
  ion-toolbar {
    --background: #111827;
  }
  
  .header-title, .coin-name, .info-value {
    color: #f9fafb;
  }
  
  .symbol-text, .info-label {
    color: #9ca3af;
  }
  
  .price-value, .text-green {
    color: #34d399;
  }

  .text-red {
    color: #f87171;
  }
  
  .info-card {
    background: #1f2937;
    border-color: #374151;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }

  .divider {
    background: #374151;
  }
}
</style>