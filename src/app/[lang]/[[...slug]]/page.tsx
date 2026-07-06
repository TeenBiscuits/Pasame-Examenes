import type { Metadata } from "next";
import LegacyRedirect from "../../[[...path]]/legacy-redirect";
import ClientApp from "./client-app";
import { getRouteMetadata, getStaticRouteParams, isLang } from "../../../lib/next-seo";

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export function generateStaticParams() {
  return getStaticRouteParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug = [] } = await params;
  return getRouteMetadata(isLang(lang) ? lang : "es", slug);
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) return <LegacyRedirect />;
  const safeLang = isLang(lang) ? lang : "es";
  return <ClientApp key={safeLang} lang={safeLang} />;
}
