'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputForm } from '@/components/InputForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Modal } from '@/components/Modal';
import { UserPreferences, TripPlan } from '@/types/types';
import { generateTrip } from '@/service/geminiService';
import { Plane, Clock, MapPin, ArrowRight, Sparkles, Globe, Compass } from 'lucide-react';
import Menu from '@/components/Menu';

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<{ id: string, destination: string, date: string, plan: TripPlan }[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('tripHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    try {
      const plan = await generateTrip(prefs);

      sessionStorage.setItem('currentTripPlan', JSON.stringify(plan));

      const newHistoryItem = {
        id: Date.now().toString(),
        destination: prefs.destination,
        date: new Date().toLocaleDateString('vi-VN'),
        plan: plan
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));

      router.push('/trip');
    } catch (error) {
      console.error('Error generating travel plan:', error);
      alert("Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const loadFromHistory = (plan: TripPlan) => {
    sessionStorage.setItem('currentTripPlan', JSON.stringify(plan));
    router.push('/trip');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Menu />
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/50 text-orange-600 text-sm font-semibold tracking-wide shadow-sm animate-fade-in-up">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI-POWERED TRAVEL PLANNER</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s', lineHeight: 1.1 }}>
            Travel Pal
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Khám phá thế giới theo cách riêng của bạn. <br className="hidden md:block" />
            Lên kế hoạch cho chuyến đi hoàn hảo chỉ trong vài giây với AI.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Bắt đầu hành trình</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-10 py-5 text-gray-600 font-medium hover:text-gray-900 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        {history.length > 0 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400 flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-xs font-medium tracking-widest uppercase">Lịch sử</span>
            <ArrowRight className="rotate-90 w-4 h-4" />
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="py-32 px-4 md:px-10 bg-gray-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Chuyến đi gần đây</h2>
                <p className="text-gray-500 text-lg">Tiếp tục hành trình dang dở của bạn</p>
              </div>
              <button className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors">
                Xem tất cả <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item.plan)}
                  className="group bg-white rounded-3xl p-1 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-100"
                >
                  <div className="relative h-48 bg-gray-100 rounded-[20px] overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-orange-200">
                      <Globe size={64} strokeWidth={1} />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {item.plan.stats.durationDays} ngày
                    </div>
                  </div>

                  <div className="px-4 pb-6">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
                      <Clock size={12} />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {item.destination}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Compass size={16} className="text-orange-500" />
                        <span>{item.plan.stats.totalEvents} hoạt động</span>
                      </div>
                      <span className="text-gray-900 font-bold">
                        {item.plan.stats.totalCost.toLocaleString()} {item.plan.stats.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Input Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Modal>

      <LoadingOverlay isLoading={isLoading} message="Đang thiết kế chuyến đi trong mơ của bạn..." />

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputForm } from '@/components/InputForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Modal } from '@/components/Modal';
import { UserPreferences, TripPlan } from '@/types/types';
import { generateTrip } from '@/service/geminiService';
import { Plane, Clock, MapPin, ArrowRight, Sparkles, Globe, Compass } from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<{ id: string, destination: string, date: string, plan: TripPlan }[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('tripHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    try {
      const plan = await generateTrip(prefs);

      sessionStorage.setItem('currentTripPlan', JSON.stringify(plan));

      const newHistoryItem = {
        id: Date.now().toString(),
        destination: prefs.destination,
        date: new Date().toLocaleDateString('vi-VN'),
        plan: plan
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));

      router.push('/trip');
    } catch (error) {
      console.error('Error generating travel plan:', error);
      alert("Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const loadFromHistory = (plan: TripPlan) => {
    sessionStorage.setItem('currentTripPlan', JSON.stringify(plan));
    router.push('/trip');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      color: '#111827',
      fontFamily: 'sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, #fffbeb, #ffffff, #fef3c7)',
            opacity: 0.9
          }}></div>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(\'/images/theme.png\')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}></div>

          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '5rem',
            left: '5rem',
            width: '16rem',
            height: '16rem',
            backgroundColor: '#fdba74',
            borderRadius: '9999px',
            mixBlendMode: 'multiply',
            filter: 'blur(48px)',
            opacity: 0.2,
            animation: 'blob 7s infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '5rem',
            right: '5rem',
            width: '16rem',
            height: '16rem',
            backgroundColor: '#fcd34d',
            borderRadius: '9999px',
            mixBlendMode: 'multiply',
            filter: 'blur(48px)',
            opacity: 0.2,
            animation: 'blob 7s infinite 2s'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-8rem',
            left: '50%',
            width: '16rem',
            height: '16rem',
            backgroundColor: '#f9a8d4',
            borderRadius: '9999px',
            mixBlendMode: 'multiply',
            filter: 'blur(48px)',
            opacity: 0.2,
            animation: 'blob 7s infinite 4s'
          }}></div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1rem',
          maxWidth: '80rem',
          margin: '0 auto'
        }}>
          <div style={{
            marginBottom: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            color: '#ea580c',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.025em',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            opacity: 0,
            animation: 'fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <Sparkles size={16} style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <span>AI-POWERED TRAVEL PLANNER</span>
          </div>

          <h1 style={{
            fontSize: '4.5rem',
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            marginBottom: '2rem',
            background: 'linear-gradient(to right, #FF512F, #F09819, #FF512F)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0,
            animation: 'fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
          }}>
            Travel Pal
          </h1>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            animation: 'fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards'
          }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 2.5rem',
                backgroundColor: '#111827',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: 700,
                borderRadius: '9999px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
            >
              <span style={{
                position: 'relative',
                zIndex: 10
              }}>Bắt đầu hành trình</span>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #ea580c, #d97706)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}></div>
              <ArrowRight style={{
                position: 'relative',
                zIndex: 10,
                transition: 'transform 0.3s ease'
              }} />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        {history.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#9ca3af',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            opacity: 0.5,
            transition: 'opacity 0.3s ease',
            animation: 'bounce 2s infinite',
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>Lịch sử</span>
            <ArrowRight style={{
              transform: 'rotate(90deg)',
              width: '1rem',
              height: '1rem'
            }} />
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div style={{
          padding: '8rem 1rem',
          backgroundColor: '#f9fafb',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            maxWidth: '80rem',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '4rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '1rem'
                }}>Chuyến đi gần đây</h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1.125rem'
                }}>Tiếp tục hành trình dang dở của bạn</p>
              </div>
              <button style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ea580c',
                fontWeight: 500,
                transition: 'color 0.3s ease',
              }}>
                Xem tất cả <ArrowRight size={16} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
            }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item.plan)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    padding: '0.25rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{
                    position: 'relative',
                    height: '12rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom right, #ffedd5, #fef3c7)',
                      transition: 'transform 0.5s ease',
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fdba74'
                    }}>
                      <Globe size={64} strokeWidth={1} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#111827',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}>
                      {item.plan.stats.durationDays} ngày
                    </div>
                  </div>

                  <div style={{
                    padding: '0 1rem 1.5rem 1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}>
                      <Clock size={12} />
                      <span>{item.date}</span>
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '0.75rem',
                      transition: 'color 0.3s ease',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.destination}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f9fafb'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        <Compass size={16} style={{ color: '#ea580c' }} />
                        <span>{item.plan.stats.totalEvents} hoạt động</span>
                      </div>
                      <span style={{
                        color: '#111827',
                        fontWeight: 700
                      }}>
                        {item.plan.stats.totalCost.toLocaleString()} {item.plan.stats.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Input Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Modal>

      <LoadingOverlay isLoading={isLoading} message="Đang thiết kế chuyến đi trong mơ của bạn..." />

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-10px) translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;