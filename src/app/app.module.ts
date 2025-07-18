import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './core/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button';
import { AboutComponent } from './pages/about/about.component'
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule} from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    TermsComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
