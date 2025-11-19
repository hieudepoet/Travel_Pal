'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UserRoute = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to vungmien page for authenticated users
    router.push('/vungmien');
  }, [router]);

  return (
    <Suspense fallback={<div>Loading user dashboard...</div>}>
      <div>
        <h1>Redirecting to dashboard...</h1>
      </div>
    </Suspense>
  );
};

export default UserRoute;
