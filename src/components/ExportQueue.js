import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Download,
    TrendingUp,
    Psychology, Assessment
} from '@mui/icons-material';

function ExportQueue({ applications }) {
  const [exporting, setExporting] = useState(false);
  const [exportData, setExportData] = useState(null);

  const handleExportQueue = async () => {
    setExporting(true);
    try {
      const baseURL = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${baseURL}/export-queue`);
      const data = await response.json();
      setExportData(data);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!exportData) return;

    const headers = [
      'Priority Rank',
      'Organization',
      'Project Title',
      'Category',
      'Requested Amount',
      'Risk Score',
      'Eligibility Score',
      'Completeness Score',
      'Status',
      'Submitted Date',
    ];

    const csvContent = [
      headers.join(','),
      ...exportData.prioritized_queue.map((app, index) => [
        index + 1,
        `"${app.organization}"`,
        `"${app.project_title}"`,
        app.category,
        app.requested_amount,
        (app.risk_score * 100).toFixed(1),
        (app.eligibility_score * 100).toFixed(1),
        (app.completeness_score * 100).toFixed(1),
        app.status,
        app.submitted_date,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grant-queue-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getRiskColor = (score) => {
    if (score <= 0.3) return '#4caf50';
    if (score <= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getRiskLabel = (score) => {
    if (score <= 0.3) return 'Low';
    if (score <= 0.6) return 'Medium';
    return 'High';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#4caf50';
      case 'Under Review':
        return '#ff9800';
      case 'Rejected':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Export Controls */}
      <Grid item xs={12}>
        <Card className="card-hover">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Export Prioritized Queue
              </Typography>
              <Chip
                icon={<Psychology />}
                label="AI-Powered Prioritization"
                color="primary"
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Generate a prioritized application queue based on AI risk assessment, eligibility scores, and completeness checks.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={exporting ? <CircularProgress size={20} /> : <Assessment />}
                onClick={handleExportQueue}
                disabled={exporting}
              >
                {exporting ? 'Generating Queue...' : 'Generate Prioritized Queue'}
              </Button>
              
              {exportData && (
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadCSV}
                >
                  Download CSV
                </Button>
              )}
            </Box>

            {exportData && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Queue Generated Successfully!</strong> Export date: {exportData.export_date}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Queue Statistics */}
      {exportData && (
        <Grid item xs={12} md={4}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Queue Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Applications
                </Typography>
                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {exportData.total_applications}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Top Priority Applications
                </Typography>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {exportData.prioritized_queue.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Processing Notes
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {exportData.processing_notes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Priority Queue Table */}
      {exportData && (
        <Grid item xs={12} md={8}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prioritized Application Queue
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Risk Score</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exportData.prioritized_queue.map((application, index) => (
                      <TableRow
                        key={application.id}
                        sx={{
                          '&:hover': { bgcolor: '#f8f9fa' },
                          bgcolor: index < 3 ? '#f0f8ff' : 'inherit',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 'bold',
                                color: index < 3 ? '#1976d2' : '#666',
                              }}
                            >
                              #{index + 1}
                            </Typography>
                            {index < 3 && (
                              <TrendingUp sx={{ ml: 1, color: '#1976d2', fontSize: 16 }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {application.organization}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {application.neighborhood}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {application.project_title}
                          </Typography>
                          <Chip
                            label={application.category}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: getRiskColor(application.risk_score),
                                fontWeight: 'bold',
                                mr: 1,
                              }}
                            >
                              {(application.risk_score * 100).toFixed(0)}%
                            </Typography>
                            <Chip
                              label={getRiskLabel(application.risk_score)}
                              size="small"
                              sx={{
                                bgcolor: getRiskColor(application.risk_score),
                                color: 'white',
                                fontSize: '0.75rem',
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            ${application.requested_amount?.toLocaleString() || '0'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={application.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(application.status),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Processing Information */}
      {exportData && (
        <Grid item xs={12}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processing Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Prioritization Criteria
                    </Typography>
                    <Typography variant="body1">
                      • Risk Score (Lowest first)
                    </Typography>
                    <Typography variant="body1">
                      • Eligibility Score (Highest first)
                    </Typography>
                    <Typography variant="body1">
                      • Completeness Score (Highest first)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      AI Analysis Benefits
                    </Typography>
                    <Typography variant="body1">
                      • 80% reduction in processing time
                    </Typography>
                    <Typography variant="body1">
                      • Consistent evaluation criteria
                    </Typography>
                    <Typography variant="body1">
                      • Risk-based prioritization
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default ExportQueue; 