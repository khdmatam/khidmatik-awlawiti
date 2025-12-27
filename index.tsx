import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { NgZone, EventEmitter } from '@angular/core';

import { AppComponent } from './src/app.component';

/**
 * A "noop" implementation of `NgZone` which allows Angular to run without `zone.js`.
 * This is used because `provideZonelessChangeDetection` might not be available in all CDN environments.
 * When a custom `NgZone` provider is used, Angular does not require `zone.js`.
 */
class NgZoneNoop implements NgZone {
  readonly hasPendingMicrotasks = false;
  readonly hasPendingMacrotasks = false;
  readonly isStable = true;
  readonly onUnstable = new EventEmitter<boolean>();
  readonly onMicrotaskEmpty = new EventEmitter<void>();
  readonly onStable = new EventEmitter<boolean>();
  readonly onError = new EventEmitter<any>();

  run<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]): T {
    return fn.apply(applyThis, applyArgs as any);
  }

  runGuarded<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]): T {
    try {
      return this.run(fn, applyThis, applyArgs);
    } catch (e) {
      this.onError.emit(e);
      return null as T;
    }
  }

  runOutsideAngular<T>(fn: (...args: any[]) => T): T {
    return fn();
  }

  // FIX: Added missing 'runTask' method to correctly implement the NgZone interface.
  runTask<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[], _applyTo?: string): T {
    return fn.apply(applyThis, applyArgs as any);
  }
}


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // Provide our custom NgZone implementation to enable zoneless change detection
    { provide: NgZone, useClass: NgZoneNoop },
  ],
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types।

// AI Studio always uses an `index.tsx` file for all project types.
