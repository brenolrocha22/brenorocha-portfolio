import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { slugifyHeading } from "@/lib/content/toc";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { cn } from "@/lib/utils";

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

function H2({ children, className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      id={slugifyHeading(textOf(children))}
      className={cn("mt-12 font-serif text-h1 font-normal first:mt-0", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ className, ...props }: ComponentPropsWithoutRef<"h3">) {
  return <h3 className={cn("mt-8 text-h3 font-semibold", className)} {...props} />;
}

function Paragraph({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("mt-4 text-muted-foreground", className)} {...props} />;
}

function UnorderedList({ className, ...props }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className={cn("mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-subtle", className)}
      {...props}
    />
  );
}

function OrderedList({ className, ...props }: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className={cn(
        "mt-4 list-decimal space-y-2 pl-5 text-muted-foreground marker:font-mono marker:text-subtle",
        className,
      )}
      {...props}
    />
  );
}

function Strong({ className, ...props }: ComponentPropsWithoutRef<"strong">) {
  return <strong className={cn("font-semibold text-foreground", className)} {...props} />;
}

function InlineCode({ className, ...props }: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className={cn(
        "rounded-sm border border-border bg-surface-2 px-1 py-0.5 font-mono [overflow-wrap:anywhere] text-[0.875em] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Anchor({ href = "", className, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const classes = cn(
    "text-accent underline-offset-4 hover:underline focus-visible:underline",
    className,
  );
  if (/^https?:\/\//.test(href)) {
    return (
      <ExternalLink href={href} className={classes} showIcon={false}>
        {children}
      </ExternalLink>
    );
  }
  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  strong: Strong,
  code: InlineCode,
  a: Anchor,
};
