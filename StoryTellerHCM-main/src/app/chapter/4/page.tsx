/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation"; // THÊM useRouter
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS & TRẠNG THÁI ẢNH
// ==========================================
const CHAPTER_4_ASSETS = {
  scenes: [
    {
      id: "office",
      label: "Văn phòng tư bản",
      icon: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148492/Bg_Office_vwfsw0.png",
      bg: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148492/Bg_Office_vwfsw0.png",
    },
    {
      id: "factory",
      label: "Xưởng sản xuất",
      icon: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148491/Bg_Factory_kbjctr.png",
      bg: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148491/Bg_Factory_kbjctr.png",
    },
    {
      id: "machine",
      label: "Xưởng máy móc",
      icon: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148492/Bg_Machine_mvdt3u.png",
      bg: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148492/Bg_Machine_mvdt3u.png",
    },
  ],
  characters: [
    { id: "worker", label: "Steve", icon: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210804/Worker_Icon_rzq0nc.png" },
    { id: "capital", label: "Alexander", icon: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210808/Capital_Icon_sokp1n.png" },
  ],
};

const CHAR_STATES = {
  worker: {
    idle: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210802/Worker_Idle_uqmnot.png",// Ô 1
    signing: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210802/Worker_Sign_ojsh0k.png",   // Ô 2
    working: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148470/Worker_Work_qz6muf.png",   // Ô 4
    tired: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773148470/Worker_Tired_ljbpcm.png",    // Ô 5
    confused: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210807/Worker_Confuse_iprgro.png",
  },
  capital: {
    idle: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210804/Capital_Idle_j1w5fi.png",
    buying: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210802/Capital_Sign_ca61le.png",   // Ô 2
    invest: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210803/Captital_Invest_heoupn.png", // Ô 3 // Ô 4
    rich: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210802/Capital_Rich_yswqnf.png",     // Ô 5
    confused: "https://res.cloudinary.com/dqgp2sceh/image/upload/v1773210804/Capital_Confuse_qb9atp.png",    
  },
};

// Tạm thời mock data Chương (Nên import từ gameData)
const chaptersData = [
  {
    id: 4,
    shortTitle: "Tư Bản",
    fullTitle: "Bí thuật sinh lời: Tiền đẻ ra tiền bằng cách nào?",
  },
];

interface PanelCharacter {
  id: "worker" | "capital";
  stateImg: string;
}

interface PanelState {
  sceneId: string | null;
  sceneBg: string | null;
  characters: PanelCharacter[];
  outcome: string | null;
  isLocked: boolean;
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter(); // KHỞI TẠO ROUTER

  const chapterId = params?.id ? Number(params.id) : 1;
  const chapter =
    chaptersData.find((c) => c.id === chapterId) || chaptersData[0];
  const currentChapterId = chapter.id;

  const [panels, setPanels] = useState<PanelState[]>(
    Array(6)
      .fill({
        sceneId: null,
        sceneBg: null,
        characters: [],
        outcome: null,
        isLocked: true,
      })
      .map((p, i) => ({ ...p, isLocked: i !== 0 })),
  );

  const [isWin, setIsWin] = useState(false);

  // ==========================================
  // 3. LOGIC GAME (TÍNH TOÁN TUYẾN TÍNH)
  // ==========================================
  useEffect(() => {
    let hasSignedContract = false;
    let hasWork1 = false;
    let hasWork2 = false;
    let hasInvest =false;
    let isVictory = false;

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
      let newChars: PanelCharacter[] = panel.characters.map((c) => ({
        ...c,
        stateImg: CHAR_STATES[c.id].idle,
      }));

      if (scene === "office") {
        if (chars.includes("capital") && chars.includes("worker") && !hasSignedContract) {
          hasSignedContract = true;
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.buying } : { ...c, stateImg: CHAR_STATES.worker.signing }
          );
          panel.outcome = "Đã ký hợp đồng mua Sức lao động";
        } else if (chars.includes("capital") && hasSignedContract && !hasWork1 ) {
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.idle } : c
          );
          panel.outcome = "Cần thời gian lao động";
        } else if (chars.includes("capital") && hasWork1 && !hasWork2 ) {
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.idle } : c
          );
          panel.outcome = "Chưa tạo ra giá trị thặng dư";
        } else if (chars.includes("capital")&& hasWork2 ) {
          
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.rich } : c
          );
          panel.outcome = "Tư bản chiếm hữu giá trị thặng dư";
          isVictory = true;
        }


        else if (chars.includes("capital") && !chars.includes("worker")&& !hasSignedContract ) {
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.idle } : c
          );
          panel.outcome = "Cần người lao động";
        } 
        
        else if (chars.includes("worker") && hasSignedContract) {
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.confused } : c
          );
        } else if (chars.includes("worker") && !chars.includes("capital") && !hasSignedContract) {
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.idle } : c
          );
          panel.outcome = "Cần nhà tư bản" ;
        }

      }

      if (scene === "factory") {
        if (chars.includes("worker") && !hasSignedContract && !hasInvest) {
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.idle } : c
          );
          panel.outcome = "Cần mua Sức lao động và Tư bản bất biến";
        } else if (chars.includes("worker")&& hasSignedContract && !hasInvest ) {
          newChars = newChars.map((c) =>
            c.id === "worker" ?{ ...c, stateImg: CHAR_STATES.worker.idle } :c
          );
          panel.outcome = "Cần đầu tư Tư bản bất biến";
        } else if (chars.includes("worker")&& !hasSignedContract && hasInvest ) {
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.idle } :c
          );
          panel.outcome = "Cần mua Sức lao động";
        } else if (chars.includes("worker")&& hasSignedContract && hasInvest ) {
          if(!hasWork1){
            hasWork1 = true;
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.working }:c
          );
          panel.outcome = "Lao động tất yếu";
          } else if(hasWork1 && !hasWork2){
            hasWork2=true;
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.tired } :c
          );
          panel.outcome = "Lao động thặng dư";
          } else if(hasWork2){
            newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.idle } : c
          );
          }
        }
        
        

        if (chars.includes("capital")) {
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.confused } : c
          );
        } 
      }

      if (scene === "machine") {
        if (chars.includes("capital") && !chars.includes("worker")) {
          hasInvest=true;
          newChars = newChars.map((c) =>
            c.id === "capital" ? { ...c, stateImg: CHAR_STATES.capital.invest} :c
          );
          panel.outcome = "Đầu tư vào tư bản bất biến";
        } 
        if (chars.includes("worker")) {
          newChars = newChars.map((c) =>
            c.id === "worker" ? { ...c, stateImg: CHAR_STATES.worker.confused } : c
          );
          panel.outcome = "Công nhân ở đây làm gì???" ;
        }
      }

      panel.characters = newChars;
      newPanels[i] = panel;
    }

    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPanels(newPanels);
    }

    // ==========================================
    // XỬ LÝ KHI CHIẾN THẮNG
    // ==========================================
    if (isVictory && !isWin) {
      setIsWin(true);

      // 1. Phát âm thanh chiến thắng (Nhớ thêm file win.mp3 vào thư mục public/sounds)
      const audio = new Audio("/sounds/win.wav");
      audio.play().catch((e) => console.log("Không thể phát âm thanh:", e));

      // 2. Lưu trạng thái hoàn thành vào LocalStorage
      const savedData = localStorage.getItem("completedChapters");
      const completedList = savedData ? JSON.parse(savedData) : [];

      if (!completedList.includes(currentChapterId)) {
        completedList.push(currentChapterId);
        localStorage.setItem(
          "completedChapters",
          JSON.stringify(completedList),
        );

        globalThis.dispatchEvent(new Event("game-completed-sync"));
      }
    }
  }, [panels, currentChapterId, isWin]);

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
        targetPanel.characters.length < 2 &&
        !targetPanel.characters.find((c) => c.id === id)
      ) {
        targetPanel.characters.push({
          id: id as "worker" | "capital",
          stateImg: CHAR_STATES[id as "worker" | "capital"].idle,
        });
      }
    }

    newPanels[panelIndex] = targetPanel;
    setPanels(newPanels);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDropToBin = (e: React.DragEvent) => {};

  const clearPanel = (index: number) => {
    const newPanels = [...panels];
    newPanels[index] = {
      sceneId: null,
      sceneBg: null,
      characters: [],
      outcome: null,
      isLocked: index !== 0,
    };
    for (let i = index + 1; i < 6; i++) {
      newPanels[i] = {
        sceneId: null,
        sceneBg: null,
        characters: [],
        outcome: null,
        isLocked: true,
      };
    }
    setPanels(newPanels);
  };

  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full">
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide">
          Chương 4: Bí thuật Sinh lời
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
              className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${panel.isLocked ? "border-gray-400 opacity-50 bg-gray-200/20" : "border-[#a69279]"} ${panel.outcome === "TRAO ĐỔI THÀNH CÔNG!" ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""}`}
            >
              {panel.isLocked && (
                <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">
                  {" "}
                  🔒{" "}
                </div>
              )}

              {panel.sceneId && !panel.isLocked && (
                <button
                  onClick={() => clearPanel(i)}
                  className="absolute top-1 right-2 text-red-700/60 hover:text-red-800 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  {" "}
                  X{" "}
                </button>
              )}

              {panel.sceneBg && (
                <img
                  src={panel.sceneBg}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              {/* FIX LỖI NHÂN VẬT PHÁ KHUNG Ở ĐÂY */}
              <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 px-4 pointer-events-none">
                <div className="flex h-[85%] gap-2 w-full justify-center">
                  {panel.characters.map((char) => (
                    <motion.div
                      key={char.id}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="h-full relative pointer-events-auto"
                    >
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
                    {" "}
                    {panel.outcome}{" "}
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
        onDrop={handleDropToBin}
        onDragOver={handleDragOver}
      >
        {CHAPTER_4_ASSETS.scenes.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-sm">
              {" "}
              {asset.label}{" "}
            </span>
          </div>
        ))}
        <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-4"></div>
        {CHAPTER_4_ASSETS.characters.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, "character", asset.id, asset.icon)
            }
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-sm">
              {" "}
              {asset.label}{" "}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL THẮNG */}
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
              {" "}
              Hoàn thành xuất sắc!{" "}
            </h2>
            <button
              // CHUYỂN HƯỚNG VỀ TRANG SÁCH CHÍNH TẠI ĐÂY
              onClick={() => setTimeout(() => router.push("/"), 300)}
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
