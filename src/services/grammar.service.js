import axios from 'axios';

export const checkGrammarText = async ({token, text}) => {
    const response = await axios.post('/api/grammar/check', 
      { text }, 
      {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      }
    );
  
    return response;
  };