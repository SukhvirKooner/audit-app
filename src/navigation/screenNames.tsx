export const SCREENS = {
  LoginScreen: 'LoginScreen',
  HomeScreen: 'HomeScreen',
  Audits: 'Audits',
  AuditDetailsScreen: 'AuditDetailsScreen',
  EditProfile: 'EditProfile',
  NotificationScreen: 'NotificationScreen',
};

interface ScreenNames {
  [key: string]: string;
  LoginScreen: string;
  HomeScreen: string;
  Audits: string;
  AuditDetailsScreen: string;
  EditProfile: string;
  NotificationScreen: string;
}

export const screenNames: ScreenNames = {
  ...SCREENS,
};
