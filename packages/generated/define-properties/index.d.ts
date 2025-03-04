declare function defineProperties<M extends object>(object: object, map: M & ThisType<any>, predicates?: Partial<Record<keyof M, () => boolean>>): void;
export default defineProperties;
