import { NgChessPage } from './app.po';

describe('ng-chess App', () => {
  let page: NgChessPage;

  beforeEach(() => {
    page = new NgChessPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
