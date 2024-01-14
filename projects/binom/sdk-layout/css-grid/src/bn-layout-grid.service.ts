import { Injectable, inject } from '@angular/core';
import { BnLogMsg, BnLogSource, BnLoggerService } from '@binom/sdk-core/logger';
import { BehaviorSubject } from 'rxjs';
import { BnGridWrapperEvent } from './interfaces/bn-grid-wrapper-event';
import { BnGridInfo } from './interfaces/bn-grid-info';
import { BnLayoutService } from '@binom/sdk-layout/core';
import { BnGridConfigService } from './helper-svc/bn-grid-config.service';
import { BnGridWrapper } from './interfaces/bn-grid-wrapper';
import { BnGridElements } from './interfaces/elements/bn-grid-elements';
import { BnGridCss } from './interfaces/bn-grid-css';
import { BnGridWrapperConfig } from './interfaces/bn-grid-wrapper-config';
import { BnGridSidebars } from './interfaces/elements/bn-grid-sidebars';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { AnimationMetadata, AnimationMetadataType, animate, style } from '@angular/animations';
import { BnGridAnimateObject } from './interfaces/bn-grid-animate-object';
import { BnWrapperCurVals } from './interfaces/bn-wrapper-cur-vals';
import { BnGridCurStates } from './interfaces/bn-grid-cur-states';

@Injectable({ providedIn: 'root' })
export class BnLayoutGridService {
  constructor() { }
  private logger = inject(BnLoggerService);
  private logSource:BnLogSource = { module: 'bnLayout', source: 'BnLayoutGridService' };
  private __logMsg(type:any, msg:BnLogMsg){if(this.logger.doLog(this.logSource,type)){ let formatMsg:any = this.logger.formatMsg(msg,this.logSource,type); console.log(formatMsg.msg,formatMsg.color);}};
  private configSvc = inject(BnGridConfigService);
  private layoutSvc = inject(BnLayoutService);
  private eventCount:number = 0;
  private childEventCount:number = 0;
  private prevEvent!:BnGridWrapperEvent;
  private randomIds:string[] = [];
  wrapperEvent$:BehaviorSubject<BnGridWrapperEvent> = new BehaviorSubject({} as any);
  wrapperChildEvent$:BehaviorSubject<BnGridWrapperEvent> = new BehaviorSubject({} as any);
  gridInfo: BnGridInfo = { fullscreen: false, grid: true, calcHeights: false, alwaysGrid: false, alwaysCalcHeights: false, hierarchy: [] };
  

  //-------------------------------------------------------------------------------------------
  //  Grid Wrapper Events
  wrapperEvent(wrapperId:string,parentId:string, level:number, source:string, action:string, state:boolean|null=null, outside:boolean=false):void{
    this.__updateWWrapper(wrapperId,parentId,level,  source, action, state, outside);
  }

  wrapperChildEvent(wrapperId:string,parentId:string, level:number, source:string, action:string, state:boolean|null=null, outside:boolean=false){
    this.__updateChildWWrapper(wrapperId,parentId, level, source, action, state, outside);
  }

  private __updateWWrapper(wrapperId:string, parentId:string, level:number, source:string, action:string, state:boolean|null=null, outside:boolean=false):void {
    this.eventCount++;
    const next = { count: this.eventCount, wrapper:wrapperId, parent:parentId, source: source, action: action, state:state, level:level, outsideEvent: outside, childEvent: false }
    this.__logMsg('warn', { function: '__updateWWrapper', msg: 'layoutEvent', info:next });
    this.wrapperEvent$.next(next)
  }

  private __updateChildWWrapper(wrapperId:string, parentId:string, level:number, source:string, action:string, state:boolean|null=null, outside:boolean=false):void {
    this.childEventCount++;
    const next = { count: this.eventCount, wrapper:wrapperId, parent:parentId, source: source, action: action, state:state, level:level, outsideEvent:outside, childEvent: true }
    if(JSON.stringify(this.prevEvent) !== JSON.stringify(next)){
      this.prevEvent = next
      this.__logMsg('warn', { function: '__updateChildWWrapper', msg: 'layoutEvent', info:next });
      this.wrapperChildEvent$.next(next)
    }
  }

  
  /************************************************************************
    gridNodeHierarchy
  */

  getCurrentWrapper(wrapperId:string): BnGridWrapper|null { return this.__findWrapperId(this.gridInfo.hierarchy, wrapperId) }

  gridNodeHierarchy(wrapperId:string, parentId:string): BnGridWrapper|null {
    let data = this.configSvc.defaultGridData(wrapperId, parentId);
    const hasParent = parentId !== undefined && parentId !== 'null' && parentId !== ''? true: false;
    const useId =  hasParent? parentId : wrapperId;
    const parent = this.__findWrapperId(this.gridInfo.hierarchy, useId);
    if(parent !== null  && hasParent){
      if(this.__findWrapperId(this.gridInfo.hierarchy, wrapperId) === null ) parent.children.push(data)
    } else if(parent === null) this.gridInfo.hierarchy.push(data);
    return this.getCurrentWrapper(wrapperId)
  }

  private __findWrapperId(data:BnGridWrapper[], wrapperId:string, current:any = null, level:number = 0): BnGridWrapper|null {
    if(data.length === 0 ) return null
    data.forEach((element:BnGridWrapper) => {
      if(element.wrapperId === wrapperId) {  element.level = level;
        current = element;
        current.level = level
      } 
      if(this.__hasChilds(element)){ 
        level++; 
        current = this.__findWrapperId(element.children, wrapperId, current, level) 
      }
    }); 
    return current;
  }

  private __hasChilds(gridWrapper: BnGridWrapper): boolean {
    if(gridWrapper.children) {
      if(gridWrapper.children.length > 0) return true;
      else return false
    } else return false  
  }


  /************************************************************************
     Grid Heights / FullScreen
  */
  setFullScreen(fullScreen:boolean ){
    this.gridInfo.fullscreen = fullScreen;
    this.wrapperEvent('all','all',0,'appwrapper','fullscreen',fullScreen);
  }

  setGrid(grid:boolean ){
    this.gridInfo.grid = grid;
    this.wrapperEvent('all','all',0,'appwrapper','grid',grid);
  }

  setCalcHeights(calcHeights:boolean ){
    this.gridInfo.calcHeights = calcHeights;
    this.wrapperEvent('all','all',0,'appwrapper','calcHeight',calcHeights);
  }

  /************************************************************************
     Check States
  */
  checkGrid(gridWrapper:BnGridWrapper):boolean{
    return (
      this.gridInfo.alwaysGrid && !gridWrapper.config.noInheritGrid) || 
      (!gridWrapper.config.noInheritGrid && this.gridInfo.grid) || 
      (gridWrapper.config.def.grid && gridWrapper.config.noInheritGrid)
  }

  checkCalcHeights(gridWrapper:BnGridWrapper):boolean{
    return (this.gridInfo.alwaysCalcHeights && !gridWrapper.config.noInheritCalcHeights) || (!gridWrapper.config.noInheritCalcHeights && this.gridInfo.calcHeights)  || (gridWrapper.config.def.calcHeights && gridWrapper.config.noInheritCalcHeights)  || (gridWrapper.config.active.calcHeights && !gridWrapper.config.noInheritCalcHeights)
  }

  isVisble(gridWrapper: BnGridWrapper, elTag:string):boolean{ 
    return  gridWrapper.has[elTag as keyof BnGridElements] && gridWrapper.visible.active[elTag as keyof BnGridElements]; }

  hasElement(gridWrapper: BnGridWrapper, elTag:string):boolean{ return  gridWrapper.has[elTag as keyof BnGridElements]; }

  isFullscreen(gridWrapper: BnGridWrapper):boolean{ return !gridWrapper.config.noFullScreen && this.gridInfo.fullscreen; }

  /************************************************************************
     Visible States
  */
  setVisibleByWrapper(gridWrapper: BnGridWrapper, elTag:string, visible:boolean, updateEvent:boolean = true, outside:boolean = true ):void{
    this.__setConfigVisible(gridWrapper,elTag, visible);
    if(updateEvent){
      this.wrapperEvent(gridWrapper.wrapperId,gridWrapper.parentId,gridWrapper.level, elTag, 'visible',visible, outside);
    }
  }

  setVisibleById(wrapperId:string, elTag:string, visible:boolean, updateEvent:boolean = true, outside:boolean = true ){
    let gridWrapper:BnGridWrapper|null = this.getCurrentWrapper(wrapperId);
    if(gridWrapper){
      this.__setConfigVisible(gridWrapper,elTag, visible);
      if(updateEvent){
        this.wrapperEvent(gridWrapper.wrapperId,gridWrapper.parentId,gridWrapper.level, elTag, 'visible',visible, outside);
      }
    }
  }

  onInitDefVisible(gridWrapper: BnGridWrapper,elTag:string, visible:boolean):void {
    this.__setConfigVisible(gridWrapper,elTag, visible);
    this.__setConfigDefVisible(gridWrapper,elTag, visible);
  } 

  private __setConfigVisible(gridWrapper: BnGridWrapper,elTag:string, visible:boolean):void {
    gridWrapper.visible.active[elTag as keyof BnGridElements] = visible;
  }

  private __setConfigDefVisible(gridWrapper: BnGridWrapper,elTag:string, visible:boolean):void {
    gridWrapper.visible.def[elTag as keyof BnGridElements] = visible;
  }


  /************************************************************************
     Grid
  */
  getGridSettings(gridWrapper: BnGridWrapper): BnGridCss{
    let ret:BnGridCss =  {
      deviceSize: this.layoutSvc.getInfo().device,
      gridColumns: this.__genGridColumns(gridWrapper),
      gridRows: this.__genGridRows(gridWrapper),
      gridAreas: this.__genGridAreas(gridWrapper)
    }
    //this.logger.info(this.logSource, { function:'BnLayoutGridService', msg: 'GridSettings updated', info: ret} );
    return ret
  }

  private __genGridRows(gridWrapper: BnGridWrapper):string{
    let gridRows = '';
    if(gridWrapper.config.offsetTop !== 0 && !this.layoutSvc.isPhone()){ gridRows = this.__createStr(gridRows, gridWrapper.config.offsetTop, true); }
    if(this.isVisble(gridWrapper,'preheader')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.preheader, true); }
    if(this.isVisble(gridWrapper,'header')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.header, true); }
    if(this.isVisble(gridWrapper,'precontent')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.precontent, true); }
    if(this.isVisble(gridWrapper,'content')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.content, false); }
    if(this.isVisble(gridWrapper,'footer')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.footer, true); }
    if(gridWrapper.config.offsetBottom !== 0 && !this.layoutSvc.isPhone()){ gridRows = this.__createStr(gridRows, gridWrapper.config.offsetBottom, true); }
    return gridRows;
  }


  private __genGridColumns(gridWrapper: BnGridWrapper):string{
    const parent = this.getFixedParentWidth(gridWrapper);
    const useWidth = this.useWidth(gridWrapper);
    const refWidth = (gridWrapper.parentId ==='' || this.gridInfo.fullscreen? this.layoutSvc.layoutInfo.window.width:parent);
    let gridColumns = ''; let addNum = 0; let add = '0px'; 
    if(this.gridInfo.fullscreen && !gridWrapper.config.noFullScreen  || this.layoutSvc.isPhone() || window.innerWidth < useWidth) {
      add = '0px';
    } else {
      if(refWidth > useWidth) {
        addNum = (refWidth - useWidth) 
        if(gridWrapper.config.centered) add = addNum / 2 + 'px';
        else if(useWidth > 0 ) add = addNum + 'px'
      }
    }
    if(gridWrapper.config.centered){ gridColumns =   add + ' auto 1fr auto ' + add; }
    else if(useWidth > 0 ) { gridColumns =  '0px auto 1fr auto ' + add; }
    else gridColumns =  'auto 1fr auto' 
    return gridColumns;
  }

  private __genGridAreas(gridWrapper: BnGridWrapper,):string{
    let gridAreas = '';
    let left = this.isVisble(gridWrapper,'sidebarleft');
    let right = this.isVisble(gridWrapper,'sidebarright');

    if(gridWrapper.config.animated){ left = true; right = true; }

    let useWidth = this.useWidth(gridWrapper);
    let add = gridWrapper.config.centered || !gridWrapper.config.centered && useWidth !== 0;
  
    //if(gridWrapper.config.animated){ left = true; }
    //if(gridWrapper.config.animated){ right = true; }
    if(gridWrapper.config.offsetTop !== 0 && !this.layoutSvc.isPhone()){
      let random = this.randomId();
      if(gridWrapper.elConfig.footer.fullWidth){
        gridAreas += this.__genGridAreaRow([random, random,random,random,random], false); 
      } else {
        gridAreas += this.__genGridAreaRow([random, random,random], add); 
      }
    }
    if(this.isVisble(gridWrapper,'preheader')){
      if(gridWrapper.elConfig.preheader.fullWidth ){ gridAreas += this.__genGridAreaRow(['preheader', 'preheader','preheader','preheader','preheader'], false); } 
      else { gridAreas += this.__genGridAreaRow(['preheader', 'preheader','preheader'], add); }
    } 

    if(this.isVisble(gridWrapper,'header')){
      if(gridWrapper.elConfig.header.fullWidth ){
        gridAreas += this.__genGridAreaRow(['header', 'header','header','header','header'], false); 
      } else {
        gridAreas += this.__genGridAreaSidebarRow('header', 
        gridWrapper.elConfig.sidebars.left.inHeader && left, 
        gridWrapper.elConfig.sidebars.right.inHeader && right, add) 
      }
    }

    if(this.isVisble(gridWrapper,'precontent')){ gridAreas += this.__genGridAreaSidebarRow('precontent', left, right, add) }
    if(this.isVisble(gridWrapper,'content')){ gridAreas += this.__genGridAreaSidebarRow('content', left, right, add) }

    if(this.isVisble(gridWrapper,'footer')){
      if(gridWrapper.elConfig.footer.fullWidth && add){
        gridAreas += this.__genGridAreaRow(['footer', 'footer','footer','footer','footer'], false); 
      } else {
        gridAreas += this.__genGridAreaSidebarRow('footer', 
        gridWrapper.elConfig.sidebars.left.inFooter && left, 
        gridWrapper.elConfig.sidebars.right.inFooter && right, add) 
      }
    }    

    if(gridWrapper.config.offsetBottom !== 0 && !this.layoutSvc.isPhone()){
      let random = this.randomId();
      if(gridWrapper.elConfig.footer.fullWidth){ gridAreas += this.__genGridAreaRow([random, random,random,random,random], false); }
      else { gridAreas += this.__genGridAreaRow([random, random,random], add); }
    }
    return gridAreas
  }

  private __createStr(str:string, height:number, toggle:boolean = false, add:string = '1fr' ):string {
    if(str !== '' ) str += ' ';
    if(height === 0 || !toggle ) str += add;
    else { str += height + 'px'; }
    return str
  }

  private __genGridAreaSidebarRow(elTag:string, conditionleft:boolean, conditionright:boolean, add:boolean = false):string{
    let str = '';
    str = this.__genGridAreaRow([conditionleft  ? 'sidebarleft':elTag, elTag, conditionright  ? 'sidebarright':elTag ],add);
    return str;
  }

  private __genGridAreaRow(gridAreas:string[], add:boolean = false):string{
    let useLength = gridAreas.length;
    let str:string = '"';
    if(add) str+=this.randomId()+' ';
    for(let i=0; i < useLength; i++){ str+= gridAreas[i] + (gridAreas.length > 1 && i< gridAreas.length-1? ' ':''); }
    if(add) str+= ' ' + this.randomId();
    str += '"\n';
    return str;
  }

  /************************************************************************
     Config and Settings
  */
  getParentWrapperMaxWidth(wrapperId:string, width:number=0):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current){
      width = current.config.maxWidth
      if(width === 0 && current.parentId !== null && current.parentId !== ''){ width = this.getParentWrapperMaxWidth(current.parentId, width); }
    }
    return width
  }

  getParentWrapperWidth(wrapperId:string, width:string = '100%'):string {
    let current = this.__findWrapperId(this.gridInfo.hierarchy,wrapperId);
    if(current){
      width = current.config.width
      if(width === '100%' && current.parentId !== null && current.parentId !== ''){ width = this.getParentWrapperWidth(current.parentId, width); }
    }
    return width
  }

  useWidth(gridWrapper: BnGridWrapper){
    let useWidth = 0;
    if(gridWrapper.config.maxWidth === 0) useWidth = this.getParentWrapperMaxWidth(gridWrapper.wrapperId);
    else useWidth = gridWrapper.config.maxWidth;
    return useWidth;
  }

  getFixedParentWidth(gridWrapper: BnGridWrapper):number{
    let vals = this.getParentWrapperSettings(gridWrapper.parentId);
    if(vals){ return this.getStaticWidth( vals.width, vals.maxWidth,0, this.layoutSvc.layoutInfo.window.width );} 
    return 0
  }

  getFixedStaticWidth(gridWrapper: BnGridWrapper):number{
    let vals = this.getWrapperSettings(gridWrapper.wrapperId);
    if(vals){ return this.getStaticWidth( vals.width, vals.maxWidth,0, this.layoutSvc.layoutInfo.window.width);} 
    return 0
  }

  getWrapperSettings(wrapperId:string, config:BnGridWrapperConfig|null=null):BnGridWrapperConfig|null{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current){ config = current.config }
    return config
  }
  
  getParentWrapperSettings(wrapperId:string, config:BnGridWrapperConfig|null=null):BnGridWrapperConfig|null{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current){
      config = current.config
      if(config.maxWidth === 0 && current.parentId !== null && current.parentId !== ''){ config = this.getParentWrapperSettings(current.parentId, config); }
    }
    return config
  }

  getSidebarsWidths(wrapperId:string, total:number = 0, self:boolean = true, pos:string = 'left'):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if((!self || current.elConfig.sidebars[pos as keyof BnGridSidebars].inHeader) && this.isVisble(current,'sidebar'+pos)) { total += this.getSidebarStaticWidth(current,pos) }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getSidebarsWidths(current.parentId,total, false, pos)
      }
    }
    return total
  }

  getElementOffset(wrapperId:string, total:number = 0, self:boolean = true):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if(!self && this.isVisble(current,'header')) { total += current.heights.header }
      if(this.isVisble(current,'preheader')){ total += current.heights.preheader }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getElementOffset(current.parentId,total, false)
      }
    }
    return total
  }


  getHeaderOffset(wrapperId:string, total:number = 0, self:boolean = true):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if(self && this.isVisble(current,'header')) { total += current.heights.header }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getHeaderOffset(current.parentId,total, false)
      }
    }
    return total
  }

  toggleIconSidebar(gridWrapper: BnGridWrapper, pos:string,width:number,toggle:boolean){
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].iconSidebarToggle =toggle ;
    gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].width = toggle ? width:this.configSvc.iconSidebarWidth;
    this.wrapperChildEvent(gridWrapper.wrapperId,gridWrapper.parentId,gridWrapper.level, 'toggleIconSidebar',pos, toggle );
  }


  getSidebarStaticWidth(gridWrapper: BnGridWrapper,pos:string){
    let width = gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].width;
    return width
  }

  getPreHeaderOffset(wrapperId:string, total:number = 0):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if(this.isVisble(current,'preheader')){ total += current.heights.preheader; }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getPreHeaderOffset(current.parentId, total)
      }
    }
    return total
  }

  getWrapperCurVals(current:BnGridWrapper,curVals:BnWrapperCurVals):BnWrapperCurVals {
    let prevLeft =  0;
    let prevRight = 0;
    
    if(curVals ){
     
      prevLeft = curVals.sidebarWidths 
      prevRight = curVals.sidebarWidthsRight
    }

    const useWidth = this.useWidth(current);
    const space = ( this.layoutSvc.layoutInfo.window.width - useWidth) / 2;
    const useCenterSpace = current.config.centered && useWidth > 0;
    curVals = {
      useWidth: useWidth,
      useCenterSpace:useCenterSpace,
      hasParent: current.parentId !== '',
      sidebarWidthsPrev: prevLeft,
      sidebarWidthsRightPrev: prevRight,
      sidebarWidths: this.getSidebarsWidths(current.wrapperId),
      sidebarWidthsRight: this.getSidebarsWidths(current.wrapperId, 0, false, 'right'),
      centerSpaceWidth: space > 0 ? space:0 ,
      fullSize: window.innerWidth,
      fullScreen: this.isFullscreen(current) || 
        ( current.config.centered && this.layoutSvc.layoutInfo.window.width < current.config.maxWidth ),
      calcHeights:this.checkCalcHeights(current)
    }
    return curVals
  }

  

  randomId():string{
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); 
    const randomChars = Math.random().toString(36).substr(2, 3).toUpperCase();
    let id = randomLetter + randomChars
    if(this.randomIds.findIndex((obj:string) => id === obj) === -1){
      this.randomIds.push(id)
      return id
    } else return this.randomId()
    
  }

  /************************************************************************
     Calc Heights
  */
  calcHeights(gridWrapper: BnGridWrapper){
    this.__calcPreheaderHeight(gridWrapper);
    this.__calcPreContentHeight(gridWrapper);
    let totalC = this.layoutSvc.layoutInfo.window.height - this.__calcContentTotal(gridWrapper.wrapperId);
    gridWrapper.heights.content = totalC -  (this.isVisble(gridWrapper,'precontent')?gridWrapper.heights.precontent : 0) ;
    if(!this.layoutSvc.isPhone()){
      gridWrapper.heights.content -= gridWrapper.config.offsetBottom;
      gridWrapper.heights.content -= gridWrapper.config.offsetTop;
    }
    gridWrapper.heights.sidebarleft = totalC + this.__calcSidbarHeight(gridWrapper, 'left');
    gridWrapper.heights.sidebarright = totalC + this.__calcSidbarHeight(gridWrapper, 'right');
    this.__calcWrapperHeight(gridWrapper);
    //this.logger.log(this.logSource, { function:'BnLayoutGridService', msg: 'calc Heights', info: gridWrapper.heights } );
  }

  private __calcContentTotal(wrapperId:string, total:number = 0):number {
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if(this.isVisble(current,'header')){ total += current.heights.header; }
      if(this.isVisble(current,'footer')){ total += current.heights.footer; }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.__calcContentTotal(current.parentId, total)
      }
    }
    
    return total
  }

  private __calcSidbarHeight(gridWrapper:BnGridWrapper, pos:string):number{
    let total = 0;
    if(this.isVisble(gridWrapper,'header') && gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].inHeader){  total = gridWrapper.heights.header; }
    if(this.isVisble(gridWrapper,'footer')&& gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].inFooter){  total = gridWrapper.heights.footer; }
    return total;
  }

  private __calcPreContentHeight(gridWrapper:BnGridWrapper){
    let total = 0
    if(this.isVisble(gridWrapper,'precontent')){  total = gridWrapper.heights.precontent; }
    return total
  }

  private __calcPreheaderHeight(gridWrapper:BnGridWrapper){
    let total = 0;
    if( gridWrapper.elConfig.preheader.fullHeight){
      if(this.isVisble(gridWrapper,'header')){ 
       total = this.layoutSvc.layoutInfo.window.height - gridWrapper.heights.header
      } else total = this.layoutSvc.layoutInfo.window.height
      gridWrapper.heights.preheader = total;
    }
    return gridWrapper.heights.preheader;
  }

  private __calcWrapperHeight(current:BnGridWrapper){
    let total = 0;
    if(current != null){
      if(this.isVisble(current,'preheader')){ total += current.heights.preheader; }
      if(this.isVisble(current,'header')){ total += current.heights.header; }
      if(this.isVisble(current,'precontent')){ total += current.heights.precontent; }
      if(this.isVisble(current,'content')){ total += current.heights.content; }
      if(this.isVisble(current,'footer')){ total += current.heights.footer; }
    }
    current.heights.wrapper = total;
    if(!this.layoutSvc.isPhone()){
      current.heights.wrapper += current.config.offsetBottom;
      current.heights.wrapper += current.config.offsetTop;
    }
  }

  witdhInNumber(width:string, windowWidth:number):number{
    let widthNum:number = 0
    if(width.match(/vw|\%/)) { widthNum = ( windowWidth / 100) * coerceNumberProperty(width.replace(/vw|\%/,'')); }
    if(width.match(/px/)) { widthNum = ( windowWidth / 100) * coerceNumberProperty(width.replace(/px/,'')); }
    return widthNum
  }

  getStaticWidth(width:string, maxWidth:number, minWidth:number, windowWidth:number):number{
    let cWidth = this.witdhInNumber(width, windowWidth);
    if(cWidth > maxWidth && maxWidth !== 0) return maxWidth;
    if(cWidth < minWidth && minWidth !== 0) return minWidth;
    else return cWidth;
  }

  animateActiveMeta(animateConfig:BnGridAnimateObject): AnimationMetadata[] {
    return [
      style({ 
        left: animateConfig.left.from, 
        width:animateConfig.width.from, 
        padding: animateConfig.padding.from }),
      animate(animateConfig.time + ' ease-in', style({ 
        left: animateConfig.left.to,
        width: animateConfig.width.to, 
        padding: animateConfig.padding.to }))
    ];
  }
  
  animateInactiveMeta(animateConfig:BnGridAnimateObject): AnimationMetadata[] {
    return [
      style({ 
        left: animateConfig.left.from, 
        width:animateConfig.width.from, 
        padding: animateConfig.padding.from }),
      animate(animateConfig.time + ' ease-out', style({ 
        left: animateConfig.left.to, 
        width: animateConfig.width.to, 
        padding: animateConfig.padding.to  
      })),
    ];
  }

  getDefaultAnimationConfig():BnGridAnimateObject{
    return  {...{ left: { from: '*', to: '*'}, padding: { from: '*', to: '*'}, width: { from: '*', to: '*'}, time: '400ms' }}
  }

  getHeaderAnimationConfig(animateConfig:BnGridAnimateObject, current:BnGridWrapper,fullWidth:boolean, curVals:BnWrapperCurVals,curStates:BnGridCurStates):void{
    this.__getAnimationConfig(animateConfig,current,fullWidth, 'header', curVals, curStates);
  }

  getPreHeaderAnimationConfig( animateConfig:BnGridAnimateObject, current:BnGridWrapper,fullWidth:boolean, curVals:BnWrapperCurVals,curStates:BnGridCurStates):void{
    this.__getAnimationConfig(animateConfig,current,fullWidth, 'preheader', curVals, curStates);
  }

  geFooterAnimationConfig(animateConfig:BnGridAnimateObject, current:BnGridWrapper,fullWidth:boolean, curVals:BnWrapperCurVals,curStates:BnGridCurStates):void{
    this.__getAnimationConfig(animateConfig,current,fullWidth, 'footer', curVals, curStates);
  }

  private __getAnimationConfig(animateConfig:BnGridAnimateObject, current:BnGridWrapper,fullWidth:boolean,  elTag:'header'|'preheader'|'footer', curVals:BnWrapperCurVals,curStates:BnGridCurStates):void{
    const fromWidth =  (curStates.fullScreenState? curVals.fullSize: curVals.useWidth);
    if(curVals.fullScreen){ animateConfig.width.to = '100%'; animateConfig.left.to =  '0px'; }

    if(curStates.isFixed) {
      if(!fullWidth){
        animateConfig.left.from = !curVals.useCenterSpace || curVals.fullScreen? '0px' : `${curVals.centerSpaceWidth}px`;
        animateConfig.left.to = !curVals.useCenterSpace || curVals.fullScreen? '0px' : `${curVals.centerSpaceWidth}px`;
      }
      if(!curVals.fullScreen){
        animateConfig.width.from = !curVals.useCenterSpace && curVals.useWidth === 0  || fullWidth  ? '100%' : fromWidth+'px' ;
        animateConfig.width.to = !curVals.useCenterSpace && curVals.useWidth === 0 || fullWidth ? '100%' : fromWidth +'px' ;
        
      }
    
    } else {
        animateConfig.width.to = '100%';
        if(!fullWidth){ animateConfig.left.to =  '0px'; animateConfig.left.from =  '0px'; }
    }

    if(fullWidth){
      if(!current.config.centered && curVals.useWidth > 0 && (!curStates.fullScreenState ||  current.elConfig[elTag].fullWidthContent === 'none')){
        animateConfig.padding.to =  `0px ${curVals.centerSpaceWidth *2}px 0px 0px`;
      } 
      else if(current.elConfig[elTag].fullWidthContent === 'fullscreen' && curStates.fullScreenState){
        animateConfig.padding.to = '0px 0px';
      } 
      else { 
        animateConfig.padding.to =  curVals.useCenterSpace ? '0px '+ curVals.centerSpaceWidth +'px': '0px 0px' ; 
      }

    } else {
      if(!current.config.centered && curVals.useWidth > 0){
        animateConfig.padding.to =  `0px ${curVals.centerSpaceWidth *2}px 0px 0px`
      } else {
        animateConfig.padding.to =  (current.config.centered && current.elConfig[elTag].fullWidth ? '0px '+  curVals.centerSpaceWidth +'px': '0px 0px' );
      }
    }

    if(curStates.fullScreenEvent){
      if(curStates.isFixed && !fullWidth)
        animateConfig.width.from = (curStates.fullScreenState ? curVals.useWidth:curVals.fullSize) +'px';
     
    }

    if(curStates.fixedChanged){
      animateConfig.left.from = animateConfig.left.to;
      animateConfig.width.from = animateConfig.width.to;
      animateConfig.padding.from = animateConfig.padding.to;
    }

    if(current.elConfig[elTag].fullWidthContent === 'always'){ animateConfig.padding.to = '0px'; }
   
  }



   getChildHeaderAnimationConfig(animateConfig:BnGridAnimateObject,current:BnGridWrapper, fullWidth:boolean, curVals:BnWrapperCurVals, curStates:BnGridCurStates):void{
    const space = curStates.fullScreenState ? 0: curVals.centerSpaceWidth;
    animateConfig.time = '400ms';
    const fromWidth =  (curStates.fullScreenState? curVals.fullSize: curVals.useWidth);

    if(fullWidth){
      animateConfig.width.to = '100vw'; 
      animateConfig.width.from = '100vw';
      if(!curStates.isFixed) {
        animateConfig.left.to = '-' + space + 'px'; 
        //animateConfig.left.from = animateConfig.left.to;
      }
      else { 
        animateConfig.left.to = '0px';
        if(curStates.fixedChanged){
          animateConfig.left.from = animateConfig.left.to;
        }
      }
    } else {
      if(curStates.fullScreenState){
       
        animateConfig.width.to = (curVals.fullSize - curVals.sidebarWidthsRight) +'px' ;
      } else {
        if(curStates.fixedChanged){
          animateConfig.width.from = !curVals.useCenterSpace && curVals.useWidth === 0 ? '100%' : (fromWidth- curVals.sidebarWidthsRightPrev)+'px' ;
        }
        animateConfig.width.to = !curVals.useCenterSpace && curVals.useWidth === 0 ? '100%' : (fromWidth - curVals.sidebarWidthsRight) +'px' ;
      }
      
      if(!curStates.isFixed ){
        animateConfig.width.to = '100%'; 
        animateConfig.width.from = '100%';
      }

    }
   
    if(curStates.visibleChanged){
      if(fullWidth){
        if(!curStates.isFixed){
          if(curStates.sideBarVisibleLeftState){ animateConfig.left.from =  '-' + space + 'px'; } 
         
          animateConfig.left.to = '-' + (space + curVals.sidebarWidths)+ 'px';
        }
      } else {
        if(curStates.sideBarVisibleRightState && curStates.isFixed){
          animateConfig.width.from = !curVals.useCenterSpace && curVals.useWidth === 0  || fullWidth ? '100%' : fromWidth +'px' ;
          
        }
        
      }
    }
    else if(curStates.fixedChanged){
      if(!curStates.isFixed){
        animateConfig.left.from = '-' + (space + curVals.sidebarWidths)+ 'px';
        animateConfig.left.to = '-' + (space + curVals.sidebarWidths)+ 'px';
      }
    }
    else if( curStates.iconsSidebarEvent || curStates.fullScreenEvent){
      if(!curStates.isFixed ){
        
        animateConfig.left.to = '-' + (space+ curVals.sidebarWidths)+ 'px';
      } 
    } 
    
    if(fullWidth){
      animateConfig.padding.to = '0px '+ (space+ curVals.sidebarWidthsRight) +'px 0px '+ (space+ curVals.sidebarWidths) +'px';
      if(current.elConfig.header.fullWidthContent === 'always' ){
        animateConfig.padding.to = '0px';
      }
    } else {
      animateConfig.padding.to = '0px 0px 0px '+ (curVals.sidebarWidths) +'px';
      if(current.elConfig.header.fullWidthContent === 'always' || !curStates.isFixed){
        animateConfig.padding.to = '0px';
      }
    }

    if(!curStates.isFixed && !fullWidth){
      animateConfig.left.to = '0px';
      animateConfig.left.from = animateConfig.left.to;
    }

    if(!fullWidth && curStates.isFixed){
      animateConfig.left.to =  space + 'px'; 
     
    }
    if(curStates.fixedChanged){
      animateConfig.left.from = animateConfig.left.to;
      animateConfig.padding.from = animateConfig.padding.to;
    }
   
    //console.log(animateConfig.left.from,'->',animateConfig.left.to)
    if(!animateConfig.padding.from || animateConfig.padding.from === '*') animateConfig.padding.from = animateConfig.padding.to
  
  }

  getSidebarAnimateConfig(visible:boolean,width:number,current:BnGridWrapper,position:'left'|'right',curVals:BnWrapperCurVals,curStates:any){
  let animateConfig = this.getDefaultAnimationConfig(); 
   animateConfig.time = '400ms'
   if(!curStates.resizeEvent){ 
   if(!curStates.fixedChanged){
   
        if(curStates.visibleChanged){ animateConfig.left.from =  animateConfig.left.to; }
        if(visible){
          animateConfig.width.from = !curStates.visibleChanged? current.elConfig.sidebars[position as keyof BnGridSidebars].width + 'px':  '0px'; 
          animateConfig.width.to = current.elConfig.sidebars[position as keyof BnGridSidebars].width + 'px';
        } else {
          animateConfig.width.from = (curStates.visibleChanged ? current.elConfig.sidebars[position as keyof BnGridSidebars].width : 0) + 'px'; 
          animateConfig.width.to =  '0px';
        }
        if( curStates.iconsSidebarEvent && visible){
          animateConfig.left.from =  animateConfig.left.to 
          animateConfig.width.from = !curStates.iconsSidebarState? width: this.configSvc.iconSidebarWidth+ 'px';
          animateConfig.width.to =   current.elConfig.sidebars[position as keyof BnGridSidebars].width+ 'px';
        } 
        else if (curStates.fullScreenEvent){
          animateConfig.width.from = animateConfig.width.to
          animateConfig.left.from = !curVals.fullScreen ||!curStates.isFixed ? '0px' : curVals.centerSpaceWidth + 'px';
          animateConfig.left.to =  curVals.fullScreen || !curStates.isFixed ? '0px' : curVals.centerSpaceWidth + 'px';
          //animateConfig.time = '300ms'
        }
      } 
      else {
        animateConfig.width.from = animateConfig.width.to
        if(curStates.isFixed){
          animateConfig.left.from = curVals.fullScreen ? '0px' : curVals.centerSpaceWidth + 'px';
          animateConfig.left.to =  curVals.fullScreen ? '0px' : curVals.centerSpaceWidth + 'px';
        } else {
          animateConfig.left.from =  '0px';
          animateConfig.left.to =   '0px';
        }
      }
     
    } else{
      if(!curVals.fullScreen && curStates.isFixed){
        animateConfig.left.from = curVals.fullScreen ? '0px' : curVals.centerSpaceWidth + 'px';
        animateConfig.left.to =  curVals.fullScreen ? '0px' : curVals.centerSpaceWidth + 'px';
      }
    }

    
    return animateConfig
  }
 
}
