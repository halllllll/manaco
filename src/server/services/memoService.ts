import type { MemoListDTO } from '@/shared/types/dto';

import { getMemos } from '../repositories/memoListRepository';

export function getMemoListService(): MemoListDTO {
  try {
    const memoList = getMemos();
    return {
      success: true,
      data: memoList,
    };
  } catch (e) {
    console.error(e);
    const err = e as Error;
    return {
      success: false,
      message: `Error: ${err.name} - ${err.message}`,
    };
  }
}
