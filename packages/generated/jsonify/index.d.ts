export declare const parse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
export declare const stringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
};
