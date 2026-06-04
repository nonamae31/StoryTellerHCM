"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const IMAGE_URLS = {
  tantraoFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590758/ChatGPT_Image_Jun_4_2026_11_25_16_PM_1_om1hdu.png",
  badinhFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590758/ChatGPT_Image_Jun_4_2026_11_25_16_PM_2_nvwzfe.png",
  tantraoEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590753/ChatGPT_Image_Jun_4_2026_11_24_58_PM_1_lelfdq.png",
  badinhEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590752/ChatGPT_Image_Jun_4_2026_11_24_59_PM_2_pgnn7n.png",
  diplomacyEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590751/ChatGPT_Image_Jun_4_2026_11_24_59_PM_3_iyboqb.png",
  hoChiMinh: "/BookImage/Story5/ch5_hochiminh_cutout.png",
  diplomacyFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590751/ChatGPT_Image_Jun_4_2026_11_25_16_PM_3_s1mefn.png",
  comrade: "/BookImage/Story5/ch5_comrade_cutout.png",
  appealEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780595982/ChatGPT_Image_Jun_5_2026_12_58_26_AM_2_pveige.png",
  appealFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780595974/ChatGPT_Image_Jun_5_2026_12_58_26_AM_1_xgfqep.png",
  testamentFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780596628/ChatGPT_Image_Jun_5_2026_01_10_14_AM_1_r5fkz7.png",
  testamentEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780596636/ChatGPT_Image_Jun_5_2026_01_10_14_AM_2_cuq1sa.png",
};

const WIN_AUDIO_URL =
  "https://res.cloudinary.com/do02twogb/video/upload/v1773104691/win_kx8hk4.wav";

type SceneId =
  | "tantrao"
  | "badinh"
  | "diplomacy"
  | "appeal"
  | "testament";
type CharacterId = "hochiminh" | "comrade";
type ActionId = "time" | "declaration" | "freedom";

interface SceneAsset {
  id: SceneId;
  label: string;
  year: string;
  emptyImg: string;
  successImg: string;
}

interface CharacterAsset {
  id: CharacterId;
  label: string;
  icon: string;
}

interface ActionAsset {
  id: ActionId;
  label: string;
  shortLabel: string;
}

interface PanelState {
  sceneId: SceneId | null;
  characters: CharacterId[];
  actions: ActionId[];
}

interface StepRule {
  sceneId: SceneId;
  characters: CharacterId[];
  actions: ActionId[];
  successText: string;
  hintText: string;
}

interface PanelResult {
  isSuccess: boolean;
  isError: boolean;
  outcome: string | null;
  displayImg: string | null;
}

const SCENES: SceneAsset[] = [
  {
    id: "tantrao",
    label: "Tân Trào",
    year: "1945",
    emptyImg: IMAGE_URLS.tantraoEmpty,
    successImg: IMAGE_URLS.tantraoFull,
  },
  {
    id: "badinh",
    label: "Ba Đình",
    year: "2/9/1945",
    emptyImg: IMAGE_URLS.badinhEmpty,
    successImg: IMAGE_URLS.badinhFull,
  },
  {
    id: "diplomacy",
    label: "Ngoại giao",
    year: "1945-1946",
    emptyImg: IMAGE_URLS.diplomacyEmpty,
    successImg: IMAGE_URLS.diplomacyFull,
  },
  {
    id: "appeal",
    label: "Lời kêu gọi",
    year: "1966",
    emptyImg: IMAGE_URLS.appealEmpty,
    successImg: IMAGE_URLS.appealFull,
  },
  {
    id: "testament",
    label: "Di chúc",
    year: "1969",
    emptyImg: IMAGE_URLS.testamentEmpty,
    successImg: IMAGE_URLS.testamentFull,
  },
];

const CHARACTERS: CharacterAsset[] = [
  {
    id: "hochiminh",
    label: "Hồ Chí Minh",
    icon: IMAGE_URLS.hoChiMinh,
  },
  {
    id: "comrade",
    label: "Đồng chí",
    icon: IMAGE_URLS.comrade,
  },
];

const ACTIONS: ActionAsset[] = [
  { id: "time", label: "Thời cơ", shortLabel: "TC" },
  { id: "declaration", label: "Tuyên ngôn", shortLabel: "TN" },
  { id: "freedom", label: "Độc lập tự do", shortLabel: "DL" },
];

const FLAG_SCENE_IDS: SceneId[] = ["tantrao", "badinh", "appeal"];

const successImageMotion = {
  scale: [1, 1.045, 1.02],
  x: ["0%", "-1.5%", "0%"],
  y: ["0%", "-1%", "0%"],
};

const successImageTransition = {
  duration: 7,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

const shimmerTransition = {
  duration: 4.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const STEPS: StepRule[] = [
  {
    sceneId: "tantrao",
    characters: ["hochiminh", "comrade"],
    actions: ["time"],
    successText: "Chớp thời cơ: Lời kêu gọi Tổng khởi nghĩa vang lên từ Tân Trào.",
    hintText: "Hãy nghĩ đến thời điểm quyết định trước ngày độc lập.",
  },
  {
    sceneId: "badinh",
    characters: ["hochiminh", "comrade"],
    actions: ["declaration"],
    successText: "Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.",
    hintText: "Sự kiện này cần một văn kiện mở ra quốc gia mới.",
  },
  {
    sceneId: "diplomacy",
    characters: ["hochiminh"],
    actions: [],
    successText: "Bất biến: mục tiêu độc lập dân tộc được giữ vững.",
    hintText: "Trước sức ép nhiều phía, cần xác định điều không thể nhân nhượng.",
  },
  {
    sceneId: "diplomacy",
    characters: ["hochiminh", "comrade"],
    actions: [],
    successText: "Vạn biến: sách lược mềm dẻo giúp giữ chính quyền non trẻ.",
    hintText: "Sau mục tiêu cốt lõi là cách ứng xử mềm dẻo với tình thế.",
  },
  {
    sceneId: "appeal",
    characters: ["hochiminh"],
    actions: ["freedom"],
    successText: "Chân lý thời đại: Không có gì quý hơn độc lập, tự do.",
    hintText: "Hãy chọn tinh thần hiệu triệu lớn nhất của giai đoạn kháng chiến.",
  },
  {
    sceneId: "testament",
    characters: ["hochiminh"],
    actions: [],
    successText: "Di chúc kết tinh niềm tin, đoàn kết và khát vọng thống nhất.",
    hintText: "Phần kết cần đặt đúng di sản tinh thần cuối đời Người.",
  },
];

const initialPanels = (): PanelState[] =>
  Array.from({ length: 6 }, () => ({
    sceneId: null,
    characters: [],
    actions: [],
  }));

const getScene = (id: SceneId | null) =>
  SCENES.find((scene) => scene.id === id);

const getCharacter = (id: CharacterId) =>
  CHARACTERS.find((character) => character.id === id);

const getAction = (id: ActionId) =>
  ACTIONS.find((action) => action.id === id);

const sameSet = <T extends string>(actual: T[], expected: T[]) =>
  actual.length === expected.length &&
  expected.every((item) => actual.includes(item));

const evaluatePanel = (panel: PanelState, index: number): PanelResult => {
  const scene = getScene(panel.sceneId);
  const rule = STEPS[index];

  if (!scene) {
    return {
      isSuccess: false,
      isError: false,
      outcome: null,
      displayImg: null,
    };
  }

  const baseResult = {
    displayImg: scene.emptyImg,
  };

  if (panel.sceneId !== rule.sceneId) {
    return {
      ...baseResult,
      isSuccess: false,
      isError: true,
      outcome: "Bối cảnh này chưa khớp với mạch thời gian.",
    };
  }

  const hasExactCharacters = sameSet(panel.characters, rule.characters);
  const hasExactActions = sameSet(panel.actions, rule.actions);

  if (hasExactCharacters && hasExactActions) {
    return {
      isSuccess: true,
      isError: false,
      outcome: rule.successText,
      displayImg: scene.successImg,
    };
  }

  const hasExtraCharacters = panel.characters.some(
    (id) => !rule.characters.includes(id),
  );
  const hasExtraActions = panel.actions.some((id) => !rule.actions.includes(id));

  let outcome = rule.hintText;
  if (hasExtraCharacters || hasExtraActions) {
    outcome = "Có một chi tiết đang lệch với tình huống lịch sử.";
  }

  return {
    ...baseResult,
    isSuccess: false,
    isError:
      panel.characters.length > 0 || panel.actions.length > 0 || hasExtraActions,
    outcome,
  };
};

export default function Chapter5Page() {
  const router = useRouter();
  const [panels, setPanels] = useState<PanelState[]>(initialPanels);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);
  const winHandledRef = useRef(false);

  const panelResults = useMemo(
    () => panels.map((panel, index) => evaluatePanel(panel, index)),
    [panels],
  );

  const isVictory = panelResults.every((result) => result.isSuccess);

  useEffect(() => {
    if (!isVictory) {
      winHandledRef.current = false;
      return;
    }

    if (winHandledRef.current) return;
    winHandledRef.current = true;

    const audio = new Audio(WIN_AUDIO_URL);
    audio.play().catch(() => {
      console.log("Trình duyệt chặn audio");
    });

    try {
      const savedData = localStorage.getItem("completedChapters");
      const completedList: number[] = savedData ? JSON.parse(savedData) : [];

      if (!completedList.includes(5)) {
        completedList.push(5);
        localStorage.setItem("completedChapters", JSON.stringify(completedList));
        globalThis.dispatchEvent(new Event("game-completed-sync"));
      }
    } catch (error) {
      console.error("Lỗi lưu game:", error);
    }

    const showOverlayTimer = window.setTimeout(() => {
      setShowVictoryOverlay(true);
    }, 3000);
    const goHomeTimer = window.setTimeout(() => {
      router.push("/");
    }, 5600);

    return () => {
      window.clearTimeout(showOverlayTimer);
      window.clearTimeout(goHomeTimer);
    };
  }, [isVictory, router]);

  const isPanelLocked = (index: number) =>
    index > 0 && !panels.slice(0, index).every((panel) => panel.sceneId);

  const handleDragStart = (
    e: React.DragEvent,
    type: "scene" | "character" | "action",
    id: string,
  ) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("id", id);
  };

  const handleDropToPanel = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (isPanelLocked(index) || panelResults[index].isSuccess) return;

    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");

    setPanels((prevPanels) => {
      const nextPanels = prevPanels.map((panel) => ({
        ...panel,
        characters: [...panel.characters],
        actions: [...panel.actions],
      }));
      const target = nextPanels[index];

      if (type === "scene") {
        const scene = SCENES.find((asset) => asset.id === id);
        if (!scene) return prevPanels;

        nextPanels[index] = {
          sceneId: scene.id,
          characters: [],
          actions: [],
        };
      }

      if (type === "character") {
        const character = CHARACTERS.find((asset) => asset.id === id);
        if (!character || !target.sceneId) return prevPanels;

        if (!target.characters.includes(character.id)) {
          target.characters = [...target.characters, character.id].slice(0, 2);
        }
      }

      if (type === "action") {
        const action = ACTIONS.find((asset) => asset.id === id);
        if (!action || !target.sceneId) return prevPanels;

        if (!target.actions.includes(action.id)) {
          target.actions = [...target.actions, action.id].slice(0, 2);
        }
      }

      return nextPanels;
    });
  };

  const clearPanel = (index: number) => {
    setPanels((prevPanels) =>
      prevPanels.map((panel, panelIndex) =>
        panelIndex < index
          ? panel
          : {
              sceneId: null,
              characters: [],
              actions: [],
            },
      ),
    );
  };

  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full">
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide text-center">
          Chương 5: Hiện thực hóa Tư tưởng và Chân lý Thời đại
        </h2>
      </div>

      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, index) => {
            const result = panelResults[index];
            const locked = isPanelLocked(index);
            const scene = getScene(panel.sceneId);
            const hasFlagShimmer =
              result.isSuccess &&
              !!panel.sceneId &&
              FLAG_SCENE_IDS.includes(panel.sceneId);

            return (
              <motion.div
                key={index}
                onDrop={(e) => handleDropToPanel(e, index)}
                onDragOver={(e) => e.preventDefault()}
                animate={
                  result.isError && !result.isSuccess
                    ? { x: [0, -4, 4, -2, 2, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.3 }}
                className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${
                  locked
                    ? "border-gray-400 opacity-50 bg-gray-200/20"
                    : "border-[#a69279]"
                } ${
                  result.isSuccess
                    ? "border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]"
                    : ""
                } ${
                  result.isError && !result.isSuccess
                    ? "border-red-600 shadow-[0_0_14px_rgba(220,38,38,0.45)]"
                    : ""
                }`}
              >
                {locked && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">
                    🔒
                  </div>
                )}

                {panel.sceneId && !locked && (
                  <button
                    onClick={() => clearPanel(index)}
                    className="absolute top-1 right-2 text-red-700/70 hover:text-red-900 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    X
                  </button>
                )}

                <AnimatePresence mode="wait">
                  {result.displayImg ? (
                    <motion.div
                      key={result.displayImg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 z-0 overflow-hidden"
                    >
                      <motion.img
                        src={result.displayImg}
                        alt={scene?.label || "Bối cảnh"}
                        animate={result.isSuccess ? successImageMotion : {}}
                        transition={
                          result.isSuccess ? successImageTransition : undefined
                        }
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-0 flex items-center justify-center"
                    >
                      <span className="text-[#a69279] text-5xl font-serif opacity-30 select-none">
                        {index + 1}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasFlagShimmer && (
                  <motion.div
                    initial={{ x: "-120%", opacity: 0 }}
                    animate={{ x: ["-120%", "120%"], opacity: [0, 0.18, 0] }}
                    transition={shimmerTransition}
                    className="absolute inset-y-0 -left-1/2 z-10 w-1/2 pointer-events-none bg-gradient-to-r from-transparent via-amber-100/50 to-transparent skew-x-[-18deg]"
                  />
                )}

                {!result.isSuccess && panel.characters.length > 0 && (
                  <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 px-4 pointer-events-none">
                    <div className="flex h-[76%] gap-3 w-full justify-center">
                      {panel.characters.map((characterId) => {
                        const character = getCharacter(characterId);
                        if (!character) return null;

                        return (
                          <motion.div
                            key={characterId}
                            initial={{ y: -18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            className="h-full relative pointer-events-none"
                          >
                            <img
                              src={character.icon}
                              alt={character.label}
                              className="h-full w-auto object-contain drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)]"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!result.isSuccess && panel.actions.length > 0 && (
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                    {panel.actions.map((actionId) => {
                      const action = getAction(actionId);
                      if (!action) return null;

                      return (
                        <motion.div
                          key={actionId}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-amber-100/95 border-2 border-amber-600/80 px-2 py-1 rounded shadow-md text-xs font-bold text-amber-900"
                        >
                          {action.label}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {result.outcome && (
                  <motion.div
                    key={result.outcome}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`absolute bottom-0 w-full min-h-[38px] backdrop-blur-sm flex items-center justify-center z-20 px-2 py-1 ${
                      result.isSuccess
                        ? "bg-emerald-900/80"
                        : result.isError
                          ? "bg-red-900/80"
                          : "bg-black/70"
                    }`}
                  >
                    <span className="text-white text-[12px] font-medium leading-tight tracking-wide text-center drop-shadow-md">
                      {result.outcome}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="h-[140px] mt-4 mx-12 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-center gap-5 bg-white/10 rounded-t-2xl overflow-x-auto px-4">
        {SCENES.map((scene) => (
          <div
            key={scene.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", scene.id)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={scene.emptyImg}
                alt={scene.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-xs text-center leading-tight max-w-[74px]">
              {scene.label}
            </span>
            <span className="text-[10px] text-[#7a6554]">{scene.year}</span>
          </div>
        ))}

        <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-1 flex-shrink-0" />

        {CHARACTERS.map((character) => (
          <div
            key={character.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "character", character.id)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={character.icon}
                alt={character.label}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-xs text-center leading-tight max-w-[70px]">
              {character.label}
            </span>
          </div>
        ))}

        <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-1 flex-shrink-0" />

        {ACTIONS.map((action) => (
          <div
            key={action.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "action", action.id)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-12 h-12 rounded bg-amber-100 border-2 border-dashed border-amber-600 mb-1 flex items-center justify-center shadow-md">
              <span className="text-sm font-black text-amber-900">
                {action.shortLabel}
              </span>
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-xs text-center max-w-[76px] leading-tight">
              {action.label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showVictoryOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center rounded-lg"
          >
            <CheckCircle2
              size={80}
              className="text-green-400 mb-4 animate-pulse"
            />
            <h2 className="text-4xl font-serif text-amber-400 font-bold mb-4">
              Hoàn thành Chương 5!
            </h2>
            <p className="text-amber-100/90 text-xl font-serif max-w-3xl leading-relaxed">
              Từ Tổng khởi nghĩa, Tuyên ngôn Độc lập, nghệ thuật ngoại giao đến
              chân lý độc lập tự do và Di chúc, tư tưởng Hồ Chí Minh trở thành
              di sản bất diệt của dân tộc.
            </p>
            <p className="mt-8 text-amber-200/80 font-serif">
              Đang trở về trang sách...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
