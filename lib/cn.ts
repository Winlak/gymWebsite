type ClassName = string | false | null | undefined;

export const cn = (...classes: ClassName[]) => classes.filter(Boolean).join(" ");
