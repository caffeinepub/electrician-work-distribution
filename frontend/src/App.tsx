import { lazy, Suspense } from 'react';
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingFallback from './components/LoadingFallback';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Services = lazy(() => import('./pages/Services'));
const JobBoard = lazy(() => import('./pages/JobBoard'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Electricians = lazy(() => import('./pages/Electricians'));
const Payments = lazy(() => import('./pages/Payments'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
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

const jobsRoute = createRoute({
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

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedRoute,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Dashboard />
    </Suspense>
  ),
});

const workOrdersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/work-orders',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <WorkOrders />
    </Suspense>
  ),
});

const electriciansRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/electricians',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Electricians />
    </Suspense>
  ),
});

const paymentsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/payments',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Payments />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  jobsRoute,
  myBookingsRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    workOrdersRoute,
    electriciansRoute,
    paymentsRoute,
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
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
