/* =========================================================
   DAXATOR PACKAGES — app
   ========================================================= */
(function(){
const {esc,fLong,addDays,ymd}=DOCS.util;
const $=id=>document.getElementById(id), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='dx_pk_v1';
const clone=o=>JSON.parse(JSON.stringify(o));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const pad3=n=>String(n).padStart(3,'0');
const r500=n=>Math.round(n/500)*500;
const rs=n=>'Rs '+Math.round(n||0).toLocaleString('en-US');
const today=()=>ymd(new Date());
const invNo=n=>'DAX'+pad3(n), agrNo=n=>'DAX-AGR-'+pad3(n);

/* ---------------- icons ---------------- */
const I={
 box:'<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
 cam:'<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
 print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
 doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 13h6M9 17h4"/>',
 word:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 12l1.5 6 2.5-4 2.5 4 1.5-6"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
 calc:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h3.5"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
 chev:'<path d="M6 9l6 6 6-6"/>', edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>', down:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>', up:'<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
 wa:'<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5z"/>', phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
 check:'<path d="M5 12l5 5L20 7"/>', link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
 refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
 bars:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
const ic=(n,s='')=>`<svg viewBox="0 0 24 24" ${s}>${I[n]}</svg>`;

/* ---------------- defaults ---------------- */
const DEF_PK=[
 {id:'starter',name:'Starter',monthly:true,tag:'Start posting properly',per:8750,reels:8,visits:2,photos:10,films:0,stories:false,posting:false,extras:['Trending audio + captions'],
  why:'The easy first step. We shoot at your place twice a month, so you can post 2 good reels every week.'},
 {id:'growth',name:'Growth',monthly:true,rec:true,tag:'Post every week, look premium',per:7500,reels:12,visits:4,photos:15,films:1,stories:true,posting:false,extras:['Monthly content plan'],
  why:'Our most chosen plan. We shoot every week so your page never goes quiet, plus one proper ad film you can run as a paid ad.'},
 {id:'premium',name:'Premium',monthly:true,tag:'We handle everything',per:7000,reels:20,visits:4,photos:25,films:2,stories:true,posting:true,extras:['1 event covered','Monthly results report'],
  why:'For big brands that want zero hassle. We shoot, edit, cover your event and post on your Instagram. You just approve.'},
 {id:'onetime',name:'One-Time Shoot',monthly:false,tag:'One shoot, no monthly plan',per:11000,reels:6,visits:1,photos:10,films:0,stories:false,posting:false,extras:[],
  why:'Need content just once? New menu, opening or a special day. We come for one day and shoot everything. Pay once, no commitment.'}
];
const DEF_RATES={visit:5000,photo:500,film:25000,stories:7500,posting:20000};
const DEF_COSTS={editor:2000,travel:1500,photo:100,film:8000};
const DEF_BIZ={name:'Daxator Studios',owner:'Daniyal Murtaza',ntn:'',phone:'+971 58 599 5304',email:'',addr:'Karachi, Pakistan',pay:'',upfront:50,tax:0,due:3,invNext:1,agrNext:1,fx:280,upFee:10};
const DEF_BONUS='First 3 restaurants: your first ad film is free';
const DEF_CALC={base:'growth',reels:12,visits:4,photos:15,films:1,stories:true,posting:false,term:1};

let st={v:7,dcur:'PKR',trials:[],pk:clone(DEF_PK),rates:clone(DEF_RATES),costs:clone(DEF_COSTS),disc3:10,bonusOn:true,bonus:DEF_BONUS,calc:clone(DEF_CALC),t3:false,
  biz:clone(DEF_BIZ),clients:[],docs:[],tpl:clone(DOCS.DEF_TPL)};
const OLDMAP={essential:'starter',signature:'growth',flagship:'premium'};
function load(){try{const s=localStorage.getItem(KEY);if(!s)return;const o=JSON.parse(s);applyData(o,true)}catch(e){console.warn(e)}}
function applyData(o,withSettings){
  if(Array.isArray(o.trials))st.trials=o.trials.map(t=>({...t,pkg:OLDMAP[t.pkg]||t.pkg||''}));
  if(Array.isArray(o.clients))st.clients=o.clients;
  if(Array.isArray(o.docs))st.docs=o.docs;
  if(!withSettings)return;
  if(Array.isArray(o.pk)&&o.pk.every(p=>p.per!=null))st.pk=DEF_PK.map(d=>({...d,...(o.pk.find(p=>p.id===d.id)||{})}));
  if(o.rates&&o.rates.visit!=null)st.rates={...DEF_RATES,...o.rates};
  ['disc3','bonusOn','bonus','t3','dcur'].forEach(k=>{if(o[k]!==undefined)st[k]=o[k]});
  if(o.costs)st.costs={...DEF_COSTS,...o.costs};
  if(o.biz)st.biz={...DEF_BIZ,...o.biz};
  if(o.tpl)st.tpl={...DOCS.DEF_TPL,...o.tpl};
  if(o.calc&&o.calc.base)st.calc={...DEF_CALC,...o.calc};
}
let saveWarned=false;
function save(){_save()}
function migrate(){st.docs.forEach(d=>{if(!d.kind)d.kind='package';if(!d.currency)d.currency='PKR';if(d.type==='invoice'&&!(+d.fx>0))d.fx=+st.biz.fx||280;if(d.type==='agreement'&&!['sent','signed'].includes(d.status))d.status='sent'})}
load();migrate();
/* ---------------- cloud sync (Vercel storage) ----------------
   The cloud copy is the real one. This device keeps a cache so the app opens instantly and works offline. */
const SYK='dx_sync_v1',RECS=['trials','clients','docs'],SETK=['pk','rates','costs','disc3','bonusOn','bonus','calc','t3','biz','tpl','dcur'];
let sy=(()=>{try{return JSON.parse(localStorage.getItem(SYK))||{}}catch(e){return{}}})();
sy.rev=+sy.rev||0;sy.snap=sy.snap||{};
const cloud={on:null,state:'idle',busy:false,again:false,last:0,timer:0};
const hs=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h};
const recHash=r=>{const{_t,...x}=r;return hs(JSON.stringify(x))};
const setHash=()=>hs(JSON.stringify(SETK.map(k=>st[k])));
function persistSy(){try{localStorage.setItem(SYK,JSON.stringify(sy))}catch(e){}}
function stamp(){const now=Date.now(),seen={};st.del=st.del||{};
  RECS.forEach(k=>st[k].forEach(r=>{if(!r||!r.id)return;const h=recHash(r);seen[r.id]=h;
    if(!sy.init){if(!r._t)r._t=Date.parse(r.updated||r.created||'')||1}else if(sy.snap[r.id]!==h)r._t=now}));
  if(sy.init)Object.keys(sy.snap).forEach(id=>{if(!(id in seen))st.del[id]=now});
  const sh=setHash();if(sy.init&&sy.setHash!==undefined&&sy.setHash!==sh)st.setT=now;
  sy.snap=seen;sy.setHash=sh;sy.init=1}
function resnap(){const seen={};RECS.forEach(k=>st[k].forEach(r=>{if(r&&r.id)seen[r.id]=recHash(r)}));sy.snap=seen;sy.setHash=setHash();sy.init=1}
function writeLocal(){try{st.v=7;localStorage.setItem(KEY,JSON.stringify(st))}catch(e){if(!saveWarned){saveWarned=true;toast('⚠️ Couldn’t save on this device.',4000)}}}
const custom=o=>['biz','pk','tpl','rates'].some(k=>o&&o[k]&&JSON.stringify(o[k])!==JSON.stringify({biz:DEF_BIZ,pk:DEF_PK,tpl:DOCS.DEF_TPL,rates:DEF_RATES}[k]));
function takeSettings(S){applyData({...S,trials:null,clients:null,docs:null},true);st.setT=S.setT||0}
function mergeIn(S){if(!S)return;const now=Date.now(),del={...(S.del||{})};Object.entries(st.del||{}).forEach(([id,t])=>del[id]=Math.max(+t||0,+del[id]||0));
  RECS.forEach(k=>{const m=new Map();(S[k]||[]).forEach(r=>r&&r.id&&m.set(r.id,r));(st[k]||[]).forEach(r=>{if(!r||!r.id)return;const o=m.get(r.id);if(!o||(+r._t||0)>=(+o._t||0))m.set(r.id,r)});
    st[k]=[...m.values()].filter(r=>!(del[r.id]&&del[r.id]>=(+r._t||0)))});
  // same client saved on two devices under different ids -> keep one
  const byName={};st.clients.slice().sort((a,b)=>String(a.created||'').localeCompare(String(b.created||''))).forEach(c=>{const n=String(c.biz||'').trim().toLowerCase();
    if(!n)return;const keep=byName[n];if(!keep){byName[n]=c;return}
    ['person','phone','email','addr','ntn','source'].forEach(f=>{if(!keep[f]&&c[f])keep[f]=c[f]});st.docs.forEach(d=>{if(d.clientId===c.id)d.clientId=keep.id});del[c.id]=now;keep._t=now});
  // same invoice saved twice -> keep the newest edit
  const seen={};st.docs.slice().sort((a,b)=>(+b._t||0)-(+a._t||0)).forEach(d=>{const k=[d.type,String(d.no||'').toUpperCase(),d.date,Math.round((d.money?.total||0)*100),String(d.client?.biz||'').trim().toLowerCase()].join('|');
    if(d.no&&seen[k])del[d.id]=now;else seen[k]=1});
  RECS.forEach(k=>st[k]=st[k].filter(r=>!(del[r.id]&&del[r.id]>=(+r._t||0))));
  const sT=+S.setT||0,lT=+st.setT||0;if(sT>lT||(sT===lT&&!custom(st)&&custom(S)))takeSettings(S);
  st.del=del;migrate();resnap()}
function replaceWith(S){['trials','clients','docs'].forEach(k=>st[k]=Array.isArray(S[k])?S[k]:[]);takeSettings(S);st.del=S.del||{};migrate();resnap()}
function setSync(s){cloud.state=s;const el=$('sync'),el2=$('sync2');const L={ok:'Synced',saving:'Saving…',offline:'Offline · saved here',off:'Cloud not set up',login:'Sign in again',err:'Sync problem',idle:'Connecting…'};
  [el,el2].forEach(e=>{if(!e)return;e.className='sync '+s;e.title=L[s]||'';const t=e.querySelector('i');if(t)t.textContent=L[s]||''});
  const acc=$('syncAcc');if(acc)acc.innerHTML=syncCard()}
function quietRender(){if(document.querySelector('.ov'))return cloud.pendingRender=true;if(view==='settings'){if(setDirty())return;newDraft()}cloud.pendingRender=false;try{render();drawNav()}catch(e){}}
async function cloudPull(force){if(cloud.busy)return;if(!force&&document.querySelector('.ov'))return;
  try{const r=await fetch('/api/data'+(sy.rev&&!sy.dirty&&!force?'?since='+sy.rev:''),{cache:'no-store',credentials:'same-origin'});
    if(r.status===503){cloud.on=false;setSync('off');return}if(r.status===401){cloud.on=false;setSync('login');return}if(!r.ok)throw 0;
    const j=await r.json();cloud.on=true;cloud.last=Date.now();
    if(j.same){if(sy.dirty)return cloudPush();return setSync('ok')}
    if(!j.state){if(st.docs.length||st.clients.length||st.trials.length||custom(st)){sy.dirty=1;return cloudPush()}sy.rev=j.rev;persistSy();return setSync('ok')}
    if(j.rev!==sy.rev||sy.dirty){if(sy.dirty||!sy.synced){mergeIn(j.state);sy.dirty=1}else replaceWith(j.state);sy.rev=j.rev;sy.synced=1;writeLocal();persistSy();quietRender()}
    if(sy.dirty)return cloudPush();setSync('ok')}catch(e){setSync(navigator.onLine===false?'offline':'err')}}
async function cloudPush(){if(cloud.on===false)return;if(cloud.busy){cloud.again=true;return}cloud.busy=true;setSync('saving');
  try{const r=await fetch('/api/data',{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({baseRev:sy.rev,state:st})});
    if(r.status===409){const j=await r.json();mergeIn(j.state);sy.rev=j.rev;writeLocal();persistSy();cloud.busy=false;quietRender();return cloudPush()}
    if(r.status===503){cloud.on=false;setSync('off');return}if(r.status===401){setSync('login');return}if(!r.ok)throw 0;
    const j=await r.json();sy.rev=j.rev;sy.dirty=0;sy.synced=1;persistSy();cloud.last=Date.now();setSync('ok')}
  catch(e){setSync(navigator.onLine===false?'offline':'err')}
  finally{cloud.busy=false;if(cloud.again){cloud.again=false;cloudPush()}}}
function syncCard(){const s=cloud.state;
  if(s==='off')return `<p><b>Cloud sync isn’t switched on yet.</b> Right now your data is only on this device.</p><ol class="steps2"><li>Open <b>vercel.com</b> → your <b>daxator-packages</b> project → <b>Storage</b> tab.</li><li>Click <b>Create Database</b> → choose <b>Upstash for Redis</b> (free) → Continue → Create.</li><li>When it asks, <b>connect it to this project</b> (all environments).</li><li>Go to <b>Deployments</b> → latest → <b>⋯ → Redeploy</b>. Then open the app here again.</li></ol>`;
  if(s==='login')return `<p><b>Sign in again to sync.</b> Your session ended.</p><a class="btn sm" href="/login/">Sign in</a>`;
  const when=cloud.last?new Date(cloud.last).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'';
  return `<p><b>${s==='ok'?'✓ Everything is saved in your Vercel cloud.':s==='saving'?'Saving to the cloud…':s==='offline'?'You’re offline. Changes are kept here and upload when you’re back online.':s==='err'?'Couldn’t reach the cloud just now. It will retry.':'Connecting…'}</b>${when&&s==='ok'?' Last synced '+when+'.':''}</p>
   <p class="muted" style="font-size:12.5px">Open the app on any phone or laptop, sign in, and you’ll see the same invoices, clients and settings.</p>
   <div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn sm" id="syNow">${ic('refresh')}Sync now</button><button class="btn sm ghost danger" id="syWipe">Remove data from this device</button></div>`}
const _save=()=>{stamp();writeLocal();sy.dirty=1;persistSy();clearTimeout(cloud.timer);cloud.timer=setTimeout(cloudPush,600)};
stamp();persistSy();

/* ---------------- ui helpers ---------------- */
let tt;function toast(m,ms=2300){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),ms)}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');const d=Math.max(r.width,r.height);
  s.className='rip';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
function countUp(el,to,fmt=rs,dur=600){const from=+(el.dataset.v||0);el.dataset.v=to;if(from===to||matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=fmt(to);return}
  const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)requestAnimationFrame(f)})(t0)}
function dl(name,text,type){const b=text instanceof Blob?text:new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
const waNum=p=>{let n=String(p||'').replace(/\D/g,'');if(n.startsWith('00'))n=n.slice(2);if(n.startsWith('0'))n='92'+n.slice(1);return n};

/* ---------------- pricing ---------------- */
const priceOf=(x,per,R=st.rates)=>Math.round(x.reels*per+x.visits*R.visit+x.photos*R.photo+x.films*R.film+(x.stories?R.stories:0)+(x.posting?R.posting:0));
const price=(p,R)=>priceOf(p,p.per,R);
const pkBy=(id,S=st)=>S.pk.find(p=>p.id===id);
const PKM=(S=st)=>S.pk.filter(p=>p.monthly), PKO=(S=st)=>S.pk.filter(p=>!p.monthly);
const d3=(S=st)=>Math.min(90,Math.max(0,+S.disc3||0))/100;
function items(p){const a=[];
  a.push(p.reels+' reels'+(p.monthly?' a month':''));
  a.push(p.monthly?(p.visits===1?'1 on-site shoot':p.visits+' on-site shoots'+(p.visits>=4?' (weekly)':'')):(p.visits===1?'1 shoot day':p.visits+' shoot days'));
  if(p.photos)a.push(p.photos+' edited photos');
  if(p.films)a.push(p.films+' ad film'+(p.films>1?'s':'')+' (45 sec)');
  if(p.stories)a.push('8 stories a month');
  if(p.posting)a.push('We post on your Instagram');
  (p.extras||[]).filter(Boolean).forEach(x=>a.push(x));
  a.push(p.monthly?'Every reel in 24 hours':'All delivered in 48 hours');
  return a}
function money(plan,term,S=st){const B=S.biz,months=plan.monthly?term:1,gross=plan.price*months;
  const rate=(plan.monthly&&term===3)?r500(plan.price*(1-d3(S))):plan.price;
  const discount=(plan.price-rate)*months,net=gross-discount,tax=Math.round(net*(+B.tax||0)/100),total=net+tax,upfront=Math.round(total*(+B.upfront||0)/100);
  return{months,gross,rate,discount,discPct:Math.round(d3(S)*100),net,taxPct:+B.tax||0,tax,total,upPct:+B.upfront||0,upfront,balance:total-upfront}}
const basePk=c=>{const p=pkBy(c.base);return p&&p.monthly?p:pkBy('growth')};
const matchPk=c=>{const p=basePk(c);return(p.reels===c.reels&&p.visits===c.visits&&p.photos===c.photos&&p.films===c.films&&p.stories===!!c.stories&&p.posting===!!c.posting)?p.id:null};
const calcBase=c=>priceOf(c,basePk(c).per);
const calcTotal=c=>{const b=calcBase(c);return c.term===3?r500(b*(1-d3())):b};
function bestFit(c,t){let b=null;PKM().forEach(p=>{if(p.id!==c.base&&p.reels>=c.reels&&p.visits>=c.visits&&p.photos>=c.photos&&p.films>=c.films&&(!c.stories||p.stories)&&(!c.posting||p.posting)){
  const P=price(p),pp=c.term===3?r500(P*(1-d3())):P;if(pp<t&&(!b||pp<b.pp))b={p,pp}}});return b}
const costOf=c=>{const k=st.costs;return c.reels*k.editor+c.visits*k.travel+c.photos*k.photo+c.films*k.film+(c.stories?2400:0)};
function snapPkg(id,S=st){
  if(id==='custom'){const c=st.calc,m=matchPk(c),bp=basePk(c);const pseudo={monthly:true,reels:c.reels,visits:c.visits,photos:c.photos,films:c.films,stories:c.stories,posting:c.posting,extras:m?pkBy(m).extras:[]};
    return{id:'custom',name:m?pkBy(m).name:'Custom',monthly:true,price:calcBase(c),per:bp.per,reels:c.reels,items:items(pseudo)}}
  const p=pkBy(id,S)||S.pk[0];return{id:p.id,name:p.name,monthly:p.monthly,price:price(p,S.rates),per:p.per,reels:p.reels,items:items(p)}}
const docCtx=(S=st)=>({biz:S.biz,tpl:S.tpl,bonus:S.bonusOn?S.bonus:''});

/* ---------------- invoice numbers & money (PKR / USD) ---------------- */
const INV_RE=/^DAX-?0*(\d+)$/i, AGR_RE=/^DAX-AGR-0*(\d+)$/i;
function nextNum(type){const re=type==='invoice'?INV_RE:AGR_RE,key=type==='invoice'?'invNext':'agrNext';let mx=0;
  st.docs.forEach(d=>{if(d.type!==type)return;const m=String(d.no||'').trim().match(re);if(m)mx=Math.max(mx,+m[1])});return Math.max(+st.biz[key]||1,mx+1)}
const nextInv=()=>invNo(nextNum('invoice')), nextAgr=()=>agrNo(nextNum('agreement'));
const isUSD=d=>d.currency==='USD';
const fxOf=d=>+d.fx||+st.biz.fx||280;
const inPKR=(d,a)=>isUSD(d)?a*fxOf(d):a, inUSD=(d,a)=>isUSD(d)?a:a/fxOf(d);
const usd=n=>{n=+n||0;const s=Math.abs(n)<1000&&n%1?2:0;return(n<0?'−$':'$')+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:s,maximumFractionDigits:s})};
const amt=(d,n)=>isUSD(d)?usd(n):rs(n);
const recv=d=>d.type==='upwork'?(d.status==='paid'?d.money.total:0):d.type!=='invoice'?0:d.status==='paid'?d.money.total:d.status==='advance'?d.money.upfront:0;
function pays(d){if(d.type==='upwork')return d.status==='paid'?[{date:d.paidOn||d.date,a:upNet(d)}]:[];if(d.type!=='invoice')return[];const M=d.money,T=M.total,U=M.upfront;
  if(d.status==='advance')return U?[{date:d.advOn||d.date,a:U}]:[];
  if(d.status==='paid'){if(d.advOn&&U>0&&U<T&&d.advOn!==(d.paidOn||d.date))return[{date:d.advOn,a:U},{date:d.paidOn||d.date,a:T-U}];return[{date:d.paidOn||d.date,a:T}]}
  return[]}

/* ---------------- modal system ---------------- */
const stack=[];
function modal({title='',body='',foot='',size='',onClose,cls=''}){
  const ov=document.createElement('div');ov.className='ov';
  ov.innerHTML=`<div class="md ${size} ${cls}" role="dialog" aria-modal="true"><div class="mh"><h3>${title}</h3><button class="x" aria-label="Close">${ic('x')}</button></div><div class="mb">${body}</div>${foot?`<div class="mf">${foot}</div>`:''}</div>`;
  document.body.appendChild(ov);document.body.style.overflow='hidden';
  requestAnimationFrame(()=>requestAnimationFrame(()=>ov.classList.add('show')));
  const m={ov,el:ov.querySelector('.md'),body:ov.querySelector('.mb'),foot:ov.querySelector('.mf'),setTitle:t=>ov.querySelector('.mh h3').innerHTML=t,
    close(){if(m.closed)return;m.closed=true;ov.classList.remove('show');const i=stack.indexOf(m);if(i>-1)stack.splice(i,1);setTimeout(()=>{ov.remove();if(!stack.length)document.body.style.overflow=''},380);onClose&&onClose()}};
  ov.addEventListener('mousedown',e=>{if(e.target===ov)m.close()});ov.querySelector('.x').onclick=()=>m.close();
  stack.push(m);return m}
addEventListener('keydown',e=>{if(e.key==='Escape'&&stack.length)stack[stack.length-1].close()});
function ask(title,text,buttons){return new Promise(res=>{let v=null;
  const m=modal({title,size:'sm',body:`<p style="line-height:1.55;margin:10px 0 4px">${text}</p>`,foot:buttons.map((b,i)=>`<button class="btn ${b.cls||''}" data-i="${i}">${b.label}</button>`).join(''),onClose:()=>res(v)});
  m.foot.onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;v=buttons[+b.dataset.i].value;m.close()}})}

/* ---------------- paper preview ---------------- */
function renderPaper(host,html,paper){
  host.innerHTML=`<div class="sheetbox"><div class="paper ${paper==='Letter'?'letter':''}">${html}</div></div>`;
  const box=host.querySelector('.sheetbox'),pp=host.querySelector('.paper');
  const fit=()=>{const w=pp.offsetWidth,h=pp.offsetHeight,avail=host.clientWidth-32,s=Math.min(1,avail/w);pp.style.transform=`scale(${s})`;box.style.width=w*s+'px';box.style.height=h*s+'px'};
  fit();const imgs=qa('img',pp);imgs.forEach(i=>i.complete||i.addEventListener('load',fit,{once:true}));
  if(host._ro)host._ro.disconnect();host._ro=new ResizeObserver(fit);host._ro.observe(host);
}
function printHTML(html,paper){$('pa').innerHTML=`<style>${DOCS.pageCss({paper})}</style><div class="ppaper ${paper==='Letter'?'letter':''}">${html}</div>`;
  const imgs=qa('img',$('pa'));Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))).then(()=>document.fonts.ready).then(()=>setTimeout(()=>window.print(),150))}
/* ---------------- real PDF, drawn exactly like the preview ---------------- */
const loadScript=src=>new Promise((ok,no)=>{if(document.querySelector(`script[src="${src}"]`)){return window.jspdf&&window.html2canvas?ok():setTimeout(ok,400)}const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
async function pdfLibs(){await Promise.all([loadScript('/assets/vendor/html2canvas-pro-2.5.0.min.js'),loadScript('/assets/vendor/jspdf-2.5.2.umd.min.js')]);
  const h=window.html2canvas;return{h2c:typeof h==='function'?h:(h.default||h.html2canvas),JsPDF:window.jspdf.jsPDF}}
// push anything that would be cut by a page edge onto the next page
function paginate(pp,H,PT,PB){const top0=()=>pp.getBoundingClientRect().top;
  const sel='.doc > *, .doc tr, .doc li, .doc p, .doc h2, .doc h3, .doc .box, .doc .sig, .doc .ft, .doc table.sum, .doc .cols2, .doc .stamp';
  for(let guard=0;guard<400;guard++){let moved=false;const T=top0();
    for(const el of pp.querySelectorAll(sel)){if(el.closest('.pgsp'))continue;const r=el.getBoundingClientRect(),t=r.top-T,b=r.bottom-T,h=r.height;if(!h||h>H-PT-PB)continue;
      const p=Math.floor(t/H),limit=(p+1)*H-PB;let need=b>limit;
      if(!need&&/^H[23]$/.test(el.tagName)&&b>limit-48)need=true; // keep headings with their text
      if(!need)continue;const push=Math.ceil((p+1)*H+PT-t);
      if(el.tagName==='TR'){const sp=document.createElement('tr');sp.className='pgsp';sp.innerHTML=`<td colspan="9" style="height:${push}px;padding:0;border:0;background:#fff"></td>`;el.parentNode.insertBefore(sp,el)}
      else el.style.marginTop=((parseFloat(getComputedStyle(el).marginTop)||0)+push)+'px';
      moved=true;break}
    if(!moved)break}}
async function makePDF(d){const {h2c,JsPDF}=await pdfLibs();if(document.fonts)await document.fonts.ready;
  const letter=st.tpl.paper==='Letter',W=letter?816:794,H=letter?1056:1123,PT=56,PB=48;
  const host=document.createElement('div');host.className='pdfhost';host.innerHTML=`<div class="paper pdfp ${letter?'letter':''}">${DOCS.html(d,docCtx())}</div>`;document.body.appendChild(host);
  try{const pp=host.firstElementChild;
    await Promise.all(qa('img',pp).map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})));
    paginate(pp,H,PT,PB);
    const pages=Math.max(1,Math.ceil((pp.scrollHeight-2)/H));pp.style.height=pages*H+'px';
    const scale=Math.min(3,Math.max(2,devicePixelRatio||2));
    const canvas=await h2c(pp,{scale,backgroundColor:'#ffffff',useCORS:true,logging:false,width:W,height:pages*H,windowWidth:W,scrollX:0,scrollY:0});
    const pdf=new JsPDF({unit:'pt',format:letter?'letter':'a4',compress:true}),pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight(),sh=Math.round(H*scale);
    pdf.setProperties({title:docName(d),author:st.biz.name||'Daxator Studios',creator:'Daxator Packages'});
    for(let i=0;i<pages;i++){const c=document.createElement('canvas');c.width=canvas.width;c.height=sh;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,sh);
      g.drawImage(canvas,0,i*sh,canvas.width,Math.min(sh,canvas.height-i*sh),0,0,canvas.width,Math.min(sh,canvas.height-i*sh));
      if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,pw,ph,undefined,'FAST')}
    return pdf.output('blob')}
  finally{host.remove()}}
const docName=d=>[(d.no||({quote:'Quotation',invoice:'Invoice',agreement:'Agreement'})[d.type]),(d.client&&d.client.biz)||'Client',st.biz.name||'Daxator Studios'].join(' - ').replace(/[\\/]+/g,'-').replace(/[:*?"<>|]+/g,'').trim();
const canShareFiles=()=>{try{return !!(navigator.canShare&&navigator.canShare({files:[new File(['x'],'x.pdf',{type:'application/pdf'})]}))}catch(e){return false}};
async function pdfAction(d,how,btn){const old=btn&&btn.innerHTML;if(btn){btn.disabled=true;btn.innerHTML='<span class="spin"></span>Making PDF…'}
  try{const blob=await makePDF(d),name=docName(d)+'.pdf';
    if(how==='share'&&canShareFiles()){try{await navigator.share({files:[new File([blob],name,{type:'application/pdf'})],title:name})}catch(e){if(e&&e.name!=='AbortError')throw e}}
    else{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('PDF downloaded ✓')}}
  catch(e){console.error(e);toast('Couldn’t make the PDF. Try Print instead.',3500)}
  finally{if(btn){btn.disabled=false;btn.innerHTML=old}}}
function wordDownload(d,ctx){const nm=(d.no?d.no+'-':'')+d.type+'-'+(d.client.biz||'client').replace(/[^a-z0-9]+/gi,'-').toLowerCase();
  dl(today()+'-'+nm+'.doc','﻿'+DOCS.wordHtml(d,ctx),'application/msword');toast('Word file downloaded')}
function previewDoc(d){
  const ctx=docCtx(),html=DOCS.html(d,ctx);
  const m=modal({title:(d.no?esc(d.no)+' · ':'')+({invoice:'Invoice',quote:'Quotation',agreement:'Agreement'})[d.type],size:'xl',
    body:`<div class="pvwrap" style="height:100%"></div>`,
    foot:`<button class="btn pvs" data-a="word" aria-label="Word">${ic('word')}<span class="tx">Word</span></button><button class="btn pvs" data-a="print" aria-label="Print">${ic('print')}<span class="tx">Print</span></button>${canShareFiles()?`<button class="btn" data-a="share">${ic('share')}Share</button>`:''}<button class="btn dark" data-a="pdf">${ic('down')}Download PDF</button>`});
  m.body.style.padding='0';m.body.style.display='flex';m.body.style.background='rgba(233,220,205,.35)';
  const host=m.body.querySelector('.pvwrap');host.style.flex='1';renderPaper(host,html,st.tpl.paper);
  m.foot.onclick=e=>{const a=e.target.closest('[data-a]');if(!a||a.disabled)return;const k=a.dataset.a;
    if(k==='print')printHTML(html,st.tpl.paper);else if(k==='word')wordDownload(d,ctx);else pdfAction(d,k,a)};
}

/* ---------------- router ---------------- */
const VIEWS=[['packages','Packages','box'],['trials','Trials','cam'],['clients','Clients','users'],['invoices','Invoices','bars'],['settings','Settings','gear']];
let view='packages';
function drawNav(){
  const act=st.trials.filter(t=>!['won','lost'].includes(t.status)).length;
  $('nav').innerHTML=VIEWS.map(([k,l,i])=>`<button data-v="${k}" class="${view===k?'on':''}">${ic(i)}${l}${k==='trials'&&act?`<span class="cnt">${act}</span>`:k==='clients'&&st.clients.length?`<span class="cnt">${st.clients.length}</span>`:''}</button>`).join('');
  $('tabbar').innerHTML=VIEWS.map(([k,l,i])=>`<button data-v="${k}" class="${view===k?'on':''}">${ic(i)}${l}</button>`).join('');
  $('ttl').textContent=VIEWS.find(v=>v[0]===view)[1];
}
async function go(v,force){
  if(v===view&&!force)return;
  if(view==='settings'&&v!=='settings'&&setDirty()){const a=await ask('Save your settings?','You changed some settings but didn’t save them.',[{label:'Stay',value:'stay'},{label:'Discard',value:'discard',cls:'danger'},{label:'Save',value:'save',cls:'dark'}]);
    if(!a||a==='stay'){return}if(a==='save')saveSettings();else discardSettings()}
  view=v;if(location.hash!=='#'+v)history.replaceState(null,'','#'+v);drawNav();render();window.scrollTo({top:0,behavior:'smooth'})}
document.addEventListener('click',e=>{const n=e.target.closest('#nav [data-v],#tabbar [data-v]');if(n)go(n.dataset.v);
  const a=e.target.closest('[data-act]');if(a)quick(a.dataset.act)});
function quick(a){if(a==='new-invoice')openDoc({type:'invoice'});if(a==='new-custom')openDoc({type:'invoice',kind:'custom'});if(a==='new-upwork')openUpwork();if(a==='new-agreement')openDoc({type:'agreement'});if(a==='share')openShare();if(a==='calc')openCalc()}
function render(){const m=$('main');m.onclick=m.oninput=m.onchange=null;m.innerHTML=`<div class="view">${({packages:vPackages,trials:vTrials,clients:vClients,invoices:vInvoices,settings:vSettings})[view]()}</div>`;
  ({packages:wPackages,trials:wTrials,clients:wClients,invoices:wInvoices,settings:wSettings})[view]();$('savebar').classList.toggle('show',view==='settings'&&setDirty())}

/* =================== PACKAGES =================== */
const CHEV=ic('chev');
function pkCard(p){const on3=st.t3&&p.monthly,P=price(p),now=on3?r500(P*(1-d3())):P;
  return `<article class="pk glass ${p.rec?'rec':''}">${p.rec?'<span class="tag">Most chosen</span>':''}${p.monthly?'':'<span class="tag" style="background:var(--ink)">Pay once</span>'}
   <div><h3>${esc(p.name)}</h3><div class="for">${esc(p.tag)}</div>
   <div class="price"><span class="now" data-v="${now}">${rs(now)}</span><span class="per">${p.monthly?'/ month':'one time'}</span>${on3?`<s>${rs(P)}</s>`:''}</div>
   <div class="pr">${rs(p.per)} per reel</div>
   ${on3?`<div class="save">${rs(now*3)} for 3 months · save ${rs((P-now)*3)}</div>`:''}
   <button class="why" data-why="${p.id}">What is this? ${CHEV}</button>
   <div class="more" id="more-${p.id}"><div><p>${esc(p.why)}</p></div></div></div>
   <ul>${items(p).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
   <div class="act">${p.monthly?`<button class="btn" data-calc="${p.id}">${ic('calc')}Customize</button>`:''}<button class="btn dark" data-doc="${p.id}">${ic('doc')}Quote / Invoice</button></div>
  </article>`}
function vPackages(){
  return `<div class="ph"><div><h1>Packages</h1><p>Reels that sell your food. Shot on-site, delivered in 24 hours.</p></div>
    <div class="acts"><button class="btn" data-act="calc">${ic('calc')}Calculator</button><button class="btn brown" data-act="share">${ic('share')}Share with client</button></div></div>
  <label class="t3bar"><div class="grow"><span class="serif">3 Months Together</span><small>Save ${Math.round(d3()*100)}% every month when paid for 3 months</small></div><span class="tg"><input type="checkbox" id="t3" ${st.t3?'checked':''}><i></i></span></label>
  ${st.bonusOn&&st.bonus?`<div class="bonus"><b>Bonus</b><span>${esc(st.bonus)}</span></div>`:''}
  <div class="pkgrid stagger">${PKM().map(pkCard).join('')}</div>
  ${PKO().length?`<div class="divl">Just once</div><div class="one">${PKO().map(pkCard).join('')}</div>`:''}
  <div class="info">
    <div class="glass card"><div class="lbl" style="margin-bottom:12px">How it works</div><div class="steps">
      <div class="step glass"><span class="n">1</span><div><b>Free trial reel</b><span>We shoot one dish, same-day delivery.</span></div></div>
      <div class="step glass"><span class="n">2</span><div><b>Pick a plan</b><span>Starter, Growth, Premium or One-Time.</span></div></div>
      <div class="step glass"><span class="n">3</span><div><b>Pay the advance</b><span>Shoot dates locked the same week.</span></div></div>
      <div class="step glass"><span class="n">4</span><div><b>We shoot, you post</b><span>Reels in 24 hours, every time.</span></div></div></div></div>
    <div class="promise glass"><div class="serif">The Speed Promise</div><p>If a reel is late, that reel is free.</p>
      <div class="terms"><div><b>Payment</b>${st.biz.upfront}% advance</div><div><b>Revisions</b>2 per reel</div><div><b>Raw footage</b>On request</div><div><b>After the plan</b>Cancel anytime</div></div></div>
  </div>`}
function wPackages(){
  $('t3').onchange=e=>{st.t3=e.target.checked;save();
    const old=qa('.pk .now').map(n=>+n.dataset.v),y=scrollY;render();scrollTo(0,y);
    qa('.pk .now').forEach((n,i)=>{const to=+n.dataset.v;n.dataset.v=old[i]||to;countUp(n,to,rs,650)});
    qa('.pkgrid,.one').forEach(g=>g.classList.remove('stagger'));$('main').firstElementChild.style.animation='none'};
  $('main').onclick=e=>{const w=e.target.closest('[data-why]'),c=e.target.closest('[data-calc]'),d=e.target.closest('[data-doc]');
    if(w){w.classList.toggle('open');$('more-'+w.dataset.why).classList.toggle('open')}
    if(c){setCalcFromPk(c.dataset.calc);openCalc(true)}
    if(d)openDoc({type:'quote',pkg:d.dataset.doc})};
}

/* =================== CALCULATOR =================== */
function setCalcFromPk(id){const p=pkBy(id);Object.assign(st.calc,{base:id,reels:p.reels,visits:p.visits,photos:p.photos,films:p.films,stories:p.stories,posting:p.posting})}
function openCalc(keep){
  if(!keep)st.calc.term=st.t3?3:1;
  const stp=(k,l,s,mn,mx,sp)=>`<div class="ctl"><div><b>${l}</b><small>${s}</small></div><div class="stp" data-k="${k}" data-min="${mn}" data-max="${mx}" data-s="${sp}"><button aria-label="less">−</button><output></output><button aria-label="more">+</button></div></div>`;
  const tg=(k,l,s)=>`<div class="ctl"><div><b>${l}</b><small>${s}</small></div><label class="tg"><input type="checkbox" data-k="${k}"><i></i></label></div>`;
  const m=modal({title:'Calculator',size:'md',body:`
    <div class="secl" style="margin-top:8px">Per-reel price from</div><div class="seg" id="cBase" style="width:100%;margin-top:8px"></div>
    ${stp('reels','Reels','per month',1,40,1)}${stp('visits','Shoot visits','on-site, per month',1,12,1)}${stp('photos','Edited photos','per month',0,100,5)}${stp('films','Ad films','45 sec, cinematic',0,6,1)}
    ${tg('stories','Story pack','8 stories a month')}${tg('posting','We post for you','captions + scheduling')}
    <div class="secl">Plan length</div><div class="seg" id="cTerm" style="width:100%;margin-top:8px"><button data-t="1">Monthly</button><button data-t="3">3 months · −${Math.round(d3()*100)}%</button></div>
    <div class="res"><div class="row"><div class="grow"><small>PER MONTH</small><div class="big" id="cTot">–</div></div><div style="text-align:right" id="cSub"></div></div></div>
    <div class="fit hidden" id="cFit"><span id="cFitT"></span><button class="btn sm brown" id="cFitB">Use it</button></div>
    <button class="btn ghost sm" id="cEye" style="margin-top:10px">${ic('eye')}<span>Show my profit</span></button>
    <div class="owner hidden" id="cOwn"><div class="kv"><span>My cost</span><b id="oC"></b></div><div class="kv"><span>Profit / month</span><b id="oP" style="color:var(--green)"></b></div><div class="kv"><span>Margin</span><b id="oM"></b></div></div>`,
    foot:`<button class="btn dark" id="cDoc">${ic('doc')}Quote / Invoice / Agreement</button>`});
  const b=m.body;
  function draw(){const c=st.calc;
    $('cBase').innerHTML=PKM().map(p=>`<button data-b="${p.id}" class="${basePk(c).id===p.id?'on':''}">${esc(p.name)}<br><small style="font-weight:600;opacity:.75">${rs(p.per)}</small></button>`).join('');
    qa('.stp',b).forEach(s=>s.querySelector('output').textContent=c[s.dataset.k]);
    qa('input[data-k]',b).forEach(i=>i.checked=!!c[i.dataset.k]);
    qa('#cTerm button',b).forEach(x=>x.classList.toggle('on',+x.dataset.t===c.term));
    const t=calcTotal(c),mm=matchPk(c);countUp($('cTot'),t);
    $('cSub').innerHTML=`<b>${mm?esc(pkBy(mm).name):'Custom'}</b><br><small>${c.term===3?rs(t*3)+' for 3 months':rs(basePk(c).per)+' per reel'}</small>`;
    const bf=mm?null:bestFit(c,t);$('cFit').classList.toggle('hidden',!bf);if(bf){$('cFitT').innerHTML=`<b>${esc(bf.p.name)}</b> gives more for ${rs(bf.pp)}`;$('cFitB').onclick=()=>{setCalcFromPk(bf.p.id);draw();save()}}
    const cost=costOf(c);$('oC').textContent=rs(cost);$('oP').textContent=rs(t-cost);$('oM').textContent=t?Math.round((t-cost)/t*100)+'%':'–';save()}
  b.onclick=e=>{const c=st.calc,t=e.target;const s=t.closest('.stp');
    if(s&&t.tagName==='BUTTON'){const k=s.dataset.k,sp=+s.dataset.s,dir=t===s.firstElementChild?-1:1;c[k]=Math.max(+s.dataset.min,Math.min(+s.dataset.max,c[k]+dir*sp));draw()}
    const bb=t.closest('[data-b]');if(bb){c.base=bb.dataset.b;draw()}
    const tm=t.closest('#cTerm [data-t]');if(tm){c.term=+tm.dataset.t;draw()}
    if(t.closest('#cEye')){$('cOwn').classList.toggle('hidden');$('cEye').querySelector('span').textContent=$('cOwn').classList.contains('hidden')?'Show my profit':'Hide my profit'}};
  b.onchange=e=>{const i=e.target;if(i.dataset.k){st.calc[i.dataset.k]=i.checked;draw()}};
  $('cDoc').onclick=()=>{m.close();setTimeout(()=>openDoc({type:'quote',pkg:'custom',term:st.calc.term}),250)};
  draw();
}

/* =================== SHARE WITH CLIENT =================== */
const b64url=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
async function encodeShare(obj){const json=JSON.stringify(obj);
  try{if('CompressionStream' in window){const cs=new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'));return 'z'+b64url(new Uint8Array(await new Response(cs).arrayBuffer()))}}catch(e){}
  return 'j'+b64url(new TextEncoder().encode(json))}
function openShare(){
  const m=modal({title:'Share packages with a client',size:'md',body:`
    <p class="muted" style="margin:10px 0 0;font-size:13.5px;line-height:1.5">Creates a link that shows <b>only your packages</b>. Clients can’t see anything else in this app.</p>
    <label class="fld"><span>Client name (optional)</span><input class="in" id="sCl" list="sClList" placeholder="e.g. Coffmo" autocomplete="off"></label>
    <datalist id="sClList">${[...new Set(st.clients.map(c=>c.biz).concat(st.trials.map(t=>t.place)))].map(n=>`<option value="${esc(n)}">`).join('')}</datalist>
    <div class="secl">Packages to show</div>
    ${st.pk.map(p=>`<div class="tgrow"><div><b>${esc(p.name)}</b><small>${rs(price(p))}${p.monthly?' / month':' one time'}</small></div><label class="tg"><input type="checkbox" data-sp="${p.id}" checked><i></i></label></div>`).join('')}
    <div class="secl">Options</div>
    <div class="tgrow"><div><b>Show 3-month price</b><small>Lets the client see the ${Math.round(d3()*100)}% saving</small></div><label class="tg"><input type="checkbox" id="s3" checked><i></i></label></div>
    <div class="tgrow"><div><b>Include bonus</b><small>${esc(st.bonus||'No bonus text set')}</small></div><label class="tg"><input type="checkbox" id="sB" ${st.bonusOn&&st.bonus?'checked':''}><i></i></label></div>
    <div class="g2"><label class="fld"><span>Link valid for</span><select class="in" id="sV"><option value="3">3 days</option><option value="7" selected>7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label>
    <label class="fld"><span>Your WhatsApp</span><input class="in" id="sW" value="${esc(st.biz.phone)}"></label></div>
    <label class="fld"><span>Personal note (optional)</span><textarea class="in" id="sN" placeholder="Great meeting you today! Here are the plans we discussed."></textarea></label>
    <div id="sOut" class="hidden" style="margin-top:16px"><div class="secl">Your link</div>
      <div class="row" style="margin-top:8px"><input class="in" id="sLink" readonly><button class="btn dark" id="sCopy">${ic('copy')}Copy</button></div>
      <div class="row" style="margin-top:8px;flex-wrap:wrap"><a class="btn wa grow" id="sWa" target="_blank" rel="noopener">${ic('wa')}Send on WhatsApp</a><button class="btn grow" id="sNative">${ic('share')}Share…</button><a class="btn grow" id="sOpen" target="_blank" rel="noopener">${ic('eye')}Preview</a></div></div>`,
    foot:`<button class="btn brown" id="sGo">${ic('link')}Create link</button>`});
  if(!navigator.share)$('sNative').classList.add('hidden');
  $('sGo').onclick=async()=>{
    const sel=st.pk.filter(p=>document.querySelector(`[data-sp="${p.id}"]`).checked);if(!sel.length){toast('Pick at least one package');return}
    const client=$('sCl').value.trim();
    const data={v:1,c:client,n:$('sN').value.trim(),t:Date.now(),vd:+$('sV').value,
      b:{n:st.biz.name,o:st.biz.owner,p:$('sW').value.trim()},bonus:$('sB').checked?st.bonus:'',d:$('s3').checked?Math.round(d3()*100):0,adv:+st.biz.upfront||0,
      pk:sel.map(p=>({n:p.name,g:p.tag,w:p.why,m:p.monthly,r:!!p.rec,p:price(p),pr:p.per,it:items(p)}))};
    const url=location.origin+'/share/#'+await encodeShare(data);
    $('sLink').value=url;$('sOut').classList.remove('hidden');$('sOpen').href=url;
    const msg=`Hi${client?' '+client+' team':''}! Here are ${st.biz.name}'s video packages${client?' for '+client:''} 🎬\n${url}`;
    $('sWa').href='https://wa.me/?text='+encodeURIComponent(msg);$('sNative').onclick=()=>navigator.share({title:st.biz.name+' · Video packages',text:msg.split('\n')[0],url}).catch(()=>{});
    $('sGo').innerHTML=ic('check')+'Link ready · update';$('sOut').scrollIntoView({behavior:'smooth',block:'nearest'})};
  $('sCopy').onclick=()=>{const v=$('sLink').value;(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(()=>toast('Link copied ✓')).catch(()=>{$('sLink').select();document.execCommand('copy');toast('Link copied ✓')})};
}

/* =================== TRIALS =================== */
const STAT=[['lead','To book'],['scheduled','Scheduled'],['shot','Shot'],['delivered','Delivered'],['proposal','Proposal'],['won','Won'],['lost','Lost']];
const SL=Object.fromEntries(STAT);
const NEXT={lead:['scheduled','Mark scheduled'],scheduled:['shot','Mark shot'],shot:['delivered','Mark reel delivered'],delivered:['proposal','Mark proposal sent'],proposal:['won','Mark won 🎉']};
let tFilter='all',tQuery='';
const fD=d=>{if(!d)return'';const[y,m,x]=d.split('-');return new Date(+y,+m-1,+x).toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'})};
const fT=t=>{if(!t)return'';let[h,m]=t.split(':').map(Number);const a=h>=12?'pm':'am';h=h%12||12;return h+':'+String(m).padStart(2,'0')+' '+a};
function waMsg(r){const hi=(r.name?'Hi '+r.name+'! ':'Hi! ')+st.biz.owner.split(' ')[0]+' from '+st.biz.name+'. ',when=(r.date?' on '+fD(r.date):'')+(r.time?' at '+fT(r.time):'');
  return({lead:hi+'We met at '+r.place+'. I\'d love to shoot one free trial reel of your best dish, delivered the same day. Which day works this week?',
    scheduled:hi+'Confirming your free trial reel shoot at '+r.place+when+'. See you then!',
    shot:hi+'Thanks for having us at '+r.place+' today! Your reel is in the edit, you\'ll have it today.',
    delivered:hi+'Here\'s your reel 🎬 Feel free to post it. If you want reels like this every month, I\'d love 10 minutes with the owner this week to share our plans.',
    proposal:hi+'Just following up on the plan for '+r.place+'. Shall we lock in your first shoot date this week?',
    won:hi+'Welcome aboard! 🎉 Sharing payment details and our first shoot date shortly.',
    lost:hi+'Thanks for your time! If you ever want reels for '+r.place+', I\'m one message away.'})[r.status]}
function vTrials(){const T=st.trials,cnt=s=>T.filter(t=>t.status===s).length;
  const q=tQuery.toLowerCase();let rows=T.filter(t=>(tFilter==='all'||t.status===tFilter)&&(!q||[t.place,t.name,t.phone,t.notes].join(' ').toLowerCase().includes(q)));
  rows.sort((a,b)=>(a.status==='scheduled'&&b.status==='scheduled')?((a.date||'9')+(a.time||'')).localeCompare((b.date||'9')+(b.time||'')):(b.created||'').localeCompare(a.created||''));
  return `<div class="ph"><div><h1>Trial shoots</h1><p>Book free trial reels, deliver, then close.</p></div><div class="acts">
    <button class="btn" id="tImp">${ic('up')}Import walk-ins</button><button class="btn dark" id="tAdd">${ic('plus')}Add trial</button></div></div>
  <div class="stats stagger"><div class="stat glass"><small>To book</small><b>${cnt('lead')}</b></div><div class="stat glass"><small>Scheduled</small><b>${cnt('scheduled')}</b></div>
    <div class="stat glass"><small>Delivered / proposal</small><b>${cnt('delivered')+cnt('proposal')}</b></div><div class="stat hl glass"><small>Won</small><b>${cnt('won')}</b></div></div>
  <div class="toolbar"><div class="search">${ic('search')}<input class="in" id="tQ" placeholder="Search place, name, phone…" value="${esc(tQuery)}"></div></div>
  <div class="chips">${[['all','All']].concat(STAT).map(([k,l])=>`<button class="chip ${tFilter===k?'on':''}" data-f="${k}">${l}${k!=='all'?' '+cnt(k):''}</button>`).join('')}</div>
  ${rows.length?`<div class="grid-cards stagger">${rows.map(r=>{const p=r.pkg&&pkBy(r.pkg);return `<div class="it glass">
    <div class="top"><b>${esc(r.place)}</b><span class="pill ${r.status}">${SL[r.status]}</span></div>
    <div class="meta">${(r.name||r.phone)?`<div>${esc(r.name||'—')}${r.role?' · '+esc(r.role):''}${r.phone?' · '+esc(r.phone):''}</div>`:''}
      ${(r.date||r.time)&&r.status!=='lost'?`<div><strong>${r.status==='lead'?'Follow up':'Shoot'}:</strong> ${esc(fD(r.date))}${r.time?' · '+esc(fT(r.time)):''}</div>`:''}
      ${p?`<div><strong>Wants:</strong> ${esc(p.name)}</div>`:''}${r.notes?`<div>${esc(r.notes)}</div>`:''}</div>
    <div class="acts">${NEXT[r.status]?`<button class="btn sm brown nx" data-nx="${r.id}">${NEXT[r.status][1]}</button>`:''}
      ${r.phone?`<a class="btn sm wa" target="_blank" rel="noopener" href="https://wa.me/${waNum(r.phone)}?text=${encodeURIComponent(waMsg(r))}">${ic('wa')}WhatsApp</a><a class="btn sm" href="tel:${esc(r.phone)}">${ic('phone')}Call</a>`:''}
      <button class="btn sm" data-q="${r.id}">${ic('doc')}Quote</button><button class="btn sm" data-ed="${r.id}">${ic('edit')}Edit</button></div></div>`}).join('')}</div>`
    :`<div class="empty glass card"><b>${T.length?'Nothing here':'No trial shoots yet'}</b>${T.length?'Try another filter.':'Add your first trial, or import your walk-in log backup.'}</div>`}
  <input type="file" id="tFile" accept=".json,application/json" class="hidden">`}
function wTrials(){
  $('tAdd').onclick=()=>openTrial();$('tImp').onclick=()=>$('tFile').click();
  $('tFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const w=JSON.parse(rd.result);if(!Array.isArray(w))throw 0;importWalk(w)}catch(er){toast('That isn’t a walk-in backup file')}};rd.readAsText(f);e.target.value=''};
  let qt;$('tQ').oninput=e=>{tQuery=e.target.value;clearTimeout(qt);qt=setTimeout(()=>{const p=e.target.selectionStart;render();const i=$('tQ');i.focus();i.setSelectionRange(p,p)},200)};
  $('main').onclick=e=>{const c=e.target.closest('[data-f]');if(c){tFilter=c.dataset.f;render();return}
    const nx=e.target.closest('[data-nx]'),ed=e.target.closest('[data-ed]'),q=e.target.closest('[data-q]');
    if(nx){const r=st.trials.find(t=>t.id===nx.dataset.nx);r.status=NEXT[r.status][0];save();render();drawNav();toast(SL[r.status])}
    if(ed)openTrial(st.trials.find(t=>t.id===ed.dataset.ed));
    if(q){const r=st.trials.find(t=>t.id===q.dataset.q);openDoc({type:'quote',pkg:r.pkg||'growth',prefill:{biz:r.place,person:r.name,phone:r.phone}})}};
}
function importWalk(w){const seen=new Set(st.trials.map(t=>(t.place+'|'+t.phone).toLowerCase()));let n=0;
  w.forEach(r=>{if(!r||!r.place||r.status==='rejected')return;const k=(r.place+'|'+(r.phone||'')).toLowerCase();if(seen.has(k))return;seen.add(k);
    st.trials.push({id:'w'+(r.id||uid()),place:r.place,name:r.name||'',role:r.role||'',phone:r.phone||'',date:r.date||'',time:r.time||'',status:r.status==='booked'?'scheduled':'lead',pkg:'',notes:[r.area,r.notes].filter(Boolean).join(' · '),created:r.created||new Date().toISOString()});n++});
  save();if(view==='trials')render();drawNav();toast(n?'Imported '+n+' walk-ins':'Nothing new to import')}
function openTrial(r){
  let status=r?.status||'scheduled',pkg=r?.pkg||'';const d=new Date();d.setDate(d.getDate()+(d.getHours()<4?0:1));
  const m=modal({title:r?'Edit trial':'New trial',size:'md',body:`
    <label class="fld"><span>Place *</span><input class="in" id="xP" value="${esc(r?.place||'')}" autocomplete="off"></label>
    <div class="g2"><label class="fld"><span>Contact</span><input class="in" id="xN" value="${esc(r?.name||'')}"></label>
    <label class="fld"><span>Role</span><select class="in" id="xR">${['Owner','Manager','Staff','Marketing'].map(o=>`<option ${(r?.role||'Manager')===o?'selected':''}>${o}</option>`).join('')}</select></label></div>
    <label class="fld"><span>Phone</span><input class="in" id="xT" type="tel" value="${esc(r?.phone||'')}"></label>
    <div class="g2"><label class="fld"><span>Date</span><input class="in" id="xD" type="date" value="${r?(r.date||''):ymd(d)}"></label><label class="fld"><span>Time</span><input class="in" id="xH" type="time" value="${r?(r.time||''):'15:00'}"></label></div>
    <div class="secl">Status</div><div class="chips" id="xS" style="flex-wrap:wrap">${STAT.map(([k,l])=>`<button class="chip ${status===k?'on':''}" data-s="${k}">${l}</button>`).join('')}</div>
    <div class="secl">Interested in</div><div class="chips" id="xK" style="flex-wrap:wrap">${[['','Not sure']].concat(st.pk.map(p=>[p.id,p.name])).map(([k,l])=>`<button class="chip ${pkg===k?'on':''}" data-k="${k}">${esc(l)}</button>`).join('')}</div>
    <label class="fld"><span>Notes</span><textarea class="in" id="xO" placeholder="Hero dish, owner's concern, marketing budget…">${esc(r?.notes||'')}</textarea></label>`,
    foot:`${r?`<button class="btn danger" id="xDel">${ic('trash')}Delete</button>`:''}<button class="btn dark" id="xSave">${ic('check')}Save</button>`});
  $('xS').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;status=b.dataset.s;qa('#xS .chip').forEach(x=>x.classList.toggle('on',x===b))};
  $('xK').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;pkg=b.dataset.k;qa('#xK .chip').forEach(x=>x.classList.toggle('on',x===b))};
  $('xSave').onclick=()=>{const place=$('xP').value.trim();if(!place){$('xP').focus();toast('Add the place name');return}
    const rec={place,name:$('xN').value.trim(),role:$('xR').value,phone:$('xT').value.trim(),date:$('xD').value,time:$('xH').value,status,pkg,notes:$('xO').value.trim()};
    if(r)Object.assign(r,rec);else st.trials.unshift({id:uid(),created:new Date().toISOString(),...rec});
    save();m.close();if(view==='trials')render();drawNav();toast('Saved ✓')};
  if(r)$('xDel').onclick=async()=>{if(await ask('Delete this trial?',`<b>${esc(r.place)}</b> will be removed.`,[{label:'Cancel',value:0},{label:'Delete',value:1,cls:'dark'}])){st.trials=st.trials.filter(t=>t!==r);save();m.close();render();drawNav();toast('Deleted')}};
}

/* =================== CLIENTS & DOCUMENTS =================== */
const DSL={unpaid:'Unpaid',advance:'Advance paid',paid:'Paid',sent:'Sent',signed:'Signed'};
const cliBy=id=>st.clients.find(c=>c.id===id);
let selCli=null,cQuery='';
const wide=()=>matchMedia('(min-width:1180px)').matches;
function vClients(){
  const inv=st.docs.filter(d=>d.type==='invoice'||isUp(d)),upN=inv.filter(isUp).length,billed=inv.reduce((a,d)=>a+inPKR(d,d.money.total),0),
    got=inv.reduce((a,d)=>a+pays(d).reduce((x,p)=>x+inPKR(d,p.a),0),0),due=inv.reduce((a,d)=>a+inPKR(d,dueOf(d)),0);
  const q=cQuery.toLowerCase();
  const list=st.clients.filter(c=>!q||[c.biz,c.person,c.phone].join(' ').toLowerCase().includes(q)).sort((a,b)=>{
    const la=st.docs.find(d=>d.clientId===a.id)?.created||a.created||'',lb=st.docs.find(d=>d.clientId===b.id)?.created||b.created||'';return lb.localeCompare(la)});
  if(wide()&&!selCli&&list.length)selCli=list[0].id;
  return `<div class="ph"><div><h1>Clients</h1><p>Invoices, agreements and payments in one place.</p></div><div class="acts">
    <button class="btn" data-act="new-agreement">${ic('edit')}New agreement</button><button class="btn" data-act="new-custom">${ic('edit')}Custom invoice</button><button class="btn dark" data-act="new-invoice">${ic('doc')}New invoice</button></div></div>
  <div class="stats stagger"><div class="stat glass"><small>Invoices${upN?' + Upwork':''}</small><b data-cu="${inv.length}" data-n="1">${inv.length}</b>${upN?`<span class="alt">${inv.length-upN} invoices · ${upN} Upwork</span>`:''}</div><div class="stat glass"><small>Billed</small><b data-cu="${billed}">${rs(billed)}</b>${upN?'<span class="alt">incl. what Upwork clients paid</span>':''}</div>
    <div class="stat glass"><small>Received</small><b data-cu="${got}">${rs(got)}</b>${upN?'<span class="alt">incl. Upwork, after fees</span>':''}</div><div class="stat hl glass"><small>Due</small><b data-cu="${due}">${rs(due)}</b></div></div>
  <p class="muted" style="font-size:12.5px;margin:-6px 0 12px">Next invoice: <b>${nextInv()}</b> · Next agreement: <b>${nextAgr()}</b> · Amounts in PKR</p>
  <div class="split"><div>
    <div class="toolbar"><div class="search">${ic('search')}<input class="in" id="cQ" placeholder="Search clients…" value="${esc(cQuery)}"></div></div>
    <div class="stagger" id="clList">${list.length?list.map(c=>cliRow(c)).join(''):`<div class="empty glass card"><b>${st.clients.length?'No match':'No clients yet'}</b>${st.clients.length?'':'Create an invoice or agreement and the client is saved here.'}</div>`}</div>
  </div>${wide()?`<div class="detail glass" id="cDet">${selCli&&cliBy(selCli)?cliDetail(cliBy(selCli)):'<div class="empty"><b>Pick a client</b>Their invoices and agreements show here.</div>'}</div>`:''}</div>`}
function cliRow(c){const ds=st.docs.filter(d=>d.clientId===c.id),iv=ds.filter(d=>d.type==='invoice'),mo=ds.filter(d=>d.type==='invoice'||isUp(d)),b=mo.reduce((a,d)=>a+inPKR(d,d.money.total),0),due=mo.reduce((a,d)=>a+inPKR(d,dueOf(d)),0);
  return `<div class="cl glass ${wide()&&selCli===c.id?'on':''}" data-cl="${c.id}"><span class="av">${esc((c.biz||'?').trim().charAt(0).toUpperCase())}</span>
   <div class="grow"><b>${esc(c.biz)}</b><small>${[iv.length?iv.length+' invoice'+(iv.length===1?'':'s'):'',ds.filter(d=>d.type==='agreement').length?ds.filter(d=>d.type==='agreement').length+' agreement'+(ds.filter(d=>d.type==='agreement').length===1?'':'s'):'',ds.filter(isUp).length?ds.filter(isUp).length+' Upwork':''].filter(Boolean).join(' · ')||'No documents'}${c.person?' · '+esc(c.person):''}</small></div>
   ${due>0.5?`<span class="pill due">Due ${rs(due)}</span>`:b?'<span class="pill paid">Paid up</span>':''}</div>`}
function cliDetail(c){const ds=st.docs.filter(d=>d.clientId===c.id);
  return `<div class="row"><span class="av" style="width:52px;height:52px;font-size:20px">${esc((c.biz||'?').charAt(0).toUpperCase())}</span><div class="grow"><h2>${esc(c.biz)}</h2><div class="muted" style="font-size:13.5px">${[c.person,c.phone,c.email].filter(Boolean).map(esc).join(' · ')||'No contact details yet'}</div></div></div>
  <div class="row" style="margin-top:14px;flex-wrap:wrap"><button class="btn dark sm" data-ci="${c.id}">${ic('doc')}New invoice</button><button class="btn sm" data-cc="${c.id}">${ic('edit')}Custom invoice</button><button class="btn sm" data-ca="${c.id}">${ic('edit')}New agreement</button><button class="btn sm" data-cq="${c.id}">Quote</button>
    ${c.phone?`<a class="btn sm wa" target="_blank" rel="noopener" href="https://wa.me/${waNum(c.phone)}">${ic('wa')}WhatsApp</a>`:''}</div>
  <details style="margin-top:14px"><summary class="lbl" style="cursor:pointer">Client details</summary>
    <div class="g2"><label class="fld"><span>Business</span><input class="in" data-cf="biz" value="${esc(c.biz)}"></label><label class="fld"><span>Contact person</span><input class="in" data-cf="person" value="${esc(c.person||'')}"></label>
    <label class="fld"><span>Phone</span><input class="in" data-cf="phone" value="${esc(c.phone||'')}"></label><label class="fld"><span>Email</span><input class="in" data-cf="email" value="${esc(c.email||'')}"></label></div>
    <div class="g2"><label class="fld"><span>Address</span><input class="in" data-cf="addr" value="${esc(c.addr||'')}"></label><label class="fld"><span>NTN</span><input class="in" data-cf="ntn" value="${esc(c.ntn||'')}"></label></div>
    <div class="row" style="margin-top:12px"><button class="btn sm dark" data-csave="${c.id}">Save details</button><button class="btn sm danger" data-cdel="${c.id}">${ic('trash')}Delete client</button></div></details>
  <div class="secl">Documents</div>
  <div class="doclist">${ds.length?ds.map(d=>{const inv=d.type==='invoice',T=d.money.total;if(isUp(d)){const u=d.up||{};return `<div class="dc"><div class="row"><b class="grow">${esc(d.plan.name)} <span class="muted" style="font-weight:600;font-size:13px">Upwork</span></b><span class="pill ${d.status==='paid'?'paid':'advance'}">${stLabel(d)}</span></div>
    <div class="muted" style="font-size:13px;margin-top:4px">Client paid <b style="color:var(--ink)">${usd(T)}</b> · fee ${u.feePct||0}% · you got ${+u.recvPKR>0?rs(u.recvPKR):usd(upNet(d))}</div>
    <div class="muted" style="font-size:12.5px;margin-top:2px">${d.start?fLong(d.start)+(d.end?' – '+fLong(d.end):'')+' · ':''}${d.status==='paid'?'Received '+fLong(d.paidOn||d.date):'Still in Upwork'}</div>
    <div class="acts"><button class="btn sm" data-ue="${d.id}">${ic('edit')}Edit</button><button class="btn sm danger" data-dd="${d.id}">${ic('trash')}</button></div></div>`}return `<div class="dc"><div class="row"><b class="grow">${esc(d.no)} <span class="muted" style="font-weight:600;font-size:13px">${inv?(d.kind==='custom'?'Custom invoice':'Invoice'):'Agreement'}</span></b><span class="pill ${d.status}">${DSL[d.status]}</span></div>
    <div class="muted" style="font-size:13px;margin-top:4px">${esc(d.plan.name)}${d.plan.monthly?' Plan':''} · <b style="color:var(--ink)">${amt(d,T)}</b>${d.plan.monthly&&d.term===3?' (3 months)':''}${inv?` · ${isUSD(d)?'≈ '+rs(inPKR(d,T)):'≈ '+usd(inUSD(d,T))}`:''}</div>
    <div class="muted" style="font-size:12.5px;margin-top:2px">Created ${fLong(d.date)}${inv&&d.status==='paid'?' · Cleared '+fLong(d.paidOn||d.date):''}${inv&&d.advOn&&d.status!=='unpaid'?' · Advance '+fLong(d.advOn):''}</div>
    <div class="acts"><button class="btn sm" data-dp="${d.id}">${ic('eye')}Preview</button><button class="btn sm" data-dpr="${d.id}">${ic('down')}PDF</button><button class="btn sm" data-dw="${d.id}">${ic('word')}Word</button>
      <button class="btn sm" data-ds="${d.id}">${inv?'Payment':'Status'}</button><button class="btn sm" data-de="${d.id}">${ic('edit')}Edit</button><button class="btn sm danger" data-dd="${d.id}">${ic('trash')}</button></div></div>`}).join(''):'<div class="empty" style="padding:20px">No documents yet.</div>'}</div>`}
function wClients(){
  qa('[data-cu]').forEach(el=>{const v=+el.dataset.cu;el.dataset.v=0;countUp(el,v,el.dataset.n?n=>String(Math.round(n)):rs,800)});
  let qt;$('cQ').oninput=e=>{cQuery=e.target.value;clearTimeout(qt);qt=setTimeout(()=>{const p=e.target.selectionStart;render();const i=$('cQ');i.focus();i.setSelectionRange(p,p)},200)};
  $('main').onclick=e=>cliClick(e,null);
}
function openCliModal(id){const c=cliBy(id);if(!c)return;const m=modal({title:esc(c.biz),size:'lg',body:`<div style="padding-top:12px">${cliDetail(c)}</div>`});
  m.body.onclick=e=>cliClick(e,m);m.refresh=()=>{const cc=cliBy(id);if(!cc){m.close();return}m.body.innerHTML=`<div style="padding-top:12px">${cliDetail(cc)}</div>`};cliModal=m}
let cliModal=null;
function refreshClients(){if(view==='clients'||view==='invoices')render();drawNav();if(cliModal&&!cliModal.closed)cliModal.refresh()}
async function cliClick(e,m){const t=e.target,g=a=>{const el=t.closest('['+a+']');return el?el.getAttribute(a):null};let v;
  if((v=g('data-cl'))){if(wide()){selCli=v;render()}else openCliModal(v);return}
  if((v=g('data-ci'))){openDoc({type:'invoice',clientId:v});return}
  if((v=g('data-cc'))){openDoc({type:'invoice',kind:'custom',clientId:v});return}
  if((v=g('data-ca'))){openDoc({type:'agreement',clientId:v});return}
  if((v=g('data-cq'))){openDoc({type:'quote',clientId:v});return}
  if((v=g('data-csave'))){const c=cliBy(v),box=t.closest('details');const biz=box.querySelector('[data-cf=biz]').value.trim();if(!biz){toast('Business name needed');return}
    qa('[data-cf]',box).forEach(i=>c[i.dataset.cf]=i.value.trim());save();refreshClients();toast('Client saved ✓');return}
  if((v=g('data-cdel'))){const c=cliBy(v),n=st.docs.filter(d=>d.clientId===v).length;
    if(await ask('Delete client?',`<b>${esc(c.biz)}</b>${n?` and its ${n} document(s)`:''} will be removed. This can’t be undone.`,[{label:'Cancel',value:0},{label:'Delete',value:1,cls:'dark'}])){
      st.docs=st.docs.filter(d=>d.clientId!==v);st.clients=st.clients.filter(x=>x.id!==v);if(selCli===v)selCli=null;save();refreshClients();toast('Client deleted')}return}
  const doc=id=>st.docs.find(d=>d.id===id);
  if((v=g('data-dp'))){previewDoc(doc(v));return}
  if((v=g('data-dpr'))){const d=doc(v);pdfAction(d,'pdf',e.target.closest('[data-dpr]'));return}
  if((v=g('data-dw'))){wordDownload(doc(v),docCtx());return}
  if((v=g('data-ds'))){openPay(doc(v));return}
  if((v=g('data-de'))){m&&m.close();openDoc({docId:v});return}
  if((v=g('data-ue'))){m&&m.close();openUpwork({docId:v});return}
  if((v=g('data-dd'))){const d=doc(v);if(await ask('Delete '+esc(isUp(d)?'this Upwork payment':d.no)+'?','This can’t be undone. The number won’t be reused.',[{label:'Cancel',value:0},{label:'Delete',value:1,cls:'dark'}])){st.docs=st.docs.filter(x=>x!==d);save();refreshClients();toast('Deleted '+d.no)}}
}

/* ---------- document editor ---------- */
function periodOf(plan,term,date){if(!plan.monthly)return 'Shoot day';const[y,mo]=date.split('-').map(Number),a=new Date(y,mo-1,1),b=new Date(y,mo-1+(term===3?2:0),1);
  const f=d=>d.toLocaleDateString('en-GB',{month:'short',year:'numeric'});return term===3?f(a)+' – '+f(b):a.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}
function moneyC(D){const r=D.cur==='USD'?x=>Math.round(x*100)/100:x=>Math.round(x);
  const gross=r(D.lines.reduce((a,l)=>a+(+l.qty||0)*(+l.rate||0),0)),discount=Math.min(gross,Math.max(0,r(+D.disc||0))),net=r(gross-discount);
  const taxPct=Math.max(0,+D.taxp||0),tax=r(net*taxPct/100),total=r(net+tax),upPct=Math.min(100,Math.max(0,Math.round(+D.adv||0))),upfront=r(total*upPct/100);
  return{months:1,gross,rate:gross,discount,discPct:0,discLabel:'Discount',net,taxPct,tax,total,upPct,upfront,balance:r(total-upfront)}}
async function liveRate(){const r=await fetch('https://open.er-api.com/v6/latest/USD',{cache:'no-store'});const j=await r.json();const v=j&&j.rates&&+j.rates.PKR;if(!v)throw new Error('no rate');return Math.round(v*100)/100}
function openDoc(o={}){
  const editing=o.docId?st.docs.find(d=>d.id===o.docId):null,E=editing||{};
  let kind=editing?(editing.kind||'package'):(o.kind||'package');const ty=editing?editing.type:(o.type||'quote');if(ty==='agreement')kind='package';
  const cm=E.money&&kind==='custom'?E.money:null;
  const D={type:ty,kind,pkg:editing&&kind==='package'?(st.pk.some(p=>p.id===editing.plan.id)?editing.plan.id:'custom'):(o.pkg||'growth'),
    term:editing?(editing.term||1):(o.term||(st.t3?3:1)),status:editing?editing.status:(ty==='agreement'?'sent':'unpaid'),snap:editing&&kind==='package'?editing.plan:null,dirty:!editing,periodTouched:!!editing,
    lines:editing&&editing.lines&&editing.lines.length?clone(editing.lines):[{desc:'',qty:1,rate:''}],cur:editing?(editing.currency||'PKR'):(o.cur||'PKR'),
    disc:cm?cm.discount:0,taxp:cm?cm.taxPct:(+st.biz.tax||0),adv:cm?cm.upPct:(+st.biz.upfront||0)};
  const t0=today(),cli=editing?(cliBy(editing.clientId)||editing.client):(o.clientId?cliBy(o.clientId):(o.prefill||{}));
  const TL={quote:'quotation',invoice:'invoice',agreement:'agreement'};
  const m=modal({title:'',size:'xl',body:`<div class="dedit"><div class="form">
    <div class="seg" id="dType" style="width:100%;margin-top:14px"><button data-t="quote">Quote</button><button data-t="invoice">Invoice</button><button data-t="agreement">Agreement</button></div>
    <div id="kindBox"><div class="secl">What are you billing?</div><div class="seg" id="dKind" style="width:100%;margin-top:8px"><button data-k="package">${ic('box')}A package</button><button data-k="custom">${ic('edit')}Custom amount</button></div></div>
    <div id="pkBox"><label class="fld"><span>Package</span><select class="in" id="dPkg">${st.pk.map(p=>`<option value="${p.id}">${esc(p.name)} · ${rs(price(p))}${p.monthly?'/mo':''}</option>`).join('')}<option value="custom">Custom (from calculator) · ${rs(calcBase(st.calc))}</option></select></label>
      <div id="dTermBox"><div class="secl">Plan length</div><div class="seg" id="dTerm" style="width:100%;margin-top:8px"><button data-t="1">Monthly</button><button data-t="3">3 months · −${Math.round(d3()*100)}%</button></div></div></div>
    <div id="cuBox">
      <label class="fld"><span>Project title (optional)</span><input class="in" id="dTitle" placeholder="e.g. 3D product animation for launch"></label>
      <div class="secl">Currency</div><div class="seg" id="dCur" style="width:100%;margin-top:8px"><button data-c="PKR">PKR · Rs</button><button data-c="USD">USD · $</button></div>
      <div class="secl">Items</div><div class="lns" id="dLines"></div>
      <button class="btn sm" id="dAddLn" style="margin-top:10px">${ic('plus')}Add item</button>
      <div class="g3"><label class="fld"><span id="dDiscL">Discount</span><input class="in" id="dDisc" type="number" inputmode="decimal" min="0" step="any"></label>
        <label class="fld"><span>Tax %</span><input class="in" id="dTax" type="number" inputmode="decimal" min="0" step="any"></label>
        <label class="fld"><span>Advance %</span><input class="in" id="dAdv" type="number" inputmode="numeric" min="0" max="100"></label></div>
    </div>
    <div class="secl">Client</div>
    <select class="in" id="dCli" style="margin-top:8px"><option value="">＋ New client</option>${st.clients.slice().sort((a,b)=>a.biz.localeCompare(b.biz)).map(c=>`<option value="${c.id}">${esc(c.biz)}</option>`).join('')}</select>
    <label class="fld"><span>Business / client name *</span><input class="in" id="dBiz" list="dTrials" autocomplete="off" placeholder="e.g. Coffmo"></label>
    <datalist id="dTrials">${st.trials.map(t=>`<option value="${esc(t.place)}">`).join('')}</datalist>
    <div class="g2"><label class="fld"><span>Contact person</span><input class="in" id="dPer"></label><label class="fld"><span>Phone</span><input class="in" id="dPh" type="tel"></label>
    <label class="fld"><span>Email</span><input class="in" id="dEm" type="email"></label><label class="fld"><span>Address</span><input class="in" id="dAd"></label>
    <label class="fld"><span>Client NTN (optional)</span><input class="in" id="dNtn" placeholder="Their tax number, if they need it on the invoice"></label></div>
    <div class="secl">Details</div>
    <div class="g2"><label class="fld"><span>Date</span><input class="in" id="dDate" type="date"></label>
      <label class="fld" id="fNo"><span>Invoice no.</span><input class="in" id="dNo" autocomplete="off"><small class="hint" id="dNoH"></small></label>
      <label class="fld" id="fANo"><span>Agreement no.</span><input class="in" id="dANo"></label>
      <label class="fld" id="fDue"><span>Due date</span><input class="in" id="dDue" type="date"></label>
      <label class="fld" id="fStart"><span>Start / shoot date</span><input class="in" id="dStart" type="date"></label>
      <label class="fld" id="fPer"><span id="dPerL">Period</span><input class="in" id="dPeriod"></label>
      <label class="fld" id="fFx"><span>USD rate · 1 USD = PKR</span><span class="fxrow"><input class="in" id="dFx" type="number" inputmode="decimal" min="1" step="any"><button type="button" class="btn sm" id="dFxGet">Today’s rate</button></span></label></div>
    <div id="fStat"><div class="secl">Payment status</div><div class="seg" id="dStat" style="width:100%;margin-top:8px"></div>
      <div class="g2"><label class="fld" id="fAdvOn"><span>Advance received on</span><input class="in" id="dAdvOn" type="date"></label><label class="fld" id="fPaidOn"><span>Cleared on (fully paid)</span><input class="in" id="dPaidOn" type="date"></label></div></div>
    <label class="fld"><span>Notes (optional)</span><textarea class="in" id="dNotes" style="min-height:60px"></textarea></label>
    <div class="sumbox" id="dSum"></div>
   </div><div class="live"><div class="pvbar"><b>Live preview</b><span class="grow"></span><span class="muted" style="font-size:12px">Updates as you type</span></div><div class="pvwrap" id="dLive"></div></div></div>`,
   foot:`<button class="btn hide-wide" id="dPrev" aria-label="Preview">${ic('eye')}<span class="tx">Preview</span></button><button class="btn" id="dWord" aria-label="Word">${ic('word')}<span class="tx">Word</span></button><button class="btn dark" id="dSave"></button>`});
  const b=m.body;
  // fill
  $('dCli').value=editing?editing.clientId:(o.clientId||'');
  const setCli=c=>{$('dBiz').value=c?.biz||'';$('dPer').value=c?.person||'';$('dPh').value=c?.phone||'';$('dEm').value=c?.email||'';$('dAd').value=c?.addr||'';$('dNtn').value=c?.ntn||''};setCli(cli);
  $('dDate').value=editing?editing.date:t0;$('dDue').value=editing?(editing.due||''):addDays(t0,+st.biz.due||3);$('dStart').value=editing?(editing.start||''):addDays(t0,1);
  $('dNotes').value=editing?.notes||'';$('dPkg').value=D.pkg;$('dPeriod').value=editing?.period||'';$('dTitle').value=editing?.title||'';
  $('dDisc').value=D.disc||'';$('dTax').value=D.taxp||'';$('dAdv').value=D.adv;$('dFx').value=editing?fxOf(editing):(+st.biz.fx||280);
  $('dAdvOn').value=E.advOn||'';$('dPaidOn').value=E.paidOn||'';
  $('dNo').value=editing&&editing.type==='invoice'?editing.no:nextInv();$('dANo').value=editing&&editing.type==='agreement'?editing.no:nextAgr();
  const plan=()=>(!D.dirty&&D.snap)?D.snap:snapPkg(D.pkg);
  const cust=()=>D.kind==='custom'&&D.type!=='agreement';
  const sym=()=>D.cur==='USD'?'$':'Rs';
  const fm=n=>D.cur==='USD'?usd(n):rs(n);
  function drawLines(){$('dLines').innerHTML=D.lines.map((l,i)=>`<div class="ln" data-li="${i}"><input class="in" data-lf="desc" placeholder="Item ${i+1}, e.g. 30-sec 3D product animation" value="${esc(l.desc||'')}">
    <div class="nums"><label><span>Qty</span><input class="in" data-lf="qty" type="number" inputmode="decimal" min="0" step="any" value="${esc(l.qty)}"></label>
    <label><span>Rate (${sym()})</span><input class="in" data-lf="rate" type="number" inputmode="decimal" min="0" step="any" value="${esc(l.rate)}" placeholder="0"></label>
    <b class="la" data-la="${i}">${fm((+l.qty||0)*(+l.rate||0))}</b>${D.lines.length>1?`<button type="button" class="lx" data-lx="${i}" aria-label="Remove item">${ic('x')}</button>`:'<span></span>'}</div></div>`).join('')}
  function collect(){const date=$('dDate').value||t0;let p,term,M;
    if(cust()){M=moneyC(D);const L=D.lines.filter(l=>String(l.desc||'').trim()||+l.rate);
      p={id:'custom-inv',name:$('dTitle').value.trim()||(L[0]&&String(L[0].desc||'').trim())||'Custom project',monthly:false,price:M.gross,per:0,reels:0,items:L.map(l=>String(l.desc||'').trim()).filter(Boolean)};term=1}
    else{p=plan();term=p.monthly?D.term:1;M=money(p,term)}
    const inv=D.type==='invoice';
    return{type:D.type,kind:cust()?'custom':'package',plan:p,term,money:M,currency:cust()?D.cur:'PKR',fx:Math.max(1,+$('dFx').value||+st.biz.fx||280),
      lines:cust()?D.lines.filter(l=>String(l.desc||'').trim()||+l.rate).map(l=>({desc:String(l.desc||'').trim(),qty:+l.qty||0,rate:+l.rate||0})):null,title:cust()?$('dTitle').value.trim():'',
      client:{biz:$('dBiz').value.trim(),person:$('dPer').value.trim(),phone:$('dPh').value.trim(),email:$('dEm').value.trim(),addr:$('dAd').value.trim(),ntn:$('dNtn').value.trim()},
      date,due:$('dDue').value,start:$('dStart').value||date,period:cust()?$('dPeriod').value.trim():($('dPeriod').value.trim()||periodOf(p,term,date)),status:D.status,
      advOn:inv&&D.status!=='unpaid'&&M.upPct>0&&M.upPct<100?($('dAdvOn').value||(D.status==='advance'?date:'')):'',paidOn:inv&&D.status==='paid'?($('dPaidOn').value||date):'',
      notes:$('dNotes').value.trim(),no:D.type==='invoice'?$('dNo').value.trim().toUpperCase():D.type==='agreement'?$('dANo').value.trim().toUpperCase():''}}
  function noHint(){const v=$('dNo').value.trim().toUpperCase(),dup=v&&st.docs.find(x=>x.type==='invoice'&&x.no===v&&x.id!==E.id);
    $('dNoH').innerHTML=dup?`<span style="color:var(--red)">Already used by ${esc(dup.client.biz)}</span>`:editing?'':`Next free number: <b>${nextInv()}</b>`;$('dNo').classList.toggle('bad',!!dup)}
  let lt;
  function refresh(){const c=cust(),p=c?null:plan(),mon=!c&&p.monthly,inv=D.type==='invoice';
    qa('#dType button',b).forEach(x=>{x.classList.toggle('on',x.dataset.t===D.type);x.disabled=!!editing&&x.dataset.t!==D.type});
    qa('#dKind button',b).forEach(x=>{x.classList.toggle('on',x.dataset.k===D.kind);x.disabled=!!editing&&!!E.kind&&x.dataset.k!==D.kind});
    qa('#dCur button',b).forEach(x=>x.classList.toggle('on',x.dataset.c===D.cur));
    qa('#dTerm button',b).forEach(x=>x.classList.toggle('on',+x.dataset.t===D.term));
    $('kindBox').classList.toggle('hidden',D.type==='agreement');$('pkBox').classList.toggle('hidden',c);$('cuBox').classList.toggle('hidden',!c);$('dTermBox').classList.toggle('hidden',!mon);
    $('fNo').classList.toggle('hidden',!inv);$('fDue').classList.toggle('hidden',!inv);$('fANo').classList.toggle('hidden',D.type!=='agreement');$('fFx').classList.toggle('hidden',!inv);
    $('fStart').classList.toggle('hidden',D.type!=='agreement');$('fPer').classList.toggle('hidden',D.type==='agreement');$('fStat').classList.toggle('hidden',D.type==='quote');
    $('dPerL').textContent=c?'Period / reference (optional)':'Period';$('dDiscL').textContent='Discount ('+sym()+')';
    const M=c?moneyC(D):money(p,mon?D.term:1),split=M.upPct>0&&M.upPct<100;
    const sts=D.type==='agreement'?['sent','signed']:['unpaid',...(split||D.status==='advance'?['advance']:[]),'paid'];if(!sts.includes(D.status))D.status=sts[0];
    const sk=sts.join();if($('dStat').dataset.k!==sk){$('dStat').dataset.k=sk;$('dStat').innerHTML=sts.map(s=>`<button data-s="${s}">${DSL[s]}</button>`).join('')}
    qa('#dStat button',b).forEach(x=>x.classList.toggle('on',x.dataset.s===D.status));
    $('fAdvOn').classList.toggle('hidden',!inv||!split||D.status==='unpaid');$('fPaidOn').classList.toggle('hidden',!inv||D.status!=='paid');
    if(!c&&!D.periodTouched&&$('dDate').value)$('dPeriod').value=periodOf(p,mon?D.term:1,$('dDate').value);
    const fx=+$('dFx').value||+st.biz.fx||280,cu=c?D.cur:'PKR',other=cu==='USD'?'≈ '+rs(M.total*fx):'≈ '+usd(M.total/fx);
    const nm=c?($('dTitle').value.trim()||'Custom invoice'):p.name+(mon?' Plan':'');
    $('dSum').innerHTML=`<b>${esc(nm)}</b> · <b>${cu==='USD'?usd(M.total):rs(M.total)}</b>${mon&&D.term===3?' for 3 months':mon?' / month':c?'':' one time'} <span class="muted">${other}</span>${split?`<br><span class="muted">${M.upPct}% advance: ${cu==='USD'?usd(M.upfront):rs(M.upfront)} · balance: ${cu==='USD'?usd(M.balance):rs(M.balance)}</span>`:''}`;
    qa('[data-la]',b).forEach(el=>{const l=D.lines[+el.dataset.la];if(l)el.textContent=fm((+l.qty||0)*(+l.rate||0))});
    if(inv)noHint();
    m.setTitle((editing?'Edit ':'New ')+(c&&D.type==='invoice'?'custom invoice':c?'custom quotation':TL[D.type]));
    $('dSave').innerHTML=D.type==='quote'?ic('eye')+'Preview & PDF':ic('check')+(editing?'Update & preview':'Save & preview');
    clearTimeout(lt);lt=setTimeout(()=>{if(getComputedStyle(b.querySelector('.live')).display!=='none'){const d=collect();d.client.biz=d.client.biz||'Client name';d.no=d.no||'—';renderPaper($('dLive'),DOCS.html(d,docCtx()),st.tpl.paper)}},120)}
  b.addEventListener('input',e=>{const t=e.target;if(t.id==='dPeriod')D.periodTouched=true;
    const li=t.closest('[data-li]');if(li&&t.dataset.lf){D.lines[+li.dataset.li][t.dataset.lf]=t.dataset.lf==='desc'?t.value:t.value}
    if(t.id==='dDisc')D.disc=+t.value||0;if(t.id==='dTax')D.taxp=+t.value||0;if(t.id==='dAdv')D.adv=+t.value||0;
    refresh()});
  b.addEventListener('change',e=>{const id=e.target.id;
    if(id==='dPkg'){D.pkg=e.target.value;D.dirty=true}
    if(id==='dCli'){setCli(cliBy(e.target.value)||null)}
    if(id==='dDate'&&!editing)$('dDue').value=addDays($('dDate').value,+st.biz.due||3);
    if(id==='dBiz'&&!$('dCli').value){const v=e.target.value.trim().toLowerCase();const ex=st.clients.find(c=>c.biz.toLowerCase()===v);
      if(ex){$('dCli').value=ex.id;setCli(ex);toast('Existing client selected')}else{const tr=st.trials.find(t=>t.place.toLowerCase()===v);if(tr){if(!$('dPer').value)$('dPer').value=tr.name||'';if(!$('dPh').value)$('dPh').value=tr.phone||''}}}
    refresh()});
  b.addEventListener('click',async e=>{const t=e.target;
    const ty=t.closest('#dType [data-t]');if(ty&&!ty.disabled){D.type=ty.dataset.t;D.status=D.type==='agreement'?'sent':'unpaid';refresh()}
    const kd=t.closest('#dKind [data-k]');if(kd&&!kd.disabled){D.kind=kd.dataset.k;refresh();if(D.kind==='custom'){const f=b.querySelector('[data-lf="desc"]');if(f&&!f.value)setTimeout(()=>f.focus(),60)}}
    const cu=t.closest('#dCur [data-c]');if(cu){D.cur=cu.dataset.c;drawLines();refresh()}
    if(t.closest('#dAddLn')){D.lines.push({desc:'',qty:1,rate:''});drawLines();refresh();const ins=qa('[data-lf="desc"]',b);ins[ins.length-1].focus()}
    const lx=t.closest('[data-lx]');if(lx){D.lines.splice(+lx.dataset.lx,1);drawLines();refresh()}
    const tm=t.closest('#dTerm [data-t]');if(tm){D.term=+tm.dataset.t;D.dirty=true;refresh()}
    const s=t.closest('#dStat [data-s]');if(s){D.status=s.dataset.s;if(D.status!=='unpaid'&&!$('dAdvOn').value)$('dAdvOn').value=today();if(D.status==='paid'&&!$('dPaidOn').value)$('dPaidOn').value=today();refresh()}
    if(t.closest('#dFxGet')){const bt=$('dFxGet');bt.disabled=true;bt.textContent='…';try{$('dFx').value=await liveRate();toast('Rate updated: 1 USD = Rs '+$('dFx').value)}catch(er){toast('Couldn’t get the live rate. Type it in.')}bt.disabled=false;bt.textContent='Today’s rate';refresh()}});
  function commit(){const d=collect();
    if(cust()&&!(d.money.total>0)){toast('Add at least one item with a rate');const r=b.querySelector('[data-lf="rate"]');r&&r.focus();return null}
    if(D.type==='quote')return d;
    if(!d.client.biz){toast('Add the client name');$('dBiz').focus();return null}
    if(!d.no)d.no=d.type==='invoice'?nextInv():nextAgr();
    const dup=st.docs.find(x=>x.type===d.type&&x.no===d.no&&x.id!==E.id);
    if(dup){toast(d.no+' is already used by '+dup.client.biz+'. Change the number.',3500);return null}
    let cid=$('dCli').value;
    if(cid&&cliBy(cid))Object.assign(cliBy(cid),d.client);
    else{const ex=st.clients.find(c=>c.biz.toLowerCase()===d.client.biz.toLowerCase());if(ex){cid=ex.id;Object.assign(ex,d.client)}else{cid=uid();st.clients.push({id:cid,...d.client,created:new Date().toISOString()})}}
    d.clientId=cid;
    const mm=d.no.match(d.type==='invoice'?INV_RE:AGR_RE),key=d.type==='invoice'?'invNext':'agrNext';if(mm&&+mm[1]>=st.biz[key])st.biz[key]=+mm[1]+1;
    if(editing){Object.assign(editing,d,{updated:new Date().toISOString()});d.id=editing.id}else{d.id=uid();d.created=new Date().toISOString();st.docs.unshift(d)}
    save();selCli=cid;refreshClients();return editing||d}
  $('dSave').onclick=()=>{const d=commit();if(!d)return;
    if(D.type==='quote'){previewDoc(d);return}
    m.close();toast((editing?'Updated ':'Saved ')+d.no+' ✓');setTimeout(()=>previewDoc(d),300)};
  $('dWord').onclick=()=>{const d=commit();if(!d)return;wordDownload(d,docCtx());if(D.type!=='quote'){m.close();toast('Saved '+d.no+' ✓')}};
  $('dPrev').onclick=()=>{const d=collect();d.client.biz=d.client.biz||'Client name';d.no=d.no||'—';previewDoc(d)};
  drawLines();refresh();
}

/* =================== PAYMENTS =================== */
function openPay(d){
  if(d.type!=='invoice'){d.status=d.status==='signed'?'sent':'signed';save();refreshClients();toast(d.no+': '+DSL[d.status]);return}
  const M=d.money,split=M.upPct>0&&M.upPct<100;let s=d.status;
  const opts=['unpaid',...(split||s==='advance'?['advance']:[]),'paid'];
  const m=modal({title:'Payment · '+esc(d.no),size:'sm',body:`<p style="margin:12px 0 0;line-height:1.5">${esc(d.client.biz)}<br><span class="muted">Total</span> <b>${amt(d,M.total)}</b> <span class="muted">${isUSD(d)?'≈ '+rs(inPKR(d,M.total)):'≈ '+usd(inUSD(d,M.total))}</span>${split?`<br><span class="muted">${M.upPct}% advance: ${amt(d,M.upfront)} · balance: ${amt(d,M.balance)}</span>`:''}</p>
    <div class="seg" id="pS" style="width:100%;margin-top:14px">${opts.map(k=>`<button data-s="${k}">${DSL[k]}</button>`).join('')}</div>
    <label class="fld" id="pA"><span>Advance received on</span><input class="in" type="date" id="pAd"></label>
    <label class="fld" id="pP"><span>Cleared on (fully paid)</span><input class="in" type="date" id="pPd"></label>`,
    foot:`<button class="btn" data-x>Cancel</button><button class="btn dark" data-ok>${ic('check')}Save</button>`});
  $('pAd').value=d.advOn||'';$('pPd').value=d.paidOn||'';
  const draw=()=>{qa('#pS button',m.el).forEach(x=>x.classList.toggle('on',x.dataset.s===s));$('pA').classList.toggle('hidden',!split||s==='unpaid');$('pP').classList.toggle('hidden',s!=='paid');
    if(split&&s!=='unpaid'&&!$('pAd').value)$('pAd').value=s==='advance'?today():'';if(s==='paid'&&!$('pPd').value)$('pPd').value=today()};
  m.body.onclick=e=>{const x=e.target.closest('[data-s]');if(x){s=x.dataset.s;draw()}};
  m.foot.onclick=e=>{if(e.target.closest('[data-x]'))m.close();
    if(e.target.closest('[data-ok]')){d.status=s;d.advOn=split&&s!=='unpaid'?($('pAd').value||(s==='advance'?today():'')):'';d.paidOn=s==='paid'?($('pPd').value||today()):'';
      save();m.close();refreshClients();toast(d.no+': '+DSL[s]+' ✓')}};
  draw()}

/* =================== UPWORK PAYMENTS =================== */
const isUp=d=>d.type==='upwork';
const upNet=d=>{const u=d.up||{};return +u.recvPKR>0?(+u.recvPKR)/fxOf(d):Math.max(0,d.money.total-(+u.fee||0)-(+u.cut||0))};
const stLabel=d=>isUp(d)?(d.status==='paid'?'Received':'Pending'):DSL[d.status];
function nextUpw(){let mx=0;st.docs.forEach(d=>{if(!isUp(d))return;const m=String(d.no||'').match(/(\d+)$/);if(m)mx=Math.max(mx,+m[1])});return 'UPW-'+pad3(mx+1)}
function openUpwork(o={}){
  const E=o.docId?st.docs.find(d=>d.id===o.docId):null,u=E?.up||{};let status=E?E.status:'paid';
  const nf=n=>n===''||n==null?'':+n;
  const m=modal({title:E?'Edit Upwork payment':'Add Upwork payment',size:'lg',body:`
    <p class="muted" style="margin:12px 0 0;font-size:13.5px;line-height:1.5">For work paid through Upwork. It doesn’t use your DAX numbers, but what reaches you counts in your earnings.</p>
    <div class="g2"><label class="fld"><span>Client *</span><input class="in" id="uCli" list="uCl" autocomplete="off" placeholder="e.g. Daxtel"></label>
      <label class="fld"><span>Project *</span><input class="in" id="uPrj" placeholder="e.g. Jungle Tokyo LED animation"></label>
      <label class="fld"><span>Work started</span><input class="in" id="uS" type="date"></label><label class="fld"><span>Work finished</span><input class="in" id="uE" type="date"></label>
      <label class="fld"><span>Payment received on *</span><input class="in" id="uD" type="date"></label><label class="fld"><span>Upwork contract / ref (optional)</span><input class="in" id="uRef"></label></div>
    <datalist id="uCl">${st.clients.map(c=>`<option value="${esc(c.biz)}">`).join('')}</datalist>
    <div class="secl">Money</div>
    <div class="g2"><label class="fld"><span>Client paid ($) *</span><input class="in" id="uG" type="number" inputmode="decimal" min="0" step="any" placeholder="What you charged"></label>
      <label class="fld"><span>Upwork fee %</span><input class="in" id="uP" type="number" inputmode="decimal" min="0" max="100" step="any"></label>
      <label class="fld"><span>Upwork fee ($)</span><input class="in" id="uF" type="number" inputmode="decimal" min="0" step="any"></label>
      <label class="fld"><span>Withdrawal / bank cut ($)</span><input class="in" id="uC" type="number" inputmode="decimal" min="0" step="any" placeholder="0"></label>
      <label class="fld"><span>Received in bank (Rs, optional)</span><input class="in" id="uR" type="number" inputmode="decimal" min="0" step="any" placeholder="Exact amount that hit your account"></label>
      <label class="fld"><span>USD rate · 1 USD = PKR</span><span class="fxrow"><input class="in" id="uX" type="number" inputmode="decimal" min="1" step="any"><button type="button" class="btn sm" id="uXg">Today’s rate</button></span></label></div>
    <div class="secl">Status</div><div class="seg" id="uSt" style="width:100%;margin-top:8px"><button data-s="paid">Received</button><button data-s="unpaid">Still in Upwork</button></div>
    <label class="fld"><span>Notes (optional)</span><textarea class="in" id="uN" style="min-height:56px"></textarea></label>
    <div class="sumbox" id="uSum"></div>`,
    foot:`${E?`<button class="btn danger" id="uDel" style="flex:0 0 auto">${ic('trash')}</button>`:''}<button class="btn" id="uX0">Cancel</button><button class="btn dark" id="uSave">${ic('check')}${E?'Update':'Save'}</button>`});
  const v=id=>$(id).value;
  $('uCli').value=E?E.client.biz:(o.client||'');$('uPrj').value=E?E.plan.name:'';$('uS').value=E?.start||'';$('uE').value=E?.end||'';$('uD').value=E?(E.paidOn||E.date):today();$('uRef').value=u.ref||'';
  $('uG').value=E?E.money.total:'';$('uP').value=E?nf(u.feePct):(+st.biz.upFee||10);$('uF').value=E?nf(u.fee):'';$('uC').value=E?nf(u.cut)||'':'';$('uR').value=E&&+u.recvPKR?u.recvPKR:'';
  $('uX').value=E?fxOf(E):(+st.biz.fx||280);$('uN').value=E?.notes||'';
  const r2=n=>Math.round(n*100)/100;
  function calc(){const g=+v('uG')||0,f=+v('uF')||0,c=+v('uC')||0,R=+v('uR')||0,x=+v('uX')||280;const net=R>0?R/x:Math.max(0,g-f-c);
    return{g,f,c,R,x,net,pct:g?f/g*100:0,keep:g?net/g*100:0}}
  function sum(){const k=calc();qa('#uSt button',m.el).forEach(b=>b.classList.toggle('on',b.dataset.s===status));
    $('uSum').innerHTML=k.g?`Client paid <b>${usd(k.g)}</b> → Upwork fee <b>${usd(k.f)}</b> (${r2(k.pct)}%)${k.c?` → bank cut <b>${usd(k.c)}</b>`:''}<br>You got <b>${k.R>0?rs(k.R)+'</b> ≈ '+usd(k.net):usd(k.net)+'</b> ≈ '+rs(k.net*k.x)} · <span class="muted">you kept ${Math.round(k.keep)}%</span>`:'<span class="muted">Enter what the client paid to see what reached you.</span>'}
  m.body.addEventListener('input',e=>{const id=e.target.id,g=+v('uG')||0;
    if(id==='uG'||id==='uP'){if(v('uP')!=='')$('uF').value=r2(g*(+v('uP')||0)/100)}
    if(id==='uF'){$('uP').value=g?r2((+v('uF')||0)/g*100):''}
    sum()});
  m.body.addEventListener('click',async e=>{const s=e.target.closest('#uSt [data-s]');if(s){status=s.dataset.s;sum()}
    if(e.target.closest('#uXg')){const b=$('uXg');b.disabled=true;b.textContent='…';try{$('uX').value=await liveRate();sum()}catch(er){toast('Couldn’t get the live rate. Type it in.')}b.disabled=false;b.textContent='Today’s rate'}});
  if(!E&&$('uG').value==='')$('uF').value='';
  $('uX0').onclick=()=>m.close();
  if($('uDel'))$('uDel').onclick=async()=>{if(await ask('Delete this Upwork payment?','This can’t be undone.',[{label:'Cancel',value:0},{label:'Delete',value:1,cls:'dark'}])){st.docs=st.docs.filter(x=>x!==E);save();m.close();refreshClients();toast('Deleted')}};
  $('uSave').onclick=()=>{const k=calc(),cli=v('uCli').trim(),prj=v('uPrj').trim(),date=v('uD')||today();
    if(!cli){toast('Add the client');$('uCli').focus();return}if(!prj){toast('Add the project');$('uPrj').focus();return}if(!(k.g>0)){toast('Add what the client paid');$('uG').focus();return}
    let c=st.clients.find(x=>x.biz.toLowerCase()===cli.toLowerCase());if(!c){c={id:uid(),biz:cli,source:'Upwork',created:new Date().toISOString()};st.clients.push(c)}
    const d={type:'upwork',kind:'upwork',clientId:c.id,client:{biz:c.biz,person:c.person||'',phone:c.phone||'',email:c.email||'',addr:c.addr||''},
      plan:{id:'upwork',name:prj,monthly:false,price:k.g,items:[]},term:1,currency:'USD',fx:k.x,date,start:v('uS'),end:v('uE'),status,paidOn:status==='paid'?date:'',notes:v('uN').trim(),
      money:{months:1,gross:k.g,rate:k.g,discount:0,discPct:0,net:k.g,taxPct:0,tax:0,total:k.g,upPct:0,upfront:0,balance:k.g},
      up:{ref:v('uRef').trim(),feePct:r2(k.pct),fee:k.f,cut:k.c,recvPKR:k.R}};
    if(E){Object.assign(E,d,{updated:new Date().toISOString()})}else{d.id=uid();d.no=nextUpw();d.created=new Date().toISOString();st.docs.unshift(d)}
    save();m.close();refreshClients();toast((E?'Updated':'Added')+' Upwork payment ✓')};
  sum()}

/* =================== INVOICES & EARNINGS =================== */
let iYear=String(new Date().getFullYear()),iQ='',iF='all',iSrc='all';
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fS=s=>{if(!s)return'';const[y,mo,x]=s.split('-');return new Date(+y,+mo-1,+x).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})};
const fM=s=>{if(!s)return'';const[y,mo]=s.split('-');return MON[+mo-1]+' '+y};
const workSpan=(a,b)=>{if(!a||!b||fM(a)===fM(b))return fM(a||b);const[ya,ma]=a.split('-'),[yb,mb]=b.split('-');return ya===yb?MON[+ma-1]+'–'+MON[+mb-1]+' '+yb:fM(a)+' – '+fM(b)};
const kfmt=n=>{const u=st.dcur==='USD',a=Math.abs(n),p=u?'$':'';return a>=1e6?p+(n/1e6).toFixed(a>=1e7?0:1).replace(/\.0$/,'')+'M':a>=1e3?p+(n/1e3).toFixed(a>=1e5?0:1).replace(/\.0$/,'')+'k':p+Math.round(n)};
const dueOf=d=>isUp(d)?(d.status==='paid'?0:upNet(d)):d.money.total-recv(d);
function invData(){
  const inv=st.docs.filter(d=>(d.type==='invoice'&&iSrc!=='upwork')||(isUp(d)&&iSrc!=='studio')),U=st.dcur==='USD',cv=(d,a)=>U?inUSD(d,a):inPKR(d,a),cvo=(d,a)=>U?inPKR(d,a):inUSD(d,a);
  const pe=[];inv.forEach(d=>pays(d).forEach(p=>pe.push({d,date:p.date,v:cv(d,p.a),o:cvo(d,p.a)})));
  const years=new Set([String(new Date().getFullYear())]);st.docs.forEach(d=>(d.type==='invoice'||isUp(d))&&d.date&&years.add(d.date.slice(0,4)));pe.forEach(p=>p.date&&years.add(p.date.slice(0,4)));
  const Y=[...years].sort().reverse(),inY=s=>iYear==='all'||(s||'').slice(0,4)===iYear;
  const sum=(a,f)=>a.reduce((x,y)=>x+f(y),0);
  const earnedP=pe.filter(p=>inY(p.date)),billedI=inv.filter(d=>inY(d.date)),upI=billedI.filter(isUp);
  return{inv,pe,Y,inY,cv,cvo,U,
    earned:sum(earnedP,p=>p.v),earnedO:sum(earnedP,p=>p.o),all:sum(pe,p=>p.v),allO:sum(pe,p=>p.o),
    billed:sum(billedI,d=>cv(d,d.money.total)),billedO:sum(billedI,d=>cvo(d,d.money.total)),
    due:sum(billedI,d=>cv(d,dueOf(d))),dueO:sum(billedI,d=>cvo(d,dueOf(d))),
    upFee:sum(upI,d=>cv(d,+d.up?.fee||0)),upCut:sum(upI,d=>cv(d,+d.up?.cut||0)),upGross:sum(upI,d=>cv(d,d.money.total)),upGrossUSD:sum(upI,d=>d.money.total),upFeeUSD:sum(upI,d=>+d.up?.fee||0),
    count:billedI.length,unpaidN:billedI.filter(d=>d.status!=='paid').length,earnedP,billedI}}
function vInvoices(){const X=invData(),fm=n=>X.U?usd(n):rs(n),fo=n=>X.U?rs(n):usd(n),UP=iSrc==='upwork';
  let buckets;
  if(iYear==='all'){const ys=X.Y.slice().reverse();buckets=ys.map(y=>({l:y,e:0,b:0,k:y}))}else buckets=MON.map((l,i)=>({l,e:0,b:0,k:iYear+'-'+String(i+1).padStart(2,'0')}));
  const bk=s=>iYear==='all'?(s||'').slice(0,4):(s||'').slice(0,7);
  X.earnedP.forEach(p=>{const b=buckets.find(x=>x.k===bk(p.date));if(b)b.e+=p.v});X.billedI.forEach(d=>{const b=buckets.find(x=>x.k===bk(d.date));if(b)b.b+=X.cv(d,d.money.total)});
  const mx=Math.max(1,...buckets.map(b=>Math.max(b.e,b.b)));
  const tc={};X.earnedP.forEach(p=>{const k=p.d.clientId||p.d.client.biz;tc[k]=tc[k]||{n:(cliBy(p.d.clientId)||p.d.client).biz,v:0,up:false};tc[k].v+=p.v;if(isUp(p.d))tc[k].up=true});
  const tops=Object.values(tc).sort((a,b)=>b.v-a.v).slice(0,5),tmx=Math.max(1,...tops.map(t=>t.v));
  const q=iQ.toLowerCase();
  const list=X.inv.filter(d=>X.inY(d.date)&&(iF==='all'||(iF==='open'?d.status!=='paid':d.status===iF))&&(!q||[d.no,d.client.biz,d.plan.name,d.title,d.up?.ref].join(' ').toLowerCase().includes(q)))
    .sort((a,b)=>(b.date||'').localeCompare(a.date||'')||String(b.no).localeCompare(String(a.no),undefined,{numeric:true}));
  const per=iYear==='all'?'all time':iYear,avgFee=X.upGrossUSD?Math.round(X.upFeeUSD/X.upGrossUSD*1000)/10:0;
  const stats=UP?`<div class="stat hl glass"><small>Received from Upwork · ${per}</small><b data-cu="${X.earned}">${fm(X.earned)}</b><span class="alt">≈ ${fo(X.earnedO)} · after all cuts</span></div>
    <div class="stat glass"><small>Clients paid · ${per}</small><b data-cu="${X.upGross}">${fm(X.upGross)}</b><span class="alt">${X.count} payment${X.count===1?'':'s'}</span></div>
    <div class="stat glass"><small>Upwork fees</small><b data-cu="${X.upFee}">${fm(X.upFee)}</b><span class="alt">avg ${avgFee}% of what clients paid</span></div>
    <div class="stat glass"><small>Withdrawal / bank cuts</small><b data-cu="${X.upCut}">${fm(X.upCut)}</b><span class="alt">${X.upGross?'you kept '+Math.round(X.earned/X.upGross*100)+'%':'—'}</span></div>`
   :`<div class="stat hl glass"><small>Earned · ${per}</small><b data-cu="${X.earned}">${fm(X.earned)}</b><span class="alt">≈ ${fo(X.earnedO)}</span></div>
    <div class="stat glass"><small>Billed · ${per}</small><b data-cu="${X.billed}">${fm(X.billed)}</b><span class="alt">${X.count} ${iSrc==='all'?'record':'invoice'}${X.count===1?'':'s'}</span></div>
    <div class="stat glass"><small>Still to collect</small><b data-cu="${X.due}">${fm(X.due)}</b><span class="alt">${X.unpaidN} not fully paid</span></div>
    <div class="stat glass"><small>All-time earned</small><b data-cu="${X.all}">${fm(X.all)}</b><span class="alt">≈ ${fo(X.allO)}</span></div>`;
  const row=d=>{const T=d.money.total;
    if(isUp(d)){const u=d.up||{},n=upNet(d);return `<div class="rr glass up"><div class="c-no"><b>Upwork</b><small>${esc(u.ref||d.no)}</small></div>
      <div class="c-cl"><b>${esc(d.client.biz)}</b><small>${esc(d.plan.name)}</small></div>
      <div class="c-dt"><small class="lbl2">Work</small>${d.start||d.end?workSpan(d.start,d.end):'<span class="muted">—</span>'}</div>
      <div class="c-cd"><small class="lbl2">Received</small>${d.status==='paid'?fS(d.paidOn||d.date):'<span class="muted">—</span>'}</div>
      <div class="c-st"><span class="pill ${d.status==='paid'?'paid':'advance'}">${stLabel(d)}</span></div>
      <div class="c-am"><b>${usd(T)}</b><small>got ${+u.recvPKR>0?rs(u.recvPKR):rs(inPKR(d,n))} · ${u.feePct||0}% fee</small></div>
      <div class="c-ac"><button class="btn sm" data-ue="${d.id}">${ic('edit')}<span class="hm">Edit</span></button><button class="btn sm danger" data-dd="${d.id}" aria-label="Delete">${ic('trash')}</button></div></div>`}
    return `<div class="rr glass"><div class="c-no"><b>${esc(d.no)}</b><small>${d.kind==='custom'?'Custom':'Package'}${isUSD(d)?' · USD':''}</small></div>
      <div class="c-cl"><b>${esc(d.client.biz)}</b><small>${esc(d.plan.name)}${d.plan.monthly?' Plan':''}${d.plan.monthly&&d.term===3?' · 3 months':''}</small></div>
      <div class="c-dt"><small class="lbl2">Created</small>${fS(d.date)}</div>
      <div class="c-cd"><small class="lbl2">Cleared</small>${d.status==='paid'?fS(d.paidOn||d.date):d.status==='advance'&&d.advOn?'<span class="muted">Adv. '+fS(d.advOn)+'</span>':'<span class="muted">—</span>'}</div>
      <div class="c-st"><span class="pill ${d.status}">${DSL[d.status]}</span></div>
      <div class="c-am"><b>${amt(d,T)}</b><small>${isUSD(d)?'≈ '+rs(inPKR(d,T)):'≈ '+usd(inUSD(d,T))}</small></div>
      <div class="c-ac"><button class="btn sm" data-dp="${d.id}" aria-label="Preview">${ic('eye')}<span class="hm">Preview</span></button><button class="btn sm" data-ds="${d.id}">Payment</button><button class="btn sm" data-de="${d.id}" aria-label="Edit">${ic('edit')}</button><button class="btn sm danger" data-dd="${d.id}" aria-label="Delete">${ic('trash')}</button></div></div>`};
  return `<div class="ph"><div><h1>Invoices</h1><p>Every invoice and Upwork payment, what’s been paid, and what you’ve earned.</p></div><div class="acts">
    <button class="btn" data-act="new-upwork">${ic('plus')}Upwork payment</button><button class="btn" data-act="new-custom">${ic('edit')}Custom invoice</button><button class="btn dark" data-act="new-invoice">${ic('box')}Package invoice</button></div></div>
  <div class="ibar"><div class="chips" style="margin:0">${['all',...X.Y].map(y=>`<button class="chip ${iYear===y?'on':''}" data-y="${y}">${y==='all'?'All time':y===String(new Date().getFullYear())?'This year · '+y:y===String(new Date().getFullYear()-1)?'Last year · '+y:y}</button>`).join('')}</div>
    <div class="row" style="gap:8px;flex-wrap:wrap"><div class="seg" id="iSrc"><button data-src="all" class="${iSrc==='all'?'on':''}">All</button><button data-src="studio" class="${iSrc==='studio'?'on':''}">Studio</button><button data-src="upwork" class="${UP?'on':''}">Upwork</button></div>
    <div class="seg" id="iCur"><button data-cur="PKR" class="${X.U?'':'on'}">PKR</button><button data-cur="USD" class="${X.U?'on':''}">USD</button></div></div></div>
  <div class="stats stagger">${stats}</div>
  <div class="igrid"><div class="chart glass"><div class="row"><h3 class="grow">${iYear==='all'?'Earnings by year':'Earnings by month · '+iYear}</h3><span class="lg"><i class="b"></i>${UP?'Clients paid':'Billed'}</span><span class="lg"><i class="e"></i>${UP?'Received':'Earned'}</span></div>
      <div class="bars">${buckets.map(b=>`<div class="bar" title="${b.l}: earned ${fm(b.e)} · billed ${fm(b.b)}"><span class="bb" data-k="${b.b/mx}"></span><span class="be" data-k="${b.e/mx}"></span>${b.e?`<span class="bv" style="--k:${b.e/mx}">${kfmt(b.e)}</span>`:''}<span class="bl">${b.l}</span></div>`).join('')}</div></div>
    <div class="tops glass"><h3>Top clients · ${per}</h3>${tops.length?tops.map(t=>`<div class="tc"><div class="r"><span>${esc(t.n)}${t.up&&!UP?' <em class="upt">Upwork</em>':''}</span><span>${fm(t.v)}</span></div><div class="tr"><i data-w="${t.v/tmx}"></i></div></div>`).join(''):'<p class="muted" style="font-size:13.5px;margin-top:12px">No payments received in this period yet.</p>'}</div></div>
  <div class="toolbar"><div class="search">${ic('search')}<input class="in" id="iQ" placeholder="Search number, client or project…" value="${esc(iQ)}"></div>
    <button class="btn" id="iCsv">${ic('down')}CSV</button></div>
  <div class="chips">${(UP?[['all','All'],['paid','Received'],['unpaid','Still in Upwork']]:[['all','All'],['open','Not paid yet'],['unpaid','Unpaid'],['advance','Advance paid'],['paid','Paid']]).map(([k,l])=>`<button class="chip ${iF===k?'on':''}" data-f="${k}">${l}</button>`).join('')}</div>
  <p class="muted" style="font-size:12.5px;margin:0 0 10px">${UP?'Upwork payments don’t use DAX numbers':'Next invoice number: <b>'+nextInv()+'</b>'} · ${list.length} shown</p>
  <div class="reg">${list.length?`<div class="rh"><span>No.</span><span>Client</span><span>${UP?'Work period':'Created'}</span><span>${UP?'Received':'Cleared'}</span><span>Status</span><span style="text-align:right">Amount</span><span></span></div>`+list.map(row).join('')
    :`<div class="empty glass card"><b>${X.inv.length?'Nothing here':UP?'No Upwork payments yet':'No invoices yet'}</b>${X.inv.length?'Try another year or filter.':UP?'Tap “Upwork payment” to add what a client paid and what reached you.':'Create a package or custom invoice. You can also add your old invoices with their real dates and numbers, and they’ll count in your earnings.'}</div>`}</div>`}
function wInvoices(){
  qa('[data-cu]').forEach(el=>{const v=+el.dataset.cu;el.dataset.v=0;countUp(el,v,st.dcur==='USD'?usd:rs,800)});
  requestAnimationFrame(()=>requestAnimationFrame(()=>{qa('.bars [data-k]').forEach(el=>el.style.setProperty('--k',el.dataset.k));qa('.tc [data-w]').forEach(el=>el.style.width=(+el.dataset.w*100)+'%')}));
  let qt;$('iQ').oninput=e=>{iQ=e.target.value;clearTimeout(qt);qt=setTimeout(()=>{const p=e.target.selectionStart;render();const i=$('iQ');i.focus();i.setSelectionRange(p,p)},200)};
  $('iCsv').onclick=exportInvCsv;
  $('main').onclick=e=>{const t=e.target;let x;
    if((x=t.closest('[data-y]'))){iYear=x.dataset.y;render();return}
    if((x=t.closest('[data-f]'))){iF=x.dataset.f;render();return}
    if((x=t.closest('[data-src]'))){iSrc=x.dataset.src;iF='all';render();return}
    if((x=t.closest('[data-cur]'))){st.dcur=x.dataset.cur;save();render();return}
    cliClick(e,null)}}
function exportInvCsv(){const inv=st.docs.filter(d=>d.type==='invoice'||isUp(d));if(!inv.length){toast('No invoices yet');return}
  const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"',r2=n=>Math.round(n*100)/100;
  const cols=['Number','Type','Date','Due','Client','Contact','Phone','Item / project','Work from','Work to','Currency','Total (client paid)','USD rate','Total PKR','Total USD','Upwork fee %','Upwork fee $','Bank cut $','Status','Advance received on','Cleared / received on','Received PKR','Received USD','Outstanding PKR'];
  dl(today()+'-invoices-and-upwork.csv','﻿'+[cols.join(',')].concat(inv.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')).map(d=>{const T=d.money.total,up=isUp(d),u=d.up||{};
    const R=up?(d.status==='paid'?upNet(d):0):recv(d);
    return[up?(u.ref||d.no):d.no,up?'Upwork':d.kind==='custom'?'Custom':'Package',d.date,up?'':d.due,d.client.biz,d.client.person,d.client.phone,d.plan.name+(d.plan.monthly&&d.term===3?' (3 months)':''),d.start||'',d.end||'',d.currency||'PKR',T,fxOf(d),Math.round(inPKR(d,T)),r2(inUSD(d,T)),up?u.feePct:'',up?u.fee:'',up?(u.cut||0):'',stLabel(d),d.advOn||'',d.status==='paid'?(d.paidOn||d.date):'',up&&+u.recvPKR>0?u.recvPKR:Math.round(inPKR(d,R)),r2(inUSD(d,R)),Math.round(inPKR(d,dueOf(d)))].map(q).join(',')})).join('\n'),'text/csv');toast('CSV downloaded')}

/* =================== SETTINGS (draft + Save) =================== */
let draft=null,base='';
const SKEYS=['biz','pk','rates','disc3','bonusOn','bonus','costs','tpl'];
function newDraft(){draft=clone(Object.fromEntries(SKEYS.map(k=>[k,st[k]])));base=JSON.stringify(draft)}
const setDirty=()=>!!draft&&JSON.stringify(draft)!==base;
function markDirty(){$('savebar').classList.toggle('show',view==='settings'&&setDirty())}
function saveSettings(){if(!draft)return;
  const B=draft.biz;['upfront','tax','due','invNext','agrNext'].forEach(k=>B[k]=Math.max(0,Math.round(+B[k]||0)));B.upfront=Math.min(100,B.upfront);B.invNext=Math.max(1,B.invNext);B.agrNext=Math.max(1,B.agrNext);B.fx=Math.max(1,Math.round((+B.fx||280)*100)/100);
  draft.disc3=Math.min(90,Math.max(0,Math.round(+draft.disc3||0)));
  SKEYS.forEach(k=>st[k]=clone(draft[k]));save();newDraft();markDirty();toast('Settings saved ✓');drawNav()}
function discardSettings(){newDraft();markDirty()}
$('sbSave').onclick=()=>{saveSettings();if(view==='settings')render()};
$('sbDiscard').onclick=()=>{discardSettings();render();toast('Changes discarded')};
addEventListener('beforeunload',e=>{if(setDirty()){e.preventDefault();e.returnValue=''}});

function vSettings(){
  if(!draft)newDraft();const S=draft,B=S.biz,T=S.tpl,R=S.rates,C=S.costs;
  const f=(path,label,type='text',extra='')=>`<label class="fld"><span>${label}</span><input class="in" data-d="${path}" type="${type}" ${type==='number'?'inputmode="numeric"':''} value="${esc(getP(S,path)??'')}" ${extra}></label>`;
  const tgl=(path,label,sub)=>`<div class="tgrow"><div><b>${label}</b>${sub?`<small>${sub}</small>`:''}</div><label class="tg"><input type="checkbox" data-d="${path}" ${getP(S,path)?'checked':''}><i></i></label></div>`;
  const ACC=['#7A5A44','#151311','#1F3A5F','#2F6B45','#7A2E2E','#C2521D','#5B3F86'];
  return `<div class="ph"><div><h1>Settings</h1><p>Prices, business details and your document template. Tap <b>Save</b> when you’re done.</p></div>
    <div class="acts"><button class="btn" id="stDisc">Discard</button><button class="btn dark" id="stSave">${ic('check')}Save settings</button></div></div>
  <div class="stabs">${[['s-biz','Business'],['s-pk','Packages'],['s-price','Pricing'],['s-doc','Documents'],['s-cost','My costs'],['s-data','Data'],['s-sync','Cloud'],['s-acc','Account']].map(([a,l])=>`<button class="chip" data-go="${a}">${l}</button>`).join('')}</div>
  <div class="sgrid">
  <section class="sc glass" id="s-biz"><h3>My business</h3><p class="muted">Shown on invoices, quotes and agreements.</p>
    <div class="g2">${f('biz.name','Business name')}${f('biz.owner','Owner name')}${f('biz.ntn','Your NTN number','text','placeholder="Shows on every invoice, quote and agreement"')}${f('biz.phone','Phone / WhatsApp','tel')}${f('biz.email','Email','email')}${f('biz.addr','Address')}</div>
    <label class="fld"><span>Payment details (bank, account title, IBAN)</span><textarea class="in" data-d="biz.pay" placeholder="Bank: …&#10;Account title: …&#10;IBAN: …">${esc(B.pay)}</textarea></label>
    <div class="g3">${f('biz.upfront','Advance %','number')}${f('biz.tax','Sales tax %','number')}${f('biz.due','Balance due (days)','number')}</div>
    <div class="g2">${f('biz.invNext','Start invoice numbers from','number','min="1"')}${f('biz.agrNext','Start agreement numbers from','number','min="1"')}</div>
    <p class="muted" style="font-size:12.5px">Next: <b id="nInv">${invNo(Math.max(+B.invNext||1,nextNum('invoice')))}</b> · <b id="nAgr">${agrNo(Math.max(+B.agrNext||1,nextNum('agreement')))}</b>. The app always skips numbers you’ve already used.</p>
    <label class="fld"><span>Dollar rate · 1 USD = PKR</span><span class="fxrow"><input class="in" data-d="biz.fx" type="number" inputmode="decimal" step="any" min="1" value="${esc(B.fx)}"><button type="button" class="btn sm" id="sFxGet">Today’s rate</button></span></label>
    ${f('biz.upFee','Usual Upwork fee %','number','step="any" min="0" max="100"')}
    <p class="muted" style="font-size:12px;margin:6px 0 0">Used to show PKR and USD side by side. Each invoice keeps the rate from the day you made it.</p></section>

  <section class="sc glass" id="s-pk"><h3>Packages</h3><p class="muted">Total = reels × per reel + shoots + photos + ad films + extras. Type a total to work out the per-reel price.</p>
    ${S.pk.map((p,i)=>`<div class="pkedit" data-pi="${i}"><div class="head"><b>${esc(p.name)}</b><span class="muted" style="font-size:12px">${p.monthly?'per month':'one time'}</span><span class="tot" id="pt-${i}">${rs(price(p,R))}</span></div>
      <div class="g2">${f(`pk.${i}.name`,'Name')}${f(`pk.${i}.tag`,'Tagline')}</div>
      <div class="g6">${f(`pk.${i}.per`,'Per reel','number')}${f(`pk.${i}.reels`,'Reels','number')}${f(`pk.${i}.visits`,'Shoots','number')}${f(`pk.${i}.photos`,'Photos','number')}${f(`pk.${i}.films`,'Ad films','number')}
        <label class="fld"><span>Total</span><input class="in" data-tot="${i}" type="number" inputmode="numeric" value="${price(p,R)}" style="font-weight:800"></label></div>
      ${p.monthly?`<div class="g2" style="margin-top:6px">${tgl(`pk.${i}.stories`,'Story pack')}${tgl(`pk.${i}.posting`,'We post for them')}</div>
        <div class="tgrow"><div><b>“Most chosen” badge</b><small>Highlight this plan</small></div><label class="tg"><input type="radio" name="rec" data-rec="${i}" ${p.rec?'checked':''}><i></i></label></div>`:''}
      <label class="fld"><span>Extra inclusions (one per line)</span><textarea class="in" data-ex="${i}" style="min-height:56px">${esc((p.extras||[]).join('\n'))}</textarea></label>
      <label class="fld"><span>“What is this?” explanation</span><textarea class="in" data-d="pk.${i}.why" style="min-height:56px">${esc(p.why)}</textarea></label>
      <div class="brk" id="pb-${i}"></div></div>`).join('')}</section>

  <section class="sc glass" id="s-price"><h3>Pricing</h3><p class="muted">Item prices used in every package and the calculator.</p>
    <div class="g3">${f('rates.visit','Shoot visit','number')}${f('rates.photo','Per photo','number')}${f('rates.film','Ad film','number')}${f('rates.stories','Story pack','number')}${f('rates.posting','We post','number')}${f('disc3','3-month discount %','number')}</div>
    ${tgl('bonusOn','Show bonus','On packages, quotes and share links')}${f('bonus','Bonus text')}</section>

  <section class="sc glass" id="s-doc"><h3>Document template</h3><p class="muted">How your invoices, quotations and agreements look.</p>
    <div class="tplwrap"><div>
      <div class="secl">Accent colour</div><div class="sws" id="tAcc">${ACC.map(c=>`<button data-acc="${c}" class="${T.accent===c?'on':''}" style="background:${c}" aria-label="${c}"></button>`).join('')}<input type="color" id="tAccC" value="${esc(T.accent)}" aria-label="Custom colour"></div>
      <div class="secl">Header style</div><div class="opts" data-opt="header">${[['classic','Classic'],['band','Colour band'],['minimal','Minimal']].map(([k,l])=>`<button class="opt ${T.header===k?'on':''}" data-v="${k}"><div class="sw" style="${k==='band'?`background:${T.accent}`:k==='minimal'?'border-left:4px solid '+T.accent:'border-bottom:3px solid #151311'}"></div>${l}</button>`).join('')}</div>
      <div class="secl">Font</div><div class="opts" data-opt="font">${[['elegant','Elegant','Cinzel,serif'],['modern','Modern','Manrope,sans-serif'],['classic','Classic','Georgia,serif']].map(([k,l,ff])=>`<button class="opt ${T.font===k?'on':''}" data-v="${k}"><div class="sw" style="display:grid;place-items:center;font:700 15px ${ff}">Aa</div>${l}</button>`).join('')}</div>
      <div class="g2"><label class="fld"><span>Paper size</span><select class="in" data-d="tpl.paper"><option ${T.paper==='A4'?'selected':''}>A4</option><option ${T.paper==='Letter'?'selected':''}>Letter</option></select></label>
        <label class="fld"><span>Currency</span><select class="in" data-d="tpl.currency">${['Rs','PKR','Rs.'].map(c=>`<option ${T.currency===c?'selected':''}>${c}</option>`).join('')}</select></label></div>
      <div class="secl">Show on documents</div>
      ${tgl('tpl.showLogo','Logo')}${tgl('tpl.showQR','QR code to your work','Invoices & quotes')}${tgl('tpl.showPay','Payment details','Invoices')}${tgl('tpl.showTerms','Terms','Invoices')}${tgl('tpl.showSig','Signature line','Invoices')}${tgl('tpl.showStamp','“Paid” stamp','When an invoice is marked paid')}
      <div class="secl">Logo</div><div class="row" style="margin-top:8px"><img id="tLogoImg" src="${esc(T.logo||'/assets/logo.png')}" style="height:44px;max-width:140px;object-fit:contain;background:#fff;border-radius:10px;padding:6px;border:1px solid var(--line)">
        <button class="btn sm" id="tLogoUp">${ic('up')}Upload logo</button>${T.logo?`<button class="btn sm ghost" id="tLogoRs">Use default</button>`:''}<input type="file" id="tLogoF" accept="image/*" class="hidden"></div>
      <div class="g2">${f('tpl.invoiceTitle','Invoice title')}${f('tpl.quoteTitle','Quotation title')}${f('tpl.agreementTitle','Agreement title')}${f('tpl.agreementHeading','Agreement heading')}</div>
      <label class="fld"><span>Invoice terms (one per line)</span><textarea class="in" data-d="tpl.terms" style="min-height:120px">${esc(T.terms)}</textarea></label>
      <label class="fld"><span>Custom invoice terms (one per line)</span><textarea class="in" data-d="tpl.customTerms" style="min-height:96px">${esc(T.customTerms)}</textarea></label>
      <p class="muted" style="font-size:12px;margin:6px 0 0">Use <b>{advance}</b>, <b>{balance}</b>, <b>{due}</b> and <b>{currency}</b>. They fill in automatically.</p>
      ${f('tpl.footer','Footer note')}
      <button class="btn sm ghost" id="tReset" style="margin-top:10px">Reset template to default</button>
    </div>
    <div class="pvbox"><div class="seg" id="tpvT" style="width:100%"><button data-t="invoice" class="on">Invoice</button><button data-t="quote">Quote</button><button data-t="agreement">Agreement</button></div>
      <div class="glass" style="border-radius:18px;margin-top:10px;overflow:hidden"><div class="pvwrap" id="tpv" style="max-height:640px"></div></div></div></div></section>

  <section class="sc glass" id="s-cost"><h3>My costs</h3><p class="muted">Used for “Show my profit” in the calculator. Never shown to clients.</p>
    <div class="g2">${f('costs.editor','Editor per reel','number')}${f('costs.travel','Travel per shoot','number')}${f('costs.photo','Photo edit per photo','number')}${f('costs.film','Ad film edit','number')}</div></section>

  <section class="sc glass" id="s-data"><h3>Data &amp; backup</h3><p class="muted">Your records live in your Vercel cloud (see Cloud below). A backup file is an extra safety copy, and Restore / import adds records from a file.</p>
    <div class="row" style="flex-wrap:wrap;margin-top:10px"><button class="btn" id="bk">${ic('down')}Download backup</button><button class="btn" id="rs">${ic('up')}Restore / import</button>
      <button class="btn" id="csvT">Trials CSV</button><button class="btn" id="csvI">Invoices CSV</button><button class="btn" id="wImp">Import walk-ins</button></div>
    <input type="file" id="rsF" accept=".json,application/json" class="hidden"><input type="file" id="wF" accept=".json,application/json" class="hidden">
    <button class="btn sm ghost danger" id="pkReset" style="margin-top:12px">Reset packages &amp; prices to default</button></section>

  <section class="sc glass" id="s-sync"><h3>Cloud sync</h3><div id="syncAcc">${syncCard()}</div></section>
  <section class="sc glass" id="s-acc"><h3>Account</h3><p class="muted">This app is locked with your password. To change it: Vercel → your project → Settings → Environment Variables → <b>APP_PASSWORD</b> → edit → then Redeploy.</p>
    <a class="btn" href="/api/logout" style="margin-top:10px">${ic('out')}Log out of this device</a></section>
  </div>`}
function getP(o,p){return p.split('.').reduce((a,k)=>a==null?a:a[k],o)}
function setP(o,p,v){const ks=p.split('.');let a=o;ks.slice(0,-1).forEach(k=>a=a[k]);a[ks[ks.length-1]]=v}
const NUMS=/^(biz\.(upfront|tax|due|invNext|agrNext|fx|upFee)|disc3|rates\.|costs\.|pk\.\d+\.(per|reels|visits|photos|films))/;
let tpvType='invoice',tpvT;
function sampleDoc(type){const S=draft,p=snapPkg('growth',S),date=today(),M=money(p,1,S);
  return{type,no:type==='invoice'?invNo(S.biz.invNext):type==='agreement'?agrNo(S.biz.agrNext):'',plan:p,term:1,money:M,date,due:addDays(date,+S.biz.due||3),start:addDays(date,1),
    period:periodOf(p,1,date),status:'unpaid',notes:'',client:{biz:'Sample Café',person:'Ali Khan',phone:'0300 0000000',email:'',addr:'DHA Phase 6, Karachi'}}}
function drawTplPreview(){clearTimeout(tpvT);tpvT=setTimeout(()=>{const h=$('tpv');if(!h)return;renderPaper(h,DOCS.html(sampleDoc(tpvType),{biz:draft.biz,tpl:draft.tpl,bonus:draft.bonusOn?draft.bonus:''}),draft.tpl.paper)},120)}
function pkLive(i){const p=draft.pk[i],R=draft.rates;$('pt-'+i).textContent=rs(price(p,R));const t=document.querySelector(`[data-tot="${i}"]`);if(t&&document.activeElement!==t)t.value=price(p,R);
  const a=[p.reels+' reels × '+rs(p.per)];if(p.visits)a.push(p.visits+' shoots × '+rs(R.visit));if(p.photos)a.push(p.photos+' photos × '+rs(R.photo));if(p.films)a.push(p.films+' ad films × '+rs(R.film));
  if(p.stories)a.push('stories '+rs(R.stories));if(p.posting)a.push('posting '+rs(R.posting));$('pb-'+i).textContent=a.join(' + ')+' = '+rs(price(p,R))}
function wSettings(){
  const S=draft;S.pk.forEach((_,i)=>pkLive(i));drawTplPreview();
  const main=$('main');
  main.oninput=e=>{const el=e.target;
    if(el.dataset.d){let v=el.type==='checkbox'?el.checked:el.value;if(NUMS.test(el.dataset.d))v=Math.max(0,+v||0);setP(S,el.dataset.d,v)}
    if(el.dataset.ex!=null)S.pk[+el.dataset.ex].extras=el.value.split('\n').map(s=>s.trim()).filter(Boolean);
    const pe=el.closest('[data-pi]');if(pe){const i=+pe.dataset.pi;if(el.dataset.d&&el.dataset.d.endsWith('.name'))pe.querySelector('.head b').textContent=el.value||'Untitled';pkLive(i)}
    if(el.dataset.d&&/^rates\./.test(el.dataset.d))S.pk.forEach((_,i)=>pkLive(i));
    if(el.dataset.d==='biz.invNext')$('nInv').textContent=invNo(Math.max(+el.value||1,nextNum('invoice')));if(el.dataset.d==='biz.agrNext')$('nAgr').textContent=agrNo(Math.max(+el.value||1,nextNum('agreement')));
    if(el.id==='tAccC'){S.tpl.accent=el.value;qa('#tAcc [data-acc]').forEach(b=>b.classList.remove('on'))}
    markDirty();drawTplPreview()};
  main.onchange=e=>{const el=e.target;
    if(el.dataset.tot!=null){const i=+el.dataset.tot,p=S.pk[i],ex=price(p,S.rates)-p.reels*p.per;p.per=Math.max(0,Math.round(((+el.value||0)-ex)/Math.max(1,p.reels)));
      const pi=main.querySelector(`[data-d="pk.${i}.per"]`);if(pi)pi.value=p.per;pkLive(i);markDirty();drawTplPreview()}
    if(el.dataset.rec!=null){S.pk.forEach((p,i)=>p.rec=p.monthly&&i===+el.dataset.rec);markDirty()}
    if(el.dataset.d&&/pk\.\d+\.(reels|visits)/.test(el.dataset.d)){const[,i,k]=el.dataset.d.split('.');S.pk[+i][k]=Math.max(1,+el.value||1);el.value=S.pk[+i][k];pkLive(+i)}};
  main.onclick=e=>{const t=e.target;
    const g=t.closest('[data-go]');if(g){$(g.dataset.go).scrollIntoView({behavior:'smooth',block:'start'})}
    const a=t.closest('[data-acc]');if(a){S.tpl.accent=a.dataset.acc;$('tAccC').value=a.dataset.acc;qa('#tAcc [data-acc]').forEach(b=>b.classList.toggle('on',b===a));refreshOpts();markDirty();drawTplPreview()}
    const o=t.closest('[data-opt] .opt');if(o){const k=o.parentElement.dataset.opt;S.tpl[k]=o.dataset.v;qa('.opt',o.parentElement).forEach(b=>b.classList.toggle('on',b===o));markDirty();drawTplPreview()}
    const pv=t.closest('#tpvT [data-t]');if(pv){tpvType=pv.dataset.t;qa('#tpvT button').forEach(b=>b.classList.toggle('on',b===pv));drawTplPreview()}};
  function refreshOpts(){qa('[data-opt="header"] .opt .sw').forEach((sw,i)=>{const k=['classic','band','minimal'][i];sw.style.cssText=k==='band'?`background:${S.tpl.accent}`:k==='minimal'?'border-left:4px solid '+S.tpl.accent:'border-bottom:3px solid #151311'})}
  $('stSave').onclick=()=>{saveSettings();render()};
  $('sFxGet').onclick=async()=>{const bt=$('sFxGet');bt.disabled=true;bt.textContent='…';try{const v=await liveRate();S.biz.fx=v;main.querySelector('[data-d="biz.fx"]').value=v;markDirty();toast('1 USD = Rs '+v+'. Tap Save.')}catch(er){toast('Couldn’t get the live rate. Type it in.')}bt.disabled=false;bt.textContent='Today’s rate'};
  $('stDisc').onclick=()=>{if(!setDirty()){toast('No changes to discard');return}discardSettings();render();toast('Changes discarded')};
  $('tLogoUp').onclick=()=>$('tLogoF').click();
  $('tLogoF').onchange=e=>{const fl=e.target.files[0];if(!fl)return;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,600/Math.max(im.width,im.height)),c=document.createElement('canvas');
    c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);S.tpl.logo=c.toDataURL('image/png');markDirty();render();toast('Logo ready. Tap Save.')};im.src=rd.result};rd.readAsDataURL(fl);e.target.value=''};
  if($('tLogoRs'))$('tLogoRs').onclick=()=>{S.tpl.logo='';markDirty();render()};
  $('tReset').onclick=async()=>{if(await ask('Reset template?','Colours, fonts, titles and terms go back to default. You still need to tap Save.',[{label:'Cancel',value:0},{label:'Reset',value:1,cls:'dark'}])){S.tpl=clone(DOCS.DEF_TPL);markDirty();render()}};
  $('pkReset').onclick=async()=>{if(await ask('Reset packages & prices?','All packages, item prices and the 3-month discount go back to default. You still need to tap Save.',[{label:'Cancel',value:0},{label:'Reset',value:1,cls:'dark'}])){S.pk=clone(DEF_PK);S.rates=clone(DEF_RATES);S.disc3=10;markDirty();render()}};
  $('bk').onclick=()=>{dl(today()+'-daxator-packages-backup.json',JSON.stringify(st,null,1),'application/json');toast('Backup downloaded ✓')};
  $('rs').onclick=()=>$('rsF').click();
  $('rsF').onchange=e=>{const fl=e.target.files[0];if(!fl)return;const rd=new FileReader();rd.onload=async()=>{try{const o=JSON.parse(rd.result);
      if(Array.isArray(o)){importWalk(o);return}if(!o||typeof o!=='object')throw 0;
      const useS=(o.pk||o.biz||o.tpl)?await ask('Restore backup','Add the records from this backup. Also use its settings (prices, business details, template)?',[{label:'Records only',value:false},{label:'Records + settings',value:true,cls:'dark'}]):false;
      if(useS===null)return;
      const {n,moved,dupe}=mergeRecords(o);
      if(useS){applyData({...o,trials:null,clients:null,docs:null},true)}
      if(o.biz){['invNext','agrNext'].forEach(k=>{if(+o.biz[k]>st.biz[k])st.biz[k]=+o.biz[k]})}
      migrate();save();newDraft();render();drawNav();toast((n?'Added '+n+' records':'Nothing new to add')+(useS?' + settings':'')+' ✓',3500);
      if(moved.length)await ask('Invoice numbers updated','These invoices had the same number as an older one, so they moved to the next free number:<br><br><b>'+moved.map(esc).join('<br>')+'</b>',[{label:'OK',value:1,cls:'dark'}]);
      else if(dupe&&!n)toast('These records are already in the app',3000)}catch(er){console.warn(er);toast('That isn’t a valid backup file')}};rd.readAsText(fl);e.target.value=''};
  $('wImp').onclick=()=>$('wF').click();
  $('wF').onchange=e=>{const fl=e.target.files[0];if(!fl)return;const rd=new FileReader();rd.onload=()=>{try{const w=JSON.parse(rd.result);if(!Array.isArray(w))throw 0;importWalk(w)}catch(er){toast('That isn’t a walk-in backup file')}};rd.readAsText(fl);e.target.value=''};
  const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  $('csvT').onclick=()=>{if(!st.trials.length){toast('No trials yet');return}const cols=['place','name','role','phone','status','date','time','pkg','notes','created'];
    dl(today()+'-trial-shoots.csv','﻿'+[cols.join(',')].concat(st.trials.map(r=>cols.map(k=>q(k==='status'?SL[r.status]:k==='pkg'?(pkBy(r.pkg)?.name||''):r[k])).join(','))).join('\n'),'text/csv')};
  $('csvI').onclick=exportInvCsv;
}

/* ---------- merge a backup / import file into this device ---------- */
function mergeRecords(o){let n=0,dupe=0;const idMap={};
  const tids=new Set(st.trials.map(t=>t.id));(o.trials||[]).forEach(x=>{if(!x||!x.id)return;if(tids.has(x.id)){dupe++;return}st.trials.push({...x,pkg:OLDMAP[x.pkg]||x.pkg||''});n++});
  (o.clients||[]).forEach(c=>{if(!c||!c.id)return;if(cliBy(c.id)){dupe++;return}
    const ex=st.clients.find(x=>String(x.biz||'').trim().toLowerCase()===String(c.biz||'').trim().toLowerCase());
    if(ex){idMap[c.id]=ex.id;['person','phone','email','addr','ntn','source'].forEach(k=>{if(!ex[k]&&c[k])ex[k]=c[k]})}else{st.clients.push(c);n++}});
  const dids=new Set(st.docs.map(d=>d.id));
  const same=(a,b)=>a.type===b.type&&String(a.no||'').toUpperCase()===String(b.no||'').toUpperCase()&&a.date===b.date&&Math.abs((a.money?.total||0)-(b.money?.total||0))<.01&&String(a.client?.biz||'').trim().toLowerCase()===String(b.client?.biz||'').trim().toLowerCase();
  (o.docs||[]).forEach(d=>{if(!d||!d.id)return;if(dids.has(d.id)||st.docs.some(x=>same(x,d))){dupe++;return}if(idMap[d.clientId])d.clientId=idMap[d.clientId];st.docs.push(d);n++});
  // same number used twice: the older document keeps it, the newer one moves to the next free number
  const moved=[];
  ['invoice','agreement'].forEach(type=>{const by={};st.docs.filter(d=>d.type===type&&d.no).forEach(d=>{const k=String(d.no).trim().toUpperCase();(by[k]=by[k]||[]).push(d)});
    Object.values(by).filter(a=>a.length>1).forEach(a=>{a.sort((x,y)=>(x.date||'').localeCompare(y.date||'')||(x.created||'').localeCompare(y.created||''));
      a.slice(1).forEach(d=>{const old=d.no;d.no=type==='invoice'?nextInv():nextAgr();moved.push(old+' → '+d.no+' · '+d.client.biz+(d.plan&&d.plan.name?' ('+d.plan.name+')':''))})})});
  return{n,moved,dupe}}

/* =================== START =================== */
const h=location.hash.slice(1);if(VIEWS.some(v=>v[0]===h))view=h;
addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(VIEWS.some(x=>x[0]===v)&&v!==view)go(v)});
let lastWide=wide();addEventListener('resize',()=>{const w=wide();if(w!==lastWide){lastWide=w;if(view==='clients')render()}});
drawNav();render();
// ---- cloud sync wiring ----
setSync('idle');cloudPull();
setInterval(()=>{if(document.hidden)return;if(cloud.pendingRender&&!document.querySelector('.ov'))quietRender();if(Date.now()-cloud.last>45000)cloudPull()},15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-cloud.last>10000)cloudPull()});
addEventListener('online',()=>{sy.dirty?cloudPush():cloudPull()});addEventListener('offline',()=>setSync('offline'));
addEventListener('beforeunload',e=>{if(sy.dirty&&cloud.on){cloudPush()}});
document.addEventListener('click',async e=>{
  if(e.target.closest('#syNow')){toast('Syncing…');await cloudPull(true);if(cloud.state==='ok')toast('Synced ✓')}
  if(e.target.closest('#syWipe')){if(cloud.state!=='ok'||sy.dirty){toast('Wait until it says Synced first');return}
    if(await ask('Remove data from this device?','Your invoices stay safe in your Vercel cloud. This only clears the copy on this phone or computer and signs you out.',[{label:'Cancel',value:0},{label:'Remove & sign out',value:1,cls:'dark'}])){
      try{localStorage.removeItem(KEY);localStorage.removeItem(SYK)}catch(er){}location.href='/api/logout'}}
  if(e.target.closest('.sync')&&!e.target.closest('#syncAcc')){go('settings');setTimeout(()=>{const el=$('s-sync');el&&el.scrollIntoView({behavior:'smooth',block:'start'})},250)}});
window.__dx={st,go,openDoc,openShare,openCalc,saveSettings,openPay,nextInv,openUpwork,cloud,sy,cloudPull,cloudPush,mergeIn};
})();
