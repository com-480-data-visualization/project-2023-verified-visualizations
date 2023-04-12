import { injectGlobal, css, Theme } from '@mongodb-js/compass-components';

export function applyGlobalLightThemeStyles(): void {
  document.documentElement.setAttribute('data-theme', Theme.Light);
}

export function applyGlobalDarkThemeStyles(): void {
  document.documentElement.setAttribute('data-theme', Theme.Dark);
}
