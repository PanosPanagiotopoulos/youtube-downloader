import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../sidebar-service';

@Component({
  selector: 'yt-downloader-root-navigation-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-services.component.html',
  styleUrls: ['./navigation-services.component.scss'],
})
export class NavigationServicesComponent {
  @Output() serviceName = new EventEmitter<string>();
  isNavOptionsOpen = false;

  constructor(private sidebarService: SidebarService) {}

  updateData(serviceNameEvent: Event) {
    const serviceTarget = serviceNameEvent.target as HTMLElement;
    const serviceNameText = serviceTarget.innerText;
    this.serviceName.emit(serviceNameText);
    this.toggleNavOptions(false);
  }

  toggleNavOptions(open?: boolean) {
    this.isNavOptionsOpen = open ? open : !this.isNavOptionsOpen;

    const navOptionsElement = document.getElementById('navOptions');
    if (navOptionsElement) {
      if (this.isNavOptionsOpen) {
        navOptionsElement.classList.add('show-nav-options');
        navOptionsElement.classList.remove('hide-nav-options');
      } else {
        navOptionsElement.classList.add('hide-nav-options');
        navOptionsElement.classList.remove('show-nav-options');
      }
    }
  }

  toggleSidebarInInputView() {
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      sidebar.style.transition = 'transform 0.3s ease';
      this.sidebarService.toggleSidebar();
      setTimeout(() => {
        sidebar.style.transition = '';
      }, 300);
    } else {
      this.sidebarService.toggleSidebar();
    }
  }
}
