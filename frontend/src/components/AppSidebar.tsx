import { Link, useLocation } from '@tanstack/react-router';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Wrench,
  Briefcase,
  LayoutDashboard,
  Users,
  ClipboardList,
  CreditCard,
  Zap,
} from 'lucide-react';

const portalNavItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Request a Service', url: '/services', icon: Wrench },
  { title: 'Worker Job Apply', url: '/jobs', icon: Briefcase },
];

const adminNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Work Orders', url: '/work-orders', icon: ClipboardList },
  { title: 'Electricians', url: '/electricians', icon: Users },
  { title: 'Payments', url: '/payments', icon: CreditCard },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground text-sm tracking-wide uppercase">
            Technical Tech
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
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
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
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

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          Technical Tech © {new Date().getFullYear()}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
