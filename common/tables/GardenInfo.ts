import { CultivateRank } from "./CultivateRank";
import { FallowRank } from "./FallowRank";
import { Garden } from "./Garden";
import { Parcel } from "./Parcel";
import { Variety } from "./Variety";

export interface GardenInfo {
    basicInfo: Garden[];
    parcelInfo: Parcel[];
    cultivateRankInfo: CultivateRank[];
    fallowRankInfo: FallowRank[];
    varietyInfo: Variety[];
}