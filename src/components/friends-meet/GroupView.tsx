
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Settings } from 'lucide-react';
import { FriendsCircle } from './FriendsCircle';
import { PreferencesPanel } from './PreferencesPanel';
import { SuggestionsPanel } from './SuggestionsPanel';
import { AddMemberDialog } from './AddMemberDialog';

interface GroupViewProps {
  groupId: string;
  onBack: () => void;
}

export const GroupView: React.FC<GroupViewProps> = ({ groupId, onBack }) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeTab, setActiveTab] = useState<'preferences' | 'suggestions'>('preferences');

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetup_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('joined_at');
      
      if (error) throw error;
      return data;
    },
  });

  if (!group) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
          <Button 
            onClick={() => setShowAddMember(true)}
            className="ml-auto bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FriendsCircle members={members || []} />
            
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <Button
                variant={activeTab === 'preferences' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('preferences')}
                className="flex-1"
              >
                Preferences
              </Button>
              <Button
                variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('suggestions')}
                className="flex-1"
              >
                Suggestions
              </Button>
            </div>
          </div>

          <div className="lg:min-h-[600px]">
            {activeTab === 'preferences' ? (
              <PreferencesPanel groupId={groupId} members={members || []} />
            ) : (
              <SuggestionsPanel groupId={groupId} />
            )}
          </div>
        </div>

        <AddMemberDialog
          open={showAddMember}
          onClose={() => setShowAddMember(false)}
          groupId={groupId}
          onSuccess={refetchMembers}
        />
      </div>
    </div>
  );
};
