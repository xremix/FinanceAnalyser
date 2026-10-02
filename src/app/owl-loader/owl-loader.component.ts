import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-owl-loader',
  standalone: true,
  templateUrl: './owl-loader.component.html',
  styleUrls: ['./owl-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwlLoaderComponent {
  /** Pixel size; pass null to size the owl via CSS on the host element. */
  @Input() size: number | null = 72;

  /** When false, only the intro plays and the idle ear flicks are skipped. */
  @Input() loop = true;

  @HostBinding('class.no-loop') get noLoop(): boolean {
    return !this.loop;
  }
}
