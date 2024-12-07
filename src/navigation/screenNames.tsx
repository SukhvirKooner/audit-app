export const SCREENS = {
  LoginScreen: 'LoginScreen',
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
};

interface ScreenNames {
  [key: string]: string;
  LoginScreen: string;
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
}

export const screenNames: ScreenNames = {
  ...SCREENS,
};
