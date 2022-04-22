import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { GardenInfo } from "../../../common/tables/GardenInfo";
import { Plant } from "../../../common/tables/Plant";
import { Variety } from "../../../common/tables/Variety";
import { Seedman } from "../../../common/tables/Seedman";
import { SoilType } from "../../../common/tables/SoilType";

@injectable()
export class DatabaseService {

  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "garden",
    password: "admin",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  // ======= GET GARDEN =======
  public async getGardenInfos(gardenId: number): Promise<GardenInfo> {
    const gardenInfo = (await this.getGardenInfo(gardenId)).rows.map((garden) => ({
      jardinId: garden.idjardin,
      name: garden.nom,
      surface: garden.surface,
    }));

    const parcelInfo = (await this.getGardenParcelInfos(gardenId)).rows.map((parcel) => ({
      jardinId: parcel.idjardin,
      coordinates: parcel.coordparcelle,
      dimensions: parcel.dimensions,
    }));

    const cultivateRankInfo = (await this.getGardenCultivateRankInfos(gardenId)).rows.map((cultivateRank) => ({
      coordinates: cultivateRank.coordparcelle, 
      number: cultivateRank.numrang,
      type: cultivateRank.typemiseplace,
      period: cultivateRank.periodeculture,
    }));
    
    const fallowRankInfo = (await this.getGardenFallowRankInfos(gardenId)).rows.map((fallowRank) => ({
      coordinates: fallowRank.coordparcelle,
      number: fallowRank.numrang,
      period: fallowRank.periodejachere,
    }));

    const varietyInfo = (await this.getGardenVarietyInfos(gardenId)).rows.map((variety) => ({
      varietyId: variety.idvariete,
	    name: variety.nom,
	    year: variety.anneemiseenmarche,
	    description: variety.descsemis,
	    plantation: variety.plantation,
	    maintenance: variety.entretien,
	    harvest: variety.recolte,
	    plantationPeriod: variety.periodemiseplace,
	    harvestPeriod: variety.perioderecolte,
	    comments: variety.comgen,
	    version: variety.nomversion,
      soilType: variety.nomtypesol,
      adaptation: variety.niveau,
      seedmanName: variety.nomsemencier,
    }));
    return { gardenInfo: gardenInfo, parcelInfo: parcelInfo, cultivateRankInfo: cultivateRankInfo, fallowRankInfo: fallowRankInfo, varietyInfo: varietyInfo };
  }

  public async getGardens(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const query = "SELECT * FROM JARDINCOMMUNDB.Jardin j;";
    const res = await client.query(query);
    client.release()
    return res;
  }

  public async getGardenInfo(gardenId: number): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const query = `SELECT * FROM JARDINCOMMUNDB.Jardin WHERE idJardin = '${gardenId}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }

  public async getGardenParcelInfos(gardenId: number): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const query = `SELECT * FROM JARDINCOMMUNDB.Parcelle p WHERE p.idJardin = '${gardenId}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }

  public async getGardenCultivateRankInfos(gardenId: number): Promise<pg.QueryResult> {
    let queryText = "SELECT * FROM JARDINCOMMUNDB.Cultivation c WHERE EXISTS ";
    queryText += `(SELECT * FROM JARDINCOMMUNDB.Parcelle p WHERE p.idJardin = '${gardenId}' AND c.coordParcelle = p.coordParcelle);`;
    const client = await this.pool.connect();
    const res = await client.query(queryText);
    client.release()
    return res;
  }

  public async getGardenFallowRankInfos(gardenId: number): Promise<pg.QueryResult> {
    let queryText = "SELECT * FROM JARDINCOMMUNDB.Jachere j WHERE EXISTS ";
    queryText += `(SELECT * FROM JARDINCOMMUNDB.Parcelle p WHERE p.idJardin = '${gardenId}' AND j.coordParcelle = p.coordParcelle);`;
    const client = await this.pool.connect();
    const res = await client.query(queryText);
    client.release()
    return res;
  }
  public async getGardenVarietyInfos(gardenId: number): Promise<pg.QueryResult> {
    let queryText = "SELECT DISTINCT v.idVariete, v.nom, anneeMiseEnMarche, descSemis, plantation, entretien, recolte, periodeMisePlace, periodeRecolte, comGen, nomVersion, nomTypeSol, niveau, s.nom as nomSemencier "
    queryText += "FROM (JARDINCOMMUNDB.VarieteEnCultivation NATURAL JOIN JARDINCOMMUNDB.Variete NATURAL JOIN JARDINCOMMUNDB.VarieteProduction NATURAL JOIN JARDINCOMMUNDB.Adaptation NATURAL JOIN JARDINCOMMUNDB.TypeSol) v, JARDINCOMMUNDB.Semencier s WHERE v.siteWeb = s.siteWeb AND ";
    queryText += `EXISTS (SELECT * FROM JARDINCOMMUNDB.Parcelle p WHERE p.idJardin = '${gardenId}' AND v.coordParcelle = p.coordParcelle);`;
    const client = await this.pool.connect();
    const res = await client.query(queryText);
    client.release()
    return res;
  }

  // ======= PLANT =======
  public async getPlantInfo(plantName: string): Promise<Plant[]> {
    
    const client = await this.pool.connect();
    const query = `SELECT p.idPlante, p.nom, nomLatin, categorie, pType, m.nom as nomMenace, pSousType, idJardin, idVariete from JARDINCOMMUNDB.Plante p LEFT OUTER JOIN JARDINCOMMUNDB.PlanteMenace pm
    ON (p.idPlante = pm.idPlante) LEFT OUTER JOIN JARDINCOMMUNDB.Menace m ON (m.idMenace = pm.idMenace) WHERE p.nom LIKE '%${plantName}%';
    `;
    const res = await client.query(query);
    client.release()
    const plantsInfo: Plant[] = res.rows.map((plant) => ({
      id: plant.ipdlante, 
	    name: plant.nom,
	    latinName: plant.nomlatin,
	    category: plant.categorie,
	    type: plant.ptype,
	    threatName: plant.nommenace,
	    subtype: plant.psoustype,
	    jardinId: plant.idjardin,
	    varietyId: plant.idvariete, 
    }));
    return plantsInfo;
  }

  // ======= VARIETY =======
  public async getVarieties(): Promise<Variety[]> {
    const client = await this.pool.connect();
    let queryText = "SELECT v.idVariete, v.nom, anneeMiseEnMarche, descSemis, plantation, entretien, recolte, periodeMisePlace, periodeRecolte, comGen, nomVersion, nomTypeSol, niveau, s.nom as nomSemencier ";
    queryText += "FROM (JARDINCOMMUNDB.Variete NATURAL JOIN JARDINCOMMUNDB.VarieteProduction NATURAL JOIN JARDINCOMMUNDB.Adaptation NATURAL JOIN JARDINCOMMUNDB.TypeSol) v, JARDINCOMMUNDB.Semencier s WHERE v.siteWeb = s.siteWeb;";
    const res = await client.query(queryText);
    client.release()
    const varieties: Variety[] = res.rows.map((variety) => ({
      varietyId: variety.idvariete,
	    name: variety.nom,
	    year: variety.anneemiseenmarche,
	    description: variety.descsemis,
	    plantation: variety.plantation,
	    maintenance: variety.entretien,
	    harvest: variety.recolte,
	    plantationPeriod: variety.periodemiseplace,
	    harvestPeriod: variety.perioderecolte,
	    comments: variety.comgen,
	    version: variety.nomversion,
      soilType: variety.nomtypesol,
      adaptation: variety.niveau,
      seedmanName: variety.nomsemencier,
    }));
    return varieties;
  }

  public async createVariety(variety: Variety): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    
    if (!variety.name.length || !variety.year.toString().length || !variety.description.length || !variety.plantation.length || !variety.maintenance.length 
        || !variety.harvest.length || !variety.plantationPeriod.toString().length || !variety.harvestPeriod.toString().length || !variety.version.length 
        || !variety.soilType.length || !variety.adaptation.length || !variety.seedmanName.length)
      throw new Error("Invalid create hotel values");

    const values: string[] = [variety.varietyId.toString(), variety.name, variety.year.toString(), variety.description, variety.plantation, variety.maintenance, variety.harvest, variety.plantationPeriod.toString(), variety.harvestPeriod.toString(), variety.comments];
    const queryVariety: string = `INSERT INTO JARDINCOMMUNDB.Variete VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    const res = await client.query(queryVariety, values);
    const queryAdaptation: string = `INSERT INTO JARDINCOMMUNDB.Adaptation VALUES('${variety.varietyId}', '${variety.soilType}', '${variety.adaptation}');`;
    const queryVarietyProduction: string = `INSERT INTO JARDINCOMMUNDB.VarieteProduction VALUES('${variety.varietyId}', '${variety.seedmanName}', '${variety.version}');`;
    await client.query(queryAdaptation);
    await client.query(queryVarietyProduction);
    client.release()
    return res;
  }

  public async deleteVariety(varietyId: number): Promise<pg.QueryResult> {
    if (varietyId.toString().length === 0) throw new Error("Invalid delete query");
    const client = await this.pool.connect();
    const query = `DELETE FROM JARDINCOMMUNDB.Variete WHERE idVariete = '${varietyId}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }

  public async updateVariety(variety: Variety): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
  
    if (variety.name.length > 0) toUpdateValues.push(`nom = '${variety.name}'`);
    if (variety.year.toString().length > 0) toUpdateValues.push(`anneeMiseEnMarche = '${variety.year}'`);
    if (variety.description.length > 0) toUpdateValues.push(`descSemis = '${variety.description}'`);
    if (variety.plantation.length > 0) toUpdateValues.push(`plantation = '${variety.plantation}'`);
    if (variety.maintenance.length > 0) toUpdateValues.push(`entretien = '${variety.maintenance}'`);
    if (variety.harvest.length > 0) toUpdateValues.push(`recolte = '${variety.harvest}'`);
    if (variety.plantationPeriod.toString().length > 0) toUpdateValues.push(`periodeMisePlace = '${variety.plantationPeriod}'`);
    if (variety.harvestPeriod.toString().length > 0) toUpdateValues.push(`periodeRecolte = '${variety.harvestPeriod}'`);
    if (variety.comments.length > 0) toUpdateValues.push(`comGen = '${variety.comments}'`);

    if (!variety.varietyId || variety.varietyId.toString().length === 0 || toUpdateValues.length === 0)
      throw new Error("Invalid hotel update query");

    const query = `UPDATE JARDINCOMMUNDB.Variete SET ${toUpdateValues.join(", ")} WHERE idVariete = '${variety.varietyId}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }

  // ======= Seedman =======
  public async getSeedmen(): Promise<Seedman[]> {
    const client = await this.pool.connect();
    const query = "SELECT * FROM JARDINCOMMUNDB.Semencier;";
    const res = await client.query(query);
    const seedMen: Seedman[] = res.rows.map((seedMan) => ({
      webSite: seedMan.siteweb,
	    name: seedMan.nom,
    }));
    client.release()
    return seedMen;
  }

  // ======= SoilType =======
  public async getSoilTypes(): Promise<SoilType[]> {
    const client = await this.pool.connect();
    const query = "SELECT * FROM JARDINCOMMUNDB.TypeSol;";
    const res = await client.query(query);
    const soilTypes: SoilType[] = res.rows.map((soilType) => ({
	    name: soilType.nomtypesol,
    }));
    client.release()
    return soilTypes;
  }
}
