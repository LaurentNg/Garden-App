import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Garden } from "../../../common/tables/Garden";
import { Plant } from "../../../common/tables/Plant";
import { GardenInfo } from "../../../common/tables/GardenInfo";
import { Variety } from "../../../common/tables/Variety";
import { Seedman } from "../../../common/tables/Seedman";
import { SoilType } from "../../../common/tables/SoilType";


@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  public getVarieties(): Observable<Variety[]> {
    return this.http
      .get<Variety[]>(this.BASE_URL + "/varieties")
      .pipe(catchError(this.handleError<Variety[]>("getVarieties")));
  }

  public insertVariety(variety: Variety): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/varieties/insert", variety)
      .pipe(catchError(this.handleError<number>("insertVariety")));
  }

  public deleteVariety(varietyId: number): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/varieties/delete/" + varietyId, {})
      .pipe(catchError(this.handleError<number>("deleteVariety")));
  }

  public updateVariety(variety: Variety): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/varieties/update", variety)
      .pipe(catchError(this.handleError<number>("updateVariety")));
  }

  public getGardens(): Observable<Garden[]> {
    return this.http
      .get<Garden[]>(this.BASE_URL + "/gardens")
      .pipe(catchError(this.handleError<Garden[]>("getGardens")));
  }

  public getGardenInfos(gardenId: number): Observable<GardenInfo> {
    return this.http
      .get<GardenInfo>(this.BASE_URL + `/garden/info?gardenId=${gardenId}`)
      .pipe(catchError(this.handleError<GardenInfo>("getGardenInfos")));
  }

  public getPlant(plantName: string): Observable<Plant[]> {
    return this.http
      .get<Plant[]>(this.BASE_URL + `/plant?plantName=${plantName}`)
      .pipe(catchError(this.handleError<Plant[]>("getPlant")));
  }

  public getSeedmen(): Observable<Seedman[]> {
    return this.http
      .get<Seedman[]>(this.BASE_URL + "/seedmen")
      .pipe(catchError(this.handleError<Seedman[]>("getSeedmen")));
  }

  public getSoilTypes(): Observable<SoilType[]> {
    return this.http
      .get<SoilType[]>(this.BASE_URL + "/soiltypes")
      .pipe(catchError(this.handleError<SoilType[]>("getSoilTypes")));
  }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
