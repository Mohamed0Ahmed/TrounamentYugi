import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    // Check if this is a GET request and should be cached
    if (request.method === 'GET' && this.shouldCache(request.url)) {
      const cachedResponse = this.cacheService.get(request.url);
      if (cachedResponse) {
        return of(new HttpResponse({ body: cachedResponse }));
      }
    }
    
    return next.handle(request);
  }

  private shouldCache(url: string): boolean {
    // Add URLs that should be cached
    const cacheableUrls = [
      '/player/ranking',
      '/player',
      '/match',
      '/Message/inbox',
      '/note/notes',
      '/player/players/all',
      '/league/getCurrentLeague'
    ];
    
    return cacheableUrls.some(cacheableUrl => url.includes(cacheableUrl));
  }
}
