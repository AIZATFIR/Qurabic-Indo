import type { Metadata } from 'next';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Ketentuan penggunaan · Terms of use · Qurabic',
  description: 'Ketentuan penggunaan, sumber konten, dan batas layanan Qurabic.',
};

export default function TermsPage() {
  return <TermsContent />;
}
