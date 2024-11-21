// components/SocialButtons.tsx
'use client';

import React from 'react';
import { FaLinkedin, FaGithub, FaXTwitter, FaItchIo } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';
import { IconType } from 'react-icons';
import { Button } from './ui/button';

interface SocialLink {
  href: string;
  icon: IconType;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/adrieldf/',
    icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/Adrieldf',
    icon: FaGithub,
    label: 'GitHub',
  },
  {
    href: 'https://x.com/adriel_df',
    icon: FaXTwitter,
    label: 'X',
  },
  {
    href: 'https://adrieldf.itch.io',
    icon: FaItchIo,
    label: 'Itch.io',
  },
  {
    href: 'mailto:adriel.idf@gmail.com',
    icon: IoMdMail,
    label: 'E-mail me',
  },
];

const SocialButtons: React.FC = () => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      {socialLinks.map((social) => (
        <Button
          key={social.label}
          asChild
          variant="ghost"
          size="icon"
          aria-label={social.label}
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
          >
            <social.icon className="w-6 h-6" />
          </a>
        </Button>
      ))}
    </div>
  );
};

export default SocialButtons;
