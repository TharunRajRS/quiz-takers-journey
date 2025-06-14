
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface Member {
  id: string;
  user_id: string;
  user_name: string;
}

interface PreferencesPanelProps {
  groupId: string;
  members: Member[];
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ groupId, members }) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: preferences, refetch } = useQuery({
    queryKey: ['user-preferences', groupId, selectedMember?.user_id],
    queryFn: async () => {
      if (!selectedMember) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', selectedMember.user_id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedMember,
  });

  React.useEffect(() => {
    if (preferences) {
      setDates(preferences.preferred_dates || []);
      setTimes(preferences.preferred_times || []);
      setLocations(preferences.preferred_locations || []);
    } else {
      setDates([]);
      setTimes([]);
      setLocations([]);
    }
  }, [preferences]);

  const handleSavePreferences = async () => {
    if (!selectedMember) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          group_id: groupId,
          user_id: selectedMember.user_id,
          user_name: selectedMember.user_name,
          preferred_dates: dates,
          preferred_times: times,
          preferred_locations: locations,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Preferences saved successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = (type: 'date' | 'time' | 'location', value: string) => {
    if (!value.trim()) return;
    
    switch (type) {
      case 'date':
        if (!dates.includes(value)) setDates([...dates, value]);
        setNewDate('');
        break;
      case 'time':
        if (!times.includes(value)) setTimes([...times, value]);
        setNewTime('');
        break;
      case 'location':
        if (!locations.includes(value)) setLocations([...locations, value]);
        setNewLocation('');
        break;
    }
  };

  const removeItem = (type: 'date' | 'time' | 'location', value: string) => {
    switch (type) {
      case 'date':
        setDates(dates.filter(d => d !== value));
        break;
      case 'time':
        setTimes(times.filter(t => t !== value));
        break;
      case 'location':
        setLocations(locations.filter(l => l !== value));
        break;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle>Set Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Friend</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {members.map((member) => (
              <Button
                key={member.id}
                variant={selectedMember?.id === member.id ? 'default' : 'outline'}
                onClick={() => setSelectedMember(member)}
                className="text-sm"
              >
                {member.user_name}
              </Button>
            ))}
          </div>
        </div>

        {selectedMember && (
          <>
            <div>
              <Label>Preferred Dates</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <Button onClick={() => addItem('date', newDate)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {dates.map((date) => (
                  <div key={date} className="bg-purple-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {new Date(date).toLocaleDateString()}
                    <button onClick={() => removeItem('date', date)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Times</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
                <Button onClick={() => addItem('time', newTime)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {times.map((time) => (
                  <div key={time} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {time}
                    <button onClick={() => removeItem('time', time)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Locations</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
                <Button onClick={() => addItem('location', newLocation)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {locations.map((location) => (
                  <div key={location} className="bg-green-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {location}
                    <button onClick={() => removeItem('location', location)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSavePreferences} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
