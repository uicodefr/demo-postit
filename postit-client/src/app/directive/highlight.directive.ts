import { Directive, ElementRef, Renderer2, inject, input } from '@angular/core';

/*
 * This directive is an example, this action can be done with just CSS instead
 */
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public readonly appHighlight = input<string>('0 8px 8px rgba(10,16,20,.24),0 0 8px rgba(10,16,20,.12)');

  public constructor() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'box-shadow .5s');
  }

  public onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', this.appHighlight());
  }

  public onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }
}
