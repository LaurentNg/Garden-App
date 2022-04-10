import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Plant } from '../../../../common/tables/Plant';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent {
  @ViewChild('plantPaginator') plantPaginator: MatPaginator;
  plantName: string;
  plants: MatTableDataSource<Plant>;
  
  constructor(private communicationService: CommunicationService) { }

  public searchPlant(plantName: string) {
    this.communicationService.getPlant(plantName).subscribe((plants: Plant[]) => {
      this.plants = new MatTableDataSource<Plant>(plants);
      this.plants.paginator = this.plantPaginator;
    });
  }
}
