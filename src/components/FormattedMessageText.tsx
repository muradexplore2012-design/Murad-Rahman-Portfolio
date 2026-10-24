import React from 'react';

interface FormattedMessageTextProps {
  text: string;
  isLight?: boolean;
  className?: string;
}

// Matches full http/https URLs and www. links, cleanly separating trailing punctuation
const URL_REGEX = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s]|www\.[^\s<]+[^<.,:;"')\]\s])/gi;

/**
 * Automatically converts web links into safe, clickable <a> anchors
 * opening in a new tab without altering plain text.
 */
export const FormattedMessageText: React.FC<FormattedMessageTextProps> = ({
  text,
  isLight = false,
  className = '',
}) => {
  if (!text) return null;

  const parts = text.split(URL_REGEX);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(URL_REGEX)) {
          const href =
            part.startsWith('http://') || part.startsWith('https://')
              ? part
              : `https://${part}`;

          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`underline underline-offset-2 font-semibold break-all cursor-pointer transition-opacity hover:opacity-80 inline-block ${
                isLight
                  ? 'text-[#0284c7] hover:text-[#0369a1]'
                  : 'text-sky-100 hover:text-white'
              }`}
              title={`ভিজিট করুন: ${href}`}
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
