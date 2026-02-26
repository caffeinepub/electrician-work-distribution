export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Amber spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-body animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
