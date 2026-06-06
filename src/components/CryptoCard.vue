<template>
  <div class="crypto-card">
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
</template>

<script setup>
defineProps({
  coin: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.crypto-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.crypto-card:active {
  transform: scale(0.98);
  background: #f9fafb;
}

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
  color: #10b981;
}

@media (prefers-color-scheme: dark) {
  .crypto-card {
    background: #1f2937;
    border: 1px solid #374151;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  .crypto-card:active { background: #374151; }
  .rank-container { border-right: 1px solid #374151; }
  .rank-label, .coin-symbol, .currency-label { color: #9ca3af; }
  .rank-badge { background: #374151; color: #f3f4f6; }
  .coin-name { color: #f9fafb; }
  .price-value { color: #34d399; }
}
</style>