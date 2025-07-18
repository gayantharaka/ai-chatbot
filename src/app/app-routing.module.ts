import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

const routes: Routes = [
  {path:'',redirectTo:'/chat',pathMatch:'full'},
  {path:'terms',component:TermsComponent},
  {path:'privacy',component:PrivacyComponent},
  {path:'about',component:AboutComponent},
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
  {path:'chat',loadChildren:()=>import('./chat/chat.module').then(m=>m.ChatModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
