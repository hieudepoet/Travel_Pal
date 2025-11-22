'use client';

import React from 'react';
import VietnamMapWindow from '../../components/VietnamMapWindow';
import Menu from '../../components/Menu';

export default function MapPage() {
    return (
        <div className="w-screen h-screen relative">
            <Menu />
            <VietnamMapWindow />
        </div>
    );
}
