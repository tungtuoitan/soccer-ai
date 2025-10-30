import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Quick helpers ---
const cn = (...cls) => cls.filter(Boolean).join(" ");

// Fake data (expanded for richer demo text)
const TEAMS = {
  ARS: { name: "Arsenal", logo: "🟥" },
  CHE: { name: "Chelsea", logo: "🟦" },
  MCI: { name: "Man City", logo: "🟦" },
  LIV: { name: "Liverpool", logo: "🟥" },
  RMA: { name: "Real", logo: "⚪️" },
  BAR: { name: "Barce", logo: "🟦🟥" },
};

const DUMMY_MATCHES_TODAY = [
  {
    id: "EPL2025-12345",
    league: "Premier League",
    kickoff: "2025-10-27T20:00:00Z",
    home: { id: "ARS", score: 2 },
    away: { id: "CHE", score: 1 },
    status: "FT",
    venue: "Emirates Stadium",
    headline: "Arsenal ngược dòng đầy cảm xúc",
  },
  {
    id: "EPL2025-12346",
    league: "Premier League",
    kickoff: "2025-10-27T22:30:00Z",
    home: { id: "MCI", score: null },
    away: { id: "LIV", score: null },
    status: "PRE",
    venue: "Etihad Stadium",
    headline: "Đại chiến pressing: Pep vs Klopp",
  },
  {
    id: "UCL2025-20001",
    league: "UEFA Champions League",
    kickoff: "2025-10-28T01:00:00Z",
    home: { id: "RMA", score: null },
    away: { id: "BAR", score: null },
    status: "PRE",
    venue: "Santiago Bernabéu",
    headline: "El Clásico phiên bản châu Âu",
  },
  {
    id: "EPL2025-12347",
    league: "Premier League",
    kickoff: "2025-10-28T15:00:00Z",
    home: { id: "LIV", score: 3 },
    away: { id: "MCI", score: 1 },
    status: "FT",
    venue: "Anfield",
    headline: "Liverpool thắng thuyết phục Man City",
  },
  {
    id: "EPL2025-12348",
    league: "Premier League",
    kickoff: "2025-10-28T18:30:00Z",
    home: { id: "ARS", score: 1 },
    away: { id: "LIV", score: 2 },
    status: "FT",
    venue: "Emirates Stadium",
    headline: "Liverpool chiến thắng ngoài sân",
  },
  {
    id: "EPL2025-12349",
    league: "Premier League",
    kickoff: "2025-10-29T16:00:00Z",
    home: { id: "CHE", score: null },
    away: { id: "MCI", score: null },
    status: "PRE",
    venue: "Stamford Bridge",
    headline: "Chelsea đối đầu Man City",
  },
  {
    id: "UCL2025-20002",
    league: "UEFA Champions League",
    kickoff: "2025-10-29T20:00:00Z",
    home: { id: "BAR", score: null },
    away: { id: "ARS", score: null },
    status: "PRE",
    venue: "Camp Nou",
    headline: "Barcelona vs Arsenal",
  },
  {
    id: "UCL2025-20003",
    league: "UEFA Champions League",
    kickoff: "2025-10-29T22:45:00Z",
    home: { id: "RMA", score: 4 },
    away: { id: "CHE", score: 0 },
    status: "FT",
    venue: "Santiago Bernabéu",
    headline: "Real Madrid thắng đậm Chelsea",
  },
  {
    id: "EPL2025-12350",
    league: "Premier League",
    kickoff: "2025-10-30T14:00:00Z",
    home: { id: "LIV", score: null },
    away: { id: "ARS", score: null },
    status: "PRE",
    venue: "Anfield",
    headline: "Liverpool vs Arsenal showdown",
  },
  {
    id: "EPL2025-12351",
    league: "Premier League",
    kickoff: "2025-10-30T16:30:00Z",
    home: { id: "MCI", score: 2 },
    away: { id: "BAR", score: 1 },
    status: "LIVE",
    venue: "Etihad Stadium",
    headline: "Trận đấu đang diễn ra",
  },
  {
    id: "UCL2025-20004",
    league: "UEFA Champions League",
    kickoff: "2025-10-30T19:00:00Z",
    home: { id: "CHE", score: null },
    away: { id: "LIV", score: null },
    status: "PRE",
    venue: "Stamford Bridge",
    headline: "Chelsea vs Liverpool UCL",
  },
  {
    id: "UCL2025-20005",
    league: "UEFA Champions League",
    kickoff: "2025-10-30T21:45:00Z",
    home: { id: "ARS", score: null },
    away: { id: "RMA", score: null },
    status: "PRE",
    venue: "Emirates Stadium",
    headline: "Arsenal vs Real Madrid",
  },
  {
    id: "EPL2025-12352",
    league: "Premier League",
    kickoff: "2025-10-31T15:00:00Z",
    home: { id: "BAR", score: null },
    away: { id: "CHE", score: null },
    status: "PRE",
    venue: "Camp Nou",
    headline: "Barcelona vs Chelsea",
  },
  {
    id: "EPL2025-12353",
    league: "Premier League",
    kickoff: "2025-10-31T17:30:00Z",
    home: { id: "RMA", score: 1 },
    away: { id: "LIV", score: 3 },
    status: "FT",
    venue: "Santiago Bernabéu",
    headline: "Liverpool thắng Real Madrid",
  },
  {
    id: "UCL2025-20006",
    league: "UEFA Champions League",
    kickoff: "2025-10-31T20:00:00Z",
    home: { id: "MCI", score: null },
    away: { id: "ARS", score: null },
    status: "PRE",
    venue: "Etihad Stadium",
    headline: "Man City vs Arsenal UCL",
  },
  {
    id: "UCL2025-20007",
    league: "UEFA Champions League",
    kickoff: "2025-10-31T22:45:00Z",
    home: { id: "LIV", score: null },
    away: { id: "BAR", score: null },
    status: "PRE",
    venue: "Anfield",
    headline: "Liverpool vs Barcelona",
  },
];

const DUMMY_NEWS = [
  {
    id: "n1",
    title: "Arsenal hạ Chelsea 2-1: Bước ngoặt từ băng ghế dự bị",
    time: "2025-10-27T22:20:00Z",
    matchId: "EPL2025-12345",
    image: "/imgs/skysports-euro-2024-football-6593133-1145.jpg.webp",
    summary:
      "Sau hiệp một bế tắc, Arteta điều chỉnh nhịp pressing và tung tiền đạo dự bị ở phút 72. Từ đó, Arsenal tạo ra chuỗi cơ hội liên tiếp, trước khi ghi bàn quyết định phút 84. Chelsea suy giảm thể lực thấy rõ giai đoạn 70'-90'.",
    body:
      "Arsenal chơi kiên nhẫn, chuyển trạng thái nhanh và khai thác khoảng trống sau lưng hàng tiền vệ Chelsea. Dữ liệu cho thấy tần suất tranh chấp tay đôi thành công của Chelsea giảm 17% so với 60 phút đầu."
  },
  {
    id: "n2",
    title: "Man City vs Liverpool: 5 câu hỏi chiến thuật trước giờ bóng lăn",
    time: "2025-10-27T18:00:00Z",
    matchId: "EPL2025-12346",
    image: "/imgs/ha-lan-2-167002630753887058358.webp",
    summary:
      "Đôi bên nhiều khả năng chơi pressing tầm cao, với điểm nhấn ở hành lang trong. Liệu Klopp có dùng 'false 9' để kéo trung vệ City khỏi vị trí?",
    body:
      "Các thông số 5 trận gần nhất cho thấy City kiểm soát bóng trung bình 62% nhưng dễ tổn thương khi bị phản pressing ngay sau mất bóng. Liverpool tăng cường cánh phải với tốc độ và các đường căng ngang sớm."
  },
  {
    id: "n3",
    title: "El Clásico châu Âu: Real Madrid muốn đánh nhanh ở nửa đầu",
    time: "2025-10-27T19:30:00Z",
    matchId: "UCL2025-20001",
    image: "/imgs/skysports-euro-2024-football-6593133-1145.jpg.webp",
    summary:
      "Ancelotti úp mở về mũi nhọn tốc độ, nhắm đánh vào khoảng trống hai biên của Barca, trong khi Xavi hướng tới kiểm soát nhịp độ và chia nhỏ pressing theo block.",
    body:
      "Madrid đang có hiệu suất dứt điểm chuyển hóa (xG to goal) tốt nhất UCL mùa này. Barca cần giữ khoảng cách giữa tuyến giữa – hậu vệ không quá 20m để hạn chế các đường chọc khe."
  },
  {
    id: "n4",
    title: "Mbappe ra mắt Real Madrid: Khởi đầu hoàn hảo tại Bernabeu",
    time: "2025-10-27T16:45:00Z",
    matchId: "UCL2025-20001",
    image: "/imgs/skysports-euro-2024-football-6593133-1145.jpg.webp",
    summary:
      "Siêu sao người Pháp ghi hat-trick trong trận ra mắt, thể hiện sự kết hợp ăn ý với Vinicius Jr. và Bellingham. Ancelotti khẳng định đã tìm được công thức hoàn hảo.",
    body:
      "Mbappe chạy chỗ thông minh, tận dụng tốc độ để xé toạc hàng thủ đối phương. Cầu thủ 25 tuổi hoàn thành 3 bàn thắng chỉ trong 67 phút thi đấu, khiến CĐV Madrid phấn khích tột độ."
  },
  {
    id: "n5",
    title: "Premier League: Cuộc đua Top 4 gay cấn hơn bao giờ hết",
    time: "2025-10-27T14:30:00Z",
    matchId: "EPL2025-12345",
    image: "/imgs/ha-lan-2-167002630753887058358.webp",
    summary:
      "Với chỉ 5 điểm cách biệt giữa vị trí thứ 3 và thứ 8, Premier League mùa này hứa hẹn những tuần cuối căng thẳng. Arsenal, Chelsea, Newcastle đều có cơ hội như nhau.",
    body:
      "Phong độ thất thường của các ông lớn tạo nên một Premier League không thể đoán trước. Mỗi trận đấu đều quan trọng trong cuộc đua Champions League và Europa League."
  },
  {
    id: "n6",
    title: "Erling Haaland: Cỗ máy ghi bàn đáng sợ nhất châu Âu",
    time: "2025-10-27T12:15:00Z",
    matchId: "EPL2025-12346",
    image: "/imgs/skysports-euro-2024-football-6593133-1145.jpg.webp",
    summary:
      "Với 28 bàn thắng sau 20 trận, tiền đạo Na Uy đang trên đường phá vỡ mọi kỷ lục ghi bàn tại Premier League. Pep Guardiola tiết lộ bí quyết khai thác tối đa tài năng của học trò.",
    body:
      "Haaland không chỉ ghi bàn nhiều mà còn ghi bàn đúng lúc. Khả năng di chuyển trong vòng cấm và bản năng săn bàn thiên bẩm khiến anh trở thành nỗi ám ảnh của mọi hàng thủ."
  },
];

const DUMMY_COMMUNITY = [
  {
    id: "p1",
    author: "@gunnerVN",
    matchId: "EPL2025-12345",
    content:
      "Phút 72 là chìa khóa. Thay người + đổi hướng triển khai sang biên phải khiến Chelsea vỡ cấu trúc. Tốc độ luân chuyển bóng khác hẳn!",
    createdAt: "2025-10-27T21:18:00Z",
    likes: 42,
    replies: [
      { id: "c1", author: "@blueLondon", content: "Chúng tôi thua ở thể lực và khoảng trống half-space." },
      { id: "c2", author: "@tactico", content: "Arsenal chuyển từ 4-3-3 sang 3-2-5 khi tấn công, cực kỳ hiệu quả." },
    ],
  },
  {
    id: "p2",
    author: "@dataBall",
    matchId: "EPL2025-12345",
    content:
      "xG hiệp 2 ARS ~1.12, CHE ~0.41 (ước lượng). Momentum tăng mạnh sau phút 70. Nếu có shot map sẽ thấy cụm cơ hội dày đặc vùng cấm trái.",
    createdAt: "2025-10-27T22:00:00Z",
    likes: 17,
    replies: [],
  },
  {
    id: "p3",
    author: "@kopVN",
    matchId: "EPL2025-12346",
    content:
      "Dự đoán hiệp 1 tốc độ rất cao. Hy vọng Klopp thử sơ đồ 3 tiền vệ công để ép trái City.",
    createdAt: "2025-10-27T20:10:00Z",
    likes: 9,
    replies: [],
  },
];

// Fake AI engine (more flavorful responses + suggestions)
function useFakeAI() {
  const [isLoading, setIsLoading] = useState(false);
  const ask = async (question, context) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);

    const q = question.trim();
    if (context?.type === "match" && context?.status === "PRE") {
      return (
        `📌 Trước trận: 
` +
        `• Form 5 trận gần nhất tương đương, lợi thế sân nhà nghiêng về đội chủ nhà.
` +
        `• Key duel: hành lang trong (half-space) và chuyển đổi trạng thái sau mất bóng.
` +
        `• Câu hỏi bạn hỏi: “${q}”.
` +
        `👉 Gợi ý: hỏi thêm ‘đội hình dự kiến’, ‘odds mở/đóng’, hoặc ‘đối đầu 5 trận’.`
      );
    }
    if (context?.type === "match" && context?.status !== "PRE") {
      return (
        `🧾 Tóm tắt nhanh: 
` +
        `• Bước ngoặt phút 70-85, thay người thay đổi nhịp pressing.
` +
        `• xG ~ 1.8 vs 1.2, sút 13 vs 9.
` +
        `• Câu hỏi bạn hỏi: “${q}”.
` +
        `👉 Gợi ý: ‘timeline theo phút’, ‘shot map hiệp 2’, ‘MVP trận’.`
      );
    }
    return (
      `🤖 Q&A theo ngữ cảnh bài viết:
` +
      `• “${q}”
` +
      `• Mẹo: hỏi về ‘vì sao thay người phút 72’, ‘phát biểu HLV’, hoặc ‘chấn thương ảnh hưởng’.`
    );
  };
  return { ask, isLoading };
}

// UI atoms
function Badge({ children }) {
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900/5 text-slate-700 border border-slate-200">{children}</span>;
}

function StatPill({ label, value, subtle }) {
  return (
    <div className={cn("px-3 py-1 rounded-full border text-xs", subtle ? "border-slate-200 text-slate-500" : "border-slate-300 text-slate-700")}> 
      <span className="font-medium mr-1">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function TeamChip({ id }) {
  const t = TEAMS[id];
  if (!t) return null;
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-lg" aria-hidden>{t.logo}</span>
      <span className="font-medium">{t.name}</span>
    </div>
  );
}

function TopicFilters({ value, onChange }) {
  const opts = ["Tất cả", "Premier League", "UCL", "Phân tích dữ liệu", "Chuyển nhượng"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {opts.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={cn("px-3 py-1.5 rounded-full border text-sm", value === o ? "bg-slate-900 text-white" : "hover:bg-white bg-white/60 backdrop-blur")}>{o}</button>
      ))}
    </div>
  );
}

function SuggestChips({ items, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <button key={t} onClick={() => onPick(t)} className="text-xs px-2.5 py-1 rounded-full border bg-white hover:bg-slate-50">{t}</button>
      ))}
    </div>
  );
}

function MatchCard({ match, onOpen }) {
  const statusColor =
    match.status === "FT"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : match.status === "LIVE"
      ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
      : "bg-sky-50 text-sky-700 border-sky-200";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onOpen?.(match)}
      className="w-[20rem] shrink-0 text-left rounded-3xl border p-5 hover:shadow-md transition bg-white/70 backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div className={cn("px-2 py-0.5 rounded-full border text-[10px]", statusColor)}>{match.status}</div>
        <div className="text-[10px] text-slate-500">{new Date(match.kickoff).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <TeamChip id={match.home.id} />
        <div className="font-extrabold text-2xl tracking-tight">{match.home.score ?? "-"} : {match.away.score ?? "-"}</div>
        <TeamChip id={match.away.id} />
      </div>
      <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
        <Badge>{match.league}</Badge>
        <span>· {match.venue}</span>
      </div>
      {/* {match.headline && <p className="mt-2 text-sm text-slate-700 line-clamp-2">{match.headline}</p>} */}
    </motion.button>
  );
}

function FeaturedNewsCard({ item, onAsk }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-3xl border bg-white/80 backdrop-blur hover:shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Content - Left side */}
        <div className="flex-1 p-6 h-56 md:h-80 flex flex-col justify-between">
          <div className="overflow-hidden">
            <div className="text-xs text-slate-500 mb-2">{new Date(item.time).toLocaleString()}</div>
            <h2 className="text-2xl font-bold leading-tight mb-3 text-slate-900 line-clamp-3">{item.title}</h2>
            <p className="text-slate-600 mb-4 leading-relaxed line-clamp-4">{item.summary}</p>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <button className="px-4 py-2 text-sm rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-colors" onClick={() => onAsk?.(item)}>
              Hỏi AI về bài này
            </button>
            <div className="text-xs text-slate-400">Trận liên quan: <span className="underline text-sky-600">{item.matchId}</span></div>
          </div>
        </div>
        
        {/* Image - Right side */}
        {item.image && (
          <div className="relative w-full md:w-2/3 h-56 md:h-80 overflow-hidden shrink-0">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NewsCard({ item, onAsk }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-3xl border bg-white/80 backdrop-blur hover:shadow-md overflow-hidden">
      {/* Image */}
      {item.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-5 relative">
        {/* <div className="text-xs text-slate-500">{new Date(item.time).toLocaleString()}</div> */}
        <h3 className="mt-1 font-semibold leading-snug text-lg pr-16">{item.title}</h3>
        {/* <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.summary}</p> */}
        {/* {item.body && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.body}</p>} */}
        
        {/* Icon buttons in bottom right corner */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded-full hover:bg-sky-100 flex items-center justify-center text-sky-600 transition-colors" 
            onClick={() => onAsk?.(item)}
            title="Hỏi AI về bài này"
          >
            🤖
          </button>
          <div className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 text-xs transition-colors" title={`Trận: ${item.matchId}`}>
            ⚽
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CommunityPost({ post }) {
  return (
    <div className="rounded-3xl border p-5 bg-white/80 backdrop-blur">
      <div className="text-sm"><span className="font-semibold">{post.author}</span> · <span className="text-slate-500">{new Date(post.createdAt).toLocaleString()}</span></div>
      <p className="mt-2 text-slate-700 leading-relaxed">{post.content}</p>
      <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
        <span>👍 {post.likes}</span>
        <span>💬 {post.replies.length}</span>
      </div>
      {post.replies?.length ? (
        <div className="mt-3 pl-3 border-l space-y-2">
          {post.replies.map((r) => (
            <div key={r.id} className="text-sm text-slate-700"><span className="font-medium">{r.author}</span>: {r.content}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// OLD AI DRAWER - Temporarily renamed, will migrate later
function OldAIDrawer({ open, onClose, context }) {
  const { ask, isLoading } = useFakeAI();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Xin chào! Mình có thể tóm tắt trận, trả lời câu hỏi trước/sau trận và giải thích thống kê." },
    { role: "assistant", text: "Gợi ý: hỏi ‘đội hình dự kiến’, ‘xG hiệp 1’, ‘bước ngoặt trận’, hoặc ‘MVP’." },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleAsk = async (preset) => {
    const q = (preset ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    const ans = await ask(q, context);
    setMessages((m) => [...m, { role: "assistant", text: ans }]);
  };

  const suggest = context?.status === "PRE"
    ? ["Đội hình dự kiến?", "Form 5 trận gần nhất?", "Tỷ lệ kèo mở/đóng?", "Đối đầu 5 trận?"]
    : ["Tóm tắt 3 ý chính", "XG hiệp 2?", "Bước ngoặt trận?", "Ai là MVP?"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 400, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-0 bottom-0 z-50"
          aria-hidden={!open}
        >
          <div className="mx-auto max-w-5xl rounded-t-3xl border bg-white/95 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="font-semibold">AI Chat · {context?.type === "match" ? "Trận đấu" : context?.type === "article" ? "Bài viết" : "Toàn trang"}</div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Đóng</button>
            </div>
            <div className="px-4 pb-2"><SuggestChips items={suggest} onPick={(t) => handleAsk(t)} /></div>
            <div ref={listRef} className="h-64 overflow-y-auto px-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed", m.role === "user" ? "ml-auto bg-sky-600 text-white" : "bg-slate-100")}>{m.text}</div>
              ))}
              {isLoading ? <div className="text-xs text-slate-500">Đang soạn trả lời…</div> : null}
            </div>
            <div className="p-3 border-t flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? handleAsk() : null)}
                placeholder="Hỏi về đội hình, xG, highlight, tóm tắt…"
                className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button onClick={() => handleAsk()} className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700">Gửi</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==================== NEW AI DRAWER ====================
function AIDrawer({ open, onClose, context }) {
  const { ask, isLoading } = useFakeAI();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);
  
  // Drawer states
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [isToggled, setIsToggled] = useState(false); // false = center, true = right
  const [height, setHeight] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(0);
  const MINIMIZED_HEIGHT = 50; // Content height when minimized (excluding 2px border each side = 59px total)
  const MINIMIZED_WIDTH = 400; // Width when minimized
  const BORDER_WIDTH = 2; // Border thickness on each side
  const TOTAL_MINIMIZED_HEIGHT = MINIMIZED_HEIGHT + (BORDER_WIDTH * 2); // Total height including borders

  // Auto-scroll messages
  useEffect(() => {
    if (!isMinimized) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  const handleAsk = async (preset) => {
    const q = (preset ?? input).trim();
    if (!q) return;
    
    // Expand if minimized
    if (isMinimized) {
      setIsMinimized(false);
      setHeight(isToggled ? 900 : 400);
    }
    
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    const ans = await ask(q, context);
    setMessages((m) => [...m, { role: "assistant", text: ans }]);
  };

  // Handle resize drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartHeight(height);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaY = dragStartY - e.clientY;
      const newHeight = Math.max(MINIMIZED_HEIGHT, Math.min(900, dragStartHeight + deltaY));
      setHeight(newHeight);
      
      if (newHeight <= MINIMIZED_HEIGHT + 20) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStartY, dragStartHeight]);

  // Toggle between center and right positions
  const handleToggle = () => {
    setIsToggled(!isToggled);
    if (!isMinimized) {
      setHeight(!isToggled ? 900 : 400);
    }
  };

  // Handle minimize
  const handleMinimize = () => {
    setIsMinimized(true);
    setHeight(MINIMIZED_HEIGHT);
  };

  // Handle expand from minimized
  const handleExpand = () => {
    setIsMinimized(false);
    setHeight(isToggled ? 900 : 400);
  };

  const width = isMinimized ? MINIMIZED_WIDTH : (isToggled ? 400 : 900);
  const currentHeight = isMinimized ? MINIMIZED_HEIGHT : height;

  // Determine position class based on state
  const getPositionClass = () => {
    if (isMinimized) {
      return isToggled ? "ai-drawer-right-minimized" : "ai-drawer-center-minimized";
    }
    return isToggled ? "ai-drawer-right-expanded" : "ai-drawer-center-expanded";
  };

  return (
    // ===== LEVEL 1: AI DRAWER ROOT CONTAINER =====
    <motion.div
      id="ai-drawer-root"
      data-name="AI Drawer Root Container"
      data-level="1"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: width,
        height: currentHeight,
      }}
      style={{
        cursor: isMinimized ? "pointer" : "default",
        position: "fixed",
        zIndex: 50,
        border: "2px solid white",
        height: isMinimized ? `${MINIMIZED_HEIGHT}px` : `${currentHeight}px`
      }}
      transition={{ 
        layout: { type: "spring", stiffness: 300, damping: 30 },
        width: { type: "spring", stiffness: 300, damping: 30 },
        height: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }}
      className={cn(
        "flex flex-col rounded-[2rem] overflow-hidden",
        "bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-100/95",
        "backdrop-blur-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]",
        getPositionClass()
      )}
      onClick={() => {
        if (isMinimized) handleExpand();
      }}
    >
      {/* ===== LEVEL 2: RESIZE HANDLE (Top) ===== */}
      {!isMinimized && (
        <div
          id="ai-drawer-resize-handle"
          data-name="Resize Handle Area"
          data-level="2"
          onMouseDown={handleMouseDown}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleMinimize();
          }}
          className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-gradient-to-b hover:from-sky-500/20 hover:to-transparent transition-all z-10 flex items-center justify-center pt-1"
          style={{ touchAction: "none" }}
          title="Drag to resize, double-click to minimize"
        >
          {/* ===== LEVEL 3: RESIZE HANDLE INDICATOR ===== */}
          <div 
            data-name="Resize Handle Visual Indicator"
            data-level="3"
            className="w-10 h-1 bg-slate-400/40 rounded-full hover:bg-slate-400/60 transition-colors" 
          />
        </div>
      )}

      {/* ===== LEVEL 2: HEADER AREA (with Toggle Button) ===== */}
      {!isMinimized && (
        <div 
          id="ai-drawer-header"
          data-name="Header Area Container"
          data-level="2"
          className="relative h-[1px] bg-transparent shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleMinimize();
          }}
          title="Click to minimize"
        >
          {/* ===== LEVEL 3: TOGGLE POSITION BUTTON ===== */}
          <button
            id="ai-drawer-toggle-button"
            data-name="Toggle Position Button"
            data-level="3"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-white/80 hover:bg-white hover:scale-110 border border-slate-200/50 shadow-lg shadow-slate-900/5 transition-all text-slate-600 hover:text-sky-600"
            title={isToggled ? "Move to center" : "Move to right"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* ===== LEVEL 2: MESSAGES CONTENT AREA ===== */}
      {!isMinimized && (
        <div 
          id="ai-drawer-messages-area"
          data-name="Messages Content Area"
          data-level="2"
          ref={listRef} 
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2 apple-scrollbars"
          style={{ minHeight: "100px" }}
        >
          {messages.length === 0 ? (
            // ===== LEVEL 3: EMPTY STATE PLACEHOLDER =====
            <div 
              id="ai-drawer-empty-state"
              data-name="Empty State Placeholder"
              data-level="3"
              className="text-sm text-slate-400 text-center py-12"
            >
              <div className="text-3xl mb-2">✨</div>
              <div className="font-medium">Start a conversation</div>
              <div className="text-xs mt-1 text-slate-300">Ask me anything about football</div>
            </div>
          ) : (
            messages.map((m, i) => (
              // ===== LEVEL 3: MESSAGE BUBBLE =====
              <div 
                key={i}
                id={`ai-message-${i}`}
                data-name={`Message Bubble ${m.role === "user" ? "User" : "AI"}`}
                data-level="3"
                data-role={m.role}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                  m.role === "user" 
                    ? "ml-auto bg-slate-200/90 text-gray-600" 
                    : "bg-white/80 backdrop-blur text-slate-800 border border-slate-200/50"
                )}
              >
                {m.text}
              </div>
            ))
          )}
          {isLoading && (
            // ===== LEVEL 3: LOADING INDICATOR =====
            <div 
              id="ai-drawer-loading"
              data-name="Loading Indicator"
              data-level="3"
              className="text-xs text-slate-400 italic"
            >
              AI is thinking...
            </div>
          )}
        </div>
      )}

      {/* ===== LEVEL 2: INPUT CONTAINER (Footer) - Always visible ===== */}
      <div 
        id="ai-drawer-footer"
        data-name="Input Container Footer"
        data-level="2"
        className={cn(
          "border-slate-200/50 backdrop-blur flex items-center gap-2 shrink-0 relative overflow-hidden",
          isMinimized ? "px-0 py-0 h-full" : "px-0 py-0 pt-1 border-t"
        )}
        onClick={(e) => e.stopPropagation()}
        style={{ height: isMinimized ? '100%' : 'auto' }}
      >
        {/* ===== LEVEL 3: INPUT WRAPPER with animated gradient borders ===== */}
        <div 
          id="ai-input-wrapper"
          data-name="Input Field Wrapper"
          data-level="3"
          className={cn("flex-1 relative group", isMinimized ? "h-full" : "")}
          style={{ marginRight: isMinimized ? '0' : '56px', height: isMinimized ? '100%' : 'auto' }}
        >
          {/* ===== LEVEL 4: MAIN INPUT FIELD ===== */}
          <input
            id="ai-chat-input"
            name="ai-chat-input"
            data-name="AI Chat Input Field"
            data-level="4"
            aria-label="AI Chat Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            onClick={(e) => {
              if (isMinimized) {
                e.stopPropagation();
                handleExpand();
              }
            }}
            onFocus={() => {
              if (isMinimized) handleExpand();
            }}
            placeholder="Ask me anything..."
            className={cn(
              "w-full rounded-[1.5rem] bg-transparent focus:outline-none placeholder:text-white transition-all duration-300 text-white",
              isMinimized 
                ? "px-6 py-0 text-base h-full" 
                : "px-6 py-2.5 text-base focus:ring-2 focus:ring-sky-400/30 focus:shadow-lg focus:shadow-sky-500/10"
            )}
            style={{ 
              height: isMinimized ? '100%' : 'auto',
              lineHeight: isMinimized ? 'normal' : 'normal',
              paddingTop: isMinimized ? '0' : undefined,
              paddingBottom: isMinimized ? '0' : undefined,
              display: 'flex',
              alignItems: 'center'
            }}
          />
          
          {/* ===== LEVEL 4: IDLE STATE - Animated gradient border ===== */}
          <div 
            id="ai-input-idle-gradient"
            data-name="Input Idle Gradient Border"
            data-level="4"
            className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-sky-500 via-blue-500 via-sky-600 via-blue-600 via-indigo-500/40 to-sky-500 opacity-100 group-focus-within:opacity-0 -z-10 blur-[2px] animate-idle-glow" 
               style={{ 
                 backgroundSize: '300% 100%',
                 animation: 'gradient 3.5s ease infinite'
               }} 
          />
          
          {/* ===== LEVEL 4: IDLE STATE - Shimmer effect (chói gương) ===== */}
          <div 
            id="ai-input-idle-shimmer"
            data-name="Input Idle Shimmer Effect"
            data-level="4"
            className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-focus-within:opacity-0 -z-10"
            style={{ 
              backgroundSize: '200% 100%',
              animation: 'shimmer-continuous 6s ease-in-out infinite'
            }} 
          />
          
          {/* ===== LEVEL 4: FOCUS STATE - Animated gradient border ===== */}
          <div 
            id="ai-input-focus-gradient"
            data-name="Input Focus Gradient Border"
            data-level="4"
            className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-sky-400 via-blue-500 via-sky-600 via-blue-600 via-indigo-500/30 to-sky-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm" 
               style={{ 
                 backgroundSize: '300% 100%',
                 animation: 'gradient 5s ease infinite'
               }} 
          />
          
          {/* ===== LEVEL 4: FOCUS STATE - Shimmer effect ===== */}
          <div 
            id="ai-input-focus-shimmer"
            data-name="Input Focus Shimmer Effect"
            data-level="4"
            className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-focus-within:opacity-100 -z-10"
            style={{ 
              backgroundSize: '200% 100%',
              animation: 'shimmer-continuous 5s ease-in-out infinite'
            }} 
          />
        </div>
        
        {/* ===== LEVEL 3: SEND BUTTON - Only visible when expanded ===== */}
        {!isMinimized && (
          <button 
            id="ai-send-button"
            data-name="Send Message Button"
            data-level="3"
            aria-label="Send message"
            onClick={() => handleAsk()} 
            disabled={!input.trim() || isLoading}
            className="absolute right-[7px] w-10 h-10 bg-transparent text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 group/btn overflow-hidden hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{ borderRadius: '12px 12px 17px 12px' }}
            title="Send message (Enter)"
          >
            {/* ===== LEVEL 4: BUTTON IDLE STATE - Animated gradient border ===== */}
            <div 
              id="ai-button-idle-gradient"
              data-name="Button Idle Gradient Border"
              data-level="4"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 via-sky-600 via-blue-600 to-sky-500 opacity-100 group-hover/btn:opacity-0 -z-10 blur-[2px] animate-idle-glow" 
                 style={{ 
                   backgroundSize: '300% 100%',
                   animation: 'gradient 3.5s ease infinite'
                 }} 
            />
            
            {/* ===== LEVEL 4: BUTTON IDLE STATE - Shimmer effect (commented out) ===== */}
            {/* <div 
              id="ai-button-idle-shimmer"
              data-name="Button Idle Shimmer Effect"
              data-level="4"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover/btn:opacity-0 -z-10"
              style={{ 
                backgroundSize: '200% 100%',
                animation: 'shimmer-continuous 6s ease-in-out infinite'
              }} 
            /> */}
            
            {/* ===== LEVEL 4: BUTTON HOVER STATE - Animated gradient border ===== */}
            <div 
              id="ai-button-hover-gradient"
              data-name="Button Hover Gradient Border"
              data-level="4"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 via-sky-600 via-blue-600 to-sky-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10 blur-sm" 
                 style={{ 
                   backgroundSize: '300% 100%',
                   animation: 'gradient 5s ease infinite'
                 }} 
            />
            
            {/* ===== LEVEL 4: BUTTON HOVER STATE - Shimmer effect ===== */}
            <div
              id="ai-button-hover-shimmer"
              data-name="Button Hover Shimmer Effect"
              data-level="4" 
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover/btn:opacity-100 -z-10"
              style={{ 
                backgroundSize: '200% 100%',
                animation: 'shimmer-continuous 5s ease-in-out infinite'
              }} 
            />
            
            {/* Icon */}
            <div className="relative z-10">
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ) : (
                <svg 
                  className="w-4 h-4 group-hover/btn:rotate-[-10deg] transition-transform duration-300" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M7 7l10 10M7 17V7h10" />
                </svg>
              )}
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, actions, subtitle }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
        
}

function MatchesSlider({ matches, onOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || matches.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % matches.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, matches.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % matches.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getVisibleMatches = () => {
    // Show 2 matches on mobile, 3 on desktop
    const matchesPerView = window.innerWidth >= 768 ? 3 : 2;
    const visibleMatches = [];
    
    for (let i = 0; i < matchesPerView && i < matches.length; i++) {
      const index = (currentIndex + i) % matches.length;
      visibleMatches.push(matches[index]);
    }
    
    return visibleMatches;
  };

  if (matches.length === 0) {
    return <div className="text-slate-500 text-center py-8">Không có trận đấu nào</div>;
  }

  return (
    <div className="relative">
      {/* Main slider container */}
      <div className="relative overflow-hidden rounded-3xl">
        <motion.div 
          className="flex gap-4 py-4"
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex gap-4 min-w-full justify-center md:justify-start"
            >
              {getVisibleMatches().map((match, idx) => (
                <motion.div
                  key={`${match.id}-${currentIndex}-${idx}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <MatchCard match={match} onOpen={onOpen} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {matches.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg border flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg border flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all"
          >
            →
          </button>
        </>
      )}

      {/* Slide indicators */}
      {/* {matches.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {matches.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index ? "bg-slate-900 w-6" : "bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      )} */}

    </div>
  );
}

function HeroSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      category: "Tin nóng theo trận",
      title: "Cập nhật theo phút từ sân cỏ",
      description: "Theo dõi diễn biến trực tiếp, bàn thắng, thẻ phạt và những khoảnh khắc quan trọng nhất của trận đấu.",
      background: "/imgs/skysports-euro-2024-football-6593133-1145.jpg.webp",
      overlay: "from-red-900/80 via-red-800/70 to-transparent",
      icon: "⚡️"
    },
    {
      id: 2,
      category: "Tóm tắt AI",
      title: "Phân tích thông minh với AI",
      description: "Trợ lý AI tóm tắt nhanh thống kê xG, đội hình, chiến thuật và những điểm nhấn của trận đấu.",
      background: "/imgs/ha-lan-2-167002630753887058358.webp",
      overlay: "from-blue-900/80 via-blue-800/70 to-transparent",
      icon: "🤖"
    },
    {
      id: 3,
      category: "Hỏi đáp chiến thuật",
      title: "Cộng đồng chuyên sâu",
      description: "Trao đổi với cộng đồng về chiến thuật, đội hình, chuyển nhượng và dự đoán kết quả.",
      background: "/imgs/skysports-euro-2024-football-6593133-1145.jpg.webp",
      overlay: "from-green-900/80 via-green-800/70 to-transparent",
      icon: "💬"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="rounded-3xl border overflow-hidden relative h-[200px]">
      {/* Background Image */}
      <motion.div 
        key={`bg-${currentSlide}`}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slides[currentSlide].background})` }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].overlay}`} />
      
      {/* Content */}
      <div className="relative z-10 p-6 text-white h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col md:flex-row md:items-center gap-6 h-full"
          >
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                {slides[currentSlide].icon}
              </motion.span>
              <div className="text-xs/5 tracking-wide uppercase text-white/60">
                {slides[currentSlide].category}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              {slides[currentSlide].title}
            </h1>
            <p className="text-white/80 max-w-2xl">
              {slides[currentSlide].description}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Slide indicators */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentSlide === index ? "bg-white w-6" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [aiOpen, setAiOpen] = useState(true); // Always true for new drawer - it manages minimize state internally
  const [aiContext, setAiContext] = useState(null);
  const [focusedMatch, setFocusedMatch] = useState(null);
  const [filter, setFilter] = useState("Tất cả");

  const openMatch = (m) => {
    setFocusedMatch(m);
    setActiveTab("match");
  };

  const openAIForMatch = (m) => {
    setAiContext({ type: "match", id: m.id, status: m.status });
    setAiOpen(true);
  };

  const openAIForArticle = (item) => {
    setAiContext({ type: "article", id: item.id, matchId: item.matchId });
    setAiOpen(true);
  };

  // Derived lists
  const newsByMatch = useMemo(() => DUMMY_NEWS.filter((n) => n.matchId === focusedMatch?.id), [focusedMatch]);
  const filteredMatches = useMemo(() => {
    if (filter === "Tất cả") return DUMMY_MATCHES_TODAY;
    if (filter === "Premier League") return DUMMY_MATCHES_TODAY.filter((m) => m.league.includes("Premier"));
    if (filter === "UCL") return DUMMY_MATCHES_TODAY.filter((m) => m.league.includes("Champions"));
    return DUMMY_MATCHES_TODAY;
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/60">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === "home" && <HomePage filter={filter} setFilter={setFilter} filteredMatches={filteredMatches} openMatch={openMatch} openAIForArticle={openAIForArticle} />}
        {activeTab === "match" && <MatchPage match={focusedMatch} news={newsByMatch} onAskAI={() => openAIForMatch(focusedMatch)} filter={filter} setFilter={setFilter} filteredMatches={filteredMatches} openMatch={openMatch} openAIForMatch={openAIForMatch} focusedMatch={focusedMatch} setFocusedMatch={setFocusedMatch} />}
        {activeTab === "community" && <CommunityPage posts={DUMMY_COMMUNITY} onOpenMatch={openMatch} />}
      </main>

      <Bottom activeTab={activeTab} setActiveTab={setActiveTab} setAiContext={setAiContext} setAiOpen={setAiOpen} />
      <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} context={aiContext} />
    </div>
  );
}

const HomePage = ({ filter, setFilter, filteredMatches, openMatch, openAIForArticle })=> {
    return (
        <>
            {/* Hero Slides */}
            {/* <HeroSlides /> */}

            {/* Filters + Today strip */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <SectionHeader title="Today's Matches" subtitle="Chọn nhanh theo giải, mở Match Hub để xem đầy đủ" />
              <TopicFilters value={filter} onChange={setFilter} />
            </div>
            <MatchesSlider matches={filteredMatches} onOpen={openMatch} />

            {/* News & Related */}
            <div className="space-y-6">
              {/* <SectionHeader title="Tin tức bóng đá"/> */}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main news articles with images - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* First large featured article */}
                  <FeaturedNewsCard item={DUMMY_NEWS[0]} onAsk={openAIForArticle} />
                  
                  {/* Grid of 4 smaller articles in 2x2 layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NewsCard item={DUMMY_NEWS[1]} onAsk={openAIForArticle} />
                    <NewsCard item={DUMMY_NEWS[2]} onAsk={openAIForArticle} />
                    <NewsCard item={DUMMY_NEWS[3]} onAsk={openAIForArticle} />
                    <NewsCard item={DUMMY_NEWS[4]} onAsk={openAIForArticle} />
                  </div>
                  
                  {/* Last article full width */}
                  <NewsCard item={DUMMY_NEWS[5]} onAsk={openAIForArticle} />
                </div>
                
                {/* Right sidebar with text-only news - 1 column */}
                <div className="lg:col-span-1 space-y-4">
                  <SectionHeader title="Tin liên quan" subtitle="Cập nhật nhanh" />
                  
                  {/* Text-only news items */}
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Prisco's NFL Power Rankings: Amid week of blowouts, some reminders</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">NFL</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.1 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Pitt's Narduzzi: NCAA call on pro sports betting 'one of the stupidest decisions'</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">College Football</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.2 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Freeman walk-off gives Dodgers 2-1 World Series lead after historic Game 3</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">MLB</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.3 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Commanders TE Zach Ertz makes NFL history vs. Chiefs on 'MNF'</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">NFL</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.4 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Report: Veteran receiver reuniting with Rodgers on Steelers after 49ers stint</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">NFL</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community highlight */}
            <div className="space-y-3">
              <SectionHeader title="Cộng đồng nổi bật" subtitle="Bài viết chất lượng từ fan & analyst" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DUMMY_COMMUNITY.map((p) => (
                  <CommunityPost key={p.id} post={p} />
                ))}
              </div>
            </div>
          </>
    )
}

const CommunityPage = ({ posts, onOpenMatch }) => {
    return (
        <div className="space-y-6">
            {/* Post composer */}
            <div className="flex items-center gap-2">
              <input className="flex-1 rounded-xl border px-3 py-2" placeholder="Chia sẻ cảm nghĩ, ảnh, link highlight…" />
              <button className="px-3 py-2 rounded-xl bg-slate-900 text-white">Đăng</button>
            </div>
            
            {/* Layout tương tự homepage: bên trái community posts, bên phải sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Community posts - 2 columns */}
              <div className="lg:col-span-2 space-y-4">
                <SectionHeader title="Bài viết cộng đồng" subtitle="Thảo luận và chia sẻ từ fan bóng đá" />
                <div className="space-y-4">
                  {posts.map((p) => (
                    <CommunityPost key={p.id} post={p} />
                  ))}
                </div>
              </div>
              
              {/* Right sidebar - 1 column */}
              <div className="lg:col-span-1 space-y-4">
                <SectionHeader title="Tin liên quan" subtitle="Cập nhật nhanh" />
                
                {/* Text-only news items - same as homepage */}
                <div className="space-y-3">
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">Prisco's NFL Power Rankings: Amid week of blowouts, some reminders</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">NFL</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">Pitt's Narduzzi: NCAA call on pro sports betting 'one of the stupidest decisions'</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">College Football</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">Freeman walk-off gives Dodgers 2-1 World Series lead after historic Game 3</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">MLB</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }}
                    className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">Commanders TE Zach Ertz makes NFL history vs. Chiefs on 'MNF'</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">NFL</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4 }}
                    className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">Report: Veteran receiver reuniting with Rodgers on Steelers after 49ers stint</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">NFL</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
    )
}

const Bottom = ({ activeTab, setActiveTab, setAiContext, setAiOpen }) => {
    return (
        <nav className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-white/80 backdrop-blur rounded-2xl border shadow-lg p-2 flex items-center justify-around">
        {[
          { key: "home", label: "Home", icon: "🏠" },
          { key: "match", label: "Match", icon: "⚽️" },
          { key: "community", label: "Cộng đồng", icon: "👥" },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn("flex flex-col items-center text-xs px-3 py-1.5 rounded-xl", activeTab === key ? "bg-slate-900 text-white" : "text-slate-700")}
          >
            <span className="text-base" aria-hidden>{icon}</span>
            {label}
          </button>
        ))}
        <button onClick={() => { setAiContext({ type: "global" }); setAiOpen(true); }} className="px-3 py-1.5 rounded-xl border">AI</button>
      </nav>
    )
}

const MatchPage = ({ match, news, onAskAI, filter, setFilter, filteredMatches, openMatch, openAIForMatch, focusedMatch, setFocusedMatch }) => {
    return (
        <div className="space-y-6">
            {/* Header with filters */}
            {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <SectionHeader title="Match Hub" subtitle="Tất cả trận đấu hôm nay và sắp tới" />
              <TopicFilters value={filter} onChange={setFilter} />
            </div> */}

            {/* Time navigation buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur rounded-2xl border">
              {/* Week navigation */}
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 transition-colors">
                  Week 9
                </button>
                <button className="px-4 py-2 text-sm border rounded-lg bg-slate-900 text-white">
                  Week 10
                </button>
                <button className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 transition-colors">
                  Week 11
                </button>
              </div>

              {/* Dropdowns and view toggle */}
              <div className="flex items-center gap-3">
                {/* Week dropdown */}
                <div className="relative">
                  <select className="px-3 py-2 text-sm border rounded-lg bg-white hover:bg-slate-50 appearance-none pr-8 cursor-pointer">
                    <option>Week 10</option>
                    <option>Week 9</option>
                    <option>Week 11</option>
                    <option>Week 12</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Season dropdown */}
                <div className="relative">
                  <select className="px-3 py-2 text-sm border rounded-lg bg-white hover:bg-slate-50 appearance-none pr-8 cursor-pointer">
                    <option>2025 Season</option>
                    <option>2024 Season</option>
                    <option>2023 Season</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* League dropdown */}
                <div className="relative">
                  <select className="px-3 py-2 text-sm border rounded-lg bg-white hover:bg-slate-50 appearance-none pr-8 cursor-pointer">
                    <option>Tất cả giải đấu</option>
                    <option>Premier League</option>
                    <option>UEFA Champions League</option>
                    <option>La Liga</option>
                    <option>Serie A</option>
                    <option>Bundesliga</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Grid - 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMatches.map((match, index) => {
                // First 3 matches = "Hôm nay" (Today's featured)
                const isFeatured = index < 3;
                // Random matches for Derby/Super Classic (index 4, 7, 10)
                const isDerby = [4, 7, 10].includes(index);
                const hasSpecialEffect = isFeatured || isDerby;

                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {/* Subtle left accent bar */}
                    {hasSpecialEffect && (
                      <div 
                        className={cn(
                          "absolute left-0 top-6 bottom-6 w-1 rounded-full",
                          isFeatured ? "bg-orange-500" : "bg-purple-500"
                        )}
                      />
                    )}
                    
                    <motion.button
                      onClick={() => openMatch(match)}
                      className={cn(
                        "relative w-full h-[200px] text-left rounded-3xl p-5 transition-all backdrop-blur group flex flex-col justify-between border overflow-hidden",
                        hasSpecialEffect 
                          ? isFeatured
                            ? "bg-white border-orange-500"
                            : "bg-white border-[#0284c7]"
                          : "bg-white/70 border-slate-200"
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Status and Time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn("px-2 py-0.5 rounded-full border text-[10px] font-medium", 
                          match.status === "FT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : match.status === "LIVE"
                            ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        )}>
                          {match.status}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(match.kickoff).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                    {/* Teams and Score */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" aria-hidden>{TEAMS[match.home.id]?.logo}</span>
                          <span className="font-medium text-sm">{TEAMS[match.home.id]?.name}</span>
                        </div>
                        <div className="font-bold text-lg">{match.home.score ?? "-"}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" aria-hidden>{TEAMS[match.away.id]?.logo}</span>
                          <span className="font-medium text-sm">{TEAMS[match.away.id]?.name}</span>
                        </div>
                        <div className="font-bold text-lg">{match.away.score ?? "-"}</div>
                      </div>
                    </div>

                    {/* League and Venue */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <Badge>{match.league}</Badge>
                      <span>·</span>
                      <span className="truncate">{match.venue}</span>
                    </div>

                    {/* Hover effect */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3">
                      <div className={cn(
                        "text-xs font-medium",
                        hasSpecialEffect 
                          ? isFeatured ? "text-orange-600" : "text-purple-600"
                          : "text-sky-600"
                      )}>
                        Chi tiết trận →
                      </div>
                    </div>

                      {/* Diagonal ribbon label at bottom right corner */}
                      {hasSpecialEffect && (
                        <div className="absolute bottom-0 right-0 overflow-hidden w-32 h-32 pointer-events-none">
                          <div className={cn(
                            "absolute bottom-0 right-0 transform translate-x-8 translate-y-8 w-40 text-center py-1.5 text-white text-[11px] font-bold tracking-wider shadow-lg",
                            isFeatured
                              ? "bg-orange-500"
                              : "bg-[#0284c7]"
                          )}
                          style={{ transform: 'translateX(2.5rem) translateY(-1rem) rotate(-45deg)' }}
                          >
                            <span className="mr-1">{isFeatured ? "🔥" : "⚡"}</span>
                            {isFeatured ? "HÔM NAY" : "DERBY"}
                          </div>
                        </div>
                      )}
                  </motion.button>
                </motion.div>
                );
              })}
            </div>

            {/* News & Related Section - Same layout as HomePage */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main news articles with images - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* First large featured article */}
                  <FeaturedNewsCard item={DUMMY_NEWS[0]} onAsk={openAIForMatch} />
                  
                  {/* Grid of 4 smaller articles in 2x2 layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NewsCard item={DUMMY_NEWS[1]} onAsk={openAIForMatch} />
                    <NewsCard item={DUMMY_NEWS[2]} onAsk={openAIForMatch} />
                    <NewsCard item={DUMMY_NEWS[3]} onAsk={openAIForMatch} />
                    <NewsCard item={DUMMY_NEWS[4]} onAsk={openAIForMatch} />
                  </div>
                  
                  {/* Last article full width */}
                  <NewsCard item={DUMMY_NEWS[5]} onAsk={openAIForMatch} />
                </div>
                
                {/* Right sidebar with text-only news - 1 column */}
                <div className="lg:col-span-1 space-y-4">
                  <SectionHeader title="Tin liên quan" subtitle="Cập nhật nhanh" />
                  
                  {/* Text-only news items */}
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Prisco's NFL Power Rankings: Amid week of blowouts, some reminders</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">NFL</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.1 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Pitt's Narduzzi: NCAA call on pro sports betting 'one of the stupidest decisions'</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">College Football</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.2 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Freeman walk-off gives Dodgers 2-1 World Series lead after historic Game 3</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">MLB</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.3 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Commanders TE Zach Ertz makes NFL history vs. Chiefs on 'MNF'</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">NFL</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.4 }}
                      className="p-4 border rounded-2xl bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">Report: Veteran receiver reuniting with Rodgers on Steelers after 49ers stint</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">NFL</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Detail Modal/Drawer */}
            {focusedMatch && <MatchDetailPopup match={focusedMatch} onClose={() => setFocusedMatch(null)} onAskAI={onAskAI} />}
          </div>
    )
}

const Header = ({ activeTab, setActiveTab }) => {
    return (
        <header className="sticky top-0 z-40 bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <div 
            className="text-4xl font-black tracking-tight transform -translate-y-[3px] cursor-pointer hover:text-sky-700 transition-colors"
            onClick={() => setActiveTab("home")}
          >
            Soccer<span className="text-sky-600">AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
            //   { key: "home", label: "Home" },
              { key: "match", label: "Match Hub" },
              { key: "rank", label: "Ranks" },
              { key: "community", label: "Community" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn("px-3 py-1.5 rounded-xl", activeTab === t.key ? "bg-slate-900 text-white" : "hover:bg-slate-100")}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {/* Hot News Animation */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-sm"
              >
                🔥
              </motion.span>
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs font-bold tracking-wide"
              >
                HOT: Mbappe chính thức gia nhập Real Madrid!
              </motion.div>
            </motion.div>
            
            {/* <div className="hidden md:block">
              <input className="border rounded-xl px-3 py-1.5 text-sm w-64" placeholder="Tìm đội, cầu thủ, trận, tin…" />
            </div> */}
            {/* <button onClick={() => { setAiContext({ type: "global" }); setAiOpen(true); }} className="px-3 py-1.5 rounded-xl border hover:bg-slate-50">AI Chat</button> */}
            <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white">Đăng nhập</button>
          </div>
        </div>
      </header>
    )
}


// Helper function to get team logo
const getTeamLogo = (teamName) => {
    // Check if teamName exists
    if (!teamName) {
        return '/imgs/barcelona-logo.png'; // Default fallback
    }
    
    const teamLower = teamName.toLowerCase();
    if (teamLower.includes('barcelona') || teamLower.includes('barça')) {
        return '/imgs/barcelona-logo.png';
    } else if (teamLower.includes('real madrid') || teamLower.includes('madrid')) {
        return '/imgs/real-madrid-logo.svg';
    }
    // Default fallback logo
    return '/imgs/barcelona-logo.png';
};

// Component: Team Display in Match Header
const TeamDisplay = ({ teamName, score, logoUrl, direction = "left" }) => {
    const animationProps = direction === "left" 
        ? { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } }
        : { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } };

    return (
        <motion.div 
            {...animationProps}
            className="flex flex-col items-center space-y-4 flex-1 max-w-xs relative"
        >
            {/* Background logo at center of the "square" area - 15% opacity */}
            <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                    backgroundImage: `url(${logoUrl})`,
                    backgroundSize: '250px 250px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.03
                }}
            />
            
            {/* Transparent container with logo */}
            <div className="relative hover:scale-110 transition-transform duration-300" style={{ width: '220px', height: '220px' }}>
                {/* Foreground logo - fixed 120x120 */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <img 
                        src={logoUrl} 
                        alt={teamName}
                        className="object-contain"
                        style={{ width: '120px', height: '120px' }}
                    />
                </div>
            </div>
            <div className="text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-[-60px]">
                    {teamName ?? 'Barcelona'}
                </h2>
            </div>
        </motion.div>
    );
};

// Component: Match Score Display
const MatchScore = ({ homeScore, awayScore }) => {
    return (
        <div className="flex flex-col items-center space-y-3">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-7xl md:text-8xl font-black text-white drop-shadow-2xl"
            >
                <span className="inline-block hover:scale-110 transition-transform">
                    {homeScore ?? "-"}
                </span>
                <span className="mx-2 text-5xl text-white/50">:</span>
                <span className="inline-block hover:scale-110 transition-transform">
                    {awayScore ?? "-"}
                </span>
            </motion.div>
        </div>
    );
};

// Component: Match Header Hero Section
const MatchHeroHeader = ({ match, onClose, onAskAI }) => {
    const homeLogo = getTeamLogo(match.home.name);
    const awayLogo = getTeamLogo(match.away.name);

    return (
        <div 
            className="relative p-8 rounded-t-3xl" 
            style={{ 
                background: `linear-gradient(180deg,
                    color-mix(in srgb, #002d72, 20% rgb(16, 16, 16)) 0%,
                    color-mix(in srgb, #002d72, 20% rgb(16, 16, 16)) 10%,
                    #002d72 50%,
                    color-mix(in srgb, #002d72, 20% rgb(16, 16, 16)) 90%,
                    color-mix(in srgb, #002d72, 20% rgb(16, 16, 16)) 100%)`,
                height: '300px'
            }}
        >
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110"
            >
                ✕
            </button>

            {/* League Info */}
            <div className="text-center mb-[-40px]">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                    {match.league} · {match.venue}
                </div>
                <div className="text-white/80 text-xs mt-2">
                    Kickoff: {new Date(match.kickoff).toLocaleString()}
                </div>
            </div>

            {/* Teams & Score - Epic VS Layout */}
            <div className="flex items-center justify-center gap-8 md:gap-16 mt-[-60px]">
                <TeamDisplay 
                    teamName={match.home.name}
                    score={match.home.score}
                    logoUrl={homeLogo}
                    direction="left"
                />
                
                <MatchScore 
                    homeScore={match.home.score}
                    awayScore={match.away.score}
                />
                
                <TeamDisplay 
                    teamName={match.away.name}
                    score={match.away.score}
                    logoUrl={awayLogo}
                    direction="right"
                />
            </div>

            {/* Action Button */}
            <div className="flex justify-center relative z-10 top-[6px]">
                <button 
                    onClick={() => onAskAI(match)} 
                    className="px-8 py-3 rounded-full bg-white/50 backdrop-blur-sm font-bold hover:bg-white/70 transition-all hover:scale-105 shadow-xl flex items-center gap-2"
                    style={{ color: '#0284c7' }}
                >
                    <span>🤖</span> Hỏi AI về trận đấu này
                </button>
            </div>

            {/* Running News Ticker */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm overflow-hidden z-0" style={{ height: '32px' }}>
                <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: 'linear' 
                    }}
                    className="whitespace-nowrap py-1.5 text-white text-sm font-bold tracking-wider"
                >
                    🔥 BREAKING NEWS: MBAPPE GHI HAT-TRICK TRONG TRẬN RA MẮT • ⚡ ARSENAL THẮNG NGƯỢC CHELSEA 2-1 • 🏆 REAL MADRID DẪN ĐẦU LA LIGA • ⭐ HAALAND PHÁ KỶ LỤC GHI BÀN PREMIER LEAGUE • 🎯 MAN CITY VS LIVERPOOL: TRẬN CẦU THƯỢNG ĐỈNH TUẦN NÀY •
                </motion.div>
            </div>
        </div>
    );
};

// Component: AI Summary Section
const AISummarySection = () => {
    return (
        <div className="rounded-2xl border-2 bg-white p-5 shadow-lg" style={{ borderColor: '#0284c7' }}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🤖</span>
                <h3 className="font-bold text-lg text-slate-800">AI Tóm tắt nhanh</h3>
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-2">
                <li>Arsenal tăng pressing từ phút 70, tạo nhiều cơ hội hơn.</li>
                <li>Turning point: thay người phút 72 làm thay đổi cấu trúc pressing.</li>
                <li>xG tổng ~ 1.8 vs 1.2, số cú sút 13 vs 9, momentum nghiêng hẳn về cuối trận.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
                <StatPill label="Sút (ARS)" value={13} />
                <StatPill label="Sút (CHE)" value={9} />
                <StatPill label="xG (ARS)" value={1.8} subtle />
                <StatPill label="xG (CHE)" value={1.2} subtle />
            </div>
        </div>
    );
};

// Component: Match Timeline Section
const MatchTimelineSection = () => {
    const events = [
        { time: "12'", icon: "⚽️", description: "Bàn thắng ARS sau tình huống chuyển đổi nhanh." },
        { time: "61'", icon: "🟨", description: "Thẻ vàng CHE vì pha truy cản chiến thuật." },
        { time: "72'", icon: "🔁", description: "Thay người ARS, chuyển sang cấu trúc 3-2-5 khi tấn công." },
        { time: "84'", icon: "⚽️", description: "Bàn thắng quyết định từ pha căng ngang sớm." }
    ];

    return (
        <div className="rounded-2xl border-2 bg-white p-5 shadow-lg" style={{ borderColor: '#0ea5e9' }}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚽</span>
                <h3 className="font-bold text-lg text-slate-800">Diễn biến (mẫu)</h3>
            </div>
            <ol className="mt-2 space-y-3 text-sm">
                {events.map((event, index) => (
                    <li key={index} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-slate-500 font-semibold min-w-[2.5rem]">{event.time}</span> 
                        <span>{event.icon} {event.description}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
};

// Component: Match Statistics Section
const MatchStatsSection = () => {
    return (
        <div className="rounded-2xl border-2 bg-white p-5 shadow-lg" style={{ borderColor: '#38bdf8' }}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📊</span>
                <h3 className="font-bold text-lg text-slate-800">Thống kê</h3>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3 text-sm">
                <StatPill label="Kiểm soát bóng" value="54% : 46%" />
                <StatPill label="Sút trúng đích" value="6 : 4" />
                <StatPill label="Phạt góc" value="5 : 3" />
                <StatPill label="Thẻ vàng" value="2 : 2" />
            </div>
        </div>
    );
};

const MatchDetailPopup = ({ match, onClose, onAskAI }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-0 inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 scroll-hide"
            style={{marginTop: 0}}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Hero Section - Match Header */}
                <MatchHeroHeader match={match} onClose={onClose} onAskAI={onAskAI} />

                {/* Content Section */}
                <div className="p-6 space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-3">
                            <AISummarySection />
                            <MatchTimelineSection />
                        </div>

                        <div className="space-y-3">
                            <MatchStatsSection />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};