import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home';
import {GuidesComponent} from './pages/guides/guides';
import {GuideDetailComponent} from './pages/guide-detail/guide-detail';
import {GuideDashboardComponent} from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'guides', component: GuidesComponent },
  { path: 'guides/:id', component: GuideDetailComponent },
  { path: 'dashboard', component: GuideDashboardComponent },
  { path: '**', redirectTo: '' }
];
