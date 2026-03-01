import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  UserPlus, CheckCircle, UserCheck, FileCheck,
  ClipboardCheck, CreditCard, XCircle, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { WorkOrderStatus, ApplicationProcessStatus } from '../backend';

interface ProcessGuideProps {
  workOrderStatus?: WorkOrderStatus;
  applicationStatus?: ApplicationProcessStatus;
}

const steps = [
  { id: 1, label: 'Customer Books', icon: UserPlus, description: 'Customer submits a service request' },
  { id: 2, label: 'Admin Verifies', icon: CheckCircle, description: 'Admin reviews and verifies the application' },
  { id: 3, label: 'Worker Assigned', icon: UserCheck, description: 'Electrician is assigned to the order' },
  { id: 4, label: 'Order Confirmed', icon: FileCheck, description: 'Order is confirmed and work begins' },
  { id: 5, label: 'Checklist Done', icon: ClipboardCheck, description: 'Worker completes all checklist items' },
  { id: 6, label: 'Payment Collected', icon: CreditCard, description: 'Payment is collected from customer' },
  { id: 7, label: 'Order Closed', icon: XCircle, description: 'Order is marked as completed and closed' },
];

function getCurrentStep(
  workOrderStatus?: WorkOrderStatus,
  applicationStatus?: ApplicationProcessStatus
): number {
  if (!workOrderStatus && !applicationStatus) return 0;
  if (workOrderStatus === WorkOrderStatus.completed) return 7;
  if (workOrderStatus === WorkOrderStatus.cancelled) return 0;
  if (workOrderStatus === WorkOrderStatus.inProgress) {
    if (applicationStatus === ApplicationProcessStatus.accepted) return 4;
    return 4;
  }
  if (workOrderStatus === WorkOrderStatus.open) {
    if (applicationStatus === ApplicationProcessStatus.verifiedPendingAssignment) return 3;
    if (applicationStatus === ApplicationProcessStatus.pending) return 2;
    return 1;
  }
  return 1;
}

export default function ProcessGuide({ workOrderStatus, applicationStatus }: ProcessGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentStep = getCurrentStep(workOrderStatus, applicationStatus);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Process Guide</p>
                <p className="text-xs text-muted-foreground">7-stage workflow overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                  Stage {currentStep}/7
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
          <div className="px-5 pb-5 pt-2">
            {/* Mobile: vertical stepper */}
            <div className="block md:hidden space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${isCompleted ? 'bg-green-500/40' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: horizontal stepper */}
            <div className="hidden md:flex items-start gap-1">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-medium leading-tight ${
                          isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mt-5 transition-colors ${isCompleted ? 'bg-green-500/40' : 'bg-border'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
