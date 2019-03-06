import { Header } from './header';

let comp = new Header();
const arrayOfcomp = Object.keys(comp);
const arrayOfTypes = Object.values(comp).map((items) => typeof items);
const requiredProps = ["siteName", "siteUrl", "topItems", "currentTheme", "show", "_topItems"];
const requiredTypes = ["string", "string", "object", "string", "boolean", "object"];
let render = comp.render;
let page;
/* const componentName = 'c-header'; */
/* let page; */
/* console.log(comp.render()) */

describe('app', () => {
  it('builds', () => {
    expect(new Header()).toBeTruthy();
  });
  test('have all the correct properties and types ', () => {
    expect(arrayOfcomp).toEqual(requiredProps);
    expect(arrayOfTypes).toEqual(requiredTypes);
    
  });
  test('Do not have all the correct proerties and types', () => {
    expect(arrayOfcomp).not.toBe(requiredProps);
    expect(arrayOfTypes).not.toBe(requiredTypes);
   
  });
  it('It should render the header component', () => {
    afterEach(async () => {
      page = await render();
      await page.setContent('<c-header></c-header>');
    });
  });
}); 


/* describe('toggle', () => {
  it('should toggle the checked property', () => {
   expect(comp.show).toBe(false);

  });
}); */



 
  






