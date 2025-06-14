
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar } from 'lucide-react';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
  };
  onClick: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const { data: memberCount } = useQuery({
    queryKey: ['group-member-count', group.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);
      
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-purple-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          {group.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {memberCount} members
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(group.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
