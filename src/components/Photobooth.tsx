import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import cameraIcon from '../assets/camera-icon.jpg';
import landingBunny from '../assets/landing-bunny.svg';

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
            <div className="w-8 h-8 bg-gradient-to-br from-amber-300 to-amber-400 rounded-xl border border-amber-500"></div>
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
            <div className="flex flex-col gap-1">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
                <div className="w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
                <div className="w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
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
            <div className="grid grid-cols-2 gap-1">
                <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
                <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
                <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
                <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg border border-amber-500"></div>
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
            preview: <div className="w-6 h-6 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg border border-amber-400"></div>
        },
        {
            id: 'white-1x1',
            name: 'White',
            image: white1x1,
            preview: <div className="w-6 h-6 bg-white rounded-lg border-2 border-stone-300"></div>
        }
    ],
    '1x3': [
        {
            id: 'yeobooth-1x3',
            name: 'Yeobooth',
            image: yeobooth1x3,
            preview: <div className="w-6 h-6 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg border border-amber-400"></div>
        },
        {
            id: 'white-1x3',
            name: 'White',
            image: white1x3,
            preview: <div className="w-6 h-6 bg-white rounded-lg border-2 border-stone-300"></div>
        }
    ],
    '2x2': [
        {
            id: 'yeobooth-2x2',
            name: 'Yeobooth',
            image: yeobooth2x2,
            preview: <div className="w-6 h-6 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg border border-amber-400"></div>
        },
        {
            id: 'white-2x2',
            name: 'White',
            image: white2x2,
            preview: <div className="w-6 h-6 bg-white rounded-lg border-2 border-stone-300"></div>
        }
    ]
};

const Photobooth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const selectedLayout = searchParams.get('layout') || '1x1';
    const selectedFrame = searchParams.get('frame') || 'yeobooth-1x1';
    
    const [currentShot, setCurrentShot] = useState<number>(0);
    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
    const [caption, setCaption] = useState<string>('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showFlash, setShowFlash] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const selectedLayoutRef = useRef<string>(selectedLayout);
    const isCapturingRef = useRef<boolean>(false);
    const currentShotRef = useRef<number>(0);

    useEffect(() => {
        selectedLayoutRef.current = selectedLayout;
    }, [selectedLayout]);

    useEffect(() => {
        isCapturingRef.current = isCapturing;
    }, [isCapturing]);

    useEffect(() => {
        currentShotRef.current = currentShot;
    }, [currentShot]);

    const selectedLayoutData = layouts.find(l => l.id === selectedLayout)!;
    const totalShots = selectedLayoutData.shots;
    const isSessionComplete = currentShot >= totalShots;
    const availableFrames = useMemo(() => frames[selectedLayout] || [], [selectedLayout]);

    useEffect(() => {
        initializeCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const initializeCamera = async () => {
        try {
            setIsLoading(true);
            setCameraError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    setIsLoading(false);
                };
            }
            setStream(mediaStream);
        } catch (error) {
            console.error('Error accessing camera:', error);
            setCameraError('Camera not available. Please check permissions and try again.');
            setIsLoading(false);
        }
    };

    const startCountdown = () => {
        if (showCountdown || isCapturing || isSessionComplete) return; 

        setShowCountdown(true);
        setCountdown(3);

        const countdownTimer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownTimer);
                    setShowCountdown(false);
                    if (!isCapturing && !isSessionComplete) {
                        capturePhoto();
                    }
                    return 3;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || isCapturingRef.current) return;

        setIsCapturing(true);
        isCapturingRef.current = true;

        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            setIsCapturing(false);
            isCapturingRef.current = false;
            return;
        }

        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        const sourceX = (video.videoWidth - size) / 2;
        const sourceY = (video.videoHeight - size) / 2;

        ctx.drawImage(video, sourceX, sourceY, size, size, 0, 0, size, size);

        const photoDataUrl = canvas.toDataURL('image/png');

        const currentLayoutData = layouts.find(l => l.id === selectedLayoutRef.current);
        const maxShots = currentLayoutData ? currentLayoutData.shots : 4;

        setCapturedPhotos(prev => {
            if (prev.length >= maxShots) {
                return prev; 
            }
            
            const newPhotos = [...prev, photoDataUrl];
            
            return newPhotos;
        });

        setCurrentShot(prev => {
            const newCount = prev + 1;
            return newCount > maxShots ? maxShots : newCount;
        });

        setTimeout(() => {
            setIsCapturing(false);
            isCapturingRef.current = false;
        }, 300);
    }, []); 

    const handleTakePhoto = () => {
        if (isSessionComplete || isCapturing || showCountdown) return;
        startCountdown();
    };

    const resetSession = () => {
        setCapturedPhotos([]);
        setCurrentShot(0);
        setCaption('');
    };

    const downloadCollage = () => {
        if (capturedPhotos.length === 0) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const layout = selectedLayoutData;
        canvas.width = layout.canvasWidth;
        canvas.height = layout.canvasHeight;

        const selectedFrameData = availableFrames.find(f => f.id === selectedFrame);
        if (!selectedFrameData) return;

        const frameImg = new Image();
        frameImg.onload = () => {
            ctx.drawImage(frameImg, 0, 0, layout.canvasWidth, layout.canvasHeight);

            const loadPromises = capturedPhotos.map((photoDataUrl, index) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        let photoX = 0, photoY = 0, photoWidth = 400, photoHeight = 400;
                        
                        if (selectedLayout === '1x1') {
                            photoWidth = 540;   // Photo width - fits within frame
                            photoHeight = 610;  // Photo height - square for consistency
                            photoX = (layout.canvasWidth - photoWidth) / 2;   // Horizontal center
                            photoY = (layout.canvasHeight - photoHeight) / 2 - 100; // Slightly above center
                        } else if (selectedLayout === '1x3') {
                            photoWidth = 540;   // Photo width - fits within frame
                            photoHeight = 470;  // Photo height - square for consistency
                            photoX = (layout.canvasWidth - photoWidth) / 2; // Horizontal center
                            const startY = 40; // Starting Y position for first photo
                            const gap = 485;    // Gap between photos (480 + 120 margin)
                            photoY = startY + (index * gap); // Position for current photo
                        } else if (selectedLayout === '2x2') {
                            photoWidth = 450;   // Photo width - fits within frame quadrants
                            photoHeight = 450;  // Photo height - square for consistency
                            const gap = 20;     // Gap between photos
                            const totalContentWidth = (photoWidth * 2) + gap;  // 920px
                            const totalContentHeight = (photoHeight * 2) + gap; // 920px
                            const marginX = (layout.canvasWidth - totalContentWidth) / 2;   // 140px - centers horizontally
                            const marginY = (layout.canvasHeight - totalContentHeight) / 2; // 140px - centers vertically
                            
                            photoX = marginX + (index % 2) * (photoWidth + gap);
                            photoY = marginY + Math.floor(index / 2) * (photoHeight + gap) - 50;
                        }

                        const imgAspect = img.width / img.height;
                        const targetAspect = photoWidth / photoHeight;
                        
                        let drawWidth, drawHeight, drawX, drawY;
                        
                        if (imgAspect > targetAspect) {
                            drawHeight = photoHeight;
                            drawWidth = photoHeight * imgAspect;
                            drawX = photoX - (drawWidth - photoWidth) / 2;
                            drawY = photoY;
                        } else {
                            drawWidth = photoWidth;
                            drawHeight = photoWidth / imgAspect;
                            drawX = photoX;
                            drawY = photoY - (drawHeight - photoHeight) / 2;
                        }

                        ctx.save();
                        const radius = 0;
                        ctx.beginPath();
                        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, radius);
                        ctx.clip();
                        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                        ctx.restore();

                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, radius);
                        
                        const isYeoboothFrame = selectedFrame.includes('yeobooth');
                        ctx.strokeStyle = isYeoboothFrame ? '#ef8d56' : '#ffffff';
                        ctx.lineWidth = isYeoboothFrame ? 0 : 0;
                        ctx.stroke();
                        ctx.restore();
                        
                        resolve();
                    };
                    img.onerror = () => {
                        console.error('Failed to load photo:', index);
                        resolve(); 
                    };
                    img.src = photoDataUrl;
                });
            });

            Promise.all(loadPromises).then(() => {
                if (caption.trim()) {
                    ctx.fillStyle = '#333333';
                    ctx.font = 'bold 28px DynaPuff, system-ui';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const captionY = selectedLayout === '2x2' 
                        ? layout.canvasHeight - 120  
                        : layout.canvasHeight - 190; 
                    const captionX = layout.canvasWidth / 2;

                    const truncatedCaption = caption.length > 50 ? caption.substring(0, 50) + '...' : caption;
                    ctx.fillText(truncatedCaption, captionX, captionY);
                }

                // Download the final image
                const link = document.createElement('a');
                link.download = `yeobooth-${selectedLayout}-${selectedFrame}-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png', 0.95);
                link.click();
            });
        };
        
        frameImg.onerror = () => {
            console.error('Failed to load frame:', selectedFrameData.image);
            const link = document.createElement('a');
            link.download = `yeobooth-${selectedLayout}-no-frame-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 0.95);
            link.click();
        };
        
        frameImg.src = selectedFrameData.image;
    };

    const generatePreview = useCallback(() => {
        if (capturedPhotos.length === 0) {
            setPreviewDataUrl(null);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const layout = selectedLayoutData;
        canvas.width = layout.canvasWidth;
        canvas.height = layout.canvasHeight;

        const selectedFrameData = availableFrames.find(f => f.id === selectedFrame);
        if (!selectedFrameData) return;

        // Load frame image first
        const frameImg = new Image();
        frameImg.onload = () => {
            ctx.drawImage(frameImg, 0, 0, layout.canvasWidth, layout.canvasHeight);

            const loadPromises = capturedPhotos.map((photoDataUrl, index) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        let photoX = 0, photoY = 0, photoWidth = 400, photoHeight = 400;
                        
                        if (selectedLayout === '1x1') {
                            photoWidth = 540;
                            photoHeight = 610;
                            photoX = (layout.canvasWidth - photoWidth) / 2;
                            photoY = (layout.canvasHeight - photoHeight) / 2 - 100;
                        } else if (selectedLayout === '1x3') {
                            photoWidth = 540;
                            photoHeight = 470;
                            photoX = (layout.canvasWidth - photoWidth) / 2;
                            const startY = 40;
                            const gap = 485;
                            photoY = startY + (index * gap);
                        } else if (selectedLayout === '2x2') {
                            photoWidth = 450;
                            photoHeight = 450;
                            const gap = 20;
                            const totalContentWidth = (photoWidth * 2) + gap;
                            const totalContentHeight = (photoHeight * 2) + gap;
                            const marginX = (layout.canvasWidth - totalContentWidth) / 2;
                            const marginY = (layout.canvasHeight - totalContentHeight) / 2;
                            
                            photoX = marginX + (index % 2) * (photoWidth + gap);
                            photoY = marginY + Math.floor(index / 2) * (photoHeight + gap);
                        }

                        const imgAspect = img.width / img.height;
                        const targetAspect = photoWidth / photoHeight;
                        
                        let drawWidth, drawHeight, drawX, drawY;
                        
                        if (imgAspect > targetAspect) {
                            drawHeight = photoHeight;
                            drawWidth = photoHeight * imgAspect;
                            drawX = photoX - (drawWidth - photoWidth) / 2;
                            drawY = photoY;
                        } else {
                            drawWidth = photoWidth;
                            drawHeight = photoWidth / imgAspect;
                            drawX = photoX;
                            drawY = photoY - (drawHeight - photoHeight) / 2;
                        }

                        ctx.save();
                        const radius = 0;
                        ctx.beginPath();
                        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, radius);
                        ctx.clip();
                        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                        ctx.restore();

                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(photoX, photoY, photoWidth, photoHeight, radius);
                        
                        const isYeoboothFrame = selectedFrame.includes('yeobooth');
                        ctx.strokeStyle = isYeoboothFrame ? '#ef8d56' : '#ffffff';
                        ctx.lineWidth = isYeoboothFrame ? 0 : 0;
                        ctx.stroke();
                        ctx.restore();
                        
                        resolve();
                    };
                    img.onerror = () => {
                        console.error('Failed to load photo for preview:', index);
                        resolve();
                    };
                    img.src = photoDataUrl;
                });
            });

            Promise.all(loadPromises).then(() => {
                if (caption.trim()) {
                    ctx.fillStyle = '#333333';
                    ctx.font = 'bold 28px DynaPuff, system-ui';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const captionY = selectedLayout === '2x2' 
                        ? layout.canvasHeight - 120  
                        : layout.canvasHeight - 190;
                    const captionX = layout.canvasWidth / 2;

                    const truncatedCaption = caption.length > 50 ? caption.substring(0, 50) + '...' : caption;
                    ctx.fillText(truncatedCaption, captionX, captionY);
                }

                setPreviewDataUrl(canvas.toDataURL('image/png', 0.8));
            });
        };
        
        frameImg.onerror = () => {
            console.error('Failed to load frame for preview:', selectedFrameData.image);
            setPreviewDataUrl(null);
        };
        
        frameImg.src = selectedFrameData.image;
    }, [capturedPhotos, caption, selectedLayout, selectedFrame, selectedLayoutData, availableFrames]);

    // Generate preview when photos or caption change
    useEffect(() => {
        if (isSessionComplete) {
            generatePreview();
        }
    }, [isSessionComplete, generatePreview]);

    // Also generate preview when caption changes in real-time
    useEffect(() => {
        if (isSessionComplete && capturedPhotos.length > 0) {
            const debounceTimer = setTimeout(() => {
                generatePreview();
            }, 300); 
            
            return () => clearTimeout(debounceTimer);
        }
    }, [caption, isSessionComplete, capturedPhotos.length, generatePreview]);

    const handleBackToSelection = () => {
        navigate('/selection');
    };

    return (
        <div 
            className="flex flex-col min-h-screen"
            style={{ background: 'linear-gradient(135deg, #ef8d55 0%, #eceae5 100%)' }}
        >
            {/* Minimalist Header */}
            <div className="flex items-center justify-between p-6 flex-shrink-0">
                <button onClick={handleBackToSelection} className="glass-button" aria-label="Back to Selection">
                    <img src={cameraIcon} alt="Back" className="camera-icon" />
                </button>
            </div>

            <div className="flex-1 max-w-6xl w-full mx-auto px-6 pb-6">
                {/* Main Interface */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
                    {/* Camera Section */}
                    <div className="glass-card p-6 space-y-4 flex flex-col">
                        {!isSessionComplete && (
                            <div className="glass-indicator text-center flex-shrink-0">
                                <p className="font-dynapuff text-sm font-medium text-amber-900">
                                    Shot {currentShot + 1} of {totalShots}
                                </p>
                            </div>
                        )}

                        {/* Video Preview */}
                        <div className="relative aspect-square bg-amber-900 rounded-2xl overflow-hidden flex-1 max-h-[70vh] xl:max-h-none">
                            {isLoading && (
                                <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-amber-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="font-dynapuff text-amber-900 font-medium">Starting...</p>
                                    </div>
                                </div>
                            )}

                            {cameraError && (
                                <div className="absolute inset-0 bg-red-100 flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <img src={landingBunny} alt="Error" className="w-16 h-16 mx-auto mb-3 opacity-50" />
                                        <p className="font-dynapuff text-red-800 font-medium mb-3">{cameraError}</p>
                                        <button
                                            onClick={initializeCamera}
                                            className="glass-button"
                                        >
                                            <img src={cameraIcon} alt="Retry" className="camera-icon" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ opacity: isLoading || cameraError ? 0 : 1 }}
                            />

                            {showFlash && (
                                <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
                            )}

                            {showCountdown && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="font-cherry-bomb text-6xl font-bold text-white mb-2 yeobooth-svg">
                                            {countdown}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Camera Controls */}
                        <div className="flex-shrink-0">
                            {!isSessionComplete ? (
                                <button
                                    onClick={handleTakePhoto}
                                    disabled={isCapturing || showCountdown || isLoading || !!cameraError}
                                    className="w-full glass-button justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <img src={cameraIcon} alt="Take Photo" className="camera-icon" />
                                    {!isLoading && !cameraError && !showCountdown && !isCapturing && (
                                        <span className="font-dynapuff font-semibold text-amber-900">Take Photo</span>
                                    )}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="glass-indicator text-center">
                                        <p className="font-dynapuff text-amber-800 font-medium">Complete!</p>
                                    </div>
                                    
                                    <div className="glass-card p-4">
                                        <input
                                            type="text"
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            maxLength={50}
                                            placeholder="Add caption..."
                                            className="w-full px-3 py-2 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-amber-900 font-dynapuff backdrop-blur-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={downloadCollage}
                                            className="glass-button justify-center py-3"
                                        >
                                            <span className="font-dynapuff font-semibold text-amber-800">Download</span>
                                        </button>
                                        <button
                                            onClick={resetSession}
                                            className="glass-button justify-center py-3"
                                        >
                                            <span className="font-dynapuff font-semibold text-amber-900">New</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="glass-card p-6 flex flex-col">
                        <div className="glass-indicator text-center mb-4 flex-shrink-0">
                            <p className="font-dynapuff text-sm text-amber-900">
                                {capturedPhotos.length} of {totalShots}
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col">
                            {capturedPhotos.length === 0 ? (
                                <div className="flex-1 border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center min-h-[300px]">
                                    <div className="text-center">
                                        <img src={landingBunny} alt="Empty" className="w-16 h-16 mx-auto mb-3 opacity-60" />
                                        <p className="font-dynapuff text-amber-700">Photos appear here</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 flex-1 flex flex-col">
                                    {/* Individual Photos Grid */}
                                    <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                                        {Array.from({ length: totalShots }).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`aspect-square rounded-2xl overflow-hidden border-2 ${
                                                    capturedPhotos[index]
                                                        ? 'border-amber-400/60 bg-amber-50/20'
                                                        : 'border-white/30 bg-white/10'
                                                }`}
                                            >
                                                {capturedPhotos[index] ? (
                                                    <img
                                                        src={capturedPhotos[index]}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <img src={cameraIcon} alt="Empty slot" className="w-8 h-8 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Final Preview */}
                                    {isSessionComplete && (
                                        <div className="glass-card p-4 h-80 flex flex-col">
                                            <h4 className="font-dynapuff text-amber-900 font-semibold text-center mb-3 flex-shrink-0">Preview</h4>
                                            <div className="bg-white/80 p-3 rounded-xl backdrop-blur-sm flex-1 flex items-center justify-center overflow-hidden">
                                                {previewDataUrl ? (
                                                    <img
                                                        src={previewDataUrl}
                                                        alt="Final preview"
                                                        className="rounded-lg shadow-lg max-w-full max-h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex justify-center items-center">
                                                        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </div>
    );
};

export default Photobooth;