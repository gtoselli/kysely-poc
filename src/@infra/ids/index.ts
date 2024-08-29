import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 10);

export const generateId = (prefix: string) => {
  return `${prefix}_${nanoid()}`;
};
