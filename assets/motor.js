/* EBC English — společný motor lekcí. Obsah lekce je v bloku LESSON v každém souboru lekce-XX.html. */
(function(){
const L = LESSON, $ = id => document.getElementById(id);
const MODS = ["","Who we are","Project and documentation","Building and structures","Building services","Tools and processes","Communication with the client"];
const TOTAL = 24, pad = n => String(n).padStart(2,"0");
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const norm = s => s.toLowerCase().replace(/[’`]/g,"'").replace(/[.!?]$/,"").replace(/\s+/g," ").trim();
const plain = s => s.replace(/\{([^}|]*)[^}]*\}/g,"$1");
const gapHtml = s => esc(s).replace(/\{([^}]*)\}/g,(m,a)=>'<input class="gap" data-a="'+a.replace(/"/g,"&quot;")+'">');
const answers = arr => arr.map(s=>(s.match(/\{([^}]*)\}/g)||[]).map(x=>x.slice(1,-1).split("|")[0])).reduce((a,b)=>a.concat(b),[]);
const keyOf = arr => arr.map((s,i)=>(i+1)+". "+(s.match(/\{([^}]*)\}/g)||[]).map(x=>x.slice(1,-1).split("|")[0]).join(" … ")).join(" · ");
const TAG = {core:"V hodině",home:"Doma",extra:"Navíc"};
const tag = k => '<span class="tag '+k+'">'+TAG[k]+'</span>';
const time = t => t ? '<span class="time">'+t+'</span>' : '';
const li = a => a.map(x=>"<li>"+x+"</li>").join("");
const bankHtml = (id,words) => '<div class="bank" id="'+id+'"><b>Word box</b>'+words.slice().sort((a,b)=>a.localeCompare(b)).map(w=>'<span>'+esc(w)+'</span>').join("")+'</div>';
const ctl = (id,show) => '<div class="ctl noprint"><button class="pri" data-check="'+id+'">Check</button>'+(show?'<button data-show="'+id+'">Show answers</button>':'')+'<button data-reset="1">Reset</button><span class="res" id="'+id+'-res"></span></div>';
const teacher = (h,body) => '<div class="teacher"><h4>Teacher · '+h+'</h4>'+body+'</div>';


/* ---------- komiks: jednoduché kreslené postavičky s bublinami ---------- */
const INK = "#16242e";
const PROPS = {
 building:'<rect x="-40" y="-70" width="80" height="110" fill="#e8f3ee"/><g fill="#fff"><rect x="-28" y="-58" width="16" height="16"/><rect x="12" y="-58" width="16" height="16"/><rect x="-28" y="-30" width="16" height="16"/><rect x="12" y="-30" width="16" height="16"/></g><rect x="-10" y="10" width="20" height="30" fill="#b4541a"/>',
 clock:'<circle r="42" cy="-15" fill="#fff"/><path d="M0-15V-42M0-15L22-3" fill="none"/><circle r="4" cy="-15" fill="'+INK+'"/>',
 drawing:'<path d="M-50 30L-40-55L45-62L55 22Z" fill="#fff"/><path d="M-30-38L30-43M-28-22L10-25M-26-6L34-11M-24 10L0 8" fill="none" stroke-width="2"/><rect x="14" y="-2" width="26" height="16" fill="#e8f3ee" stroke-width="2"/>',
 stadium:'<ellipse rx="70" ry="34" cy="5" fill="#e8f3ee"/><ellipse rx="44" ry="17" cy="5" fill="#8fd19e"/><path d="M-70 5V-12C-70-45 70-45 70-12V5" fill="none"/><path d="M-52-30v-28M52-30v-28M-60-58h16M44-58h16" fill="none"/>',
 ruler:'<g transform="rotate(-12)"><rect x="-70" y="-14" width="140" height="28" fill="#ffe08a"/><path d="M-55-14v10M-40-14v16M-25-14v10M-10-14v16M5-14v10M20-14v16M35-14v10M50-14v16" fill="none" stroke-width="2"/></g>',
 beam:'<rect x="-66" y="-50" width="132" height="18" fill="#cfd8dc"/><rect x="-58" y="-32" width="16" height="72" fill="#cfd8dc"/><rect x="42" y="-32" width="16" height="72" fill="#cfd8dc"/><circle r="9" cy="-41" fill="#fff" stroke-dasharray="4 3"/>',
 brick:'<g fill="#e9a27c"><rect x="-56" y="-30" width="36" height="20"/><rect x="-18" y="-30" width="36" height="20"/><rect x="20" y="-30" width="36" height="20"/><rect x="-37" y="-8" width="36" height="20"/><rect x="1" y="-8" width="36" height="20"/><rect x="-56" y="14" width="36" height="20"/><rect x="-18" y="14" width="36" height="20"/><rect x="20" y="14" width="36" height="20"/></g>',
 fire:'<path d="M0-65C28-30 44-12 28 20C20 38-20 38-28 20C-42-6-12-18-14-40C-4-36 0-48 0-65Z" fill="#ffb347"/><path d="M0-12C12 2 14 14 6 24C-2 30-12 22-10 10C-8 2-2-4 0-12Z" fill="#ffe08a" stroke-width="2"/>',
 radiator:'<g fill="#fff"><rect x="-52" y="-45" width="16" height="74" rx="6"/><rect x="-30" y="-45" width="16" height="74" rx="6"/><rect x="-8" y="-45" width="16" height="74" rx="6"/><rect x="14" y="-45" width="16" height="74" rx="6"/><rect x="36" y="-45" width="16" height="74" rx="6"/></g><path d="M-40-58c6-8-6-12 0-20M0-58c6-8-6-12 0-20M40-58c6-8-6-12 0-20" fill="none" stroke="#b4541a" stroke-width="2"/>',
 duct:'<path d="M-70-48h100v30h40v60h-30v-30h-110z" fill="#cfd8dc"/><path d="M-55-33h60M-5-40l10 7l-10 7M55 0v28M48 20l7 10l7-10" fill="none" stroke="#1f5fa8" stroke-width="2.5"/>',
 pipe:'<path d="M-70-40h70a20 20 0 0 1 20 20v40" fill="none" stroke-width="16" stroke="#9fb3bd"/><path d="M-70-40h70a20 20 0 0 1 20 20v40" fill="none" stroke-width="2" stroke-dasharray="0"/><path d="M20 30c-8 12-8 20 0 22c8-2 8-10 0-22z" fill="#6fb7e9" stroke-width="2"/>',
 bulb:'<path d="M0-62a30 30 0 0 1 18 54v14h-36v-14a30 30 0 0 1 18-54z" fill="#ffe08a"/><path d="M-14 14h28M-10 24h20" fill="none"/><path d="M-52-34l-14-8M52-34l14-8M0-74v-14" fill="none" stroke-width="2"/>',
 laptop:'<rect x="-48" y="-52" width="96" height="62" rx="5" fill="#fff"/><path d="M-66 30h132l-12-20h-108z" fill="#cfd8dc"/><path d="M-30-30l14 12l14-22l14 16l16-10" fill="none" stroke="#0b6e4f"/>',
 phone:'<rect x="-24" y="-62" width="48" height="98" rx="8" fill="#fff"/><path d="M-8 24h16" fill="none"/><path d="M40-40c10 10 10 26 0 36M52-50c16 16 16 40 0 56" fill="none" stroke-width="2"/>',
 money:'<g fill="#ffe08a"><ellipse rx="34" ry="11" cy="30"/><ellipse rx="34" ry="11" cy="14"/><ellipse rx="34" ry="11" cy="-2"/><ellipse rx="34" ry="11" cy="-18"/></g><text y="-12" text-anchor="middle" font-size="18" stroke="none" fill="'+INK+'">€</text>',
 mail:'<rect x="-52" y="-40" width="104" height="70" rx="4" fill="#fff"/><path d="M-52-40L0 4L52-40" fill="none"/>'
};
function wrap(t,n){ const out=[]; let l=""; t.split(" ").forEach(w=>{ if((l+" "+w).trim().length>n){ out.push(l); l=w; } else l=(l+" "+w).trim(); }); if(l) out.push(l); return out; }
function person(x,k,flip){
  const y=148; let s='<g transform="translate('+x+','+y+')" fill="#fff">';
  s+='<path d="M0 20v44M0 64l-15 34M0 64l15 34M0 32l'+(flip?"26-16":"-26-16")+'M0 32l'+(flip?"-22 18":"22 18")+'" fill="none"/>';
  if(k==="B"){ s+='<rect x="-19" y="-18" width="38" height="36" rx="6" fill="#cfd8dc"/><path d="M0-18v-12" fill="none"/><circle cy="-33" r="4" fill="#b3261e"/><rect x="-11" y="-8" width="7" height="7" fill="'+INK+'"/><rect x="4" y="-8" width="7" height="7" fill="'+INK+'"/><path d="M-9 9h18" fill="none"/>'; }
  else {
    s+='<circle r="19"/><circle cx="-7" cy="-3" r="2" fill="'+INK+'"/><circle cx="7" cy="-3" r="2" fill="'+INK+'"/><path d="M-7 7q7 6 14 0" fill="none" stroke-width="2"/>';
    if(k==="E") s+='<path d="M-20-6a20 20 0 0 1 40 0z" fill="#ffd23f"/><path d="M-25-6h50" fill="none"/>';
    if(k==="C") s+='<path d="M-18-8c2-18 34-18 36 0c-10-8-26-8-36 0z" fill="'+INK+'"/><path d="M0 20l-5 8l5 16l5-16z" fill="#b3261e" stroke-width="1.5"/>';
    if(k==="A") s+='<circle cx="-7" cy="-3" r="7" fill="none" stroke-width="2"/><circle cx="7" cy="-3" r="7" fill="none" stroke-width="2"/><path d="M-16-12c4-14 28-14 32 0" fill="none"/><path d="M-9 21h18l-4 8h-10z" fill="#1f5fa8" stroke-width="1.5"/>';
  }
  return s+'</g>';
}
function bubble(x,t,tailX){
  const ls=wrap(t,25), h=ls.length*20+18, w=262;
  return '<g><rect x="'+x+'" y="10" width="'+w+'" height="'+h+'" rx="14" fill="#fff"/><path d="M'+(tailX-12)+' '+(10+h-1)+'L'+tailX+' '+(10+h+16)+'L'+(tailX+14)+' '+(10+h-1)+'" fill="#fff"/><path d="M'+(tailX-10)+' '+(10+h)+'h22" stroke="#fff" stroke-width="4"/>'+
    '<text x="'+(x+w/2)+'" y="'+(10+27)+'" text-anchor="middle" font-size="16" stroke="none" fill="'+INK+'">'+ls.map((l,i)=>'<tspan x="'+(x+w/2)+'" dy="'+(i?20:0)+'">'+esc(l)+'</tspan>').join("")+'</text></g>';
}
function comic(c){
  return '<svg class="comic" viewBox="0 0 720 256" role="img" aria-label="Comic" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" font-family="Comic Sans MS, Chalkboard SE, Comic Neue, Segoe Print, cursive">'+
   '<rect x="3" y="3" width="714" height="250" rx="12" fill="#fffdf4"/><path d="M20 247h680" fill="none" stroke-width="2"/>'+
   bubble(18,c.a[1],118)+bubble(440,c.b[1],600)+person(130,c.a[0],false)+person(590,c.b[0],true)+
   '<g transform="translate(360,196)">'+(PROPS[c.prop]||"")+'</g></svg>';
}

document.title = "EBC English · Lesson "+pad(L.n)+" · "+L.title;
const prev = L.n>1 ? '<a href="lekce-'+pad(L.n-1)+'.html">← '+pad(L.n-1)+'</a>' : '';
const next = L.n<TOTAL ? '<a href="lekce-'+pad(L.n+1)+'.html">'+pad(L.n+1)+' →</a>' : '';

const PARTS = [
 ["p1","1","My week at work","core","0–10"],
 ["p2","2","Vocabulary","core","10–18"],
 ["p2b","2.2","Vocabulary practice","home",""],
 ["p3","3","Grammar: "+L.grammar,"core","18–30"],
 ["p4","4","Reading: "+L.reading.title,"core","30–42"],
 ["p5","5","Listening"+(L.videos&&L.videos.length?" and video":""),"extra",""],
 ["p6","6","Speaking: "+L.speak.title,"core","42–55"],
 ["p7","7","Quick quiz","home",""],
 ["p8","8","Homework","home","55–60"]
];

const matchOpts = Array.from(new Set(L.match.map(m=>m[1]).concat(L.distract||[]))).sort((a,b)=>a.localeCompare(b));
const dlgWho = Array.from(new Set(L.dialogue.map(d=>d[0])));

let H = '';
H += '<header class="top"><div class="wrap"><div class="kicker">EBC English · Module '+L.module+' · '+MODS[L.module]+'</div><h1>Lesson '+pad(L.n)+' — '+esc(L.title)+'</h1><p>60 min · level B1 · '+esc(L.cz)+'</p></div></header>';
H += '<div class="bar"><div class="wrap">'+prev+'<a href="00_START.html">Obsah kurzu</a>'+next+'<a href="slovnicek.html">Slovníček</a><span class="sp"></span>'+
     '<button id="resetall">Reset all</button><button id="tbtn">Teacher view</button>'+
     '<button class="pri" data-print="s">Print: student</button><button data-print="h">Print: homework</button><button data-print="t">Print: teacher</button></div></div>';
H += '<main><div class="namebar"><span>Name:</span><span>Date:</span></div>';

/* obsah lekce + návod */
H += '<section class="noprint"><details open><summary>Obsah lekce · Lesson contents</summary>'+
 '<table class="toc" style="margin-top:8px">'+PARTS.map(p=>'<tr><td>'+p[1]+'</td><td><a href="#'+p[0]+'">'+esc(p[2])+'</a></td><td>'+tag(p[3])+'</td><td class="cz">'+(p[4]?p[4]+" min":"")+'</td></tr>').join("")+'</table></details>'+
 '<details style="margin-top:10px"><summary>Jak s lekcí pracovat</summary><ul>'+
 '<li>'+tag("core")+' děláme společně v hodině. '+tag("home")+' si každý udělá sám před další hodinou. '+tag("extra")+' je rezerva, když zbude čas.</li>'+
 '<li><b>Na papíře:</b> <i>Print: student</i> vytiskne celý pracovní list na A4, <i>Print: homework</i> jen domácí část. Slova z rámečku (Word box) si škrtejte.</li>'+
 '<li><b>Na počítači:</b> pište do mezer, vybírejte z nabídek, klikněte na <i>Check</i>. Slovo v rámečku se kliknutím přeškrtne.</li>'+
 '<li><b>Zvuk:</b> ▶ přečte slovo, text nebo dialog. Dole se objeví přehrávač: pauza, krok zpět a vpřed po větách, posuvník, rychlost a výběr hlasu (britský, americký, mezinárodní). Malé časy v textu (např. 0:24) ukazují, kde zhruba jste; kliknutím na čas přehrávání skočí na to místo. Nejpřirozenější hlasy má Microsoft Edge s připojením k internetu.</li>'+
 '<li><b>Vyplněné odpovědi</b> zůstanou v tomto prohlížeči i po zavření stránky, dokud je nesmažete.</li>'+
 '<li><b>Reset:</b> tlačítko <i>Reset</i> u cvičení smaže jeho vyplnění, <i>Reset all</i> nahoře smaže celou lekci.</li>'+
 '<li><b>Lektor:</b> <i>Teacher view</i> ukáže minutáž, poznámky a řešení, <i>Print: teacher</i> je vytiskne.</li>'+
 '<li>Bez internetu funguje všechno kromě videí.</li></ul></details></section>';

/* cíle */
H += '<section id="p0"><h2>Lesson goals</h2><p class="cz">Po této lekci umím:</p><ul>'+li(L.goals.map(esc))+'</ul>'+
 (L.comic?comic(L.comic)+'<p class="cz" style="margin-top:4px">Komiks na rozehřátí: What is funny here? Does it happen in our office?</p>':'')+
 teacher("plán hodiny (skupina do 6 lidí)",
 '<table><tr><th>Min</th><th>Část</th><th>Co se děje</th></tr>'+
 '<tr><td>0–10</td><td>1 My week at work</td><td>Kolečko, každý nejvýše 1,5 minuty. Neopravovat průběžně, chyby si zapsat a vrátit se k nim v části 3.</td></tr>'+
 '<tr><td>10–18</td><td>2 Vocabulary + 2.1</td><td>Výslovnost slovíček (▶ nebo lektor), cvičení 2.1 ve dvojicích.</td></tr>'+
 '<tr><td>18–30</td><td>3 Grammar</td><td>Krátký výklad na větách z kolečka, cvičení 3.1.</td></tr>'+
 '<tr><td>30–42</td><td>4 Reading</td><td>Tiché čtení 3 minuty, 4.1 True/False, schéma 4.2 jako podklad k otázkám.</td></tr>'+
 '<tr><td>42–55</td><td>6 Speaking</td><td>Tři dvojice mluví současně, na závěr jedna ukázka před skupinou.</td></tr>'+
 '<tr><td>55–60</td><td>8 Homework</td><td>Zadat domácí část: 2.2, kvíz 7, písemný úkol.</td></tr></table>'+
 '<p class="cz">Část 5 (poslech, video) je rezerva. Když se lekce nestihne, rozložte ji na dvě hodiny: první končí částí 3, druhá začíná krátkým kolečkem a pokračuje částí 4.</p>'+
 (L.tnote?'<p><b>K této lekci:</b> '+L.tnote+'</p>':''))+'</section>';

/* 1 */
H += '<section id="p1"><h2>'+time("0–10 min")+'<span class="num">1</span> My week at work'+tag("core")+'</h2><p class="cz">Úvodní kolečko o práci. Každý 2–3 věty, nejvýše minutu a půl.</p><div class="grid2">'+
 '<div class="box"><h4>Questions</h4><ol>'+li(L.week.map(esc))+'</ol></div>'+
 '<div class="box"><h4>Useful sentences <button class="say noprint" data-sayel="frames">▶</button></h4><ul id="frames">'+li(L.frames.map(esc))+'</ul></div></div></section>';

/* 2 */
H += '<section id="p2" data-home="1"><h2>'+time("10–18 min")+'<span class="num">2</span> Vocabulary'+tag("core")+'</h2><p class="cz">V hodině výslovnost, doma poslech a opakování. Klikněte na ▶ a opakujte nahlas.</p>'+
 '<table><tr><th class="noprint"></th><th>English</th><th>Česky</th><th>Example</th></tr>'+
 L.vocab.map((v,i)=>'<tr><td class="noprint"><button class="say" data-v="'+i+'">▶</button></td><td><b>'+esc(v[0])+'</b></td><td>'+esc(v[1])+'</td><td class="ex">'+esc(v[2])+'</td></tr>').join("")+'</table>'+
 (L.basics&&L.basics.length?'<div class="box basics" style="margin-top:12px"><h4>Basic words · Úplné základy <button class="say noprint" id="saybasics">▶</button></h4><p>'+L.basics.map(b=>'<span><b>'+esc(b[0])+'</b> '+esc(b[1])+'</span>').join("")+'</p></div>':'')+
 (L.notes&&L.notes.length?'<div class="box" style="margin-top:12px"><h4>Watch out · Pozor</h4><ul>'+li(L.notes)+'</ul></div>':'')+'</section>';

H += '<section id="p2a"><h3 style="margin-top:0"><span class="num">2.1</span> Match'+tag("core")+'</h3><p class="cz">Přiřaďte výraz z rámečku k popisu.</p>'+bankHtml("match-bank",matchOpts)+
 '<ol class="ex" id="match">'+L.match.map(m=>'<li>'+esc(m[0])+' → <select data-a="'+esc(m[1])+'"><option value="">…………………………</option>'+matchOpts.map(r=>'<option>'+esc(r)+'</option>').join("")+'</select><span class="blank">&nbsp;</span></li>').join("")+'</ol>'+ctl("match")+
 teacher("key 2.1",L.match.map((m,i)=>(i+1)+". "+esc(m[1])).join(" · "))+'</section>';

H += '<section id="p2b" data-home="1"><h3 style="margin-top:0"><span class="num">2.2</span> Complete with the words from the box'+tag("home")+'</h3><p class="cz">Doplňte slova z rámečku. Použité slovo si škrtněte.</p>'+bankHtml("voc-bank",answers(L.voc))+
 '<ol class="ex" id="voc">'+L.voc.map(s=>"<li>"+gapHtml(s)+"</li>").join("")+'</ol>'+ctl("voc",1)+teacher("key 2.2",esc(keyOf(L.voc)))+'</section>';

/* 3 */
H += '<section id="p3"><h2>'+time("18–30 min")+'<span class="num">3</span> Grammar: '+esc(L.grammar)+tag("core")+'</h2><div class="grid2">'+
 L.gbox.map(b=>'<div class="box"><h4>'+esc(b[0])+'</h4><p class="cz">'+esc(b[1])+'</p><p>'+b[2].join("<br>")+'</p>'+(b[3]?'<p class="cz">'+esc(b[3])+'</p>':'')+'</div>').join("")+'</div>'+
 '<h3><span class="num">3.1</span> Complete the sentences</h3><p class="cz">'+esc(L.gtask||"Doplňte správný tvar slova v závorce.")+'</p>'+
 '<ol class="ex" id="gram">'+L.gram.map(s=>"<li>"+gapHtml(s)+"</li>").join("")+'</ol>'+ctl("gram",1)+teacher("key 3.1",esc(keyOf(L.gram)))+'</section>';

/* 4 */
H += '<section id="p4"><h2>'+time("30–42 min")+'<span class="num">4</span> Reading: '+esc(L.reading.title)+tag("core")+'</h2><p class="cz">'+esc(L.reading.cz)+' <button class="say noprint" data-track="reading">▶ Listen</button></p>'+
 '<div class="text" id="reading">'+L.reading.paras.map(p=>"<p>"+p+"</p>").join("")+'</div><p class="cz">Jména, osoby a údaje v textech jsou smyšlené.</p>'+
 '<h3><span class="num">4.1</span> True or false?</h3><ol class="ex tf" id="tf">'+L.tf.map(t=>'<li data-a="'+t[1]+'">'+esc(t[0])+' <span class="noprint"><button data-v="true">True</button> <button data-v="false">False</button></span><span class="ponly"> &nbsp; T &nbsp;/&nbsp; F</span> <span class="m"></span></li>').join("")+'</ol><div class="ctl noprint"><button data-reset="1">Reset</button><span class="res" id="tf-res"></span></div>'+
 (L.svg||L.flow?'<h3><span class="num">4.2</span> '+esc((L.flow&&L.flow.title)||L.svgTitle||"Diagram")+'</h3><p class="cz">'+esc((L.flow&&L.flow.cz)||L.svgCz||"")+'</p>':'')+
 (L.svg||'')+
 (L.flow?'<div class="flow">'+L.flow.steps.map((s,i)=>'<div class="step"><b>'+(i+1)+'</b>'+esc(s[0])+'<small>'+esc(s[1])+'</small></div>').join("")+'</div>':'')+
 teacher("key 4.1",L.tf.map((t,i)=>(i+1)+". "+(t[1]?"True":"False")).join(" · ")+(L.flow&&L.flow.q?'<p class="cz">Otázky ke schématu: <i>'+esc(L.flow.q)+'</i></p>':''))+'</section>';

/* 5 */
H += '<section id="p5"><h2><span class="num">5</span> Listening'+tag("extra")+'</h2><p class="cz">Poslechněte si rozhovor a doplňte slova z rámečku. Hlas je počítačový; dialog může přečíst i lektor se studenty.</p>'+
 '<div class="ctl noprint"><button class="pri" data-track="dlg">▶ Play dialogue</button></div>'+bankHtml("dlg-bank",answers(L.dialogue.map(d=>d[1])))+
 '<div class="dlg" id="dlg">'+L.dialogue.map(d=>"<p><b>"+esc(d[0])+":</b> "+gapHtml(d[1])+"</p>").join("")+'</div>'+ctl("dlg",1)+
 (L.videos&&L.videos.length?'<h3><span class="num">5.2</span> Video</h3><p class="cz">Potřebuje internet. Odkazy před hodinou vyzkoušejte a vyberte jedno krátké video (do 5 minut).</p><ul>'+L.videos.map(v=>'<li><a href="'+v[1]+'" target="_blank" rel="noopener">'+esc(v[0])+'</a> <span class="cz vurl">'+esc(v[1])+'</span></li>').join("")+'</ul><p>While you watch: <b>1</b> Which words from part 2 do you hear? <b>2</b> What is new for you? <b>3</b> What is different in our practice?</p>':'')+
 teacher("key 5",esc(answers(L.dialogue.map(d=>d[1])).join(" · ")))+'</section>';

/* 6 */
H += '<section id="p6"><h2>'+time("42–55 min")+'<span class="num">6</span> Speaking: '+esc(L.speak.title)+tag("core")+'</h2><p class="cz">'+esc(L.speak.cz)+'</p><div class="grid2">'+
 '<div class="box"><h4>Useful phrases</h4><ul>'+li(L.speak.phrases.map(esc))+'</ul></div>'+
 '<div class="box"><h4>Questions to ask</h4><ul>'+li(L.speak.questions.map(esc))+'</ul></div></div>'+
 '<h3>Role cards</h3><div class="cards">'+L.speak.cards.map(c=>'<div class="card"><b>'+esc(c[0])+'</b>'+esc(c[1])+'</div>').join("")+'</div>'+
 teacher("mluvení","Tři dvojice současně, 8 minut, pak si dvojice vymění role. Na závěr jedna ukázka před skupinou. Hodnoťte srozumitelnost a použití gramatiky z části 3, ne každou chybu.")+'</section>';

/* 7 */
H += '<section id="p7" data-home="1"><h2><span class="num">7</span> Quick quiz'+tag("home")+'</h2><ol class="ex" id="quiz">'+
 L.quiz.map((q,i)=>'<li>'+esc(q[0])+'<div class="opts">'+q[1].map((o,j)=>'<label><input type="radio" name="q'+i+'" value="'+j+'"> '+esc(o)+'</label>').join("")+'</div></li>').join("")+'</ol>'+ctl("quiz")+
 teacher("key 7",L.quiz.map((q,i)=>(i+1)+". "+esc(q[1][q[2]])).join(" · "))+'</section>';

/* 8 */
H += '<section id="p8" data-home="1"><h2>'+time("55–60 min")+'<span class="num">8</span> Homework'+tag("home")+'</h2><ol>'+
 '<li><b>Write:</b> '+esc(L.hw)+'<div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div></li>'+
 '<li style="margin-top:12px"><b>Vocabulary:</b> listen and repeat the words from part 2, then do exercise 2.2.</li>'+
 '<li><b>Quiz:</b> do the quick quiz (part 7).</li>'+
 '<li><b>Next “My week at work”:</b> prepare two sentences about your work this week.</li></ol>'+
 (L.next?'<p class="cz">Next lesson: <b>Lesson '+pad(L.n+1)+' — '+esc(L.next)+'</b></p>':'')+
 teacher("úpravy lekce",'Obsah je v bloku <code>LESSON</code> v tomto souboru. Otevřete soubor v Poznámkovém bloku, přepište text mezi uvozovkami a uložte. Správná odpověď je ve složených závorkách, varianty odděluje svislá čára: <code>{am working|\'m working}</code>.')+'</section></main>';

H += '<div id="player" class="noprint" hidden><b id="pl-title"></b><button id="pl-prev" title="Předchozí věta">⏮</button><button id="pl-play" class="pri">⏸</button><button id="pl-next" title="Další věta">⏭</button><button id="pl-stop">■</button>'+
 '<input type="range" id="pl-bar" min="0" max="0" value="0"><span id="pl-time" class="cz"></span>'+
 '<select id="accent"><option value="uk">British</option><option value="us">American</option><option value="int">International</option></select>'+
 '<label class="cz">Speed <input type="range" id="rate" min="0.6" max="1.2" step="0.1" value="0.9" style="vertical-align:middle;width:70px"></label><span id="pl-voice" class="cz"></span></div>';
$("app").innerHTML = H;

/* ---------- řeč a přehrávač ---------- */
const synth = window.speechSynthesis;
const pools = {uk:[],us:[],int:[]};
const rank = v => /natural/i.test(v.name)?0:/online/i.test(v.name)?1:/google/i.test(v.name)?2:3;
function loadV(){
  const en = synth.getVoices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>rank(a)-rank(b));
  pools.uk = en.filter(v=>/GB/i.test(v.lang));
  pools.us = en.filter(v=>/US/i.test(v.lang));
  pools.int = en.filter(v=>!/GB|US/i.test(v.lang));
  voiceInfo();
}
function pool(){ const p = pools[$("accent").value]; return p.length ? p : pools.uk.concat(pools.us, pools.int); }
function voiceInfo(){
  const p = pools[$("accent").value], el = $("pl-voice"); if(!el) return;
  if(!p.length) el.textContent = "Tento akcent v prohlížeči není, použije se jiný anglický hlas.";
  else el.textContent = p[0].name.replace(/Microsoft |Online |\(Natural\) /g,"") + (rank(p[0])>0 ? " · přirozenější hlasy: Edge + internet" : "");
}
if(synth){ loadV(); synth.onvoiceschanged = loadV; }
function utter(text,vi){
  const u = new SpeechSynthesisUtterance(text), p = pool(); u.lang = "en-GB"; u.rate = parseFloat($("rate").value);
  if(p.length){ u.voice = p[(vi||0)%Math.min(p.length,3)]; u.lang = u.voice.lang; if(p.length<2 && vi) u.pitch = 0.75+0.25*(vi%3); }
  return u;
}
const fmt = s => { s = Math.round(s); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
const strip = s => s.replace(/<[^>]+>/g,"");
const P = {q:[],i:0,on:false,gen:0,title:""};
/* stopa = věty s odhadem času; do textu se vloží malé časové značky */
function buildTrack(name,items){
  const q = []; let t = 0;
  items.forEach(it=>{
    if(it.el && name){ const m = document.createElement("small"); m.className = "ts"; m.textContent = fmt(t); m.dataset.track = name; m.dataset.i = q.length; m.title = "Přehrát od tohoto místa"; it.el.insertBefore(m,it.el.firstChild); }
    it.text.replace(/([.!?])\s+/g,"$1\u0001").split("\u0001").filter(x=>x.trim()).forEach(s=>{ q.push({text:s,vi:it.vi||0,el:it.el,t:t}); t += s.split(/\s+/).length/2.4+0.4; });
  });
  q.total = t; return q;
}
const TR = {};
(function(){
  const rp = $("reading") ? $("reading").querySelectorAll("p") : [];
  TR.reading = buildTrack("reading", L.reading.paras.map((p,i)=>({text:strip(p),el:rp[i]})));
  const dp = $("dlg") ? $("dlg").querySelectorAll("p") : [];
  TR.dlg = buildTrack("dlg", L.dialogue.map((d,i)=>({text:plain(d[1]),vi:dlgWho.indexOf(d[0]),el:dp[i]})));
})();
const TITLES = {reading:"4 Reading",dlg:"5 Listening"};
function ui(){
  const pl = $("player"); if(!pl) return;
  pl.hidden = !P.q.length; if(!P.q.length) return;
  $("pl-title").textContent = P.title; $("pl-play").textContent = P.on ? "⏸" : "▶";
  $("pl-bar").max = P.q.length-1; $("pl-bar").value = P.i;
  $("pl-time").textContent = "≈ "+fmt(P.q[P.i].t)+" / "+fmt(P.q.total);
  document.querySelectorAll(".playing").forEach(e=>e.classList.remove("playing"));
  if(P.on && P.q[P.i].el) P.q[P.i].el.classList.add("playing");
}
function play(i){
  if(!synth){ alert("Tento prohlížeč neumí číst nahlas. Zkuste Edge nebo Chrome."); return; }
  P.i = Math.max(0,Math.min(i,P.q.length-1)); P.on = true; const gen = ++P.gen; synth.cancel();
  const seg = P.q[P.i], u = utter(seg.text,seg.vi);
  u.onend = () => { if(gen!==P.gen) return; if(P.i<P.q.length-1) play(P.i+1); else { P.on = false; ui(); } };
  setTimeout(()=>{ if(gen===P.gen) synth.speak(u); },70);
  ui();
}
function pause(){ P.on = false; P.gen++; if(synth) synth.cancel(); ui(); }
function load(q,title,i){ P.q = q; P.title = title; play(i||0); }

/* ---------- kontroly ---------- */
function checkGaps(id){ let ok=0; const g=$(id).querySelectorAll("input.gap"); g.forEach(i=>{ const good=i.dataset.a.split("|").map(norm).includes(norm(i.value)); i.classList.toggle("ok",good); i.classList.toggle("bad",!good); if(good) ok++; }); $(id+"-res").textContent=ok+" / "+g.length; }
function showGaps(id){ $(id).querySelectorAll("input.gap").forEach(i=>{ i.value=i.dataset.a.split("|")[0]; i.classList.remove("bad"); i.classList.add("ok"); }); }
function checkSel(){ let ok=0; const s=$("match").querySelectorAll("select"); s.forEach(x=>{ const good=x.value===x.dataset.a; x.classList.toggle("ok",good); x.classList.toggle("bad",!good); if(good) ok++; }); $("match-res").textContent=ok+" / "+s.length; }
function checkQuiz(){ let ok=0; L.quiz.forEach((q,i)=>{ document.getElementsByName("q"+i).forEach(r=>{ const l=r.parentElement; l.className=""; if(r.checked){ const good=+r.value===q[2]; l.className=good?"ok":"bad"; if(good) ok++; } }); }); $("quiz-res").textContent=ok+" / "+L.quiz.length; }
function resetIn(root){
  root.querySelectorAll("input.gap").forEach(i=>{ i.value=""; i.classList.remove("ok","bad"); });
  root.querySelectorAll("select[data-a]").forEach(s=>{ s.value=""; s.classList.remove("ok","bad"); });
  root.querySelectorAll('input[type="radio"]').forEach(r=>{ r.checked=false; r.parentElement.className=""; });
  root.querySelectorAll(".tf li").forEach(l=>{ l.removeAttribute("data-ok"); l.querySelectorAll("button").forEach(b=>b.classList.remove("on")); const m=l.querySelector(".m"); m.textContent=""; m.className="m"; });
  root.querySelectorAll(".bank span.x").forEach(s=>s.classList.remove("x"));
  root.querySelectorAll(".res").forEach(r=>r.textContent="");
}
function printAs(mode){ const b=document.body, was=b.classList.contains("t"); b.classList.toggle("t",mode==="t"); b.classList.toggle("ph",mode==="h"); window.print(); b.classList.remove("ph"); b.classList.toggle("t",was); }

document.addEventListener("click",e=>{
  const t = e.target, b = t.closest ? t.closest("button") : null;
  if(t.tagName==="SPAN" && t.parentElement && t.parentElement.classList.contains("bank")){ t.classList.toggle("x"); return; }
  if(t.classList && t.classList.contains("ts")){ load(TR[t.dataset.track],TITLES[t.dataset.track],+t.dataset.i); return; }
  if(!b) return;
  if(b.dataset.check){ const id=b.dataset.check; id==="match"?checkSel():id==="quiz"?checkQuiz():checkGaps(id); }
  else if(b.dataset.show){ showGaps(b.dataset.show); saveState(); }
  else if(b.dataset.reset){ resetIn(b.closest("section")); saveState(); }
  else if(b.id==="resetall"){ resetIn(document); saveState(); }
  else if(b.dataset.print) printAs(b.dataset.print);
  else if(b.dataset.track) load(TR[b.dataset.track],TITLES[b.dataset.track],0);
  else if(b.dataset.v!==undefined && b.classList.contains("say")){ const v=L.vocab[+b.dataset.v]; load(buildTrack("",[{text:v[0]+". "+v[2]}]),v[0]); }
  else if(b.dataset.sayel){ load(buildTrack("",Array.from($(b.dataset.sayel).querySelectorAll("li")).map(p=>({text:p.textContent.replace(/…/g,", ")+"."}))),"Useful sentences"); }
  else if(b.id==="saybasics") load(buildTrack("",L.basics.map(x=>({text:x[0]+"."}))),"Basic words");
  else if(b.id==="pl-play"){ P.on ? pause() : play(P.i); }
  else if(b.id==="pl-prev") play(P.i-1);
  else if(b.id==="pl-next") play(P.i+1);
  else if(b.id==="pl-stop"){ pause(); P.q=[]; ui(); }
  else if(b.id==="tbtn"){ const on=document.body.classList.toggle("t"); b.textContent=on?"Student view":"Teacher view"; }
  else if(b.dataset.v && b.closest(".tf")){ const li=b.closest("li"); li.querySelectorAll("button").forEach(x=>x.classList.remove("on")); b.classList.add("on"); const ok=b.dataset.v===li.dataset.a; li.dataset.ok=ok; const m=li.querySelector(".m"); m.textContent=ok?"✓":"✗"; m.className="m "+(ok?"ok-t":"bad-t"); $("tf-res").textContent=$("tf").querySelectorAll('li[data-ok="true"]').length+" / "+L.tf.length; }
});
/* ---------- zapamatování vyplněných odpovědí v tomto prohlížeči ---------- */
const KEY = "ebc-english-L"+L.n;
function fields(){ return Array.from(document.querySelectorAll('input.gap, select[data-a], #quiz input[type="radio"]')); }
function saveState(){ try{ localStorage.setItem(KEY, JSON.stringify(fields().map(f=>f.type==="radio"?f.checked:f.value))); }catch(e){} }
(function(){ try{ const s = JSON.parse(localStorage.getItem(KEY)||"null"), f = fields(); if(s && s.length===f.length) f.forEach((x,i)=>{ if(x.type==="radio") x.checked = !!s[i]; else x.value = s[i]||""; }); }catch(e){} })();
document.addEventListener("input",saveState); document.addEventListener("change",saveState);
document.addEventListener("input",e=>{ if(e.target.id==="pl-bar"){ P.on ? play(+e.target.value) : (P.i=+e.target.value, ui()); } });
document.addEventListener("change",e=>{ if(e.target.id==="accent"){ voiceInfo(); if(P.on) play(P.i); } if(e.target.id==="rate" && P.on) play(P.i); });
})();
