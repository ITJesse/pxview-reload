import React from 'react';
import { View } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import OverlayKeychainButton from '../components/OverlayKeychainButton';

const PXFormInput = props => {
  const {
    label,
    meta: { touched, error },
    labelStyle,
    inputStyle,
    errorTextStyle,
    input,
    ...restProps
  } = props;
  return (
    <View>
      <FormLabel labelStyle={labelStyle}>
        {label}
      </FormLabel>
      <FormInput inputStyle={inputStyle} {...input} {...restProps} />
      {false && restProps.secureTextEntry && <OverlayKeychainButton />}
      {touched &&
        error &&
        <FormValidationMessage>
          {error}
        </FormValidationMessage>}
    </View>
  );
};

export default PXFormInput;
