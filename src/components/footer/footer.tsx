import { Component, Prop, State, Watch } from '@stencil/core';

import { store } from '../../global';
import * as themes from '../../tmp/footer';

@Component({
  tag: 'c-footer',
  styleUrl: 'footer.scss',
  shadow: true
})
export class Footer {
  @Prop() theme: string;
  @Prop() items: any = [];

  @State() currentTheme: string = this.theme || store.getState().theme;
  @State() show = false;
  // There should be a better way of solving this, either by "{ mutable: true }"
  // or "{ reflectToAttr: true }" or harder prop typing Array<Object>
  @State() _items: object[] = [];

  @Watch('items')
  setItems(items) {
    this._items = Array.isArray(items) ? items : JSON.parse(items);
  }

  @Watch('theme')
  updateTheme(name) {
    this.currentTheme = name;
  }

  componentWillLoad() {
    store.subscribe(() => this.currentTheme = store.getState().theme);

    this.setItems(this.items);
  }

  render() {
    return [
      this.currentTheme ? <style>{ themes[this.currentTheme] }</style> : '',

      <nav class='navbar navbar-expand-lg navbar-default' data-test-id='c-footer'>
        <strong class='navbar-brand' data-test-id='c-footer-logo'></strong>

        <div class='collapse navbar-collapse'>
          <ul class='navbar-nav'>
            { this._items.map(item => (
              <li class='nav-item'>
                <a href={ item['location'] } class='nav-link'>
                  <span>{ item['text'] }</span>
                </a>
              </li>
            )) }
          </ul>
        </div>

        <div class='navbar-content'>
          <div class={'btn-group dropup' + (this.show ? ' show' : '')}>
            <div class='dropdown-menu'>
              { this._items.map(item => (
                <a href={ item['location'] } class='dropdown-item'>{ item['text'] }</a>
              )) }
            </div>

            <button
              class='btn btn-link dropdown-toggle'
              type='button'
              onClick={ () => this.show = !this.show }>Scania</button>
          </div>

          <p data-test-id='c-footer-copyright'>Copyright &copy; Scania 2019</p>
        </div>
      </nav>
    ];
  }
}
