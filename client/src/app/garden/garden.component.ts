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



// export interface Parcel {
//   coordinates: string;
//   dimensions: string;
// }

// export interface Rank {
//   coordinates: string;
//   dimensions: string;
// }

// export interface Garden {
//   name: string;
//   surface: string;
// }

// const ELEMENT_DATA: Parcel[] = [
//   {coordinates: 'laval', dimensions: 'Hydrogen'},
//   {coordinates: 'laval', dimensions: 'Helium'},
//   {coordinates: 'laval', dimensions: 'Lithium'},
//   {coordinates: 'laval', dimensions: 'Beryllium'},
//   {coordinates: 'laval', dimensions: 'Boron'},
//   {coordinates: 'laval', dimensions: 'Carbon'},
//   {coordinates: 'laval', dimensions: 'Nitrogen'},
//   {coordinates: 'laval', dimensions: 'Oxygen'},
//   {coordinates: 'laval', dimensions: 'Fluorine'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
// ];

// const ELEMENT_DATA2: Rank[] = [
//   {coordinates: 'laval', dimensions: 'Hydrogen'},
//   {coordinates: 'laval', dimensions: 'Helium'},
//   {coordinates: 'laval', dimensions: 'Lithium'},
//   {coordinates: 'laval', dimensions: 'Beryllium'},
//   {coordinates: 'laval', dimensions: 'Boron'},
//   {coordinates: 'laval', dimensions: 'Carbon'},
//   {coordinates: 'laval', dimensions: 'Nitrogen'},
//   {coordinates: 'laval', dimensions: 'Oxygen'},
//   {coordinates: 'laval', dimensions: 'Fluorine'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
//   {coordinates: 'laval', dimensions: 'Neon'},
// ];

// const GARDEN: Garden[] = [{
//   name: 'botanique',
//   surface: '1000 x 10000'
// }]

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.css']
})
export class GardenComponent implements OnInit {
  @ViewChild('parcelPaginator') parcelPaginator: MatPaginator;
  @ViewChild('cultivateRankPaginator') cultivateRankPaginator: MatPaginator;
  @ViewChild('fallowRankPaginator') fallowRankPaginator: MatPaginator;

  gardenInfo: GardenInfo = {} as GardenInfo;
  selectedGardenId: number;
  // parcel = new MatTableDataSource<Parcel>(ELEMENT_DATA);
  // cultivateRank = new MatTableDataSource<Rank>(ELEMENT_DATA2);
  // fallowRank = new MatTableDataSource<Rank>(ELEMENT_DATA2);
  // garden = new MatTableDataSource<Garden>(GARDEN);

  garden: MatTableDataSource<Garden>;
  parcels: MatTableDataSource<Parcel>;
  cultivateRanks: MatTableDataSource<CultivateRank>;
  fallowRanks: MatTableDataSource<FallowRank>;
  varieties: Variety[];

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    this.communicationService.getGardens().subscribe((gardenInfo: GardenInfo) => {
      this.gardenInfo = gardenInfo;
    });
  }
  
  public setGardenInfo() {
    const selectedGarden = this.gardenInfo.basicInfo.filter((garden: Garden) => {
      return garden.jardinId == this.selectedGardenId;
    });

    const selectedParcels = this.gardenInfo.parcelInfo.filter((parcel: Parcel) => {
      return parcel.jardinId == this.selectedGardenId;
    });

    const parcelCoordinates = selectedParcels.map((parcel: Parcel) => {
      return parcel.coordinates;
    });

    const selectedCultivateRanks = this.gardenInfo.cultivateRankInfo.filter((cultivateRank: CultivateRank) => {
      return parcelCoordinates.includes(cultivateRank.coordinates);
    });

    const selectedFallowRanks = this.gardenInfo.fallowRankInfo.filter((fallowRank: FallowRank) => {
      return parcelCoordinates.includes(fallowRank.coordinates);
    });

    const selectedVarieties = this.gardenInfo.varietyInfo.filter((variety: Variety) => {
      return parcelCoordinates.includes(variety.parcelCoords);
    });

    this.garden = new MatTableDataSource<Garden>(selectedGarden);
    this.parcels = new MatTableDataSource<Parcel>(selectedParcels);
    this.cultivateRanks = new MatTableDataSource<CultivateRank>(selectedCultivateRanks);
    this.fallowRanks = new MatTableDataSource<FallowRank>(selectedFallowRanks);
    this.varieties = selectedVarieties;
    this.parcels.paginator = this.parcelPaginator;
    this.cultivateRanks.paginator = this.cultivateRankPaginator;
    this.fallowRanks.paginator = this.fallowRankPaginator;
  }

}
