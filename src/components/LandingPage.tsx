
import { useNavigate } from 'react-router-dom';
import landingBunny from '../assets/landing-bunny.svg';
import cameraIcon from '../assets/camera-icon.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGoToBooth = () => {
    navigate('/selection');
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ef8d55 0%, #eceae5 100%)' }}
    >
      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column - Brand & Content */}
          <div className=" space-y-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h1 className="flex justify-center font-cherry-bomb text-8xl lg:text-9xl font-bold yeobooth-svg tracking-tight">
                Yeobooth
              </h1>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-6">
              <button onClick={handleGoToBooth} className="glass-button" aria-label="Go to Booth">
                <img src={cameraIcon} alt="Camera" className="camera-icon" />
              </button>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="flex flex-col items-center space-y-8">
            {/* Camera Icon Representation */}
            <img src={landingBunny} alt="Landing Bunny" className="w-200 max-w-full max-h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;