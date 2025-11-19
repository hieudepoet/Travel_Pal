'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

const AuthRoute = lazy(() => import('../routes/AuthRoute'));
const UserRoute = lazy(() => import('../routes/UserRoute'));

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status (you can implement actual auth logic here)
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isAuthenticated ? <UserRoute /> : <AuthRoute />}
    </Suspense>
  );
}