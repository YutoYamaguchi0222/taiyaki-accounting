import { useState, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const AT = {
  ASSET:     { label: "資産", normal: "debit",  order: 1 },
  LIABILITY: { label: "負債", normal: "credit", order: 2 },
  EQUITY:    { label: "資本", normal: "credit", order: 3 },
  REVENUE:   { label: "収益", normal: "credit", order: 4 },
  EXPENSE:   { label: "費用", normal: "debit",  order: 5 },
};

const DEPTS = [
  { id: "taiyaki", name: "たい焼き事業", color: "#2c5282", icon: "🐟" },
  { id: "uranai",  name: "占い事業",     color: "#276749", icon: "🔮" },
  { id: "escape", name: "脱出ゲーム事業", color: "#9b2c2c", icon: "🔑" },
];
const di = (id) => DEPTS.find((d) => d.id === id);
const CRED = { username: "admin", password: "password123" };

const ACCTS = [
  { code: "100", name: "現金", type: "ASSET" },
  { code: "110", name: "普通預金", type: "ASSET" },
  { code: "120", name: "売掛金", type: "ASSET" },
  { code: "130", name: "商品", type: "ASSET" },
  { code: "140", name: "備品", type: "ASSET" },
  { code: "200", name: "買掛金", type: "LIABILITY" },
  { code: "210", name: "借入金", type: "LIABILITY" },
  { code: "220", name: "未払金", type: "LIABILITY" },
  { code: "300", name: "資本金", type: "EQUITY" },
  { code: "310", name: "繰越利益剰余金", type: "EQUITY" },
  { code: "400", name: "売上", type: "REVENUE" },
  { code: "410", name: "受取利息", type: "REVENUE" },
  { code: "500", name: "仕入", type: "EXPENSE" },
  { code: "510", name: "給料", type: "EXPENSE" },
  { code: "520", name: "地代家賃", type: "EXPENSE" },
  { code: "530", name: "水道光熱費", type: "EXPENSE" },
  { code: "540", name: "通信費", type: "EXPENSE" },
  { code: "550", name: "減価償却費", type: "EXPENSE" },
];

const INIT_J = [
  { id:1,  dp:"taiyaki",dt:"2026-04-01",ds:"資本金の元入れ",    en:[{a:"100",d:5000000,c:0},{a:"300",d:0,c:5000000}]},
  { id:2,  dp:"taiyaki",dt:"2026-04-03",ds:"材料仕入",          en:[{a:"500",d:800000,c:0},{a:"200",d:0,c:800000}]},
  { id:3,  dp:"taiyaki",dt:"2026-04-10",ds:"たい焼き売上",      en:[{a:"120",d:1500000,c:0},{a:"400",d:0,c:1500000}]},
  { id:4,  dp:"taiyaki",dt:"2026-04-15",ds:"店舗家賃",          en:[{a:"520",d:150000,c:0},{a:"100",d:0,c:150000}]},
  { id:5,  dp:"taiyaki",dt:"2026-04-20",ds:"追加仕入",          en:[{a:"500",d:400000,c:0},{a:"100",d:0,c:400000}]},
  { id:6,  dp:"taiyaki",dt:"2026-04-25",ds:"給料支払い",        en:[{a:"510",d:350000,c:0},{a:"110",d:0,c:350000}]},
  { id:7,  dp:"taiyaki",dt:"2026-05-05",ds:"5月売上",           en:[{a:"100",d:1800000,c:0},{a:"400",d:0,c:1800000}]},
  { id:8,  dp:"taiyaki",dt:"2026-05-15",ds:"5月仕入",           en:[{a:"500",d:600000,c:0},{a:"200",d:0,c:600000}]},
  { id:9,  dp:"taiyaki",dt:"2026-05-25",ds:"5月給料",           en:[{a:"510",d:350000,c:0},{a:"100",d:0,c:350000}]},
  { id:10, dp:"uranai", dt:"2026-04-01",ds:"資本金の元入れ",    en:[{a:"100",d:3000000,c:0},{a:"300",d:0,c:3000000}]},
  { id:11, dp:"uranai", dt:"2026-04-05",ds:"占い道具仕入",      en:[{a:"500",d:500000,c:0},{a:"200",d:0,c:500000}]},
  { id:12, dp:"uranai", dt:"2026-04-12",ds:"鑑定売上",          en:[{a:"120",d:2800000,c:0},{a:"400",d:0,c:2800000}]},
  { id:13, dp:"uranai", dt:"2026-04-18",ds:"オフィス家賃",      en:[{a:"520",d:120000,c:0},{a:"100",d:0,c:120000}]},
  { id:14, dp:"uranai", dt:"2026-04-25",ds:"給料支払い",        en:[{a:"510",d:500000,c:0},{a:"100",d:0,c:500000}]},
  { id:15, dp:"uranai", dt:"2026-05-10",ds:"5月鑑定売上",       en:[{a:"100",d:2200000,c:0},{a:"400",d:0,c:2200000}]},
  { id:16, dp:"uranai", dt:"2026-05-25",ds:"5月給料",           en:[{a:"510",d:500000,c:0},{a:"100",d:0,c:500000}]},
  { id:17, dp:"escape",dt:"2026-04-01",ds:"資本金の元入れ",    en:[{a:"100",d:4000000,c:0},{a:"300",d:0,c:4000000}]},
  { id:18, dp:"escape",dt:"2026-04-08",ds:"設備投資",          en:[{a:"140",d:1200000,c:0},{a:"100",d:0,c:1200000}]},
  { id:19, dp:"escape",dt:"2026-04-14",ds:"入場売上",          en:[{a:"100",d:3200000,c:0},{a:"400",d:0,c:3200000}]},
  { id:20, dp:"escape",dt:"2026-04-20",ds:"施設家賃",          en:[{a:"520",d:250000,c:0},{a:"100",d:0,c:250000}]},
  { id:21, dp:"escape",dt:"2026-04-22",ds:"水道光熱費",        en:[{a:"530",d:80000,c:0},{a:"100",d:0,c:80000}]},
  { id:22, dp:"escape",dt:"2026-04-25",ds:"給料支払い",        en:[{a:"510",d:600000,c:0},{a:"100",d:0,c:600000}]},
  { id:23, dp:"escape",dt:"2026-05-08",ds:"5月入場売上",       en:[{a:"100",d:2800000,c:0},{a:"400",d:0,c:2800000}]},
  { id:24, dp:"escape",dt:"2026-05-20",ds:"5月家賃",           en:[{a:"520",d:250000,c:0},{a:"100",d:0,c:250000}]},
  { id:25, dp:"escape",dt:"2026-05-25",ds:"5月給料",           en:[{a:"510",d:600000,c:0},{a:"100",d:0,c:600000}]},
];

let _nid = 200;
const gid = () => ++_nid;
const fm = (n) => n.toLocaleString("ja-JP");
const ts = () => new Date().toISOString().replace("T"," ").slice(0,19);

const qJ = (js, did) => (!did || did === "all") ? js : js.filter(j => j.dp === did);
function bals(accts, js) { const m = {}; accts.forEach(a => (m[a.code] = { ...a, dr: 0, cr: 0 })); js.forEach(j => j.en.forEach(e => { if (m[e.a]) { m[e.a].dr += e.d; m[e.a].cr += e.c; } })); return m; }
function plCalc(accts, js) { const b = bals(accts, js); const v = Object.values(b); const rev = v.filter(x => x.type === "REVENUE").reduce((s, x) => s + x.cr - x.dr, 0); const exp = v.filter(x => x.type === "EXPENSE").reduce((s, x) => s + x.dr - x.cr, 0); return { revenue: rev, expense: exp, income: rev - exp }; }
function netBal(b) { return AT[b.type].normal === "debit" ? b.dr - b.cr : b.cr - b.dr; }
function consolidatedTB(accts, js) { return accts.map(a => { const row = { code: a.code, name: a.name, type: a.type }; let tdr = 0, tcr = 0; DEPTS.forEach(d => { const b2 = bals(accts, qJ(js, d.id)); const v = b2[a.code] || { dr: 0, cr: 0 }; row[d.id + "_dr"] = v.dr; row[d.id + "_cr"] = v.cr; tdr += v.dr; tcr += v.cr; }); row.total_dr = tdr; row.total_cr = tcr; return row; }).filter(r => r.total_dr || r.total_cr); }
function monthlyTrend(accts, js) { const months = {}; js.forEach(j => { const m = j.dt.slice(0, 7); if (!months[m]) months[m] = {}; if (!months[m][j.dp]) months[m][j.dp] = []; months[m][j.dp].push(j); }); return Object.keys(months).sort().map(m => { const row = { month: m }; DEPTS.forEach(d => { const pl = plCalc(accts, months[m]?.[d.id] || []); row[d.id + "_rev"] = pl.revenue; row[d.id + "_inc"] = pl.income; }); row.total_rev = DEPTS.reduce((s, d) => s + (row[d.id + "_rev"] || 0), 0); return row; }); }
function toCsv(js, accts) { const an = c => accts.find(a => a.code === c)?.name || c; const rows = [["No","日付","部門","摘要","科目","借方","貸方"].join(",")]; js.forEach(j => j.en.forEach((e, i) => { rows.push([i===0?j.id:"",i===0?j.dt:"",i===0?(di(j.dp)?.name||""):"",i===0?`"${j.ds}"`:"",an(e.a),e.d||"",e.c||""].join(",")); })); return "\uFEFF" + rows.join("\n"); }

const C = { bg:"#f5f4f1",sf:"#fff",bd:"#d6d3cc",tx:"#1a1a18",mt:"#78756c",ac:"#2c5282",abg:"#e8f0fa",dr:"#b83232",cr:"#276749",dn:"#c53030",rw:"#fafaf8" };
const tc2 = { ASSET:"#2c5282",LIABILITY:"#9b2c2c",EQUITY:"#553c9a",REVENUE:"#276749",EXPENSE:"#c05621" };
const PIE_C = ["#2c5282","#276749","#9b2c2c"];

const Z = {
  root:{fontFamily:"'Noto Sans JP',system-ui,sans-serif",fontSize:13,color:C.tx,background:C.bg,minHeight:"100vh",lineHeight:1.6},
  wrap:{maxWidth:1200,margin:"0 auto",padding:"20px 16px"},
  card:{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:4,padding:18,marginBottom:14},
  ct:{fontSize:14,fontWeight:600,marginBottom:10},
  tbl:{width:"100%",borderCollapse:"collapse",fontSize:11},
  th:{textAlign:"left",padding:"4px 6px",borderBottom:`2px solid ${C.bd}`,fontWeight:600,color:C.mt,fontSize:10},
  thr:{textAlign:"right",padding:"4px 6px",borderBottom:`2px solid ${C.bd}`,fontWeight:600,color:C.mt,fontSize:10},
  td:{padding:"4px 6px",borderBottom:`1px solid ${C.bd}18`},
  tdr:{padding:"4px 6px",borderBottom:`1px solid ${C.bd}18`,textAlign:"right",fontVariantNumeric:"tabular-nums"},
  tot:{fontWeight:700,borderTop:`2px solid ${C.tx}`},
  inp:{padding:"5px 7px",border:`1px solid ${C.bd}`,borderRadius:3,fontSize:13,width:"100%",boxSizing:"border-box"},
  sel:{padding:"5px 7px",border:`1px solid ${C.bd}`,borderRadius:3,fontSize:13,background:"#fff"},
  btn:{padding:"6px 14px",border:"none",borderRadius:3,fontSize:12,fontWeight:600,cursor:"pointer",background:C.ac,color:"#fff"},
  bs:{padding:"6px 14px",border:`1px solid ${C.bd}`,borderRadius:3,fontSize:12,cursor:"pointer",background:C.sf,color:C.tx},
  bd2:{padding:"3px 8px",border:"none",borderRadius:3,fontSize:11,cursor:"pointer",background:C.dn,color:"#fff"},
  badge:(c)=>({display:"inline-block",fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:2,color:c,background:c+"14"}),
  g2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14},
  g3:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14},
  tabs:{display:"flex",gap:0,borderBottom:`1px solid ${C.bd}`,marginBottom:20,overflowX:"auto"},
  tab:(on)=>({padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:on?600:400,color:on?C.ac:C.mt,borderBottom:on?`2px solid ${C.ac}`:"2px solid transparent",background:"none",border:"none",whiteSpace:"nowrap"}),
  ov:{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999},
  mod:{background:C.sf,borderRadius:8,padding:24,width:360,maxWidth:"90vw"},
};

function Login({ onLogin }) {
  const [u,su]=useState("admin"),[p,sp]=useState("password123"),[e,se]=useState("");
  const go = () => u===CRED.username&&p===CRED.password ? onLogin(u) : se("ユーザー名またはパスワードが正しくありません");
  return (<div style={{...Z.root,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:360,textAlign:"center"}}>
    <div style={{fontSize:32}}>📊</div><h1 style={{fontSize:20,fontWeight:700,margin:"0 0 2px"}}>複式簿記会計システム</h1><p style={{fontSize:12,color:C.mt,margin:"0 0 24px"}}>連結決算・セグメント分析対応</p>
    <div style={{...Z.card,padding:24,textAlign:"left"}}><div style={Z.ct}>ログイン</div>
      <div style={{marginBottom:12}}><label style={{fontSize:11,color:C.mt}}>ログインID</label><input style={Z.inp} value={u} onChange={x=>su(x.target.value)} /></div>
      <div style={{marginBottom:14}}><label style={{fontSize:11,color:C.mt}}>パスワード</label><input style={Z.inp} type="password" value={p} onChange={x=>sp(x.target.value)} onKeyDown={x=>{if(x.key==="Enter")go()}} /></div>
      {e&&<div style={{padding:"8px 10px",borderRadius:3,background:"#fff5f5",color:C.dn,fontSize:12,marginBottom:12}}>{e}</div>}
      <button style={{...Z.btn,width:"100%",padding:"9px 0",fontSize:14}} onClick={go}>ログイン</button>
    </div><p style={{fontSize:11,color:C.mt,marginTop:10}}>ID: admin / PW: password123</p>
  </div></div>);
}

function DeptModal({ cur, onPick, onClose }) {
  const items = [...DEPTS.map(d=>({...d})),{id:"all",name:"全社統合ビュー",color:"#1a1a18",icon:"👑"}];
  return (<div style={Z.ov} onClick={onClose}><div style={Z.mod} onClick={e=>e.stopPropagation()}>
    <div style={{fontSize:15,fontWeight:600,marginBottom:16}}>事業部を選択</div>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
      {items.map(d=>(<button key={d.id} onClick={()=>onPick(d.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",border:cur===d.id?`2px solid ${d.color}`:`1px solid ${C.bd}`,borderRadius:6,background:cur===d.id?d.color+"0a":C.sf,cursor:"pointer",fontSize:14,color:C.tx}}>
        <span style={{fontSize:20}}>{d.icon}</span><span style={{fontWeight:cur===d.id?600:400}}>{d.name}</span>{cur===d.id&&<span style={{marginLeft:"auto",fontSize:12,color:d.color}}>選択中</span>}
      </button>))}
    </div><button style={{...Z.bs,width:"100%"}} onClick={onClose}>キャンセル</button>
  </div></div>);
}

function Hdr({user,dept,onSwitch,onLogout,stats}){
  const isAll=dept==="all",d=di(dept);
  return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
    <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{isAll?"👑":d?.icon}</span><h1 style={{fontSize:18,fontWeight:700,margin:0,color:isAll?C.tx:d?.color}}>{isAll?"全社統合ダッシュボード":d?.name}</h1></div>
      <p style={{fontSize:11,color:C.mt,margin:"2px 0 0"}}>ログイン: {user} · 科目{stats.a} · 仕訳{stats.j}件</p></div>
    <div style={{display:"flex",gap:8}}><button style={{...Z.btn,background:isAll?"#1a1a18":d?.color}} onClick={onSwitch}>部門切り替え ▼</button><button style={Z.bs} onClick={onLogout}>ログアウト</button></div>
  </div>);
}

function ConsolidatedTB({ accts, journals }) {
  const rows = useMemo(() => consolidatedTB(accts, journals), [accts, journals]);
  const totals = {}; DEPTS.forEach(d => { totals[d.id+"_dr"]=0; totals[d.id+"_cr"]=0; }); totals.total_dr=0; totals.total_cr=0;
  rows.forEach(r => { DEPTS.forEach(d => { totals[d.id+"_dr"]+=r[d.id+"_dr"]; totals[d.id+"_cr"]+=r[d.id+"_cr"]; }); totals.total_dr+=r.total_dr; totals.total_cr+=r.total_cr; });
  return (<div style={Z.card}><div style={Z.ct}>全社連結試算表</div><div style={{overflowX:"auto"}}><table style={Z.tbl}>
    <thead><tr><th style={Z.th} rowSpan={2}>科目</th><th style={Z.th} rowSpan={2}>区分</th>{DEPTS.map(d=><th key={d.id} colSpan={2} style={{...Z.th,textAlign:"center",color:d.color,borderBottom:`2px solid ${d.color}`}}>{d.icon} {d.name}</th>)}<th colSpan={2} style={{...Z.th,textAlign:"center",borderBottom:`2px solid ${C.tx}`}}>全社合計</th></tr>
    <tr>{[...DEPTS,{id:"total"}].map(d=>[<th key={d.id+"d"} style={Z.thr}>借方</th>,<th key={d.id+"c"} style={Z.thr}>貸方</th>])}</tr></thead>
    <tbody>{rows.map((r,i)=>(<tr key={r.code} style={{background:i%2?C.rw:""}}><td style={{...Z.td,fontWeight:500}}>{r.name}</td><td style={Z.td}><span style={Z.badge(tc2[r.type])}>{AT[r.type].label}</span></td>
      {DEPTS.map(d=>[<td key={d.id+"d"} style={Z.tdr}>{r[d.id+"_dr"]?fm(r[d.id+"_dr"]):""}</td>,<td key={d.id+"c"} style={Z.tdr}>{r[d.id+"_cr"]?fm(r[d.id+"_cr"]):""}</td>])}
      <td style={{...Z.tdr,fontWeight:600}}>{r.total_dr?fm(r.total_dr):""}</td><td style={{...Z.tdr,fontWeight:600}}>{r.total_cr?fm(r.total_cr):""}</td></tr>))}
      <tr style={Z.tot}><td style={Z.td} colSpan={2}>合計</td>{DEPTS.map(d=>[<td key={d.id+"d"} style={Z.tdr}>{fm(totals[d.id+"_dr"])}</td>,<td key={d.id+"c"} style={Z.tdr}>{fm(totals[d.id+"_cr"])}</td>])}<td style={{...Z.tdr,fontSize:13}}>{fm(totals.total_dr)}</td><td style={{...Z.tdr,fontSize:13}}>{fm(totals.total_cr)}</td></tr>
    </tbody></table></div>{totals.total_dr===totals.total_cr?<div style={{marginTop:6,fontSize:12,color:C.cr}}>✓ 貸借一致</div>:<div style={{marginTop:6,fontSize:12,color:C.dn}}>✗ 差額 {fm(Math.abs(totals.total_dr-totals.total_cr))}</div>}</div>);
}

function ConsolidatedPL({ accts, journals }) {
  const data = useMemo(() => { const seg = DEPTS.map(d => ({ ...d, ...plCalc(accts, qJ(journals, d.id)) })); return { seg, total: plCalc(accts, journals) }; }, [accts, journals]);
  const chartData = data.seg.map(d => ({ name: d.name, 売上高: d.revenue, 費用: d.expense, 純利益: d.income }));
  return (<div><div style={Z.card}><div style={Z.ct}>連結損益計算書（P/L）</div><table style={Z.tbl}>
    <thead><tr><th style={Z.th}>項目</th>{DEPTS.map(d=><th key={d.id} style={{...Z.thr,color:d.color}}>{d.icon} {d.name}</th>)}<th style={{...Z.thr,fontWeight:700}}>全社合計</th></tr></thead>
    <tbody>{[{l:"売上高",k:"revenue"},{l:"費用合計",k:"expense"},{l:"純利益",k:"income",bg:"#f0fff4"}].map(row=>(<tr key={row.k} style={{background:row.bg||""}}>
      <td style={{...Z.td,fontWeight:row.k==="income"?700:500}}>{row.l}</td>{data.seg.map(d=><td key={d.id} style={{...Z.tdr,fontWeight:row.k==="income"?700:400,color:row.k==="income"?(d[row.k]>=0?C.cr:C.dr):undefined}}>{fm(d[row.k])}</td>)}
      <td style={{...Z.tdr,fontWeight:700,color:row.k==="income"?(data.total[row.k]>=0?C.cr:C.dr):undefined}}>{fm(data.total[row.k])}</td></tr>))}
      <tr><td style={{...Z.td,fontWeight:500}}>利益率</td>{data.seg.map(d=><td key={d.id} style={{...Z.tdr,color:C.cr}}>{d.revenue>0?((d.income/d.revenue)*100).toFixed(1)+"%":"—"}</td>)}<td style={{...Z.tdr,fontWeight:600}}>{data.total.revenue>0?((data.total.income/data.total.revenue)*100).toFixed(1)+"%":"—"}</td></tr>
    </tbody></table></div>
    <div style={Z.g2}><div style={Z.card}><div style={Z.ct}>事業部別 売上・費用・利益</div><ResponsiveContainer width="100%" height={220}><BarChart data={chartData} margin={{top:5,right:10,left:10,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>v>=1e6?(v/1e6)+"M":v>=1e3?(v/1e3)+"K":v}/><Tooltip formatter={v=>"¥"+fm(v)}/><Legend wrapperStyle={{fontSize:11}}/><Bar dataKey="売上高" fill={C.cr}/><Bar dataKey="費用" fill={C.dr}/><Bar dataKey="純利益" fill={C.ac}/></BarChart></ResponsiveContainer></div>
    <div style={Z.card}><div style={Z.ct}>売上構成比</div><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={data.seg.map(d=>({name:d.name,value:d.revenue}))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>{data.seg.map((_,i)=><Cell key={i} fill={PIE_C[i]}/>)}</Pie><Tooltip formatter={v=>"¥"+fm(v)}/></PieChart></ResponsiveContainer></div></div>
  </div>);
}

function ConsolidatedBS({ accts, journals }) {
  const data = useMemo(() => { const b = bals(accts, journals); const v = Object.values(b); const byT = t => v.filter(x => x.type === t && (x.dr || x.cr)); const inc = plCalc(accts, journals).income;
    return { assets: byT("ASSET"), liabilities: byT("LIABILITY"), equity: byT("EQUITY"), totalA: byT("ASSET").reduce((s,x) => s + netBal(x), 0), totalL: byT("LIABILITY").reduce((s,x) => s + netBal(x), 0), totalE: byT("EQUITY").reduce((s,x) => s + netBal(x), 0) + inc, income: inc }; }, [accts, journals]);
  const Sec = ({title,items,total,color}) => (<div style={Z.card}><div style={{...Z.ct,color}}>{title}</div><table style={Z.tbl}><tbody>{items.map(b=><tr key={b.code}><td style={{...Z.td,paddingLeft:8}}>{b.name}</td><td style={Z.tdr}>{fm(netBal(b))}</td></tr>)}<tr style={Z.tot}><td style={Z.td}>{title}合計</td><td style={{...Z.tdr,fontSize:14,fontWeight:700}}>{fm(total)}</td></tr></tbody></table></div>);
  return (<div><div style={Z.g3}>{[{l:"総資産",v:data.totalA,c:C.ac},{l:"総負債",v:data.totalL,c:C.dr},{l:"純資産",v:data.totalE,c:C.cr}].map(k=>(<div key={k.l} style={{...Z.card,textAlign:"center"}}><div style={{fontSize:11,color:C.mt}}>{k.l}</div><div style={{fontSize:22,fontWeight:700,color:k.c,fontVariantNumeric:"tabular-nums"}}>¥{fm(k.v)}</div></div>))}</div>
    <div style={Z.g2}><Sec title="資産の部" items={data.assets} total={data.totalA} color={C.ac}/>
    <div><Sec title="負債の部" items={data.liabilities} total={data.totalL} color={C.dr}/><Sec title="純資産の部" items={data.equity} total={data.totalE} color={C.cr}/>
      <div style={{...Z.card,background:data.totalA===data.totalL+data.totalE?"#f0fff4":"#fff5f5",textAlign:"center"}}><span style={{fontWeight:700}}>{data.totalA===data.totalL+data.totalE?"✓ 貸借一致":"✗ 貸借不一致"}</span><span style={{fontSize:12,color:C.mt,marginLeft:8}}>資産{fm(data.totalA)}＝負債+純資産{fm(data.totalL+data.totalE)}</span></div></div></div></div>);
}

function SegmentAnalysis({ accts, journals }) {
  const seg = useMemo(() => DEPTS.map(d => { const js = qJ(journals, d.id); const pl = plCalc(accts, js); const b = bals(accts, js); const v = Object.values(b); return { ...d, ...pl, totalA: v.filter(x=>x.type==="ASSET").reduce((s,x)=>s+netBal(x),0), totalL: v.filter(x=>x.type==="LIABILITY").reduce((s,x)=>s+netBal(x),0), margin: pl.revenue > 0 ? (pl.income/pl.revenue*100) : 0 }; }), [accts, journals]);
  const trend = useMemo(() => monthlyTrend(accts, journals), [accts, journals]);
  return (<div>
    <div style={Z.card}><div style={Z.ct}>事業部別分析レポート</div><table style={{...Z.tbl,fontSize:13}}>
      <thead><tr><th style={Z.th}>指標</th>{seg.map(d=><th key={d.id} style={{...Z.thr,color:d.color}}>{d.icon} {d.name}</th>)}</tr></thead>
      <tbody>{[{l:"売上高",k:"revenue"},{l:"費用",k:"expense"},{l:"純利益",k:"income"},{l:"利益率",k:"margin",pct:true},{l:"総資産",k:"totalA"},{l:"総負債",k:"totalL"}].map(row=>(<tr key={row.k} style={{background:row.k==="income"?"#f0fff4":""}}>
        <td style={{...Z.td,fontWeight:row.k==="income"?700:500}}>{row.l}</td>{seg.map(d=><td key={d.id} style={{...Z.tdr,fontWeight:row.k==="income"?700:400,color:row.k==="income"?(d[row.k]>=0?C.cr:C.dr):row.k==="margin"?C.cr:undefined}}>{row.pct?d[row.k].toFixed(1)+"%":"¥"+fm(d[row.k])}</td>)}</tr>))}</tbody></table></div>
    <div style={Z.g2}><div style={Z.card}><div style={Z.ct}>利益率比較</div><ResponsiveContainer width="100%" height={200}><BarChart data={seg.map(d=>({name:d.name,利益率:Math.round(d.margin*10)/10}))} margin={{top:5,right:10,left:10,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis unit="%" tick={{fontSize:10}}/><Tooltip formatter={v=>v+"%"}/><Bar dataKey="利益率" fill={C.cr}>{seg.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer></div>
    <div style={Z.card}><div style={Z.ct}>月別売上推移</div><ResponsiveContainer width="100%" height={200}><LineChart data={trend} margin={{top:5,right:10,left:10,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>v>=1e6?(v/1e6)+"M":v>=1e3?(v/1e3)+"K":v}/><Tooltip formatter={v=>"¥"+fm(v)}/><Legend wrapperStyle={{fontSize:11}}/>{DEPTS.map(d=><Line key={d.id} type="monotone" dataKey={d.id+"_rev"} name={d.name} stroke={d.color} strokeWidth={2} dot={{r:3}}/>)}</LineChart></ResponsiveContainer></div></div>
    <div style={Z.card}><div style={Z.ct}>月別 事業部別利益（積み上げ）</div><ResponsiveContainer width="100%" height={220}><BarChart data={trend} margin={{top:5,right:10,left:10,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>v>=1e6?(v/1e6)+"M":v>=1e3?(v/1e3)+"K":v}/><Tooltip formatter={v=>"¥"+fm(v)}/><Legend wrapperStyle={{fontSize:11}}/>{DEPTS.map(d=><Bar key={d.id} dataKey={d.id+"_inc"} name={d.name} stackId="a" fill={d.color}/>)}</BarChart></ResponsiveContainer></div>
    <div style={Z.g3}>{seg.map(d=>(<div key={d.id} style={{...Z.card,borderTop:`3px solid ${d.color}`}}><div style={{...Z.ct,color:d.color}}>{d.icon} {d.name}</div><table style={{...Z.tbl,fontSize:13}}><tbody>
      <tr><td style={Z.td}>売上高</td><td style={Z.tdr}>¥{fm(d.revenue)}</td></tr><tr><td style={Z.td}>費用</td><td style={Z.tdr}>¥{fm(d.expense)}</td></tr>
      <tr style={{background:"#f0fff4"}}><td style={{...Z.td,fontWeight:700}}>純利益</td><td style={{...Z.tdr,fontWeight:700,color:d.income>=0?C.cr:C.dr}}>¥{fm(d.income)}</td></tr>
      <tr><td style={Z.td}>利益率</td><td style={{...Z.tdr,color:C.cr}}>{d.margin.toFixed(1)}%</td></tr><tr><td style={Z.td}>総資産</td><td style={Z.tdr}>¥{fm(d.totalA)}</td></tr>
    </tbody></table></div>))}</div>
  </div>);
}

function DeptDash({accts,filtered,dept}){const d=di(dept),pl=plCalc(accts,filtered);return(<div><div style={Z.g3}>{[{l:"売上高",v:pl.revenue,c:C.cr},{l:"費用",v:pl.expense,c:C.dr},{l:"純利益",v:pl.income,c:pl.income>=0?C.cr:C.dr}].map(k=>(<div key={k.l} style={{...Z.card,borderTop:`3px solid ${d?.color}`,textAlign:"center"}}><div style={{fontSize:11,color:C.mt}}>{k.l}</div><div style={{fontSize:22,fontWeight:700,color:k.c,fontVariantNumeric:"tabular-nums"}}>¥{fm(k.v)}</div></div>))}</div><div style={Z.card}><div style={Z.ct}>直近の仕訳</div><table style={Z.tbl}><tbody>{filtered.slice(-6).reverse().map(j=><tr key={j.id}><td style={{...Z.td,fontSize:11}}>{j.dt}</td><td style={Z.td}>{j.ds}</td><td style={{...Z.tdr,fontSize:11}}>¥{fm(j.en.reduce((s,e)=>s+e.d,0))}</td></tr>)}</tbody></table></div></div>);}

function AcctMgr({accts,setAccts}){const [f,sf]=useState({code:"",name:"",type:"ASSET"}),[e,se]=useState("");const add=()=>{se("");if(!f.code||!f.name)return se("コードと名前を入力");if(accts.find(a=>a.code===f.code))return se("コード重複");setAccts([...accts,{...f}]);sf({code:"",name:"",type:"ASSET"})};return(<div><div style={Z.card}><div style={Z.ct}>勘定科目の新規登録</div><div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}><div><label style={{fontSize:11,color:C.mt}}>コード</label><input style={{...Z.inp,width:80}} value={f.code} onChange={x=>sf({...f,code:x.target.value})}/></div><div style={{flex:1,minWidth:140}}><label style={{fontSize:11,color:C.mt}}>科目名</label><input style={Z.inp} value={f.name} onChange={x=>sf({...f,name:x.target.value})}/></div><div><label style={{fontSize:11,color:C.mt}}>区分</label><select style={Z.sel} value={f.type} onChange={x=>sf({...f,type:x.target.value})}>{Object.entries(AT).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div><button style={Z.btn} onClick={add}>追加</button></div>{e&&<div style={{marginTop:8,fontSize:12,color:C.dn}}>{e}</div>}</div><div style={Z.card}><div style={Z.ct}>勘定科目一覧（{accts.length}件）</div><table style={Z.tbl}><thead><tr><th style={Z.th}>コード</th><th style={Z.th}>科目名</th><th style={Z.th}>区分</th></tr></thead><tbody>{[...accts].sort((a,b)=>a.code.localeCompare(b.code)).map((a,i)=><tr key={a.code} style={{background:i%2?C.rw:""}}><td style={{...Z.td,fontWeight:600}}>{a.code}</td><td style={Z.td}>{a.name}</td><td style={Z.td}><span style={Z.badge(tc2[a.type])}>{AT[a.type].label}</span></td></tr>)}</tbody></table></div></div>);}

function JournalView({accts,allJ,filtered,setJ,dept,audit}){const isAll=dept==="all";const empty={date:new Date().toISOString().slice(0,10),ds:"",entries:[{a:"",d:"",c:""},{a:"",d:"",c:""}]};const [f,sf]=useState(empty),[err,se]=useState("");const upd=(i,k,v)=>{const n=[...f.entries];n[i]={...n[i],[k]:v};if(k==="d"&&v)n[i].c="";if(k==="c"&&v)n[i].d="";sf({...f,entries:n})};const submit=()=>{se("");if(isAll)return se("部門を選択してください");if(!f.date||!f.ds)return se("日付と摘要を入力");const en=f.entries.map(e=>({a:e.a,d:Number(e.d)||0,c:Number(e.c)||0})).filter(e=>e.a&&(e.d||e.c));if(en.length<2)return se("最低2行");const tD=en.reduce((s,e)=>s+e.d,0),tC=en.reduce((s,e)=>s+e.c,0);if(tD!==tC)return se(`借方(${fm(tD)})≠貸方(${fm(tC)})`);const j={id:gid(),dp:dept,dt:f.date,ds:f.ds,en};setJ([...allJ,j]);audit("JOURNAL",`#${j.id} [${di(dept)?.name}] ${f.ds} ¥${fm(tD)}`);sf(empty)};const tD=f.entries.reduce((s,e)=>s+(Number(e.d)||0),0),tC=f.entries.reduce((s,e)=>s+(Number(e.c)||0),0),ok=tD===tC&&tD>0;
return(<div>{!isAll&&<div style={Z.card}><div style={Z.ct}>仕訳入力 — {di(dept)?.icon} {di(dept)?.name}</div><div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}><div><label style={{fontSize:11,color:C.mt}}>日付</label><input type="date" style={{...Z.inp,width:150}} value={f.date} onChange={x=>sf({...f,date:x.target.value})}/></div><div style={{flex:1,minWidth:200}}><label style={{fontSize:11,color:C.mt}}>摘要</label><input style={Z.inp} value={f.ds} onChange={x=>sf({...f,ds:x.target.value})}/></div></div><table style={Z.tbl}><thead><tr><th style={Z.th}>勘定科目</th><th style={Z.thr}>借方</th><th style={Z.thr}>貸方</th><th style={Z.th}/></tr></thead><tbody>{f.entries.map((e,i)=><tr key={i}><td style={Z.td}><select style={{...Z.sel,width:"100%"}} value={e.a} onChange={x=>upd(i,"a",x.target.value)}><option value="">選択...</option>{accts.map(a=><option key={a.code} value={a.code}>{a.code} {a.name}</option>)}</select></td><td style={Z.tdr}><input style={{...Z.inp,width:110,textAlign:"right"}} value={e.d} onChange={x=>upd(i,"d",x.target.value)} placeholder="0"/></td><td style={Z.tdr}><input style={{...Z.inp,width:110,textAlign:"right"}} value={e.c} onChange={x=>upd(i,"c",x.target.value)} placeholder="0"/></td><td style={Z.td}>{f.entries.length>2&&<button style={Z.bd2} onClick={()=>sf({...f,entries:f.entries.filter((_,j2)=>j2!==i)})}>×</button>}</td></tr>)}<tr style={Z.tot}><td style={Z.td}>合計</td><td style={{...Z.tdr,color:ok?C.cr:C.dr}}>{fm(tD)}</td><td style={{...Z.tdr,color:ok?C.cr:C.dr}}>{fm(tC)}</td><td/></tr></tbody></table><div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}><button style={Z.bs} onClick={()=>sf({...f,entries:[...f.entries,{a:"",d:"",c:""}]})}>＋行追加</button><button style={Z.btn} onClick={submit}>仕訳登録</button>{err&&<span style={{color:C.dn,fontSize:12}}>{err}</span>}{ok&&!err&&<span style={{color:C.cr,fontSize:12}}>✓</span>}</div></div>}
<div style={Z.card}><div style={Z.ct}>仕訳帳（{filtered.length}件）</div><table style={Z.tbl}><thead><tr><th style={Z.th}>No</th><th style={Z.th}>日付</th>{isAll&&<th style={Z.th}>部門</th>}<th style={Z.th}>摘要</th><th style={Z.th}>科目</th><th style={Z.thr}>借方</th><th style={Z.thr}>貸方</th></tr></thead><tbody>{filtered.map(j=>j.en.map((e,i)=><tr key={`${j.id}-${i}`} style={{background:i?C.rw:""}}>{i===0&&<td style={{...Z.td,fontWeight:600}} rowSpan={j.en.length}>{j.id}</td>}{i===0&&<td style={Z.td} rowSpan={j.en.length}>{j.dt}</td>}{i===0&&isAll&&<td style={Z.td} rowSpan={j.en.length}><span style={Z.badge(di(j.dp)?.color||C.mt)}>{di(j.dp)?.name}</span></td>}{i===0&&<td style={Z.td} rowSpan={j.en.length}>{j.ds}</td>}<td style={Z.td}>{accts.find(x=>x.code===e.a)?.name||e.a}</td><td style={{...Z.tdr,color:e.d?C.dr:"transparent"}}>{e.d?fm(e.d):""}</td><td style={{...Z.tdr,color:e.c?C.cr:"transparent"}}>{e.c?fm(e.c):""}</td></tr>))}</tbody></table></div></div>);}

function TrialBal({accts,filtered}){const bl=useMemo(()=>{const m={};accts.forEach(a=>(m[a.code]={...a,dr:0,cr:0}));filtered.forEach(j=>j.en.forEach(e=>{if(m[e.a]){m[e.a].dr+=e.d;m[e.a].cr+=e.c}}));return Object.values(m).filter(b=>b.dr||b.cr).sort((a,b)=>a.code.localeCompare(b.code))},[accts,filtered]);const tD=bl.reduce((s,b)=>s+b.dr,0),tC=bl.reduce((s,b)=>s+b.cr,0);const res=bl.map(b=>({...b,rD:b.dr>b.cr?b.dr-b.cr:0,rC:b.cr>b.dr?b.cr-b.dr:0}));return(<div style={Z.g2}><div style={Z.card}><div style={Z.ct}>合計試算表</div><table style={Z.tbl}><thead><tr><th style={Z.th}>科目</th><th style={Z.thr}>借方</th><th style={Z.thr}>貸方</th></tr></thead><tbody>{bl.map((b,i)=><tr key={b.code} style={{background:i%2?C.rw:""}}><td style={Z.td}>{b.name}</td><td style={Z.tdr}>{fm(b.dr)}</td><td style={Z.tdr}>{fm(b.cr)}</td></tr>)}<tr style={Z.tot}><td style={Z.td}>合計</td><td style={Z.tdr}>{fm(tD)}</td><td style={Z.tdr}>{fm(tC)}</td></tr></tbody></table>{tD===tC?<div style={{marginTop:6,fontSize:12,color:C.cr}}>✓ 貸借一致</div>:<div style={{marginTop:6,fontSize:12,color:C.dn}}>✗ 差額{fm(Math.abs(tD-tC))}</div>}</div><div style={Z.card}><div style={Z.ct}>残高試算表</div><table style={Z.tbl}><thead><tr><th style={Z.th}>科目</th><th style={Z.thr}>借方残高</th><th style={Z.thr}>貸方残高</th></tr></thead><tbody>{res.map((b,i)=><tr key={b.code} style={{background:i%2?C.rw:""}}><td style={Z.td}>{b.name}</td><td style={Z.tdr}>{b.rD?fm(b.rD):""}</td><td style={Z.tdr}>{b.rC?fm(b.rC):""}</td></tr>)}<tr style={Z.tot}><td style={Z.td}>合計</td><td style={Z.tdr}>{fm(res.reduce((s,b)=>s+b.rD,0))}</td><td style={Z.tdr}>{fm(res.reduce((s,b)=>s+b.rC,0))}</td></tr></tbody></table></div></div>);}

function PLBS({accts,filtered}){const bl=useMemo(()=>bals(accts,filtered),[accts,filtered]);const v=Object.values(bl);const byT=t=>v.filter(x=>x.type===t&&(x.dr||x.cr));const tR=byT("REVENUE").reduce((s,b)=>s+netBal(b),0),tE=byT("EXPENSE").reduce((s,b)=>s+netBal(b),0),inc=tR-tE;const tA=byT("ASSET").reduce((s,b)=>s+netBal(b),0),tL=byT("LIABILITY").reduce((s,b)=>s+netBal(b),0),tEq=byT("EQUITY").reduce((s,b)=>s+netBal(b),0)+inc;const Sec=({title,items,total})=>(<>{items.length>0&&<><tr><td colSpan={2} style={{...Z.td,fontWeight:600,paddingTop:8,color:C.ac}}>{title}</td></tr>{items.map(b=><tr key={b.code}><td style={{...Z.td,paddingLeft:20}}>{b.name}</td><td style={Z.tdr}>{fm(netBal(b))}</td></tr>)}<tr style={Z.tot}><td style={{...Z.td,paddingLeft:20}}>{title}合計</td><td style={Z.tdr}>{fm(total)}</td></tr></>}</>);return(<div style={Z.g2}><div style={Z.card}><div style={Z.ct}>損益計算書</div><table style={Z.tbl}><tbody><Sec title="収益" items={byT("REVENUE")} total={tR}/><Sec title="費用" items={byT("EXPENSE")} total={tE}/><tr style={{background:inc>=0?"#f0fff4":"#fff5f5"}}><td style={{...Z.td,fontWeight:700}}>{inc>=0?"当期純利益":"当期純損失"}</td><td style={{...Z.tdr,fontWeight:700,color:inc>=0?C.cr:C.dr}}>{fm(Math.abs(inc))}</td></tr></tbody></table></div><div style={Z.card}><div style={Z.ct}>貸借対照表</div><table style={Z.tbl}><tbody><Sec title="資産" items={byT("ASSET")} total={tA}/><Sec title="負債" items={byT("LIABILITY")} total={tL}/><Sec title="純資産" items={byT("EQUITY")} total={tEq}/><tr style={{background:C.abg}}><td style={{...Z.td,fontWeight:700}}>負債・純資産合計</td><td style={Z.tdr}>{fm(tL+tEq)}</td></tr></tbody></table></div></div>);}

function BEP({accts,filtered}){const [fc,sFc]=useState(["510","520","550"]),[vc,sVc]=useState(["500"]);const bl=useMemo(()=>bals(accts,filtered),[accts,filtered]);const ea=accts.filter(a=>a.type==="EXPENSE");const tR=accts.filter(a=>a.type==="REVENUE").reduce((s,a)=>s+Math.max(0,(bl[a.code]?.cr||0)-(bl[a.code]?.dr||0)),0);const fv=fc.reduce((s,c2)=>s+Math.max(0,(bl[c2]?.dr||0)-(bl[c2]?.cr||0)),0);const vv=vc.reduce((s,c2)=>s+Math.max(0,(bl[c2]?.dr||0)-(bl[c2]?.cr||0)),0);const mr=tR>0?(tR-vv)/tR:0,bep=mr>0?fv/mr:0,sf=tR>0?((tR-bep)/tR)*100:0;const tog=(l,set,c2)=>set(l.includes(c2)?l.filter(x=>x!==c2):[...l,c2]);const mX=Math.max(tR*1.3,bep*1.5,1),mY=Math.max(tR*1.3,fv+vv*1.3,1);const xf=v2=>50+(394*v2)/mX,yf=v2=>146-(130*v2)/mY;return(<div><div style={Z.card}><div style={Z.ct}>費用区分設定</div><div style={Z.g2}><div><div style={{fontSize:12,fontWeight:600,color:C.dr,marginBottom:4}}>固定費</div>{ea.map(a=><label key={a.code} style={{display:"block",fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={fc.includes(a.code)} onChange={()=>{tog(fc,sFc,a.code);if(vc.includes(a.code))tog(vc,sVc,a.code)}}/> {a.name}</label>)}</div><div><div style={{fontSize:12,fontWeight:600,color:C.cr,marginBottom:4}}>変動費</div>{ea.map(a=><label key={a.code} style={{display:"block",fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={vc.includes(a.code)} onChange={()=>{tog(vc,sVc,a.code);if(fc.includes(a.code))tog(fc,sFc,a.code)}}/> {a.name}</label>)}</div></div></div><div style={Z.g2}><div style={Z.card}><div style={Z.ct}>分析結果</div><table style={{...Z.tbl,fontSize:13}}><tbody><tr><td style={Z.td}>売上高</td><td style={Z.tdr}>{fm(tR)}</td></tr><tr><td style={Z.td}>固定費</td><td style={Z.tdr}>{fm(fv)}</td></tr><tr><td style={Z.td}>変動費</td><td style={Z.tdr}>{fm(vv)}</td></tr><tr><td style={Z.td}>限界利益率</td><td style={Z.tdr}>{(mr*100).toFixed(1)}%</td></tr><tr style={Z.tot}><td style={{...Z.td,color:C.ac}}>BEP売上高</td><td style={{...Z.tdr,color:C.ac,fontSize:16}}>¥{fm(Math.round(bep))}</td></tr><tr><td style={Z.td}>安全余裕率</td><td style={{...Z.tdr,color:sf>=0?C.cr:C.dr}}>{sf.toFixed(1)}%</td></tr></tbody></table></div><div style={Z.card}><div style={Z.ct}>CVP図</div><svg viewBox="0 0 460 170" style={{width:"100%"}}>{[0,.25,.5,.75,1].map(r=><line key={r} x1={50} x2={444} y1={yf(mY*r)} y2={yf(mY*r)} stroke={C.bd} strokeWidth={.5}/>)}<line x1={xf(0)} y1={yf(fv)} x2={xf(mX)} y2={yf(fv)} stroke={C.dr} strokeWidth={1} strokeDasharray="4 2"/><line x1={xf(0)} y1={yf(0)} x2={xf(mX)} y2={yf(mX)} stroke={C.cr} strokeWidth={1.5}/><line x1={xf(0)} y1={yf(fv)} x2={xf(mX)} y2={yf(fv+(vv/(tR||1))*mX)} stroke={C.dr} strokeWidth={1.5}/>{bep>0&&<><circle cx={xf(bep)} cy={yf(bep)} r={4} fill={C.ac}/><text x={xf(bep)} y={yf(bep)-8} textAnchor="middle" fontSize={9} fill={C.ac} fontWeight={600}>BEP ¥{fm(Math.round(bep))}</text></>}<line x1={50} y1={146} x2={444} y2={146} stroke={C.tx} strokeWidth={.5}/><line x1={50} y1={8} x2={50} y2={146} stroke={C.tx} strokeWidth={.5}/></svg></div></div></div>);}

function AuditView({logs}){return(<div style={Z.card}><div style={Z.ct}>監査ログ（{logs.length}件）</div><table style={Z.tbl}><thead><tr><th style={Z.th}>日時</th><th style={Z.th}>操作</th><th style={Z.th}>詳細</th></tr></thead><tbody>{[...logs].reverse().map((l,i)=><tr key={i} style={{background:i%2?C.rw:""}}><td style={{...Z.td,fontSize:11,whiteSpace:"nowrap",fontVariantNumeric:"tabular-nums"}}>{l.time}</td><td style={Z.td}><span style={Z.badge(C.cr)}>{l.type}</span></td><td style={Z.td}>{l.detail}</td></tr>)}</tbody></table></div>);}

const DEPT_TABS=["ダッシュボード","勘定科目","仕訳入力","試算表","決算書","損益分岐点","監査ログ"];
const ALL_TABS=["経営ダッシュボード","連結試算表","連結P/L","連結B/S","セグメント分析","仕訳一覧","監査ログ"];

export default function App(){
  const [auth,sAuth]=useState(false),[user,sUser]=useState(""),[dept,sDept]=useState("taiyaki"),[modal,sMod]=useState(false),[tab,sTab]=useState(0);
  const [accts,sAccts]=useState(ACCTS),[js,sJs]=useState(INIT_J);
  const [logs,sLogs]=useState([{time:ts(),type:"SYSTEM",detail:"システム初期化 — 連結決算対応版"}]);
  const audit=useCallback((t,d)=>sLogs(p=>[...p,{time:ts(),type:t,detail:d}]),[]);
  const isAll=dept==="all",filtered=useMemo(()=>qJ(js,dept),[js,dept]),tabs=isAll?ALL_TABS:DEPT_TABS;
  const doLogin=u=>{sAuth(true);sUser(u);sDept("taiyaki");sTab(0);audit("LOGIN",`${u} ログイン`)};
  const doLogout=()=>{audit("LOGOUT",`${user} ログアウト`);sAuth(false);sUser("");sTab(0)};
  const doSwitch=id=>{sDept(id);sMod(false);sTab(0);audit("SWITCH",`${id==="all"?"全社統合":di(id)?.name}に切替`)};
  const csv=()=>{const c2=toCsv(filtered,accts);const b=new Blob([c2],{type:"text/csv;charset=utf-8"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`仕訳_${isAll?"全社":di(dept)?.name}_${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(u);audit("EXPORT",`${filtered.length}件CSV出力`)};
  if(!auth) return <Login onLogin={doLogin}/>;
  return(<div style={Z.root}><div style={Z.wrap}>
    <Hdr user={user} dept={dept} onSwitch={()=>sMod(true)} onLogout={doLogout} stats={{a:accts.length,j:filtered.length}}/>
    <nav style={{...Z.tabs,marginTop:14}}>{tabs.map((t,i)=><button key={t} style={Z.tab(tab===i)} onClick={()=>sTab(i)}>{t}</button>)}<button style={{...Z.bs,marginLeft:"auto",fontSize:11,alignSelf:"center"}} onClick={csv}>📥 CSV</button></nav>
    {isAll?<>{tab===0&&<SegmentAnalysis accts={accts} journals={js}/>}{tab===1&&<ConsolidatedTB accts={accts} journals={js}/>}{tab===2&&<ConsolidatedPL accts={accts} journals={js}/>}{tab===3&&<ConsolidatedBS accts={accts} journals={js}/>}{tab===4&&<SegmentAnalysis accts={accts} journals={js}/>}{tab===5&&<JournalView accts={accts} allJ={js} filtered={filtered} setJ={sJs} dept={dept} audit={audit}/>}{tab===6&&<AuditView logs={logs}/>}</>
    :<>{tab===0&&<DeptDash accts={accts} filtered={filtered} dept={dept}/>}{tab===1&&<AcctMgr accts={accts} setAccts={sAccts}/>}{tab===2&&<JournalView accts={accts} allJ={js} filtered={filtered} setJ={sJs} dept={dept} audit={audit}/>}{tab===3&&<TrialBal accts={accts} filtered={filtered}/>}{tab===4&&<PLBS accts={accts} filtered={filtered}/>}{tab===5&&<BEP accts={accts} filtered={filtered}/>}{tab===6&&<AuditView logs={logs}/>}</>}
    {modal&&<DeptModal cur={dept} onPick={doSwitch} onClose={()=>sMod(false)}/>}
  </div></div>);
}
