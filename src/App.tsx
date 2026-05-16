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
import { SaasLanding } from "./app/saas/page";

export default function App() {
  return (
    <Switch>
      <Route path="/saas" component={SaasLanding} />
      <Route path="/" component={Home} />
      <Route path="/imovel/:id">
        {(params) => <PropertyDetail id={params.id} />}
      </Route>
      
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={AdminDashboard} />
            <Route path="/properties" component={AdminProperties} />
            <Route path="/crm" component={CRM} />
            <Route path="/reports" component={AdminReports} />
            <Route path="/marketing" component={AdminMarketing} />
          </Switch>
        </AdminLayout>
      </Route>
    </Switch>
  );
}
