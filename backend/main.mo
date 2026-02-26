import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
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

  public type UserProfile = {
    name : Text;
    email : Text;
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

  public type RepairServiceType = {
    #television;
    #ac;
    #fridge;
    #ceilingFan;
    #tableFan;
  };

  module RepairServiceType {
    public func toText(t : RepairServiceType) : Text {
      switch (t) {
        case (#television) { "Television Repair" };
        case (#ac) { "AC Repair" };
        case (#fridge) { "Fridge Repair" };
        case (#ceilingFan) { "Ceiling Fan Repair" };
        case (#tableFan) { "Table Fan Repair" };
      };
    };
  };

  type Electrician = {
    id : Nat;
    name : Text;
    specialist : Speciality;
    isAvailable : Bool;
    email : Text;
    address : Text;
    hourlyRate : Nat;
    currency : Text;
    paymentMethod : Text;
  };

  module Electrician {
    public func compare(a : Electrician, b : Electrician) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type WorkOrderStatus = {
    #open;
    #inProgress;
    #completed;
    #cancelled;
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
  };

  module PaymentStatus {
    public func toText(s : PaymentStatus) : Text {
      switch (s) {
        case (#pending) { "Pending" };
        case (#paid) { "Paid" };
      };
    };
  };

  type Rating = {
    rating : Nat;
    comment : Text;
  };

  type WorkOrder = {
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

  module WorkOrder {
    public func compare(a : WorkOrder, b : WorkOrder) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let openElectricians = Map.empty<Nat, Electrician>();
  let openWorkOrders = Map.empty<Nat, WorkOrder>();

  var nextElectricianId = 1;
  var nextWorkOrderId = 1;

  public shared ({ caller }) func addElectrician(
    name : Text,
    specialist : Speciality,
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
      email;
      address;
      hourlyRate;
      currency;
      paymentMethod;
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
    issuedElectrician : Nat,
    customerEmail : Text,
    customerAddress : Text,
    paymentAmount : Nat,
    paymentMethod : Text,
    preferredEducation : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create work orders");
    };
    if (not openElectricians.containsKey(issuedElectrician)) {
      Runtime.trap("Electrician not found");
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
      paymentAmount;
      paymentStatus = #pending;
      paymentMethod;
      workerRating = null;
      customerRating = null;
      preferredEducation;
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
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
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
          issuedElectrician;
          createdAt = workOrder.createdAt;
          customerEmail = workOrder.customerEmail;
          customerAddress = workOrder.customerAddress;
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
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
          paymentAmount;
          paymentStatus;
          paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
        };
        openWorkOrders.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func submitWorkerRating(workOrderId : Nat, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = ?newRating;
          customerRating = workOrder.customerRating;
          preferredEducation = workOrder.preferredEducation;
        };
        openWorkOrders.add(workOrderId, updated);
      };
    };
  };

  public shared ({ caller }) func submitCustomerRating(workOrderId : Nat, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
          paymentAmount = workOrder.paymentAmount;
          paymentStatus = workOrder.paymentStatus;
          paymentMethod = workOrder.paymentMethod;
          workerRating = workOrder.workerRating;
          customerRating = ?newRating;
          preferredEducation = workOrder.preferredEducation;
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
        wo.issuedElectrician == electricianId and wo.status == #completed;
      },
    );
    filtered.sort();
  };

  public query ({ caller }) func getAvailableServices() : async [RepairServiceType] {
    [#television, #ac, #fridge, #ceilingFan, #tableFan];
  };
};
