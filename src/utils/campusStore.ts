import { University, InstitutionType } from '../types';
import { UNIVERSITIES } from '../data/seedData';

const CUSTOM_CAMPUSES_KEY = 'studspot_custom_campuses';

// Load stored custom campuses from localStorage
export const getStoredCustomCampuses = (): University[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_CAMPUSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse custom campuses from storage', e);
    return [];
  }
};

// Save a new custom campus
export const saveCustomCampus = (
  name: string,
  institutionType: InstitutionType = 'university',
  branch: string = 'Main Campus',
  city: string = 'Kenya'
): University => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Campus name cannot be empty');
  }

  const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  const id = `custom_${slug}_${Date.now() % 10000}`;

  const categoryLabel = 
    institutionType === 'kmtc' ? 'KMTC Campus' :
    institutionType === 'polytechnic' ? 'National Polytechnic' :
    institutionType === 'tvet' ? 'TVET Institute' : 'University';

  const newUni: University = {
    id,
    name: trimmedName,
    shortName: trimmedName.length > 20 ? trimmedName.substring(0, 18) + '...' : trimmedName,
    city: city || 'Kenya',
    campuses: [branch.trim() || 'Main Campus'],
    studentCount: 'Active Comrades',
    institutionType,
    categoryLabel: `${categoryLabel} (Custom)`
  };

  try {
    const existing = getStoredCustomCampuses();
    // Prevent duplicate exact names
    const filtered = existing.filter(u => u.name.toLowerCase() !== trimmedName.toLowerCase());
    const updated = [newUni, ...filtered];
    localStorage.setItem(CUSTOM_CAMPUSES_KEY, JSON.stringify(updated));
    // Dispatch window custom event so other components update synchronously
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('studspot_campuses_updated', { detail: newUni }));
    }
  } catch (e) {
    console.warn('Failed to persist custom campus', e);
  }

  return newUni;
};

// Get combined list of default seed universities and user-typed custom campuses
export const getAllCampuses = (): University[] => {
  const customList = getStoredCustomCampuses();
  // Filter out any default ones if conflict
  const existingIds = new Set(UNIVERSITIES.map(u => u.id));
  const uniqueCustom = customList.filter(u => !existingIds.has(u.id));
  return [...UNIVERSITIES, ...uniqueCustom];
};
