
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onClose,
  groupId,
  onSuccess,
}) => {
  const [memberName, setMemberName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: crypto.randomUUID(),
          user_name: memberName.trim(),
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Friend added to the group",
      });

      setMemberName('');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add friend",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Friend to Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="memberName">Friend's Name</Label>
            <Input
              id="memberName"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Enter friend's name"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Friend'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
