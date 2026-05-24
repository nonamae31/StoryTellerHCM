/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS CHO CHƯƠNG 2
// ==========================================
const CHAPTER_2_ASSETS = {
  scenes: [
    {
      id: "loom",
      label: "Xưởng Dệt",
      icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773146957/xuongdet_jr1zao.jpg",
      bg: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773146957/xuongdet_jr1zao.jpg",
    },
    {
      id: "market",
      label: "Cái Chợ",
      icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773148784/cho_i1jc21.jpg",
      bg: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773148784/cho_i1jc21.jpg",
    },
  ],
  characters: [
    { id: "weaver", label: "Thợ Dệt", icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773146178/thodet_sgm2f6.jpg" },
    { id: "merchant", label: "Thương Nhân", icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773150391/merchant_sbgqcc.jpg" },
    { id: "concrete_labor", label: "Lao Động Cụ Thể", icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773210250/ldtrutuong_pvc3pd.jpg" },
    { id: "abstract_labor", label: "Lao Động Trừu Tượng", icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773209181/dhc_wsagrg.jpg" },
    { id: "use_value", label: "Giá Trị Sử Dụng", icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773209619/Gemini_Generated_Image_h70llvh70llvh70l_aqjiyt.png" },
    { id: "value", label: "Giá Trị", icon: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773210128/xu_orhnpw.jpg" },
  ],
};

const CHAR_STATES = {
  weaver: {
    idle: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773134691/Gemini_Generated_Image_bwcghobwcghobwcg_yy63mz.png",
    working: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773146588/td_ss_lamviec_uqvjfj.png",
    tired: "/BookImage/Story2/Weaver_Tired.png",
    happy: "/BookImage/Story2/Weaver_Happy.png",
    confused: "",
  },
  merchant: {
    idle: "/BookImage/Story2/Merchant_Idle.png",
    angry: "/BookImage/Story2/Merchant_Angry.png",
    happy: "/BookImage/Story2/Merchant_Happy.png",
    confused: "/BookImage/Story2/Merchant_Confused.png",
  },
};

// ==========================================
// COMPOSITE BG — ảnh cảnh tổng hợp
// ==========================================
const COMPOSITE_BG = {
  loom: {
    weaverIdle: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773146784/thodetdungyen_wfqcir.jpg",
    weaverWorking: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773146588/td_ss_lamviec_uqvjfj.png",
    weaverTired: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773148684/weavertruutuong_phfbjr.jpg",
    // Lỗi ở xưởng: weaver confused (thiếu điều kiện, kết hợp sai, khái niệm chợ lạc vào)
    weaverConfused: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773147548/thodetboiroioxuong_w7p7ps.jpg",
    // Thương nhân lạc vào xưởng
    merchantLost: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773150348/mercon_hz1pji.jpg",
  },
  market: {
    merchantIdle: "/BookImage/Story2/Scene_MerchantIdle.png",
    merchantUseValue: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773210936/tngtsd_lkargl.jpg",
    merchantValue: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773409586/gtsd_oihe6d.jpg",
    tradeComplete: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773212147/end_nncask.jpg",
    tradeMissingConditions: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773414123/buon_fwalzv.jpg", // Todo: thêm link ảnh khi chưa hoàn thành panel 4 và 5 mà đã ghép ending
    // Merchant thiếu điều kiện / lỗi chợ chung
    merchantAngry: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773208403/tnboiroi_f6z3ey.jpg",
    // Thợ dệt lạc vào chợ đơn độc
    weaverLost: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773219458/tdkh_r2zo6g.jpg",
    // Thợ dệt và thương nhân cùng bối rối
    weaverAndMerchantConfused: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773413458/tntd_mtrvfq.jpg", // Placeholder link, please update
  },
};

// ==========================================
// 2. TYPES
// ==========================================
type CharacterId =
  | "weaver"
  | "merchant"
  | "concrete_labor"
  | "abstract_labor"
  | "use_value"
  | "value";

interface PanelCharacter {
  id: CharacterId;
  stateImg: string;
}

interface PanelState {
  sceneId: string | null;
  sceneBg: string | null;
  characters: PanelCharacter[];
  isLocked: boolean;
}

// ==========================================
// 3. HELPERS
// ==========================================
/** Lấy ảnh idle mặc định cho nhân vật — dùng làm stateImg khởi tạo */
function getIdleImg(id: CharacterId): string {
  if (id === "weaver") return CHAR_STATES.weaver.idle;
  if (id === "merchant") return CHAR_STATES.merchant.idle;
  return CHAPTER_2_ASSETS.characters.find((c) => c.id === id)?.icon ?? "";
}

/**
 * Chọn ảnh composite dựa trên scene + stateMap của panel.
 * Trả về null nếu chưa có nhân vật hoặc không khớp case nào.
 */
function getCompositeImg(
  panel: PanelState,
  stateMap: Record<CharacterId, string>,
): string | null {
  if (!panel.sceneId || panel.characters.length === 0) return null;

  const chars = panel.characters.map((c) => c.id);
  const scene = panel.sceneId;

  // ══════════════════════════════════════════
  // XƯỞNG DỆT
  // ══════════════════════════════════════════
  if (scene === "loom") {
    // Thương nhân lạc vào xưởng → merchantLost (dù có hay không có weaver)
    if (chars.includes("merchant")) return COMPOSITE_BG.loom.merchantLost;

    // Không có weaver, chỉ có khái niệm lơ lửng → không render composite
    if (!chars.includes("weaver")) return null;

    const ws = stateMap["weaver"];
    if (ws === CHAR_STATES.weaver.working) return COMPOSITE_BG.loom.weaverWorking;
    if (ws === CHAR_STATES.weaver.tired) return COMPOSITE_BG.loom.weaverTired;
    if (ws === CHAR_STATES.weaver.idle) return COMPOSITE_BG.loom.weaverIdle;
    // confused: thiếu điều kiện / kết hợp sai / khái niệm chợ lạc vào
    if (ws === CHAR_STATES.weaver.confused) return COMPOSITE_BG.loom.weaverConfused;
    return COMPOSITE_BG.loom.weaverIdle; // fallback
  }

  // ══════════════════════════════════════════
  // CÁI CHỢ
  // ══════════════════════════════════════════
  if (scene === "market") {
    // WIN: weaver + merchant + use_value + value
    if (
      chars.includes("weaver") &&
      chars.includes("merchant") &&
      chars.includes("use_value") &&
      chars.includes("value")
    ) {
      if (
        stateMap["weaver"] === CHAR_STATES.weaver.happy &&
        stateMap["merchant"] === CHAR_STATES.merchant.happy
      ) {
        return COMPOSITE_BG.market.tradeComplete;
      } else {
        return COMPOSITE_BG.market.tradeMissingConditions;
      }
    }

    // Thợ dệt đơn độc ở chợ (không merchant) - có hoặc không có khái niệm
    if (
      chars.includes("weaver") &&
      !chars.includes("merchant")
    ) return COMPOSITE_BG.market.weaverLost;

    // Cả thợ dệt và thương nhân cùng bối rối ở chợ
    if (
      chars.includes("weaver") &&
      chars.includes("merchant") &&
      stateMap["merchant"] === CHAR_STATES.merchant.confused &&
      stateMap["weaver"] === CHAR_STATES.weaver.confused
    ) return COMPOSITE_BG.market.weaverAndMerchantConfused;

    // Lao động bị kéo vào chợ → merchantAngry
    if (chars.includes("concrete_labor") || chars.includes("abstract_labor"))
      return COMPOSITE_BG.market.merchantAngry;

    // Happy path use_value: merchant idle (đủ điều kiện)
    if (
      chars.includes("merchant") &&
      chars.includes("use_value") && !chars.includes("value") &&
      stateMap["merchant"] === CHAR_STATES.merchant.idle
    ) return COMPOSITE_BG.market.merchantUseValue;

    // Happy path value: merchant idle (đủ điều kiện)
    if (
      chars.includes("merchant") &&
      chars.includes("value") && !chars.includes("use_value") &&
      stateMap["merchant"] === CHAR_STATES.merchant.idle
    ) return COMPOSITE_BG.market.merchantValue;

    // Merchant angry: thiếu điều kiện hoặc confused → gộp chung merchantAngry
    if (
      stateMap["merchant"] === CHAR_STATES.merchant.angry ||
      stateMap["merchant"] === CHAR_STATES.merchant.confused
    ) return COMPOSITE_BG.market.merchantAngry;

    // Merchant idle thuần (chưa có gì)
    if (chars.includes("merchant")) return COMPOSITE_BG.market.merchantIdle;
  }

  return null;
}

// ==========================================
// 4. LOGIC TÍNH TOÁN (TÁCH KHỎI RENDER)
// ==========================================
/**
 * Tính toán outcome + stateImg cho từng panel dựa trên panels hiện tại.
 *
 * Flow 6 panel chuẩn:
 *   Panel 1 — loom + weaver                          → Thợ dệt vào xưởng
 *   Panel 2 — loom + weaver + concrete_labor         → hasConcreteLabor
 *   Panel 3 — loom + weaver + abstract_labor         → hasAbstractLabor (cần Panel 2 trước)
 *   Panel 4 — market + merchant + use_value          → hasUseValue (cần Panel 2 trước)
 *   Panel 5 — market + merchant + value              → hasValue (cần Panel 3 trước)
 *   Panel 6 — market + weaver + merchant + use_value + value → WIN (cần Panel 4+5 trước)
 */
function computePanels(panels: PanelState[]): {
  outcomes: (string | null)[];
  charStatesByPanel: Record<number, Record<CharacterId, string>>;
  isVictory: boolean;
} {
  const outcomes: (string | null)[] = Array(6).fill(null);
  const charStatesByPanel: Record<number, Record<CharacterId, string>> = {};

  let hasConcreteLabor = false;
  let hasAbstractLabor = false;
  let hasUseValue = false;
  let hasValue = false;
  let isVictory = false;

  for (let i = 0; i < 6; i++) {
    const panel = panels[i];
    if (panel.isLocked || !panel.sceneId) break;

    const scene = panel.sceneId;
    const chars = panel.characters.map((c) => c.id);
    const hasWeaver = chars.includes("weaver");
    const hasMerchant = chars.includes("merchant");
    const hasConcreteInPanel = chars.includes("concrete_labor");
    const hasAbstractInPanel = chars.includes("abstract_labor");
    const hasUseValueInPanel = chars.includes("use_value");
    const hasValueInPanel = chars.includes("value");

    // Khởi tạo stateImg mặc định
    const stateMap: Record<CharacterId, string> = {} as Record<CharacterId, string>;
    for (const c of panel.characters) {
      stateMap[c.id] = getIdleImg(c.id);
    }

    // ══════════════════════════════════════════
    // XƯỞNG DỆT
    // ══════════════════════════════════════════
    if (scene === "loom") {

      // Khái niệm thuộc chợ bị kéo vào xưởng
      if (hasUseValueInPanel || hasValueInPanel) {
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Giá trị và Giá trị sử dụng thuộc về Cái Chợ, không phải Xưởng Dệt!";

        // Thương nhân lạc vào xưởng
      } else if (hasMerchant) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        outcomes[i] = "Thương nhân: 'Tôi không biết dệt vải!'";

        // Lao động không có thợ
      } else if (!hasWeaver && (hasConcreteInPanel || hasAbstractInPanel)) {
        outcomes[i] = "Lao động cần có Thợ Dệt thực hiện!";

        // Cả concrete lẫn abstract cùng 1 panel
      } else if (hasWeaver && hasConcreteInPanel && hasAbstractInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Hãy tách riêng: đặt 'Lao Động Cụ Thể' và 'Lao Động Trừu Tượng' ở 2 panel khác nhau!";

        // Panel 1: chỉ có Thợ Dệt
      } else if (hasWeaver && !hasConcreteInPanel && !hasAbstractInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.idle;
        outcomes[i] = "Thợ dệt vào xưởng, sẵn sàng làm việc!";

        // Panel 2: Thợ Dệt + Lao Động Cụ Thể
      } else if (hasWeaver && hasConcreteInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.working;
        hasConcreteLabor = true;
        outcomes[i] = "Lao động cụ thể: hành động dệt tạo ra chiếc áo !";

        // Panel 3: Thợ Dệt + Lao Động Trừu Tượng
      } else if (hasWeaver && hasAbstractInPanel) {
        if (hasConcreteLabor) {
          stateMap["weaver"] = CHAR_STATES.weaver.tired;
          hasAbstractLabor = true;
          outcomes[i] = "Lao động trừu tượng: sức lực hao phí kết tinh thành Giá Trị!";
        } else {
          stateMap["weaver"] = CHAR_STATES.weaver.confused;
          outcomes[i] = "Chưa có lao động cụ thể! Hãy đặt 'Lao Động Cụ Thể' ở bước trước.";
        }

        // Fallback xưởng
      } else {
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Kết hợp này không hợp lệ trong Xưởng Dệt.";
      }
    }

    // ══════════════════════════════════════════
    // CÁI CHỢ
    // ══════════════════════════════════════════
    if (scene === "market") {

      // Lao động bị kéo vào chợ
      if (hasConcreteInPanel || hasAbstractInPanel) {
        if (hasMerchant) stateMap["merchant"] = CHAR_STATES.merchant.confused;
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Hành động lao động xảy ra ở Xưởng Dệt, không phải Cái Chợ!";

        // Thợ dệt đơn độc ở chợ (không có merchant, không có khái niệm)
      } else if (hasWeaver && !hasMerchant && !hasUseValueInPanel && !hasValueInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Thợ dệt: 'Tôi không bán hàng được!'";

        // Thương nhân và Thợ dệt cùng ở chợ nhưng chưa có hàng hóa
      } else if (hasWeaver && hasMerchant && !hasUseValueInPanel && !hasValueInPanel) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Thương nhân và Thợ dệt: 'Chuyện gì đây?'";

        // Panel 6: WIN — weaver + merchant + use_value + value
      } else if (hasWeaver && hasMerchant && hasUseValueInPanel && hasValueInPanel) {
        if (hasUseValue && hasValue) {
          stateMap["weaver"] = CHAR_STATES.weaver.happy;
          stateMap["merchant"] = CHAR_STATES.merchant.happy;
          outcomes[i] = "HÀNG HÓA HOÀN CHỈNH! Có cả Giá trị lẫn Giá trị sử dụng!";
          isVictory = true;
        } else {
          stateMap["weaver"] = CHAR_STATES.weaver.confused;
          stateMap["merchant"] = CHAR_STATES.merchant.angry;
          const missing: string[] = [];
          if (!hasUseValue) missing.push("Giá Trị Sử Dụng (Panel 4)");
          if (!hasValue) missing.push("Giá Trị (Panel 5)");
          outcomes[i] = `Chưa đủ điều kiện! Còn thiếu: ${missing.join(", ")}`;
        }

        // use_value + value cùng panel nhưng thiếu weaver (hoặc merchant)
      } else if (hasUseValueInPanel && hasValueInPanel && (!hasWeaver || !hasMerchant)) {
        if (hasMerchant) stateMap["merchant"] = CHAR_STATES.merchant.confused;
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        const missingWho = !hasWeaver ? "Thợ Dệt" : "Thương Nhân";
        outcomes[i] = `Cần thêm ${missingWho} để hoàn tất giao dịch!`;

        // Cả weaver và merchant nhưng thiếu 1 trong 2 khái niệm (use_value hoặc value)
      } else if (hasWeaver && hasMerchant && (!hasUseValueInPanel || !hasValueInPanel)) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        const missingWhich = !hasUseValueInPanel ? "Giá Trị Sử Dụng" : "Giá Trị";
        outcomes[i] = `Đã có người mua bán nhưng còn thiếu ${missingWhich}!`;

        // Panel 4: Thương Nhân + Giá Trị Sử Dụng (không có value, không có weaver)
      } else if (hasMerchant && hasUseValueInPanel && !hasValueInPanel && !hasWeaver) {
        if (hasConcreteLabor) {
          stateMap["merchant"] = CHAR_STATES.merchant.idle;
          hasUseValue = true;
          outcomes[i] = "Giá trị sử dụng: chiếc áo giữ ấm — do lao động cụ thể tạo ra!";
        } else {
          stateMap["merchant"] = CHAR_STATES.merchant.angry;
          outcomes[i] = "Thương nhân: 'Áo này dùng để làm gì? Chưa ai dệt!' (Cần 'Lao Động Cụ Thể' ở xưởng trước)";
        }

        // Panel 5: Thương Nhân + Giá Trị (không có use_value, không có weaver)
      } else if (hasMerchant && hasValueInPanel && !hasUseValueInPanel && !hasWeaver) {
        if (hasAbstractLabor) {
          stateMap["merchant"] = CHAR_STATES.merchant.idle;
          hasValue = true;
          outcomes[i] = "Giá trị: thời gian lao động hao phí kết tinh trong chiếc áo!";
        } else {
          stateMap["merchant"] = CHAR_STATES.merchant.angry;
          outcomes[i] = "Thương nhân: 'Áo này đáng giá bao nhiêu? Chưa rõ sức lao động!' (Cần 'Lao Động Trừu Tượng' ở xưởng trước)";
        }

        // Chỉ có merchant, không có gì để bán
      } else if (hasMerchant && !hasUseValueInPanel && !hasValueInPanel) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        outcomes[i] = "Thương nhân: 'Mua bán cái gì đây?'";

        // Fallback chợ
      } else {
        if (hasMerchant) stateMap["merchant"] = CHAR_STATES.merchant.confused;
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Kết hợp này không hợp lệ tại Cái Chợ.";
      }
    }

    // Panel chỉ có scene, chưa có nhân vật
    if (panel.characters.length === 0) {
      outcomes[i] = scene === "loom"
        ? "Kéo Thợ Dệt vào Xưởng Dệt!"
        : "Kéo Thương Nhân và khái niệm vào Cái Chợ!";
    }

    charStatesByPanel[i] = stateMap;
  }

  return { outcomes, charStatesByPanel, isVictory };
}

// ==========================================
// 5. COMPONENT CHÍNH
// ==========================================
export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = 2; // FIX: Hardcode chapter ID to 2 because useParams() returns NaN for static routes

  const [panels, setPanels] = useState<PanelState[]>(
    Array(6).fill(null).map((_, i) => ({
      sceneId: null,
      sceneBg: null,
      characters: [],
      isLocked: i !== 0,
    }))
  );

  const [isWin, setIsWin] = useState(false);

  // ==========================================
  // 6. DERIVED STATE
  // ==========================================
  const { outcomes, charStatesByPanel, isVictory } = useMemo(
    () => computePanels(panels),
    [panels]
  );

  // FIX: dùng useRef thật sự để tránh gọi lại vô hạn lần
  const winHandledRef = useRef(false);
  if (isVictory && !isWin && !winHandledRef.current) {
    winHandledRef.current = true;
    setIsWin(true);
    new Audio("/sounds/win.wav").play().catch(() => { });
    try {
      const saved = localStorage.getItem("completedChapters");
      const list: number[] = saved ? JSON.parse(saved) : [];
      if (!list.includes(chapterId)) {
        list.push(chapterId);
        localStorage.setItem("completedChapters", JSON.stringify(list));
      }
    } catch (_) { }
  }

  // ==========================================
  // 7. UNLOCK LOGIC
  // ==========================================
  function recalcLocks(draft: PanelState[]): PanelState[] {
    let firstEmpty = 6;
    for (let i = 0; i < 6; i++) {
      if (!draft[i].sceneId) { firstEmpty = i; break; }
    }
    return draft.map((p, i) => ({
      ...p,
      isLocked: i > firstEmpty,
    }));
  }

  // ==========================================
  // 8. DRAG & DROP
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
    const id = e.dataTransfer.getData("id") as CharacterId;
    const bg = e.dataTransfer.getData("bgOrIcon");

    setPanels((prev) => {
      const draft = prev.map((p) => ({ ...p, characters: [...p.characters] }));
      const target = draft[panelIndex];

      if (type === "scene") {
        target.sceneId = id;
        target.sceneBg = bg;
        target.characters = [];
        if (panelIndex + 1 < 6) {
          draft[panelIndex + 1] = { ...draft[panelIndex + 1], isLocked: false };
        }
      } else if (type === "character") {
        if (!target.sceneId) return prev;

        // Xử lý riêng cho xưởng dệt: thả Thương Nhân vào đẩy Thợ Dệt ra, và ngược lại.
        if (target.sceneId === "loom") {
          if (id === "merchant") {
            target.characters = target.characters.filter((c) => c.id !== "weaver");
          } else if (id === "weaver") {
            target.characters = target.characters.filter((c) => c.id !== "merchant");
          }
        }

        if (
          target.characters.length < 4 &&
          !target.characters.find((c) => c.id === id)
        ) {
          target.characters.push({ id, stateImg: getIdleImg(id) });
        }
      }

      return recalcLocks(draft);
    });
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const clearPanel = (index: number) => {
    setPanels((prev) => {
      const draft = prev.map((p) => ({ ...p, characters: [...p.characters] }));
      for (let i = index; i < 6; i++) {
        draft[i] = {
          sceneId: null,
          sceneBg: null,
          characters: [],
          isLocked: i !== 0 && i !== index,
        };
      }
      draft[index].isLocked = index !== 0 && !draft[index - 1]?.sceneId;
      return draft;
    });
  };

  // ==========================================
  // 9. RENDER
  // ==========================================
  return (
    <div className="flex-1 flex flex-col relative z-10 w-full h-full">
      {/* TIÊU ĐỀ */}
      <div className="flex items-center justify-center pt-8 pb-2">
        <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide">
          Chương 2: Bí mật bên trong một chiếc áo len là gì?
        </h2>
      </div>

      {/* PANELS GRID */}
      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, i) => {
            const outcome = outcomes[i];
            const stateMap = charStatesByPanel[i] ?? {};
            const isSuccess = outcome === "HÀNG HÓA HOÀN CHỈNH! Có cả Giá trị lẫn Giá trị sử dụng!";
            const compositeImg = getCompositeImg(panel, stateMap);

            return (
              <div
                key={i}
                onDrop={(e) => handleDropToPanel(e, i)}
                onDragOver={handleDragOver}
                className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all
                  ${panel.isLocked
                    ? "border-gray-400 opacity-50 bg-gray-200/20"
                    : "border-[#a69279]"}
                  ${isSuccess
                    ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    : ""}`}
              >
                {/* LOCK OVERLAY */}
                {panel.isLocked && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">
                    🔒
                  </div>
                )}

                {/* NÚT XÓA */}
                {panel.sceneId && !panel.isLocked && (
                  <button
                    onClick={() => clearPanel(i)}
                    className="absolute top-1 right-2 text-red-700/60 hover:text-red-800 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    X
                  </button>
                )}

                {/* BACKGROUND — hiện khi chưa có composite (scene trống chưa có nhân vật) */}
                {panel.sceneBg && !compositeImg && (
                  <img
                    src={panel.sceneBg}
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}

                {/* COMPOSITE — chuyển ảnh mượt khi trạng thái thay đổi */}
                {compositeImg && (
                  <motion.img
                    key={compositeImg}
                    src={compositeImg}
                    alt="scene"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}

                {/* SỐ THỨ TỰ PANEL */}
                {!panel.sceneId && !panel.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-[#a69279] text-5xl font-serif opacity-30 select-none">
                      {i + 1}
                    </span>
                  </div>
                )}

                {/* OUTCOME TEXT */}
                {outcome && (
                  <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 py-1 px-2 min-h-[32px]">
                    <span className={`text-sm font-medium tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,1)] text-center leading-tight
                      ${isSuccess ? "text-green-300" : "text-white"}`}>
                      {outcome}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KHAY ĐỒ NGHỀ */}
      <div
        className="h-[140px] mt-2 mx-4 sm:mx-12 border-t-[3px] border-double border-[#c2a878]/60 flex items-start pt-6 justify-start sm:justify-center gap-4 sm:gap-6 bg-white/10 rounded-t-2xl overflow-x-auto px-4"
        onDragOver={handleDragOver}
      >
        {/* SCENES */}
        {CHAPTER_2_ASSETS.scenes.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
            className="flex flex-col items-center flex-shrink-0 cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src={asset.icon} alt={asset.label} className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-sm text-center leading-tight max-w-[72px]">
              {asset.label}
            </span>
          </div>
        ))}

        <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-2 mt-2" />

        {/* CHARACTERS */}
        {CHAPTER_2_ASSETS.characters.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "character", asset.id, asset.icon)}
            className="flex flex-col items-center flex-shrink-0 cursor-grab hover:scale-110 active:cursor-grabbing"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src={asset.icon} alt={asset.label} className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-xs text-center leading-tight max-w-[64px]">
              {asset.label}
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
            <CheckCircle2 size={80} className="text-green-400 mb-4 animate-pulse" />
            <h2 className="text-4xl font-serif text-amber-400 font-bold mb-4">
              Hoàn thành xuất sắc!
            </h2>
            <p className="text-white/80 text-lg font-serif max-w-md leading-relaxed">
              Hàng hóa luôn có{" "}
              <span className="text-amber-300 font-bold">2 thuộc tính</span>:{" "}
              <span className="text-amber-300 font-bold">Giá trị sử dụng</span> và{" "}
              <span className="text-amber-300 font-bold">Giá trị</span> — do tính chất
              hai mặt của lao động sản xuất hàng hóa quyết định.
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