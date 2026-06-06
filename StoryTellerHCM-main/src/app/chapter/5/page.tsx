/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS (Đã sửa đuôi .PNG để khớp với thư mục của bạn)
// ==========================================
const CHAPTER_5_ASSETS = {
  scenes: [
    {
      id: "factory",
      label: "Xưởng nhỏ",
      icon: "/BookImage/Story5/Capture8.PNG",
      bg: "/BookImage/Story5/Gemini_Generated_Image_q6wqqtq6wqqtq6wq.png",
    },
    {
      id: "crisis",
      label: "Khủng hoảng",
      icon: "/BookImage/Story5/Capture6.PNG",
      bg: "/BookImage/Story5/Gemini_Generated_Image_6uynvn6uynvn6uyn.png",
    },
    {
      id: "meeting",
      label: "Phòng họp",
      icon: "/BookImage/Story5/Capture7.PNG",
      bg: "/BookImage/Story5/Gemini_Generated_Image_yuh93fyuh93fyuh9.png",
    },
    {
      id: "monopoly",
      label: "Đế chế",
      icon: "/BookImage/Story5/Capture9.PNG",
      bg: "/BookImage/Story5/Gemini_Generated_Image_kkubs4kkubs4kkub.png",
    },
  ],
  characters: [
    {
      id: "boss",
      label: "Đại tư bản",
      icon: "/BookImage/Story5/Capture1.PNG",
    },
    {
      id: "owner",
      label: "Chủ xưởng",
      icon: "/BookImage/Story5/Captur.PNG",
    },
  ],
};

const CHAR_STATES = {
  boss: {
    idle: "/BookImage/Story5/Capture1.PNG",
    working: "/BookImage/Story5/Capture4.PNG",
    plotting: "/BookImage/Story5/Capture3.PNG",
    victory: "/BookImage/Story5/Capture2.PNG",
    confused: "/BookImage/Story5/Capture1.PNG",
  },
  owner: {
    idle: "/BookImage/Story5/Capture.PNG",
    struggling: "/BookImage/Story5/Captur.PNG",
    happy: "/BookImage/Story5/Captue.PNG",
    confused: "/BookImage/Story5/Captur.PNG",
  },
};

interface PanelCharacter {
  id: "boss" | "owner";
  stateImg: string;
}

interface PanelState {
  sceneId: string | null;
  sceneBg: string | null;
  characters: PanelCharacter[];
  outcome: string | null;
  isLocked: boolean;
}

export default function Chapter5Page() {
  const router = useRouter();
  const [isWin, setIsWin] = useState(false);
  const [panels, setPanels] = useState<PanelState[]>(
    Array(6)
      .fill(null)
      .map((_, i) => ({
        sceneId: null,
        sceneBg: null,
        characters: [],
        outcome: null,
        isLocked: i !== 0,
      })),
  );

  // ==========================================
  // 2. LOGIC GAME (Trái sang phải - Nhân quả)
  // ==========================================
  useEffect(() => {
    // Các biến trạng thái này sẽ cộng dồn từ trái sang phải
    let hasConcentration = false;
    let hasCrisis = false;
    let hasAlliance = false;
    let isVictory = false;

    const newPanels = [...panels];

    for (let i = 0; i < 6; i++) {
      const panel = { ...newPanels[i] };

      // Khóa các ô tương lai nếu ô hiện tại trống
      if (!panel.sceneId) {
        for (let j = i + 1; j < 6; j++) newPanels[j].isLocked = true;
        newPanels[i] = panel;
        break; // Dừng việc kiểm tra các ô sau
      }

      // Mở khóa ô tiếp theo
      if (i + 1 < 6) newPanels[i + 1].isLocked = false;

      const chars = panel.characters.map((c) => c.id);
      let newChars: PanelCharacter[] = panel.characters.map((c) => ({
        ...c,
        stateImg: CHAR_STATES[c.id].idle,
      }));

      // --- SCENE: XƯỞNG NHỎ ---
      if (panel.sceneId === "factory") {
        if (chars.includes("boss")) {
          hasConcentration = true; // Kích hoạt biến tập trung
          panel.outcome = "Tập trung sản xuất hình thành";
          newChars = newChars.map((c) =>
            c.id === "boss" ? { ...c, stateImg: CHAR_STATES.boss.working } : c,
          );
        } else {
          panel.outcome = "Sản xuất nhỏ lẻ...";
        }
      }

      // --- SCENE: KHỦNG HOẢNG ---
      if (panel.sceneId === "crisis") {
        if (chars.includes("owner") && chars.includes("boss")) {
          hasCrisis = true; // Yêu cầu BẮT BUỘC có cả 2 người
          panel.outcome = "Đại tư bản chèn ép, chủ xưởng phá sản!";
          newChars = newChars.map((c) => ({
            ...c,
            stateImg:
              c.id === "owner"
                ? CHAR_STATES.owner.struggling
                : CHAR_STATES.boss.plotting,
          }));
        } else if (chars.includes("owner")) {
          panel.outcome = "Chủ xưởng lao đao...";
          newChars = newChars.map((c) =>
            c.id === "owner"
              ? { ...c, stateImg: CHAR_STATES.owner.struggling }
              : c,
          );
        } else if (chars.includes("boss")) {
          panel.outcome = "Đại tư bản chờ thời cơ...";
        } else {
          panel.outcome = "Thị trường biến động...";
        }
      }

      // --- SCENE: PHÒNG HỌP ---
      if (panel.sceneId === "meeting") {
        if (chars.includes("boss") && chars.includes("owner")) {
          // Điều kiện kép: Phải có Concentration VÀ Crisis ở các ô TRƯỚC ĐÓ
          if (hasConcentration && hasCrisis) {
            hasAlliance = true;
            panel.outcome = "Liên minh Độc quyền xác lập";
            newChars = newChars.map((c) => ({
              ...c,
              stateImg:
                c.id === "boss"
                  ? CHAR_STATES.boss.plotting
                  : CHAR_STATES.owner.happy,
            }));
          } else {
            panel.outcome =
              "Chưa đủ điều kiện (Thiếu tập trung hoặc khủng hoảng)";
            newChars = newChars.map((c) => ({
              ...c,
              stateImg: CHAR_STATES[c.id].confused,
            }));
          }
        } else {
          panel.outcome = "Đang thảo luận...";
        }
      }

      // --- SCENE: ĐẾ CHẾ ĐỘC QUYỀN ---
      if (panel.sceneId === "monopoly") {
        if (hasAlliance && chars.includes("boss")) {
          panel.outcome = "ĐẾ CHẾ ĐỘC QUYỀN THỐNG TRỊ!";
          isVictory = true;
          newChars = newChars.map((c) =>
            c.id === "boss" ? { ...c, stateImg: CHAR_STATES.boss.victory } : c,
          );
        } else {
          panel.outcome = "Cạnh tranh vẫn tiếp diễn...";
        }
      }

      panel.characters = newChars;
      newPanels[i] = panel;
    }

    // Tối ưu render: Chỉ set state khi data thực sự thay đổi
    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      setPanels(newPanels);
    }

    // Xử lý win game và lưu lịch sử (đã được cập nhật từ lần trước)
    if (isVictory && !isWin) {
      setIsWin(true);
      const audio = new Audio("/sounds/win.wav");
      audio.play().catch(() => {
        console.log("Trình duyệt chặn audio");
      });

      try {
        const CHAPTER_ID = 5;
        const savedData = localStorage.getItem("completedChapters");
        const completedList = savedData ? JSON.parse(savedData) : [];
        if (!completedList.includes(CHAPTER_ID)) {
          completedList.push(CHAPTER_ID);
          localStorage.setItem(
            "completedChapters",
            JSON.stringify(completedList),
          );
          globalThis.dispatchEvent(new Event("game-completed-sync"));
        }
      } catch (error) {
        console.error("Lỗi lưu game:", error);
      }
    }
  }, [panels, isWin]);

  // ==========================================
  // 3. HANDLERS (DRAG & DROP VÀ CLEAR PANEL)
  // ==========================================
  const handleDragStart = (
    e: React.DragEvent,
    type: string,
    id: string,
    bgOrIcon: string,
  ) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("bgOrIcon", bgOrIcon);
  };

  const handleDropToPanel = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (panels[index].isLocked) return;

    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");
    const bg = e.dataTransfer.getData("bgOrIcon");

    const newPanels = [...panels];
    const target = { ...newPanels[index] };

    if (type === "scene") {
      target.sceneId = id;
      target.sceneBg = bg;
      target.characters = [];
      target.outcome = null;
    } else if (type === "character") {
      if (!target.sceneId) return;
      if (
        target.characters.length < 2 &&
        !target.characters.find((c) => c.id === id)
      ) {
        target.characters.push({
          id: id as "boss" | "owner",
          stateImg: CHAR_STATES[id as "boss" | "owner"].idle,
        });
      }
    }
    newPanels[index] = target;
    setPanels(newPanels);
  };

  // Xóa ô hiện tại VÀ TOÀN BỘ CÁC Ô SAU NÓ (Reset lại từ điểm bị xóa)
  const clearPanel = (index: number) => {
    const newPanels = [...panels];

    for (let i = index; i < 6; i++) {
      newPanels[i] = {
        sceneId: null,
        sceneBg: null,
        characters: [],
        outcome: null,
        // Chỉ giữ cho ô đầu tiên hoặc ô ngay lúc bấm được mở khóa, còn lại khóa hết
        isLocked: i !== 0,
      };
    }

    // Đảm bảo ô vừa bị xóa phải được mở khóa để kéo thả lại ngay lập tức
    if (index < 6) {
      newPanels[index].isLocked = false;
    }

    setPanels(newPanels);
  };

  // ==========================================
  // 4. RETURN GIAO DIỆN
  // ==========================================
  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full">
      {/* HEADER */}
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide">
          Chương 5: Đế chế Độc quyền
        </h2>
      </div>

      {/* PANELS GRID */}
      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, i) => (
            <div
              key={i}
              onDrop={(e) => handleDropToPanel(e, i)}
              onDragOver={(e) => e.preventDefault()}
              className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${panel.isLocked ? "border-gray-400 opacity-50 bg-gray-200/20" : "border-[#a69279]"} ${panel.outcome === "ĐẾ CHẾ ĐỘC QUYỀN THỐNG TRỊ!" ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : ""}`}
            >
              {panel.isLocked && (
                <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">
                  🔒
                </div>
              )}

              {panel.sceneId && !panel.isLocked && (
                <button
                  onClick={() => clearPanel(i)}
                  className="absolute top-1 right-2 text-red-700/60 hover:text-red-800 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  X
                </button>
              )}

              {panel.sceneBg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={panel.sceneBg}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={char.stateImg}
                        alt={char.id}
                        className="h-full w-auto object-contain drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)]"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {panel.outcome && (
                <div className="absolute bottom-0 w-full h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <span className="text-white text-sm font-medium tracking-wide drop-shadow-md">
                    {panel.outcome}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KHAY ĐỒ NGHỀ (TRAY) */}
      <div
        className="h-[140px] mt-4 mx-12 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-center gap-8 bg-white/10 rounded-t-2xl"
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Nhóm Scene */}
        {CHAPTER_5_ASSETS.scenes.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-sm">
              {asset.label}
            </span>
          </div>
        ))}

        <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-4"></div>

        {/* Nhóm Character */}
        {CHAPTER_5_ASSETS.characters.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, "character", asset.id, asset.icon)
            }
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-sm">
              {asset.label}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL CHIẾN THẮNG */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center rounded-lg"
          >
            <CheckCircle2
              size={80}
              className="text-green-400 mb-4 animate-pulse"
            />
            <h2 className="text-4xl font-serif text-amber-400 font-bold mb-4">
              Hoàn thành xuất sắc!
            </h2>
            {/* Đã xóa dấu ngoặc kép bọc ngoài text gây lỗi ESLint */}
            <p className="text-amber-500/80 italic text-2xl mb-6">
              Sự tập trung sản xuất đã dẫn đến các tổ chức độc quyền lũng đoạn
              thị trường
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-8 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full transition-colors"
            >
              Chơi tiếp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
