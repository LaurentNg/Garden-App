import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";
import { DatabaseService } from "../services/database.service";
import Types from "../types";
import { GardenInfo } from "../../../common/tables/GardenInfo";
import { Garden } from "../../../common/tables/Garden";
import { Plant } from "../../../common/tables/Plant";
import { Variety } from "../../../common/tables/Variety";
import { Seedman } from "../../../common/tables/Seedman";
import { SoilType } from "../../../common/tables/SoilType";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    router.get("/gardens", (req: Request, res: Response, _: NextFunction) => {
      this.databaseService
        .getGardens()
        .then((result: pg.QueryResult) => {
          const basicInfo: Garden[] = result.rows.map((garden) => ({
            jardinId: garden.idjardin,
            name: garden.nom,
            surface: garden.surface,
          }));
          res.json(basicInfo);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get("/garden/info", (req: Request, res: Response, _: NextFunction) => {
      const gardenId = req.query.gardenId ? req.query.gardenId : "";

      this.databaseService
        .getGardenInfos(gardenId)
        .then((result: GardenInfo) => {
          res.json(result);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get("/plant", (req: Request, res: Response, _: NextFunction) => {
      const plantName = req.query.plantName ? req.query.plantName : "";

      this.databaseService
        .getPlantInfo(plantName)
        .then((result: Plant[]) => {
          res.json(result);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get("/varieties", (req: Request, res: Response, _: NextFunction) => {
      this.databaseService
        .getVarieties()
        .then((result: Variety[]) => {
          res.json(result);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.post(
      "/varieties/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const variety: Variety = {
          varietyId: req.body.varietyId,
          name: req.body.name ? req.body.name : "",
          year: req.body.year ? req.body.year : "",
          description: req.body.description ? req.body.description : "",
          plantation: req.body.plantation ? req.body.plantation : "",
          maintenance: req.body.maintenance ? req.body.maintenance : "",
          harvest: req.body.harvest ? req.body.harvest : "",
          plantationPeriod: req.body.plantationPeriod ? req.body.plantationPeriod : "",
          harvestPeriod: req.body.harvestPeriod ? req.body.harvestPeriod : "",
          comments: req.body.comments ? req.body.comments : "",
          version: req.body.version ? req.body.version : "",
          soilType: req.body.soilType ? req.body.soilType : "",
          adaptation: req.body.adaptation ? req.body.adaptation : "",
          seedmanName: req.body.seedmanName ? req.body.seedmanName : "",
        };

        this.databaseService
          .createVariety(variety)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.post(
      "/varieties/delete/:varietyId",
      (req: Request, res: Response, _: NextFunction) => {
        const varietyId: number = req.params.varietyId;
        this.databaseService
          .deleteVariety(varietyId)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.put(
      "/varieties/update",
      (req: Request, res: Response, _: NextFunction) => {
        const variety: Variety = {
          varietyId: req.body.varietyId,
          name: req.body.name ? req.body.name : "",
          year: req.body.year ? req.body.year : "",
          description: req.body.description ? req.body.description : "",
          plantation: req.body.plantation ? req.body.plantation : "",
          maintenance: req.body.maintenance ? req.body.maintenance : "",
          harvest: req.body.harvest ? req.body.harvest : "",
          plantationPeriod: req.body.plantationPeriod ? req.body.plantationPeriod : "",
          harvestPeriod: req.body.harvestPeriod ? req.body.harvestPeriod : "",
          comments: req.body.comments ? req.body.comments : "",
          version: req.body.version ? req.body.version : "",
          soilType: req.body.soilType ? req.body.soilType : "",
          adaptation: req.body.adaptation ? req.body.adaptation : "",
          seedmanName: req.body.seedmanName ? req.body.seedmanName : "",
        };

        this.databaseService
          .updateVariety(variety)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.get("/seedmen", (req: Request, res: Response, _: NextFunction) => {
      this.databaseService
        .getSeedmen()
        .then((result: Seedman[]) => {
          res.json(result);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get("/soiltypes", (req: Request, res: Response, _: NextFunction) => {
      this.databaseService
        .getSoilTypes()
        .then((result: SoilType[]) => {
          res.json(result);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    return router;
  }
}
