import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { CacheInterceptor } from './core/interceptors/cache-interceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TitleStrategyService } from './core/services/title-strategy.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule.forRoot({ type: 'square-jelly-box' }),
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    NgxSpinnerModule,
    Title,
    TitleStrategyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
