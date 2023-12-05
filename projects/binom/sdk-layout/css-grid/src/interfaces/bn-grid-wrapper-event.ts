export interface BnGridWrapperEvent {
    count:number;
    wrapper:string;
    parent:string;
    level:number;
    source:string;
    action:string;
    state:boolean|null;
    outsideEvent:boolean;
    childEvent:boolean;
}
