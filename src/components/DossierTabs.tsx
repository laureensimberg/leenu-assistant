import React, { useState } from 'react';
import { Award, TrendingUp, Compass, UserCheck, MessageSquare, Sparkles } from 'lucide-react';
import { LAUREEN_PROFILE } from '../types.ts';

interface DossierTabsProps {
  onAskQuestion: (question: string, language?: 'en' | 'et') => void;
}

export const DossierTabs: React.FC<DossierTabsProps> = ({ onAskQuestion }) => {
  const [activeTab, setActiveTab] = useState<'athletics' | 'business' | 'skills' | 'references'>('athletics');

  return (
    <div className="w-full bg-[#FFFFFF]/70 backdrop-blur-xs border border-[#E9E2D4] rounded-2xl p-5 md:p-7 shadow-xs">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-[#EBE4D6] pb-3 mb-6 overflow-x-auto gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('athletics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans-ui transition-all ${
              activeTab === 'athletics'
                ? 'bg-[#22201D] text-[#FAF8F5] shadow-xs font-medium'
                : 'text-[#686256] hover:text-[#22201D] hover:bg-[#F4EFE5]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Athletics & Olympics</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans-ui transition-all ${
              activeTab === 'business'
                ? 'bg-[#22201D] text-[#FAF8F5] shadow-xs font-medium'
                : 'text-[#686256] hover:text-[#22201D] hover:bg-[#F4EFE5]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Business & Investing</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans-ui transition-all ${
              activeTab === 'skills'
                ? 'bg-[#22201D] text-[#FAF8F5] shadow-xs font-medium'
                : 'text-[#686256] hover:text-[#22201D] hover:bg-[#F4EFE5]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discipline & Mindset</span>
          </button>

          <button
            onClick={() => setActiveTab('references')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans-ui transition-all ${
              activeTab === 'references'
                ? 'bg-[#22201D] text-[#FAF8F5] shadow-xs font-medium'
                : 'text-[#686256] hover:text-[#22201D] hover:bg-[#F4EFE5]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>References</span>
          </button>
        </div>

        <span className="hidden lg:flex items-center gap-1 text-[11px] font-sans-ui text-[#9A9182]">
          <Sparkles className="w-3 h-3 text-[#9B7B4B]" />
          <span>Click any prompt to ask Leenu</span>
        </span>
      </div>

      {/* Tab Content */}
      <div className="font-serif-body">
        {/* Athletics */}
        {activeTab === 'athletics' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-[#F6F1E7]/80 border border-[#E9E1D2]">
              <div>
                <h4 className="font-serif-display text-lg font-semibold text-[#201D1A]">
                  Estonian Junior National Biathlon Team
                </h4>
                <p className="text-xs sm:text-sm text-[#665F53] mt-0.5">
                  Competing across the IBU Junior World Championships, Youth Olympic Games, and European Youth Olympic Festival.
                </p>
              </div>
              <button
                onClick={() => onAskQuestion("Tell me about your biathlon career and your experience at the Youth Olympic Games.")}
                className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DCD3C3] text-xs font-sans-ui text-[#806439] hover:bg-[#F4EFE6] transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Ask in English</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LAUREEN_PROFILE.achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6] hover:border-[#DACFB9] transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans-ui text-[11px] font-semibold text-[#9B7B4B] tracking-wider uppercase">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="font-sans-ui text-[10px] px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#554E42]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h5 className="font-serif-display text-base font-semibold text-[#22201D]">
                    {item.title}
                  </h5>
                  <p className="text-xs text-[#635C50] mt-1 leading-relaxed">
                    {item.details}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[#EAE3D5] flex items-center justify-between">
                    <span className="text-[11px] font-sans-ui text-[#8A8275]">{item.year}</span>
                    <button
                      onClick={() => onAskQuestion(`Räägi mulle oma saavutusest: ${item.title}. Kuidas sa selleni jõudsid?`, 'et')}
                      className="text-[11px] font-sans-ui text-[#9B7B4B] hover:text-[#7A5F35] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      <span>Küsi eesti keeles</span> →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business & Investing */}
        {activeTab === 'business' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-[#F6F1E7]/80 border border-[#E9E1D2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif-display text-lg font-semibold text-[#201D1A]">
                  Business Management & Equity Investing
                </h4>
                <p className="text-xs sm:text-sm text-[#665F53] mt-0.5">
                  Fusing elite athletic discipline with financial acumen. Currently studying Impactful Entrepreneurship at Estonian Business School (EBS).
                </p>
              </div>
              <button
                onClick={() => onAskQuestion("How do you combine your biathlon career with studying Impactful Entrepreneurship at EBS?")}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DCD3C3] text-xs font-sans-ui text-[#806439] hover:bg-[#F4EFE6] transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Ask about EBS Studies</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {LAUREEN_PROFILE.businessInvesting.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <h5 className="font-serif-display text-base font-semibold text-[#22201D] mb-1.5">
                    {item.title}
                  </h5>
                  <p className="text-xs text-[#635C50] leading-relaxed mb-3">
                    {item.details}
                  </p>
                  <button
                    onClick={() => onAskQuestion(`Milline on sinu kogemus seoses teemaga: ${item.title}?`, 'et')}
                    className="text-[11px] font-sans-ui text-[#9B7B4B] hover:text-[#7A5F35] flex items-center gap-1"
                  >
                    <span>Kuula arutelu (ET)</span> →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Mindset */}
        {activeTab === 'skills' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-[#F6F1E7]/80 border border-[#E9E1D2]">
              <h4 className="font-serif-display text-lg font-semibold text-[#201D1A] mb-1">
                The Athlete-Student Synergy
              </h4>
              <p className="text-xs sm:text-sm text-[#665F53]">
                Biathlon uniquely demands maximum cardiovascular output coupled with razor-sharp calm to shoot five targets from 50 meters under 20-30 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LAUREEN_PROFILE.skills.map((skill, idx) => (
                <div
                  key={idx}
                  onClick={() => onAskQuestion(`How do you develop and apply "${skill}" both in sports and your academic pursuits?`)}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D5] hover:border-[#9B7B4B]/50 hover:bg-white cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-display text-sm font-semibold text-[#24211E]">
                      {skill}
                    </span>
                    <span className="text-[#9B7B4B] opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      Ask →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Track */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#EBE4D6]">
              <h5 className="font-serif-display text-base font-semibold text-[#22201D] mb-2">
                Academic Foundations
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {LAUREEN_PROFILE.education.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E1D2]">
                    <div className="font-semibold text-[#201D1A]">{edu.institution}</div>
                    <div className="text-[#9B7B4B] font-medium mt-0.5">{edu.program}</div>
                    <div className="text-[#847C6F] mt-0.5 font-sans-ui">{edu.period}</div>
                    <div className="text-[#5F584C] mt-2 italic">{edu.highlight}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* References */}
        {activeTab === 'references' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-[#F6F1E7]/80 border border-[#E9E1D2]">
              <h4 className="font-serif-display text-lg font-semibold text-[#201D1A] mb-1">
                Academic & Olympic Endorsements
              </h4>
              <p className="text-xs sm:text-sm text-[#665F53]">
                Contact details for verified faculty members and sports psychologists supporting Laureen's dual career.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LAUREEN_PROFILE.references.map((ref, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6] shadow-2xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-[#EAE2D2] flex items-center justify-center font-serif-display font-semibold text-[#66512B]">
                      {ref.name[0]}
                    </div>
                    <div>
                      <h5 className="font-serif-display text-base font-semibold text-[#22201D]">
                        {ref.name}
                      </h5>
                      <p className="font-sans-ui text-xs text-[#7A7264]">
                        {ref.role} • {ref.organization}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 mt-3 pt-3 border-t border-[#EAE3D5] font-sans-ui text-xs">
                    <div className="flex justify-between items-center text-[#554E43]">
                      <span>Email:</span>
                      <a href={`mailto:${ref.email}`} className="text-[#9B7B4B] hover:underline font-medium">
                        {ref.email}
                      </a>
                    </div>
                    <div className="flex justify-between items-center text-[#554E43]">
                      <span>Phone:</span>
                      <span className="text-[#6B6356]">{ref.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAskQuestion(`What role did ${ref.name} play in your development and training?`)}
                    className="w-full mt-3 py-1.5 rounded-lg bg-white border border-[#DCD3C3] text-xs font-sans-ui text-[#806439] hover:bg-[#F4EFE6] transition-colors"
                  >
                    Ask Leenu about {ref.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
