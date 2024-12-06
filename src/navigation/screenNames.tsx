export const SCREENS = {
  LoginScreen: 'LoginScreen',
  HomeScreen: 'HomeScreen',
  Audits: 'Audits',
  AuditDetailsScreen: 'AuditDetailsScreen',
};

interface ScreenNames {
  [key: string]: string;
  LoginScreen: string;
  HomeScreen: string;
  Audits: string;
  AuditDetailsScreen: string;
}

export const screenNames: ScreenNames = {
  ...SCREENS,
};
