import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Dimensions
} from 'react-native';
/* eslint-disable */
import { Entypo } from '@expo/vector-icons';
/* eslint-enable */

import { SLIDE_DATA } from './api/data';

const SCREEN_WIDTH = Dimensions.get('window').width;

class TinderMenu extends Component {
  state = {
    animated: new Animated.Value(0),
    page: 0,
    slides: SLIDE_DATA,
    pagesCount: SLIDE_DATA.length
  };

  componentDidMount() {
    console.log('state is:', this.state);
  }

  onScroll = e => {
    const { page: currentPage, animated } = this.state;
    let offsetX = e.nativeEvent.contentOffset.x;

    if (offsetX) {
      let page = Math.round(offsetX / SCREEN_WIDTH);

      animated.setValue(offsetX);

      if (currentPage !== page) {
        this.setState({ page }, () => animated.setValue(0));
      }
    }
  };

  renderMenuItems = () => {
    const { slides, page, animated } = this.state;
    const pageWidth = SCREEN_WIDTH * page;
    const growScale = animated.interpolate({
      inputRange: [0, SCREEN_WIDTH + pageWidth],
      outputRange: [1, 1.5]
    });
    const returnScale = animated.interpolate({
      inputRange: [SCREEN_WIDTH * page, SCREEN_WIDTH + pageWidth],
      outputRange: [1.5, 1]
    });

    return slides.map((slide, index) => {
      return (
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: index === page ? [{ scale: growScale }] : [] }
          ]}
          key={slide.id.toString()}
        >
          <Entypo name={slide.icon} size={24} color="black" />
        </Animated.View>
      );
    });
  };

  renderMenu = () => {
    const { pagesCount } = this.state;
    const width = SCREEN_WIDTH * pagesCount;
    return (
      <View style={[styles.menu, { width }]}>{this.renderMenuItems()}</View>
    );
  };

  renderSlidesItems = () => {
    const { slides } = this.state;
    return slides.map(slide => (
      <View style={styles.slideContainer} key={slide.id.toString()}>
        <Text style={styles.slideText}>{slide.text}</Text>
      </View>
    ));
  };

  renderSlides = () => {
    return (
      <View style={styles.slidesContainer}>
        <ScrollView
          style={styles.slides}
          horizontal
          pagingEnabled
          onScroll={e => this.onScroll(e)}
          scrollEventThrottle={16}
        >
          {this.renderSlidesItems()}
        </ScrollView>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderMenu()}
        {this.renderSlides()}
      </View>
    );
  }
}

export default TinderMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'black'
  },
  iconContainer: {},
  slidesContainer: {
    flex: 6,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  slides: {},
  slideContainer: {
    width: SCREEN_WIDTH,
    padding: 20
  },
  slideText: {}
});
