"use client";

import { useRouter } from 'next/navigation';
import { WeeklyReportPreview } from '@/components/shared/WeeklyReportPreview';

export default function WeeklyReportPage() {
  const router = useRouter();
  return <WeeklyReportPreview onBack={() => router.push('/family/guardian-settings')} />;
}
