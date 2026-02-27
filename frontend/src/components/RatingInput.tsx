import { useState } from 'react';
import { Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  label?: string;
}

export default function RatingInput({ value, onChange, comment, onCommentChange, label }: RatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                (hovered || value) >= star
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
        )}
      </div>
      <Textarea
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        rows={3}
        className="resize-none"
      />
    </div>
  );
}
