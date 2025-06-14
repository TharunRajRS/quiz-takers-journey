
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Member {
  id: string;
  user_name: string;
  joined_at: string;
}

interface FriendsCircleProps {
  members: Member[];
}

export const FriendsCircle: React.FC<FriendsCircleProps> = ({ members }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCirclePosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = Math.min(120, 80 + total * 8);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const colors = [
    'bg-purple-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center">Friends Circle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-80 flex items-center justify-center">
          {members.length === 0 ? (
            <p className="text-gray-500 text-center">No friends added yet</p>
          ) : (
            <>
              {/* Center circle */}
              <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">Meet</span>
              </div>

              {/* Friend avatars in circle */}
              {members.map((member, index) => {
                const { x, y } = getCirclePosition(index, members.length);
                const colorClass = colors[index % colors.length];
                
                return (
                  <div
                    key={member.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <Avatar className={`w-12 h-12 ${colorClass} shadow-lg border-2 border-white`}>
                        <AvatarFallback className="text-white font-semibold">
                          {getInitials(member.user_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-700 mt-1 max-w-16 text-center truncate">
                        {member.user_name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
