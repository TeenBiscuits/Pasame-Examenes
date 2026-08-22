import type { ActiveOptions } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";
import { useLang } from "../i18n/hooks";

type LangLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
	to: string;
	activeOptions?: ActiveOptions;
};

export function LangLink({ to: path, ...props }: LangLinkProps) {
	const { lang } = useLang();
	const to = `/${lang}${path}`;
	return <Link {...props} to={to as never} />;
}
