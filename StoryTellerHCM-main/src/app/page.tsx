/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // IMPORT ROUTER CỦA NEXT.JS

// Import Data (đường dẫn tương đối có thể khác tùy thư mục của bạn)
import { ASSETS, chaptersData, Chapter } from "../data/gameData";

export default function Home() {
  const router = useRouter(); // Khởi tạo router

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [flipFrontPage, setFlipFrontPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const chaptersPerPage = 4;
  const totalPages = Math.ceil(chaptersData.length / chaptersPerPage);
  const [chaptersList, setChaptersList] = useState(chaptersData);

  useEffect(() => {
    // Đọc data từ localStorage khi trang sách load
    const syncCompletedChapters = () => {
      const savedData = localStorage.getItem("completedChapters");
      if (savedData) {
        const completedIds = JSON.parse(savedData);

        // Cập nhật lại mảng chapter, nếu ID nằm trong danh sách đã chơi thì set isCompleted = true
        setChaptersList((prevChapters) =>
          prevChapters.map((ch) =>
            completedIds.includes(ch.id) ? { ...ch, isCompleted: true } : ch,
          ),
        );
      }
    };

    // 1. Chạy lúc trang sách vừa mở
    syncCompletedChapters();

    // 2. Lắng nghe pháo hiệu từ màn chơi game
    globalThis.addEventListener("game-completed-sync", syncCompletedChapters);

    // Đề phòng trường hợp chuyển tab quay lại cũng sync luôn cho chắc
    globalThis.addEventListener("focus", syncCompletedChapters);

    // Dọn dẹp listener khi unmount
    return () => {
      globalThis.removeEventListener(
        "game-completed-sync",
        syncCompletedChapters,
      );
      globalThis.removeEventListener("focus", syncCompletedChapters);
    };
  }, []);

  const handleTurnPage = (direction: "next" | "prev") => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection(direction);

    const targetPage = direction === "next" ? activePage + 1 : activePage - 1;

    if (direction === "next") {
      setFlipFrontPage(activePage);
      setActivePage(targetPage);
    } else {
      setFlipFrontPage(targetPage);
    }

    setTimeout(() => {
      if (direction === "prev") setActivePage(targetPage);
      setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
      setIsFlipping(false);
    }, 800);
  };

  // --- LOGIC CHUYỂN TRANG BẰNG URL ---
  const handleEnterChapter = (chapter: Chapter) => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection("next");
    setFlipFrontPage(activePage);

    // Chờ lật sách xong (800ms) thì đẩy người dùng sang trang mới
    setTimeout(() => {
      router.push(`/chapter/${chapter.id}`); // Điều hướng sang /chapter/1, /chapter/2...
    }, 800);
  };

  const RightPageContent = ({ pageIndex }: { pageIndex: number }) => {
    const chapters = chaptersList.slice(
      pageIndex * chaptersPerPage,
      (pageIndex + 1) * chaptersPerPage,
    );

    return (
      <div className="relative z-10 flex flex-col h-full pt-16 pb-20 pl-12 pr-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-[#4a4036] tracking-wide">
            HCM202
          </h2>
          <p className="text-[#8c7a6b] italic mt-2">- Tóm tắt -</p>
          <div className="w-[80%] h-px bg-[#c2a878]/50 mx-auto mt-4"></div>
        </div>

        <ul className="flex-1 flex flex-col gap-8 mt-4">
          {chapters.map((chapter, index) => (
            <li
              key={chapter.id}
              onClick={() => handleEnterChapter(chapter)} // CLICK ĐỂ ĐIỀU HƯỚNG
              className="flex items-center justify-between group cursor-pointer hover:bg-[#c2a878]/20 p-2 -mx-2 rounded transition-colors"
            >
              <span className="text-2xl font-serif text-[#4a4036] whitespace-nowrap group-hover:text-[#8a5b33]">
                {pageIndex * chaptersPerPage + index + 1}. {chapter.title}
              </span>
              <div className="flex-grow border-b-2 border-dotted border-[#c2a878]/40 mx-4 mt-4"></div>
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#e8dbb9]/50 rounded-md border-2 border-[#c2a878]/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] group-hover:border-[#8a5b33]/60">
                {chapter.isCompleted && (
                  <Crown className="text-[#c18c4d] w-6 h-6 drop-shadow-md" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1525] flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={false}
        animate={{ x: isBookOpen ? "0%" : "-25%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="relative w-full max-w-5xl aspect-[16/10]"
        style={{ perspective: "3000px" }}
      >
        {/* LỚP 1: TRANG TĨNH */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isBookOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 right-0 w-1/2 h-full z-0 rounded-r-xl shadow-[10px_0_20px_rgba(0,0,0,0.3)]"
        >
          <div
            className="absolute inset-0 rounded-r-xl"
            style={{
              backgroundImage: `url('${ASSETS.COVER_INSIDE}')`,
              backgroundSize: "100% 100%",
            }}
          ></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${ASSETS.SPREAD_BASE}')`,
              backgroundSize: "200% 100%",
              backgroundPosition: "right center",
            }}
          ></div>

          {/* Không ẩn Mục lục nữa vì ta đã xóa trạng thái Transition ở file này */}
          <RightPageContent pageIndex={activePage} />

          {isBookOpen && (
            <div className="absolute bottom-12 right-24 flex gap-4 z-50 animate-fade-in">
              <button
                onClick={() => handleTurnPage("prev")}
                disabled={currentPage === 0 || isFlipping}
                className="p-2 bg-[#d1bfae]/80 rounded hover:bg-[#bfa892] disabled:opacity-0 transition-all"
              >
                <ChevronLeft size={28} className="text-[#4a3b32]" />
              </button>
              <button
                onClick={() => handleTurnPage("next")}
                disabled={currentPage === totalPages - 1 || isFlipping}
                className="p-2 bg-[#d1bfae]/80 rounded hover:bg-[#bfa892] disabled:opacity-0 transition-all"
              >
                <ChevronRight size={28} className="text-[#4a3b32]" />
              </button>
            </div>
          )}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none"></div>
        </motion.div>

        {/* LỚP 2: TRANG BAY */}
        <AnimatePresence>
          {isFlipping && isBookOpen && (
            <motion.div
              initial={{ rotateY: flipDirection === "next" ? 0 : -180 }}
              animate={{ rotateY: flipDirection === "next" ? -180 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-1/2 h-full z-[60] pointer-events-none"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0 rounded-r-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundImage: `url('${ASSETS.SPREAD_BASE}')`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "right center",
                }}
              >
                <RightPageContent pageIndex={flipFrontPage} />
              </div>
              <div
                className="absolute inset-0 rounded-l-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  backgroundImage: `url('${ASSETS.SPREAD_BASE}')`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "left center",
                }}
              >
                <div className="relative z-10 flex items-center justify-center w-full h-full pt-12 pb-16 pl-12 pr-16">
                  <img
                    src={ASSETS.TREE_ILLUSTRATION}
                    alt="Tree"
                    className="max-w-full max-h-[90%] object-contain mix-blend-multiply opacity-85"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LỚP 3: BÌA SÁCH */}
        <motion.div
          animate={{ rotateY: isBookOpen ? -180 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-1/2 h-full z-50 cursor-pointer"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
          }}
          onClick={() => !isBookOpen && setIsBookOpen(true)}
        >
          <div
            className="absolute inset-0 rounded-r-xl shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backgroundImage: `url('${ASSETS.COVER_FRONT}')`,
              backgroundSize: "100% 100%",
            }}
          >
            {!isBookOpen && (
              <div className="absolute inset-0 flex flex-col items-center justify-center hover:bg-white/10 transition-colors rounded-r-xl">
                <div className="bg-black/40 p-8 rounded-lg backdrop-blur-sm border border-amber-500/30 text-center">
                  <h1 className="text-5xl font-serif text-amber-400 font-bold mb-4 drop-shadow-lg">
                    StoryTeller
                  </h1>
                  <p className="text-amber-100/80 animate-pulse">
                    Tư Tưởng Hồ Chí Minh
                  </p>
                </div>
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 rounded-l-xl shadow-[10px_0_20px_rgba(0,0,0,0.2)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="absolute inset-0 rounded-l-xl"
              style={{
                backgroundImage: `url('${ASSETS.COVER_INSIDE}')`,
                backgroundSize: "100% 100%",
              }}
            ></div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${ASSETS.SPREAD_BASE}')`,
                backgroundSize: "200% 100%",
                backgroundPosition: "left center",
              }}
            ></div>
            <div className="relative z-10 flex items-center justify-center w-full h-full pt-12 pb-16 pl-12 pr-16">
              {isBookOpen && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  src={ASSETS.TREE_ILLUSTRATION}
                  className="max-w-full max-h-[90%] object-contain mix-blend-multiply opacity-85"
                />
              )}
            </div>
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
