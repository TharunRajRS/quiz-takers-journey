
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamProvider } from '@/contexts/ExamContext';
import ExamComponent from '@/components/ExamComponent';

const ExamPage = () => {
  return (
    <ExamProvider>
      <ExamComponent />
    </ExamProvider>
  );
};

export default ExamPage;
