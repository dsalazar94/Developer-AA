import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from 'app/guard/auth.guard';

import { LoginComponent } from 'app/pages/auth/login/login.component';
import { RegisterComponent } from 'app/pages/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ConfigurationComponent } from 'app/pages/configuration/configuration.component';
import { DataEntryComponent } from 'app/pages/data-entry/data-entry.component';
import { HomeComponent } from 'app/pages/home/home.component';

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full',},

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'layout', component: AdminLayoutComponent,
    children: [
      {path: '',loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'},
      {path: 'home', component: HomeComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'configuration', component: ConfigurationComponent},
      {path: 'data-entry', component: DataEntryComponent},

    ],
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'home' },
]
