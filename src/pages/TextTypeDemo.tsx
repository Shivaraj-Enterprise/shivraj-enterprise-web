import { useState } from 'react';
import TextType from '@/components/TextType';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TextTypeDemo = () => {
  const [resetKey, setResetKey] = useState(0);

  const resetAnimation = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            TextType Component Demo
          </h1>
          <p className="text-lg text-slate-600">
            A React component for beautiful typing animations powered by GSAP
          </p>
        </div>

        {/* Basic Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Basic Typing Animation</CardTitle>
            <CardDescription>Simple text typing effect with default settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600 min-h-16 flex items-center">
              <TextType
                key={`basic-${resetKey}`}
                text="Welcome to TextType Component!"
                typingSpeed={75}
                pauseDuration={2000}
                showCursor={true}
                cursorCharacter="|"
              />
            </div>
          </CardContent>
        </Card>

        {/* Multiple Sentences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Multiple Sentences with Looping</CardTitle>
            <CardDescription>Cycles through an array of text with smooth transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium text-purple-600 min-h-12 flex items-center">
              <TextType
                key={`multi-${resetKey}`}
                text={[
                  "React is awesome!",
                  "GSAP makes animations smooth.",
                  "TextType is powerful!",
                  "Let's build amazing things together."
                ]}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={1500}
                loop={true}
                showCursor={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Colors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Multi-Colored Text</CardTitle>
            <CardDescription>Each sentence displayed in a different color</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold min-h-12 flex items-center">
              <TextType
                key={`colored-${resetKey}`}
                text={["Red sentence", "Green sentence", "Blue sentence"]}
                typingSpeed={70}
                pauseDuration={1800}
                textColors={["#ef4444", "#22c55e", "#3b82f6"]}
                showCursor={true}
                cursorCharacter="█"
                cursorClassName="text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Variable Speed (Human-like) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Variable Typing Speed</CardTitle>
            <CardDescription>Human-like typing with random speed variations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium text-amber-600 min-h-12 flex items-center">
              <TextType
                key={`variable-${resetKey}`}
                text="This text types at variable speed for a more natural feel..."
                variableSpeed={{ min: 30, max: 120 }}
                pauseDuration={2000}
                showCursor={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Styling */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Custom Styling</CardTitle>
            <CardDescription>Custom cursor and text styling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600 min-h-12 flex items-center bg-emerald-50 p-4 rounded">
              <TextType
                key={`styled-${resetKey}`}
                text="Custom styled component with custom cursor!"
                as="span"
                typingSpeed={50}
                pauseDuration={2000}
                showCursor={true}
                cursorCharacter="▌"
                cursorClassName="text-emerald-600"
                className="font-mono tracking-wider"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hide Cursor While Typing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hide Cursor While Typing</CardTitle>
            <CardDescription>Cursor only shows during pause periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-indigo-600 min-h-12 flex items-center">
              <TextType
                key={`hide-cursor-${resetKey}`}
                text={["Cursor is hidden...", "while typing happens.", "But shows when paused!"]}
                typingSpeed={60}
                hideCursorWhileTyping={true}
                pauseDuration={1500}
                showCursor={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Single Text No Loop */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Single Text (No Loop)</CardTitle>
            <CardDescription>Types once and stays visible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium text-rose-600 min-h-12 flex items-center">
              <TextType
                key={`single-${resetKey}`}
                text="This text types once and remains on screen."
                typingSpeed={75}
                loop={false}
                showCursor={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Text Animation Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Text Animation Example</CardTitle>
            <CardDescription>Clean typing animation without underline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-cyan-600 min-h-16 flex items-center">
              <TextType
                key={`example-basic-${resetKey}`}
                text="Text animation without underline"
                typingSpeed={60}
                pauseDuration={2000}
                showCursor={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Animated Text Example</CardTitle>
            <CardDescription>Typing animation that appears clean and simple</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-amber-600 min-h-16 flex items-center">
              <TextType
                key={`example-glow-${resetKey}`}
                text="Typing animation effect"
                typingSpeed={50}
                pauseDuration={2000}
                showCursor={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Multiple Sentences Demo</CardTitle>
            <CardDescription>Sequential typing for multiple sentences without underline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold min-h-16 flex items-center">
              <TextType
                key={`example-multi-${resetKey}`}
                text={["Red journey", "Green growth", "Blue transformation"]}
                typingSpeed={55}
                pauseDuration={1500}
                textColors={["#ef4444", "#22c55e", "#3b82f6"]}
                showCursor={true}
                loop={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="text-center mt-12">
          <Button
            onClick={resetAnimation}
            size="lg"
            className="bg-slate-900 hover:bg-slate-800"
          >
            Reset All Animations
          </Button>
        </div>

        {/* Info Section */}
        <Card className="mt-12 bg-slate-900 text-white border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Component Props Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong>text:</strong> string | string[] - Text to type</p>
              <p><strong>typingSpeed:</strong> number (default: 50ms) - Speed of typing</p>
              <p><strong>deletingSpeed:</strong> number (default: 30ms) - Speed of deletion</p>
              <p><strong>pauseDuration:</strong> number (default: 2000ms) - Pause between cycles</p>
              <p><strong>loop:</strong> boolean (default: true) - Loop through texts</p>
              <p><strong>showCursor:</strong> boolean (default: true) - Show blinking cursor</p>
              <p><strong>textColors:</strong> string[] - Array of colors for each sentence</p>
              <p><strong>variableSpeed:</strong> {'{min, max}'} - Random speed range for natural feel</p>
              <p><strong>startOnVisible:</strong> boolean - Start animation when visible</p>
              <p><strong>reverseMode:</strong> boolean - Type backwards (right to left)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TextTypeDemo;
