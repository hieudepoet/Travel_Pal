'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { auth } from "../../../firebase/clientApp"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google sign-in successful:', user);
      // Navigate to UserRoute after successful login
      router.push('/vungmien');
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Show error toast notification
      toast.error('Đăng nhập bằng Google thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundImage: 'url("/images/background_auth.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div>
        <img src="/images/logo.png" alt="Logo" style={{ width: '300px', display: 'block', margin: '0 auto', position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)'}} />
      </div>
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input
              type="checkbox"
              className="toggle"
              checked={isSignUp}
              onChange={(e) => setIsSignUp(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="card-side"></span>
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Đăng nhập</div>
                <form className="flip-card__form" onSubmit={handleSubmit}>
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Mật khẩu"
                    type="password"
                  />
                  <button className="flip-card__btn" type="submit">
                    Đăng nhập
                  </button>
                  <button className="flip-card__btn_google flex items-center justify-center" type="button" onClick={handleGoogleSignIn}>
                    <img src="/images/google_logo.svg" alt="Google" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Đăng nhập với Google
                  </button>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Đăng ký</div>
                <form className="flip-card__form" onSubmit={handleSubmit}>
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Mật khẩu"
                    type="password"
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                  />
                  <button className="flip-card__btn" type="submit">
                    Xác nhận
                  </button>
                  <button className="flip-card__btn_google flex items-center justify-center" type="button" onClick={handleGoogleSignIn}>
                    <img src="/images/google_logo.svg" alt="Google" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Đăng ký với Google
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}