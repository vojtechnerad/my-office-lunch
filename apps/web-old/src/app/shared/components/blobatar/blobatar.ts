import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gaze, type Gaze } from 'blobatar/gaze';
import { _parts, serializeVars } from 'blobatar/internal';

type AnimationMode = false | 'hover' | 'always';

@Component({
  selector: 'mol-blobatar',
  imports: [],
  templateUrl: './blobatar.html',
  styleUrl: './blobatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blobatar implements OnInit, AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  identifier = input.required<string>();
  backgroundShape = input<
    boolean | 'square' | 'circle' | 'squircle' | undefined
  >('circle');
  size = input(64);

  animate = input<AnimationMode>(false);

  followPointer = input(false, {
    transform: booleanAttribute,
  });

  @ViewChild('host', { static: true })
  private host!: ElementRef<HTMLDivElement>;

  private gazeDriver?: Gaze;

  svgContent!: SafeHtml;

  ngOnInit(): void {
    const animation =
      this.animate() || (this.followPointer() ? 'always' : false);

    const parts = _parts(this.identifier(), {
      background: this.backgroundShape(),
      ...(animation ? { animate: animation } : {}),
    });

    const variables = parts.vars ? serializeVars(parts.vars) : '';

    const background = parts.bg
      ? `<path d="${parts.bg.d}" fill="${parts.bg.fill}"></path>`
      : '';

    const content = parts.cls
      ? `<g class="${parts.cls}" style="${variables}">${parts.inner}</g>`
      : parts.inner;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 100 100"
           width="${this.size()}"
           height="${this.size()}">
        ${background}
        ${content}
      </svg>
    `;

    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  ngAfterViewInit(): void {
    if (!this.followPointer()) {
      return;
    }

    const svg = this.host.nativeElement.querySelector<SVGSVGElement>('svg');

    if (svg) {
      this.gazeDriver = gaze(svg, {
        target: 'pointer',
      });
    }
  }

  ngOnDestroy(): void {
    this.gazeDriver?.stop();
  }
}
