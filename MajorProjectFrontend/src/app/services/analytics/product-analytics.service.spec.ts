import { TestBed } from '@angular/core/testing';

import { ProductAnalyticsService } from './product-analytics.service';

describe('ProductAnalyticsService', () => {
  let service: ProductAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
