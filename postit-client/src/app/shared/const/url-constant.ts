import { environment } from '../../../environments/environment';

export class UrlConstant {

    public static readonly BASE = environment.baseUrl;

    public static readonly Global = class Global {
        private static readonly PREFIX = '/global';

        public static readonly STATUS = Global.PREFIX + '/status';
        public static readonly PARAMETERS = Global.PREFIX + '/parameters';
        public static readonly LIKE = Global.PREFIX + '/likes';
        public static readonly LIKE_COUNT = Global.PREFIX + '/likes/count';
    };

    public static readonly Postit = class Postit {
        private static readonly PREFIX = '/postit';

        public static readonly BOARDS = Postit.PREFIX + '/boards';
        public static readonly NOTES = Postit.PREFIX + '/notes';
    };

}
