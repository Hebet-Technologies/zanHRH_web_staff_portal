import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectUserPermissions } from 'src/app/store/Authentication/authentication-selector';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  permissions$ = this.store.select(selectUserPermissions);

  constructor(private store: Store) {}

  hasPermission(permission: string) {
    return this.permissions$.pipe(
      map((permissions: any[]) =>
        permissions?.some(p => p.name === permission)
      )
    );
  }
}
