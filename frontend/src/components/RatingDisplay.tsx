import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export default function RatingDisplay({ rating, count, size = 'md' }: RatingDisplayProps) {
  const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            className={`${starSize} ${filled || half ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`}
          />
        );
      })}
      {count !== undefined && (
        <span className={`${textSize} text-muted-foreground ml-1`}>({count})</span>
      )}
    </div>
  );
}
