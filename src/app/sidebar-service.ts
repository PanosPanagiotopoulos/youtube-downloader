import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isSidebarActive = new BehaviorSubject<boolean>(false);
  isSidebarActive$ = this._isSidebarActive.asObservable();

  toggleSidebar(active: boolean = false) {
    this._isSidebarActive.next(active ? active : !this._isSidebarActive.value);
  }
}
