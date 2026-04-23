import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MAIN NAVIGATION',
    isTitle: true
  },

  {
    id: 2,
    label: 'Dashboard',
    icon: 'ri-dashboard-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 3,
        label: 'Ps Dashboard',
        link: '/app/dashboard/ps-dashboard-views',
        parentId: 2,
        permission: 'View Ps Dashboard'
      },
      {
        id: 4,
        label: 'Staff Dashboard',
        link: '/app/dashboard/staff-dashboard-views',
        parentId: 2,
        permission: 'Setup Management'
      },
    ]
  },

  {
    id: 10,
    label: 'Personal Profile',
    icon: 'ri-account-circle-line',
    link: '/app/profile/personal-profile',
    permission: 'View Personal Education',
  },

  {
    id: 20,
    label: 'Training',
    icon: 'ri-stack-line',
    isCollapsed: true,
    permission: 'View Training Request',
    subItems: [
      {
        id: 21,
        label: 'Training Application',
        link: '/app/training/employee-training-lists',
        parentId: 20,
        permission: 'View Training Request'
      },
    ]
  },
  {
    id: 30,
    label: 'Leave',
    icon: 'ri-honour-line',
    isCollapsed: true,
    permission: 'View Leave Request',
    subItems: [
      {
        id: 31,
        label: 'Leave Requests',
        link: '/app/leave/employee-leaves-request',
        parentId: 30,
        permission: 'View Leave Request'
      },
    ]
  },

  {
    id: 40,
    label: 'Transfer',
    icon: 'ri-apps-2-line',
    isCollapsed: true,
    permission: 'View Transfer Request',
    subItems: [
      {
        id: 41,
        label: 'Request Transfer',
        link: '/app/transfer/employee-request-transfer',
        parentId: 40,
        permission: 'View Transfer Request'
      },
    ]
  }


];
