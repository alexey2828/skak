import {TextStyle, ViewStyle} from 'react-native';

const TopTitle: TextStyle = {
  fontSize: 20,
  color: 'white',
  marginTop: 20,
};

const BottomTitle: TextStyle = {
  color: '#ADB0BD',
  fontSize: 16,
};

const ListTitle: TextStyle = {
  color: 'white',
  margin: 10,
  fontSize: 16,
};

const Row: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const RowFlexEnd: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
};

const RowFlexCenter: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
};

const RowFlexStart: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

const RowFlexSpaceBetween: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const PageContainer: ViewStyle = {
  margin: 5,
  backgroundColor: '#242424',
  borderRadius: 10,
  height: '87%',
};

const CircleBtnContainer: ViewStyle = {
  width: '100%',
  borderColor: '#333334',
  borderWidth: 1,
  borderRadius: 50,
  marginTop: 5,
};

const CircleBtnTitle: TextStyle = {
  color: '#a1a1a1',
  margin: 10,
  marginTop: -5,
  fontSize: 20,
};

const TitleGreen: TextStyle = {
  color: '#67E761',
  fontSize: 16,
};

const TitleRed: TextStyle = {
  color: '#FF0000',
  fontSize: 16,
};

const Br: ViewStyle = {
  height: 10,
};

export const IndexStyle = {
  TopTitle,
  BottomTitle,
  Row,
  PageContainer,
  RowFlexEnd,
  RowFlexCenter,
  ListTitle,
  RowFlexStart,
  RowFlexSpaceBetween,
  CircleBtnContainer,
  CircleBtnTitle,
  TitleGreen,
  TitleRed,
  Br,
};
