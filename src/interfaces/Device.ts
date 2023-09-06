import { DeviceEnum } from "./DeviceEnum";
import { PsbtStyle } from "./PsbtStyle";

export default interface Device {
    name: string,
    device: DeviceEnum,
    psbtStyle: PsbtStyle,
}