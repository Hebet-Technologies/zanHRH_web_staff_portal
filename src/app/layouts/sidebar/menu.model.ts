export interface MenuItem {
  id?: number;
  label?: any;
  icon?: string;
  isCollapsed?: any;
  link?: string;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  permission?: string | string[];
  subItems?: MenuItem[];
  
  
}