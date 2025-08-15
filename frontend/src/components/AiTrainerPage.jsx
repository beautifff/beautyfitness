import { useState } from 'react';
import { Loader2, ClipboardList } from 'lucide-react';

const primaryColor = 'bg-red-700';
const textColor = 'text-gray-900';
const lightTextColor = 'text-white';
const roundedCorners = 'rounded-xl';
const shadow = 'shadow-lg';
const transition = 'transition-all duration-300';
const hoverEffect = 'hover:bg-red-800 hover:scale-[1.01]';

const AiTrainerPage = () => {
  const [goal, setGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [frequency, setFrequency] = useState('3 times a week');
  const [generatedProgram, setGeneratedProgram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateProgram = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedProgram('');

    const requestBody = {
      goal,
      fitness_level: fitnessLevel,
      frequency,
    };

    try {
      // Simulate a network delay to mimic the time it would take for a real API call.
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResponse = {
        program: `
          # Personalized 4-Week Training Plan

          Congratulations on taking the first step towards your fitness goals! This plan is designed to help you **${requestBody.goal}** at an **${requestBody.fitness_level}** level, with a training frequency of **${requestBody.frequency}**.

          ### Week 1: Foundation Building

          **Day 1: Full Body Strength**
          -   **Warm-up:** 5 minutes of light cardio (jumping jacks, jogging in place).
          -   **Workout:**
              -   Squats: 3 sets of 10 reps
              -   Push-ups (on knees if needed): 3 sets of 8 reps
              -   Lunges: 3 sets of 10 reps per leg
              -   Plank: 3 sets, hold for 30 seconds
          -   **Cool-down:** 5 minutes of stretching.
        `
      };

      setGeneratedProgram(mockResponse.program);

    } catch (err) {
      console.error(err);
      setError('Failed to generate program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className={`text-5xl font-bold text-center mb-8 ${textColor}`}>Your AI Fitness Trainer</h2>
      <div className={`bg-gray-100 p-8 ${roundedCorners} ${shadow} mb-8`}>
        <p className="text-lg mb-6 text-center">
          Get a personalized 4-week training plan tailored to your goals and fitness level.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Goal Input */}
          <div>
            <label htmlFor="goal" className="block text-lg font-medium mb-2">What is your main fitness goal?</label>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Build muscle, lose weight, improve endurance"
              className={`w-full p-3 border-2 border-gray-300 ${roundedCorners} focus:outline-none focus:ring-2 focus:ring-red-700`}
            />
          </div>
          {/* Fitness Level Dropdown */}
          <div>
            <label htmlFor="fitnessLevel" className="block text-lg font-medium mb-2">Your current fitness level?</label>
            <select
              id="fitnessLevel"
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              className={`w-full p-3 border-2 border-gray-300 ${roundedCorners} focus:outline-none focus:ring-2 focus:ring-red-700`}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          {/* Frequency Dropdown */}
          <div>
            <label htmlFor="frequency" className="block text-lg font-medium mb-2">How often can you train?</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`w-full p-3 border-2 border-gray-300 ${roundedCorners} focus:outline-none focus:ring-2 focus:ring-red-700`}
            >
              <option value="2 times a week">2 times a week</option>
              <option value="3 times a week">3 times a week</option>
              <option value="4 times a week">4 times a week</option>
              <option value="5+ times a week">5+ times a week</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={generateProgram}
            disabled={isLoading || !goal.trim()}
            className={`flex items-center px-8 py-3 ${primaryColor} ${lightTextColor} font-bold text-lg ${roundedCorners} ${shadow} ${hoverEffect} ${transition} disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <ClipboardList size={24} className="mr-2" />
                Generate My Program
              </>
            )}
          </button>
        </div>
      </div>

      {/* Program Output Section */}
      {generatedProgram && (
        <div className={`bg-white p-8 ${roundedCorners} ${shadow}`}>
          <h3 className={`text-4xl font-bold mb-4 ${textColor}`}>Your Personalized Training Plan</h3>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedProgram }} />
        </div>
      )}
      {error && (
        <div className={`p-4 bg-red-100 border-l-4 border-red-700 text-red-700 ${roundedCorners} mt-6`}>
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AiTrainerPage;
