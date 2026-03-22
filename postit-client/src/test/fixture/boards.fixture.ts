import { Board } from '@app/model/postit/board';

export function defaultBoardMock(): Board {
  return {
    id: 1,
    name: 'Board 1',
    orderNum: 100,
  };
}

export function defaultBoardListMock(): Board[] {
  return [
    {
      id: 1,
      name: 'Board 1',
      orderNum: 100,
    },
    {
      id: 2,
      name: 'Board 2',
      orderNum: 200,
    },
    {
      id: 3,
      name: 'Board 3',
      orderNum: 300,
    },
  ] as Board[];
}

export function defaultOtherBoardListMock(): Board[] {
  return [
    {
      id: 2,
      name: 'Other Board 2',
      orderNum: 200,
    },
    {
      id: 3,
      name: 'Other Board 3',
      orderNum: 300,
    },
  ] as Board[];
}

export function newBoardMock(id: number): Board {
  return {
    id,
    name: `Board ${id}`,
    orderNum: id * 100,
  } as Board;
}
