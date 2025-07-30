import React, { useState, useEffect } from 'react';
import { Copy, Check, Play, Plus, Minus, Clock } from 'lucide-react';

type WidgetType = 'time' | 'habit' | 'countdown' | 'goal';

interface BlockConfig {
  type: WidgetType;
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

const blockTypes = [
  {
    id: 'time',
    name: 'Time tracker',
    description: 'Track time spent on activities',
    color: '#6366f1',
    emoji: '⏰'
  },
  {
    id: 'habit',
    name: 'Habit tracker', 
    description: 'Build better habits day by day',
    color: '#10b981',
    emoji: '✅'
  },
  {
    id: 'countdown',
    name: 'Countdown timer',
    description: 'Focus with pomodoro technique',
    color: '#f59e0b',
    emoji: '⏱️'
  },
  {
    id: 'goal',
    name: 'Goal tracker',
    description: 'Track progress towards your goals',
    color: '#8b5cf6',
    emoji: '🎯'
  }
];

export default function Index() {
  const [selectedBlock, setSelectedBlock] = useState<WidgetType>('time');
  const [config, setConfig] = useState<BlockConfig>({
    type: 'time',
    title: 'Daily Focus',
    emoji: '⏰',
    color: '#6366f1',
    showCurrentTime: true,
    current: 5,
    target: 10,
    minutes: 25,
    seconds: 0,
    progress: 65,
    description: 'Project completion'
  });
  
  const [currentTime, setCurrentTime] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

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
    const selectedType = blockTypes.find(b => b.id === selectedBlock);
    if (selectedType) {
      setConfig(prev => ({
        ...prev,
        type: selectedBlock,
        color: selectedType.color,
        emoji: selectedType.emoji
      }));
    }
  }, [selectedBlock]);

  const generateUrl = () => {
    const params = new URLSearchParams();
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    const url = `${window.location.origin}/widget?${params.toString()}`;
    setGeneratedUrl(url);
  };

  const copyUrl = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-semibold text-gray-900">Kairo</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-900 font-medium border-b-2 border-teal-500">Notion blocks</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-red-500 flex items-center space-x-2 hover:text-red-600">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Play className="w-2 h-2 text-white fill-white" />
                </div>
                <span>Watch video</span>
              </button>
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
                Start trial
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                Log in
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Notion blocks for time, habit and goal tracking
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Embed productivity blocks on any Notion page and Notion template.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Block Types */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose your block type</h2>
            <div className="grid grid-cols-1 gap-4">
              {blockTypes.map((block) => (
                <button
                  key={block.id}
                  onClick={() => setSelectedBlock(block.id as WidgetType)}
                  className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    selectedBlock === block.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${block.color}20` }}
                    >
                      {block.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{block.name}</h3>
                      <p className="text-gray-600 text-sm">{block.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Configuration */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Customize your block</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block title</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter block title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <input
                  type="text"
                  value={config.emoji}
                  onChange={(e) => setConfig(prev => ({ ...prev, emoji: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter emoji"
                />
              </div>

              {config.type === 'habit' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current</label>
                    <input
                      type="number"
                      value={config.current || 0}
                      onChange={(e) => setConfig(prev => ({ ...prev, current: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                    <input
                      type="number"
                      value={config.target || 10}
                      onChange={(e) => setConfig(prev => ({ ...prev, target: parseInt(e.target.value) || 10 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              )}

              {config.type === 'countdown' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                    <input
                      type="number"
                      value={config.minutes || 25}
                      onChange={(e) => setConfig(prev => ({ ...prev, minutes: parseInt(e.target.value) || 25 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
                    <input
                      type="number"
                      value={config.seconds || 0}
                      onChange={(e) => setConfig(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              )}

              {config.type === 'goal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.progress || 0}
                    onChange={(e) => setConfig(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              )}

              <button
                onClick={generateUrl}
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Generate embed link
              </button>

              {generatedUrl && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Embed link</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={generatedUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={copyUrl}
                      className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                    </button>
                  </div>
                  {copied && <p className="text-sm text-green-600">✓ Copied to clipboard</p>}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preview</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <BlockPreview config={config} currentTime={currentTime} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-24"></div>
    </div>
  );
}

interface BlockPreviewProps {
  config: BlockConfig;
  currentTime: string;
}

function BlockPreview({ config, currentTime }: BlockPreviewProps) {
  const [localCurrent, setLocalCurrent] = useState(config.current || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState((config.minutes || 25) * 60 + (config.seconds || 0));

  useEffect(() => {
    setLocalCurrent(config.current || 0);
  }, [config.current]);

  useEffect(() => {
    setTimeLeft((config.minutes || 25) * 60 + (config.seconds || 0));
  }, [config.minutes, config.seconds]);

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
          <div className="text-center space-y-4">
            <div className="text-4xl">{config.emoji}</div>
            <div className="text-3xl font-mono font-bold text-gray-900">
              {currentTime}
            </div>
            <div className="text-lg font-medium text-gray-700">
              {config.title}
            </div>
          </div>
        );

      case 'habit':
        return (
          <div className="flex items-center justify-between">
            <div className="text-3xl">{config.emoji}</div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {localCurrent} / {config.target || 10}
              </div>
              <div className="text-sm text-gray-600">{config.title}</div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setLocalCurrent(localCurrent + 1)}
                className="w-8 h-8 bg-teal-500 text-white rounded-md flex items-center justify-center hover:bg-teal-600"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocalCurrent(Math.max(0, localCurrent - 1))}
                className="w-8 h-8 bg-gray-300 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-400"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 'countdown':
        return (
          <div className="flex items-center justify-between">
            <div className="text-3xl">{config.emoji}</div>
            <div className="text-center flex-1">
              <div className="text-2xl font-mono font-bold text-gray-900 mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">{config.title}</div>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>
          </div>
        );

      case 'goal':
        return (
          <div className="text-center space-y-4">
            <div className="text-4xl">{config.emoji}</div>
            <div className="text-3xl font-bold text-gray-900">
              {config.progress || 0}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${config.progress || 0}%`,
                  backgroundColor: config.color 
                }}
              />
            </div>
            <div className="text-lg font-medium text-gray-700">
              {config.title}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="p-6 rounded-lg"
      style={{ backgroundColor: `${config.color}10` }}
    >
      {renderBlock()}
    </div>
  );
}
