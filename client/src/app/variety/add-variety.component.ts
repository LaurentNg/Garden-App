import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Variety } from '../../../../common/tables/Variety';
import { Seedman } from '../../../../common/tables/Seedman';
import { SoilType } from '../../../../common/tables/SoilType';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-add-variety',
  templateUrl: './add-variety.component.html',
  styleUrls: ['./add-variety.component.css']
})
export class AddVarietyComponent implements OnInit {
  @ViewChild('insertMessage', { static: false }) insertMessage: ElementRef;


  variety: Variety;
  seedMen: Seedman[];
  soilTypes:  SoilType[];
  constructor(private communicationService: CommunicationService) { }
  

  ngOnInit(): void {
    this.variety = {} as Variety;
    this.communicationService.getVarieties().subscribe((varieties: Variety[]) => {
      this.variety.varietyId = varieties[varieties.length - 1].varietyId + 1;
    });
    this.communicationService.getSeedmen().subscribe((seedMen: Seedman[]) => {
      this.seedMen = seedMen;
    });
    this.communicationService.getSoilTypes().subscribe((soilType: SoilType[]) => {
      this.soilTypes = soilType;
    });
  }

  insertVariety() {
    this.communicationService.insertVariety(this.variety).subscribe((res: number) => {
      this.variety = {} as Variety;
      this.updateInsertMessage("Ajout d'une nouvelle variété de plante avec succès", 'chartreuse');
      this.communicationService.getVarieties().subscribe((varieties: Variety[]) => {
        this.variety.varietyId = varieties[varieties.length - 1].varietyId + 1;
      });
    });
  }

  updateInsertMessage(message: string, color: string) {
    this.insertMessage.nativeElement.textContent = message;
    this.insertMessage.nativeElement.style.color = color;
}

  disableButton(): boolean {
    if (!this.variety.name || !this.variety.year.toString() || !this.variety.description || !this.variety.plantation 
        || !this.variety.maintenance || !this.variety.harvest || !this.variety.plantationPeriod.toString() 
        || !this.variety.harvestPeriod.toString() || !this.variety.version || !this.variety.soilType 
        || !this.variety.adaptation || !this.variety.seedmanName)
        return true;
    return false;
  }
}
