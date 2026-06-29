import { PersonStatus } from "./PersonStatus";

export interface IPersonModel {
  id: string;
  souseceFloor: number;
  destinationFloor: number;
  status: PersonStatus;
}
