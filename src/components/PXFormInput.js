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
      <FormInput
        inputStyle={inputStyle}
        {...restProps}
        onChangeText={t => {
          input.onChange(t);
        }}
      />
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
