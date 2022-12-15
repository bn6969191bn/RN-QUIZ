import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Button, ScrollView} from 'react-native';
import {Card} from 'react-native-paper';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import TestTile from './TestTile';
import _ from 'lodash';

const HomeScreen = ({navigation}) => {
  const tiles = [
    {
      text: 'Title test #1',
    },
    {
      text: 'Title test #2',
    },
    {
      text: 'Title test #3',
    },
    {
      text: 'Title test #4',
    },
    {
      text: 'Title test #5',
    },
    {
      text: 'Title test #6',
    },
  ];
  return (
    <ScrollView>
      <View>
        {_.map(tiles, tile => (
          <TestTile text={tile.text} navigation={navigation} />
        ))}

        <Card style={styles.card}>
          <Text style={styles.heading}>Get to know your ranking result</Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Results')}>
            <Text style={styles.buttonTitle}>Check!</Text>
          </Pressable>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    textAlign: 'center',
    margin: 15,
    padding: 15,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: 15,
  },
  button: {
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 20,
    paddingEnd: 20,
    backgroundColor: '#abc8c2',
  },
});

export default HomeScreen;
