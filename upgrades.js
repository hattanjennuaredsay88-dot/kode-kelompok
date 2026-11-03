(() => {
  "use strict";
  const store = window.CanteenStore;
  const user = store && store.getCurrentUser();
  if (!user) { location.href = "login.html"; return; }

  const stations = [
    { id: "stove", name: "Kompor", sprite: "pixel-stove", description: "Mempercepat nasi goreng dan mi goreng.", base: 28000, baseTime: 4.5, color: "peach" },
    { id: "grill", name: "Panggangan", sprite: "pixel-grill", description: "Mempercepat roti bakar dan sosis bakar.", base: 24000, baseTime: 3.5, color: "pink" },
    { id: "fryer", name: "Penggorengan", sprite: "pixel-fryer", description: "Mempercepat kentang goreng dan takoyaki.", base: 32000, baseTime: 5.0, color: "yellow" },
    { id: "drink", name: "Mesin Minuman", sprite: "pixel-drink", description: "Mempercepat es teh, jus jeruk, dan susu.", base: 22000, baseTime: 2.8, color: "mint" }
  ];
  const $ = id => document.getElementById(id);
  const money = store.money;
  let toastTimer = 0;

  function notify(message) {
    const toast = $("workshopToast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function getLevel(record, id) {
    return Math.max(0, Math.min(5, Number(record.upgrades?.[id] || 0)));
  }

  function render() {
    const record = store.getCurrentUser();
    if (!record) { location.href = "login.html"; return; }
    const totalLevels = stations.reduce((sum, station) => sum + getLevel(record, station.id), 0);
    $("upgradeUsername").textContent = record.username.toUpperCase();
    $("workshopWallet").textContent = money(record.wallet || 0);
    $("workshopLevelTotal").textContent = `${totalLevels} / 20`;
    $("workshopGrid").innerHTML = stations.map(station => {
      const level = getLevel(record, station.id);
      const cost = station.base * (level + 1);
      const nextLevel = level + 1;
      const currentTime = station.baseTime * Math.pow(0.88, level);
      const nextTime = station.baseTime * Math.pow(0.88, Math.min(5, nextLevel));
      const maxed = level >= 5;
      const affordable = (record.wallet || 0) >= cost;
      return `<article class="workshop-card ${station.color}">
        <div class="workshop-card-top"><span class="workshop-icon"><span class="pixel-equipment ${station.sprite}"></span></span><span class="workshop-lv">LEVEL ${level + 1}/6</span></div>
        <h3>${station.name}</h3><p>${station.description}</p>
        <div class="pixel-level-track" aria-label="Level ${level + 1} dari 6">${Array.from({length: 6}, (_, i) => `<i class="${i <= level ? "filled" : ""}"></i>`).join("")}</div>
        <div class="workshop-stats"><div><small>WAKTU SEKARANG</small><b>${currentTime.toFixed(2)}s</b></div><div><small>${maxed ? "STATUS" : "SETELAH UPGRADE"}</small><b>${maxed ? "MAX LEVEL" : nextTime.toFixed(2) + "s"}</b></div></div>
        <button class="button workshop-buy" data-buy="${station.id}" ${maxed || !affordable ? "disabled" : ""}>${maxed ? "★ MAX LEVEL" : `⬆ UPGRADE · ${money(cost)}`}</button>
        ${!maxed && !affordable ? `<small class="not-enough">Kurang ${money(cost - (record.wallet || 0))}</small>` : `<small class="not-enough">${maxed ? "Kecepatan maksimum tercapai" : "Upgrade tersimpan di akun"}</small>`}
      </article>`;
    }).join("");

    $("workshopGrid").querySelectorAll("[data-buy]").forEach(button => {
      button.addEventListener("click", () => purchase(button.dataset.buy));
    });
  }

  function purchase(id) {
    const station = stations.find(item => item.id === id);
    if (!station) return;
    let result = "";
    store.updateCurrentUser(record => {
      record.upgrades = record.upgrades || { stove: 0, grill: 0, fryer: 0, drink: 0 };
      const level = getLevel(record, id);
      const cost = station.base * (level + 1);
      if (level >= 5) { result = "Peralatan sudah mencapai level maksimum."; return; }
      if ((record.wallet || 0) < cost) { result = "Uang kantin belum cukup untuk upgrade ini."; return; }
      record.wallet -= cost;
      record.upgrades[id] = level + 1;
      result = `${station.name} berhasil ditingkatkan ke level ${level + 2}!`;
    });
    notify(result);
    render();
  }

  render();
})();