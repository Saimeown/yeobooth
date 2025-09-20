import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraIcon from '../assets/camera-icon.jpg';

// Frame imports
import yeobooth1x1 from '../assets/frames/1x1/yeobooth-1x1.png';
import white1x1 from '../assets/frames/1x1/white-1x1.png';
import yeobooth1x3 from '../assets/frames/1x3/yeobooth-1x3.png';
import white1x3 from '../assets/frames/1x3/white-1x3.png';
import yeobooth2x2 from '../assets/frames/2x2/yeobooth-2x2.png';
import white2x2 from '../assets/frames/2x2/white-2x2.png';

interface LayoutOption {
    id: string;
    name: string;
    shots: number;
    preview: React.ReactNode;
    description: string;
    cols: number;
    rows: number;
    canvasWidth: number;
    canvasHeight: number;
}

interface FrameOption {
    id: string;
    name: string;
    image: string;
    preview: React.ReactNode;
}

const layouts: LayoutOption[] = [
    {
        id: '1x1',
        name: '1×1',
        shots: 1,
        description: 'Single',
        cols: 1,
        rows: 1,
        canvasWidth: 600,
        canvasHeight: 900,
        preview: (
            <div className="w-12 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
        )
    },
    {
        id: '1x3',
        name: '1×3',
        shots: 3,
        description: 'Strip',
        cols: 1,
        rows: 3,
        canvasWidth: 600,
        canvasHeight: 1800,
        preview: (
            <div className="flex flex-col gap-1 h-16 w-8">
                <div className="flex-1 bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
                <div className="flex-1 bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
                <div className="flex-1 bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
            </div>
        )
    },
    {
        id: '2x2',
        name: '2×2',
        shots: 4,
        description: 'Grid',
        cols: 2,
        rows: 2,
        canvasWidth: 1200,
        canvasHeight: 1200,
        preview: (
            <div className="grid grid-cols-2 gap-1 w-12 h-12">
                <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
                <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
                <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
                <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded border border-orange-400"></div>
            </div>
        )
    }
];

const frames: Record<string, FrameOption[]> = {
    '1x1': [
        {
            id: 'yeobooth-1x1',
            name: 'Yeobooth',
            image: yeobooth1x1,
            preview: <img src={yeobooth1x1} alt="Yeobooth Frame" className="w-full h-full object-contain" />
        },
        {
            id: 'white-1x1',
            name: 'White',
            image: white1x1,
            preview: <img src={white1x1} alt="White Frame" className="w-full h-full object-contain" />
        }
    ],
    '1x3': [
        {
            id: 'yeobooth-1x3',
            name: 'Yeobooth',
            image: yeobooth1x3,
            preview: <img src={yeobooth1x3} alt="Yeobooth Frame" className="w-full h-full object-contain" />
        },
        {
            id: 'white-1x3',
            name: 'White',
            image: white1x3,
            preview: <img src={white1x3} alt="White Frame" className="w-full h-full object-contain" />
        }
    ],
    '2x2': [
        {
            id: 'yeobooth-2x2',
            name: 'Yeobooth',
            image: yeobooth2x2,
            preview: <img src={yeobooth2x2} alt="Yeobooth Frame" className="w-full h-full object-contain" />
        },
        {
            id: 'white-2x2',
            name: 'White',
            image: white2x2,
            preview: <img src={white2x2} alt="White Frame" className="w-full h-full object-contain" />
        }
    ]
};

const Selection = () => {
    const navigate = useNavigate();
    const [selectedLayout, setSelectedLayout] = useState<string>('1x1');
    const [selectedFrame, setSelectedFrame] = useState<string>('yeobooth-1x1');

    // Update selected frame when layout changes
    useEffect(() => {
        const availableFrames = frames[selectedLayout];
        if (availableFrames && availableFrames.length > 0) {
            setSelectedFrame(availableFrames[0].id);
        }
    }, [selectedLayout]);

    const availableFrames = frames[selectedLayout] || [];

    const handleBackHome = () => {
        navigate('/');
    };

    const handleStartPhotobooth = () => {
        // Navigate to photobooth with selected layout and frame
        navigate(`/photobooth?layout=${selectedLayout}&frame=${selectedFrame}`);
    };

    return (
        <div 
            className="min-h-screen"
            style={{ background: 'linear-gradient(135deg, #ef8d55 0%, #eceae5 100%)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <button onClick={handleBackHome} className="glass-button" aria-label="Back Home">
                    <img src={cameraIcon} alt="Back" className="camera-icon" />
                </button>

                <div className="w-16"></div> {/* Spacer for centering */}
            </div>

            <div className="max-w-6xl mx-auto px-6 space-y-8">
                {/* Layout Selection */}
                <div className="space-y-2">
                    <h2 className="font-dynapuff font-bold text-2xl text-[#f5f3f1] text-center text-svg tracking-tight">Layout</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {layouts.map((layout) => (
                            <button
                                key={layout.id}
                                className={`p-8 backdrop-blur-md border-2 transition-all duration-300 hover:scale-105 ${
                                    selectedLayout === layout.id 
                                        ? 'bg-orange-100 border-amber-100 shadow-lg' 
                                        : 'bg-white/20 border-white/30 hover:bg-white/30'
                                }`}
                                onClick={() => setSelectedLayout(layout.id)}
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="flex items-center justify-center h-24">
                                        {layout.preview}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-dynapuff font-bold text-xl text-amber-900">{layout.name}</h3>
                                        <p className="font-dynapuff text-sm text-amber-700">{layout.description}</p>
                                        <p className="font-dynapuff text-xs text-amber-600 mt-1">{layout.shots} shot{layout.shots > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frame Selection */}
                <div className="space-y-2">
                    <h2 className="font-dynapuff font-bold text-2xl text-[#f5f3f1] text-center text-svg tracking-tight">Frame</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {availableFrames.map((frame) => (
                            <button
                                key={frame.id}
                                className={`p-8 backdrop-blur-md border-2 transition-all duration-300 hover:scale-105 ${
                                    selectedFrame === frame.id 
                                        ? 'bg-orange-100 border-amber-100 shadow-lg' 
                                        : 'bg-white/20 border-white/30 hover:bg-white/30'
                                }`}
                                onClick={() => setSelectedFrame(frame.id)}
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-32 h-48 flex items-center justify-center">
                                        {frame.preview}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-dynapuff font-bold text-xl text-amber-900">{frame.name}</h3>
                                        <p className="font-dynapuff text-sm text-amber-700">Frame</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Start Button */}
                <div className="flex justify-center pb-8">
                    <button
                        onClick={handleStartPhotobooth}
                        className="glass-button px-12 py-4 text-xl"
                    >
                        <img src={cameraIcon} alt="Camera" className="camera-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selection;