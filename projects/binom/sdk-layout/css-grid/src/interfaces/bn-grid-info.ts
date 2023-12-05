import { BnGridWrapper } from "./bn-grid-wrapper";

export interface BnGridInfo {
    fullscreen:boolean;
    calcHeights:boolean;
    grid:boolean;
    alwaysGrid: boolean;
    alwaysCalcHeights:boolean;
    hierarchy:BnGridWrapper[]
}
