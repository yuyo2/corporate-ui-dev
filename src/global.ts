import { createStore } from 'redux';
import { Component as StencilComponent, Prop, State, Watch } from '@stencil/core';

const SET_THEME = 'SET_THEME';
const initialState = { theme: '' }

export const store = createStore(setTheme);


function setTheme(state = initialState, action) {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

export function Component(obj) {
  return function decorator(Class) {
    // return (...args) => {
      let themes = require('./tmp/' + obj.tag.replace('c-', ''));

      @StencilComponent(obj)
      class Standard {
        @Prop() theme: string;

        @State() currentTheme: string = this.theme || store.getState().theme;

        @Watch('theme')
        updateTheme(name) {
          this.currentTheme = name;
        }

        componentWillLoad() {
          console.log(1)
          store.subscribe(() => this.currentTheme = store.getState().theme);
        }

        componentDidLoad() {
          console.log(2)
        }

        render() {
          console.log(3)
          return this.currentTheme ? `<style>${ themes[this.currentTheme] }</style>` : '';
        }
      }
      return Object.assign(Class, Standard);
    // };
  }
}


// interface CUI {
//     abstract function something() : void;
// }