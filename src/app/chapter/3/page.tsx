/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS & TRẠNG THÁI ẢNH
// ==========================================
const CHAPTER_3_ASSETS = {
  scenes: [
    {
      id: "loc_paris_hll",
      label: "Hội Liên Hiệp\nThuộc Địa",
      icon: "/chapter3/bg_leparia_office.png",
      bg: "/chapter3/bg_leparia_office.png",
    },
    {
      id: "loc_paris_leparia",
      label: "Tòa soạn\nLe Paria",
      icon: "/chapter3/bg_leparia_office.png",
      bg: "/chapter3/bg_leparia_office.png",
    },
    {
      id: "loc_paris_banan",
      label: "Phòng viết\ncách mạng",
      icon: "/chapter3/bg_writing_room.png",
      bg: "/chapter3/bg_writing_room.png",
    },
    {
      id: "loc_guangzhou",
      label: "Lớp học\nQuảng Châu",
      icon: "/chapter3/bg_guangzhou_classroom.png",
      bg: "/chapter3/bg_guangzhou_classroom.png",
    },
    {
      id: "loc_vietnam_village",
      label: "Làng quê\nViệt Nam",
      icon: "/chapter3/bg_vietnam_village.png",
      bg: "/chapter3/bg_vietnam_village.png",
    },
    {
      id: "loc_hongkong",
      label: "Hội nghị\nHồng Kông",
      icon: "/chapter3/bg_hongkong_conference.png",
      bg: "/chapter3/bg_hongkong_conference.png",
    },
  ],
  characters: [
    { id: "char_aiquoc",         label: "Nguyễn Ái Quốc",       icon: "/chapter3/char_aiquoc_idle.png"           },
    { id: "char_worker_french",  label: "Công nhân Pháp",        icon: "/chapter3/char_worker_french.png"         },
    { id: "char_worker_african", label: "Công nhân\nChâu Phi",   icon: "/chapter3/char_worker_african.png"        },
    { id: "char_viet_worker",    label: "Công nhân\nViệt Nam",   icon: "/chapter3/char_vietnamese_worker.png"     },
    { id: "char_viet_farmer",    label: "Nông dân\nViệt Nam",    icon: "/chapter3/char_vietnamese_farmer.png"     },
    { id: "char_rev_youth",      label: "Thanh niên\ncách mạng", icon: "/chapter3/char_revolutionary_youth.png"   },
    { id: "char_colonial",       label: "Thực dân Pháp",         icon: "/chapter3/char_colonial_idle.png",        isTrap: true },
  ],
  actions: [
    { id: "act_doan_ket",    label: "Đoàn kết\nquốc tế",    icon: "/chapter3/bg_leparia_office.png"      },
    { id: "act_tuyen_truyen",label: "Tuyên truyền\nCM",      icon: "/chapter3/bg_writing_room.png"        },
    { id: "act_huan_luyen",  label: "Huấn luyện",            icon: "/chapter3/bg_guangzhou_classroom.png" },
    { id: "act_lien_minh",   label: "Liên minh\nCông-Nông",  icon: "/chapter3/bg_vietnam_village.png"     },
    { id: "act_thanh_lap",   label: "Thành lập\nĐảng",       icon: "/chapter3/bg_hongkong_conference.png" },
    { id: "act_bao_luc",     label: "Dùng bạo lực",          icon: "/chapter3/char_colonial_angry.png",   isTrap: true },
    { id: "act_ky_nguyen",   label: "Kêu gọi\nđế quốc",     icon: "/chapter3/char_colonial_idle.png",    isTrap: true },
  ],
};

// ==========================================
// CHAR STATES
// ==========================================
const CHAR_STATES: Record<string, Record<string, string>> = {
  char_aiquoc: {
    idle:     "/chapter3/char_aiquoc_idle.png",
    happy:    "/chapter3/char_aiquoc_victorious.png",
    angry:    "/chapter3/char_aiquoc_inspired.png",
    confused: "/chapter3/char_aiquoc_thinking.png",
  },
  char_worker_french: {
    idle:     "/chapter3/char_worker_french.png",
    happy:    "/chapter3/char_worker_french.png",
    angry:    "/chapter3/char_worker_french.png",
    confused: "/chapter3/char_worker_french.png",
  },
  char_worker_african: {
    idle:     "/chapter3/char_worker_african.png",
    happy:    "/chapter3/char_worker_african.png",
    angry:    "/chapter3/char_worker_african.png",
    confused: "/chapter3/char_worker_african.png",
  },
  char_viet_worker: {
    idle:     "/chapter3/char_vietnamese_worker.png",
    happy:    "/chapter3/char_vietnamese_worker.png",
    angry:    "/chapter3/char_vietnamese_worker.png",
    confused: "/chapter3/char_vietnamese_worker.png",
  },
  char_viet_farmer: {
    idle:     "/chapter3/char_vietnamese_farmer.png",
    happy:    "/chapter3/char_vietnamese_farmer.png",
    angry:    "/chapter3/char_vietnamese_farmer.png",
    confused: "/chapter3/char_vietnamese_farmer.png",
  },
  char_rev_youth: {
    idle:     "/chapter3/char_revolutionary_youth.png",
    happy:    "/chapter3/char_revolutionary_youth_inspired.png",
    angry:    "/chapter3/char_revolutionary_youth.png",
    confused: "/chapter3/char_revolutionary_youth.png",
  },
  char_colonial: {
    idle:     "/chapter3/char_colonial_idle.png",
    happy:    "/chapter3/char_colonial_idle.png",
    angry:    "/chapter3/char_colonial_angry.png",
    confused: "/chapter3/char_colonial_angry.png",
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

// ==========================================
// RULES ENGINE
// ==========================================
const RULES: Rule[] = [
  // ── SCENE 1: Hội Liên Hiệp Thuộc Địa (1921) ──
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc", "char_worker_french", "char_worker_african"], requiredAction: "act_doan_ket", status: "SUCCESS", outcome: "Hội Liên Hiệp Thuộc Địa (1921) ra đời — Nguyễn Ái Quốc đoàn kết giai cấp công nhân quốc tế, mở đầu hành trình gieo mầm cách mạng." },
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc", "char_worker_french"], requiredAction: "act_doan_ket", status: "CONFUSE", outcome: "Đoàn kết chưa đủ! Cần kéo thêm Công nhân Châu Phi — Hội Liên Hiệp cần đại diện từ nhiều dân tộc thuộc địa." },
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc", "char_worker_african"], requiredAction: "act_doan_ket", status: "CONFUSE", outcome: "Đoàn kết chưa đủ! Cần kéo thêm Công nhân Pháp — liên kết với công nhân chính quốc là điều cốt lõi." },
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc"], requiredAction: "act_doan_ket", status: "CONFUSE", outcome: "Một mình Nguyễn Ái Quốc chưa đủ — hãy kéo thêm Công nhân Pháp và Công nhân Châu Phi vào." },
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc", "char_colonial"], requiredAction: null, status: "FAIL", outcome: "Thực dân Pháp không thể là đồng minh trong cuộc đấu tranh giải phóng dân tộc!" },
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc"], requiredAction: "act_bao_luc", status: "FAIL", outcome: "Dùng bạo lực tại Paris năm 1921 là sai lầm chiến lược. Nguyễn Ái Quốc chọn con đường tuyên truyền và tổ chức." },
  { sceneId: "loc_paris_hll", requiredChars: ["char_aiquoc"], requiredAction: "act_ky_nguyen", status: "FAIL", outcome: "Kêu gọi đế quốc giúp đỡ là ảo tưởng nguy hiểm — Nguyễn Ái Quốc đã bác bỏ con đường này." },

  // ── SCENE 2: Sáng lập báo Le Paria (1922) ──
  { sceneId: "loc_paris_leparia", requiredChars: ["char_aiquoc"], requiredAction: "act_tuyen_truyen", status: "SUCCESS", outcome: "Báo Le Paria (Người Cùng Khổ) ra đời tháng 4/1922 — vũ khí tư tưởng sắc bén tố cáo tội ác thực dân, thức tỉnh nhân dân thuộc địa." },
  { sceneId: "loc_paris_leparia", requiredChars: ["char_aiquoc", "char_worker_french"], requiredAction: "act_tuyen_truyen", status: "SUCCESS", outcome: "Cùng với công nhân Pháp tiến bộ, Le Paria trở thành cầu nối đoàn kết giữa nhân dân các thuộc địa." },
  { sceneId: "loc_paris_leparia", requiredChars: ["char_aiquoc"], requiredAction: "act_doan_ket", status: "CONFUSE", outcome: "Tòa soạn báo là nơi dùng ngòi bút, không phải đoàn kết chính trị trực tiếp. Hãy chọn hành động 'Tuyên truyền CM'." },
  { sceneId: "loc_paris_leparia", requiredChars: ["char_aiquoc"], requiredAction: "act_bao_luc", status: "FAIL", outcome: "Tòa soạn báo là trận địa của ngòi bút và tư tưởng — không phải nơi dùng bạo lực." },
  { sceneId: "loc_paris_leparia", requiredChars: ["char_colonial"], requiredAction: null, status: "FAIL", outcome: "Thực dân Pháp không thể viết tờ báo chống chính mình! Sai nhân vật." },

  // ── SCENE 3: Viết "Bản Án Chế Độ Thực Dân Pháp" (1925) ──
  { sceneId: "loc_paris_banan", requiredChars: ["char_aiquoc"], requiredAction: "act_tuyen_truyen", status: "SUCCESS", outcome: "\"Bản Án Chế Độ Thực Dân Pháp\" (1925) hoàn thành — tác phẩm tố cáo toàn diện tội ác thực dân, là văn kiện cách mạng có giá trị lịch sử lâu dài." },
  { sceneId: "loc_paris_banan", requiredChars: ["char_aiquoc"], requiredAction: "act_huan_luyen", status: "CONFUSE", outcome: "Huấn luyện là ở lớp học Quảng Châu! Tại phòng viết Paris, hành động cần là 'Tuyên truyền CM'." },
  { sceneId: "loc_paris_banan", requiredChars: ["char_aiquoc"], requiredAction: "act_bao_luc", status: "FAIL", outcome: "Ngòi bút mạnh hơn bạo lực. Nguyễn Ái Quốc chọn dùng văn chương làm vũ khí đấu tranh." },
  { sceneId: "loc_paris_banan", requiredChars: ["char_colonial"], requiredAction: null, status: "FAIL", outcome: "Thực dân Pháp không viết sách tố cáo chính mình! Nhân vật không phù hợp." },

  // ── SCENE 4: Xuất bản "Đường Kách Mệnh" (1927) ──
  { sceneId: "loc_guangzhou", requiredChars: ["char_aiquoc", "char_rev_youth"], requiredAction: "act_huan_luyen", status: "SUCCESS", outcome: "\"Đường Kách Mệnh\" (1927) xuất bản — tác phẩm kim chỉ nam cho phong trào cách mạng Việt Nam, hun đúc lớp thanh niên yêu nước thành chiến sĩ cách mạng." },
  { sceneId: "loc_guangzhou", requiredChars: ["char_aiquoc"], requiredAction: "act_huan_luyen", status: "CONFUSE", outcome: "Lớp học cần có học trò! Hãy kéo thêm Thanh niên cách mạng vào để hoàn chỉnh cảnh huấn luyện." },
  { sceneId: "loc_guangzhou", requiredChars: ["char_rev_youth"], requiredAction: "act_huan_luyen", status: "CONFUSE", outcome: "Cần người thầy! Hãy kéo Nguyễn Ái Quốc vào lớp học Quảng Châu." },
  { sceneId: "loc_guangzhou", requiredChars: ["char_aiquoc", "char_rev_youth"], requiredAction: "act_tuyen_truyen", status: "CONFUSE", outcome: "Đây là lớp học huấn luyện thực tế, không chỉ tuyên truyền lý thuyết. Hãy chọn hành động 'Huấn luyện'." },
  { sceneId: "loc_guangzhou", requiredChars: ["char_aiquoc"], requiredAction: "act_bao_luc", status: "FAIL", outcome: "Lớp huấn luyện chính trị không phải chiến trường bạo lực. Nguyễn Ái Quốc dạy lý luận cách mạng." },
  { sceneId: "loc_guangzhou", requiredChars: ["char_colonial"], requiredAction: null, status: "FAIL", outcome: "Thực dân Pháp không được phép vào lớp học cách mạng bí mật tại Quảng Châu!" },

  // ── SCENE 5: Liên minh Công – Nông ──
  { sceneId: "loc_vietnam_village", requiredChars: ["char_aiquoc", "char_viet_worker", "char_viet_farmer"], requiredAction: "act_lien_minh", status: "SUCCESS", outcome: "Liên minh Công – Nông vững chắc! Nguyễn Ái Quốc xây dựng nền tảng xã hội cho cách mạng — giai cấp công nhân lãnh đạo, nông dân là lực lượng chủ yếu." },
  { sceneId: "loc_vietnam_village", requiredChars: ["char_aiquoc", "char_viet_worker"], requiredAction: "act_lien_minh", status: "CONFUSE", outcome: "Còn thiếu Nông dân Việt Nam! Liên minh Công – Nông phải có đại diện cả hai giai cấp." },
  { sceneId: "loc_vietnam_village", requiredChars: ["char_aiquoc", "char_viet_farmer"], requiredAction: "act_lien_minh", status: "CONFUSE", outcome: "Còn thiếu Công nhân Việt Nam! Giai cấp công nhân phải giữ vai trò lãnh đạo trong liên minh." },
  { sceneId: "loc_vietnam_village", requiredChars: ["char_viet_worker", "char_viet_farmer"], requiredAction: "act_lien_minh", status: "CONFUSE", outcome: "Cần người tổ chức! Hãy kéo Nguyễn Ái Quốc vào để xây dựng liên minh có tổ chức và lý luận." },
  { sceneId: "loc_vietnam_village", requiredChars: ["char_aiquoc"], requiredAction: "act_lien_minh", status: "CONFUSE", outcome: "Liên minh cần đại diện cả hai giai cấp! Kéo thêm Công nhân và Nông dân Việt Nam vào." },
  { sceneId: "loc_vietnam_village", requiredChars: ["char_colonial"], requiredAction: null, status: "FAIL", outcome: "Thực dân Pháp không thể là thành viên của liên minh công – nông cách mạng Việt Nam!" },
  { sceneId: "loc_vietnam_village", requiredChars: ["char_aiquoc"], requiredAction: "act_bao_luc", status: "FAIL", outcome: "Bạo lực đơn thuần không xây dựng được khối liên minh vững chắc. Cần có tổ chức và lý luận." },

  // ── SCENE 6: Thành lập Đảng CSVN (3/2/1930) ──
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc"], requiredAction: "act_thanh_lap", status: "SUCCESS", outcome: "Ngày 3/2/1930 — Đảng Cộng sản Việt Nam chính thức thành lập tại Hội nghị Hợp nhất ở Hồng Kông! Bước ngoặt lịch sử vĩ đại, mở ra kỷ nguyên mới cho dân tộc Việt Nam." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc", "char_rev_youth"], requiredAction: "act_thanh_lap", status: "SUCCESS", outcome: "Ngày 3/2/1930 — Đảng Cộng sản Việt Nam ra đời! Lớp thanh niên cách mạng trở thành những đảng viên đầu tiên, tiên phong cho sự nghiệp giải phóng dân tộc." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc"], requiredAction: "act_huan_luyen", status: "CONFUSE", outcome: "Hội nghị Hồng Kông là để thành lập Đảng, không phải huấn luyện. Hãy chọn hành động 'Thành lập Đảng'." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc"], requiredAction: "act_doan_ket", status: "CONFUSE", outcome: "Đoàn kết các tổ chức cộng sản là bước trung gian — nhưng mục tiêu cuối là 'Thành lập Đảng'." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc"], requiredAction: "act_bao_luc", status: "FAIL", outcome: "Hội nghị Hồng Kông 1930 là hội nghị hợp nhất chính trị, không phải hành động bạo lực." },
  { sceneId: "loc_hongkong", requiredChars: ["char_colonial"], requiredAction: null, status: "FAIL", outcome: "Thực dân Pháp không thể tham gia hội nghị thành lập Đảng Cộng sản Việt Nam!" },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc"], requiredAction: "act_ky_nguyen", status: "FAIL", outcome: "Kêu gọi đế quốc là sai lầm chiến lược. Đảng ra đời là để lãnh đạo nhân dân tự giải phóng." },
];

const getCharStateImg = (charId: string, emotion: string) => {
  return CHAR_STATES[charId]?.[emotion] || CHAR_STATES[charId]?.idle || "";
};


// ==========================================
// TYPES
// ==========================================
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

const VICTORY_TIMELINE = [
  "loc_paris_hll",
  "loc_paris_leparia",
  "loc_paris_banan",
  "loc_guangzhou",
  "loc_vietnam_village",
  "loc_hongkong",
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Chapter3Page() {
  const router = useRouter();

  const [panels, setPanels] = useState<PanelState[]>(
    Array(6).fill(null).map((_, i) => ({
      sceneId: null,
      sceneBg: null,
      characters: [],
      actions: [],
      outcome: null,
      isLocked: i !== 0,
    }))
  );

  const [isWin, setIsWin] = useState(false);

  // ==========================================
  // RULE ENGINE
  // ==========================================
  useEffect(() => {
    const newPanels = [...panels];

    for (let i = 0; i < 6; i++) {
      const panel = { ...newPanels[i] };
      const scene = panel.sceneId;
      const chars = panel.characters.map((c) => c.id);
      const actions = panel.actions || [];

      if (!scene) {
        for (let j = i + 1; j < 6; j++) newPanels[j] = { ...newPanels[j], isLocked: true };
        newPanels[i] = panel;
        break;
      }

      if (i + 1 < 6) newPanels[i + 1] = { ...newPanels[i + 1], isLocked: false };

      let status: ScenarioStatus | null = null;
      let outcome = "";

      for (const rule of RULES) {
        if (rule.sceneId !== scene) continue;
        const hasRequiredChars = rule.requiredChars.every((c) => chars.includes(c));
        const hasRequiredAction = rule.requiredAction
          ? actions.includes(rule.requiredAction)
          : true;
        if (hasRequiredChars && hasRequiredAction && chars.length > 0) {
          status = rule.status;
          outcome = rule.outcome;
          break;
        }
      }

      if (!status) {
        if (chars.length > 0 && actions.length === 0) {
          outcome = "Nhân vật đang chờ bạn đưa ra một quyết định...";
        } else if (chars.length === 0 && actions.length > 0) {
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

      panel.characters = panel.characters.map((c) => {
        let emotion = "idle";
        if (panel.isConfuse) {
          emotion = "confused";
        } else if (status === "FAIL") {
          emotion = "angry";
        } else if (status === "SUCCESS") {
          emotion = "happy";
        }
        return { ...c, stateImg: getCharStateImg(c.id, emotion) };
      });

      newPanels[i] = panel;
    }

    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      setPanels(newPanels);
    }

    const successScenes = newPanels.filter((p) => p.isSuccess).map((p) => p.sceneId);
    let expectedIndex = 0;
    let isVictory = false;
    for (const scene of successScenes) {
      if (scene === VICTORY_TIMELINE[expectedIndex]) {
        expectedIndex++;
        if (expectedIndex === VICTORY_TIMELINE.length) {
          isVictory = true;
          break;
        }
      }
    }

    if (isVictory && !isWin) {
      setIsWin(true);
      new Audio("/sounds/win.wav").play().catch(() => {});
      try {
        const saved = localStorage.getItem("completedChapters");
        const list: number[] = saved ? JSON.parse(saved) : [];
        if (!list.includes(3)) {
          list.push(3);
          localStorage.setItem("completedChapters", JSON.stringify(list));
          globalThis.dispatchEvent(new Event("game-completed-sync"));
        }
      } catch (_) {}
    }
  }, [panels, isWin]);

  // ==========================================
  // DRAG & DROP
  // ==========================================
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
      targetPanel.actions = [];
      targetPanel.outcome = null;
      targetPanel.isSuccess = false;
      targetPanel.isError = false;
      targetPanel.isConfuse = false;
    } else if (type === "character") {
      if (!targetPanel.sceneId) return;
      if (
        targetPanel.characters.length < 4 &&
        !targetPanel.characters.find((c) => c.id === id)
      ) {
        targetPanel.characters = [
          ...targetPanel.characters,
          { id, stateImg: CHAR_STATES[id]?.idle || "" },
        ];
      }
    } else if (type === "action") {
      if (!targetPanel.sceneId) return;
      targetPanel.actions = [id]; // single action slot
    }

    newPanels[panelIndex] = targetPanel;
    setPanels(newPanels);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

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

  const removeCharacter = (panelIndex: number, charId: string) => {
    const newPanels = [...panels];
    const panel = { ...newPanels[panelIndex] };
    panel.characters = panel.characters.filter((c) => c.id !== charId);
    newPanels[panelIndex] = panel;
    setPanels(newPanels);
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full">
      {/* TIÊU ĐỀ */}
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide text-center">
          Chương 3: Gieo Mầm Cách Mạng và Khai Sinh Đảng (1921–1930)
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
              className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all
                ${panel.isLocked ? "border-gray-400 opacity-50 bg-gray-200/20" : "border-[#a69279]"}
                ${panel.isSuccess ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""}
                ${panel.isError ? "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]" : ""}
                ${panel.isConfuse ? "border-gray-500 grayscale shadow-[0_0_10px_rgba(107,114,128,0.5)]" : ""}`}
            >
              {/* LOCK */}
              {panel.isLocked && (
                <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">
                  🔒
                </div>
              )}

              {/* PANEL NUMBER */}
              {!panel.sceneId && !panel.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-[#a69279] text-5xl font-serif opacity-30 select-none">{i + 1}</span>
                </div>
              )}

              {/* CLEAR BUTTON */}
              {panel.sceneId && !panel.isLocked && (
                <button
                  onClick={() => clearPanel(i)}
                  className="absolute top-1 right-2 text-red-700/60 hover:text-red-800 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  X
                </button>
              )}

              {/* BACKGROUND */}
              {panel.sceneBg && (
                <img
                  src={panel.sceneBg}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              {/* CHARACTERS */}
              <div className="absolute inset-0 z-10 flex items-end justify-center pb-12 px-4 pointer-events-none">
                <div className="flex h-[58%] gap-2 w-full justify-center">
                  {panel.characters.map((char) => (
                    <motion.div
                      key={char.id}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="h-full relative pointer-events-auto group/char"
                    >
                      <img
                        src={char.stateImg}
                        alt={char.id}
                        className="h-full w-auto object-contain drop-shadow-[2px_2px_5px_rgba(0,0,0,0.6)]"
                        style={{ background: "transparent" }}
                      />
                      {!panel.isLocked && (
                        <button
                          onClick={() => removeCharacter(i, char.id)}
                          className="absolute -top-1 -right-1 bg-red-600/80 text-white rounded-full w-4 h-4 text-xs
                            flex items-center justify-center opacity-0 group-hover/char:opacity-100 transition-opacity
                            pointer-events-none group-hover/char:pointer-events-auto z-20"
                        >
                          ×
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ACTION BADGE */}
              {panel.actions && panel.actions.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 pointer-events-auto">
                  {panel.actions.map((actId) => {
                    const actionAsset = CHAPTER_3_ASSETS.actions.find((a) => a.id === actId);
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

              {/* OUTCOME TEXT */}
              {panel.outcome && (
                <div className={`absolute bottom-0 w-full min-h-[44px] backdrop-blur-sm flex items-center justify-center px-2 py-1 z-20
                  ${panel.isError ? "bg-red-900/85" : panel.isConfuse ? "bg-gray-800/85" : "bg-black/75"}`}>
                  <span className="text-white text-[11px] leading-tight text-center font-medium drop-shadow-md">
                    {panel.outcome}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TOOLBAR
          FIX: outer div chỉ có overflow-x-auto, KHÔNG có justify-center
               inner div có min-w-max + justify-start để scroll từ trái sang phải đúng cách
      */}
      <div
        className="h-[140px] mt-4 mx-12 border-t-[3px] border-double border-[#c2a878]/60 bg-white/10 rounded-t-2xl overflow-x-auto"
        onDragOver={handleDragOver}
      >
        <div className="flex items-start justify-start gap-3 md:gap-4 px-4 pt-6 h-full min-w-max">

          {/* SCENES */}
          {CHAPTER_3_ASSETS.scenes.map((asset) => (
            <div
              key={asset.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
              className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
            >
              <div className="h-14 flex items-center justify-center mb-1">
                <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] flex items-center justify-center shadow-md overflow-hidden">
                  <img src={asset.icon} alt={asset.label} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight whitespace-pre-line">
                {asset.label}
              </span>
            </div>
          ))}

          <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0 mt-1" />

          {/* CHARACTERS */}
          {CHAPTER_3_ASSETS.characters.map((asset) => (
            <div
              key={asset.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "character", asset.id, asset.icon)}
              className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
            >
              <div className="h-14 flex items-center justify-center mb-1">
                <div className="w-12 h-12 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] flex items-center justify-center shadow-md overflow-hidden">
                  <img src={asset.icon} alt={asset.label} className="w-full h-full object-contain" style={{ background: "transparent" }} />
                </div>
              </div>
              <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight whitespace-pre-line">
                {asset.label}
              </span>
            </div>
          ))}

          <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0 mt-1" />

          {/* ACTIONS */}
          {CHAPTER_3_ASSETS.actions.map((asset) => (
            <div
              key={asset.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "action", asset.id, asset.icon)}
              className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
            >
              <div className="h-14 flex items-center justify-center mb-1">
                <div className={`w-10 h-10 rounded border-2 border-dashed flex items-center justify-center shadow-md overflow-hidden
                  ${asset.isTrap ? "bg-red-100 border-red-500" : "bg-amber-100 border-amber-600"}`}>
                  <img src={asset.icon} alt={asset.label} className="w-6 h-6 object-contain" />
                </div>
              </div>
              <span className={`font-serif font-bold text-[10px] text-center max-w-[60px] leading-tight whitespace-pre-line
                ${asset.isTrap ? "text-red-700" : "text-[#5c4a3d]"}`}>
                {asset.label}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* WIN MODAL */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center rounded-lg"
          >
            <motion.img
              src="/chapter3/char_aiquoc_victorious.png"
              alt="Nguyễn Ái Quốc chiến thắng"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="h-44 w-auto object-contain mb-4 drop-shadow-2xl"
              style={{ background: "transparent" }}
            />
            <CheckCircle2 size={60} className="text-green-400 mb-3 animate-pulse" />
            <h2 className="text-[20px] font-serif text-amber-400 font-bold mb-4 px-12 leading-relaxed">
              KẾT LUẬN: Ngày 3/2/1930, Đảng Cộng sản Việt Nam chính thức ra đời tại Hồng Kông!
              Từ hạt giống tư tưởng gieo năm 1921, qua từng trang báo, từng tác phẩm, từng lớp huấn luyện —
              Nguyễn Ái Quốc đã dẫn dắt dân tộc bước vào kỷ nguyên cách mạng mới.
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
