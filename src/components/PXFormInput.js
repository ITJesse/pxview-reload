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
    meta: { touched, dirty, error },
    labelStyle,
    inputStyle,
    errorTextStyle,
    input,
    text,
    ...restProps
  } = props;
  return (
    <View>
      <FormLabel labelStyle={labelStyle}>
        {label}
      </FormLabel>
      <FormInput
        inputStyle={inputStyle}
        {...input}
        {...restProps}
        onChangeText={t => {
          input.onChange(t);
        }}
        value={props.text || (dirty ? undefined : input.value)}
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
