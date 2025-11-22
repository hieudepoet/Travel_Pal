'use client';

import React, { createContext, useContext, useState } from 'react';

interface MapPopupContextType {
    showMapPopup: boolean;
    setShowMapPopup: (show: boolean) => void;
}

const MapPopupContext = createContext<MapPopupContextType | undefined>(undefined);

export function MapPopupProvider({ children }: { children: React.ReactNode }) {
    const [showMapPopup, setShowMapPopup] = useState(false);

    return (
        <MapPopupContext.Provider value={{ showMapPopup, setShowMapPopup }}>
            {children}
        </MapPopupContext.Provider>
    );
}

export function useMapPopup() {
    const context = useContext(MapPopupContext);
    if (!context) {
        throw new Error('useMapPopup must be used within MapPopupProvider');
    }
    return context;
}
