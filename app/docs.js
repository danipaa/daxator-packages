/* =========================================================
   DOCUMENTS — invoice, quotation, agreement (template aware)
   ========================================================= */
(function(){
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nl=s=>esc(s).replace(/\n/g,'<br>');
const fLong=d=>{if(!d)return'';const[y,m,x]=d.split('-');return new Date(+y,+m-1,+x).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})};
const ymd=t=>t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
const addDays=(d,n)=>{const[y,m,x]=d.split('-');const t=new Date(+y,+m-1,+x);t.setDate(t.getDate()+n);return ymd(t)};
const monthsLater=(d,n)=>{const[y,m,x]=d.split('-');const t=new Date(+y,+m-1+n,+x);t.setDate(t.getDate()-1);return ymd(t)};

const DEF_TPL={
  accent:'#7A5A44', header:'classic', font:'elegant', paper:'A4', currency:'Rs',
  showLogo:true, logo:'', showQR:true, showPay:true, showTerms:true, showSig:true, showStamp:true,
  invoiceTitle:'INVOICE', quoteTitle:'QUOTATION', agreementTitle:'AGREEMENT', agreementHeading:'Video Production Services Agreement',
  terms:[
    '{advance}% advance is due on the invoice date. Shoots are scheduled once it is received.',
    'The {balance}% balance is due within {due} days of delivery.',
    'Payments more than 7 days late pause shoots and deliveries until cleared.',
    'Each reel includes 2 revision rounds. Feedback is due within 3 days of delivery.',
    'All amounts are in Pakistani Rupees (PKR).'
  ].join('\n'),
  customTerms:[
    '{advance}% advance is due on the invoice date. Work starts once it is received.',
    'The {balance}% balance is due within {due} days of delivery.',
    'Payments more than 7 days late pause work until cleared.',
    'All amounts are in {currency}.'
  ].join('\n'),
  footer:'Thank you for your business'
};

const CSS=`
.doc{--acc:#7A5A44;font-family:Manrope,Arial,sans-serif;color:#151311;font-size:11.5px;line-height:1.5}
.doc .dh{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:2px solid #151311;padding-bottom:14px;margin-bottom:18px}
.doc .dh img{height:48px;display:block}
.doc .brand{font-size:20px;font-weight:700;letter-spacing:.06em}
.doc .dt{font-size:26px;font-weight:700;letter-spacing:.08em;text-align:right;color:#151311;line-height:1.1}
.doc .dm{text-align:right;font-size:11px;color:#444;margin-top:6px}
.doc.h-band .dh{background:var(--acc);color:#fff;border:0;border-radius:10px;padding:18px 22px;align-items:center}
.doc.h-band .dh .dt,.doc.h-band .dh .dm{color:#fff}
.doc.h-band .dh .lg{background:#fff;border-radius:8px;padding:6px 10px}
.doc.h-band .dh img{height:40px}
.doc.h-minimal .dh{border-bottom:0;flex-direction:row-reverse;padding-bottom:6px}
.doc.h-minimal .dh .dt{text-align:left;font-size:34px;color:var(--acc)}
.doc.h-minimal .dh .dm{text-align:left}
.doc.h-minimal .dh img{height:40px}
.doc.h-minimal .dh::after{content:"";display:none}
.doc.h-minimal .bar{height:3px;background:var(--acc);border-radius:3px;margin:-6px 0 18px;width:64px}
.doc .cols2{display:flex;gap:24px;margin-bottom:16px}
.doc .cols2>div{flex:1}
.doc .lbl{font-size:9.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--acc);margin-bottom:4px}
.doc table{border-collapse:collapse}
.doc table.it,.doc table.sum{width:100%}
.doc table.it th{background:color-mix(in srgb,var(--acc) 14%,#fff);text-align:left;font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:8px;border:0}
.doc table.it td{padding:10px 8px;border:0;border-bottom:1px solid #E8E3DD;vertical-align:top}
.doc .n{text-align:right;white-space:nowrap}
.doc .mini{margin:4px 0 0;padding-left:16px;color:#555;font-size:10.5px}
.doc table.sum{width:56%;margin:10px 0 0 auto}
.doc table.sum td{padding:5px 8px;border:0}
.doc table.sum tr.tot td{border-top:2px solid #151311;font-weight:700;font-size:14px;padding-top:8px}
.doc table.sum tr.pay td{background:color-mix(in srgb,var(--acc) 12%,#fff);font-weight:700}
.doc .stamp{display:inline-block;border:2px solid #2F6B45;color:#2F6B45;font-weight:700;letter-spacing:.1em;padding:4px 12px;border-radius:6px;text-transform:uppercase;font-size:12px;margin-top:10px;transform:rotate(-3deg)}
.doc .stamp.adv{border-color:var(--acc);color:var(--acc)}
.doc .box{border:1px dashed var(--acc);border-radius:8px;padding:10px 12px;margin-top:14px;background:color-mix(in srgb,var(--acc) 5%,#fff)}
.doc h2{font-size:13px;letter-spacing:.06em;margin:18px 0 4px;color:#151311}
.doc h3{font-size:12px;letter-spacing:.04em;margin:13px 0 3px;color:#151311}
.doc .ah{font-size:16px;font-weight:700;margin:0 0 8px}
.doc p{margin:3px 0}
.doc ol.tm,.doc ul.dl{margin:4px 0 0;padding-left:18px}
.doc .sig{display:flex;gap:30px;margin-top:28px;page-break-inside:avoid}
.doc .sig>div{flex:1}
.doc .line{border-bottom:1px solid #151311;height:36px;margin-bottom:4px}
.doc .small{font-size:10px;color:#666}
.doc .ft{margin-top:20px;border-top:1px solid #ddd;padding-top:10px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:10px;color:#777}
.doc .ft img{height:62px}
.doc .ft .qr{display:flex;align-items:center;gap:8px;text-align:right}
.doc.f-elegant .dt,.doc.f-elegant h2,.doc.f-elegant h3,.doc.f-elegant .brand,.doc.f-elegant .ah{font-family:Cinzel,Georgia,serif}
.doc.f-modern .dt,.doc.f-modern h2,.doc.f-modern h3,.doc.f-modern .brand,.doc.f-modern .ah{font-family:Manrope,Arial,sans-serif;font-weight:800;letter-spacing:.02em}
.doc.f-classic,.doc.f-classic td,.doc.f-classic th{font-family:Georgia,"Times New Roman",serif}
`;
document.head.insertAdjacentHTML('beforeend','<style id="docCss">'+CSS+'</style>');

/* ---------- builders ---------- */
function mk(ctx){
  const B=ctx.biz,T={...DEF_TPL,...(ctx.tpl||{})},W=!!ctx.word;
  const usd=ctx.cur==='USD';
  const cur=n=>usd?'USD '+(+n||0).toLocaleString('en-US',{minimumFractionDigits:(+n||0)%1?2:0,maximumFractionDigits:2}):(T.currency||'Rs')+' '+Math.round(n).toLocaleString('en-US');
  const logo=T.logo||'/assets/logo.png';
  const wrapCls=`doc h-${T.header} f-${T.font}`;
  const wrapStyle=`--acc:${T.accent}`;
  const cols2=(a,c,cls)=>W?`<table width="100%" style="width:100%;border-collapse:collapse;margin:${cls==='sig'?'28px':'0'} 0 16px"><tr><td width="50%" valign="top" style="vertical-align:top;padding:0 12px 0 0;border:0">${a}</td><td width="50%" valign="top" style="vertical-align:top;padding:0;border:0">${c}</td></tr></table>`
                              :`<div class="${cls||'cols2'}"><div>${a}</div><div>${c}</div></div>`;
  function head(title,meta){
    const lg=T.showLogo?(W?`<span class="brand">${esc((B.name||'').toUpperCase())}</span>`:`<span class="lg"><img src="${esc(logo)}" alt=""></span>`):'<span></span>';
    if(W)return `<table width="100%" style="width:100%;border-collapse:collapse;${T.header==='band'?`background:${T.accent};color:#fff;`:'border-bottom:2px solid #151311;'}margin-bottom:16px"><tr><td valign="top" style="border:0;padding:10px">${lg}</td><td align="right" valign="top" style="border:0;padding:10px;text-align:right"><div class="dt" style="${T.header==='band'?'color:#fff':''}">${title}</div><div class="dm" style="${T.header==='band'?'color:#fff':''}">${meta}</div></td></tr></table>`;
    return `<div class="dh">${lg}<div><div class="dt">${title}</div><div class="dm">${meta}</div></div></div>${T.header==='minimal'?'<div class="bar"></div>':''}`;
  }
  const fromB=()=>`<div class="lbl">From</div><b>${esc(B.name)}</b><br>${esc(B.owner)}${B.ntn?'<br>NTN: '+esc(B.ntn):''}${B.phone?'<br>'+esc(B.phone):''}${B.email?'<br>'+esc(B.email):''}${B.addr?'<br>'+esc(B.addr):''}`;
  const toB=(c,l)=>`<div class="lbl">${l}</div><b>${esc(c.biz)}</b>${c.ntn?'<br>NTN: '+esc(c.ntn):''}${c.person?'<br>'+esc(c.person):''}${c.phone?'<br>'+esc(c.phone):''}${c.email?'<br>'+esc(c.email):''}${c.addr?'<br>'+esc(c.addr):''}`;
  function moneyRows(M){let r=`<tr><td>Subtotal</td><td class="n">${cur(M.gross)}</td></tr>`;
    if(M.discount)r+=`<tr><td>${M.discLabel?esc(M.discLabel):`3 months together (−${M.discPct}%)`}</td><td class="n">−${cur(M.discount)}</td></tr>`;
    if(M.tax)r+=`<tr><td>Sales tax (${M.taxPct}%)</td><td class="n">${cur(M.tax)}</td></tr>`;
    r+=`<tr class="tot"><td>Total</td><td class="n">${cur(M.total)}</td></tr>`;
    if(M.upPct>0&&M.upPct<100)r+=`<tr class="pay"><td>${M.upPct}% advance · due now</td><td class="n">${cur(M.upfront)}</td></tr><tr><td>${100-M.upPct}% balance · on delivery</td><td class="n">${cur(M.balance)}</td></tr>`;
    return r}
  function itemTable(p,M,period){return `<table class="it"><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr>
    <tr><td><b>${esc(p.name)}${p.monthly?' Plan':''}</b> · ${p.monthly?'monthly video production':'one-time video shoot'}<br><span class="small">${esc(period)}</span>
    <ul class="mini">${(p.items||[]).map(i=>'<li>'+esc(i)+'</li>').join('')}</ul></td>
    <td class="n">${p.monthly?M.months+(M.months>1?' months':' month'):'1'}</td><td class="n">${cur(p.price)}</td><td class="n">${cur(M.gross)}</td></tr></table>`}
  function customTable(d){const L=(d.lines||[]).filter(l=>l.desc||+l.rate);
    return `<table class="it"><tr><th>Description</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr>
    ${d.title?`<tr><td colspan="4"><b>${esc(d.title)}</b>${d.period?`<br><span class="small">${esc(d.period)}</span>`:''}</td></tr>`:''}
    ${L.map(l=>`<tr><td>${esc(l.desc||'Item')}</td><td class="n">${+l.qty||0}</td><td class="n">${cur(+l.rate||0)}</td><td class="n">${cur((+l.qty||0)*(+l.rate||0))}</td></tr>`).join('')}</table>`}
  const items=(d,M)=>d.kind==='custom'?customTable(d):itemTable(d.plan,M,d.period);
  function foot(left){
    const qr=T.showQR&&!W?`<span class="qr"><span>Scan to see<br>our work</span><img src="/assets/qr.png" alt=""></span>`:'';
    return `<div class="ft"><span>${left}</span>${qr}</div>`}
  return {B,T,W,cur,wrapCls,wrapStyle,cols2,head,fromB,toB,moneyRows,itemTable,items,foot};
}

function invoice(d,ctx){
  const k=mk(ctx),{B,T}=k,c=d.client,M=d.money;
  const curName=d.currency==='USD'?'US Dollars (USD)':'Pakistani Rupees (PKR)';
  const tok=s=>s.replace(/\{advance\}/g,M.upPct).replace(/\{balance\}/g,100-M.upPct).replace(/\{due\}/g,B.due).replace(/\{currency\}/g,curName);
  const src=d.kind==='custom'?(T.customTerms!=null?T.customTerms:DEF_TPL.customTerms):(T.terms||'');
  let terms=src.split('\n').map(s=>s.trim()).filter(Boolean);
  if(d.currency==='USD')terms=terms.map(t=>t.replace(/Pakistani Rupees \(PKR\)/g,'{currency}'));
  if(M.upPct>=100)terms=terms.filter(t=>!t.includes('{balance}'));
  if(M.upPct<=0)terms=terms.filter(t=>!t.includes('{advance}')&&!t.includes('{balance}'));
  if(d.plan.monthly&&d.term===3)terms.splice(Math.min(3,terms.length),0,'The 3-month discount applies only if the full 3-month term is completed.');
  return `<div class="${k.wrapCls}" style="${k.wrapStyle}">${k.head(esc(T.invoiceTitle||'INVOICE'),`No. <b>${esc(d.no)}</b><br>Date: ${fLong(d.date)}<br>Due: ${fLong(d.due)}`)}
  ${k.cols2(k.fromB(),k.toB(c,'Bill to'))}
  ${k.items(d,M)}
  <table class="sum">${k.moneyRows(M)}</table>
  ${T.showStamp?(d.status==='paid'?'<div class="stamp">Paid in full</div>':d.status==='advance'?'<div class="stamp adv">Advance received</div>':''):''}
  ${T.showPay&&B.pay?`<div class="box"><b>Payment details</b><br>${nl(B.pay)}</div>`:''}
  ${T.showTerms&&terms.length?`<h2>TERMS</h2><ol class="tm">${terms.map(t=>'<li>'+esc(tok(t))+'</li>').join('')}</ol>`:''}
  ${d.notes?`<div class="box"><b>Notes</b><br>${nl(d.notes)}</div>`:''}
  ${T.showSig?k.cols2(`<div class="line"></div>${esc(B.owner)}<br><span class="small">${esc(B.name)}</span>`,'','sig'):''}
  ${k.foot(`${esc(T.footer||'')}${T.footer?' · ':''}${esc(B.name)}${B.ntn?' · NTN '+esc(B.ntn):''}${B.phone?' · '+esc(B.phone):''}`)}</div>`;
}
function quote(d,ctx){
  const k=mk(ctx),{B,T}=k,c=d.client,M=d.money,v=addDays(d.date,7);
  return `<div class="${k.wrapCls}" style="${k.wrapStyle}">${k.head(esc(T.quoteTitle||'QUOTATION'),`${d.no?`No. <b>${esc(d.no)}</b><br>`:''}Date: ${fLong(d.date)}<br>Valid until: ${fLong(v)}`)}
  ${k.cols2(k.fromB(),c.biz?k.toB(c,'Prepared for'):'')}
  ${k.items(d,M)}
  <table class="sum">${k.moneyRows(M)}</table>
  ${d.kind==='custom'?(M.upPct>0&&M.upPct<100?`<div class="box">${M.upPct}% advance to start, the remaining ${100-M.upPct}% on delivery.</div>`:''):`
  ${ctx.bonus?`<div class="box"><b>Bonus:</b> ${esc(ctx.bonus)}</div>`:''}
  <div class="box"><b>The Speed Promise:</b> every reel delivered within 24 hours of the shoot. If a reel is late, that reel is free.</div>
  <h2>HOW IT WORKS</h2><ol class="tm"><li>Free trial reel, delivered the same day</li><li>Confirm the plan and pay the ${M.upPct}% advance</li><li>We lock in shoot dates the same week</li><li>We shoot on-site; reels arrive within 24 hours</li></ol>`}
  ${d.notes?`<div class="box"><b>Notes</b><br>${nl(d.notes)}</div>`:''}
  ${k.foot(`${esc(B.name)} · ${esc(B.owner)}${B.phone?' · '+esc(B.phone):''}${B.ntn?' · NTN '+esc(B.ntn):''}`)}</div>`;
}
function agreement(d,ctx){
  const k=mk(ctx),{B,T}=k,c=d.client,M=d.money,p=d.plan,mon=p.monthly,three=mon&&d.term===3,cur=k.cur;
  const end=three?monthsLater(d.start,3):'';
  let n=0;const S=t=>`<h3>${++n}. ${t}</h3>`;
  return `<div class="${k.wrapCls}" style="${k.wrapStyle}">${k.head(esc(T.agreementTitle||'AGREEMENT'),`No. <b>${esc(d.no)}</b><br>Date: ${fLong(d.date)}`)}
  <p class="ah">${esc(T.agreementHeading||'Video Production Services Agreement')}</p>
  <p>This agreement is made on <b>${fLong(d.date)}</b> between <b>${esc(B.name)}</b>${B.ntn?' (NTN '+esc(B.ntn)+')':''}${B.addr?', '+esc(B.addr):''}, represented by ${esc(B.owner)} (“<b>the Studio</b>”), and <b>${esc(c.biz)}</b>${c.ntn?' (NTN '+esc(c.ntn)+')':''}${c.addr?', '+esc(c.addr):''}${c.person?', represented by '+esc(c.person):''} (“<b>the Client</b>”).</p>
  ${S('The Services')}
  <p>The Studio will provide ${mon?'monthly video production':'a one-time video shoot'} under the <b>${esc(p.name)}${mon?' Plan':''}</b>:</p>
  <ul class="dl">${(p.items||[]).map(i=>'<li>'+esc(i)+'</li>').join('')}</ul>
  <p>Anything not listed above is outside this agreement and will be quoted separately, in writing, before work starts.</p>
  ${S('Term')}
  ${mon?`<p>This agreement starts on <b>${fLong(d.start)}</b>${three?` and runs for 3 months, until <b>${fLong(end)}</b>. After that it`:' and'} continues month to month until either party gives 7 days’ written notice. WhatsApp or email counts as written notice.</p>`
       :`<p>The shoot is planned for <b>${fLong(d.start)}</b>. This is a one-time project with no monthly commitment.</p>`}
  ${S('Fees and Payment')}
  <ul class="dl">
   ${mon?`<li>Monthly fee: <b>${cur(M.rate)}</b>${three?` (${cur(M.total)} in total for 3 months, including the ${M.discPct}% discount)`:''}${M.tax?', plus '+M.taxPct+'% sales tax':''}.</li>`
        :`<li>Project fee: <b>${cur(M.total)}</b>${M.tax?', including '+M.taxPct+'% sales tax':''}.</li>`}
   ${M.upPct<100?`<li>${M.upPct}% is paid in advance ${mon?'before the first shoot of each billing period':'to book the shoot date'}. The remaining ${100-M.upPct}% is paid within ${esc(B.due)} days of delivery.</li>`:`<li>The full amount is paid in advance.</li>`}
   <li>Shoots are scheduled only after the advance is received.</li>
   <li>If a payment is more than 7 days late, shoots and deliveries pause until it is cleared.</li>
   ${three?`<li>The 3-month discount applies only if the full term is completed. If the Client ends early, the discount on the months already used becomes payable.</li>`:''}
  </ul>
  ${S('Shoots and Client Responsibilities')}
  <ul class="dl">
   <li>Shoot dates are agreed at least 48 hours in advance.</li>
   <li>The Client provides access to the venue, dishes ready for filming, and one contact person on the day.</li>
   <li>If the Client cancels with less than 24 hours’ notice, the visit counts as completed. It can be moved once${mon?' within the same month':''} at no charge.</li>
   <li>Delays caused by the Client, such as late approvals or missing items, move delivery dates by the same amount.</li>
  </ul>
  ${S('Delivery and the Speed Promise')}
  <p>Edited reels are delivered within ${mon?'24':'48'} hours of each shoot, and photos within 48 hours. If the Studio misses this, that reel is free and credited on the next invoice. This does not apply to delays from Section ${n-1} or events outside the Studio’s control, such as power outages, illness or emergencies.</p>
  ${S('Revisions and Approval')}
  <p>Each reel includes 2 revision rounds. Feedback must be shared within 3 days of delivery; after that, the reel counts as approved. New ideas, reshoots or concept changes after approval are treated as new work.${(p.items||[]).some(i=>/post on your/i.test(i))?' The Studio posts only content the Client has approved.':''}</p>
  ${S('Ownership and Usage')}
  <ul class="dl">
   <li>Once paid in full, the Client may use all final reels and photos for its own marketing, on any platform, with no time limit.</li>
   <li>Raw footage stays with the Studio and is shared on request after full payment.</li>
   <li>The Studio may show the work in its portfolio and social media unless the Client objects in writing.</li>
   <li>Trending audio is used under each platform’s own rules. For paid ads, the Studio uses licensed or royalty-free music. The Client is responsible for any logos, music or material it provides.</li>
  </ul>
  ${S('Confidentiality')}
  <p>Both parties keep each other’s private business information, such as sales, pricing, plans and recipes, confidential.</p>
  ${S('Results and Liability')}
  <p>The Studio creates content to help the Client grow, but does not guarantee specific views, followers or sales. The Studio’s total liability is limited to the fees paid for the month in question.</p>
  ${S('Ending the Agreement')}
  <p>${mon?'Either party may end this agreement with 7 days’ written notice. ':''}Work already shot or delivered is payable, and advances for completed shoots are non-refundable. The Studio may end the agreement immediately if a payment is more than 15 days late or its team is treated abusively.</p>
  ${S('Disputes')}
  <p>Both parties will first try to resolve any issue by discussion within 15 days. This agreement is governed by the laws of Pakistan, and the courts of Karachi have jurisdiction.</p>
  ${d.notes?`<h3>Additional notes</h3><p>${nl(d.notes)}</p>`:''}
  ${k.cols2(`<div class="lbl">For the Studio</div><div class="line"></div><b>${esc(B.owner)}</b><br>${esc(B.name)}${B.ntn?'<br>NTN: '+esc(B.ntn):''}<br>Date: ____________`,
            `<div class="lbl">For the Client</div><div class="line"></div><b>${esc(c.person||'Name: ____________')}</b><br>${esc(c.biz)}<br>Designation: ____________<br>Date: ____________ &nbsp; Stamp:`,'sig')}</div>`;
}

const BUILD={invoice,quote,agreement};
window.DOCS={
  DEF_TPL, CSS,
  html:(d,ctx)=>BUILD[d.type](d,d.currency==='USD'?{...ctx,cur:'USD'}:ctx),
  pageCss:t=>`@page{size:${(t&&t.paper)==='Letter'?'letter':'A4'};margin:12mm}`,
  wordHtml(d,ctx){
    const T={...DEF_TPL,...(ctx.tpl||{})};
    const css=CSS.replace(/var\(--acc\)/g,T.accent).replace(/color-mix\([^)]*\)/g,'#F4EEE8');
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(d.no||d.type)}</title><style>@page{size:${T.paper==='Letter'?'8.5in 11in':'21cm 29.7cm'};margin:2cm}body{margin:0}${css}</style></head><body>${BUILD[d.type](d,{...ctx,word:true,cur:d.currency==='USD'?'USD':''})}</body></html>`;
  },
  util:{esc,fLong,addDays,monthsLater,ymd}
};
})();
