import { Component } from '@angular/core';
import { AuthService } from './core/services/auth-card/auth.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Human Resource For Health';

  constructor(private authInit: AuthService, private router: Router) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     // Check token, force login page if expired
    //     const token = localStorage.getItem('token');
    //     const url = event.url;

    //     if (!token && url.startsWith('/app')) {
    //       this.router.navigateByUrl('/auth');
    //     }
    //   }
    // });
    //  // Optionally prevent back button after logout
    // history.pushState(null, '', location.href);
    // window.onpopstate = () => {
    //   history.go(1);
    // };
  }

  ngOnInit() {
    // Rehydrate NgRx authentication state
    this.authInit.initAuth();
  }

}
