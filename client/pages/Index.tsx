import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Settings,
  Eye,
  Copy,
  Check,
  Box,
  Timer,
  TrendingUp,
  Plus,
  Minus,
  Play,
  Target,
  Clock,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WidgetType = 'timeblock' | 'habit' | 'countdown' | 'progress';

interface WidgetConfig {
  type: WidgetType;
  title: string;
  color: string;
  icon: string;
  darkMode: boolean;

  // TimeBlock specific
  hours?: number;
  minutes?: number;

  // Habit/Wall Block specific
  value?: number;
  target?: number;
  increment?: number;

  // Countdown specific
  countdownMinutes?: number;
  countdownSeconds?: number;

  // Progress specific
  startDate?: string;
  endDate?: string;
  currentProgress?: number;
}

const colorOptions = [
  { name: 'Purple', value: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
  { name: 'Blue', value: '#3B82F6', gradient: 'from-blue-500 to-cyan-600' },
  { name: 'Green', value: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Red', value: '#EF4444', gradient: 'from-red-500 to-pink-600' },
  { name: 'Orange', value: '#F59E0B', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Pink', value: '#EC4899', gradient: 'from-pink-500 to-rose-600' },
];

const iconOptions = ['🚀', '📚', '💪', '🎯', '⏰', '🌟', '💻', '🎨', '🏃‍♂️', '📈'];

const widgetTypes = [
  { id: 'timeblock', name: 'Time Block', icon: Clock, description: 'Display current time with timer' },
  { id: 'habit', name: 'Habit / Wall Block', icon: Target, description: 'Goal tracker with +/- controls and fireworks' },
  { id: 'countdown', name: 'Countdown Block', icon: Timer, description: 'Countdown timer with start/stop' },
  { id: 'progress', name: 'Progress Block', icon: TrendingUp, description: 'Progress tracking with dates' },
];

export default function Index() {
  const [config, setConfig] = useState<WidgetConfig>({
    type: 'timeblock',
    title: 'My Time Block',
    color: '#8B5CF6',
    icon: '⏰',
    darkMode: false,

    // TimeBlock defaults
    hours: 0,
    minutes: 0,

    // Habit Block defaults
    value: 0,
    target: 10,
    increment: 1,

    // Countdown defaults
    countdownMinutes: 25,
    countdownSeconds: 0,

    // Progress defaults
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currentProgress: 0,
  });

  const [selectedWidget, setSelectedWidget] = useState<WidgetType>('timeblock');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedColor = colorOptions.find(c => c.value === config.color) || colorOptions[0];

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const generateWidgetUrl = () => {
    const params = new URLSearchParams({
      type: config.type,
      title: config.title,
      color: config.color,
      icon: config.icon,
      size: config.size,
      value: config.value.toString(),
      target: config.target.toString(),
      increment: config.increment.toString(),
    });
    
    const url = `${window.location.origin}/widget?${params.toString()}`;
    setGeneratedUrl(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getWidgetSize = (type: WidgetType) => {
    switch (type) {
      case 'timeblock':
        return 'aspect-[5/4]'; // 5x4
      case 'habit':
        return 'aspect-[5/3]'; // 5x3
      case 'countdown':
        return 'aspect-[5/2]'; // 5x2
      case 'progress':
        return 'aspect-[5/4]'; // 5x4
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Widget Creator
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create beautiful, customizable widgets for Notion with real-time preview and seamless embedding
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="w-5 h-5" />
                  Widget Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Widget Type Selection */}
                <div>
                  <Label className="text-gray-300 mb-3 block">Widget Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {widgetTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => {
                            updateConfig({ type: type.id as WidgetType });
                            setSelectedWidget(type.id as WidgetType);
                          }}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all hover:scale-105",
                            config.type === type.id
                              ? "border-purple-500 bg-purple-500/20"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          )}
                        >
                          <Icon className="w-6 h-6 text-purple-400 mb-2" />
                          <div className="text-white font-medium">{type.name}</div>
                          <div className="text-gray-400 text-sm">{type.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Settings based on Widget Type */}
                <div className="space-y-4">
                  {/* Common Settings */}
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Block Title</Label>
                    <Input
                      id="title"
                      value={config.title}
                      onChange={(e) => updateConfig({ title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter block title"
                    />
                  </div>

                  {/* Dark/Light Mode Toggle */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Mode</Label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateConfig({ darkMode: false })}
                        className={cn(
                          "flex-1 p-3 rounded-lg border-2 transition-all",
                          !config.darkMode
                            ? "border-purple-500 bg-purple-500/20 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        )}
                      >
                        ☀️ Light Mode
                      </button>
                      <button
                        onClick={() => updateConfig({ darkMode: true })}
                        className={cn(
                          "flex-1 p-3 rounded-lg border-2 transition-all",
                          config.darkMode
                            ? "border-purple-500 bg-purple-500/20 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        )}
                      >
                        🌙 Dark Mode
                      </button>
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Frame Color</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateConfig({ color: color.value })}
                          className={cn(
                            "p-3 rounded-xl border-2 transition-all",
                            config.color === color.value
                              ? "border-white scale-105"
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ background: color.value }}
                        >
                          <div className="text-white font-medium text-sm">{color.name}</div>
                          {config.color === color.value && (
                            <Check className="w-4 h-4 text-white mx-auto mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon/GIF Selection */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Icon / Animated GIF</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => updateConfig({ icon })}
                          className={cn(
                            "p-3 rounded-lg border-2 text-2xl transition-all hover:scale-110",
                            config.icon === icon
                              ? "border-purple-500 bg-purple-500/20"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          )}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <Input
                      value={config.icon}
                      onChange={(e) => updateConfig({ icon: e.target.value })}
                      className="mt-3 bg-white/10 border-white/20 text-white"
                      placeholder="Or enter GIF URL, emoji, or custom icon"
                    />
                  </div>

                  {/* Widget-Specific Settings */}
                  {config.type === 'timeblock' && (
                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <h3 className="text-white font-medium">Time Block Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hours" className="text-gray-300">Hours</Label>
                          <Input
                            id="hours"
                            type="number"
                            min="0"
                            max="23"
                            value={config.hours || 0}
                            onChange={(e) => updateConfig({ hours: parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="minutes" className="text-gray-300">Minutes</Label>
                          <Input
                            id="minutes"
                            type="number"
                            min="0"
                            max="59"
                            value={config.minutes || 0}
                            onChange={(e) => updateConfig({ minutes: parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {config.type === 'habit' && (
                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <h3 className="text-white font-medium">Habit / Wall Block Settings</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="habitValue" className="text-gray-300">Current Value</Label>
                          <Input
                            id="habitValue"
                            type="number"
                            min="0"
                            value={config.value || 0}
                            onChange={(e) => updateConfig({ value: parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="habitTarget" className="text-gray-300">Goal</Label>
                          <Input
                            id="habitTarget"
                            type="number"
                            min="1"
                            value={config.target || 10}
                            onChange={(e) => updateConfig({ target: parseInt(e.target.value) || 1 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="habitIncrement" className="text-gray-300">Increment Step</Label>
                          <Input
                            id="habitIncrement"
                            type="number"
                            min="1"
                            value={config.increment || 1}
                            onChange={(e) => updateConfig({ increment: parseInt(e.target.value) || 1 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {config.type === 'countdown' && (
                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <h3 className="text-white font-medium">Countdown Block Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="countdownMinutes" className="text-gray-300">Minutes</Label>
                          <Input
                            id="countdownMinutes"
                            type="number"
                            min="0"
                            value={config.countdownMinutes || 25}
                            onChange={(e) => updateConfig({ countdownMinutes: parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="countdownSeconds" className="text-gray-300">Seconds</Label>
                          <Input
                            id="countdownSeconds"
                            type="number"
                            min="0"
                            max="59"
                            value={config.countdownSeconds || 0}
                            onChange={(e) => updateConfig({ countdownSeconds: parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {config.type === 'progress' && (
                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <h3 className="text-white font-medium">Progress Block Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={config.startDate || ''}
                            onChange={(e) => updateConfig({ startDate: e.target.value })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={config.endDate || ''}
                            onChange={(e) => updateConfig({ endDate: e.target.value })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="currentProgress" className="text-gray-300">Current Progress (%)</Label>
                        <Input
                          id="currentProgress"
                          type="number"
                          min="0"
                          max="100"
                          value={config.currentProgress || 0}
                          onChange={(e) => updateConfig({ currentProgress: parseInt(e.target.value) || 0 })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateWidgetUrl}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Widget for Notion
                </Button>

                {/* Generated URL */}
                {generatedUrl && (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <Label className="text-green-300 text-sm mb-2 block">Widget URL (Copy and paste as Embed in Notion)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedUrl}
                        readOnly
                        className="bg-black/20 border-green-500/30 text-green-300 font-mono text-sm"
                      />
                      <Button
                        onClick={copyToClipboard}
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-300 hover:bg-green-500/20"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    {copied && (
                      <p className="text-green-300 text-sm mt-2">✅ Copied! Paste as Embed in Notion</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <WidgetPreview config={config} isSelected={true} />
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">How to Use in Notion</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-300">1</Badge>
                    <span>Configure your widget using the controls on the left</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-300">2</Badge>
                    <span>Click "Generate Widget for Notion" to create your embed URL</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-300">3</Badge>
                    <span>Copy the generated URL</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-300">4</Badge>
                    <span>In Notion, type "/embed" and paste the URL</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-300">5</Badge>
                    <span>Your interactive widget will appear in your Notion page!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WidgetPreviewProps {
  config: WidgetConfig;
  isSelected?: boolean;
  onClick?: () => void;
}

function WidgetPreview({ config, isSelected = false, onClick }: WidgetPreviewProps) {
  const [localValue, setLocalValue] = useState(config.value);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [timeLeft, setTimeLeft] = useState('02:18:45');

  useEffect(() => {
    setLocalValue(config.value);
  }, [config.value]);

  // Update current time for TimeBlock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedColor = colorOptions.find(c => c.value === config.color) || colorOptions[0];
  const progressPercentage = Math.min(100, Math.round((localValue / config.target) * 100));

  const renderWidgetContent = () => {
    const textColor = config.darkMode ? 'text-white' : 'text-black';
    const buttonBg = config.darkMode ? 'bg-white/20 hover:bg-white/30' : 'bg-black/20 hover:bg-black/30';

    switch (config.type) {
      case 'timeblock':
        const displayTime = config.hours !== undefined && config.minutes !== undefined
          ? `${config.hours.toString().padStart(2, '0')}:${config.minutes.toString().padStart(2, '0')}:00`
          : currentTime;

        return (
          <div className="flex flex-col items-center justify-center h-full relative">
            {/* Timer above icon */}
            <div className={cn("text-3xl font-mono font-bold mb-4", textColor)}>
              {displayTime}
            </div>
            {/* Icon in center */}
            <div className="text-5xl mb-4">
              {config.icon.startsWith('http') ? (
                <img src={config.icon} alt="icon" className="w-12 h-12 object-cover rounded" />
              ) : (
                config.icon
              )}
            </div>
            {/* Name below icon */}
            <div className={cn("text-lg font-semibold", textColor)}>
              {config.title}
            </div>
          </div>
        );

      case 'habit':
        const isGoalReached = localValue >= (config.target || 10);

        return (
          <div className="flex items-center justify-between h-full w-full px-6 relative">
            {/* Fireworks effect when goal reached */}
            {isGoalReached && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-6xl animate-bounce">🎉</div>
              </div>
            )}

            {/* Icon on left */}
            <div className="text-4xl">
              {config.icon.startsWith('http') ? (
                <img src={config.icon} alt="icon" className="w-10 h-10 object-cover rounded" />
              ) : (
                config.icon
              )}
            </div>

            {/* Value/target in center */}
            <div className={cn("text-2xl font-bold", textColor)}>
              {localValue} / {config.target || 10}
            </div>

            {/* +/- buttons on right */}
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalValue(localValue + (config.increment || 1));
                }}
                className={cn("rounded-lg p-2 transition-colors", buttonBg, textColor)}
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalValue(Math.max(0, localValue - (config.increment || 1)));
                }}
                className={cn("rounded-lg p-2 transition-colors", buttonBg, textColor)}
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 'countdown':
        const totalSeconds = (config.countdownMinutes || 25) * 60 + (config.countdownSeconds || 0);
        const displayMinutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const displaySecs = (totalSeconds % 60).toString().padStart(2, '0');

        return (
          <div className="flex items-center justify-between h-full w-full px-6">
            {/* Icon on left */}
            <div className="text-4xl">
              {config.icon.startsWith('http') ? (
                <img src={config.icon} alt="icon" className="w-10 h-10 object-cover rounded" />
              ) : (
                config.icon
              )}
            </div>

            {/* Timer and title in center */}
            <div className="flex flex-col items-center">
              <div className={cn("text-2xl font-mono font-bold mb-1", textColor)}>
                {displayMinutes}:{displaySecs}
              </div>
              <div className={cn("text-sm", textColor, "opacity-80")}>{config.title}</div>
            </div>

            {/* Start button on right */}
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn("rounded-lg px-4 py-2 transition-colors flex items-center gap-2", buttonBg, textColor)}
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          </div>
        );

      case 'progress':
        const progressPercent = config.currentProgress || 0;
        const startDate = new Date(config.startDate || Date.now());
        const endDate = new Date(config.endDate || Date.now() + 30 * 24 * 60 * 60 * 1000);
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysElapsed = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, totalDays - daysElapsed);

        return (
          <div className="flex flex-col items-center justify-center h-full relative p-4">
            {/* Icon at top */}
            <div className="text-4xl mb-3">
              {config.icon.startsWith('http') ? (
                <img src={config.icon} alt="icon" className="w-10 h-10 object-cover rounded" />
              ) : (
                config.icon
              )}
            </div>
            {/* Percentage */}
            <div className={cn("text-3xl font-bold mb-2", textColor)}>{progressPercent}%</div>
            {/* Title */}
            <div className={cn("text-lg mb-3 text-center", textColor)}>{config.title}</div>
            {/* Progress bar */}
            <div className={cn("w-4/5 rounded-full h-3 mb-3", config.darkMode ? "bg-white/20" : "bg-black/20")}>
              <div
                className={cn("rounded-full h-3 transition-all duration-500", config.darkMode ? "bg-white" : "bg-black")}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Days remaining */}
            <div className={cn("text-sm text-center", textColor, "opacity-70")}>
              {daysRemaining} days remaining
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl mb-3">{config.icon}</div>
            <div className={cn("text-xl font-bold mb-1", textColor)}>{config.title}</div>
            <div className={cn("text-sm", textColor, "opacity-80")}>Time Block</div>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300",
        "flex flex-col items-center justify-center text-center",
        getWidgetSize(config.type),
        isSelected && "ring-2 ring-white/50 scale-105",
        !isSelected && "hover:scale-105"
      )}
      style={{
        background: config.color,
        border: `4px solid ${config.color}`,
      }}
    >
      {/* Inner transparent container */}
      <div
        className={cn(
          "absolute inset-2 rounded-xl transition-all duration-300",
          config.darkMode
            ? "bg-black/10 backdrop-blur-sm border border-white/10"
            : "bg-white/10 backdrop-blur-sm border border-black/10"
        )}
      />

      {/* Water animation effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-float" />
        <div className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-4">
        {renderWidgetContent()}
      </div>
    </div>
  );
}

function getWidgetSize(type: WidgetType) {
  switch (type) {
    case 'basic':
      return 'aspect-[5/4] max-w-[200px]';
    case 'counter':
      return 'aspect-[5/3] max-w-[200px]';
    case 'timer':
      return 'aspect-[5/2] max-w-[200px]';
    case 'progress':
      return 'aspect-[5/4] max-w-[200px]';
    default:
      return 'aspect-square max-w-[200px]';
  }
}
