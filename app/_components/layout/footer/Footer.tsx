import React from 'react';
import Link from "next/link";
import { contactFormUrl } from '@/lib/links/links';
import { FaExternalLinkAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="p-6 w-full bg-secondary text-white text-sm border-t border-white/10">
      <div className="max-w-[768px] mx-auto ">
        <div className='flex items-center justify-center'>
          {/* 左側：サービス名 */}
          <div className="text-center sm:text-left pr-6">
            <p className="text-xl font-bold">WeBalance</p>
          </div>

          {/* 中央：ナビゲーション */}
          <nav className="flex flex-col sm:flex-row  items-start gap-2 sm:gap-4 border-l border-white pl-6 font-bold">
            <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:underline">利用規約</Link>
            <Link
              href={contactFormUrl}
              className="hover:underline flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>問い合わせ</span>
              <FaExternalLinkAlt />
            </Link>
          </nav>
        </div>

        {/* 右側：コピーライト */}
        <p className="text-xs text-white text-center mt-6">
          &copy; {new Date().getFullYear()} WeBalance. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
