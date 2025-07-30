import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Minus, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type WidgetType = 'basic' | 'counter' | 'timer' | 'progress';

interface WidgetConfig {
  type: WidgetType;
  title: string;
  color: string;
  icon: string;
  size: 'small' | 'medium' | 'large';
  value: number;
  target: number;
  increment: number;
}

export default function Widget() {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState<WidgetConfig>({
    type: 'basic',
    title: 'Daily Goal',
    color: '#8B5CF6',
    icon: '🚀',
    size: 'medium',
    value: 0,
    target: 10,
    increment: 1,
  });

  const [localValue, setLocalValue] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    // Parse URL parameters
    const newConfig: WidgetConfig = {
      type: (searchParams.get('type') as WidgetType) || 'basic',
      title: searchParams.get('title') || 'Daily Goal',
      color: searchParams.get('color') || '#8B5CF6',
      icon: searchParams.get('icon') || '🚀',
      size: (searchParams.get('size') as 'small' | 'medium' | 'large') || 'medium',
      value: parseInt(searchParams.get('value') || '0'),
      target: parseInt(searchParams.get('target') || '10'),
      increment: parseInt(searchParams.get('increment') || '1'),
    };
    
    setConfig(newConfig);
    setLocalValue(newConfig.value);
  }, [searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWidgetSize = () => {
    switch (config.type) {
      case 'basic':
        return 'aspect-[5/4] w-full max-w-[300px]';
      case 'counter':
        return 'aspect-[5/3] w-full max-w-[320px]';
      case 'timer':
        return 'aspect-[5/2] w-full max-w-[400px]';
      case 'progress':
        return 'aspect-[5/4] w-full max-w-[300px]';
      default:
        return 'aspect-square w-full max-w-[250px]';
    }
  };

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const progressPercentage = Math.min(100, Math.round((localValue / config.target) * 100));

  const renderWidgetContent = () => {
    switch (config.type) {
      case 'counter':
        return (
          <>
            <div className={cn("text-5xl mb-4", getSizeClasses())}>{config.icon}</div>
            <div className={cn("text-3xl font-bold text-white mb-2", getSizeClasses())}>
              {localValue} / {config.target}
            </div>
            <div className={cn("text-lg text-white/90 mb-6", getSizeClasses())}>{config.title}</div>
            <div className="flex gap-3 w-full max-w-[200px]">
              <button
                onClick={() => setLocalValue(Math.max(0, localValue - config.increment))}
                className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl py-3 text-white transition-all duration-200 hover:scale-105"
              >
                <Minus className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setLocalValue(localValue + config.increment)}
                className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl py-3 text-white transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </>
        );
      
      case 'timer':
        return (
          <div className="flex items-center justify-between w-full h-full px-6">
            <div className="flex-1">
              <div className={cn("text-4xl mb-2", getSizeClasses())}>{config.icon}</div>
              <div className={cn("text-lg font-semibold text-white/90", getSizeClasses())}>
                {config.title}
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className={cn("text-3xl font-mono font-bold text-white mb-4", getSizeClasses())}>
                {formatTime(timeLeft)}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-white transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setTimeLeft(3600);
                    setIsTimerRunning(false);
                  }}
                  className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'progress':
        return (
          <>
            <div className={cn("text-5xl mb-4", getSizeClasses())}>{config.icon}</div>
            <div className={cn("text-3xl font-bold text-white mb-2", getSizeClasses())}>
              {progressPercentage}%
            </div>
            <div className={cn("text-lg text-white/90 mb-4", getSizeClasses())}>{config.title}</div>
            <div className="w-full max-w-[200px] bg-white/20 rounded-full h-3 mb-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className={cn("text-sm text-white/70", getSizeClasses())}>
              {localValue} of {config.target} completed
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setLocalValue(Math.max(0, localValue - 1))}
                className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-105"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocalValue(Math.min(config.target, localValue + 1))}
                className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </>
        );
      
      default: // basic
        return (
          <>
            <div className={cn("text-6xl mb-6", getSizeClasses())}>{config.icon}</div>
            <div className={cn("text-2xl font-bold text-white mb-2", getSizeClasses())}>
              {config.title}
            </div>
            <div className={cn("text-lg text-white/80", getSizeClasses())}>
              Basic Widget
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-300",
          "flex flex-col items-center justify-center text-center",
          getWidgetSize()
        )}
        style={{
          background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
          boxShadow: `0 25px 50px -12px ${config.color}40`,
        }}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <div 
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div 
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          {renderWidgetContent()}
        </div>

        {/* Subtle border glow */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
          }}
        />
      </div>
    </div>
  );
}
