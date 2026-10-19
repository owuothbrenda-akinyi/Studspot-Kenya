import { StudentVerification, Vendor, VendorCategory, VerificationStatus, User } from '../types';

const STUDENT_VERIFICATIONS_KEY = 'studspot_student_verifications';
const VENDORS_KEY = 'studspot_vendors';

// Initial Student Verifications for demonstration and queue testing
const INITIAL_STUDENT_VERIFICATIONS: StudentVerification[] = [
  {
    id: 'verif-1',
    userId: 'usr-1',
    fullName: 'Brian Mwangi',
    studentRegNo: 'SCT211-0021/2022',
    faculty: 'School of Computing & Information Technology',
    course: 'BSc Computer Science',
    universityId: 'jkuat',
    campusName: 'Juja Main Campus',
    documentUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    documentName: 'JKUAT_Student_ID_2022.jpg',
    documentType: 'image',
    fileSizeMb: 1.4,
    status: 'verified',
    ocrConfidence: 0.98,
    ocrMatchDetails: {
      nameMatched: true,
      regNoMatched: true,
      extractedText: 'JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY\nNAME: BRIAN MWANGI\nREG NO: SCT211-0021/2022\nFACULTY: SCIT\nVALID: 2022-2026'
    },
    submittedAt: '2026-09-02T10:30:00Z',
    reviewedAt: '2026-09-02T10:31:00Z',
    reviewNotes: 'Automated OCR verification passed with 98% confidence score.'
  },
  {
    id: 'verif-2',
    userId: 'usr-4',
    fullName: 'Faith Chebet',
    studentRegNo: 'KMTC/NBO/DCM/2023/118',
    faculty: 'Faculty of Clinical Medicine & Surgery',
    course: 'Diploma in Clinical Medicine',
    universityId: 'kmtc_nairobi',
    campusName: 'Mbagathi Way Main Campus',
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    documentName: 'KMTC_Admission_Letter_Chebet.pdf',
    documentType: 'pdf',
    fileSizeMb: 2.1,
    status: 'manual_review',
    ocrConfidence: 0.68,
    ocrMatchDetails: {
      nameMatched: true,
      regNoMatched: false,
      extractedText: 'KENYA MEDICAL TRAINING COLLEGE\nADMISSION LETTER 2023/2024\nSTUDENT: FAITH CHEBET\n[Watermark blurred serial code near reg header]'
    },
    submittedAt: '2026-10-18T14:15:00Z',
    reviewNotes: 'Flagged for Registrar Manual Review: Official admission stamp signature slightly obscured.'
  },
  {
    id: 'verif-3',
    userId: 'usr-5',
    fullName: 'Kevin Otieno',
    studentRegNo: 'KP/2023/ELECT/084',
    faculty: 'Department of Electrical & Electronic Engineering',
    course: 'Diploma in Electrical Engineering',
    universityId: 'kabete_poly',
    campusName: 'Kabete Main Campus Waiyaki Way',
    documentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    documentName: 'KabetePoly_StudentID.png',
    documentType: 'image',
    fileSizeMb: 0.9,
    status: 'pending',
    ocrConfidence: 0.85,
    ocrMatchDetails: {
      nameMatched: true,
      regNoMatched: true,
      extractedText: 'KABETE NATIONAL POLYTECHNIC\nNAME: KEVIN OTIENO\nADM NO: KP/2023/ELECT/084'
    },
    submittedAt: '2026-10-19T08:45:00Z'
  }
];

// Initial Vendors Collection (isolated from students)
const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vend-1',
    legalBusinessName: 'Mama Oliech Campus Meals & Catering',
    category: 'Food & Dining',
    locationDescription: 'Juja Gate C, Container Stall #14 opposite QuickMart',
    nearestCampusId: 'jkuat',
    nearestCampusName: 'JKUAT (Juja Main Campus)',
    contactPersonName: 'Mary Atieno Oliech',
    phone: '+254712398765',
    email: 'mamaoliech.meals@gmail.com',
    nationalIdDocUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    nationalIdDocName: 'NationalID_Atieno_FrontBack.pdf',
    status: 'verified',
    createdAt: '2026-08-10',
    verifiedAt: '2026-08-11',
    totalProductsListed: 8,
    rating: 4.9
  },
  {
    id: 'vend-2',
    legalBusinessName: 'Comrade Cyber, Printing & Stationery Hub',
    category: 'Printing & Cyber',
    locationDescription: 'Kahawa Sukari Avenue, 1st Floor KenolKobil Plaza near KU Gate',
    nearestCampusId: 'ku',
    nearestCampusName: 'Kenyatta University (Kahawa)',
    contactPersonName: 'Dennis Mutua',
    phone: '+254722889900',
    email: 'comradecyber.ku@gmail.com',
    nationalIdDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    nationalIdDocName: 'County_Trading_License_2026.pdf',
    status: 'verified',
    createdAt: '2026-09-05',
    verifiedAt: '2026-09-06',
    totalProductsListed: 12,
    rating: 4.8
  },
  {
    id: 'vend-3',
    legalBusinessName: 'Gate C Executive Student Hostels Ltd',
    category: 'Accommodation',
    locationDescription: 'Juja Behind Gate C, 200m down Tarmac Road past Shell',
    nearestCampusId: 'jkuat',
    nearestCampusName: 'JKUAT (Juja Main Campus)',
    contactPersonName: 'James Kamau',
    phone: '+254721445566',
    email: 'hostels@sunsetcourt.co.ke',
    nationalIdDocUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    nationalIdDocName: 'Business_Permit_SunsetCourt.pdf',
    status: 'review', // PENDING ADMIN APPROVAL!
    createdAt: '2026-10-18',
    totalProductsListed: 0,
    rating: 5.0
  },
  {
    id: 'vend-4',
    legalBusinessName: 'TechFix Campus Phone & Laptop Repairs',
    category: 'Tech & Phone Repair',
    locationDescription: 'Roysambu Lumumba Drive, Shop 4B near USIU Gate',
    nearestCampusId: 'usiu',
    nearestCampusName: 'USIU-A (Roysambu)',
    contactPersonName: 'Brian Kimani',
    phone: '+254733445566',
    email: 'techfix.roysambu@gmail.com',
    nationalIdDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    nationalIdDocName: 'NationalID_Kimani.jpg',
    status: 'review', // PENDING ADMIN APPROVAL!
    createdAt: '2026-10-19',
    totalProductsListed: 0,
    rating: 4.7
  }
];

// Kenyan Phone Validation helper:
// Accepts +2547XXXXXXXX, +2541XXXXXXXX, 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX
export function validateKenyanPhone(phone: string): { isValid: boolean; formatted: string; error?: string } {
  const cleaned = phone.trim().replace(/[\s-]/g, '');
  
  // Format starting with +254
  if (/^\+254(7|1)\d{8}$/.test(cleaned)) {
    return { isValid: true, formatted: cleaned };
  }
  
  // Format starting with 254
  if (/^254(7|1)\d{8}$/.test(cleaned)) {
    return { isValid: true, formatted: `+${cleaned}` };
  }
  
  // Format starting with 07 or 01
  if (/^0(7|1)\d{8}$/.test(cleaned)) {
    return { isValid: true, formatted: `+254${cleaned.slice(1)}` };
  }
  
  return {
    isValid: false,
    formatted: cleaned,
    error: 'Please enter a valid Kenyan phone number (e.g., +254712345678, 0712345678 or 0112345678).'
  };
}

// ----------------- Student Verifications API & Store -----------------

export function getStudentVerifications(): StudentVerification[] {
  try {
    const raw = localStorage.getItem(STUDENT_VERIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(STUDENT_VERIFICATIONS_KEY, JSON.stringify(INITIAL_STUDENT_VERIFICATIONS));
      return INITIAL_STUDENT_VERIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENT_VERIFICATIONS;
  }
}

export function saveStudentVerifications(items: StudentVerification[]) {
  try {
    localStorage.setItem(STUDENT_VERIFICATIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('studspot_verifications_updated'));
  } catch (err) {
    console.error('Failed to save student verifications:', err);
  }
}

export interface StudentVerifyPayload {
  userId: string;
  fullName: string;
  studentRegNo: string;
  faculty: string;
  course: string;
  universityId: string;
  campusName: string;
  documentFile: File | null;
  documentDataUrl: string;
  documentName: string;
  fileSizeMb: number;
}

// Simulates /api/verify-student endpoint:
// 1. Uploads to Firebase Storage / AWS S3 (simulated secure bucket with real mock URL)
// 2. Simulates OCR reading of the Student ID to verify name & reg number
// 3. Flags "verified" if OCR matches, or "manual_review" if blurry/mismatch
export async function submitStudentVerification(payload: StudentVerifyPayload): Promise<{
  success: boolean;
  status: VerificationStatus;
  ocrConfidence: number;
  message: string;
  verificationRecord: StudentVerification;
}> {
  // Simulate network latency for storage upload & OCR engine
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Determine document format
  const isPdf = payload.documentName.toLowerCase().endsWith('.pdf');
  const docType: 'image' | 'pdf' = isPdf ? 'pdf' : 'image';

  // Realistic mock OCR simulation:
  // Normalize strings for matching
  const inputNameUpper = payload.fullName.trim().toUpperCase();
  const inputRegUpper = payload.studentRegNo.trim().toUpperCase();

  // OCR heuristics: If reg number contains valid campus format (e.g. includes / or -)
  const hasCampusSlash = inputRegUpper.includes('/') || inputRegUpper.includes('-');
  const nameParts = inputNameUpper.split(' ').filter(p => p.length >= 2);
  
  // Decide OCR outcome
  let status: VerificationStatus = 'verified';
  let ocrConfidence = 0.96;
  let ocrMatchDetails = {
    nameMatched: true,
    regNoMatched: true,
    extractedText: `OFFICIAL REPUBLIC OF KENYA HIGHER EDUCATION ACCREDITATION\nINSTITUTION: ${payload.campusName.toUpperCase()}\nSTUDENT: ${inputNameUpper}\nREGISTRATION NO: ${inputRegUpper}\nFACULTY: ${payload.faculty.toUpperCase()}\nCOURSE: ${payload.course.toUpperCase()}\nVALID ACADEMIC YEAR: 2024-2027`
  };

  // If user typed a very short reg number or single name, simulate partial OCR -> manual review
  if (!hasCampusSlash || nameParts.length < 2) {
    status = 'manual_review';
    ocrConfidence = 0.65;
    ocrMatchDetails = {
      nameMatched: true,
      regNoMatched: false,
      extractedText: `INSTITUTION ACCREDITATION ID CARD\nNAME: ${inputNameUpper}\nREG NO: [UNREADABLE BARCODE / SKEWED FONT]\nSTATUS: REQUIRES REGISTRAR MANUAL AUDIT`
    };
  }

  // Create verification entry
  const record: StudentVerification = {
    id: `verif-${Date.now()}`,
    userId: payload.userId,
    fullName: payload.fullName,
    studentRegNo: payload.studentRegNo,
    faculty: payload.faculty,
    course: payload.course,
    universityId: payload.universityId,
    campusName: payload.campusName,
    documentUrl: payload.documentDataUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    documentName: payload.documentName || 'student_id_document.jpg',
    documentType: docType,
    fileSizeMb: payload.fileSizeMb || 1.2,
    status: status,
    ocrConfidence,
    ocrMatchDetails,
    submittedAt: new Date().toISOString(),
    reviewNotes: status === 'verified' 
      ? 'Automated OCR verification passed. High-confidence text match.'
      : 'Inconclusive OCR match. Routed to Admin Manual Review Dashboard Queue.'
  };

  const list = getStudentVerifications();
  const updated = [record, ...list.filter(v => v.userId !== payload.userId)];
  saveStudentVerifications(updated);

  return {
    success: true,
    status,
    ocrConfidence,
    message: status === 'verified' 
      ? 'Automated verification successful! Your Comrade Student Badge is now active.'
      : 'Document submitted! Flagged for Manual Admin Review. Verification usually completes in under 2 hours.',
    verificationRecord: record
  };
}

// Admin manual review approval
export function approveStudentVerification(verificationId: string, adminNotes?: string): StudentVerification | null {
  const list = getStudentVerifications();
  const index = list.findIndex(v => v.id === verificationId);
  if (index === -1) return null;

  const item = list[index];
  const updatedItem: StudentVerification = {
    ...item,
    status: 'verified',
    reviewedAt: new Date().toISOString(),
    reviewNotes: adminNotes || 'Approved manually by Campus Registrar Administrator.'
  };

  list[index] = updatedItem;
  saveStudentVerifications(list);

  // Also update User record in localStorage
  try {
    const rawUsers = localStorage.getItem('studspot_users');
    if (rawUsers) {
      const users: User[] = JSON.parse(rawUsers);
      const uIdx = users.findIndex(u => u.id === item.userId);
      if (uIdx !== -1) {
        users[uIdx].isVerifiedStudent = true;
        users[uIdx].verificationStatus = 'verified';
        users[uIdx].studentRegNo = item.studentRegNo;
        users[uIdx].faculty = item.faculty;
        users[uIdx].course = item.course;
        localStorage.setItem('studspot_users', JSON.stringify(users));
        window.dispatchEvent(new Event('studspot_user_updated'));
      }
    }
  } catch (e) {
    console.error('Failed to update user status:', e);
  }

  return updatedItem;
}

// Admin manual review rejection
export function rejectStudentVerification(verificationId: string, reason: string): StudentVerification | null {
  const list = getStudentVerifications();
  const index = list.findIndex(v => v.id === verificationId);
  if (index === -1) return null;

  const item = list[index];
  const updatedItem: StudentVerification = {
    ...item,
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewNotes: reason || 'Document image illegible or mismatched details.'
  };

  list[index] = updatedItem;
  saveStudentVerifications(list);
  return updatedItem;
}

// ----------------- Vendors API & Store -----------------

export function getVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(VENDORS_KEY);
    if (!raw) {
      localStorage.setItem(VENDORS_KEY, JSON.stringify(INITIAL_VENDORS));
      return INITIAL_VENDORS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VENDORS;
  }
}

export function saveVendors(items: Vendor[]) {
  try {
    localStorage.setItem(VENDORS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('studspot_vendors_updated'));
  } catch (err) {
    console.error('Failed to save vendors:', err);
  }
}

export interface VendorRegistrationPayload {
  legalBusinessName: string;
  category: VendorCategory;
  locationDescription: string;
  nearestCampusId: string;
  nearestCampusName: string;
  contactPersonName: string;
  phone: string;
  email: string;
  nationalIdDocUrl: string;
  nationalIdDocName: string;
}

// Register a new vendor - stored in isolated 'vendors' collection
export async function registerVendor(payload: VendorRegistrationPayload): Promise<{
  success: boolean;
  vendor: Vendor;
  message: string;
}> {
  // Validate Kenyan Phone
  const phoneValidation = validateKenyanPhone(payload.phone);
  if (!phoneValidation.isValid) {
    throw new Error(phoneValidation.error || 'Invalid Kenyan phone number.');
  }

  // Simulate secure upload latency
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const newVendor: Vendor = {
    id: `vend-${Date.now()}`,
    legalBusinessName: payload.legalBusinessName.trim(),
    category: payload.category,
    locationDescription: payload.locationDescription.trim(),
    nearestCampusId: payload.nearestCampusId,
    nearestCampusName: payload.nearestCampusName,
    contactPersonName: payload.contactPersonName.trim(),
    phone: phoneValidation.formatted,
    email: payload.email.trim().toLowerCase(),
    nationalIdDocUrl: payload.nationalIdDocUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    nationalIdDocName: payload.nationalIdDocName || 'National_ID_Card.jpg',
    status: 'review', // MANDATORY INITIAL STATE
    createdAt: new Date().toISOString().split('T')[0],
    totalProductsListed: 0,
    rating: 5.0
  };

  const currentVendors = getVendors();
  const updatedVendors = [newVendor, ...currentVendors];
  saveVendors(updatedVendors);

  return {
    success: true,
    vendor: newVendor,
    message: 'Vendor application submitted successfully! Your account is currently in "review" status. Uploading products will be unlocked once approved by Admin.'
  };
}

// Admin approves vendor (switches state to 'verified')
export function approveVendor(vendorId: string): Vendor | null {
  const vendors = getVendors();
  const idx = vendors.findIndex(v => v.id === vendorId);
  if (idx === -1) return null;

  const updated: Vendor = {
    ...vendors[idx],
    status: 'verified',
    verifiedAt: new Date().toISOString()
  };

  vendors[idx] = updated;
  saveVendors(vendors);
  return updated;
}

// Admin rejects vendor
export function rejectVendor(vendorId: string, reason: string): Vendor | null {
  const vendors = getVendors();
  const idx = vendors.findIndex(v => v.id === vendorId);
  if (idx === -1) return null;

  const updated: Vendor = {
    ...vendors[idx],
    status: 'rejected',
    rejectionReason: reason || 'Business details or National ID could not be authenticated.'
  };

  vendors[idx] = updated;
  saveVendors(vendors);
  return updated;
}
