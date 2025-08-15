import { Zap, HeartPulse, MonitorPlay, Leaf } from 'lucide-react';

const primaryColor = 'bg-red-700';
const textColor = 'text-gray-900';
const lightTextColor = 'text-white';
const roundedCorners = 'rounded-xl';
const shadow = 'shadow-lg';
const transition = 'transition-all duration-300';
const hoverEffect = 'hover:bg-red-800 hover:scale-[1.01]';

const ServiceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className={`p-6 bg-white ${textColor} ${roundedCorners} ${shadow} ${hoverEffect} ${transition} text-center`}>
      <div className="flex justify-center mb-4 text-red-700">
        <Icon size={48} />
      </div>
      <h4 className="text-2xl font-bold mb-2">{title}</h4>
      <p className="opacity-90">{description}</p>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Hero Section */}
      <section className={`flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 bg-gray-900 ${lightTextColor} ${roundedCorners} ${shadow} mb-8`}>
        <div className="lg:w-1/2 text-center lg:text-left mb-6 lg:mb-0">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Your Journey to a Stronger You Starts Here.</h2>
          <p className="text-lg md:text-2xl opacity-90">Achieve your fitness goals with state-of-the-art equipment and expert guidance.</p>
          <button className={`mt-6 inline-flex items-center px-8 py-4 bg-white ${textColor} font-bold text-xl ${roundedCorners} ${shadow} ${hoverEffect} ${transition}`}>
            Join Us Today!
            <Zap size={24} className="ml-2" />
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://placehold.co/600x400/DDA0DD/000000?text=Fitness+Image"
            alt="Person exercising"
            className={`w-full max-w-sm lg:max-w-md ${roundedCorners} ${shadow}`}
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-8">
        <h3 className={`text-4xl font-bold text-center mb-10 ${textColor}`}>Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            icon={HeartPulse}
            title="Personal Training"
            description="One-on-one sessions with certified trainers to craft a plan just for you."
          />
          <ServiceCard
            icon={MonitorPlay}
            title="Group Classes"
            description="High-energy classes like Yoga, Zumba, and HIIT to keep you motivated and engaged."
          />
          <ServiceCard
            icon={Leaf}
            title="Nutrition Coaching"
            description="Expert advice to fuel your body and complement your workout routine."
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
