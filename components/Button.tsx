'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

export default function Button({ children, href, onClick, variant = 'primary', className }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all';

  const variants: Record<string, string> = {
    primary:
      'bg-casaOlive text-white shadow-md hover:bg-casaCoffee focus:ring-casaOlive px-6 py-2 text-lg',
    secondary:
      'bg-white text-casaCoffee border-2 border-casaOlive shadow-sm hover:bg-casaOlive hover:text-white focus:ring-casaOlive px-6 py-2 text-lg',
    ghost: 'bg-transparent text-casaCoffee px-4 py-2 text-base',
  };

  const classes = clsx(base, variants[variant], 'text-shadow-soft', className);

  if (href) {
    // Use next/link for internal navigation
    const internal = href.startsWith('#') || href.startsWith('/');
    if (internal) {
      return (
        <Link href={href} onClick={onClick} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
