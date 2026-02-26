import { useState } from 'react';
import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
}

export function RatingInput({ value, onChange, comment, onCommentChange }: RatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-foreground text-sm">Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hovered || value)
                    ? 'fill-primary text-primary'
                    : 'fill-transparent text-muted-foreground/40'
                }`}
              />
            </button>
          ))}
          {value > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Very Good' : 'Excellent'}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground text-sm">Comment (optional)</Label>
        <Textarea
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          placeholder="Share your experience..."
          className="bg-background border-border text-foreground resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}
