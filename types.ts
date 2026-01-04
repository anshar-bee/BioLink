export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color: string; // Hex or Tailwind color class suffix
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  themeColor: string;
}

export enum ThemeColor {
  NEON_GREEN = 'bg-[#ccff00]',
  HOT_PINK = 'bg-[#ff90e8]',
  CYAN = 'bg-[#23a6d5]',
  YELLOW = 'bg-[#ffc900]',
  ORANGE = 'bg-[#ff6b6b]',
}