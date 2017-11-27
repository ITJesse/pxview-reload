import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const IllustCollection = props => {
  const {
    navigation: { navigate },
    items,
    title,
    total,
    viewMoreTitle,
    onPressViewMore,
    illustColumns,
  } = props;
  if (!items || !items.length) {
    return null;
  }
  const illusts = items.slice(0, illustColumns * 2);
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
              numColumns={illustColumns}
              onPressItem={() =>
                navigate(SCREENS.Detail, { items: illusts, index })}
              containerStyle={{
                width:
                  (globalStyleVariables.WINDOW_WIDTH() - CONTAINER_MARGIN * 2) /
                    illustColumns -
                  1,
                height:
                  (globalStyleVariables.WINDOW_WIDTH() - CONTAINER_MARGIN * 2) /
                    illustColumns -
                  1,
              }}
              imageStyle={{
                width:
                  (globalStyleVariables.WINDOW_WIDTH() - CONTAINER_MARGIN * 2) /
                    illustColumns -
                  1,
                height:
                  (globalStyleVariables.WINDOW_WIDTH() - CONTAINER_MARGIN * 2) /
                    illustColumns -
                  1,
              }}
            />,
          )}
      </View>
    </View>
  );
};

export default connect(state => ({
  illustColumns: state.orientation.illustColumns,
}))(IllustCollection);
