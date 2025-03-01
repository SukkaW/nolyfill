declare const create: () => {
    get: (key: any) => any;
    set: (key: any, value: any) => void;
    has: (key: any) => boolean;
    assert: (key: any) => void;
};
export default create;
