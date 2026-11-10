import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillTagInput = ({ value = [], onChange, placeholder = 'Type and press Enter...' }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="skill-tag-input" onClick={() => inputRef.current?.focus()}>
      <AnimatePresence>
        {value.map((tag) => (
          <motion.span
            key={tag}
            className="skill-tag"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {tag}
            <button className="skill-tag-remove" onClick={(e) => { e.stopPropagation(); removeTag(tag); }} type="button">
              ✕
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
      />
    </div>
  );
};

export default SkillTagInput;
