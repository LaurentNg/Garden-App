import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Variety } from '../../../../common/tables/Variety';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-modify-variety',
  templateUrl: './modify-variety.component.html',
  styleUrls: ['./modify-variety.component.css']
})
export class ModifyVarietyComponent implements OnInit {
  @ViewChild('varietyPaginator') varietyPaginator: MatPaginator;
  varieties: Variety[];
  constructor(private communicationService: CommunicationService) { }

  ngOnInit(): void {
    this.getVarieties();
  }
  
  public change(event: any, index: number, attribute: never) {
    this.varieties[index][attribute] = event.target.textContent as never;
    event.target.textContent = this.varieties[index][attribute];
  }

  public getVarieties() {
    this.communicationService.getVarieties().subscribe((varieties: Variety[]) => {
      this.varieties = varieties;
    });
  }

  public deleteVariety(varietyId: number) {
    this.communicationService.deleteVariety(varietyId).subscribe((res: any) => {
      this.getVarieties();
    });
  }
  
  public updateVariety(i: number) {
    this.communicationService
      .updateVariety(this.varieties[i])
      .subscribe((res: any) => {
        this.getVarieties();
      });
  }

  public isNumberKeyPress(event: any) {
    const res = /[0-9]/.test(event.key);
    if (!res || event.target.textContent.length === 4 ) event.preventDefault();
  }

  public isLetterKeyPress(event: any, maxChar: number) {
    const lowerCase = /[a-z]/.test(event.key);
    const upperCase = /[A-Z]/.test(event.key);
    if ((!lowerCase && !upperCase) || event.target.textContent.length === maxChar) event.preventDefault();
  }

  public commentMaxLength(event: any) {
    const commentMaxLength = 250;
    if (event.target.textContent.length === commentMaxLength) event.preventDefault();
  }

}
