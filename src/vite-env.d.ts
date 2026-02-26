// src/vite-env.d.ts

/// <reference types="vite-plugin-svgr/client" />

import type * as React from 'react';

declare module '*.svg?react' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Опционально: если хотите поддерживать и обычный импорт SVG как URL
declare module '*.svg' {
  const content: string;
  export default content;
}
