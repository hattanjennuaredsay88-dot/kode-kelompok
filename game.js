(() => {
  "use strict";
  const store = window.CanteenStore;
  let user = store && store.getCurrentUser();
  if (!user) { location.href = "login.html"; return; }
  const $ = id => document.getElementById(id);
  const fmt = store.money;
  const STARTING_CASH = 350000;
  const RENT_PER_MONTH = 150000;
  const MIN_INGREDIENT_COST = 60000;
  const INGREDIENT_RATE = 0.28;
  const DAY_LENGTH = 30;
  const menu = [
    { id:"nasigoreng", name:"Nasi Goreng", price:12000, station:"stove", temp:"hot", life:85, sprite:"rice" },
    { id:"miegoreng", name:"Mi Goreng", price:10000, station:"stove", temp:"hot", life:85, sprite:"noodles" },
    { id:"rotibakar", name:"Roti Bakar", price:8000, station:"grill", temp:"hot", life:75, sprite:"toast" },
    { id:"sosisbakar", name:"Sosis Bakar", price:9000, station:"grill", temp:"hot", life:75, sprite:"sausage" },
    { id:"kentang", name:"Kentang Goreng", price:10000, station:"fryer", temp:"hot", life:70, sprite:"fries" },
    { id:"takoyaki", name:"Takoyaki", price:11000, station:"fryer", temp:"hot", life:70, sprite:"takoyaki" },
    { id:"esteh", name:"Es Teh", price:5000, station:"drink", temp:"cold", life:65, sprite:"tea" },
    { id:"jusjeruk", name:"Jus Jeruk", price:8000, station:"drink", temp:"cold", life:65, sprite:"juice" },
    { id:"susu", name:"Susu", price:6000, station:"drink", temp:"cold", life:65, sprite:"milk" }
  ];
  const stations = [
    { id:"stove", name:"Kompor", desc:"Masakan panas", sprite:"stove" },
    { id:"grill", name:"Panggangan", desc:"Roti & sosis", sprite:"grill" },
    { id:"fryer", name:"Penggorengan", desc:"Gorengan", sprite:"fryer" },
    { id:"drink", name:"Mesin Minuman", desc:"Minuman dingin", sprite:"drink" }
  ];
  const cookDuration = { stove:4.5, grill:3.5, fryer:5, drink:2.8 };
  const upgradeCost = { stove:28000, grill:24000, fryer:32000, drink:22000 };
  const names = ["Rina","Kenji","Alya","Haru","Mika","Dimas","Sora","Nadia","Yuki","Rafi","Mei","Akira"];
  const coins = [500,1000,2000,5000,10000];
  const spriteRects = {
    rice:'<rect x="5" y="18" width="22" height="9" fill="#fff0cf"/><rect x="8" y="14" width="16" height="5" fill="#fff8e6"/><rect x="10" y="10" width="4" height="4" fill="#e6a64f"/><rect x="17" y="12" width="5" height="4" fill="#75a95b"/><rect x="7" y="26" width="18" height="2" fill="#c87955"/>',
    noodles:'<rect x="5" y="18" width="22" height="9" fill="#f2b84d"/><rect x="7" y="14" width="18" height="5" fill="#ffe18b"/><path d="M9 16h4m2 0h5m-10 3h6m3 0h3" stroke="#b96a3d" stroke-width="2"/><rect x="7" y="27" width="18" height="2" fill="#c87955"/>',
    toast:'<rect x="7" y="5" width="18" height="22" fill="#b86c42"/><rect x="10" y="8" width="12" height="16" fill="#f5c77b"/><rect x="12" y="11" width="8" height="10" fill="#ffe3a1"/><rect x="5" y="26" width="22" height="3" fill="#7c4a3c"/>',
    sausage:'<rect x="5" y="13" width="22" height="9" fill="#c65b48"/><rect x="8" y="10" width="16" height="3" fill="#ed9b69"/><rect x="8" y="22" width="16" height="3" fill="#ed9b69"/><path d="M11 14l3 5m4-5l3 5" stroke="#783e42" stroke-width="2"/>',
    fries:'<rect x="7" y="13" width="18" height="15" fill="#d65b4d"/><rect x="9" y="5" width="4" height="13" fill="#ffd66e"/><rect x="15" y="3" width="4" height="15" fill="#ffe18b"/><rect x="21" y="7" width="4" height="11" fill="#f6bd4f"/>',
    takoyaki:'<rect x="5" y="15" width="22" height="13" fill="#b66c49"/><rect x="7" y="11" width="7" height="8" fill="#d98a5a"/><rect x="16" y="10" width="7" height="9" fill="#d98a5a"/><rect x="10" y="13" width="2" height="2" fill="#fff0c5"/><rect x="19" y="12" width="2" height="2" fill="#fff0c5"/>',
    tea:'<rect x="9" y="7" width="14" height="20" fill="#9bd9e7"/><rect x="11" y="11" width="10" height="13" fill="#b86b43"/><rect x="12" y="4" width="8" height="3" fill="#fff0cf"/><rect x="20" y="10" width="5" height="3" fill="#fff0cf"/><rect x="14" y="2" width="3" height="5" fill="#e9f9ff"/>',
    juice:'<rect x="8" y="7" width="16" height="21" fill="#f2b84d"/><rect x="11" y="10" width="10" height="14" fill="#ffdb76"/><rect x="13" y="3" width="4" height="6" fill="#fff0cf"/><rect x="18" y="4" width="7" height="3" fill="#75a95b"/>',
    milk:'<rect x="9" y="8" width="14" height="20" fill="#fff2d8"/><rect x="12" y="4" width="8" height="5" fill="#7fc5d8"/><rect x="12" y="14" width="8" height="7" fill="#9bd9e7"/><rect x="12" y="23" width="8" height="2" fill="#d9a76b"/>',
    stove:'<rect x="4" y="15" width="24" height="12" fill="#64718c"/><rect x="7" y="11" width="18" height="5" fill="#e77e65"/><rect x="9" y="6" width="14" height="6" fill="#f4bd65"/><rect x="10" y="27" width="4" height="3" fill="#263653"/><rect x="20" y="27" width="4" height="3" fill="#263653"/>',
    grill:'<rect x="4" y="14" width="24" height="12" fill="#68728a"/><path d="M7 14v-6m5 6V6m5 8V6m5 8V6" stroke="#d98a5a" stroke-width="3"/><rect x="8" y="26" width="4" height="4" fill="#263653"/><rect x="21" y="26" width="4" height="4" fill="#263653"/>',
    fryer:'<rect x="6" y="12" width="20" height="15" fill="#69768f"/><rect x="9" y="7" width="14" height="7" fill="#f0bd5d"/><rect x="11" y="17" width="10" height="6" fill="#e88b4d"/><rect x="9" y="27" width="4" height="3" fill="#263653"/><rect x="20" y="27" width="4" height="3" fill="#263653"/>',
    drink:'<rect x="8" y="4" width="16" height="24" fill="#83c8dc"/><rect x="11" y="8" width="10" height="15" fill="#fff0cf"/><rect x="12" y="2" width="8" height="4" fill="#e88ca5"/><rect x="12" y="24" width="8" height="3" fill="#52617e"/>',
    sun:'<rect x="12" y="12" width="8" height="8" fill="#ffd56e"/><rect x="14" y="3" width="4" height="7" fill="#ffd56e"/><rect x="14" y="22" width="4" height="7" fill="#ffd56e"/><rect x="3" y="14" width="7" height="4" fill="#ffd56e"/><rect x="22" y="14" width="7" height="4" fill="#ffd56e"/><rect x="6" y="6" width="5" height="5" fill="#ffd56e"/><rect x="21" y="6" width="5" height="5" fill="#ffd56e"/><rect x="6" y="21" width="5" height="5" fill="#ffd56e"/><rect x="21" y="21" width="5" height="5" fill="#ffd56e"/>',
    school:'<rect x="3" y="12" width="26" height="16" fill="#f4c37b"/><path d="M2 13L16 3l14 10" fill="#e77e86"/><rect x="12" y="18" width="8" height="10" fill="#8a5b60"/><rect x="6" y="16" width="4" height="5" fill="#9bd9e7"/><rect x="22" y="16" width="4" height="5" fill="#9bd9e7"/><rect x="14" y="7" width="4" height="4" fill="#fff0cf"/>',
    heart:'<path d="M16 27L5 16V9h7l4 4 4-4h7v7z" fill="#e77d91"/><rect x="8" y="6" width="5" height="5" fill="#e77d91"/><rect x="19" y="6" width="5" height="5" fill="#e77d91"/>'
  };
  const sprite = (kind, cls="") => `<svg class="pixel-sprite ${cls}" viewBox="0 0 32 32" role="img" aria-label="${kind}" shape-rendering="crispEdges">${spriteRects[kind] || spriteRects.rice}</svg>`;
  const foodIcon = item => sprite(item.sprite, "food-sprite");

  // Migrate existing V4 accounts without erasing their saved progress.
  store.updateCurrentUser(record => {
    if (!record.economyInitialized) {
      record.wallet = Math.max(Number(record.wallet || 0), STARTING_CASH);
      record.trust = 100; record.day = 1; record.month = 1; record.monthRevenue = 0;
      record.bankrupt = false; record.economyInitialized = true;
    }
    record.upgrades = record.upgrades || { stove:0, grill:0, fryer:0, drink:0 };
  });
  user = store.getCurrentUser();

  let active=false, score=0, lives=3, queue=[], cooking={}, inventory={}, payment=null;
  let wallet=Number(user.wallet||0), best=Number(user.best||0), trust=Number(user.trust ?? 100);
  let day=Number(user.day||1), month=Number(user.month||1), monthRevenue=Number(user.monthRevenue||0);
  let serial=1, baseCustomerGoal=0, customerGoal=0, customersCreated=0, customersServed=0, customersLost=0;
  let lastTick=0, spawnTimer=0, raf=0, toastTimer=0, uiAccumulator=0, bankrupt=!!user.bankrupt;

  const safe = value => String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const getItem = id => menu.find(item=>item.id===id);
  const level = id => (store.getCurrentUser()?.upgrades||{})[id]||0;
  const current = () => queue[0]||null;
  const total = order => Object.keys(order.items).reduce((sum,id)=>sum+getItem(id).price,0);
  const portions = id => inventory[id] || [];
  const availablePortion = id => portions(id).filter(p=>p.quality>0).sort((a,b)=>b.quality-a.quality)[0] || null;
  const allReady = order => !!order && Object.keys(order.items).every(id=>!!availablePortion(id));
  const averageQuality = order => { const qs=Object.keys(order.items).map(id=>availablePortion(id)?.quality||0); return qs.reduce((a,b)=>a+b,0)/(qs.length||1); };

  function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1900);}
  function setStatus(message){$("gameStatus").textContent=message;}
  function saveProgress(){store.updateCurrentUser(record=>{record.wallet=wallet;record.best=Math.max(record.best||0,best);record.trust=trust;record.day=day;record.month=month;record.monthRevenue=monthRevenue;record.bankrupt=bankrupt;});}
  function foodState(item, quality){if(quality>=80)return item.temp==="hot"?"HOT & FRESH":"COLD & FRESH";if(quality>=55)return item.temp==="hot"?"WARM":"COOL";if(quality>=30)return item.temp==="hot"?"LOSING HEAT":"LOSING CHILL";return "STALE";}
  function qualityClass(q){return q>=80?"quality-good":q>=55?"quality-mid":"quality-low";}

  function newOrder(){
    if(customersCreated>=customerGoal)return null;
    const count=Math.random()<.22?1:(Math.random()<.78?2:3), ids=[];
    while(ids.length<count){const id=menu[Math.floor(Math.random()*menu.length)].id;if(!ids.includes(id))ids.push(id);}
    const items={};ids.forEach(id=>items[id]=1);customersCreated++;
    return {id:serial++,name:names[Math.floor(Math.random()*names.length)],sprite:Math.floor(Math.random()*4),items,patience:68,maxPatience:68};
  }

  function renderHUD(){
    $("scoreValue").textContent=score.toLocaleString("id-ID");$("walletValue").textContent=fmt(wallet);$("bestValue").textContent=best.toLocaleString("id-ID");
    $("lifeValue").innerHTML=Array.from({length:3},(_,i)=>sprite("heart",`life-heart ${i<lives?"":"heart-empty"}`)).join("");
    $("queueCount").textContent=queue.length;$("customerProgress").textContent=`${customersCreated}/${customerGoal}`;
    $("trustValue").textContent=`${Math.round(trust)}%`;$("trustFill").style.width=`${Math.max(0,trust)}%`;
    $("dayValue").textContent=`HARI ${day}/30`;$("monthValue").textContent=`BULAN ${month}`;
  }

  function renderQueue(){
    const el=$("queueList");if(!queue.length){el.innerHTML='<div class="empty-state">Antrean kosong. Pelanggan berikutnya akan datang sebentar lagi.</div>';return;}
    el.innerHTML=queue.map((order,index)=>{const pct=Math.max(0,order.patience/order.maxPatience*100);const text=Object.keys(order.items).map(id=>`${foodIcon(getItem(id))} ${getItem(id).name}`).join(" ");return `<article class="queue-card ${index===0?"active":""}"><div class="customer-line"><span class="customer-avatar student-style-${order.sprite}" aria-hidden="true"></span><div class="customer-info"><b>${safe(order.name)} ${index===0?"· Pesanan aktif":""}</b><small>Antrean #${index+1}</small></div></div><div class="queue-order">${text}</div><div class="patience-label"><span>Kesabaran</span><span>${Math.ceil(order.patience)} dtk</span></div><div class="patience-track"><div class="patience-fill ${pct<35?"low":""}" style="width:${pct}%"></div></div></article>`;}).join("");
  }

  function renderStations(){
    const el=$("stationGrid");
    el.innerHTML=stations.map(st=>{
      const foods=menu.filter(item=>item.station===st.id), stationLevel=level(st.id), busy=foods.filter(item=>cooking[item.id]>0).length;
      const buttons=foods.map(item=>{
        const remaining=cooking[item.id]||0, isCooking=remaining>0, stock=portions(item.id).length, maxStock=4;
        const duration=cookDuration[st.id]*Math.pow(.88,stationLevel), pct=isCooking?Math.max(0,Math.min(100,(1-remaining/duration)*100)):0;
        const disabled=!active||isCooking||stock>=maxStock;
        const state=!active?"Kantin tutup":isCooking?`Memasak ${remaining.toFixed(1)} dtk`:stock>=maxStock?"Stok penuh · 4 porsi":stock?`Stok siap saji: ${stock}`:"Siap dimasak · 1 porsi";
        return `<button class="food-button ${isCooking?"is-cooking":""}" data-prepare="${item.id}" ${disabled?"disabled":""}><span class="food-icon-wrap">${foodIcon(item)}</span><span class="food-label">${item.name}<small>${state}</small></span><span class="food-price">${fmt(item.price)}</span>${isCooking?`<span class="food-progress"><i style="width:${pct}%"></i></span>`:""}</button>`;
      }).join("");
      return `<article class="station-card"><div class="station-top"><span class="station-icon-wrap">${sprite(st.sprite)}</span><div class="station-title"><b>${st.name}</b><small>${st.desc}</small></div><span class="station-level">Lv.${stationLevel+1}</span></div><div class="cooldown-info"><span>${busy?`${busy} proses berjalan`:"Semua alat siap"}</span><b>${busy?"COOKING":"READY"}</b></div><div class="cooldown-track"><div class="cooldown-fill" style="width:${busy?100:0}%"></div></div><div class="station-foods">${buttons}</div><div class="cooldown-note">Bisa memasak tanpa menunggu pesanan · 1 porsi/proses</div></article>`;
    }).join("");
    el.querySelectorAll("[data-prepare]").forEach(btn=>btn.addEventListener("click",()=>prepare(btn.dataset.prepare)));
  }

  function updateCookingVisuals(){
    document.querySelectorAll("#stationGrid [data-prepare]").forEach(btn=>{const id=btn.dataset.prepare,item=getItem(id),remaining=cooking[id]||0;if(!item||remaining<=0)return;const duration=cookDuration[item.station]*Math.pow(.88,level(item.station));const pct=Math.max(0,Math.min(100,(1-remaining/duration)*100));const small=btn.querySelector(".food-label small"),bar=btn.querySelector(".food-progress i");if(small)small.textContent=`Memasak ${remaining.toFixed(1)} dtk`;if(bar)bar.style.width=`${pct}%`;});
  }

  function renderInventory(){
    const entries=menu.filter(item=>portions(item.id).length);
    $("inventoryList").innerHTML=entries.length?entries.map(item=>portions(item.id).map((portion,index)=>`<div class="inventory-item"><span>${foodIcon(item)}</span><div class="inventory-detail"><b>${item.name} · Porsi ${index+1}</b><small>${foodState(item,portion.quality)}</small><div class="quality-track"><i class="${qualityClass(portion.quality)}" style="width:${portion.quality}%"></i></div></div><strong>${Math.round(portion.quality)}%</strong></div>`).join("")).join(""):'<span class="muted">Belum ada makanan siap saji. Kamu bisa mulai memasak menu apa pun!</span>';
  }

  function renderCashier(){
    const el=$("cashierContent"),order=current();if(!order){el.innerHTML='<div class="cashier-empty"><span class="pixel-cash">$</span><b>Belum ada transaksi</b><small>Pesanan pelanggan akan muncul di sini.</small></div>';return;}
    const rows=Object.keys(order.items).map(id=>{const item=getItem(id),portion=availablePortion(id);return `<div class="cash-item"><span>${foodIcon(item)} ${item.name} <small data-cash-food="${id}">(${portion?foodState(item,portion.quality):"belum tersedia"})</small></span><span>${fmt(item.price)}</span></div>`;}).join("");
    let actions="";if(!allReady(order))actions='<button class="button cashier-action" disabled>Menunggu stok makanan siap</button>';else if(!payment)actions='<button class="button cashier-action" id="requestPaymentBtn">Minta Pembayaran</button>';else{const remaining=payment.change-payment.given;actions=`<div class="payment-box"><h3>PEMBAYARAN PELANGGAN</h3><div class="payment-line"><span>Uang diterima</span><strong>${fmt(payment.paid)}</strong></div><div class="payment-line"><span>Kembalian</span><strong>${fmt(payment.change)}</strong></div><div class="payment-line"><span>Sudah diberikan</span><strong>${fmt(payment.given)}</strong></div>${payment.change?`<div class="change-buttons">${coins.map(v=>`<button class="coin-button" data-coin="${v}" ${payment.given+v>payment.change?"disabled":""}>+${fmt(v)}</button>`).join("")}</div>`:""}<div class="change-progress">${remaining===0?"Kembalian tepat!":"Sisa kembalian: "+fmt(remaining)}</div><button class="button cashier-action" id="finishPaymentBtn" ${remaining!==0?"disabled":""}>Serahkan & Selesaikan</button></div>`;}
    el.innerHTML=`<div class="cash-order-title">PESANAN #${order.id} · ${safe(order.name)}</div><div class="cash-order-items">${rows}</div><div class="cash-total"><span>TOTAL TAGIHAN</span><span>${fmt(total(order))}</span></div>${actions}`;
    const request=$("requestPaymentBtn");if(request)request.addEventListener("click",requestPayment);el.querySelectorAll("[data-coin]").forEach(btn=>btn.addEventListener("click",()=>addChange(Number(btn.dataset.coin))));const finish=$("finishPaymentBtn");if(finish)finish.addEventListener("click",finishOrder);
  }

  function updateCashierFreshness(){
    document.querySelectorAll("[data-cash-food]").forEach(el=>{const item=getItem(el.dataset.cashFood),portion=availablePortion(el.dataset.cashFood);el.textContent=`(${portion?foodState(item,portion.quality):"stok tidak tersedia"})`;});
  }

  function renderUpgrades(){
    $("upgradeGrid").innerHTML=stations.map(st=>{const lv=level(st.id),cost=upgradeCost[st.id]*(lv+1),max=lv>=5;return `<article class="upgrade-card"><span class="station-icon-wrap">${sprite(st.sprite)}</span><b>${st.name}</b><small>Level ${lv+1}/6<br>${max?"Kecepatan maksimum":"Waktu masak lebih cepat"}</small><button class="upgrade-button" data-upgrade="${st.id}" ${max||wallet<cost?"disabled":""}>${max?"MAX":"UPGRADE · "+fmt(cost)}</button></article>`;}).join("");
    $("upgradeGrid").querySelectorAll("[data-upgrade]").forEach(btn=>btn.addEventListener("click",()=>upgrade(btn.dataset.upgrade)));
  }
  function renderAll(){renderHUD();renderQueue();renderStations();renderInventory();renderCashier();renderUpgrades();}

  function prepare(id){
    if(!active)return;const item=getItem(id);if(!item||cooking[id]>0||portions(id).length>=4)return;
    const duration=cookDuration[item.station]*Math.pow(.88,level(item.station));cooking[id]=duration;
    setStatus(`Memasak ${item.name}`);$("kitchenHint").textContent=`${item.name} sedang dimasak. Menu lain tetap bisa dimasak bersamaan. Setiap proses menghasilkan satu porsi.`;toast(`${item.name}: proses memasak dimulai.`);renderStations();
  }

  function requestPayment(){const order=current();if(!active||!order||payment||!allReady(order))return;const sum=total(order),rounded=Math.ceil(sum/5000)*5000,paid=Math.random()<.32?rounded+5000:rounded;payment={paid,change:paid-sum,given:0};setStatus("Menunggu uang kembalian");renderCashier();toast("Pembayaran diterima. Berikan kembalian dengan tepat!");}
  function addChange(value){if(!payment||payment.given+value>payment.change)return;payment.given+=value;renderCashier();}

  function updateTrust(delta, reason){trust=Math.max(0,Math.min(100,trust+delta));$("trustMessage").textContent=reason;saveProgress();if(trust<=0){declareBankruptcy("Kepercayaan pelanggan habis dan tidak ada siswa yang datang lagi.");}}
  function finishOrder(){
    const order=current();if(!active||!order||!payment||payment.given!==payment.change)return;
    const quality=averageQuality(order),sum=total(order);Object.keys(order.items).forEach(id=>{const arr=inventory[id]||[];const idx=arr.reduce((bestIdx,p,i)=>p.quality> (arr[bestIdx]?.quality??-1)?i:bestIdx,-1);if(idx>=0)arr.splice(idx,1);if(!arr.length)delete inventory[id];});
    let trustDelta=quality>=88?2:quality>=72?1:quality>=55?0:quality>=35?-2:-4;
    updateTrust(trustDelta,quality>=88?"Pelanggan menyukai makanan yang masih segar!":quality>=72?"Kualitas makanan baik.":quality>=55?"Makanan mulai kehilangan suhu ideal.":"Makanan kurang segar; reputasi toko menurun.");
    if(!active)return;
    score+=25+Object.keys(order.items).length*10+Math.round(sum/1000);wallet+=sum;monthRevenue+=sum;best=Math.max(best,score);queue.shift();customersServed++;payment=null;saveProgress();setStatus("Pesanan berhasil dilayani!");toast(`Pesanan selesai · kualitas ${Math.round(quality)}% · +${fmt(sum)}`);
    if(customersCreated>=customerGoal&&queue.length===0){renderAll();completeShift();return;}
    if(queue.length===0&&customersCreated<customerGoal){const next=newOrder();if(next)queue.push(next);}spawnTimer=Math.max(3.5,6.5-Math.floor(score/180)*.3);renderAll();
  }

  function upgrade(id){const lv=level(id);if(lv>=5)return;const cost=upgradeCost[id]*(lv+1);if(wallet<cost){toast("Uang kantin belum cukup.");return;}wallet-=cost;store.updateCurrentUser(record=>{record.wallet=wallet;record.upgrades=record.upgrades||{};record.upgrades[id]=lv+1;});toast(`${stations.find(st=>st.id===id).name} berhasil di-upgrade!`);renderAll();}

  function loseCustomer(order){const wasCurrent=current()?.id===order.id;queue=queue.filter(x=>x.id!==order.id);customersLost++;lives=Math.max(0,lives-1);updateTrust(-3,`${order.name} pergi karena menunggu terlalu lama. Kepercayaan pelanggan turun.`);if(!active)return; if(wasCurrent)payment=null;setStatus("Pelanggan kehilangan kesabaran");toast(`${order.name} pergi. Kepercayaan toko -3%.`);if(lives<=0){endShiftEarly();return;}if(!queue.length&&customersCreated<customerGoal){const next=newOrder();if(next)queue.push(next);}renderAll();}

  function monthlySettlement(){
    const ingredientCost=Math.max(MIN_INGREDIENT_COST,Math.round(monthRevenue*INGREDIENT_RATE));const totalCost=RENT_PER_MONTH+ingredientCost;const before=wallet;wallet-=totalCost;
    store.updateCurrentUser(record=>{record.wallet=wallet;record.lastRent=RENT_PER_MONTH;record.lastIngredientCost=ingredientCost;record.lastMonthlyBill=totalCost;});
    monthRevenue=0;day=1;month++;
    if(wallet<0){declareBankruptcy(`Tagihan bulanan ${fmt(totalCost)} tidak dapat dibayar. Toko kehabisan modal.`);return {rent:RENT_PER_MONTH,ingredients:ingredientCost,total:totalCost,before};}
    saveProgress();return {rent:RENT_PER_MONTH,ingredients:ingredientCost,total:totalCost,before};
  }

  function tick(now){
    if(!active)return;const delta=Math.min(.25,Math.max(0,(now-lastTick)/1000));lastTick=now;let stationChanged=false,inventoryChanged=false;
    Object.keys(cooking).forEach(id=>{cooking[id]=Math.max(0,cooking[id]-delta);if(cooking[id]===0){delete cooking[id];inventory[id]=inventory[id]||[];inventory[id].push({quality:100,age:0,maxAge:getItem(id).life});stationChanged=true;inventoryChanged=true;toast(`${getItem(id).name} selesai · 1 porsi siap!`);}});
    Object.keys(inventory).forEach(id=>{const arr=inventory[id];arr.forEach(p=>{p.age+=delta;p.quality=Math.max(0,100-(p.age/p.maxAge)*100);});const spoiled=arr.filter(p=>p.quality<=0).length;if(spoiled){inventory[id]=arr.filter(p=>p.quality>0);inventoryChanged=true;toast(`${getItem(id).name} sudah tidak layak disajikan dan dibuang.`);}if(!inventory[id].length)delete inventory[id];});
    queue.forEach(order=>order.patience=Math.max(0,order.patience-delta));const expired=queue.find(order=>order.patience<=0);if(expired){loseCustomer(expired);if(!active)return;}
    spawnTimer-=delta;if(queue.length<3&&spawnTimer<=0&&customersCreated<customerGoal){const next=newOrder();if(next)queue.push(next);spawnTimer=5+Math.random()*2.5;}
    if(customersCreated>=customerGoal&&queue.length===0){completeShift();return;}
    if(stationChanged)renderStations();else updateCookingVisuals();if(inventoryChanged){renderInventory();renderCashier();}
    updateCashierFreshness();uiAccumulator+=delta;if(uiAccumulator>=.22){uiAccumulator=0;renderHUD();renderQueue();}raf=requestAnimationFrame(tick);
  }

  function modal(kicker,title,text,stats,buttonText,action,kind="shop"){
    $("modalEmoji").innerHTML=sprite(kind,"modal-pixel-sprite");$("modalEyebrow").textContent=kicker;$("modalTitle").textContent=title;$("modalText").textContent=text;$("modalStats").innerHTML=stats.map(([label,value])=>`<div class="modal-stat">${label}: <b>${value}</b></div>`).join("");$("modalPrimary").textContent=buttonText;$("modalPrimary").onclick=action;$("gameModal").classList.add("show");
  }
  function hideModal(){$("gameModal").classList.remove("show");}

  function declareBankruptcy(reason){
    if(bankrupt)return;active=false;if(raf)cancelAnimationFrame(raf);bankrupt=true;saveProgress();$("startGameBtn").disabled=true;setStatus("TOKO BANGKRUT");renderAll();
    modal("BANKRUPTCY","TOKO BANGKRUT",reason+" Semua kemajuan usaha akan dihapus jika kamu memilih memulai kembali.",[["Kepercayaan",`${Math.round(trust)}%`],["Uang tersisa",fmt(wallet)],["Hari",`Bulan ${month}, hari ${day}`]],"MULAI DARI AWAL",resetFromZero,"school");
  }
  function resetFromZero(){
    store.updateCurrentUser(record=>{record.wallet=STARTING_CASH;record.best=0;record.trust=100;record.day=1;record.month=1;record.monthRevenue=0;record.upgrades={stove:0,grill:0,fryer:0,drink:0};record.bankrupt=false;record.economyInitialized=true;record.lastRent=0;record.lastIngredientCost=0;record.lastMonthlyBill=0;});
    user=store.getCurrentUser();wallet=STARTING_CASH;best=0;trust=100;day=1;month=1;monthRevenue=0;bankrupt=false;hideModal();start();
  }

  function start(){
    if(active||bankrupt)return;if(trust<=0){declareBankruptcy("Kepercayaan pelanggan habis dan tidak ada siswa yang datang lagi.");return;}if(raf)cancelAnimationFrame(raf);active=true;score=0;lives=3;queue=[];cooking={};inventory={};payment=null;serial=1;
    baseCustomerGoal=Math.floor(Math.random()*41)+60;customerGoal=trust<=0?0:Math.max(1,Math.round(baseCustomerGoal*(trust/100)));
    customersCreated=0;customersServed=0;customersLost=0;spawnTimer=4;uiAccumulator=0;lastTick=performance.now();
    const first=newOrder(),second=newOrder();if(first)queue.push(first);if(second)queue.push(second);
    $("startGameBtn").disabled=true;$("startGameBtn").textContent="KANTIN SEDANG BUKA";setStatus("Melayani pelanggan");$("kitchenHint").textContent=`Hari ${day}, bulan ${month}. Target pelanggan hari ini ${customerGoal} orang (potensi normal ${baseCustomerGoal}). Masak menu apa pun; setiap proses menghasilkan satu porsi.`;$("trustMessage").textContent="Jaga suhu dan kesegaran setiap sajian.";hideModal();renderAll();raf=requestAnimationFrame(tick);
  }

  function advanceDay(){
    if(!active)return;active=false;if(raf)cancelAnimationFrame(raf);best=Math.max(best,score);day++;let bill=null;
    if(day>DAY_LENGTH)bill=monthlySettlement();saveProgress();$("startGameBtn").disabled=!!bankrupt;$("startGameBtn").textContent="▶ MULAI HARI BERIKUTNYA";setStatus(bankrupt?"TOKO BANGKRUT":"Hari selesai");renderAll();if(bankrupt)return;
    const stats=[["Pelanggan datang",customersCreated],["Dilayani",customersServed],["Pergi",customersLost],["Kepercayaan",`${Math.round(trust)}%`],["Skor hari ini",score]];
    if(bill){stats.push(["Sewa tempat",fmt(bill.rent)],["Bahan makanan",fmt(bill.ingredients)],["Total pengeluaran",fmt(bill.total)]);}
    modal("DAY COMPLETE","DAY COMPLETE",bill?`Bulan ${month-1} selesai. Tagihan bulanan sudah dibayar.`:`Hari ${day-1} selesai. Kantin siap menyambut hari berikutnya.`,stats,"LANJUT KE HARI BERIKUTNYA",start,"school");
  }
  function completeShift(){if(!active)return;advanceDay();}
  function endShiftEarly(){if(!active)return;active=false;if(raf)cancelAnimationFrame(raf);best=Math.max(best,score);saveProgress();$("startGameBtn").disabled=false;$("startGameBtn").textContent="▶ COBA HARI INI LAGI";setStatus("Shift berakhir lebih awal");renderAll();modal("SHIFT ENDED","SHIFT ENDED","Pelanggan Terlalu Lama Menunggu","Tiga pelanggan kehilangan kesabaran. Kamu bisa mencoba hari yang sama lagi, tetapi kepercayaan pelanggan yang hilang tetap berpengaruh.",[["Pelanggan dilayani",customersServed],["Pelanggan pergi",customersLost],["Kepercayaan",`${Math.round(trust)}%`],["Skor",score]],"COBA LAGI",start,"school");}

  function intro(){
    if(bankrupt){modal("BANKRUPTCY","TOKO BANGKRUT","Usaha Harus Dimulai Kembali","Toko ini sudah bangkrut. Untuk bermain lagi, seluruh uang, upgrade, dan skor akan direset.",[["Status","Bangkrut"],["Modal awal",fmt(STARTING_CASH)]],"MULAI DARI AWAL",resetFromZero,"school");return;}
    modal("WELCOME","SCHOOL CANTEEN","Kantin Siap Dibuka?","Masak menu apa pun tanpa menunggu pesanan. Setiap proses menghasilkan satu porsi. Jaga makanan tetap panas/minuman tetap dingin, pertahankan kepercayaan, dan bayar biaya bulanan.",[["Hari",`Bulan ${month} · Hari ${day}`],["Kepercayaan",`${Math.round(trust)}%`],["Pelanggan normal","60–100 / hari"]],"MULAI BERMAIN",start,"school");
  }

  $("startGameBtn").addEventListener("click",()=>{if(bankrupt)intro();else start();});
  $("restartGameBtn").addEventListener("click",()=>{if(bankrupt){intro();return;}active=false;if(raf)cancelAnimationFrame(raf);start();});
  $("gameUsername").textContent=user.username.toUpperCase();
  renderAll();intro();
})();
