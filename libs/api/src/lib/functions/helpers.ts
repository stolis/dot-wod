export function enum_byValue<T extends {[index:string]:string}>(myEnum:T, enumValue:string):keyof T|null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}

export function toDTO(item: any, removeProps: Array<string>) {
    if (removeProps?.length > 0){
        const removeProp = removeProps.pop();
        const { [removeProp!]: remove, ...rest } = item;
        item = toDTO(rest,removeProps);
        return item;    
    }
    return item; 
}

export function compareWith(f1: any, f2: any) {
  if (Array.isArray(f2)) {
    if (!f1) {
      return false;
    }
    return f2.find(val => val === f1);
  }
  return f1 === f2;
};

export function dateDiff(a: Date, b: Date) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
  return Math.floor(utc2 - utc1);
}

type IsOptional<T> = Extract<T, undefined> extends never ? false : true
export type Func = (...args: any[]) => any
type IsFunction<T> = T extends Func ? true : false
type IsValueType<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  | Func
  | Set<any>
  | Map<any, any>
  | Date
  | Array<any>
  ? true
  : false

type ReplaceDate<T> = T extends Date ? string : T
type ReplaceSet<T> = T extends Set<infer X> ? X[] : T
type ReplaceMap<T> = T extends Map<infer K, infer I>
  ? Record<
      K extends string | number | symbol ? K : string,
      IsValueType<I> extends true ? I : { [K in keyof ExcludeFuncsFromObj<I>]: Dto<I[K]> }
    >
  : T
type ReplaceArray<T> = T extends Array<infer X> ? Dto<X>[] : T

type ExcludeFuncsFromObj<T> = Pick<T, { [K in keyof T]: IsFunction<T[K]> extends true ? never : K }[keyof T]>

type Dtoified<T> = IsValueType<T> extends true
  ? ReplaceDate<ReplaceMap<ReplaceSet<ReplaceArray<T>>>>
  : { [K in keyof ExcludeFuncsFromObj<T>]: Dto<T[K]> }

export type Dto<T> = IsFunction<T> extends true
  ? never
  : IsOptional<T> extends true
  ? Dtoified<Exclude<T, undefined>> | null
  : Dtoified<T>

export type Serializable<T> = T & { serialize(): Dto<T> }