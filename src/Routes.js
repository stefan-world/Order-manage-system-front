/* eslint-disable react/no-array-index-key */
import React, {
  lazy,
  Suspense,
  Fragment
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import HomeView from 'src/views/pages/HomeView';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import adminGuard from 'src/components/adminGuard';

const routesConfig = [
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/home" />
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/pages/Error404View'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    path: '/app',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: '/app',
        component: () => <Redirect to="/app/reports/dashboard" />
      },
      {
        exact: true,
        path: '/app/reports/dashboard',
        component: lazy(() => import('src/views/reports'))
      },
      {
        exact: true,
        path: '/app/suppliers/supplierReport',
        component: lazy(() => import('src/views/suppliers/SupplierReport'))
      },
      {
        exact: true,
        path: '/app/suppliers/supplierRecord',
        component: lazy(() => import('src/views/suppliers/SupplierRecord'))
      },
      {
        exact: true,
        path: '/app/suppliers/supplierEdit/:Id',
        component: lazy(() => import('src/views/suppliers/SupplierEdit'))
      },
      {
        exact: true,
        path: '/app/stores/productList',
        component: lazy(() => import('src/views/stores/productList'))
      },
      {
        exact: true,
        path: '/app/stores/productCreate',
        component: lazy(() => import('src/views/stores/productCreate'))
      },
      {
        exact: true,
        path: '/app/stores/productEdit/:Id',
        component: lazy(() => import('src/views/stores/ProductEdit'))
      },
      {
        exact: true,
        path: '/app/expenses',
        component: lazy(() => import('src/views/expenses'))
      },
      {
        exact: true,
        guard: adminGuard,
        path: '/app/partners/list',
        component: lazy(() => import('src/views/partners/list partners'))
      },
      {
        exact: true,
        guard: adminGuard,
        path: '/app/partners/add',
        component: lazy(() => import('src/views/partners/add partners'))
      },
      {
        exact: true,
        guard: adminGuard,
        path: '/app/partners/edit/:partnerId',
        component: lazy(() => import('src/views/partners/edit partners'))
      },
      {
        component:() => <Redirect to='/404' />
      }
    ]
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/home',
        component: HomeView
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

const renderRoutes = (routes) => (routes ? (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
