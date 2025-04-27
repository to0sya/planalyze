import { TestBed } from '@angular/core/testing';

import { ContentCalendarService } from './content-calendar.service';

describe('ContentCalendarService', () => {
  let service: ContentCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
