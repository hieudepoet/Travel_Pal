'use client';

import { Suspense } from 'react';
import VungMienLayout from '../app/home/layout';
import VungMienPage from '../app/home/page';

const UserRoute = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VungMienLayout>
        <VungMienPage />
      </VungMienLayout>
    </Suspense>
  );
};

export default UserRoute;
