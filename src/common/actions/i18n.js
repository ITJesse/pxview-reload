import { setCustomText } from 'react-native-global-props';

import pixiv from '../helpers/apiClient';
import i18n from '../helpers/i18n';

export const I18N_SET_LANGUAGE = 'I18N_SET_LANGUAGE';

const customFont = font => ({
  style: {
    fontFamily: font,
  },
});

function mapLanguageCode(lang) {
  switch (lang) {
    case 'ja':
      setCustomText(customFont());
      return 'ja-jp';
    case 'zh':
    case 'zh-CN':
    case 'zh-SG':
      setCustomText(customFont('PingFang SC'));
      return 'zh-cn';
    case 'zh-TW':
    case 'zh-HK':
    case 'zh-MO':
      setCustomText(customFont('PingFang TC'));
      return 'zh-tw';
    case 'en':
    default:
      setCustomText(customFont('Helvetica Neue'));
      return 'en-us';
  }
}

export function setLanguage(lang) {
  i18n.setLanguage(lang);
  pixiv.setLanguage(mapLanguageCode(lang));
  return {
    type: I18N_SET_LANGUAGE,
    payload: {
      lang,
    },
  };
}
