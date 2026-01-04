import { UserProfile, LinkItem } from '../types';
import { INITIAL_PROFILE, INITIAL_LINKS, GOOGLE_SHEETS_API_URL } from '../constants';

// We keep a local cache to prevent re-fetching constantly if not needed,
// but for this implementation, we will fetch fresh on load.
let cachedProfile: UserProfile | null = null;
let cachedLinks: LinkItem[] | null = null;

const isApiConfigured = () => {
  return GOOGLE_SHEETS_API_URL.length > 0;
};

// Helper to handle API requests
const fetchFromSheet = async (action?: string, data?: any) => {
  if (!isApiConfigured()) {
    console.warn("API URL not configured in constants.ts");
    throw new Error("API_NOT_CONFIGURED");
  }

  // If action is present, it's a POST
  const options: RequestInit = action ? {
    method: 'POST',
    mode: 'cors', // Use 'cors' to allow reading the response. Ensure GAS script is deployed with access: 'Anyone'.
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', 
    },
    body: JSON.stringify({ action, data }),
  } : {
    method: 'GET'
  };

  const response = await fetch(GOOGLE_SHEETS_API_URL, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const getProfile = async (): Promise<UserProfile> => {
  if (!isApiConfigured()) return INITIAL_PROFILE;

  try {
    // We fetch everything in one go usually with GAS to save quota, 
    // assuming GET returns { profile, links }
    const data = await fetchFromSheet();
    if (data.profile && data.profile.name) {
      const mergedProfile = {
        ...INITIAL_PROFILE, // Fallback for missing fields like themeColor if not in sheet
        ...data.profile
      };

      // Requirement: If avatarUrl is missing or empty in the sheet, use the default random landscape
      if (!mergedProfile.avatarUrl || mergedProfile.avatarUrl.trim() === "") {
        mergedProfile.avatarUrl = INITIAL_PROFILE.avatarUrl;
      }

      cachedProfile = mergedProfile;
      return cachedProfile!;
    }
    return INITIAL_PROFILE;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return cachedProfile || INITIAL_PROFILE;
  }
};

export const getLinks = async (): Promise<LinkItem[]> => {
  if (!isApiConfigured()) return INITIAL_LINKS;

  try {
    const data = await fetchFromSheet();
    if (data.links && Array.isArray(data.links)) {
      cachedLinks = data.links;
      return cachedLinks!;
    }
    return INITIAL_LINKS;
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return cachedLinks || INITIAL_LINKS;
  }
};

export const saveProfile = async (profile: UserProfile) => {
  if (!isApiConfigured()) {
    console.log("Mock Save Profile (No API):", profile);
    cachedProfile = profile;
    return;
  }

  try {
    // Google Apps Script doPost handling
    await fetchFromSheet('saveProfile', profile);
    cachedProfile = profile;
  } catch (error) {
    console.error("Failed to save profile:", error);
    alert("Failed to save to Google Sheets. Check console.");
  }
};

export const saveLinks = async (links: LinkItem[]) => {
  if (!isApiConfigured()) {
    console.log("Mock Save Links (No API):", links);
    cachedLinks = links;
    return;
  }

  try {
    await fetchFromSheet('saveLinks', links);
    cachedLinks = links;
  } catch (error) {
    console.error("Failed to save links:", error);
    alert("Failed to save to Google Sheets. Check console.");
  }
};