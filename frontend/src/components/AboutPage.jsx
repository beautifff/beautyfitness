import { Quote, Sparkles } from 'lucide-react';

const textColor = 'text-gray-900';
const roundedCorners = 'rounded-xl';
const shadow = 'shadow-lg';

const QuoteSection = () => {
  return (
    <div className={`bg-gray-100 p-8 ${roundedCorners} ${shadow}`}>
      <div className="flex items-center mb-4">
        <Quote size={40} className={`text-red-700 mr-4`} />
        <div>
          <h4 className="text-2xl font-bold">Our Philosophy</h4>
          <p className="text-lg italic">"Fitness is not a destination, it's a way of life."</p>
        </div>
      </div>
      <p className="text-md mt-4">
        We believe that consistent effort and a positive mindset are the keys to long-term success. Our trainers are committed to guiding you, not just through workouts, but by instilling habits that will last a lifetime.
      </p>
    </div>
  );
};

const MissionSection = () => {
  return (
    <div className={`bg-gray-100 p-8 ${roundedCorners} ${shadow}`}>
      <div className="flex items-center mb-4">
        <Sparkles size={40} className={`text-red-700 mr-4`} />
        <div>
          <h4 className="text-2xl font-bold">Our Mission</h4>
          <p className="text-lg">To empower you to become the best version of yourself.</p>
        </div>
      </div>
      <p className="text-md mt-4">
        We strive to create an inclusive and supportive environment where every member feels welcome. Our mission is to provide the tools, knowledge, and motivation you need to achieve your health and fitness goals.
      </p>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className={`text-5xl font-bold text-center mb-8 ${textColor}`}>About BeautyFitness</h2>
      <div className={`bg-white p-8 ${roundedCorners} ${shadow} mb-8`}>
        <p className="text-lg mb-4">
          BeautyFitness is more than just a gym; it's a community dedicated to helping you achieve your health and wellness goals. We believe that fitness is a journey of self-discovery and empowerment. Our state-of-the-art facility, combined with our passionate and knowledgeable trainers, provides the perfect environment for you to thrive.
        </p>
        <p className="text-lg">
          We offer a wide range of services, from personalized training plans to high-energy group classes, all designed to cater to different fitness levels and interests. Our mission is to inspire and support you every step of the way, helping you unlock your full potential and embrace a healthier, more active lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <QuoteSection />
        <MissionSection />
      </div>
    </div>
  );
};

export default AboutPage;
