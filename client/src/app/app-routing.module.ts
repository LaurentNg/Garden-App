import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HotelComponent } from "./hotel/hotel.component";
import { RoomComponent } from "./room/room.component";
import { GuestComponent } from "./guest/guest.component";
import { GardenComponent } from "./garden/garden.component";
import { PlantComponent } from "./plant/plant.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "rooms", component: RoomComponent },
  { path: "hotels", component: HotelComponent },
  { path: "guests", component: GuestComponent },
  { path: "garden", component: GardenComponent },
  { path: "plant", component: PlantComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }