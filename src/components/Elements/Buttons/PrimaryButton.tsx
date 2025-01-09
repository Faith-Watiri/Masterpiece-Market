/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Button} from 'react-native-paper';

type PrimaryButtonProps = {
  onPress: () => void;
  name: string;
  width?: string | number;
  disabled?: boolean;
  style?: any;
};

export function PrimaryButton({
  onPress,
  name,
  width,
  disabled,
  style,
}: PrimaryButtonProps) {
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      style={[
        style,
        {
          width: width ? width : '100%',
        },
      ]}
      className={'bg-primary py-2 rounded-full text-[16px]'}
      textColor="white">
      {name}
    </Button>
  );
}
