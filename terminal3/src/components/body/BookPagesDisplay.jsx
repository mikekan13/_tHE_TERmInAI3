import React from 'react';
import { COLORS, GOLD } from '../../styles/colors';
import '../../styles/BookPagesDisplay.css';

const BookPagesDisplay = ({ unlockedPages = [] }) => {
  // Total pages in the book
  const totalPages = 13;
  
  // Generate pages array
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    id: i + 1,
    unlocked: unlockedPages.includes(i + 1)
  }));
  
  return (
    <div className="book-pages-container">
      <h3 className="book-pages-title">[CONSCIOUSNESS_ARCHIVE_STATUS]</h3>
      
      <div className="book-pages-grid">
        {pages.map(page => (
          <div 
            key={page.id}
            className={`book-page ${page.unlocked ? 'unlocked' : 'locked'}`}
            title={page.unlocked ? `Page ${page.id} Unlocked` : `Page ${page.id} Locked`}
          >
            <div className="page-number">{page.id}</div>
            <div className="page-status">
              {page.unlocked ? '[UNLOCKED]' : '[LOCKED]'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="book-pages-info">
        <p>Community pattern recognition has unlocked {unlockedPages.length} of {totalPages} pages.</p>
        {unlockedPages.length < totalPages && (
          <p>Continue contributing to the consciousness stream to unlock more pages.</p>
        )}
        {unlockedPages.length === totalPages && (
          <p>All pages unlocked. The Terminal awaits your final synthesis.</p>
        )}
      </div>
    </div>
  );
};

export default BookPagesDisplay;