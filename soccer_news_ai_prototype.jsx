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

function AIDrawer({ open, onClose, context }) {
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
  const [aiOpen, setAiOpen] = useState(false);
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
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <div className="text-4xl font-black tracking-tight transform -translate-y-[3px]">Soccer<span className="text-sky-600">AI</span></div>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
            //   { key: "home", label: "Home" },
              { key: "match", label: "Match Hub" },
              { key: "schedule", label: "Lịch thi đấu" },
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

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-3">
        {activeTab === "home" && (
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
              <SectionHeader title="Cộng đồng nổi bật" subtitle="Bài viết chất lượng từ fan & analyst" actions={<button onClick={() => setActiveTab("community")} className="px-3 py-1.5 text-sm rounded-xl border hover:bg-slate-50">Xem tất cả</button>} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DUMMY_COMMUNITY.map((p) => (
                  <CommunityPost key={p.id} post={p} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "match" && (
          <>
            {focusedMatch ? (
              <div className="space-y-6">
                <div className="rounded-3xl border bg-white p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">{focusedMatch.league} · {focusedMatch.venue}</div>
                      <div className="flex items-center gap-4 text-2xl font-extrabold tracking-tight">
                        <TeamChip id={focusedMatch.home.id} />
                        <div>
                          {focusedMatch.home.score ?? "-"} : {focusedMatch.away.score ?? "-"}
                        </div>
                        <TeamChip id={focusedMatch.away.id} />
                      </div>
                      <div className="text-sm text-slate-600">Kickoff: {new Date(focusedMatch.kickoff).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openAIForMatch(focusedMatch)} className="px-3 py-2 rounded-xl border hover:bg-slate-50">Hỏi AI</button>
                      <button className="px-3 py-2 rounded-xl bg-slate-900 text-white">Theo dõi trận</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-3">
                    <div className="rounded-2xl border bg-white p-4">
                      <h3 className="font-semibold">AI Tóm tắt nhanh</h3>
                      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                        <li>Arsenal tăng pressing từ phút 70, tạo nhiều cơ hội hơn.</li>
                        <li>Turning point: thay người phút 72 làm thay đổi cấu trúc pressing.</li>
                        <li>xG tổng ~ 1.8 vs 1.2, số cú sút 13 vs 9, momentum nghiêng hẳn về cuối trận.</li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatPill label="Sút (ARS)" value={13} />
                        <StatPill label="Sút (CHE)" value={9} />
                        <StatPill label="xG (ARS)" value={1.8} subtle />
                        <StatPill label="xG (CHE)" value={1.2} subtle />
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-4">
                      <h3 className="font-semibold">Diễn biến (mẫu)</h3>
                      <ol className="mt-2 space-y-2 text-sm">
                        <li><span className="text-slate-500">12'</span> ⚽️ Bàn thắng ARS sau tình huống chuyển đổi nhanh.</li>
                        <li><span className="text-slate-500">61'</span> 🟨 Thẻ vàng CHE vì pha truy cản chiến thuật.</li>
                        <li><span className="text-slate-500">72'</span> 🔁 Thay người ARS, chuyển sang cấu trúc 3-2-5 khi tấn công.</li>
                        <li><span className="text-slate-500">84'</span> ⚽️ Bàn thắng quyết định từ pha căng ngang sớm.</li>
                      </ol>
                    </div>

                    <div className="rounded-2xl border bg-white p-4">
                      <h3 className="font-semibold">Bình luận theo trận</h3>
                      <div className="mt-2 space-y-3">
                        {DUMMY_COMMUNITY.filter((p) => p.matchId === focusedMatch.id).map((p) => (
                          <CommunityPost key={p.id} post={p} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border bg-white p-4">
                      <h3 className="font-semibold">Tin liên quan</h3>
                      <div className="mt-2 space-y-3">
                        {newsByMatch.map((n) => (
                          <div key={n.id} className="border rounded-xl p-3">
                            <div className="text-xs text-slate-500">{new Date(n.time).toLocaleString()}</div>
                            <div className="font-medium">{n.title}</div>
                            <p className="text-sm text-slate-600 mt-1">{n.summary}</p>
                            <button className="mt-2 text-sm underline" onClick={() => openAIForArticle(n)}>Hỏi AI về tin này</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-4">
                      <h3 className="font-semibold">Thống kê nhanh</h3>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <StatPill label="Kiểm soát bóng" value="54% : 46%" />
                        <StatPill label="Sút trúng đích" value="6 : 4" />
                        <StatPill label="Phạt góc" value="5 : 3" />
                        <StatPill label="Thẻ vàng" value="2 : 2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-600">Chọn một trận ở Home để xem chi tiết.</div>
            )}
          </>
        )}

        {activeTab === "community" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input className="flex-1 rounded-xl border px-3 py-2" placeholder="Chia sẻ cảm nghĩ, ảnh, link highlight…" />
              <button className="px-3 py-2 rounded-xl bg-slate-900 text-white">Đăng</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DUMMY_COMMUNITY.map((p) => (
                <CommunityPost key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav (mobile) */}
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

      <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} context={aiContext} />
    </div>
  );
}
