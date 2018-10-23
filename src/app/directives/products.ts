import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[productsDirective]'
})
export class ProductsDirective implements AfterViewInit {
    @Input() productsList: any[];
    @Input() tsize: string;
    constructor(private elRef: ElementRef) {
    }
    ngAfterViewInit(): void {
        this.elRef.nativeElement = this.productsList;
        console.log(this.elRef.nativeElement);
    }
} 