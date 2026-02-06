import { Heart, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ValentineDiscount() {
  const [isVisible, setIsVisible] = useState(true);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating hearts
    const heartElements = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setHearts(heartElements);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float-heart opacity-20"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <Heart className="h-6 w-6 text-red-400 fill-red-400" />
          </div>
        ))}
      </div>

      {/* Floating Discount Banner */}
      <div className="fixed bottom-6 right-6 z-[70] animate-bounce-gentle">
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse-slow" />
          
          {/* Main Banner */}
          <div className="relative bg-gradient-to-br from-red-500 via-pink-500 to-red-600 p-6 rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-soft min-w-[280px]">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-start space-x-3">
              <div className="relative">
                <Heart className="h-10 w-10 text-white fill-white animate-pulse" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-spin-slow" />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  Valentine's Special! 💝
                </h3>
                <p className="text-white/90 text-sm font-medium mb-2">
                  Love is in the air!
                </p>
                <div className="bg-white/20 backdrop-blur-soft rounded-lg px-3 py-2 border border-white/30">
                  <p className="text-white text-2xl font-bold">
                    20% OFF
                  </p>
                  <p className="text-white/90 text-xs">
                    On all orders today! 🌹
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Hearts */}
            <div className="absolute -top-2 -left-2">
              <Heart className="h-5 w-5 text-pink-300 fill-pink-300 animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Heart className="h-4 w-4 text-red-300 fill-red-300 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float-heart {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float-heart {
          animation: float-heart linear infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}
