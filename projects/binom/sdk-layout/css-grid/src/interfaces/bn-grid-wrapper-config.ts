import { BnGridSettings } from "./bn-grid-settings";

export interface BnGridWrapperConfig {
    maxWidth: number;
    width: string;
    centered:boolean;
    animated:boolean;
    noInheritGrid: boolean;
    noInheritCalcHeights:boolean;
    noFullScreen: boolean;
    offsetTop: number;
    offsetBottom: number;
    active: BnGridSettings;
    def: BnGridSettings;
}
