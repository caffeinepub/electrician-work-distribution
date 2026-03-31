import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Clock,
  GraduationCap,
  IndianRupee,
  Loader2,
  Mail,
  Phone,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { useActiveEmployees } from "../hooks/useQueries";

export default function ActiveEmployees() {
  const { data: employees = [], isLoading } = useActiveEmployees();
  const [search, setSearch] = useState("");

  const filtered = employees.filter((e) =>
    e.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-primary" />
          Active Employees
        </h1>
        <p className="text-muted-foreground mt-1">
          All approved and staying employees.
        </p>
      </div>

      <div className="mb-6">
        <Input
          data-ocid="employees.search_input"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          data-ocid="employees.empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <UserCheck className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {search
              ? "No employees match your search."
              : "No active employees yet. Approve job applications to see them here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4" data-ocid="employees.list">
          {filtered.map((emp, idx) => (
            <Card
              key={emp.id}
              className="bg-white text-gray-900"
              data-ocid={`employees.item.${idx + 1}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <CardTitle className="text-base">{emp.fullName}</CardTitle>
                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Active Employee
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    {emp.mobileNo}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    {emp.gmailId}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {emp.academicQualification}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5" />
                    {emp.jobType} · {emp.workingTime} hrs/day
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <IndianRupee className="w-3.5 h-3.5" />₹{emp.salaryPerMonth}
                    /mo · ₹{emp.salaryPerWeek}/wk · ₹{emp.salaryPerDay}/day
                  </span>
                  {emp.workExperience && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Exp: {emp.workExperience}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approved:{" "}
                  {new Date(emp.submittedAt).toLocaleDateString("en-IN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
