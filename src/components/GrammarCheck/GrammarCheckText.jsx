import React, { useState, useEffect, useRef, useCallback } from 'react';

function HighlightedErrorSubstring({ errorText, suggestion, reason }) {
    return (
      <span className="highlighted-error">
        {errorText}
        <span className="tooltip">
          <strong>Suggestion:</strong> {suggestion || 'No suggestion'}
          <small className="tooltip__reason">{reason || ''}</small>
        </span>
      </span>
    );
  }


const NoErrors = ({text}) => {
  return (
    <div className="no-errors__container">
      {text}
      <div className="no-errors__badge">✓ No errors found</div>
    </div>
  );
}


  export function GrammarCheckText({ text, errors, hasNoErrors }) {
    console.log(text, errors, hasNoErrors)
    if (!errors.length && hasNoErrors) {
      return <NoErrors text={text} />
    }
    if (!errors.length) {
      return <div>{text}</div>;
    }
    const sortedErrors = [...errors].sort((prev, next) => prev.position - next.position);
    const segments = [];
    let lastIndex = 0;
    
    sortedErrors.forEach((error, index) => {
      const { position, length, suggestion, reason } = error;
      if (position >= 0 && length >= 0) {
        if (position > lastIndex) {
          segments.push(
            <span key={`text-${index}`}>
              {text.substring(lastIndex, position)}
            </span>
          );
        }
        segments.push(
          <HighlightedErrorSubstring 
            key={`error-${index}`}
            errorText={text.substring(position, position + length)}
            suggestion={suggestion}
            reason={reason}
          />
        );
        
        lastIndex = position + length;
      }
    });
    
    if (lastIndex < text.length) {
      segments.push(
        <span key="text-end">
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <div>{segments}</div>;
  }

  