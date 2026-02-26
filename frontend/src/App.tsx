import { lazy, Suspense } from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingFallback } from './components/LoadingFallback';

// Lazy-loaded page components for code splitting / low data consumption
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Electricians = lazy(() => import('./pages/Electricians'));
const Services = lazy(() => import('./pages/Services'));
const JobBoard = lazy(() => import('./pages/JobBoard'));
const Payments = lazy(() => import('./pages/Payments'));
const MyBookings = lazy(() => import('./pages/MyBookings'));

// Suspense wrapper helper
function Lazy({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

// Root route with Layout
const rootRoute = createRootRoute({
  component: () => <Layout />,
});

// Protected route wrapper
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedRoute,
});

// Admin routes (protected)
const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: () => <Lazy component={Dashboard} />,
});

const workOrdersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/work-orders',
  component: () => <Lazy component={WorkOrders} />,
});

const electriciansRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/electricians',
  component: () => <Lazy component={Electricians} />,
});

const paymentsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/payments',
  component: () => <Lazy component={Payments} />,
});

// Public routes (no auth required)
const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: () => <Lazy component={Services} />,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: () => <Lazy component={JobBoard} />,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-bookings',
  component: () => <Lazy component={MyBookings} />,
});

// Landing page — portal entry point
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Lazy component={LandingPage} />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    workOrdersRoute,
    electriciansRoute,
    paymentsRoute,
  ]),
  servicesRoute,
  jobsRoute,
  myBookingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
