import { BnGridHeights } from "./bn-grid-heights";
import { BnGridVisible } from "./bn-grid-visible";
import { BnGridWrapperConfig } from "./bn-grid-wrapper-config";
import { BnGridElConfig } from "./elements/bn-grid-el-config";
import { BnGridElements } from "./elements/bn-grid-elements";

export interface BnGridWrapper {
    wrapperId:string;
    parentId:string;
    isRandom:boolean;
    level:number;
    visible:BnGridVisible;
    config: BnGridWrapperConfig;
    elConfig: BnGridElConfig;
    has:BnGridElements;
    heights: BnGridHeights;
    children:BnGridWrapper[];

}
