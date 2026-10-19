import React, { useState, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  School, 
  AlertCircle, 
  FileText, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  Lock,
  ArrowRight,
  ScanLine,
  Check,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';
import { getAllCampuses } from '../utils/campusStore';
import { submitStudentVerification, StudentVerifyPayload } from '../utils/verificationStore';

interface StudentVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onVerifySuccess: (updatedUser?: Partial<User>) => void;
}

export const StudentVerifyModal: React.FC<StudentVerifyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onVerifySuccess,
}) => {
  if (!isOpen) return null;

  const allCampuses = getAllCampuses();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Brian Mwangi');
  const [studentRegNo, setStudentRegNo] = useState(currentUser?.studentRegNo || 'SCT211-0021/2022');
  const [faculty, setFaculty] = useState(currentUser?.faculty || 'School of Computing & Information Technology');
  const [course, setCourse] = useState(currentUser?.course || 'BSc Computer Science');
  const [universityId, setUniversityId] = useState(currentUser?.universityId || 'jkuat');

  // Document Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  );
  const [fileName, setFileName] = useState<string>('student_id_sample.jpg');
  const [fileSizeMb, setFileSizeMb] = useState<number>(1.2);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // OCR Processing & Status States
  const [verificationStep, setVerificationStep] = useState<'form' | 'scanning' | 'result'>('form');
  const [scanProgress, setScanProgress] = useState<string>('Initializing OCR scanner...');
  const [finalStatus, setFinalStatus] = useState<'verified' | 'manual_review' | 'rejected'>('verified');
  const [ocrConfidence, setOcrConfidence] = useState<number>(0.96);
  const [ocrMessage, setOcrMessage] = useState<string>('');

  // Handle Document Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (Max 5MB)
    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 5) {
      setErrorMsg(`File size (${sizeInMb.toFixed(1)}MB) exceeds maximum allowed 5MB limit.`);
      return;
    }

    // Validate type: PNG, JPG, JPEG, PDF
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Accepted formats are PNG, JPG, or PDF only.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeMb(parseFloat(sizeInMb.toFixed(2)));
    setIsPdf(file.type === 'application/pdf');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // PDF representation
      setFilePreview('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    setFileName('');
    setFileSizeMb(0);
    setIsPdf(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal student name.');
      return;
    }

    if (!studentRegNo.trim()) {
      setErrorMsg('Please enter your valid university/college registration number.');
      return;
    }

    if (!faculty.trim()) {
      setErrorMsg('Please provide your faculty or department name.');
      return;
    }

    if (!course.trim()) {
      setErrorMsg('Please enter your enrolled course of study.');
      return;
    }

    if (!filePreview && !selectedFile) {
      setErrorMsg('Please upload your Student ID Card or Official Admission Letter.');
      return;
    }

    const currentCampusObj = allCampuses.find(u => u.id === universityId) || allCampuses[1];

    // Begin Verification Workflow
    setVerificationStep('scanning');
    setScanProgress('Uploading document to secure Firebase Storage / AWS S3 bucket...');

    // Simulate Step 2
    setTimeout(() => {
      setScanProgress('Simulating AI OCR optical character recognition on Student ID...');
    }, 700);

    // Simulate Step 3
    setTimeout(() => {
      setScanProgress('Cross-referencing Reg No & Student Name against text inputs...');
    }, 1300);

    try {
      const payload: StudentVerifyPayload = {
        userId: currentUser?.id || `usr-${Date.now()}`,
        fullName: fullName.trim(),
        studentRegNo: studentRegNo.trim(),
        faculty: faculty.trim(),
        course: course.trim(),
        universityId,
        campusName: currentCampusObj.name,
        documentFile: selectedFile,
        documentDataUrl: filePreview,
        documentName: fileName || 'student_id.jpg',
        fileSizeMb: fileSizeMb || 1.2
      };

      const result = await submitStudentVerification(payload);

      setFinalStatus(result.status as 'verified' | 'manual_review');
      setOcrConfidence(result.ocrConfidence);
      setOcrMessage(result.message);
      setVerificationStep('result');

      if (result.status === 'verified') {
        onVerifySuccess({
          isVerifiedStudent: true,
          verificationStatus: 'verified',
          studentRegNo: studentRegNo.trim(),
          faculty: faculty.trim(),
          course: course.trim(),
          universityId
        });
      }
    } catch (err: unknown) {
      setVerificationStep('form');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit verification. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-heading">Student Identity Verification</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full font-bold">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Unlock the verified Comrade badge & 100% peer trust on campus
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {verificationStep === 'scanning' && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/30 animate-ping"></div>
                <div className="relative w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                  <ScanLine className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white font-heading">
                  Running Verification Workflow
                </h3>
                <p className="text-xs text-emerald-400 font-mono animate-pulse">
                  {scanProgress}
                </p>
                <p className="text-[11px] text-neutral-400 max-w-sm mx-auto pt-2">
                  Verifying ID against university registrar formatting standards & matching student credentials.
                </p>
              </div>

              <div className="w-48 mx-auto bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#F3B71B] w-full animate-[shimmer_1.5s_infinite]"></div>
              </div>
            </div>
          )}

          {verificationStep === 'result' && (
            <div className="py-6 text-center space-y-5">
              {finalStatus === 'verified' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white font-heading">
                      Identity Verified Successfully!
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono">
                      OCR Match Confidence: {(ocrConfidence * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-neutral-300 max-w-sm mx-auto pt-1">
                      {ocrMessage}
                    </p>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Student Name:</span>
                      <span className="font-bold text-white">{fullName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Reg Number:</span>
                      <span className="font-mono font-bold text-emerald-400">{studentRegNo}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Enrolled Course:</span>
                      <span className="font-medium text-neutral-200">{course}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Campus Trust Status:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 100% Verified Comrade
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-sm transition shadow-md"
                  >
                    Done & Return to Campus Feed
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/60">
                    <Clock className="w-9 h-9 text-amber-400" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white font-heading">
                      Routed to Manual Review Queue
                    </h3>
                    <p className="text-xs text-amber-400 font-mono">
                      Status: Pending Admin Manual Review
                    </p>
                    <p className="text-xs text-neutral-300 max-w-sm mx-auto pt-1">
                      {ocrMessage}
                    </p>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Why was manual review triggered?</span>
                    </div>
                    <p className="text-[11px] text-amber-200/80 leading-relaxed">
                      Our automated OCR detected slight glare or non-standard university formatting on the uploaded ID card. A student registrar administrator has received your document in the Admin Dashboard Queue and will verify it within 2 hours.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-sm transition shadow-md"
                  >
                    Understood (Track Status in Profile)
                  </button>
                </>
              )}
            </div>
          )}

          {verificationStep === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Full Legal Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Full Legal Student Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Brian Mwangi Kariuki"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-emerald-500 outline-none transition"
                  required
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Must match the name on your student ID or admission letter.
                </span>
              </div>

              {/* 2. Registration Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Registration Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentRegNo}
                  onChange={(e) => setStudentRegNo(e.target.value.toUpperCase())}
                  placeholder="e.g., SCT211-0021/2022 or KMTC/NBO/DCM/2023/118"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white font-mono rounded-xl border border-neutral-700 focus:border-emerald-500 outline-none transition uppercase"
                  required
                />
              </div>

              {/* 3. Institution (Dropdown Selection Menu) */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Institution / Campus <span className="text-rose-400">*</span>
                </label>
                <select
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-emerald-500 outline-none transition"
                >
                  <optgroup label="🎓 Public & Private Universities">
                    {allCampuses.filter(u => u.institutionType === 'university').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} ({uni.shortName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🩺 KMTC (Kenya Medical Training College)">
                    {allCampuses.filter(u => u.institutionType === 'kmtc').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="⚙️ National Polytechnics (Top Tier Technicals)">
                    {allCampuses.filter(u => u.institutionType === 'polytechnic').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🔧 TVETs, TTIs & Specialized Colleges">
                    {allCampuses.filter(u => u.institutionType === 'tvet').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 4. Faculty & Course Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Faculty / School <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="e.g., School of Computing"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-emerald-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Enrolled Course <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g., BSc Computer Science"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-emerald-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* 5. Document Upload Section (Requested specifically) */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-200 mb-1 flex items-center justify-between">
                  <span>Upload Student ID Card or Official Admission Letter <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-neutral-400">PNG, JPG, PDF (Max 5MB)</span>
                </label>

                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="hidden"
                />

                {/* Upload preview or drag-box */}
                {filePreview || isPdf ? (
                  <div className="relative rounded-2xl bg-neutral-900 border border-neutral-700 p-3 flex items-center justify-between gap-3 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      {isPdf ? (
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-neutral-700 shrink-0">
                          <img 
                            src={filePreview} 
                            alt="Student ID Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{fileName || 'Student_ID_Document'}</p>
                        <p className="text-[10px] text-neutral-400">
                          {fileSizeMb ? `${fileSizeMb} MB · ` : ''}Ready for automated OCR scanning
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-1 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-emerald-500/70 bg-neutral-900/60 hover:bg-neutral-900 rounded-2xl p-6 text-center cursor-pointer transition space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-neutral-800 group-hover:bg-emerald-500/20 text-neutral-400 group-hover:text-emerald-400 flex items-center justify-center mx-auto transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                        Tap to select Student ID or Admission Letter
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Supports PNG, JPG, or PDF up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust & Privacy Notice */}
              <div className="p-3 bg-neutral-900/70 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-[11px] text-neutral-400">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Documents are encrypted and used solely for student affiliation checks. We never share your ID card with 3rd parties or buyers.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Submit & Run Automated Verification</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
