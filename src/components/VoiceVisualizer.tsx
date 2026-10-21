import React from 'react';

interface VoiceVisualizerProps {
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
  audioLevel?: number;
  barCount?: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  status,
  audioLevel = 0,
  barCount = 28,
}) => {
  // Generate harmonious heights for the audio waves
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Normal distribution curve so center is taller
    const centerFactor = Math.sin((i / (barCount - 1)) * Math.PI);
    let height = 6;

    if (status === 'speaking') {
      const dynamicMultiplier = 1 + (audioLevel > 0 ? audioLevel * 1.5 : 0.8);
      const wave = Math.sin(i * 0.45 + Date.now() * 0.006) * 0.5 + 0.5;
      height = Math.max(8, Math.min(48, centerFactor * 38 * wave * dynamicMultiplier + 6));
    } else if (status === 'listening') {
      const listenWave = Math.sin(i * 0.5 + Date.now() * 0.008) * 0.5 + 0.5;
      height = Math.max(6, Math.min(32, centerFactor * 24 * listenWave + 6));
    } else if (status === 'thinking') {
      const thinkWave = Math.sin(i * 0.3 - Date.now() * 0.005) * 0.5 + 0.5;
      height = Math.max(6, Math.min(22, centerFactor * 18 * thinkWave + 6));
    } else {
      // idle
      const idleWave = Math.sin(i * 0.2 + Date.now() * 0.0015) * 0.5 + 0.5;
      height = Math.max(4, centerFactor * 10 * idleWave + 4);
    }

    return height;
  });

  return (
    <div className="flex items-center justify-center gap-[3px] h-14 px-4 py-2">
      {bars.map((h, idx) => (
        <span
          key={idx}
          className={`w-[3px] rounded-full transition-all duration-150 ${
            status === 'speaking'
              ? 'bg-[#9B7B4B]'
              : status === 'listening'
              ? 'bg-[#B88746] opacity-90'
              : status === 'thinking'
              ? 'bg-[#C7B69C] opacity-75'
              : 'bg-[#DCD4C4] opacity-50'
          }`}
          style={{
            height: `${h}px`,
          }}
        />
      ))}
    </div>
  );
};
