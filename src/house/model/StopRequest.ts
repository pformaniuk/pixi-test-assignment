import { ElevatorDirection } from "./ElevatorStatus";

export class StopRequest {
  constructor(
    public floor: number,
    public direction: ElevatorDirection,
    public passengerId: string,
  ) {}
}
