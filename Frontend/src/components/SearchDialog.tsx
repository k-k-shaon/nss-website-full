import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search for events, blogs, projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
              autoFocus
            />
          </div>

          <div className='min-h-[200px]'>
            {searchQuery.trim().length >= 2 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <p>Search functionality coming soon!</p>
                <p className='text-sm mt-2'>Searching for: {searchQuery}</p>
              </div>
            ) : searchQuery.trim().length > 0 ? (
              <p className='text-sm text-muted-foreground text-center py-8'>
                Type at least 2 characters to search
              </p>
            ) : (
              <p className='text-sm text-muted-foreground text-center py-8'>
                Start typing to search...
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};