import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectUserPermissions } from 'src/app/store/Authentication/authentication-selector';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  permissions: any[] = [];
  toggle: any = true;
  menuItems: MenuItem[] = [];
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router, 
    public translate: TranslateService,
    private store: Store
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.store.select(selectUserPermissions).subscribe(perms => {
      this.permissions = perms || [];
      this.menuItems = this.filterMenu(MENU);
      
      // Baada ya menu kuchujwa, activate the correct dashboard link
      setTimeout(() => {
        this.activateDashboardBasedOnPermissions();
      }, 100);
    });

    this.router.events.subscribe((event) => {
      if (document.documentElement.getAttribute('data-layout') != "twocolumn") {
        if (event instanceof NavigationEnd) {
          this.initActiveMenu();
        }
      }
    });
  }

  /**
   * Automatically activate dashboard based on permissions
   * Na kufungua menu ya Dashboard automatically
   */
  activateDashboardBasedOnPermissions() {
    // Tafuta dashboard item kwenye menu
    const dashboardItem = this.menuItems.find(item => item.label === 'Dashboard');
    
    if (!dashboardItem) return;

    // Angalia permissions za user
    const userPermissions = this.permissions.map(p => p.name);
    
    // Check kama user ana permission yoyote ya dashboard
    const hasPsDashboard = userPermissions.includes('View Ps Dashboard');
    const hasStaffDashboard = userPermissions.includes('Setup Management');
    
    let activeSubItem = null;

    // Prioritize: PS Dashboard first, then Staff Dashboard
    if (hasPsDashboard) {
      activeSubItem = dashboardItem.subItems?.find(sub => sub.permission === 'View Ps Dashboard');
    } else if (hasStaffDashboard) {
      activeSubItem = dashboardItem.subItems?.find(sub => sub.permission === 'Setup Management');
    }

    // Kama user ana dashboard permission, fungua menu na activate
    if (activeSubItem) {
      // First close all menus
      this.closeAllMenus();
      
      // Then open only dashboard menu
      dashboardItem.isCollapsed = false;
      
      // Fungua active subitem kama ina subitems zake
      if (activeSubItem.subItems && activeSubItem.subItems.length > 0) {
        activeSubItem.isCollapsed = false;
      }
      
      // Ikiwa current URL iko kwenye dashboard routes, mark kama active
      const currentUrl = this.router.url;
      if (currentUrl.includes('/app/dashboard')) {
        setTimeout(() => {
          this.initActiveMenu();
        }, 50);
      }
    }
  }

  filterMenu(menu: MenuItem[]): MenuItem[] {
    return menu
      .map(item => ({
        ...item,
        isCollapsed: item.isCollapsed !== undefined ? item.isCollapsed : true,
        subItems: item.subItems ? this.filterMenu(item.subItems) : undefined
      }))
      .filter(item => {
        if (!item.permission) return true;

        if (Array.isArray(item.permission)) {
          return item.permission.some(p =>
            this.permissions.some(up => up.name === p)
          );
        }

        return this.permissions.some(up => up.name === item.permission);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      item.classList.remove("active");
    });
  }

  /**
   * FIXED: toggleItem - Only one menu open at a time
   * Unapofungua menu moja, nyingine zote zinafungwa
   */
  toggleItem(clickedItem: any) {
    // First, close all top-level menus
    this.menuItems.forEach(item => {
      // Don't close the clicked item yet
      if (item !== clickedItem) {
        item.isCollapsed = true;
        // Also close all subitems of other menus
        if (item.subItems) {
          this.closeAllSubItems(item.subItems);
        }
      }
    });
    
    // Then toggle the clicked item
    if (clickedItem.isCollapsed !== undefined) {
      clickedItem.isCollapsed = !clickedItem.isCollapsed;
    }
  }

  /**
   * Helper: Close all subitems recursively
   */
  private closeAllSubItems(items: MenuItem[]) {
    items.forEach(item => {
      item.isCollapsed = true;
      if (item.subItems) {
        this.closeAllSubItems(item.subItems);
      }
    });
  }

  /**
   * Helper: Close all menus
   */
  private closeAllMenus() {
    this.menuItems.forEach(item => {
      item.isCollapsed = true;
      if (item.subItems) {
        this.closeAllSubItems(item.subItems);
      }
    });
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    let pathName = window.location.pathname;
    
    if (environment.production) {
      pathName = pathName.replace('/velzon/angular/default', '');
    }

    // First, find and expand parent menus of active item
    this.expandParentMenus(pathName, this.menuItems);
    
    const active = this.findMenuItem(pathName, this.menuItems);
    
    if (active) {
      this.ensureParentExpanded(active, this.menuItems);
    }
    
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        if (environment.production) {
          let path = x.pathname;
          path = path.replace('/velzon/angular/default', '');
          return path === pathName;
        } else {
          return x.pathname === pathName;
        }
      });
      
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  /**
   * Expand parent menus of the current active route
   * Na kuhakikisha menus nyingine zinafungwa
   */
  private expandParentMenus(pathname: string, menuItems: MenuItem[]): boolean {
    for (const item of menuItems) {
      if (item.link && item.link === pathname) {
        return true;
      }
      
      if (item.subItems) {
        const found = this.expandParentMenus(pathname, item.subItems);
        if (found) {
          // Close all other menus first
          this.menuItems.forEach(menu => {
            if (menu !== item) {
              menu.isCollapsed = true;
              if (menu.subItems) {
                this.closeAllSubItems(menu.subItems);
              }
            }
          });
          // Then expand this parent menu
          item.isCollapsed = false;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Ensure parent of active item is expanded
   */
  private ensureParentExpanded(activeItem: any, menuItems: MenuItem[]): void {
    for (const item of menuItems) {
      if (item.subItems) {
        if (item.subItems.includes(activeItem)) {
          item.isCollapsed = false;
          return;
        }
        this.ensureParentExpanded(activeItem, item.subItems);
      }
    }
  }

  private findMenuItem(pathname: string, menuItems: any[]): any {
    for (const menuItem of menuItems) {
      if (menuItem.link && menuItem.link === pathname) {
        return menuItem;
      }

      if (menuItem.subItems) {
        const foundItem = this.findMenuItem(pathname, menuItem.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return null;
  }

  hasItems(item: MenuItem) {
    return item.subItems !== undefined && item.subItems.length > 0;
  }

  toggleMobileMenu(event: any) {
    var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover');
    } else {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active');
    }
  }

  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
}
