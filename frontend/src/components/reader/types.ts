export interface RelocatedEvent {
  start: Start;
  end: End;
  atStart: boolean;
}

export interface LocationChangedEvent {
  end: string;
  href: string;
  index: number;
  percentage: number;
  start: string;
}

export interface Start {
  index: number;
  href: string;
  cfi: string;
  displayed: Displayed;
  location: number;
  percentage: number;
}

export interface Displayed {
  page: number;
  total: number;
}

export interface End {
  index: number;
  href: string;
  cfi: string;
  displayed: Displayed2;
  location: number;
  percentage: number;
}

export interface Displayed2 {
  page: number;
  total: number;
}
