import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagContainer: {
    justifyContent: 'center',
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    borderRadius: 15,
    paddingHorizontal: 12,
    margin: 4,
  },
  highlightTag: {
    backgroundColor: globalStyleVariables.HIGHLIGHT_COLOR,
  },
  muteTag: {
    backgroundColor: globalStyleVariables.MUTE_COLOR,
  },
  tagLabel: {
    padding: 2,
    color: '#fff',
    backgroundColor: 'transparent',
  },
});

const Tags = ({ tags, onPressTag, onLongPressTag }) => (
  <View style={styles.container}>
    {tags.map(tag => (
      <PXTouchable
        key={tag.name}
        style={
          !(tag.isHighlight && tag.isMute) && [
            styles.tagContainer,
            tag.isHighlight && styles.highlightTag,
            tag.isMute && styles.muteTag,
          ]
        }
        onPress={() => onPressTag(tag.name)}
        onLongPress={() => onLongPressTag(tag.name)}
      >
        {tag.isHighlight && tag.isMute ? (
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            colors={[
              globalStyleVariables.HIGHLIGHT_COLOR,
              globalStyleVariables.MUTE_COLOR,
            ]}
            style={styles.tagContainer}
          >
            <Text style={styles.tagLabel}>{tag.name}</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.tagLabel}>{tag.name}</Text>
        )}
      </PXTouchable>
    ))}
  </View>
);
// <View style={styles.container}>
//   {tags.map(tag =>
//     <LinearGradient
//     key={tag.name}
//     start={{ x: 0, y: 1 }}
//     end={{ x: 1, y: 1 }}
//     colors={['green', 'red']}
//     style={styles.tagContainer}
//   >
//     <Text style={styles.tagLabel}>
//       {tag.name}
//     </Text>
//   </LinearGradient>
//   )}
// </View>;

export default Tags;
