'use client';

import { Link } from '@/i18n/navigation';
import { trackBuyCourse } from '@/lib/analytics';

type AcademieCourseCtaProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AcademieCourseCta({
  children,
  className,
}: AcademieCourseCtaProps) {
  return (
    <Link
      href="/curs"
      onClick={() => trackBuyCourse('academie_article_curs_page')}
      className={className}
    >
      {children}
    </Link>
  );
}
