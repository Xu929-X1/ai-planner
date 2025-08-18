import React from "react";

type OverlaySpinnerProps = {
    spinning: boolean;
    children: React.ReactNode;
};

export function Spinner({ spinning, children }: OverlaySpinnerProps) {
    return (
        <div className="relative h-full">
            {children}

            {spinning && (
                <>
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-md z-10"></div>
                    {/* Spinner */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    </div>
                </>
            )}
        </div>
    );
}