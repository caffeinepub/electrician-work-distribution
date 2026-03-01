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
import Migration "migration";

(with migration = Migration.run)
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

  public type Electrician = {
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
  };

  module Electrician {
    public func compare(a : Electrician, b : Electrician) : Order.Order {
      Nat.compare(a.id, b.id);
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

  public query func getAllElectricians() : async [Electrician] {
    openElectricians.values().toArray().sort();
  };

  public query func findElectricianById(id : Nat) : async Electrician {
    switch (openElectricians.get(id)) {
      case (null) { Runtime.trap("Electrician not found") };
      case (?electrician) { electrician };
    };
  };

  public shared ({ caller }) func createWorkOrder(
    title : Text,
    description : Text,
    location : Text,
    priority : Nat,
    issuedElectrician : ?Nat,
    customerEmail : Text,
    customerAddress : Text,
    customerContactNumber : Text,
    paymentAmount : Nat,
    paymentMethod : Text,
    preferredEducation : ElectricianQualification,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create work orders");
    };
    let id = nextWorkOrderId;
    let workOrder : WorkOrder = {
      id;
      title;
      description;
      location;
      priority;
      status = #open;
      issuedElectrician;
      createdAt = Time.now();
      customerEmail;
      customerAddress;
      customerContactNumber;
      paymentAmount;
      paymentStatus = #pending;
      paymentMethod;
      workerRating = null;
      customerRating = null;
      preferredEducation;
      applicationStatus = #pending;
      verificationStatus = #pending;
    };
    openWorkOrders.add(id, workOrder);
    nextWorkOrderId += 1;
    id;
  };

  public shared ({ caller }) func createFixedPriceWorkOrder(
    title : Text,
    description : Text,
    location : Text,
    priority : Nat,
    customerEmail : Text,
    customerAddress : Text,
    customerContactNumber : Text,
    paymentMethod : Text,
    preferredEducation : ElectricianQualification,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create work orders");
    };

    let id = nextWorkOrderId;
    let workOrder : WorkOrder = {
      id;
      title;
      description;
      location;
      priority;
      status = #open;
      issuedElectrician = null;
      createdAt = Time.now();
      customerEmail;
      customerAddress;
      customerContactNumber;
      paymentAmount = 50;
      paymentStatus = #pending;
      paymentMethod;
      workerRating = null;
      customerRating = null;
      preferredEducation;
      applicationStatus = #pending;
      verificationStatus = #pending;
    };
    openWorkOrders.add(id, workOrder);
    nextWorkOrderId += 1;
    id;
  };

  public shared ({ caller }) func updateWorkOrderStatus(id : Nat, status : WorkOrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update work order status");
    };
    switch (openWorkOrders.get(id)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status;
          issuedElectrician = workOrder.issuedElectrician;
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
        openWorkOrders.add(id, updated);
      };
    };
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
      };
    };
  };

  public shared ({ caller }) func updateWorkOrderPayment(id : Nat, paymentAmount : Nat, paymentMethod : Text, paymentStatus : PaymentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };
    switch (openWorkOrders.get(id)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          customerContactNumber = workOrder.customerContactNumber;
          paymentAmount;
          paymentStatus;
          paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
          applicationStatus = workOrder.applicationStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func submitWorkerRating(workOrderId : Nat, rating : Nat, comment : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit ratings");
    };
    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let newRating : Rating = { rating; comment };
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          customerContactNumber = workOrder.customerContactNumber;
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = ?newRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
          applicationStatus = workOrder.applicationStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public shared ({ caller }) func submitCustomerRating(workOrderId : Nat, rating : Nat, comment : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit ratings");
    };
    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let newRating : Rating = { rating; comment };
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          customerContactNumber = workOrder.customerContactNumber;
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = ?newRating;
          preferredEducation = workOrder.preferredEducation;
          applicationStatus = workOrder.applicationStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public shared ({ caller }) func updateApplicationStatusForWorkOrder(workOrderId : Nat, newStatus : ApplicationProcessStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can directly update application status");
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
          issuedElectrician = workOrder.issuedElectrician;
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
          applicationStatus = newStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public query ({ caller }) func getAllWorkOrders() : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view work orders");
    };
    openWorkOrders.values().toArray().sort();
  };

  public query ({ caller }) func findWorkOrderById(id : Nat) : async WorkOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view work order details");
    };
    switch (openWorkOrders.get(id)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) { workOrder };
    };
  };

  public query ({ caller }) func getWorkOrdersByElectrician(electricianId : Nat) : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view work orders by electrician");
    };
    let all = openWorkOrders.values().toArray();
    let filtered = all.filter(
      func(wo : WorkOrder) : Bool {
        switch (wo.issuedElectrician) {
          case (?id) { id == electricianId and wo.status == #completed };
          case (null) { false };
        };
      },
    );
    filtered.sort();
  };

  public query func getAvailableServices() : async [RepairServiceType] {
    [#electronicRepair, #acTechnician, #fridgeRepairWork, #electrician];
  };

  public query ({ caller }) func getCurrentUserWorkOrders() : async [WorkOrder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view their own work orders");
    };

    let allOrders = openWorkOrders.values().toArray();
    let filtered = allOrders.filter(
      func(order : WorkOrder) : Bool {
        switch (userProfiles.get(caller)) {
          case (?profile) {
            order.customerEmail == profile.email or order.customerAddress == profile.name;
          };
          case (null) { false };
        };
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getWorkOrdersByApplicationStatus(status : ApplicationProcessStatus) : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view work orders by application status");
    };
    let all = openWorkOrders.values().toArray();
    let filtered = all.filter(
      func(wo : WorkOrder) : Bool {
        wo.applicationStatus == status;
      }
    );
    filtered.sort();
  };

  public shared ({ caller }) func applyForWorkOrder(workOrderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only workers can apply for work orders");
    };

    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        if (workOrder.status != #open) {
          Runtime.trap("Work order is not open for applications");
        };
        if (workOrder.applicationStatus != #pending) {
          Runtime.trap("Work order has already received an application or has been assigned.");
        };
        let application : WorkOrderApplication = {
          workOrderId;
          applicant = caller;
          appliedAt = Time.now();
        };
        workOrderApplications.add(workOrderId, application);
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
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
          applicationStatus = #pending;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public query ({ caller }) func getVerifiedApplications() : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view the assignment queue");
    };
    let allOrders = openWorkOrders.values().toArray();
    let filtered = allOrders.filter(
      func(order) {
        order.applicationStatus == #verifiedPendingAssignment;
      }
    );
    filtered.sort();
  };

  public shared ({ caller }) func verifyApplication(workOrderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify applications");
    };

    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        if (workOrder.applicationStatus != #pending) {
          Runtime.trap("Application is not pending verification");
        };

        switch (workOrderApplications.get(workOrderId)) {
          case (null) { Runtime.trap("No application found for this work order") };
          case (?_application) {
            let updatedOrder : WorkOrder = {
              id = workOrder.id;
              title = workOrder.title;
              description = workOrder.description;
              location = workOrder.location;
              priority = workOrder.priority;
              status = workOrder.status;
              issuedElectrician = workOrder.issuedElectrician;
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
              applicationStatus = #verifiedPendingAssignment;
              verificationStatus = workOrder.verificationStatus;
            };
            openWorkOrders.add(workOrderId, updatedOrder);
          };
        };
      };
    };
  };

  public shared ({ caller }) func acceptWorkOrder(workOrderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can confirm work order assignment");
    };
    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        if (workOrder.applicationStatus != #verifiedPendingAssignment) {
          Runtime.trap("Cannot accept work order that is not verified and pending assignment");
        };
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = #inProgress;
          issuedElectrician = workOrder.issuedElectrician;
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
          applicationStatus = #accepted;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
        let workOrderIdText = workOrderId.toText();
        if (not checklists.containsKey(workOrderIdText)) {
          let defaultItems = List.fromArray<ChecklistItem>(
            [
              { id = "step-1"; taskLabel = "Inspect site"; completed = false; order = 1 },
              { id = "step-2"; taskLabel = "Gather materials"; completed = false; order = 2 },
              { id = "step-3"; taskLabel = "Perform repair"; completed = false; order = 3 },
              { id = "step-4"; taskLabel = "Test equipment"; completed = false; order = 4 },
              { id = "step-5"; taskLabel = "Collect payment"; completed = false; order = 5 },
              { id = "step-6"; taskLabel = "Mark complete"; completed = false; order = 6 },
            ]
          );
          let checklist : Checklist = {
            workOrderId = workOrderIdText;
            items = defaultItems;
          };
          checklists.add(workOrderIdText, checklist);
        };
      };
    };
  };

  public shared ({ caller }) func declineWorkOrder(workOrderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can decline work order applications");
    };
    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        if (workOrder.applicationStatus != #pending and workOrder.applicationStatus != #verifiedPendingAssignment) {
          Runtime.trap("Cannot decline work order that is not pending or verified-pending-assignment");
        };
        workOrderApplications.remove(workOrderId);
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
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
      };
    };
  };

  public query ({ caller }) func getWorkOrderApplication(workOrderId : Nat) : async ?WorkOrderApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view work order applications");
    };
    workOrderApplications.get(workOrderId);
  };

  public shared ({ caller }) func verifyAndMoveToQueue(workOrderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify applications");
    };

    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        if (workOrder.applicationStatus != #pending) {
          Runtime.trap("Application is not pending verification");
        };

        switch (workOrderApplications.get(workOrderId)) {
          case (null) { Runtime.trap("No application found for this work order") };
          case (?_application) {
            let updatedOrder : WorkOrder = {
              id = workOrder.id;
              title = workOrder.title;
              description = workOrder.description;
              location = workOrder.location;
              priority = workOrder.priority;
              status = workOrder.status;
              issuedElectrician = workOrder.issuedElectrician;
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
              applicationStatus = #verifiedPendingAssignment;
              verificationStatus = workOrder.verificationStatus;
            };
            openWorkOrders.add(workOrderId, updatedOrder);
          };
        };
      };
    };
  };

  public query ({ caller }) func getWorkerChecklist(workOrderId : Text) : async [ChecklistItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view checklists");
    };
    switch (checklists.get(workOrderId)) {
      case (null) {
        [
          { id = "step-1"; taskLabel = "Inspect site"; completed = false; order = 1 },
          { id = "step-2"; taskLabel = "Gather materials"; completed = false; order = 2 },
          { id = "step-3"; taskLabel = "Perform repair"; completed = false; order = 3 },
          { id = "step-4"; taskLabel = "Test equipment"; completed = false; order = 4 },
          { id = "step-5"; taskLabel = "Collect payment"; completed = false; order = 5 },
          { id = "step-6"; taskLabel = "Mark complete"; completed = false; order = 6 },
        ];
      };
      case (?checklist) { checklist.items.toArray() };
    };
  };

  public shared ({ caller }) func updateChecklistItem(workOrderId : Text, itemId : Text, completed : Bool) : async Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update checklist items");
    };
    switch (checklists.get(workOrderId)) {
      case (null) {
        let defaultItems = List.fromArray<ChecklistItem>(
          [
            { id = "step-1"; taskLabel = "Inspect site"; completed = false; order = 1 },
            { id = "step-2"; taskLabel = "Gather materials"; completed = false; order = 2 },
            { id = "step-3"; taskLabel = "Perform repair"; completed = false; order = 3 },
            { id = "step-4"; taskLabel = "Test equipment"; completed = false; order = 4 },
            { id = "step-5"; taskLabel = "Collect payment"; completed = false; order = 5 },
            { id = "step-6"; taskLabel = "Mark complete"; completed = false; order = 6 },
          ]
        );
        let updatedItems = defaultItems.map<ChecklistItem, ChecklistItem>(
          func(item) {
            if (item.id == itemId) {
              { item with completed };
            } else {
              item;
            };
          }
        );
        let checklist : Checklist = {
          workOrderId;
          items = updatedItems;
        };
        checklists.add(workOrderId, checklist);
        #ok(());
      };
      case (?existingChecklist) {
        let updatedItems = existingChecklist.items.map<ChecklistItem, ChecklistItem>(
          func(item) {
            if (item.id == itemId) {
              { item with completed };
            } else {
              item;
            };
          }
        );
        let updatedChecklist : Checklist = {
          workOrderId;
          items = updatedItems;
        };
        checklists.add(workOrderId, updatedChecklist);
        #ok(());
      };
    };
  };

  public query ({ caller }) func getWorkOrderConfirmation(workOrderId : Nat) : async {
    workOrderId : Nat;
    status : WorkOrderStatus;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view work order confirmation");
    };
    switch (openWorkOrders.get(workOrderId)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        {
          workOrderId;
          status = workOrder.status;
        };
      };
    };
  };

  // Verification admin functions

  public shared ({ caller }) func approveWorkOrder(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve work orders");
    };
    switch (openWorkOrders.get(id)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
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
          verificationStatus = #approved;
        };
        openWorkOrders.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func rejectWorkOrder(id : Nat, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject work orders");
    };
    switch (openWorkOrders.get(id)) {
      case (null) { Runtime.trap("Work order not found") };
      case (?workOrder) {
        let updated : WorkOrder = {
          id = workOrder.id;
          title = workOrder.title;
          description = workOrder.description;
          location = workOrder.location;
          priority = workOrder.priority;
          status = workOrder.status;
          issuedElectrician = workOrder.issuedElectrician;
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
          verificationStatus = #rejected(reason);
        };
        openWorkOrders.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func approveElectrician(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve electrician profiles");
    };
    switch (openElectricians.get(id)) {
      case (null) { Runtime.trap("Electrician not found") };
      case (?electrician) {
        let updated : Electrician = {
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
          verificationStatus = #approved;
        };
        openElectricians.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func rejectElectrician(id : Nat, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject electrician profiles");
    };
    switch (openElectricians.get(id)) {
      case (null) { Runtime.trap("Electrician not found") };
      case (?electrician) {
        let updated : Electrician = {
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
          verificationStatus = #rejected(reason);
        };
        openElectricians.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func approveJobApplication(workOrderId : Nat, applicantId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve job applications");
    };
    switch (workOrderApplications.get(workOrderId)) {
      case (null) { Runtime.trap("No application found for this work order") };
      case (?application) {
        if (application.applicant != applicantId) {
          Runtime.trap("Applicant does not match the application on record");
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
              issuedElectrician = workOrder.issuedElectrician;
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
              applicationStatus = #accepted;
              verificationStatus = workOrder.verificationStatus;
            };
            openWorkOrders.add(workOrderId, updated);
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectJobApplication(workOrderId : Nat, applicantId : Principal, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject job applications");
    };
    switch (workOrderApplications.get(workOrderId)) {
      case (null) { Runtime.trap("No application found for this work order") };
      case (?application) {
        if (application.applicant != applicantId) {
          Runtime.trap("Applicant does not match the application on record");
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
              issuedElectrician = workOrder.issuedElectrician;
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
              applicationStatus = #declined;
              verificationStatus = #rejected(reason);
            };
            openWorkOrders.add(workOrderId, updated);
            workOrderApplications.remove(workOrderId);
          };
        };
      };
    };
  };

  public shared ({ caller }) func approvePayment(workOrderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve payments");
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
          issuedElectrician = workOrder.issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          customerContactNumber = workOrder.customerContactNumber;
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = #confirmed;
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
          applicationStatus = workOrder.applicationStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public shared ({ caller }) func flagPayment(workOrderId : Nat, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can flag payments");
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
          issuedElectrician = workOrder.issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          customerContactNumber = workOrder.customerContactNumber;
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = #flagged(note);
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
          applicationStatus = workOrder.applicationStatus;
          verificationStatus = workOrder.verificationStatus;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public query ({ caller }) func getPendingWorkOrders() : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending work orders");
    };
    let allOrders = openWorkOrders.values().toArray();
    let filtered = allOrders.filter(
      func(order) {
        order.verificationStatus == #pending;
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getPendingElectricians() : async [Electrician] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending electrician verifications");
    };
    let allElectricians = openElectricians.values().toArray();
    let filtered = allElectricians.filter(
      func(electrician) {
        electrician.verificationStatus == #pending;
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getPendingJobApplications() : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending job applications");
    };
    let allOrders = openWorkOrders.values().toArray();
    let filtered = allOrders.filter(
      func(order) {
        order.applicationStatus == #pending and workOrderApplications.containsKey(order.id);
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getPendingPayments() : async [WorkOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending payments");
    };
    let allOrders = openWorkOrders.values().toArray();
    let filtered = allOrders.filter(
      func(order) {
        order.paymentStatus == #pending or order.paymentStatus == #paid;
      }
    );
    filtered.sort();
  };
};
