import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MenusComponent } from './menus/menus.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuardService } from './services/auth-guard.service';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  // { path: '', component: WelcomeComponent },
  { path: '', redirectTo: '/menus', pathMatch: 'full' },
  { path: 'menus', component: MenusComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
