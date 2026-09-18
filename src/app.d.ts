/// <reference types="@testing-library/jest-dom/vitest" />
declare global {
  namespace App {
    interface PageData {
      /** A page that wants the Crystal-style inverted LCD sets this. */
      inverted?: boolean;
    }
  }
}

export {};
