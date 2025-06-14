
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateGroupDialog } from '@/components/friends-meet/CreateGroupDialog';
import { GroupCard } from '@/components/friends-meet/GroupCard';
import { GroupView } from '@/components/friends-meet/GroupView';

const FriendsMeet = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: groups, refetch: refetchGroups } = useQuery({
    queryKey: ['meetup-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetup_groups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (selectedGroupId) {
    return (
      <GroupView 
        groupId={selectedGroupId} 
        onBack={() => setSelectedGroupId(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Friends Meet</h1>
          <p className="text-gray-600">Plan the perfect meetup with your friends</p>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => setSelectedGroupId(group.id)}
            />
          ))}
        </div>

        {groups?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No groups yet</h3>
              <p className="text-gray-500">Create your first meetup group to get started!</p>
            </CardContent>
          </Card>
        )}

        <CreateGroupDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={refetchGroups}
        />
      </div>
    </div>
  );
};

export default FriendsMeet;
