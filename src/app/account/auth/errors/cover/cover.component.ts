import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
  standalone: true // Marking the component as standalone
})

/**
 * 404 Cover Component
 */
export class CoverComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
  }

  navigateToHome() {
    this.router.navigate(['/auth']);
  }

}
