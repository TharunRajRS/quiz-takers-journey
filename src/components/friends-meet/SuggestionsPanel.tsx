
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SuggestionsPanelProps {
  groupId: string;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ groupId }) => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const { data: suggestions, refetch } = useQuery({
    queryKey: ['meetup-suggestions', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetup_suggestions')
        .select('*')
        .eq('group_id', groupId)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: preferences } = useQuery({
    queryKey: ['all-preferences', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('group_id', groupId);
      
      if (error) throw error;
      return data;
    },
  });

  const generateSuggestions = async () => {
    if (!preferences || preferences.length === 0) {
      toast({
        title: "No Preferences",
        description: "Add some preferences first to generate suggestions",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      // Clear existing suggestions
      await supabase
        .from('meetup_suggestions')
        .delete()
        .eq('group_id', groupId);

      // Aggregate preferences
      const allDates = preferences.flatMap(p => p.preferred_dates || []);
      const allTimes = preferences.flatMap(p => p.preferred_times ||[]);
      const allLocations = preferences.flatMap(p => p.preferred_locations || []);

      // Count occurrences
      const dateCount = allDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const timeCount = allTimes.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const locationCount = allLocations.reduce((acc, location) => {
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Generate suggestions based on most popular combinations
      const suggestions = [];
      const topDates = Object.entries(dateCount).sort(([,a], [,b]) => b - a).slice(0, 3);
      const topTimes = Object.entries(timeCount).sort(([,a], [,b]) => b - a).slice(0, 3);
      const topLocations = Object.entries(locationCount).sort(([,a], [,b]) => b - a).slice(0, 3);

      for (const [date, dateScore] of topDates) {
        for (const [time, timeScore] of topTimes) {
          for (const [location, locationScore] of topLocations) {
            suggestions.push({
              group_id: groupId,
              suggested_date: date,
              suggested_time: time,
              suggested_location: location,
              score: dateScore + timeScore + locationScore,
            });
          }
        }
      }

      // Insert top suggestions
      if (suggestions.length > 0) {
        const topSuggestions = suggestions
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        const { error } = await supabase
          .from('meetup_suggestions')
          .insert(topSuggestions);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: "Meetup suggestions generated successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Meetup Suggestions
          <Button 
            onClick={generateSuggestions}
            disabled={generating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {generating ? 'Generating...' : 'Generate'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!suggestions || suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No suggestions yet</p>
            <p className="text-sm mt-2">Click "Generate" to create suggestions based on everyone's preferences</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={suggestion.id} className="border-l-4 border-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Option {index + 1}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{suggestion.score}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      {new Date(suggestion.suggested_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {suggestion.suggested_time}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-600" />
                      {suggestion.suggested_location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
