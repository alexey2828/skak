import {StyleSheet, Dimensions} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    width: Dimensions.get('window').width - 32,
    height: 45,
    color: 'white',
    //borderColor: 'gray',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    placeholderTextColor: '#ADB0BD',
    backgroundColor: '#44454F',
  },
  successMessage: {
    margin: 15,
    position: 'absolute',
    top: 16,
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 4,
    width: '100%',
    zIndex: 2,
  },
  errorMessage: {
    margin: 15,
    position: 'absolute',
    top: 16,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    width: '100%',
    zIndex: 2,
    color: 'white',
  },
  messageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#282828',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 5,
    //marginVertical: Dimensions.get('window').height / 8,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailsContainer: {
    //borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#44454F',
    borderRadius: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  value: {
    fontSize: 12,
    color: 'white',
  },
  focusedInput: {
    borderColor: 'green',  // для зеленого цвета
    borderWidth: 2,
    borderRadius: 10,
  },
  title: {
    // ваши стили для title
  },
  focusedTitle: {
    borderColor: 'orange',  // для оранжевого цвета
    borderWidth: 2,
    borderRadius: 10,
  },
});
