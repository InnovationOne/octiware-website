interface HubFooterProps {
  rights: string;
}

export default function HubFooter({ rights }: HubFooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="flex-shrink-0 py-4 text-center border-t border-border">
      <p className="text-text-muted text-xs tracking-wide">
        © {year} Octiware. {rights}
      </p>
    </footer>
  );
}
