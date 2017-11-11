import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation';

import IllustItem from './IllustItem';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const CONTAINER_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    margin: CONTAINER_MARGIN,
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  total: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  chevronIcon: {
    marginLeft: 5,
  },
});

export default class IllustCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: '',
      ILLUST_COLUMNS: 3,
    };
    this.orientationDidChange = this.orientationDidChange.bind(this);
  }

  orientationDidChange(orientation) {
    let ILLUST_COLUMNS;
    const width = globalStyleVariables.WINDOW_WIDTH();
    const height = globalStyleVariables.WINDOW_HEIGHT();
    if (orientation === 'PORTRAIT') {
      if (height / width > 1.6) {
        ILLUST_COLUMNS = 3; // iPhone
      } else {
        ILLUST_COLUMNS = 4; // iPad
      }
    } else if (orientation === 'LANDSCAPE') {
      if (height / width > 1.6) {
        ILLUST_COLUMNS = 3; // iPhone
      } else {
        ILLUST_COLUMNS = 5; // iPad
      }
    }
    this.setState({
      orientation,
      ILLUST_COLUMNS,
    });
  }

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.orientationDidChange(initial);
    const width = globalStyleVariables.WINDOW_WIDTH();
    const height = globalStyleVariables.WINDOW_HEIGHT();
    if (height / width < 1.6) {
      // iPad
      Orientation.addOrientationListener(this.orientationDidChange);
    }
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  render() {
    const {
      navigation: { navigate },
      items,
      title,
      total,
      viewMoreTitle,
      onPressViewMore,
    } = this.props;
    if (!items || !items.length) {
      return null;
    }
    const illusts = items.slice(0, this.state.ILLUST_COLUMNS * 2);
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text>
            {title}
          </Text>
          <PXTouchable onPress={onPressViewMore}>
            <View style={styles.viewAllContainer}>
              {total &&
                <Text style={styles.total}>
                  {total}
                </Text>}
              <Text>
                {viewMoreTitle}
              </Text>
              <Icon name="chevron-right" style={styles.chevronIcon} />
            </View>
          </PXTouchable>
        </View>
        <View style={styles.imagePreviews}>
          {illusts &&
            illusts.length &&
            illusts.map((item, index) =>
              <IllustItem
                key={item.id}
                item={item}
                index={index}
                numColumns={this.state.ILLUST_COLUMNS}
                onPressItem={() =>
                  navigate(SCREENS.Detail, { items: illusts, index })}
                containerStyle={{
                  width:
                    (globalStyleVariables.WINDOW_WIDTH() -
                      CONTAINER_MARGIN * 2) /
                      this.state.ILLUST_COLUMNS -
                    1,
                  height:
                    (globalStyleVariables.WINDOW_WIDTH() -
                      CONTAINER_MARGIN * 2) /
                      this.state.ILLUST_COLUMNS -
                    1,
                }}
                imageStyle={{
                  width:
                    (globalStyleVariables.WINDOW_WIDTH() -
                      CONTAINER_MARGIN * 2) /
                      this.state.ILLUST_COLUMNS -
                    1,
                  height:
                    (globalStyleVariables.WINDOW_WIDTH() -
                      CONTAINER_MARGIN * 2) /
                      this.state.ILLUST_COLUMNS -
                    1,
                }}
              />,
            )}
        </View>
      </View>
    );
  }
}
