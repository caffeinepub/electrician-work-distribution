import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Wrench,
  Briefcase,
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  Users,
  CreditCard,
} from 'lucide-react';

const portalLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Services', path: '/services', icon: Wrench },
  { label: 'Job Board', path: '/jobs', icon: Briefcase },
  { label: 'My Bookings', path: '/my-bookings', icon: BookOpen },
];

const adminLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Work Orders', path: '/work-orders', icon: ClipboardList },
  { label: 'Electricians', path: '/electricians', icon: Users },
  { label: 'Payments', path: '/payments', icon: CreditCard },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="sidebar-dark border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <img
            src="/assets/generated/electropro-logo.dim_300x80.png"
            alt="ElectroPro"
            className="h-10 w-auto object-contain"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalLinks.map((link) => (
                <SidebarMenuItem key={link.path}>
                  <SidebarMenuButton
                    onClick={() => navigate({ to: link.path })}
                    isActive={isActive(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer
                      ${isActive(link.path)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((link) => (
                <SidebarMenuItem key={link.path}>
                  <SidebarMenuButton
                    onClick={() => navigate({ to: link.path })}
                    isActive={isActive(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer
                      ${isActive(link.path)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/40 text-center">
          © {new Date().getFullYear()} Technical Tech
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
