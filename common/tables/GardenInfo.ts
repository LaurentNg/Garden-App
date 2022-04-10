import { CultivateRank } from "./CultivateRank";
import { FallowRank } from "./FallowRank";
import { Parcel } from "./Parcel";
import { Variety } from "./Variety";

export interface GardenInfo {
    parcelInfo: Parcel[];
    cultivateRankInfo: CultivateRank[];
    fallowRankInfo: FallowRank[];
    varietyInfo: Variety[];
}