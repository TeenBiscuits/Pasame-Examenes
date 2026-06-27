import { Link, type LinkProps } from "react-router-dom";
import { useLang } from "../i18n/hooks";

export function LangLink(props: LinkProps) {
  const { lang } = useLang();
  const to = typeof props.to === "string" ? `/${lang}${props.to}` : props.to;
  return <Link {...props} to={to} />;
}
