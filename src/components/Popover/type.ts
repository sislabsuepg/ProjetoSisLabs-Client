import { CSSProperties, ReactNode } from 'react';

export interface IPopover {
  title?: string;
  extendedClass?: string;
  extendedClassPop?: string;
  index?: number;
  isModal?: boolean;
  children?: ReactNode;
  marginLeft?: number;
  style?: CSSProperties;
  extendedClassSpan?: string;
}
