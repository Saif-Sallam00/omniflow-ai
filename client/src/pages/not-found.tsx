import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function NotFound() {
  const { t } = useI18n();
  useDocumentTitle("Page not found");
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-7 w-7 text-orange-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
          {t("notFound.title")}
        </h1>
        <p className="text-slate-400 mb-8">
          {t("notFound.body")}
        </p>
        <Link href="/">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6">
            {t("notFound.button")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
