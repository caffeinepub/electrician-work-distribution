import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export function RatingDisplay({ rating, count, size = 'md' }: RatingDisplayProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = rating >= star;
          const halfFilled = !filled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              className={`${starSize} ${
                filled
                  ? 'fill-primary text-primary'
                  : halfFilled
                  ? 'fill-primary/50 text-primary'
                  : 'fill-transparent text-muted-foreground/30'
              }`}
            />
          );
        })}
      </div>
      <span className={`${textSize} font-medium text-foreground`}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className={`${textSize} text-muted-foreground`}>({count})</span>
      )}
    </div>
  );
}
