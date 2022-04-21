import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GardenInfo } from '../../../../common/tables/GardenInfo';
import { CommunicationService } from '../communication.service';
import { Parcel } from '../../../../common/tables/Parcel';
import { CultivateRank } from '../../../../common/tables/CultivateRank';
import { FallowRank } from '../../../../common/tables/FallowRank';
import { Garden } from '../../../../common/tables/Garden';
import { Variety } from '../../../../common/tables/Variety';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.css']
})
export class GardenComponent implements OnInit {
  @ViewChild('parcelPaginator') parcelPaginator: MatPaginator;
  @ViewChild('cultivateRankPaginator') cultivateRankPaginator: MatPaginator;
  @ViewChild('fallowRankPaginator') fallowRankPaginator: MatPaginator;

  gardens: Garden[];
  selectedGardenId: number;
  garden: MatTableDataSource<Garden>;
  parcels: MatTableDataSource<Parcel>;
  cultivateRanks: MatTableDataSource<CultivateRank>;
  fallowRanks: MatTableDataSource<FallowRank>;
  varieties: Variety[];

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    this.communicationService.getGardens().subscribe((gardens: Garden[]) => {
      this.gardens = gardens;
    });
  }
  
  public setGardenInfo() {
    this.communicationService.getGardenInfos(this.selectedGardenId).subscribe((gardenInfo: GardenInfo) => {
      this.garden = new MatTableDataSource<Garden>(gardenInfo.gardenInfo);
      this.parcels = new MatTableDataSource<Parcel>(gardenInfo.parcelInfo);
      this.cultivateRanks = new MatTableDataSource<CultivateRank>(gardenInfo.cultivateRankInfo);
      this.fallowRanks = new MatTableDataSource<FallowRank>(gardenInfo.fallowRankInfo);
      this.varieties = gardenInfo.varietyInfo;
      this.parcels.paginator = this.parcelPaginator;
      this.cultivateRanks.paginator = this.cultivateRankPaginator;
      this.fallowRanks.paginator = this.fallowRankPaginator;
    });
  }
}
