import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { GardenComponent } from "./garden/garden.component";
import { PlantComponent } from "./plant/plant.component";
import { AddVarietyComponent } from "./add-variety/add-variety.component";
import { ModifyVarietyComponent } from "./modify-variety/modify-variety.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "garden", component: GardenComponent },
  { path: "plant", component: PlantComponent },
  { path: "variety", component: AddVarietyComponent },
  { path: "modify-variety", component: ModifyVarietyComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }