import { Component } from '@angular/core';
import { Plant } from '../../../../common/tables/Plant';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent {
  plantName: string;
  plants: Plant[];
  
  constructor(private communicationService: CommunicationService) { }

  public searchPlant(plantName: string) {
    this.communicationService.getPlant(plantName).subscribe((plants: Plant[]) => {
      this.plants = plants;
    });
  }
}
