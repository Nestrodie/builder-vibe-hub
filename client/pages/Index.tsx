import React, { useState, useEffect } from 'react';
import { Copy, Check, Play, Plus, Minus, Clock, Trash2 } from 'lucide-react';

type WidgetType = 'time' | 'habit' | 'countdown' | 'progress';

interface Counter {
  id: string;
  title: string;
  type: string;
  value: number;
}

interface BlockConfig {
  type: WidgetType;
  title: string;
  emoji: string;
  color: string;
  darkMode: boolean;
  
  // Time specific
  hoursplatform?: number;
  minutes?: number;
  font?: string;
  
  // Habit specific  
  increaseBy?: number;
  goal?: number;
  
  // Countdown specific
  countdownMinutes?: number;
  seconds?: number;
  
  // Progress specific
  startDate?: string;
  endDate?: string;
  counters?: Counter[];
}

const blockTypes = [
  {
    id: 'time',
    name: 'Time Block',
    description: 'Track time with custom settings',
    color: '#10b981',
    emoji: '🐸'
  },
  {
    id: 'habit',
    name: 'Habit/Goal Block', 
    description: 'Build better habits day by day',
    color: '#10b981',
    emoji: '🐼'
  },
  {
    id: 'countdown',
    name: 'Countdown Block',
    description: 'Focus with pomodoro technique',
    color: '#10b981',
    emoji: '🐼'
  },
  {
    id: 'progress',
    name: 'Progress Block',
    description: 'Track progress towards your goals',
    color: '#10b981',
    emoji: '📊'
  }
];

const colorOptions = [
  '#9ca3af', '#6b7280', '#4b5563', '#374151', '#f87171', '#fb923c', '#fbbf24',
  '#facc15', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', 
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

const timeBlockIcons = [
  '⏰', '⏱️', '⌚', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕'
];

const emojiIcons = [
  '🐼', '😊', '😎', '🍰', '😋', '🤩', '🥰',
  '😴', '🤢', '⭐', '📚', '⏰', '📱', '💎',
  '🅰️', '🍔', '💻', '🥛', '🍷', '🍹'
];

export default function Index() {
  const [selectedBlock, setSelectedBlock] = useState<WidgetType>('time');
  const [config, setConfig] = useState<BlockConfig>({
    type: 'time',
    title: 'Block title',
    emoji: '🐸',
    color: '#10b981',
    darkMode: false,
    hoursplatform: 0,
    minutes: 0,
    font: '🐸',
    increaseBy: 1,
    goal: 2,
    countdownMinutes: 2,
    seconds: 0,
    startDate: '2024-07-30',
    endDate: '2024-08-13',
    counters: []
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
        emoji: selectedType.emoji
      }));
    }
  }, [selectedBlock]);

  const generateUrl = () => {
    const params = new URLSearchParams();
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'counters') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value.toString());
        }
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

  const addCounter = () => {
    const newCounter: Counter = {
      id: Date.now().toString(),
      title: '',
      type: 'Count',
      value: 0
    };
    setConfig(prev => ({
      ...prev,
      counters: [...(prev.counters || []), newCounter]
    }));
  };

  const updateCounter = (id: string, field: keyof Counter, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      counters: prev.counters?.map(counter => 
        counter.id === id ? { ...counter, [field]: value } : counter
      )
    }));
  };

  const removeCounter = (id: string) => {
    setConfig(prev => ({
      ...prev,
      counters: prev.counters?.filter(counter => counter.id !== id)
    }));
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
          {/* Configuration Panel */}
          <div className="max-w-md space-y-6">
            {/* Block Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value as WidgetType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                {blockTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Block title"
              />
            </div>

            {/* Type-specific settings */}
            {config.type === 'time' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours platform</label>
                  <select
                    value={config.hoursplatform || 0}
                    onChange={(e) => setConfig(prev => ({ ...prev, hoursplatform: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                  <select
                    value={config.minutes || 0}
                    onChange={(e) => setConfig(prev => ({ ...prev, minutes: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    {Array.from({length: 60}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {config.type === 'habit' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Increase by</label>
                  <input
                    type="number"
                    value={config.increaseBy || 1}
                    onChange={(e) => setConfig(prev => ({ ...prev, increaseBy: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                  <input
                    type="number"
                    value={config.goal || 2}
                    onChange={(e) => setConfig(prev => ({ ...prev, goal: parseInt(e.target.value) || 2 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </>
            )}

            {config.type === 'countdown' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                  <input
                    type="number"
                    value={config.countdownMinutes || 2}
                    onChange={(e) => setConfig(prev => ({ ...prev, countdownMinutes: parseInt(e.target.value) || 2 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
                  <select
                    value={config.seconds || 0}
                    onChange={(e) => setConfig(prev => ({ ...prev, seconds: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    {Array.from({length: 60}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {config.type === 'progress' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
                  <input
                    type="datetime-local"
                    value={config.startDate ? `${config.startDate}T10:41` : '2024-07-30T10:41'}
                    onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value.split('T')[0] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End</label>
                  <input
                    type="datetime-local"
                    value={config.endDate ? `${config.endDate}T10:41` : '2024-08-13T10:41'}
                    onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value.split('T')[0] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Counters Table */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Counters</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700">
                        <span>TITLE</span>
                        <span>TYPE</span>
                        <span>VALUE</span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {config.counters?.map((counter) => (
                        <div key={counter.id} className="px-3 py-2">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <input
                              type="text"
                              value={counter.title}
                              onChange={(e) => updateCounter(counter.id, 'title', e.target.value)}
                              className="text-xs border border-gray-200 rounded px-2 py-1"
                              placeholder="Title"
                            />
                            <select
                              value={counter.type}
                              onChange={(e) => updateCounter(counter.id, 'type', e.target.value)}
                              className="text-xs border border-gray-200 rounded px-2 py-1"
                            >
                              <option value="Count">Count</option>
                              <option value="Time">Time</option>
                              <option value="Progress">Progress</option>
                            </select>
                            <input
                              type="number"
                              value={counter.value}
                              onChange={(e) => updateCounter(counter.id, 'value', parseInt(e.target.value) || 0)}
                              className="text-xs border border-gray-200 rounded px-2 py-1"
                            />
                            <button
                              onClick={() => removeCounter(counter.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-3 py-2 border-t border-gray-300">
                      <button
                        onClick={addCounter}
                        className="text-sm text-teal-600 hover:text-teal-800"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Dark Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dark mode</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.darkMode}
                  onChange={(e) => setConfig(prev => ({ ...prev, darkMode: e.target.checked }))}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">Enable dark mode</span>
              </label>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setConfig(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      config.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Icon/Font Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {config.type === 'time' ? 'Icon' : 'Icon'}
              </label>
              <div className="grid grid-cols-7 gap-2">
                {(config.type === 'time' ? timeBlockIcons : emojiIcons).map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      emoji: icon,
                      ...(config.type === 'time' ? { font: icon } : {})
                    }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-all text-lg flex items-center justify-center ${
                      config.emoji === icon ? 'border-gray-400 bg-gray-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateUrl}
              className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Generate embed link
            </button>

            {/* Generated URL */}
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

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="space-y-4">
              <div className="text-sm text-red-500 flex items-center space-x-1">
                <span>Sponsored by</span>
                <span className="text-red-600">❤️</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 text-xs">?</span>
                </div>
                <span className="font-medium">Inline Help</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Answer customer questions before they ask.<br/>
                Connect your Notion Knowledge base (new blogs so on advanced 
                customer support tool that you to provide better customer 
                support.) to your or automation, edit.
              </p>
              
              <BlockPreview config={config} currentTime={currentTime} />
              
              <div className="text-xs text-gray-500 font-mono break-all">
                https://getkairo.com/embed/type={config.type}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Copy className="w-3 h-3" />
                <span>Copy this link</span>
              </div>
              <p className="text-xs text-gray-600">
                In Notion add an 'embed block' and paste this URL.
              </p>
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
  const [localCurrent, setLocalCurrent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState((config.countdownMinutes || 2) * 60);

  useEffect(() => {
    setTimeLeft((config.countdownMinutes || 2) * 60);
  }, [config.countdownMinutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBlock = () => {
    const bgColor = config.darkMode ? '#1f2937' : config.color;
    const textColor = config.darkMode ? 'white' : 'white';

    switch (config.type) {
      case 'time':
        const displayTime = config.hoursplatform !== undefined && config.minutes !== undefined
          ? `${config.hoursplatform.toString().padStart(2, '0')}:${config.minutes.toString().padStart(2, '0')}:00`
          : currentTime;
        const bottomTime = config.hoursplatform !== undefined && config.minutes !== undefined
          ? `${config.hoursplatform.toString().padStart(2, '0')}:${config.minutes.toString().padStart(2, '0')}:00`
          : '02:00:00';

        return (
          <div className="relative w-full h-48 overflow-hidden rounded-xl" style={{ backgroundColor: bgColor }}>
            {/* Gradient background layers */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${bgColor}dd 0%, ${bgColor}bb 50%, ${bgColor}ee 100%)`
              }}
            />

            {/* Animated wave layers */}
            <div className="absolute inset-0">
              {/* First wave layer */}
              <div
                className="absolute bottom-0 w-full h-32 opacity-60"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${bgColor}aa 50%, ${bgColor} 100%)`,
                  clipPath: 'polygon(0 40%, 25% 35%, 50% 45%, 75% 35%, 100% 50%, 100% 100%, 0 100%)',
                  animation: 'wave1 4s ease-in-out infinite'
                }}
              />

              {/* Second wave layer */}
              <div
                className="absolute bottom-0 w-full h-28 opacity-40"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${bgColor}77 50%, ${bgColor}dd 100%)`,
                  clipPath: 'polygon(0 60%, 30% 50%, 60% 65%, 90% 45%, 100% 55%, 100% 100%, 0 100%)',
                  animation: 'wave2 6s ease-in-out infinite reverse'
                }}
              />

              {/* Third wave layer */}
              <div
                className="absolute bottom-0 w-full h-24 opacity-30"
                style={{
                  background: `linear-gradient(180deg, transparent 20%, ${bgColor}44 60%, ${bgColor}bb 100%)`,
                  clipPath: 'polygon(0 70%, 20% 60%, 40% 75%, 70% 55%, 100% 65%, 100% 100%, 0 100%)',
                  animation: 'wave3 8s ease-in-out infinite'
                }}
              />
            </div>

            {/* Floating bubbles/dots */}
            <div className="absolute inset-0">
              <div
                className="absolute w-2 h-2 rounded-full opacity-60"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  top: '20%',
                  left: '15%',
                  animation: 'float1 3s ease-in-out infinite'
                }}
              />
              <div
                className="absolute w-1.5 h-1.5 rounded-full opacity-50"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  top: '60%',
                  right: '20%',
                  animation: 'float2 4s ease-in-out infinite'
                }}
              />
              <div
                className="absolute w-1 h-1 rounded-full opacity-70"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  top: '40%',
                  right: '10%',
                  animation: 'float3 2.5s ease-in-out infinite'
                }}
              />
              <div
                className="absolute w-1.5 h-1.5 rounded-full opacity-40"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  bottom: '30%',
                  left: '25%',
                  animation: 'float1 3.5s ease-in-out infinite'
                }}
              />
            </div>

            {/* Content layer */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between p-4 text-white">
              {/* Top time display */}
              <div className="text-lg font-mono font-bold mt-2">
                {displayTime}
              </div>

              {/* Block title */}
              <div className="text-sm font-medium">
                {config.title}
              </div>

              {/* Character in center */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                  {/* Character body */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      border: '2px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Character face - using selected emoji/font */}
                    <div className="text-2xl">{config.emoji}</div>
                  </div>

                  {/* Character details - small white elements around */}
                  <div
                    className="absolute -left-1 top-6 w-3 h-3 rounded-full opacity-80"
                    style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                  />
                  <div
                    className="absolute -right-1 top-6 w-3 h-3 rounded-full opacity-80"
                    style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                  />
                </div>
              </div>

              {/* Bottom time display */}
              <div
                className="text-sm font-mono font-semibold px-3 py-1 rounded"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {bottomTime}
              </div>
            </div>

            {/* Add styles for animations */}
            <style jsx>{`
              @keyframes wave1 {
                0%, 100% { transform: translateX(0) scaleY(1); }
                50% { transform: translateX(-10px) scaleY(1.1); }
              }
              @keyframes wave2 {
                0%, 100% { transform: translateX(0) scaleY(1); }
                50% { transform: translateX(15px) scaleY(0.9); }
              }
              @keyframes wave3 {
                0%, 100% { transform: translateX(0) scaleY(1); }
                50% { transform: translateX(-5px) scaleY(1.05); }
              }
              @keyframes float1 {
                0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
                50% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
              }
              @keyframes float2 {
                0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
                50% { transform: translateY(-8px) scale(1.2); opacity: 0.7; }
              }
              @keyframes float3 {
                0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
                50% { transform: translateY(-6px) scale(1.15); opacity: 0.9; }
              }
            `}</style>
          </div>
        );

      case 'habit':
        return (
          <div className="flex items-center justify-between p-4" style={{ backgroundColor: bgColor, color: textColor }}>
            <div className="text-2xl">{config.emoji}</div>
            <div className="text-center flex-1">
              <div className="text-xl font-bold">
                {localCurrent}/{config.goal || 2}
              </div>
              <div className="text-sm">{config.title}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded p-1">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        );

      case 'countdown':
        return (
          <div className="flex items-center justify-between p-4" style={{ backgroundColor: bgColor, color: textColor }}>
            <div className="text-2xl">{config.emoji}</div>
            <div className="text-center flex-1">
              <div className="text-xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm">{config.title}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded p-2 flex items-center">
              <Play className="w-4 h-4" />
            </div>
          </div>
        );

      case 'progress':
        const progressPercent = config.counters?.length ?
          Math.round((config.counters.reduce((sum, c) => sum + c.value, 0) / config.counters.length) * 10) : 0;

        return (
          <div className="p-4 space-y-3" style={{ backgroundColor: bgColor, color: textColor }}>
            <div className="flex items-center justify-between">
              <div className="text-lg">{config.emoji}</div>
              <div className="text-sm">{config.title}</div>
            </div>
            <div className="text-2xl font-bold">{progressPercent}%</div>
            <div className="text-xs opacity-75">
              13d, 23h, 59m
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-xs">
      {renderBlock()}
    </div>
  );
}
