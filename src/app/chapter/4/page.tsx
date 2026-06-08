"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS & TRẠNG THÁI ẢNH
// ==========================================
const USE_OFFLINE_IMAGES = process.env.NEXT_PUBLIC_USE_OFFLINE_IMAGES === "true";

// Placeholder links for now. Will be updated when user uploads images.
const CLOUDINARY_LINKS_CH4: Record<string, string> = {
  "bg_hongkong_prison.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883731/chapter4_assets/bg_hongkong_prison.png",
  "bg_moscow_office.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883738/chapter4_assets/bg_moscow_office.png",
  "bg_pacbo_cave.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883752/chapter4_assets/bg_pacbo_cave.png",
  "char_aiquoc_angry.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883761/chapter4_assets/char_aiquoc_angry.png",
  "char_aiquoc_confused.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883778/chapter4_assets/char_aiquoc_confused.png",
  "char_aiquoc_happy.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883792/chapter4_assets/char_aiquoc_happy.png",
  "char_aiquoc_idle.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883810/chapter4_assets/char_aiquoc_idle.png",
  "char_enemy_angry.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883820/chapter4_assets/char_enemy_angry.png",
  "char_enemy_confused.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883830/chapter4_assets/char_enemy_confused.png",
  "char_enemy_happy.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883836/chapter4_assets/char_enemy_happy.png",
  "char_enemy_idle.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883840/chapter4_assets/char_enemy_idle.png",
  "char_loseby_angry.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883847/chapter4_assets/char_loseby_angry.png",
  "char_loseby_confused.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883855/chapter4_assets/char_loseby_confused.png",
  "char_loseby_happy.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883864/chapter4_assets/char_loseby_happy.png",
  "char_loseby_idle.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883876/chapter4_assets/char_loseby_idle.png",
  "char_qtcs_angry.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883887/chapter4_assets/char_qtcs_angry.png",
  "char_qtcs_confused.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883900/chapter4_assets/char_qtcs_confused.png",
  "char_qtcs_happy.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883908/chapter4_assets/char_qtcs_happy.png",
  "char_qtcs_idle.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883915/chapter4_assets/char_qtcs_idle.png",
  "icon_act_bienho.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883928/chapter4_assets/icon_act_bienho.png",
  "icon_act_giaiphong.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883944/chapter4_assets/icon_act_giaiphong.png",
  "icon_act_giaodieu.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883962/chapter4_assets/icon_act_giaodieu.png",
  "icon_act_kiendinh.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883967/chapter4_assets/icon_act_kiendinh.png",
  "icon_act_tobo.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883973/chapter4_assets/icon_act_tobo.png",
  "icon_act_xinvenguoc.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883986/chapter4_assets/icon_act_xinvenguoc.png",
  "icon_loc_hongkong.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780883996/chapter4_assets/icon_loc_hongkong.png",
  "icon_loc_moscow.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780884012/chapter4_assets/icon_loc_moscow.png",
  "icon_loc_pacbo.png": "https://res.cloudinary.com/ditwkoldt/image/upload/v1780884020/chapter4_assets/icon_loc_pacbo.png"
};

const getImg = (filename: string) => {
  return USE_OFFLINE_IMAGES ? `/chapter4/${filename}` : (CLOUDINARY_LINKS_CH4[filename] || `/chapter4/${filename}`);
};

const CHAPTER_4_ASSETS = {
  scenes: [
    {
      id: "loc_hongkong",
      label: "Nhà tù Victoria",
      icon: getImg("icon_loc_hongkong.png"),
      bg: getImg("bg_hongkong_prison.png"),
    },
    {
      id: "loc_moscow",
      label: "Quốc tế\nCộng sản",
      icon: getImg("icon_loc_moscow.png"),
      bg: getImg("bg_moscow_office.png"),
    },
    {
      id: "loc_pacbo",
      label: "Hang Pác Bó",
      icon: getImg("icon_loc_pacbo.png"),
      bg: getImg("bg_pacbo_cave.png"),
    },
  ],
  characters: [
    { id: "char_aiquoc", label: "Nguyễn Ái Quốc", icon: getImg("char_aiquoc_idle.png") },
    { id: "char_loseby", label: "Luật sư Loseby", icon: getImg("char_loseby_idle.png") },
    { id: "char_qtcs",   label: "Đại diện QTCS",  icon: getImg("char_qtcs_idle.png") },
    { id: "char_enemy",  label: "Mật thám",       icon: getImg("char_enemy_idle.png"), isTrap: true },
  ],
  actions: [
    { id: "act_bienho",     label: "Biện hộ\npháp lý",  icon: getImg("icon_act_bienho.png") },
    { id: "act_kiendinh",   label: "Kiên định",         icon: getImg("icon_act_kiendinh.png") },
    { id: "act_xinvenguoc", label: "Xin về nước",       icon: getImg("icon_act_xinvenguoc.png") },
    { id: "act_giaiphong",  label: "Giải phóng\ndân tộc", icon: getImg("icon_act_giaiphong.png") },
    { id: "act_giaodieu",   label: "Giáo điều",         icon: getImg("icon_act_giaodieu.png"), isTrap: true },
    { id: "act_tobo",       label: "Bỏ cuộc",           icon: getImg("icon_act_tobo.png"), isTrap: true },
  ],
};

// ==========================================
// CHAR STATES
// ==========================================
const CHAR_STATES: Record<string, Record<string, string>> = {
  char_aiquoc: {
    idle:     getImg("char_aiquoc_idle.png"),
    happy:    getImg("char_aiquoc_happy.png"),
    angry:    getImg("char_aiquoc_angry.png"),
    confused: getImg("char_aiquoc_confused.png"),
  },
  char_loseby: {
    idle:     getImg("char_loseby_idle.png"),
    happy:    getImg("char_loseby_happy.png"),
    angry:    getImg("char_loseby_angry.png"),
    confused: getImg("char_loseby_confused.png"),
  },
  char_qtcs: {
    idle:     getImg("char_qtcs_idle.png"),
    happy:    getImg("char_qtcs_happy.png"),
    angry:    getImg("char_qtcs_angry.png"),
    confused: getImg("char_qtcs_confused.png"),
  },
  char_enemy: {
    idle:     getImg("char_enemy_idle.png"),
    happy:    getImg("char_enemy_happy.png"),
    angry:    getImg("char_enemy_angry.png"),
    confused: getImg("char_enemy_confused.png"),
  },
};

type ScenarioStatus = "SUCCESS" | "FAIL" | "CONFUSE" | "ERROR";

interface Rule {
  sceneId: string;
  requiredChars: string[];
  requiredAction: string | null;
  status: ScenarioStatus;
  outcome: string;
}

// ==========================================
// RULES ENGINE (Mọi trường hợp phi logic, sai lịch sử)
// ==========================================
const RULES: Rule[] = [
  // ── SCENE 1: HỒNG KÔNG ──
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc", "char_loseby"], requiredAction: "act_bienho", status: "SUCCESS", outcome: "Sự giúp đỡ tận tình của luật sư Loseby và lập luận sắc bén đã cứu Tống Văn Sơ thoát hiểm." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc", "char_loseby"], requiredAction: "act_giaodieu", status: "CONFUSE", outcome: "Luật sư Loseby không hiểu những lý luận giáo điều tả khuynh. Ông chỉ quan tâm đến pháp lý để bảo vệ thân chủ." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc", "char_loseby"], requiredAction: "act_tobo", status: "FAIL", outcome: "Bỏ cuộc ư? Không đời nào! Ngay cả trong nhà ngục Victoria tối tăm, Tống Văn Sơ vẫn giữ vững tinh thần lạc quan và kiên cường đấu tranh." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc", "char_enemy"], requiredAction: null, status: "FAIL", outcome: "Mật thám bủa vây trùng trùng, nhưng với tài trí nhạy bén, Tống Văn Sơ đã khéo léo che giấu thân phận, kiên nhẫn tìm cách liên lạc ra bên ngoài." },
  { sceneId: "loc_hongkong", requiredChars: ["char_qtcs"], requiredAction: null, status: "CONFUSE", outcome: "Quốc tế Cộng sản ở Moscow không có quyền lực can thiệp vào hệ thống luật pháp của thực dân Anh tại Hồng Kông." },
  { sceneId: "loc_hongkong", requiredChars: ["char_aiquoc"], requiredAction: "act_giaiphong", status: "CONFUSE", outcome: "Lý tưởng giải phóng dân tộc vẫn bùng cháy, nhưng Tống Văn Sơ đang bị giam cầm, không thể trực tiếp lãnh đạo lúc này." },

  // ── SCENE 2: MOSCOW ──
  { sceneId: "loc_moscow", requiredChars: ["char_aiquoc", "char_qtcs"], requiredAction: "act_kiendinh", status: "SUCCESS", outcome: "Mặc cho bị phê phán, Nguyễn Ái Quốc nhẫn nại nghiên cứu, bảo vệ đường lối độc lập tự chủ." },
  { sceneId: "loc_moscow", requiredChars: ["char_aiquoc"], requiredAction: "act_xinvenguoc", status: "SUCCESS", outcome: "Tháng 10/1938, chớp thời cơ thế giới biến động, Nguyễn Ái Quốc chủ động xin rời Moscow." },
  { sceneId: "loc_moscow", requiredChars: ["char_aiquoc", "char_qtcs"], requiredAction: "act_giaodieu", status: "FAIL", outcome: "Tuyệt đối không! Nguyễn Ái Quốc kiên quyết bác bỏ sự giáo điều. Cách mạng Việt Nam không thể rập khuôn máy móc mà phải dựa vào thực tiễn." },
  { sceneId: "loc_moscow", requiredChars: ["char_aiquoc"], requiredAction: "act_tobo", status: "FAIL", outcome: "Không bao giờ có chuyện bỏ cuộc! Dù bị hiểu lầm và xa lánh, ý chí giải phóng dân tộc trong Người vẫn rực cháy chưa từng tắt." },
  { sceneId: "loc_moscow", requiredChars: ["char_loseby"], requiredAction: null, status: "CONFUSE", outcome: "Gia đình luật sư người Anh không có lý do gì để xuất hiện tại trụ sở Quốc tế Cộng sản." },

  // ── SCENE 3: PÁC BÓ ──
  { sceneId: "loc_pacbo", requiredChars: ["char_aiquoc"], requiredAction: "act_giaiphong", status: "SUCCESS", outcome: "Hội nghị TW 8 (1941): Quyền lợi của quốc gia, dân tộc là tối thượng. Bác đã lèo lái con thuyền Cách mạng vào đúng quỹ đạo!" },
  { sceneId: "loc_pacbo", requiredChars: ["char_aiquoc"], requiredAction: "act_giaodieu", status: "FAIL", outcome: "Bác kiên quyết gạt bỏ tư tưởng giáo điều! Ở Pác Bó, Người khẳng định: Phải đoàn kết toàn dân, quyền lợi dân tộc phải được đặt lên trên hết." },
  { sceneId: "loc_pacbo", requiredChars: ["char_aiquoc"], requiredAction: "act_xinvenguoc", status: "CONFUSE", outcome: "Bác đã hôn lên hòn đất Tổ quốc tại cột mốc 108 rồi, không cần xin về nước nữa. Hãy bắt tay vào hành động!" },
  { sceneId: "loc_pacbo", requiredChars: ["char_aiquoc", "char_enemy"], requiredAction: null, status: "FAIL", outcome: "Căn cứ Pác Bó bị lộ do có mật thám. Nhưng với sự nhạy bén, Bác đã kịp thời rút lui vào rừng sâu, tổ chức lại lực lượng chờ đợi thời cơ." },
  { sceneId: "loc_pacbo", requiredChars: ["char_loseby"], requiredAction: null, status: "CONFUSE", outcome: "Luật sư Loseby không có mặt tại vùng núi rừng biên giới Việt Nam." },
  { sceneId: "loc_pacbo", requiredChars: ["char_qtcs"], requiredAction: null, status: "CONFUSE", outcome: "Đại diện Quốc tế Cộng sản không có mặt tại vùng núi rừng biên giới Việt Nam." },
];

// ==========================================
// TYPES & NARRATIVE DEFINITIONS
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

type EventType =
  | "ESCAPE_HK"
  | "SURVIVE_MOSCOW"
  | "RETURN_VN"
  | "PACBO_VICTORY"
  | "UNKNOWN";

interface EventDefinition {
  type: EventType;
  sceneId: string;
  requiredChars: string[];
  requiredAction: string;
  prereqs: string[];
  consequence: string;
  successOutcome: string;
}

const initialWorldState = {
  escapedHongKong: false,
  survivedMoscow: false,
  returnedToVietnam: false,
  pacboVictory: false,
};

const EVENTS_MAP: Record<EventType, EventDefinition> = {
  ESCAPE_HK: {
    type: "ESCAPE_HK",
    sceneId: "loc_hongkong",
    requiredChars: ["char_aiquoc", "char_loseby"],
    requiredAction: "act_bienho",
    prereqs: [],
    consequence: "escapedHongKong",
    successOutcome: "Sự giúp đỡ tận tình của luật sư Loseby và lập luận sắc bén đã cứu Tống Văn Sơ thoát hiểm.",
  },
  SURVIVE_MOSCOW: {
    type: "SURVIVE_MOSCOW",
    sceneId: "loc_moscow",
    requiredChars: ["char_aiquoc", "char_qtcs"],
    requiredAction: "act_kiendinh",
    prereqs: ["escapedHongKong"],
    consequence: "survivedMoscow",
    successOutcome: "Mặc cho bị phê phán, Nguyễn Ái Quốc nhẫn nại nghiên cứu, bảo vệ đường lối độc lập tự chủ.",
  },
  RETURN_VN: {
    type: "RETURN_VN",
    sceneId: "loc_moscow",
    requiredChars: ["char_aiquoc"],
    requiredAction: "act_xinvenguoc",
    prereqs: ["survivedMoscow"],
    consequence: "returnedToVietnam",
    successOutcome: "Tháng 10/1938, chớp thời cơ thế giới biến động, Nguyễn Ái Quốc chủ động xin rời Moscow.",
  },
  PACBO_VICTORY: {
    type: "PACBO_VICTORY",
    sceneId: "loc_pacbo",
    requiredChars: ["char_aiquoc"],
    requiredAction: "act_giaiphong",
    prereqs: ["returnedToVietnam"],
    consequence: "pacboVictory",
    successOutcome: "Hội nghị TW 8 (1941): Quyền lợi của quốc gia, dân tộc là tối thượng. Bác đã lèo lái con thuyền Cách mạng vào đúng quỹ đạo!",
  },
  UNKNOWN: {
    type: "UNKNOWN",
    sceneId: "",
    requiredChars: [],
    requiredAction: "",
    prereqs: [],
    consequence: "",
    successOutcome: "",
  },
};

const identifyEvent = (sceneId: string, chars: string[], actions: string[]): EventType => {
  if (!sceneId) return "UNKNOWN";
  const action = actions[0] || "";

  if (sceneId === "loc_hongkong") {
    const req = ["char_aiquoc", "char_loseby"];
    if (action === "act_bienho" && chars.length === req.length && req.every(c => chars.includes(c))) {
      return "ESCAPE_HK";
    }
  }

  if (sceneId === "loc_moscow") {
    if (action === "act_kiendinh") {
      const req = ["char_aiquoc", "char_qtcs"];
      if (chars.length === req.length && req.every(c => chars.includes(c))) return "SURVIVE_MOSCOW";
    } else if (action === "act_xinvenguoc") {
      const req = ["char_aiquoc"];
      if (chars.length === req.length && req.every(c => chars.includes(c))) return "RETURN_VN";
    }
  }

  if (sceneId === "loc_pacbo") {
    const req = ["char_aiquoc"];
    if (action === "act_giaiphong" && chars.length === req.length && req.every(c => chars.includes(c))) {
      return "PACBO_VICTORY";
    }
  }

  return "UNKNOWN";
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Chapter4Page() {
  const router = useRouter();
  // Chapter 4 uses 6 panels (3 cols x 2 rows) matching Chapter 1
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
  // RULE ENGINE & AUTO-VICTORY TRIGGER
  // ==========================================
  useEffect(() => {
    const newPanels = [...panels];

    // 1. Identify events
    const panelEvents = newPanels.map((p) =>
      p.sceneId
        ? identifyEvent(
            p.sceneId,
            p.characters.map((c) => c.id),
            p.actions
          )
        : null
    );

    // 2. Count occurrences to prevent duplication
    const eventCounts: Record<string, number> = {};
    for (const ev of panelEvents) {
      if (ev && ev !== "UNKNOWN") {
        eventCounts[ev] = (eventCounts[ev] || 0) + 1;
      }
    }

    // 3. Sequential evaluation of world state
    const currentWorldState = { ...initialWorldState };

    for (let i = 0; i < 6; i++) {
      const panel = { ...newPanels[i] };
      const sceneId = panel.sceneId;
      const chars = panel.characters.map((c) => c.id);
      const actions = panel.actions || [];

      // Logic Khóa/Mở Panel tuần tự
      if (!sceneId) {
        for (let j = i + 1; j < 6; j++) newPanels[j].isLocked = true;
        panel.outcome = null;
        panel.isSuccess = false;
        panel.isError = false;
        panel.isConfuse = false;
        newPanels[i] = panel;
        break; // Dừng đánh giá các panel tiếp theo nếu panel hiện tại trống
      }

      // Nếu panel hiện tại có Bối cảnh, mở khóa panel tiếp theo
      if (i + 1 < 6) newPanels[i + 1].isLocked = false;

      const eventType = panelEvents[i];

      let isSuccess = false;
      let isError = false;
      let isConfuse = false;
      let outcome = "";

      let emotionForAiQuoc = "idle";
      let emotionForLoseby = "idle";
      let emotionForQtcs = "idle";
      let emotionForEnemy = "idle";

      if (!eventType || eventType === "UNKNOWN") {
        // Locally incorrect event based on RULES array
        let status: ScenarioStatus | null = null;
        for (const rule of RULES) {
          if (rule.sceneId !== sceneId) continue;
          if (rule.status === "SUCCESS") continue; // Handled by Event loop

          // For generic failure catching
          const hasRequiredChars = rule.requiredChars.every((c) => chars.includes(c));
          const hasRequiredAction = rule.requiredAction ? actions.includes(rule.requiredAction) : true;

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
            outcome = "Lựa chọn này không tạo nên diễn biến lịch sử phù hợp.";
          }
        }

        isSuccess = false;
        isError = status === "FAIL" || status === "ERROR";
        isConfuse = status === "CONFUSE";

        emotionForAiQuoc = "confused";
        emotionForLoseby = "confused";
        emotionForQtcs = "confused";
        emotionForEnemy = "happy"; // Enemy is happy when player makes a mistake
      } else {
        // Valid Event identified locally
        const isDuplicate = eventCounts[eventType] > 1;
        const prereqsMet = EVENTS_MAP[eventType].prereqs.every((p) => currentWorldState[p as keyof typeof initialWorldState]);

        if (isDuplicate) {
          isSuccess = false;
          isError = true;
          isConfuse = false;
          outcome = "Sự kiện lịch sử này đã được thiết lập. Không thể lặp lại.";
          emotionForAiQuoc = "confused";
        } else if (!prereqsMet) {
          // Time Paradox
          isSuccess = false;
          isError = true;
          isConfuse = false;

          if (eventType === "SURVIVE_MOSCOW" || eventType === "RETURN_VN") {
            outcome = "Nghịch lý thời gian: Tống Văn Sơ vẫn đang bị kẹt tại nhà tù Victoria (Hồng Kông), chưa thể có mặt ở Moscow!";
          } else if (eventType === "PACBO_VICTORY") {
            outcome = "Nghịch lý thời gian: Nguyễn Ái Quốc vẫn đang ở Moscow (hoặc Hồng Kông), chưa thể tổ chức hội nghị lãnh đạo tại Pác Bó!";
          }

          emotionForAiQuoc = "angry"; // Frustrated by paradox
          emotionForLoseby = "idle";
          emotionForQtcs = "confused";
          emotionForEnemy = "happy";
        } else {
          // Successful event in sequence!
          isSuccess = true;
          isError = false;
          isConfuse = false;
          outcome = EVENTS_MAP[eventType].successOutcome;

          // Update state so the next panel can succeed
          currentWorldState[EVENTS_MAP[eventType].consequence as keyof typeof initialWorldState] = true;

          if (eventType === "ESCAPE_HK") {
            emotionForAiQuoc = "happy";
            emotionForLoseby = "happy";
          } else if (eventType === "SURVIVE_MOSCOW") {
            emotionForAiQuoc = "angry"; // "Kiên định" usually implies resolute/stern
            emotionForQtcs = "angry"; // Criticizing him
          } else if (eventType === "RETURN_VN") {
            emotionForAiQuoc = "happy"; // Hopeful
          } else if (eventType === "PACBO_VICTORY") {
            emotionForAiQuoc = "happy"; // Total victory
          }
        }
      }

      panel.outcome = outcome || null;
      panel.isSuccess = isSuccess;
      panel.isError = isError;
      panel.isConfuse = isConfuse;

      panel.characters = panel.characters.map((c) => {
        let emotion = "idle";
        if (c.id === "char_aiquoc") emotion = emotionForAiQuoc;
        else if (c.id === "char_loseby") emotion = emotionForLoseby;
        else if (c.id === "char_qtcs") emotion = emotionForQtcs;
        else if (c.id === "char_enemy") emotion = emotionForEnemy;
        return { ...c, stateImg: CHAR_STATES[c.id]?.[emotion] || CHAR_STATES[c.id]?.idle || "" };
      });

      newPanels[i] = panel;
    }

    if (JSON.stringify(newPanels) !== JSON.stringify(panels)) {
      setPanels(newPanels);
    }

    // 4. Auto-victory check using sequential verification (like Chapter 1)
    const expectedTimeline = ["ESCAPE_HK", "SURVIVE_MOSCOW", "RETURN_VN", "PACBO_VICTORY"];
    // Get all successful event types in order from the panels
    const successEvents = newPanels
      .filter((p) => p.isSuccess && p.sceneId)
      .map((p) => identifyEvent(p.sceneId!, p.characters.map(c => c.id), p.actions));
    
    let victory = false;
    let expectedIndex = 0;
    for (const ev of successEvents) {
      if (ev === expectedTimeline[expectedIndex]) {
        expectedIndex++;
        if (expectedIndex === expectedTimeline.length) {
          victory = true;
          break;
        }
      }
    }

    if (victory && !isWin) {
      setIsWin(true);
      new Audio("/sounds/win.wav").play().catch(() => {});
      try {
        const saved = localStorage.getItem("completedChapters");
        const list: number[] = saved ? JSON.parse(saved) : [];
        if (!list.includes(4)) {
          list.push(4);
          localStorage.setItem("completedChapters", JSON.stringify(list));
          globalThis.dispatchEvent(new Event("game-completed-sync"));
        }
      } catch (_) {}
    }
  }, [panels, isWin]);

  // ==========================================
  // DRAG & DROP HANDLERS
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
        targetPanel.characters.length < 3 &&
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
          Chương 4: Vượt qua sóng gió và Trở về Tổ quốc (1930 - 1941)
        </h2>
      </div>

      {/* PANELS GRID - Sử dụng grid-cols-3 grid-rows-2 cho 6 panel như Chapter 1 */}
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
              {/* LOCK OVERLAY */}
              {panel.isLocked && (
                <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">
                  🔒
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
                  onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23ccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">Missing BG</text></svg>' }}
                />
              )}

              {/* CHARACTERS */}
              <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 px-4 pointer-events-none">
                <div className="flex h-[75%] gap-2 w-full justify-center">
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
                        className="h-full w-auto object-contain drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)]"
                        style={{ background: "transparent" }}
                        onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="100"><rect width="100%" height="100%" fill="%23aaa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10">Char</text></svg>' }}
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
                    const actionAsset = CHAPTER_4_ASSETS.actions.find((a) => a.id === actId);
                    if (!actionAsset) return null;
                    return (
                      <motion.div
                        key={actId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white/90 border-2 border-amber-500/80 px-2 py-1 rounded shadow-md text-xs font-bold text-amber-900 whitespace-pre-line text-center"
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
                  <span className="text-white text-[11px] leading-tight text-center font-medium drop-shadow-md whitespace-pre-line">
                    {panel.outcome}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TOOLBAR - ĐÃ ĐƯỢC ĐIỀU CHỈNH ĐỂ GIỐNG Y HỆT CHAPTER 1 */}
      <div
        className="h-[140px] mt-4 mx-12 px-4 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-start sm:justify-center gap-3 md:gap-5 bg-white/10 rounded-t-2xl overflow-x-auto"
        onDrop={handleDropToBin}
        onDragOver={handleDragOver}
      >
        {/* SCENES */}
        {CHAPTER_4_ASSETS.scenes.map((asset) => (
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
                onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23ccc"/></svg>' }}
              />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight whitespace-pre-line">
              {asset.label}
            </span>
          </div>
        ))}
        
        <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0"></div>
        
        {/* CHARACTERS */}
        {CHAPTER_4_ASSETS.characters.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "character", asset.id, asset.icon)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className={`w-12 h-12 rounded-full border-2 ${asset.isTrap ? "border-red-400 bg-red-100" : "border-[#a69279] bg-[#e8dbb9]"} mb-1 flex items-center justify-center shadow-md overflow-hidden`}>
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23aaa"/></svg>' }}
              />
            </div>
            <span className={`font-serif font-bold text-[10px] text-center max-w-[60px] leading-tight whitespace-pre-line ${asset.isTrap ? "text-red-700" : "text-[#5c4a3d]"}`}>
              {asset.label}
            </span>
          </div>
        ))}

        <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0"></div>
        
        {/* ACTIONS */}
        {CHAPTER_4_ASSETS.actions.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "action", asset.id, asset.icon)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className={`w-12 h-12 rounded-lg border-2 ${asset.isTrap ? "border-red-400 bg-red-100" : "border-[#a69279] bg-[#e8dbb9]"} mb-1 flex items-center justify-center shadow-md overflow-hidden`}>
              <img
                src={asset.icon}
                alt={asset.label}
                className="w-[80%] h-[80%] object-contain"
                onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23aaa"/></svg>' }}
              />
            </div>
            <span className={`font-serif font-bold text-[10px] text-center max-w-[60px] leading-tight whitespace-pre-line ${asset.isTrap ? "text-red-700" : "text-[#5c4a3d]"}`}>
              {asset.label}
            </span>
          </div>
        ))}
      </div>

      {/* WIN OVERLAY */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#f4ebd0] p-8 rounded-2xl border-4 border-amber-600 shadow-2xl max-w-xl text-center"
            >
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4">Vượt qua Sóng gió!</h2>
              <p className="text-lg text-amber-800 mb-8 leading-relaxed">
                Bạn đã giúp Bác kiên định vượt qua những hiểu lầm, nhẫn nại bảo toàn lực lượng và chớp thời cơ về nước lãnh đạo cuộc đấu tranh giải phóng dân tộc.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Trở về màn hình chính
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
