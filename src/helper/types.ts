export type UniformTuple<L extends number, T, R extends T[] = []> = R extends {length: L}
    ? R
    : UniformTuple<L, T, [...R, T]>
