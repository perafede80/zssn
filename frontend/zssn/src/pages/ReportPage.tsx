import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { reportSurvivor } from '../api/survivorApi';

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const reporter = location.state?.reporter;
  const reported = location.state?.reported;
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  if (!reporter || !reported) {
    return (
      <Typography color="error">{t('REPORT_PAGE.ERROR_MESSAGE')}</Typography>
    );
  }

  const handleSubmit = async () => {
    try {
      await reportSurvivor(reported.id, reporter.id, comments);
      alert(t('REPORT_PAGE.REPORT.SUBMITTED_SUCCESSFULLY'));
      navigate('/survivors/');
    } catch (error) {
      console.error(`{t("REPORT_PAGE.REPORT.SUBMISSION_FAILED)}`, error);
      setError(t('REPORT_PAGE.REPORT.SUBMISSION_FAILED'));
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        {t('REPORT_PAGE.REPORT.FORM.TITLE')} {reported.name}
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <TextField
        label={t('REPORT_PAGE.REPORT.FORM.COMMENTS')}
        multiline
        fullWidth
        rows={4}
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        {t('REPORT_PAGE.REPORT.FORM.SUBMIT')}
      </Button>
    </Box>
  );
};

export default ReportPage;
