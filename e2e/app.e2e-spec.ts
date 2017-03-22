import { TicketWebPage } from './app.po';

describe('ticket-web App', () => {
  let page: TicketWebPage;

  beforeEach(() => {
    page = new TicketWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
