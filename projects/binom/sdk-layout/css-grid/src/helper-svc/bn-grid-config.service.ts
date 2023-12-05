import { Injectable } from '@angular/core';
import { BnGridInfo } from '../interfaces/bn-grid-info';
import { BnGridWrapper } from '../interfaces/bn-grid-wrapper';
import { BnGridElements } from '../interfaces/elements/bn-grid-elements';
import { BnGridSidebars } from '../interfaces/elements/bn-grid-sidebars';
import { BnGridHeights } from '../interfaces/bn-grid-heights';

@Injectable({
  providedIn: 'root'
})
export class BnGridConfigService {

  constructor() { }

  iconSidebarWidth:number = 48;

  defaultGridData(wrapperId:string, parentId:string):BnGridWrapper {
    return {
      wrapperId: wrapperId,
      parentId: parentId,
      isRandom: false,
      level: 0,
      config:{
        active:{ grid: false, calcHeights:false},
        def: { grid: false, calcHeights:false },
        noFullScreen:false,
        noInheritGrid:false,
        noInheritCalcHeights:false,
        maxWidth: 0,
        width: '100%',
        offsetTop: 0,
        offsetBottom:0,
        centerX: false,
        centerY: false,
      },
      has: { preheader:false, header:false, sidebarleft:false, precontent:false, content:false, sidebarright:false, footer:false },
      visible:{
        def: { preheader:false, header:false, sidebarleft:false, precontent:false, content:false, sidebarright:false, footer:false },
        active:  { preheader:false, header:false, sidebarleft:false, precontent:false, content:false, sidebarright:false, footer:false }
      },
      heights: { wrapper:0, preheader:0, header:0, sidebarleft:0, precontent:0, content:0, sidebarright:0, footer:0 },
      elConfig:{
        preheader: { height:0, fullAs: 'window', fullHeight: false, fullWidth: false, useMaxWitdhForContent:false}, 
        header: { sticky: false, transparentAos: false, fullWidth: false, useMaxWitdhForContent:false },
        footer: { fullWidth: false, useMaxWitdhForContent:false },
        sidebars:{ 
          right: {animated:false, width: 200, createToggle:false, createToogleOnPhone:false, inFooter: false, inHeader: false, iconSidebar: false, iconSidebarToggle: false },
          left: {animated:false, width: 200, createToggle:false, createToogleOnPhone:false, inFooter: false, inHeader: false, iconSidebar: false , iconSidebarToggle: false}
        },
        content:{
          maxWidth:0,
        },
        precontent:{
          fullHeight:false,
          height:0,
          fullAs: 'window'
        }
      },
      children: []
    }
  }

  setHas(gridWrapper: BnGridWrapper, elTag:string):void{
    gridWrapper.has[elTag as keyof BnGridElements] = true;
  }

  setActiveVisible(gridWrapper: BnGridWrapper, elTag:string, visible:boolean):void {
    gridWrapper.visible.active[elTag as keyof BnGridElements] = visible;
  }

  setDefaultVisible(gridWrapper: BnGridWrapper, elTag:string, visible:boolean):void {
    gridWrapper.visible.def[elTag as keyof BnGridElements] = visible;
  }

  resetWrapperDefaultVisible(gridWrapper:BnGridWrapper):void{
    gridWrapper.config.active = { ... gridWrapper.config.def }
  }

  
  setHeaderDefaults(gridWrapper:BnGridWrapper, sticky:boolean, fullWidth:boolean, transparentAos:boolean, useMaxWitdhForContent:boolean):void{
    gridWrapper.elConfig.header.sticky = sticky;
    gridWrapper.elConfig.header.transparentAos = transparentAos;
    gridWrapper.elConfig.header.fullWidth = fullWidth;
    gridWrapper.elConfig.header.useMaxWitdhForContent = useMaxWitdhForContent;
  }

  setPreheaderDefaults(gridWrapper:BnGridWrapper, height:number, fullHeight:boolean, fullWidth:boolean, useMaxWitdhForContent:boolean, fullAs:'window' | 'content'):void{
    gridWrapper.elConfig.preheader.fullHeight = fullHeight;
    gridWrapper.elConfig.preheader.fullWidth = fullWidth;
    gridWrapper.elConfig.preheader.useMaxWitdhForContent = useMaxWitdhForContent;
    gridWrapper.elConfig.preheader.height = height;
    gridWrapper.elConfig.preheader.fullAs = fullAs;
  }

  setFooterDefaults(gridWrapper:BnGridWrapper, fullWidth:boolean, useMaxWitdhForContent:boolean):void{
    gridWrapper.elConfig.footer.fullWidth = fullWidth;
    gridWrapper.elConfig.footer.useMaxWitdhForContent = useMaxWitdhForContent;
  }

  setWrapperDefaults(gridWrapper: BnGridWrapper, grid:boolean, noInheritGrid:boolean, calcHeights:boolean, noInheritCalcHeights:boolean, noFullScreen:boolean, centeredX:boolean, centeredY:boolean, offsetTop:number, offsetBottom:number):void {
    gridWrapper.config.noInheritGrid = noInheritGrid;
    gridWrapper.config.noInheritCalcHeights = noInheritCalcHeights;
    gridWrapper.config.active.grid = grid;
    gridWrapper.config.def.grid = grid;
    gridWrapper.config.active.calcHeights = calcHeights;
    gridWrapper.config.def.calcHeights = calcHeights;
    gridWrapper.config.noFullScreen = noFullScreen;
    gridWrapper.config.centerX = centeredX;
    gridWrapper.config.centerY = centeredY;
    gridWrapper.config.offsetBottom = offsetBottom;
    gridWrapper.config.offsetTop = offsetTop;
  }

  setWrapperGridConfig(gridWrapper: BnGridWrapper, grid:boolean, calcHeights:boolean):void{
    gridWrapper.config.active.grid = grid;
    gridWrapper.config.active.calcHeights = calcHeights;
  }
  
  resetWrapperDefaults(gridWrapper:BnGridWrapper):void {
    gridWrapper.config.active = { ... gridWrapper.config.def };
  }

  setWrapperMaxWidth(gridWrapper: BnGridWrapper, maxWidth:number):void {
    gridWrapper.config.maxWidth = maxWidth;
  }

  getWrapperMaxWidth(gridWrapper: BnGridWrapper):number {
    return gridWrapper.config.maxWidth;
  }

  setWrapperWidth(gridWrapper: BnGridWrapper, width:string='100%'):void {
    gridWrapper.config.width = width;
  }

  getWrapperWidth(gridWrapper: BnGridWrapper):string {
    return gridWrapper.config.width;
  }

  setSidebarDefaults(gridWrapper: BnGridWrapper, pos:string, createToggle:boolean, createToogleOnPhone:boolean, inFooter:boolean, inHeader:boolean, iconSidebar:boolean,iconSidebarToggle:boolean, animated:boolean, width:number ):void {
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].inFooter = inFooter;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].inHeader = inHeader;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].iconSidebar = iconSidebar;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].iconSidebarToggle = iconSidebarToggle;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].animated = animated;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].width = width;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].createToggle = createToggle;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].createToogleOnPhone = createToogleOnPhone;
  }
  
  toggleIconSidebarConfig(gridWrapper: BnGridWrapper, pos:string,width:number,toggle:boolean){
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].iconSidebarToggle =toggle ;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].width = toggle ? width: this.iconSidebarWidth;
  }


  getElementHeight(gridWrapper: BnGridWrapper, elTag:string):number {
    return gridWrapper.heights[elTag as keyof BnGridHeights];
  }

  setElementHeight(gridWrapper: BnGridWrapper, elTag:string, height:number):void {
    gridWrapper.heights[elTag as keyof BnGridHeights] = height;
  }


  

}
