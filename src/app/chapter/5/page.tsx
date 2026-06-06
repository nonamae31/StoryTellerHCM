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
  colonialFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780674481/ChatGPT_Image_Jun_5_2026_10_46_51_PM_1_evff0t.png",
  colonialEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780674489/ChatGPT_Image_Jun_5_2026_10_46_52_PM_2_lhbdzf.png",
  diplomacyEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590751/ChatGPT_Image_Jun_4_2026_11_24_59_PM_3_iyboqb.png",
  hoChiMinh: "/BookImage/Story5/ch5_hochiminh_cutout.png",
  diplomacyFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780590751/ChatGPT_Image_Jun_4_2026_11_25_16_PM_3_s1mefn.png",
  comrade: "/BookImage/Story5/ch5_comrade_cutout.png",
  principleEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780671985/ChatGPT_Image_Jun_5_2026_09_52_31_PM_kqtcb6.png",
  principleFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780671985/ChatGPT_Image_Jun_5_2026_09_52_31_PM_kqtcb6.png",
  appealEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780595982/ChatGPT_Image_Jun_5_2026_12_58_26_AM_2_pveige.png",
  appealFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780595974/ChatGPT_Image_Jun_5_2026_12_58_26_AM_1_xgfqep.png",
  testamentFull:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780596628/ChatGPT_Image_Jun_5_2026_01_10_14_AM_1_r5fkz7.png",
  testamentEmpty:
    "https://res.cloudinary.com/di7brya3o/image/upload/v1780596636/ChatGPT_Image_Jun_5_2026_01_10_14_AM_2_cuq1sa.png",
  hcmTantrao:
    "/BookImage/Story5/generated/ch5_hcm_tantrao.png",
  hcmBadinh:
    "/BookImage/Story5/generated/ch5_hcm_badinh.png",
  hcmPrinciple:
    "/BookImage/Story5/generated/ch5_hcm_principle.png",
  hcmDiplomacy:
    "/BookImage/Story5/generated/ch5_hcm_diplomacy.png",
  hcmAppeal:
    "/BookImage/Story5/generated/ch5_hcm_appeal.png",
  hcmTestament:
    "/BookImage/Story5/generated/ch5_hcm_testament.png",
  comradeTantrao:
    "/BookImage/Story5/generated/ch5_comrade_tantrao.png",
  comradeBadinh:
    "/BookImage/Story5/generated/ch5_comrade_badinh.png",
  comradePrinciple:
    "/BookImage/Story5/generated/ch5_comrade_principle.png",
  comradeDiplomacy:
    "/BookImage/Story5/generated/ch5_comrade_diplomacy.png",
  comradeAppeal:
    "/BookImage/Story5/generated/ch5_comrade_appeal.png",
  comradeTestament:
    "/BookImage/Story5/generated/ch5_comrade_testament.png",
  colonialSoldier:
    "https://res.cloudinary.com/di7brya3o/image/upload/e_make_transparent:20/v1780672001/ChatGPT_Image_Jun_5_2026_10_06_23_PM_1_k9hqnx.png",
  colonialGunner:
    "https://res.cloudinary.com/di7brya3o/image/upload/e_make_transparent:20/v1780672001/ChatGPT_Image_Jun_5_2026_10_06_24_PM_4_gr0hsi.png",
};

const WIN_AUDIO_URL =
  "https://res.cloudinary.com/do02twogb/video/upload/v1773104691/win_kx8hk4.wav";

type SceneId =
  | "tantrao"
  | "badinh"
  | "principle"
  | "diplomacy"
  | "battle"
  | "appeal"
  | "testament";
type CharacterId = "hochiminh" | "comrade" | "colonial" | "colonialGunner";
type ActionId = "time" | "declaration" | "freedom";

interface SceneAsset {
  id: SceneId;
  label: string;
  year: string;
  emptyImg: string;
  successImg: string;
  quoteText: string;
  characterImages: Partial<Record<CharacterId, string>>;
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

interface ScenarioFeedback {
  outcome: string | null;
  isHardError: boolean;
}

const SCENES: SceneAsset[] = [
  {
    id: "tantrao",
    label: "Tân Trào",
    year: "1945",
    emptyImg: IMAGE_URLS.tantraoEmpty,
    successImg: IMAGE_URLS.tantraoFull,
    quoteText: "Giờ quyết định cho vận mệnh dân tộc ta đã đến.",
    characterImages: {
      hochiminh: IMAGE_URLS.hcmTantrao,
      comrade: IMAGE_URLS.comradeTantrao,
    },
  },
  {
    id: "badinh",
    label: "Ba Đình",
    year: "2/9/1945",
    emptyImg: IMAGE_URLS.badinhEmpty,
    successImg: IMAGE_URLS.badinhFull,
    quoteText: "Nước Việt Nam có quyền hưởng tự do và độc lập.",
    characterImages: {
      hochiminh: IMAGE_URLS.hcmBadinh,
      comrade: IMAGE_URLS.comradeBadinh,
    },
  },
  {
    id: "principle",
    label: "Bất biến",
    year: "1946",
    emptyImg: IMAGE_URLS.principleEmpty,
    successImg: IMAGE_URLS.principleFull,
    quoteText: "Dĩ bất biến, ứng vạn biến.",
    characterImages: {
      hochiminh: IMAGE_URLS.hcmPrinciple,
      comrade: IMAGE_URLS.comradePrinciple,
    },
  },
  {
    id: "diplomacy",
    label: "Sức ép thực dân",
    year: "1946",
    emptyImg: IMAGE_URLS.diplomacyEmpty,
    successImg: IMAGE_URLS.diplomacyFull,
    quoteText: "Chúng ta muốn hoà bình, chúng ta phải nhân nhượng.",
    characterImages: {
      hochiminh: IMAGE_URLS.hcmDiplomacy,
      comrade: IMAGE_URLS.comradeDiplomacy,
      colonial: IMAGE_URLS.colonialSoldier,
      colonialGunner: IMAGE_URLS.colonialGunner,
    },
  },
  {
    id: "battle",
    label: "Chiến địa thực dân",
    year: "1946",
    emptyImg: IMAGE_URLS.colonialEmpty,
    successImg: IMAGE_URLS.colonialFull,
    quoteText: "Chiến trường trực diện đẩy câu chuyện ra khỏi thế sách lược.",
    characterImages: {
      colonial: IMAGE_URLS.colonialSoldier,
      colonialGunner: IMAGE_URLS.colonialGunner,
    },
  },
  {
    id: "appeal",
    label: "Lời kêu gọi",
    year: "1966",
    emptyImg: IMAGE_URLS.appealEmpty,
    successImg: IMAGE_URLS.appealFull,
    quoteText: "Không có gì quý hơn độc lập, tự do.",
    characterImages: {
      hochiminh: IMAGE_URLS.hcmAppeal,
      comrade: IMAGE_URLS.comradeAppeal,
    },
  },
  {
    id: "testament",
    label: "Di chúc",
    year: "1969",
    emptyImg: IMAGE_URLS.testamentEmpty,
    successImg: IMAGE_URLS.testamentFull,
    quoteText: "Toàn Đảng, toàn dân ta đoàn kết phấn đấu.",
    characterImages: {
      hochiminh: IMAGE_URLS.hcmTestament,
      comrade: IMAGE_URLS.comradeTestament,
    },
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
  {
    id: "colonial",
    label: "Thực dân",
    icon: IMAGE_URLS.colonialSoldier,
  },
  {
    id: "colonialGunner",
    label: "Lính thực dân",
    icon: IMAGE_URLS.colonialGunner,
  },
];

const ACTIONS: ActionAsset[] = [
  { id: "time", label: "Thời cơ", shortLabel: "TC" },
  { id: "declaration", label: "Tuyên ngôn", shortLabel: "TN" },
  { id: "freedom", label: "Độc lập tự do", shortLabel: "DL" },
];

const INVENTORY_SCENE_ORDER: SceneId[] = [
  "appeal",
  "battle",
  "badinh",
  "principle",
  "testament",
  "tantrao",
  "diplomacy",
];

const INVENTORY_CHARACTER_ORDER: CharacterId[] = [
  "colonialGunner",
  "comrade",
  "colonial",
  "hochiminh",
];

const INVENTORY_ACTION_ORDER: ActionId[] = [
  "freedom",
  "declaration",
  "time",
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

const WRONG_SCENE_PAIR_SCENARIOS: Record<
  SceneId,
  Partial<Record<SceneId, string>>
> = {
  tantrao: {
    badinh:
      "Lễ đài độc lập xuất hiện quá sớm; lời tổng khởi nghĩa chưa kịp mở đường cho ngày tuyên bố.",
    principle:
      "Bàn nguyên tắc làm nhịp khởi nghĩa chậm lại, trong khi thời cơ đang cần hành động quyết đoán.",
    diplomacy:
      "Khói súng thực dân kéo căn cứ Tân Trào thành chiến địa, làm mất không khí chuẩn bị lực lượng.",
    battle:
      "Chiến địa thực dân đẩy căn cứ chuẩn bị thành đối đầu vũ trang, làm mất nhịp chớp thời cơ.",
    appeal:
      "Khẩu hiệu năm 1966 vang lên sai thời đoạn, đẩy mạch 1945 sang một cao trào khác.",
    testament:
      "Không khí tổng kết cuối đời làm khoảnh khắc chuẩn bị Tổng khởi nghĩa lắng xuống quá sớm.",
  },
  badinh: {
    tantrao:
      "Căn cứ địa vẫn là nơi chuẩn bị, chưa tạo được không gian chính danh để khai sinh quốc gia.",
    principle:
      "Bàn ngoại giao làm lễ độc lập mất sức nặng trước quốc dân.",
    diplomacy:
      "Thế đối đầu quân sự lấn vào lễ đài, khiến khoảnh khắc tuyên bố chủ quyền biến thành chiến sự.",
    battle:
      "Khói súng và đội quân thực dân chen vào lễ đài, khiến ngày độc lập mất không gian chính danh.",
    appeal:
      "Âm hưởng kháng chiến về sau làm ngày 2/9 lệch khỏi thời khắc khai sinh nước mới.",
    testament:
      "Di sản cuối đời kéo buổi lễ độc lập thành lời tổng kết, sai nhịp lịch sử.",
  },
  principle: {
    tantrao:
      "Không khí khởi nghĩa làm nguyên tắc chiến lược bị cuốn vào hành động tức thời.",
    badinh:
      "Lễ tuyên bố chủ quyền đã là kết quả, còn ô này cần giữ trục nguyên tắc trước sức ép.",
    diplomacy:
      "Chiến trường khiến 'bất biến' bị hiểu thành phản ứng trước súng đạn.",
    battle:
      "Chiến địa trực diện làm nguyên tắc 'bất biến' bị biến thành phản ứng quân sự.",
    appeal:
      "Chân lý kháng chiến làm bàn nguyên tắc bị đẩy sang cao trào năm 1966.",
    testament:
      "Lời gửi lại tương lai làm bước giữ nguyên tắc năm 1946 bị kết thúc quá sớm.",
  },
  diplomacy: {
    tantrao:
      "Căn cứ địa chưa cho thấy sức ép đối ngoại trực diện cần xử lý bằng sách lược.",
    badinh:
      "Lễ độc lập làm thế thực dân bị che đi, trong khi ô này cần đặt đối phương lên bàn cờ.",
    principle:
      "Chỉ có nguyên tắc mà chưa có sức ép cụ thể, nước cờ 'vạn biến' chưa có đất diễn.",
    battle:
      "Trận địa nóng đẩy sách lược ngoại giao thẳng sang đối đầu, làm mất khoảng mềm dẻo để xoay chuyển tình thế.",
    appeal:
      "Khí thế kháng chiến làm tình thế ngoại giao non trẻ chuyển thành lời hiệu triệu.",
    testament:
      "Không khí Di chúc làm thế đối đầu thực dân mất tính cấp bách.",
  },
  appeal: {
    tantrao:
      "Căn cứ khởi nghĩa năm 1945 chưa mang tầm chân lý kháng chiến năm 1966.",
    badinh:
      "Lễ độc lập là khoảnh khắc khai sinh quốc gia, không phải lời hiệu triệu thời chiến kéo dài.",
    principle:
      "Bàn nguyên tắc làm lời kêu gọi mất âm hưởng toàn dân.",
    diplomacy:
      "Chiến trường cụ thể thu hẹp chân lý 'độc lập, tự do' thành một trận địa.",
    battle:
      "Trận đánh cụ thể thu hẹp lời hiệu triệu 'độc lập, tự do' thành một cảnh chiến sự trước mắt.",
    testament:
      "Di chúc là lời gửi lại, còn ô này cần tiếng gọi đang vang lên giữa kháng chiến.",
  },
  testament: {
    tantrao:
      "Khí thế mở đầu cách mạng kéo phần kết trở lại điểm xuất phát.",
    badinh:
      "Lễ khai sinh nước mới chưa phải không khí lắng lại của lời gửi cho tương lai.",
    principle:
      "Bàn nguyên tắc vẫn là sách lược đang vận động, chưa phải di sản cuối đời.",
    diplomacy:
      "Chiến sự làm Di chúc thành cảnh đối đầu, mất chiều sâu đoàn kết và tương lai.",
    battle:
      "Khói súng kéo Di chúc về một trận địa, làm mất nhịp lắng lại của lời gửi cho tương lai.",
    appeal:
      "Chân lý kháng chiến vẫn đang hiệu triệu, còn Di chúc cần một nhịp tổng kết.",
  },
  battle: {
    tantrao:
      "Căn cứ khởi nghĩa đưa chiến địa về bước chuẩn bị, chưa tạo được sức ép đối phương trực diện.",
    badinh:
      "Lễ độc lập làm chiến địa bị chuyển thành khoảnh khắc chính danh, không còn là đối đầu quân sự.",
    principle:
      "Bàn nguyên tắc làm chiến địa mất sức ép súng đạn đang hiện hữu trước mắt.",
    diplomacy:
      "Bàn ngoại giao kéo trận địa về thế thương lượng, làm mờ cảnh đối đầu vũ trang.",
    appeal:
      "Lời hiệu triệu kháng chiến mở rộng trận địa thành chân lý toàn dân, lệch khỏi cảnh chiến đấu cụ thể.",
    testament:
      "Di chúc làm chiến địa lắng xuống thành lời tổng kết, sai với nhịp đối đầu trước mắt.",
  },
};

const WRONG_CHARACTER_PAIR_SCENARIOS: Partial<
  Record<SceneId, Partial<Record<CharacterId, string>>>
> = {
  tantrao: {
    colonial:
      "Bóng thực dân kéo căn cứ bí mật vào thế giao tranh, làm mất không khí chuẩn bị Tổng khởi nghĩa.",
    colonialGunner:
      "Lính thực dân có súng làm căn cứ bí mật chuyển thành giao chiến sớm, trong khi nhịp này cần giữ lực lượng và chớp thời cơ.",
  },
  badinh: {
    colonial:
      "Sự hiện diện của thực dân biến lễ độc lập thành đối đầu quân sự.",
    colonialGunner:
      "Lính thực dân cầm súng phá vỡ không khí lễ đài, biến tuyên bố chủ quyền thành thế áp chế quân sự.",
  },
  principle: {
    comrade:
      "Cuộc bàn bạc tập thể làm lời giữ nguyên tắc mất tính quyết đoán cá nhân.",
    colonial:
      "Áp lực thực dân lấn vào bàn nguyên tắc, khiến 'bất biến' bị hiểu thành phản ứng trước súng đạn.",
    colonialGunner:
      "Súng đạn đặt lên bàn nguyên tắc làm 'bất biến' bị kéo về phản ứng chiến thuật.",
  },
  diplomacy: {
    colonialGunner:
      "Lính vũ trang làm thế ngoại giao non trẻ mất khoảng thương lượng, đẩy sách lược 1946 thành đối đầu trực diện.",
  },
  appeal: {
    comrade:
      "Cảnh chuyển thành bàn bạc hậu phương, trong khi lời kêu gọi cần vang trước toàn dân.",
    colonial:
      "Đối phương kéo chân lý năm 1966 về một trận địa cụ thể.",
    colonialGunner:
      "Hình ảnh lính cầm súng thu hẹp chân lý độc lập tự do thành một trận địa cụ thể, không còn vang như lời hiệu triệu toàn dân.",
  },
  testament: {
    comrade:
      "Sự xuất hiện của đồng chí làm khoảnh khắc Di chúc riêng tư thành một cuộc họp.",
    colonial:
      "Bóng đối phương làm Di chúc thành cảnh chiến sự, không còn là lời gửi lại cho tương lai.",
    colonialGunner:
      "Lính vũ trang kéo Di chúc vào khung chiến sự, làm mất chiều sâu đoàn kết và tương lai.",
  },
};

const WRONG_ACTION_PAIR_SCENARIOS: Partial<
  Record<SceneId, Partial<Record<ActionId, string>>>
> = {
  tantrao: {
    declaration:
      "Tuyên ngôn đến quá sớm; chính quyền chưa kịp được giành về tay nhân dân.",
    freedom:
      "Chân lý kháng chiến vang sai thời điểm, làm mờ nhiệm vụ chớp thời cơ.",
  },
  badinh: {
    time:
      "Thời cơ đã được chớp trước đó; lễ đài cần lời xác lập chủ quyền.",
    freedom:
      "Khẩu hiệu kháng chiến làm ngày độc lập lệch sang tinh thần năm 1966.",
  },
  principle: {
    time:
      "Thời cơ thúc đẩy hành động, còn cảnh này cần giữ trục nguyên tắc.",
    declaration:
      "Tuyên ngôn là lời khai sinh quốc gia, không phải sách lược giữ nguyên tắc.",
    freedom:
      "Chân lý lớn làm bàn nguyên tắc bị đẩy sang một cao trào khác.",
  },
  diplomacy: {
    time:
      "Chớp thời cơ khiến thế ngoại giao bị xử lý như một cuộc nổi dậy.",
    declaration:
      "Lời tuyên bố chủ quyền không giải được thế đối phương đang ép sát.",
    freedom:
      "Chân lý đúng nhưng quá rộng, chưa thể hiện nước cờ mềm dẻo trước sức ép.",
  },
  appeal: {
    time:
      "Thời cơ 1945 làm lời hiệu triệu 1966 bị kéo về một bước mở đầu khác.",
    declaration:
      "Tuyên ngôn khai sinh quốc gia, còn cảnh này cần chân lý nuôi ý chí kháng chiến.",
  },
  testament: {
    time:
      "Thời cơ mở đầu cách mạng làm phần kết bị kéo ngược về điểm xuất phát.",
    declaration:
      "Tuyên ngôn là lời khai sinh, còn Di chúc là lời gửi lại.",
    freedom:
      "Chân lý đã vang lên trong kháng chiến; phần cuối cần lắng lại thành di sản.",
  },
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
    sceneId: "principle",
    characters: ["hochiminh"],
    actions: [],
    successText: "Bất biến: mục tiêu độc lập dân tộc được giữ vững.",
    hintText: "Trước sức ép nhiều phía, cần xác định điều không thể nhân nhượng.",
  },
  {
    sceneId: "diplomacy",
    characters: ["hochiminh", "comrade", "colonial"],
    actions: [],
    successText:
      "Vạn biến: nhận diện sức ép thực dân và chọn sách lược mềm dẻo để giữ chính quyền non trẻ.",
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

const getPanelCharacterImage = (scene: SceneAsset | undefined, id: CharacterId) =>
  scene?.characterImages[id] || getCharacter(id)?.icon;

const sameSet = <T extends string>(actual: T[], expected: T[]) =>
  actual.length === expected.length &&
  expected.every((item) => actual.includes(item));

const getWrongSceneOutcome = (
  expected: SceneId,
  actual: SceneId,
): string | null =>
  actual === expected
    ? null
    : WRONG_SCENE_PAIR_SCENARIOS[expected]?.[actual] ?? null;

const getWrongActionOutcome = (
  sceneId: SceneId,
  actionId: ActionId,
): string | null => WRONG_ACTION_PAIR_SCENARIOS[sceneId]?.[actionId] ?? null;

const getCharacterFeedback = (
  panel: PanelState,
  rule: StepRule,
  scene: SceneAsset,
): ScenarioFeedback => {
  const extraCharacters = panel.characters.filter(
    (id) => !rule.characters.includes(id),
  );

  if (extraCharacters.length > 0) {
    const outcome =
      extraCharacters
        .map((id) => WRONG_CHARACTER_PAIR_SCENARIOS[scene.id]?.[id])
        .find((scenario): scenario is string => Boolean(scenario)) ?? null;

    return {
      outcome,
      isHardError: true,
    };
  }

  if (panel.characters.length > 0) {
    return {
      outcome: null,
      isHardError: false,
    };
  }

  return {
    outcome: null,
    isHardError: false,
  };
};

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
    const hasPlacedDetails =
      panel.characters.length > 0 || panel.actions.length > 0;

    return {
      ...baseResult,
      isSuccess: false,
      isError: hasPlacedDetails,
      outcome: hasPlacedDetails
        ? getWrongSceneOutcome(rule.sceneId, scene.id)
        : null,
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

  if (!hasExactCharacters) {
    const feedback = getCharacterFeedback(panel, rule, scene);

    return {
      ...baseResult,
      isSuccess: false,
      isError: feedback.isHardError,
      outcome: feedback.outcome,
    };
  }

  const hasExtraCharacters = panel.characters.some(
    (id) => !rule.characters.includes(id),
  );
  const hasExtraActions = panel.actions.some((id) => !rule.actions.includes(id));
  const hasMissingActions = rule.actions.some(
    (id) => !panel.actions.includes(id),
  );

  let outcome: string | null = null;
  if (hasExtraCharacters || hasExtraActions) {
    const firstWrongAction = panel.actions.find(
      (id) => !rule.actions.includes(id),
    );
    outcome = firstWrongAction
      ? getWrongActionOutcome(scene.id, firstWrongAction)
      : null;
  } else if (hasMissingActions) {
    outcome = null;
  }

  return {
    ...baseResult,
    isSuccess: false,
    isError: hasExtraCharacters || hasExtraActions,
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
    }, 8000);
    const goHomeTimer = window.setTimeout(() => {
      router.push("/");
    }, 15000);

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
          target.characters = [...target.characters, character.id].slice(0, 4);
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

  const handlePanelDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
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
    <div className="flex-1 min-h-0 flex flex-col relative z-10 w-full h-full overflow-hidden">
      <div className="flex shrink-0 items-center justify-center pt-4 pb-1 px-4">
        <h2 className="text-[clamp(1.25rem,2.5vw,1.875rem)] font-serif text-[#4a4036] font-bold tracking-wide text-center leading-tight">
          Chương 5: Hiện thực hóa Tư tưởng và Chân lý Thời đại
        </h2>
      </div>

      <div className="flex-1 min-h-0 px-5 sm:px-8 lg:px-14 pt-1 pb-2">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-3 sm:gap-x-5 gap-y-3 h-full min-h-0">
          {panels.map((panel, index) => {
            const result = panelResults[index];
            const locked = isPanelLocked(index);
            const scene = getScene(panel.sceneId);
            const shouldShowCharacters =
              panel.characters.length > 0 &&
              (!result.isSuccess || panel.sceneId === "principle");
            const hasFlagShimmer =
              result.isSuccess &&
              !!panel.sceneId &&
              FLAG_SCENE_IDS.includes(panel.sceneId);

            return (
              <motion.div
                key={index}
                onDrop={(e) => handleDropToPanel(e, index)}
                onDragOver={handlePanelDragOver}
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

                {!locked && !result.isSuccess && (
                  <div
                    className="absolute inset-0 z-30"
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleDropToPanel(e, index);
                    }}
                    onDragOver={(e) => {
                      e.stopPropagation();
                      handlePanelDragOver(e);
                    }}
                    onDragEnter={(e) => {
                      e.stopPropagation();
                      handlePanelDragOver(e);
                    }}
                  />
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

                {shouldShowCharacters && (
                  <div
                    className={`absolute inset-0 z-10 flex items-end justify-center px-3 pointer-events-none ${
                      result.outcome ? "pb-12" : "pb-5"
                    }`}
                  >
                    <div
                      className={`flex w-full justify-center ${
                        panel.characters.length >= 3
                          ? "h-[58%] gap-1.5"
                          : "h-[70%] gap-2.5"
                      }`}
                    >
                      {panel.characters.map((characterId) => {
                        const character = getCharacter(characterId);
                        const characterImg = getPanelCharacterImage(
                          scene,
                          characterId,
                        );
                        if (!character || !characterImg) return null;

                        return (
                          <motion.div
                            key={characterId}
                            initial={{ y: -18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            className="h-full relative pointer-events-none"
                          >
                            <img
                              src={characterImg}
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
                    className={`absolute bottom-0 w-full min-h-[34px] max-h-[58px] overflow-y-auto backdrop-blur-sm flex items-center justify-center z-20 px-2 py-1 ${
                      result.isSuccess
                        ? "bg-emerald-900/80"
                        : result.isError
                          ? "bg-red-900/80"
                          : "bg-black/70"
                    }`}
                  >
                    <span className="text-white text-[11px] sm:text-[12px] font-medium leading-tight tracking-wide text-center drop-shadow-md">
                      {result.outcome}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="h-[118px] shrink-0 mt-2 mx-4 sm:mx-8 border-t-[3px] border-double border-[#c2a878]/60 flex items-start justify-start gap-3 sm:gap-4 bg-white/10 rounded-t-2xl overflow-x-auto overflow-y-hidden px-3 py-2">
        {INVENTORY_SCENE_ORDER.map((sceneId) => {
          const scene = getScene(sceneId);
          if (!scene) return null;

          return (
            <div
              key={scene.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "scene", scene.id)}
              className="flex w-[72px] sm:w-[82px] flex-col items-center cursor-grab hover:scale-105 active:cursor-grabbing flex-shrink-0 transition-transform"
            >
              <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={scene.emptyImg}
                  alt={scene.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-[#5c4a3d] font-bold text-[10px] sm:text-[11px] text-center leading-tight w-full break-words">
                {scene.label}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#7a6554] leading-none">
                {scene.year}
              </span>
            </div>
          );
        })}

        <div className="w-[2px] h-14 bg-[#c2a878]/40 mx-1 flex-shrink-0" />

        {INVENTORY_CHARACTER_ORDER.map((characterId) => {
          const character = getCharacter(characterId);
          if (!character) return null;

          return (
            <div
              key={character.id}
              draggable
              onDragStart={(e) =>
                handleDragStart(e, "character", character.id)
              }
              className="flex w-[66px] sm:w-[76px] flex-col items-center cursor-grab hover:scale-105 active:cursor-grabbing flex-shrink-0 transition-transform"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={character.icon}
                  alt={character.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif text-[#5c4a3d] font-bold text-[10px] sm:text-[11px] text-center leading-tight w-full break-words">
                {character.label}
              </span>
            </div>
          );
        })}

        <div className="w-[2px] h-14 bg-[#c2a878]/40 mx-1 flex-shrink-0" />

        {INVENTORY_ACTION_ORDER.map((actionId) => {
          const action = getAction(actionId);
          if (!action) return null;

          return (
            <div
              key={action.id}
              draggable
              onDragStart={(e) => handleDragStart(e, "action", action.id)}
              className="flex w-[66px] sm:w-[78px] flex-col items-center cursor-grab hover:scale-105 active:cursor-grabbing flex-shrink-0 transition-transform"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded bg-amber-100 border-2 border-dashed border-amber-600 mb-1 flex items-center justify-center shadow-md">
                <span className="text-xs sm:text-sm font-black text-amber-900">
                  {action.shortLabel}
                </span>
              </div>
              <span className="font-serif text-[#5c4a3d] font-bold text-[10px] sm:text-[11px] text-center w-full leading-tight break-words">
                {action.label}
              </span>
            </div>
          );
        })}
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
