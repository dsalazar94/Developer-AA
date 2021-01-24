import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { admin_ROUTES } from '../../sidebar/sidebar.component';
import { user_ROUTES } from '../../sidebar/sidebar.component';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { Profile } from 'app/interfaces/profile';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    public currentUser: Profile;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(
      location:Location,
      private renderer : Renderer2,
      private element : ElementRef,
      private router: Router,
      private authenticationService: AuthService) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit(){
        if(this.currentUser.rol == 0){
          this.listTitles = admin_ROUTES.filter(listTitle => listTitle);
        }
        else{
          this.listTitles = user_ROUTES.filter(listTitle => listTitle);
        }
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
    }

    getTitle(){
      var retorno;
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }

      if(titlee.includes('home')){
        retorno = 'Principal';
      }
      else if(titlee.includes('profile')){
        retorno = 'Perfil';
      }
      else if(titlee.includes('configuration')){
        retorno = 'Configuración';
      }
      else if(titlee.includes('data-entry')){
        retorno = 'Ingreso de datos';
      }

      return retorno;

    }
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }

}
