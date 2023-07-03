/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Animated, Text} from 'react-native';
import {styles} from '../../../styles';
import {MAIN_TITLES} from '../../const/titles-main';

export const ServerErrorsMessage = ({showSuccessMessage, error, mqttError}) => {
  return (
    <>
      {showSuccessMessage && (
        <Animated.View
          style={[
            styles.successMessage,
            {left: showSuccessMessage ? 0 : -200},
          ]}>
          <Text style={styles.messageText}>{MAIN_TITLES.SUCCESS_MESSAGE}</Text>
        </Animated.View>
      )}
      {error && (
        <Animated.View style={[styles.errorMessage, {left: error ? 0 : -200}]}>
          <Text style={styles.messageText}>
            {MAIN_TITLES.HTTP_ERROR}: {error.message}
          </Text>
        </Animated.View>
      )}
      {mqttError
        ? !mqttError && (
            <Animated.View
              style={[styles.errorMessage, {left: mqttError ? 0 : -200}]}>
              <Text style={styles.messageText}>{MAIN_TITLES.MQTT_ERROR}</Text>
            </Animated.View>
          )
        : null}
    </>
  );
};
