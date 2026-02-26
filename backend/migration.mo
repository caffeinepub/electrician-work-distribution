import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type UserProfile = {
    name : Text;
    email : Text;
  };

  type OldSpeciality = {
    #residential;
    #commercial;
    #industrial;
  };

  type RepairServiceType = {
    #television;
    #ac;
    #fridge;
    #ceilingFan;
    #tableFan;
  };

  type Electrician = {
    id : Nat;
    name : Text;
    specialist : OldSpeciality;
    isAvailable : Bool;
    email : Text;
    address : Text;
    hourlyRate : Nat;
    currency : Text;
    paymentMethod : Text;
  };

  type WorkOrderStatus = {
    #open;
    #inProgress;
    #completed;
    #cancelled;
  };

  type PaymentStatus = {
    #pending;
    #paid;
  };

  type Rating = {
    rating : Nat;
    comment : Text;
  };

  type OldWorkOrder = {
    id : Nat;
    title : Text;
    description : Text;
    location : Text;
    priority : Nat;
    status : WorkOrderStatus;
    issuedElectrician : Nat;
    createdAt : Time.Time;
    customerEmail : Text;
    customerAddress : Text;
    paymentAmount : Nat;
    paymentStatus : PaymentStatus;
    paymentMethod : Text;
    workerRating : ?Rating;
    customerRating : ?Rating;
    preferredEducation : Text;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    nextElectricianId : Nat;
    nextWorkOrderId : Nat;
    openElectricians : Map.Map<Nat, Electrician>;
    openWorkOrders : Map.Map<Nat, OldWorkOrder>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
