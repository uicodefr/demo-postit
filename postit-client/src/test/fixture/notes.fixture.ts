import { AttachedFile } from '@app/model/postit/attached-file';
import { PostitNote } from '@app/model/postit/postit-note';

export function defaultNoteMock(): PostitNote {
  return {
    id: 1,
    name: 'Note Title',
    text: 'Note Text Content',
    boardId: 1,
    color: 'green',
    orderNum: 10,
    attachedFile: null,
  } as PostitNote;
}

export function defaultNoteListMock(): PostitNote[] {
  return [
    defaultNoteMock(),
    {
      id: 2,
      name: 'Note Title 2',
      text: 'Note Text Content 2',
      boardId: 1,
      color: 'blue',
      orderNum: 20,
      attachedFile: null,
    },
  ];
}

export function defaultAttachedFileMock(): AttachedFile {
  return {
    id: 11,
    filename: 'filenameTest.jpg',
    type: 'image/jpeg',
    size: 2050000,
    postitNoteId: 1,
  } as AttachedFile;
}

export function noteWithAttachedFileMock(): PostitNote {
  return {
    ...defaultNoteMock(),
    attachedFile: defaultAttachedFileMock(),
  } as PostitNote;
}
