import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CreditCard,
  Wrench,
  Briefcase,
  BookMarked,
} from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';

const portalItems = [
  { title: 'Request a Service', url: '/services', icon: Wrench },
  { title: 'My Bookings', url: '/my-bookings', icon: BookMarked },
  { title: 'Worker Job Apply', url: '/job-board', icon: Briefcase },
];

const adminItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Work Orders', url: '/work-orders', icon: ClipboardList },
  { title: 'Electricians', url: '/electricians', icon: Users },
  { title: 'Payments', url: '/payments', icon: CreditCard },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="sidebar-dark">
      <SidebarHeader className="p-4 sidebar-dark">
        <div className="flex items-center gap-2">
          <img src="/assets/generated/electropro-logo.dim_300x80.png" alt="ElectroPro" className="h-8 object-contain" />
        </div>
      </SidebarHeader>
      <SidebarContent className="sidebar-dark">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase text-xs tracking-wider font-semibold">
            Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground hover:bg-white/10 hover:text-white data-[active=true]:bg-primary data-[active=true]:text-white"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase text-xs tracking-wider font-semibold">
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground hover:bg-white/10 hover:text-white data-[active=true]:bg-primary data-[active=true]:text-white"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
