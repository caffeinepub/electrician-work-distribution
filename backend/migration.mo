import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldElectrician = {
    id : Nat;
    name : Text;
    specialist : {
      #residential;
      #commercial;
      #industrial;
    };
    isAvailable : Bool;
    workAvailability : {
      #fullTime;
      #partTime;
    };
    qualification : {
      #itiElectrician;
      #electronicElectricalEngineering;
      #eeeDiploma;
    };
    email : Text;
    address : Text;
    hourlyRate : Nat;
    currency : Text;
    paymentMethod : Text;
  };

  type OldWorkOrder = {
    id : Nat;
    title : Text;
    description : Text;
    location : Text;
    priority : Nat;
    status : {
      #open;
      #inProgress;
      #completed;
      #cancelled;
    };
    applicationStatus : {
      #pending;
      #accepted;
      #declined;
      #cancelled;
      #verifiedPendingAssignment;
    };
    issuedElectrician : ?Nat;
    createdAt : Time.Time;
    customerEmail : Text;
    customerAddress : Text;
    customerContactNumber : Text;
    paymentAmount : Nat;
    paymentStatus : {
      #pending;
      #paid;
    };
    paymentMethod : Text;
    workerRating : ?{
      rating : Nat;
      comment : Text;
    };
    customerRating : ?{
      rating : Nat;
      comment : Text;
    };
    preferredEducation : {
      #itiElectrician;
      #electronicElectricalEngineering;
      #eeeDiploma;
    };
  };

  type OldActor = {
    openElectricians : Map.Map<Nat, OldElectrician>;
    openWorkOrders : Map.Map<Nat, OldWorkOrder>;
  };

  type VerifiedStatus = {
    #pending;
    #approved;
    #rejected : Text;
    #verifiedPendingAssignment;
  };

  type NewElectrician = {
    id : Nat;
    name : Text;
    specialist : {
      #residential;
      #commercial;
      #industrial;
    };
    isAvailable : Bool;
    workAvailability : {
      #fullTime;
      #partTime;
    };
    qualification : {
      #itiElectrician;
      #electronicElectricalEngineering;
      #eeeDiploma;
    };
    email : Text;
    address : Text;
    hourlyRate : Nat;
    currency : Text;
    paymentMethod : Text;
    verificationStatus : VerifiedStatus;
  };

  type NewWorkOrder = {
    id : Nat;
    title : Text;
    description : Text;
    location : Text;
    priority : Nat;
    status : {
      #open;
      #inProgress;
      #completed;
      #cancelled;
    };
    applicationStatus : {
      #pending;
      #accepted;
      #declined;
      #cancelled;
      #verifiedPendingAssignment;
    };
    issuedElectrician : ?Nat;
    createdAt : Time.Time;
    customerEmail : Text;
    customerAddress : Text;
    customerContactNumber : Text;
    paymentAmount : Nat;
    paymentStatus : {
      #pending;
      #paid;
      #confirmed;
      #flagged : Text;
    };
    paymentMethod : Text;
    workerRating : ?{
      rating : Nat;
      comment : Text;
    };
    customerRating : ?{
      rating : Nat;
      comment : Text;
    };
    preferredEducation : {
      #itiElectrician;
      #electronicElectricalEngineering;
      #eeeDiploma;
    };
    verificationStatus : VerifiedStatus;
  };

  type NewActor = {
    openElectricians : Map.Map<Nat, NewElectrician>;
    openWorkOrders : Map.Map<Nat, NewWorkOrder>;
  };

  public func run(old : OldActor) : NewActor {
    let newElectricians = old.openElectricians.map<Nat, OldElectrician, NewElectrician>(
      func(_, oldElectrician) {
        {
          oldElectrician with
          verificationStatus = #pending;
        };
      }
    );

    let newWorkOrders = old.openWorkOrders.map<Nat, OldWorkOrder, NewWorkOrder>(
      func(_, oldWorkOrder) {
        {
          oldWorkOrder with
          verificationStatus = #pending;
          paymentStatus = switch (oldWorkOrder.paymentStatus) {
            case (#pending) { #pending };
            case (#paid) { #paid };
          };
        };
      }
    );

    {
      openElectricians = newElectricians;
      openWorkOrders = newWorkOrders;
    };
  };
};
