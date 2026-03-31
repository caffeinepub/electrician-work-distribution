import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

const portalLinks = [
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Job Board", href: "/jobs", icon: Briefcase },
  { label: "My Bookings", href: "/my-bookings", icon: BookOpen },
  { label: "Electricians", href: "/electricians", icon: Users },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Work Orders", href: "/admin/work-orders", icon: ClipboardList },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  {
    label: "Active Employees",
    href: "/admin/active-employees",
    icon: UserCheck,
  },
];

function isActive(href: string): boolean {
  return (
    window.location.pathname === href ||
    window.location.pathname.startsWith(`${href}/`)
  );
}

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Branding */}
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Technical Tech
            </span>
          </div>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Admin Portal Links - Always visible at top */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span className="text-amber-500">Admin Portal</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="transition-all duration-200"
                    >
                      <a href={link.href}>
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Portal Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="transition-all duration-200"
                    >
                      <a href={link.href}>
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Technical Tech.{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
