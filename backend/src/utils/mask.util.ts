import { MASK_CONSTANTS } from '../configs/constants.config';

export const maskName = (fullName: string): string => {
  const { NAME_VISIBLE_CHARS, MASK_CHAR } = MASK_CONSTANTS;
  const visiblePart = fullName.slice(-NAME_VISIBLE_CHARS);
  return `${MASK_CHAR.repeat(4)}${visiblePart}`;
};
