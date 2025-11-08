import React from 'react';

/**
 * Connection Line Styles Component
 * Demonstrates different ways to connect elements visually
 */

const ConnectionLineExamples = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Connection Line Styles</h1>

      {/* Style 1: Solid Straight Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">1. Solid Straight Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 2: Dashed Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">2. Dashed Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div className="h-0.5 w-32 bg-transparent border-t-2 border-dashed border-yellow-500"></div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 3: Dotted Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">3. Dotted Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div className="flex items-center gap-2 w-32">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 4: Wavy/Curved SVG Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">4. Wavy Curved Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <svg width="128" height="40" className="mx-2">
            <path
              d="M 0 20 Q 32 5, 64 20 T 128 20"
              stroke="url(#gradient1)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FB923C', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 5: Arrow Connection */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">5. Arrow Connection</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <svg width="128" height="40" className="mx-2">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FB923C', stopOpacity: 1 }} />
              </linearGradient>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#FB923C" />
              </marker>
            </defs>
            <line
              x1="0"
              y1="20"
              x2="128"
              y2="20"
              stroke="url(#gradient2)"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
          </svg>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 6: Double Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">6. Double Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div className="w-32 flex flex-col gap-1.5">
            <div className="h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
            <div className="h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 7: Glowing Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">7. Glowing/Shadow Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-300">
            <span className="text-2xl">💊</span>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-200"></div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center shadow-lg shadow-orange-300">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 8: Animated Pulse Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">8. Animated Pulse Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
            <span className="text-2xl">💊</span>
          </div>
          <div className="relative w-32 h-1">
            <div className="absolute inset-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
            <div className="absolute inset-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse opacity-50"></div>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center animate-pulse">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 9: Zigzag Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">9. Zigzag Line</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <svg width="128" height="40" className="mx-2">
            <path
              d="M 0 20 L 21 10 L 43 20 L 64 10 L 85 20 L 107 10 L 128 20"
              stroke="url(#gradient3)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FB923C', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 10: Heartbeat/ECG Line */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">10. Heartbeat/ECG Line (Medical Theme)</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <svg width="128" height="40" className="mx-2">
            <path
              d="M 0 20 L 20 20 L 30 10 L 40 30 L 50 20 L 70 20 L 80 15 L 90 25 L 100 20 L 128 20"
              stroke="url(#gradient4)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FB923C', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 11: Thick Gradient Bar */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">11. Thick Gradient Bar</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div className="h-3 w-32 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-full"></div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

      {/* Style 12: Plus Signs Connection (Medical) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">12. Plus Signs (Medical Theme)</h3>
        <div className="flex items-center justify-center gap-0">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
          <div className="flex items-center justify-center gap-3 w-32">
            <span className="text-yellow-500 text-xl font-bold">+</span>
            <span className="text-amber-500 text-xl font-bold">+</span>
            <span className="text-orange-500 text-xl font-bold">+</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-2xl">💊</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ConnectionLineExamples;
