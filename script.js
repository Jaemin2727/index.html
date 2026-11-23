/* =========================================================
   해오름항 배낚시 — script.js
   ---------------------------------------------------------
   1. 데이터 (다음 주 데이터베이스 테이블로 옮길 부분)
      ※ 해오름항 · 선박 · 날씨 · 조과는 모두 수업용 예시 자료
   ========================================================= */

// 항구 정보
const PORT = { name: "해오름항", meetPlace: "해오름항 2번 선착장 매표소 앞", meetBefore: "출항 30분 전" };

// 대상어종 → 어종 테이블 (어종별로 챙겨올 채비 포함)
const FISH = [
  { id: 1, name: "갈치", image: "img/fish-galchi.svg", season: "8~12월", method: "야간 집어등 선상낚시",
    rod: "갈치 전용 선상대 3~4m", reel: "전동릴 또는 중형 베이트릴", line: "PE 3~4호 200m 이상",
    rig: "갈치 카드채비(바늘 4~5개) + 봉돌 40~60호", bait: "꽁치살 (배에서 제공)",
    extra: "헤드랜턴, 두꺼운 장갑(이빨이 날카로워요), 고기 집게",
    tip: "선장님이 알려주는 수심층에 채비를 맞추는 게 가장 중요해요. 봉돌 무게는 물때에 따라 달라져요." },
  { id: 2, name: "쭈꾸미·갑오징어", image: "img/fish-jjukkumi.svg", season: "9~11월", method: "에기 선상낚시",
    rod: "쭈꾸미 전용 베이트로드 1.6~1.9m", reel: "소형 베이트릴", line: "PE 0.8~1호",
    rig: "쭈꾸미·갑오징어 에기 2~3개 + 봉돌 8~12호 (애자 채비)", bait: "필요 없음 (에기 사용)",
    extra: "에기 여분, 장갑, 먹물이 묻어도 되는 옷",
    tip: "바닥을 톡톡 찍듯이 살살 들었다 놓다가, 묵직한 느낌이 오면 천천히 감아 올리세요." },
  { id: 3, name: "우럭·광어", image: "img/fish-ureok.svg", season: "연중 (겨울 우럭 제철)", method: "암초 지대 선상 외줄낚시",
    rod: "선상 우럭대 2.1~2.7m (허리힘 좋은 것)", reel: "중형 베이트릴 또는 전동릴", line: "PE 2~3호",
    rig: "우럭 2~3단 채비 + 봉돌 40~80호 / 광어는 다운샷 채비 + 웜", bait: "오징어살, 미꾸라지 (배에서 판매)",
    extra: "여분 바늘과 봉돌, 장갑",
    tip: "밑걸림이 많은 암초 지대라 바늘과 봉돌을 넉넉히 챙기세요. 바닥을 찍으면 바로 한두 바퀴 감아 올려요." },
  { id: 4, name: "참돔", image: "img/fish-chamdom.svg", season: "4~6월 · 10~1월", method: "타이라바 루어낚시",
    rod: "타이라바 전용 로드 1.9~2.1m", reel: "소형 베이트릴 (카운터 릴 추천)", line: "PE 0.8~1호 + 카본 쇼크리더 4~5호",
    rig: "타이라바 헤드 60~120g + 스커트·넥타이 여분", bait: "필요 없음 (루어 낚시)",
    extra: "무게가 다른 헤드 여러 개, 편광 선글라스",
    tip: "바닥을 찍고 일정한 속도로 감는 게 핵심이에요. 입질이 와도 감는 속도를 바꾸지 마세요." }
];

// 모든 출조 공통 준비물
const COMMON_ITEMS = ["신분증 (승선명부 작성용)", "방한·방수 옷과 모자", "아이스박스(쿨러)", "멀미약 (출항 30분 전 복용)"];

// 선박 → 선박 테이블
const BOATS = [
  { id: 1, name: "은갈치호", image: "img/boat-eungalchi.svg", capacity: 20, tonnage: "9.77톤", captain: "정바다 선장",
    facilities: "집어등 · 전동릴 전원 · 화장실 · 선실 히터", intro: "야간 갈치 전문선이에요. 배 둘레에 집어등을 달아 밤바다를 환하게 밝혀요." },
  { id: 2, name: "청룡호", image: "img/boat-cheongryong.svg", capacity: 16, tonnage: "7.93톤", captain: "한물결 선장",
    facilities: "화장실 · 선실 히터 · 어군탐지기", intro: "가을 쭈꾸미·갑오징어 전문선이에요. 처음 오는 분도 선장님이 채비부터 알려줘요." },
  { id: 3, name: "바다마루호", image: "img/boat-badamaru.svg", capacity: 18, tonnage: "9.77톤", captain: "오해림 선장",
    facilities: "화장실 · 전자레인지 · 어군탐지기", intro: "먼바다 암초 지대를 찾아가는 우럭·광어 선상 전문선이에요." },
  { id: 4, name: "해오름1호", image: "img/boat-haeoreum.svg", capacity: 12, tonnage: "6.67톤", captain: "서새벽 선장",
    facilities: "타이라바 전용 · 화장실 · 넓은 선미", intro: "정원을 12명으로 줄여 자리가 넉넉한 참돔 타이라바 전문선이에요." }
];

// 출조 일정 → 출조 테이블 (status: 정상 / 기상취소)
const TRIPS = [
  { id: 1,  boatId: 1, fishId: 1, date: "2026-11-14", departTime: "16:00", returnTime: "03:00", price: 130000, status: "정상" },
  { id: 2,  boatId: 2, fishId: 2, date: "2026-11-15", departTime: "06:00", returnTime: "15:00", price: 80000,  status: "정상" },
  { id: 3,  boatId: 3, fishId: 3, date: "2026-11-18", departTime: "05:00", returnTime: "15:00", price: 100000, status: "정상" },
  { id: 4,  boatId: 4, fishId: 4, date: "2026-11-21", departTime: "05:30", returnTime: "15:30", price: 150000, status: "정상" },
  { id: 5,  boatId: 1, fishId: 1, date: "2026-11-22", departTime: "16:00", returnTime: "03:00", price: 130000, status: "기상취소" },
  { id: 6,  boatId: 2, fishId: 2, date: "2026-11-28", departTime: "06:00", returnTime: "15:00", price: 80000,  status: "정상" },
  { id: 7,  boatId: 3, fishId: 3, date: "2026-11-29", departTime: "05:00", returnTime: "15:00", price: 100000, status: "정상" },
  { id: 8,  boatId: 1, fishId: 1, date: "2026-12-05", departTime: "16:00", returnTime: "03:00", price: 130000, status: "정상" },
  { id: 9,  boatId: 4, fishId: 4, date: "2026-12-06", departTime: "05:30", returnTime: "15:30", price: 150000, status: "정상" },
  { id: 10, boatId: 3, fishId: 3, date: "2026-12-12", departTime: "05:00", returnTime: "15:00", price: 100000, status: "정상" },
  { id: 11, boatId: 1, fishId: 1, date: "2026-12-13", departTime: "16:00", returnTime: "03:00", price: 130000, status: "정상" },
  { id: 12, boatId: 4, fishId: 4, date: "2026-12-19", departTime: "05:30", returnTime: "15:30", price: 150000, status: "정상" },
  { id: 13, boatId: 3, fishId: 3, date: "2026-12-20", departTime: "05:00", returnTime: "15:00", price: 100000, status: "정상" },
  { id: 14, boatId: 1, fishId: 1, date: "2026-12-26", departTime: "16:00", returnTime: "03:00", price: 130000, status: "정상" },
  { id: 15, boatId: 4, fishId: 4, date: "2027-01-09", departTime: "06:00", returnTime: "16:00", price: 150000, status: "정상" },
  { id: 16, boatId: 3, fishId: 3, date: "2027-01-10", departTime: "05:30", returnTime: "15:30", price: 100000, status: "정상" }
];

// 다른 손님이 이미 예약한 자리 (예시) → 예약 좌석 테이블
const RESERVED_SEATS = [
  { tripId: 6,  seats: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16] },
  { tripId: 7,  seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { tripId: 8,  seats: [1, 2, 5, 6, 9, 10, 15, 16, 19, 20] },
  { tripId: 9,  seats: [1, 2, 7, 8] },
  { tripId: 10, seats: [3, 4, 11, 12, 17] },
  { tripId: 11, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  { tripId: 12, seats: [5, 6] },
  { tripId: 14, seats: [1, 2] },
  { tripId: 16, seats: [9, 10] }
];

// 날짜별 바다 날씨 (예시) → 날씨 테이블
const WEATHER = [
  { date: "2026-11-14", sky: "맑음",     tempMin: 6,  tempMax: 15, wind: "북서 3~5m/s",   wave: "0.5m",      tide: "7물" },
  { date: "2026-11-15", sky: "구름조금", tempMin: 7,  tempMax: 16, wind: "북 2~4m/s",     wave: "0.5m",      tide: "8물" },
  { date: "2026-11-18", sky: "흐림",     tempMin: 5,  tempMax: 12, wind: "북서 4~7m/s",   wave: "0.5~1.0m",  tide: "11물" },
  { date: "2026-11-21", sky: "맑음",     tempMin: 3,  tempMax: 11, wind: "서 3~6m/s",     wave: "0.5~1.0m",  tide: "14물" },
  { date: "2026-11-22", sky: "비",       tempMin: 4,  tempMax: 9,  wind: "북서 10~14m/s", wave: "2.0~3.0m",  tide: "조금", alert: "풍랑주의보 발효 — 출항이 취소됐어요" },
  { date: "2026-11-28", sky: "맑음",     tempMin: 2,  tempMax: 10, wind: "북서 3~5m/s",   wave: "0.5m",      tide: "6물" },
  { date: "2026-11-29", sky: "구름조금", tempMin: 3,  tempMax: 11, wind: "북 4~6m/s",     wave: "0.5~1.0m",  tide: "7물" },
  { date: "2026-12-05", sky: "맑음",     tempMin: -1, tempMax: 7,  wind: "북서 4~6m/s",   wave: "0.5~1.0m",  tide: "13물" },
  { date: "2026-12-06", sky: "흐림",     tempMin: 0,  tempMax: 6,  wind: "북서 6~9m/s",   wave: "1.0~1.5m",  tide: "14물" },
  { date: "2026-12-12", sky: "구름조금", tempMin: -2, tempMax: 5,  wind: "북 3~5m/s",     wave: "0.5m",      tide: "5물" },
  { date: "2026-12-13", sky: "맑음",     tempMin: -1, tempMax: 6,  wind: "북서 3~5m/s",   wave: "0.5m",      tide: "6물" },
  { date: "2026-12-19", sky: "눈",       tempMin: -4, tempMax: 2,  wind: "북서 7~10m/s",  wave: "1.0~2.0m",  tide: "12물", alert: "풍랑 예비특보 — 출항 여부는 전날 오후 6시에 문자로 알려드려요" },
  { date: "2026-12-20", sky: "흐림",     tempMin: -3, tempMax: 3,  wind: "북서 5~8m/s",   wave: "1.0~1.5m",  tide: "13물" },
  { date: "2026-12-26", sky: "맑음",     tempMin: -5, tempMax: 2,  wind: "북 3~5m/s",     wave: "0.5m",      tide: "6물" },
  { date: "2027-01-09", sky: "구름조금", tempMin: -6, tempMax: 1,  wind: "북서 4~6m/s",   wave: "0.5~1.0m",  tide: "7물" },
  { date: "2027-01-10", sky: "맑음",     tempMin: -5, tempMax: 3,  wind: "북 3~4m/s",     wave: "0.5m",      tide: "8물" }
];

// 지난 출조 결과 (예시) → 조과 테이블
const CATCH_REPORTS = [
  { tripId: 1, anglers: 18, summary: "갈치 1인 평균 25~35마리", best: "최대 52마리 · 5지 갈치", note: "초저녁 물돌이 때 입질이 몰렸어요. 수심 40~60m." },
  { tripId: 2, anglers: 15, summary: "쭈꾸미 1인 평균 60~90마리, 갑오징어 3~8마리", best: "최대 쭈꾸미 142마리", note: "오전 물때가 좋아 처음 온 손님들도 많이 잡았어요." },
  { tripId: 3, anglers: 16, summary: "우럭 1인 평균 10~15마리, 광어 1~3마리", best: "최대 우럭 48cm", note: "오후에 조류가 빨라져 봉돌 80호를 썼어요." },
  { tripId: 4, anglers: 11, summary: "참돔 1인 평균 2~4마리", best: "최대 참돔 72cm", note: "80g 헤드에 주황색 스커트 반응이 좋았어요." }
];

// 회원 등급 → 등급 테이블 (minTotal: 누적 예약금액 기준, rate: 적립률)
const GRADES = [
  { id: 1, name: "새내기 조사", minTotal: 0,       rate: 0.01 },
  { id: 2, name: "단골 조사",   minTotal: 300000,  rate: 0.03 },
  { id: 3, name: "베테랑 조사", minTotal: 800000,  rate: 0.06 },
  { id: 4, name: "명예 선장",   minTotal: 1500000, rate: 0.09 }
];

// 운영 규칙
const POLICY = {
  signupPoint: 3000,       // 가입 포인트
  minUsePoint: 1000,       // 포인트 사용 최소 보유량
  maxSeats: 6,             // 한 번에 예약할 수 있는 최대 자리 수
  rentalFee: 10000,        // 낚싯대·릴 대여 (1인)
  fewSeats: 4              // 남은 자리가 이 수 이하면 '마감 임박'
};

// 체험 결제 수단
const PAY_METHODS = ["신용카드", "카카오페이", "네이버페이", "계좌이체"];


/* =========================================================
   2. 저장소 — 지금은 브라우저(localStorage)에 테이블처럼 저장
      members / reservations / pointHistory / session
   ========================================================= */
const DB_KEY = "haeoreum";
const memoryDB = {};

function loadTable(name, fallback) {
  try {
    const raw = localStorage.getItem(DB_KEY + "_" + name);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return memoryDB[name] !== undefined ? memoryDB[name] : fallback;
  }
}
function saveTable(name, data) {
  memoryDB[name] = data;
  try { localStorage.setItem(DB_KEY + "_" + name, JSON.stringify(data)); } catch (e) { /* 저장 불가 환경 */ }
}

const db = {
  members: loadTable("members", []),
  reservations: loadTable("reservations", []),
  pointHistory: loadTable("pointHistory", []),
  session: loadTable("session", null)
};
function save(...names) { names.forEach(n => saveTable(n, db[n])); }


/* =========================================================
   3. 공통 도구
   ========================================================= */
const $ = (sel) => document.querySelector(sel);
const won = (n) => Number(n).toLocaleString("ko-KR") + "원";
const point = (n) => Number(n).toLocaleString("ko-KR") + "P";
const now = () => new Date().toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nextId = (rows) => rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function hashPassword(pw) {          // 비밀번호를 그대로 저장하지 않도록 간단히 변환 (실제 서비스는 서버에서 암호화)
  let h = 5381;
  for (const ch of pw + "haeoreum") h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0;
  return h.toString(16);
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const toDate = (s) => new Date(s + "T00:00:00");
function dateLabel(s, long) {        // "12.05 (토)" 또는 "12월 5일 (토)"
  const d = toDate(s);
  return long ? `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_NAMES[d.getDay()]})`
              : `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} (${DAY_NAMES[d.getDay()]})`;
}

const getTrip = (id) => TRIPS.find(t => t.id === id);
const getBoat = (id) => BOATS.find(b => b.id === id);
const getFish = (id) => FISH.find(f => f.id === id);
const getWeather = (date) => WEATHER.find(w => w.date === date);
const getReport = (tripId) => CATCH_REPORTS.find(r => r.tripId === tripId);
const currentMember = () => db.members.find(m => m.id === db.session) || null;
const gradeOf = (member) => [...GRADES].reverse().find(g => (member ? member.totalPurchase : 0) >= g.minTotal);
const nextGradeOf = (grade) => GRADES.find(g => g.minTotal > grade.minTotal) || null;

// 이미 찬 자리 = 예시 예약 + 회원들의 확정 예약
function takenSeats(tripId) {
  const seeded = (RESERVED_SEATS.find(r => r.tripId === tripId) || { seats: [] }).seats;
  const booked = db.reservations.filter(r => r.tripId === tripId && r.status === "예약확정").flatMap(r => r.seats);
  return new Set([...seeded, ...booked]);
}
function mySeats(tripId) {
  const m = currentMember();
  if (!m) return new Set();
  return new Set(db.reservations.filter(r => r.tripId === tripId && r.memberId === m.id && r.status === "예약확정").flatMap(r => r.seats));
}
const seatsLeft = (trip) => getBoat(trip.boatId).capacity - takenSeats(trip.id).size;

// 출조 상태: cancel(기상취소) · done(출항 완료) · full(마감) · few(마감 임박) · open(예약 가능)
function tripState(trip) {
  if (trip.status === "기상취소") return "cancel";
  if (trip.date <= todayStr()) return "done";
  const left = seatsLeft(trip);
  if (left === 0) return "full";
  if (left <= POLICY.fewSeats) return "few";
  return "open";
}
const STATE_TEXT = { cancel: "기상 취소", done: "출항 완료", full: "예약 마감", few: "마감 임박", open: "예약 가능" };

// 날씨 아이콘 (SVG)
function wxIcon(sky) {
  const sun = `<circle cx="20" cy="20" r="8" fill="#FFB020"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const r = a * Math.PI / 180;
    return `<line x1="${20 + Math.cos(r) * 12}" y1="${20 + Math.sin(r) * 12}" x2="${20 + Math.cos(r) * 16}" y2="${20 + Math.sin(r) * 16}" stroke="#FFB020" stroke-width="3" stroke-linecap="round"/>`;
  }).join("")}`;
  const cloud = (c) => `<path d="M14 36 a8 8 0 0 1 1-16 a11 11 0 0 1 21 3 a7 7 0 0 1 0 13 Z" fill="${c}"/>`;
  let inner = "";
  if (sky === "맑음") inner = `<g transform="translate(4 4)">${sun}</g>`;
  else if (sky === "구름조금") inner = `${sun}<g transform="translate(6 6)">${cloud("#CBD5E1")}</g>`;
  else if (sky === "흐림") inner = `<g transform="translate(0 2)">${cloud("#94A3B8")}</g>`;
  else if (sky === "비") inner = `${cloud("#64748B")}<path d="M16 40 l-2 5 M24 40 l-2 5 M32 40 l-2 5" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>`;
  else if (sky === "눈") inner = `${cloud("#94A3B8")}<circle cx="16" cy="43" r="2.5" fill="#93C5FD"/><circle cx="24" cy="45" r="2.5" fill="#93C5FD"/><circle cx="32" cy="43" r="2.5" fill="#93C5FD"/>`;
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${inner}</svg>`;
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-show"), 2400);
}

function openModal(id) { const d = $("#" + id); if (!d.open) d.showModal(); }
function closeModal(id) { const d = $("#" + id); if (d.open) d.close(); }
document.querySelectorAll("dialog").forEach(dialog => {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
  });
});


/* =========================================================
   4. 헤더
   ========================================================= */
function renderHeader() {
  const member = currentMember();
  const btn = $("#userBtn");
  if (member) {
    btn.innerHTML = `${escapeHTML(member.name)}님<span class="grade-chip">${gradeOf(member).name}</span>`;
    btn.setAttribute("aria-label", "마이페이지 열기");
  } else {
    btn.textContent = "로그인";
    btn.setAttribute("aria-label", "로그인 또는 회원가입");
  }
}
$("#userBtn").addEventListener("click", () => { currentMember() ? openMyPage() : openAuth("login"); });


/* =========================================================
   5. 히어로 슬라이드 — 4장, 6초마다 교차
   ========================================================= */
const slides = document.querySelectorAll(".slide");
const SLIDE_TIME = 6000;
let slideIndex = 0;
let slideTimer;
$("#heroDots").innerHTML = [...slides].map((_, i) =>
  `<button type="button" class="hero-dot" aria-label="${i + 1}번 슬라이드 보기"><span></span></button>`).join("");
const dots = document.querySelectorAll(".hero-dot");

function showSlide(n) {
  slideIndex = (n + slides.length) % slides.length;
  slides.forEach((s, i) => {
    s.classList.toggle("is-active", i === slideIndex);
    s.setAttribute("aria-hidden", i === slideIndex ? "false" : "true");
  });
  dots.forEach((d, i) => { d.classList.remove("is-active"); d.classList.toggle("is-done", i < slideIndex); });
  void dots[slideIndex].offsetWidth;
  dots[slideIndex].classList.add("is-active");
  $("#heroNow").textContent = String(slideIndex + 1).padStart(2, "0");
  clearTimeout(slideTimer);
  slideTimer = setTimeout(() => showSlide(slideIndex + 1), SLIDE_TIME);
}
dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
$("#heroPrev").addEventListener("click", () => showSlide(slideIndex - 1));
$("#heroNext").addEventListener("click", () => showSlide(slideIndex + 1));
let touchX = null;
$(".hero").addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
$(".hero").addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showSlide(slideIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});
showSlide(0);


/* =========================================================
   6. 출조 달력 — 날짜별 날씨 · 출조 · 조과
   ========================================================= */
const tripDates = [...new Set(TRIPS.map(t => t.date))].sort();
const firstMonth = toDate(tripDates[0]);
const lastMonth = toDate(tripDates[tripDates.length - 1]);
let calYear, calMonth, selectedDate;

(function initCalendar() {
  const upcoming = tripDates.find(d => d > todayStr()) || tripDates[tripDates.length - 1];
  selectedDate = upcoming;
  const t = toDate(todayStr());
  const start = t < firstMonth ? firstMonth : t > lastMonth ? lastMonth : t;
  calYear = start.getFullYear();
  calMonth = start.getMonth();
})();

function monthIndex(y, m) { return y * 12 + m; }

function renderCalendar() {
  $("#calTitle").textContent = `${calYear}년 ${calMonth + 1}월`;
  $("#calPrev").disabled = monthIndex(calYear, calMonth) <= monthIndex(firstMonth.getFullYear(), firstMonth.getMonth());
  $("#calNext").disabled = monthIndex(calYear, calMonth) >= monthIndex(lastMonth.getFullYear(), lastMonth.getMonth());

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
  const today = todayStr();
  let html = "";
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day is-blank"></div>`;
  for (let d = 1; d <= lastDate; d++) {
    const date = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(calYear, calMonth, d).getDay();
    const trips = TRIPS.filter(t => t.date === date);
    const wx = getWeather(date);
    const mine = trips.some(t => mySeats(t.id).size > 0);
    const cls = ["cal-day", trips.length ? "has-trip" : "", dow === 0 ? "is-sun" : "", dow === 6 ? "is-sat" : "",
      date === today ? "is-today" : "", date === selectedDate ? "is-selected" : ""].join(" ");
    const tripHTML = trips.map(t => {
      const st = tripState(t);
      const dotCls = mine && mySeats(t.id).size ? "dot-mine" : st === "cancel" ? "dot-cancel" : st === "done" ? "dot-done" : st === "full" ? "dot-full" : "dot-open";
      return `<span class="cal-trip"><i class="dot ${dotCls}"></i><span class="label">${getBoat(t.boatId).name.replace("호", "")} ${getFish(t.fishId).name.split("·")[0]}</span></span>`;
    }).join("");
    html += `<button type="button" class="${cls}" data-date="${date}" aria-label="${dateLabel(date, true)}${trips.length ? `, 출조 ${trips.length}건` : ""}${wx ? `, ${wx.sky}` : ""}">
      <span class="num">${d}</span>
      ${wx ? `<span class="wx">${wxIcon(wx.sky)}<span>${wx.tempMax}°</span></span>` : ""}
      ${tripHTML}
    </button>`;
  }
  $("#calGrid").innerHTML = html;
}

function renderDayPanel() {
  const date = selectedDate;
  const wx = getWeather(date);
  const trips = TRIPS.filter(t => t.date === date);
  const weatherHTML = wx ? `
    <div class="weather-card">
      ${wxIcon(wx.sky)}
      <div><p class="sky">${wx.sky}</p><p class="temp">최저 ${wx.tempMin}° / 최고 ${wx.tempMax}°</p></div>
      <div class="weather-grid">
        <p>바람<b>${wx.wind}</b></p><p>파고<b>${wx.wave}</b></p><p>물때<b>${wx.tide}</b></p>
      </div>
      ${wx.alert ? `<p class="weather-alert">⚠ ${wx.alert}</p>` : ""}
    </div>` : `<div class="no-trip">이 날은 바다 날씨 정보가 없어요.</div>`;

  const tripHTML = trips.length === 0 ? `<div class="no-trip">이 날은 출조가 없어요. 달력에서 점이 있는 날짜를 눌러보세요.</div>`
    : `<div class="day-trips">${trips.map(t => {
        const st = tripState(t), boat = getBoat(t.boatId), fish = getFish(t.fishId), report = getReport(t.id);
        let body = "";
        if (st === "cancel") body = `<p class="meta">기상 악화로 출항이 취소됐어요. 예약하신 분께는 전액 환불됐어요.</p>`;
        else if (st === "done") body = report
          ? `<div class="catch"><b>${report.summary}</b>${report.note}<br><span class="best">🏆 ${report.best}</span> · 승선 ${report.anglers}명</div>
             <button type="button" class="btn btn-line btn-small" data-trip="${t.id}">출조 정보 보기</button>`
          : `<p class="meta">조과를 집계하고 있어요.</p>`;
        else body = `<p class="meta">남은 자리 ${seatsLeft(t)} / ${boat.capacity} · 1인 ${won(t.price)}</p>
          <button type="button" class="btn ${st === "full" ? "btn-line" : "btn-orange"} btn-small" data-trip="${t.id}">${st === "full" ? "좌석 보기 (마감)" : "자리 보고 예약하기"}</button>`;
        return `<div class="day-trip">
          <div class="day-trip-head"><h4>${boat.name} · ${fish.name}</h4><span class="state ${st === "done" ? "is-done" : st === "cancel" ? "is-cancel" : st === "full" ? "is-full" : ""}">${STATE_TEXT[st]}</span></div>
          <p class="meta">대상어종 ${fish.name} · ${t.departTime} 출항 → ${t.returnTime} 입항</p>
          ${body}
        </div>`;
      }).join("")}</div>`;

  $("#dayPanel").innerHTML = `<h3>${dateLabel(date, true)}</h3><p class="day-sub">${PORT.name} 앞바다 · 예시 예보</p>${weatherHTML}${tripHTML}`;
}

$("#calGrid").addEventListener("click", (e) => {
  const day = e.target.closest("[data-date]");
  if (!day) return;
  selectedDate = day.dataset.date;
  renderCalendar();
  renderDayPanel();
});
$("#calPrev").addEventListener("click", () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
$("#calNext").addEventListener("click", () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });


/* =========================================================
   7. 대상어종 · 채비 안내
   ========================================================= */
let tackleFishId = 1;

function tackleListHTML(fish) {
  return `<ul class="tackle-list">
    <li><span>낚싯대</span><b>${fish.rod}</b></li>
    <li><span>릴</span><b>${fish.reel}</b></li>
    <li><span>원줄</span><b>${fish.line}</b></li>
    <li><span>채비</span><b>${fish.rig}</b></li>
    <li><span>미끼</span><b>${fish.bait}</b></li>
    <li><span>더 챙길 것</span><b>${fish.extra}</b></li>
  </ul>`;
}

function renderTackle() {
  $("#fishTabs").innerHTML = FISH.map(f => `
    <button type="button" role="tab" class="fish-tab ${f.id === tackleFishId ? "is-on" : ""}" aria-selected="${f.id === tackleFishId}" data-tackle="${f.id}">
      <img src="${f.image}" alt="">${f.name}
    </button>`).join("");
  const f = getFish(tackleFishId);
  $("#tacklePanel").innerHTML = `
    <img src="${f.image}" alt="${f.name} 그림">
    <div>
      <h3>${f.name}</h3>
      <div class="tackle-meta"><span class="chip chip-orange">제철 ${f.season}</span><span class="chip">${f.method}</span></div>
      ${tackleListHTML(f)}
      <p class="tackle-tip">💡 ${f.tip}</p>
      <p class="tackle-common">공통 준비물: ${COMMON_ITEMS.join(" · ")} · 낚싯대와 릴은 1인 ${won(POLICY.rentalFee)}에 대여할 수 있어요.</p>
      <div class="tackle-actions"><button type="button" class="btn btn-sea btn-small" data-fish="${f.id}">${f.name} 출조 일정 보기</button></div>
    </div>`;
}
$("#fishTabs").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tackle]");
  if (tab) { tackleFishId = Number(tab.dataset.tackle); renderTackle(); }
});


/* =========================================================
   8. 출조 일정 목록 · 검색 · 어종 필터 · 상태 · 정렬
   ========================================================= */
let activeFish = 0;   // 0 = 전체

function renderFilterTabs() {
  $("#filterTabs").innerHTML = [{ id: 0, name: "전체" }, ...FISH].map(f => `
    <button type="button" role="tab" class="filter-tab ${f.id === activeFish ? "is-on" : ""}" aria-selected="${f.id === activeFish}" data-filter="${f.id}">${f.name}</button>`).join("");
}

function renderTrips() {
  const keyword = $("#searchInput").value.trim().toLowerCase();
  const status = $("#statusSelect").value;
  const sort = $("#sortSelect").value;

  let list = TRIPS.filter(t => {
    const st = tripState(t);
    const text = (getBoat(t.boatId).name + " " + getFish(t.fishId).name).toLowerCase();
    const statusOk = status === "all" ? true
      : status === "past" ? (st === "done" || st === "cancel")
      : status === "open" ? (st === "open" || st === "few")
      : (st !== "done" && st !== "cancel");
    return (activeFish === 0 || t.fishId === activeFish) && (keyword === "" || text.includes(keyword)) && statusOk;
  });
  if (sort === "date") list.sort((a, b) => status === "past" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  if (sort === "low") list.sort((a, b) => a.price - b.price || a.date.localeCompare(b.date));
  if (sort === "seats") list.sort((a, b) => seatsLeft(b) - seatsLeft(a));

  $("#resultText").textContent = `출조 ${list.length}건`;
  if (list.length === 0) {
    $("#tripGrid").innerHTML = `<p class="empty">조건에 맞는 출조가 없어요. 어종이나 상태를 바꿔보세요.</p>`;
    return;
  }
  $("#tripGrid").innerHTML = list.map(t => {
    const boat = getBoat(t.boatId), fish = getFish(t.fishId), wx = getWeather(t.date), st = tripState(t);
    const left = seatsLeft(t), report = getReport(t.id);
    const bottom = st === "done" ? `<p class="catch-mini">🎣 ${report ? report.summary : "조과 집계 중"}</p>`
      : st === "cancel" ? `<p class="catch-mini" style="color:var(--red)">기상 악화로 출항 취소</p>`
      : `<div class="seat-meter">남은 자리 ${left} / ${boat.capacity}<div class="bar"><span style="width:${(boat.capacity - left) / boat.capacity * 100}%"></span></div></div>`;
    return `
      <button type="button" class="trip-card" data-trip="${t.id}">
        <div class="thumb">
          <img src="${boat.image}" alt="${boat.name}" loading="lazy">
          <span class="date-badge">${dateLabel(t.date)}</span>
          <span class="status-badge ${st === "full" ? "is-full" : st === "few" ? "is-few" : (st === "done" || st === "cancel") ? "is-past" : ""}">${st === "few" ? `${left}자리 남음` : STATE_TEXT[st]}</span>
        </div>
        <div class="trip-info">
          <div class="fish-line"><span class="chip chip-orange">대상어종 ${fish.name}</span></div>
          <h3>${boat.name}</h3>
          <p class="time">${t.departTime} 출항 → ${t.returnTime} 입항</p>
          ${wx ? `<span class="wx-inline">${wxIcon(wx.sky)}${wx.sky} · 파고 ${wx.wave}</span>` : ""}
          <p class="price">${won(t.price)} <small>/ 1인</small></p>
          ${bottom}
        </div>
      </button>`;
  }).join("");
}

function setFishFilter(id) {
  activeFish = id;
  $("#searchInput").value = "";
  $("#statusSelect").value = "upcoming";
  renderFilterTabs();
  renderTrips();
}
$("#filterTabs").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-filter]");
  if (tab) setFishFilter(Number(tab.dataset.filter));
});
$("#searchInput").addEventListener("input", renderTrips);
$("#statusSelect").addEventListener("change", renderTrips);
$("#sortSelect").addEventListener("change", renderTrips);

// 출조 열기 · 어종 바로가기 (목록 · 달력 · 히어로 · 채비 안내 공통)
document.addEventListener("click", (e) => {
  const tripBtn = e.target.closest("[data-trip]");
  if (tripBtn) { openTrip(Number(tripBtn.dataset.trip)); return; }
  const fishBtn = e.target.closest("[data-fish]");
  if (fishBtn) {
    e.preventDefault();
    setFishFilter(Number(fishBtn.dataset.fish));
    $("#trips").scrollIntoView({ behavior: "smooth" });
  }
});


/* =========================================================
   9. 선박 소개
   ========================================================= */
function renderBoats() {
  $("#boatList").innerHTML = BOATS.map(b => `
    <article class="boat-card">
      <img src="${b.image}" alt="${b.name} 옆모습" loading="lazy">
      <div>
        <h3>${b.name}</h3>
        <div class="tackle-meta" style="margin:0"><span class="chip">정원 ${b.capacity}명</span><span class="chip">${b.tonnage}</span></div>
        <p>${b.intro}</p>
        <p class="spec-line">${b.captain} · ${b.facilities}</p>
        <button type="button" class="btn btn-line btn-small" data-boat="${b.name}">이 배 일정 보기</button>
      </div>
    </article>`).join("");
}
$("#boatList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-boat]");
  if (!btn) return;
  activeFish = 0;
  renderFilterTabs();
  $("#statusSelect").value = "upcoming";
  $("#searchInput").value = btn.dataset.boat;
  renderTrips();
  $("#trips").scrollIntoView({ behavior: "smooth" });
});


/* =========================================================
   10. 출조 상세 + 좌석 배치도
   ========================================================= */
// 배 모양 안에 자리 위치 정하기 (선수 2 · 우현 · 선미 2 · 좌현, 시계 방향 번호)
function seatLayout(capacity) {
  const side = (capacity - 4) / 2;
  const ys = Array.from({ length: side }, (_, i) => side === 1 ? 340 : 168 + i * (352 / (side - 1)));
  const seats = [{ no: 1, x: 126, y: 96, zone: "선수" }, { no: 2, x: 174, y: 96, zone: "선수" }];
  ys.forEach((y, i) => seats.push({ no: 3 + i, x: 238, y, zone: "우현" }));
  seats.push({ no: 3 + side, x: 174, y: 578, zone: "선미" }, { no: 4 + side, x: 126, y: 578, zone: "선미" });
  [...ys].reverse().forEach((y, i) => seats.push({ no: 5 + side + i, x: 62, y, zone: "좌현" }));
  return seats;
}

function seatMapSVG(trip, selected, readonly) {
  const boat = getBoat(trip.boatId);
  const taken = takenSeats(trip.id);
  const mine = mySeats(trip.id);
  const seats = seatLayout(boat.capacity).map(s => {
    const isMine = mine.has(s.no), isTaken = taken.has(s.no) && !isMine, isSel = selected.has(s.no);
    const state = isMine ? "내 자리" : isTaken ? "예약됨" : isSel ? "선택함" : "예약 가능";
    const cls = ["seat", isMine ? "is-mine" : "", isTaken ? "is-taken" : "", isSel ? "is-selected" : ""].join(" ");
    const interactive = !readonly && !isMine && !isTaken;
    return `<g class="${cls}" data-seat="${s.no}" transform="translate(${s.x} ${s.y})" ${interactive ? `role="button" tabindex="0" aria-pressed="${isSel}"` : `role="img"`} aria-label="${s.no}번 자리, ${s.zone}, ${state}">
      <rect x="-16" y="-16" width="32" height="32" rx="8"/><text y="5" text-anchor="middle">${isTaken ? "✕" : s.no}</text></g>`;
  }).join("");
  return `<svg class="seat-map ${readonly ? "is-readonly" : ""}" viewBox="0 0 300 640" role="group" aria-label="${boat.name} 낚시 자리 배치도">
    <path class="hull" d="M150 14 C232 70 272 150 272 236 L272 572 Q272 616 228 616 L72 616 Q28 616 28 572 L28 236 C28 150 68 70 150 14 Z"/>
    <path class="deck" d="M150 44 C212 92 248 160 248 240 L248 562 Q248 594 218 594 L82 594 Q52 594 52 562 L52 240 C52 160 88 92 150 44 Z"/>
    <rect class="cabin" x="104" y="290" width="92" height="160" rx="12"/>
    <text class="cabin-text" x="150" y="366" text-anchor="middle">선실</text>
    <text class="cabin-text" x="150" y="384" text-anchor="middle">조타실</text>
    <text class="zone" x="150" y="140" text-anchor="middle">▲ 선수</text>
    <text class="zone" x="150" y="540" text-anchor="middle">선미</text>
    <text class="zone" x="104" y="240" text-anchor="middle">좌현</text>
    <text class="zone" x="196" y="240" text-anchor="middle">우현</text>
    ${seats}
  </svg>`;
}

let selectedSeats = new Set();
let modalTripId = null;

function openTrip(tripId) {
  modalTripId = tripId;
  selectedSeats = new Set();
  $("#tripBody").innerHTML = "";
  renderTripModal();
  openModal("tripModal");
}

function renderTripModal() {
  const t = getTrip(modalTripId), boat = getBoat(t.boatId), fish = getFish(t.fishId), wx = getWeather(t.date);
  const st = tripState(t), left = seatsLeft(t), report = getReport(t.id);
  const bookable = st === "open" || st === "few";
  const mine = mySeats(t.id);
  const people = selectedSeats.size;
  const rental = $("#rentalCheck") ? $("#rentalCheck").checked : false;
  const total = people * (t.price + (rental ? POLICY.rentalFee : 0));

  let action = "";
  if (st === "cancel") action = `<p class="full-note" style="background:var(--red)">기상 악화로 출항이 취소된 출조예요.</p>`;
  else if (st === "done") action = report
    ? `<div class="catch" style="margin-top:12px"><b>조과: ${report.summary}</b>${report.note}<br><span class="best">🏆 ${report.best}</span> · 승선 ${report.anglers}명</div>`
    : `<p class="full-note">출항을 마친 출조예요. 조과를 집계하고 있어요.</p>`;
  else if (st === "full") action = `<p class="full-note">모든 자리가 예약됐어요. 다른 날짜의 출조를 확인해보세요.</p>`;
  else action = `
    <div class="pick-box">
      <p class="picked">선택한 자리: <b id="pickedText">${people ? [...selectedSeats].sort((a, b) => a - b).map(n => n + "번").join(", ") : "없음"}</b> (최대 ${POLICY.maxSeats}자리)</p>
      <label class="check"><input type="checkbox" id="rentalCheck" ${rental ? "checked" : ""}> 낚싯대·릴 대여 (1인 ${won(POLICY.rentalFee)})</label>
      <div class="total-row"><span>${people}명 · 합계</span><b id="tripTotal">${won(total)}</b></div>
      <button type="button" class="btn btn-orange btn-full" id="reserveBtn" ${people ? "" : "disabled"}>${people ? `${people}자리 예약하기` : "자리를 먼저 골라주세요"}</button>
    </div>`;

  $("#tripBody").innerHTML = `
    <div class="trip-detail">
      <div>
        <div class="tackle-meta" style="margin:0 0 6px"><span class="chip chip-orange">대상어종 ${fish.name}</span><span class="chip">${boat.name}</span></div>
        <h2>${dateLabel(t.date, true)} ${boat.name}</h2>
        <img class="cover" src="${boat.image}" alt="${boat.name}">
        ${wx ? `<div class="weather-card" style="margin-bottom:14px">${wxIcon(wx.sky)}
          <div><p class="sky">${wx.sky}</p><p class="temp">최저 ${wx.tempMin}° / 최고 ${wx.tempMax}° · 예시 예보</p></div>
          <div class="weather-grid"><p>바람<b>${wx.wind}</b></p><p>파고<b>${wx.wave}</b></p><p>물때<b>${wx.tide}</b></p></div>
          ${wx.alert ? `<p class="weather-alert">⚠ ${wx.alert}</p>` : ""}</div>` : ""}
        <ul class="info-list">
          <li><span>대상어종</span><b>${fish.name} (${fish.method})</b></li>
          <li><span>출항 · 입항</span><b>${t.departTime} 출항 → ${t.returnTime} 입항</b></li>
          <li><span>집결</span><b>${PORT.meetPlace} · ${PORT.meetBefore}</b></li>
          <li><span>요금</span><b>1인 ${won(t.price)}</b></li>
          <li><span>정원 · 남은 자리</span><b>${boat.capacity}명 · ${left}자리</b></li>
          <li><span>선장</span><b>${boat.captain}</b></li>
        </ul>
        <div class="tackle-box">
          <h3>🎣 ${fish.name} 출조 — 챙겨올 채비</h3>
          ${tackleListHTML(fish)}
          <p class="tackle-common">공통: ${COMMON_ITEMS.join(" · ")}</p>
        </div>
      </div>
      <div>
        <div class="seat-area">
          <h3>배 안의 낚시 자리</h3>
          <p class="seat-help">${bookable ? "비어 있는 자리를 눌러 선택하세요." : st === "full" ? "예약이 꽉 찬 자리 배치예요." : "자리 배치를 볼 수 있어요."}${mine.size ? ` 내 자리: ${[...mine].sort((a, b) => a - b).join(", ")}번` : ""}</p>
          ${seatMapSVG(t, selectedSeats, !bookable)}
          <div class="legend"><span><i></i>예약 가능</span><span><i class="lg-sel"></i>선택함</span><span><i class="lg-taken"></i>예약됨</span><span><i class="lg-mine"></i>내 자리</span></div>
        </div>
        ${action}
      </div>
    </div>`;

  const map = $("#tripBody .seat-map");
  if (bookable) {
    const toggle = (g) => {
      const no = Number(g.dataset.seat);
      if (selectedSeats.has(no)) selectedSeats.delete(no);
      else if (selectedSeats.size >= POLICY.maxSeats) { toast(`한 번에 최대 ${POLICY.maxSeats}자리까지 예약할 수 있어요.`); return; }
      else selectedSeats.add(no);
      renderTripModal();
      const again = $(`#tripBody .seat[data-seat="${no}"]`);
      if (again) again.focus();
    };
    map.addEventListener("click", (e) => { const g = e.target.closest(".seat[role=button]"); if (g) toggle(g); });
    map.addEventListener("keydown", (e) => {
      const g = e.target.closest(".seat[role=button]");
      if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(g); }
    });
    $("#rentalCheck").addEventListener("change", renderTripModal);
    $("#reserveBtn").addEventListener("click", () => startReservation());
  }
}


/* =========================================================
   11. 회원가입 · 로그인 · 로그아웃
   ========================================================= */
let afterLogin = null;

function openAuth(tab, message, next) {
  afterLogin = next || null;
  switchAuthTab(tab);
  $("#authSub").textContent = message || (tab === "signup" ? "가입하면 3,000P를 바로 드려요." : "로그인하고 예약하면 등급별 포인트를 받아요.");
  openModal("authModal");
}
function switchAuthTab(tab) {
  document.querySelectorAll("[data-auth-tab]").forEach(b => b.classList.toggle("is-on", b.dataset.authTab === tab));
  $("#loginForm").hidden = tab !== "login";
  $("#signupForm").hidden = tab !== "signup";
  $("#authTitle").textContent = tab === "login" ? "로그인" : "회원가입";
  $("#loginError").textContent = "";
  $("#signupError").textContent = "";
  document.querySelectorAll("#authModal input").forEach(i => i.classList.remove("is-error"));
}
document.querySelectorAll("[data-auth-tab]").forEach(btn => btn.addEventListener("click", () => switchAuthTab(btn.dataset.authTab)));

function formError(errorId, inputId, message) {
  $(errorId).textContent = message;
  if (inputId) { $(inputId).classList.add("is-error"); $(inputId).focus(); }
  return false;
}
function formatPhone(value) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
}
$("#signPhone").addEventListener("input", (e) => { e.target.value = formatPhone(e.target.value); });

$("#signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelectorAll("#signupForm input").forEach(i => i.classList.remove("is-error"));
  const name = $("#signName").value.trim();
  const email = $("#signEmail").value.trim().toLowerCase();
  const pw = $("#signPw").value;
  const phone = $("#signPhone").value.trim();
  if (name.length < 2) return formError("#signupError", "#signName", "이름을 2자 이상 입력해주세요.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return formError("#signupError", "#signEmail", "이메일 형식을 확인해주세요.");
  if (db.members.some(m => m.email === email)) return formError("#signupError", "#signEmail", "이미 가입된 이메일이에요.");
  if (pw.length < 8 || !/[a-z]/i.test(pw) || !/\d/.test(pw)) return formError("#signupError", "#signPw", "비밀번호는 영문과 숫자를 섞어 8자 이상이어야 해요.");
  if (pw !== $("#signPw2").value) return formError("#signupError", "#signPw2", "비밀번호가 서로 달라요.");
  if (!/^01\d-\d{3,4}-\d{4}$/.test(phone)) return formError("#signupError", "#signPhone", "휴대폰 번호를 확인해주세요.");
  if (!$("#signAgree").checked) return formError("#signupError", null, "필수 약관에 동의해주세요.");

  const member = { id: nextId(db.members), email, password: hashPassword(pw), name, phone, point: POLICY.signupPoint, totalPurchase: 0, joinedAt: now() };
  db.members.push(member);
  db.pointHistory.push({ id: nextId(db.pointHistory), memberId: member.id, amount: POLICY.signupPoint, reason: "회원가입 축하 포인트", createdAt: now() });
  db.session = member.id;
  save("members", "pointHistory", "session");
  $("#signupForm").reset();
  loginDone(`${name}님, 가입을 환영해요! 3,000P가 지급됐어요.`);
});

$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelectorAll("#loginForm input").forEach(i => i.classList.remove("is-error"));
  const email = $("#loginEmail").value.trim().toLowerCase();
  const member = db.members.find(m => m.email === email);
  if (!email) return formError("#loginError", "#loginEmail", "이메일을 입력해주세요.");
  if (!member || member.password !== hashPassword($("#loginPw").value)) return formError("#loginError", "#loginPw", "이메일 또는 비밀번호가 맞지 않아요.");
  db.session = member.id;
  save("session");
  $("#loginForm").reset();
  loginDone(`${member.name}님, 반가워요!`);
});

function loginDone(message) {
  closeModal("authModal");
  refreshAll();
  toast(message);
  if (afterLogin) { const next = afterLogin; afterLogin = null; next(); }
}
function logout() {
  db.session = null;
  save("session");
  closeModal("myModal");
  refreshAll();
  toast("로그아웃했어요");
}


/* =========================================================
   12. 예약 · 체험 결제 — 실제 결제 없이 예약 내역만 저장
   ========================================================= */
let pending = null;    // { tripId, seats, rental }
let usePoint = 0;

function startReservation() {
  pending = { tripId: modalTripId, seats: [...selectedSeats].sort((a, b) => a - b), rental: $("#rentalCheck").checked };
  closeModal("tripModal");
  if (!currentMember()) { openAuth("login", "로그인하면 고른 자리로 바로 예약을 이어가요.", openCheckout); return; }
  openCheckout();
}

function calcReservation(usePt = 0) {
  const t = getTrip(pending.tripId);
  const member = currentMember();
  const grade = gradeOf(member);
  const people = pending.seats.length;
  const fare = t.price * people;
  const rentalTotal = pending.rental ? POLICY.rentalFee * people : 0;
  const productTotal = fare + rentalTotal;
  const canUse = member && member.point >= POLICY.minUsePoint ? member.point : 0;
  const usedPoint = Math.max(0, Math.min(usePt, canUse, productTotal));
  const payTotal = productTotal - usedPoint;
  const earnPoint = Math.floor(payTotal * grade.rate);
  return { people, fare, rentalTotal, productTotal, usedPoint, payTotal, earnPoint, grade };
}

function openCheckout() {
  if (!pending) return;
  const member = currentMember();
  const t = getTrip(pending.tripId), boat = getBoat(t.boatId), fish = getFish(t.fishId);
  const taken = takenSeats(t.id);
  if (pending.seats.some(s => taken.has(s))) { toast("그 사이 다른 분이 예약한 자리가 있어요. 자리를 다시 골라주세요."); openTrip(t.id); return; }
  usePoint = 0;

  $("#checkoutBody").innerHTML = `
    <form class="checkout" id="checkoutForm" novalidate>
      <div>
        <h3>승선자 명단 (승선명부)</h3>
        <p class="help" style="margin:-4px 0 10px">해양경찰 승선명부 작성을 위해 자리마다 승선자 이름과 연락처를 적어주세요.</p>
        ${pending.seats.map((s, i) => `
          <div class="passenger">
            <span class="seat-no">${s}번</span>
            <label class="field">승선자 이름<input data-p-name="${s}" value="${i === 0 ? escapeHTML(member.name) : ""}" placeholder="이름"></label>
            <label class="field">연락처<input data-p-phone="${s}" value="${i === 0 ? escapeHTML(member.phone) : ""}" placeholder="010-0000-0000" inputmode="tel"></label>
          </div>`).join("")}

        <h3>포인트 사용</h3>
        <div class="point-line">
          <input id="pointInput" inputmode="numeric" placeholder="0" aria-label="사용할 포인트" ${member.point < POLICY.minUsePoint ? "disabled" : ""}>
          <button type="button" class="btn btn-line" id="pointAllBtn" ${member.point < POLICY.minUsePoint ? "disabled" : ""}>모두 사용</button>
        </div>
        <p class="help">보유 ${point(member.point)} · ${member.point < POLICY.minUsePoint ? "1,000P 이상 모이면 쓸 수 있어요" : "1P = 1원"}</p>

        <h3>결제 수단</h3>
        <div class="pay-list">
          ${PAY_METHODS.map((m, i) => `<label class="pay-item"><input type="radio" name="payMethod" value="${m}" ${i === 0 ? "checked" : ""}><span>${m}</span></label>`).join("")}
        </div>
        <label class="check" style="margin-top:14px"><input type="checkbox" id="safetyAgree"> 승선 시 신분증 지참, 구명조끼 착용, ${fish.name} 채비 안내를 확인했어요. (필수)</label>
      </div>

      <div class="order-box">
        <h3>예약 내용</h3>
        <ul class="info-list">
          <li><span>출조</span><b>${dateLabel(t.date, true)} ${t.departTime}</b></li>
          <li><span>선박</span><b>${boat.name}</b></li>
          <li><span>대상어종</span><b>${fish.name}</b></li>
          <li><span>자리</span><b>${pending.seats.join(", ")}번</b></li>
          <li><span>대여</span><b>${pending.rental ? "낚싯대·릴 대여" : "개인 장비"}</b></li>
        </ul>
        <div class="summary" id="checkoutSummary"></div>
        <p class="form-error" id="checkoutError" role="alert"></p>
        <button type="submit" class="btn btn-orange btn-full" id="payBtn">체험 결제하기</button>
      </div>
    </form>`;

  document.querySelectorAll("[data-p-phone]").forEach(inp => inp.addEventListener("input", () => { inp.value = formatPhone(inp.value); }));
  const pointInput = $("#pointInput");
  pointInput.addEventListener("input", () => {
    const value = Number(pointInput.value.replace(/\D/g, "")) || 0;
    usePoint = calcReservation(value).usedPoint;
    pointInput.value = usePoint ? usePoint : "";
    renderCheckoutSummary();
  });
  $("#pointAllBtn").addEventListener("click", () => {
    usePoint = calcReservation(Infinity).usedPoint;
    pointInput.value = usePoint;
    renderCheckoutSummary();
  });
  $("#checkoutForm").addEventListener("submit", (e) => { e.preventDefault(); placeReservation(); });
  renderCheckoutSummary();
  openModal("checkoutModal");
}

function renderCheckoutSummary() {
  const c = calcReservation(usePoint);
  $("#checkoutSummary").innerHTML = `
    <div class="summary-row"><span>승선 요금 (${c.people}명)</span><span>${won(c.fare)}</span></div>
    ${c.rentalTotal ? `<div class="summary-row"><span>장비 대여 (${c.people}명)</span><span>${won(c.rentalTotal)}</span></div>` : ""}
    <div class="summary-row"><span>포인트 사용</span><span class="minus">−${won(c.usedPoint)}</span></div>
    <div class="summary-row total"><span>결제금액</span><span>${won(c.payTotal)}</span></div>
    <p class="summary-note">${c.grade.name} ${Math.round(c.grade.rate * 100)}% · ${point(c.earnPoint)} 적립 예정</p>`;
  $("#payBtn").textContent = `${won(c.payTotal)} 체험 결제하기`;
}

function placeReservation() {
  const member = currentMember();
  document.querySelectorAll("#checkoutForm input").forEach(i => i.classList.remove("is-error"));
  const passengers = [];
  for (const s of pending.seats) {
    const nameEl = document.querySelector(`[data-p-name="${s}"]`), phoneEl = document.querySelector(`[data-p-phone="${s}"]`);
    if (nameEl.value.trim().length < 2) { nameEl.classList.add("is-error"); nameEl.focus(); return formError("#checkoutError", null, `${s}번 자리 승선자 이름을 적어주세요.`); }
    if (phoneEl.value.replace(/\D/g, "").length < 10) { phoneEl.classList.add("is-error"); phoneEl.focus(); return formError("#checkoutError", null, `${s}번 자리 연락처를 확인해주세요.`); }
    passengers.push({ seat: s, name: nameEl.value.trim(), phone: phoneEl.value.trim() });
  }
  if (!$("#safetyAgree").checked) return formError("#checkoutError", null, "승선 안내 확인에 체크해주세요.");
  const taken = takenSeats(pending.tripId);
  if (pending.seats.some(s => taken.has(s))) return formError("#checkoutError", null, "이미 예약된 자리가 있어요. 자리를 다시 골라주세요.");

  const c = calcReservation(usePoint);
  const gradeBefore = gradeOf(member);
  const res = {
    id: nextId(db.reservations), memberId: member.id, tripId: pending.tripId, seats: pending.seats,
    people: c.people, rental: pending.rental, productTotal: c.productTotal, usedPoint: c.usedPoint,
    payTotal: c.payTotal, earnPoint: c.earnPoint, payMethod: document.querySelector("input[name=payMethod]:checked").value,
    passengers, status: "예약확정", createdAt: now()
  };
  db.reservations.push(res);
  if (c.usedPoint > 0) {
    member.point -= c.usedPoint;
    db.pointHistory.push({ id: nextId(db.pointHistory), memberId: member.id, amount: -c.usedPoint, reason: `예약 #${res.id} 포인트 사용`, createdAt: now() });
  }
  member.point += c.earnPoint;
  member.totalPurchase += c.productTotal;
  if (c.earnPoint > 0) db.pointHistory.push({ id: nextId(db.pointHistory), memberId: member.id, amount: c.earnPoint, reason: `예약 #${res.id} 적립 (${c.grade.name} ${Math.round(c.grade.rate * 100)}%)`, createdAt: now() });
  save("reservations", "members", "pointHistory");

  const gradeAfter = gradeOf(member);
  const t = getTrip(res.tripId), boat = getBoat(t.boatId), fish = getFish(t.fishId);
  pending = null;
  closeModal("checkoutModal");
  refreshAll();

  $("#doneBody").innerHTML = `
    <div class="done">
      <div class="done-icon" aria-hidden="true">✓</div>
      <h2 id="doneTitle">예약이 확정됐어요</h2>
      <p class="modal-sub">체험 결제라 실제 결제는 이루어지지 않았어요.</p>
      ${gradeAfter.id !== gradeBefore.id ? `<p class="grade-up">등급이 올랐어요! <b>${gradeBefore.name}</b> → <b>${gradeAfter.name}</b> (${Math.round(gradeAfter.rate * 100)}% 적립)</p>` : ""}
      <div class="receipt">
        <div class="summary-row"><span>예약번호</span><b>#${res.id}</b></div>
        <div class="summary-row"><span>출조</span><span>${dateLabel(t.date)} ${t.departTime} · ${boat.name}</span></div>
        <div class="summary-row"><span>대상어종 · 자리</span><span>${fish.name} · ${res.seats.join(", ")}번</span></div>
        <div class="summary-row"><span>집결</span><span>${PORT.meetBefore}</span></div>
        <div class="summary-row"><span>적립 포인트</span><span>+${point(res.earnPoint)}</span></div>
        <div class="summary-row total"><span>결제금액</span><span>${won(res.payTotal)}</span></div>
      </div>
      <div class="bring"><b>🎣 챙겨올 것 — ${fish.name} 출조</b>
        <ul>
          ${res.rental ? "<li>낚싯대·릴은 대여해 드려요</li>" : `<li>${fish.rod} / ${fish.reel}</li><li>원줄 ${fish.line}</li>`}
          <li>${fish.rig}</li><li>미끼: ${fish.bait}</li><li>${fish.extra}</li>
          ${COMMON_ITEMS.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
      <div class="btn-row">
        <button type="button" class="btn btn-line" id="doneMyBtn">예약 내역 보기</button>
        <button type="button" class="btn btn-sea" data-close>확인</button>
      </div>
    </div>`;
  $("#doneMyBtn").onclick = () => { closeModal("doneModal"); openMyPage("reservations"); };
  openModal("doneModal");
}


/* =========================================================
   13. 마이페이지 — 예약 내역 · 취소 · 포인트 · 회원 정보
   ========================================================= */
let myTab = "reservations";
let cancelAsk = null;   // 취소 버튼을 한 번 누른 예약 번호

function openMyPage(tab) { if (tab) myTab = tab; cancelAsk = null; renderMyPage(); openModal("myModal"); }

function renderMyPage() {
  const member = currentMember();
  if (!member) return;
  const grade = gradeOf(member), next = nextGradeOf(grade);
  const percent = next ? Math.min(100, (member.totalPurchase - grade.minTotal) / (next.minTotal - grade.minTotal) * 100) : 100;
  const myRes = db.reservations.filter(r => r.memberId === member.id).reverse();
  const myPoints = db.pointHistory.filter(h => h.memberId === member.id).reverse();

  let content = "";
  if (myTab === "reservations") {
    content = myRes.length === 0 ? `<p class="empty-box"><b>아직 예약이 없어요</b>달력이나 출조 일정에서 자리를 골라 예약해보세요.</p>`
      : myRes.map(r => {
        const t = getTrip(r.tripId), boat = getBoat(t.boatId), fish = getFish(t.fishId), st = tripState(t);
        const canCancel = r.status === "예약확정" && st !== "done" && st !== "cancel";
        const statusText = r.status === "예약취소" ? "예약 취소" : st === "done" ? "출항 완료" : st === "cancel" ? "기상 취소 · 환불" : "예약 확정";
        return `
        <div class="res-card ${r.status === "예약취소" ? "is-cancel" : ""}">
          <div class="res-head"><span>예약 #${r.id} · ${r.createdAt}</span><span class="status">${statusText}</span></div>
          <h3>${dateLabel(t.date, true)} ${t.departTime} · ${boat.name}</h3>
          <p>대상어종 ${fish.name} · ${r.seats.join(", ")}번 자리 (${r.people}명)${r.rental ? " · 장비 대여" : ""}</p>
          <div class="res-foot">
            <span>${won(r.payTotal)} · ${r.payMethod}</span>
            <div class="res-actions">
              <button type="button" class="btn btn-line btn-small" data-trip="${t.id}">자리 · 채비 보기</button>
              ${canCancel ? `<button type="button" class="btn ${cancelAsk === r.id ? "btn-orange" : "btn-line"} btn-small" data-cancel="${r.id}">${cancelAsk === r.id ? "한 번 더 누르면 취소돼요" : "예약 취소"}</button>` : ""}
            </div>
          </div>
        </div>`;
      }).join("");
  } else if (myTab === "points") {
    content = myPoints.map(h => `
      <div class="point-row"><div>${h.reason}<small>${h.createdAt}</small></div>
      <span class="${h.amount > 0 ? "plus" : "minus"}">${h.amount > 0 ? "+" : ""}${point(h.amount)}</span></div>`).join("");
  } else {
    content = `
      <ul class="info-list">
        <li><span>이름</span><b>${escapeHTML(member.name)}</b></li>
        <li><span>이메일</span><b>${escapeHTML(member.email)}</b></li>
        <li><span>휴대폰</span><b>${escapeHTML(member.phone)}</b></li>
        <li><span>가입일</span><b>${member.joinedAt}</b></li>
        <li><span>누적 예약금액</span><b>${won(member.totalPurchase)}</b></li>
      </ul>
      <button type="button" class="btn btn-line" id="logoutBtn">로그아웃</button>`;
  }

  $("#myBody").innerHTML = `
    <h2 id="myTitle">마이페이지</h2>
    <div class="my-top">
      <h2>${escapeHTML(member.name)}님은 <span class="grade-chip">${grade.name}</span></h2>
      <div class="my-stats">
        <p class="point">보유 포인트<b>${point(member.point)}</b></p>
        <p>누적 예약<b>${won(member.totalPurchase)}</b></p>
        <p>적립률<b>${Math.round(grade.rate * 100)}%</b></p>
      </div>
      <div class="progress">${next ? `${next.name}까지 ${won(next.minTotal - member.totalPurchase)} 남았어요` : "최고 등급이에요!"}
        <div class="progress-bar"><span style="width:${percent}%"></span></div>
      </div>
    </div>
    <div class="my-tabs" role="tablist">
      ${[["reservations", "예약 내역"], ["points", "포인트 내역"], ["info", "회원 정보"]].map(([k, l]) =>
        `<button type="button" role="tab" data-my-tab="${k}" class="${myTab === k ? "is-on" : ""}" aria-selected="${myTab === k}">${l}</button>`).join("")}
    </div>
    ${content}`;
}

function cancelReservation(id) {
  const member = currentMember();
  const r = db.reservations.find(x => x.id === id && x.memberId === member.id);
  if (!r || r.status !== "예약확정") return;
  r.status = "예약취소";
  r.canceledAt = now();
  if (r.usedPoint > 0) {
    member.point += r.usedPoint;
    db.pointHistory.push({ id: nextId(db.pointHistory), memberId: member.id, amount: r.usedPoint, reason: `예약 #${r.id} 취소 — 사용 포인트 반환`, createdAt: now() });
  }
  if (r.earnPoint > 0) {
    const back = Math.min(r.earnPoint, member.point);
    member.point -= back;
    db.pointHistory.push({ id: nextId(db.pointHistory), memberId: member.id, amount: -back, reason: `예약 #${r.id} 취소 — 적립 포인트 회수`, createdAt: now() });
  }
  member.totalPurchase = Math.max(0, member.totalPurchase - r.productTotal);
  save("reservations", "members", "pointHistory");
  refreshAll();
  toast(`예약 #${r.id}을 취소했어요. 자리가 다시 열렸어요.`);
}

$("#myBody").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-my-tab]");
  if (tab) { myTab = tab.dataset.myTab; cancelAsk = null; renderMyPage(); return; }
  const cancel = e.target.closest("[data-cancel]");
  if (cancel) {
    const id = Number(cancel.dataset.cancel);
    if (cancelAsk === id) { cancelAsk = null; cancelReservation(id); }
    else cancelAsk = id;
    renderMyPage();
    return;
  }
  if (e.target.closest("[data-trip]")) closeModal("myModal");
  if (e.target.closest("#logoutBtn")) logout();
});


/* =========================================================
   14. 멤버십 등급 안내
   ========================================================= */
function renderGrades() {
  const member = currentMember();
  const mine = member ? gradeOf(member) : null;
  $("#gradeList").innerHTML = GRADES.map((g, i) => `
    <div class="grade-card ${i === GRADES.length - 1 ? "is-top" : ""} ${mine && mine.id === g.id ? "is-mine" : ""}">
      <span class="level">LEVEL ${g.id}</span>
      <h3>${g.name}</h3>
      <p class="rate">${Math.round(g.rate * 100)}%<small>적립</small></p>
      <p class="cond">${g.minTotal === 0 ? "가입하면 바로" : `누적 ${won(g.minTotal)} 이상`}</p>
      ${mine && mine.id === g.id ? `<span class="mine">내 등급</span>` : ""}
    </div>`).join("");
}


/* =========================================================
   15. 처음 실행
   ========================================================= */
function refreshAll() {
  renderHeader();
  renderCalendar();
  renderDayPanel();
  renderTackle();
  renderFilterTabs();
  renderTrips();
  renderBoats();
  renderGrades();
}
refreshAll();
