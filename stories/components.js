import { storiesOf } from '@storybook/html';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import { defineCustomElement } from '../dist/esm/es5/corporate-ui.core';
import * as C from '../dist/esm/es5/corporate-ui.components';

import categories from '../src/components/categories.json';
import components from '../src/components/data.json';

import '../src/components.scss';

const C_COMPONENTS = C.COMPONENTS;

// We skip rendering these components for now due to rendering issues
let filteredComponents = components.filter(item => ['c-column', 'c-container', 'c-content', 'c-row'].indexOf(item.name) === -1);

Object.keys(C_COMPONENTS)
  .map(item => renderWebComponent(C_COMPONENTS[item]));


[{name: 'All'}, ...categories]
  .map(category => renderStories(category, filteredComponents, 'Components'));


function renderWebComponent(component) {
  const [tagName, bundleIds, , tagAttrsData, encapsulationMeta, listenerMeta] = component;
  const tagAttrs = {};

  if (typeof tagAttrsData === 'object') {
    tagAttrsData.map(attributes => {
      const [propName, memberType, reflectToAttr, attrName, propType] = attributes;

      tagAttrs[propName] = {
        attrName,
        memberType,
        propType,
        reflectToAttr
      }
    });
  }

  defineCustomElement(window, [component]);

  /*if (tagName === 'context-consumer') {
    return;
  }

  storiesOf('Components', module)
    .addParameters({ options: { addonPanelInRight: true } })
    .add(tagName, () => `<${tagName} />`);*/
}


export function renderStories(category, items, title) {
  let categorisedItems = items.filter(item => item.categories.indexOf(category.id) > -1);
  let storyName = category.name + ' (' + categorisedItems.length + ')';

  if (!category.id) {
    categorisedItems = items;
    storyName = category.name;
  }

  if (!categorisedItems.length) { return; }

  // ToDo: We want to use onclick=${linkTo(title + '/' + category.name, component.name)}
  storiesOf(title, module)
    .addParameters({ options: { addonPanelInRight: true } })
    .add(
      storyName,
      () => (`
        <main>
          <section>
            <c-container type="fluid">
              <header>
                <h2>${category.name}</h2>
              </header>
              <p>Elements will follow here.</p>
              <c-row class="row-eq-height">
                ${categorisedItems.map(component => (
                  `<c-column md="3">
                    <c-card onclick="(function() { window.location = window.location.origin + window.location.pathname + '?selectedKind=${title}/${category.name}&selectedStory=${component.name}' })()">
                      <strong slot="card-header">${component.name}</strong>
                      <${component.name} slot="card-body" />
                    </c-card>
                  </c-column>`
                )).join('')}
              </c-row>
            </c-container>
          </section>
        </main>
      `)
    )

  categorisedItems.map(component => {
    let content = `<${component.name} />`;

    if (title === 'Templates') {
      // var template = require('html-loader?interpolate!../src/templates/' + component.name + '.html');
      // var template = new DOMParser().parseFromString(`${require('../src/templates/' + component.name + '.html')}`, 'text/html');
      // var apa = template.querySelector('body')
      // content = `<iframe onload="(function(e) { e.contentDocument.documentElement.replaceChild(${apa}, e.contentDocument.documentElement.body) })(this)"></iframe>`;
      // console.log(apa)
      content = `<c-container type="fluid">${require('../src/templates/' + component.name + '.html')}</c-container>`;
    }

    storiesOf(title + '/' + category.name, module)
      .addParameters({ options: { addonPanelInRight: true } })
      .add(
        component.name,
        () => (`
          <main>
            <section>
              <c-container type="fluid">
                <header>
                  <button onclick="(function() { window.history.back() })()">Back to the category page</button>
                  <h2>${component.name}</h2>
                </header>
                <p>Elements will follow here.</p>
                ${content}
              </c-container>
            </section>
          </main>
        `)
      )
  })
}