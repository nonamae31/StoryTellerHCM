/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

// (Giữ nguyên ASSETS)
const CHAPTER_6_ASSETS = {
    scenes: [
        { id: "market", label: "Thị trường", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/IconMarket_spusb3.png", bg: "https://res.cloudinary.com/dhtnfkulg/image/upload/Bg_Market_dekbfh.jpg" },
        { id: "conflict", label: "Xung đột", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/IconConflict_cckek0.png", bg: "https://res.cloudinary.com/dhtnfkulg/image/upload/Panel_Conflict_qr0fa7.jpg" },
        { id: "state", label: "Nhà nước", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/v1773561479/IconState_onnyln.png", bg: "https://res.cloudinary.com/dhtnfkulg/image/upload/Panel_Stjpg_bg_ixtivx.jpg" },
        { id: "harmony", label: "Điều hòa", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/IconSociety_jvxdjv.png", bg: "https://res.cloudinary.com/dhtnfkulg/image/upload/Bg_Harmony_khubry.jpg" },
    ],
    characters: [
        { id: "dung", label: "Cá nhân", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/Dung_Idle_l3sr21.png" },
        { id: "thanh", label: "Doanh nghiệp", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/Thanh_Idle_iw7jkz.png" },
        { id: "quan", label: "Quan chức", icon: "https://res.cloudinary.com/dhtnfkulg/image/upload/XaHoi_Idle_f0xe6f.png" },
    ],
};

interface PanelCharacter {
    id: "dung" | "thanh" | "quan";
    stateImg: string;
}

interface PanelState {
    sceneId: string | null;
    sceneBg: string | null;
    characters: PanelCharacter[];
    outcome: string | null;
    isLocked: boolean;
    panelImg: string | null;
}

// ==========================================
// 2. PANEL COMPONENT (Giữ nguyên giao diện của bạn)
// ==========================================
function CompositePanel({ panel, index, panels, onDrop, onDragOver, onClear }: any) {
    const [shake, setShake] = useState(false);

    const borderClass = panel.isLocked
        ? "border-gray-400 opacity-50 bg-gray-200/20"
        : panel.outcome === "ĐIỀU HÒA THÀNH CÔNG! Lợi ích cân bằng"
            ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            : panel.outcome?.startsWith("XUNG ĐỘT")
                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                : "border-[#a69279]";

    const handleLocalDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (panel.isLocked) return;

        const type = e.dataTransfer.getData("type");
        const id = e.dataTransfer.getData("id");
        let isValid = true;

        if (type === "scene") {
            if (id === "harmony") {
                const hasStateBefore = panels.slice(0, index).some((p: any) => p.sceneId === "state");
                if (!hasStateBefore) isValid = false;
            }
        } else if (type === "character" && panel.sceneId) {
            // Sửa logic chặn: Cho phép kéo đè nhân vật, chỉ chặn sai loại người vào sai cảnh
            if ((panel.sceneId === "market" || panel.sceneId === "conflict") && id === "quan") isValid = false;
            else if (panel.sceneId === "state" && id !== "quan") isValid = false;
        }

        if (!isValid) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }
        onDrop(e, index);
    };

    return (
        <motion.div
            onDrop={handleLocalDrop} onDragOver={onDragOver}
            animate={shake ? { x: [-5, 5, -5, 5, 0], borderColor: "#ef4444" } : {}}
            transition={{ duration: 0.4 }}
            className={`border-4 rounded bg-[#e8dbb9]/30 shadow-inner relative flex flex-col items-center justify-end overflow-hidden group transition-all ${borderClass}`}
        >
            {panel.isLocked && <div className="absolute inset-0 z-50 flex items-center justify-center font-bold text-gray-500 text-2xl">🔒</div>}
            {panel.sceneId && !panel.isLocked && (
                <button onClick={() => onClear(index)} className="absolute top-1 right-2 text-red-700/60 hover:text-red-800 font-bold z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-full w-6 h-6 flex items-center justify-center">X</button>
            )}
            {panel.panelImg && (
                <motion.img key={panel.panelImg} src={panel.panelImg} alt="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="absolute inset-0 w-full h-full object-cover z-0" />
            )}
            {panel.outcome && (
                <div className="absolute bottom-0 w-full min-h-[32px] bg-black/75 backdrop-blur-sm flex items-center justify-center z-20 py-1">
                    <span className="text-white text-[13px] font-medium tracking-wide drop-shadow-md text-center px-2">{panel.outcome}</span>
                </div>
            )}
        </motion.div>
    );
}

// ==========================================
// 3. MAIN PAGE
// ==========================================
export default function Chapter6Page() {
    const params = useParams();
    const router = useRouter();
    const chapterId = Number(params?.id) || 6;

    const [panels, setPanels] = useState<PanelState[]>(
        Array(6).fill(null).map((_, i) => ({
            sceneId: null, sceneBg: null, characters: [], outcome: null, isLocked: i !== 0, panelImg: null
        })),
    );

    const [isWin, setIsWin] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem("completedChapters");
        if (savedData) {
            const filtered = JSON.parse(savedData).filter((id: number) => id !== 6);
            localStorage.setItem("completedChapters", JSON.stringify(filtered));
        }
    }, []);

    // SỬA CHỖ NÀY: Logic tính toán lại toàn bộ để tránh lỗi hướng kéo
    useEffect(() => {
        let hasPersonalInterest = false;
        let hasEnterpriseInterest = false;
        let hasConflict = false;
        let hasStatePresence = false;
        let isVictory = false;

        const newPanels = panels.map((p) => ({ ...p, characters: [...p.characters] }));

        for (let i = 0; i < 6; i++) {
            const panel = { ...newPanels[i] };
            const scene = panel.sceneId;
            const chars = panel.characters.map((c) => c.id);

            let currentImg = panel.sceneBg;
            panel.outcome = null;

            if (!scene) {
                for (let j = i + 1; j < 6; j++) newPanels[j].isLocked = true;
                panel.panelImg = null;
                newPanels[i] = panel;
                continue;
            }

            if (i + 1 < 6) newPanels[i + 1].isLocked = false;

            if (scene === "market") {
                if (chars.includes("dung")) {
                    hasPersonalInterest = true;
                    panel.outcome = "Cá nhân có lợi ích riêng";
                    currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/Panel_Dung_Market_edpgiy.jpg";
                } else if (chars.includes("thanh")) {
                    hasEnterpriseInterest = true;
                    panel.outcome = "Doanh nghiệp có lợi ích riêng";
                    currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/v1773562687/Panel_Thanh_Market_tdqlvl.jpg";
                }
            } else if (scene === "conflict") {
                if (chars.includes("dung") && chars.includes("thanh")) {
                    if (hasPersonalInterest && hasEnterpriseInterest) {
                        hasConflict = true;
                        panel.outcome = "XUNG ĐỘT! Lợi ích va chạm nhau";
                        currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/conflict_yg3arw.jpg";
                    } else {
                        panel.outcome = "Không có vấn đề gì mâu thuẫn!";
                        currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/no_conflict_kiw6yv.jpg";
                    }
                } else if (chars.length > 0) {
                    panel.outcome = chars.includes("dung") ? "Cá nhân (Cần thêm Doanh nghiệp)" : "Doanh nghiệp (Cần thêm Cá nhân)";
                    currentImg = chars.includes("dung") ? "https://res.cloudinary.com/dhtnfkulg/image/upload/dung_xung_dot_hqkrt2.jpg" : "https://res.cloudinary.com/dhtnfkulg/image/upload/thanh_xung_dot_symsfe.jpg";
                }
            } else if (scene === "state" && chars.includes("quan")) {
                if (hasConflict) {
                    hasStatePresence = true;
                    panel.outcome = "Nhà nước dùng luật pháp & thể chế can thiệp";
                    currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/unnamed_1_m7dwi5.jpg";
                } else {
                    panel.outcome = "Chưa có xung đột để giải quyết";
                }
            } else if (scene === "harmony") {
                if (chars.length === 3 && chars.includes("dung") && chars.includes("thanh") && chars.includes("quan") && hasStatePresence) {
                    panel.outcome = "ĐIỀU HÒA THÀNH CÔNG! Lợi ích cân bằng";
                    currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/Panel_Harmony_uqa9fz.jpg";
                    isVictory = true;
                } else if (chars.length > 0) {
                    panel.outcome = "Vẫn còn thiếu người để điều hòa!";
                    // (Logic lấy ảnh group của bạn...)
                    if (chars.length === 1) {
                        if (chars[0] === "dung") currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/1ht_vh6kpl.jpg";
                        else if (chars[0] === "thanh") currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/2ht_aaidin.jpg";
                        else currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/3ht_dywn10.jpg";
                    } else if (chars.length === 2) {
                        if (chars.includes("dung") && chars.includes("thanh")) currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/12ht_lgwxs1.jpg";
                        else if (chars.includes("dung") && chars.includes("quan")) currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/13ht_dik9no.jpg";
                        else currentImg = "https://res.cloudinary.com/dhtnfkulg/image/upload/23_moebjg.jpg";
                    }
                }
            }
            panel.panelImg = currentImg;
            newPanels[i] = panel;
        }

        if (JSON.stringify(newPanels) !== JSON.stringify(panels)) setPanels(newPanels);
        if (isVictory && !isWin) {
            setIsWin(true);
            new Audio("/sounds/win.wav").play().catch(() => { });
            const completed = JSON.parse(localStorage.getItem("completedChapters") || "[]");
            if (!completed.includes(chapterId)) localStorage.setItem("completedChapters", JSON.stringify([...completed, chapterId]));
        } else if (!isVictory && isWin) {
            setIsWin(false); // Sửa lỗi: Nếu xóa bớt ảnh thì không cho Win nữa
        }
    }, [panels, isWin, chapterId]);

    const handleDropToPanel = (e: React.DragEvent, panelIndex: number) => {
        const type = e.dataTransfer.getData("type");
        const id = e.dataTransfer.getData("id");
        const bg = e.dataTransfer.getData("bgOrIcon");

        const newPanels = [...panels];
        const target = { ...newPanels[panelIndex], characters: [...newPanels[panelIndex].characters] };

        if (type === "scene") {
            target.sceneId = id; target.sceneBg = bg; target.characters = [];
        } else if (type === "character") {
            if (!target.sceneId) return;
            // SỬA CHỖ NÀY: Logic "Thay thế" thông minh
            if (target.sceneId === "market") {
                target.characters = [{ id: id as any, stateImg: "" }];
            } else {
                const max = target.sceneId === "conflict" ? 2 : 3;
                if (!target.characters.find(c => c.id === id)) {
                    if (target.characters.length >= max) target.characters.shift(); // Đầy thì đẩy người cũ ra
                    target.characters.push({ id: id as any, stateImg: "" });
                }
            }
        }
        newPanels[panelIndex] = target;
        setPanels(newPanels);
    };

    const clearPanel = (index: number) => {
        const newPanels = [...panels];
        for (let i = index; i < 6; i++) {
            newPanels[i] = { sceneId: null, sceneBg: null, characters: [], outcome: null, isLocked: i !== 0, panelImg: null };
        }
        setPanels(newPanels);
    };

    // (GIỮ NGUYÊN TOÀN BỘ PHẦN RETURN JSX "KHUNG" CỦA BẠN ĐẾN HẾT FILE)
    return (
        <div className="flex-1 flex flex-col relative z-10 w-full h-full">
            <div className="flex items-center justify-center pt-8 pb-2">
                <h2 className="text-3xl font-serif text-[#4a4036] font-bold tracking-wide">Chương 6: Giải quyết Mâu thuẫn Lợi ích!</h2>
            </div>
            <div className="flex-1 px-16 pt-2 pb-4">
                <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 h-full">
                    {panels.map((panel, i) => (
                        <CompositePanel key={i} panel={panel} index={i} panels={panels} onDrop={handleDropToPanel} onDragOver={(e: any) => e.preventDefault()} onClear={clearPanel} />
                    ))}
                </div>
            </div>
            <div className="h-[140px] mt-4 mx-12 border-t-[3px] border-double border-[#c2a878]/60 flex items-center justify-center gap-8 bg-white/20 rounded-t-2xl">
                {CHAPTER_6_ASSETS.scenes.map((asset) => {
                    const isHarmonyLocked = asset.id === "harmony" && !panels.some(p => p.sceneId === "state");
                    return (
                        <div key={asset.id} draggable={!isHarmonyLocked} onDragStart={(e) => { if (isHarmonyLocked) e.preventDefault(); else { e.dataTransfer.setData("type", "scene"); e.dataTransfer.setData("id", asset.id); e.dataTransfer.setData("bgOrIcon", asset.bg); } }} className={`flex flex-col items-center relative ${isHarmonyLocked ? "cursor-not-allowed opacity-50" : "cursor-grab hover:scale-110 active:cursor-grabbing"}`}>
                            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden relative">
                                <img src={asset.icon} alt={asset.label} className="w-full h-full object-cover" />
                                {isHarmonyLocked && <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10"><span className="text-2xl">🔒</span></div>}
                            </div>
                            <span className="font-serif text-[#5c4a3d] font-bold text-sm">{asset.label}</span>
                        </div>
                    );
                })}
                <div className="w-[2px] h-16 bg-[#c2a878]/40 mx-4" />
                {CHAPTER_6_ASSETS.characters.map((asset) => (
                    <div key={asset.id} draggable onDragStart={(e) => { e.dataTransfer.setData("type", "character"); e.dataTransfer.setData("id", asset.id); }} className="flex flex-col items-center cursor-grab hover:scale-110 active:cursor-grabbing">
                        <div className="w-14 h-14 rounded-full border-2 border-[#a69279] bg-[#e8dbb9] mb-1 flex items-center justify-center shadow-md overflow-hidden p-1">
                            <img src={asset.icon} alt={asset.label} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-serif text-[#5c4a3d] font-bold text-sm">{asset.label}</span>
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {isWin && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-8 text-center rounded-lg">
                        <CheckCircle2 size={80} className="text-green-400 mb-4 animate-pulse" />
                        <h2 className="text-4xl font-serif text-amber-400 font-bold mb-4">Hoàn thành xuất sắc!</h2>
                        <button onClick={() => router.push("/")} className="mt-8 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full transition-colors">Chơi tiếp</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}