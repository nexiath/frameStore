'use client';

import { motion } from 'framer-motion';

interface JsonPreviewProps {
  json: string;
}

export function JsonPreview({ json }: JsonPreviewProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className="language-json">{json}</code>
      </pre>
    </motion.div>
  );
}