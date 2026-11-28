import type { Metadata } from 'next';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi · Qurabic',
  description: 'Cara Qurabic menyimpan preferensi dan berkomunikasi dengan layanan pihak ketiga.',
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
