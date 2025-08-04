import React, { useState, useEffect } from "react";
import { Copy, Check, Play, Plus, Minus, Clock, Trash2 } from "lucide-react";

type WidgetType = "time" | "habit" | "countdown" | "progress";

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
    id: "time",
    name: "Блок времени",
    description: "Отслеживайте время с настраиваемыми параметрами",
    color: "#10b981",
    emoji: "🐸",
  },
  {
    id: "habit",
    name: "Блок привычек/целей",
    description: "Формируйте полезные привычки день за днем",
    color: "#10b981",
    emoji: "���",
  },
  {
    id: "countdown",
    name: "Блок таймера",
    description: "Концентрируйтесь с помощью техники помодоро",
    color: "#10b981",
    emoji: "🐼",
  },
  {
    id: "progress",
    name: "Блок прогресса",
    description: "Отслеживайте прогресс �� достижению целей",
    color: "#10b981",
    emoji: "📊",
  },
];

const colorOptions = [
  "#9ca3af",
  "#6b7280",
  "#4b5563",
  "#374151",
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#facc15",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

const timeBlockIcons = ["🐸", "🐼", "🐻", "🐱", "🐶", "🦊", "🐰", "🐨", "🐵"];

const emojiIcons = [
  "🐼",
  "😊",
  "😎",
  "🍰",
  "😋",
  "🤩",
  "🥰",
  "😴",
  "🤢",
  "⭐",
  "📚",
  "⏰",
  "📱",
  "💎",
  "🅰️",
  "🍔",
  "💻",
  "🥛",
  "🍷",
  "🍹",
];

export default function Index() {
  const [selectedBlock, setSelectedBlock] = useState<WidgetType>("time");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [config, setConfig] = useState<BlockConfig>({
    type: "time",
    title: "Block title",
    emoji: "🐸",
    color: "#10b981",
    darkMode: false,
    hoursplatform: 0,
    minutes: 0,
    font: "🐸",
    increaseBy: 1,
    goal: 2,
    countdownMinutes: 2,
    seconds: 0,
    startDate: "2024-07-30",
    endDate: "2024-08-13",
    counters: [],
  });

  const [currentTime, setCurrentTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const selectedType = blockTypes.find((b) => b.id === selectedBlock);
    if (selectedType) {
      setConfig((prev) => ({
        ...prev,
        type: selectedBlock,
        // Убрали emoji: selectedType.emoji чтобы сохранять пользовательские изображения
      }));
    }
  }, [selectedBlock]);

  const generateUrl = () => {
    const params = new URLSearchParams();
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "counters") {
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
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = generatedUrl;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error("Copy failed:", fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const addCounter = () => {
    const newCounter: Counter = {
      id: Date.now().toString(),
      title: "",
      type: "Count",
      value: 0,
    };
    setConfig((prev) => ({
      ...prev,
      counters: [...(prev.counters || []), newCounter],
    }));
  };

  const updateCounter = (
    id: string,
    field: keyof Counter,
    value: string | number,
  ) => {
    setConfig((prev) => ({
      ...prev,
      counters: prev.counters?.map((counter) =>
        counter.id === id ? { ...counter, [field]: value } : counter,
      ),
    }));
  };

  const removeCounter = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      counters: prev.counters?.filter((counter) => counter.id !== id),
    }));
  };

  return (
    <div
      className={`min-h-screen py-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-lg transition-all duration-300 shadow-lg ${
            isDarkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Configuration Panel */}
          <div
            className={`max-w-md space-y-6 p-6 rounded-lg transition-colors duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            {/* Block Type Selector */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Тип
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value as WidgetType)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                {blockTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Название
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, title: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Название блока"
              />
            </div>

            {/* Type-specific settings */}
            {config.type === "time" && (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Часы
                  </label>
                  <select
                    value={config.hoursplatform || 0}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        hoursplatform: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Минуты
                  </label>
                  <select
                    value={config.minutes || 0}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        minutes: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {config.type === "habit" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 text-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Увеличить на
                  </label>
                  <input
                    type="number"
                    value={config.increaseBy || 1}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        increaseBy: parseInt(e.target.value) || 1,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 text-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Цель
                  </label>
                  <input
                    type="number"
                    value={config.goal || 2}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        goal: parseInt(e.target.value) || 2,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
              </div>
            )}

            {config.type === "countdown" && (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Минуты
                  </label>
                  <input
                    type="number"
                    value={config.countdownMinutes || 2}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        countdownMinutes: parseInt(e.target.value) || 2,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Секунды
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={config.seconds || 0}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        seconds: parseInt(e.target.value) || 0,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
              </>
            )}

            {config.type === "progress" && (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Начало
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      config.startDate
                        ? `${config.startDate}T10:41`
                        : "2024-07-30T10:41"
                    }
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        startDate: e.target.value.split("T")[0],
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Конец
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      config.endDate
                        ? `${config.endDate}T10:41`
                        : "2024-08-13T10:41"
                    }
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        endDate: e.target.value.split("T")[0],
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>

                {/* Counters Table */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Счетчики
                  </label>
                  <div
                    className={`border rounded-lg overflow-hidden ${
                      isDarkMode ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 border-b ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <div
                        className={`grid grid-cols-5 gap-2 text-xs font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>НАЗВАНИЕ</span>
                        <span>ТИП</span>
                        <span>ЗНАЧЕНИЕ</span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-600" : "divide-gray-200"
                      }`}
                    >
                      {config.counters?.map((counter) => (
                        <div key={counter.id} className="px-3 py-2">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <input
                              type="text"
                              value={counter.title}
                              onChange={(e) =>
                                updateCounter(
                                  counter.id,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="text-xs border border-gray-200 rounded px-2 py-1"
                              placeholder="Название"
                            />
                            <select
                              value={counter.type}
                              onChange={(e) =>
                                updateCounter(
                                  counter.id,
                                  "type",
                                  e.target.value,
                                )
                              }
                              className="text-xs border border-gray-200 rounded px-2 py-1"
                            >
                              <option value="Count">Счетчик</option>
                              <option value="Time">Время</option>
                              <option value="Progress">Прогресс</option>
                            </select>
                            <input
                              type="number"
                              value={counter.value}
                              onChange={(e) =>
                                updateCounter(
                                  counter.id,
                                  "value",
                                  parseInt(e.target.value) || 0,
                                )
                              }
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
                    <div
                      className={`px-3 py-2 border-t ${
                        isDarkMode ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <button
                        onClick={addCounter}
                        className="text-sm text-teal-600 hover:text-teal-800"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Color Palette */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Цвет
              </label>
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setConfig((prev) => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      config.color === color
                        ? "border-teal-500 scale-110"
                        : isDarkMode
                          ? "border-gray-600"
                          : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Icon/Font Selector */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {config.type === "time" ? "Иконка" : "Иконка"}
              </label>
              <div className="grid grid-cols-7 gap-2 mb-3">
                {(config.type === "time" ? timeBlockIcons : emojiIcons).map(
                  (icon) => (
                    <button
                      key={icon}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          emoji: icon,
                          ...(config.type === "time" ? { font: icon } : {}),
                        }))
                      }
                      className={`w-8 h-8 rounded-lg border-2 transition-all text-lg flex items-center justify-center ${
                        config.emoji === icon
                          ? `border-teal-500 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`
                          : `${isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-200 hover:border-gray-300"}`
                      }`}
                    >
                      {icon}
                    </button>
                  ),
                )}
              </div>

              {/* Custom Icon Upload */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={config.emoji.startsWith("http") ? config.emoji : ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, emoji: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Или вставьте ссылку на изображение/GIF"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setConfig((prev) => ({
                              ...prev,
                              emoji: event.target!.result as string,
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-teal-400 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V3M12 3L8 7M12 3L16 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L2 19C2 20.1046 2.89543 21 4 21L20 21C21.1046 21 22 20.1046 22 19L22 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Выбрать изображение
                    </span>
                  </label>
                </div>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Загрузите свое изображение или GIF
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateUrl}
              className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Создать ссылку для вставки
            </button>

            {/* Generated URL */}
            {generatedUrl && (
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Ссылка для вставки
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className={`flex-1 px-3 py-2 border rounded-lg font-mono text-sm ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                  />
                  <button
                    onClick={copyUrl}
                    className={`px-3 py-2 border rounded-lg transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">
                    ✓ Скопировано в буфер обмена
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <h2
              className={`text-2xl font-semibold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Предварительный просмотр
            </h2>
            <BlockPreview config={config} currentTime={currentTime} />
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
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setTimeLeft((config.countdownMinutes || 2) * 60 + (config.seconds || 0));
  }, [config.countdownMinutes, config.seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Показать конфетти сразу если цель уже достигнута
  useEffect(() => {
    if (config.type === 'habit' && localCurrent >= (config.goal || 2) && localCurrent > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [config.type, localCurrent, config.goal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Convert hex to RGB for transparency
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 16, g: 185, b: 129 };
  };

  const renderBlock = () => {
    const rgb = hexToRgb(config.color);
    const waveColor = config.color;

    switch (config.type) {
      case "time":
        const displayTime =
          config.hoursplatform !== undefined && config.minutes !== undefined
            ? `${config.hoursplatform.toString().padStart(2, "0")}:${config.minutes.toString().padStart(2, "0")}:00`
            : currentTime;

        return (
          <div
            className="relative w-full h-48 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${waveColor}40, ${waveColor}60)`,
              border: "3px solid #000000",
              borderRadius: "12px",
            }}
          >
            {/* Content layer */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-black">
              <div className="text-2xl font-mono font-bold">{displayTime}</div>
              <div className="text-sm font-medium mb-4">{config.title}</div>

              <div className="flex items-center justify-center mt-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center">
                    {config.emoji.startsWith("http") ||
                    config.emoji.startsWith("data:") ? (
                      <img
                        src={config.emoji}
                        alt="Custom icon"
                        className="w-20 h-20 object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-5xl">{config.emoji}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "habit":
        return (
          <div
            className="relative p-4 h-24 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${waveColor}40, ${waveColor}60)`,
              color: "black",
              border: "3px solid #000000",
              borderRadius: "12px",
            }}
          >
            {/* Icon on the left */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl z-10">
              {config.emoji.startsWith("http") ||
              config.emoji.startsWith("data:") ? (
                <img
                  src={config.emoji}
                  alt="Icon"
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                config.emoji
              )}
            </div>

            {/* Centered content */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="text-xl font-bold">
                {localCurrent}/{config.goal || 2}
              </div>
              <div className="text-sm">{config.title}</div>
            </div>

            {/* Buttons on the right */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2 z-10 items-center">
              <button
                onClick={() =>
                  setLocalCurrent(
                    Math.max(0, localCurrent - (config.increaseBy || 1)),
                  )
                }
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 bg-white bg-opacity-30 hover:bg-opacity-50 shadow-sm"
              >
                <Minus className="w-2.5 h-2.5 text-black opacity-70" />
              </button>
              <button
                onClick={() => {
                  const newValue = localCurrent + (config.increaseBy || 1);
                  setLocalCurrent(newValue);
                  // Показать конфетти при достижении цели
                  if (newValue >= (config.goal || 2) && localCurrent < (config.goal || 2)) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                  }
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 bg-black bg-opacity-85 hover:bg-opacity-95 shadow-lg"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Конфетти анимация */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-20">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full animate-spin"
                      style={{
                        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 7)],
                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // Показать конфетти сразу если цель уже достигнута
      useEffect(() => {
        if (config.type === 'habit' && localCurrent >= (config.goal || 2) && localCurrent > 0) {
          setShowConfetti(true);
          const timer = setTimeout(() => setShowConfetti(false), 2000);
          return () => clearTimeout(timer);
        }
      }, [config.type, localCurrent, config.goal]);

      case "countdown":
        return (
          <div
            className="flex items-center justify-between p-4 h-24 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${waveColor}40, ${waveColor}60)`,
              color: "black",
              border: "3px solid #000000",
              borderRadius: "12px",
            }}
          >
            <div className="text-2xl z-10 relative">
              {config.emoji.startsWith("http") ||
              config.emoji.startsWith("data:") ? (
                <img
                  src={config.emoji}
                  alt="Icon"
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                config.emoji
              )}
            </div>
            <div className="text-center flex-1 z-10 relative">
              <div className="text-xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm">{config.title}</div>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="z-10 relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 bg-white bg-opacity-50 hover:bg-opacity-70 shadow-lg"
            >
              {isRunning ? (
                <div className="flex gap-0.5 items-center">
                  <div className="w-1 h-4 bg-black rounded-sm" />
                  <div className="w-1 h-4 bg-black rounded-sm" />
                </div>
              ) : (
                <Play className="w-4 h-4 text-black" />
              )}
            </button>
          </div>
        );

      case "progress":
        const progressPercent = config.counters?.length
          ? Math.round(
              config.counters.reduce((sum, c) => sum + c.value, 0) /
                config.counters.length,
            )
          : 0;

        return (
          <div
            className="p-4 space-y-3 h-32 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${waveColor}40, ${waveColor}60)`,
              color: "black",
              border: "3px solid #000000",
              borderRadius: "12px",
            }}
          >
            <div className="flex items-center justify-between z-10 relative">
              <div className="text-lg">
                {config.emoji.startsWith("http") ||
                config.emoji.startsWith("data:") ? (
                  <img
                    src={config.emoji}
                    alt="Icon"
                    className="w-6 h-6 object-cover rounded"
                  />
                ) : (
                  config.emoji
                )}
              </div>
              <div className="text-sm">{config.title}</div>
            </div>
            <div className="text-2xl font-bold z-10 relative">
              {progressPercent}%
            </div>
            <div className="text-xs opacity-75 z-10 relative">
              {config.startDate && config.endDate
                ? `${Math.ceil((new Date(config.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d remaining`
                : "13d, 23h, 59m"}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-black bg-opacity-20 rounded-full h-3 z-10 relative shadow-inner">
              <div
                className="h-3 rounded-full transition-all duration-700 bg-black shadow-sm"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="max-w-xs">{renderBlock()}</div>;
}
