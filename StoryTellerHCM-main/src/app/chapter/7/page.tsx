/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS & TRẠNG THÁI ẢNH CHƯƠNG 7
// ==========================================
const CHAPTER_7_ASSETS = {
  scenes: [
    {
      id: "workshop",
      label: "Xưởng Nội Địa",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329423/xuongsanxuatcodien_xgmgci.png",
      bg: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329423/xuongsanxuatcodien_xgmgci.png",
    },
    {
      id: "sea",
      label: "Biển Lớn",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773328818/bienlon_i3bzgq.png",
      bg: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773328818/bienlon_i3bzgq.png",
    },
  ],
  characters: [
    {
      id: "villager",
      label: "Bác Thợ Cả",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773500381/bacnongdan-removebg-preview_kegqbx.png",
    },
    {
      id: "merchant",
      label: "Ngài Tư Bản",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329422/tubanthamlam_dvta62.png",
    },
    {
      id: "book",
      label: "Sách Trí Tuệ",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329422/sach_cxcpbl.png",
    },
    {
      id: "tech",
      label: "Lõi Công Nghệ",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329389/connghe40_nmigip.png",
    },
    {
      id: "anchor",
      label: "Mỏ Neo Tự Chủ",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329406/moneo_kt3ni2.png",
    },
    {
      id: "fta",
      label: "Hiệp Định FTA",
      icon: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329389/fta_bpupvl.png",
    },
  ],
};

const CHAR_STATES = {
  villager: {
    idle: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773500381/bacnongdan-removebg-preview_kegqbx.png",
    educated: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773328818/bnddahoc_le5iby.png",
    upgraded: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329420/nongdancotrithuc_pbasy6.png",
    independent: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329421/nongdanduocbaove_r0wmwv.png",
    lost: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773500528/biboclot_r75n57.png",
    confused: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773500710/nongdanngongac_q38pwy.png",
    happy: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329389/hoabinh_f3cnn3.png",
  },
  merchant: {
    idle: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773501947/nhatuban_augfuc.png",
    evil: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773501976/tubanthamlam_dvta62.png",
    confused: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329406/tubanngongac_tlo5tl.png",
    happy: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773501909/hoabinh_f3cnn3.png", 
  },
  book: { idle: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773329422/sach_cxcpbl.png" },
  tech: { idle: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773501548/connghe40_nmigip.png" },
  anchor: { idle: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773501606/moneo_kt3ni2.png" },
  fta: { idle: "https://res.cloudinary.com/dsnqmpr5i/image/upload/v1773501818/fta_bpupvl.png" },
};

const win_audio_url = "https://res.cloudinary.com/do02twogb/video/upload/v1773104691/win_kx8hk4.wav";

const chaptersData = [
  {
    id: 7,
    shortTitle: "Vươn Ra Biển Lớn",
    fullTitle: "Chương 7: Hành trình ra Biển Lớn",
  },
];

type CharId = "villager" | "merchant" | "book" | "tech" | "anchor" | "fta";

interface PanelCharacter {
  id: CharId;
  stateImg: string;
}

interface PanelState {
  sceneId: string | null;
  sceneBg: string | null;
  characters: PanelCharacter[];
  outcome: string | null;
  isLocked: boolean;
  isBadEnding: boolean;
}

export default function Chapter7Page() {
  const params = useParams();
  const router = useRouter();

  const chapterId = params?.id ? Number(params.id) : 7;
  const chapter = chaptersData.find((c) => c.id === chapterId) || chaptersData[0];
  const currentChapterId = chapter.id;

  const [panels, setPanels] = useState<PanelState[]>(
    Array(6).fill({
      sceneId: null, sceneBg: null, characters: [], outcome: null, isLocked: true, isBadEnding: false
    }).map((p, i) => ({ ...p, isLocked: i !== 0 }))
  );

  const [isWin, setIsWin] = useState(false);

  // ==========================================
  // 3. LOGIC GAME (DÒNG THỜI GIAN KẾ THỪA & CHẶN BUG)
  // ==========================================
  useEffect(() => {
    let isVictory = false;
    let villagerLevel = 0; // 0: Cầm cuốc, 1: Có học thức, 2: Có công nghệ, 3: Độc lập tự chủ
    
    const newPanels = [...panels];

    for (let i = 0; i < 6; i++) {
      const panel = { ...newPanels[i] };
      const scene = panel.sceneId;
      const chars = panel.characters.map((c) => c.id);

      if (!scene) {
        for (let j = i + 1; j < 6; j++) newPanels[j].isLocked = true;
        newPanels[i] = panel;
        break;
      }

      if (i + 1 < 6) newPanels[i + 1].isLocked = false;
      
      panel.outcome = null;
      panel.isBadEnding = false;

      // 1. KHỞI TẠO TRẠNG THÁI THEO DÒNG THỜI GIAN (Kế thừa từ panel trước)
      let currentVillagerState = CHAR_STATES.villager.idle;
      let currentMerchantState = CHAR_STATES.merchant.idle;
      
      if (villagerLevel === 1) currentVillagerState = CHAR_STATES.villager.educated;
      if (villagerLevel === 2) currentVillagerState = CHAR_STATES.villager.upgraded;
      if (villagerLevel === 3) currentVillagerState = CHAR_STATES.villager.independent;

      let hasFatalErrorInPanel = false; // Biến cờ: Nếu dính Bad Ending, ngắt chuỗi tiến hóa!

      // 2. LOGIC TẠI XƯỞNG NỘI ĐỊA
      if (scene === "workshop") {
        if (chars.includes("merchant")) {
          currentMerchantState = CHAR_STATES.merchant.confused;
          if (chars.includes("villager")) currentVillagerState = CHAR_STATES.villager.confused;
          panel.outcome = "Ngơ ngác: Xưởng nội địa không phải nơi Tư bản quốc tế đầu tư!";
          panel.isBadEnding = true;
          hasFatalErrorInPanel = true;
        } else if (chars.includes("villager")) {
          
          // BẪY 1: CÔNG NGHÊ NGÂY THƠ (Có máy móc mà chưa có học thức)
          if (chars.includes("tech") && villagerLevel < 1 && !chars.includes("book")) {
            panel.outcome = "Bẫy Ngây thơ: Thiếu kiến thức, máy móc hỏng hóc thành sắt vụn!";
            panel.isBadEnding = true;
            hasFatalErrorInPanel = true;
            currentVillagerState = CHAR_STATES.villager.confused; // Hoặc thêm ảnh khóc lóc nếu có
          } else {
            // Nâng cấp hợp lệ trong cùng một panel
            let levelInThisPanel = villagerLevel;

            if (chars.includes("book") && levelInThisPanel === 0) {
              levelInThisPanel = 1;
              currentVillagerState = CHAR_STATES.villager.educated;
              panel.outcome = "Giáo dục: Nguồn nhân lực chất lượng cao!";
            }
            if (chars.includes("tech") && levelInThisPanel === 1) {
              levelInThisPanel = 2;
              currentVillagerState = CHAR_STATES.villager.upgraded;
              panel.outcome = "CNH-HĐH: Năng suất nhảy vọt!";
            }
            if (chars.includes("anchor") && levelInThisPanel === 2) {
              levelInThisPanel = 3;
              currentVillagerState = CHAR_STATES.villager.independent;
              panel.outcome = "Tự chủ: Làm chủ công nghệ lõi & Thể chế!";
            }
            
            villagerLevel = levelInThisPanel; // Lưu trữ cho panel sau
          }
        }
      }

      // 3. LOGIC TẠI BIỂN LỚN
      if (scene === "sea") {
        if (chars.includes("villager") && chars.includes("merchant")) {
          if (villagerLevel < 2) {
            currentVillagerState = CHAR_STATES.villager.lost;
            currentMerchantState = CHAR_STATES.merchant.evil;
            panel.outcome = "Bẫy Bất bình đẳng: Năng suất thấp, làm bãi rác và bị bóc lột!";
            panel.isBadEnding = true;
            hasFatalErrorInPanel = true;
          } else if (villagerLevel === 2) {
            currentVillagerState = CHAR_STATES.villager.lost;
            currentMerchantState = CHAR_STATES.merchant.evil;
            panel.outcome = "Bẫy Gia công mướn: Thiếu Tự chủ, nền kinh tế sụp khi FDI rút vốn!";
            panel.isBadEnding = true;
            hasFatalErrorInPanel = true;
          } else if (villagerLevel === 3 && !chars.includes("fta")) {
            currentVillagerState = CHAR_STATES.villager.lost;
            currentMerchantState = CHAR_STATES.merchant.evil;
            panel.outcome = "Bẫy Luật Rừng: Bị các nước lớn chèn ép bằng hàng rào thuế quan!";
            panel.isBadEnding = true;
            hasFatalErrorInPanel = true;
          } else if (villagerLevel === 3 && chars.includes("fta")) {
            currentVillagerState = CHAR_STATES.villager.happy;
            currentMerchantState = CHAR_STATES.merchant.happy;
            panel.outcome = "HÒA NHẬP NHƯNG KHÔNG HÒA TAN!";
            isVictory = true;
          }
        } else if (chars.includes("villager") && !chars.includes("merchant")) {
          if (villagerLevel === 3) {
            currentVillagerState = CHAR_STATES.villager.confused;
            panel.outcome = "Bẫy Tụt hậu: Đủ nội lực nhưng bế quan tỏa cảng, từ chối Biển Lớn!";
            panel.isBadEnding = true;
            hasFatalErrorInPanel = true;
          } else {
            currentVillagerState = CHAR_STATES.villager.confused;
            panel.outcome = "Bác Thợ Cả ngơ ngác: Ra biển khơi mà không có đối tác giao thương?";
          }
        } else if (!chars.includes("villager") && chars.includes("merchant")) {
          currentMerchantState = CHAR_STATES.merchant.confused;
          panel.outcome = "Ngài Tư Bản ngơ ngác: Sao không có quốc gia nào ra giao thương nhỉ?";
        }
      }

      // 4. ÁP DỤNG TRẠNG THÁI CUỐI CÙNG CHO NHÂN VẬT ĐỂ RENDER
      let newChars = panel.characters.map((c) => {
        if (c.id === "villager") return { ...c, stateImg: currentVillagerState };
        if (c.id === "merchant") return { ...c, stateImg: currentMerchantState };
        return { ...c, stateImg: CHAR_STATES[c.id as CharId].idle };
      });

      panel.characters = newChars;
      newPanels[i] = panel;

      // Bad Ending chỉ cảnh báo tại panel đó, không reset level cho panel sau
    }

    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      setPanels(newPanels);
    }

    // XỬ LÝ KHI CHIẾN THẮNG
    if (isVictory && !isWin) {
      setIsWin(true);
      const audio = new Audio(win_audio_url);
      audio.play().catch((e) => console.log("Không thể phát âm thanh:", e));

      const savedData = localStorage.getItem("completedChapters");
      const completedList = savedData ? JSON.parse(savedData) : [];
      if (!completedList.includes(currentChapterId)) {
        completedList.push(currentChapterId);
        localStorage.setItem("completedChapters", JSON.stringify(completedList));
        globalThis.dispatchEvent(new Event("game-completed-sync"));
      }
    }
  }, [panels, currentChapterId, isWin]);

  const handleDragStart = (e: React.DragEvent, type: string, id: string, bgOrIcon: string) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("bgOrIcon", bgOrIcon);
  };

  const handleDropToPanel = (e: React.DragEvent, panelIndex: number) => {
    e.preventDefault();
    if (panels[panelIndex].isLocked) return;

    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");
    const bg = e.dataTransfer.getData("bgOrIcon");

    const newPanels = [...panels];
    const targetPanel = { ...newPanels[panelIndex] };

    if (type === "scene") {
      targetPanel.sceneId = id;
      targetPanel.sceneBg = bg;
      targetPanel.characters = [];
    } else if (type === "character") {
      if (!targetPanel.sceneId) return;

      if (
        targetPanel.characters.length < 3 &&
        !targetPanel.characters.find((c) => c.id === id)
      ) {
        targetPanel.characters.push({
          id: id as CharId,
          stateImg: CHAR_STATES[id as CharId].idle,
        });
      }
    }

    newPanels[panelIndex] = targetPanel;
    setPanels(newPanels);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const clearPanel = (index: number) => {
    const newPanels = [...panels];
    newPanels[index] = {
      sceneId: null, sceneBg: null, characters: [], outcome: null, isLocked: index !== 0, isBadEnding: false
    };
    for (let i = index + 1; i < 6; i++) {
      newPanels[i] = {
        sceneId: null, sceneBg: null, characters: [], outcome: null, isLocked: true, isBadEnding: false
      };
    }
    setPanels(newPanels);
  };

  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full ">
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#0c4a6e] font-bold tracking-wide">
          {chapter.fullTitle}
        </h2>
      </div>

      {/* PANELS GRID */}
      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, i) => (
            <div
              key={i}
              onDrop={(e) => handleDropToPanel(e, i)}
              onDragOver={handleDragOver}
              className={`border-4 rounded shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all 
                ${panel.isLocked ? "border-gray-400 opacity-50 bg-gray-200/20" : "border-[#0ea5e9] bg-[#bae6fd]/30"} 
                ${panel.outcome === "HÒA NHẬP NHƯNG KHÔNG HÒA TAN!" ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]" : ""}
                ${panel.isBadEnding ? "border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" : ""}
              `}
            >
              {panel.isLocked && (
                <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl"> 🔒 </div>
              )}

              {panel.sceneId && !panel.isLocked && (
                <button
                  onClick={() => clearPanel(i)}
                  className="absolute top-1 right-2 text-red-700/60 hover:text-red-800 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-full w-6 h-6 flex items-center justify-center"
                > X </button>
              )}

              {panel.sceneBg && (
                <img src={panel.sceneBg} alt="bg" className="absolute inset-0 w-full h-full object-cover z-0" />
              )}

              <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 px-4 pointer-events-none">
                <div className="flex h-[75%] gap-2 w-full justify-center">
                  {panel.characters.map((char) => (
                    <motion.div
                      key={char.id}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="h-full relative pointer-events-auto"
                    >
                      <img src={char.stateImg} alt={char.id} className="h-full w-auto object-contain drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)]" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {panel.outcome && (
                <div className={`absolute bottom-0 w-full h-10 backdrop-blur-sm flex items-center justify-center z-20 px-2 text-center 
                  ${panel.isBadEnding ? "bg-red-900/80" : panel.outcome.includes("HÒA NHẬP") ? "bg-green-900/80" : "bg-black/70"}`}
                >
                  <span className={`text-sm font-medium tracking-wide drop-shadow-md leading-tight 
                    ${panel.isBadEnding ? "text-red-200 font-bold" : panel.outcome.includes("HÒA NHẬP") ? "text-green-300 font-bold" : "text-white"}`}>
                    {panel.outcome}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KHAY ĐỒ NGHỀ (TRAY) */}
      <div className="h-[140px] mt-4 mx-12 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-center gap-8 bg-white/10 rounded-t-2xl">
        {CHAPTER_7_ASSETS.scenes.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[#0284c7] bg-white mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src={asset.icon} alt={asset.label} className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-[#0c4a6e] font-bold text-xs"> {asset.label} </span>
          </div>
        ))}
        <div className="w-[2px] h-14 bg-[#7dd3fc] mx-2"></div>
        {CHAPTER_7_ASSETS.characters.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "character", asset.id, asset.icon)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#0284c7] bg-white mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src={asset.icon} alt={asset.label} className="w-full h-full object-contain p-1" />
            </div>
            <span className="font-serif text-[#0c4a6e] font-bold text-xs text-center max-w-[60px] leading-tight"> {asset.label} </span>
          </div>
        ))}
      </div>

      {/* MODAL THẮNG */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#082f49]/90 z-50 flex flex-col items-center justify-center p-8 text-center rounded-lg backdrop-blur-sm"
          >
            <CheckCircle2 size={80} className="text-green-400 mb-4 animate-pulse" />
            <h2 className="text-4xl font-serif text-amber-400 font-bold mb-4">
              Vươn Ra Biển Lớn Thành Công!
            </h2>
            <p className="text-blue-100 max-w-xl text-lg mb-8">
              "Kết hợp sức mạnh nội lực từ Công nghiệp hóa, Hiện đại hóa và sức mạnh ngoại lực từ Hội nhập kinh tế quốc tế là chìa khóa để bảo vệ độc lập, tự chủ và phát triển phồn vinh."
            </p>
            <button
              onClick={() => setTimeout(() => router.push("/"), 300)}
              className="mt-4 px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-full transition-colors shadow-[0_0_15px_rgba(14,165,233,0.5)]"
            >
              Trở về Trang Chủ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}