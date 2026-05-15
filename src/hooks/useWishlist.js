// ============================================================
// hooks/useWishlist.js — Manages saved articles in localStorage
//
// Usage:
//   const { saved, toggleSave, isSaved, remove } = useWishlist()
//
// All pages that need wishlist functionality import this hook.
// ============================================================

import { useState, useEffect } from 'react';
import { SAVED_KEY } from '../utils/constants';

function useWishlist() {
  // Load initial state from localStorage (empty array if nothing saved)
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever saved changes
  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved]);

  // Toggle an article — saves if not saved, removes if already saved
  const toggleSave = (article) => {
    setSaved(prev => {
      const exists = prev.find(a => a.id === article.id);
      return exists
        ? prev.filter(a => a.id !== article.id)   // remove
        : [...prev, article];                       // add
    });
  };

  // Check if a specific article ID is saved
  const isSaved = (id) => saved.some(a => a.id === id);

  // Remove a specific article by ID
  const remove = (id) => setSaved(prev => prev.filter(a => a.id !== id));

  return { saved, toggleSave, isSaved, remove };
}

export default useWishlist;
