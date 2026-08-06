export const GHANA_CLASS_HIERARCHY = [
  'Creche',
  'Nursery',
  'Kindergarten 1',
  'Kindergarten 2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'JHS 1',
  'JHS 2',
  'JHS 3'
] as const;

export type GhanaClassLevel = typeof GHANA_CLASS_HIERARCHY[number];

export const DEFAULT_CLASS_TERM_FEES: Record<string, number> = {
  'Creche': 400,
  'Nursery': 400,
  'Kindergarten 1': 400,
  'Kindergarten 2': 400,
  'Grade 1': 450,
  'Grade 2': 450,
  'Grade 3': 450,
  'Grade 4': 500,
  'Grade 5': 500,
  'Grade 6': 500,
  'JHS 1': 550,
  'JHS 2': 550,
  'JHS 3': 550
};

export const getDefaultTermFee = (className: string): number => {
  return DEFAULT_CLASS_TERM_FEES[className] || 400;
};

export const GHANA_TERMS = [
  'First Term (Term 1)',
  'Second Term (Term 2)',
  'Third Term (Term 3)'
] as const;

export type GhanaTerm = typeof GHANA_TERMS[number];

export const getNextClass = (currentClass: string): { nextClass: string; isGraduating: boolean } => {
  const index = GHANA_CLASS_HIERARCHY.indexOf(currentClass as any);
  if (index === -1) {
    return { nextClass: currentClass, isGraduating: false };
  }
  if (index === GHANA_CLASS_HIERARCHY.length - 1) {
    return { nextClass: 'Graduated (Alumni)', isGraduating: true };
  }
  return { nextClass: GHANA_CLASS_HIERARCHY[index + 1], isGraduating: false };
};
