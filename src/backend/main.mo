import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import MixinStorage "blob-storage/Mixin";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Result<Ok, Err> = {
    #ok : Ok;
    #err : Err;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  type WorkOrderStatus = {
    #open;
    #inProgress;
    #completed;
    #cancelled;
  };

  type ApplicationProcessStatus = {
    #pending;
    #accepted;
    #declined;
    #cancelled;
    #verifiedPendingAssignment;
  };

  public type PublicJobAlertSubscription = {
    subscribedAt : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Speciality = {
    #residential;
    #commercial;
    #industrial;
  };

  module Speciality {
    public func toText(s : Speciality) : Text {
      switch (s) {
        case (#residential) { "Residential" };
        case (#commercial) { "Commercial" };
        case (#industrial) { "Industrial" };
      };
    };
  };

  public type WorkAvailability = {
    #fullTime;
    #partTime;
  };

  public type ElectricianQualification = {
    #itiElectrician;
    #electronicElectricalEngineering;
    #eeeDiploma;
  };

  module ElectricianQualification {
    public func toText(q : ElectricianQualification) : Text {
      switch (q) {
        case (#itiElectrician) { "ITI Electrician" };
        case (#electronicElectricalEngineering) { "Electronic Electrical Engineering" };
        case (#eeeDiploma) { "EEE Diploma" };
      };
    };
  };

  public type RepairServiceType = {
    #electronicRepair;
    #acTechnician;
    #fridgeRepairWork;
    #electrician;
  };

  module RepairServiceType {
    public func toText(t : RepairServiceType) : Text {
      switch (t) {
        case (#electronicRepair) { "Electronic Repair" };
        case (#acTechnician) { "AC Technician" };
        case (#fridgeRepairWork) { "Fridge Repair Work" };
        case (#electrician) { "Electrician" };
      };
    };
  };

  type Electrician = {
    id : Nat;
    name : Text;
    specialist : Speciality;
    isAvailable : Bool;
    workAvailability : WorkAvailability;
    qualification : ElectricianQualification;
    email : Text;
    address : Text;
    hourlyRate : Nat;
    currency : Text;
    paymentMethod : Text;
    verificationStatus : VerificationStatus;
    assignedWorkOrders : List.List<Nat>;
  };

  // Immutable snapshot type for returning to public functions
  public type ElectricianView = {
    id : Nat;
    name : Text;
    specialist : Speciality;
    isAvailable : Bool;
    workAvailability : WorkAvailability;
    qualification : ElectricianQualification;
    email : Text;
    address : Text;
    hourlyRate : Nat;
    currency : Text;
    paymentMethod : Text;
    verificationStatus : VerificationStatus;
    assignedWorkOrders : [Nat];
  };

  module Electrician {
    public func compare(a : Electrician, b : Electrician) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func toView(e : Electrician) : ElectricianView {
      {
        id = e.id;
        name = e.name;
        specialist = e.specialist;
        isAvailable = e.isAvailable;
        workAvailability = e.workAvailability;
        qualification = e.qualification;
        email = e.email;
        address = e.address;
        hourlyRate = e.hourlyRate;
        currency = e.currency;
        paymentMethod = e.paymentMethod;
        verificationStatus = e.verificationStatus;
        assignedWorkOrders = e.assignedWorkOrders.toArray();
      };
    };
  };

  module WorkOrderStatus {
    public func toText(s : WorkOrderStatus) : Text {
      switch (s) {
        case (#open) { "Open" };
        case (#inProgress) { "In Progress" };
        case (#completed) { "Completed" };
        case (#cancelled) { "Cancelled" };
      };
    };
  };

  type PaymentStatus = {
    #pending;
    #paid;
    #confirmed;
    #flagged : Text;
  };

  module PaymentStatus {
    public func toText(s : PaymentStatus) : Text {
      switch (s) {
        case (#pending) { "Pending" };
        case (#paid) { "Paid" };
        case (#confirmed) { "Confirmed" };
        case (#flagged(note)) { "Flagged: " # note };
      };
    };
  };

  module ApplicationProcessStatus {
    public func toText(status : ApplicationProcessStatus) : Text {
      switch (status) {
        case (#pending) { "Pending" };
        case (#accepted) { "Accepted" };
        case (#declined) { "Declined" };
        case (#cancelled) { "Cancelled" };
        case (#verifiedPendingAssignment) { "Verified - Pending Assignment" };
      };
    };
  };

  type Rating = {
    rating : Nat;
    comment : Text;
  };

  type WorkOrderApplication = {
    workOrderId : Nat;
    applicant : Principal;
    appliedAt : Time.Time;
  };

  public type ChecklistItem = {
    id : Text;
    taskLabel : Text;
    completed : Bool;
    order : Nat;
  };

  public type Checklist = {
    workOrderId : Text;
    items : List.List<ChecklistItem>;
  };

  type WorkOrder = {
    id : Nat;
    title : Text;
    description : Text;
    location : Text;
    priority : Nat;
    status : WorkOrderStatus;
    applicationStatus : ApplicationProcessStatus;
    issuedElectrician : ?Nat;
    createdAt : Time.Time;
    customerEmail : Text;
    customerAddress : Text;
    customerContactNumber : Text;
    paymentAmount : Nat;
    paymentStatus : PaymentStatus;
    paymentMethod : Text;
    workerRating : ?Rating;
    customerRating : ?Rating;
    preferredEducation : ElectricianQualification;
    verificationStatus : VerificationStatus;
  };

  module WorkOrder {
    public func compare(a : WorkOrder, b : WorkOrder) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type VerificationStatus = {
    #pending;
    #approved;
    #rejected : Text;
    #verifiedPendingAssignment;
  };

  module VerificationStatus {
    public func toText(status : VerificationStatus) : Text {
      switch (status) {
        case (#pending) { "Pending" };
        case (#approved) { "Approved" };
        case (#rejected(reason)) { "Rejected: " # reason };
        case (#verifiedPendingAssignment) { "Verified Pending Assignment" };
      };
    };
  };

  let openElectricians = Map.empty<Nat, Electrician>();
  let openWorkOrders = Map.empty<Nat, WorkOrder>();
  let workOrderApplications = Map.empty<Nat, WorkOrderApplication>();
  let jobAlertSubscriptions = Map.empty<Principal, JobAlertSubscription>();
  let checklists = Map.empty<Text, Checklist>();

  var nextElectricianId = 1;
  var nextWorkOrderId = 1;

  public type JobAlertSubscription = {
    principal : Principal;
    subscribedAt : Time.Time;
  };

  public shared ({ caller }) func subscribeToJobAlerts() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can subscribe to job alerts. Please authenticate first.");
    };
    if (jobAlertSubscriptions.containsKey(caller)) {
      Runtime.trap("Caller is already subscribed to job alerts!");
    };
    let subscription : JobAlertSubscription = {
      principal = caller;
      subscribedAt = Time.now();
    };
    jobAlertSubscriptions.add(caller, subscription);
  };

  public query ({ caller }) func isSubscribedToJobAlerts() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can check subscription status");
    };
    jobAlertSubscriptions.containsKey(caller);
  };

  public query ({ caller }) func getAllJobAlertSubscriptions() : async [PublicJobAlertSubscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all job alert subscriptions.");
    };
    let allSubscriptions = jobAlertSubscriptions.toArray();
    let publicSubscriptions = allSubscriptions.map(
      func((_, s)) {
        {
          subscribedAt = s.subscribedAt;
        };
      }
    );
    publicSubscriptions;
  };

  public shared ({ caller }) func addElectrician(
    name : Text,
    specialist : Speciality,
    workAvailability : WorkAvailability,
    qualification : ElectricianQualification,
    email : Text,
    address : Text,
    hourlyRate : Nat,
    currency : Text,
    paymentMethod : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add electricians");
    };

    let id = nextElectricianId;
    let electrician : Electrician = {
      id;
      name;
      specialist;
      isAvailable = true;
      workAvailability;
      qualification;
      email;
      address;
      hourlyRate;
      currency;
      paymentMethod;
      verificationStatus = #pending;
      assignedWorkOrders = List.empty<Nat>();
    };
    openElectricians.add(id, electrician);
    nextElectricianId += 1;
    id;
  };

  public shared ({ caller }) func updateElectrician(
    id : Nat,
    name : ?Text,
    specialist : ?Speciality,
    isAvailable : ?Bool,
    workAvailability : ?WorkAvailability,
    qualification : ?ElectricianQualification,
    email : ?Text,
    address : ?Text,
    hourlyRate : ?Nat,
    currency : ?Text,
    paymentMethod : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update electricians");
    };
    switch (openElectricians.get(id)) {
      case (null) { Runtime.trap("Electrician not found") };
      case (?electrician) {
        let updated : Electrician = {
          id = electrician.id;
          name = switch (name) {
            case (null) { electrician.name };
            case (?newName) { newName };
          };
          specialist = switch (specialist) {
            case (null) { electrician.specialist };
            case (?newSpecialist) { newSpecialist };
          };
          isAvailable = switch (isAvailable) {
            case (null) { electrician.isAvailable };
            case (?availability) { availability };
          };
          workAvailability = switch (workAvailability) {
            case (null) { electrician.workAvailability };
            case (?newAvailability) { newAvailability };
          };
          qualification = switch (qualification) {
            case (null) { electrician.qualification };
            case (?newQualification) { newQualification };
          };
          email = switch (email) {
            case (null) { electrician.email };
            case (?newEmail) { newEmail };
          };
          address = switch (address) {
            case (null) { electrician.address };
            case (?newAddress) { newAddress };
          };
          hourlyRate = switch (hourlyRate) {
            case (null) { electrician.hourlyRate };
            case (?newRate) { newRate };
          };
          currency = switch (currency) {
            case (null) { electrician.currency };
            case (?newCurrency) { newCurrency };
          };
          paymentMethod = switch (paymentMethod) {
            case (null) { electrician.paymentMethod };
            case (?newMethod) { newMethod };
          };
          verificationStatus = electrician.verificationStatus;
          assignedWorkOrders = electrician.assignedWorkOrders;
        };
        openElectricians.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func removeElectrician(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove electricians");
    };
    if (not openElectricians.containsKey(id)) {
      Runtime.trap("Electrician not found and cannot be removed");
    };
    openElectricians.remove(id);
  };

  public shared ({ caller }) func getAllElectricians() : async [ElectricianView] {
    openElectricians.values().toArray().map<Electrician, ElectricianView>(Electrician.toView);
  };

  public shared ({ caller }) func findElectricianById(id : Nat) : async ElectricianView {
    switch (openElectricians.get(id)) {
      case (null) { Runtime.trap("Electrician not found") };
      case (?electrician) { Electrician.toView(electrician) };
    };
  };

  public shared ({ caller }) func getPendingElectricians() : async [ElectricianView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending electrician verifications");
    };
    let allElectricians = openElectricians.values().toArray();
    let filtered = allElectricians.filter(
      func(electrician) {
        electrician.verificationStatus == #pending;
      }
    );
    filtered.map<Electrician, ElectricianView>(Electrician.toView);
  };

  public shared ({ caller }) func assignElectricianToWorkOrder(workOrderId : Nat, issuedElectrician : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign electricians to work orders");
    };
    if (not openElectricians.containsKey(issuedElectrician)) {
      Runtime.trap("Electrician not found");
    };

    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = ?issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          customerContactNumber = workOrder.customerContactNumber;
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
          applicationStatus = workOrder.applicationStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);

        // Update Electrician's assignedWorkOrders
        switch (openElectricians.get(issuedElectrician)) {
          case (null) { Runtime.trap("Electrician not found") };
          case (?electrician) {
            let newAssignedOrders = List.empty<Nat>();
            newAssignedOrders.add(workOrderId);
            let updatedElectrician : Electrician = {
              id = electrician.id;
              name = electrician.name;
              specialist = electrician.specialist;
              isAvailable = electrician.isAvailable;
              workAvailability = electrician.workAvailability;
              qualification = electrician.qualification;
              email = electrician.email;
              address = electrician.address;
              hourlyRate = electrician.hourlyRate;
              currency = electrician.currency;
              paymentMethod = electrician.paymentMethod;
              verificationStatus = electrician.verificationStatus;
              assignedWorkOrders = newAssignedOrders;
            };
            openElectricians.add(issuedElectrician, updatedElectrician);
          };
        };
      };
    };
  };
};
