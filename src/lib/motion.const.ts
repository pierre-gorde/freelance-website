export const MEDIA_MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const MEDIA_POINTER_FINE = '(pointer: fine)';
export const MEDIA_DESKTOP = '(min-width: 900px)';
export const MEDIA_MOBILE = '(max-width: 899px)';

export const EASE_OUT = 'expo.out';
export const EASE_FOLLOW = 'power3';

/** Joue à l'entrée, se rembobine quand on remonte : la page réagit dans les deux sens. */
export const TOGGLE_REPLAY = 'play none none reverse';
export const START_ENTER = 'top 85%';
export const START_ENTER_LATE = 'top 65%';

/** Rotations des mots qui se posent, en degrés : un lettrage de BD, pas une grille. */
export const SLAM_ROTATIONS = [-6, 4, -3, 5, -4, 3] as const;
export const SLAM_SCALE = 1.4;
export const STAMP_SCALE = 1.9;
export const POP_SCALE = 2.2;

export const RISE_OFFSET = 56;
export const RISE_ROTATIONS = [-3, 2, -2, 3] as const;

export const MAGNET_PULL_X = 0.22;
export const MAGNET_PULL_Y = 0.32;

export const EMAIL_COPIED_DURATION_MS = 1800;
