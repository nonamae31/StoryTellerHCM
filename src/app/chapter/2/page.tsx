/* eslint-disable react-hooks/static-components */
"use client";
import { useState, useMemo, useEffect, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// ==========================================
// 1. DATA ASSETS CHO CHƯƠNG 2
// ==========================================
const CHAPTER_2_ASSETS = {
  scenes: [
    {
      id: "loom",
      label: "Bến Nhà Rồng",
      icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780587194/bennharong_q79ucf.png",
      bg: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780587194/bennharong_q79ucf.png",
    },
    {
      id: "market",
      label: "Hội nghị Vécxây",
      icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780587194/hoinghivecxay_gzaszq.png",
      bg: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780587194/hoinghivecxay_gzaszq.png",
    },
  ],
  characters: [
    { id: "weaver", label: "Nguyễn Tất Thành", icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780671533/aac469f2-390c-4da5-bd1a-6742f05eb5e6_ssjpg6.png" },
    { id: "merchant", label: "Chủ nghĩa đế quốc", icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780671534/fed207a3-d090-4a9a-9e62-c1b90ea2bd5a_ikpbt1.png" },
    { id: "concrete_labor", label: "Khảo sát thực tiễn", icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780671773/79f5b95f-f0a2-435e-af5a-381e4ab690cf_jfnaq4.png" },
    { id: "abstract_labor", label: "Luận cương Lênin", icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780671997/a37f0a86-0f7d-4e4d-88ed-bb2b15b82ff0_ix9zmw.png" },
    { id: "use_value", label: "Yêu sách nhân dân", icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780672153/804089ab-b893-4de1-b750-505dd2aad869_qav8hf.png" },
    { id: "value", label: "Đường cách mạng vô sản", icon: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780672272/e3b4ca09-f141-4895-b117-5999e81634e9_spsziu.png" },
  ],
};

const CHAR_STATES = {
  weaver: {
    idle: "https://res.cloudinary.com/dcjcoyu2d/image/upload/v1773134691/Gemini_Generated_Image_bwcghobwcghobwcg_yy63mz.png",
    working: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780672678/64c9bfaa-1859-4b1c-bc1c-1d9c84254472_mtpnsp.png",
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
    weaverIdle: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780672678/64c9bfaa-1859-4b1c-bc1c-1d9c84254472_mtpnsp.png",
    weaverWorking: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780671773/79f5b95f-f0a2-435e-af5a-381e4ab690cf_jfnaq4.png",
    weaverTired: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780673151/bad8239d-c53b-496d-903d-c39fe40df8dc_sklwmd.png",
    // Lỗi ở xưởng: weaver confused (thiếu điều kiện, kết hợp sai, khái niệm chợ lạc vào)
    weaverConfused: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780673546/af0316e7-8633-4363-8f36-77c91a3365ce_ac0cdn.png",
    // Thương nhân lạc vào xưởng
    merchantLost: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780674054/7d65c963-2cd3-4251-9288-476a2371e647_wenqjl.png",
  },
  market: {
    merchantIdle: "/BookImage/Story2/Scene_MerchantIdle.png",
    merchantUseValue: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780674899/a5c614c1-6d34-4128-ab49-d7ac83f3f38a_bzozul.png",
    merchantValue: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780676058/a0e95bb9-a8a8-433e-9fa4-7fe24540d23e_hmyv1l.png",
    tradeComplete: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780676267/bfa6ab78-a8ad-4ff4-b9a9-5fad48077d4c_tbebqy.png",
    tradeMissingConditions: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780676367/c1c6892e-4398-480f-945c-3d03d2fb5708_g7qeyx.png", // Todo: thêm link ảnh khi chưa hoàn thành panel 4 và 5 mà đã ghép ending
    // Merchant thiếu điều kiện / lỗi chợ chung
    merchantAngry: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780675372/b2d6b3ae-5171-42de-b61c-39ee2604c204_dmrgkk.png",
    // Thợ dệt lạc vào chợ đơn độc
    weaverLost: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780675590/399b93ad-cfa1-465b-94a9-6a62c9d152e7_lk3qi2.png",
    // Thợ dệt và thương nhân cùng bối rối
    weaverAndMerchantConfused: "https://res.cloudinary.com/dfp5ackxp/image/upload/v1780674444/f2baddee-78f1-47f7-ba13-c8d8fad36767_tdjlun.png", // Placeholder link, please update
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
        outcomes[i] = "Yêu sách và đường lối cách mạng chưa thể đặt tại Bến Nhà Rồng. Hãy đi ra thế giới tìm chân lý.";

        // Chủ nghĩa đế quốc lạc vào Bến Nhà Rồng
      } else if (hasMerchant) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        outcomes[i] = "Chủ nghĩa đế quốc không thuộc Bến Nhà Rồng. Nguyễn Tất Thành cần tiếp tục hành trình.";

        // Lao động không có thợ
      } else if (!hasWeaver && (hasConcreteInPanel || hasAbstractInPanel)) {
        outcomes[i] = "Hành trình phải có Nguyễn Tất Thành thực hiện!";

        // Cả concrete lẫn abstract cùng 1 panel
      } else if (hasWeaver && hasConcreteInPanel && hasAbstractInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Khảo sát thực tiễn và Luận cương Lênin phải được đặt ở hai giai đoạn khác nhau của hành trình.";

        // Panel 1: chỉ có Thợ Dệt
      } else if (hasWeaver && !hasConcreteInPanel && !hasAbstractInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.idle;
        outcomes[i] = "Nguyễn Tất Thành rời Bến Nhà Rồng năm 1911.";

        // Panel 2: Thợ Dệt + Lao Động Cụ Thể
      } else if (hasWeaver && hasConcreteInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.working;
        hasConcreteLabor = true;
        outcomes[i] = "Làm việc trên tàu và khảo sát thực tiễn ở Pháp, Anh, Mỹ và châu Phi.";

        // Panel 3: Thợ Dệt + Lao Động Trừu Tượng
      } else if (hasWeaver && hasAbstractInPanel) {
        if (hasConcreteLabor) {
          stateMap["weaver"] = CHAR_STATES.weaver.tired;
          hasAbstractLabor = true;
          outcomes[i] = "Đọc Luận cương của Lênin và tìm ra con đường cách mạng vô sản.";
        } else {
          stateMap["weaver"] = CHAR_STATES.weaver.confused;
          outcomes[i] = "Cần khảo sát thực tiễn trước khi tiếp cận Luận cương Lênin.";
        }

        // Fallback xưởng
      } else {
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Kết hợp này không hợp lệ tại Bến Nhà Rồng.";
      }
    }

    // ══════════════════════════════════════════
    // CÁI CHỢ
    // ══════════════════════════════════════════
    if (scene === "market") {

      // Khảo sát / Luận cương bị kéo vào Hội nghị Vécxây sai chỗ
      if (hasConcreteInPanel || hasAbstractInPanel) {
        if (hasMerchant) stateMap["merchant"] = CHAR_STATES.merchant.confused;
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
       outcomes[i] ="Hãy sắp xếp đúng trình tự lịch sử: Khảo sát thực tiễn trước, Luận cương Lênin sau.";
        // Nguyễn Tất Thành đơn độc ở Hội nghị nhưng chưa có yêu sách hay đường lối
      } else if (hasWeaver && !hasMerchant && !hasUseValueInPanel && !hasValueInPanel) {
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Nguyễn Tất Thành tại Hội nghị mà chưa mang theo Yêu sách hay đường lối.";

        // Thương nhân và Thợ dệt cùng ở chợ nhưng chưa có hàng hóa
      } else if (hasWeaver && hasMerchant && !hasUseValueInPanel && !hasValueInPanel) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Chủ nghĩa đế quốc và Nguyễn Tất Thành chưa gặp được yêu sách hay con đường vô sản.";

        // Panel 6: WIN — weaver + merchant + use_value + value
      } else if (hasWeaver && hasMerchant && hasUseValueInPanel && hasValueInPanel) {
        if (hasUseValue && hasValue) {
          stateMap["weaver"] = CHAR_STATES.weaver.happy;
          stateMap["merchant"] = CHAR_STATES.merchant.happy;
          outcomes[i] = "Nguyễn Tất Thành tham gia Đại hội Tua 1920 và trở thành người cộng sản Việt Nam đầu tiên.";
          isVictory = true;
        } else {
          stateMap["weaver"] = CHAR_STATES.weaver.confused;
          stateMap["merchant"] = CHAR_STATES.merchant.angry;
          const missing: string[] = [];
          if (!hasUseValue) missing.push("Yêu sách nhân dân (Panel 4)");
          if (!hasValue) missing.push("Đường cách mạng vô sản (Panel 5)");
          outcomes[i] = `Chưa đủ điều kiện! Còn thiếu: ${missing.join(", ")}`;
        }

        // use_value + value cùng panel nhưng thiếu weaver (hoặc merchant)
      } else if (hasUseValueInPanel && hasValueInPanel && (!hasWeaver || !hasMerchant)) {
        if (hasMerchant) stateMap["merchant"] = CHAR_STATES.merchant.confused;
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        const missingWho = !hasWeaver ? "Nguyễn Tất Thành" : "Hội nghị";
        outcomes[i] = `Cần thêm ${missingWho} để hoàn thành hành trình lịch sử!`;

        // Cả weaver và merchant nhưng thiếu 1 trong 2 khái niệm (use_value hoặc value)
      } else if (hasWeaver && hasMerchant && (!hasUseValueInPanel || !hasValueInPanel)) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        stateMap["weaver"] = CHAR_STATES.weaver.confused;
        const missingWhich = !hasUseValueInPanel ? "Yêu sách nhân dân" : "Đường cách mạng vô sản";
        outcomes[i] = `Rồi, nhưng còn thiếu ${missingWhich}!`;

        // Panel 4: Thương Nhân + Giá Trị Sử Dụng (không có value, không có weaver)
      } else if (hasMerchant && hasUseValueInPanel && !hasValueInPanel && !hasWeaver) {
        if (hasConcreteLabor) {
          stateMap["merchant"] = CHAR_STATES.merchant.idle;
          hasUseValue = true;
          outcomes[i] = "Yêu sách nhân dân An Nam được gửi tới Hội nghị Vécxây năm 1919.";
        } else {
          stateMap["merchant"] = CHAR_STATES.merchant.angry;
          outcomes[i] = "Hội nghị chưa nhận được yêu sách đúng nghĩa — cần khảo sát thực tiễn trước.";
        }

        // Panel 5: Thương Nhân + Giá Trị (không có use_value, không có weaver)
      } else if (hasMerchant && hasValueInPanel && !hasUseValueInPanel && !hasWeaver) {
        if (hasAbstractLabor) {
          stateMap["merchant"] = CHAR_STATES.merchant.idle;
          hasValue = true;
          outcomes[i] = "Con đường cách mạng vô sản được xác định sau khi đọc Luận cương Lênin.";
        } else {
          stateMap["merchant"] = CHAR_STATES.merchant.angry;
          outcomes[i] = "Hội nghị còn thiếu đường lối vô sản rõ ràng — cần Luận cương Lênin trước.";
        }

        // Chỉ có merchant, không có gì để bán
      } else if (hasMerchant && !hasUseValueInPanel && !hasValueInPanel) {
        stateMap["merchant"] = CHAR_STATES.merchant.confused;
        outcomes[i] = "Chủ nghĩa đế quốc lạc lối khi chưa đối diện với yêu sách và đường lối cách mạng.";

        // Fallback chợ
      } else {
        if (hasMerchant) stateMap["merchant"] = CHAR_STATES.merchant.confused;
        if (hasWeaver) stateMap["weaver"] = CHAR_STATES.weaver.confused;
        outcomes[i] = "Hội nghị Vécxây cần cả Yêu sách nhân dân và Đường cách mạng vô sản.";
      }
    }

    // Panel chỉ có scene, chưa có nhân vật
   if (panel.characters.length === 0) {
  outcomes[i] =
    scene === "loom"
      ? "Kéo Nguyễn Tất Thành vào Bến Nhà Rồng!"
      : "Kéo Chủ nghĩa đế quốc, Yêu sách nhân dân hoặc Đường cách mạng vô sản vào Hội nghị Vécxây!";
}

charStatesByPanel[i] = stateMap;
  }

  return { outcomes, charStatesByPanel, isVictory };
}

// ==========================================
// 5. COMPONENT CHÍNH
// ==========================================
export default function ChapterPage() {
  const router = useRouter();
  const chapterId = 2;

  const [panels, setPanels] = useState<PanelState[]>(
    Array(6).fill(null).map((_, i) => ({
      sceneId: null,
      sceneBg: null,
      characters: [],
      isLocked: i !== 0,
    }))
  );

  // ==========================================
  // 6. DERIVED STATE
  // ==========================================
  const { outcomes, charStatesByPanel, isVictory } = useMemo(
    () => computePanels(panels),
    [panels]
  );

  useEffect(() => {
    if (!isVictory) return;

    new Audio("/sounds/win.wav")
      .play()
      .catch(() => {});

    try {
      const saved = localStorage.getItem("completedChapters");
      const list = saved ? JSON.parse(saved) : [];

      if (!list.includes(chapterId)) {
        list.push(chapterId);
        localStorage.setItem(
          "completedChapters",
          JSON.stringify(list)
        );
      }
    } catch {}
  }, [isVictory, chapterId]);

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
    e: DragEvent<HTMLDivElement>,
    type: string,
    id: string,
    bgOrIcon: string,
  ) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("bgOrIcon", bgOrIcon);
  };

  const handleDropToPanel = (e: DragEvent<HTMLDivElement>, panelIndex: number) => {
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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDropToBin = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
          Chương 2: Vượt trùng dương và Tìm thấy ánh sáng (1911-1920)
        </h2>
      </div>
     

      {/* PANELS GRID */}
      <div className="flex-1 px-16 pt-2 pb-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
          {panels.map((panel, i) => {
            const outcome = outcomes[i];
            const stateMap = charStatesByPanel[i] ?? {};
            const isSuccess = outcome === "Nguyễn Tất Thành tham gia Đại hội Tua 1920 và trở thành người cộng sản Việt Nam đầu tiên.";
            const compositeImg = getCompositeImg(panel, stateMap);

            return (
              <div
                key={i}
                onDrop={(e) => handleDropToPanel(e, i)}
                onDragOver={handleDragOver}
                className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${panel.isLocked ? "border-gray-400 opacity-50 bg-gray-200/20" : "border-[#a69279]"} ${isSuccess ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""}`}
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
                  <img
                    src={panel.sceneBg}
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}

                {compositeImg && (
                  <motion.img
                    key={compositeImg}
                    src={compositeImg}
                    alt="scene"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover object-center z-0"
                  />
                )}

                <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 px-4 pointer-events-none">
                  <div className="flex h-[75%] gap-2 w-full justify-center">
                    {panel.characters.map((char) => (
                     <motion.div
                      key={char.id}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="h-full relative pointer-events-auto overflow-hidden"
>
                       
                      </motion.div>
                    ))}
                  </div>
                </div>

                {!panel.sceneId && !panel.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-[#a69279] text-5xl font-serif opacity-30 select-none">
                      {i + 1}
                    </span>
                  </div>
                )}

                {outcome && (
                  <div className="absolute bottom-0 w-full min-h-[44px] backdrop-blur-sm flex items-center justify-center px-2 py-1 z-20 bg-black/75">
                    <span className={`text-white text-[11px] leading-tight text-center font-medium drop-shadow-md ${isSuccess ? "text-green-300" : "text-white"}`}>
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
        className="h-[160px] mt-4 mx-12 px-4 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-start sm:justify-center gap-3 md:gap-5 bg-white/10 rounded-t-2xl overflow-x-auto"
        onDrop={handleDropToBin}
        onDragOver={handleDragOver}
      >
        {/* SCENES */}
        {CHAPTER_2_ASSETS.scenes.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "scene", asset.id, asset.bg)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src={asset.icon} alt={asset.label} className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight">
              {asset.label}
            </span>
          </div>
        ))}

        <div className="w-[2px] h-12 bg-[#c2a878]/40 mx-1 md:mx-2 flex-shrink-0" />

        {/* CHARACTERS */}
        {CHAPTER_2_ASSETS.characters.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => handleDragStart(e, "character", asset.id, asset.icon)}
            className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
              <img src={asset.icon} alt={asset.label} className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-[#5c4a3d] font-bold text-[10px] text-center max-w-[60px] leading-tight">
              {asset.label}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL THẮNG */}
      <AnimatePresence>
        {isVictory && (
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
              Nguyễn Tất Thành đã đi từ Bến Nhà Rồng đến Hội nghị Vécxây và Đại hội Tua,
              xác định kẻ thù chung, tiếp cận ánh sáng của chủ nghĩa Mác - Lênin,
              và trở thành người cộng sản Việt Nam đầu tiên.
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