import { lazy, Suspense } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import LoadingFallback from './components/LoadingFallback';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Services = lazy(() => import('./pages/Services'));
const JobBoard = lazy(() => import('./pages/JobBoard'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Electricians = lazy(() => import('./pages/Electricians'));
const Payments = lazy(() => import('./pages/Payments'));
const Verifications = lazy(() => import('./pages/Verifications'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Public routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <LandingPage />
    </Suspense>
  ),
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Services />
    </Suspense>
  ),
});

const jobBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <JobBoard />
    </Suspense>
  ),
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-bookings',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <MyBookings />
    </Suspense>
  ),
});

// Admin protected parent route
const adminProtectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute adminOnly={true}>
      <Outlet />
    </ProtectedRoute>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: '/dashboard',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Dashboard />
    </Suspense>
  ),
});

const adminWorkOrdersRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: '/work-orders',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <WorkOrders />
    </Suspense>
  ),
});

const adminElectriciansRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: '/electricians',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Electricians />
    </Suspense>
  ),
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: '/payments',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Payments />
    </Suspense>
  ),
});

const adminVerificationsRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: '/verifications',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Verifications />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  servicesRoute,
  jobBoardRoute,
  myBookingsRoute,
  adminProtectedRoute.addChildren([
    adminDashboardRoute,
    adminWorkOrdersRoute,
    adminElectriciansRoute,
    adminPaymentsRoute,
    adminVerificationsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
