
export interface BnLayoutWindow {
    width:number;
    height:number;
    breakpoint: 'small-x' | 'small' | 'medium' | 'large' | 'large-x'
    orientation: 'landscape' | 'portrait'
}

export interface BnLayoutInfo {
    device: 'phone' | 'tablet' | 'desktop';
    isMobile: boolean;
    window: BnLayoutWindow
}
