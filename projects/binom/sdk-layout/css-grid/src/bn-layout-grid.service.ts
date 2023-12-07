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

@Injectable({
  providedIn: 'root'
})
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
  public wrapperEvent$:BehaviorSubject<BnGridWrapperEvent> = new BehaviorSubject({} as any);
  public wrapperChildEvent$:BehaviorSubject<BnGridWrapperEvent> = new BehaviorSubject({} as any);
  public gridInfo: BnGridInfo = { fullscreen: false, grid: true, calcHeights: false, alwaysGrid: false, alwaysCalcHeights: false, hierarchy: [] };

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

  public getCurrentWrapper(wrapperId:string): BnGridWrapper|null { return this.__findWrapperId(this.gridInfo.hierarchy, wrapperId) }

  public gridNodeHierarchy(wrapperId:string, parentId:string): BnGridWrapper|null {
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
  public setFullScreen(fullScreen:boolean ){
    this.gridInfo.fullscreen = fullScreen;
    this.wrapperEvent('all','all',0,'appwrapper','fullscreen',fullScreen);
  }

  public setGrid(grid:boolean ){
    this.gridInfo.grid = grid;
    this.wrapperEvent('all','all',0,'appwrapper','grid',grid);
  }

  public setCalcHeights(calcHeights:boolean ){
    this.gridInfo.calcHeights = calcHeights;
    this.wrapperEvent('all','all',0,'appwrapper','calcHeight',calcHeights);
  }

  /************************************************************************
     Check States
  */
  public checkGrid(gridWrapper:BnGridWrapper):boolean{
    return (
      this.gridInfo.alwaysGrid && !gridWrapper.config.noInheritGrid) || 
      (!gridWrapper.config.noInheritGrid && this.gridInfo.grid) || 
      (gridWrapper.config.def.grid && gridWrapper.config.noInheritGrid)
  }

  public checkCalcHeights(gridWrapper:BnGridWrapper):boolean{
    return (this.gridInfo.alwaysCalcHeights && !gridWrapper.config.noInheritCalcHeights) || (!gridWrapper.config.noInheritCalcHeights && this.gridInfo.calcHeights)  || (gridWrapper.config.def.calcHeights && gridWrapper.config.noInheritCalcHeights)  || (gridWrapper.config.active.calcHeights && !gridWrapper.config.noInheritCalcHeights)
  }

  public isVisble(gridWrapper: BnGridWrapper, elTag:string):boolean{
    return  gridWrapper.has[elTag as keyof BnGridElements] && gridWrapper.visible.active[elTag as keyof BnGridElements];
  }

  public hasElement(gridWrapper: BnGridWrapper, elTag:string):boolean{
    return  gridWrapper.has[elTag as keyof BnGridElements];
  }

  public isFullscreen(gridWrapper: BnGridWrapper):boolean{
    return !gridWrapper.config.noFullScreen && this.gridInfo.fullscreen;
  }

  /************************************************************************
     Visible States
  */
  public setVisibleByWrapper(gridWrapper: BnGridWrapper, elTag:string, visible:boolean, updateEvent:boolean = true, outside:boolean = true ):void{
    this.__setConfigVisible(gridWrapper,elTag, visible);
    if(updateEvent){
      this.wrapperEvent(gridWrapper.wrapperId,gridWrapper.parentId,gridWrapper.level, elTag, 'visible',visible, outside);
    }
  }

  public setVisibleById(wrapperId:string, elTag:string, visible:boolean, updateEvent:boolean = true, outside:boolean = true ){
    let gridWrapper:BnGridWrapper|null = this.getCurrentWrapper(wrapperId);
    if(gridWrapper){
      this.__setConfigVisible(gridWrapper,elTag, visible);
      if(updateEvent){
        this.wrapperEvent(gridWrapper.wrapperId,gridWrapper.parentId,gridWrapper.level, elTag, 'visible',visible, outside);
      }
    }
  }

  public onInitDefVisible(gridWrapper: BnGridWrapper,elTag:string, visible:boolean):void {
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
  public getGridSettings(gridWrapper: BnGridWrapper): BnGridCss{
    let ret:BnGridCss =  {
      deviceSize: this.layoutSvc.getInfo().device,
      gridColumns: this.__genGridColumns(gridWrapper),
      gridRows: this.__genGridRows(gridWrapper),
      gridAreas: this.__genGridAreas(gridWrapper)
    }
    console.log(ret)
    //this.logger.info(this.logSource, { function:'BnLayoutGridService', msg: 'GridSettings updated', info: ret} );
    return ret
  }

  private __genGridRows(gridWrapper: BnGridWrapper):string{
    let gridRows = '';
    if(gridWrapper.config.offsetTop !== 0 && !this.layoutSvc.isPhone()){ gridRows = this.__createStr(gridRows, gridWrapper.config.offsetTop, true); }
    if(this.isVisble(gridWrapper,'preheader')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.preheader, true); }
   // else { gridRows += ' 0px ' }
    if(this.isVisble(gridWrapper,'header')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.header, true); }
    if(this.isVisble(gridWrapper,'precontent')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.precontent, true); }
    if(this.isVisble(gridWrapper,'content')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.content, false); }
    if(this.isVisble(gridWrapper,'footer')){ gridRows = this.__createStr(gridRows, gridWrapper.heights.footer, true); }
    if(gridWrapper.config.offsetBottom !== 0 && !this.layoutSvc.isPhone()){ gridRows = this.__createStr(gridRows, gridWrapper.config.offsetBottom, true); }
    return gridRows;
  }


  private __genGridColumns(gridWrapper: BnGridWrapper):string{
    let gridColumns = ''; let addNum = 0; let add = '0px'; 
    let useWidth = this.useWidth(gridWrapper);
    if(this.gridInfo.fullscreen && ! gridWrapper.config.noFullScreen  || this.layoutSvc.isPhone() || window.innerWidth < useWidth) {
      add = '0px';
    } else {
      if(this.layoutSvc.layoutInfo.window.width > useWidth) {
        addNum = (this.layoutSvc.layoutInfo.window.width - useWidth) 
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
    } else {
      gridAreas += this.__genGridAreaRow(['preheader', 'preheader','preheader'], add);
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
      if(gridWrapper.elConfig.footer.fullWidth){
        gridAreas += this.__genGridAreaRow([random, random,random,random,random], false); 
      } else {
        gridAreas += this.__genGridAreaRow([random, random,random], add); 
      }
    }
    return gridAreas
  }

  private __createStr(str:string, height:number, toggle:boolean = false, add:string = 'auto' ):string {
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
      if(width === 0 && current.parentId !== null && current.parentId !== ''){
        width = this.getParentWrapperMaxWidth(current.parentId, width);
      }
    }
    return width
  }

  getParentWrapperWidth(wrapperId:string, width:string = '100%'):string {
    let current = this.__findWrapperId(this.gridInfo.hierarchy,wrapperId);
    if(current){
      width = current.config.width
      if(width === '100%' && current.parentId !== null && current.parentId !== ''){
        width = this.getParentWrapperWidth(current.parentId, width);
      }
    }
    return width
  }

  useWidth(gridWrapper: BnGridWrapper){
    let useWidth = 0;
    if(gridWrapper.config.maxWidth === 0) useWidth = this.getParentWrapperMaxWidth(gridWrapper.wrapperId);
    if(gridWrapper.config.maxWidth === 0) useWidth = this.witdhInNumber(gridWrapper.config.width,this.layoutSvc.layoutInfo.window.width);
    else useWidth = gridWrapper.config.maxWidth;
    return useWidth;
  }

  getFixedParentWidth(gridWrapper: BnGridWrapper):number{
    let vals = this.getParentWrapperSettings(gridWrapper.wrapperId);
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

  public getSidebarsWidths(wrapperId:string, total:number = 0, self:boolean = true):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if((!self || current.elConfig.sidebars.left.inHeader) && this.isVisble(current,'sidebarleft')) { total += this.getSidebarStaticWidth(current,'left') }
      if((!self || current.elConfig.sidebars.right.inHeader) && this.isVisble(current,'sidebarright')){ total += this.getSidebarStaticWidth(current,'right') }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getSidebarsWidths(current.parentId,total, false)
      }
    }
    return total
  }

  public getElementOffset(wrapperId:string, total:number = 0, self:boolean = true):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if((!self) && this.isVisble(current,'header')) { total += current.heights.header }
      if(this.isVisble(current,'preheader')){ total += current.heights.preheader }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getElementOffset(current.parentId,total, false)
      }
    }
    return total
  }

  public getSidebarStaticWidth(gridWrapper: BnGridWrapper,pos:string){
    let width = gridWrapper.elConfig.sidebars[pos as keyof BnGridSidebars].width;
    return width
  }

  public getPreHeaderOffset(wrapperId:string, total:number = 0):number{
    let current = this.__findWrapperId(this.gridInfo.hierarchy, wrapperId);
    if(current != null){
      if(this.isVisble(current,'preheader')){ total += current.heights.preheader; }
      if(current.parentId !== undefined && current.parentId !== '' && current.parentId !== 'null'){
        total = this.getPreHeaderOffset(current.parentId, total)
      }
    }
    return total
  }

  getWrapperCurVals(current:BnGridWrapper):BnWrapperCurVals {

    const selfRef = this.getFixedStaticWidth(current);
    const parent = this.getFixedParentWidth(current)
    const useForSelf =  (selfRef > parent? parent:selfRef);
    const useWidth = this.useWidth(current);
    const useCenterSpace = current.config.centered && useWidth > 0;
    
    return {
      parentWidth: parent,
      staticWidth: useForSelf,
      useWidth: useWidth,
      useCenterSpace:useCenterSpace,
      hasParent: current.parentId !== '',
      sidebarWidths: this.getSidebarsWidths(current.wrapperId),
      centerSpaceWidth: (this.layoutSvc.layoutInfo.window.width - useForSelf) / 2 ,
      fullSize: window.innerWidth,
      fullScreen: this.isFullscreen(current) || (current.config.centered && this.layoutSvc.layoutInfo.window.width < current.config.maxWidth) ,
      calcHeights:this.checkCalcHeights(current)
    }

  }


  randomId(){
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); 
    const randomChars = Math.random().toString(36).substr(2, 3).toUpperCase();
    return randomLetter + randomChars;
  }

  /************************************************************************
     Calc Heights
  */
  public calcHeights(gridWrapper: BnGridWrapper){
   
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
    //console.log( gridWrapper.heights.preheader)
    
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

  public witdhInNumber(width:string, windowWidth:number):number{
    let widthNum:number = 0
    if(width.match(/vw|\%/)) { widthNum = ( windowWidth / 100) * coerceNumberProperty(width.replace(/vw|\%/,'')); }
    if(width.match(/px/)) { widthNum = ( windowWidth / 100) * coerceNumberProperty(width.replace(/px/,'')); }
    return widthNum
  }

  public getStaticWidth(width:string, maxWidth:number, minWidth:number, windowWidth:number):number{
    let cWidth = this.witdhInNumber(width, windowWidth);
    if(cWidth > maxWidth && maxWidth !== 0) return maxWidth;
    if(cWidth < minWidth && minWidth !== 0) return minWidth;
    else return cWidth;
  }

  
  /************************************************************************
     Animation Meta
  */
  public animateActiveMeta(animateConfig:BnGridAnimateObject): AnimationMetadata[] {
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
  
  public animateInactiveMeta(animateConfig:BnGridAnimateObject): AnimationMetadata[] {
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
    return  {
      left: { from: '*', to: '*'},
      padding: { from: '*', to: '*'},
      width: { from: '*', to: '*'},
      time: '400ms'
    };
  }

  
  

}
