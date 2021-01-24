import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'app/services/auth.service';
import { Profile } from 'app/interfaces/profile';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const admin_ROUTES: RouteInfo[] = [
    { path: 'home',          title: 'Principal',            icon:'nc-bank',               class: '' },
    { path: 'data-entry',    title: 'Ingreso de datos',     icon:'nc-ruler-pencil',       class: '' },
    { path: 'profile',       title: 'Perfil',               icon:'nc-single-02',          class: '' },
    { path: 'configuration', title: 'Configuración',        icon:'nc-settings',           class: '' },
];

export const user_ROUTES: RouteInfo[] = [
    { path: 'home',          title: 'Principal',            icon:'nc-bank',       class: '' },
    { path: 'data-entry',    title: 'Ingreso de datos',     icon:'nc-ruler-pencil',       class: '' },
    { path: 'profile',       title: 'Perfil',               icon:'nc-single-02',          class: '' },
];

export const viewer_ROUTES: RouteInfo[] = [
  { path: 'home',          title: 'Principal',            icon:'nc-bank',       class: '' },
  { path: 'profile',       title: 'Perfil',               icon:'nc-single-02',          class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public currentUser: Profile;
    public adminRol: number = 0;
    public userRol: number = 1;

    constructor(
      private router: Router,
      private authenticationService: AuthService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

    ngOnInit() {
      // Se asigna el menú dependiendo del rol que tenga el usuario.
      if(this.currentUser.rol == 1){
        this.menuItems = admin_ROUTES.filter(menuItem => menuItem);
      }
      else if(this.currentUser.rol == 1){
        this.menuItems = user_ROUTES.filter(menuItem => menuItem);
      }
      else{
        this.menuItems = viewer_ROUTES.filter(menuItem => menuItem);
      }
    }

    logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
}
