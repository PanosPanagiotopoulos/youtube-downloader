import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationServicesComponent } from './navigation-services/navigation-services.component';
import { InputViewComponent } from './input-view/input-view.component';
import { GeneralFooterComponent } from "./general-footer/general-footer.component";

@Component({
  selector: 'yt-downloader-root',
  standalone: true,
  imports: [RouterOutlet, NavigationServicesComponent, InputViewComponent, GeneralFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Youtube Downloader';
  currentService: string = 'Download Video';

  setCurrentService(currentService: string) {
    this.currentService = currentService;
  }
}
