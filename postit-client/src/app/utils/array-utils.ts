export class ArrayUtils {

    public static removeElement<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean) {
        const indexFound = array.findIndex(predicate);
        if (indexFound > -1) {
            array.splice(indexFound, 1);
        }
    }

    private ArrayUtils() {
    }

}
