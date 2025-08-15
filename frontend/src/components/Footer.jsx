import { Dumbbell } from 'lucide-react';

const lightTextColor = 'text-white';

const Footer = () => {
  return (
    <footer className={`bg-gray-900 ${lightTextColor} p-8 mt-8`}>
      <div className="container mx-auto text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <Dumbbell size={24} className="text-red-700" />
            <span className="text-xl font-bold">BeautyFitness</span>
          </div>
          <div className="text-sm">
            <p>&copy; 2023 BeautyFitness. All rights reserved.</p>
            <p>Designed with passion and code.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
