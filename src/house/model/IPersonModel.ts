import { PersonStatus } from "./PersonStatus";
import { StopRequest } from "./StopRequest";

export interface IPersonModel {
  id: string;
  souseceFloor: number;
  destinationFloor: number;
  status: PersonStatus;
  reachElevator(): StopRequest;
}
