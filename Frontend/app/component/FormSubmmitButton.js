import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const FormSubmmitButton = ({ title, submitting, onPress }) => {
  const backgroundColor = submitting
    ? 'rgba(27,27,51,0.4)'
    : 'rgba(27,27,51,1)';

  return (
    <TouchableOpacity
      onPress={!submitting ? onPress : null}
      style={[styles.container, { backgroundColor }]}
    >
      <Text style={{ fontSize: 18, color: '#fff' }}>{title}</Text>
    </TouchableOpacity>
  )
}

export default FormSubmmitButton

const styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: 'rgba(27, 27, 51, 1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
