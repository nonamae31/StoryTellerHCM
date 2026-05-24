"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const CHAPTER_3_ASSETS = {
  scenes: [
    {
      id: "forge",
      label: "Tiệm rèn",
      bg: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773116975/tiemren_apucvj.jpg",
    },
    {
      id: "evaShop",
      label: "Nơi Eva bán muối",
      bg: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773121724/boicanhcho_hzrqyy.jpg",
    },
    {
      id: "tomRain",
      label: "Tom dưới trời mưa",
      bg: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114729/tomrain_r1fdgt.jpg",
    },
  ],
  characters: [
    {
      id: "adam",
      label: "Adam",
      icon: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114730/adamavt_sdxenm.jpg",
    },
    {
      id: "bob",
      label: "Bob",
      icon: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114733/bobavt_x68tcc.jpg",
    },
    {
      id: "eva",
      label: "Eva",
      icon: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114734/evaavt_qurvs9.jpg",
    },
    {
      id: "rain",
      label: "Mưa",
      icon: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114738/rain_auq1xg.jpg",
    },
    {
      id: "sun",
      label: "Mặt trời",
      icon: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773121633/sun-9632_1_nvcgml.png",
    },
  ],
} as const;

type SceneId = "forge" | "evaShop" | "tomRain";
type CharacterId = "adam" | "bob" | "eva" | "rain" | "sun";

interface PanelState {
  sceneId: SceneId | null;
  characters: CharacterId[];
  sceneBg: string | null;
  outcome: string | null;
  isLocked: boolean;
}

const BASE_BG: Record<SceneId, string> = {
  forge:
    "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773116975/tiemren_apucvj.jpg",
  evaShop:
    "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773121724/boicanhcho_hzrqyy.jpg",
  tomRain:
    "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114729/tomrain_r1fdgt.jpg",
};

const COMPOSITE_BG = {
  forge: {
    bobOnly:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114731/bobtiem_hvpw6w.jpg",
    adamAndBob:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114739/bobanadam_k2ndaa.jpg",
    evaAndBob:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114732/bobbaneva_fidaes.jpg",
    wrongAdam:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773120216/adamboiroi_ygp9fv.jpg",
    wrongEva:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773120330/evaboiroi_iymfqf.jpg",
  },
  evaShop: {
    evaOnly:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114731/eva_xy6jmj.jpg",
    adamAndEva:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114732/evabanadam_jmjxpw.jpg",
    bobAndEva:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114733/evabanbob_mw8qyr.jpg",
    evaAndRain:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114734/evarain_u03upv.jpg",
    evaBadEnd:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773123204/evabadend_o154s0.jpg",
    wrongBob:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773121800/bobocho_fdbtkg.jpg",
    wrongAdam:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773121799/adamocho_iwkftn.jpg",
    adamAndBobWrong:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773124609/adamandbobocho_qnnfzd.jpg",
    evaBobAdam:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773124608/evabobadam_f6ebps.jpg",
  },
  tomRain: {
    adam: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114729/tombanadam_jc4vlp.jpg",
    bob: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114734/tomandbob_u3kxhf.jpg",
    eva: "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773114730/tomandeva_whxrrp.jpg",
    sunny:
      "https://res.cloudinary.com/ds2fttfv2/image/upload/v1773121634/tomtroinang_x0z8xq.jpg",
  },
} as const;

export default function Chapter3Page() {
  const router = useRouter();

  const [panels, setPanels] = useState<PanelState[]>(
    Array(6)
      .fill({
        sceneId: null,
        characters: [],
        sceneBg: null,
        outcome: null,
        isLocked: true,
      })
      .map((p, i) => ({ ...p, isLocked: i !== 0 })),
  );

  const [hasSimpleForm, setHasSimpleForm] = useState(false);
  const [hasExtendedForm, setHasExtendedForm] = useState(false);
  const [hasGeneralForm, setHasGeneralForm] = useState(false);
  const [hasTomUnlocked, setHasTomUnlocked] = useState(false);
  const [hasMoneyForm, setHasMoneyForm] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    const newPanels: PanelState[] = panels.map((p) => ({
      ...p,
      characters: [...p.characters],
    }));

    let simpleForm = false;
    let extendedForm = false;
    let generalForm = false;
    let tomUnlocked = hasTomUnlocked;
    let moneyForm = false;
    let hasSunnyTom = false;

    const evaWithAdamPanels: number[] = [];
    const evaWithBobPanels: number[] = [];

    for (let i = 0; i < newPanels.length; i++) {
      const panel = newPanels[i];
      const originalOutcome = panel.outcome;

      if (!panel.sceneId) {
        for (let j = i + 1; j < newPanels.length; j++) {
          newPanels[j].isLocked = true;
        }
        break;
      }

      if (i + 1 < newPanels.length) {
        newPanels[i + 1].isLocked = false;
      }

      const scene = panel.sceneId;
      const chars = panel.characters;
      panel.outcome = null;
      panel.sceneBg = BASE_BG[scene];

      if (scene === "forge") {
        let hasAdam = chars.includes("adam");
        let hasBob = chars.includes("bob");
        let hasEva = chars.includes("eva");

        if (hasAdam && hasEva && !hasBob) {
          newPanels[i].characters = chars.filter(
            (_, idx) => idx !== chars.length - 1,
          );
          panel.outcome = "Đã có người hẹn trước với Bob.";
          hasAdam = newPanels[i].characters.includes("adam");
          hasEva = newPanels[i].characters.includes("eva");
        }

        if (hasBob && !hasAdam && !hasEva) {
          panel.sceneBg = COMPOSITE_BG.forge.bobOnly;
          panel.outcome = "Bob đang làm việc trong tiệm rèn.";
        } else if (hasBob && hasAdam && !hasEva) {
          simpleForm = true;
          panel.sceneBg = COMPOSITE_BG.forge.adamAndBob;
          panel.outcome = "Hình thái giản đơn: Adam trao đổi với Bob.";
          panel.isLocked = true;
        } else if (hasBob && hasEva && !hasAdam) {
          simpleForm = true;
          panel.sceneBg = COMPOSITE_BG.forge.evaAndBob;
          panel.outcome = "Hình thái giản đơn: Eva trao đổi với Bob.";
          panel.isLocked = true;
        } else if (hasAdam && !hasBob) {
          panel.sceneBg = COMPOSITE_BG.forge.wrongAdam;
          if (
            !panel.outcome &&
            originalOutcome === "Đã có người hẹn trước với Bob."
          ) {
            panel.outcome = originalOutcome;
          } else if (!panel.outcome) {
            panel.outcome = "Adam bối rối trong tiệm rèn.";
          }
        } else if (hasEva && !hasBob) {
          panel.sceneBg = COMPOSITE_BG.forge.wrongEva;
          if (
            !panel.outcome &&
            originalOutcome === "Đã có người hẹn trước với Bob."
          ) {
            panel.outcome = originalOutcome;
          } else if (!panel.outcome) {
            panel.outcome = "Eva bối rối trong tiệm rèn.";
          }
        }
      }

      if (scene === "evaShop") {
        const hasAdam = chars.includes("adam");
        const hasBob = chars.includes("bob");
        const hasEva = chars.includes("eva");
        const hasRain = chars.includes("rain");
        const hasSun = chars.includes("sun");

        if (hasEva && !hasAdam && !hasBob && !hasRain) {
          panel.sceneBg = COMPOSITE_BG.evaShop.evaOnly;
          panel.outcome = "Eva đang bán muối.";
        }

        if (hasEva && hasRain) {
          tomUnlocked = true;
          panel.sceneBg = COMPOSITE_BG.evaShop.evaAndRain;
          if (hasAdam || hasBob) {
            panel.outcome = "Trời mưa, mọi người đã về nhà.";
            newPanels[i].characters = chars.filter(
              (c) => c !== "adam" && c !== "bob",
            );
          } else if (originalOutcome === "Trời mưa, mọi người đã về nhà.") {
            panel.outcome = originalOutcome;
          } else {
            panel.outcome = "Mưa đến nơi Eva bán muối.";
          }
        }

        // Eva bị mưa rồi cho lại mặt trời vào -> bad end + hiện sao + khóa panel
        if (hasEva && hasRain && hasSun) {
          panel.sceneBg = COMPOSITE_BG.evaShop.evaBadEnd;
          panel.outcome = "Dính mưa, muối chảy -> Mất giá trị";
          panel.isLocked = true;
        }

        if (hasEva && hasAdam && !hasBob && !hasRain) {
          panel.sceneBg = COMPOSITE_BG.evaShop.adamAndEva;
          panel.outcome = "Adam trao đổi với Eva.";
          evaWithAdamPanels.push(i);
        }

        if (hasEva && hasBob && !hasAdam && !hasRain) {
          panel.sceneBg = COMPOSITE_BG.evaShop.bobAndEva;
          panel.outcome = "Bob trao đổi với Eva.";
          evaWithBobPanels.push(i);
        }

        if (hasEva && hasAdam && hasBob && !hasRain) {
          if (!generalForm) {
            generalForm = true;
            panel.outcome =
              "Hình thái chung: Cả Adam và Bob trao đổi với Eva thông qua muối.";
            panel.sceneBg = COMPOSITE_BG.evaShop.evaBobAdam;
            panel.isLocked = true;
          } else {
            panel.outcome = "Ba người Adam, Bob và Eva cùng ở chợ.";
            panel.sceneBg = COMPOSITE_BG.evaShop.evaBobAdam;
            panel.isLocked = false;
          }
        }

        if (!hasEva) {
          if (hasAdam && hasBob) {
            panel.sceneBg = COMPOSITE_BG.evaShop.adamAndBobWrong;
            panel.outcome = "Adam và Bob đều không gặp Eva.";
          } else if (hasBob) {
            panel.sceneBg = COMPOSITE_BG.evaShop.wrongBob;
            panel.outcome = "Bob đến chợ nhưng không gặp Eva.";
          } else if (hasAdam) {
            panel.sceneBg = COMPOSITE_BG.evaShop.wrongAdam;
            panel.outcome = "Adam đến chợ nhưng không gặp Eva.";
          }
        }
      }

      if (scene === "tomRain") {
        const hasAdam = chars.includes("adam");
        const hasBob = chars.includes("bob");
        const hasEva = chars.includes("eva");
        const hasSun = chars.includes("sun");
        const hasRain = chars.includes("rain");

        // Toggle thời tiết: có sun => nắng, có rain (hoặc không có sun) => mưa
        if (hasSun && !hasRain) {
          hasSunnyTom = true;
          panel.sceneBg = COMPOSITE_BG.tomRain.sunny;
          panel.outcome =
            "Mặt trời xuất hiện, trời đã tạnh mưa và vàng không bị vấn đề gì cả.";
        }

        if (!hasSun || hasRain) {
          if (hasAdam || hasBob || hasEva) {
            panel.outcome = "Trời mưa, mọi người đã về nhà.";
          }
        }

        if (hasSun && !hasRain && hasAdam) {
          moneyForm = true;
          panel.sceneBg = COMPOSITE_BG.tomRain.adam;
          panel.outcome =
            "Hình thái tiền tệ: Adam trao đổi với Tom thông qua vàng.";
          panel.isLocked = true;
        } else if (hasSun && !hasRain && hasBob) {
          moneyForm = true;
          panel.sceneBg = COMPOSITE_BG.tomRain.bob;
          panel.outcome =
            "Hình thái tiền tệ: Bob trao đổi với Tom thông qua vàng.";
          panel.isLocked = true;
        } else if (hasSun && !hasRain && hasEva) {
          moneyForm = true;
          panel.sceneBg = COMPOSITE_BG.tomRain.eva;
          panel.outcome =
            "Hình thái tiền tệ: Eva trao đổi với Tom thông qua vàng.";
          panel.isLocked = true;
        }
      }

      newPanels[i] = panel;
    }

    if (evaWithAdamPanels.length > 0 && evaWithBobPanels.length > 0) {
      const distinct = evaWithAdamPanels.some((idx) =>
        evaWithBobPanels.some((j) => j !== idx),
      );
      if (distinct) {
        extendedForm = true;
        evaWithAdamPanels.forEach((idx) => {
          newPanels[idx].outcome =
            "Hình thái mở rộng (Eva ↔ Adam): trao đổi cừu lấy muối.";
        });
        evaWithBobPanels.forEach((idx) => {
          newPanels[idx].outcome =
            "Hình thái mở rộng (Eva ↔ Bob): trao đổi rìu lấy muối.";
        });
      }
    }

    // Chỉ cập nhật state nếu thực sự thay đổi để tránh vòng lặp vô hạn
    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      setPanels(newPanels);
    }
    if (simpleForm !== hasSimpleForm) setHasSimpleForm(simpleForm);
    if (tomUnlocked !== hasTomUnlocked) setHasTomUnlocked(tomUnlocked);
    if (extendedForm !== hasExtendedForm) setHasExtendedForm(extendedForm);
    if (generalForm !== hasGeneralForm) setHasGeneralForm(generalForm);
    if (moneyForm !== hasMoneyForm) setHasMoneyForm(moneyForm);

    if (simpleForm && extendedForm && generalForm && moneyForm && !isWin) {
      setIsWin(true);

      const audio = new Audio("/sounds/win.wav");
      audio.play().catch(() => {});

      const savedData = localStorage.getItem("completedChapters");
      const completedList = savedData ? JSON.parse(savedData) : [];
      const currentChapterId = 3;

      if (!completedList.includes(currentChapterId)) {
        completedList.push(currentChapterId);
        localStorage.setItem(
          "completedChapters",
          JSON.stringify(completedList),
        );
        globalThis.dispatchEvent(new Event("game-completed-sync"));
      }
    }
  }, [panels, hasTomUnlocked, isWin]);

  const handleDragStart = (
    e: React.DragEvent,
    type: "scene" | "character",
    id: string,
    bg?: string,
  ) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("id", id);
    if (bg) e.dataTransfer.setData("bg", bg);
  };

  const handleDropToPanel = (e: React.DragEvent, panelIndex: number) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");
    const bg = e.dataTransfer.getData("bg");

    const updated = [...panels];
    const target = { ...updated[panelIndex] };

    if (target.isLocked) return;

    if (type === "scene") {
      const sceneId = id as SceneId;
      if (sceneId === "tomRain" && !hasTomUnlocked) return;
      target.sceneId = sceneId;
      target.sceneBg = bg || BASE_BG[sceneId];
      target.characters = [];
      target.outcome = null;
    }

    if (type === "character") {
      if (!target.sceneId) return;
      const charId = id as CharacterId;

      // Mặt trời: cho phép ở tomRain và evaShop (theo luồng Eva bị mưa -> thêm nắng)
      if (
        charId === "sun" &&
        target.sceneId !== "tomRain" &&
        target.sceneId !== "evaShop"
      )
        return;

      // tomRain: toggle thời tiết theo kiểu switch-case
      // - Thả "Mặt trời" => chuyển sang nắng (loại "Mưa" nếu có)
      // - Thả "Mưa" => chuyển sang mưa (loại "Mặt trời" nếu có)
      // - Chỉ khi nắng mới cho thêm Adam/Bob/Eva
      if (target.sceneId === "tomRain") {
        const hasSun = target.characters.includes("sun");
        const hasRain = target.characters.includes("rain");

        if (charId === "sun") {
          target.characters = target.characters.filter((c) => c !== "rain");
          if (!target.characters.includes("sun")) target.characters.push("sun");
        } else if (charId === "rain") {
          target.characters = target.characters.filter((c) => c !== "sun");
          if (!target.characters.includes("rain"))
            target.characters.push("rain");
        } else {
          const isSunnyNow =
            (hasSun && !hasRain) ||
            (target.characters.includes("sun") &&
              !target.characters.includes("rain"));
          if (!isSunnyNow) return;
          if (!target.characters.includes(charId)) {
            target.characters.push(charId);
          }
        }

        updated[panelIndex] = target;
        setPanels(updated);
        return;
      }

      if (!target.characters.includes(charId)) {
        target.characters.push(charId);
      }
    }

    updated[panelIndex] = target;
    setPanels(updated);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const clearPanel = (index: number) => {
    const newPanels = [...panels];
    newPanels[index] = {
      sceneId: null,
      characters: [],
      sceneBg: null,
      outcome: null,
      isLocked: index !== 0,
    };
    for (let i = index + 1; i < newPanels.length; i++) {
      newPanels[i] = {
        sceneId: null,
        characters: [],
        sceneBg: null,
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
          Chương 3: Các hình thái của hàng hóa
        </h2>
      </div>

      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, i) => (
            <div
              key={i}
              onDrop={(e) => handleDropToPanel(e, i)}
              onDragOver={handleDragOver}
              className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${
                panel.isLocked && !panel.outcome?.includes("Hình thái")
                  ? "border-gray-400 opacity-50 bg-gray-200/20"
                  : "border-[#a69279]"
              } ${
                panel.outcome?.includes("Hình thái tiền tệ")
                  ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  : ""
              }`}
            >
              {/* Ngôi sao khi ghép đúng Hình thái */}
              {panel.outcome?.includes("Hình thái") && (
                <div className="absolute top-1 left-2 z-40 pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-amber-300 shadow-lg flex items-center justify-center border border-amber-500">
                    <span className="text-yellow-700 text-xl font-bold drop-shadow-sm">
                      ★
                    </span>
                  </div>
                </div>
              )}

              {panel.isLocked && !panel.outcome?.includes("Hình thái") && (
                <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl pointer-events-none">
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
                <img
                  src={panel.sceneBg}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                />
              )}

              {panel.outcome && (
                <div className="absolute bottom-0 w-full h-10 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 px-2 pointer-events-none">
                  <span className="text-white text-sm font-medium tracking-wide text-center drop-shadow-md">
                    {panel.outcome}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-[160px] mt-4 mx-12 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-center gap-8 bg-white/10 rounded-t-2xl">
        {CHAPTER_3_ASSETS.scenes.map((scene) => {
          const isTom = scene.id === "tomRain";
          const disabled = isTom && !hasTomUnlocked;
          return (
            <div
              key={scene.id}
              draggable={!disabled}
              onDragStart={(e) =>
                !disabled &&
                handleDragStart(e, "scene", scene.id, scene.bg as string)
              }
              className={`flex flex-col items-center ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-grab hover:scale-110 active:cursor-grabbing"
              }`}
            >
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={scene.bg}
                  alt={scene.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-[#5c4a3d] font-bold text-sm text-center">
                {scene.label}
                {disabled && " (Khóa)"}
              </span>
            </div>
          );
        })}

        <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-4" />

        {CHAPTER_3_ASSETS.characters.map((ch) => (
          <div
            key={ch.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "character", ch.id)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={ch.icon}
                alt={ch.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-sm">
              {ch.label}
            </span>
          </div>
        ))}
      </div>

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
              Hoàn thành tất cả hình thái hàng hóa!
            </h2>
            <button
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
