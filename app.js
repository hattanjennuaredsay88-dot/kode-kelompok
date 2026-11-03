/* Demo account storage: Local Storage is for learning projects, not production auth. */
(() => {
 const USERS_KEY="scs_users_v1", SESSION_KEY="scs_current_user_v1";
 const getUsers=()=>{try{return JSON.parse(localStorage.getItem(USERS_KEY)||"{}")}catch{return {}}};
 const saveUsers=users=>localStorage.setItem(USERS_KEY,JSON.stringify(users));
 const currentName=()=>localStorage.getItem(SESSION_KEY);
 const message=(el,text,type)=>{if(el){el.textContent=text;el.className="form-message "+type}};
 const money=n=>"Rp"+Math.max(0,Math.floor(n)).toLocaleString("id-ID");
 const register=document.getElementById("registerForm");
 if(register)register.addEventListener("submit",e=>{
  e.preventDefault();const username=document.getElementById("regUsername").value.trim(),password=document.getElementById("regPassword").value,confirm=document.getElementById("regConfirm").value,msg=document.getElementById("registerMessage");
  if(!username||!password||!confirm)return message(msg,"Semua kolom wajib diisi.","error");
  if(!/^[a-zA-Z0-9_]{3,18}$/.test(username))return message(msg,"Nama pengguna harus 3–18 karakter (huruf, angka, atau _).","error");
  if(password.length<6)return message(msg,"Kata sandi minimal 6 karakter.","error");
  if(password!==confirm)return message(msg,"Konfirmasi kata sandi tidak cocok.","error");
  const users=getUsers(),key=username.toLowerCase();if(users[key])return message(msg,"Nama pengguna sudah terdaftar. Pilih nama lain.","error");
  users[key]={username,password,wallet:350000,best:0,trust:100,day:1,month:1,monthRevenue:0,economyInitialized:true,bankrupt:false,upgrades:{stove:0,grill:0,fryer:0,drink:0}};saveUsers(users);message(msg,"Registrasi berhasil! Mengalihkan ke halaman login…","success");register.reset();setTimeout(()=>location.href="login.html",850);
 });
 const login=document.getElementById("loginForm");
 if(login)login.addEventListener("submit",e=>{e.preventDefault();const username=document.getElementById("loginUsername").value.trim(),password=document.getElementById("loginPassword").value,user=getUsers()[username.toLowerCase()];if(!user||user.password!==password)return message(document.getElementById("loginMessage"),"Nama pengguna atau kata sandi salah.","error");localStorage.setItem(SESSION_KEY,user.username);message(document.getElementById("loginMessage"),"Login berhasil! Membuka dashboard…","success");setTimeout(()=>location.href="dashboard.html",650)});
 const dashboardName=document.getElementById("dashboardName");
 if(dashboardName){const name=currentName();if(!name){location.href="login.html";return}const u=getUsers()[name.toLowerCase()]||{};dashboardName.textContent=name;const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};set("dashboardWallet",money(u.wallet||0));set("dashboardBest",u.best||0);set("dashboardTrust",`${Math.round(u.trust??100)}%`);set("dashboardCalendar",`Bulan ${u.month||1} · Hari ${u.day||1}`);set("dashboardUpgrades",Object.values(u.upgrades||{}).reduce((a,b)=>a+b,0));}
 const logout=document.getElementById("logoutBtn");if(logout)logout.addEventListener("click",()=>{localStorage.removeItem(SESSION_KEY);location.href="index.html"});
 window.CanteenStore={getUsers,saveUsers,currentName,money,getCurrentUser(){const name=currentName();if(!name)return null;const key=name.toLowerCase(),u=getUsers()[key];return u?{...u,key}:null},updateCurrentUser(mutator){const current=this.getCurrentUser();if(!current)return null;const users=getUsers(),next={...users[current.key]};mutator(next);users[current.key]=next;saveUsers(users);return next}};
})();
