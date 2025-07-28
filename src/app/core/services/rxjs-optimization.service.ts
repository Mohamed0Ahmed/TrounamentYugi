import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RxjsOptimizationService {
  /**
   * إنشاء Subject محسن للاستخدام
   */
  public createOptimizedSubject<T>(): Subject<T> {
    return new Subject<T>();
  }

  /**
   * إنشاء BehaviorSubject محسن للاستخدام
   */
  public createOptimizedBehaviorSubject<T>(
    initialValue: T
  ): BehaviorSubject<T> {
    return new BehaviorSubject<T>(initialValue);
  }

  /**
   * تطبيق operators محسنة على Observable
   */
  public optimizeObservable<T>(
    source: Observable<T>,
    operators: Array<(source: Observable<T>) => Observable<any>>
  ): Observable<any> {
    return operators.reduce((obs, operator) => operator(obs), source);
  }

  /**
   * تطبيق debounceTime محسن
   */
  public debounceOptimized<T>(
    source: Observable<T>,
    time: number
  ): Observable<T> {
    return source.pipe(debounceTime(time), distinctUntilChanged());
  }

  /**
   * تطبيق filter محسن
   */
  public filterOptimized<T>(
    source: Observable<T>,
    predicate: (value: T) => boolean
  ): Observable<T> {
    return source.pipe(filter(predicate));
  }

  /**
   * تطبيق map محسن
   */
  public mapOptimized<T, R>(
    source: Observable<T>,
    project: (value: T) => R
  ): Observable<R> {
    return source.pipe(map(project));
  }

  /**
   * تطبيق takeUntil محسن
   */
  public takeUntilOptimized<T>(
    source: Observable<T>,
    notifier: Observable<any>
  ): Observable<T> {
    return source.pipe(takeUntil(notifier));
  }
}
