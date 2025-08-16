
import React, { LabelHTMLAttributes } from 'react';

export const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  <label
    {...props}
    className="text-xs text-zinc-400 font-medium"
  />
);