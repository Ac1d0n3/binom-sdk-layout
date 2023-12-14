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
        active:{ grid: true, calcHeights:false},
        def: { grid: true, calcHeights:false },
        animated:false,
        noFullScreen:false,
        noInheritGrid:false,
        noInheritCalcHeights:false,
        maxWidth: 0,
        width: '100%',
        offsetTop: 0,
        offsetBottom:0,
        centered: false,
      },
      has: { preheader:false, header:false, sidebarleft:false, precontent:false, content:false, sidebarright:false, footer:false },
      visible:{
        def: { preheader:false, header:false, sidebarleft:false, precontent:false, content:false, sidebarright:false, footer:false },
        active:  { preheader:false, header:false, sidebarleft:false, precontent:false, content:false, sidebarright:false, footer:false }
      },
      heights: { wrapper:0, preheader:0, header:0, sidebarleft:0, precontent:0, content:0, sidebarright:0, footer:0 },
      elConfig:{
        preheader: { height:0,  fullHeight: false, fullWidth: false, fullWidthContent:'fullscreen'}, 
        header: { sticky: false, transparentAos: false, fullWidth: false,  fullWidthContent:'fullscreen' },
        footer: { fullWidth: false,  fullWidthContent:'fullscreen' },
        sidebars:{ 
          right: { width: 200, defWidth:200, createToggle:false, createToogleOnPhone:false, inFooter: false, inHeader: false, iconSidebar: false, iconSidebarToggle: false },
          left: {width: 200, defWidth:200, createToggle:false, createToogleOnPhone:false, inFooter: false, inHeader: false, iconSidebar: false , iconSidebarToggle: false}
        },
        content:{
          maxWidth:0,
        },
        precontent:{
          fullHeight:false,
          height:0,
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

  
  setHeaderDefaults(gridWrapper:BnGridWrapper, sticky:boolean, fullWidth:boolean, transparentAos:boolean, fullWidthContent: 'always' | 'none' | 'fullscreen'):void{
    gridWrapper.elConfig.header.sticky = sticky;
    gridWrapper.elConfig.header.transparentAos = transparentAos;
    gridWrapper.elConfig.header.fullWidth = fullWidth;
    gridWrapper.elConfig.header.fullWidthContent = fullWidthContent;
  }

  setPreheaderDefaults(gridWrapper:BnGridWrapper, height:number, fullHeight:boolean, fullWidth:boolean,  fullWidthContent: 'always' | 'none' | 'fullscreen'):void{
    gridWrapper.elConfig.preheader.fullHeight = fullHeight;
    gridWrapper.elConfig.preheader.fullWidth = fullWidth;
    gridWrapper.elConfig.preheader.fullWidthContent = fullWidthContent;
    gridWrapper.elConfig.preheader.height = height;
   
  }

  setFooterDefaults(gridWrapper:BnGridWrapper, fullWidth:boolean,  fullWidthContent: 'always' | 'none' | 'fullscreen'):void{
    gridWrapper.elConfig.footer.fullWidth = fullWidth;
    gridWrapper.elConfig.footer.fullWidthContent = fullWidthContent;
  }

  setWrapperDefaults(gridWrapper: BnGridWrapper, grid:boolean, animated:boolean, noInheritGrid:boolean, calcHeights:boolean, noInheritCalcHeights:boolean, noFullScreen:boolean, centered:boolean, offsetTop:number, offsetBottom:number):void {
    gridWrapper.config.noInheritGrid = noInheritGrid;
    gridWrapper.config.noInheritCalcHeights = noInheritCalcHeights;
    gridWrapper.config.active.grid = grid;
    gridWrapper.config.def.grid = grid;
    gridWrapper.config.animated = animated;
    gridWrapper.config.active.calcHeights = calcHeights;
    gridWrapper.config.def.calcHeights = calcHeights;
    gridWrapper.config.noFullScreen = noFullScreen;
    gridWrapper.config.centered = centered;
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

  setSidebarDefaults(gridWrapper: BnGridWrapper, pos:string, createToggle:boolean, createToogleOnPhone:boolean, inFooter:boolean, inHeader:boolean, iconSidebar:boolean,iconSidebarToggle:boolean, width:number ):void {
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].inFooter = inFooter;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].inHeader = inHeader;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].iconSidebar = iconSidebar;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].iconSidebarToggle = iconSidebarToggle;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].width = width;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].defWidth = width;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].createToggle = createToggle;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].createToogleOnPhone = createToogleOnPhone;
  }

  getElementHeight(gridWrapper: BnGridWrapper, elTag:string):number {
    return gridWrapper.heights[elTag as keyof BnGridHeights];
  }

  setElementHeight(gridWrapper: BnGridWrapper, elTag:string, height:number):void {
    gridWrapper.heights[elTag as keyof BnGridHeights] = height;
  }


  

}
