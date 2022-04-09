import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Room } from "../../../common/tables/Room";
import { Hotel } from "../../../common/tables/Hotel";
import { GardenInfo } from "../../../common/tables/GardenInfo";
import { Gender, Guest } from "../../../common/tables/Guest";

@injectable()
export class DatabaseService {

  // TODO: A MODIFIER POUR VOTRE BD
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
  public async getGardenInfos(): Promise<GardenInfo> {
    
    const basicInfo = (await this.getGardenInfo()).rows.map((garden) => ({
      jardinId: garden.jardinid,
      name: garden.nom,
      surface: garden.surface,
    }));
    const parcelInfo = (await this.getGardenParcelInfos()).rows.map((parcel) => ({
      jardinId: parcel.jardinid,
      coordinates: parcel.coordparcelle,
      dimensions: parcel.dimensions,
    }));
    const cultivateRankInfo = (await this.getGardenCultivateRankInfos()).rows.map((cultivateRank) => ({
      coordinates: cultivateRank.coordparcelle, 
      number: cultivateRank.numrang,
      type: cultivateRank.typemiseplace,
      period: cultivateRank.periodeculture,
    }));
    const fallowRankInfo = (await this.getGardenFallowRankInfos()).rows.map((fallowRank) => ({
      coordinates: fallowRank.coordparcelle,
      number: fallowRank.numrang,
      period: fallowRank.periodejachere,
    }));

    const varietyInfo = (await this.getGardenVarietyInfos()).rows.map((variety) => ({
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
      parcelCoords: variety.coordparcelle,
    }));
    return { basicInfo: basicInfo,  parcelInfo: parcelInfo, cultivateRankInfo: cultivateRankInfo, fallowRankInfo: fallowRankInfo, varietyInfo: varietyInfo };
  }

  public async getGardenInfo(): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const query = "SELECT * FROM JARDINCOMMUNDB.Jardin j;";
    const res = await client.query(query);
    client.release()
    return res;
  }

  public async getGardenParcelInfos(): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const query = `SELECT p.coordParcelle, p.dimensions, p.jardinId FROM JARDINCOMMUNDB.Jardin j NATURAL JOIN JARDINCOMMUNDB.Parcelle p;`;
    const res = await client.query(query);
    client.release()
    return res;
  }
  public async getGardenCultivateRankInfos(): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const query = `SELECT c.coordParcelle, c.numRang, c.typeMisePlace, c.periodeCulture FROM JARDINCOMMUNDB.Parcelle p NATURAL JOIN JARDINCOMMUNDB.Cultivation c;`;
    const res = await client.query(query);
    client.release()
    return res;
  }

  public async getGardenFallowRankInfos(): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const query = `SELECT j.coordParcelle, j.numRang, j.periodeJachere FROM JARDINCOMMUNDB.Parcelle p NATURAL JOIN JARDINCOMMUNDB.Jachere j;`;
    const res = await client.query(query);
    client.release()
    return res;
  }
  public async getGardenVarietyInfos(): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const query = `SELECT vc.coordParcelle, v.idVariete, v.nom, v.anneeMiseEnMarche, v.descSemis, v.plantation, v.entretien, v.recolte, v.periodeMisePlace, v.periodeRecolte, v.comGen, v.nomVersion FROM JARDINCOMMUNDB.VarieteEnCultivation vc NATURAL JOIN JARDINCOMMUNDB.Variete v;`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  // ======= DEBUG =======
  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM HOTELDB.${tableName};`);
    client.release()
    return res;
  }


  // ======= HOTEL =======
  public async createHotel(hotel: Hotel): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!hotel.hotelnb || !hotel.name || !hotel.city)
      throw new Error("Invalid create hotel values");

    const values: string[] = [hotel.hotelnb, hotel.name, hotel.city];
    const queryText: string = `INSERT INTO HOTELDB.Hotel VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release()
    return res;
  }


  // get hotels that correspond to certain caracteristics
  public async filterHotels(hotelNb: string, hotelName: string, city: string): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (hotelNb.length > 0) searchTerms.push(`hotelNb = '${hotelNb}'`);
    if (hotelName.length > 0) searchTerms.push(`name = '${hotelName}'`);
    if (city.length > 0) searchTerms.push(`city = '${city}'`);

    let queryText = "SELECT * FROM HOTELDB.Hotel";
    if (searchTerms.length > 0) queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release()
    return res;
  }


  // get the hotel names and numbers so so that the user can only select an existing hotel
  public async getHotelNamesByNos(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query("SELECT hotelNb, name FROM HOTELDB.Hotel;");
    client.release()
    return res;
  }


  // modify name or city of a hotel
  public async updateHotel(hotel: Hotel): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
  
    if (hotel.name.length > 0) toUpdateValues.push(`name = '${hotel.name}'`);
    if (hotel.city.length > 0) toUpdateValues.push(`city = '${hotel.city}'`);

    if (!hotel.hotelnb || hotel.hotelnb.length === 0 || toUpdateValues.length === 0)
      throw new Error("Invalid hotel update query");

    const query = `UPDATE HOTELDB.Hotel SET ${toUpdateValues.join(", ")} WHERE hotelNb = '${hotel.hotelnb}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  public async deleteHotel(hotelNb: string): Promise<pg.QueryResult> {
    if (hotelNb.length === 0) throw new Error("Invalid delete query");
    
    
    const client = await this.pool.connect();
    const query = `DELETE FROM HOTELDB.Hotel WHERE hotelNb = '${hotelNb}';`;

    const res = await client.query(query);
    client.release()
    return res;
  }


  // ======= ROOMS =======
  public async createRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!room.roomnb || !room.hotelnb || !room.type || !room.price)
      throw new Error("Invalid create room values");

    const values: string[] = [
      room.roomnb,
      room.hotelnb,
      room.type,
      room.price.toString(),
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values);
    client.release()
    return res;
  }


  public async filterRooms(
    hotelNb: string,
    roomNb: string = "",
    roomType: string = "",
    price: number = -1
    ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!hotelNb || hotelNb.length === 0) throw new Error("Invalid filterRooms request");
    
    let searchTerms = [];
    searchTerms.push(`hotelNb = '${hotelNb}'`);

    if (roomNb.length > 0) searchTerms.push(`hotelNb = '${hotelNb}'`);
    if (roomType.length > 0) searchTerms.push(`type = '${roomType}'`);
    if (price >= 0) searchTerms.push(`price = ${price}`);

    let queryText = `SELECT * FROM HOTELDB.Room WHERE ${searchTerms.join(" AND ")};`;
    const res = await client.query(queryText);
    client.release()
    return res;
  }


  public async updateRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
    if (room.price >= 0) toUpdateValues.push(`price = ${room.price}`);
    if (room.type.length > 0)
      toUpdateValues.push(`type = '${room.type}'`);

    if (!room.hotelnb ||
      room.hotelnb.length === 0 ||
      !room.roomnb ||
      room.roomnb.length === 0 ||
      toUpdateValues.length === 0
    ) throw new Error("Invalid room update query");

    const query = `UPDATE HOTELDB.Room SET ${toUpdateValues.join(
    ", "
    )} WHERE hotelNb = '${room.hotelnb}' AND roomNb = '${room.roomnb}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  public async deleteRoom(hotelNb: string, roomNb: string): Promise<pg.QueryResult> {
    if (hotelNb.length === 0) throw new Error("Invalid room delete query");
    const client = await this.pool.connect();

    const query = `DELETE FROM HOTELDB.Room WHERE hotelNb = '${hotelNb}' AND roomNb = '${roomNb}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  // ======= GUEST =======
  public async createGuest(guest: Guest): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    if (
      !guest.guestnb ||
      !guest.nas ||
      !guest.name ||
      !guest.gender ||
      !guest.city
    ) throw new Error("Invalid create room values");

    if (!(guest.gender in Gender)) throw new Error("Unknown guest gender passed");

    const values: string[] = [
      guest.guestnb,
      guest.nas,
      guest.name,
      guest.gender,
      guest.city,
    ];
    const queryText: string = `INSERT INTO HOTELDB.Guest VALUES($1, $2, $3, $4, $5);`;
    const res = await client.query(queryText, values);
    client.release()
    return res;
  }


  public async getGuests(hotelNb: string, roomNb: string): Promise<pg.QueryResult> {
    if (!hotelNb || hotelNb.length === 0) throw new Error("Invalid guest hotel no");
    
    const client = await this.pool.connect();
    const queryExtension = roomNb ? ` AND b.roomNb = '${roomNb}'` : "";
    const query: string = `SELECT * FROM HOTELDB.Guest g JOIN HOTELDB.Booking b ON b.guestNb = g.guestNb WHERE b.hotelNb = '${hotelNb}'${queryExtension};`;

    const res = await client.query(query);
    client.release()
    return res;
  }

  // ======= BOOKING =======
  public async createBooking(
    hotelNb: string,
    guestNo: string,
    dateFrom: Date,
    dateTo: Date,
    roomNb: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const values: string[] = [
      hotelNb,
      guestNo,
      dateFrom.toString(),
      dateTo.toString(),
      roomNb,
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4,$5);`;

    const res = await client.query(queryText, values);
    client.release()
    return res;
  }
}
