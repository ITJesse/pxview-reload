import { Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const HEADER_BACKGROUND_COLOR = '#2e97d8';
export const HEADER_TINT_COLOR = '#fff';
export const CARD_BACKGROUND_COLOR = '#fff';
export const PRIMARY_COLOR = '#2e97d8';
export const SECONDARY_COLOR = 'red';
export const BACKGROUND_COLOR = '#E9EBEE';
export const HIGHLIGHT_COLOR = 'green';
export const MUTE_COLOR = 'red';

export const WINDOW_WIDTH = () => Math.floor(Dimensions.get('window').width);
export const WINDOW_HEIGHT = () => Math.floor(Dimensions.get('window').height);

export const APPBAR_HEIGHT = 56;
export const STATUSBAR_HEIGHT = isIphoneX() ? 28 : 20;
export const DRAWER_WIDTH = WINDOW_WIDTH() - 64;
