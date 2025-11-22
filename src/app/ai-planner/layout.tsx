'use client';

import { AuthGuard } from '@/components/AuthGuard';

export default function AIPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  );
}
