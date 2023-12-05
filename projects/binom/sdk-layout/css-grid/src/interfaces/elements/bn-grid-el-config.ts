import { BnGridContent } from "./bn-grid-content";
import { BnGridFooter } from "./bn-grid-footer";
import { BnGridHeader } from "./bn-grid-header";
import { BnGridPrecontent } from "./bn-grid-precontent";
import { BnGridPreheader } from "./bn-grid-preheader";
import { BnGridSidebars } from "./bn-grid-sidebars";

export interface BnGridElConfig {
    header:BnGridHeader;
    preheader: BnGridPreheader;
    sidebars:BnGridSidebars;
    precontent: BnGridPrecontent;
    content: BnGridContent;
    footer: BnGridFooter;
}
