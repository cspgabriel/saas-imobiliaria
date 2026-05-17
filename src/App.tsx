/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Switch, Route } from "wouter";
import { Home } from "./app/(public)/page";
import { PropertyDetail } from "./app/(public)/[id]/page";
import { AdminLayout } from "./app/admin/layout";
import { AdminDashboard } from "./app/admin/dashboard/page";
import { AdminProperties } from "./app/admin/properties/page";
import { CRM } from "./app/admin/crm/page";
import { AdminReports } from "./app/admin/reports/page";
import { AdminMarketing } from "./app/admin/marketing/page";
import { Landing } from "./app/landing/page";
import { Onboarding } from "./app/onboarding/page";
import { RootRoute } from "./app/RootRoute";

export default function App() {
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/site/:slug" component={Home} />
      <Route path="/site/:slug/imovel/:id">
        {(params) => <PropertyDetail id={params.id} slug={params.slug} />}
      </Route>
      <Route path="/imovel/:id">
        {(params) => <PropertyDetail id={params.id} />}
      </Route>

      <Route path="/admin/properties">
        <AdminLayout>
          <AdminProperties />
        </AdminLayout>
      </Route>
      <Route path="/admin/crm">
        <AdminLayout>
          <CRM />
        </AdminLayout>
      </Route>
      <Route path="/admin/reports">
        <AdminLayout>
          <AdminReports />
        </AdminLayout>
      </Route>
      <Route path="/admin/marketing">
        <AdminLayout>
          <AdminMarketing />
        </AdminLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>

      <Route path="/" component={RootRoute} />
    </Switch>
  );
}
