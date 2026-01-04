import { LinkItem, UserProfile, ThemeColor } from './types';

// ==============================================================================
// CONFIGURATION
// ==============================================================================
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
export const GOOGLE_SHEETS_API_URL: string = "https://script.google.com/macros/s/AKfycbzeFqxhru9uI7Re77Rqi4gUQvrV6Q0juOKSVmd61ga3qdBAAF8jKO3OPA4Ps0V6YMe3ag/exec"; 
// Example: "https://script.google.com/macros/s/AKfycbx.../exec"

export const INITIAL_PROFILE: UserProfile = {
  name: "ALEX_RDR",
  bio: "DIGITAL CREATOR // REACT DEV // BASED IN JKT",
  // Changed to a landscape seed to ensure a scenery photo
  avatarUrl: "https://picsum.photos/seed/landscape/200/200", 
  themeColor: ThemeColor.NEON_GREEN,
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: '1',
    title: 'MY PORTFOLIO',
    url: 'https://example.com',
    color: 'bg-[#ff90e8]',
  },
  {
    id: '2',
    title: 'LATEST YOUTUBE VIDEO',
    url: 'https://youtube.com',
    color: 'bg-[#23a6d5]',
  },
  {
    id: '3',
    title: 'READ MY BLOG',
    url: 'https://medium.com',
    color: 'bg-[#ffc900]',
  },
  {
    id: '4',
    title: 'BUY ME COFFEE',
    url: 'https://buymeacoffee.com',
    color: 'bg-white',
  }
];

export const AVAILABLE_COLORS = [
  'bg-[#ccff00]', // Neon Green
  'bg-[#ff90e8]', // Pink
  'bg-[#23a6d5]', // Cyan
  'bg-[#ffc900]', // Yellow
  'bg-[#ff6b6b]', // Orange
  'bg-white',     // White
];