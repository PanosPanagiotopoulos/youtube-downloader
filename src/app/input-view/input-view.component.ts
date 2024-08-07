import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../sidebar-service';
import axios, { AxiosResponse } from 'axios';
import { APIDownloadData } from '../../models/APIDownloadData';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'yt-downloader-root-input-view',
  standalone: true,
  templateUrl: './input-view.component.html',
  styleUrls: ['./input-view.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class InputViewComponent implements OnInit {
  @Input() serviceName: string = 'Download Video';

  @Output() currentMenuService: EventEmitter<string> =
    new EventEmitter<string>();

  isActive: boolean = false;
  url: string = '';
  showErrorPopup: boolean = false; // Property to track the popup visibility

  @ViewChild('buttonIconWrapper')
  buttonIconWrapper!: ElementRef<HTMLDivElement>;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isSidebarActive$.subscribe(
      (isActive) => (this.isActive = isActive)
    );
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  setCurrentMenuService(serviceNameEvent: Event) {
    const serviceTarget = serviceNameEvent.target as HTMLElement;
    const serviceNameText = serviceTarget.innerText;
    this.currentMenuService.emit(serviceNameText);
    this.sidebarService.toggleSidebar();
  }

  scrollToFooter() {
    document
      .querySelector('yt-downloader-root-general-footer')
      ?.scrollIntoView({ behavior: 'smooth' });

    this.toggleSidebar();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.isActive) {
      this.sidebarService.toggleSidebar(false);
    }
  }

  async handleButtonClick() {
    // Animation toggle
    if (this.buttonIconWrapper) {
      this.buttonIconWrapper.nativeElement.classList.add('icon-disappear');
      setTimeout(() => {
        this.buttonIconWrapper.nativeElement.classList.remove('icon-disappear');
      }, 2000); // Remove the class after 2 seconds
    }

    try {
      // Determine the endpoint by the service name
      const endpoint: string = `http://localhost:5000/youtube/${
        this.serviceName.toLowerCase().endsWith('video') ? 'video' : 'audio'
      }`;

      // API request
      const response: AxiosResponse<APIDownloadData> = await axios.get(
        endpoint,
        {
          params: {
            url: this.url,
          }, // Include the URL as query parameter
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Expecting a Blob response
        }
      );

      // Extract the data from the response
      const { filename, data } = response.data;

      // Create a download link
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(data);
      downloadLink.href = url;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
      this.showPopup();
    }
  }

  showPopup() {
    this.showErrorPopup = true;
    setTimeout(() => {
      this.showErrorPopup = false;
    }, 3000); // Hide the popup after 3 seconds
  }
}
