export const SCREENS = {
  SplashScreen: 'SplashScreen',
  LoginScreen: 'LoginScreen',
  Register: 'Register',
  HomeScreen: 'HomeScreen',
  Audits: 'Audits',
  AuditDetailsScreen: 'AuditDetailsScreen',
  EditProfile: 'EditProfile',
  NotificationScreen: 'NotificationScreen',
  MapScreen: 'MapScreen',
  MyAccount: 'MyAccount',
  SettingNotification: 'SettingNotification',
  HelpScreen: 'HelpScreen',
  TemplateScreen: 'TemplateScreen',
  PdfScreen: 'PdfScreen',
  SearchScreen: 'SearchScreen',
  SyncDataScreen: 'SyncDataScreen',
  RepeatableDetailsScreen: 'RepeatableDetailsScreen',
  RepeatableTemplateScreen: 'RepeatableTemplateScreen',
};

interface ScreenNames {
  [key: string]: string;
  SplashScreen: string;
  LoginScreen: string;
  Register: string;
  HomeScreen: string;
  Audits: string;
  AuditDetailsScreen: string;
  EditProfile: string;
  NotificationScreen: string;
  MapScreen: string;
  MyAccount: string;
  HelpScreen: string;
  SettingNotification: string;
  TemplateScreen: string;
  PdfScreen: string;
  SearchScreen: string;
  SyncDataScreen: string;
}

export const screenNames: ScreenNames = {
  ...SCREENS,
};
