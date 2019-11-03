import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContenedorComponent } from './contenedor/contenedor.component';
import { ListadoComponent } from './listado/listado.component';
import { FiltroComponent } from './filtro/filtro.component';
import { ItemComponent } from './item/item.component';
import { AgregarComponent } from './agregar/agregar.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ContenedorComponent,
    ListadoComponent,
    FiltroComponent,
    ItemComponent,
    AgregarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
