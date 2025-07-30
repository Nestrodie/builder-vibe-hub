import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-lg">
        {/* Animated 404 */}
        <div className="relative">
          <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl font-bold text-purple-500/20 blur-xl">
            404
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-gray-300 text-lg">
            The widget you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-gray-400">
            Don't worry, you can create a new one or return to the widget creator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Widget Creator
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
