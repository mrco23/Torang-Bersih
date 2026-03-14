// components/ui/ProseStyles.jsx
import React from "react";

export const ProseStyles = () => (
  <style>{`
    .prose ul {
      list-style-type: disc;
      padding-left: 2rem;
      margin: 1rem 0;
    }
    
    .prose ol {
      list-style-type: decimal;
      padding-left: 2rem;
      margin: 1rem 0;
    }
    
    .prose ul ul {
      list-style-type: circle;
    }
    
    .prose ol ol {
      list-style-type: lower-alpha;
    }
    
    .prose li {
      margin: 0.5rem 0;
      line-height: 1.7;
    }
    
    .prose blockquote {
      border-left: 4px solid var(--primary, #1e1f78);
      background: linear-gradient(to right, color-mix(in srgb, var(--primary) 8%, transparent), transparent);
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: var(--gray, #696969);
      border-radius: 0 8px 8px 0;
    }
    
    .prose blockquote p {
      margin: 0;
    }
    
    .prose hr {
      border: none;
      border-top: 2px solid var(--gray-shine, #f3f3fc);
      margin: 2rem 0;
    }
    
    .prose h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 2rem 0 1rem;
      color: var(--dark-text, #2c2c2c);
    }
    
    .prose h3 {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 1.5rem 0 0.75rem;
      color: var(--dark-text, #2c2c2c);
    }
    
    .prose a {
      color: var(--accent, #5697ff);
      text-decoration: underline;
      font-weight: 500;
    }
    
    .prose img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .prose p {
      margin: 1rem 0;
    }
  `}</style>
);

export default ProseStyles;