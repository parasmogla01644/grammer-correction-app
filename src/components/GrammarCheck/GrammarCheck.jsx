import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import './GrammarCheck.scss';
import { GrammarCheckText } from './GrammarCheckText';
import { checkGrammarText } from '../../services/grammar.service';


function GrammarCheck({ onLogout }) {
  const [text, setText] = useState('');
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState('');
  const [hasNoErrors, setNoErrors] = useState(false);
  
  const checkGrammar = useCallback(async (text) => {
    
    const token = localStorage.getItem('token');

    setChecking(true);
    setApiError('');
    
    if (!token) {
      console.error('No authentication token found');
      setApiError('Authentication error. Please try logging in again.');
      setChecking(false);
      return;
    }
    
    try {
      const response = await checkGrammarText({token, text});     
      console.info('%csrc/components/GrammarCheck.jsx:34 response', 'color: white; background-color: #007acc;', response);
      const foundErrors = response.data.errors || [];
      setErrors(foundErrors);
      if (foundErrors.length === 0) {
        setNoErrors(true);
      }
    } catch (error) {
      console.error('Error checking grammar:', error);
      if (error.response?.status === 500) {
        if (error.response.data?.error?.includes('OpenAI')) {
          setApiError('OpenAI API error. Please check your API key configuration.');
        } else {
          setApiError('Grammar check failed: ' + (error.response.data?.message || error.message));
        }
      } else {
        setApiError('Something went wrong. Please try again later.');
      }
      setErrors([]);
    } finally {
      setChecking(false);
    }
  }, [ checking]);



function handleDebounceFn(inputValue) {
    checkGrammar(inputValue);
}

const debounceFn = useCallback(debounce(handleDebounceFn, 1000), []);

function handleChange (event) {
    setErrors([]);
    setNoErrors(false);
    setText(event.target.value);
    debounceFn(event.target.value);
};



  return (
    <div className="grammar-check__container">
      <div className="grammar-check__header">
        <h1 className="grammar-check__title">Grammar Correction App</h1>
        <button className="grammar-check__logout-button" onClick={onLogout}>Logout</button>
      </div>
      
      <div className="grammar-check__content">
        <div className="grammar-check__section">
          <h3 className="grammar-check__section-title">Live Preview {checking && '(Checking...)'}</h3>
          {apiError && (
            <div className="grammar-check__api-error">
              <p>{apiError}</p>
            </div>
          )}
          <div className="grammar-check__preview-area">
            <GrammarCheckText 
              text={text} 
              errors={errors} 
              key={errors.length}
              hasNoErrors={hasNoErrors} 
            />
          </div>
          <p className="grammar-check__tips">
             Hover over highlighted errors to see suggestions and explanations.
          </p>
        </div>
        
        <div className="grammar-check__section">
          <h3 className="grammar-check__section-title">Enter Text</h3>
          <textarea
            className="grammar-check__textarea"
            value={text}
            onChange={handleChange}
            placeholder="Enter text to check for errors"
            rows={8}
          />
          <p className="grammar-check__help-text">
            Start typing to see grammar corrections. Errors will be highlighted in the preview above.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GrammarCheck; 