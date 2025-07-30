import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Pause, Plus, Minus, RotateCcw } from 'lucide-react';

interface BlockConfig {
  type: string;
  title: string;
  emoji: string;
  color: string;
  
  // Time specific
  showCurrentTime?: boolean;
  
  // Habit specific  
  current?: number;
  target?: number;
  
  // Countdown specific
  minutes?: number;
  seconds?: number;
  
  // Goal specific
  progress?: number;
  description?: string;
}

export default function Widget() {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState<BlockConfig>({
    type: 'time',
    title: 'Daily Focus',
    emoji: '⏰',
    color: '#6366f1'
  });

  const [currentTime, setCurrentTime] = useState('');
  const [localCurrent, setLocalCurrent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes default

  useEffect(() => {
    // Parse URL parameters
    const newConfig: BlockConfig = {
      type: searchParams.get('type') || 'time',
      title: searchParams.get('title') || 'Daily Focus',
      emoji: searchParams.get('emoji') || '⏰',
      color: searchParams.get('color') || '#6366f1',
      showCurrentTime: searchParams.get('showCurrentTime') === 'true',
      current: parseInt(searchParams.get('current') || '0'),
      target: parseInt(searchParams.get('target') || '10'),
      minutes: parseInt(searchParams.get('minutes') || '25'),
      seconds: parseInt(searchParams.get('seconds') || '0'),
      progress: parseInt(searchParams.get('progress') || '0'),
      description: searchParams.get('description') || ''
    };
    
    setConfig(newConfig);
    setLocalCurrent(newConfig.current || 0);
    setTimeLeft((newConfig.minutes || 25) * 60 + (newConfig.seconds || 0));
  }, [searchParams]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBlock = () => {
    switch (config.type) {
      case 'time':
        return (
          <div className="text-center space-y-6 p-8">
            <div className="text-5xl">{config.emoji}</div>
            <div className="text-4xl font-mono font-bold text-gray-900">
              {currentTime}
            </div>
            <div className="text-xl font-semibold text-gray-700">
              {config.title}
            </div>
          </div>
        );

      case 'habit':
        return (
          <div className="flex items-center justify-between p-6">
            <div className="text-4xl">{config.emoji}</div>
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {localCurrent} / {config.target || 10}
              </div>
              <div className="text-lg text-gray-600">{config.title}</div>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setLocalCurrent(localCurrent + 1)}
                className="w-10 h-10 bg-teal-500 text-white rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLocalCurrent(Math.max(0, localCurrent - 1))}
                className="w-10 h-10 bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-400 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 'countdown':
        return (
          <div className="flex items-center justify-between p-6">
            <div className="text-4xl">{config.emoji}</div>
            <div className="text-center flex-1">
              <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-gray-600">{config.title}</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => {
                  setTimeLeft((config.minutes || 25) * 60 + (config.seconds || 0));
                  setIsRunning(false);
                }}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="text-center space-y-6 p-8">
            <div className="text-5xl">{config.emoji}</div>
            <div className="text-4xl font-bold text-gray-900">
              {config.progress || 0}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{ 
                  width: `${config.progress || 0}%`,
                  backgroundColor: config.color 
                }}
              />
            </div>
            <div className="text-xl font-semibold text-gray-700">
              {config.title}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ borderTop: `4px solid ${config.color}` }}
        >
          {renderBlock()}
        </div>
      </div>
    </div>
  );
}
