import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-sage-200/50 bg-sage-50/30 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-lg font-bold text-sage-900">QuranScan</span>
            <p className="text-sm text-sage-600 mt-1 text-center sm:text-left">
              Authentic Indo-Pak Mushaf typography
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-sage-600 hover:text-sage-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-sage-600 hover:text-sage-900 transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-sage-200/50">
          <p className="text-center text-xs text-sage-500">
            © {new Date().getFullYear()} QuranScan. Built with reverence for traditional Islamic typography.
          </p>
        </div>
      </div>
    </footer>
  )
}
