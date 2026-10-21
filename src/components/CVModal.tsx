import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { LAUREEN_PROFILE } from '../types.ts';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'text'>('preview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1A17]/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#FAF8F5] border border-[#E4DECFA] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE3D5] bg-[#F5F0E6]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EFE8DC] rounded-lg text-[#84673B]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl font-semibold tracking-wide text-[#23201D]">
                Official Curriculum Vitae
              </h3>
              <p className="font-sans-ui text-xs text-[#7A7367]">
                Laureen Simberg • Verified Academic & Athletic Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#EAE2D2] p-0.5 rounded-lg text-xs font-sans-ui">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'preview'
                    ? 'bg-[#FAF8F5] text-[#22201D] shadow-sm font-medium'
                    : 'text-[#6F6759] hover:text-[#22201D]'
                }`}
              >
                Document Scan
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'text'
                    ? 'bg-[#FAF8F5] text-[#22201D] shadow-sm font-medium'
                    : 'text-[#6F6759] hover:text-[#22201D]'
                }`}
              >
                Structured Summary
              </button>
            </div>

            <a
              href={LAUREEN_PROFILE.cvPdfUrl}
              download="Laureen_Simberg_CV.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-ui font-medium rounded-lg bg-[#9B7B4B] hover:bg-[#83673C] text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-[#7A7367] hover:text-[#23201D] hover:bg-[#EAE2D2] rounded-lg transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          {viewMode === 'preview' ? (
            <div className="flex flex-col items-center">
              <div className="relative max-w-2xl w-full bg-white shadow-md border border-[#E8E1D3] rounded-lg overflow-hidden">
                <img
                  src="/assets/aistudio/cv_page1.png"
                  alt="Laureen Simberg CV"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    // Fallback to pdf embed if image is not supported
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-[#7A7367] font-sans-ui">
                <span>Direct PDF Attachment:</span>
                <a
                  href={LAUREEN_PROFILE.cvPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9B7B4B] hover:underline flex items-center gap-1 font-medium"
                >
                  Open in browser tab <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto font-serif-body text-[#2C2925]">
              {/* Profile summary */}
              <div className="p-5 rounded-xl bg-[#F6F1E7] border border-[#E8E0D2]">
                <h4 className="font-serif-display text-lg font-semibold text-[#201D1A] mb-2">
                  Executive Profile
                </h4>
                <p className="text-sm leading-relaxed text-[#4A453D]">
                  {LAUREEN_PROFILE.profile.en}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E3DBD0] text-xs text-[#6B6356] italic">
                  &ldquo;{LAUREEN_PROFILE.profile.et}&rdquo;
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#9B7B4B]" />
                  <h4 className="font-serif-display text-lg font-semibold text-[#201D1A]">
                    Athletic Achievements
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LAUREEN_PROFILE.achievements.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-white border border-[#EAE3D6] shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans-ui text-xs font-semibold text-[#9B7B4B] tracking-wide uppercase">
                          {item.category}
                        </span>
                        {item.year && (
                          <span className="text-[11px] font-sans-ui text-[#8A8275]">
                            {item.year}
                          </span>
                        )}
                      </div>
                      <h5 className="font-medium text-sm text-[#201D1A]">{item.title}</h5>
                      <p className="text-xs text-[#655E53] mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business & Investing */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-[#9B7B4B]" />
                  <h4 className="font-serif-display text-lg font-semibold text-[#201D1A]">
                    Business & Financial Background
                  </h4>
                </div>
                <div className="space-y-2">
                  {LAUREEN_PROFILE.businessInvesting.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-white border border-[#EAE3D6] flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#9B7B4B] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-medium text-[#201D1A]">{item.title}</h5>
                        <p className="text-xs text-[#655E53] mt-0.5">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-[#9B7B4B]" />
                  <h4 className="font-serif-display text-lg font-semibold text-[#201D1A]">
                    Academic Journey
                  </h4>
                </div>
                <div className="space-y-2">
                  {LAUREEN_PROFILE.education.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-white border border-[#EAE3D6]">
                      <div className="flex justify-between items-baseline mb-1">
                        <h5 className="text-sm font-semibold text-[#201D1A]">{item.institution}</h5>
                        <span className="text-xs font-sans-ui text-[#8A8275]">{item.period}</span>
                      </div>
                      <p className="text-xs font-medium text-[#9B7B4B] mb-1">{item.program}</p>
                      <p className="text-xs text-[#655E53]">{item.highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* References */}
              <div className="pt-2">
                <h4 className="font-serif-display text-base font-semibold text-[#201D1A] mb-2">
                  Verified Academic & National Team References
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans-ui">
                  {LAUREEN_PROFILE.references.map((ref, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#F5F0E6] border border-[#E8E1D2]">
                      <div className="font-medium text-[#201D1A]">{ref.name}</div>
                      <div className="text-[#655E53]">{ref.role} • {ref.organization}</div>
                      <div className="text-[#9B7B4B] mt-1">{ref.email}</div>
                      <div className="text-[#847C6F]">{ref.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EAE3D5] bg-[#F5F0E6]/50 flex items-center justify-between text-xs font-sans-ui text-[#7A7367]">
          <span>Tallinn, Estonia • laureen.simberg@gmail.com</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#DACFBF] bg-white text-[#2B2824] hover:bg-[#F2ECE1] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
