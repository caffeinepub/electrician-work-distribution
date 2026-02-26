import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type JobAlertSubscription = {
    principal : Principal;
    subscribedAt : Int;
  };

  public type NewActor = { jobAlertSubscriptions : Map.Map<Principal, JobAlertSubscription> };
  public type OldActor = {};

  public func run(_ : OldActor) : NewActor {
    {
      jobAlertSubscriptions = Map.empty<Principal, JobAlertSubscription>();
    };
  };
};
