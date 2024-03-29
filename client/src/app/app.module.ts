import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CommunicationService } from "./communication.service";
import { GardenComponent } from './garden/garden.component';
import { MaterialModule } from "./material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from "@angular/material/core";
import { PlantComponent } from './plant/plant.component';
import { AddVarietyComponent } from './add-variety/add-variety.component';
import { ModifyVarietyComponent } from './modify-variety/modify-variety.component';

@NgModule({
  declarations: [
    AppComponent,
    GardenComponent,
    PlantComponent,
    AddVarietyComponent,
    ModifyVarietyComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [CommunicationService],
  bootstrap: [AppComponent],
})
export class AppModule { }
