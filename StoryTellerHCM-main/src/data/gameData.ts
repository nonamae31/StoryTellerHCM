// src/data/gameData.ts

export const ASSETS = {
  COVER_FRONT:
    "https://res.cloudinary.com/do02twogb/image/upload/v1773103940/CoverFront_ttdsmo.png", // Chú ý: thêm dấu "/" ở đầu để đường dẫn đúng ở mọi route
  COVER_INSIDE:
    "https://res.cloudinary.com/do02twogb/image/upload/v1773103923/CoverInside_uf5xxb.png",
  SPREAD_BASE:
    "https://res.cloudinary.com/do02twogb/image/upload/v1773103934/OpenBookSpreadBase_elotap.png",
  TREE_ILLUSTRATION:
    "https://res.cloudinary.com/do02twogb/image/upload/v1773473981/Tree_vuy5kj.png",
  DETAIL_STORY:
    "https://res.cloudinary.com/do02twogb/image/upload/v1773103958/DetailStory_clzijv.png",
};

export interface Chapter {
  id: number;
  title: string;
  fullTitle: string;
  isCompleted: boolean;
}

export const chaptersData: Chapter[] = [
  {
    id: 1,
    title: "Cội nguồn & Lối mòn",
    fullTitle: "Chương 1: Cội nguồn và Những lối mòn (1890 - 1911)",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Tìm thấy ánh sáng",
    fullTitle: "Chương 2: Vượt trùng dương và Tìm thấy ánh sáng (1911 - 1920)",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Khai sinh Đảng",
    fullTitle: "Chương 3: Gieo mầm Cách mạng và Khai sinh Đảng (1921 - 1930)",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Vượt qua sóng gió",
    fullTitle: "Chương 4: Vượt qua sóng gió và Trở về Tổ quốc (1930 - 1941)",
    isCompleted: false,
  },
  {
    id: 5,
    title: "Hiện thực hóa Tư tưởng",
    fullTitle: "Chương 5: Hiện thực hóa Tư tưởng và Chân lý Thời đại (1941 - 1969)",
    isCompleted: false,
  },
];
