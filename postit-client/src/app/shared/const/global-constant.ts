
export class GlobalConstant {

    public static readonly Parameter = class Parameter {
        public static readonly BOARD_MAX = 'board.max';
        public static readonly NOTE_MAX = 'note.max';
    };

    public static readonly Display = class Display {
        public static readonly DIALOG_WIDTH = '450px';
        public static readonly NOTIFICATION_DELAY = 2000;
    };

    public static readonly Functional = class Functional {
        public static readonly VALID_COLOR_LIST = ['white', 'yellow', 'orange', 'blue', 'green', 'pink'];
        public static readonly DEFAULT_COLOR = 'yellow';
    };

}
