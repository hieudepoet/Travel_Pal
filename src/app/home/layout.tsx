"use client";

import React from 'react';
import { AuthGuard } from '../../components/AuthGuard';
import dynamic from 'next/dynamic';
import Loading from '../../components/Loading';
import { Roboto } from 'next/font/google'
import Menu from '../../components/Menu';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
    <Menu/>
    {children}
    </AuthGuard>
  )
}