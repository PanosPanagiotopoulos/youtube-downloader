import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../sidebar-service';
import { FormsModule } from '@angular/forms';
import axios, { AxiosResponse } from 'axios';
import { APIDownloadData } from '../../models/APIDownloadData';

@Component({
  selector: 'yt-downloader-root-input-view',
  standalone: true,
  templateUrl: './input-view.component.html',
  styleUrls: ['./input-view.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class InputViewComponent
  implements OnInit, AfterViewInit, OnChanges, OnChanges
{
  @Input() serviceName: string = 'Video';
  @Output() currentMenuService: EventEmitter<string> =
    new EventEmitter<string>();

  isActive: boolean = false;
  url: string = '';
  showErrorPopup: boolean = false;

  @ViewChild('categoryTitle') categoryTitle!: ElementRef<HTMLSpanElement>;
  @ViewChild('buttonIconWrapper')
  buttonIconWrapper!: ElementRef<HTMLDivElement>;

  sidebarOptions = [
    {
      optionName: 'Home',
      _href: '/',
      callback: function () {},
    },
    {
      optionName: 'Video',
      _href: 'javascript:void(0)',
      callback: (event: Event) => this.setCurrentMenuService(event),
    },
    {
      optionName: 'Audio',
      _href: 'javascript:void(0)',
      callback: (event: Event) => this.setCurrentMenuService(event),
    },
    {
      optionName: 'Contact',
      _href: 'javascript:void(0)',
      callback: (event: Event) => this.scrollToFooter(),
    },
  ];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isSidebarActive$.subscribe(
      (isActive) => (this.isActive = isActive)
    );

    this.triggerTypingAnimation();
  }

  ngAfterViewInit() {
    this.triggerTypingAnimation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serviceName']) {
      this.triggerTypingAnimation();
    }
  }

  triggerTypingAnimation() {
    if (!this.categoryTitle) {
      console.error('categoryTitle element is not available.');
      return;
    }

    setTimeout(() => {
      const text = 'Get your: ' + this.serviceName;
      let i = 0;
      const speed = 50;

      this.categoryTitle.nativeElement.innerHTML = ''; // Clear the text
      const typeWriter = () => {
        if (i < text.length) {
          this.categoryTitle.nativeElement.innerHTML += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        }
      };

      typeWriter();
    }, 100); // Adjust the delay time as necessary
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

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

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
          },
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
