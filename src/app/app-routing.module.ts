import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './core/about/about.component';

const routes: Routes = [
  {path:'',redirectTo:'/chat',pathMatch:'full'},
  {path:'about',component:AboutComponent},
 // {path:'chat',loadChildren:()=>import('./chat/chat.module').then(m=>m.ChatModule))}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
