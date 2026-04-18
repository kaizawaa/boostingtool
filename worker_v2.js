// ================================================================
//  SENJU BOOSTER - Cloudflare Worker v2.0
//  FULLY WORKING - All bugs fixed
//  - Session auth fixed (cookie name consistent)
//  - In-memory state using globalThis (persists per isolate)
//  - Order placement working with balance deduction
//  - Admin panel: add/deduct balance, approve deposits, set order status
//  - 53 services across 8 platforms
//  - Mobile responsive dark UI
// ================================================================

// ── CONFIG ─────────────────────────────────────────────────────
const CFG = {
  SITE_NAME:  "SENJU BOOSTER",
  ADMIN_USER: "admin",
  ADMIN_PASS: "Admin@1234",
  GCASH_NUM:  "09XX-XXX-XXXX",
  GCASH_NAME: "Senju Panel",
  COOKIE_NAME:"senjusess",
};

// ── GLOBAL STATE (persists within same isolate) ─────────────────
if (!globalThis._DB) {
  globalThis._DB = {
    users: {
      admin: {
        pass: CFG.ADMIN_PASS, email:"admin@senju.com",
        balance: 99999900, level: 0,
        created: Date.now(), fullname:"Admin"
      }
    },
    orders:  [],
    funds:   [],
    tickets: [],
    counters: { order:1000, fund:100, ticket:100 }
  };
}
const DB = globalThis._DB;

// ── SERVICES ────────────────────────────────────────────────────
const SERVICES = [
  // ─── FACEBOOK ───
  {id:1,  cat:"Facebook", icon:"📘", name:"Facebook Page Followers [Slow]",         min:100,  max:10000,  rate:30,  desc:"Permanent followers, slow drip delivery"},
  {id:2,  cat:"Facebook", icon:"📘", name:"Facebook Page Followers [Fast]",          min:100,  max:50000,  rate:55,  desc:"Fast delivery, stable quality"},
  {id:3,  cat:"Facebook", icon:"📘", name:"Facebook Page Likes [Normal]",            min:100,  max:10000,  rate:25,  desc:"Real-looking page likes"},
  {id:4,  cat:"Facebook", icon:"📘", name:"Facebook Post Like [Instant]",            min:50,   max:5000,   rate:20,  desc:"Instant post likes"},
  {id:5,  cat:"Facebook", icon:"📘", name:"Facebook Post Haha React [Instant]",      min:50,   max:5000,   rate:20,  desc:"Haha reactions"},
  {id:6,  cat:"Facebook", icon:"📘", name:"Facebook Post Sad React [Instant]",       min:50,   max:5000,   rate:20,  desc:"Sad reactions"},
  {id:7,  cat:"Facebook", icon:"📘", name:"Facebook Post Angry React [Instant]",     min:50,   max:5000,   rate:20,  desc:"Angry reactions"},
  {id:8,  cat:"Facebook", icon:"📘", name:"Facebook Post Wow React [Instant]",       min:50,   max:5000,   rate:20,  desc:"Wow reactions"},
  {id:9,  cat:"Facebook", icon:"📘", name:"Facebook Post Love React [Instant]",      min:50,   max:5000,   rate:20,  desc:"Love reactions"},
  {id:10, cat:"Facebook", icon:"📘", name:"Facebook Post Share [Normal]",            min:50,   max:2000,   rate:40,  desc:"Real-looking shares"},
  {id:11, cat:"Facebook", icon:"📘", name:"Facebook Video Views [Instant]",          min:500,  max:500000, rate:8,   desc:"Instant video views"},
  {id:12, cat:"Facebook", icon:"📘", name:"Facebook Profile Followers",              min:100,  max:5000,   rate:45,  desc:"Profile followers"},
  {id:13, cat:"Facebook", icon:"📘", name:"Facebook Comments [Random]",              min:10,   max:300,    rate:80,  desc:"Random comments"},
  // ─── INSTAGRAM ───
  {id:14, cat:"Instagram", icon:"📷", name:"Instagram Followers [Normal]",           min:100,  max:50000,  rate:45,  desc:"High quality followers"},
  {id:15, cat:"Instagram", icon:"📷", name:"Instagram Followers [Fast]",             min:100,  max:20000,  rate:75,  desc:"Fast delivery followers"},
  {id:16, cat:"Instagram", icon:"📷", name:"Instagram Likes [Instant]",              min:50,   max:10000,  rate:15,  desc:"Instant likes"},
  {id:17, cat:"Instagram", icon:"📷", name:"Instagram Video Views",                  min:500,  max:500000, rate:8,   desc:"Video/Reel views"},
  {id:18, cat:"Instagram", icon:"📷", name:"Instagram Story Views",                  min:100,  max:10000,  rate:12,  desc:"Story views"},
  {id:19, cat:"Instagram", icon:"📷", name:"Instagram Reel Views [Instant]",         min:500,  max:500000, rate:10,  desc:"Reel views"},
  {id:20, cat:"Instagram", icon:"📷", name:"Instagram Saves",                        min:50,   max:5000,   rate:25,  desc:"Post saves"},
  {id:21, cat:"Instagram", icon:"📷", name:"Instagram Comments [Random]",            min:10,   max:500,    rate:75,  desc:"Random comments"},
  // ─── TIKTOK ───
  {id:22, cat:"TikTok", icon:"🎵", name:"TikTok Followers [Normal]",                 min:100,  max:50000,  rate:40,  desc:"Real-looking followers"},
  {id:23, cat:"TikTok", icon:"🎵", name:"TikTok Followers [Fast]",                   min:100,  max:20000,  rate:70,  desc:"Fast delivery"},
  {id:24, cat:"TikTok", icon:"🎵", name:"TikTok Likes [Instant]",                    min:100,  max:100000, rate:12,  desc:"Instant likes"},
  {id:25, cat:"TikTok", icon:"🎵", name:"TikTok Video Views [Instant]",              min:1000, max:1000000,rate:5,   desc:"Instant video views"},
  {id:26, cat:"TikTok", icon:"🎵", name:"TikTok Live Views",                         min:100,  max:5000,   rate:60,  desc:"Live stream views"},
  {id:27, cat:"TikTok", icon:"🎵", name:"TikTok Shares",                             min:100,  max:10000,  rate:30,  desc:"Video shares"},
  {id:28, cat:"TikTok", icon:"🎵", name:"TikTok Comments [Random]",                  min:10,   max:500,    rate:70,  desc:"Random comments"},
  {id:29, cat:"TikTok", icon:"🎵", name:"TikTok Profile Views",                      min:1000, max:500000, rate:4,   desc:"Profile views"},
  // ─── YOUTUBE ───
  {id:30, cat:"YouTube", icon:"▶️", name:"YouTube Views [High Retention]",           min:500,  max:100000, rate:18,  desc:"High retention views"},
  {id:31, cat:"YouTube", icon:"▶️", name:"YouTube Subscribers",                      min:50,   max:10000,  rate:85,  desc:"Real subscribers"},
  {id:32, cat:"YouTube", icon:"▶️", name:"YouTube Likes",                            min:50,   max:10000,  rate:22,  desc:"Video likes"},
  {id:33, cat:"YouTube", icon:"▶️", name:"YouTube Comments",                         min:10,   max:200,    rate:95,  desc:"Custom comments"},
  {id:34, cat:"YouTube", icon:"▶️", name:"YouTube Watch Hours",                      min:100,  max:5000,   rate:130, desc:"Watch time hours"},
  // ─── TELEGRAM ───
  {id:35, cat:"Telegram", icon:"✈️", name:"Telegram Channel Members",                min:100,  max:100000, rate:35,  desc:"Real members"},
  {id:36, cat:"Telegram", icon:"✈️", name:"Telegram Post Views",                     min:500,  max:500000, rate:8,   desc:"Post views"},
  {id:37, cat:"Telegram", icon:"✈️", name:"Telegram Story Reactions [Positive]",     min:50,   max:5000,   rate:22,  desc:"Positive reactions"},
  {id:38, cat:"Telegram", icon:"✈️", name:"Telegram Story Reactions [Negative]",     min:50,   max:5000,   rate:22,  desc:"Negative reactions"},
  {id:39, cat:"Telegram", icon:"✈️", name:"Telegram Story Reactions [Max]",          min:50,   max:5000,   rate:28,  desc:"Max reactions"},
  {id:40, cat:"Telegram", icon:"✈️", name:"Telegram Group Members",                  min:100,  max:50000,  rate:38,  desc:"Group members"},
  // ─── TWITTER/X ───
  {id:41, cat:"Twitter", icon:"🐦", name:"Twitter/X Followers",                      min:100,  max:20000,  rate:55,  desc:"Real followers"},
  {id:42, cat:"Twitter", icon:"🐦", name:"Twitter/X Likes",                          min:50,   max:10000,  rate:18,  desc:"Tweet likes"},
  {id:43, cat:"Twitter", icon:"🐦", name:"Twitter/X Retweets",                       min:50,   max:5000,   rate:30,  desc:"Retweets"},
  {id:44, cat:"Twitter", icon:"🐦", name:"Twitter/X Impressions",                    min:1000, max:500000, rate:10,  desc:"Tweet impressions"},
  // ─── SPOTIFY ───
  {id:45, cat:"Spotify", icon:"🎧", name:"Spotify Plays [Normal]",                   min:1000, max:500000, rate:7,   desc:"Track plays"},
  {id:46, cat:"Spotify", icon:"🎧", name:"Spotify Followers",                        min:50,   max:5000,   rate:50,  desc:"Profile followers"},
  {id:47, cat:"Spotify", icon:"🎧", name:"Spotify Monthly Listeners",                min:100,  max:10000,  rate:65,  desc:"Monthly listeners"},
  // ─── SHOPEE ───
  {id:48, cat:"Shopee", icon:"🛍️", name:"Shopee Shop Followers",                     min:50,   max:2000,   rate:55,  desc:"Shop followers"},
  {id:49, cat:"Shopee", icon:"🛍️", name:"Shopee Product Likes",                      min:50,   max:2000,   rate:40,  desc:"Product likes"},
  {id:50, cat:"Shopee", icon:"🛍️", name:"Shopee Product Reviews",                    min:5,    max:100,    rate:200, desc:"Product reviews"},
  // ─── GCASH/LOADS ───
  {id:51, cat:"GCash", icon:"💚", name:"GCash (TM) Regular 20",                       min:1,    max:500,    rate:195, desc:"TM load ₱20"},
  {id:52, cat:"GCash", icon:"💚", name:"GCash (TM) Regular 50",                       min:1,    max:500,    rate:460, desc:"TM load ₱50"},
  {id:53, cat:"GCash", icon:"💚", name:"GCash (TM) Regular 100",                      min:1,    max:500,    rate:920, desc:"TM load ₱100"},
  {id:54, cat:"GCash", icon:"💚", name:"GCash (Globe) Regular 20",                    min:1,    max:500,    rate:190, desc:"Globe load ₱20"},
  {id:55, cat:"GCash", icon:"💚", name:"GCash (Globe) Regular 50",                    min:1,    max:500,    rate:450, desc:"Globe load ₱50"},
  {id:56, cat:"GCash", icon:"💚", name:"GCash GCO9",                                  min:1,    max:500,    rate:105, desc:"GCO9 promo"},
];

// ── HELPERS ─────────────────────────────────────────────────────
const html  = (content, status=200, extra={}) =>
  new Response(content, { status, headers: {"Content-Type":"text/html;charset=UTF-8",...extra}});

const redir = (loc, extra={}) =>
  new Response(null, { status: 302, headers: { Location: loc, ...extra }});

function getCookie(req, name) {
  const hdr = req.headers.get("cookie") || "";
  for (const part of hdr.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v || "");
  }
  return null;
}

function makeCookie(name, val, days=7) {
  const exp = new Date(Date.now() + days*864e5).toUTCString();
  return `${name}=${encodeURIComponent(val)}; Expires=${exp}; Path=/; HttpOnly; SameSite=Lax`;
}

function clearCookie(name) {
  return `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly`;
}

function getUser(req) {
  const sess = getCookie(req, CFG.COOKIE_NAME);
  if (!sess) return null;
  // session format: "username:timestamp"
  const [uname] = sess.split(":");
  const u = DB.users[uname];
  if (!u) return null;
  return { ...u, username: uname };
}

function nowPH() {
  return new Date().toLocaleString("en-PH", {
    timeZone:"Asia/Manila", year:"numeric", month:"short",
    day:"2-digit", hour:"2-digit", minute:"2-digit"
  });
}

function fmtPHP(centavos) {
  return "₱" + (centavos / 100).toLocaleString("en-PH", {minimumFractionDigits:2, maximumFractionDigits:2});
}

// Rate is per 1000 units, in centavos
function calcCharge(qty, rate) {
  return Math.ceil((qty * rate) / 1000) * 10; // in centavos, rate is PHP per 1000 * 100
}

// ── CSS + SHELL ──────────────────────────────────────────────────
const CSS = `
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#07090f;--s1:#0d111b;--s2:#121929;--s3:#17213a;
  --acc:#00e5ff;--acc2:#7c3aed;--grn:#00ff88;--red:#ff3355;
  --ylw:#ffd600;--txt:#dce9ff;--mut:#4a5f8a;
  --bdr:rgba(0,229,255,0.1);--card:rgba(13,17,27,0.95);
  --r:14px;--sw:270px;
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:
  radial-gradient(ellipse 70% 40% at 15% 5%,rgba(124,58,237,.07) 0%,transparent 55%),
  radial-gradient(ellipse 50% 35% at 85% 90%,rgba(0,229,255,.05) 0%,transparent 55%);
  pointer-events:none;z-index:0}
a{color:inherit;text-decoration:none}
input,select,textarea,button{font-family:inherit}

/* ── SIDEBAR ── */
#sb{position:fixed;left:0;top:0;bottom:0;width:var(--sw);background:var(--s1);
  border-right:1px solid var(--bdr);padding:0;display:flex;flex-direction:column;
  z-index:300;transition:transform .28s cubic-bezier(.4,0,.2,1);overflow:hidden}
.sb-top{padding:20px 18px 16px;border-bottom:1px solid var(--bdr)}
.sb-brand{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.sb-logo{width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,var(--acc2),var(--acc));
  display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.sb-title{font-family:'Syne',sans-serif;font-weight:800;font-size:14px;letter-spacing:.06em}
.sb-ucard{background:var(--s2);border:1px solid var(--bdr);border-radius:12px;
  padding:12px;display:flex;align-items:center;gap:10px}
.sb-av{width:36px;height:36px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--acc2),var(--acc));
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;font-weight:800;font-size:15px}
.sb-uname{font-size:13px;font-weight:600;line-height:1.2}
.sb-ubal{font-size:12px;color:var(--acc);font-weight:700;margin-top:2px}
.sb-nav{flex:1;overflow-y:auto;padding:12px 10px}
.sb-nav::-webkit-scrollbar{width:4px}
.sb-nav::-webkit-scrollbar-thumb{background:var(--s3);border-radius:2px}
.ni{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;
  color:var(--mut);font-size:13.5px;font-weight:500;transition:all .18s;margin-bottom:2px;white-space:nowrap}
.ni:hover{background:var(--s2);color:var(--txt)}
.ni.on{background:linear-gradient(90deg,rgba(0,229,255,.12),rgba(124,58,237,.08));
  color:var(--acc);border-left:3px solid var(--acc);padding-left:9px}
.ni-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.sb-bot{padding:12px 10px;border-top:1px solid var(--bdr)}
.sb-logout{display:flex;align-items:center;justify-content:center;gap:8px;
  padding:11px;border-radius:10px;background:rgba(255,51,85,.08);
  color:var(--red);font-size:13px;font-weight:700;border:1px solid rgba(255,51,85,.15);
  transition:all .18s}
.sb-logout:hover{background:rgba(255,51,85,.16)}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:200;backdrop-filter:blur(2px)}

/* ── TOPBAR (mobile) ── */
#tb{display:none;position:fixed;top:0;left:0;right:0;height:54px;
  background:rgba(7,9,15,.96);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--bdr);z-index:100;
  align-items:center;padding:0 14px;gap:10px}
.tb-menu{background:none;border:none;color:var(--txt);font-size:24px;
  cursor:pointer;padding:4px;display:flex;align-items:center}
.tb-t{flex:1;font-family:'Syne',sans-serif;font-weight:800;font-size:14px;letter-spacing:.05em}
.tb-bal{font-size:12px;font-weight:700;color:var(--acc);
  background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.15);
  padding:4px 10px;border-radius:20px}

/* ── PAGE ── */
.pg{margin-left:var(--sw);padding:28px 28px 48px;min-height:100vh;position:relative;z-index:1}
.pg-h{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;line-height:1.2;margin-bottom:4px}
.pg-s{color:var(--mut);font-size:13.5px;margin-bottom:24px}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--bdr);border-radius:var(--r);
  padding:22px;backdrop-filter:blur(10px)}
.card+.card{margin-top:16px}
.ch{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;
  margin-bottom:18px;display:flex;align-items:center;gap:8px}

/* ── STATS ── */
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:20px}
.st{background:var(--s2);border:1px solid var(--bdr);border-radius:12px;
  padding:16px 14px;text-align:center}
.sv{font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:var(--acc);line-height:1}
.sl{font-size:11px;color:var(--mut);margin-top:5px;text-transform:uppercase;letter-spacing:.06em;font-weight:600}

/* ── FORMS ── */
.fg{margin-bottom:14px}
label{display:block;font-size:12.5px;color:var(--mut);margin-bottom:5px;font-weight:600;letter-spacing:.02em}
input[type=text],input[type=number],input[type=email],input[type=password],select,textarea{
  width:100%;padding:11px 13px;background:var(--s2);border:1px solid var(--bdr);
  border-radius:10px;color:var(--txt);font-size:13.5px;outline:none;
  transition:border-color .18s,box-shadow .18s}
input:focus,select:focus,textarea:focus{
  border-color:var(--acc);box-shadow:0 0 0 3px rgba(0,229,255,.08)}
select option{background:var(--s1);color:var(--txt)}
textarea{resize:vertical;min-height:90px}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 20px;border-radius:10px;font-weight:700;font-size:13.5px;
  cursor:pointer;border:none;transition:all .18s;white-space:nowrap}
.btn-p{background:linear-gradient(135deg,var(--acc2),var(--acc));color:#fff}
.btn-p:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,229,255,.2)}
.btn-g{background:linear-gradient(135deg,#00b870,var(--grn));color:#001a0a;font-weight:800}
.btn-g:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,255,136,.2)}
.btn-r{background:rgba(255,51,85,.12);color:var(--red);border:1px solid rgba(255,51,85,.25)}
.btn-r:hover{background:rgba(255,51,85,.22)}
.btn-o{background:var(--s2);color:var(--txt);border:1px solid var(--bdr)}
.btn-o:hover{border-color:var(--acc);color:var(--acc)}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:8px}
.btn-block{display:flex;width:100%;margin-top:4px}

/* ── BADGES ── */
.bx{display:inline-flex;align-items:center;padding:3px 9px;border-radius:99px;
  font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
.bx-pend{background:rgba(255,214,0,.1);color:var(--ylw);border:1px solid rgba(255,214,0,.2)}
.bx-proc{background:rgba(0,229,255,.1);color:var(--acc);border:1px solid rgba(0,229,255,.2)}
.bx-prog{background:rgba(124,58,237,.15);color:#c4b5fd;border:1px solid rgba(124,58,237,.25)}
.bx-comp{background:rgba(0,255,136,.08);color:var(--grn);border:1px solid rgba(0,255,136,.18)}
.bx-canc{background:rgba(255,51,85,.1);color:var(--red);border:1px solid rgba(255,51,85,.2)}
.bx-part{background:rgba(255,165,0,.1);color:orange;border:1px solid rgba(255,165,0,.2)}
.bx-open{background:rgba(0,229,255,.1);color:var(--acc);border:1px solid rgba(0,229,255,.2)}
.bx-clos{background:rgba(0,255,136,.08);color:var(--grn);border:1px solid rgba(0,255,136,.18)}
.bx-appr{background:rgba(0,255,136,.08);color:var(--grn);border:1px solid rgba(0,255,136,.18)}
.bx-reje{background:rgba(255,51,85,.1);color:var(--red);border:1px solid rgba(255,51,85,.2)}

/* ── TABLE ── */
.tw{overflow-x:auto;border-radius:10px}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:550px}
th{padding:10px 12px;text-align:left;background:var(--s2);color:var(--mut);
  font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
th:first-child{border-radius:8px 0 0 8px}
th:last-child{border-radius:0 8px 8px 0}
td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.03);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.015)}
.td-trunc{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ── ALERTS ── */
.al{padding:12px 14px;border-radius:10px;font-size:13.5px;margin-bottom:14px;border-left:3px solid;line-height:1.5}
.al-w{background:rgba(255,214,0,.07);border-color:var(--ylw);color:#ffe57a}
.al-i{background:rgba(0,229,255,.06);border-color:var(--acc);color:#7df0ff}
.al-s{background:rgba(0,255,136,.06);border-color:var(--grn);color:#80ffbb}
.al-e{background:rgba(255,51,85,.07);border-color:var(--red);color:#ff9ab2}

/* ── GRID ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}

/* ── SERVICE LIST ── */
.svc-list{display:flex;flex-direction:column;gap:0}
.svc-item{display:flex;align-items:center;gap:12px;padding:12px 14px;
  border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer;transition:all .15s}
.svc-item:last-child{border-bottom:none}
.svc-item:hover{background:rgba(0,229,255,.04)}
.svc-item.sel{background:rgba(0,229,255,.07);border-left:3px solid var(--acc)}
.svc-ico{font-size:20px;width:28px;text-align:center;flex-shrink:0}
.svc-info{flex:1;min-width:0}
.svc-nm{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.svc-mt{font-size:11.5px;color:var(--mut);margin-top:2px}
.svc-rate{font-size:13px;font-weight:800;color:var(--acc);flex-shrink:0}

/* ── CAT TABS ── */
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.tab{padding:7px 14px;border-radius:8px;background:var(--s2);border:1px solid var(--bdr);
  font-size:12.5px;font-weight:700;cursor:pointer;color:var(--mut);transition:all .15s}
.tab:hover,.tab.on{background:rgba(0,229,255,.1);border-color:var(--acc);color:var(--acc)}

/* ── CHARGE BOX ── */
.chbox{padding:13px;background:var(--s2);border:1px solid var(--acc);
  border-radius:10px;color:var(--acc);font-weight:800;font-size:18px;
  font-family:'Syne',sans-serif;text-align:center;letter-spacing:.02em}

/* ── AUTH ── */
.auth{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.auth-box{width:100%;max-width:400px}
.auth-logo{text-align:center;margin-bottom:28px}
.auth-logo h1{font-family:'Syne',sans-serif;font-weight:800;font-size:30px;
  background:linear-gradient(90deg,var(--acc),var(--acc2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:.03em}
.auth-logo p{color:var(--mut);font-size:13.5px;margin-top:6px}

/* ── MOBILE ── */
@media(max-width:820px){
  #sb{transform:translateX(-100%)}
  #sb.open{transform:translateX(0)}
  .overlay{display:block;opacity:0;pointer-events:none;transition:opacity .28s}
  .overlay.open{opacity:1;pointer-events:auto}
  .pg{margin-left:0;padding:14px 14px 48px;padding-top:70px}
  #tb{display:flex}
  .g2{grid-template-columns:1fr}
  .g3{grid-template-columns:1fr 1fr}
  .sg{grid-template-columns:repeat(2,1fr)}
  .tabs{gap:4px}
  .tab{padding:6px 10px;font-size:11.5px}
}
@media(max-width:480px){.g3{grid-template-columns:1fr}.sg{grid-template-columns:repeat(2,1fr)}}
</style>`;

function shell(title, body, user=null, page="") {
  const cats = [...new Set(SERVICES.map(s => s.cat))];

  const nav = user ? `
<div class="overlay" id="ov" onclick="closeSB()"></div>
<nav id="sb">
  <div class="sb-top">
    <div class="sb-brand">
      <div class="sb-logo">🚀</div>
      <span class="sb-title">${CFG.SITE_NAME}</span>
    </div>
    <div class="sb-ucard">
      <div class="sb-av">${user.username[0].toUpperCase()}</div>
      <div>
        <div class="sb-uname">${user.username}</div>
        <div class="sb-ubal" id="live-bal">${fmtPHP(user.balance)}</div>
      </div>
    </div>
  </div>
  <div class="sb-nav">
    <a href="/dashboard"  class="ni ${page==="dashboard" ?"on":""}"><span class="ni-icon">📊</span>Dashboard</a>
    <a href="/order"      class="ni ${page==="order"     ?"on":""}"><span class="ni-icon">➕</span>New Order</a>
    <a href="/orders"     class="ni ${page==="orders"    ?"on":""}"><span class="ni-icon">📋</span>My Orders</a>
    <a href="/services"   class="ni ${page==="services"  ?"on":""}"><span class="ni-icon">⚡</span>Services</a>
    <a href="/bulk"       class="ni ${page==="bulk"      ?"on":""}"><span class="ni-icon">📦</span>Bulk Order</a>
    <a href="/addfunds"   class="ni ${page==="addfunds"  ?"on":""}"><span class="ni-icon">💳</span>Add Funds</a>
    <a href="/tickets"    class="ni ${page==="tickets"   ?"on":""}"><span class="ni-icon">🎫</span>Tickets</a>
    <a href="/linkfixer"  class="ni ${page==="linkfixer" ?"on":""}"><span class="ni-icon">🔗</span>Link Fixer</a>
    ${user.level===0?`<a href="/admin" class="ni ${page==="admin"?"on":""}"><span class="ni-icon">⚙️</span>Admin Panel</a>`:""}
  </div>
  <div class="sb-bot">
    <a href="/logout" class="sb-logout">🚪 Logout</a>
  </div>
</nav>
<header id="tb">
  <button class="tb-menu" onclick="openSB()">☰</button>
  <span class="tb-t">${CFG.SITE_NAME}</span>
  <span class="tb-bal">${fmtPHP(user.balance)}</span>
</header>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${title} — ${CFG.SITE_NAME}</title>
${CSS}
</head>
<body>
${nav}
<div class="${user?"pg":""}">
${body}
</div>
<script>
function openSB(){
  document.getElementById('sb')?.classList.add('open');
  document.getElementById('ov')?.classList.add('open');
}
function closeSB(){
  document.getElementById('sb')?.classList.remove('open');
  document.getElementById('ov')?.classList.remove('open');
}

// ── ORDER PAGE LOGIC ──
var _services = ${JSON.stringify(SERVICES)};
var _selSvc = null;

function filterTab(cat, el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.svc-item').forEach(r=>{
    r.style.display = (cat==='all' || r.dataset.cat===cat) ? '' : 'none';
  });
}

function selectSvc(id){
  _selSvc = _services.find(s=>s.id===id);
  if(!_selSvc) return;
  document.querySelectorAll('.svc-item').forEach(r=>r.classList.remove('sel'));
  const el = document.querySelector('.svc-item[data-id="'+id+'"]');
  if(el){ el.classList.add('sel'); el.scrollIntoView({block:'nearest'}); }
  const inp = document.getElementById('s_id');
  const qel = document.getElementById('s_qty');
  const nel = document.getElementById('s_name');
  const del = document.getElementById('s_desc');
  const mel = document.getElementById('s_minmax');
  if(inp) inp.value = id;
  if(qel){ qel.min=_selSvc.min; qel.max=_selSvc.max; qel.placeholder='Min '+_selSvc.min+' / Max '+_selSvc.max.toLocaleString(); qel.value=_selSvc.min; }
  if(nel) nel.textContent = _selSvc.name;
  if(del) del.textContent = _selSvc.desc;
  if(mel) mel.textContent = 'Min: '+_selSvc.min.toLocaleString()+' | Max: '+_selSvc.max.toLocaleString();
  calcCharge();
  document.getElementById('order-form')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function calcCharge(){
  if(!_selSvc) return;
  const qty = parseInt(document.getElementById('s_qty')?.value)||0;
  const charge = Math.ceil((qty * _selSvc.rate) / 1000) * 10;
  const el = document.getElementById('charge-val');
  if(el) el.textContent = '₱' + (charge/100).toLocaleString('en-PH',{minimumFractionDigits:2});
}

// Admin tab switching
function adminTab(t){
  document.querySelectorAll('.atab').forEach(b=>{
    b.classList.toggle('on', b.dataset.t===t);
  });
  document.querySelectorAll('.apanel').forEach(p=>{
    p.style.display = p.dataset.p===t ? '' : 'none';
  });
}

// Services page filter
function svcFilter(cat, el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('#svctbl tr[data-cat]').forEach(r=>{
    r.style.display = (cat==='all'||r.dataset.cat===cat)?'':'none';
  });
}
</script>
</body>
</html>`;
}

function badge(status) {
  const map = {
    "Pending":"bx-pend","Processing":"bx-proc","In progress":"bx-prog",
    "Completed":"bx-comp","Cancelled":"bx-canc","Partial":"bx-part",
    "Open":"bx-open","Closed":"bx-clos","Approved":"bx-appr","Rejected":"bx-reje"
  };
  return `<span class="bx ${map[status]||'bx-pend'}">${status}</span>`;
}

// ── PAGE: LOGIN ──────────────────────────────────────────────────
function P_login(err="") {
  return shell("Login", `
<div class="auth">
<div class="auth-box">
  <div class="auth-logo">
    <h1>🚀 ${CFG.SITE_NAME}</h1>
    <p>Social Media Boosting Panel</p>
  </div>
  ${err?`<div class="al al-e">${err}</div>`:""}
  <div class="card">
    <form method="POST" action="/login" autocomplete="off">
      <div class="fg"><label>Username</label>
        <input type="text" name="u" placeholder="Enter username" required autofocus></div>
      <div class="fg"><label>Password</label>
        <input type="password" name="p" placeholder="Enter password" required></div>
      <button type="submit" class="btn btn-p btn-block" style="margin-top:8px">🔑 Login</button>
    </form>
    <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--mut)">
      No account? <a href="/register" style="color:var(--acc);font-weight:700">Register here</a></p>
  </div>
</div>
</div>`);
}

// ── PAGE: REGISTER ───────────────────────────────────────────────
function P_register(err="") {
  return shell("Register", `
<div class="auth">
<div class="auth-box">
  <div class="auth-logo">
    <h1>🚀 ${CFG.SITE_NAME}</h1>
    <p>Create your free account</p>
  </div>
  ${err?`<div class="al al-e">${err}</div>`:""}
  <div class="card">
    <form method="POST" action="/register">
      <div class="fg"><label>Username</label>
        <input type="text" name="u" placeholder="3-20 characters" required></div>
      <div class="fg"><label>Email</label>
        <input type="email" name="e" placeholder="your@email.com" required></div>
      <div class="fg"><label>Password</label>
        <input type="password" name="p" placeholder="Minimum 6 characters" required></div>
      <button type="submit" class="btn btn-p btn-block" style="margin-top:8px">🚀 Create Account</button>
    </form>
    <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--mut)">
      Have an account? <a href="/login" style="color:var(--acc);font-weight:700">Login</a></p>
  </div>
</div>
</div>`);
}

// ── PAGE: DASHBOARD ──────────────────────────────────────────────
function P_dashboard(user) {
  const uo = DB.orders.filter(o=>o.user===user.username);
  const pend = uo.filter(o=>o.status==="Pending").length;
  const prog = uo.filter(o=>o.status==="In progress").length;
  const done = uo.filter(o=>o.status==="Completed").length;
  const canc = uo.filter(o=>o.status==="Cancelled").length;
  const spent = uo.reduce((a,o)=>a+o.charge,0);

  const cats = [...new Set(SERVICES.map(s=>s.cat))];
  const platIcons = {Facebook:"📘",Instagram:"📷",TikTok:"🎵",YouTube:"▶️",Telegram:"✈️",Twitter:"🐦",Spotify:"🎧",Shopee:"🛍️",GCash:"💚"};

  const platBtns = cats.map(c=>`
  <a href="/order?cat=${encodeURIComponent(c)}" style="text-decoration:none">
    <div class="st" style="cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor='var(--acc)'" onmouseout="this.style.borderColor='var(--bdr)'">
      <div style="font-size:28px;margin-bottom:6px">${platIcons[c]||"⚡"}</div>
      <div style="font-size:11.5px;color:var(--mut);font-weight:700">${c}</div>
    </div>
  </a>`).join("");

  const recentRows = uo.slice(-6).reverse().map(o=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${o.id}</td>
    <td class="td-trunc">${o.service}</td>
    <td style="color:var(--acc);font-weight:700">${fmtPHP(o.charge)}</td>
    <td>${badge(o.status)}</td>
  </tr>`).join("") || `<tr><td colspan="4" style="text-align:center;color:var(--mut);padding:24px">No orders yet</td></tr>`;

  return shell("Dashboard", `
<div class="pg-h">👋 Dashboard</div>
<div class="pg-s">Welcome back, <strong style="color:var(--acc)">${user.username}</strong>!</div>

<div class="al al-w">⚠️ <strong>TRY LOW TARGET FIRST</strong> before bulk ordering — Test with small qty first!</div>
<div class="al al-i">📢 Make sure your profile/page is <strong>PUBLIC</strong> before placing an order.</div>

<div class="sg">
  <div class="st"><div class="sv">${fmtPHP(user.balance)}</div><div class="sl">Balance</div></div>
  <div class="st"><div class="sv">${uo.length}</div><div class="sl">Total Orders</div></div>
  <div class="st"><div class="sv" style="color:var(--ylw)">${pend}</div><div class="sl">Pending</div></div>
  <div class="st"><div class="sv" style="color:#c4b5fd">${prog}</div><div class="sl">In Progress</div></div>
  <div class="st"><div class="sv" style="color:var(--grn)">${done}</div><div class="sl">Completed</div></div>
  <div class="st"><div class="sv" style="color:var(--red)">${canc}</div><div class="sl">Cancelled</div></div>
</div>

<div class="card" style="margin-bottom:16px">
  <div class="ch">⚡ Quick Order by Platform</div>
  <div class="sg" style="grid-template-columns:repeat(auto-fill,minmax(100px,1fr))">${platBtns}</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
    <a href="/order"    class="btn btn-g">➕ New Order</a>
    <a href="/addfunds" class="btn btn-p">💳 Add Funds</a>
    <a href="/orders"   class="btn btn-o">📋 All Orders</a>
  </div>
</div>

<div class="card">
  <div class="ch">📋 Recent Orders</div>
  <div class="tw"><table>
    <thead><tr><th>#ID</th><th>Service</th><th>Charge</th><th>Status</th></tr></thead>
    <tbody>${recentRows}</tbody>
  </table></div>
  ${uo.length>6?`<div style="text-align:center;margin-top:14px"><a href="/orders" class="btn btn-o btn-sm">View All Orders</a></div>`:""}
</div>`, user, "dashboard");
}

// ── PAGE: NEW ORDER ──────────────────────────────────────────────
function P_order(user, preCat="", msg="", msgType="s") {
  const cats = [...new Set(SERVICES.map(s=>s.cat))];
  const svcItems = SERVICES.map(s=>`
  <div class="svc-item" data-id="${s.id}" data-cat="${s.cat}" onclick="selectSvc(${s.id})">
    <span class="svc-ico">${s.icon}</span>
    <div class="svc-info">
      <div class="svc-nm">${s.name}</div>
      <div class="svc-mt">Min: ${s.min.toLocaleString()} | Max: ${s.max.toLocaleString()}</div>
    </div>
    <span class="svc-rate">₱${(s.rate/10).toFixed(1)}/K</span>
  </div>`).join("");

  const catBtns = `<button class="tab on" onclick="filterTab('all',this)">All</button>` +
    cats.map(c=>`<button class="tab" onclick="filterTab('${c}',this)">${c}</button>`).join("");

  return shell("New Order", `
<div class="pg-h">➕ New Order</div>
<div class="pg-s">Select a service and fill in the details below</div>
${msg?`<div class="al al-${msgType}">${msg}</div>`:""}
<div class="al al-w">⚠️ Profile/page must be <strong>PUBLIC</strong>. Test with small qty first!</div>

<div class="g2" style="align-items:start;gap:18px">

  <div id="order-form" class="card">
    <div class="ch">📝 Order Details</div>
    <form method="POST" action="/order">
      <input type="hidden" name="sid" id="s_id" value="">

      <div class="fg">
        <label>Selected Service</label>
        <div id="s_name" style="padding:11px 13px;background:var(--s2);border:1px solid var(--bdr);border-radius:10px;font-size:13.5px;color:var(--mut);min-height:42px">
          ← Select a service from the list
        </div>
        <div id="s_desc" style="font-size:12px;color:var(--mut);margin-top:4px"></div>
      </div>

      <div class="fg">
        <label>Link / URL / Username</label>
        <input type="text" name="link" placeholder="https://tiktok.com/@username" required>
      </div>

      <div class="fg">
        <label>Quantity <span id="s_minmax" style="color:var(--acc);font-size:11px;margin-left:6px"></span></label>
        <input type="number" name="qty" id="s_qty" placeholder="Select a service first"
          oninput="calcCharge()" min="1" required>
      </div>

      <div class="fg">
        <label>Charge</label>
        <div class="chbox" id="charge-val">₱0.00</div>
      </div>

      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:14px;padding:10px 12px;background:var(--s2);border-radius:10px;border:1px solid var(--bdr)">
        <span style="color:var(--mut)">Your Balance</span>
        <span style="color:var(--grn);font-weight:800">${fmtPHP(user.balance)}</span>
      </div>

      <button type="submit" class="btn btn-g btn-block">🚀 Place Order</button>
    </form>
  </div>

  <div class="card" style="max-height:75vh;overflow:hidden;display:flex;flex-direction:column">
    <div class="ch">⚡ Browse Services</div>
    <div class="tabs">${catBtns}</div>
    <div style="overflow-y:auto;flex:1;border-radius:10px;border:1px solid var(--bdr)">
      <div class="svc-list">${svcItems}</div>
    </div>
  </div>

</div>
<script>
// Pre-select category from URL
(function(){
  const cat = new URLSearchParams(location.search).get('cat');
  if(cat){
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t=>{
      if(t.textContent.trim()===cat){
        t.classList.add('on');
        t.classList.remove('on');
      }
    });
    filterTab(cat, document.querySelector('.tab'));
    // actually activate the right tab
    tabs.forEach(t=>{
      if(t.textContent.trim()===cat){ t.click(); }
    });
  }
})();
</script>`, user, "order");
}

// ── PAGE: MY ORDERS ──────────────────────────────────────────────
function P_orders(user) {
  const ords = DB.orders.filter(o=>o.user===user.username).reverse();
  const rows = ords.map(o=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${o.id}</td>
    <td class="td-trunc" style="max-width:180px">${o.service}</td>
    <td><a href="${o.link}" target="_blank" style="color:var(--acc);font-size:12px" class="td-trunc" title="${o.link}">${o.link.replace(/https?:\/\//,'').substring(0,30)}...</a></td>
    <td>${o.qty.toLocaleString()}</td>
    <td>${o.start_count}</td>
    <td>${o.remains.toLocaleString()}</td>
    <td style="color:var(--acc);font-weight:700">${fmtPHP(o.charge)}</td>
    <td>${badge(o.status)}</td>
    <td style="color:var(--mut);font-size:11px;white-space:nowrap">${o.date}</td>
  </tr>`).join("") || `<tr><td colspan="9" style="text-align:center;color:var(--mut);padding:32px">No orders yet. <a href="/order" style="color:var(--acc);font-weight:700">Place your first order →</a></td></tr>`;

  const counts = {
    total:ords.length,
    pend:ords.filter(o=>o.status==="Pending").length,
    proc:ords.filter(o=>o.status==="Processing").length,
    prog:ords.filter(o=>o.status==="In progress").length,
    done:ords.filter(o=>o.status==="Completed").length,
    canc:ords.filter(o=>o.status==="Cancelled").length,
  };

  return shell("My Orders", `
<div class="pg-h">📋 My Orders</div>
<div class="pg-s">Track and monitor all your orders</div>

<div class="sg" style="margin-bottom:20px">
  <div class="st"><div class="sv">${counts.total}</div><div class="sl">Total</div></div>
  <div class="st"><div class="sv" style="color:var(--ylw)">${counts.pend}</div><div class="sl">Pending</div></div>
  <div class="st"><div class="sv" style="color:var(--acc)">${counts.proc}</div><div class="sl">Processing</div></div>
  <div class="st"><div class="sv" style="color:#c4b5fd">${counts.prog}</div><div class="sl">In Progress</div></div>
  <div class="st"><div class="sv" style="color:var(--grn)">${counts.done}</div><div class="sl">Completed</div></div>
  <div class="st"><div class="sv" style="color:var(--red)">${counts.canc}</div><div class="sl">Cancelled</div></div>
</div>

<div class="card">
  <div class="tw"><table>
    <thead><tr><th>#ID</th><th>Service</th><th>Link</th><th>Qty</th><th>Start</th><th>Remains</th><th>Charge</th><th>Status</th><th>Date</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
</div>`, user, "orders");
}

// ── PAGE: SERVICES ───────────────────────────────────────────────
function P_services(user) {
  const cats = [...new Set(SERVICES.map(s=>s.cat))];
  const catBtns = `<button class="tab on" onclick="svcFilter('all',this)">All (${SERVICES.length})</button>` +
    cats.map(c=>`<button class="tab" onclick="svcFilter('${c}',this)">${c} (${SERVICES.filter(s=>s.cat===c).length})</button>`).join("");

  const rows = SERVICES.map(s=>`
  <tr data-cat="${s.cat}">
    <td style="color:var(--mut)">${s.id}</td>
    <td>${s.icon} ${s.name}</td>
    <td style="color:var(--acc);font-weight:800">₱${(s.rate/10).toFixed(1)}/1K</td>
    <td>${s.min.toLocaleString()}</td>
    <td>${s.max.toLocaleString()}</td>
    <td style="color:var(--mut);font-size:12px">${s.desc}</td>
    <td><a href="/order" onclick="sessionStorage.setItem('presvc','${s.id}')" class="btn btn-sm btn-g">Order</a></td>
  </tr>`).join("");

  return shell("Services", `
<div class="pg-h">⚡ All Services</div>
<div class="pg-s">${SERVICES.length} services available across ${cats.length} platforms</div>

<div class="card">
  <div class="tabs">${catBtns}</div>
  <div class="tw"><table id="svctbl">
    <thead><tr><th>ID</th><th>Service</th><th>Rate</th><th>Min</th><th>Max</th><th>Description</th><th>Action</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
</div>`, user, "services");
}

// ── PAGE: ADD FUNDS ──────────────────────────────────────────────
function P_addfunds(user, msg="", msgType="s") {
  const hist = DB.funds.filter(f=>f.user===user.username).reverse().slice(0,15);
  const rows = hist.map(f=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${f.id}</td>
    <td style="font-size:12px;white-space:nowrap">${f.date}</td>
    <td>${f.method}</td>
    <td style="font-size:12px;color:var(--mut)">${f.ref}</td>
    <td style="color:var(--grn);font-weight:800">${fmtPHP(f.amount)}</td>
    <td>${badge(f.status)}</td>
  </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:24px">No deposits yet</td></tr>`;

  return shell("Add Funds", `
<div class="pg-h">💳 Add Funds</div>
<div class="pg-s">Top up your account to place orders</div>
${msg?`<div class="al al-${msgType}">${msg}</div>`:""}

<div class="g2" style="align-items:start;gap:18px">
  <div>
    <div class="card">
      <div class="ch">📤 Submit Deposit Request</div>
      <form method="POST" action="/addfunds">
        <div class="fg"><label>Payment Method</label>
          <select name="method">
            <option value="GCash">GCash (Manual — No Fee)</option>
            <option value="Maya">Maya (Manual)</option>
            <option value="Binance">Binance USDT (TRC20)</option>
            <option value="BDO">BDO Bank Transfer</option>
            <option value="BPI">BPI Bank Transfer</option>
          </select>
        </div>
        <div class="fg"><label>Amount in PHP — Minimum ₱50</label>
          <input type="number" name="amount" placeholder="e.g. 100" min="50" required>
        </div>
        <div class="fg"><label>Reference / Transaction ID</label>
          <input type="text" name="ref" placeholder="Paste your reference number here" required>
        </div>
        <button type="submit" class="btn btn-p btn-block">📨 Submit Deposit Request</button>
      </form>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="ch">📱 Payment Details</div>
      <div style="font-size:13.5px;line-height:2;color:var(--mut)">
        <div>📱 <strong style="color:var(--txt)">GCash:</strong> ${CFG.GCASH_NUM}</div>
        <div>👤 <strong style="color:var(--txt)">Name:</strong> ${CFG.GCASH_NAME}</div>
      </div>
      <div class="al al-i" style="margin-top:12px;margin-bottom:0">
        Send money → copy reference number → fill form above → wait 1–10 mins for approval.
      </div>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom:16px">
      <div class="ch">💰 Current Balance</div>
      <div class="st"><div class="sv" style="font-size:32px">${fmtPHP(user.balance)}</div></div>
    </div>
    <div class="card">
      <div class="ch">📋 Deposit History</div>
      <div class="tw"><table>
        <thead><tr><th>#</th><th>Date</th><th>Method</th><th>Ref</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>
  </div>
</div>`, user, "addfunds");
}

// ── PAGE: TICKETS ─────────────────────────────────────────────────
function P_tickets(user, msg="", msgType="s") {
  const tix = DB.tickets.filter(t=>t.user===user.username).reverse();
  const rows = tix.map(t=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${t.id}</td>
    <td class="td-trunc">${t.subject}</td>
    <td style="font-size:12px">${t.category}</td>
    <td style="font-size:11px;white-space:nowrap;color:var(--mut)">${t.date}</td>
    <td>${badge(t.status)}</td>
  </tr>`).join("") || `<tr><td colspan="5" style="text-align:center;color:var(--mut);padding:24px">No tickets yet</td></tr>`;

  return shell("Tickets", `
<div class="pg-h">🎫 Support Tickets</div>
<div class="pg-s">Get help from our team — we respond quickly!</div>
${msg?`<div class="al al-${msgType}">${msg}</div>`:""}

<div class="g2" style="align-items:start;gap:18px">
  <div class="card">
    <div class="ch">➕ Submit New Ticket</div>
    <form method="POST" action="/tickets">
      <div class="fg"><label>Category</label>
        <select name="category">
          <option>Order Issue</option>
          <option>Deposit Problem</option>
          <option>Refund Request</option>
          <option>General Inquiry</option>
          <option>Technical Issue</option>
          <option>Other</option>
        </select>
      </div>
      <div class="fg"><label>Subject</label>
        <input type="text" name="subject" placeholder="Brief summary of your concern" required>
      </div>
      <div class="fg"><label>Message</label>
        <textarea name="message" placeholder="Describe your issue in full detail..." required></textarea>
      </div>
      <button type="submit" class="btn btn-p btn-block">📨 Submit Ticket</button>
    </form>
  </div>

  <div class="card">
    <div class="ch">📋 My Tickets</div>
    <div class="tw"><table>
      <thead><tr><th>#</th><th>Subject</th><th>Category</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>
</div>`, user, "tickets");
}

// ── PAGE: LINK FIXER ─────────────────────────────────────────────
function P_linkfixer(user, result="") {
  return shell("Link Fixer", `
<div class="pg-h">🔗 Link Fixer</div>
<div class="pg-s">Clean and fix URLs before placing orders</div>

<div class="g2" style="align-items:start;gap:18px">
  <div class="card">
    <div class="ch">🔧 Fix Your Link</div>
    <form method="POST" action="/linkfixer">
      <div class="fg"><label>Platform</label>
        <select name="platform">
          <option>Facebook</option><option>Instagram</option>
          <option>TikTok</option><option>YouTube</option>
          <option>Twitter/X</option><option>Telegram</option>
          <option>Shopee</option><option>Spotify</option>
        </select>
      </div>
      <div class="fg"><label>Paste Your Link or Username</label>
        <textarea name="link" style="min-height:80px" placeholder="https://www.facebook.com/yourpage?ref=..." required></textarea>
      </div>
      <button type="submit" class="btn btn-p btn-block">🔧 Fix Link</button>
    </form>
    ${result?`<div class="al al-s" style="margin-top:16px">
      <strong>✅ Fixed Link:</strong><br>
      <code style="word-break:break-all;font-size:13px;display:block;margin-top:6px">${result}</code>
      <button onclick="navigator.clipboard.writeText('${result}')" class="btn btn-sm btn-o" style="margin-top:8px">📋 Copy</button>
    </div>`:""}
  </div>

  <div class="card">
    <div class="ch">📖 How to Use</div>
    <div style="font-size:13.5px;color:var(--mut);line-height:2">
      <p>1. Select the platform of your link.</p>
      <p>2. Paste the full URL or just the username.</p>
      <p>3. Click Fix Link to get a clean URL.</p>
      <p>4. Copy and use when placing orders.</p>
    </div>
    <div class="al al-w" style="margin-top:14px;margin-bottom:0">
      ⚠️ Always ensure your account/page is set to <strong>PUBLIC</strong> before ordering!
    </div>
  </div>
</div>`, user, "linkfixer");
}

// ── PAGE: BULK ORDER ─────────────────────────────────────────────
function P_bulk(user, msg="", msgType="s") {
  const svcList = SERVICES.slice(0,15).map(s=>`<tr><td style="color:var(--mut)">${s.id}</td><td>${s.icon} ${s.name}</td><td style="color:var(--acc);font-weight:700">₱${(s.rate/10).toFixed(1)}/K</td></tr>`).join("");
  return shell("Bulk Order", `
<div class="pg-h">📦 Bulk Order</div>
<div class="pg-s">Place multiple orders at once — one per line</div>
${msg?`<div class="al al-${msgType}">${msg}</div>`:""}

<div class="g2" style="align-items:start;gap:18px">
  <div class="card">
    <div class="ch">📦 Bulk Order Form</div>
    <div class="al al-i">
      Format: <code>service_id|link|quantity</code><br>
      Example: <code>22|https://tiktok.com/@user|500</code>
    </div>
    <form method="POST" action="/bulk" style="margin-top:14px">
      <div class="fg">
        <textarea name="bulk" style="min-height:220px;font-family:monospace;font-size:13px" placeholder="22|https://tiktok.com/@user|500
24|https://tiktok.com/video/123|1000
14|https://instagram.com/user|200" required></textarea>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:14px;padding:10px 12px;background:var(--s2);border-radius:10px;border:1px solid var(--bdr)">
        <span style="color:var(--mut)">Available Balance</span>
        <span style="color:var(--grn);font-weight:800">${fmtPHP(user.balance)}</span>
      </div>
      <button type="submit" class="btn btn-g btn-block">🚀 Submit All Orders</button>
    </form>
  </div>

  <div class="card">
    <div class="ch">📋 Service IDs Reference</div>
    <div class="tw" style="max-height:400px;overflow-y:auto"><table>
      <thead><tr><th>ID</th><th>Service</th><th>Rate</th></tr></thead>
      <tbody>${svcList}</tbody>
    </table></div>
    <a href="/services" style="display:block;text-align:center;margin-top:12px;font-size:13px;color:var(--acc)">View all ${SERVICES.length} services →</a>
  </div>
</div>`, user, "bulk");
}

// ── PAGE: ADMIN ──────────────────────────────────────────────────
function P_admin(user, msg="", msgType="s", tab="users") {
  if (user.level !== 0) return null;

  const allUsers  = Object.entries(DB.users).map(([u,d])=>({...d,username:u}));
  const allOrders = [...DB.orders].reverse();
  const allFunds  = [...DB.funds].reverse();
  const allTix    = [...DB.tickets].reverse();

  // Stats
  const totalRev = DB.funds.filter(f=>f.status==="Approved").reduce((a,f)=>a+f.amount,0);

  const userRows = allUsers.map(u=>`
  <tr>
    <td style="font-weight:700">${u.username}</td>
    <td style="color:var(--grn);font-weight:800">${fmtPHP(u.balance)}</td>
    <td>${u.level===0?'<span class="bx bx-proc">Admin</span>':'<span class="bx bx-comp">User</span>'}</td>
    <td style="font-size:12px;color:var(--mut)">${new Date(u.created).toLocaleDateString()}</td>
    <td>
      <form method="POST" action="/admin/bal" style="display:inline-flex;gap:5px;align-items:center">
        <input type="hidden" name="uname" value="${u.username}">
        <input type="hidden" name="action" value="add">
        <input type="number" name="amt" placeholder="₱ amount" style="width:90px;padding:6px 8px;font-size:12px;border-radius:8px">
        <button type="submit" class="btn btn-sm btn-g">Add</button>
      </form>
      <form method="POST" action="/admin/bal" style="display:inline-flex;gap:5px;align-items:center;margin-left:4px">
        <input type="hidden" name="uname" value="${u.username}">
        <input type="hidden" name="action" value="deduct">
        <input type="number" name="amt" placeholder="₱ amount" style="width:90px;padding:6px 8px;font-size:12px;border-radius:8px">
        <button type="submit" class="btn btn-sm btn-r">Deduct</button>
      </form>
    </td>
  </tr>`).join("");

  const orderRows = allOrders.slice(0,50).map(o=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${o.id}</td>
    <td style="color:var(--acc);font-weight:700">${o.user}</td>
    <td class="td-trunc" style="max-width:150px">${o.service}</td>
    <td>${o.qty.toLocaleString()}</td>
    <td style="color:var(--grn);font-weight:700">${fmtPHP(o.charge)}</td>
    <td>
      <form method="POST" action="/admin/ordst" style="display:flex;gap:4px;align-items:center">
        <input type="hidden" name="oid" value="${o.id}">
        <select name="st" style="padding:5px 7px;font-size:11.5px;border-radius:8px;width:130px">
          <option ${o.status==="Pending"?"selected":""}>Pending</option>
          <option ${o.status==="Processing"?"selected":""}>Processing</option>
          <option ${o.status==="In progress"?"selected":""}>In progress</option>
          <option ${o.status==="Completed"?"selected":""}>Completed</option>
          <option ${o.status==="Cancelled"?"selected":""}>Cancelled</option>
          <option ${o.status==="Partial"?"selected":""}>Partial</option>
        </select>
        <button type="submit" class="btn btn-sm btn-p">Set</button>
      </form>
    </td>
  </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:20px">No orders yet</td></tr>`;

  const fundRows = allFunds.slice(0,50).map(f=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${f.id}</td>
    <td style="color:var(--acc);font-weight:700">${f.user}</td>
    <td>${f.method}</td>
    <td style="font-size:12px;color:var(--mut)">${f.ref}</td>
    <td style="color:var(--grn);font-weight:800">${fmtPHP(f.amount)}</td>
    <td>
      <form method="POST" action="/admin/fundst" style="display:flex;gap:4px">
        <input type="hidden" name="fid" value="${f.id}">
        <select name="st" style="padding:5px 7px;font-size:11.5px;border-radius:8px;width:110px">
          <option ${f.status==="Pending"?"selected":""}>Pending</option>
          <option ${f.status==="Approved"?"selected":""}>Approved</option>
          <option ${f.status==="Rejected"?"selected":""}>Rejected</option>
        </select>
        <button type="submit" class="btn btn-sm btn-g">Set</button>
      </form>
    </td>
  </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:20px">No deposits yet</td></tr>`;

  const tixRows = allTix.map(t=>`
  <tr>
    <td style="color:var(--mut);font-size:12px">#${t.id}</td>
    <td style="color:var(--acc);font-weight:700">${t.user}</td>
    <td class="td-trunc">${t.subject}</td>
    <td style="font-size:12px">${t.category}</td>
    <td>${badge(t.status)}</td>
    <td>
      <form method="POST" action="/admin/tixst" style="display:flex;gap:4px">
        <input type="hidden" name="tid" value="${t.id}">
        <select name="st" style="padding:5px 7px;font-size:11.5px;border-radius:8px;width:100px">
          <option ${t.status==="Open"?"selected":""}>Open</option>
          <option ${t.status==="Closed"?"selected":""}>Closed</option>
        </select>
        <button type="submit" class="btn btn-sm btn-p">Set</button>
      </form>
    </td>
  </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:20px">No tickets</td></tr>`;

  return shell("Admin Panel", `
<div class="pg-h">⚙️ Admin Panel</div>
<div class="pg-s">Manage everything from here</div>
${msg?`<div class="al al-${msgType}">${msg}</div>`:""}

<div class="sg" style="margin-bottom:20px">
  <div class="st"><div class="sv">${allUsers.length}</div><div class="sl">Users</div></div>
  <div class="st"><div class="sv">${allOrders.length}</div><div class="sl">Orders</div></div>
  <div class="st"><div class="sv">${allFunds.filter(f=>f.status==="Pending").length}</div><div class="sl">Pending Deposits</div></div>
  <div class="st"><div class="sv">${allTix.filter(t=>t.status==="Open").length}</div><div class="sl">Open Tickets</div></div>
  <div class="st"><div class="sv" style="color:var(--grn)">${fmtPHP(totalRev)}</div><div class="sl">Total Revenue</div></div>
</div>

<div class="tabs">
  <button class="tab atab ${tab==="users"?"on":""}"   data-t="users"    onclick="adminTab('users')">👥 Users (${allUsers.length})</button>
  <button class="tab atab ${tab==="orders"?"on":""}"  data-t="orders"   onclick="adminTab('orders')">📋 Orders (${allOrders.length})</button>
  <button class="tab atab ${tab==="funds"?"on":""}"   data-t="funds"    onclick="adminTab('funds')">💳 Deposits (${allFunds.length})</button>
  <button class="tab atab ${tab==="tickets"?"on":""}" data-t="tickets"  onclick="adminTab('tickets')">🎫 Tickets (${allTix.length})</button>
</div>

<div class="apanel card" data-p="users" style="display:${tab==="users"?"":"none"}">
  <div class="ch">👥 All Users</div>
  <div class="tw"><table>
    <thead><tr><th>Username</th><th>Balance</th><th>Role</th><th>Joined</th><th>Balance Actions</th></tr></thead>
    <tbody>${userRows}</tbody>
  </table></div>
</div>

<div class="apanel card" data-p="orders" style="display:${tab==="orders"?"":"none"}">
  <div class="ch">📋 All Orders (latest 50)</div>
  <div class="tw"><table>
    <thead><tr><th>#ID</th><th>User</th><th>Service</th><th>Qty</th><th>Charge</th><th>Update Status</th></tr></thead>
    <tbody>${orderRows}</tbody>
  </table></div>
</div>

<div class="apanel card" data-p="funds" style="display:${tab==="funds"?"":"none"}">
  <div class="ch">💳 All Deposits</div>
  <div class="al al-w" style="margin-bottom:14px">Setting status to <strong>Approved</strong> will automatically credit the amount to the user's balance (only once).</div>
  <div class="tw"><table>
    <thead><tr><th>#ID</th><th>User</th><th>Method</th><th>Reference</th><th>Amount</th><th>Update Status</th></tr></thead>
    <tbody>${fundRows}</tbody>
  </table></div>
</div>

<div class="apanel card" data-p="tickets" style="display:${tab==="tickets"?"":"none"}">
  <div class="ch">🎫 All Tickets</div>
  <div class="tw"><table>
    <thead><tr><th>#ID</th><th>User</th><th>Subject</th><th>Category</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>${tixRows}</tbody>
  </table></div>
</div>`, user, "admin");
}

// ── MAIN ROUTER ──────────────────────────────────────────────────
export default {
  async fetch(request) {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;
    const user   = getUser(request);

    // ── PUBLIC ROUTES ────────────────────────────────────────
    if (path === "/" || path === "/login") {
      if (method === "GET") {
        if (user) return redir("/dashboard");
        return html(P_login());
      }
      if (method === "POST") {
        const fd = await request.formData();
        const u  = (fd.get("u")||"").trim().toLowerCase();
        const p  = fd.get("p")||"";
        const rec = DB.users[u];
        if (!rec || rec.pass !== p)
          return html(P_login("❌ Wrong username or password."));
        const sess = `${u}:${Date.now()}`;
        return redir("/dashboard", { "Set-Cookie": makeCookie(CFG.COOKIE_NAME, sess) });
      }
    }

    if (path === "/register") {
      if (method === "GET") {
        if (user) return redir("/dashboard");
        return html(P_register());
      }
      if (method === "POST") {
        const fd = await request.formData();
        const u  = (fd.get("u")||"").trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
        const e  = (fd.get("e")||"").trim();
        const p  = fd.get("p")||"";
        if (!u || u.length < 3)  return html(P_register("❌ Username must be at least 3 characters."));
        if (u.length > 20)       return html(P_register("❌ Username max 20 characters."));
        if (!e || !e.includes("@")) return html(P_register("❌ Enter a valid email address."));
        if (!p || p.length < 6)  return html(P_register("❌ Password must be at least 6 characters."));
        if (DB.users[u])         return html(P_register("❌ Username already taken. Choose another."));
        DB.users[u] = { pass:p, email:e, balance:0, level:1, created:Date.now(), fullname:"" };
        const sess = `${u}:${Date.now()}`;
        return redir("/dashboard", { "Set-Cookie": makeCookie(CFG.COOKIE_NAME, sess) });
      }
    }

    if (path === "/logout") {
      return redir("/login", { "Set-Cookie": clearCookie(CFG.COOKIE_NAME) });
    }

    // ── AUTH GUARD ───────────────────────────────────────────
    if (!user) return redir("/login");

    // Refresh user from DB (balance may have changed)
    const freshUser = { ...DB.users[user.username], username: user.username };

    // ── DASHBOARD ────────────────────────────────────────────
    if (path === "/dashboard") {
      return html(P_dashboard(freshUser));
    }

    // ── NEW ORDER ────────────────────────────────────────────
    if (path === "/order") {
      if (method === "GET") {
        const cat = url.searchParams.get("cat") || "";
        return html(P_order(freshUser, cat));
      }
      if (method === "POST") {
        const fd   = await request.formData();
        const sid  = parseInt(fd.get("sid")||"0");
        const link = (fd.get("link")||"").trim();
        const qty  = parseInt(fd.get("qty")||"0");
        const svc  = SERVICES.find(s=>s.id===sid);

        if (!svc)  return html(P_order(freshUser,"","❌ Please select a service from the list.","e"));
        if (!link) return html(P_order(freshUser,"","❌ Please enter a link or username.","e"));
        if (!qty || qty < svc.min || qty > svc.max)
          return html(P_order(freshUser,"",`❌ Quantity must be between ${svc.min.toLocaleString()} and ${svc.max.toLocaleString()}.`,"e"));

        const charge = Math.ceil((qty * svc.rate) / 1000) * 10; // centavos
        if (DB.users[user.username].balance < charge)
          return html(P_order(freshUser,"",`❌ Insufficient balance. Need ${fmtPHP(charge)}, you have ${fmtPHP(DB.users[user.username].balance)}. <a href="/addfunds" style="color:var(--acc);font-weight:800">Add Funds →</a>`,"e"));

        DB.users[user.username].balance -= charge;
        const oid = ++DB.counters.order;
        DB.orders.push({
          id: oid, user: user.username, service: svc.name,
          link, qty, charge, start_count: 0, remains: qty,
          status: "Pending", date: nowPH()
        });

        const u2 = { ...DB.users[user.username], username: user.username };
        return html(P_order(u2,"",`✅ Order #${oid} placed! ${fmtPHP(charge)} deducted. Balance: ${fmtPHP(u2.balance)}`,"s"));
      }
    }

    // ── MY ORDERS ────────────────────────────────────────────
    if (path === "/orders") {
      return html(P_orders(freshUser));
    }

    // ── SERVICES ─────────────────────────────────────────────
    if (path === "/services") {
      return html(P_services(freshUser));
    }

    // ── ADD FUNDS ────────────────────────────────────────────
    if (path === "/addfunds") {
      if (method === "GET") return html(P_addfunds(freshUser));
      if (method === "POST") {
        const fd  = await request.formData();
        const mth = fd.get("method")||"GCash";
        const amt = parseFloat(fd.get("amount")||"0");
        const ref = (fd.get("ref")||"").trim();
        if (!amt || amt < 50)    return html(P_addfunds(freshUser,"❌ Minimum deposit is ₱50.","e"));
        if (!ref || ref.length < 4) return html(P_addfunds(freshUser,"❌ Please enter a valid reference number.","e"));
        const fid = ++DB.counters.fund;
        DB.funds.push({ id:fid, user:user.username, method:mth, ref, amount:Math.round(amt*100), status:"Pending", date:nowPH() });
        return html(P_addfunds(freshUser,`✅ Deposit request #${fid} submitted for ${fmtPHP(Math.round(amt*100))}. Please wait 1–10 minutes for admin approval.`,"s"));
      }
    }

    // ── TICKETS ──────────────────────────────────────────────
    if (path === "/tickets") {
      if (method === "GET") return html(P_tickets(freshUser));
      if (method === "POST") {
        const fd  = await request.formData();
        const sub = (fd.get("subject")||"").trim();
        const msg = (fd.get("message")||"").trim();
        const cat = fd.get("category")||"General Inquiry";
        if (!sub || !msg) return html(P_tickets(freshUser,"❌ Please fill in all fields.","e"));
        const tid = ++DB.counters.ticket;
        DB.tickets.push({ id:tid, user:user.username, subject:sub, message:msg, category:cat, status:"Open", date:nowPH() });
        return html(P_tickets(freshUser,`✅ Ticket #${tid} submitted! We'll respond as soon as possible.`,"s"));
      }
    }

    // ── LINK FIXER ───────────────────────────────────────────
    if (path === "/linkfixer") {
      if (method === "GET") return html(P_linkfixer(freshUser));
      if (method === "POST") {
        const fd   = await request.formData();
        const raw  = (fd.get("link")||"").trim();
        let   fixed = raw;
        // Strip query params and trailing slashes
        fixed = fixed.replace(/[?&].*$/, "").replace(/\/+$/, "");
        // Add https if missing
        if (fixed && !fixed.startsWith("http")) fixed = "https://" + fixed;
        // Remove www where not needed
        fixed = fixed.replace(/\/\/www\./,"//");
        return html(P_linkfixer(freshUser, fixed));
      }
    }

    // ── BULK ORDER ───────────────────────────────────────────
    if (path === "/bulk") {
      if (method === "GET") return html(P_bulk(freshUser));
      if (method === "POST") {
        const fd    = await request.formData();
        const lines = (fd.get("bulk")||"").split("\n").map(l=>l.trim()).filter(Boolean);
        let placed=0, errs=[];
        for (const [i, line] of lines.entries()) {
          const parts = line.split("|");
          if (parts.length < 3) { errs.push(`Line ${i+1}: wrong format`); continue; }
          const sid  = parseInt(parts[0]);
          const link = parts[1].trim();
          const qty  = parseInt(parts[2]);
          const svc  = SERVICES.find(s=>s.id===sid);
          if (!svc)  { errs.push(`Line ${i+1}: invalid service ID ${sid}`); continue; }
          if (!link) { errs.push(`Line ${i+1}: empty link`); continue; }
          if (!qty||qty<svc.min||qty>svc.max) { errs.push(`Line ${i+1}: qty out of range (${svc.min}–${svc.max})`); continue; }
          const charge = Math.ceil((qty * svc.rate) / 1000) * 10;
          if (DB.users[user.username].balance < charge) { errs.push(`Line ${i+1}: insufficient balance`); continue; }
          DB.users[user.username].balance -= charge;
          DB.orders.push({ id:++DB.counters.order, user:user.username, service:svc.name, link, qty, charge, start_count:0, remains:qty, status:"Pending", date:nowPH() });
          placed++;
        }
        const u2 = {...DB.users[user.username],username:user.username};
        const errmsg = errs.length ? `<br><small style="color:var(--ylw)">${errs.slice(0,5).join(" | ")}${errs.length>5?` (+${errs.length-5} more)`:""}</small>` : "";
        return html(P_bulk(u2,`✅ ${placed} order(s) placed. ${errs.length} skipped. Balance: ${fmtPHP(u2.balance)}${errmsg}`,"s"));
      }
    }

    // ── ADMIN ────────────────────────────────────────────────
    if (path === "/admin") {
      if (freshUser.level !== 0) return redir("/dashboard");
      return html(P_admin(freshUser));
    }

    if (path === "/admin/bal" && method === "POST") {
      if (freshUser.level !== 0) return redir("/dashboard");
      const fd  = await request.formData();
      const un  = fd.get("uname")||"";
      const act = fd.get("action")||"add";
      const amt = parseFloat(fd.get("amt")||"0");
      if (!DB.users[un] || amt <= 0) return html(P_admin(freshUser,"❌ Invalid username or amount.","e","users"));
      const cents = Math.round(amt * 100);
      if (act === "add") {
        DB.users[un].balance += cents;
        return html(P_admin({...DB.users[user.username],username:user.username},`✅ Added ${fmtPHP(cents)} to ${un}. New balance: ${fmtPHP(DB.users[un].balance)}`,"s","users"));
      } else {
        DB.users[un].balance = Math.max(0, DB.users[un].balance - cents);
        return html(P_admin({...DB.users[user.username],username:user.username},`✅ Deducted ${fmtPHP(cents)} from ${un}. New balance: ${fmtPHP(DB.users[un].balance)}`,"s","users"));
      }
    }

    if (path === "/admin/ordst" && method === "POST") {
      if (freshUser.level !== 0) return redir("/dashboard");
      const fd  = await request.formData();
      const oid = parseInt(fd.get("oid")||"0");
      const st  = fd.get("st")||"";
      const ord = DB.orders.find(o=>o.id===oid);
      if (ord) {
        ord.status = st;
        if (st==="Completed") { ord.start_count=ord.qty; ord.remains=0; }
        if (st==="Cancelled") {
          // Refund to user
          DB.users[ord.user].balance += ord.charge;
          return html(P_admin({...DB.users[user.username],username:user.username},`✅ Order #${oid} cancelled. ${fmtPHP(ord.charge)} refunded to ${ord.user}.`,"s","orders"));
        }
      }
      return html(P_admin({...DB.users[user.username],username:user.username},`✅ Order #${oid} updated to "${st}".`,"s","orders"));
    }

    if (path === "/admin/fundst" && method === "POST") {
      if (freshUser.level !== 0) return redir("/dashboard");
      const fd   = await request.formData();
      const fid2 = parseInt(fd.get("fid")||"0");
      const st   = fd.get("st")||"";
      const fund = DB.funds.find(f=>f.id===fid2);
      if (!fund) return html(P_admin({...DB.users[user.username],username:user.username},"❌ Deposit not found.","e","funds"));
      if (st === "Approved" && fund.status !== "Approved") {
        DB.users[fund.user].balance += fund.amount;
        fund.status = "Approved";
        return html(P_admin({...DB.users[user.username],username:user.username},`✅ Deposit #${fid2} approved. ${fmtPHP(fund.amount)} credited to ${fund.user}.`,"s","funds"));
      }
      if (st === "Rejected") fund.status = "Rejected";
      return html(P_admin({...DB.users[user.username],username:user.username},`✅ Deposit #${fid2} status set to "${st}".`,"s","funds"));
    }

    if (path === "/admin/tixst" && method === "POST") {
      if (freshUser.level !== 0) return redir("/dashboard");
      const fd  = await request.formData();
      const tid2= parseInt(fd.get("tid")||"0");
      const st  = fd.get("st")||"";
      const tkt = DB.tickets.find(t=>t.id===tid2);
      if (tkt) tkt.status = st;
      return html(P_admin({...DB.users[user.username],username:user.username},`✅ Ticket #${tid2} set to "${st}".`,"s","tickets"));
    }

    // ── 404 ──────────────────────────────────────────────────
    return html(shell("Not Found",`
<div style="text-align:center;padding:80px 20px">
  <div style="font-size:72px;margin-bottom:16px">🚀</div>
  <div class="pg-h" style="justify-content:center">404 — Page Not Found</div>
  <p style="color:var(--mut);margin:12px 0 24px">The page you're looking for doesn't exist.</p>
  <a href="/dashboard" class="btn btn-p">Go to Dashboard</a>
</div>`, freshUser), 404);
  }
};
