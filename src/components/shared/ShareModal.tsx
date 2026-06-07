import { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, MessageCircle, Send, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/I18nProvider";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}

export function ShareModal({ open, onOpenChange, url, title }: ShareModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareTelegram = () => {
    const encoded = encodeURIComponent(url);
    const text = encodeURIComponent(title);
    window.open(`https://t.me/share/url?url=${encoded}&text=${text}`, "_blank");
  };

  const shareFacebook = () => {
    const encoded = encodeURIComponent(url);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      "_blank",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("share.title")}</DialogTitle>
          <DialogDescription>{t("share.description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="rounded-xl border bg-white p-4">
            <QRCodeSVG value={url} size={180} level="M" />
          </div>

          <div className="flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
            <span className="flex-1 truncate text-sm">{url}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              aria-label={t("share.copy")}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid w-full grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1.5 h-auto py-3 bg-green-50 hover:bg-green-100 border-green-200"
              onClick={shareWhatsApp}
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1.5 h-auto py-3 bg-blue-50 hover:bg-blue-100 border-blue-200"
              onClick={shareTelegram}
            >
              <Send className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Telegram</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1.5 h-auto py-3 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
              onClick={shareFacebook}
            >
              <Share2 className="h-5 w-5 text-indigo-600" />
              <span className="text-xs">Facebook</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
