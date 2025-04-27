import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { PostEditorComponent } from './post-editor/post-editor.component';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';
import { AdTargetingComponent } from './ad-targeting/ad-targeting.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'app', 
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: 'calendar', component: CalendarViewComponent },
      { path: 'post/new', component: PostEditorComponent },
      { path: 'post/edit/:id', component: PostEditorComponent },
      // { path: 'story/new', component: StoryEditorComponent },
      // { path: 'story/edit/:id', component: StoryEditorComponent },
      { path: 'analytics', component: AnalyticsDashboardComponent },
      { path: 'ad-targeting', component: AdTargetingComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
