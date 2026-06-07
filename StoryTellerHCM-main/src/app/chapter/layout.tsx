// app/chapter/layout.tsx
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { ASSETS } from "@/data/gameData"; // Tùy chỉnh đường dẫn @ nếu cần

export default function ChapterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#1a1525] flex items-center justify-center relative overflow-hidden p-4">
      {/* Container Background Trang Sách Lớn */}
      <div
        className="relative w-full max-w-7xl aspect-video mx-auto rounded-lg shadow-2xl flex flex-col"
        style={{
          backgroundImage: `url('${ASSETS.DETAIL_STORY}')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        {/* Nút Ruy Băng Đỏ (Bookmark) để Quay về Trang chủ bằng thẻ Link của Next */}
        <Link
          href="/"
          className="absolute -top-4 -left-20 w-14 h-24 bg-[#b83b3b] shadow-[2px_2px_5px_rgba(0,0,0,0.3)] hover:h-28 hover:bg-[#a13333] transition-all cursor-pointer flex flex-col items-center justify-end pb-4 rounded-b z-50 group"
        >
          <Bookmark
            className="text-amber-100 group-hover:scale-110 transition-transform"
            size={28}
          />
        </Link>

        {/* Gáy sách */}
        <div className="absolute top-0 bottom-0 left-1/2 -ml-4 w-8 bg-linear-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-0"></div>

        {/* NỘI DUNG CỦA TỪNG CHƯƠNG SẼ ĐƯỢC NHÉT VÀO ĐÂY (children) */}
        {children}
      </div>
    </div>
  );
}
