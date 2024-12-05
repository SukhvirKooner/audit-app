export const SCREENS = {
  LoginScreen: 'LoginScreen',
  HomeScreen: 'HomeScreen',
};

interface ScreenNames {
  [key: string]: string;
  LoginScreen: string;
  HomeScreen: string;
}

export const screenNames: ScreenNames = {
  ...SCREENS,
};
