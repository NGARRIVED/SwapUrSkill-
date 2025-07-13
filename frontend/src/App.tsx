import React from 'react';
import './styles/globals.css';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Avatar } from './components';

// Main App component with component showcase
export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-display text-center mb-8 animate-luxury-fade-in">
          Welcome to SkillCoterie
        </h1>
        <p className="text-body text-center max-w-2xl mx-auto mb-12 animate-luxury-slide-up">
          The exclusive platform for luxury skill exchange among professionals.
        </p>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Button Showcase */}
          <Card variant="default">
            <CardHeader>
              <h2 className="text-heading">Button Components</h2>
              <p>Luxury-styled buttons with multiple variants</p>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="small">Small</Button>
                  <Button variant="primary" size="medium">Medium</Button>
                  <Button variant="primary" size="large">Large</Button>
                </div>
                <Button variant="primary" fullWidth>Full Width</Button>
              </div>
            </CardBody>
          </Card>

          {/* Input Showcase */}
          <Card variant="default">
            <CardHeader>
              <h2 className="text-heading">Input Components</h2>
              <p>Elegant form inputs with validation</p>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input 
                  label="Full Name"
                  placeholder="Enter your full name"
                />
                <Input 
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  error="Please enter a valid email address"
                />
                <Input 
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </CardBody>
          </Card>

          {/* Avatar Showcase */}
          <Card variant="default">
            <CardHeader>
              <h2 className="text-heading">Avatar Components</h2>
              <p>User profile pictures with fallbacks</p>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-4">
                <Avatar size="small" fallback="John Doe" />
                <Avatar size="medium" fallback="Jane Smith" />
                <Avatar size="large" fallback="Dr. Sarah" />
                <Avatar size="xlarge" fallback="Prof. Johnson" />
              </div>
            </CardBody>
          </Card>

          {/* Card Variants Showcase */}
          <Card variant="gold">
            <CardHeader>
              <h2 className="text-heading text-white">Gold Card</h2>
              <p className="text-white opacity-90">Premium card variant</p>
            </CardHeader>
            <CardBody>
              <p className="text-white">
                This card uses the luxury gold gradient background with white text.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="small">Learn More</Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
} 