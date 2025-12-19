"use client";

import { useRouter } from 'next/navigation';
import { AddStudentScreen } from '@/components/family/AddStudentScreen';
import { useApp } from '@/context/AppContext';

export default function AddStudentPage() {
  const router = useRouter();
  const { userId } = useApp();

  return (
    <AddStudentScreen
      onBack={() => router.push('/family/dashboard')}
      parentUserId={userId}
    />
  );
}
