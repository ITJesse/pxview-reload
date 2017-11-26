import React, { Component } from 'react';
import { View, StyleSheet, FlatList, DeviceEventEmitter } from 'react-native';
import { List, ListItem, FormInput } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DURATION } from 'react-native-easy-toast';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import { globalStyles, globalStyleVariables } from '../styles';

const MAX_TAGS_COUNT = 200;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
  },
  formInputContainer: {
    flex: 1,
  },
});

class TagSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTag: null,
    };
  }

  handleOnPressAddTag = () => {
    const { addTag, items, i18n } = this.props;
    const { newTag } = this.state;
    if (newTag) {
      if (items.length + 1 > MAX_TAGS_COUNT) {
        this.showToast(
          i18n.formatString(i18n.tagsMaxLimit, MAX_TAGS_COUNT),
          DURATION.LENGTH_LONG,
        );
        return;
      }
      addTag(newTag);
      this.formInput.clearText();
      this.setState({
        newTag: null,
      });
    } else {
      this.formInput.shake();
    }
  };

  handleOnPressRemoveTag = tag => {
    const { removeTag } = this.props;
    removeTag(tag);
  };

  handleOnChangeFormInputText = text => {
    this.setState({ newTag: text });
  };

  showToast = message => {
    DeviceEventEmitter.emit('showToast', message);
  };

  renderItem = ({ item }) =>
    <ListItem
      title={item}
      rightIcon={{ name: 'times', type: 'font-awesome' }}
      onPressRightIcon={() => this.handleOnPressRemoveTag(item)}
    />;

  render() {
    const { items, formInputPlaceholder } = this.props;
    return (
      <View style={globalStyles.container}>
        <View style={styles.inputContainer}>
          <FormInput
            ref={ref => (this.formInput = ref)} // eslint-disable-line no-return-assign
            placeholder={formInputPlaceholder}
            autoCorrect={false}
            containerStyle={styles.formInputContainer}
            onChangeText={this.handleOnChangeFormInputText}
          />
          <PXTouchable onPress={this.handleOnPressAddTag}>
            <Icon
              name="plus"
              size={24}
              color={globalStyleVariables.PRIMARY_COLOR}
            />
          </PXTouchable>
        </View>
        <List>
          <FlatList
            data={items}
            keyExtractor={item => item}
            renderItem={this.renderItem}
          />
        </List>
      </View>
    );
  }
}

export default connectLocalization(TagSettings);
