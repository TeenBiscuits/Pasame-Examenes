import LegacyRedirect from "./legacy-redirect";

export function generateStaticParams() {
  return [{ path: [] }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  await params;
  return <LegacyRedirect />;
}
