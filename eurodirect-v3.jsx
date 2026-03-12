import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body, #root {
    width: 100%; min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #F6F8FB;
    color: #1A2332;
    -webkit-font-smoothing: antialiased;
  }
  :root {
    --ink:    #1A2332;
    --navy:   #111827;
    --blue:   #1A6FD4;
    --blue2:  #155BB0;
    --red:    #E8401E;
    --red2:   #C93418;
    --bpale:  #E8F0FB;
    --gold:   #E8401E;
    --gold-l: #FFF0EC;
    --bg:     #F6F8FB;
    --white:  #FFFFFF;
    --border: #E0E6EF;
    --muted:  #6B7A8D;
    --light:  #F0F4FA;
    --green:  #0A7A50;
    --fh: 'Barlow Condensed', sans-serif;
    --fb: 'Plus Jakarta Sans', sans-serif;
    --sh:  0 1px 3px rgba(15,30,60,.06), 0 4px 14px rgba(15,30,60,.07);
    --sh2: 0 4px 12px rgba(15,30,60,.08), 0 16px 48px rgba(15,30,60,.12);
    --r: 12px; --rs: 8px;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  .au  { animation: fadeUp .45s cubic-bezier(.22,1,.36,1) both; }
  .au1 { animation: fadeUp .45s .07s cubic-bezier(.22,1,.36,1) both; }
  .au2 { animation: fadeUp .45s .14s cubic-bezier(.22,1,.36,1) both; }
  .au3 { animation: fadeUp .45s .21s cubic-bezier(.22,1,.36,1) both; }
  .au4 { animation: fadeUp .45s .28s cubic-bezier(.22,1,.36,1) both; }

  input[type=range] {
    -webkit-appearance:none; width:100%; height:4px;
    background:var(--border); border-radius:2px; outline:none; cursor:pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance:none; width:20px; height:20px; border-radius:50%;
    background:var(--blue); border:3px solid white;
    box-shadow:0 2px 8px rgba(0,99,229,.4);
  }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:var(--light); }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
  .lift { transition:transform .2s ease, box-shadow .2s ease; }
  .lift:hover { transform:translateY(-3px); box-shadow:var(--sh2); }
`;

/* ── DATA ── */
const MAKES = ["BMW","Mercedes-Benz","Volkswagen","Audi","Toyota","Škoda","Volvo","Ford","Peugeot","Renault"];
const MODELS = {
  "BMW":["1 Serie","2 Serie","3 Serie","5 Serie","X1","X3","X5"],
  "Mercedes-Benz":["A-Klasse","C-Klasse","E-Klasse","GLA","GLC","GLE"],
  "Volkswagen":["Golf","Passat","Tiguan","ID.3","ID.4","Polo"],
  "Audi":["A3","A4","A6","Q3","Q5","Q7","e-tron"],
  "Toyota":["Corolla","RAV4","Yaris","C-HR","bZ4X","Prius"],
  "Škoda":["Octavia","Fabia","Karoq","Kodiaq","Superb"],
  "Volvo":["XC40","XC60","XC90","V60","S60"],
  "Ford":["Focus","Puma","Kuga","Mustang Mach-E"],
  "Peugeot":["208","308","3008","5008","e-208"],
  "Renault":["Clio","Megane","Captur","Arkana","Zoe"],
};

const VEHICLES = [
  { id:"v1", make:"BMW", model:"5 Serie", variant:"530i xDrive M-Sport",
    year:2023, km:18500, fuel:"Benzine", trans:"Automaat", body:"Sedan",
    price:6895000, mo:62900, color:"Alpinweiss", kw:245, co2:142, energy:"B", doors:4,
    badge:"Featured",
    img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80" },
  { id:"v2", make:"Mercedes-Benz", model:"C-Klasse", variant:"220d AMG-Line",
    year:2023, km:12200, fuel:"Diesel", trans:"Automaat", body:"Sedan",
    price:5895000, mo:52400, color:"Selenietgrijs", kw:147, co2:118, energy:"A", doors:4,
    badge:"Nieuw",
    img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=80" },
  { id:"v3", make:"Volkswagen", model:"ID.4", variant:"Pro Performance AWD",
    year:2023, km:8900, fuel:"Elektrisch", trans:"Automaat", body:"SUV",
    price:4995000, mo:44800, color:"Moonstone Grey", kw:210, co2:0, energy:"A+", doors:5,
    badge:"EV",
    img:"https://images.unsplash.com/photo-1671744996999-23f2cca7f58a?w=900&q=80" },
  { id:"v4", make:"Audi", model:"Q5", variant:"45 TFSI quattro S-Line",
    year:2022, km:34100, fuel:"Benzine", trans:"Automaat", body:"SUV",
    price:5495000, mo:49200, color:"Navarra Blauw", kw:195, co2:154, energy:"C", doors:5,
    badge:null,
    img:"https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=900&q=80" },
  { id:"v5", make:"Škoda", model:"Octavia", variant:"2.0 TDI Style Combi",
    year:2023, km:21000, fuel:"Diesel", trans:"Handgeschakeld", body:"Stationwagon",
    price:3495000, mo:31200, color:"Crystalblauw", kw:110, co2:104, energy:"A", doors:5,
    badge:"Populair",
    img:"https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&q=80" },
  { id:"v6", make:"Toyota", model:"RAV4", variant:"2.5 Hybrid AWD Style",
    year:2023, km:5400, fuel:"Hybride", trans:"Automaat", body:"SUV",
    price:4795000, mo:42900, color:"Supersonic Rood", kw:163, co2:102, energy:"A", doors:5,
    badge:"Nieuw",
    img:"https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=900&q=80" },
];

/* ── HELPERS ── */
const eur  = c => new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(c/100);
const fkm  = k => new Intl.NumberFormat("nl-NL").format(k)+" km";
const FUEL_C = { Benzine:["#FFF3E0","#C45700"], Diesel:["#EEF0FF","#3730A3"], Elektrisch:["#E8F5E9","#1B6B35"], Hybride:["#E0F7F0","#0D6B50"] };
const ENRG_C = { "A+":"#006400","A":"#1E8C2E","B":"#7CB82F","C":"#B8A500","D":"#D06000","E":"#C23000","F":"#B71C1C" };
const FuelPill = ({f}) => { const [bg,tx]=FUEL_C[f]||["#F3F4F6","#555"]; return <span style={{background:bg,color:tx,borderRadius:5,padding:"3px 9px",fontSize:11,fontWeight:500,fontFamily:"var(--fb)",letterSpacing:".2px"}}>{f}</span>; };
const EnergyPill = ({e}) => { const c=ENRG_C[e]||"#888",tx=e==="C"||e==="B"?"#333":"white"; return <span style={{background:c,color:tx,borderRadius:4,padding:"2px 7px",fontSize:11,fontWeight:600,fontFamily:"monospace"}}>{e}</span>; };
const BadgePill = ({b}) => {
  if(!b) return null;
  const m={Featured:{bg:"#0C1E35",tx:"white"},Nieuw:{bg:"#0063E5",tx:"white"},EV:{bg:"#0A7A50",tx:"white"},Populair:{bg:"#E07B00",tx:"white"}};
  const s=m[b]||{bg:"#333",tx:"white"};
  return <span style={{background:s.bg,color:s.tx,borderRadius:5,padding:"3px 10px",fontSize:10,fontWeight:600,fontFamily:"var(--fb)",letterSpacing:".8px",textTransform:"uppercase"}}>{b}</span>;
};

/* ── LAYOUT WRAPPER ── */
const W = ({children,narrow}) => (
  <div style={{width:"100%",maxWidth:narrow?680:1180,margin:"0 auto",padding:"0 20px"}}>
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════════
   NAV — white, clean
══════════════════════════════════════════════════════════ */
const Nav = ({page,setPage}) => (
  <nav style={{width:"100%",background:"white",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 8px rgba(15,30,60,.06)"}}>
    <W>
      <div style={{height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {/* Logo */}
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Blue D shape — right side */}
              <path d="M22 2 C34 2 42 8 42 16 C42 24 34 30 22 30 L22 24 C30 24 36 20.4 36 16 C36 11.6 30 8 22 8 Z" fill="#29ABE2"/>
              {/* Red circle — left, slightly overlapping */}
              <circle cx="16" cy="16" r="14" fill="#E8401E"/>
              {/* White inner cutout on red to create D/p bowl shape */}
              <circle cx="16" cy="16" r="7" fill="white"/>
            </svg>
            <div style={{display:"flex",alignItems:"baseline",gap:3}}>
              <span style={{fontFamily:"var(--fb)",fontWeight:500,fontSize:19,color:"#1A6FD4",letterSpacing:"-.5px",lineHeight:1}}>eurodirect</span>
              <span style={{fontFamily:"var(--fb)",fontWeight:600,fontSize:19,color:"#E8401E",letterSpacing:"-.3px",lineHeight:1}}>lease</span>
            </div>
          </div>
        </button>

        {/* Links */}
        <div style={{display:"flex",gap:0,marginLeft:"auto"}}>
          {[["Aanbod","vlp"],["Operational Lease","vlp"],["Financial Lease","vlp"],["Short Lease","vlp"],["Over ons","overons"],["Contact","quote"],["FAQ","faq"]].map(([l,t])=>(
            <button key={l} onClick={()=>setPage(t)} style={{
              background:"none",border:"none",cursor:"pointer",
              color:"#6B7A8D",
              fontFamily:"var(--fb)",fontSize:13,fontWeight:400,
              padding:"6px 13px",borderRadius:6,transition:"color .15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.color="#1A2332"}
            onMouseLeave={e=>e.currentTarget.style.color="#6B7A8D"}
            >{l}</button>
          ))}
        </div>
      </div>
    </W>
  </nav>
);

/* ══════════════════════════════════════════════════════════
   SEARCH WIDGET (hero centerpiece)
══════════════════════════════════════════════════════════ */
const SearchWidget = ({setPage, setSearchFilters}) => {
  const [make, setMake]     = useState("");
  const [model, setModel]   = useState("");
  const [maxMo, setMaxMo]   = useState(750);
  const [activeTab, setActiveTab] = useState("financial");

  const models = make ? (MODELS[make]||[]) : [];

  const handleSearch = () => {
    setSearchFilters({make,model,maxMo});
    setPage("vlp");
  };

  const selStyle = {
    width:"100%", padding:"11px 14px",
    border:"1.5px solid var(--border)", borderRadius:"var(--rs)",
    fontFamily:"var(--fb)", fontSize:14, color:"var(--ink)",
    background:"white", outline:"none", cursor:"pointer",
    WebkitAppearance:"none",
    backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%236B7A8D' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat:"no-repeat", backgroundPosition:"right 13px center",
    transition:"border-color .15s",
  };

  return (
    <div style={{
      background:"white",
      borderRadius:16,
      boxShadow:"0 4px 24px rgba(15,30,60,.12), 0 1px 4px rgba(15,30,60,.06)",
      overflow:"hidden",
    }}>
      {/* Tab bar */}
      <div style={{display:"flex",borderBottom:"1px solid var(--border)"}}>
        {[["Financial Lease","financial"],["Operational Lease","operational"],["Short Lease","short"]].map(([lbl,id])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{
            flex:1,padding:"13px 8px",border:"none",cursor:"pointer",
            fontFamily:"var(--fb)",fontSize:13,fontWeight:activeTab===id?600:400,
            background:activeTab===id?"white":"var(--light)",
            color:activeTab===id?"var(--blue)":"var(--muted)",
            borderBottom:activeTab===id?"2px solid var(--blue)":"2px solid transparent",
            transition:"all .15s",
          }}
          onMouseEnter={e=>{if(activeTab!==id){e.currentTarget.style.color="var(--ink)";e.currentTarget.style.background="white"}}}
          onMouseLeave={e=>{if(activeTab!==id){e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="var(--light)"}}}
          >{lbl}</button>
        ))}
      </div>

      {/* Fields */}
      <div style={{padding:"22px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:12,alignItems:"end"}}>
          {/* Make */}
          <div>
            <label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Merk</label>
            <select value={make} onChange={e=>{setMake(e.target.value);setModel("");}} style={selStyle}>
              <option value="">Alle merken</option>
              {MAKES.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Model */}
          <div>
            <label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Model</label>
            <select value={model} onChange={e=>setModel(e.target.value)} style={{...selStyle,opacity:models.length?1:.6}}>
              <option value="">Alle modellen</option>
              {models.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Max monthly */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px"}}>Max. p/mnd</label>
              <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:"var(--blue)",letterSpacing:"-.5px"}}>€ {maxMo},-</span>
            </div>
            <div style={{paddingTop:8}}>
              <input type="range" min={200} max={1500} step={50} value={maxMo} onChange={e=>setMaxMo(+e.target.value)}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>€200</span>
                <span style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>€1500+</span>
              </div>
            </div>
          </div>
          {/* Button */}
          <button onClick={handleSearch} style={{
            background:"var(--blue)",color:"white",border:"none",
            borderRadius:"var(--rs)",padding:"12px 24px",
            fontFamily:"var(--fb)",fontSize:14,fontWeight:500,
            cursor:"pointer",whiteSpace:"nowrap",height:44,
            display:"flex",alignItems:"center",gap:8,
            transition:"background .15s",boxShadow:"0 4px 14px rgba(0,99,229,.3)",
          }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--blue2)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--blue)"}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Zoeken
          </button>
        </div>


      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   VEHICLE CARD
══════════════════════════════════════════════════════════ */
const VCard = ({v, setPage, setVehicle}) => (
  <div className="lift" onClick={()=>{setVehicle(v);setPage("pdp");}} style={{
    background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",
    boxShadow:"var(--sh)",cursor:"pointer",overflow:"hidden",
  }}>
    <div style={{position:"relative",height:195,background:"#E8EDF5",overflow:"hidden"}}>
      <img src={v.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .35s ease"}}
        onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
        onMouseLeave={e=>e.target.style.transform="scale(1)"}
      />
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.22),transparent 55%)"}}/>
      <div style={{position:"absolute",top:10,left:10,display:"flex",gap:5}}><BadgePill b={v.badge}/></div>
      <div style={{position:"absolute",top:10,right:10}}><EnergyPill e={v.energy}/></div>
      <div style={{position:"absolute",bottom:10,left:10}}><FuelPill f={v.fuel}/></div>
    </div>
    <div style={{padding:"16px 18px"}}>
      <div style={{marginBottom:10}}>
        <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:18,color:"var(--navy)",letterSpacing:"-.3px"}}>{v.make} {v.model}</div>
        <div style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",marginTop:1}}>{v.variant}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,padding:"10px 0",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",marginBottom:12}}>
        {[[v.year,"jaar"],[fkm(v.km),"km"],[v.trans==="Automaat"?"Aut.":"Hand.","trans"],[v.kw+"kW","verm."]].map(([val,lbl],i)=>(
          <div key={i} style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--fb)",fontSize:12,fontWeight:500,color:"var(--ink)"}}>{val}</div>
            <div style={{fontFamily:"var(--fb)",fontSize:9,color:"var(--muted)",marginTop:1,textTransform:"uppercase",letterSpacing:".5px"}}>{lbl}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>Consumentenprijs</div>
          <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:"var(--ink)",letterSpacing:"-.5px"}}>{eur(v.price)}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>Financial lease v.a.</div>
          <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:20,color:"var(--blue)",letterSpacing:"-1px"}}>{eur(v.mo)}<span style={{fontSize:11,color:"var(--muted)",fontWeight:400}}>/mnd</span></div>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════════ */
const Home = ({setPage, setVehicle, searchFilters, setSearchFilters}) => (
  <div style={{width:"100%"}}>

    {/* ── HERO: light gradient with search widget ── */}
    <section style={{
      width:"100%",
      background:"linear-gradient(160deg, #111827 0%, #1A3A6B 55%, #1A6FD4 100%)",
      padding:"56px 0 0",
      position:"relative",
      overflow:"hidden",
    }}>
      {/* Subtle dot pattern */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:.07,
        backgroundImage:"radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
        backgroundSize:"28px 28px"}}/>
      <div style={{position:"absolute",top:"-20%",right:"0",width:600,height:600,
        background:"radial-gradient(circle,rgba(100,180,255,.25),transparent 65%)",pointerEvents:"none"}}/>

      <W>
        {/* Headline */}
        <div style={{textAlign:"center",marginBottom:32,position:"relative"}}>
          <h1 className="au1" style={{
            fontFamily:"var(--fh)",fontWeight:900,color:"white",
            fontSize:"clamp(40px,5.5vw,68px)",lineHeight:.95,
            letterSpacing:"-1px",marginBottom:14,
          }}>
            ZAKELIJK LEASEN?<br/>DIRECT GEREGELD
          </h1>
          <p className="au2" style={{
            fontFamily:"var(--fb)",color:"rgba(255,255,255,.65)",
            fontSize:16,maxWidth:520,margin:"0 auto",lineHeight:1.7,
          }}>
            Bij EURODIRECT Lease draait het om meedenken. Persoonlijk advies, geen callcenters — binnen 24 uur een offerte op maat.
          </p>
        </div>

        {/* ── SEARCH WIDGET ── */}
        <div className="au3" style={{position:"relative",zIndex:10,paddingBottom:0}}>
          <SearchWidget setPage={setPage} setSearchFilters={setSearchFilters}/>
        </div>
      </W>

      {/* Stats strip — overlaps the white section below */}
      <div className="au4" style={{
        marginTop:32,
        background:"rgba(255,255,255,.12)",
        backdropFilter:"blur(12px)",
        borderTop:"1px solid rgba(255,255,255,.15)",
      }}>
        <W>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
            {[["4.9 ★","Google reviews"],["24u","Offerte op maat"],["100%","Persoonlijk advies"],["15 jaar","Ervaring"]].map(([n,l],i)=>(
              <div key={i} style={{
                padding:"16px 0",
                borderRight:i<3?"1px solid rgba(255,255,255,.08)":"none",
                textAlign:"center",
              }}>
                <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:26,color:"white",letterSpacing:"-1px"}}>{n}</div>
                <div style={{fontFamily:"var(--fb)",fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2,fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>
        </W>
      </div>
    </section>

    {/* ── LEASE TYPES — light section ── */}
    <section style={{width:"100%",background:"var(--bg)",padding:"64px 0"}}>
      <W>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:700,color:"var(--blue)",textTransform:"uppercase",letterSpacing:"2px",marginBottom:8}}>Lease oplossingen</div>
          <h2 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:"clamp(30px,3.5vw,46px)",color:"var(--navy)",letterSpacing:"-1px",lineHeight:1}}>
            KIES UW LEASE TYPE
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {[
            { color:"#0063E5", title:"Financial Lease",
              sub:"Voertuig wordt uw eigendom", from:"299",
              desc:"Rijden in een auto die aan het eind van uw looptijd van u is. Ideaal voor fiscaal voordeel." },
            { color:"#0A7A50", title:"Operational Lease",
              sub:"All-inclusive, geen zorgen", from:"399",
              desc:"Onderhoud, verzekering en wegenbelasting zijn inbegrepen in één vast maandbedrag." },
            { color:"#E07B00", title:"Short Lease",
              sub:"1–12 maanden flexibel", from:"599",
              desc:"Flexibel rijden zonder lange verplichting. Ideaal als tijdelijke oplossing." },
          ].map((lt,i)=>(
            <div key={i} className="lift" onClick={()=>setPage("vlp")} style={{
              background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",
              borderTop:`3px solid ${lt.color}`,
              boxShadow:"var(--sh)",padding:"26px 26px",cursor:"pointer",
            }}>
              <div style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:700,color:lt.color,letterSpacing:".8px",textTransform:"uppercase",marginBottom:5}}>{lt.sub}</div>
              <h3 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:22,color:"var(--navy)",letterSpacing:"-.5px",marginBottom:10}}>{lt.title}</h3>
              <p style={{fontFamily:"var(--fb)",fontSize:13.5,color:"var(--muted)",lineHeight:1.7,marginBottom:18}}>{lt.desc}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:14,borderTop:"1px solid var(--border)"}}>
                <div>
                  <div style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>Vanaf</div>
                  <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:24,color:lt.color,letterSpacing:"-1px"}}>€ {lt.from},-<span style={{fontSize:13,fontWeight:400,color:"var(--muted)"}}>/mnd</span></div>
                </div>
                <div style={{width:34,height:34,borderRadius:8,background:lt.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:16,fontWeight:700}}>→</div>
              </div>
            </div>
          ))}
        </div>
      </W>
    </section>

    {/* ── FEATURED VEHICLES ── */}
    <section style={{width:"100%",background:"white",padding:"64px 0"}}>
      <W>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
          <div>
            <div style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:700,color:"var(--blue)",textTransform:"uppercase",letterSpacing:"2px",marginBottom:6}}>Direct beschikbaar</div>
            <h2 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:"clamp(28px,3vw,40px)",color:"var(--navy)",letterSpacing:"-1px",lineHeight:1}}>
              UITGELICHTE VOERTUIGEN
            </h2>
          </div>
          <button onClick={()=>setPage("vlp")} style={{
            background:"var(--blue)",color:"white",border:"none",borderRadius:"var(--rs)",
            padding:"10px 20px",fontSize:13,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",
            transition:"background .15s",flexShrink:0,
          }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--blue2)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--blue)"}
          >Bekijk alles →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {VEHICLES.slice(0,3).map(v=><VCard key={v.id} v={v} setPage={setPage} setVehicle={setVehicle}/>)}
        </div>
      </W>
    </section>

    {/* ── USP STRIP ── */}
    <section style={{width:"100%",background:"var(--bpale)",borderTop:"1px solid #D0DFFF",borderBottom:"1px solid #D0DFFF",padding:"40px 0"}}>
      <W>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {[
            ["✅","Persoonlijk advies","Geen callcenters, altijd direct contact met een specialist"],
            ["⚡","Binnen 24 uur","U ontvangt een offerte op maat binnen 24 uur"],
            ["🚗","Specialist in import","Maatwerk en import — geen standaardkeuzes"],
            ["🇳🇱","Gevestigd in Badhoevedorp","100% Nederlands bedrijf, KVK-geregistreerd"],
          ].map(([icon,title,desc],i)=>(
            <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"var(--sh)"}}>{icon}</div>
              <div>
                <div style={{fontFamily:"var(--fb)",fontWeight:500,fontSize:14,color:"var(--navy)",marginBottom:3}}>{title}</div>
                <div style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </W>
    </section>

    {/* ── CTA BAND ── */}
    <section style={{width:"100%",background:"#0F2D5A",padding:"72px 0"}}>
      <W narrow>
        <div style={{textAlign:"center"}}>
          <h2 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:"clamp(32px,4.5vw,54px)",color:"white",letterSpacing:"-1px",lineHeight:1,marginBottom:14}}>
            VRIJBLIJVEND OFFERTE AANVRAGEN?
          </h2>
          <p style={{fontFamily:"var(--fb)",fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.7,marginBottom:32,maxWidth:480,margin:"0 auto 32px"}}>
            Geen verplichtingen, geen kleine lettertjes. Een helder voorstel op maat — binnen 24 uur.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            <button onClick={()=>setPage("quote")} style={{
              background:"var(--gold)",color:"white",border:"none",borderRadius:"var(--rs)",
              padding:"14px 32px",fontSize:14,fontWeight:500,fontFamily:"var(--fb)",
              cursor:"pointer",boxShadow:"0 4px 18px rgba(224,123,0,.35)",transition:"all .15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="#C56F00";e.currentTarget.style.transform="translateY(-1px)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="var(--gold)";e.currentTarget.style.transform="translateY(0)"}}
            >Offerte aanvragen — gratis</button>
            <button onClick={()=>setPage("vlp")} style={{
              background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.8)",
              border:"1px solid rgba(255,255,255,.2)",borderRadius:"var(--rs)",
              padding:"14px 28px",fontSize:14,fontWeight:600,fontFamily:"var(--fb)",
              cursor:"pointer",backdropFilter:"blur(8px)",transition:"background .15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
            >Bekijk aanbod</button>
          </div>
        </div>
      </W>
    </section>

    <Footer setPage={setPage}/>
  </div>
);

/* ══════════════════════════════════════════════════════════
   VLP
══════════════════════════════════════════════════════════ */
const VLP = ({setPage, setVehicle, searchFilters}) => {
  const [f, setF] = useState({
    make: searchFilters?.make||"",
    fuel: searchFilters?.fuel||"",
    trans:"", body:"",
    maxMo: searchFilters?.maxMo||2000,
    q:"",
  });
  const [sort, setSort] = useState("def");
  const sf = (k,v) => setF(p=>({...p,[k]:v}));
  const makes = [...new Set(VEHICLES.map(v=>v.make))];
  const fuels = [...new Set(VEHICLES.map(v=>v.fuel))];

  const list = VEHICLES
    .filter(v=>{
      if(f.make && v.make!==f.make) return false;
      if(f.fuel && v.fuel!==f.fuel) return false;
      if(f.trans && v.trans!==f.trans) return false;
      if(v.mo/100 > f.maxMo) return false;
      if(f.q && !`${v.make} ${v.model} ${v.variant}`.toLowerCase().includes(f.q.toLowerCase())) return false;
      return true;
    })
    .sort((a,b)=>sort==="asc"?a.price-b.price:sort==="desc"?b.price-a.price:sort==="new"?b.year-a.year:0);

  const selSt = {
    width:"100%",padding:"9px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--rs)",
    fontFamily:"var(--fb)",fontSize:13,color:"var(--ink)",background:"white",outline:"none",cursor:"pointer",
    WebkitAppearance:"none",
    backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7A8D' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",
    transition:"border-color .15s",
  };

  return (
    <div style={{width:"100%",background:"var(--bg)",minHeight:"100vh"}}>
      {/* Top */}
      <div style={{width:"100%",background:"white",borderBottom:"1px solid var(--border)"}}>
        <W>
          <div style={{padding:"20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div>
              <h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:30,color:"var(--navy)",letterSpacing:"-1px"}}>ONS AANBOD</h1>
              <div style={{fontFamily:"var(--fb)",fontSize:13,color:"var(--muted)",marginTop:2}}>
                <span style={{color:"var(--blue)",fontWeight:500}}>{list.length}</span> voertuigen gevonden
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{...selSt,width:"auto",padding:"8px 32px 8px 12px"}}>
                <option value="def">Aanbevolen</option>
                <option value="asc">Prijs oplopend</option>
                <option value="desc">Prijs aflopend</option>
                <option value="new">Nieuwste eerst</option>
              </select>
              <button onClick={()=>setPage("quote")} style={{
                background:"var(--gold)",color:"white",border:"none",borderRadius:"var(--rs)",
                padding:"8px 18px",fontSize:13,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",flexShrink:0,
              }}>Offerte aanvragen</button>
            </div>
          </div>
        </W>
      </div>
      <W>
        <div style={{display:"grid",gridTemplateColumns:"252px 1fr",gap:22,padding:"24px 0 60px"}}>
          {/* Sidebar */}
          <div>
            <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:20,position:"sticky",top:78}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:12,borderBottom:"1px solid var(--border)"}}>
                <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:"var(--navy)"}}>Filters</span>
                <button onClick={()=>setF({make:"",fuel:"",trans:"",body:"",maxMo:2000,q:""})} style={{background:"none",border:"none",color:"var(--blue)",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"var(--fb)"}}>Wis alles</button>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Zoeken</label>
                <input value={f.q} onChange={e=>sf("q",e.target.value)} placeholder="Merk of model..." style={{width:"100%",padding:"9px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--rs)",fontFamily:"var(--fb)",fontSize:13,outline:"none",transition:"border-color .15s"}}
                  onFocus={e=>e.target.style.borderColor="var(--blue)"}
                  onBlur={e=>e.target.style.borderColor="var(--border)"}
                />
              </div>
              {[["Merk","make",makes],["Brandstof","fuel",fuels]].map(([lbl,key,opts])=>(
                <div key={key} style={{marginBottom:14}}>
                  <label style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>{lbl}</label>
                  <select value={f[key]} onChange={e=>sf(key,e.target.value)} style={selSt}>
                    <option value="">Alle</option>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>Transmissie</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {["Automaat","Handg."].map((t,i)=>{
                    const val=["Automaat","Handgeschakeld"][i];
                    return <button key={t} onClick={()=>sf("trans",f.trans===val?"":val)} style={{
                      padding:"8px 4px",borderRadius:7,border:"1.5px solid",
                      borderColor:f.trans===val?"var(--blue)":"var(--border)",
                      background:f.trans===val?"var(--bpale)":"white",
                      color:f.trans===val?"var(--blue)":"var(--muted)",
                      fontSize:12,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",transition:"all .15s",
                    }}>{t}</button>;
                  })}
                </div>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <label style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px"}}>Max. per maand</label>
                  <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:"var(--blue)",letterSpacing:"-.5px"}}>
                    {f.maxMo>=2000?"Geen max":eur(f.maxMo*100)}
                  </span>
                </div>
                <input type="range" min={200} max={2000} step={50} value={f.maxMo} onChange={e=>sf("maxMo",+e.target.value)}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                  <span style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>€200</span>
                  <span style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)"}}>Alles</span>
                </div>
              </div>
            </div>
          </div>
          {/* Grid */}
          <div>
            {list.length===0 ? (
              <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",padding:"64px 24px",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <h3 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:22,color:"var(--navy)",marginBottom:6}}>Geen resultaten</h3>
                <p style={{fontFamily:"var(--fb)",fontSize:14,color:"var(--muted)"}}>Pas uw filters aan</p>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18}}>
                {list.map(v=><VCard key={v.id} v={v} setPage={setPage} setVehicle={setVehicle}/>)}
              </div>
            )}
          </div>
        </div>
      </W>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   CALCULATOR
══════════════════════════════════════════════════════════ */
const Calc = ({vehicle,onQuote}) => {
  const price = vehicle?.price ?? 4500000;
  const [down,    setDown]    = useState(Math.round(price*.15/10000)*10000);
  const [balloon, setBalloon] = useState(Math.round(price*.25/10000)*10000);
  const [term,    setTerm]    = useState(48);
  const [rate,    setRate]    = useState(6.9);

  const monthly = (() => {
    const mr = rate/100/12;
    const bPV = balloon/Math.pow(1+mr,term);
    const fin = price-down-bPV;
    if(fin<=0) return 0;
    return Math.round((fin*mr)/(1-Math.pow(1+mr,-term)));
  })();

  return (
    <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",overflow:"hidden"}}>
      <div style={{background:"var(--navy)",padding:"18px 22px"}}>
        <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:19,color:"white",letterSpacing:"-.3px"}}>Financial Lease Calculator</div>
        <div style={{fontFamily:"var(--fb)",fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2,letterSpacing:".5px",textTransform:"uppercase"}}>Conform AFM · Annuïteiten methode</div>
      </div>
      <div style={{padding:22}}>
        <div style={{background:"var(--bpale)",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"var(--fb)",fontSize:11,color:"var(--muted)"}}>Voertuigprijs (incl. BTW)</div>
            <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:22,color:"var(--navy)",letterSpacing:"-1px"}}>{eur(price)}</div>
          </div>
          {vehicle&&<div style={{textAlign:"right",fontSize:12,fontFamily:"var(--fb)",color:"var(--blue)",fontWeight:600}}>{vehicle.make}<br/>{vehicle.model}</div>}
        </div>
        {[
          {label:"Aanbetaling",val:down,set:setDown,min:0,max:Math.round(price*.4),step:5000},
          {label:"Slottermijn",val:balloon,set:setBalloon,min:0,max:Math.round(price*.5),step:5000},
        ].map(s=>(
          <div key={s.label} style={{marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <span style={{fontFamily:"var(--fb)",fontSize:12,fontWeight:600,color:"var(--muted)"}}>{s.label}</span>
              <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:"var(--ink)",letterSpacing:"-.5px"}}>{eur(s.val)}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e=>s.set(+e.target.value)}/>
          </div>
        ))}
        <div style={{marginBottom:18}}>
          <label style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:7,textTransform:"uppercase",letterSpacing:"1px"}}>Looptijd</label>
          <div style={{display:"flex",gap:5}}>
            {[24,36,48,60,72].map(t=>(
              <button key={t} onClick={()=>setTerm(t)} style={{
                flex:1,padding:"8px 0",borderRadius:7,border:"1.5px solid",
                borderColor:term===t?"var(--blue)":"var(--border)",
                background:term===t?"var(--blue)":"white",
                color:term===t?"white":"var(--muted)",
                fontSize:12,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",transition:"all .15s",
              }}>{t}m</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:7,textTransform:"uppercase",letterSpacing:"1px"}}>Rente p/jr</label>
          <div style={{display:"flex",gap:5}}>
            {[4.9,5.9,6.9,7.9].map(r=>(
              <button key={r} onClick={()=>setRate(r)} style={{
                flex:1,padding:"8px 0",borderRadius:7,border:"1.5px solid",
                borderColor:rate===r?"var(--blue)":"var(--border)",
                background:rate===r?"var(--blue)":"white",
                color:rate===r?"white":"var(--muted)",
                fontSize:11,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",transition:"all .15s",
              }}>{r}%</button>
            ))}
          </div>
        </div>
        {/* Result */}
        <div style={{background:"linear-gradient(135deg,#0C1E35,#0040A0)",borderRadius:10,padding:"18px 20px",marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:"rgba(0,99,229,.25)"}}/>
          <div style={{textAlign:"center",position:"relative"}}>
            <div style={{fontFamily:"var(--fb)",fontSize:10,color:"rgba(255,255,255,.45)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Maandelijkse termijn</div>
            <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:38,color:"white",letterSpacing:"-2px",lineHeight:1}}>
              {eur(monthly)}<span style={{fontSize:14,color:"rgba(255,255,255,.5)",fontWeight:400}}>/mnd</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:14}}>
            {[["Financiering",eur(Math.max(0,price-down-balloon))],["Rente totaal",eur(Math.max(0,monthly*term+down+balloon-price))],["Totale kosten",eur(monthly*term+down+balloon)],["Eff. rente",rate+"%"]].map(([l,v])=>(
              <div key={l} style={{background:"rgba(255,255,255,.07)",borderRadius:7,padding:"7px 9px"}}>
                <div style={{fontFamily:"var(--fb)",fontSize:9,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".5px"}}>{l}</div>
                <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:14,color:"white",marginTop:1,letterSpacing:"-.3px"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onQuote} style={{
          width:"100%",background:"var(--gold)",color:"white",border:"none",
          borderRadius:"var(--rs)",padding:13,fontSize:14,fontWeight:500,
          fontFamily:"var(--fb)",cursor:"pointer",transition:"background .15s",
          boxShadow:"0 4px 14px rgba(224,123,0,.28)",
        }}
        onMouseEnter={e=>e.currentTarget.style.background="#C56F00"}
        onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}
        >Vraag offerte aan met deze berekening →</button>
        <p style={{fontFamily:"var(--fb)",fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:8,lineHeight:1.5}}>* Indicatieve berekening. Definitief aanbod na kredietbeoordeling.</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   PDP
══════════════════════════════════════════════════════════ */
const PDP = ({vehicle:v, setPage}) => {
  if(!v){setPage("vlp");return null;}
  const specs=[["Merk",v.make],["Model",v.model],["Uitvoering",v.variant],["Bouwjaar",v.year],["Kilometerstand",fkm(v.km)],["Brandstof",v.fuel],["Transmissie",v.trans],["Vermogen",v.kw+" kW"],["CO₂",v.co2+" g/km"],["Energielabel",<EnergyPill e={v.energy}/>],["Kleur",v.color],["Deuren",v.doors]];
  return (
    <div style={{width:"100%",background:"var(--bg)",minHeight:"100vh"}}>
      <W>
        <div style={{padding:"22px 0 60px"}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:18}}>
            {[["Home","home"],["Aanbod","vlp"],null].map((item,i)=>(
              item?<span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>setPage(item[1])} style={{background:"none",border:"none",color:"var(--blue)",fontSize:12,fontFamily:"var(--fb)",fontWeight:600,cursor:"pointer"}}>{item[0]}</button>
                <span style={{color:"var(--border)",fontSize:14}}>›</span>
              </span>:<span key={i} style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)"}}>{v.make} {v.model}</span>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:22,alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <div style={{borderRadius:"var(--r)",overflow:"hidden",background:"#E4E8F0",position:"relative",aspectRatio:"16/9"}}>
                <img src={v.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.2),transparent 50%)"}}/>
                <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}><BadgePill b={v.badge}/><EnergyPill e={v.energy}/></div>
                <div style={{position:"absolute",bottom:12,left:12}}><FuelPill f={v.fuel}/></div>
              </div>
              <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:"20px 22px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                  <div>
                    <h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:32,color:"var(--navy)",letterSpacing:"-1px",lineHeight:1}}>{v.make} {v.model}</h1>
                    <div style={{fontFamily:"var(--fb)",fontSize:13,color:"var(--muted)",marginTop:4}}>{v.variant}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"var(--fb)",fontSize:11,color:"var(--muted)"}}>Consumentenprijs</div>
                    <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:28,color:"var(--navy)",letterSpacing:"-1px"}}>{eur(v.price)}</div>
                  </div>
                </div>
              </div>
              <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:"20px 22px"}}>
                <h2 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:19,color:"var(--navy)",letterSpacing:"-.5px",marginBottom:14}}>Technische specificaties</h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                  {specs.map(([l,val],i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                      <span style={{fontFamily:"var(--fb)",fontSize:13,color:"var(--muted)"}}>{l}</span>
                      <span style={{fontFamily:"var(--fb)",fontSize:13,fontWeight:500,color:"var(--ink)"}}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{position:"sticky",top:78}}>
              <Calc vehicle={v} onQuote={()=>setPage("quote")}/>
            </div>
          </div>
        </div>
      </W>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   QUOTE
══════════════════════════════════════════════════════════ */
const Quote = ({setPage}) => {
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [form,setForm]=useState({kvk:"",company:"",address:"",postal:"",city:"",first:"",last:"",email:"",phone:"",role:"",lease:"FINANCIAL",term:48,km_yr:20000,note:""});
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const steps=["Bedrijf","Contact","Wensen","Bevestig"];
  const sub=()=>{setBusy(true);setTimeout(()=>{setBusy(false);setDone(true);},1800);};
  const inpSt={width:"100%",padding:"10px 13px",border:"1.5px solid var(--border)",borderRadius:"var(--rs)",fontFamily:"var(--fb)",fontSize:14,color:"var(--ink)",outline:"none",transition:"border-color .15s"};
  const F=({lbl,k,type="text",ph="",req=false})=>(
    <div style={{marginBottom:13}}>
      <label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>{lbl}{req&&<span style={{color:"#C0392B",marginLeft:2}}>*</span>}</label>
      <input type={type} value={form[k]} onChange={e=>sf(k,e.target.value)} placeholder={ph} style={inpSt}
        onFocus={e=>e.target.style.borderColor="var(--blue)"}
        onBlur={e=>e.target.style.borderColor="var(--border)"}
      />
    </div>
  );
  const selSt2={width:"100%",padding:"10px 13px",border:"1.5px solid var(--border)",borderRadius:"var(--rs)",fontFamily:"var(--fb)",fontSize:14,color:"var(--ink)",background:"white",outline:"none",cursor:"pointer"};
  if(done) return (
    <div style={{width:"100%",background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh2)",maxWidth:460,width:"100%",padding:44,textAlign:"center"}}>
        <div style={{width:68,height:68,borderRadius:"50%",background:"#E8F5EE",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:34}}>✅</div>
        <h2 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:28,color:"var(--navy)",letterSpacing:"-1px",marginBottom:8}}>Aanvraag ontvangen!</h2>
        <p style={{fontFamily:"var(--fb)",fontSize:14,color:"var(--muted)",lineHeight:1.7,marginBottom:20}}>Bedankt <strong style={{color:"var(--ink)"}}>{form.first}</strong>. Reactie binnen 24u op <strong style={{color:"var(--blue)"}}>{form.email}</strong>.</p>
        <div style={{background:"var(--bg)",borderRadius:9,padding:"10px 16px",marginBottom:20,fontFamily:"monospace",fontWeight:500,color:"var(--blue)",fontSize:15}}>EDL-{Date.now().toString().slice(-6)}</div>
        <button onClick={()=>{setPage("home");setDone(false);setStep(1);}} style={{background:"var(--blue)",color:"white",border:"none",borderRadius:"var(--rs)",padding:"11px 26px",fontSize:14,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer"}}>← Terug naar home</button>
      </div>
    </div>
  );
  return (
    <div style={{width:"100%",background:"var(--bg)",minHeight:"100vh",padding:"36px 0 60px"}}>
      <W narrow>
        {/* Progress */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",position:"relative"}}>
            <div style={{position:"absolute",top:13,left:"8%",right:"8%",height:2,background:"var(--border)",zIndex:0}}>
              <div style={{height:"100%",background:"var(--blue)",transition:"width .3s",width:`${((step-1)/3)*100}%`}}/>
            </div>
            {steps.map((s,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:1}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:i+1<step?"var(--blue)":i+1===step?"white":"var(--bg)",border:`2px solid ${i+1<=step?"var(--blue)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:12,fontWeight:600,color:i+1<step?"white":i+1===step?"var(--blue)":"var(--muted)",transition:"all .3s"}}>{i+1<step?"✓":i+1}</div>
                <div style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:i+1===step?700:400,color:i+1===step?"var(--blue)":"var(--muted)"}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:30}}>
          <h2 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:24,color:"var(--navy)",letterSpacing:"-1px",marginBottom:3}}>{["Bedrijfsgegevens","Contactpersoon","Lease wensen","Controleer & bevestig"][step-1]}</h2>
          <p style={{fontFamily:"var(--fb)",fontSize:13,color:"var(--muted)",marginBottom:22}}>Stap {step} van 4</p>
          {step===1&&<div><F lbl="KVK-nummer" k="kvk" ph="12345678" req/><F lbl="Bedrijfsnaam" k="company" ph="Uw B.V." req/><div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10}}><F lbl="Straat & nr." k="address" ph="Hoofdstraat 1"/><F lbl="Postcode" k="postal" ph="1234 AB"/></div><F lbl="Stad" k="city" ph="Amsterdam" req/></div>}
          {step===2&&<div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><F lbl="Voornaam" k="first" ph="Jan" req/><F lbl="Achternaam" k="last" ph="de Vries" req/></div><F lbl="E-mailadres" k="email" type="email" ph="jan@bedrijf.nl" req/><F lbl="Telefoon" k="phone" type="tel" ph="+31 6 12345678"/><div style={{marginBottom:13}}><label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>Functie</label><select value={form.role} onChange={e=>sf("role",e.target.value)} style={selSt2}><option value="">Selecteer functie</option>{["Directeur/Eigenaar","Financieel Directeur","Inkoper","Fleet Manager","Overig"].map(r=><option key={r}>{r}</option>)}</select></div></div>}
          {step===3&&<div>
            <div style={{marginBottom:16}}><label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:7,textTransform:"uppercase",letterSpacing:".8px"}}>Type lease *</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{[["FINANCIAL","📋 Financial"],["OPERATIONAL","🔄 Operational"],["SHORT","⚡ Short"]].map(([v,l])=><button key={v} onClick={()=>sf("lease",v)} style={{padding:"11px 6px",borderRadius:8,border:"2px solid",borderColor:form.lease===v?"var(--blue)":"var(--border)",background:form.lease===v?"var(--bpale)":"white",color:form.lease===v?"var(--blue)":"var(--muted)",fontSize:12,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",transition:"all .15s"}}>{l}</button>)}</div></div>
            <div style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".8px"}}>Looptijd</label><span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:"var(--ink)",letterSpacing:"-.5px"}}>{form.term} maanden</span></div><input type="range" min={12} max={72} step={12} value={form.term} onChange={e=>sf("term",+e.target.value)}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{[12,24,36,48,60,72].map(t=><span key={t} style={{fontFamily:"var(--fb)",fontSize:10,color:form.term===t?"var(--blue)":"var(--muted)",fontWeight:form.term===t?700:400}}>{t}m</span>)}</div></div>
            <div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".8px"}}>Jaarkilometrage</label><span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:"var(--ink)",letterSpacing:"-.5px"}}>{form.km_yr.toLocaleString("nl-NL")} km</span></div><input type="range" min={5000} max={80000} step={5000} value={form.km_yr} onChange={e=>sf("km_yr",+e.target.value)}/></div>
            <div><label style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:500,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>Aanvullende informatie</label><textarea value={form.note} onChange={e=>sf("note",e.target.value)} rows={3} placeholder="Specifieke wensen..." style={{width:"100%",padding:"10px 13px",border:"1.5px solid var(--border)",borderRadius:"var(--rs)",fontFamily:"var(--fb)",fontSize:14,outline:"none",resize:"vertical",color:"var(--ink)"}}/></div>
          </div>}
          {step===4&&<div>
            {[{t:"Bedrijf",r:[[form.company||"—",form.kvk?`KVK: ${form.kvk}`:""],[form.address,`${form.postal} ${form.city}`]]},{t:"Contact",r:[[`${form.first} ${form.last}`,form.role],[form.email,form.phone]]},{t:"Lease",r:[[form.lease+" Lease",`${form.term} maanden`],[`${form.km_yr.toLocaleString("nl-NL")} km/jr`,""]]},].map(sec=>(
              <div key={sec.t} style={{background:"var(--bg)",borderRadius:9,padding:"13px 15px",marginBottom:10}}>
                <div style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:600,color:"var(--muted)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:7}}>{sec.t}</div>
                {sec.r.map(([a,b],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"var(--ink)"}}>{a}</span>{b&&<span style={{fontFamily:"var(--fb)",fontSize:13,color:"var(--muted)"}}>{b}</span>}</div>)}
              </div>
            ))}
            <div style={{background:"var(--gold-l)",border:"1px solid #FFD88A",borderRadius:9,padding:"11px 14px",marginTop:4}}>
              <p style={{fontFamily:"var(--fb)",fontSize:12,color:"#6B3A00",lineHeight:1.6,margin:0}}>📧 Bevestiging wordt gestuurd naar <strong>{form.email||"uw e-mailadres"}</strong>. Reactie binnen 24 uur.</p>
            </div>
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:18,borderTop:"1px solid var(--border)"}}>
            <button onClick={()=>step===1?setPage("home"):setStep(s=>s-1)} style={{background:"none",border:"1.5px solid var(--border)",color:"var(--muted)",borderRadius:"var(--rs)",padding:"10px 20px",fontSize:14,fontWeight:600,fontFamily:"var(--fb)",cursor:"pointer",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--muted)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
            >{step===1?"Annuleren":"← Vorige"}</button>
            {step<4
              ?<button onClick={()=>setStep(s=>s+1)} style={{background:"var(--blue)",color:"white",border:"none",borderRadius:"var(--rs)",padding:"10px 22px",fontSize:14,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--blue2)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--blue)"}
              >Volgende →</button>
              :<button onClick={sub} disabled={busy} style={{background:"var(--gold)",color:"white",border:"none",borderRadius:"var(--rs)",padding:"10px 22px",fontSize:14,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"background .15s"}}
                onMouseEnter={e=>!busy&&(e.currentTarget.style.background="#C56F00")}
                onMouseLeave={e=>e.currentTarget.style.background="var(--gold)"}
              >{busy&&<span style={{width:13,height:13,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite"}}/>}{busy?"Verzenden…":"Versturen ✓"}</button>
            }
          </div>
        </div>
      </W>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   ADMIN
══════════════════════════════════════════════════════════ */
const Admin = ({setPage}) => {
  const [tab,setTab]=useState("dash");
  const [sync,setSync]=useState("idle");
  const LEADS=[
    {id:"L001",company:"Bakker Transport B.V.",contact:"Mark Bakker",email:"m.bakker@bt.nl",kvk:"23456789",vehicle:"BMW 5 Serie",type:"Financial",status:"NEW",date:"10-12-2025",mo:62900},
    {id:"L002",company:"De Vries Bouw B.V.",contact:"Sandra de Vries",email:"s.devries@dvb.nl",kvk:"34567890",vehicle:"Mercedes C-Klasse",type:"Operational",status:"CONTACTED",date:"09-12-2025",mo:52400},
    {id:"L003",company:"Tech Solutions NL",contact:"Ahmed Yilmaz",email:"a.yilmaz@ts.nl",kvk:"45678901",vehicle:"VW ID.4",type:"Financial",status:"QUOTED",date:"08-12-2025",mo:44800},
    {id:"L004",company:"Kaashandel Gouda",contact:"Pieter Smit",email:"p.smit@kg.nl",kvk:"56789012",vehicle:"Audi Q5",type:"Financial",status:"WON",date:"07-12-2025",mo:49200},
    {id:"L005",company:"Flex IT B.V.",contact:"Lisa Wang",email:"l.wang@fi.nl",kvk:"67890123",vehicle:"Toyota RAV4",type:"Short",status:"LOST",date:"06-12-2025",mo:42900},
  ];
  const SC={NEW:["#EFF6FF","#1D4ED8"],CONTACTED:["#FFFBEB","#B45309"],QUOTED:["#F5F3FF","#6D28D9"],WON:["#F0FDF4","#15803D"],LOST:["#FFF1F2","#BE123C"]};
  const LOGS=[{id:"WH001",src:"Hexon",ev:"upsert",ext:"HX-88421",ok:true,n:1,ms:142,t:"12:34:01"},{id:"WH002",src:"Hexon",ev:"upsert",ext:"HX-88422",ok:true,n:1,ms:198,t:"12:34:03"},{id:"WH003",src:"Hexon",ev:"delete",ext:"HX-77001",ok:true,n:1,ms:67,t:"12:33:45"},{id:"WH004",src:"VWE",ev:"batch",ext:"VWE-B-12",ok:false,n:0,ms:2100,t:"12:29:11"},{id:"WH005",src:"Wheelerdelta",ev:"upsert",ext:"WD-99012",ok:true,n:1,ms:234,t:"12:15:22"}];
  const trigger=()=>{setSync("busy");setTimeout(()=>setSync("ok"),1500);setTimeout(()=>setSync("idle"),4000);};
  const thSt={padding:"8px 13px",textAlign:"left",fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".8px",borderBottom:"1px solid var(--border)",background:"var(--bg)"};
  const tdSt={padding:"10px 13px",borderBottom:"1px solid var(--border)",fontFamily:"var(--fb)",fontSize:13};
  return (
    <div style={{display:"flex",height:"calc(100vh - 64px)",width:"100%",background:"var(--bg)"}}>
      <aside style={{width:200,background:"white",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"16px 14px 12px",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Beheerpaneel</div>
        </div>
        {[["dash","📊","Dashboard"],["leads","📥","Leads"],["vehicles","🚗","Voertuigen"],["webhooks","🔗","Webhooks"]].map(([id,ic,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            background:tab===id?"var(--bpale)":"none",
            borderLeft:`3px solid ${tab===id?"var(--blue)":"transparent"}`,
            border:"none",borderLeft:`3px solid ${tab===id?"var(--blue)":"transparent"}`,
            color:tab===id?"var(--blue)":"var(--muted)",
            fontFamily:"var(--fb)",fontSize:13,fontWeight:tab===id?700:500,
            padding:"11px 16px",display:"flex",alignItems:"center",gap:9,
            cursor:"pointer",textAlign:"left",width:"100%",transition:"all .15s",
          }}>{ic} {lbl}</button>
        ))}
        <div style={{marginTop:"auto",padding:12,borderTop:"1px solid var(--border)"}}>
          <button onClick={()=>setPage("home")} style={{background:"none",border:"1.5px solid var(--border)",color:"var(--muted)",borderRadius:7,padding:"7px 0",fontSize:12,fontFamily:"var(--fb)",cursor:"pointer",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.color="var(--blue)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)"}}
          >← Terug naar site</button>
        </div>
      </aside>
      <main style={{flex:1,overflow:"auto",padding:24}}>
        {tab==="dash"&&<div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:26,color:"var(--navy)",letterSpacing:"-1px",marginBottom:4}}>Dashboard</h1>
          <p style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",marginBottom:20}}>{new Date().toLocaleDateString("nl-NL",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[{l:"Nieuwe leads",v:"3",note:"+2 vandaag",c:"var(--blue)"},{l:"Actief aanbod",v:VEHICLES.length,note:"Up-to-date",c:"var(--green)"},{l:"Offertes",v:"12",note:"+4 deze week",c:"#7C3AED"},{l:"Conversie",v:"24%",note:"+3% vs vorige mnd",c:"var(--gold)"}].map(s=>(
              <div key={s.l} style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:"16px 18px"}}>
                <div style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:500,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:6}}>{s.l}</div>
                <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:30,color:"var(--navy)",letterSpacing:"-1px"}}>{s.v}</div>
                <div style={{fontFamily:"var(--fb)",fontSize:11,color:s.c,fontWeight:500,marginTop:5}}>{s.note}</div>
              </div>
            ))}
          </div>
          <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)"}}><h3 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:17,color:"var(--navy)",letterSpacing:"-.5px"}}>Recente leads</h3></div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Bedrijf","Voertuig","Type","Status","Mnd. termijn","Datum"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
              <tbody>{LEADS.slice(0,4).map((l,i)=>(
                <tr key={l.id} style={{background:i%2?"#FAFBFF":"white"}}>
                  <td style={tdSt}><div style={{fontWeight:500,color:"var(--navy)"}}>{l.company}</div><div style={{fontSize:11,color:"var(--muted)"}}>{l.contact}</div></td>
                  <td style={{...tdSt,color:"var(--muted)"}}>{l.vehicle}</td>
                  <td style={tdSt}><span style={{background:"var(--bpale)",color:"var(--blue)",borderRadius:5,padding:"2px 7px",fontSize:11,fontWeight:500}}>{l.type}</span></td>
                  <td style={tdSt}><span style={{background:SC[l.status][0],color:SC[l.status][1],borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:600}}>{l.status}</span></td>
                  <td style={{...tdSt,fontFamily:"var(--fh)",fontWeight:800,fontSize:14,color:"var(--blue)",letterSpacing:"-.5px"}}>{eur(l.mo)}/mnd</td>
                  <td style={{...tdSt,fontSize:12,color:"var(--muted)"}}>{l.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {tab==="leads"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div><h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:26,color:"var(--navy)",letterSpacing:"-1px"}}>Leads & Offertes</h1><p style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",marginTop:2}}>{LEADS.length} aanvragen</p></div>
            <button style={{background:"var(--blue)",color:"white",border:"none",borderRadius:"var(--rs)",padding:"8px 16px",fontSize:12,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer"}}>⬇ Exporteren</button>
          </div>
          <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["#","Bedrijf / KVK","Contact","Voertuig","Type","Status","Mnd.termijn","Datum"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
              <tbody>{LEADS.map((l,i)=>(
                <tr key={l.id} style={{background:i%2?"#FAFBFF":"white"}}>
                  <td style={{...tdSt,fontFamily:"monospace",fontSize:10,color:"var(--muted)"}}>{l.id}</td>
                  <td style={tdSt}><div style={{fontWeight:500,color:"var(--navy)"}}>{l.company}</div><div style={{fontSize:10,color:"var(--muted)"}}>KVK: {l.kvk}</div></td>
                  <td style={tdSt}><div style={{fontWeight:600}}>{l.contact}</div><div style={{fontSize:10,color:"var(--blue)"}}>{l.email}</div></td>
                  <td style={{...tdSt,color:"var(--muted)"}}>{l.vehicle}</td>
                  <td style={tdSt}><span style={{background:"var(--bpale)",color:"var(--blue)",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:500}}>{l.type}</span></td>
                  <td style={tdSt}><span style={{background:SC[l.status][0],color:SC[l.status][1],borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:600}}>{l.status}</span></td>
                  <td style={{...tdSt,fontFamily:"var(--fh)",fontWeight:800,fontSize:13,color:"var(--blue)",letterSpacing:"-.5px"}}>{eur(l.mo)}/mnd</td>
                  <td style={{...tdSt,fontSize:11,color:"var(--muted)"}}>{l.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {tab==="vehicles"&&<div>
          <div style={{marginBottom:18}}><h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:26,color:"var(--navy)",letterSpacing:"-1px"}}>Voertuigbeheer</h1><p style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",marginTop:2}}>{VEHICLES.length} voertuigen beschikbaar</p></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:14}}>
            {VEHICLES.map(v=>(
              <div key={v.id} style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",overflow:"hidden"}}>
                <div style={{height:120,overflow:"hidden",background:"#E4E8F0",position:"relative"}}><img src={v.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",top:7,right:7}}><span style={{background:"#F0FDF4",color:"#15803D",borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:600,fontFamily:"var(--fb)"}}>● ACTIEF</span></div></div>
                <div style={{padding:"11px 13px"}}><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:"var(--navy)",letterSpacing:"-.3px"}}>{v.make} {v.model}</div><div style={{fontFamily:"var(--fb)",fontSize:11,color:"var(--muted)",marginBottom:7}}>{v.variant}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:14,color:"var(--blue)",letterSpacing:"-.5px"}}>{eur(v.price)}</div><div style={{fontFamily:"var(--fb)",fontSize:9,color:"var(--muted)"}}>ID: {v.id}</div></div></div>
              </div>
            ))}
          </div>
        </div>}

        {tab==="webhooks"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div><h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:26,color:"var(--navy)",letterSpacing:"-1px"}}>Webhook Logs</h1><p style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",marginTop:2}}>Hexon · VWE · Wheelerdelta</p></div>
            <button onClick={trigger} disabled={sync==="busy"} style={{background:sync==="ok"?"var(--green)":sync==="busy"?"var(--muted)":"var(--blue)",color:"white",border:"none",borderRadius:"var(--rs)",padding:"8px 16px",fontSize:12,fontWeight:500,fontFamily:"var(--fb)",cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"background .3s"}}>
              {sync==="busy"&&<span style={{width:11,height:11,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite"}}/>}
              {sync==="ok"?"✓ Sync OK!":sync==="busy"?"Syncing...":"▶ Test Hexon Sync"}
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
            {[{name:"Hexon",url:"/api/webhooks/hexon",auth:"HMAC-SHA256"},{name:"VWE",url:"/api/webhooks/vwe",auth:"API Key"},{name:"Wheelerdelta",url:"/api/webhooks/wheelerdelta",auth:"API Key"}].map(e=>(
              <div key={e.name} style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:"13px 15px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:"var(--navy)",letterSpacing:"-.3px"}}>{e.name}</span><span style={{background:"#F0FDF4",color:"#15803D",borderRadius:5,padding:"2px 7px",fontSize:9,fontWeight:800,fontFamily:"var(--fb)"}}>● ACTIEF</span></div>
                <div style={{background:"var(--bpale)",borderRadius:5,padding:"3px 8px",fontFamily:"monospace",fontSize:10,color:"var(--blue)",marginBottom:5}}>{e.url}</div>
                <div style={{fontFamily:"var(--fb)",fontSize:11,color:"var(--muted)"}}>Auth: {e.auth}</div>
              </div>
            ))}
          </div>
          <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["ID","Bron","Event","Extern ID","Status","Vrtg.","ms","Tijdstip"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
              <tbody>{LOGS.map((l,i)=>(
                <tr key={l.id} style={{background:i%2?"#FAFBFF":"white"}}>
                  <td style={{...tdSt,fontFamily:"monospace",fontSize:10,color:"var(--muted)"}}>{l.id}</td>
                  <td style={{...tdSt,fontWeight:500,color:"var(--navy)"}}>{l.src}</td>
                  <td style={tdSt}><span style={{background:"var(--bpale)",color:"var(--blue)",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:500}}>{l.ev}</span></td>
                  <td style={{...tdSt,fontFamily:"monospace",fontSize:10,color:"var(--muted)"}}>{l.ext}</td>
                  <td style={tdSt}><span style={{background:l.ok?"#F0FDF4":"#FFF1F2",color:l.ok?"#15803D":"#BE123C",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:600}}>{l.ok?"✓ OK":"✗ ERR"}</span></td>
                  <td style={{...tdSt,textAlign:"center",fontWeight:500}}>{l.n}</td>
                  <td style={{...tdSt,fontFamily:"monospace",fontSize:10,color:l.ms>1000?"#BE123C":"var(--muted)"}}>{l.ms}ms</td>
                  <td style={{...tdSt,fontFamily:"monospace",fontSize:10,color:"var(--muted)"}}>{l.t}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}
      </main>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   OVER ONS
══════════════════════════════════════════════════════════ */
const Footer = ({setPage}) => (
  <footer style={{width:"100%",background:"#0F2D5A",color:"rgba(255,255,255,.55)",padding:"52px 0 20px",fontFamily:"var(--fb)"}}>
    <W>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:28,marginBottom:36}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <svg width="38" height="28" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2 C34 2 42 8 42 16 C42 24 34 30 22 30 L22 24 C30 24 36 20.4 36 16 C36 11.6 30 8 22 8 Z" fill="#29ABE2"/>
              <circle cx="16" cy="16" r="14" fill="#E8401E"/>
              <circle cx="16" cy="16" r="7" fill="white"/>
            </svg>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                <span style={{fontFamily:"var(--fb)",fontWeight:500,fontSize:16,color:"white",letterSpacing:"-.3px"}}>eurodirect</span>
                <span style={{fontFamily:"var(--fb)",fontWeight:600,fontSize:16,color:"#E8401E",letterSpacing:"-.2px"}}>lease</span>
              </div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"2px",marginTop:3}}>UW SUCCES IN BEWEGING</div>
            </div>
          </div>
          <p style={{fontSize:13,lineHeight:1.75,maxWidth:260}}>Professionele lease-oplossingen voor Nederlandse ondernemers. Badhoevedorp · info@eurodirectlease.nl</p>
        </div>
        {[["Lease",["Financial Lease","Operational Lease","Short Lease","Calculator"]],["Bedrijf",["Over ons","Contact","Vacatures","Partners"]],["Info",["FAQ","Voorwaarden","Privacy","Cookies"]]].map(([title,items])=>(
          <div key={title}>
            <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,.3)",letterSpacing:"1.8px",textTransform:"uppercase",marginBottom:12}}>{title}</div>
            {items.map(item=><div key={item} style={{fontSize:13,marginBottom:8,cursor:"pointer",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{item}</div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:12}}>© 2025 EURODIRECT Lease · Badhoevedorp · 020-2386371</div>
        <div style={{fontSize:12,display:"flex",gap:18}}><span>📷 Instagram</span><span>💼 LinkedIn</span></div>
      </div>
    </W>
  </footer>
);

/* ══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════ */
const OverOns = ({setPage}) => (
  <div style={{width:"100%",background:"var(--bg)",minHeight:"100vh"}}>
    <div style={{width:"100%",background:"var(--navy)",padding:"56px 0 48px"}}>
      <W narrow>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"2px",marginBottom:10}}>Over ons</div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:"clamp(36px,5vw,58px)",color:"white",letterSpacing:"-1px",lineHeight:.95,marginBottom:14}}>ONZE AANPAK</h1>
          <p style={{fontFamily:"var(--fb)",fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.75,maxWidth:480,margin:"0 auto"}}>Bij EURODIRECT Lease draait het om meedenken. Wij helpen ondernemers snel en slim op weg met de juiste leaseoplossing.</p>
        </div>
      </W>
    </div>
    <W>
      <div style={{padding:"56px 0 72px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:40}}>
          {[
            ["Persoonlijk advies","Geen callcenters. U spreekt altijd direct met een specialist die meedenkt over uw situatie."],
            ["Specialist in import","Wij hebben ruime ervaring met import en maatwerk. Geen standaardoplossingen, maar wat écht bij u past."],
            ["Binnen 24 uur","Na uw aanvraag ontvangt u binnen 24 uur een offerte op maat. Geen wachttijden, geen gedoe."],
            ["Eerlijk & transparant","Duidelijke afspraken, geen kleine lettertjes. U weet altijd precies waar u aan toe bent."],
          ].map(([t,d],i)=>(
            <div key={i} style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:"26px 28px"}}>
              <div style={{width:36,height:3,background:"#1A6FD4",borderRadius:2,marginBottom:14}}/>
              <h3 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:20,color:"var(--navy)",letterSpacing:"-.5px",marginBottom:8}}>{t}</h3>
              <p style={{fontFamily:"var(--fb)",fontSize:14,color:"var(--muted)",lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>

        <div style={{background:"white",borderRadius:"var(--r)",border:"1px solid var(--border)",boxShadow:"var(--sh)",padding:"32px",marginBottom:20}}>
          <h2 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:26,color:"var(--navy)",letterSpacing:"-1px",marginBottom:24}}>ONS TEAM</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {[
              {name:"Lars",role:"Verkoper",email:"lars@eurodirectlease.nl",tel:"+31621195110"},
              {name:"Onno",role:"Directeur",email:"odunn@eurodirectlease.nl",tel:"+31645600495"},
              {name:"Raphael",role:"Verkoper",email:"info@eurodirectlease.nl",tel:"+31202386371"},
            ].map(p=>(
              <div key={p.name} style={{background:"var(--bg)",borderRadius:"var(--rs)",padding:"22px",textAlign:"center"}}>
                <div style={{width:60,height:60,borderRadius:"50%",background:"#1A6FD4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontFamily:"var(--fh)",fontWeight:800,fontSize:24,color:"white"}}>{p.name[0]}</div>
                <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:18,color:"var(--navy)",letterSpacing:"-.3px"}}>{p.name}</div>
                <div style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",marginBottom:12}}>{p.role}</div>
                <a href={`mailto:${p.email}`} style={{display:"block",fontFamily:"var(--fb)",fontSize:12,color:"#1A6FD4",textDecoration:"none",marginBottom:4}}>{p.email}</a>
                <a href={`tel:${p.tel}`} style={{fontFamily:"var(--fb)",fontSize:12,color:"var(--muted)",textDecoration:"none"}}>{p.tel}</a>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <button onClick={()=>setPage("quote")} style={{background:"#1A6FD4",color:"white",border:"none",borderRadius:"var(--rs)",padding:"13px 32px",fontSize:14,fontWeight:600,fontFamily:"var(--fb)",cursor:"pointer"}}>
            Neem contact op →
          </button>
        </div>
      </div>
    </W>
    <Footer setPage={setPage}/>
  </div>
);

/* ══════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════ */
const FAQ = ({setPage}) => {
  const [open, setOpen] = useState(null);
  const items = [
    ["Wat is financial lease?","Bij financial lease financiert EURODIRECT Lease de aankoop van uw voertuig. U betaalt maandelijks een vast bedrag en wordt aan het einde van de looptijd eigenaar van de auto."],
    ["Wat is operational lease?","Bij operational lease rijdt u in een auto zonder eigenaar te worden. Onderhoud, verzekering en wegenbelasting zijn vaak inbegrepen in één vast maandbedrag."],
    ["Wat is short lease?","Short lease is een flexibele leasevorm voor 1 tot 12 maanden. Ideaal als u tijdelijk een auto nodig heeft zonder langdurige verplichtingen."],
    ["Hoe snel ontvang ik een offerte?","Na uw aanvraag ontvangt u binnen 24 uur een vrijblijvende offerte op maat."],
    ["Kan ik als ZZP'er ook leasen?","Ja, wij werken ook voor ZZP'ers en eenmanszaken. Neem contact op voor de mogelijkheden."],
    ["Wat heb ik nodig voor een aanvraag?","Voor een aanvraag heeft u uw KVK-nummer, bedrijfsnaam en contactgegevens nodig. Wij regelen de rest."],
    ["Zijn er verborgen kosten?","Nee. Wij werken met duidelijke afspraken en transparante offertes. Geen kleine lettertjes."],
  ];
  return (
    <div style={{width:"100%",background:"var(--bg)",minHeight:"100vh"}}>
      <div style={{width:"100%",background:"var(--navy)",padding:"56px 0 48px"}}>
        <W narrow>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--fb)",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"2px",marginBottom:10}}>Veelgestelde vragen</div>
            <h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:"clamp(36px,5vw,58px)",color:"white",letterSpacing:"-1px",lineHeight:.95}}>FAQ</h1>
          </div>
        </W>
      </div>
      <W narrow>
        <div style={{padding:"48px 0 72px"}}>
          {items.map(([q,a],i)=>(
            <div key={i} style={{background:"white",borderRadius:"var(--rs)",border:"1px solid var(--border)",marginBottom:8,overflow:"hidden",boxShadow:"var(--sh)"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{
                width:"100%",padding:"18px 22px",background:"none",border:"none",cursor:"pointer",
                display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,
              }}>
                <span style={{fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:"var(--navy)",textAlign:"left"}}>{q}</span>
                <span style={{color:"#1A6FD4",fontSize:20,flexShrink:0,transform:open===i?"rotate(45deg)":"rotate(0)",transition:"transform .2s"}}>+</span>
              </button>
              {open===i&&<div style={{padding:"0 22px 18px",fontFamily:"var(--fb)",fontSize:14,color:"var(--muted)",lineHeight:1.75}}>{a}</div>}
            </div>
          ))}
          <div style={{textAlign:"center",marginTop:32}}>
            <button onClick={()=>setPage("quote")} style={{background:"#1A6FD4",color:"white",border:"none",borderRadius:"var(--rs)",padding:"13px 32px",fontSize:14,fontWeight:600,fontFamily:"var(--fb)",cursor:"pointer"}}>
              Nog vragen? Neem contact op →
            </button>
          </div>
        </div>
      </W>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default function App() {
  const [page,setPage]           = useState("home");
  const [vehicle,setVehicle]     = useState(null);
  const [searchFilters,setSF]    = useState({});
  useEffect(()=>{ window.scrollTo(0,0); },[page]);
  return (
    <>
      <style>{STYLES}</style>
      <div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav page={page} setPage={setPage}/>
        <main style={{flex:1,width:"100%"}}>
          {page==="home"    && <Home     setPage={setPage} setVehicle={setVehicle} searchFilters={searchFilters} setSearchFilters={setSF}/>}
          {page==="vlp"     && <VLP      setPage={setPage} setVehicle={setVehicle} searchFilters={searchFilters}/>}
          {page==="pdp"     && <PDP      vehicle={vehicle} setPage={setPage}/>}
          {page==="quote"   && <Quote    setPage={setPage}/>}
          {page==="overons" && <OverOns  setPage={setPage}/>}
          {page==="faq"     && <FAQ      setPage={setPage}/>}
          {page==="admin"   && <Admin    setPage={setPage}/>}
        </main>
      </div>
    </>
  );
}
