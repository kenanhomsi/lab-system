export const DISPLAY_MODE = {
  FULL: "Full",
  LARGE: "Large",
  SMALL: "Small",
  XSMALL: "XSmall",
} as const;

export type DisplayMode = (typeof DISPLAY_MODE)[keyof typeof DISPLAY_MODE];

export const DISPLAY_MODE_VALUES: readonly DisplayMode[] = Object.values(
  DISPLAY_MODE,
) as DisplayMode[];

type DisplayModeLayout = {
  aspectRatio: string;
  previewWidth: number;
  previewHeight: number;
  cardWidth: number;
  detailMaxWidth: number;
  detailMaxHeight: number;
};

type DisplayModePopupLayout = {
  shellClassName: string;
  panelClassName: string;
  mediaPaneClassName: string;
  infoPaneClassName: string;
  columnsClassName: string;
  titleClassName: string;
  stacked: boolean;
};

const DISPLAY_MODE_LAYOUTS: Record<DisplayMode, DisplayModeLayout> = {
  [DISPLAY_MODE.FULL]: {
    aspectRatio: "21 / 9",
    previewWidth: 104,
    previewHeight: 45,
    cardWidth: 360,
    detailMaxWidth: 960,
    detailMaxHeight: 410,
  },
  [DISPLAY_MODE.LARGE]: {
    aspectRatio: "16 / 9",
    previewWidth: 96,
    previewHeight: 54,
    cardWidth: 320,
    detailMaxWidth: 840,
    detailMaxHeight: 472,
  },
  [DISPLAY_MODE.SMALL]: {
    aspectRatio: "4 / 3",
    previewWidth: 84,
    previewHeight: 63,
    cardWidth: 280,
    detailMaxWidth: 640,
    detailMaxHeight: 480,
  },
  [DISPLAY_MODE.XSMALL]: {
    aspectRatio: "1 / 1",
    previewWidth: 64,
    previewHeight: 64,
    cardWidth: 240,
    detailMaxWidth: 480,
    detailMaxHeight: 480,
  },
};

const DISPLAY_MODE_POPUP_LAYOUTS: Record<DisplayMode, DisplayModePopupLayout> = {
  [DISPLAY_MODE.FULL]: {
    shellClassName: "items-stretch",
    panelClassName:
      "h-[100dvh] w-[100dvw] rounded-none grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(380px,0.95fr)]",
    mediaPaneClassName: "min-h-[58dvh] lg:min-h-0",
    infoPaneClassName: "p-6 sm:p-8 lg:p-10",
    columnsClassName: "lg:grid-cols-[minmax(0,1.7fr)_minmax(380px,0.95fr)]",
    titleClassName: "text-3xl sm:text-5xl",
    stacked: false,
  },
  [DISPLAY_MODE.LARGE]: {
    shellClassName: "items-center justify-center px-4 py-4 sm:px-6 sm:py-6",
    panelClassName:
      "max-h-[88dvh] w-full max-w-[min(94vw,1240px)] rounded-3xl grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]",
    mediaPaneClassName: "min-h-[44dvh] lg:min-h-0",
    infoPaneClassName: "p-6 sm:p-8 lg:p-9",
    columnsClassName: "lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]",
    titleClassName: "text-3xl sm:text-4xl",
    stacked: false,
  },
  [DISPLAY_MODE.SMALL]: {
    shellClassName: "items-center justify-center px-4 py-4 sm:px-6 sm:py-6",
    panelClassName:
      "max-h-[84dvh] w-full max-w-[min(90vw,960px)] rounded-[28px] grid-cols-1 overflow-y-auto",
    mediaPaneClassName: "h-[32dvh] sm:h-[36dvh]",
    infoPaneClassName: "p-5 sm:p-6 lg:p-7",
    columnsClassName: "grid-cols-1",
    titleClassName: "text-2xl sm:text-3xl",
    stacked: true,
  },
  [DISPLAY_MODE.XSMALL]: {
    shellClassName: "items-center justify-center px-4 py-4 sm:px-6 sm:py-6",
    panelClassName:
      "max-h-[78dvh] w-full max-w-[min(84vw,840px)] rounded-[24px] grid-cols-1 overflow-y-auto",
    mediaPaneClassName: "h-[24dvh] sm:h-[28dvh]",
    infoPaneClassName: "p-4 sm:p-5 lg:p-6",
    columnsClassName: "grid-cols-1",
    titleClassName: "text-2xl sm:text-[1.7rem]",
    stacked: true,
  },
};

export function normalizeDisplayMode(value?: string | null): DisplayMode {
  if (!value) return DISPLAY_MODE.FULL;
  const normalized = value.trim().toLowerCase();
  const found = DISPLAY_MODE_VALUES.find((mode) => mode.toLowerCase() === normalized);
  return found ?? DISPLAY_MODE.FULL;
}

export function getDisplayModeLayout(value?: string | null): DisplayModeLayout {
  return DISPLAY_MODE_LAYOUTS[normalizeDisplayMode(value)];
}

export function getDisplayModeAspectRatio(value?: string | null): string {
  return getDisplayModeLayout(value).aspectRatio;
}

export function getDisplayModePreviewSize(value?: string | null): {
  width: number;
  height: number;
} {
  const layout = getDisplayModeLayout(value);
  return {
    width: layout.previewWidth,
    height: layout.previewHeight,
  };
}

export function getDisplayModeDetailSize(value?: string | null): {
  maxWidth: number;
  maxHeight: number;
} {
  const layout = getDisplayModeLayout(value);
  return {
    maxWidth: layout.detailMaxWidth,
    maxHeight: layout.detailMaxHeight,
  };
}

export function getDisplayModeCardWidth(value?: string | null): number {
  return getDisplayModeLayout(value).cardWidth;
}

export function getDisplayModePopupLayout(
  value?: string | null,
): DisplayModePopupLayout {
  return DISPLAY_MODE_POPUP_LAYOUTS[normalizeDisplayMode(value)];
}
