import { Component, OnInit } from '@angular/core';
import { Plant } from '../../../../common/tables/Plant';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit {
  plantName: string;
  plants: Plant[];
  
  constructor(private communicationService: CommunicationService) { }

  ngOnInit(): void {
  }

  public searchPlant(plantName: string) {
    console.log('here');
    this.communicationService.getPlant(plantName).subscribe((plants: Plant[]) => {
      this.plants = plants;
    });
  }
}
