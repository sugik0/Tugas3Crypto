<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tugas 03 MSIM4401</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-text-center ion-margin-bottom">
        <ion-button @click="fetchData" color="primary">Refresh</ion-button>
      </div>

      <div v-if="loading" class="ion-text-center">
        <p>Memuat data...</p>
      </div>

      <ion-grid v-else class="crypto-grid">
        <ion-row class="crypto-row" v-for="coin in coins" :key="coin.id">
          <ion-col size="3" class="ion-text-center">
            <div class="label-text">Rank</div>
            <div class="value-text">{{ coin.rank }}</div>
          </ion-col>
          
          <ion-col size="5">
            <div class="label-text">{{ coin.name }}</div>
            <div class="value-text">{{ coin.symbol }}</div>
          </ion-col>
          
          <ion-col size="4">
            <div class="label-text">USD</div>
            <div class="value-text">{{ coin.price_usd }}</div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonButton, IonGrid, IonRow, IonCol 
} from '@ionic/vue';

// State reaktif untuk menyimpan data API
const coins = ref([]);
const loading = ref(false);

// Fungsi untuk mengambil data dari API Coinlore
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://api.coinlore.net/api/tickers/');
    // Mengambil data cryptocurrency dari properti "data"
    coins.value = response.data.data; 
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    alert("Gagal memuat data API. Pastikan koneksi internet stabil.");
  } finally {
    loading.value = false;
  }
};

// Memanggil API otomatis saat halaman pertama kali diakses
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Styling tata letak menyesuaikan gambar rujukan di dokumen */
.crypto-grid {
  background-color: #fcf4db; /* Warna latar krem */
  border-radius: 5px;
  border: 1px solid #e0d0b0;
  padding: 5px;
}
.crypto-row {
  border-bottom: 1px solid #e0d0b0;
  padding: 8px 0;
}
.crypto-row:last-child {
  border-bottom: none; /* Menghapus garis di baris paling bawah */
}
.label-text {
  font-size: 11px;
  color: #333;
  margin-bottom: 2px;
}
.value-text {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
</style>