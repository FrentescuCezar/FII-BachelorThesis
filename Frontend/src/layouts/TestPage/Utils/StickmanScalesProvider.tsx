import React, { createContext, useContext, useState } from 'react';

interface StickmanScale {
    scaleX: number;
    scaleY: number;
    rotation: number; // new prop
}

interface StickmanScalesContextType {
    stickmanScales: { [key: number]: StickmanScale };
    setStickmanScales: React.Dispatch<React.SetStateAction<{ [key: number]: StickmanScale }>>;
}

interface StickmanScalesProviderProps {
    children: React.ReactNode;
}


const StickmanScalesContext = createContext<StickmanScalesContextType | undefined>(undefined);

export const useStickmanScales = () => {
    const context = useContext(StickmanScalesContext);
    if (context === undefined) {
        throw new Error('useStickmanScales must be used within a StickmanScalesProvider');
    }
    return context;
};

export const StickmanScalesProvider: React.FC<StickmanScalesProviderProps> = ({ children }) => {
    const [stickmanScales, setStickmanScales] = useState<{ [key: number]: StickmanScale }>({});

    return (
        <StickmanScalesContext.Provider value={{ stickmanScales, setStickmanScales }}>
            {children}
        </StickmanScalesContext.Provider>
    );
};
