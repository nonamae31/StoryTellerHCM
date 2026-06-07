"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react"; // Dùng icon loa của lucide-react

const bgm_url =
  "https://res.cloudinary.com/do02twogb/video/upload/v1773104868/bgm_gsqumw.mp3";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Xử lý Autoplay: Ngay khi người chơi click bất kỳ đâu trên màn hình lần đầu tiên, nhạc sẽ phát
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.volume = 0.5; // Set âm lượng 50% cho nhạc nền đỡ ồn
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Trình duyệt chặn autoplay:", err));
      }
      // Sau khi click lần đầu thì xóa sự kiện này đi
      document.removeEventListener("click", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    return () => document.removeEventListener("click", handleFirstInteraction);
  }, [isPlaying]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Thẻ audio ẩn, có thuộc tính loop để lặp lại vô tận */}
      <audio ref={audioRef} src={bgm_url} loop />

      {/* Nút tắt/bật nhạc ở góc dưới bên trái màn hình */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
          toggleMute();
        }}
        className="fixed bottom-6 left-6 z-[9999] p-3 bg-[#5c4a3d]/80 hover:bg-[#8b4513] text-amber-100 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all"
        title="Bật/Tắt Nhạc Nền"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </>
  );
}
