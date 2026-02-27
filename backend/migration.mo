import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
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
    createdAt : Int;
    customerEmail : Text;
    customerAddress : Text;
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
    openWorkOrders : Map.Map<Nat, OldWorkOrder>;
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
    createdAt : Int;
    customerEmail : Text;
    customerAddress : Text;
    customerContactNumber : Text;
    paymentAmount : Nat;
    paymentStatus : {
      #pending;
      #paid;
    };
    paymentMethod : Text;
    workerRating : ?{ rating : Nat; comment : Text };
    customerRating : ?{ rating : Nat; comment : Text };
    preferredEducation : {
      #itiElectrician;
      #electronicElectricalEngineering;
      #eeeDiploma;
    };
  };

  type NewActor = {
    openWorkOrders : Map.Map<Nat, NewWorkOrder>;
  };

  public func run(old : OldActor) : NewActor {
    let newWorkOrders = old.openWorkOrders.map<Nat, OldWorkOrder, NewWorkOrder>(
      func(_id, oldWorkOrder) {
        {
          id = oldWorkOrder.id;
          title = oldWorkOrder.title;
          description = oldWorkOrder.description;
          location = oldWorkOrder.location;
          priority = oldWorkOrder.priority;
          status = oldWorkOrder.status;
          applicationStatus = oldWorkOrder.applicationStatus;
          issuedElectrician = oldWorkOrder.issuedElectrician;
          createdAt = oldWorkOrder.createdAt;
          customerEmail = oldWorkOrder.customerEmail;
          customerAddress = oldWorkOrder.customerAddress;
          customerContactNumber = "";
          paymentAmount = oldWorkOrder.paymentAmount;
          paymentStatus = oldWorkOrder.paymentStatus;
          paymentMethod = oldWorkOrder.paymentMethod;
          workerRating = oldWorkOrder.workerRating;
          customerRating = oldWorkOrder.customerRating;
          preferredEducation = oldWorkOrder.preferredEducation;
        };
      }
    );
    { openWorkOrders = newWorkOrders };
  };
};
