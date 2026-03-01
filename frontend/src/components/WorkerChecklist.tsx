import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { useGetWorkerChecklist, useUpdateChecklistItem } from '../hooks/useQueries';

interface WorkerChecklistProps {
  workOrderId: string;
}

export default function WorkerChecklist({ workOrderId }: WorkerChecklistProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: items = [], isLoading } = useGetWorkerChecklist(workOrderId);
  const updateItem = useUpdateChecklistItem();

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (itemId: string, currentCompleted: boolean) => {
    updateItem.mutate({
      workOrderId,
      itemId,
      completed: !currentCompleted,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Worker Checklist</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {progressPercent === 100 && (
                <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" /> All done
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="collapsible-content">
          <div className="px-4 pb-4 pt-1 space-y-3">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{completedCount}/{totalCount} steps completed</span>
                <span className="text-xs font-medium text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Checklist items */}
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {items
                  .slice()
                  .sort((a, b) => Number(a.order) - Number(b.order))
                  .map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                        item.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/30 border border-transparent'
                      }`}
                    >
                      <Checkbox
                        id={`${workOrderId}-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => handleToggle(item.id, item.completed)}
                        disabled={updateItem.isPending}
                        className="shrink-0"
                      />
                      <label
                        htmlFor={`${workOrderId}-${item.id}`}
                        className={`text-sm cursor-pointer flex-1 transition-all ${
                          item.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {item.taskLabel}
                      </label>
                      {item.completed && (
                        <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
