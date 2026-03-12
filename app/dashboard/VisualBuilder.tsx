'use client';

import CustomPageBuilder from './CustomPageBuilder';

interface VisualBuilderProps {
  primaryColor?: string;
  orgId?: string;
  onSaveSuccess?: () => void;
}

export default function VisualBuilder({ primaryColor = '#163A63', orgId, onSaveSuccess }: VisualBuilderProps) {
  const siteUrl =
    typeof window !== 'undefined' && orgId
      ? `${window.location.origin}/site/${orgId}`
      : orgId
      ? `/site/${orgId}`
      : undefined;

  return (
    <CustomPageBuilder
      primaryColor={primaryColor}
      orgId={orgId}
      siteUrl={siteUrl}
      onPublishSuccess={onSaveSuccess}
    />
  );
}
