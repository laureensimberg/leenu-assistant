/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  FileText,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  Play,
  Pause,
  Award,
  BookOpen,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { VoiceVisualizer } from './components/VoiceVisualizer.tsx';
import { CVModal } from './components/CVModal.tsx';
import { DossierTabs } from './components/DossierTabs.tsx';
import { Message, LAUREEN_PROFILE } from './types.ts';

import { getClientKnowledgeResponse } from './services/aiClient.ts';

// Voice recognition interface for browsers
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: "Hello! I am Leenu, voice assistant representing Laureen Simberg. I'm here to share insights on Laureen's biathlon career with the Estonian Junior National Team, her experience at the Youth Olympic Games, and her studies in Impactful Entrepreneurship at Estonian Business School (EBS) alongside active equity investing. Räägin meeleldi ka eesti keeles!",
      timestamp: new Date(),
      language: 'en',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [languageMode, setLanguageMode] = useState<'auto' | 'en' | 'et'>('auto');
  const [assistantStatus, setAssistantStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isContactPopoverOpen, setIsContactPopoverOpen] = useState(false);

  // Audio element reference for TTS playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantStatus]);

  // Initialize Speech Recognition safely if supported
  useEffect(() => {
    try {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsRecording(true);
          setAssistantStatus('listening');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setSpeechTranscript(transcript);
          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          setIsRecording(false);
          setAssistantStatus('idle');
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (assistantStatus === 'listening') {
            setAssistantStatus('idle');
          }
        };

        recognitionRef.current = recognition;
      }
    } catch (e) {
      console.warn('Speech recognition not available:', e);
    }
  }, [assistantStatus]);

  // Update speech recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      if (languageMode === 'et') {
        recognitionRef.current.lang = 'et-EE';
      } else if (languageMode === 'en') {
        recognitionRef.current.lang = 'en-US';
      } else {
        recognitionRef.current.lang = 'en-US';
      }
    }
  }, [languageMode]);

  // Handle Voice Input Toggle
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not active or supported in this browser. You can type directly below!");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setAssistantStatus('idle');
      if (inputText.trim()) {
        handleSendMessage(inputText);
      }
    } else {
      stopAudioPlayback();
      setSpeechTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  };

  // Stop currently playing audio
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    setAssistantStatus('idle');
  };

  // Speak text using Gemini TTS or Web Speech fallback
  const speakText = async (text: string, lang: 'en' | 'et') => {
    if (isMuted) return;

    setAssistantStatus('speaking');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: lang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64 && audioRef.current) {
          const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          audioRef.current.src = audioUrl;
          audioRef.current.playbackRate = playbackSpeed;
          audioRef.current.onended = () => {
            setAssistantStatus('idle');
            setAudioLevel(0);
          };
          audioRef.current.onerror = () => {
            fallbackSpeechSynthesis(text, lang);
          };
          
          audioRef.current.play().catch(() => {
            fallbackSpeechSynthesis(text, lang);
          });
          return;
        }
      }
      fallbackSpeechSynthesis(text, lang);
    } catch (err) {
      fallbackSpeechSynthesis(text, lang);
    }
  };

  // Browser speech synthesis fallback with soft tone parameters
  const fallbackSpeechSynthesis = (text: string, lang: 'en' | 'et') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !window.speechSynthesis) {
      setAssistantStatus('idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed * 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      if (lang === 'et') {
        const etVoice = voices.find(v => v.lang.startsWith('et')) ||
                        voices.find(v => v.name.toLowerCase().includes('estonian'));
        if (etVoice) utterance.voice = etVoice;
        utterance.lang = 'et-EE';
      } else {
        const usVoice = voices.find(v => (v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Victoria') || v.name.includes('Female')) && v.lang.startsWith('en-US')) ||
                        voices.find(v => v.lang.startsWith('en-US'));
        if (usVoice) utterance.voice = usVoice;
        utterance.lang = 'en-US';
      }

      utterance.onend = () => {
        setAssistantStatus('idle');
      };
      utterance.onerror = () => {
        setAssistantStatus('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis notice:', e);
      setAssistantStatus('idle');
    }
  };

  // Send message and get Leenu's reply
  const handleSendMessage = async (textToSend: string, explicitLang?: 'en' | 'et') => {
    const text = textToSend.trim();
    if (!text) return;

    stopAudioPlayback();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSpeechTranscript('');
    setAssistantStatus('thinking');

    const effectiveLang = explicitLang || languageMode;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6),
          language: effectiveLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Server API unreachable');
      }

      const data = await response.json();
      const detectedLang = data.detectedLanguage || (/[äöõü]/i.test(data.reply) ? 'et' : 'en');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply,
        timestamp: new Date(),
        language: detectedLang,
      };

      setMessages(prev => [...prev, assistantMessage]);
      await speakText(data.reply, detectedLang);
    } catch (err) {
      // Client offline/static fallback (e.g. GitHub Pages or Netlify static deploy)
      const fallback = getClientKnowledgeResponse(text, effectiveLang);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallback.reply,
        timestamp: new Date(),
        language: fallback.detectedLanguage,
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(fallback.reply, fallback.detectedLanguage);
    }
  };

  // Replay message audio
  const handleReplayMessage = (message: Message) => {
    stopAudioPlayback();
    speakText(message.text, message.language || 'en');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201D] flex flex-col justify-between selection:bg-[#EAE0D0]">
      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Top Sophisticated Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#ECE5D8] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={LAUREEN_PROFILE.portraitUrl}
                alt="Laureen Simberg"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#D8CEBC] shadow-xs"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#FAF8F5] ${
                assistantStatus === 'speaking' ? 'bg-[#9B7B4B] animate-ping' :
                assistantStatus === 'listening' ? 'bg-[#E39E36]' : 'bg-[#558661]'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-display text-lg sm:text-xl font-bold tracking-wider uppercase text-[#1C1A17]">
                  Laureen Simberg
                </h1>
                <span className="font-sans-ui text-[11px] px-2 py-0.5 rounded-full bg-[#EFE9DD] text-[#716858] font-medium border border-[#E2D9C8]">
                  Voice: Leenu
                </span>
              </div>
              <p className="font-sans-ui text-xs text-[#7A7366] hidden sm:block">
                Estonian Junior National Biathlete • EBS Impactful Entrepreneurship • Active Investor
              </p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#EFEAE0] rounded-xl p-0.5 text-xs font-sans-ui border border-[#E0D7C6]">
              <button
                onClick={() => setLanguageMode('auto')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  languageMode === 'auto'
                    ? 'bg-[#FAF8F5] text-[#201D1A] shadow-xs font-medium'
                    : 'text-[#706859] hover:text-[#201D1A]'
                }`}
                title="Automatically match user's language"
              >
                Auto
              </button>
              <button
                onClick={() => setLanguageMode('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  languageMode === 'en'
                    ? 'bg-[#FAF8F5] text-[#201D1A] shadow-xs font-medium'
                    : 'text-[#706859] hover:text-[#201D1A]'
                }`}
                title="Soft American Tone"
              >
                English
              </button>
              <button
                onClick={() => setLanguageMode('et')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  languageMode === 'et'
                    ? 'bg-[#FAF8F5] text-[#201D1A] shadow-xs font-medium'
                    : 'text-[#706859] hover:text-[#201D1A]'
                }`}
                title="Pehme eesti aktsent"
              >
                Eesti
              </button>
            </div>

            {/* Mute toggle */}
            <button
              onClick={() => {
                if (!isMuted) stopAudioPlayback();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted
                  ? 'bg-[#F2ECE0] border-[#DDD3C0] text-[#999081]'
                  : 'bg-white border-[#E2D8C6] text-[#22201D] hover:bg-[#F7F2E8]'
              }`}
              title={isMuted ? 'Unmute voice assistant' : 'Mute voice assistant'}
              aria-label="Toggle mute"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#9B7B4B]" />}
            </button>

            {/* CV Modal Trigger */}
            <button
              onClick={() => setIsCVModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5C9B3] bg-white hover:bg-[#F6F0E4] text-xs font-sans-ui font-medium text-[#2C2925] shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#9B7B4B]" />
              <span className="hidden md:inline">Verified CV</span>
            </button>

            {/* Contact popover toggle */}
            <div className="relative">
              <button
                onClick={() => setIsContactPopoverOpen(!isContactPopoverOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22201D] hover:bg-[#38342F] text-xs font-sans-ui font-medium text-[#FAF8F5] shadow-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Contact</span>
              </button>

              {isContactPopoverOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#FAF8F5] border border-[#E2D7C5] rounded-2xl shadow-xl p-4 z-50 animate-fade-in font-sans-ui text-xs">
                  <div className="font-serif-display text-sm font-semibold text-[#201D1A] mb-2 border-b border-[#ECE4D5] pb-2">
                    Direct Contact Details
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[#4E473C]">
                      <Mail className="w-3.5 h-3.5 text-[#9B7B4B] shrink-0" />
                      <a href={`mailto:${LAUREEN_PROFILE.email}`} className="hover:underline font-medium text-[#201D1A]">
                        {LAUREEN_PROFILE.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-[#4E473C]">
                      <Phone className="w-3.5 h-3.5 text-[#9B7B4B] shrink-0" />
                      <a href={`tel:${LAUREEN_PROFILE.phone}`} className="hover:underline">
                        {LAUREEN_PROFILE.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-[#4E473C]">
                      <MapPin className="w-3.5 h-3.5 text-[#9B7B4B] shrink-0" />
                      <span>{LAUREEN_PROFILE.location}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#ECE4D5] flex justify-between items-center text-[11px] text-[#787163]">
                    <span>EBS / Team Estonia</span>
                    <a
                      href={LAUREEN_PROFILE.cvPdfUrl}
                      download
                      className="text-[#9B7B4B] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Editorial Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: The Voice Assistant Stage (Leenu) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* The Voice Orb / Persona Card */}
            <div className="relative bg-gradient-to-b from-[#FFFFFF] to-[#F7F3EB] border border-[#E9E1D2] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#F2E8D7] rounded-full filter blur-3xl opacity-50 -z-0" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#EBE0CD] rounded-full filter blur-2xl opacity-40 -z-0" />

              {/* Status Pill */}
              <div className="z-10 mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5DCCB] text-xs font-sans-ui text-[#6F6759]">
                <span className={`w-2 h-2 rounded-full ${
                  assistantStatus === 'speaking' ? 'bg-[#9B7B4B] animate-pulse' :
                  assistantStatus === 'listening' ? 'bg-[#E39E36] animate-bounce' :
                  assistantStatus === 'thinking' ? 'bg-[#766B59] animate-pulse' : 'bg-[#558661]'
                }`} />
                <span className="font-medium">
                  {assistantStatus === 'speaking' ? 'Leenu is speaking...' :
                   assistantStatus === 'listening' ? 'Listening to you...' :
                   assistantStatus === 'thinking' ? 'Reflecting...' : 'Leenu is ready to talk'}
                </span>
              </div>

              {/* Central Voice Avatar with Harmonic Aura */}
              <div className="z-10 my-2">
                <div className={`relative p-2.5 rounded-full transition-all duration-700 ${
                  assistantStatus === 'speaking'
                    ? 'ring-4 ring-[#9B7B4B]/30 ring-offset-4 ring-offset-[#FAF8F5]'
                    : assistantStatus === 'listening'
                    ? 'ring-4 ring-[#E39E36]/40 ring-offset-4 ring-offset-[#FAF8F5]'
                    : 'ring-1 ring-[#DFD6C5]'
                }`}>
                  <img
                    src={LAUREEN_PROFILE.portraitUrl}
                    alt="Laureen Simberg"
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-md border-2 border-white"
                  />
                  
                  {assistantStatus === 'listening' && (
                    <div className="absolute inset-0 bg-[#22201D]/30 backdrop-blur-xs rounded-full flex items-center justify-center">
                      <Mic className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Persona Description */}
              <div className="z-10 mt-3">
                <h2 className="font-serif-display text-2xl font-bold tracking-tight text-[#1F1D1A]">
                  Leenu
                </h2>
                <p className="font-serif-body text-sm text-[#746C5E] italic mt-0.5">
                  Voice Persona for Laureen Simberg
                </p>
                <p className="font-sans-ui text-xs text-[#877E6F] mt-2 max-w-sm">
                  Speaking in a soft, articulate tone in English (American cadence) & Estonian (emakeel).
                </p>
              </div>

              {/* Reactive Waveform Visualizer */}
              <div className="z-10 w-full mt-2">
                <VoiceVisualizer status={assistantStatus} audioLevel={audioLevel} />
              </div>

              {/* Voice Interaction & Mic Trigger */}
              <div className="z-10 w-full mt-2 flex flex-col items-center gap-3">
                <button
                  onClick={toggleRecording}
                  className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-sans-ui text-sm font-medium transition-all shadow-sm ${
                    isRecording
                      ? 'bg-[#C2410C] hover:bg-[#9A3412] text-white animate-gentle-pulse'
                      : 'bg-[#9B7B4B] hover:bg-[#83673C] text-white active:scale-[0.99]'
                  }`}
                  aria-label={isRecording ? 'Stop speaking' : 'Start speaking with Leenu'}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Listening (Tap to send)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Tap to Speak with Leenu</span>
                    </>
                  )}
                </button>

                {speechTranscript && (
                  <div className="w-full text-xs font-serif-body text-[#5F584B] bg-[#EFE9DD]/60 rounded-xl p-2.5 border border-[#E2D8C6] italic text-left">
                    <span className="font-sans-ui not-italic font-semibold text-[#8B6E3F] mr-1.5">You:</span>
                    &ldquo;{speechTranscript}&rdquo;
                  </div>
                )}
              </div>

              {/* Speech Controls */}
              <div className="z-10 mt-4 flex items-center justify-between w-full pt-3 border-t border-[#EAE2D2] text-[11px] font-sans-ui text-[#7A7365]">
                <div className="flex items-center gap-1.5">
                  <span>Speed:</span>
                  {[0.9, 1.0, 1.1].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackSpeed(rate)}
                      className={`px-1.5 py-0.5 rounded ${
                        playbackSpeed === rate ? 'bg-[#22201D] text-white font-medium' : 'hover:bg-[#EAE2D2]'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {assistantStatus === 'speaking' && (
                  <button
                    onClick={stopAudioPlayback}
                    className="flex items-center gap-1 text-[#9B7B4B] hover:text-[#7A5F35] font-medium"
                  >
                    <Pause className="w-3 h-3" /> Stop Voice
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Transcript & Text Input */}
            <div className="bg-white/80 border border-[#E9E1D2] rounded-3xl p-5 shadow-xs flex flex-col h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE4D5]">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#9B7B4B]" />
                  <h3 className="font-serif-display text-base font-semibold text-[#201D1A]">
                    Dialogue Transcript
                  </h3>
                </div>
                <button
                  onClick={() => {
                    stopAudioPlayback();
                    setMessages([messages[0]]);
                  }}
                  className="text-[11px] font-sans-ui text-[#8B8374] hover:text-[#201D1A]"
                >
                  Reset
                </button>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm font-serif-body leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#22201D] text-[#FAF8F5] rounded-br-xs'
                          : 'bg-[#F6F1E7] text-[#22201D] border border-[#E9E0CF] rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1 text-[10px] font-sans-ui text-[#908879]">
                      <span>{msg.role === 'user' ? 'You' : 'Leenu'}</span>
                      {msg.language && (
                        <span className="uppercase text-[9px] px-1 rounded bg-[#EAE2D2] text-[#635B4E]">
                          {msg.language}
                        </span>
                      )}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleReplayMessage(msg)}
                          className="hover:text-[#201D1A] flex items-center gap-0.5 ml-1"
                          title="Replay audio"
                        >
                          <Play className="w-2.5 h-2.5 text-[#9B7B4B]" /> Speak
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {assistantStatus === 'thinking' && (
                  <div className="flex items-center gap-2 text-xs font-serif-body text-[#787163] italic p-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#9B7B4B] animate-spin" />
                    <span>Leenu is composing her thoughts...</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="pt-2 border-t border-[#ECE4D5] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    languageMode === 'et'
                      ? "Küsi Laureeni EBS-i õpingute või laskesuusatamise kohta..."
                      : "Ask Leenu about Laureen's EBS studies, biathlon, or investing..."
                  }
                  className="flex-1 bg-[#FAF8F5] border border-[#E0D7C6] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-serif-body placeholder:text-[#A0988A] focus:outline-none focus:border-[#9B7B4B] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-[#22201D] text-white hover:bg-[#38342F] disabled:opacity-40 disabled:hover:bg-[#22201D] transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Prompt Starters */}
            <div className="space-y-2">
              <span className="text-[11px] font-sans-ui text-[#8B8374] uppercase tracking-wider font-semibold">
                Curated Conversation Topics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "EBS Impactful Entrepreneurship", q: "How are you combining your elite biathlon career with studying Impactful Entrepreneurship at EBS?" },
                  { label: "Youth Olympic Games (Gangwon)", q: "What was your experience like finishing 12th at the Youth Olympic Games?" },
                  { label: "Õpingud EBS-is & Ettevõtlus (ET)", q: "Miks valisid Estonian Business Schooli ja mida kujutab endast mõjusa ettevõtluse eriala?", lang: 'et' as const },
                  { label: "Aktsiatesse investeerimine (ET)", q: "Kuidas sa alustasid aktsiatesse investeerimist ja mida Investor Toomase kursuselt õppisid?", lang: 'et' as const },
                  { label: "Athlete Discipline & Business", q: "How does the mental toughness of biathlon help you succeed in business school?" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.q, item.lang)}
                    className="text-xs font-serif-body px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EDE2] border border-[#E5DCCB] text-[#3A3630] transition-colors text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Credentials, Athletic Portfolio & Academic Dossier */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Executive Bio Hero Card */}
            <div className="bg-white/80 border border-[#E9E1D2] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#ECE4D5] pb-5">
                <div>
                  <span className="font-sans-ui text-xs font-semibold text-[#9B7B4B] tracking-wider uppercase">
                    Representative Biography
                  </span>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F1D1A] mt-1">
                    Laureen Simberg
                  </h2>
                  <p className="font-serif-body text-base text-[#6E6657] italic mt-1">
                    &ldquo;Excellence is forged when relentless athletic discipline meets impactful entrepreneurship.&rdquo;
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col items-end gap-2">
                  <button
                    onClick={() => setIsCVModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6F1E7] border border-[#DDD3C2] hover:bg-[#EDE5D6] text-xs font-sans-ui font-medium text-[#2C2925] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#9B7B4B]" />
                    <span>View Verified CV</span>
                  </button>
                  <a
                    href={LAUREEN_PROFILE.cvPdfUrl}
                    download="Laureen_Simberg_CV.pdf"
                    className="flex items-center gap-1 text-[11px] font-sans-ui text-[#9B7B4B] hover:underline"
                  >
                    <Download className="w-3 h-3" /> Download Verified PDF
                  </a>
                </div>
              </div>

              {/* Dual-Language Executive Summary */}
              <div className="mt-5 space-y-4 font-serif-body text-sm sm:text-base leading-relaxed text-[#35322D]">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <div className="font-sans-ui text-[11px] font-semibold text-[#8B6E3F] uppercase tracking-wider mb-1">
                    English Overview
                  </div>
                  <p>{LAUREEN_PROFILE.profile.en}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <div className="font-sans-ui text-[11px] font-semibold text-[#8B6E3F] uppercase tracking-wider mb-1">
                    Eestikeelne profiil
                  </div>
                  <p className="italic text-[#4F4A41]">{LAUREEN_PROFILE.profile.et}</p>
                </div>
              </div>

              {/* Core Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#ECE4D5] text-center font-serif-display">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <div className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">12th</div>
                  <div className="text-[11px] font-sans-ui text-[#7A7366] mt-0.5">Youth Olympics</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <div className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">3×</div>
                  <div className="text-[11px] font-sans-ui text-[#7A7366] mt-0.5">Baltic Champion</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <div className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">IBU & EYOF</div>
                  <div className="text-[11px] font-sans-ui text-[#7A7366] mt-0.5">World Junior Team</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D6]">
                  <div className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">EBS</div>
                  <div className="text-[11px] font-sans-ui text-[#7A7366] mt-0.5">Impactful Entrep.</div>
                </div>
              </div>
            </div>

            {/* Dossier Tabs: Biathlon, Business, Skills, References */}
            <DossierTabs onAskQuestion={(q, lang) => handleSendMessage(q, lang)} />

            {/* Quick Contact & Verification Footer Banner */}
            <div className="bg-[#FAF8F5] border border-[#E6DDCF] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans-ui text-xs text-[#6F6759]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DC] flex items-center justify-center text-[#84673B]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#201D1A]">Verified Candidate Dossier</div>
                  <div>EBS Student • Team Estonia • Tallinn</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${LAUREEN_PROFILE.email}?subject=Inquiry%20regarding%20Laureen%20Simberg`}
                  className="px-4 py-2 rounded-xl bg-[#22201D] hover:bg-[#38342F] text-white font-medium transition-colors"
                >
                  Email Laureen Directly
                </a>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-[#ECE5D8] bg-[#FAF8F5] py-6 px-4 text-center font-sans-ui text-xs text-[#827A6D]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-serif-display text-sm font-semibold tracking-wider text-[#22201D]">
            LAUREEN SIMBERG • ESTONIAN NATIONAL JUNIOR BIATHLETE
          </div>
          <div>
            Powered by Voice Assistant <span className="font-medium text-[#22201D]">Leenu</span> • Estonian Business School (EBS)
          </div>
          <div className="flex items-center gap-4 text-[#665F53]">
            <button onClick={() => setIsCVModalOpen(true)} className="hover:underline">
              View CV
            </button>
            <a href={`mailto:${LAUREEN_PROFILE.email}`} className="hover:underline">
              {LAUREEN_PROFILE.email}
            </a>
          </div>
        </div>
      </footer>

      {/* Official CV Document Modal */}
      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
    </div>
  );
}
