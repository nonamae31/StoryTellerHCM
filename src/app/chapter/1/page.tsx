/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS & TRẠNG THÁI ẢNH
// ==========================================
const CHAPTER_1_ASSETS = {
  scenes: [
    { id: "loc_nghean", label: "Nghệ An", icon: "/chapter1/icon_loc_nghean.png", bg: "/chapter1/nghean.png" },
    { id: "loc_hue", label: "Kinh thành Huế", icon: "/chapter1/icon_loc_hue.png", bg: "/chapter1/kinhthanhhue.png" },
    { id: "loc_nharong", label: "Bến cảng Nhà Rồng", icon: "/chapter1/icon_loc_nharong.png", bg: "/chapter1/saigon.png" },
  ],
  characters: [
    { id: "char_sinhcung", label: "Nguyễn Sinh Cung", icon: "/chapter1/char_sinhcung_idle.png" },
    { id: "char_sinhsac", label: "Cụ Nguyễn Sinh Sắc", icon: "/chapter1/char_sinhsac_idle.png" },
    { id: "char_phanboichau", label: "Cụ Phan Bội Châu", icon: "/chapter1/char_phanboichau_idle.png" },
    { id: "char_trieudinh", label: "Triều đình", icon: "/chapter1/char_trieudinh_idle.png", isTrap: true },
    { id: "char_tatthanh", label: "Nguyễn Tất Thành", icon: "/chapter1/char_tatthanh_idle.png" },
    { id: "char_vanba", label: "Văn Ba", icon: "/chapter1/char_vanba_idle.png" },
  ],
  actions: [
    { id: "act_kethua", label: "Kế thừa yêu nước", icon: "/chapter1/icon_act_kethua.png" },
    { id: "act_chungkien", label: "Chứng kiến xa hoa", icon: "/chapter1/icon_act_chungkien.png" },
    { id: "act_lamquan", label: "Làm quan", icon: "/chapter1/icon_act_lamquan.png", isTrap: true },
    { id: "act_duangoai", label: "Dựa ngoại bang", icon: "/chapter1/icon_act_duangoai.png", isTrap: true },
    { id: "act_khuoctu", label: "Khước từ lối mòn", icon: "/chapter1/icon_act_khuoctu.png" },
    { id: "act_phubep", label: "Làm phụ bếp", icon: "/chapter1/icon_act_phubep.png" },
  ]
};

const CHAR_STATES: Record<string, Record<string, string>> = {
  char_sinhcung: {
    idle: "/chapter1/char_sinhcung_idle.png",
    happy: "/chapter1/char_sinhcung_happy.png",
    angry: "/chapter1/char_sinhcung_angry.png",
    confused: "/chapter1/char_sinhcung_confused.png",
  },
  char_tatthanh: {
    idle: "/chapter1/char_tatthanh_idle.png",
    happy: "/chapter1/char_tatthanh_happy.png",
    angry: "/chapter1/char_tatthanh_angry.png",
    confused: "/chapter1/char_tatthanh_confused.png",
  },
  char_vanba: {
    idle: "/chapter1/char_vanba_idle.png",
    happy: "/chapter1/char_vanba_happy.png",
    angry: "/chapter1/char_vanba_angry.png",
    confused: "/chapter1/char_vanba_confused.png",
  },
  char_sinhsac: {
    idle: "/chapter1/char_sinhsac_idle.png",
    happy: "/chapter1/char_sinhsac_happy.png",
    angry: "/chapter1/char_sinhsac_angry.png",
    confused: "/chapter1/char_sinhsac_confused.png",
  },
  char_phanboichau: {
    idle: "/chapter1/char_phanboichau_idle.png",
    happy: "/chapter1/char_phanboichau_happy.png",
    angry: "/chapter1/char_phanboichau_angry.png",
    confused: "/chapter1/char_phanboichau_confused.png",
  },
  char_trieudinh: {
    idle: "/chapter1/char_trieudinh_idle.png",
    happy: "/chapter1/char_trieudinh_happy.png",
    angry: "/chapter1/char_trieudinh_angry.png",
    confused: "/chapter1/char_trieudinh_confused.png",
  },
};

type ScenarioStatus = "SUCCESS" | "FAIL" | "CONFUSE";

interface Rule {
  sceneId: string;
  requiredChars: string[];
  requiredAction: string | null;
  status: ScenarioStatus;
  outcome: string;
}

const RULES: Rule[] = [
  { sceneId: "loc_nghean", requiredChars: ["char_sinhcung", "char_sinhsac"], requiredAction: "act_kethua", status: "SUCCESS", outcome: "Cậu bé Nguyễn Sinh Cung tiếp thu truyền thống yêu nước, khắc sâu lời dạy của cha." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh", "char_sinhsac"], requiredAction: "act_kethua", status: "SUCCESS", outcome: "Nguyễn Tất Thành tiếp thu truyền thống yêu nước, khắc sâu lời dạy của cụ Sắc." },
  { sceneId: "loc_nghean", requiredChars: ["char_sinhcung"], requiredAction: "act_kethua", status: "CONFUSE", outcome: "Kế thừa từ ai? Bạn cần kéo thêm Cụ Nguyễn Sinh Sắc vào để truyền cảm hứng." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh"], requiredAction: "act_kethua", status: "CONFUSE", outcome: "Kế thừa từ ai? Bạn cần kéo thêm Cụ Nguyễn Sinh Sắc vào để truyền cảm hứng." },
  { sceneId: "loc_nghean", requiredChars: ["char_sinhsac"], requiredAction: "act_kethua", status: "CONFUSE", outcome: "Truyền lại cho ai? Bạn cần kéo thêm người con sẽ kế thừa tư tưởng này." },
  { sceneId: "loc_nghean", requiredChars: ["char_sinhcung"], requiredAction: "act_lamquan", status: "FAIL", outcome: "Làm quan là 'nô lệ trong những người nô lệ', đi ngược lại tư tưởng thương dân." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh"], requiredAction: "act_lamquan", status: "FAIL", outcome: "Làm quan là 'nô lệ trong những người nô lệ', đi ngược lại tư tưởng thương dân." },
  { sceneId: "loc_nghean", requiredChars: ["char_sinhsac"], requiredAction: "act_lamquan", status: "FAIL", outcome: "Cụ Sắc từng tâm sự 'Quan trường là nô lệ...'. Lựa chọn này đi ngược tư tưởng gia đình." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh", "char_phanboichau"], requiredAction: "act_khuoctu", status: "SUCCESS", outcome: "Nguyễn Tất Thành kính trọng cụ Phan nhưng nhận ra con đường Đông Du không phù hợp, quyết định khước từ." },
  { sceneId: "loc_nghean", requiredChars: ["char_sinhcung", "char_phanboichau"], requiredAction: "act_khuoctu", status: "FAIL", outcome: "Lúc này Sinh Cung còn quá nhỏ để tự đưa ra quyết định khước từ con đường của cụ Phan." },
  { sceneId: "loc_nghean", requiredChars: ["char_phanboichau"], requiredAction: "act_khuoctu", status: "CONFUSE", outcome: "Khước từ ai? Bạn cần kéo thêm Nguyễn Tất Thành để đưa ra quyết định." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh"], requiredAction: "act_khuoctu", status: "CONFUSE", outcome: "Khước từ ai? Bạn cần kéo thêm đại diện của lối mòn cũ (như Cụ Phan Bội Châu)." },
  { sceneId: "loc_nghean", requiredChars: ["char_trieudinh"], requiredAction: "act_khuoctu", status: "FAIL", outcome: "Triều đình phong kiến nhà Nguyễn lúc này đã mục nát, không thể tự mình khước từ lối mòn." },
  { sceneId: "loc_hue", requiredChars: ["char_tatthanh"], requiredAction: "act_chungkien", status: "SUCCESS", outcome: "Nguyễn Tất Thành xót xa khi thấy sự đối lập giữa triều đình xa hoa và nhân dân lầm than." },
  { sceneId: "loc_hue", requiredChars: ["char_tatthanh"], requiredAction: "act_lamquan", status: "FAIL", outcome: "Người khước từ chốn quan trường mục nát, không chịu làm 'nô lệ trong những người nô lệ'." },
  { sceneId: "loc_hue", requiredChars: ["char_tatthanh"], requiredAction: "act_phubep", status: "FAIL", outcome: "Sai địa điểm! Phải vào tận Sài Gòn, trung tâm giao thương lớn nhất, mới có thể lên tàu." },
  { sceneId: "loc_hue", requiredChars: ["char_sinhsac"], requiredAction: "act_lamquan", status: "FAIL", outcome: "(Sai lầm lịch sử) Cụ Sắc từ quan ở Huế vì không chịu làm 'nô lệ'." },
  { sceneId: "loc_hue", requiredChars: ["char_trieudinh"], requiredAction: "act_khuoctu", status: "FAIL", outcome: "Triều đình phong kiến mục nát không thể tự mình khước từ lối mòn." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh", "char_phanboichau"], requiredAction: "act_duangoai", status: "FAIL", outcome: "Cụ Phan hy vọng vào Nhật, nhưng Bác sớm nhận ra đây là 'đưa hổ cửa trước, rước beo cửa sau'." },
  { sceneId: "loc_nghean", requiredChars: ["char_phanboichau"], requiredAction: "act_duangoai", status: "CONFUSE", outcome: "Dựa ngoại bang cùng ai? Cần kéo thêm Nguyễn Tất Thành để cùng thảo luận." },
  { sceneId: "loc_nghean", requiredChars: ["char_tatthanh"], requiredAction: "act_duangoai", status: "FAIL", outcome: "Cảnh báo sai lầm: Dựa vào đế quốc này để đánh đế quốc khác là ảo tưởng." },
  { sceneId: "loc_nharong", requiredChars: ["char_vanba"], requiredAction: "act_phubep", status: "SUCCESS", outcome: "Quyết định lịch sử: Chàng thanh niên Văn Ba lên tàu Amiral Latouche-Treville vươn ra biển lớn." },
  { sceneId: "loc_nharong", requiredChars: ["char_tatthanh"], requiredAction: "act_phubep", status: "SUCCESS", outcome: "Quyết định lịch sử: Lấy tên Văn Ba, lên tàu Amiral Latouche-Treville vươn ra biển lớn." },
  { sceneId: "loc_nharong", requiredChars: ["char_trieudinh"], requiredAction: null, status: "FAIL", outcome: "Triều đình bù nhìn không thể xuất hiện ở bến cảng thương mại của Pháp để làm cách mạng." }
];

const getCharStateImg = (charId: string, emotion: string) => {
  return CHAR_STATES[charId]?.[emotion] || CHAR_STATES[charId]?.idle || "";
};

const win_audio_url =
  "https://res.cloudinary.com/do02twogb/video/upload/v1773104691/win_kx8hk4.wav";

const chaptersData = [
  {
    id: 1,
    shortTitle: "Cội nguồn & Lối mòn",
    fullTitle: "Bước ngoặt tuổi trẻ: Từ chối lối mòn, vươn ra biển lớn",
  },
];

interface PanelCharacter {
  id: string;
  stateImg: string;
}

interface PanelState {
  sceneId: string | null;
  sceneBg: string | null;
  characters: PanelCharacter[];
  actions: string[];
  outcome: string | null;
  isLocked: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  isConfuse?: boolean;
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();

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
        actions: [],
        outcome: null,
        isLocked: false,
      })
      .map((p, i) => ({ ...p, isLocked: i !== 0 })),
  );

  const [unlockedChars, setUnlockedChars] = useState<string[]>(["char_sinhcung", "char_sinhsac", "char_phanboichau", "char_trieudinh"]);
  const [isWin, setIsWin] = useState(false);

  // ==========================================
  // 3. LOGIC GAME (RULE-BASED ENGINE)
  // ==========================================
  useEffect(() => {
    const newPanels = [...panels];
    let nextUnlockedChars = new Set<string>(["char_sinhsac", "char_phanboichau", "char_trieudinh"]);
    
    let currentBac = "char_sinhcung";

    for (let i = 0; i < 6; i++) {
      const panel = { ...newPanels[i] };
      const scene = panel.sceneId;
      const chars = panel.characters.map((c) => c.id);
      const actions = panel.actions || [];

      if (!scene) {
        for (let j = i + 1; j < 6; j++) newPanels[j].isLocked = true;
        newPanels[i] = panel;
        break;
      }

      if (i + 1 < 6) newPanels[i + 1].isLocked = false;

      let status: ScenarioStatus | null = null;
      let outcome = "";

      for (const rule of RULES) {
        if (rule.sceneId !== scene) continue;
        const hasRequiredChars = rule.requiredChars.every(c => chars.includes(c));
        const hasRequiredAction = rule.requiredAction ? actions.includes(rule.requiredAction) : true;
        
        if (hasRequiredChars && hasRequiredAction && chars.length > 0) {
          status = rule.status;
          outcome = rule.outcome;
          break;
        }
      }

      const bacForms = ["char_sinhcung", "char_tatthanh", "char_vanba"];
      const placedBac = chars.find(c => bacForms.includes(c));
      if (placedBac && placedBac !== currentBac) {
        status = "CONFUSE";
        outcome = "Nghịch lý thời gian! Nhân dạng này của Bác chưa xuất hiện hoặc đã qua đi tại thời điểm này của dòng thời gian.";
      }

      if (!status) {
        const ALLOWED_CHARS: Record<string, string[]> = {
          loc_nghean: ["char_sinhcung", "char_tatthanh", "char_sinhsac", "char_phanboichau"],
          loc_hue: ["char_tatthanh", "char_sinhsac", "char_phanboichau", "char_trieudinh"],
          loc_nharong: ["char_vanba", "char_tatthanh"]
        };

        const isCharAllowed = chars.length > 0 ? chars.every(c => ALLOWED_CHARS[scene]?.includes(c)) : true;

        if (chars.length > 0 && !isCharAllowed) {
          status = "CONFUSE";
          outcome = "Lựa chọn không hợp lý! Nhân vật này không xuất hiện ở địa điểm hoặc thời gian này trong lịch sử.";
        } else if (chars.length > 0 && actions.length === 0) {
          status = null;
          outcome = "Nhân vật đang chờ bạn đưa ra một quyết định...";
        } else if (chars.length === 0 && actions.length > 0) {
          status = null;
          outcome = "Hãy kéo thêm nhân vật vào để thực hiện hành động này.";
        } else if (chars.length > 0 && actions.length > 0) {
          status = "FAIL";
          outcome = "Lựa chọn sai lầm! Quyết định này không phù hợp với thực tiễn lịch sử.";
        }
      }

      panel.outcome = outcome || null;
      panel.isSuccess = status === "SUCCESS";
      panel.isError = status === "FAIL";
      panel.isConfuse = status === "CONFUSE";

      panel.characters = panel.characters.map(c => {
        let emotion = "idle";
        if (panel.isConfuse) {
          emotion = "confused";
        } else {
          if (status === "FAIL") emotion = "angry";
          else if (status === "SUCCESS") emotion = "happy";
          
          if (c.id === "char_trieudinh") {
            emotion = "happy";
          } else if (c.id === "char_phanboichau") {
            emotion = "angry";
          } else if (actions.includes("act_chungkien") || actions.includes("act_khuoctu")) {
            emotion = "angry";
          }
        }
        
        return {
          ...c,
          stateImg: getCharStateImg(c.id, emotion)
        };
      });

      newPanels[i] = panel;

      if (status === "SUCCESS") {
        if (scene === "loc_nghean" && currentBac === "char_sinhcung") {
          currentBac = "char_tatthanh";
        } else if (scene === "loc_nghean" && actions.includes("act_khuoctu") && chars.includes("char_tatthanh")) {
          currentBac = "char_vanba";
        }
      }
    }

    nextUnlockedChars.add(currentBac);

    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      setPanels(newPanels);
    }

    const newUnlockedArr = Array.from(nextUnlockedChars);
    if (JSON.stringify(newUnlockedArr) !== JSON.stringify(unlockedChars)) {
      setUnlockedChars(newUnlockedArr);
    }

    const expectedTimeline = ["loc_nghean", "loc_hue", "loc_nghean", "loc_nharong"];
    const successScenes = newPanels.filter(p => p.isSuccess).map(p => p.sceneId);
    
    let isVictory = false;
    let expectedIndex = 0;
    for (const scene of successScenes) {
      if (scene === expectedTimeline[expectedIndex]) {
        expectedIndex++;
        if (expectedIndex === expectedTimeline.length) {
          isVictory = true;
          break;
        }
      }
    }

    if (isVictory && !isWin) {
      setIsWin(true);
      const audio = new Audio(win_audio_url);
      audio.play().catch((e) => console.log("Không thể phát âm thanh:", e));

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
  }, [panels, currentChapterId, isWin, unlockedChars]);

  // ==========================================
  // 4. HANDLERS KÉO THẢ (GIỮ NGUYÊN)
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
      targetPanel.actions = [];
    } else if (type === "character") {
      if (!targetPanel.sceneId) return;
      if (
        targetPanel.characters.length < 2 &&
        !targetPanel.characters.find((c) => c.id === id)
      ) {
        targetPanel.characters.push({
          id: id,
          stateImg: CHAR_STATES[id]?.idle || "",
        });
      }
    } else if (type === "action") {
      if (!targetPanel.sceneId) return;
      if (!targetPanel.actions) targetPanel.actions = [];
      if (!targetPanel.actions.includes(id)) {
        targetPanel.actions.push(id);
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
      actions: [],
      outcome: null,
      isLocked: index !== 0,
    };
    for (let i = index + 1; i < 6; i++) {
      newPanels[i] = {
        sceneId: null,
        sceneBg: null,
        characters: [],
        actions: [],
        outcome: null,
        isLocked: true,
      };
    }
    setPanels(newPanels);
  };

  // ==========================================
  // 5. RENDER UI
  // ==========================================
  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full">
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide">
          Chương 1: Bước ngoặt tuổi trẻ: Từ chối lối mòn, vươn ra biển lớn
        </h2>
      </div>

      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, i) => (
            <div
              key={i}
              onDrop={(e) => handleDropToPanel(e, i)}
              onDragOver={handleDragOver}
              className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${panel.isLocked ? "border-gray-400 opacity-50 bg-gray-200/20" : "border-[#a69279]"} ${panel.isSuccess ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""} ${panel.isError ? "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]" : ""} ${panel.isConfuse ? "border-gray-500 grayscale shadow-[0_0_10px_rgba(107,114,128,0.5)]" : ""}`}
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

              <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 px-4 pointer-events-none">
                <div className="flex h-[75%] gap-2 w-full justify-center">
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

              {panel.actions && panel.actions.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 pointer-events-auto">
                  {panel.actions.map((actId) => {
                    const actionAsset = CHAPTER_1_ASSETS.actions.find(a => a.id === actId);
                    if (!actionAsset) return null;
                    return (
                      <motion.div
                        key={actId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white/90 border-2 border-amber-500/80 px-2 py-1 rounded shadow-md text-xs font-bold text-amber-900"
                      >
                        {actionAsset.label}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {panel.outcome && (
                <div className={`absolute bottom-0 w-full min-h-[44px] backdrop-blur-sm flex items-center justify-center px-2 py-1 z-20 ${panel.isError ? "bg-red-900/85" : panel.isConfuse ? "bg-gray-800/85" : "bg-black/75"}`}>
                  <span className="text-white text-[11px] leading-tight text-center font-medium drop-shadow-md">
                    {" "}
                    {panel.outcome}{" "}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="h-[140px] mt-4 mx-12 px-4 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-start sm:justify-center gap-3 md:gap-5 bg-white/10 rounded-t-2xl overflow-x-auto"
        onDrop={handleDropToBin}
        onDragOver={handleDragOver}
      >
        {CHAPTER_1_ASSETS.scenes.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight">
              {" "}
              {asset.label}{" "}
            </span>
          </div>
        ))}
        <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0"></div>
        {CHAPTER_1_ASSETS.characters
          .filter((asset) => unlockedChars.includes(asset.id))
          .map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, "character", asset.id, asset.icon)
            }
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight">
              {" "}
              {asset.label}{" "}
            </span>
          </div>
        ))}
        <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0"></div>
        {CHAPTER_1_ASSETS.actions.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, "action", asset.id, asset.icon)
            }
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-10 h-10 rounded bg-amber-100 border-2 border-dashed border-amber-600 mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight">
              {" "}
              {asset.label}{" "}
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
            <h2 className="text-[20px] font-serif text-amber-400 font-bold mb-4 px-12 leading-relaxed">
              KẾT LUẬN: Đạt mục tiêu! Ngày 5/6/1911, chàng thanh niên lấy tên Văn Ba lên tàu Amiral Latouche-Treville, quyết định tự mình đi tìm hiểu những gì ẩn giấu sau sức mạnh của kẻ thù để tìm đường cứu nước thực sự.
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
