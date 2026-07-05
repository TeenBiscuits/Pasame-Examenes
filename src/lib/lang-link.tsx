import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { useLang } from "../i18n/hooks";

type LangLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
};

export function LangLink(props: LangLinkProps) {
  const { lang } = useLang();
  const { to, ...rest } = props;
  const href = `/${lang}${to}`;
  return <Link {...rest} href={href} />;
}
