'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputForm } from '@/components/InputForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Modal } from '@/components/Modal';
import { UserPreferences, TripPlan } from '@/types/types';
import { generateTrip } from '@/service/geminiService';
import { Plane, Clock, MapPin, ArrowRight, Sparkles, Globe, Compass } from 'lucide-react';
import GlobalPopupWrapper from '@/components/GlobalPopupWrapper';
import VietnamMapWindow from '@/components/VietnamMapWindow';
import { useMapPopup } from '@/contexts/MapPopupContext';

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<{ id: string, destination: string, date: string, plan: TripPlan }[]>([]);
  const { showMapPopup } = useMapPopup();

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

      {/* Map Popup */}
      {showMapPopup && (
        <GlobalPopupWrapper>
          <VietnamMapWindow />
        </GlobalPopupWrapper>
      )}
    </div>
  );
};

export default HomePage;