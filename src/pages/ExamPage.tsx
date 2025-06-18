
import { ExamProvider } from '@/contexts/ExamContext';
import AuthComponent from '@/components/AuthComponent';
import ExamComponent from '@/components/ExamComponent';
import { useExam } from '@/contexts/ExamContext';

const ExamPageContent = () => {
  const { isAuthenticated, authenticate } = useExam();

  if (!isAuthenticated) {
    return <AuthComponent onAuthenticated={authenticate} />;
  }

  return <ExamComponent />;
};

const ExamPage = () => {
  return (
    <ExamProvider>
      <ExamPageContent />
    </ExamProvider>
  );
};

export default ExamPage;
