interface JobApplicationStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function JobApplicationStepper({
  currentStep,
  totalSteps,
  stepLabels,
}: JobApplicationStepperProps) {
  const defaultLabels = Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);
  const labels = stepLabels ?? defaultLabels;

  return (
    <div className="w-full">
      {/* Step counter text */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-primary font-medium">{labels[currentStep - 1]}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary/20 border-primary text-primary scale-110'
                    : 'bg-muted border-border text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs hidden sm:block transition-colors duration-300 ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
