export declare function getNameCheckHash(firstName: string, lastName: string): string;
export declare function getBirthDateCheckHash(birthDate?: string): string | undefined;
export declare function encode(data: string): Uint8Array;
export declare function decode(data: Uint8Array): string;
export declare function str2ab(str: string): ArrayBuffer;
export declare function ab2str(buf: ArrayBuffer): string;
export declare function pack(buffer: ArrayBuffer): string;
export declare function unpack(packed: string): ArrayBuffer;
