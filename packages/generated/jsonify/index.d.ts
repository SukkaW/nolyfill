export declare const parse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any, stringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
};
