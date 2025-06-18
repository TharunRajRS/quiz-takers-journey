
import { ExamProvider } from '@/contexts/ExamContext';
import ResultsComponent from '@/components/ResultsComponent';

const ResultsPage = () => {
  return (
    <ExamProvider>
      <ResultsComponent />
    </ExamProvider>
  );
};

export default ResultsPage;
